import React, { useState, useRef, useEffect, useCallback } from 'react';
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
} from 'lucide-react';

/* ── Constellation Canvas Background ───────────────────────────────── */
const ConstellationBg: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let stars: {
      x: number;
      y: number;
      size: number;
      twinkle: number;
      speed: number;
    }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const init = () => {
      resize();
      stars = Array.from({ length: 80 }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        size: Math.random() * 1.5 + 0.5,
        twinkle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.005,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      stars.forEach((star) => {
        star.twinkle += star.speed;
        const opacity = 0.3 + 0.7 * Math.abs(Math.sin(star.twinkle));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(165, 180, 252, ${opacity})`;
        ctx.fill();

        // Soft glow
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(165, 180, 252, ${opacity * 0.1})`;
        ctx.fill();
      });

      // Draw faint constellation lines
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = `rgba(165, 180, 252, ${0.04 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener('resize', init);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', init);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  );
};

/* ── Scroll-to-Top Rocket Button ────────────────────────────────────── */
const RocketButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    setIsLaunching(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
    setTimeout(() => setIsLaunching(false), 1200);
  };

  return (
    <button
      onClick={handleClick}
      className={`group fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full 
        bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 
        text-white shadow-lg shadow-indigo-500/30 
        hover:shadow-xl hover:shadow-indigo-500/40 
        hover:scale-110 active:scale-95 
        transition-all duration-500 
        flex items-center justify-center
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}
        ${isLaunching ? 'animate-rocket-launch' : ''}`}
      aria-label="Scroll to top"
    >
      <ArrowUp
        size={22}
        className={`transition-transform duration-300 ${
          isLaunching ? '-translate-y-1' : 'group-hover:-translate-y-1'
        }`}
      />
      {/* Exhaust particles */}
      {isLaunching && (
        <>
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-amber-400"
              style={{
                bottom: '-4px',
                left: `${40 + Math.random() * 20}%`,
                animation: `exhaust 0.6s ease-out ${i * 0.08}s forwards`,
              }}
            />
          ))}
        </>
      )}
      {/* Ripple on hover */}
      <span className="absolute inset-0 rounded-full border-2 border-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700" />

      <style>{`
        @keyframes rocket-launch {
          0% { transform: translateY(0) scale(1); }
          30% { transform: translateY(4px) scale(0.95); }
          60% { transform: translateY(-8px) scale(1.1); }
          100% { transform: translateY(0) scale(1); }
        }
        .animate-rocket-launch {
          animation: rocket-launch 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes exhaust {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(30px) scale(0); opacity: 0; }
        }
      `}</style>
    </button>
  );
};

/* ── Social Link with Magnetic Effect ───────────────────────────────── */
const MagneticSocial: React.FC<{
  href: string;
  icon: React.ReactNode;
  label: string;
  gradient: string;
  hoverBg: string;
}> = ({ href, icon, label, gradient, hoverBg }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPos({ x: x * 0.3, y: y * 0.3 });
  }, []);

  const handleMouseLeave = useCallback(() => setPos({ x: 0, y: 0 }), []);

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`group relative w-12 h-12 rounded-2xl 
        bg-white/5 border border-white/10 
        flex items-center justify-center 
        text-gray-400 hover:text-white 
        hover:border-transparent
        transition-all duration-300 hover:scale-110`}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: 'transform 0.2s ease-out, color 0.3s, border-color 0.3s, box-shadow 0.3s, background 0.3s',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Hover gradient background */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />
      {/* Glow */}
      <div
        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg -z-10`}
        style={{ background: hoverBg }}
      />
      <span className="relative z-10">{icon}</span>
    </a>
  );
};

/* ── Animated Footer Link ───────────────────────────────────────────── */
const FooterLink: React.FC<{
  href: string;
  children: React.ReactNode;
  delay?: number;
}> = ({ href, children, delay = 0 }) => (
  <li
    className="transform transition-all duration-500"
    style={{ transitionDelay: `${delay}ms` }}
  >
    <a
      href={href}
      className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 py-1.5"
    >
      <span className="w-0 h-[1px] bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-4 transition-all duration-300" />
      <span className="group-hover:translate-x-1 transition-transform duration-300">
        {children}
      </span>
    </a>
  </li>
);

