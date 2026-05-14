import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Heart,
  Github,
  Linkedin,
  Twitter,
  ArrowUp,
  Sparkles,
  Mail,
  MapPin,
  Code2,
  ExternalLink,
  Terminal,
  Coffee,
  Send,
  Check,
} from 'lucide-react';

/* ────────────────────────────────────────────────────────────────────
   Theme Hook — detects light/dark mode
   ──────────────────────────────────────────────────────────────────── */
const useTheme = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return true;
    return (
      document.documentElement.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      setIsDark(
        document.documentElement.classList.contains('dark') || mq.matches
      );
    };
    mq.addEventListener('change', handler);

    // Observe class changes on <html> for manual theme toggles
    const observer = new MutationObserver(handler);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      mq.removeEventListener('change', handler);
      observer.disconnect();
    };
  }, []);

  return isDark;
};

/* ────────────────────────────────────────────────────────────────────
   Reduced Motion Hook
   ──────────────────────────────────────────────────────────────────── */
const useReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
};

/* ────────────────────────────────────────────────────────────────────
   Aurora / Particle Background — adapts to theme
   ──────────────────────────────────────────────────────────────────── */
const AuroraBg: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId = 0;
    let particles: {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      twinkle: number;
      speed: number;
      hue: number;
    }[] = [];

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const { offsetWidth: w, offsetHeight: h } = canvas;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    const init = () => {
      resize();
      const count = Math.min(
        70,
        Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 18000)
      );
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        size: Math.random() * 1.4 + 0.4,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        twinkle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.005,
        hue: Math.random() * 60 + 220, // indigo→purple range
      }));
    };

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Particle base color — adapts to theme
      const baseR = isDark ? 165 : 99;
      const baseG = isDark ? 180 : 102;
      const baseB = isDark ? 252 : 241;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        p.twinkle += p.speed;

        const opacity =
          (0.3 + 0.7 * Math.abs(Math.sin(p.twinkle))) * (isDark ? 1 : 0.55);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${baseR}, ${baseG}, ${baseB}, ${opacity})`;
        ctx.fill();

        // Soft glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${baseR}, ${baseG}, ${baseB}, ${opacity * 0.08})`;
        ctx.fill();
      });

      // Constellation lines
      const maxDist = 110;
      const maxDistSq = maxDist * maxDist;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < maxDistSq) {
            const alpha =
              (isDark ? 0.06 : 0.04) * (1 - distSq / maxDistSq);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${baseR}, ${baseG}, ${baseB}, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      if (!reduced) animationId = requestAnimationFrame(draw);
    };

    init();
    draw();
    const onResize = () => init();
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', onResize);
    };
  }, [isDark, reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: isDark ? 0.85 : 0.5 }}
    />
  );
};

/* ────────────────────────────────────────────────────────────────────
   Aurora Blobs — soft animated gradient orbs
   ──────────────────────────────────────────────────────────────────── */
const AuroraBlobs: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30 dark:opacity-40 blur-3xl bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 animate-blob-1" />
    <div className="absolute top-1/3 -right-32 w-[28rem] h-[28rem] rounded-full opacity-25 dark:opacity-35 blur-3xl bg-gradient-to-br from-pink-400 via-rose-400 to-amber-300 animate-blob-2" />
    <div className="absolute -bottom-32 left-1/3 w-[26rem] h-[26rem] rounded-full opacity-25 dark:opacity-30 blur-3xl bg-gradient-to-br from-cyan-400 via-sky-400 to-indigo-500 animate-blob-3" />
  </div>
);

/* ────────────────────────────────────────────────────────────────────
   Scroll-to-Top Button — premium, theme-aware
   ──────────────────────────────────────────────────────────────────── */
const ScrollTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setIsVisible(scrolled > 400);
      setProgress(max > 0 ? Math.min(scrolled / max, 1) : 0);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    setIsLaunching(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setIsLaunching(false), 900);
  };

  const circumference = 2 * Math.PI * 22;

  return (
    <button
      onClick={handleClick}
      aria-label="Scroll to top"
      className={`group fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 w-14 h-14 rounded-full
        transition-all duration-500
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'}
        ${isLaunching ? 'animate-rocket' : ''}`}
    >
      {/* Progress ring */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
        <circle
          cx="24"
          cy="24"
          r="22"
          fill="none"
          className="stroke-slate-300/40 dark:stroke-white/10"
          strokeWidth="2"
        />
        <circle
          cx="24"
          cy="24"
          r="22"
          fill="none"
          stroke="url(#scroll-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          style={{ transition: 'stroke-dashoffset 0.2s ease' }}
        />
        <defs>
          <linearGradient id="scroll-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>

      {/* Button core */}
      <span
        className="absolute inset-1 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
          shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/40
          group-hover:shadow-xl group-hover:shadow-purple-500/40
          group-hover:scale-105 group-active:scale-95
          transition-all duration-300
          flex items-center justify-center"
      >
        <ArrowUp
          size={20}
          className={`text-white transition-transform duration-300 ${
            isLaunching ? '-translate-y-2 opacity-0' : 'group-hover:-translate-y-0.5'
          }`}
        />
      </span>

      <style>{`
        @keyframes rocket {
          0% { transform: translateY(0) scale(1); }
          25% { transform: translateY(4px) scale(0.94); }
          60% { transform: translateY(-10px) scale(1.08); }
          100% { transform: translateY(0) scale(1); }
        }
        .animate-rocket { animation: rocket 0.9s cubic-bezier(0.34, 1.56, 0.64, 1); }
      `}</style>
    </button>
  );
};

/* ────────────────────────────────────────────────────────────────────
   Magnetic Social Button — refined with tilt
   ──────────────────────────────────────────────────────────────────── */
const MagneticSocial: React.FC<{
  href: string;
  icon: React.ReactNode;
  label: string;
  brandColor: string;
}> = ({ href, icon, label, brandColor }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [transform, setTransform] = useState('');

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTransform(
      `translate(${x * 0.25}px, ${y * 0.25}px) rotateX(${-y * 0.3}deg) rotateY(${x * 0.3}deg) scale(1.1)`
    );
  }, []);

  const handleMouseLeave = useCallback(() => setTransform(''), []);

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative w-11 h-11 rounded-xl
        bg-white/60 dark:bg-white/5
        border border-slate-200/80 dark:border-white/10
        backdrop-blur-md
        text-slate-600 dark:text-slate-300
        hover:text-white dark:hover:text-white
        flex items-center justify-center
        shadow-sm hover:shadow-lg"
      style={{
        transform: transform || 'translate(0,0)',
        transformStyle: 'preserve-3d',
        transition:
          'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.3s, box-shadow 0.3s, border-color 0.3s',
        boxShadow: transform ? `0 10px 30px -10px ${brandColor}` : undefined,
      }}
    >
      <span
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: brandColor }}
      />
      <span
        className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-60 blur-xl transition-opacity duration-500 -z-10"
        style={{ background: brandColor }}
      />
      <span className="relative z-10">{icon}</span>
    </a>
  );
};

/* ────────────────────────────────────────────────────────────────────
   Footer Link with shimmer underline
   ──────────────────────────────────────────────────────────────────── */
const FooterLink: React.FC<{
  href: string;
  children: React.ReactNode;
  external?: boolean;
}> = ({ href, children, external }) => (
  <li>
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="group inline-flex items-center gap-2 py-1.5
        text-slate-600 dark:text-slate-400
        hover:text-slate-900 dark:hover:text-white
        transition-colors duration-300"
    >
      <span className="w-0 h-[1.5px] bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-4 transition-all duration-300 rounded-full" />
      <span className="group-hover:translate-x-1 transition-transform duration-300 text-sm">
        {children}
      </span>
      {external && (
        <ExternalLink
          size={11}
          className="opacity-0 -ml-1 group-hover:opacity-60 group-hover:ml-0 transition-all duration-300"
        />
      )}
    </a>
  </li>
);

/* ────────────────────────────────────────────────────────────────────
   Heartbeat
   ──────────────────────────────────────────────────────────────────── */
const HeartBeat: React.FC = () => (
  <Heart
    size={13}
    className="text-rose-500 fill-rose-500 mx-0.5 inline-block"
    style={{ animation: 'heartbeat 1.4s ease-in-out infinite' }}
  />
);

/* ────────────────────────────────────────────────────────────────────
   Terminal typing — restarts when in view
   ──────────────────────────────────────────────────────────────────── */
