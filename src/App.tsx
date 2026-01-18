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
  IconCode,
  IconArrowsExchange,
  IconGitCompare,
  IconKey,
  IconQrcode,
  IconHash,
  IconMarkdown,
  IconTypography,
  IconCalculator,
  IconPlayerPlay,
  IconLink,
  IconEyeOff,
  IconWorld,
  IconSpeakerphone,
  IconClock,
  IconRadio,
  IconDice,
  IconDeviceDesktop,
  IconClipboard,
  IconBarcode,
  IconCrop,
  IconPalette,
  IconMail,
  IconBinaryTree,
  IconChartBar,
  IconNotes,
} from '@tabler/icons-react';
import { FileUpload } from './components/ui/file-upload';
import { FormBuilder } from './components/FormBuilder/FormBuilder';
import { PDFEditor } from './components/PDFEditor/PDFEditor';
import { ImageCompressor } from './components/ImageCompressor/ImageCompressor';
import { FileConverter } from './components/FileConverter/FileConverter';
import { JSONFormatter } from './components/JSONFormatter/JSONFormatter';
import { XMLJSONConverter } from './components/XMLJSONConverter/XMLJSONConverter';
import { TextDiff } from './components/TextDiff/TextDiff';
import { PasswordGenerator } from './components/PasswordGenerator/PasswordGenerator';
import { QRCode } from './components/QRCode/QRCode';
import { Base64 } from './components/Base64/Base64';
import { HashGenerator } from './components/HashGenerator/HashGenerator';
import { CSVJSONConverter } from './components/CSVJSONConverter/CSVJSONConverter';
import { MarkdownEditor } from './components/MarkdownEditor/MarkdownEditor';
import { TextUtilities } from './components/TextUtilities/TextUtilities';
import { YAMLFormatter } from './components/YAMLFormatter/YAMLFormatter';
import { HTMLCSSFormatter } from './components/HTMLCSSFormatter/HTMLCSSFormatter';
import { UUIDGenerator } from './components/UUIDGenerator/UUIDGenerator';
import { Calculator } from './components/Calculator/Calculator';
import { Stopwatch } from './components/Stopwatch/Stopwatch';
import { JWTDecoder } from './components/JWTDecoder/JWTDecoder';
import { URLEncoder } from './components/URLEncoder/URLEncoder';
import { PasswordStrength } from './components/PasswordStrength/PasswordStrength';
import { DataMasking } from './components/DataMasking/DataMasking';
import { RegexTester } from './components/RegexTester/RegexTester';
import { JSONToTypeScript } from './components/JSONToTypeScript/JSONToTypeScript';
import { ColorPicker } from './components/ColorPicker/ColorPicker';
import { APIBuilder } from './components/APIBuilder/APIBuilder';
import { CodeMinifier } from './components/CodeMinifier/CodeMinifier';
import { LoremIpsum } from './components/LoremIpsum/LoremIpsum';
import { TextToSpeech } from './components/TextToSpeech/TextToSpeech';
import { ImageFormatConverter } from './components/ImageFormatConverter/ImageFormatConverter';
import { QRCodeReader } from './components/QRCodeReader/QRCodeReader';
import { ImageCropper } from './components/ImageCropper/ImageCropper';
import { UnitConverter } from './components/UnitConverter/UnitConverter';
import { DateTimeConverter } from './components/DateTimeConverter/DateTimeConverter';
import { NumberBaseConverter } from './components/NumberBaseConverter/NumberBaseConverter';
import { MorseCode } from './components/MorseCode/MorseCode';
import { RomanNumeral } from './components/RomanNumeral/RomanNumeral';
import { BarcodeGenerator } from './components/BarcodeGenerator/BarcodeGenerator';
import { RandomData } from './components/RandomData/RandomData';
import { BrowserInfo } from './components/BrowserInfo/BrowserInfo';
import { ClipboardHistory } from './components/ClipboardHistory/ClipboardHistory';
import { ColorPalette } from './components/ColorPalette/ColorPalette';
import { IPAddressTools } from './components/IPAddressTools/IPAddressTools';
import { EmailValidator } from './components/EmailValidator/EmailValidator';
import { FileHashChecker } from './components/FileHashChecker/FileHashChecker';
import { TwoFactorAuth } from './components/TwoFactorAuth/TwoFactorAuth';
import { GraphQLFormatter } from './components/GraphQLFormatter/GraphQLFormatter';
import { CurlGenerator } from './components/CurlGenerator/CurlGenerator';
import { SQLFormatter } from './components/SQLFormatter/SQLFormatter';
import { JSONPathFinder } from './components/JSONPathFinder/JSONPathFinder';
import { XMLValidator } from './components/XMLValidator/XMLValidator';
import { HTTPStatusLookup } from './components/HTTPStatusLookup/HTTPStatusLookup';
import { TextEncryption } from './components/TextEncryption/TextEncryption';
import { CSVTableViewer } from './components/CSVTableViewer/CSVTableViewer';
import { JSONTreeViewer } from './components/JSONTreeViewer/JSONTreeViewer';
import { DataStatistics } from './components/DataStatistics/DataStatistics';
import { Notes } from './components/Notes/Notes';
import { ImageWatermark } from './components/ImageWatermark/ImageWatermark';
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
                      className={`p-1.5 rounded-md transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                      title="Grid View"
                    >
                      <IconLayoutGrid size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-md transition-all cursor-pointer ${viewMode === 'list' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
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
                          className="absolute top-2 right-2 p-1.5 bg-red-500/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-red-600 shadow-lg cursor-pointer"
                          title="Remove File"
                        >
                          <IconX size={14} />
                        </button>
                      </div>
                    ))}

                    {/* Add More Button (Grid) */}
                    <button
                      onClick={handleAddMoreClick}
                      className="aspect-square rounded-2xl border-2 border-dashed border-border/60 hover:border-primary/50 hover:bg-primary/5 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-all group cursor-pointer"
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
                          className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                          title="Remove"
                        >
                          <IconX size={18} />
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={handleAddMoreClick}
                      className="w-full py-3 rounded-xl border-2 border-dashed border-border/60 hover:border-primary/50 hover:bg-primary/5 flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-all cursor-pointer"
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
                      className="px-4 py-2 bg-white text-black rounded-xl font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
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
                  className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground text-sm font-bold uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/25 active:scale-[0.98] cursor-pointer"
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

type ToolTab = 'home' | 'builder' | 'editor' | 'compressor' | 'converter' | 'json-formatter' | 'xml-json-converter' | 'text-diff' | 'password-generator' | 'qrcode' | 'base64' | 'hash-generator' | 'csv-json-converter' | 'markdown-editor' | 'text-utilities' | 'yaml-formatter' | 'html-css-formatter' | 'uuid-generator' | 'calculator' | 'stopwatch' | 'jwt-decoder' | 'url-encoder' | 'password-strength' | 'data-masking' | 'regex-tester' | 'json-to-typescript' | 'color-picker' | 'api-builder' | 'code-minifier' | 'lorem-ipsum' | 'text-to-speech' | 'image-format-converter' | 'qrcode-reader' | 'image-cropper' | 'unit-converter' | 'datetime-converter' | 'number-base-converter' | 'morse-code' | 'roman-numeral' | 'barcode-generator' | 'random-data' | 'browser-info' | 'clipboard-history' | 'color-palette' | 'ip-tools' | 'email-validator' | 'file-hash-checker' | 'two-factor-auth' | 'graphql-formatter' | 'curl-generator' | 'sql-formatter' | 'json-path-finder' | 'xml-validator' | 'http-status-lookup' | 'text-encryption' | 'csv-table-viewer' | 'json-tree-viewer' | 'data-statistics' | 'notes' | 'image-watermark';

// Mapping from short URL-friendly names to full tool names
const toolUrlMap: Record<string, ToolTab> = {
  'json': 'json-formatter',
  'xml': 'xml-json-converter',
  'diff': 'text-diff',
  'password': 'password-generator',
  'qr': 'qrcode',
  'hash': 'hash-generator',
  'csv': 'csv-json-converter',
  'markdown': 'markdown-editor',
  'text': 'text-utilities',
  'yaml': 'yaml-formatter',
  'html': 'html-css-formatter',
  'uuid': 'uuid-generator',
  'calc': 'calculator',
  'jwt': 'jwt-decoder',
  'url': 'url-encoder',
  'pwd-strength': 'password-strength',
  'mask': 'data-masking',
  'regex': 'regex-tester',
  'json-ts': 'json-to-typescript',
  'color': 'color-picker',
  'api': 'api-builder',
  'minify': 'code-minifier',
  'lorem': 'lorem-ipsum',
  'tts': 'text-to-speech',
  'img-convert': 'image-format-converter',
  'qr-reader': 'qrcode-reader',
  'crop': 'image-cropper',
  'unit': 'unit-converter',
  'datetime': 'datetime-converter',
  'base': 'number-base-converter',
  'morse': 'morse-code',
  'roman': 'roman-numeral',
  'barcode': 'barcode-generator',
  'random': 'random-data',
  'browser': 'browser-info',
  'clipboard': 'clipboard-history',
  'palette': 'color-palette',
  'ip': 'ip-tools',
  'email': 'email-validator',
  'file-hash': 'file-hash-checker',
  '2fa': 'two-factor-auth',
  'graphql': 'graphql-formatter',
  'curl': 'curl-generator',
  'sql': 'sql-formatter',
  'json-path': 'json-path-finder',
  'xml-validate': 'xml-validator',
  'http': 'http-status-lookup',
  'encrypt': 'text-encryption',
  'csv-view': 'csv-table-viewer',
  'json-tree': 'json-tree-viewer',
  'stats': 'data-statistics',
  'watermark': 'image-watermark',
};

// Reverse mapping: from tool name to short URL name
const toolToUrlMap: Record<ToolTab, string> = {
  'home': 'home',
  'builder': 'builder',
  'editor': 'editor',
  'compressor': 'compressor',
  'converter': 'converter',
  'json-formatter': 'json',
  'xml-json-converter': 'xml',
  'text-diff': 'diff',
  'password-generator': 'password',
  'qrcode': 'qr',
  'base64': 'base64',
  'hash-generator': 'hash',
  'csv-json-converter': 'csv',
  'markdown-editor': 'markdown',
  'text-utilities': 'text',
  'yaml-formatter': 'yaml',
  'html-css-formatter': 'html',
  'uuid-generator': 'uuid',
  'calculator': 'calc',
  'stopwatch': 'stopwatch',
  'jwt-decoder': 'jwt',
  'url-encoder': 'url',
  'password-strength': 'pwd-strength',
  'data-masking': 'mask',
  'regex-tester': 'regex',
  'json-to-typescript': 'json-ts',
  'color-picker': 'color',
  'api-builder': 'api',
  'code-minifier': 'minify',
  'lorem-ipsum': 'lorem',
  'text-to-speech': 'tts',
  'image-format-converter': 'img-convert',
  'qrcode-reader': 'qr-reader',
  'image-cropper': 'crop',
  'unit-converter': 'unit',
  'datetime-converter': 'datetime',
  'number-base-converter': 'base',
  'morse-code': 'morse',
  'roman-numeral': 'roman',
  'barcode-generator': 'barcode',
  'random-data': 'random',
  'browser-info': 'browser',
  'clipboard-history': 'clipboard',
  'color-palette': 'palette',
  'ip-tools': 'ip',
  'email-validator': 'email',
  'file-hash-checker': 'file-hash',
  'two-factor-auth': '2fa',
  'graphql-formatter': 'graphql',
  'curl-generator': 'curl',
  'sql-formatter': 'sql',
  'json-path-finder': 'json-path',
  'xml-validator': 'xml-validate',
  'http-status-lookup': 'http',
  'text-encryption': 'encrypt',
  'csv-table-viewer': 'csv-view',
  'json-tree-viewer': 'json-tree',
  'data-statistics': 'stats',
  'notes': 'notes',
  'image-watermark': 'watermark',
};

const isValidTool = (tool: string | null): tool is ToolTab => {
  if (!tool) return false;
  // Check if it's a short URL name and convert it
  if (toolUrlMap[tool]) {
    return true;
  }
  // Check if it's a full tool name
  const validTools: ToolTab[] = ['home', 'builder', 'editor', 'compressor', 'converter', 'json-formatter', 'xml-json-converter', 'text-diff', 'password-generator', 'qrcode', 'base64', 'hash-generator', 'csv-json-converter', 'markdown-editor', 'text-utilities', 'yaml-formatter', 'html-css-formatter', 'uuid-generator', 'calculator', 'stopwatch', 'jwt-decoder', 'url-encoder', 'password-strength', 'data-masking', 'regex-tester', 'json-to-typescript', 'color-picker', 'api-builder', 'code-minifier', 'lorem-ipsum', 'text-to-speech', 'image-format-converter', 'qrcode-reader', 'image-cropper', 'unit-converter', 'datetime-converter', 'number-base-converter', 'morse-code', 'roman-numeral', 'barcode-generator', 'random-data', 'browser-info', 'clipboard-history', 'color-palette', 'ip-tools', 'email-validator', 'file-hash-checker', 'two-factor-auth', 'graphql-formatter', 'curl-generator', 'sql-formatter', 'json-path-finder', 'xml-validator', 'http-status-lookup', 'text-encryption', 'csv-table-viewer', 'json-tree-viewer', 'data-statistics', 'notes', 'image-watermark'];
  return validTools.includes(tool as ToolTab);
};

// Convert URL parameter to tool name
const urlToTool = (urlParam: string | null): ToolTab | null => {
  if (!urlParam) return null;
  // Check if it's a short URL name
  if (toolUrlMap[urlParam]) {
    return toolUrlMap[urlParam];
  }
  // Check if it's already a full tool name
  if (isValidTool(urlParam)) {
    return urlParam;
  }
  return null;
};

// Convert tool name to URL parameter
const toolToUrl = (tool: ToolTab): string => {
  return toolToUrlMap[tool] || tool;
};

export default function App() {
  // Initialize activeTab from URL or default to 'home'
  const getInitialTab = (): ToolTab => {
    const params = new URLSearchParams(window.location.search);
    const toolParam = params.get('tool');
    const tool = urlToTool(toolParam);
    return tool || 'home';
  };

  const [activeTab, setActiveTab] = useState<ToolTab>(getInitialTab);
  const contentRef = useRef<HTMLDivElement>(null);
  const toolsGridRef = useRef<HTMLDivElement>(null);

  // Track if this is the initial mount to avoid updating URL on first render
  const isInitialMount = useRef(true);

  // Update URL when activeTab changes
  useEffect(() => {
    // Skip URL update on initial mount (URL is already correct from getInitialTab)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const currentToolParam = params.get('tool');
    const expectedUrlParam = toolToUrl(activeTab);
    
    // Only update URL if it's different from current state
    if (activeTab === 'home' && currentToolParam === null) {
      return; // Already correct
    }
    if (activeTab !== 'home' && currentToolParam === expectedUrlParam) {
      return; // Already correct
    }

    if (activeTab === 'home') {
      // Remove tool parameter if on home page
      params.delete('tool');
    } else {
      params.set('tool', expectedUrlParam);
    }
    
    const newUrl = params.toString() 
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    
    // Use pushState to allow browser back/forward navigation
    window.history.pushState({}, '', newUrl);
  }, [activeTab]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const toolParam = params.get('tool');
      const tool = urlToTool(toolParam);
      if (tool) {
        setActiveTab(tool);
      } else {
        setActiveTab('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Scroll to content when tab changes (except on initial load)
  useEffect(() => {
    if (contentRef.current && activeTab !== 'home') {
      const timer = setTimeout(() => {
        contentRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }, 100); // Small delay to ensure animation starts
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const handleTabChange = (tab: ToolTab) => {
    setActiveTab(tab);
  };

  const handleLogoClick = () => {
    if (activeTab !== 'home') {
      setActiveTab('home');
      // Scroll to top first, then to tools grid after a short delay
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        if (toolsGridRef.current) {
          toolsGridRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 300);
    } else {
      // Already on home, just scroll to tools grid
      if (toolsGridRef.current) {
        toolsGridRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 md:py-20 px-4 relative overflow-hidden selection:bg-primary/30 font-sans">
      {/* Fixed Logo - Always Visible */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogoClick}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg bg-card/80 backdrop-blur-md border border-border shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-card/90 group cursor-pointer"
        aria-label="Go to home"
      >
        <div className="relative">
          <IconShield className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform duration-200" strokeWidth={2.5} />
          <motion.div
            className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <span className="font-bold text-sm text-foreground hidden sm:inline">Privacy Tools</span>
      </motion.button>

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

        {/* Feature Cards - Responsive Grid Design */}
        <div ref={toolsGridRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 mb-12 max-w-7xl mx-auto w-full px-4">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => handleTabChange('home')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconEraser size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Metadata Cleaner</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Remove EXIF, XMP, IPTC data
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => handleTabChange('builder')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconWand size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Form Builder</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Create interactive PDF forms
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => handleTabChange('editor')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconFileText size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">PDF Editor</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Combine, edit, extract pages
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => handleTabChange('compressor')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconPhoto size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Image Compressor</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Resize & compress images
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => handleTabChange('converter')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconFile size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">File Converter</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  PDF, DOCX & EPUB conversion
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={() => handleTabChange('json-formatter')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconCode size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">JSON Formatter</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Format, validate & minify
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            onClick={() => handleTabChange('xml-json-converter')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconArrowsExchange size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">XML/JSON Converter</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Convert & format XML ↔ JSON
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            onClick={() => handleTabChange('text-diff')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconGitCompare size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Text Diff</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Compare & find differences
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            onClick={() => handleTabChange('password-generator')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconKey size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Password Generator</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Generate secure passwords
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            onClick={() => handleTabChange('qrcode')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconQrcode size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">QR Code</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Generate QR codes
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            onClick={() => handleTabChange('base64')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconCode size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Base64</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Encode & decode Base64
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            onClick={() => handleTabChange('hash-generator')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconHash size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Hash Generator</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Generate hashes
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            onClick={() => handleTabChange('csv-json-converter')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconArrowsExchange size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">CSV ↔ JSON</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Convert CSV & JSON
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            onClick={() => handleTabChange('markdown-editor')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconMarkdown size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Markdown</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Edit & preview markdown
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            onClick={() => handleTabChange('text-utilities')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconTypography size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Text Tools</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Text utilities & stats
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            onClick={() => handleTabChange('yaml-formatter')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconCode size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">YAML</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Format & validate YAML
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7 }}
            onClick={() => handleTabChange('html-css-formatter')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconCode size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">HTML/CSS</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Format & minify
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            onClick={() => handleTabChange('uuid-generator')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconKey size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">UUID</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Generate UUIDs
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9 }}
            onClick={() => handleTabChange('calculator')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconCalculator size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Calculator</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Basic calculator
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0 }}
            onClick={() => handleTabChange('stopwatch')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconPlayerPlay size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Stopwatch</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Timer with laps
                </p>
              </div>
            </div>
          </motion.button>

          {/* New Features Batch 1 */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.1 }}
            onClick={() => handleTabChange('jwt-decoder')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconKey size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">JWT Decoder</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Decode JWT tokens
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2 }}
            onClick={() => handleTabChange('url-encoder')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconLink size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">URL Encoder</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Encode/decode URLs
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.3 }}
            onClick={() => handleTabChange('password-strength')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconShield size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Password Strength</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Check password strength
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4 }}
            onClick={() => handleTabChange('data-masking')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconEyeOff size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Data Masking</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Mask sensitive data
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5 }}
            onClick={() => handleTabChange('regex-tester')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconCode size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Regex Tester</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Test regex patterns
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.6 }}
            onClick={() => handleTabChange('json-to-typescript')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconCode size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">JSON to TS</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Generate TS interfaces
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.7 }}
            onClick={() => handleTabChange('color-picker')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconPalette size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Color Picker</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Pick & convert colors
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8 }}
            onClick={() => handleTabChange('api-builder')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconWorld size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">API Builder</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Build HTTP requests
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.9 }}
            onClick={() => handleTabChange('code-minifier')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconCode size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Code Minifier</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Minify JS/CSS/HTML
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.0 }}
            onClick={() => handleTabChange('lorem-ipsum')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconFileText size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Lorem Ipsum</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Generate placeholder text
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.1 }}
            onClick={() => handleTabChange('text-to-speech')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconSpeakerphone size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Text to Speech</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Convert text to speech
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.2 }}
            onClick={() => handleTabChange('image-format-converter')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconPhoto size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Format Converter</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Convert image formats
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.3 }}
            onClick={() => handleTabChange('qrcode-reader')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconQrcode size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">QR Reader</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Scan QR codes
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.4 }}
            onClick={() => handleTabChange('image-cropper')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconCrop size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Image Cropper</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Crop images
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.5 }}
            onClick={() => handleTabChange('unit-converter')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconArrowsExchange size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Unit Converter</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Convert units
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.6 }}
            onClick={() => handleTabChange('datetime-converter')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconClock size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Date/Time</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Convert date/time
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.7 }}
            onClick={() => handleTabChange('number-base-converter')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconHash size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Base Converter</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Convert number bases
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.8 }}
            onClick={() => handleTabChange('morse-code')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconRadio size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Morse Code</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Encode/decode Morse
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.9 }}
            onClick={() => handleTabChange('roman-numeral')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconHash size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Roman Numeral</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Convert Roman numerals
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4.0 }}
            onClick={() => handleTabChange('barcode-generator')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconBarcode size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Barcode</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Generate barcodes
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4.2 }}
            onClick={() => handleTabChange('random-data')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconDice size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Random Data</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Generate random data
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4.2 }}
            onClick={() => handleTabChange('browser-info')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconDeviceDesktop size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Browser Info</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Display browser info
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4.3 }}
            onClick={() => handleTabChange('clipboard-history')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconClipboard size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Clipboard</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Clipboard history
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4.4 }}
            onClick={() => handleTabChange('color-palette')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconPalette size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Color Palette</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Generate palettes
                </p>
              </div>
            </div>
          </motion.button>

          {/* New Features Batch 2 */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4.5 }}
            onClick={() => handleTabChange('ip-tools')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconWorld size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">IP Tools</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  IP lookup & subnet calc
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4.7 }}
            onClick={() => handleTabChange('email-validator')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconMail size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Email Validator</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Validate emails
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4.7 }}
            onClick={() => handleTabChange('file-hash-checker')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconFile size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">File Hash</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Check file checksums
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4.8 }}
            onClick={() => handleTabChange('two-factor-auth')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconShield size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">2FA Generator</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Generate TOTP codes
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 5.0 }}
            onClick={() => handleTabChange('graphql-formatter')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconCode size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">GraphQL</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Format GraphQL queries
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 5.0 }}
            onClick={() => handleTabChange('curl-generator')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconCode size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">cURL Generator</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Generate cURL commands
                </p>
              </div>
            </div>
          </motion.button>

          {/* Developer Tools */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 5.2 }}
            onClick={() => handleTabChange('sql-formatter')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconCode size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">SQL Formatter</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Format SQL queries
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 5.2 }}
            onClick={() => handleTabChange('json-path-finder')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconCode size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">JSON Path</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Extract JSON data
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 5.4 }}
            onClick={() => handleTabChange('xml-validator')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconCode size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">XML Validator</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Validate XML syntax
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 5.4 }}
            onClick={() => handleTabChange('http-status-lookup')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconWorld size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">HTTP Status</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Status code lookup
                </p>
              </div>
            </div>
          </motion.button>

          {/* New Features Batch 3 */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 5.5 }}
            onClick={() => handleTabChange('text-encryption')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconLock size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Text Encryption</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Encrypt/decrypt text
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 5.6 }}
            onClick={() => handleTabChange('csv-table-viewer')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconLayoutGrid size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">CSV Viewer</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  View & filter CSV data
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 5.7 }}
            onClick={() => handleTabChange('json-tree-viewer')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconBinaryTree size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">JSON Tree</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Interactive JSON viewer
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 5.8 }}
            onClick={() => handleTabChange('data-statistics')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconChartBar size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Data Stats</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Analyze CSV/JSON data
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 5.9 }}
            onClick={() => handleTabChange('notes')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconNotes size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Notes</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Notes & scratchpad
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 6.0 }}
            onClick={() => handleTabChange('image-watermark')}
            className="group relative p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <IconPhoto size={24} className="text-primary" />
              </div>
              <div className="w-full min-h-[3.5rem]">
                <h3 className="font-bold text-sm text-foreground mb-1.5 break-words">Watermark</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Add watermarks to images
                </p>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Tab Navigation - Enhanced Design */}
        <div className="flex justify-center w-full mb-8 px-4">
          <div className="inline-flex p-1.5 bg-card/80 backdrop-blur-md rounded-2xl border border-border/60 shadow-lg shadow-primary/5 gap-1.5 overflow-x-auto max-w-full scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <button
            onClick={() => handleTabChange('home')}
            className={`
                            relative px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex-shrink-0
                            ${activeTab === 'home' 
                              ? 'text-primary-foreground shadow-md' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                        `}
          >
            {activeTab === 'home' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
              <IconEraser size={16} className={activeTab === 'home' ? 'text-primary-foreground' : 'text-muted-foreground'} /> 
              <span className="hidden sm:inline">Metadata Cleaner</span>
              <span className="sm:hidden">Cleaner</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            className={`
                            relative px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex-shrink-0
                            ${activeTab === 'builder' 
                              ? 'text-primary-foreground shadow-md' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                        `}
          >
            {activeTab === 'builder' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
              <IconWand size={16} className={activeTab === 'builder' ? 'text-primary-foreground' : 'text-muted-foreground'} /> 
              <span className="hidden sm:inline">Form Builder</span>
              <span className="sm:hidden">Forms</span>
            </span>
          </button>
          <button
            onClick={() => handleTabChange('editor')}
            className={`
                            relative px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex-shrink-0
                            ${activeTab === 'editor' 
                              ? 'text-primary-foreground shadow-md' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                        `}
          >
            {activeTab === 'editor' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
              <IconFileText size={16} className={activeTab === 'editor' ? 'text-primary-foreground' : 'text-muted-foreground'} /> 
              <span className="hidden sm:inline">PDF Editor</span>
              <span className="sm:hidden">PDF</span>
            </span>
          </button>
          <button
            onClick={() => handleTabChange('compressor')}
            className={`
                            relative px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex-shrink-0
                            ${activeTab === 'compressor' 
                              ? 'text-primary-foreground shadow-md' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                        `}
          >
            {activeTab === 'compressor' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
              <IconPhoto size={16} className={activeTab === 'compressor' ? 'text-primary-foreground' : 'text-muted-foreground'} /> 
              <span className="hidden sm:inline">Image Compressor</span>
              <span className="sm:hidden">Images</span>
            </span>
          </button>
          <button
            onClick={() => handleTabChange('converter')}
            className={`
                            relative px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex-shrink-0
                            ${activeTab === 'converter' 
                              ? 'text-primary-foreground shadow-md' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                        `}
          >
            {activeTab === 'converter' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
              <IconFile size={16} className={activeTab === 'converter' ? 'text-primary-foreground' : 'text-muted-foreground'} /> 
              <span className="hidden sm:inline">File Converter</span>
              <span className="sm:hidden">Convert</span>
            </span>
          </button>
          <button
            onClick={() => handleTabChange('json-formatter')}
            className={`
                            relative px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex-shrink-0
                            ${activeTab === 'json-formatter' 
                              ? 'text-primary-foreground shadow-md' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                        `}
          >
            {activeTab === 'json-formatter' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
              <IconCode size={16} className={activeTab === 'json-formatter' ? 'text-primary-foreground' : 'text-muted-foreground'} /> 
              <span className="hidden sm:inline">JSON Formatter</span>
              <span className="sm:hidden">JSON</span>
            </span>
          </button>
          <button
            onClick={() => handleTabChange('xml-json-converter')}
            className={`
                            relative px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex-shrink-0
                            ${activeTab === 'xml-json-converter' 
                              ? 'text-primary-foreground shadow-md' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                        `}
          >
            {activeTab === 'xml-json-converter' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
              <IconArrowsExchange size={16} className={activeTab === 'xml-json-converter' ? 'text-primary-foreground' : 'text-muted-foreground'} /> 
              <span className="hidden md:inline">XML/JSON Converter</span>
              <span className="hidden sm:inline md:hidden">XML/JSON</span>
              <span className="sm:hidden">XML</span>
            </span>
          </button>
          <button
            onClick={() => handleTabChange('text-diff')}
            className={`
                            relative px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex-shrink-0
                            ${activeTab === 'text-diff' 
                              ? 'text-primary-foreground shadow-md' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                        `}
          >
            {activeTab === 'text-diff' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
              <IconGitCompare size={16} className={activeTab === 'text-diff' ? 'text-primary-foreground' : 'text-muted-foreground'} /> 
              <span className="hidden sm:inline">Text Diff</span>
              <span className="sm:hidden">Diff</span>
            </span>
          </button>
          <button
            onClick={() => handleTabChange('password-generator')}
            className={`
                            relative px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex-shrink-0
                            ${activeTab === 'password-generator' 
                              ? 'text-primary-foreground shadow-md' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                        `}
          >
            {activeTab === 'password-generator' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
              <IconKey size={16} className={activeTab === 'password-generator' ? 'text-primary-foreground' : 'text-muted-foreground'} /> 
              <span className="hidden sm:inline">Password</span>
              <span className="sm:hidden">Pass</span>
            </span>
          </button>
          <button
            onClick={() => handleTabChange('qrcode')}
            className={`
                            relative px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex-shrink-0
                            ${activeTab === 'qrcode' 
                              ? 'text-primary-foreground shadow-md' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                        `}
          >
            {activeTab === 'qrcode' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
              <IconQrcode size={16} className={activeTab === 'qrcode' ? 'text-primary-foreground' : 'text-muted-foreground'} /> 
              <span className="hidden sm:inline">QR Code</span>
              <span className="sm:hidden">QR</span>
            </span>
          </button>
          <button
            onClick={() => handleTabChange('base64')}
            className={`
                            relative px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex-shrink-0
                            ${activeTab === 'base64' 
                              ? 'text-primary-foreground shadow-md' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                        `}
          >
            {activeTab === 'base64' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
              <IconCode size={16} className={activeTab === 'base64' ? 'text-primary-foreground' : 'text-muted-foreground'} /> 
              <span className="hidden sm:inline">Base64</span>
              <span className="sm:hidden">B64</span>
            </span>
          </button>
          <button
            onClick={() => handleTabChange('hash-generator')}
            className={`
                            relative px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex-shrink-0
                            ${activeTab === 'hash-generator' 
                              ? 'text-primary-foreground shadow-md' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                        `}
          >
            {activeTab === 'hash-generator' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
              <IconHash size={16} className={activeTab === 'hash-generator' ? 'text-primary-foreground' : 'text-muted-foreground'} /> 
              <span className="hidden sm:inline">Hash</span>
              <span className="sm:hidden">Hash</span>
            </span>
          </button>
          <button
            onClick={() => handleTabChange('csv-json-converter')}
            className={`
                            relative px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex-shrink-0
                            ${activeTab === 'csv-json-converter' 
                              ? 'text-primary-foreground shadow-md' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                        `}
          >
            {activeTab === 'csv-json-converter' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
              <IconArrowsExchange size={16} className={activeTab === 'csv-json-converter' ? 'text-primary-foreground' : 'text-muted-foreground'} /> 
              <span className="hidden sm:inline">CSV↔JSON</span>
              <span className="sm:hidden">CSV</span>
            </span>
          </button>
          <button
            onClick={() => handleTabChange('markdown-editor')}
            className={`
                            relative px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex-shrink-0
                            ${activeTab === 'markdown-editor' 
                              ? 'text-primary-foreground shadow-md' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                        `}
          >
            {activeTab === 'markdown-editor' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
              <IconMarkdown size={16} className={activeTab === 'markdown-editor' ? 'text-primary-foreground' : 'text-muted-foreground'} /> 
              <span className="hidden sm:inline">Markdown</span>
              <span className="sm:hidden">MD</span>
            </span>
          </button>
          <button
            onClick={() => handleTabChange('text-utilities')}
            className={`
                            relative px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex-shrink-0
                            ${activeTab === 'text-utilities' 
                              ? 'text-primary-foreground shadow-md' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                        `}
          >
            {activeTab === 'text-utilities' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
              <IconTypography size={16} className={activeTab === 'text-utilities' ? 'text-primary-foreground' : 'text-muted-foreground'} /> 
              <span className="hidden sm:inline">Text Tools</span>
              <span className="sm:hidden">Text</span>
            </span>
          </button>
          <button
            onClick={() => handleTabChange('yaml-formatter')}
            className={`
                            relative px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex-shrink-0
                            ${activeTab === 'yaml-formatter' 
                              ? 'text-primary-foreground shadow-md' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                        `}
          >
            {activeTab === 'yaml-formatter' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
              <IconCode size={16} className={activeTab === 'yaml-formatter' ? 'text-primary-foreground' : 'text-muted-foreground'} /> 
              <span className="hidden sm:inline">YAML</span>
              <span className="sm:hidden">YAML</span>
            </span>
          </button>
          <button
            onClick={() => handleTabChange('html-css-formatter')}
            className={`
                            relative px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex-shrink-0
                            ${activeTab === 'html-css-formatter' 
                              ? 'text-primary-foreground shadow-md' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                        `}
          >
            {activeTab === 'html-css-formatter' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
              <IconCode size={16} className={activeTab === 'html-css-formatter' ? 'text-primary-foreground' : 'text-muted-foreground'} /> 
              <span className="hidden sm:inline">HTML/CSS</span>
              <span className="sm:hidden">HTML</span>
            </span>
          </button>
          <button
            onClick={() => handleTabChange('uuid-generator')}
            className={`
                            relative px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex-shrink-0
                            ${activeTab === 'uuid-generator' 
                              ? 'text-primary-foreground shadow-md' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                        `}
          >
            {activeTab === 'uuid-generator' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
              <IconKey size={16} className={activeTab === 'uuid-generator' ? 'text-primary-foreground' : 'text-muted-foreground'} /> 
              <span className="hidden sm:inline">UUID</span>
              <span className="sm:hidden">UUID</span>
            </span>
          </button>
          <button
            onClick={() => handleTabChange('calculator')}
            className={`
                            relative px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex-shrink-0
                            ${activeTab === 'calculator' 
                              ? 'text-primary-foreground shadow-md' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                        `}
          >
            {activeTab === 'calculator' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
              <IconCalculator size={16} className={activeTab === 'calculator' ? 'text-primary-foreground' : 'text-muted-foreground'} /> 
              <span className="hidden sm:inline">Calculator</span>
              <span className="sm:hidden">Calc</span>
            </span>
          </button>
          <button
            onClick={() => handleTabChange('stopwatch')}
            className={`
                            relative px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex-shrink-0
                            ${activeTab === 'stopwatch' 
                              ? 'text-primary-foreground shadow-md' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                        `}
          >
            {activeTab === 'stopwatch' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
              <IconPlayerPlay size={16} className={activeTab === 'stopwatch' ? 'text-primary-foreground' : 'text-muted-foreground'} /> 
              <span className="hidden sm:inline">Stopwatch</span>
              <span className="sm:hidden">Timer</span>
            </span>
          </button>
          <button
            onClick={() => handleTabChange('jwt-decoder')}
            className={`
                            relative px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex-shrink-0
                            ${activeTab === 'jwt-decoder' 
                              ? 'text-primary-foreground shadow-md' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                        `}
          >
            {activeTab === 'jwt-decoder' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
              <IconKey size={16} className={activeTab === 'jwt-decoder' ? 'text-primary-foreground' : 'text-muted-foreground'} /> 
              <span className="hidden sm:inline">JWT</span>
              <span className="sm:hidden">JWT</span>
            </span>
          </button>
          <button
            onClick={() => handleTabChange('url-encoder')}
            className={`
                            relative px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex-shrink-0
                            ${activeTab === 'url-encoder' 
                              ? 'text-primary-foreground shadow-md' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                        `}
          >
            {activeTab === 'url-encoder' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
              <IconLink size={16} className={activeTab === 'url-encoder' ? 'text-primary-foreground' : 'text-muted-foreground'} /> 
              <span className="hidden sm:inline">URL</span>
              <span className="sm:hidden">URL</span>
            </span>
          </button>
          <button
            onClick={() => handleTabChange('unit-converter')}
            className={`
                            relative px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex-shrink-0
                            ${activeTab === 'unit-converter' 
                              ? 'text-primary-foreground shadow-md' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                        `}
          >
            {activeTab === 'unit-converter' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
              <IconArrowsExchange size={16} className={activeTab === 'unit-converter' ? 'text-primary-foreground' : 'text-muted-foreground'} /> 
              <span className="hidden sm:inline">Units</span>
              <span className="sm:hidden">Units</span>
            </span>
          </button>
          </div>
        </div>
      </motion.div>

      <div ref={contentRef} className="w-full relative z-10 scroll-mt-8">
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
          ) : activeTab === 'json-formatter' ? (
            <motion.div
              key="json-formatter"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <JSONFormatter />
            </motion.div>
          ) : activeTab === 'xml-json-converter' ? (
            <motion.div
              key="xml-json-converter"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <XMLJSONConverter />
            </motion.div>
          ) : activeTab === 'text-diff' ? (
            <motion.div
              key="text-diff"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <TextDiff />
            </motion.div>
          ) : activeTab === 'password-generator' ? (
            <motion.div
              key="password-generator"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <PasswordGenerator />
            </motion.div>
          ) : activeTab === 'qrcode' ? (
            <motion.div
              key="qrcode"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <QRCode />
            </motion.div>
          ) : activeTab === 'base64' ? (
            <motion.div
              key="base64"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Base64 />
            </motion.div>
          ) : activeTab === 'hash-generator' ? (
            <motion.div
              key="hash-generator"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <HashGenerator />
            </motion.div>
          ) : activeTab === 'csv-json-converter' ? (
            <motion.div
              key="csv-json-converter"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <CSVJSONConverter />
            </motion.div>
          ) : activeTab === 'markdown-editor' ? (
            <motion.div
              key="markdown-editor"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <MarkdownEditor />
            </motion.div>
          ) : activeTab === 'text-utilities' ? (
            <motion.div
              key="text-utilities"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <TextUtilities />
            </motion.div>
          ) : activeTab === 'yaml-formatter' ? (
            <motion.div
              key="yaml-formatter"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <YAMLFormatter />
            </motion.div>
          ) : activeTab === 'html-css-formatter' ? (
            <motion.div
              key="html-css-formatter"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <HTMLCSSFormatter />
            </motion.div>
          ) : activeTab === 'uuid-generator' ? (
            <motion.div
              key="uuid-generator"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <UUIDGenerator />
            </motion.div>
          ) : activeTab === 'calculator' ? (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Calculator />
            </motion.div>
          ) : activeTab === 'stopwatch' ? (
            <motion.div
              key="stopwatch"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Stopwatch />
            </motion.div>
          ) : activeTab === 'jwt-decoder' ? (
            <motion.div key="jwt-decoder" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <JWTDecoder />
            </motion.div>
          ) : activeTab === 'url-encoder' ? (
            <motion.div key="url-encoder" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <URLEncoder />
            </motion.div>
          ) : activeTab === 'password-strength' ? (
            <motion.div key="password-strength" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <PasswordStrength />
            </motion.div>
          ) : activeTab === 'data-masking' ? (
            <motion.div key="data-masking" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <DataMasking />
            </motion.div>
          ) : activeTab === 'regex-tester' ? (
            <motion.div key="regex-tester" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <RegexTester />
            </motion.div>
          ) : activeTab === 'json-to-typescript' ? (
            <motion.div key="json-to-typescript" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <JSONToTypeScript />
            </motion.div>
          ) : activeTab === 'color-picker' ? (
            <motion.div key="color-picker" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <ColorPicker />
            </motion.div>
          ) : activeTab === 'api-builder' ? (
            <motion.div key="api-builder" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <APIBuilder />
            </motion.div>
          ) : activeTab === 'code-minifier' ? (
            <motion.div key="code-minifier" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <CodeMinifier />
            </motion.div>
          ) : activeTab === 'lorem-ipsum' ? (
            <motion.div key="lorem-ipsum" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <LoremIpsum />
            </motion.div>
          ) : activeTab === 'text-to-speech' ? (
            <motion.div key="text-to-speech" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <TextToSpeech />
            </motion.div>
          ) : activeTab === 'image-format-converter' ? (
            <motion.div key="image-format-converter" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <ImageFormatConverter />
            </motion.div>
          ) : activeTab === 'qrcode-reader' ? (
            <motion.div key="qrcode-reader" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <QRCodeReader />
            </motion.div>
          ) : activeTab === 'image-cropper' ? (
            <motion.div key="image-cropper" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <ImageCropper />
            </motion.div>
          ) : activeTab === 'unit-converter' ? (
            <motion.div key="unit-converter" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <UnitConverter />
            </motion.div>
          ) : activeTab === 'datetime-converter' ? (
            <motion.div key="datetime-converter" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <DateTimeConverter />
            </motion.div>
          ) : activeTab === 'number-base-converter' ? (
            <motion.div key="number-base-converter" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <NumberBaseConverter />
            </motion.div>
          ) : activeTab === 'morse-code' ? (
            <motion.div key="morse-code" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <MorseCode />
            </motion.div>
          ) : activeTab === 'roman-numeral' ? (
            <motion.div key="roman-numeral" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <RomanNumeral />
            </motion.div>
          ) : activeTab === 'barcode-generator' ? (
            <motion.div key="barcode-generator" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <BarcodeGenerator />
            </motion.div>
          ) : activeTab === 'random-data' ? (
            <motion.div key="random-data" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <RandomData />
            </motion.div>
          ) : activeTab === 'browser-info' ? (
            <motion.div key="browser-info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <BrowserInfo />
            </motion.div>
          ) : activeTab === 'clipboard-history' ? (
            <motion.div key="clipboard-history" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <ClipboardHistory />
            </motion.div>
          ) : activeTab === 'color-palette' ? (
            <motion.div key="color-palette" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <ColorPalette />
            </motion.div>
          ) : activeTab === 'ip-tools' ? (
            <motion.div key="ip-tools" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <IPAddressTools />
            </motion.div>
          ) : activeTab === 'email-validator' ? (
            <motion.div key="email-validator" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <EmailValidator />
            </motion.div>
          ) : activeTab === 'file-hash-checker' ? (
            <motion.div key="file-hash-checker" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <FileHashChecker />
            </motion.div>
          ) : activeTab === 'two-factor-auth' ? (
            <motion.div key="two-factor-auth" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <TwoFactorAuth />
            </motion.div>
          ) : activeTab === 'graphql-formatter' ? (
            <motion.div key="graphql-formatter" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <GraphQLFormatter />
            </motion.div>
          ) : activeTab === 'curl-generator' ? (
            <motion.div key="curl-generator" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <CurlGenerator />
            </motion.div>
          ) : activeTab === 'sql-formatter' ? (
            <motion.div key="sql-formatter" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <SQLFormatter />
            </motion.div>
          ) : activeTab === 'json-path-finder' ? (
            <motion.div key="json-path-finder" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <JSONPathFinder />
            </motion.div>
          ) : activeTab === 'xml-validator' ? (
            <motion.div key="xml-validator" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <XMLValidator />
            </motion.div>
          ) : activeTab === 'http-status-lookup' ? (
            <motion.div key="http-status-lookup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <HTTPStatusLookup />
            </motion.div>
          ) : activeTab === 'text-encryption' ? (
            <motion.div key="text-encryption" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <TextEncryption />
            </motion.div>
          ) : activeTab === 'csv-table-viewer' ? (
            <motion.div key="csv-table-viewer" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <CSVTableViewer />
            </motion.div>
          ) : activeTab === 'json-tree-viewer' ? (
            <motion.div key="json-tree-viewer" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <JSONTreeViewer />
            </motion.div>
          ) : activeTab === 'data-statistics' ? (
            <motion.div key="data-statistics" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <DataStatistics />
            </motion.div>
          ) : activeTab === 'notes' ? (
            <motion.div key="notes" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <Notes />
            </motion.div>
          ) : activeTab === 'image-watermark' ? (
            <motion.div key="image-watermark" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <ImageWatermark />
            </motion.div>
          ) : null}
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
