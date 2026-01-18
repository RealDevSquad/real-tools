import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import JSZip from 'jszip';
import {
    IconPlus,
    IconX,
    IconShield,
    IconWand
} from '@tabler/icons-react';
import { FileUpload } from '../ui/file-upload';
import { removeMetadata, formatBytes } from '../../utils/imageProcessor';
import { Button } from '../ui/button';

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

export const MetadataRemover = () => {
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [, setError] = useState<string | null>(null);
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

        const timerPromise = new Promise(resolve => setTimeout(resolve, 600));

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
        processedFiles.forEach(f => URL.revokeObjectURL(f.previewUrl));
        setFiles([]);
        setProcessedFiles([]);
        setError(null);
        setViewMode('grid');
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-12 animate-apple-in">
            <AnimatePresence mode="wait">
                {files.length === 0 ? (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                    >
                        <div className="text-center mb-12">
                            <h1 className="text-5xl font-bold tracking-tight mb-4 text-foreground">Metadata</h1>
                            <p className="text-[17px] text-muted-foreground max-w-xl mx-auto font-medium">
                                Securely sanitize your photographs. All processing remains on your device.
                            </p>
                        </div>
                        <FileUpload onChange={handleFileSelect} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="interface"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pb-20"
                    >
                        {/* Apple Style Control Bar */}
                        <div className="lg:col-span-12 flex items-center justify-between p-2 bg-secondary/40 rounded-2xl border border-border/50">
                            <div className="flex items-center gap-4 ml-4">
                                <div className="p-2.5 bg-foreground rounded-xl text-background">
                                    <IconWand size={18} />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-[15px] text-foreground">{files.length} Items</h2>
                                </div>
                            </div>

                            <div className="flex bg-background/50 p-1 rounded-xl border border-border/40">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 px-3 rounded-lg text-xs font-bold transition-all ${viewMode === 'grid' ? 'bg-foreground text-background shadow-sm' : 'text-foreground/50 hover:bg-muted'}`}
                                >
                                    Grid
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 px-3 rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-foreground text-background shadow-sm' : 'text-foreground/50 hover:bg-muted'}`}
                                >
                                    List
                                </button>
                            </div>
                        </div>

                        {/* File Grid Area */}
                        <div className="lg:col-span-8">
                            <div className={`
                                ${viewMode === 'grid'
                                    ? 'grid grid-cols-2 md:grid-cols-3 gap-6'
                                    : 'flex flex-col gap-3'}
                            `}>
                                <AnimatePresence mode="popLayout">
                                    {files.map((fileObj, index) => (
                                        <motion.div
                                            key={fileObj.previewUrl}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className={`
                                                group relative apple-card overflow-hidden
                                                ${viewMode === 'grid' ? 'aspect-square' : 'flex items-center gap-4 p-3'}
                                            `}
                                        >
                                            {/* Preview Container */}
                                            <div className={`
                                                relative overflow-hidden bg-secondary/50
                                                ${viewMode === 'grid' ? 'h-full w-full' : 'w-16 h-16 rounded-xl shrink-0'}
                                            `}>
                                                <img
                                                    src={fileObj.previewUrl}
                                                    alt={fileObj.file.name}
                                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                                                />
                                                {viewMode === 'grid' && (
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                                                        <p className="text-white text-[10px] font-bold truncate uppercase tracking-widest">{fileObj.file.name}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details for List View */}
                                            {viewMode === 'list' && (
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm truncate text-foreground">{fileObj.file.name}</p>
                                                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-tighter mt-0.5">
                                                        {fileObj.file.type.split('/')[1] || 'img'} • {formatBytes(fileObj.file.size)}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Apple Style Close Button */}
                                            <button
                                                onClick={() => handleRemoveFile(index)}
                                                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60 active:scale-90"
                                            >
                                                <IconX size={14} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {/* Simple Add Button */}
                                <div
                                    onClick={handleAddMoreClick}
                                    className={`
                                        cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-border/60 rounded-3xl hover:bg-secondary/20 transition-all text-foreground/40 active:scale-[0.98]
                                        ${viewMode === 'grid' ? 'aspect-square' : 'h-16'}
                                    `}
                                >
                                    <IconPlus size={24} stroke={1.5} />
                                </div>
                                <input type="file" ref={addMoreInputRef} onChange={handleAddMoreChange} className="hidden" multiple accept="image/*" />
                            </div>
                        </div>

                        {/* Professional Action Panel */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="apple-glass rounded-3xl p-8 space-y-8">
                                <div>
                                    <h3 className="text-[20px] font-bold tracking-tight mb-2">Sanitization</h3>
                                    <p className="text-sm text-foreground/50 font-medium">Remove EXIF, location, and device headers.</p>
                                </div>

                                <div className="space-y-3">
                                    <Button
                                        className="w-full h-12 text-[15px] font-semibold"
                                        onClick={handleRemoveMetadata}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? 'Processing' : `Clean ${files.length} Items`}
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        className="w-full h-12 text-[15px]"
                                        onClick={handleReset}
                                        disabled={isProcessing}
                                    >
                                        Discard
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Apple Monochromatic Success Overlay */}
                {processedFiles.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-2xl p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.98, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-card w-full max-w-4xl max-h-full rounded-[2.5rem] shadow-2xl border border-border flex flex-col overflow-hidden"
                        >
                            <div className="p-10 text-center shrink-0">
                                <div className="w-20 h-20 bg-foreground text-background rounded-2xl flex items-center justify-center mx-auto mb-10 shadow-lg">
                                    <IconShield size={40} stroke={1.5} />
                                </div>
                                <h2 className="text-4xl font-bold tracking-tight mb-3">Sanitized</h2>
                                <p className="text-foreground/50 font-medium">Your privacy is now reinforced.</p>
                            </div>

                            <div className="flex-1 overflow-y-auto px-10 pb-10 custom-scrollbar">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {processedFiles.map((pf, i) => (
                                        <div key={i} className="group apple-card aspect-square relative overflow-hidden">
                                            <img src={pf.previewUrl} alt="Cleaned" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="secondary" size="sm" onClick={() => handleDownloadSingle(pf)} className="bg-white text-black rounded-lg">
                                                    Save
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-10 border-t border-border flex flex-col md:flex-row gap-4 justify-center">
                                {processedFiles.length > 1 && (
                                    <Button size="lg" onClick={handleDownloadAll} className="h-14 px-10 font-bold">
                                        Download Archive
                                    </Button>
                                )}
                                <Button variant="secondary" size="lg" onClick={handleReset} className="h-14 px-10 font-bold border border-border">
                                    Done
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