const TerminalLine: React.FC = () => {
  const [text, setText] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const fullText = '> ready to build something amazing?';

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let interval: ReturnType<typeof setInterval> | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !interval) {
            let i = 0;
            setText('');
            interval = setInterval(() => {
              if (i <= fullText.length) {
                setText(fullText.slice(0, i));
                i++;
              } else if (interval) {
                clearInterval(interval);
                interval = null;
              }
            }, 55);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="flex items-center gap-2.5 px-4 py-3 rounded-xl
        bg-slate-900/5 dark:bg-black/30
        border border-slate-300/60 dark:border-white/10
        backdrop-blur-sm
        font-mono text-sm"
    >
      <span className="flex gap-1.5">
        <span className="w-2 h-2 rounded-full bg-rose-400/80" />
        <span className="w-2 h-2 rounded-full bg-amber-400/80" />
        <span className="w-2 h-2 rounded-full bg-emerald-400/80" />
      </span>
      <Terminal size={13} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 ml-1" />
      <span className="text-emerald-700 dark:text-emerald-300/90 text-xs sm:text-sm">
        {text}
      </span>
      <span className="w-1.5 h-3.5 bg-emerald-600 dark:bg-emerald-400/90 animate-blink" />
    </div>
  );
};

/* ────────────────────────────────────────────────────────────────────
   Newsletter form — premium feel
   ──────────────────────────────────────────────────────────────────── */
