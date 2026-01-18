import {
    IconEraser,
    IconWand,
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
    IconLock,
    IconLink,
    IconEyeOff,
    IconSpeakerphone,
    IconClock,
    IconRadio,
    IconDice,
    IconDeviceDesktop,
    IconClipboard,
    IconBarcode,
    IconCrop,
    IconPalette,
    IconWorld,
    IconMail,
    IconShield,
    IconLayoutGrid,
    IconBinaryTree,
    IconChartBar,
    IconNotes,
    IconPlayerPlay
} from '@tabler/icons-react';

export interface Tool {
    id: string;
    name: string;
    description: string;
    icon: any;
    category: ToolCategory;
}

export type ToolCategory =
    | 'Images'
    | 'PDF & Docs'
    | 'Development'
    | 'Text Tools'
    | 'Security'
    | 'Utilities'
    | 'Web Tools'
    | 'Misc';

export const TOOLS: Tool[] = [
    // Images
    { id: 'metadata-cleaner', name: 'Metadata Cleaner', description: 'Remove EXIF, XMP, IPTC data', icon: IconEraser, category: 'Images' },
    { id: 'compressor', name: 'Image Compressor', description: 'Resize & compress images', icon: IconPhoto, category: 'Images' },
    { id: 'image-format-converter', name: 'Format Converter', description: 'Convert image formats', icon: IconPhoto, category: 'Images' },
    { id: 'image-cropper', name: 'Image Cropper', description: 'Crop images', icon: IconCrop, category: 'Images' },
    { id: 'image-watermark', name: 'Watermark', description: 'Add watermarks to images', icon: IconPhoto, category: 'Images' },
    { id: 'color-picker', name: 'Color Picker', description: 'Pick & convert colors', icon: IconPalette, category: 'Images' },
    { id: 'color-palette', name: 'Color Palette', description: 'Generate palettes', icon: IconPalette, category: 'Images' },

    // PDF & Docs
    { id: 'builder', name: 'Form Builder', description: 'Create interactive PDF forms', icon: IconWand, category: 'PDF & Docs' },
    { id: 'editor', name: 'PDF Editor', description: 'Combine, edit, extract pages', icon: IconFileText, category: 'PDF & Docs' },
    { id: 'converter', name: 'File Converter', description: 'PDF, DOCX & EPUB conversion', icon: IconFile, category: 'PDF & Docs' },

    // Development
    { id: 'json-formatter', name: 'JSON Formatter', description: 'Format, validate & minify', icon: IconCode, category: 'Development' },
    { id: 'xml-json-converter', name: 'XML/JSON Converter', description: 'Convert & format XML ↔ JSON', icon: IconArrowsExchange, category: 'Development' },
    { id: 'csv-json-converter', name: 'CSV ↔ JSON', description: 'Convert CSV & JSON', icon: IconArrowsExchange, category: 'Development' },
    { id: 'json-to-typescript', name: 'JSON to TS', description: 'Generate TS interfaces', icon: IconCode, category: 'Development' },
    { id: 'api-builder', name: 'API Builder', description: 'Build HTTP requests', icon: IconWorld, category: 'Development' },
    { id: 'code-minifier', name: 'Code Minifier', description: 'Minify JS/CSS/HTML', icon: IconCode, category: 'Development' },
    { id: 'yaml-formatter', name: 'YAML', description: 'Format & validate YAML', icon: IconCode, category: 'Development' },
    { id: 'sql-formatter', name: 'SQL Formatter', description: 'Format SQL queries', icon: IconCode, category: 'Development' },
    { id: 'graphql-formatter', name: 'GraphQL', description: 'Format GraphQL queries', icon: IconCode, category: 'Development' },
    { id: 'curl-generator', name: 'cURL Generator', description: 'Generate cURL commands', icon: IconCode, category: 'Development' },
    { id: 'json-path-finder', name: 'JSON Path', description: 'Extract JSON data', icon: IconCode, category: 'Development' },
    { id: 'xml-validator', name: 'XML Validator', description: 'Validate XML syntax', icon: IconCode, category: 'Development' },
    { id: 'json-tree-viewer', name: 'JSON Tree', description: 'Interactive JSON viewer', icon: IconBinaryTree, category: 'Development' },

    // Text Tools
    { id: 'text-diff', name: 'Text Diff', description: 'Compare & find differences', icon: IconGitCompare, category: 'Text Tools' },
    { id: 'markdown-editor', name: 'Markdown', description: 'Edit & preview markdown', icon: IconMarkdown, category: 'Text Tools' },
    { id: 'text-utilities', name: 'Text Tools', description: 'Text utilities & stats', icon: IconTypography, category: 'Text Tools' },
    { id: 'lorem-ipsum', name: 'Lorem Ipsum', description: 'Generate placeholder text', icon: IconFileText, category: 'Text Tools' },
    { id: 'text-to-speech', name: 'Text to Speech', description: 'Convert text to speech', icon: IconSpeakerphone, category: 'Text Tools' },
    { id: 'regex-tester', name: 'Regex Tester', description: 'Test regex patterns', icon: IconCode, category: 'Text Tools' },

    // Security
    { id: 'password-generator', name: 'Password Generator', description: 'Generate secure passwords', icon: IconKey, category: 'Security' },
    { id: 'password-strength', name: 'Password Strength', description: 'Check password strength', icon: IconShield, category: 'Security' },
    { id: 'hash-generator', name: 'Hash Generator', description: 'Generate hashes', icon: IconHash, category: 'Security' },
    { id: 'jwt-decoder', name: 'JWT Decoder', description: 'Decode JWT tokens', icon: IconKey, category: 'Security' },
    { id: 'base64', name: 'Base64', description: 'Encode & decode Base64', icon: IconCode, category: 'Security' },
    { id: 'url-encoder', name: 'URL Encoder', description: 'Encode/decode URLs', icon: IconLink, category: 'Security' },
    { id: 'data-masking', name: 'Data Masking', description: 'Mask sensitive data', icon: IconEyeOff, category: 'Security' },
    { id: 'two-factor-auth', name: '2FA Generator', description: 'Generate TOTP codes', icon: IconShield, category: 'Security' },
    { id: 'email-validator', name: 'Email Validator', description: 'Validate emails', icon: IconMail, category: 'Security' },
    { id: 'file-hash-checker', name: 'File Hash', description: 'Check file checksums', icon: IconFile, category: 'Security' },
    { id: 'text-encryption', name: 'Text Encryption', description: 'Encrypt/decrypt text', icon: IconLock, category: 'Security' },

    // Utilities
    { id: 'calculator', name: 'Calculator', description: 'Basic calculator', icon: IconCalculator, category: 'Utilities' },
    { id: 'unit-converter', name: 'Unit Converter', description: 'Convert units', icon: IconArrowsExchange, category: 'Utilities' },
    { id: 'number-base-converter', name: 'Base Converter', description: 'Convert number bases', icon: IconHash, category: 'Utilities' },
    { id: 'stopwatch', name: 'Stopwatch', description: 'Timer with laps', icon: IconPlayerPlay, category: 'Utilities' },
    { id: 'uuid-generator', name: 'UUID', description: 'Generate UUIDs', icon: IconKey, category: 'Utilities' },
    { id: 'random-data', name: 'Random Data', description: 'Generate random data', icon: IconDice, category: 'Utilities' },
    { id: 'datetime-converter', name: 'Date/Time', description: 'Convert date/time', icon: IconClock, category: 'Utilities' },
    { id: 'qrcode', name: 'QR Code', description: 'Generate QR codes', icon: IconQrcode, category: 'Utilities' },
    { id: 'qrcode-reader', name: 'QR Reader', description: 'Scan QR codes', icon: IconQrcode, category: 'Utilities' },
    { id: 'barcode-generator', name: 'Barcode', description: 'Generate barcodes', icon: IconBarcode, category: 'Utilities' },
    { id: 'csv-table-viewer', name: 'CSV Viewer', description: 'View & filter CSV data', icon: IconLayoutGrid, category: 'Utilities' },
    { id: 'data-statistics', name: 'Data Stats', description: 'Analyze CSV/JSON data', icon: IconChartBar, category: 'Utilities' },

    // Web Tools
    { id: 'browser-info', name: 'Browser Info', description: 'Display browser info', icon: IconDeviceDesktop, category: 'Web Tools' },
    { id: 'clipboard-history', name: 'Clipboard', description: 'Clipboard history', icon: IconClipboard, category: 'Web Tools' },
    { id: 'ip-tools', name: 'IP Tools', description: 'IP lookup & subnet calc', icon: IconWorld, category: 'Web Tools' },
    { id: 'http-status-lookup', name: 'HTTP Status', description: 'Status code lookup', icon: IconWorld, category: 'Web Tools' },

    // Misc
    { id: 'morse-code', name: 'Morse Code', description: 'Encode/decode Morse', icon: IconRadio, category: 'Misc' },
    { id: 'roman-numeral', name: 'Roman Numeral', description: 'Convert Roman numerals', icon: IconHash, category: 'Misc' },
    { id: 'notes', name: 'Notes', description: 'Notes & scratchpad', icon: IconNotes, category: 'Misc' },
];
