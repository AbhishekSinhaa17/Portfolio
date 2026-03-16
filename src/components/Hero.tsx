import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  ArrowDown,
  Github,
  Linkedin,
  Twitter,
  Sparkles,
  Download,
  ExternalLink,
  ChevronRight,
  Play,
  Rocket,
  BookOpen,
  Zap,
  Coffee,
  Code2,
  Braces,
  Terminal,
} from 'lucide-react';

/* ── Animated Particle Network Background ───────────────────────────── */
const ParticleNetwork: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
      pulse: number;
      pulseSpeed: number;
    }[] = [];

    const colors = [
      'rgba(99, 102, 241,',
      'rgba(168, 85, 247,',
      'rgba(236, 72, 153,',
      'rgba(59, 130, 246,',
      'rgba(6, 182, 212,',
    ];

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const init = () => {
      resize();
      const count = Math.min(Math.floor(window.innerWidth / 15), 100);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      }));
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const mouse = mouseRef.current;

      particles.forEach((p, i) => {
        p.pulse += p.pulseSpeed;
        const currentOpacity = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse));

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          p.vx += (dx / dist) * force * 0.3;
          p.vy += (dy / dist) * force * 0.3;
        }

        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = window.innerWidth + 10;
        if (p.x > window.innerWidth + 10) p.x = -10;
        if (p.y < -10) p.y = window.innerHeight + 10;
        if (p.y > window.innerHeight + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentOpacity})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentOpacity * 0.1})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
          if (cdist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.06 * (1 - cdist / 130)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};

/* ── Morphing Blob SVG ──────────────────────────────────────────────── */
const MorphingBlob: React.FC<{
  className?: string;
  gradient: string;
  delay?: number;
  'data-speed'?: string;
}> = ({ className = '', gradient, delay = 0, ...rest }) => (
  <div className={`absolute pointer-events-none ${className}`} {...rest}>
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <linearGradient id={gradient} x1="0%" y1="0%" x2="100%" y2="100%">
          {gradient === 'blob-grad-1' && (
            <>
              <stop offset="0%" stopColor="rgba(99,102,241,0.3)" />
              <stop offset="100%" stopColor="rgba(168,85,247,0.1)" />
            </>
          )}
          {gradient === 'blob-grad-2' && (
            <>
              <stop offset="0%" stopColor="rgba(236,72,153,0.2)" />
              <stop offset="100%" stopColor="rgba(244,114,182,0.05)" />
            </>
          )}
          {gradient === 'blob-grad-3' && (
            <>
              <stop offset="0%" stopColor="rgba(6,182,212,0.2)" />
              <stop offset="100%" stopColor="rgba(59,130,246,0.05)" />
            </>
          )}
        </linearGradient>
      </defs>
      <path
        fill={`url(#${gradient})`}
        className="animate-morph"
        style={{ animationDelay: `${delay}s` }}
      />
    </svg>
    <style>{`
      @keyframes morph {
        0%, 100% {
          d: path("M44.7,-76.4C58.8,-69.2,71.8,-58.8,79.6,-45.2C87.4,-31.6,90.1,-15.8,88.5,-0.9C86.9,14,81,28,72.4,39.7C63.8,51.4,52.5,60.8,39.6,67.4C26.7,74,13.3,77.8,-1.2,79.8C-15.7,81.9,-31.4,82.2,-44.3,75.8C-57.2,69.4,-67.3,56.3,-74.8,42C-82.3,27.7,-87.2,12.2,-86.2,-2.9C-85.2,-18,-78.3,-32.7,-68.6,-44.9C-58.9,-57.1,-46.4,-66.8,-33,-73.5C-19.6,-80.2,-5.2,-83.9,5.8,-79.8C16.8,-75.7,30.6,-83.6,44.7,-76.4Z");
        }
        25% {
          d: path("M43.3,-74.1C56.9,-67.3,69.1,-56.6,76.6,-43.1C84.1,-29.6,86.9,-13.3,85.2,2.1C83.5,17.5,77.3,32.1,68.1,43.7C58.9,55.3,46.7,63.9,33.4,69.8C20.1,75.7,5.7,78.9,-8.3,77.8C-22.3,76.7,-35.9,71.3,-47.8,63.2C-59.7,55.1,-69.9,44.3,-76.3,31.2C-82.7,18.1,-85.3,2.7,-82.9,-11.7C-80.5,-26.1,-73.1,-39.5,-62.5,-49.5C-51.9,-59.5,-38.1,-66.1,-24.5,-73.1C-10.9,-80.1,2.5,-87.5,16.3,-86.2C30.1,-84.9,29.7,-80.9,43.3,-74.1Z");
        }
        50% {
          d: path("M41.9,-71.5C54.7,-65.3,65.8,-54.3,73.6,-41.2C81.4,-28.1,85.9,-12.9,84.8,1.7C83.7,16.3,77,30.2,67.8,42C58.6,53.8,46.9,63.5,33.8,69.5C20.7,75.5,6.2,77.8,-7.9,76.4C-22,75,-35.7,69.9,-47.1,62C-58.5,54.1,-67.6,43.4,-73.8,30.8C-80,18.2,-83.3,3.7,-81.3,-10C-79.3,-23.7,-72,-36.6,-61.8,-46.5C-51.6,-56.4,-38.5,-63.3,-25.3,-69.3C-12.1,-75.3,1.2,-80.4,14.8,-79.7C28.4,-79,29.1,-77.7,41.9,-71.5Z");
        }
        75% {
          d: path("M45.1,-77.5C58.5,-70.5,69.7,-58.5,77.2,-44.6C84.7,-30.7,88.5,-14.9,87.1,-0.1C85.7,14.7,79.1,28.5,70.1,40.3C61.1,52.1,49.7,61.9,36.8,68.2C23.9,74.5,9.5,77.3,-4.4,76.3C-18.3,75.3,-31.7,70.5,-43.5,63.2C-55.3,55.9,-65.5,46.1,-72.5,33.8C-79.5,21.5,-83.3,6.7,-82,-7.4C-80.7,-21.5,-74.3,-34.9,-64.5,-45.3C-54.7,-55.7,-41.5,-63.1,-28.1,-70.1C-14.7,-77.1,-1.1,-83.7,11.2,-82.3C23.5,-80.9,31.7,-84.5,45.1,-77.5Z");
        }
      }
      .animate-morph {
        animation: morph 20s ease-in-out infinite;
      }
    `}</style>
  </div>
);

