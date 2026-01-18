import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconWorld, IconCopy } from '@tabler/icons-react';
import { useToast } from '../ui/toast';

export const IPAddressTools = () => {
  const [ip, setIp] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const isValidIP = (ip: string): boolean => {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  };

  const parseIPv4 = (ip: string) => {
    const parts = ip.split('.').map(Number);
    return {
      octet1: parts[0],
      octet2: parts[1],
      octet3: parts[2],
      octet4: parts[3],
      binary: parts.map(p => p.toString(2).padStart(8, '0')).join('.'),
      hex: parts.map(p => p.toString(16).padStart(2, '0').toUpperCase()).join('.'),
    };
  };

  const calculateSubnet = (ip: string, mask: number) => {
    const parts = ip.split('.').map(Number);
    const maskParts: number[] = [];
    let remaining = mask;
    for (let i = 0; i < 4; i++) {
      if (remaining >= 8) {
        maskParts.push(255);
        remaining -= 8;
      } else {
        maskParts.push(256 - Math.pow(2, 8 - remaining));
        remaining = 0;
      }
    }
    const network = parts.map((p, i) => p & maskParts[i]);
    const broadcast = parts.map((p, i) => p | (255 - maskParts[i]));
    const hostCount = Math.pow(2, 32 - mask) - 2;
    return {
      network: network.join('.'),
      broadcast: broadcast.join('.'),
      subnetMask: maskParts.join('.'),
      hostCount,
      firstHost: network.map((p, i) => i === 3 ? p + 1 : p).join('.'),
      lastHost: broadcast.map((p, i) => i === 3 ? p - 1 : p).join('.'),
    };
  };

  const handleLookup = async () => {
    if (!ip.trim()) {
      showToast('Please enter an IP address', 'error');
      return;
    }

    if (!isValidIP(ip)) {
      showToast('Invalid IP address format', 'error');
      return;
    }

    setLoading(true);
    try {
      // Client-side IP parsing
      const isIPv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);
      const parsed = isIPv4 ? parseIPv4(ip) : null;

      // Try to get geolocation (using a free API)
      let geoData = null;
      try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        if (response.ok) {
          geoData = await response.json();
        }
      } catch (err) {
        // Silently fail - geolocation is optional
      }

      setResult({
        ip,
        type: isIPv4 ? 'IPv4' : 'IPv6',
        parsed,
        geo: geoData,
      });
      showToast('IP address analyzed');
    } catch (err) {
      showToast('Failed to analyze IP address', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubnetCalc = () => {
    if (!ip.trim()) {
      showToast('Please enter an IP address', 'error');
      return;
    }

    const isIPv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);
    if (!isIPv4) {
      showToast('Subnet calculator only supports IPv4', 'error');
      return;
    }

    const mask = 24; // Default /24
    const subnet = calculateSubnet(ip, mask);
    setResult({
      ip,
      subnet,
      mask,
    });
    showToast('Subnet calculated');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard');
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/30 rounded-2xl mb-2">
            <IconWorld className="w-8 h-8 text-foreground/60" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Network Utility
          </h1>
          <p className="text-[15px] text-foreground/40 font-medium">Professional IP analysis and subnet calculations.</p>
        </div>

        <div className="apple-card p-10 bg-secondary/20 border-border/40 space-y-8">
          <div className="space-y-4">
            <label className="text-[13px] font-black uppercase tracking-widest text-foreground/40">Target IP Address</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="192.168.1.1 or 2001:0db8::1"
                className="flex-1 h-14 px-5 bg-background border border-border/40 rounded-2xl focus:outline-none focus:ring-1 focus:ring-foreground/20 font-mono text-[14px]"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleLookup}
                  disabled={loading || !ip.trim()}
                  className="px-8 h-14 bg-foreground text-background rounded-2xl font-black text-[14px] hover:opacity-90 active:scale-95 transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                >
                  Lookup
                </button>
                <button
                  onClick={handleSubnetCalc}
                  disabled={!ip.trim()}
                  className="px-6 h-14 bg-secondary/40 text-foreground rounded-2xl font-bold text-[14px] hover:bg-secondary/60 active:scale-95 transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer border border-border/30"
                >
                  Subnet
                </button>
              </div>
            </div>
          </div>

          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="apple-card p-8 bg-background border-border/30 space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-border/10 pb-4">
                  <h3 className="text-[14px] font-black uppercase tracking-widest text-foreground/60">Analysis Result</h3>
                  <button
                    onClick={() => handleCopy(JSON.stringify(result, null, 2))}
                    className="p-2 text-foreground/40 hover:text-foreground hover:bg-foreground/5 rounded-xl transition-all cursor-pointer"
                    title="Copy JSON"
                  >
                    <IconCopy size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-foreground/30 uppercase tracking-tighter">ADDRESS</p>
                    <p className="font-mono text-[16px] font-bold text-foreground">{result.ip}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-foreground/30 uppercase tracking-tighter">PROTOCOL</p>
                    <p className="font-mono text-[14px] font-bold text-foreground">{result.type}</p>
                  </div>

                  {result.parsed && (
                    <>
                      <div className="space-y-1 md:col-span-2">
                        <p className="text-[11px] font-black text-foreground/30 uppercase tracking-tighter">BINARY REPRESENTATION</p>
                        <p className="font-mono text-[13px] font-bold text-foreground break-all">{result.parsed.binary}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[11px] font-black text-foreground/30 uppercase tracking-tighter">HEXADECIMAL</p>
                        <p className="font-mono text-[14px] font-bold text-foreground uppercase">{result.parsed.hex}</p>
                      </div>
                    </>
                  )}

                  {result.geo && (
                    <>
                      <div className="space-y-1">
                        <p className="text-[11px] font-black text-foreground/30 uppercase tracking-tighter">LOCATION</p>
                        <p className="text-[14px] font-bold text-foreground">
                          {[result.geo.city, result.geo.region, result.geo.country_name].filter(Boolean).join(', ')}
                        </p>
                      </div>
                      {result.geo.org && (
                        <div className="space-y-1">
                          <p className="text-[11px] font-black text-foreground/30 uppercase tracking-tighter">ISP / ORGANIZATION</p>
                          <p className="text-[14px] font-bold text-foreground">{result.geo.org}</p>
                        </div>
                      )}
                    </>
                  )}

                  {result.subnet && (
                    <div className="md:col-span-2 grid grid-cols-2 gap-y-6 pt-4 border-t border-border/10">
                      <div className="space-y-1">
                        <p className="text-[11px] font-black text-foreground/30 uppercase tracking-tighter">NETWORK</p>
                        <p className="font-mono text-[14px] font-bold text-foreground">{result.subnet.network}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[11px] font-black text-foreground/30 uppercase tracking-tighter">BROADCAST</p>
                        <p className="font-mono text-[14px] font-bold text-foreground">{result.subnet.broadcast}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[11px] font-black text-foreground/30 uppercase tracking-tighter">SUBNET MASK</p>
                        <p className="font-mono text-[14px] font-bold text-foreground">{result.subnet.subnetMask}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[11px] font-black text-foreground/30 uppercase tracking-tighter">USABLE HOSTS</p>
                        <p className="font-mono text-[14px] font-bold text-foreground">{result.subnet.hostCount.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[11px] font-black text-foreground/30 uppercase tracking-tighter">RANGE START</p>
                        <p className="font-mono text-[14px] font-bold text-foreground">{result.subnet.firstHost}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[11px] font-black text-foreground/30 uppercase tracking-tighter">RANGE END</p>
                        <p className="font-mono text-[14px] font-bold text-foreground">{result.subnet.lastHost}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