/* ── Heartbeat Animation ────────────────────────────────────────────── */
const HeartBeat: React.FC = () => (
  <span className="inline-flex items-center">
    <Heart
      size={14}
      className="text-red-500 fill-red-500 mx-1"
      style={{ animation: 'heartbeat 1.2s ease-in-out infinite' }}
    />
    <style>{`
      @keyframes heartbeat {
        0%, 100% { transform: scale(1); }
        14% { transform: scale(1.3); }
        28% { transform: scale(1); }
        42% { transform: scale(1.3); }
        70% { transform: scale(1); }
      }
    `}</style>
  </span>
);

/* ── Typing Terminal Effect ─────────────────────────────────────────── */
const TerminalLine: React.FC = () => {
  const [text, setText] = useState('');
  const fullText = '> Ready to build something amazing? ✨';

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-black/20 border border-white/5 font-mono text-sm">
      <Terminal size={14} className="text-emerald-400 flex-shrink-0" />
      <span className="text-emerald-400/80">{text}</span>
      <span className="w-2 h-4 bg-emerald-400/80 animate-pulse" />
    </div>
  );
};

/* ── Main Footer Component ──────────────────────────────────────────── */
const Footer: React.FC = () => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      href: 'https://github.com/AbhishekSinhaa17',
      icon: <Github size={20} />,
      label: 'GitHub',
      gradient: 'from-gray-700 to-gray-900',
      hoverBg: 'rgba(100,100,100,0.3)',
    },
    {
      href: 'https://www.linkedin.com/in/abhisheksinha17',
      icon: <Linkedin size={20} />,
      label: 'LinkedIn',
      gradient: 'from-blue-600 to-blue-800',
      hoverBg: 'rgba(37,99,235,0.3)',
    },
    {
      href: 'https://x.com/Abhishe85338077',
      icon: <Twitter size={20} />,
      label: 'Twitter',
      gradient: 'from-sky-500 to-blue-600',
      hoverBg: 'rgba(14,165,233,0.3)',
    },
    {
      href: 'mailto:abhiks1710@gmail.com',
      icon: <Mail size={20} />,
      label: 'Email',
      gradient: 'from-purple-500 to-pink-600',
      hoverBg: 'rgba(168,85,247,0.3)',
    },
  ];

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
      <RocketButton />

      <footer className="relative bg-[#08080f] border-t border-white/[0.04] overflow-hidden">
        {/* Constellation Background */}
        <ConstellationBg />

        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

        {/* ── Top CTA Banner ─────────────────────────────────────── */}
        <div className="relative z-10 border-b border-white/[0.04]">
          <div className="container mx-auto px-4 md:px-6 py-16">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 max-w-6xl mx-auto">
              <div className="text-center lg:text-left">
                <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
                  Let's create something{' '}
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    extraordinary
                  </span>
                </h3>
                <p className="text-gray-400 text-lg max-w-xl">
                  Got a project, idea, or just want to say hi? I'd love to hear from you.
                </p>
              </div>

              <a
                href="#contact"
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-semibold text-base overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/25 hover:scale-105 active:scale-[0.98]"
              >
                {/* Animated gradient bg */}
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-[length:200%_200%] animate-gradient-flow" />
                {/* Glass overlay */}
                <span className="absolute inset-0 bg-white/[0.08] rounded-2xl" />
                {/* Shimmer */}
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                </span>
                <span className="relative flex items-center gap-2">
                  <Sparkles size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                  Start a Conversation
                  <ExternalLink
                    size={16}
                    className="opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                  />
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* ── Main Footer Content ────────────────────────────────── */}
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
            {/* ─ Brand Column ─────────────────────────────────── */}
            <div className="lg:col-span-5">
              {/* Logo */}
              <a href="#" className="inline-flex items-center gap-3 mb-6 group">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow duration-500">
                  <Code2 size={20} className="text-white" />
                  <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-white">
                  Abhishek
                  <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    .dev
                  </span>
                </span>
              </a>

              <p className="text-gray-400 leading-relaxed mb-6 max-w-md text-sm">
                Crafting elegant, high-performance digital experiences with modern
                technologies. Passionate about clean code, thoughtful UX, and
                pushing the boundaries of what's possible on the web.
              </p>

              {/* Terminal typing effect */}
              <div className="mb-8 max-w-sm">
                <TerminalLine />
              </div>

              {/* Social links */}
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <MagneticSocial key={social.label} {...social} />
                ))}
              </div>
            </div>

            {/* ─ Quick Links ──────────────────────────────────── */}
            <div
              className="lg:col-span-2"
              onMouseEnter={() => setHoveredSection('quick')}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-300 mb-6 flex items-center gap-2">
                <span className="w-5 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                Navigate
              </h4>
              <ul className="space-y-1">
                {quickLinks.map((link, i) => (
                  <FooterLink
                    key={link.label}
                    href={link.href}
                    delay={hoveredSection === 'quick' ? i * 50 : 0}
                  >
                    {link.label}
                  </FooterLink>
                ))}
              </ul>
            </div>

            {/* ─ Resources ────────────────────────────────────── */}
            <div
              className="lg:col-span-2"
              onMouseEnter={() => setHoveredSection('resources')}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-300 mb-6 flex items-center gap-2">
                <span className="w-5 h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                Resources
              </h4>
              <ul className="space-y-1">
                {resourceLinks.map((link, i) => (
                  <FooterLink
                    key={link.label}
                    href={link.href}
                    delay={hoveredSection === 'resources' ? i * 50 : 0}
                  >
                    <span className="flex items-center gap-1.5">
                      {link.label}
                      {link.external && (
                        <ExternalLink size={12} className="opacity-50" />
                      )}
                    </span>
                  </FooterLink>
                ))}
              </ul>
            </div>

            {/* ─ Contact / CTA Card ───────────────────────────── */}
            <div className="lg:col-span-3">
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-300 mb-6 flex items-center gap-2">
                <span className="w-5 h-[2px] bg-gradient-to-r from-pink-500 to-amber-500 rounded-full" />
                Get in Touch
              </h4>

              {/* Info items */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <Mail size={14} className="text-indigo-400" />
                  </div>
                  <a
                    href="mailto:abhiks1710@gmail.com"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    abhiks1710@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <MapPin size={14} className="text-emerald-400" />
                  </div>
                  <span className="text-gray-400">Bangalore, India</span>
                </div>
              </div>

              {/* Availability badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                </span>
                <span className="text-sm font-medium text-emerald-400">
                  Available for work
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ─────────────────────────────────────────── */}
        <div className="relative z-10 border-t border-white/[0.04]">
          <div className="container mx-auto px-4 md:px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-6xl mx-auto">
              {/* Copyright */}
              <p className="text-gray-500 text-sm flex items-center gap-1 flex-wrap justify-center">
                <span>© {currentYear}</span>
                <span className="text-gray-600">·</span>
                <span>Crafted with</span>
                <HeartBeat />
                <span>&</span>
                <Coffee size={14} className="text-amber-500 mx-0.5" />
                <span>by</span>
                <a
                  href="#"
                  className="font-semibold text-gray-300 hover:text-white transition-colors duration-300 ml-1"
                >
                  Abhishek Sinha
                </a>
              </p>

              {/* Tech stack pills */}
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {['React', 'TypeScript', 'Tailwind'].map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-white/5 border border-white/[0.06] text-gray-500 hover:text-gray-300 hover:border-white/10 transition-all duration-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Global Keyframes ──────────────────────────────────────── */}
      <style>{`
        @keyframes gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-flow {
          background-size: 200% 200%;
          animation: gradient-flow 4s ease infinite;
        }
      `}</style>
    </>
  );
};

export default Footer;