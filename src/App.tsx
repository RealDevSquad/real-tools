import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import JSZip from 'jszip';
import {
  IconDownload,
  IconRefresh,
  IconLock,
  IconCircleCheck,
  IconShield,
  IconWand,
  IconEraser,
  IconTrash,
  IconArchive,
  IconPlus,
  IconX,
  IconLayoutGrid,
  IconList,
  IconBrandX,
  IconHeart,
  IconFileText,
  IconPhoto,
  IconFile,
  IconCode
} from '@tabler/icons-react';
import { FileUpload } from './components/ui/file-upload';
import { FormBuilder } from './components/FormBuilder/FormBuilder';
import { PDFEditor } from './components/PDFEditor/PDFEditor';
import { ImageCompressor } from './components/ImageCompressor/ImageCompressor';
import { FileConverter } from './components/FileConverter/FileConverter';
import { JSONFormatter } from './components/JSONFormatter/JSONFormatter';
import { removeMetadata, formatBytes } from './utils/imageProcessor';
import { Button } from './components/ui/stateful-button';

interface ProcessedFile {
  original: File;
  cleanedBlob: Blob;
  status: 'pending' | 'cleaning' | 'done' | 'error';
  previewUrl: string;
}

interface FileWithPreview {
  file: File;
  previewUrl: string;
}