/* ── Glitch Text Effect ─────────────────────────────────────────────── */
const GlitchText: React.FC<{ text: string; className?: string }> = ({
  text,
  className = '',
}) => (
  <span className={`relative inline-block ${className}`}>
    <span className="relative z-10">{text}</span>
    <span
      className="absolute top-0 left-0 -z-10 text-indigo-500/30 dark:text-indigo-400/20"
      style={{
        animation: 'glitch-1 3s ease-in-out infinite',
        clipPath: 'inset(10% 0 60% 0)',
      }}
    >
      {text}
    </span>
    <span
      className="absolute top-0 left-0 -z-10 text-pink-500/30 dark:text-pink-400/20"
      style={{
        animation: 'glitch-2 3s ease-in-out infinite 0.1s',
        clipPath: 'inset(60% 0 10% 0)',
      }}
    >
      {text}
    </span>
    <style>{`
      @keyframes glitch-1 {
        0%, 100% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(2px, -2px); }
        60% { transform: translate(-1px, 1px); }
        80% { transform: translate(1px, -1px); }
      }
      @keyframes glitch-2 {
        0%, 100% { transform: translate(0); }
        20% { transform: translate(2px, -2px); }
        40% { transform: translate(-2px, 2px); }
        60% { transform: translate(1px, -1px); }
        80% { transform: translate(-1px, 1px); }
      }
    `}</style>
  </span>
);

