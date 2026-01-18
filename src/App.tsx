import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { IconRefresh } from '@tabler/icons-react';

// Lazy load tools
const FormBuilder = lazy(() => import('./components/FormBuilder/FormBuilder').then(m => ({ default: m.FormBuilder })));
const PDFEditor = lazy(() => import('./components/PDFEditor/PDFEditor').then(m => ({ default: m.PDFEditor })));
const ImageCompressor = lazy(() => import('./components/ImageCompressor/ImageCompressor').then(m => ({ default: m.ImageCompressor })));
const FileConverter = lazy(() => import('./components/FileConverter/FileConverter').then(m => ({ default: m.FileConverter })));
const JSONFormatter = lazy(() => import('./components/JSONFormatter/JSONFormatter').then(m => ({ default: m.JSONFormatter })));
const XMLJSONConverter = lazy(() => import('./components/XMLJSONConverter/XMLJSONConverter').then(m => ({ default: m.XMLJSONConverter })));
const TextDiff = lazy(() => import('./components/TextDiff/TextDiff').then(m => ({ default: m.TextDiff })));
const PasswordGenerator = lazy(() => import('./components/PasswordGenerator/PasswordGenerator').then(m => ({ default: m.PasswordGenerator })));
const QRCode = lazy(() => import('./components/QRCode/QRCode').then(m => ({ default: m.QRCode })));
const Base64 = lazy(() => import('./components/Base64/Base64').then(m => ({ default: m.Base64 })));
const HashGenerator = lazy(() => import('./components/HashGenerator/HashGenerator').then(m => ({ default: m.HashGenerator })));
const CSVJSONConverter = lazy(() => import('./components/CSVJSONConverter/CSVJSONConverter').then(m => ({ default: m.CSVJSONConverter })));
const MarkdownEditor = lazy(() => import('./components/MarkdownEditor/MarkdownEditor').then(m => ({ default: m.MarkdownEditor })));
const TextUtilities = lazy(() => import('./components/TextUtilities/TextUtilities').then(m => ({ default: m.TextUtilities })));
const YAMLFormatter = lazy(() => import('./components/YAMLFormatter/YAMLFormatter').then(m => ({ default: m.YAMLFormatter })));
const HTMLCSSFormatter = lazy(() => import('./components/HTMLCSSFormatter/HTMLCSSFormatter').then(m => ({ default: m.HTMLCSSFormatter })));
const UUIDGenerator = lazy(() => import('./components/UUIDGenerator/UUIDGenerator').then(m => ({ default: m.UUIDGenerator })));
const Calculator = lazy(() => import('./components/Calculator/Calculator').then(m => ({ default: m.Calculator })));
const Stopwatch = lazy(() => import('./components/Stopwatch/Stopwatch').then(m => ({ default: m.Stopwatch })));
const JWTDecoder = lazy(() => import('./components/JWTDecoder/JWTDecoder').then(m => ({ default: m.JWTDecoder })));
const URLEncoder = lazy(() => import('./components/URLEncoder/URLEncoder').then(m => ({ default: m.URLEncoder })));
const PasswordStrength = lazy(() => import('./components/PasswordStrength/PasswordStrength').then(m => ({ default: m.PasswordStrength })));
const DataMasking = lazy(() => import('./components/DataMasking/DataMasking').then(m => ({ default: m.DataMasking })));
const RegexTester = lazy(() => import('./components/RegexTester/RegexTester').then(m => ({ default: m.RegexTester })));
const JSONToTypeScript = lazy(() => import('./components/JSONToTypeScript/JSONToTypeScript').then(m => ({ default: m.JSONToTypeScript })));
const ColorPicker = lazy(() => import('./components/ColorPicker/ColorPicker').then(m => ({ default: m.ColorPicker })));
const APIBuilder = lazy(() => import('./components/APIBuilder/APIBuilder').then(m => ({ default: m.APIBuilder })));
const CodeMinifier = lazy(() => import('./components/CodeMinifier/CodeMinifier').then(m => ({ default: m.CodeMinifier })));
const LoremIpsum = lazy(() => import('./components/LoremIpsum/LoremIpsum').then(m => ({ default: m.LoremIpsum })));
const TextToSpeech = lazy(() => import('./components/TextToSpeech/TextToSpeech').then(m => ({ default: m.TextToSpeech })));
const ImageResizer = lazy(() => import('./components/ImageResizer/ImageResizer').then(m => ({ default: m.ImageResizer })));
const ImageFormatConverter = lazy(() => import('./components/ImageFormatConverter/ImageFormatConverter').then(m => ({ default: m.ImageFormatConverter })));
const QRCodeReader = lazy(() => import('./components/QRCodeReader/QRCodeReader').then(m => ({ default: m.QRCodeReader })));
const ImageCropper = lazy(() => import('./components/ImageCropper/ImageCropper').then(m => ({ default: m.ImageCropper })));
const UnitConverter = lazy(() => import('./components/UnitConverter/UnitConverter').then(m => ({ default: m.UnitConverter })));
const DateTimeConverter = lazy(() => import('./components/DateTimeConverter/DateTimeConverter').then(m => ({ default: m.DateTimeConverter })));
const NumberBaseConverter = lazy(() => import('./components/NumberBaseConverter/NumberBaseConverter').then(m => ({ default: m.NumberBaseConverter })));
const MorseCode = lazy(() => import('./components/MorseCode/MorseCode').then(m => ({ default: m.MorseCode })));
const RomanNumeral = lazy(() => import('./components/RomanNumeral/RomanNumeral').then(m => ({ default: m.RomanNumeral })));
const BarcodeGenerator = lazy(() => import('./components/BarcodeGenerator/BarcodeGenerator').then(m => ({ default: m.BarcodeGenerator })));
const RandomData = lazy(() => import('./components/RandomData/RandomData').then(m => ({ default: m.RandomData })));
const BrowserInfo = lazy(() => import('./components/BrowserInfo/BrowserInfo').then(m => ({ default: m.BrowserInfo })));
const ClipboardHistory = lazy(() => import('./components/ClipboardHistory/ClipboardHistory').then(m => ({ default: m.ClipboardHistory })));
const ColorPalette = lazy(() => import('./components/ColorPalette/ColorPalette').then(m => ({ default: m.ColorPalette })));
const MetadataRemover = lazy(() => import('./components/MetadataRemover/MetadataRemover').then(m => ({ default: m.MetadataRemover })));
const IPAddressTools = lazy(() => import('./components/IPAddressTools/IPAddressTools').then(m => ({ default: m.IPAddressTools })));
const EmailValidator = lazy(() => import('./components/EmailValidator/EmailValidator').then(m => ({ default: m.EmailValidator })));
const FileHashChecker = lazy(() => import('./components/FileHashChecker/FileHashChecker').then(m => ({ default: m.FileHashChecker })));
const TwoFactorAuth = lazy(() => import('./components/TwoFactorAuth/TwoFactorAuth').then(m => ({ default: m.TwoFactorAuth })));
const GraphQLFormatter = lazy(() => import('./components/GraphQLFormatter/GraphQLFormatter').then(m => ({ default: m.GraphQLFormatter })));
const CurlGenerator = lazy(() => import('./components/CurlGenerator/CurlGenerator').then(m => ({ default: m.CurlGenerator })));
const SQLFormatter = lazy(() => import('./components/SQLFormatter/SQLFormatter').then(m => ({ default: m.SQLFormatter })));
const JSONPathFinder = lazy(() => import('./components/JSONPathFinder/JSONPathFinder').then(m => ({ default: m.JSONPathFinder })));
const XMLValidator = lazy(() => import('./components/XMLValidator/XMLValidator').then(m => ({ default: m.XMLValidator })));
const HTTPStatusLookup = lazy(() => import('./components/HTTPStatusLookup/HTTPStatusLookup').then(m => ({ default: m.HTTPStatusLookup })));