const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setEmail('');
      }, 2500);
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <div
        className="flex items-center gap-1 p-1.5 rounded-2xl
          bg-white/70 dark:bg-white/[0.04]
          border border-slate-200 dark:border-white/10
          backdrop-blur-md
          shadow-sm
          focus-within:border-indigo-400 dark:focus-within:border-indigo-500/50
          focus-within:shadow-lg focus-within:shadow-indigo-500/10
          transition-all duration-300"
      >
        <Mail size={16} className="ml-3 text-slate-400 dark:text-slate-500 flex-shrink-0" />
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status !== 'idle'}
          className="flex-1 bg-transparent px-2 py-2 text-sm
            text-slate-900 dark:text-white
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status !== 'idle'}
          className="relative px-4 py-2 rounded-xl text-white text-sm font-semibold
            bg-gradient-to-r from-indigo-500 to-purple-600
            hover:from-indigo-600 hover:to-purple-700
            shadow-md shadow-indigo-500/30
            disabled:opacity-80
            transition-all duration-300
            flex items-center gap-1.5
            overflow-hidden"
        >
          {status === 'success' ? (
            <>
              <Check size={14} /> Done
            </>
          ) : status === 'loading' ? (
            <span className="w-3.5 h-3.5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send size={13} />
              <span className="hidden sm:inline">Subscribe</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

/* ────────────────────────────────────────────────────────────────────
   Main Footer
   ──────────────────────────────────────────────────────────────────── */
const Footer: React.FC = () => {
  const isDark = useTheme();
  const currentYear = new Date().getFullYear();

  const socialLinks = useMemo(
    () => [
      {
        href: 'https://github.com/AbhishekSinhaa17',
        icon: <Github size={18} />,
        label: 'GitHub',
        brandColor: 'linear-gradient(135deg, #4b5563, #1f2937)',
      },
      {
        href: 'https://www.linkedin.com/in/abhisheksinha17',
        icon: <Linkedin size={18} />,
        label: 'LinkedIn',
        brandColor: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
      },
      {
        href: 'https://x.com/Abhishe85338077',
        icon: <Twitter size={18} />,
        label: 'Twitter',
        brandColor: 'linear-gradient(135deg, #38bdf8, #0284c7)',
      },
      {
        href: 'mailto:abhiks1710@gmail.com',
        icon: <Mail size={18} />,
        label: 'Email',
        brandColor: 'linear-gradient(135deg, #a855f7, #ec4899)',
      },
    ],
    []
  );

  const quickLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#contact', label: 'Contact' },
  ];

  const resourceLinks = [
    { href: 'https://github.com/AbhishekSinhaa17', label: 'GitHub Repos', external: true },
    { href: '#projects', label: 'Case Studies' },
    { href: '#', label: 'Resume / CV' },
    { href: '#contact', label: 'Hire Me' },
  ];

  return (
    <>
      <ScrollTopButton />

      <footer
        className="relative overflow-hidden
          bg-gradient-to-b from-slate-50 via-white to-slate-100
          dark:from-[#0a0a14] dark:via-[#08080f] dark:to-[#06060c]
          text-slate-700 dark:text-slate-300
          border-t border-slate-200/80 dark:border-white/[0.04]"
      >
        {/* Atmospheric backgrounds */}
        <AuroraBlobs />
        <AuroraBg isDark={isDark} />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.05] pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-400 dark:via-indigo-500 to-transparent" />

        {/* ─── CTA BANNER ─────────────────────────────────────────── */}
        <div className="relative z-10 border-b border-slate-200/60 dark:border-white/[0.04]">
          <div className="container mx-auto px-4 md:px-6 py-14 md:py-20">
            <div className="max-w-6xl mx-auto">
              <div className="relative rounded-3xl p-8 md:p-12 overflow-hidden
                bg-white/60 dark:bg-white/[0.02]
                border border-slate-200/80 dark:border-white/[0.06]
                backdrop-blur-xl
                shadow-xl shadow-indigo-500/5 dark:shadow-indigo-500/10">
                {/* Decorative gradient blob */}
                <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-indigo-400/40 via-purple-400/40 to-pink-400/40 dark:from-indigo-500/30 dark:via-purple-500/30 dark:to-pink-500/30 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-gradient-to-br from-cyan-400/30 via-sky-400/30 to-indigo-400/30 dark:from-cyan-500/20 dark:via-sky-500/20 dark:to-indigo-500/20 blur-3xl pointer-events-none" />

                <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4
                      bg-indigo-500/10 dark:bg-indigo-500/20
                      border border-indigo-500/20 dark:border-indigo-500/30">
                      <Sparkles size={12} className="text-indigo-600 dark:text-indigo-400" />
                      <span className="text-xs font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
                        Let's Collaborate
                      </span>
                    </div>
                    <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3 leading-[1.1]">
                      Let's create something{' '}
                      <span className="relative inline-block">
                        <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-flow">
                          extraordinary
                        </span>
                        <svg
                          className="absolute -bottom-2 left-0 w-full"
                          viewBox="0 0 200 8"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M2 5C40 2 80 2 120 4C160 6 180 4 198 3"
                            stroke="url(#underline-gradient)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient id="underline-gradient" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#6366f1" />
                              <stop offset="50%" stopColor="#a855f7" />
                              <stop offset="100%" stopColor="#ec4899" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </span>
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-xl">
                      Have a project in mind or just want to chat? I'm always open
                      to discussing new ideas and opportunities.
                    </p>
                  </div>

                  <a
                    href="#contact"
                    className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl
                      text-white font-semibold text-sm md:text-base
                      overflow-hidden flex-shrink-0
                      transition-all duration-500
                      hover:scale-105 active:scale-[0.98]
                      shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-purple-500/40"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-[length:200%_200%] animate-gradient-flow" />
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    </span>
                    <Sparkles size={16} className="relative group-hover:rotate-180 transition-transform duration-500" />
                    <span className="relative">Start a Conversation</span>
                    <ExternalLink size={14} className="relative opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── MAIN CONTENT ───────────────────────────────────────── */}
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-14 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 max-w-6xl mx-auto">
            {/* Brand */}
            <div className="lg:col-span-5">
              <a href="#" className="inline-flex items-center gap-3 mb-5 group">
                <div className="relative w-11 h-11 rounded-2xl
                  bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
                  flex items-center justify-center
                  shadow-lg shadow-indigo-500/30
                  group-hover:shadow-xl group-hover:shadow-purple-500/40
                  group-hover:scale-105 group-hover:rotate-3
                  transition-all duration-500">
                  <Code2 size={20} className="text-white relative z-10" />
                  <div className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/20 transition-colors duration-300" />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Abhishek
                  <span className="bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                    .dev
                  </span>
                </span>
              </a>

              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 max-w-md text-sm">
                Crafting elegant, high-performance digital experiences with modern
                technologies. Passionate about clean code, thoughtful UX, and
                pushing the boundaries of what's possible on the web.
              </p>

              <div className="mb-7 max-w-sm">
                <TerminalLine />
              </div>

              {/* Social */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500 mb-3">
                  Follow me
                </p>
                <div className="flex gap-2.5" style={{ perspective: '600px' }}>
                  {socialLinks.map((social) => (
                    <MagneticSocial key={social.label} {...social} />
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-slate-200 mb-5 flex items-center gap-2">
                <span className="w-5 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                Navigate
              </h4>
              <ul className="space-y-0.5">
                {quickLinks.map((link) => (
                  <FooterLink key={link.label} href={link.href}>
                    {link.label}
                  </FooterLink>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="lg:col-span-2">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-slate-200 mb-5 flex items-center gap-2">
                <span className="w-5 h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                Resources
              </h4>
              <ul className="space-y-0.5">
                {resourceLinks.map((link) => (
                  <FooterLink key={link.label} href={link.href} external={link.external}>
                    {link.label}
                  </FooterLink>
                ))}
              </ul>
            </div>

            {/* Get in Touch */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-slate-200 mb-5 flex items-center gap-2">
                <span className="w-5 h-[2px] bg-gradient-to-r from-pink-500 to-amber-500 rounded-full" />
                Get in Touch
              </h4>

              <div className="space-y-3 mb-5">
                <a
                  href="mailto:abhiks1710@gmail.com"
                  className="group flex items-center gap-3 text-sm"
                >
                  <span className="w-8 h-8 rounded-lg
                    bg-indigo-500/10 dark:bg-indigo-500/15
                    border border-indigo-500/20 dark:border-indigo-500/30
                    flex items-center justify-center
                    group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Mail size={13} className="text-indigo-600 dark:text-indigo-400" />
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    abhiks1710@gmail.com
                  </span>
                </a>
                <div className="flex items-center gap-3 text-sm">
                  <span className="w-8 h-8 rounded-lg
                    bg-emerald-500/10 dark:bg-emerald-500/15
                    border border-emerald-500/20 dark:border-emerald-500/30
                    flex items-center justify-center">
                    <MapPin size={13} className="text-emerald-600 dark:text-emerald-400" />
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">Bangalore, India</span>
                </div>
              </div>

              {/* Newsletter */}
              {/* <p className="text-xs text-slate-500 dark:text-slate-500 mb-2">
                Get occasional updates — no spam.
              </p> */}
              {/* <Newsletter /> */}

              {/* Availability */}
              <div className="mt-5 inline-flex items-center gap-2 px-3.5 py-2 rounded-full
                bg-emerald-500/10 dark:bg-emerald-500/15
                border border-emerald-500/20 dark:border-emerald-500/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 dark:bg-emerald-400" />
                </span>
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  Available for new projects
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── BOTTOM BAR ─────────────────────────────────────────── */}
        <div className="relative z-10 border-t border-slate-200/60 dark:border-white/[0.04] backdrop-blur-sm">
          <div className="container mx-auto px-4 md:px-6 py-5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-6xl mx-auto">
              <p className="text-slate-500 dark:text-slate-500 text-xs sm:text-sm flex items-center gap-1 flex-wrap justify-center">
                <span>© {currentYear}</span>
                <span className="opacity-50">·</span>
                <span>Crafted with</span>
                <HeartBeat />
                <span>&</span>
                <Coffee size={13} className="text-amber-500 mx-0.5 inline-block" />
                <span>by</span>
                <a
                  href="#"
                  className="font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-300 ml-1"
                >
                  Abhishek Sinha
                </a>
              </p>

              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                {['React', 'TypeScript', 'Tailwind'].map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md
                      bg-slate-100 dark:bg-white/5
                      border border-slate-200/80 dark:border-white/[0.08]
                      text-slate-600 dark:text-slate-500
                      hover:text-slate-900 dark:hover:text-slate-300
                      hover:border-indigo-400/50 dark:hover:border-indigo-500/30
                      hover:bg-indigo-50 dark:hover:bg-indigo-500/5
                      transition-all duration-300 cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── Global keyframes ─────────────────────────────────────── */}
      <style>{`
        @keyframes gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-flow {
          background-size: 200% 200%;
          animation: gradient-flow 5s ease infinite;
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          14% { transform: scale(1.3); }
          28% { transform: scale(1); }
          42% { transform: scale(1.3); }
          70% { transform: scale(1); }
        }
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .animate-blink { animation: blink 1s steps(1) infinite; }

        @keyframes blob-1 {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(40px,-30px) scale(1.1); }
          66% { transform: translate(-20px,20px) scale(0.95); }
        }
        @keyframes blob-2 {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(-30px,40px) scale(1.05); }
          66% { transform: translate(30px,-20px) scale(0.9); }
        }
        @keyframes blob-3 {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(30px,-40px) scale(0.9); }
          66% { transform: translate(-40px,-20px) scale(1.1); }
        }
        .animate-blob-1 { animation: blob-1 18s ease-in-out infinite; }
        .animate-blob-2 { animation: blob-2 22s ease-in-out infinite; }
        .animate-blob-3 { animation: blob-3 20s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .animate-gradient-flow,
          .animate-blob-1,
          .animate-blob-2,
          .animate-blob-3,
          .animate-blink {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default Footer;