/* ── Typing Effect with Cursor ──────────────────────────────────────── */
const TypeWriter: React.FC<{ words: string[] }> = ({ words }) => {
  const [currentWord, setCurrentWord] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const word = words[currentWord];

    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 2000);
      return () => clearTimeout(pauseTimeout);
    }

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentChar < word.length) {
            setCurrentChar((c) => c + 1);
          } else {
            setIsPaused(true);
          }
        } else {
          if (currentChar > 0) {
            setCurrentChar((c) => c - 1);
          } else {
            setIsDeleting(false);
            setCurrentWord((w) => (w + 1) % words.length);
          }
        }
      },
      isDeleting ? 40 : 80,
    );

    return () => clearTimeout(timeout);
  }, [currentChar, isDeleting, isPaused, currentWord, words]);

  return (
    <span className="inline-flex items-center">
      <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-bold">
        {words[currentWord].substring(0, currentChar)}
      </span>
      <span
        className="inline-block w-[3px] h-[1.1em] ml-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"
        style={{ animation: 'blink-cursor 1s step-end infinite' }}
      />
      <style>{`
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
};

/* ── Magnetic Social Button ─────────────────────────────────────────── */
const MagneticSocial: React.FC<{
  href: string;
  icon: React.ReactNode;
  label: string;
  gradient: string;
  delay: number;
  isVisible: boolean;
}> = ({ href, icon, label, gradient, delay, isVisible }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPos({ x: x * 0.4, y: y * 0.4 });
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
        bg-white/10 dark:bg-white/5 
        backdrop-blur-sm border border-white/20 dark:border-white/10
        flex items-center justify-center 
        text-gray-600 dark:text-gray-400 
        hover:text-white hover:border-transparent
        transition-all duration-500 hover:scale-110
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px) ${isVisible ? 'translateY(0)' : 'translateY(32px)'}`,
        transition:
          'transform 0.2s ease-out, opacity 0.7s ease, color 0.3s, border-color 0.3s, background 0.3s',
        transitionDelay: `${delay}ms`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <span
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />
      <span
        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`}
        style={{
          background:
            gradient === 'from-gray-700 to-gray-900'
              ? 'rgba(100,100,100,0.3)'
              : gradient === 'from-blue-600 to-blue-800'
              ? 'rgba(37,99,235,0.3)'
              : 'rgba(14,165,233,0.3)',
        }}
      />
      <span className="relative z-10">{icon}</span>
    </a>
  );
};

/* ── Scroll Indicator ───────────────────────────────────────────────── */
const ScrollIndicator: React.FC = () => (
  <a
    href="#about"
    className="group absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-gray-400 dark:text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-300"
    aria-label="Scroll down"
  >
    <span className="text-xs font-semibold uppercase tracking-[0.3em] group-hover:tracking-[0.4em] transition-all duration-300">
      Scroll
    </span>
    <div className="relative w-6 h-10 rounded-full border-2 border-current p-1">
      <div
        className="w-1.5 h-1.5 rounded-full bg-current mx-auto"
        style={{ animation: 'scroll-dot 2s ease-in-out infinite' }}
      />
    </div>
    <style>{`
      @keyframes scroll-dot {
        0%, 100% { transform: translateY(0); opacity: 1; }
        50% { transform: translateY(16px); opacity: 0.3; }
      }
    `}</style>
  </a>
);

/* ── Floating Status Badge ──────────────────────────────────────────── */
const StatusBadge: React.FC<{ isVisible: boolean }> = ({ isVisible }) => (
  <div
    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full
      bg-white/10 dark:bg-white/5 backdrop-blur-xl
      border border-white/20 dark:border-white/10
      shadow-lg shadow-black/5
      transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
      }`}
  >
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
    </span>
    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
      Open to opportunities
    </span>
  </div>
);

