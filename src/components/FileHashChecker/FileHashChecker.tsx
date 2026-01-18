import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconFile, IconCopy } from '@tabler/icons-react';
import { FileUpload } from '../ui/file-upload';
import { generateHash, type HashAlgorithm } from '../../utils/hashGenerator';
import { useToast } from '../ui/toast';

export const FileHashChecker = () => {
  const [file, setFile] = useState<File | null>(null);
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('sha256');
  const [hash, setHash] = useState('');
  const [expectedHash, setExpectedHash] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { showToast } = useToast();

  const algorithms: { value: HashAlgorithm; label: string }[] = [
    { value: 'md5', label: 'MD5' },
    { value: 'sha1', label: 'SHA-1' },
    { value: 'sha256', label: 'SHA-256' },
    { value: 'sha512', label: 'SHA-512' },
  ];

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setHash('');
    }
  };

  const handleCalculate = async () => {
    if (!file) {
      showToast('Please select a file', 'error');
      return;
    }

    try {
      const fileContent = await file.arrayBuffer();
      const result = await generateHash(new TextDecoder().decode(fileContent), algorithm);
      setHash(result);
      showToast('Hash calculated successfully');
    } catch (err) {
      showToast('Failed to calculate hash', 'error');
    }
  };

  const handleVerify = async () => {
    if (!file || !expectedHash.trim()) {
      showToast('Please select a file and enter expected hash', 'error');
      return;
    }

    setIsVerifying(true);
    try {
      const fileContent = await file.arrayBuffer();
      const calculatedHash = await generateHash(new TextDecoder().decode(fileContent), algorithm);
      const match = calculatedHash.toLowerCase() === expectedHash.trim().toLowerCase();

      if (match) {
        showToast('Hash matches! File is verified');
      } else {
        showToast('Hash does not match! File may be corrupted', 'error');
      }

      setHash(calculatedHash);
    } catch (err) {
      showToast('Failed to verify hash', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard');
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-10"
      >
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/30 rounded-2xl mb-2">
            <IconFile className="w-8 h-8 text-foreground/60" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Checksum Utility
          </h1>
          <p className="text-[15px] text-foreground/40 font-medium max-w-sm mx-auto leading-relaxed">
            Verify file integrity with industry-standard cryptographic primitives. Secure, local, and private.
          </p>
        </div>

        <div className="apple-card p-6 bg-secondary/20 border-border/40">
          {!file ? (
            <div className="apple-card bg-background/50 border-dashed border-2 border-border/20 p-12 transition-all hover:border-primary/50 group">
              <FileUpload onChange={handleFileSelect} isProcessing={false} />
            </div>
          ) : (
            <div className="space-y-8">
              {/* File Info Card */}
              <div className="apple-card bg-background p-5 flex items-center justify-between border-border/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary/50 rounded-xl flex items-center justify-center">
                    <IconFile className="w-6 h-6 text-foreground/40" />
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-foreground truncate max-w-[200px]">{file.name}</p>
                    <p className="text-[12px] font-medium text-foreground/30">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setHash('');
                    setExpectedHash('');
                  }}
                  className="px-4 py-2 bg-secondary/40 text-[12px] font-black uppercase tracking-widest text-foreground/60 rounded-lg hover:bg-secondary/60 hover:text-foreground transition-all cursor-pointer"
                >
                  Discard
                </button>
              </div>

              {/* Algorithm Segmented Control */}
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-foreground/30 px-1">Primary Algorithm</label>
                <div className="flex p-1 bg-secondary/30 rounded-2xl border border-border/20">
                  {algorithms.map((alg) => (
                    <button
                      key={alg.value}
                      onClick={() => setAlgorithm(alg.value)}
                      className={`flex-1 py-3 text-[13px] font-bold rounded-xl transition-all cursor-pointer ${algorithm === alg.value
                        ? 'bg-background text-foreground shadow-sm ring-1 ring-border/10'
                        : 'text-foreground/40 hover:text-foreground/60'
                        }`}
                    >
                      {alg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Action */}
              <button
                onClick={handleCalculate}
                className="w-full h-16 bg-foreground text-background font-black rounded-2xl text-[16px] flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-foreground/5 cursor-pointer"
              >
                Generate Signature
              </button>

              {/* Verification Section */}
              <div className="space-y-4 pt-4 border-t border-border/10">
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-foreground/30 px-1">Integrity Verification</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={expectedHash}
                      onChange={(e) => setExpectedHash(e.target.value)}
                      placeholder="Inject expected hash..."
                      className="w-full h-14 pl-6 pr-24 bg-background border border-border/30 rounded-xl text-[14px] font-mono focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-foreground/20"
                    />
                    <button
                      onClick={handleVerify}
                      disabled={isVerifying || !expectedHash.trim()}
                      className="absolute right-2 top-2 bottom-2 px-4 bg-secondary text-foreground rounded-lg font-black text-[11px] uppercase tracking-widest hover:bg-secondary/80 transition-all disabled:opacity-20 cursor-pointer"
                    >
                      {isVerifying ? 'Verifying...' : 'Verify'}
                    </button>
                  </div>
                </div>

                {hash && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="apple-card bg-background border-border/30 overflow-hidden"
                  >
                    <div className="px-6 py-4 bg-secondary/10 border-b border-border/5 flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-widest text-foreground/40">Calculated Payload</span>
                      <button
                        onClick={() => handleCopy(hash)}
                        className="p-1.5 text-foreground/40 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-all cursor-pointer"
                        title="Copy Signature"
                      >
                        <IconCopy size={16} />
                      </button>
                    </div>
                    <div className="p-6 font-mono text-[13px] text-foreground/80 leading-relaxed break-all bg-secondary/5">
                      {hash}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
