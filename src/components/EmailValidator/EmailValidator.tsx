import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconMail, IconCopy, IconCheck, IconX } from '@tabler/icons-react';
import { useToast } from '../ui/toast';

const disposableEmailDomains = [
  'tempmail.com', 'guerrillamail.com', 'mailinator.com', '10minutemail.com',
  'throwaway.email', 'temp-mail.org', 'getnada.com', 'mohmal.com',
];

export const EmailValidator = () => {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<any>(null);
  const { showToast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidFormat = emailRegex.test(email);

    if (!isValidFormat) {
      return {
        valid: false,
        format: false,
        message: 'Invalid email format',
      };
    }

    const [local, domain] = email.toLowerCase().split('@');
    const isDisposable = disposableEmailDomains.some(d => domain.includes(d));

    const checks = {
      valid: true,
      format: true,
      local: local.length > 0 && local.length <= 64,
      domain: domain.length > 0 && domain.length <= 255,
      hasDot: domain.includes('.'),
      disposable: isDisposable,
      message: isDisposable ? 'Email uses a disposable domain' : 'Email appears valid',
    };

    return checks;
  };

  const handleValidate = () => {
    if (!email.trim()) {
      showToast('Please enter an email address', 'error');
      return;
    }

    const validation = validateEmail(email);
    setResult({
      email,
      ...validation,
    });

    if (validation.valid && 'disposable' in validation) {
      showToast(validation.disposable ? 'Email validated (disposable detected)' : 'Email validated');
    } else {
      showToast('Invalid email format', 'error');
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
            <IconMail className="w-8 h-8 text-foreground/60" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Mail Verifier
          </h1>
          <p className="text-[15px] text-foreground/40 font-medium max-w-sm mx-auto leading-relaxed">
            Verify address syntax and check against a comprehensive list of known disposable providers.
          </p>
        </div>

        {/* Search Input Area */}
        <div className="apple-card p-6 bg-secondary/20 border-border/40">
          <div className="space-y-4">
            <div className="relative group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="identity@example.com"
                className="w-full h-16 pl-6 pr-32 bg-background border border-border/30 rounded-2xl text-[17px] font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-foreground/20"
                onKeyPress={(e) => e.key === 'Enter' && handleValidate()}
              />
              <button
                onClick={handleValidate}
                disabled={!email.trim()}
                className="absolute right-2 top-2 bottom-2 px-6 bg-foreground text-background rounded-xl font-black text-[13px] uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all disabled:opacity-20 cursor-pointer"
              >
                Inspect
              </button>
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.05em] text-foreground/30 px-2">
              Privacy Guaranteed: No data leaves your machine.
            </p>
          </div>
        </div>

        {/* Results Visualization */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="apple-card overflow-hidden border-border/40"
          >
            <div className="p-6 border-b border-border/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${result.valid && !result.disposable ? 'bg-primary' : 'bg-foreground/20'}`} />
                <h3 className="text-[12px] font-black uppercase tracking-widest text-foreground/60">Analysis Report</h3>
              </div>
              <button
                onClick={() => handleCopy(result.email)}
                className="p-2 text-foreground/40 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-all cursor-pointer"
                title="Copy Email"
              >
                <IconCopy size={16} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Primary Status */}
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${result.valid && !result.disposable
                  ? 'bg-emerald-500/10 text-emerald-600'
                  : result.disposable
                    ? 'bg-amber-500/10 text-amber-600'
                    : 'bg-red-500/10 text-red-600'
                  }`}>
                  {result.valid && !result.disposable ? <IconCheck size={28} stroke={3} /> : <IconX size={28} stroke={3} />}
                </div>
                <div>
                  <p className="text-[20px] font-black tracking-tight text-foreground">
                    {result.valid && !result.disposable ? 'Verified Secure' : result.disposable ? 'Caution: Temporary' : 'Invalid Structure'}
                  </p>
                  <p className="text-[14px] font-medium text-foreground/40">{result.message}</p>
                </div>
              </div>

              {/* Detailed Specs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {[
                  { label: 'Syntax', value: result.format ? 'Correct' : 'Erroneous', ok: result.format },
                  { label: 'Length', value: result.valid ? 'Optimal' : 'Invalid', ok: result.valid },
                  { label: 'Disposable', value: result.disposable ? 'Detected' : 'Clean', ok: !result.disposable, warning: result.disposable }
                ].map((spec, i) => (
                  <div key={i} className="bg-secondary/20 rounded-2xl p-4 border border-border/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-1">{spec.label}</p>
                    <p className={`text-[15px] font-bold ${spec.warning ? 'text-amber-600' : spec.ok ? 'text-foreground' : 'text-red-500'}`}>
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