/* ── Tech Stack Marquee ─────────────────────────────────────────────── */
const TechMarquee: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const techStack = [
    { name: 'React', icon: '⚛️' },
    { name: 'TypeScript', icon: '🔷' },
    { name: 'Node.js', icon: '🟢' },
    { name: 'MongoDB', icon: '🍃' },
    { name: 'Tailwind', icon: '🎨' },
    { name: 'Next.js', icon: '▲' },
    { name: 'Python', icon: '🐍' },
    { name: 'Firebase', icon: '🔥' },
    { name: 'Git', icon: '📦' },
    { name: 'Redux', icon: '🔄' },
  ];

  // Double the array for seamless loop
  const doubled = [...techStack, ...techStack];

  return (
    <div
      className={`w-full max-w-3xl mx-auto overflow-hidden transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: '1100ms' }}
    >
      {/* Fade edges */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-gray-50 dark:from-[#060612] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-gray-50 dark:from-[#060612] to-transparent pointer-events-none" />

        <div className="flex animate-marquee gap-3">
          {doubled.map((tech, i) => (
            <div
              key={`${tech.name}-${i}`}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl
                bg-white/60 dark:bg-white/[0.04] backdrop-blur-sm
                border border-gray-200/50 dark:border-white/[0.06]
                hover:border-indigo-300/50 dark:hover:border-indigo-500/20
                hover:bg-white/80 dark:hover:bg-white/[0.08]
                transition-all duration-300 cursor-default group"
            >
              <span className="text-sm group-hover:scale-125 transition-transform duration-300">
                {tech.icon}
              </span>
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

/* ── "Currently" Status Cards ───────────────────────────────────────── */
const CurrentlyCards: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const cards = [
    {
      icon: <Rocket size={16} />,
      label: 'Building',
      value: 'Full-Stack Apps',
      gradient: 'from-indigo-500 to-purple-500',
      bgGlow: 'rgba(99,102,241,0.1)',
    },
    {
      icon: <BookOpen size={16} />,
      label: 'Learning',
      value: 'System Design',
      gradient: 'from-emerald-500 to-teal-500',
      bgGlow: 'rgba(16,185,129,0.1)',
    },
    {
      icon: <Zap size={16} />,
      label: 'Exploring',
      value: 'AI & Cloud',
      gradient: 'from-amber-500 to-orange-500',
      bgGlow: 'rgba(245,158,11,0.1)',
    },
    {
      icon: <Coffee size={16} />,
      label: 'Fueled by',
      value: '∞ Chai & Code',
      gradient: 'from-pink-500 to-rose-500',
      bgGlow: 'rgba(236,72,153,0.1)',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className={`group relative rounded-2xl overflow-hidden cursor-default transition-all duration-700 hover:scale-105 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: `${1100 + i * 100}ms` }}
        >
          {/* Glass card */}
          <div className="relative bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-gray-200/50 dark:border-white/[0.06] rounded-2xl p-4 text-center hover:border-gray-300/70 dark:hover:border-white/[0.1] transition-all duration-300">
            {/* Hover glow */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${card.bgGlow}, transparent 70%)`,
              }}
            />

            {/* Icon */}
            <div
              className={`relative inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br ${card.gradient} text-white mb-2 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300`}
            >
              {card.icon}
            </div>

            {/* Label */}
            <p className="relative text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 mb-0.5">
              {card.label}
            </p>

            {/* Value */}
            <p
              className={`relative text-sm font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}
            >
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ── Main Hero Component ────────────────────────────────────────────── */
const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const roles = [
    'Full Stack Developer',
    'Software Engineer',
    'MERN Stack Developer',
    'Problem Solver',
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x, y });

      const elements = heroRef.current.querySelectorAll('.parallax');
      elements.forEach((el) => {
        const speed = Number((el as HTMLElement).dataset.speed || 1);
        (el as HTMLElement).style.transform = `translate(${x * 30 * speed}px, ${y * 30 * speed}px)`;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gray-50/50 dark:bg-[#060612]"
    >
      {/* ── Background Layers ──────────────────────────────────── */}
      <ParticleNetwork />

      <MorphingBlob
        className="parallax -top-32 -left-32 w-[500px] h-[500px] opacity-60 dark:opacity-30"
        gradient="blob-grad-1"
        delay={0}
        data-speed="0.5"
      />
      <MorphingBlob
        className="parallax top-1/4 -right-20 w-[450px] h-[450px] opacity-50 dark:opacity-25"
        gradient="blob-grad-2"
        delay={5}
        data-speed="0.8"
      />
      <MorphingBlob
        className="parallax bottom-20 left-1/4 w-[400px] h-[400px] opacity-40 dark:opacity-20"
        gradient="blob-grad-3"
        delay={10}
        data-speed="0.6"
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50/80 dark:to-[#060612]/80 pointer-events-none" />

      {/* Spotlight */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none opacity-30 dark:opacity-20 transition-transform duration-[2s] ease-out"
        style={{
          background:
            'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          left: `calc(50% + ${mousePos.x * 200}px - 300px)`,
          top: `calc(50% + ${mousePos.y * 200}px - 300px)`,
        }}
      />

      {/* ── Main Content ───────────────────────────────────────── */}
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Status Badge */}
          <div className="mb-8">
            <StatusBadge isVisible={isVisible} />
          </div>

          {/* Greeting */}
          <p
            className={`text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium mb-4 transition-all duration-700 delay-200 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="inline-block animate-wave origin-[70%_70%] mr-2">
              👋
            </span>
            Hey there, I'm
          </p>

          {/* Name */}
          <h1
            className={`text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[0.95] mb-6 transition-all duration-700 delay-300 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <GlitchText
              text="Abhishek"
              className="text-gray-900 dark:text-white"
            />
            <br />
            <span className="relative">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Kumar Sinha
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
              >
                <path
                  d="M2 10C80 2 220 2 298 10"
                  stroke="url(#hero-underline)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: 300,
                    strokeDashoffset: isVisible ? 0 : 300,
                    transition: 'stroke-dashoffset 1.5s ease-out 0.8s',
                  }}
                />
                <defs>
                  <linearGradient
                    id="hero-underline"
                    x1="0"
                    y1="0"
                    x2="300"
                    y2="0"
                  >
                    <stop stopColor="#6366f1" />
                    <stop offset="0.5" stopColor="#a855f7" />
                    <stop offset="1" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          {/* Typewriter Role */}
          <div
            className={`text-xl md:text-2xl lg:text-3xl mb-6 h-10 flex items-center justify-center transition-all duration-700 delay-500 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="text-gray-500 dark:text-gray-400 mr-2">
              I'm a
            </span>
            <TypeWriter words={roles} />
          </div>

          {/* Description */}
          <p
            className={`text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed mb-10 transition-all duration-700 delay-600 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            A passionate fresher crafting full-stack solutions with modern
            technologies. Eager to turn complex challenges into intuitive,
            high-performing digital experiences.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 mb-12 transition-all duration-700 delay-700 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Primary CTA */}
            <a
              href="#projects"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold text-base overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/25 hover:scale-105 active:scale-[0.98]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-[length:200%_200%] animate-gradient-flow" />
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </span>
              <span className="relative flex items-center gap-2">
                <Play
                  size={16}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                View My Work
                <ChevronRight
                  size={16}
                  className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 group-hover:translate-x-0.5 transition-all duration-300"
                />
              </span>
            </a>

            {/* Secondary CTA */}
            <a
              href="#contact"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base overflow-hidden transition-all duration-300 hover:scale-105 active:scale-[0.98]
                bg-white/10 dark:bg-white/5 backdrop-blur-sm
                border border-gray-300/50 dark:border-white/10
                text-gray-800 dark:text-gray-200
                hover:bg-white/20 dark:hover:bg-white/10
                hover:border-indigo-300/50 dark:hover:border-indigo-500/30
                hover:shadow-lg hover:shadow-indigo-500/10"
            >
              <Sparkles
                size={16}
                className="text-indigo-500 group-hover:rotate-12 transition-transform duration-300"
              />
              Let's Talk
            </a>

            {/* Resume CTA */}
            <a
              href="#"
              className="group inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-all duration-300 hover:bg-gray-100/50 dark:hover:bg-white/5"
            >
              <Download
                size={16}
                className="group-hover:translate-y-0.5 transition-transform duration-300"
              />
              Resume
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 mb-14">
            <MagneticSocial
              href="https://github.com/AbhishekSinhaa17"
              icon={<Github size={20} />}
              label="GitHub"
              gradient="from-gray-700 to-gray-900"
              delay={800}
              isVisible={isVisible}
            />
            <MagneticSocial
              href="https://www.linkedin.com/in/abhisheksinha17"
              icon={<Linkedin size={20} />}
              label="LinkedIn"
              gradient="from-blue-600 to-blue-800"
              delay={900}
              isVisible={isVisible}
            />
            <MagneticSocial
              href="https://x.com/Abhishe85338077"
              icon={<Twitter size={20} />}
              label="Twitter"
              gradient="from-sky-500 to-blue-600"
              delay={1000}
              isVisible={isVisible}
            />
          </div>

          {/* ── Currently Cards (replaces old stats) ─────────── */}
          <CurrentlyCards isVisible={isVisible} />

          {/* ── Tech Stack Marquee ───────────────────────────── */}
          <div className="mt-10 w-full">
            <p
              className={`text-xs font-bold uppercase tracking-[0.25em] text-gray-400 dark:text-gray-600 mb-4 transition-all duration-700 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transitionDelay: '1500ms' }}
            >
              Tech I work with
            </p>
            <TechMarquee isVisible={isVisible} />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <ScrollIndicator />

      {/* ── Keyframes ──────────────────────────────────────────── */}
      <style>{`
        @keyframes gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-flow {
          background-size: 200% 200%;
          animation: gradient-flow 4s ease infinite;
        }
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
          60%, 100% { transform: rotate(0deg); }
        }
        .animate-wave {
          animation: wave 2.5s ease-in-out infinite;
          display: inline-block;
        }
      `}</style>
    </section>
  );
};

export default Hero;