// New Tools from Remote
const TextEncryption = lazy(() => import('./components/TextEncryption/TextEncryption').then(m => ({ default: m.TextEncryption })));
const CSVTableViewer = lazy(() => import('./components/CSVTableViewer/CSVTableViewer').then(m => ({ default: m.CSVTableViewer })));
const JSONTreeViewer = lazy(() => import('./components/JSONTreeViewer/JSONTreeViewer').then(m => ({ default: m.JSONTreeViewer })));
const DataStatistics = lazy(() => import('./components/DataStatistics/DataStatistics').then(m => ({ default: m.DataStatistics })));
const Notes = lazy(() => import('./components/Notes/Notes').then(m => ({ default: m.Notes })));
const ImageWatermark = lazy(() => import('./components/ImageWatermark/ImageWatermark').then(m => ({ default: m.ImageWatermark })));

const LoadingFallback = () => (
  <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-4">
    <IconRefresh size={48} className="text-primary animate-spin" />
    <p className="text-sm font-bold tracking-widest uppercase opacity-50">Initializing Tool...</p>
  </div>
);

const LandingPage = lazy(() => import('./components/LandingPage').then(m => ({ default: m.LandingPage })));

export default function App() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<DashboardLayout />}>
            <Route path="/tool/metadata-cleaner" element={<MetadataRemover />} />
            <Route path="/tool/home" element={<MetadataRemover />} />
            <Route path="/tool/builder" element={<FormBuilder />} />
            <Route path="/tool/editor" element={<PDFEditor />} />
            <Route path="/tool/compressor" element={<ImageCompressor />} />
            <Route path="/tool/converter" element={<FileConverter />} />
            <Route path="/tool/json-formatter" element={<JSONFormatter />} />
            <Route path="/tool/xml-json-converter" element={<XMLJSONConverter />} />
            <Route path="/tool/text-diff" element={<TextDiff />} />
            <Route path="/tool/password-generator" element={<PasswordGenerator />} />
            <Route path="/tool/qrcode" element={<QRCode />} />
            <Route path="/tool/base64" element={<Base64 />} />
            <Route path="/tool/hash-generator" element={<HashGenerator />} />
            <Route path="/tool/csv-json-converter" element={<CSVJSONConverter />} />
            <Route path="/tool/markdown-editor" element={<MarkdownEditor />} />
            <Route path="/tool/text-utilities" element={<TextUtilities />} />
            <Route path="/tool/yaml-formatter" element={<YAMLFormatter />} />
            <Route path="/tool/html-css-formatter" element={<HTMLCSSFormatter />} />
            <Route path="/tool/uuid-generator" element={<UUIDGenerator />} />
            <Route path="/tool/calculator" element={<Calculator />} />
            <Route path="/tool/stopwatch" element={<Stopwatch />} />
            <Route path="/tool/jwt-decoder" element={<JWTDecoder />} />
            <Route path="/tool/url-encoder" element={<URLEncoder />} />
            <Route path="/tool/password-strength" element={<PasswordStrength />} />
            <Route path="/tool/data-masking" element={<DataMasking />} />
            <Route path="/tool/regex-tester" element={<RegexTester />} />
            <Route path="/tool/json-to-typescript" element={<JSONToTypeScript />} />
            <Route path="/tool/color-picker" element={<ColorPicker />} />
            <Route path="/tool/api-builder" element={<APIBuilder />} />
            <Route path="/tool/code-minifier" element={<CodeMinifier />} />
            <Route path="/tool/lorem-ipsum" element={<LoremIpsum />} />
            <Route path="/tool/text-to-speech" element={<TextToSpeech />} />
            <Route path="/tool/image-resizer" element={<ImageResizer />} />
            <Route path="/tool/image-format-converter" element={<ImageFormatConverter />} />
            <Route path="/tool/qrcode-reader" element={<QRCodeReader />} />
            <Route path="/tool/image-cropper" element={<ImageCropper />} />
            <Route path="/tool/unit-converter" element={<UnitConverter />} />
            <Route path="/tool/datetime-converter" element={<DateTimeConverter />} />
            <Route path="/tool/number-base-converter" element={<NumberBaseConverter />} />
            <Route path="/tool/morse-code" element={<MorseCode />} />
            <Route path="/tool/roman-numeral" element={<RomanNumeral />} />
            <Route path="/tool/barcode-generator" element={<BarcodeGenerator />} />
            <Route path="/tool/random-data" element={<RandomData />} />
            <Route path="/tool/browser-info" element={<BrowserInfo />} />
            <Route path="/tool/clipboard-history" element={<ClipboardHistory />} />
            <Route path="/tool/color-palette" element={<ColorPalette />} />
            <Route path="/tool/ip-tools" element={<IPAddressTools />} />
            <Route path="/tool/email-validator" element={<EmailValidator />} />
            <Route path="/tool/file-hash-checker" element={<FileHashChecker />} />
            <Route path="/tool/two-factor-auth" element={<TwoFactorAuth />} />
            <Route path="/tool/graphql-formatter" element={<GraphQLFormatter />} />
            <Route path="/tool/curl-generator" element={<CurlGenerator />} />
            <Route path="/tool/sql-formatter" element={<SQLFormatter />} />
            <Route path="/tool/json-path-finder" element={<JSONPathFinder />} />
            <Route path="/tool/xml-validator" element={<XMLValidator />} />
            <Route path="/tool/http-status-lookup" element={<HTTPStatusLookup />} />

            {/* New Tool Routes */}
            <Route path="/tool/text-encryption" element={<TextEncryption />} />
            <Route path="/tool/csv-table-viewer" element={<CSVTableViewer />} />
            <Route path="/tool/json-tree-viewer" element={<JSONTreeViewer />} />
            <Route path="/tool/data-statistics" element={<DataStatistics />} />
            <Route path="/tool/notes" element={<Notes />} />
            <Route path="/tool/image-watermark" element={<ImageWatermark />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}
