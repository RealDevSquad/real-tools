import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  IconCode,
  IconCheck,
  IconX,
  IconCopy,
  IconDownload,
  IconRefresh,
  IconFileText,
} from '@tabler/icons-react';
import { formatJSON, minifyJSON, validateJSON, getJSONStats } from '../../utils/jsonFormatter';
import { Button } from '../ui/stateful-button';
import { formatBytes } from '../../utils/imageProcessor';

export const JSONFormatter = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [formattedOutput, setFormattedOutput] = useState('');
  const [indent, setIndent] = useState(2);
  const [validation, setValidation] = useState<{ valid: boolean; error?: string } | null>(null);
  const [stats, setStats] = useState<{ size: number; lines: number; keys: number; depth: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const outputTextareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFormat = () => {
    setError(null);
    setValidation(null);
    
    if (!jsonInput.trim()) {
      setError('Please enter JSON to format');
      return;
    }

    try {
      const formatted = formatJSON(jsonInput, indent);
      setFormattedOutput(formatted);
      setValidation({ valid: true });
      const jsonStats = getJSONStats(jsonInput);
      setStats(jsonStats);
    } catch (err) {
      const validationResult = validateJSON(jsonInput);
      setValidation(validationResult);
      setError(err instanceof Error ? err.message : 'Failed to format JSON');
      setFormattedOutput('');
    }
  };

  const handleMinify = () => {
    setError(null);
    setValidation(null);
    
    if (!jsonInput.trim()) {
      setError('Please enter JSON to minify');
      return;
    }

    try {
      const minified = minifyJSON(jsonInput);
      setFormattedOutput(minified);
      setValidation({ valid: true });
      const jsonStats = getJSONStats(jsonInput);
      setStats(jsonStats);
    } catch (err) {
      const validationResult = validateJSON(jsonInput);
      setValidation(validationResult);
      setError(err instanceof Error ? err.message : 'Failed to minify JSON');
      setFormattedOutput('');
    }
  };

  const handleValidate = () => {
    setError(null);
    
    if (!jsonInput.trim()) {
      setError('Please enter JSON to validate');
      setValidation(null);
      return;
    }

    const result = validateJSON(jsonInput);
    setValidation(result);
    
    if (result.valid) {
      setError(null);
      const jsonStats = getJSONStats(jsonInput);
      setStats(jsonStats);
    } else {
      setError(result.error || 'Invalid JSON');
      setStats(null);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleDownload = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setJsonInput('');
    setFormattedOutput('');
    setValidation(null);
    setStats(null);
    setError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.json') && file.type !== 'application/json') {
      setError('Please upload a JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonInput(content);
      setError(null);
      setValidation(null);
      setFormattedOutput('');
      setStats(null);
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsText(file);
    
    // Reset file input
    if (e.target) {
      e.target.value = '';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            JSON Formatter & Validator
          </h1>
          <p className="text-muted-foreground">
            Format, validate, and minify JSON. All processing happens locally in your browser.
          </p>
        </div>

        {/* File Upload */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="hidden"
              id="json-file-upload"
            />
            <label
              htmlFor="json-file-upload"
              className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg cursor-pointer transition-colors text-sm font-medium"
            >
              <IconFileText className="w-4 h-4" />
              Upload JSON File
            </label>
            {jsonInput && (
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
              >
                <IconRefresh className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Validation Status */}
        {validation && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border-2 ${
              validation.valid
                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500'
                : 'bg-destructive/10 border-destructive/50 text-destructive'
            }`}
          >
            <div className="flex items-center gap-2">
              {validation.valid ? (
                <>
                  <IconCheck className="w-5 h-5" />
                  <span className="font-semibold">Valid JSON</span>
                </>
              ) : (
                <>
                  <IconX className="w-5 h-5" />
                  <div className="flex-1">
                    <span className="font-semibold">Invalid JSON</span>
                    {validation.error && (
                      <p className="text-sm mt-1 opacity-90">{validation.error}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && !validation && (
          <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats */}
        {stats && validation?.valid && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Size</p>
              <p className="text-sm font-semibold">{formatBytes(stats.size)}</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Lines</p>
              <p className="text-sm font-semibold">{stats.lines}</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Keys</p>
              <p className="text-sm font-semibold">{stats.keys}</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Depth</p>
              <p className="text-sm font-semibold">{stats.depth}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <IconCode className="w-5 h-5 text-primary" />
                JSON Input
              </h2>
              {jsonInput && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(jsonInput)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Copy input"
                  >
                    <IconCopy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(jsonInput, 'input.json')}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Download input"
                  >
                    <IconDownload className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <textarea
              ref={textareaRef}
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                setValidation(null);
                setError(null);
                setFormattedOutput('');
                setStats(null);
              }}
              placeholder="Paste your JSON here or upload a JSON file..."
              className="w-full h-96 px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm resize-none"
              spellCheck={false}
            />
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <IconCode className="w-5 h-5 text-primary" />
                Output
              </h2>
              {formattedOutput && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(formattedOutput)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Copy output"
                  >
                    <IconCopy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(formattedOutput, 'formatted.json')}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Download output"
                  >
                    <IconDownload className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <textarea
              ref={outputTextareaRef}
              value={formattedOutput}
              readOnly
              placeholder="Formatted or minified JSON will appear here..."
              className="w-full h-96 px-4 py-3 bg-muted/30 border border-border rounded-xl font-mono text-sm resize-none"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 flex items-center gap-4">
              <label className="text-sm font-medium">Indent:</label>
              <input
                type="number"
                min="0"
                max="8"
                value={indent}
                onChange={(e) => setIndent(Math.max(0, Math.min(8, Number(e.target.value))))}
                className="w-20 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-xs text-muted-foreground">spaces</span>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button onClick={handleFormat} disabled={!jsonInput.trim()}>
                <IconCode className="w-4 h-4 mr-2" />
                Format
              </Button>
              <Button onClick={handleMinify} disabled={!jsonInput.trim()}>
                <IconCode className="w-4 h-4 mr-2" />
                Minify
              </Button>
              <Button onClick={handleValidate} disabled={!jsonInput.trim()}>
                {validation?.valid ? (
                  <IconCheck className="w-4 h-4 mr-2" />
                ) : (
                  <IconX className="w-4 h-4 mr-2" />
                )}
                Validate
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
