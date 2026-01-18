import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconEyeOff, IconCopy } from '@tabler/icons-react';
import { useToast } from '../ui/toast';

export const DataMasking = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [maskChar, setMaskChar] = useState('*');
  const { showToast } = useToast();

  const maskEmail = (email: string): string => {
    const [local, domain] = email.split('@');
    if (!domain) return email;
    const maskedLocal = local.length > 2
      ? local[0] + maskChar.repeat(local.length - 2) + local[local.length - 1]
      : maskChar.repeat(local.length);
    const [domainName, tld] = domain.split('.');
    const maskedDomain = domainName.length > 2
      ? domainName[0] + maskChar.repeat(domainName.length - 2) + domainName[domainName.length - 1]
      : maskChar.repeat(domainName.length);
    return `${maskedLocal}@${maskedDomain}.${tld}`;
  };

  const maskPhone = (phone: string): string => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 4) return phone;
    const visible = digits.slice(-4);
    return phone.replace(/\d/g, (_, idx) => idx < digits.length - 4 ? maskChar : visible[idx - (digits.length - 4)]);
  };

  const maskSSN = (ssn: string): string => {
    const digits = ssn.replace(/\D/g, '');
    if (digits.length !== 9) return ssn;
    return `XXX-XX-${digits.slice(-4)}`;
  };

  const maskCreditCard = (card: string): string => {
    const digits = card.replace(/\D/g, '');
    if (digits.length < 4) return card;
    const last4 = digits.slice(-4);
    return maskChar.repeat(digits.length - 4) + last4;
  };

  const maskText = (text: string): string => {
    return text
      .replace(/\b[\w.-]+@[\w.-]+\.\w+\b/g, maskEmail)
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, maskSSN)
      .replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, maskCreditCard)
      .replace(/\b\d{3}[\s-]?\d{3}[\s-]?\d{4}\b/g, maskPhone);
  };

  const handleMask = () => {
    if (!input.trim()) {
      showToast('Please enter text to mask', 'error');
      return;
    }
    const masked = maskText(input);
    setOutput(masked);
    showToast('Data masked successfully');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard');
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-10"
      >
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/30 rounded-2xl mb-2">
            <IconEyeOff className="w-8 h-8 text-foreground/60" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Privacy Filter
          </h1>
          <p className="text-[15px] text-foreground/40 font-medium max-w-md mx-auto leading-relaxed">
            Protect sensitive information by masking PII, financial data, and identifiers with zero external data transfer.
          </p>
        </div>

        <div className="apple-card p-8 bg-secondary/20 border-border/40 space-y-8">
          {/* Configuration */}
          <div className="flex items-center justify-between border-b border-border/10 pb-6">
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-widest text-foreground/30 px-1">Obfuscation Variable</label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={maskChar}
                  onChange={(e) => setMaskChar(e.target.value[0] || '*')}
                  maxLength={1}
                  className="w-14 h-11 bg-background border border-border/30 rounded-xl text-center text-[18px] font-black focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-foreground"
                />
                <span className="text-[13px] font-medium text-foreground/40">Masking character used for redaction</span>
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/20">Supported Patterns</p>
              <p className="text-[13px] font-bold text-foreground/40">Email • Phone • SSN • CC</p>
            </div>
          </div>

          {/* Editor Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[500px]">
            {/* Input Section */}
            <div className="flex flex-col h-full apple-card bg-background border-border/40 overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-6 h-14 border-b border-border/10 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-foreground/20" />
                  <h2 className="text-[12px] font-black uppercase tracking-widest text-foreground/60">Source Data</h2>
                </div>
                {input && (
                  <button
                    onClick={() => handleCopy(input)}
                    className="p-2 text-foreground/40 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-all cursor-pointer"
                  >
                    <IconCopy size={16} />
                  </button>
                )}
              </div>
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setOutput('');
                }}
                placeholder="Inject sensitive data strings..."
                className="flex-1 w-full px-8 py-6 bg-transparent focus:outline-none font-mono text-[14px] leading-relaxed resize-none custom-scrollbar"
                spellCheck={false}
              />
            </div>

            {/* Output Section */}
            <div className="flex flex-col h-full apple-card bg-secondary/10 border-border/30 overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-6 h-14 border-b border-border/10 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <h2 className="text-[12px] font-black uppercase tracking-widest text-foreground/60">Sanitized Material</h2>
                </div>
                {output && (
                  <button
                    onClick={() => handleCopy(output)}
                    className="p-2 text-foreground/40 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-all cursor-pointer"
                  >
                    <IconCopy size={16} />
                  </button>
                )}
              </div>
              <textarea
                value={output}
                readOnly
                placeholder="Sanitized output will manifest here..."
                className="flex-1 w-full px-8 py-6 bg-transparent font-mono text-[14px] leading-relaxed resize-none custom-scrollbar text-foreground/80 italic"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Action Trigger */}
          <button
            onClick={handleMask}
            disabled={!input.trim()}
            className="w-full h-16 bg-foreground text-background font-black rounded-2xl text-[16px] flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-xl shadow-foreground/5 cursor-pointer"
          >
            <IconEyeOff size={20} />
            Execute Redaction
          </button>
        </div>
      </motion.div>
    </div>
  );
};