function MetadataRemover() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const addMoreInputRef = useRef<HTMLInputElement>(null);

  // Clean up preview URLs when component unmounts or files change
  useEffect(() => {
    return () => {
      files.forEach(f => URL.revokeObjectURL(f.previewUrl));
      processedFiles.forEach(pf => URL.revokeObjectURL(pf.previewUrl));
    };
  }, [files, processedFiles]);

  const createPreview = (file: File) => ({
    file,
    previewUrl: URL.createObjectURL(file)
  });

  const handleFileSelect = (selectedFiles: File[]) => {
    const newFiles = selectedFiles.map(createPreview);
    // Since FileUpload is only shown when files is empty, we can safely replace the state.
    // This also prevents duplication if the handler is called twice (e.g. StrictMode side-effects).
    setFiles(newFiles);
    setError(null);
  };

  const handleRemoveFile = (index: number) => {
    const fileToRemove = files[index];
    URL.revokeObjectURL(fileToRemove.previewUrl);
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleAddMoreClick = () => {
    addMoreInputRef.current?.click();
  };

  const handleAddMoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
        .filter(f => f.type.startsWith('image/'))
        .map(createPreview);
      setFiles(prev => [...prev, ...newFiles]);
    }
    // Reset input
    if (addMoreInputRef.current) addMoreInputRef.current.value = '';
  };

  const handleRemoveMetadata = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setError(null);
    const newProcessedFiles: ProcessedFile[] = [];

    // Enforce minimum 2 second delay for UX
    const timerPromise = new Promise(resolve => setTimeout(resolve, 2000));

    // Process logic
    const processingPromise = (async () => {
      for (const { file } of files) {
        try {
          const blob = await removeMetadata(file);
          newProcessedFiles.push({
            original: file,
            cleanedBlob: blob,
            status: 'done',
            previewUrl: URL.createObjectURL(blob)
          });
        } catch (err) {
          console.error(`Failed to process ${file.name}`, err);
        }
      }
    })();

    try {
      await Promise.all([processingPromise, timerPromise]);
      setProcessedFiles(newProcessedFiles);
    } catch (err) {
      console.error(err);
      setError('Failed to process some files. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadSingle = (pf: ProcessedFile) => {
    const url = URL.createObjectURL(pf.cleanedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clean_${pf.original.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = async () => {
    if (processedFiles.length === 0) return;

    const zip = new JSZip();
    processedFiles.forEach(pf => {
      zip.file(`clean_${pf.original.name}`, pf.cleanedBlob);
    });

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = "clean_images.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    files.forEach(f => URL.revokeObjectURL(f.previewUrl));
    processedFiles.forEach(pf => URL.revokeObjectURL(pf.previewUrl));
    setFiles([]);
    setProcessedFiles([]);
    setError(null);
  };

  return (
    <div className="w-full relative z-10">
      <AnimatePresence mode="popLayout">
        {error && (
          <motion.div
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 w-full max-w-md p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl text-center shadow-lg"
          >
            {error}
          </motion.div>
        )}

        {/* Upload State */}
        {files.length === 0 && processedFiles.length === 0 && (
          <motion.div
            key="uploader"
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full flex justify-center"
          >
            <FileUpload onChange={handleFileSelect} isProcessing={isProcessing} />
          </motion.div>
        )}

        {/* Review & Process State */}
        {files.length > 0 && processedFiles.length === 0 && (
          <motion.div
            key="review"
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-3xl mx-auto"
          >
            <div className="glass-panel p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Review Files</h3>
                  <p className="text-sm text-muted-foreground mt-1">Ready to strip metadata.</p>
                </div>
                <div className="flex items-center gap-2">
                  {/* View Toggles */}
                  <div className="flex p-1 bg-secondary/50 rounded-lg border border-border/50">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                      title="Grid View"
                    >
                      <IconLayoutGrid size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                      title="List View"
                    >
                      <IconList size={16} />
                    </button>
                  </div>

                  <div className="w-px h-6 bg-border/50 mx-2"></div>

                  <button onClick={handleReset} className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1 font-medium transition-colors">
                    <IconTrash size={16} /> Clear List
                  </button>
                </div>
              </div>

              <div className="mb-8 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {files.map((item, idx) => (
                      <div key={idx} className="group relative aspect-square rounded-2xl bg-secondary/30 border border-border/50 overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <img src={item.previewUrl} alt={item.file.name} className="w-full h-full object-cover" />

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Info on Hover */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                          <p className="text-xs text-white font-medium truncate">{item.file.name}</p>
                          <p className="text-[10px] text-white/70">{formatBytes(item.file.size)}</p>
                        </div>

                        {/* Delete Button on Hover */}
                        <button
                          onClick={() => handleRemoveFile(idx)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-red-600 shadow-lg"
                          title="Remove File"
                        >
                          <IconX size={14} />
                        </button>
                      </div>
                    ))}

                    {/* Add More Button (Grid) */}
                    <button
                      onClick={handleAddMoreClick}
                      className="aspect-square rounded-2xl border-2 border-dashed border-border/60 hover:border-primary/50 hover:bg-primary/5 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full bg-secondary group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                        <IconPlus size={20} />
                      </div>
                      <span className="text-xs font-semibold">Add More</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {files.map((item, idx) => (
                      <div key={idx} className="group flex items-center gap-4 p-3 rounded-xl bg-secondary/20 border border-border/50 hover:border-border transition-all">
                        <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0 border border-border/50">
                          <img src={item.previewUrl} className="w-full h-full object-cover" alt="thumb" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{item.file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatBytes(item.file.size)}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(idx)}
                          className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                          title="Remove"
                        >
                          <IconX size={18} />
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={handleAddMoreClick}
                      className="w-full py-3 rounded-xl border-2 border-dashed border-border/60 hover:border-primary/50 hover:bg-primary/5 flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-all"
                    >
                      <IconPlus size={16} />
                      <span className="text-sm font-semibold">Add More Files</span>
                    </button>
                  </div>
                )}

                <input
                  type="file"
                  ref={addMoreInputRef}
                  onChange={handleAddMoreChange}
                  className="hidden"
                  multiple
                  accept="image/*"
                />
              </div>

              <div className="flex flex-col gap-4">
                <Button onClick={handleRemoveMetadata} className="w-full py-6 text-lg shadow-lg shadow-primary/20">
                  <IconEraser className="mr-2 w-5 h-5" /> Remove Metadata
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Processing happens locally. No data leaves your device.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results State */}
        {processedFiles.length > 0 && (
          <motion.div
            key="results"
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-5xl mx-auto"
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-full ring-1 ring-emerald-500/20 mb-4">
                <IconCircleCheck className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">Processing Complete!</h3>
              <p className="text-muted-foreground mt-2 text-lg">
                Cleaned {processedFiles.length} {processedFiles.length === 1 ? 'file' : 'files'} successfully.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-10">
              {processedFiles.map((pf, idx) => (
                <div key={idx} className="group relative aspect-square rounded-2xl bg-card border border-border overflow-hidden shadow-lg hover:shadow-xl transition-all">
                  <img src={pf.previewUrl} className="w-full h-full object-cover" alt="cleaned" />

                  {/* Success Badge */}
                  <div className="absolute top-3 left-3 px-2 py-1 bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase rounded-md shadow-sm">
                    Cleaned
                  </div>

                  {/* Overlay & Download */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                    <button
                      onClick={() => handleDownloadSingle(pf)}
                      className="px-4 py-2 bg-white text-black rounded-xl font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-all hover:scale-105 flex items-center gap-2"
                    >
                      <IconDownload size={16} /> Download
                    </button>
                    <div className="text-center px-2 transform translate-y-4 group-hover:translate-y-0 transition-all delay-75">
                      <p className="text-white text-xs font-medium truncate w-32">{pf.original.name}</p>
                      <p className="text-white/60 text-[10px]">{formatBytes(pf.cleanedBlob.size)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {processedFiles.length > 1 && (
                <button
                  onClick={handleDownloadAll}
                  className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground text-sm font-bold uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/25 active:scale-[0.98]"
                >
                  <IconArchive size={20} /> Download All (ZIP)
                </button>
              )}
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-8 py-4 bg-muted/50 text-foreground text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 hover:bg-muted/80 transition-all border border-transparent hover:border-border"
              >
                <IconRefresh size={18} /> Process More
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'builder' | 'editor' | 'compressor' | 'converter' | 'json-formatter'>('home');

  return (
    <div className="min-h-screen flex flex-col items-center py-12 md:py-20 px-4 relative overflow-hidden selection:bg-primary/30 font-sans">
      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 relative z-10 w-full max-w-4xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted border border-border text-xs font-semibold text-primary mb-8 backdrop-blur-md shadow-sm">
          <IconShield size={14} className="stroke-[2.5]" />
          <span>Privacy & Productivity Tools</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-foreground leading-[1.1]">
          Privacy <span className="text-primary">Tools</span>
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto mb-12">
          All-in-one privacy and productivity tools. Process files locally in your browser—your data never leaves your device.
        </p>

        {/* Feature Cards - Compact & Scalable Design */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-10 max-w-7xl mx-auto w-full">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => setActiveTab('home')}
            className="group relative p-5 md:p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] text-left"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 md:p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconEraser size={28} className="text-primary" />
              </div>
              <div className="w-full">
                <h3 className="font-bold text-sm md:text-base text-foreground mb-1">Metadata Cleaner</h3>
                <p className="text-xs text-muted-foreground leading-snug">
                  Remove EXIF, XMP, IPTC data
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => setActiveTab('builder')}
            className="group relative p-5 md:p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] text-left"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 md:p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconWand size={28} className="text-primary" />
              </div>
              <div className="w-full">
                <h3 className="font-bold text-sm md:text-base text-foreground mb-1">Form Builder</h3>
                <p className="text-xs text-muted-foreground leading-snug">
                  Create interactive PDF forms
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => setActiveTab('editor')}
            className="group relative p-5 md:p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] text-left"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 md:p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconFileText size={28} className="text-primary" />
              </div>
              <div className="w-full">
                <h3 className="font-bold text-sm md:text-base text-foreground mb-1">PDF Editor</h3>
                <p className="text-xs text-muted-foreground leading-snug">
                  Combine, edit, extract pages
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => setActiveTab('compressor')}
            className="group relative p-5 md:p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] text-left"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 md:p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconPhoto size={28} className="text-primary" />
              </div>
              <div className="w-full">
                <h3 className="font-bold text-sm md:text-base text-foreground mb-1">Image Compressor</h3>
                <p className="text-xs text-muted-foreground leading-snug">
                  Resize & compress images
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => setActiveTab('converter')}
            className="group relative p-5 md:p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] text-left"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 md:p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconFile size={28} className="text-primary" />
              </div>
              <div className="w-full">
                <h3 className="font-bold text-sm md:text-base text-foreground mb-1">File Converter</h3>
                <p className="text-xs text-muted-foreground leading-snug">
                  PDF, DOCX & EPUB conversion
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={() => setActiveTab('json-formatter')}
            className="group relative p-5 md:p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] text-left"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 md:p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconCode size={28} className="text-primary" />
              </div>
              <div className="w-full">
                <h3 className="font-bold text-sm md:text-base text-foreground mb-1">JSON Formatter</h3>
                <p className="text-xs text-muted-foreground leading-snug">
                  Format, validate & minify
                </p>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Tab Navigation */}
        <div className="inline-flex p-1.5 bg-muted/50 rounded-2xl border border-border/50 backdrop-blur-sm shadow-sm">
          <button
            onClick={() => setActiveTab('home')}
            className={`
                            relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
                            ${activeTab === 'home' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}
                        `}
          >
            {activeTab === 'home' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/20"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <IconEraser size={16} /> Metadata Cleaner
            </span>
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            className={`
                            relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
                            ${activeTab === 'builder' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}
                        `}
          >
            {activeTab === 'builder' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/20"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <IconWand size={16} /> Form Builder
            </span>
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`
                            relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
                            ${activeTab === 'editor' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}
                        `}
          >
            {activeTab === 'editor' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/20"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <IconFileText size={16} /> PDF Editor
            </span>
          </button>
          <button
            onClick={() => setActiveTab('compressor')}
            className={`
                            relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
                            ${activeTab === 'compressor' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}
                        `}
          >
            {activeTab === 'compressor' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/20"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <IconPhoto size={16} /> Image Compressor
            </span>
          </button>
          <button
            onClick={() => setActiveTab('converter')}
            className={`
                            relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
                            ${activeTab === 'converter' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}
                        `}
          >
            {activeTab === 'converter' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/20"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <IconFile size={16} /> File Converter
            </span>
          </button>
          <button
            onClick={() => setActiveTab('json-formatter')}
            className={`
                            relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
                            ${activeTab === 'json-formatter' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}
                        `}
          >
            {activeTab === 'json-formatter' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/20"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <IconCode size={16} /> JSON Formatter
            </span>
          </button>
        </div>
      </motion.div>

      <div className="w-full relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MetadataRemover />
            </motion.div>
          ) : activeTab === 'builder' ? (
            <motion.div
              key="builder"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <FormBuilder />
            </motion.div>
          ) : activeTab === 'editor' ? (
            <motion.div
              key="editor"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <PDFEditor />
            </motion.div>
          ) : activeTab === 'compressor' ? (
            <motion.div
              key="compressor"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ImageCompressor />
            </motion.div>
          ) : activeTab === 'converter' ? (
            <motion.div
              key="converter"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <FileConverter />
            </motion.div>
          ) : (
            <motion.div
              key="json-formatter"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <JSONFormatter />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="mt-auto pt-20 pb-6 text-muted-foreground/40 text-xs">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 font-medium tracking-wide">
            <IconLock size={12} />
            <span>SECURE LOCAL PROCESSING • ZERO SERVER UPLOADS</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground/50 flex-wrap justify-center">
            <span>Made with</span>
            <IconHeart size={12} className="text-red-500 fill-red-500" />
            <span>by</span>
            <a 
              href="https://x.com/twts_tejas" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1.5 text-muted-foreground/60"
            >
              <IconBrandX size={14} />
              <span>Tejas</span>
            </a>
            <span>,</span>
            <a 
              href="https://x.com/whoavidwivedi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1.5 text-muted-foreground/60"
            >
              <IconBrandX size={14} />
              <span>Avi</span>
            </a>
            <span>,</span>
            <a 
              href="https://x.com/dhirender_0001" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1.5 text-muted-foreground/60"
            >
              <IconBrandX size={14} />
              <span>Dhirender</span>
            </a>
            <span>&</span>
            <a 
              href="https://x.com/Scalar_skeleton" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1.5 text-muted-foreground/60"
            >
              <IconBrandX size={14} />
              <span>Scalar</span>
            </a>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground/50">
            <span>Sponsored by</span>
            <a 
              href="https://welcome.realdevsquad.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors font-medium"
            >
              Real Dev Squad
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}