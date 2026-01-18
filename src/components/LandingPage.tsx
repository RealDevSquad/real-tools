import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  IconShieldLock,
  IconFileAnalytics,
  IconCode,
  IconBolt,
  IconArrowRight,
  IconDeviceLaptop,
  IconLock,
  IconHeart
} from '@tabler/icons-react';
import { Button } from './ui/button';
import { TOOLS } from '../config/tools';
import logo from '../assets/logo.png';

import { ThemeSwitcher } from './ui/theme-switcher';

export const LandingPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(`/tool/${path}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-primary/20">

      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-primary/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-40 animate-pulse-subtle" />
        <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-blue-500/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-40 animate-pulse-subtle" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] bg-purple-500/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-40 animate-pulse-subtle" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Privacy Tools Logo" className="w-10 h-10 rounded-lg" />
            <span className="font-bold tracking-tight text-lg">Privacy</span>
          </div>
          <div className="flex items-center gap-6">
            <ThemeSwitcher />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-20 px-6 max-w-7xl mx-auto min-h-[90vh] flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="relative z-10 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 backdrop-blur-md border border-border/40 text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            v3.0 Release
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 pb-2">
            Your data stays<br />
            <span className="text-foreground">on your device.</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Professional developer tools that run entirely in your browser. No server uploads. No compromises.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              className="h-14 px-10 rounded-2xl text-[16px] font-bold shadow-xl shadow-primary/20 group"
              onClick={() => handleNavigate('metadata-cleaner')}
            >
              Open Dashboard
              <IconArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>

        {/* Abstract Visual Pattern */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-full h-full max-w-5xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/5 blur-3xl opacity-50" />
          <motion.div
            className="absolute inset-0 border border-primary/5 rounded-[4rem]"
            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Metadata Cleaning",
              desc: "Strip EXIF, XMP, and device identifiers from your media instantly.",
              icon: IconShieldLock,
              color: "bg-blue-500",
              id: "metadata-cleaner"
            },
            {
              title: "Smart Documents",
              desc: "Build professional PDF forms and edit documents directly in-browser.",
              icon: IconFileAnalytics,
              color: "bg-purple-500",
              id: "builder"
            },
            {
              title: "Dev Utilities",
              desc: "Decode JWTs, format JSON, test Regex, and manage API payloads securely.",
              icon: IconCode,
              color: "bg-orange-500",
              id: "json-formatter"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="apple-card p-10 group cursor-pointer hover:border-primary/30 transition-all active:scale-[0.98]"
              onClick={() => handleNavigate(feature.id)}
            >
              <div className={`w-12 h-12 ${feature.color} flex items-center justify-center rounded-2xl text-white mb-8 shadow-lg shadow-black/10`}>
                <feature.icon size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-muted-foreground font-medium leading-relaxed">
                {feature.desc}
              </p>
              <div className="mt-8 flex items-center text-[14px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Launch Tool <IconArrowRight size={14} className="ml-2" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-32 bg-secondary/30 border-y border-border/40">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-foreground text-background rounded-2xl flex items-center justify-center mx-auto mb-10 shadow-2xl">
            <IconLock size={32} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Privacy is not an option. It's the standard.</h2>
          <p className="text-[18px] text-muted-foreground font-medium mb-12 leading-relaxed">
            We believe that your data belongs to you. Every operation, conversion, and edit happens locally within your browser's private sandbox. We never see your files. No one does.
          </p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50">
            <div className="flex items-center gap-2">
              <IconBolt size={18} />
              <span className="text-[13px] font-black uppercase tracking-widest">End-to-End Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <IconDeviceLaptop size={18} />
              <span className="text-[13px] font-black uppercase tracking-widest">Client-Side Runtime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Full Tool Directory */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="mb-20 text-center space-y-4">
          <h2 className="text-[13px] font-black uppercase tracking-[0.2em] text-primary">The Suite</h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Complete Privacy Toolkit</h3>
        </div>

        <div className="space-y-24">
          {Array.from(new Set(TOOLS.map(t => t.category))).map(category => (
            <div key={category} className="space-y-8">
              <div className="flex items-center gap-4">
                <h4 className="text-[18px] font-bold tracking-tight px-2">{category}</h4>
                <div className="h-px flex-1 bg-border/40" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {TOOLS.filter(t => t.category === category).map(tool => (
                  <motion.div
                    key={tool.id}
                    whileHover={{ y: -4 }}
                    className="apple-card p-6 flex flex-col items-start gap-4 cursor-pointer hover:bg-secondary/40 transition-all border-border/20"
                    onClick={() => handleNavigate(tool.id)}
                  >
                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-foreground/40 shadow-sm border border-border/10">
                      <tool.icon size={20} />
                    </div>
                    <div>
                      <h5 className="font-bold text-[15px] mb-1">{tool.name}</h5>
                      <p className="text-[13px] text-muted-foreground leading-tight">{tool.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-40 px-6 text-center">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-12">Universal tools for<br />privacy-first work.</h2>
        <div className="space-y-12">
          <div className="flex flex-col items-center gap-4">
            <div className="text-[12px] font-black uppercase tracking-[0.3em] text-primary/50">
              SECURE LOCAL PROCESSING • ZERO SERVER UPLOADS
            </div>
            <div className="h-px w-20 bg-border/40" />
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center flex-wrap justify-center gap-x-2 gap-y-1 text-[13px] font-bold text-muted-foreground text-center">
              Made with <IconHeart size={14} className="text-red-500 fill-red-500" /> by
              <a href="https://x.com/twts_tejas" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">𝕏 Tejas</a>,
              <a href="https://x.com/whoavidwivedi" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">𝕏 Avi</a>,
              <a href="https://x.com/dhirender_0001" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">𝕏 Dhirender</a> &
              <a href="https://x.com/Scalar_skeleton" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">𝕏 Scalar</a>
            </div>

            <div className="flex items-center gap-3 text-[12px] font-medium opacity-40">
              <span>Sponsored by</span>
              <span className="font-black uppercase tracking-widest text-foreground">Real Dev Squad</span>
            </div>
          </div>

          <p className="text-[11px] font-medium text-foreground/20">© 2026 Privacy. All rights reserved.</p>
        </div>
      </section>
    </div>
  );
};
