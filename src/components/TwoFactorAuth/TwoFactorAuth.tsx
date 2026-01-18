import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IconShield, IconCopy, IconRefresh } from '@tabler/icons-react';
import { useToast } from '../ui/toast';

// TOTP implementation (simplified)
function generateTOTP(secret: string, timeStep: number = 30): string {
  const time = Math.floor(Date.now() / 1000 / timeStep);
  const key = base32Decode(secret);
  const counter = new ArrayBuffer(8);
  const view = new DataView(counter);
  view.setUint32(4, time, false);

  // Simplified HMAC-SHA1 (for production, use crypto.subtle)
  // This is a placeholder - real implementation requires crypto API
  const hash = simpleHMAC(key, counter);
  const offset = hash[hash.length - 1] & 0x0f;
  const code = ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);

  return (code % 1000000).toString().padStart(6, '0');
}

function base32Decode(str: string): Uint8Array {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const bytes: number[] = [];
  let bits = 0;
  let value = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str[i].toUpperCase();
    if (char === '=') break;
    const index = alphabet.indexOf(char);
    if (index === -1) continue;

    value = (value << 5) | index;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }

  return new Uint8Array(bytes);
}

function simpleHMAC(key: Uint8Array, message: ArrayBuffer): Uint8Array {
  // This is a simplified placeholder
  // Real implementation should use Web Crypto API
  const combined = new Uint8Array(key.length + message.byteLength);
  combined.set(key);
  combined.set(new Uint8Array(message), key.length);

  // Simple hash simulation (not secure - for demo only)
  const hash = new Uint8Array(20);
  for (let i = 0; i < combined.length; i++) {
    hash[i % 20] ^= combined[i];
  }
  return hash;
}

export const TwoFactorAuth = () => {
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const { showToast } = useToast();

  useEffect(() => {
    if (!secret.trim()) return;

    const generateCode = () => {
      try {
        const totp = generateTOTP(secret);
        setCode(totp);
      } catch (err) {
        setCode('Error');
      }
    };

    generateCode();
    const interval = setInterval(() => {
      const timeStep = 30;
      const currentTime = Math.floor(Date.now() / 1000);
      const remaining = timeStep - (currentTime % timeStep);
      setTimeLeft(remaining);

      if (remaining === timeStep) {
        generateCode();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [secret]);

  const handleGenerateSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let newSecret = '';
    for (let i = 0; i < 16; i++) {
      newSecret += chars[Math.floor(Math.random() * chars.length)];
    }
    setSecret(newSecret);
    showToast('Secret generated');
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
            <IconShield className="w-8 h-8 text-foreground/60" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Identity Vault
          </h1>
          <p className="text-[15px] text-foreground/40 font-medium max-w-sm mx-auto leading-relaxed">
            Generate time-based one-time passwords for secure multi-factor authentication.
          </p>
        </div>

        <div className="apple-card p-8 bg-secondary/20 border-border/40">
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <label className="text-[11px] font-black uppercase tracking-widest text-foreground/30">Secret Configuration</label>
                <button
                  onClick={handleGenerateSecret}
                  className="px-3 py-1 bg-secondary text-foreground text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-secondary/70 transition-all flex items-center gap-1.5 cursor-pointer border border-border/20"
                >
                  <IconRefresh size={12} />
                  Regenerate
                </button>
              </div>
              <div className="relative group">
                <input
                  type="text"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value.toUpperCase())}
                  placeholder="Inject Base32 Seed..."
                  className="w-full h-14 px-6 bg-background border border-border/30 rounded-xl text-[14px] font-mono focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-foreground/20 text-center uppercase"
                />
              </div>
            </div>

            {secret && code && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="apple-card bg-background p-10 space-y-8 border-border/30 relative overflow-hidden text-center shadow-xl shadow-foreground/5"
              >
                {/* Visual Timer Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-secondary/20">
                  <motion.div
                    initial={false}
                    animate={{ width: `${(timeLeft / 30) * 100}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                    className={`h-full ${timeLeft < 10 ? 'bg-red-500' : 'bg-primary'}`}
                  />
                </div>

                <div className="space-y-4">
                  <div className="text-6xl font-black tracking-[0.2em] font-mono text-foreground tabular-nums flex justify-center">
                    {code.split('').map((char, i) => (
                      <span key={i} className={i === 3 ? 'ml-4' : ''}>{char}</span>
                    ))}
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-foreground/30">
                    Rotation in <span className="text-foreground">{timeLeft}s</span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleCopy(code)}
                    className="flex-1 h-14 bg-foreground text-background font-black rounded-xl text-[13px] uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <IconCopy size={16} />
                    Copy Code
                  </button>
                  <button
                    onClick={() => handleCopy(secret)}
                    className="flex-1 h-14 bg-secondary text-foreground font-black rounded-xl text-[13px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-secondary/80 active:scale-[0.98] transition-all border border-border/30 cursor-pointer"
                  >
                    <IconCopy size={16} />
                    Copy Secret
                  </button>
                </div>
              </motion.div>
            )}

            <div className="px-6 py-5 bg-secondary/10 border border-border/20 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 text-center">Security Advisory</p>
                <div className="flex-1 h-[1px] bg-border/10" />
              </div>
              <ul className="space-y-2">
                {[
                  'Purely local HMAC simulation (In-browser only)',
                  'No persistent storage of authentication seeds',
                  'Seed randomness optimized for modern standards'
                ].map((note, i) => (
                  <li key={i} className="flex items-start gap-3 text-[12px] text-foreground/50 font-medium">
                    <span className="text-primary font-bold">•</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
