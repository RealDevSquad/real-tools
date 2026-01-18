import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  IconUpload,
  IconDownload,
  IconTrash,
  IconFileText,
  IconRefresh,
  IconEye
} from '@tabler/icons-react';
import { combinePDFs, removePagesFromPDF, extractPagesFromPDF, getPDFPageCount, addTextToPDF, type TextAnnotation } from '../../utils/pdfEditor';
import { PDFPreview } from './PDFPreview';

interface PDFFile {
  file: File;
  id: string;
  pageCount: number;
  selectedPages: number[];
  textAnnotations?: TextAnnotation[];
}

export const PDFEditor = () => {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'combine' | 'remove' | 'extract' | 'edit'>('combine');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewFile, setPreviewFile] = useState<PDFFile | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: PDFFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type === 'application/pdf') {
        try {
          const pageCount = await getPDFPageCount(file);
          newFiles.push({
            file,
            id: `pdf_${Date.now()}_${i}`,
            pageCount,
            selectedPages: [],
            textAnnotations: []
          });
        } catch (error) {
          console.error(`Failed to load PDF ${file.name}:`, error);
          alert(`Failed to load PDF: ${file.name}`);
        }
      }
    }

    setPdfFiles([...pdfFiles, ...newFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (id: string) => {
    setPdfFiles(pdfFiles.filter(f => f.id !== id));
  };

  const togglePageSelection = (fileId: string, pageNum: number) => {
    setPdfFiles(pdfFiles.map(f => {
      if (f.id === fileId) {
        const selected = f.selectedPages.includes(pageNum);
        return {
          ...f,
          selectedPages: selected
            ? f.selectedPages.filter(p => p !== pageNum)
            : [...f.selectedPages, pageNum].sort((a, b) => a - b)
        };
      }
      return f;
    }));
  };

  const selectAllPages = (fileId: string) => {
    setPdfFiles(pdfFiles.map(f => {
      if (f.id === fileId) {
        return {
          ...f,
          selectedPages: Array.from({ length: f.pageCount }, (_, i) => i + 1)
        };
      }
      return f;
    }));
  };

  const clearSelection = (fileId: string) => {
    setPdfFiles(pdfFiles.map(f => {
      if (f.id === fileId) {
        return { ...f, selectedPages: [] };
      }
      return f;
    }));
  };

  const handleCombine = async () => {
    if (pdfFiles.length < 2) {
      alert('Please upload at least 2 PDF files to combine');
      return;
    }

    setLoading(true);
    try {
      const files = pdfFiles.map(f => f.file);
      const combinedBlob = await combinePDFs(files);
      const url = URL.createObjectURL(combinedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'combined.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to combine PDFs', error);
      alert('Failed to combine PDFs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePages = async () => {
    if (pdfFiles.length === 0) {
      alert('Please upload a PDF file');
      return;
    }

    const fileToProcess = pdfFiles[0];
    if (fileToProcess.selectedPages.length === 0) {
      alert('Please select pages to remove');
      return;
    }

    setLoading(true);
    try {
      const resultBlob = await removePagesFromPDF(fileToProcess.file, fileToProcess.selectedPages);
      const url = URL.createObjectURL(resultBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileToProcess.file.name.replace('.pdf', '_edited.pdf');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to remove pages', error);
      alert('Failed to remove pages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExtractPages = async () => {
    if (pdfFiles.length === 0) {
      alert('Please upload a PDF file');
      return;
    }

    const fileToProcess = pdfFiles[0];
    if (fileToProcess.selectedPages.length === 0) {
      alert('Please select pages to extract');
      return;
    }

    setLoading(true);
    try {
      const resultBlob = await extractPagesFromPDF(fileToProcess.file, fileToProcess.selectedPages);
      const url = URL.createObjectURL(resultBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileToProcess.file.name.replace('.pdf', '_extracted.pdf');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to extract pages', error);
      alert('Failed to extract pages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditText = async () => {
    if (pdfFiles.length === 0) {
      alert('Please upload a PDF file');
      return;
    }

    const fileToProcess = pdfFiles[0];
    if (!fileToProcess.textAnnotations || fileToProcess.textAnnotations.length === 0) {
      alert('Please add at least one text annotation');
      return;
    }

    setLoading(true);
    try {
      const resultBlob = await addTextToPDF(fileToProcess.file, fileToProcess.textAnnotations);
      const url = URL.createObjectURL(resultBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileToProcess.file.name.replace('.pdf', '_edited.pdf');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to edit PDF', error);
      alert('Failed to edit PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeTextAnnotation = (fileId: string, index: number) => {
    setPdfFiles(pdfFiles.map(f => {
      if (f.id === fileId) {
        const annotations = f.textAnnotations || [];
        return {
          ...f,
          textAnnotations: annotations.filter((_, i) => i !== index)
        };
      }
      return f;
    }));
  };

  const reset = () => {
    setPdfFiles([]);
    setMode('combine');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-5xl mx-auto space-y-8"
    >
      <div className="apple-card p-10 bg-secondary/20 border-border/40">
        {/* Apple Style Segmented Control */}
        <div className="mb-10">
          <h3 className="text-[22px] font-bold tracking-tight text-foreground mb-6">PDF Master</h3>
          <div className="inline-flex p-1 bg-foreground/5 rounded-2xl w-full sm:w-auto">
            {[
              { id: 'combine', label: 'Combine' },
              { id: 'remove', label: 'Remove' },
              { id: 'extract', label: 'Extract' },
              { id: 'edit', label: 'Annotate' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setMode(item.id as any)}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-[14px] font-bold transition-all cursor-pointer ${mode === item.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-foreground/40 hover:text-foreground/60'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Zone */}
        <div className="mb-8">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            multiple={mode === 'combine'}
            onChange={handleFileSelect}
            className="hidden"
            id="pdf-upload-input"
          />
          <label
            htmlFor="pdf-upload-input"
            className="group flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border/30 rounded-[2rem] bg-foreground/[0.02] cursor-pointer hover:bg-foreground/[0.04] hover:border-foreground/20 transition-all active:scale-[0.99]"
          >
            <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <IconUpload className="w-6 h-6 text-foreground/40 group-hover:text-foreground/80 transition-colors" />
            </div>
            <span className="text-[15px] font-bold text-foreground/80">
              {mode === 'combine' ? 'Add PDF Files' : 'Select PDF Document'}
            </span>
            <span className="text-[13px] text-foreground/40 font-medium mt-1">
              {mode === 'combine' ? 'Select multiple files to merge' : 'A4, Letter, or custom formats supported'}
            </span>
          </label>
        </div>

        {/* File List */}
        {pdfFiles.length > 0 && (
          <div className="space-y-3 mb-10">
            {pdfFiles.map((pdfFile) => (
              <div
                key={pdfFile.id}
                className="group apple-card p-5 bg-secondary/40 border-border/30 hover:border-foreground/10 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center shrink-0">
                      <IconFileText className="w-5 h-5 text-foreground/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-bold text-foreground truncate">{pdfFile.file.name}</p>
                      <p className="text-[12px] text-foreground/40 font-black uppercase tracking-widest">
                        {pdfFile.pageCount} {pdfFile.pageCount === 1 ? 'PAGE' : 'PAGES'} • {(pdfFile.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {(mode === 'remove' || mode === 'extract' || mode === 'edit') && (
                      <button
                        onClick={() => setPreviewFile(pdfFile)}
                        className="p-2 text-foreground/40 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-all cursor-pointer"
                        title="Quick View"
                      >
                        <IconEye size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => removeFile(pdfFile.id)}
                      className="p-2 text-foreground/40 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all cursor-pointer"
                    >
                      <IconTrash size={18} />
                    </button>
                  </div>
                </div>

                {/* Extended Selection View */}
                {(mode === 'remove' || mode === 'extract') && pdfFiles[0].id === pdfFile.id && (
                  <div className="mt-6 pt-6 border-t border-border/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[13px] font-black uppercase tracking-[0.1em] text-foreground/40">
                        {mode === 'remove' ? 'Discard Pages' : 'Keep Pages'}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => selectAllPages(pdfFile.id)}
                          className="text-[11px] font-black uppercase tracking-widest px-3 py-1.5 bg-foreground/5 hover:bg-foreground/10 rounded-lg text-foreground/60 transition-colors cursor-pointer"
                        >
                          All
                        </button>
                        <button
                          onClick={() => clearSelection(pdfFile.id)}
                          className="text-[11px] font-black uppercase tracking-widest px-3 py-1.5 bg-foreground/5 hover:bg-foreground/10 rounded-lg text-foreground/60 transition-colors cursor-pointer"
                        >
                          None
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto custom-scrollbar p-1">
                      {Array.from({ length: pdfFile.pageCount }, (_, i) => i + 1).map((pageNum) => {
                        const isSelected = pdfFile.selectedPages.includes(pageNum);
                        return (
                          <button
                            key={pageNum}
                            onClick={() => togglePageSelection(pdfFile.id, pageNum)}
                            className={`w-12 h-12 rounded-xl text-[14px] font-bold transition-all active:scale-90 cursor-pointer ${isSelected
                              ? 'bg-foreground text-background shadow-lg shadow-foreground/10'
                              : 'bg-foreground/[0.03] text-foreground/40 hover:bg-foreground/[0.08]'
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Global Actions */}
        {pdfFiles.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                if (mode === 'combine') handleCombine();
                else if (mode === 'remove') handleRemovePages();
                else if (mode === 'extract') handleExtractPages();
                else if (mode === 'edit') handleEditText();
              }}
              disabled={loading || (mode === 'combine' && pdfFiles.length < 2) || (mode !== 'combine' && pdfFiles[0]?.selectedPages.length === 0 && mode !== 'edit')}
              className="flex-1 h-16 bg-foreground text-background font-black rounded-2xl text-[16px] flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-xl shadow-foreground/5 cursor-pointer"
            >
              {loading ? (
                <IconRefresh className="animate-spin" size={20} />
              ) : (
                <>
                  <IconDownload size={20} />
                  {mode === 'combine' ? 'Merge & Save' : mode === 'remove' ? 'Update & Download' : mode === 'extract' ? 'Export Selected' : 'Finalize PDF'}
                </>
              )}
            </button>
            <button
              onClick={reset}
              className="px-8 h-16 bg-foreground/[0.03] text-foreground font-bold rounded-2xl text-[15px] hover:bg-foreground/[0.06] transition-all active:scale-[0.98] border border-border/20 cursor-pointer"
            >
              Reset
            </button>
          </div>
        )}

        {/* Empty State Instructions */}
        {pdfFiles.length === 0 && (
          <div className="text-center py-6 opacity-40">
            <p className="text-[13px] font-medium leading-relaxed">
              {mode === 'combine' && 'Merge two or more PDFs into a single professional document.'}
              {mode === 'remove' && 'Select specific pages to permanently remove from the document.'}
              {mode === 'extract' && 'Create a new PDF containing only the pages you select here.'}
              {mode === 'edit' && 'Add text overlays and annotations directly onto the PDF surface.'}
            </p>
          </div>
        )}
      </div>

      {/* Modern PDF Preview Wrapper */}
      {previewFile && (
        <PDFPreview
          file={previewFile.file}
          mode={mode}
          selectedPages={previewFile.selectedPages}
          textAnnotations={previewFile.textAnnotations || []}
          onPageSelect={(pageNum) => {
            togglePageSelection(previewFile.id, pageNum);
            setPreviewFile({
              ...previewFile,
              selectedPages: previewFile.selectedPages.includes(pageNum)
                ? previewFile.selectedPages.filter(p => p !== pageNum)
                : [...previewFile.selectedPages, pageNum].sort((a, b) => a - b)
            });
          }}
          onTextEdit={(page, x, y, text) => {
            if (text) {
              const newAnnotation: TextAnnotation = { page, text, x, y, fontSize: 12 };
              setPdfFiles(pdfFiles.map(f => {
                if (f.id === previewFile.id) {
                  return {
                    ...f,
                    textAnnotations: [...(f.textAnnotations || []), newAnnotation]
                  };
                }
                return f;
              }));
              setPreviewFile({
                ...previewFile,
                textAnnotations: [...(previewFile.textAnnotations || []), newAnnotation]
              });
            }
          }}
          onTextDelete={(index) => {
            removeTextAnnotation(previewFile.id, index);
            setPreviewFile({
              ...previewFile,
              textAnnotations: (previewFile.textAnnotations || []).filter((_, i) => i !== index)
            });
          }}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </motion.div>
  );
};
