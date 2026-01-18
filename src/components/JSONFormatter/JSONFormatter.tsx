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
import { formatBytes } from '../../utils/imageProcessor';
import { useToast } from '../ui/toast';

export const JSONFormatter = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [formattedOutput, setFormattedOutput] = useState('');
  const [indent, setIndent] = useState(2);
  const [validation, setValidation] = useState<{ valid: boolean; error?: string } | null>(null);
  const [stats, setStats] = useState<{ size: number; lines: number; keys: number; depth: number } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const outputTextareaRef = useRef<HTMLTextAreaElement>(null);
  const { showToast } = useToast();

  const handleFormat = () => {
    setValidation(null);

    if (!jsonInput.trim()) {
      setValidation({ valid: false, error: 'Please enter JSON to format' });
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
      setFormattedOutput('');
    }
  };

  const handleMinify = () => {
    setValidation(null);

    if (!jsonInput.trim()) {
      setValidation({ valid: false, error: 'Please enter JSON to minify' });
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
      setFormattedOutput('');
    }
  };

  const handleValidate = () => {
    if (!jsonInput.trim()) {
      setValidation({ valid: false, error: 'Please enter JSON to validate' });
      return;
    }

    const result = validateJSON(jsonInput);
    setValidation(result);

    if (result.valid) {
      const jsonStats = getJSONStats(jsonInput);
      setStats(jsonStats);
    } else {
      setStats(null);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard'));
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
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.json') && file.type !== 'application/json') {
      setValidation({ valid: false, error: 'Please upload a JSON file' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonInput(content);
      setValidation(null);
      setFormattedOutput('');
      setStats(null);
    };
    reader.onerror = () => {
      setValidation({ valid: false, error: 'Failed to read file' });
    };
    reader.readAsText(file);

    // Reset file input
    if (e.target) {
      e.target.value = '';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/30 rounded-2xl mb-2">
            <IconCode className="w-8 h-8 text-foreground/60" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            JSON Utility
          </h1>
          <p className="text-[15px] text-foreground/40 font-medium max-w-lg mx-auto leading-relaxed">
            Local browser-based JSON transformation. Format, minify, and validate with zero data egress.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="apple-card p-6 bg-secondary/20 border-border/40">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
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
                className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl cursor-pointer hover:opacity-90 active:scale-95 transition-all text-[13px] font-black uppercase tracking-widest"
              >
                <IconFileText size={18} />
                Import File
              </label>
              {jsonInput && (
                <button
                  onClick={handleClear}
                  className="flex items-center gap-2 px-5 py-2.5 bg-secondary/40 text-foreground rounded-xl hover:bg-secondary/60 active:scale-95 transition-all text-[13px] font-bold border border-border/30 cursor-pointer"
                >
                  <IconRefresh size={18} />
                  Reset
                </button>
              )}
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-[12px] font-black uppercase tracking-widest text-foreground/40">Indent</span>
                <div className="flex items-center bg-background border border-border/30 rounded-lg overflow-hidden h-9">
                  <input
                    type="number"
                    min="0"
                    max="8"
                    value={indent}
                    onChange={(e) => setIndent(Math.max(0, Math.min(8, Number(e.target.value))))}
                    className="w-12 px-2 text-center text-[13px] font-bold focus:outline-none"
                  />
                  <div className="px-2 text-[10px] font-black uppercase text-foreground/30 border-l border-border/20 bg-secondary/10 h-full flex items-center">
                    SP
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Validation & Stats Overlay - Only shown when input exists */}
        {jsonInput && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {validation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`apple-card p-6 border-2 flex items-center gap-4 ${validation.valid
                  ? 'bg-emerald-500/[0.03] border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  : 'bg-red-500/[0.03] border-red-500/20 text-red-600 dark:text-red-400'
                  }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${validation.valid ? 'bg-emerald-500/10' : 'bg-red-500/10'
                  }`}>
                  {validation.valid ? <IconCheck size={20} /> : <IconX size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-black uppercase tracking-widest">
                    {validation.valid ? 'Syntax Verified' : 'Validation Error'}
                  </p>
                  {validation.error && (
                    <p className="text-[13px] font-medium opacity-80 truncate">{validation.error}</p>
                  )}
                </div>
              </motion.div>
            )}

            {stats && validation?.valid && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="apple-card p-6 border-border/40 grid grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {[
                  { label: 'Payload', value: formatBytes(stats.size) },
                  { label: 'Count', value: `${stats.keys} keys` },
                  { label: 'Structure', value: `${stats.depth} deep` },
                  { label: 'Lines', value: stats.lines },
                ].map((stat, i) => (
                  <div key={i} className="space-y-0.5">
                    <p className="text-[10px] font-black text-foreground/30 uppercase tracking-tighter">{stat.label}</p>
                    <p className="font-mono text-[14px] font-bold text-foreground">{stat.value}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        )}

        {/* Main Editor Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
          {/* Input Section */}
          <div className="flex flex-col h-full apple-card bg-background border-border/40 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-6 h-14 border-b border-border/10 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-foreground/20" />
                <h2 className="text-[13px] font-black uppercase tracking-widest text-foreground/60">Raw Material</h2>
              </div>
              {jsonInput && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopy(jsonInput)}
                    className="p-2 text-foreground/40 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-all cursor-pointer"
                  >
                    <IconCopy size={16} />
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
                setFormattedOutput('');
                setStats(null);
              }}
              placeholder="Inject JSON data..."
              className="flex-1 w-full px-8 py-6 bg-transparent focus:outline-none font-mono text-[14px] leading-relaxed resize-none custom-scrollbar"
              spellCheck={false}
            />
          </div>

          {/* Output Section */}
          <div className="flex flex-col h-full apple-card bg-secondary/10 border-border/30 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-6 h-14 border-b border-border/10 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <h2 className="text-[13px] font-black uppercase tracking-widest text-foreground/60">Refined Output</h2>
              </div>
              {formattedOutput && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopy(formattedOutput)}
                    className="p-2 text-foreground/40 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-all cursor-pointer"
                    title="Copy Result"
                  >
                    <IconCopy size={16} />
                  </button>
                  <button
                    onClick={() => handleDownload(formattedOutput, 'refined.json')}
                    className="p-2 text-foreground/40 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-all cursor-pointer"
                    title="Export Result"
                  >
                    <IconDownload size={16} />
                  </button>
                </div>
              )}
            </div>
            <textarea
              ref={outputTextareaRef}
              value={formattedOutput}
              readOnly
              placeholder="Awaiting processing..."
              className="flex-1 w-full px-8 py-6 bg-transparent font-mono text-[14px] leading-relaxed resize-none custom-scrollbar text-foreground/80"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Global Process Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleFormat}
            disabled={!jsonInput.trim()}
            className="flex-1 h-16 bg-foreground text-background font-black rounded-2xl text-[16px] flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-xl shadow-foreground/5 cursor-pointer"
          >
            <IconCode size={20} />
            Beautify JSON
          </button>
          <button
            onClick={handleMinify}
            disabled={!jsonInput.trim()}
            className="flex-1 h-16 bg-secondary text-foreground font-black rounded-2xl text-[16px] flex items-center justify-center gap-3 hover:bg-secondary/80 active:scale-[0.98] transition-all disabled:opacity-20 disabled:cursor-not-allowed border border-border/30 cursor-pointer"
          >
            <IconRefresh size={20} className="rotate-90" />
            Minify (Compact)
          </button>
          <button
            onClick={handleValidate}
            disabled={!jsonInput.trim()}
            className="px-10 h-16 bg-secondary/40 text-foreground font-bold rounded-2xl text-[15px] hover:bg-secondary/60 transition-all active:scale-[0.98] border border-border/20 cursor-pointer"
          >
            Check Syntax
          </button>
        </div>
      </motion.div>
    </div>
  );
};
