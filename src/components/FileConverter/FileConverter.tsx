import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconDownload,
  IconFileText,
  IconFile,
  IconRefresh,
} from '@tabler/icons-react';
import { convertPDFToDOCX, convertDOCXToPDF, convertEPUBToPDF, convertPDFToEPUB, downloadFile } from '../../utils/fileConverter';
import { Button } from '../ui/stateful-button';
import { FileUpload } from '../ui/file-upload';
import { formatBytes } from '../../utils/imageProcessor';

type ConversionType = 'pdf-to-docx' | 'docx-to-pdf' | 'epub-to-pdf' | 'pdf-to-epub';

interface ConvertedFile {
  original: File;
  converted: Blob;
  originalSize: number;
  convertedSize: number;
  type: ConversionType;
}

export const FileConverter = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversionType, setConversionType] = useState<ConversionType>('pdf-to-docx');

  const handleFileSelect = (selectedFiles: File[]) => {
    // Filter files based on conversion type
    const validFiles = selectedFiles.filter(file => {
      if (conversionType === 'pdf-to-docx' || conversionType === 'pdf-to-epub') {
        return file.type === 'application/pdf';
      } else if (conversionType === 'docx-to-pdf') {
        return file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
               file.name.toLowerCase().endsWith('.docx');
      } else if (conversionType === 'epub-to-pdf') {
        return file.type === 'application/epub+zip' ||
               file.name.toLowerCase().endsWith('.epub');
      }
      return false;
    });

    if (validFiles.length === 0 && selectedFiles.length > 0) {
      const fileType = conversionType === 'pdf-to-docx' || conversionType === 'pdf-to-epub' ? 'PDF' : 
                      conversionType === 'docx-to-pdf' ? 'DOCX' : 'EPUB';
      setError(`Please select ${fileType} files only`);
      return;
    }

    // FileUpload component accumulates files internally and passes the full accumulated list
    // So we should replace files instead of appending to avoid duplicates
    // Also remove duplicates by creating a Map keyed by name+size+lastModified
    const uniqueFiles = new Map<string, File>();
    validFiles.forEach(file => {
      const key = `${file.name}-${file.size}-${file.lastModified}`;
      if (!uniqueFiles.has(key)) {
        uniqueFiles.set(key, file);
      }
    });
    
    setFiles(Array.from(uniqueFiles.values()));
    setError(null);
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      setError('Please upload at least one file');
      return;
    }

    setLoading(true);
    setError(null);
    const newConverted: ConvertedFile[] = [];

    try {
      for (const file of files) {
        let convertedBlob: Blob;
        
        if (conversionType === 'pdf-to-docx') {
          convertedBlob = await convertPDFToDOCX(file);
        } else if (conversionType === 'docx-to-pdf') {
          convertedBlob = await convertDOCXToPDF(file);
        } else if (conversionType === 'epub-to-pdf') {
          convertedBlob = await convertEPUBToPDF(file);
        } else {
          convertedBlob = await convertPDFToEPUB(file);
        }

        newConverted.push({
          original: file,
          converted: convertedBlob,
          originalSize: file.size,
          convertedSize: convertedBlob.size,
          type: conversionType,
        });
      }

      setConvertedFiles(newConverted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert files');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (converted: ConvertedFile) => {
    let extension: string;
    if (converted.type === 'pdf-to-docx') {
      extension = 'docx';
    } else if (converted.type === 'pdf-to-epub') {
      extension = 'epub';
    } else {
      extension = 'pdf';
    }
    const filename = `${converted.original.name.replace(/\.[^/.]+$/, '')}.${extension}`;
    downloadFile(converted.converted, filename);
  };


  const handleDownloadAll = () => {
    convertedFiles.forEach((converted, index) => {
      setTimeout(() => {
        handleDownload(converted);
      }, index * 100);
    });
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setFiles([]);
    setConvertedFiles([]);
    setError(null);
  };

  const handleConversionTypeChange = (type: ConversionType) => {
    setConversionType(type);
    setFiles([]);
    setConvertedFiles([]);
    setError(null);
  };

  const getCompressionRatio = (original: number, converted: number) => {
    const ratio = ((1 - converted / original) * 100).toFixed(1);
    return ratio.startsWith('-') ? ratio : `+${ratio}`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Conversion Type Selector */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <IconFileText className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Conversion Type</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => handleConversionTypeChange('pdf-to-docx')}
              className={`px-4 py-3 rounded-xl border-2 transition-all ${
                conversionType === 'pdf-to-docx'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-muted-foreground hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <IconFile className="w-5 h-5" />
                <span className="font-semibold text-sm">PDF → DOCX</span>
              </div>
            </button>
            <button
              onClick={() => handleConversionTypeChange('docx-to-pdf')}
              className={`px-4 py-3 rounded-xl border-2 transition-all ${
                conversionType === 'docx-to-pdf'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-muted-foreground hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <IconFileText className="w-5 h-5" />
                <span className="font-semibold text-sm">DOCX → PDF</span>
              </div>
            </button>
            <button
              onClick={() => handleConversionTypeChange('epub-to-pdf')}
              className={`px-4 py-3 rounded-xl border-2 transition-all ${
                conversionType === 'epub-to-pdf'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-muted-foreground hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <IconFileText className="w-5 h-5" />
                <span className="font-semibold text-sm">EPUB → PDF</span>
              </div>
            </button>
            <button
              onClick={() => handleConversionTypeChange('pdf-to-epub')}
              className={`px-4 py-3 rounded-xl border-2 transition-all ${
                conversionType === 'pdf-to-epub'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-muted-foreground hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <IconFileText className="w-5 h-5" />
                <span className="font-semibold text-sm">PDF → EPUB</span>
              </div>
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            {conversionType === 'pdf-to-docx' 
              ? 'Note: PDF to DOCX conversion extracts text content. Complex formatting, images, and layouts may not be fully preserved.'
              : conversionType === 'docx-to-pdf'
              ? 'Note: DOCX to PDF conversion preserves text and basic formatting. Complex layouts may vary.'
              : conversionType === 'epub-to-pdf'
              ? 'Note: EPUB to PDF conversion extracts text content from EPUB files. Complex formatting, images, and styles may not be fully preserved.'
              : 'Note: PDF to EPUB conversion extracts text content from PDF files. Complex formatting, images, and layouts may not be fully preserved.'}
          </p>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* File Upload */}
        <AnimatePresence mode="wait">
          {files.length === 0 && convertedFiles.length === 0 && (
            <motion.div
              key="uploader"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full flex justify-center"
            >
              <FileUpload 
                onChange={handleFileSelect} 
                isProcessing={loading}
                accept={
                  conversionType === 'pdf-to-docx' || conversionType === 'pdf-to-epub'
                    ? 'application/pdf' 
                    : conversionType === 'docx-to-pdf'
                    ? '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    : '.epub,application/epub+zip'
                }
                filterFiles={(files) => files.filter(file => {
                  if (conversionType === 'pdf-to-docx' || conversionType === 'pdf-to-epub') {
                    return file.type === 'application/pdf';
                  } else if (conversionType === 'docx-to-pdf') {
                    return file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                           file.name.toLowerCase().endsWith('.docx');
                  } else {
                    return file.type === 'application/epub+zip' ||
                           file.name.toLowerCase().endsWith('.epub');
                  }
                })}
              />
            </motion.div>
          )}

          {files.length > 0 && convertedFiles.length === 0 && (
            <motion.div
              key="file-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Selected Files ({files.length})
                </h3>
                <button
                  onClick={handleClearAll}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-2 mb-6">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <IconFileText className="w-5 h-5 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <IconRefresh className="w-4 h-4 text-destructive rotate-45" />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleConvert}
                disabled={files.length === 0 || loading}
                className="w-full"
              >
                {loading ? 'Converting...' : `Convert to ${
                  conversionType === 'pdf-to-docx' ? 'DOCX' : 
                  conversionType === 'pdf-to-epub' ? 'EPUB' : 
                  'PDF'
                }`}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {convertedFiles.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Converted Files</h2>
              <button
                onClick={handleDownloadAll}
                className="px-4 py-2 bg-muted hover:bg-muted/80 border border-border rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <IconDownload className="w-4 h-4" />
                Download All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {convertedFiles.map((converted, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-card/50 backdrop-blur-sm border border-border rounded-xl overflow-hidden"
                >
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconFileText className="w-5 h-5 text-primary" />
                        <p className="text-sm font-medium truncate flex-1">
                          {converted.original.name}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDownload(converted)}
                        className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <IconDownload className="w-4 h-4 text-primary" />
                      </button>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Original:</span>
                        <span className="font-medium">{formatBytes(converted.originalSize)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Converted:</span>
                        <span className="font-medium text-primary">
                          {formatBytes(converted.convertedSize)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-border">
                        <span className="text-muted-foreground">Size change:</span>
                        <span className={`font-medium ${
                          parseFloat(getCompressionRatio(converted.originalSize, converted.convertedSize)) < 0
                            ? 'text-emerald-500'
                            : 'text-orange-500'
                        }`}>
                          {getCompressionRatio(converted.originalSize, converted.convertedSize)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={handleClearAll}
                className="px-6 py-2 bg-muted/50 hover:bg-muted/80 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <IconRefresh className="w-4 h-4" />
                Convert More Files
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
