import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useInView } from '../hooks/useInView';
import croppedImage from "../images/cropped_image.png";
import {
  Code2,
  Gamepad2,
  Music,
  BookOpen,
  Mountain,
  Coffee,
  Lightbulb,
  Users,
  Rocket,
  Target,
  Heart,
  Flame,
} from 'lucide-react';

/* ── animated counter ──────────────────────────────────────── */
const useCounter = (end: number, duration: number, start: boolean) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, end, duration]);
  return count;
};

/* ── stat card ─────────────────────────────────────────────── */
const StatCard: React.FC<{
  value: number;
  suffix: string;
  label: string;
  icon: string;
  started: boolean;
  delay: string;
  inView: boolean;
}> = ({ value, suffix, label, icon, started, delay, inView }) => {
  const count = useCounter(value, 2000, started);
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl p-[1.5px] transition-all duration-700 ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: delay }}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-teal-400 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative rounded-2xl bg-white dark:bg-gray-900 px-4 py-5 text-center backdrop-blur-sm">
        <span className="text-2xl mb-2 block">{icon}</span>
        <p className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">
          {count}
          {suffix}
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase">
          {label}
        </p>
      </div>
    </div>
  );
};

/* ── journey milestone ─────────────────────────────────────── */
const JourneyMilestone: React.FC<{
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  index: number;
  inView: boolean;
  isLast?: boolean;
}> = ({ year, title, description, icon, gradient, index, inView, isLast }) => (
  <div
    className={`relative flex gap-5 transition-all duration-700 ${
      inView ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
    }`}
    style={{ transitionDelay: `${600 + index * 200}ms` }}
  >
    {/* Timeline spine */}
    <div className="flex flex-col items-center">
      <div
        className={`relative z-10 w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
      >
        {icon}
        {/* Pulse ring */}
        <span
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient}`}
          style={{ animation: 'pulse-ring 2.5s ease-out infinite' }}
        />
      </div>
      {!isLast && (
        <div className="w-[2px] flex-1 min-h-[40px] bg-gradient-to-b from-blue-300 to-purple-300 dark:from-blue-700 dark:to-purple-700 mt-2 rounded-full" />
      )}
    </div>

    {/* Content */}
    <div className="pb-8 group">
      <span
        className={`inline-block text-[11px] font-bold tracking-[0.15em] uppercase bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-1`}
      >
        {year}
      </span>
      <h4 className="font-bold text-gray-800 dark:text-gray-100 text-base mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
        {title}
      </h4>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

/* ── interest card ─────────────────────────────────────────── */
const InterestCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  bgGlow: string;
  index: number;
  inView: boolean;
}> = ({ icon, title, description, gradient, bgGlow, index, inView }) => (
  <div
    className={`group relative rounded-2xl overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10 ${
      inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
    }`}
    style={{ transitionDelay: `${800 + index * 120}ms` }}
  >
    <div className="relative bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-5 hover:border-blue-400/50 dark:hover:border-blue-500/50 transition-all duration-500 h-full">
      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 30% 50%, ${bgGlow}, transparent 70%)`,
        }}
      />
      <div className="relative">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-3 shadow-sm group-hover:shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
        >
          {icon}
        </div>
        <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {title}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  </div>
);

/* ── value proposition card ────────────────────────────────── */
const ValueCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  index: number;
  inView: boolean;
}> = ({ icon, title, description, gradient, index, inView }) => (
  <div
    className={`group relative rounded-2xl p-[1.5px] bg-gradient-to-r ${gradient} overflow-hidden transition-all duration-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 ${
      inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
    }`}
    style={{ transitionDelay: `${1000 + index * 150}ms` }}
  >
    <div className="relative rounded-2xl bg-white dark:bg-gray-900 p-5 h-full">
      <div className="flex items-start gap-4">
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 mb-1">
            {title}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  </div>
);

/* ── fun fact pill ─────────────────────────────────────────── */
const FunFact: React.FC<{
  emoji: string;
  text: string;
  index: number;
  inView: boolean;
}> = ({ emoji, text, index, inView }) => (
  <div
    className={`group inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-400/50 dark:hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10 cursor-default ${
      inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
    }`}
    style={{ transitionDelay: `${1300 + index * 100}ms` }}
  >
    <span className="text-lg group-hover:scale-125 transition-transform duration-300">
      {emoji}
    </span>
    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
      {text}
    </span>
  </div>
);

/* ── main component ────────────────────────────────────────── */
const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.12 });
  const [countersStarted, setCountersStarted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isInView) setCountersStarted(true);
  }, [isInView]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 16,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 16,
    });
  }, []);

  const stats = [
    { value: 8, suffix: '+', label: 'Projects Built', icon: '🚀' },
    { value: 10, suffix: '+', label: 'Tech Skills', icon: '⚡' },
    { value: 200, suffix: '+', label: 'GitHub Commits', icon: '💻' },
  ];

  const journeyMilestones = [
    {
      year: 'The Spark',
      title: 'Wrote My First "Hello World"',
      description:
        'Got hooked on programming with C++ during college. The thrill of seeing code come alive on screen was addictive — I knew this was my path.',
      icon: <Flame size={18} />,
      gradient: 'from-orange-500 to-red-500',
    },
    {
      year: 'Deep Dive',
      title: 'Fell in Love with Web Development',
      description:
        'Discovered React and the MERN stack. Built my first full-stack app and deployed it live. The feeling of shipping something real was unmatched.',
      icon: <Code2 size={18} />,
      gradient: 'from-blue-500 to-indigo-500',
    },
    {
      year: 'Building Phase',
      title: '8+ Projects & Counting',
      description:
        'From a music streaming platform to an AI chatbot — each project pushed my limits and taught me something new about clean architecture and user experience.',
      icon: <Rocket size={18} />,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      year: 'Now',
      title: 'Ready for the Real World',
      description:
        'Graduated with a B.E in ISE, battle-tested through personal projects, and hungry to join a team where I can grow fast and make an impact.',
      icon: <Target size={18} />,
      gradient: 'from-emerald-500 to-teal-500',
    },
  ];

  const interests = [
    {
      icon: <Gamepad2 size={18} />,
      title: 'Gaming',
      description: 'Strategy & RPGs keep my problem-solving sharp',
      gradient: 'from-purple-500 to-indigo-500',
      bgGlow: 'rgba(139,92,246,0.08)',
    },
    {
      icon: <Music size={18} />,
      title: 'Music',
      description: 'Lo-fi beats fuel my coding sessions',
      gradient: 'from-pink-500 to-rose-500',
      bgGlow: 'rgba(236,72,153,0.08)',
    },
    {
      icon: <BookOpen size={18} />,
      title: 'Tech Blogs',
      description: 'Always reading about new frameworks & patterns',
      gradient: 'from-blue-500 to-cyan-500',
      bgGlow: 'rgba(59,130,246,0.08)',
    },
    {
      icon: <Mountain size={18} />,
      title: 'Exploring',
      description: 'Love discovering new places & cuisines',
      gradient: 'from-emerald-500 to-green-500',
      bgGlow: 'rgba(16,185,129,0.08)',
    },
    {
      icon: <Coffee size={18} />,
      title: 'Chai > Coffee',
      description: 'Hot chai is my secret productivity hack',
      gradient: 'from-amber-500 to-orange-500',
      bgGlow: 'rgba(245,158,11,0.08)',
    },
    {
      icon: <Lightbulb size={18} />,
      title: 'Side Projects',
      description: 'Always tinkering with a new idea on weekends',
      gradient: 'from-yellow-500 to-amber-500',
      bgGlow: 'rgba(234,179,8,0.08)',
    },
  ];

  const values = [
    {
      icon: <Rocket size={16} />,
      title: 'Ship & Iterate',
      description: "I believe in building fast, shipping early, and improving based on real feedback — not chasing perfection in isolation.",
      gradient: 'from-blue-500 via-indigo-500 to-purple-500',
    },
    {
      icon: <Users size={16} />,
      title: 'Team Player',
      description: 'I thrive in collaborative environments. Clear communication and shared ownership make everything better.',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    },
    {
      icon: <Heart size={16} />,
      title: 'User-First Thinking',
      description: "Every line of code should serve the user. I care deeply about intuitive UX and accessible, inclusive design.",
      gradient: 'from-pink-500 via-rose-500 to-red-500',
    },
    {
      icon: <Flame size={16} />,
      title: 'Hungry to Learn',
      description: "I don't just learn what's needed — I actively seek out new technologies, patterns, and best practices every day.",
      gradient: 'from-amber-500 via-orange-500 to-red-500',
    },
  ];

  const funFacts = [
    { emoji: '🌙', text: 'Night owl coder' },
    { emoji: '🎯', text: 'DSA enthusiast' },
    { emoji: '🎵', text: 'Built a music player' },
    { emoji: '🤖', text: 'Made an AI chatbot' },
    { emoji: '🧩', text: 'Love debugging' },
    { emoji: '📱', text: 'Mobile-first thinker' },
  ];

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-20px) rotate(4deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(18px) rotate(-3deg); }
        }
        @keyframes blob {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          25%      { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          50%      { border-radius: 50% 60% 30% 60% / 40% 70% 60% 30%; }
          75%      { border-radius: 60% 30% 50% 40% / 60% 40% 60% 50%; }
        }
        @keyframes orbit {
          0%   { transform: rotate(0deg) translateX(150px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(150px) rotate(-360deg); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 0.5; }
          70%  { transform: scale(1.4); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
        .glass {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }
        @media (prefers-color-scheme: dark) {
          .glass { background: rgba(0,0,0,0.2); }
        }
      `}</style>

      <section
        id="about"
        ref={sectionRef}
        onMouseMove={handleMouseMove}
        className="relative py-24 md:py-36 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 transition-colors"
      >
        {/* ── background decorations ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-400/8 dark:bg-blue-500/6"
            style={{ animation: 'blob 8s ease-in-out infinite' }}
          />
          <div
            className="absolute top-1/3 -right-32 w-[400px] h-[400px] bg-purple-400/8 dark:bg-purple-500/6"
            style={{ animation: 'blob 10s ease-in-out infinite 2s' }}
          />
          <div
            className="absolute -bottom-24 left-1/4 w-[350px] h-[350px] bg-teal-400/8 dark:bg-teal-500/6"
            style={{ animation: 'blob 12s ease-in-out infinite 4s' }}
          />

          <div
            className="absolute inset-0 opacity-[0.025] dark:opacity-[0.035]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,0,0,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.15) 1px,transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />

          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-400/20 dark:bg-blue-400/10"
              style={{
                width: `${4 + (i % 3) * 3}px`,
                height: `${4 + (i % 3) * 3}px`,
                top: `${10 + i * 11}%`,
                left: `${5 + i * 12}%`,
                animation: `${
                  i % 2 === 0 ? 'float' : 'float-reverse'
                } ${3.5 + i * 0.7}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-6 max-w-7xl">
          {/* ── section header ── */}
          <div
            className={`text-center mb-20 transition-all duration-700 ${
              isInView ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
            }`}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 text-[11px] font-semibold tracking-[0.2em] uppercase rounded-full bg-blue-100/80 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Discover my story
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white">
              About{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-teal-400 bg-clip-text text-transparent">
                  Me
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 100 8"
                  fill="none"
                >
                  <path
                    d="M2 6c16-4 32-4 48-2s32 2 48-2"
                    stroke="url(#about-ug)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="about-ug"
                      x1="0"
                      y1="0"
                      x2="100"
                      y2="0"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#3b82f6" />
                      <stop offset=".5" stopColor="#a855f7" />
                      <stop offset="1" stopColor="#14b8a6" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h2>
          </div>

          {/* ── two‑column layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-start">
            {/* ── image column ── */}
            <div
              className={`lg:col-span-5 transition-all duration-1000 ${
                isInView
                  ? 'translate-x-0 opacity-100'
                  : '-translate-x-14 opacity-0'
              }`}
            >
              <div className="relative mx-auto max-w-sm lg:max-w-none lg:sticky lg:top-28">
                <div className="absolute -inset-5 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/15 to-teal-400/20 blur-3xl opacity-50" />

                <div className="group relative rounded-3xl p-[3px] bg-gradient-to-br from-blue-500 via-purple-500 to-teal-400 shadow-2xl shadow-blue-500/10 dark:shadow-blue-500/5">
                  <div className="relative overflow-hidden rounded-[21px] bg-gray-100 dark:bg-gray-800">
                    <img
                      src={croppedImage}
                      alt="Portrait"
                      className="w-full h-[500px] md:h-[540px] object-cover object-center transition-transform duration-700 will-change-transform group-hover:scale-[1.04]"
                      style={{
                        transform: `perspective(900px) rotateY(${mousePos.x * 0.12}deg) rotateX(${-mousePos.y * 0.12}deg)`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-600" />
                  </div>
                </div>

                <div
                  className="absolute top-1/2 left-1/2 w-4 h-4"
                  style={{ animation: 'orbit 14s linear infinite' }}
                >
                  <span className="block w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/40" />
                </div>

                {/* floating card – projects */}
                <div
                  className="absolute -right-3 md:-right-8 top-10 glass rounded-2xl border border-white/20 dark:border-white/10 px-5 py-4 shadow-xl"
                  style={{ animation: 'float 5s ease-in-out infinite' }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🚀</span>
                    <div>
                      <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
                        8+
                      </p>
                      <p className="text-[10px] text-gray-600 dark:text-gray-300 font-medium uppercase tracking-wider">
                        Projects
                      </p>
                    </div>
                  </div>
                </div>

                {/* floating card – open to work */}
                <div
                  className="absolute -left-3 md:-left-8 bottom-14 glass rounded-2xl border border-white/20 dark:border-white/10 px-5 py-4 shadow-xl"
                  style={{
                    animation: 'float-reverse 6s ease-in-out infinite',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                    </span>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                      Open to Work
                    </p>
                  </div>
                </div>

                <div
                  className="absolute -bottom-5 -right-5 w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/15 to-purple-500/15 -z-10"
                  style={{ animation: 'float 7s ease-in-out infinite 1s' }}
                />
                <div
                  className="absolute -top-5 -left-5 w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500/15 to-blue-500/15 -z-10"
                  style={{
                    animation: 'float-reverse 5s ease-in-out infinite 2s',
                  }}
                />
              </div>
            </div>

            {/* ── content column ── */}
            <div className="lg:col-span-7 space-y-10">
              {/* headline + bio */}
              <div
                className={`transition-all duration-700 delay-200 ${
                  isInView
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-12 opacity-0'
                }`}
              >
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  A Fresher Who{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
                    Builds to Learn
                  </span>
                </h3>
                <p className="text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                  I'm a recent graduate with a{' '}
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    B.E in Information Science
                  </span>{' '}
                  from BMSIT&M and a genuine love for crafting web applications
                  end‑to‑end. I don't just learn from tutorials — I learn by
                  shipping real projects, breaking things, and figuring out how to
                  fix them at 2 AM.
                </p>
              </div>

              <div
                className={`transition-all duration-700 delay-[350ms] ${
                  isInView
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-12 opacity-0'
                }`}
              >
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  I believe great software is built by people who care — about the
                  user, the code quality, and the team. I'm actively looking for
                  my first professional role where I can bring my energy, learn
                  from experienced developers, and contribute from day one.
                </p>
              </div>

              {/* ── stat cards ── */}
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {stats.map((s, i) => (
                  <StatCard
                    key={s.label}
                    {...s}
                    started={countersStarted}
                    delay={`${450 + i * 150}ms`}
                    inView={isInView}
                  />
                ))}
              </div>

              {/* ── my journey ── */}
              <div>
                <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                  My Coding Journey
                </h3>
                <div className="space-y-0">
                  {journeyMilestones.map((milestone, i) => (
                    <JourneyMilestone
                      key={milestone.title}
                      {...milestone}
                      index={i}
                      inView={isInView}
                      isLast={i === journeyMilestones.length - 1}
                    />
                  ))}
                </div>
              </div>

              {/* ── what drives me ── */}
              <div>
                <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-gray-500 dark:text-gray-400 mb-5 flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                  What Drives Me
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {values.map((value, i) => (
                    <ValueCard
                      key={value.title}
                      {...value}
                      index={i}
                      inView={isInView}
                    />
                  ))}
                </div>
              </div>

              {/* ── beyond the code ── */}
              <div>
                <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-gray-500 dark:text-gray-400 mb-5 flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full" />
                  Beyond the Code
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {interests.map((interest, i) => (
                    <InterestCard
                      key={interest.title}
                      {...interest}
                      index={i}
                      inView={isInView}
                    />
                  ))}
                </div>
              </div>

              {/* ── fun facts ── */}
              <div>
                <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
                  Fun Facts
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {funFacts.map((fact, i) => (
                    <FunFact
                      key={fact.text}
                      {...fact}
                      index={i}
                      inView={isInView}
                    />
                  ))}
                </div>
              </div>

              {/* ── education ── */}
              <div
                className={`transition-all duration-700 delay-[1200ms] ${
                  isInView
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-10 opacity-0'
                }`}
              >
                <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-gradient-to-r from-teal-500 to-blue-500 rounded-full" />
                  Education
                </h3>

                <div className="relative border-l-2 border-blue-200 dark:border-blue-800/60 pl-7 space-y-8 ml-2">
                  {[
                    {
                      title: 'B.E in Information Science & Engineering',
                      place: 'BMSIT&M, Bangalore',
                      detail: 'Core CS fundamentals • DSA • OOP • DBMS',
                      color: 'from-blue-500 to-purple-500',
                      icon: '🎓',
                    },
                    {
                      title: 'MERN Stack Development',
                      place: 'Self‑taught & Online Certifications',
                      detail:
                        'MongoDB • Express • React • Node.js • Real‑time Apps',
                      color: 'from-teal-500 to-blue-500',
                      icon: '📚',
                    },
                  ].map((edu, i) => (
                    <div key={i} className="relative group">
                      <span
                        className={`absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-gradient-to-br ${edu.color} ring-4 ring-white dark:ring-gray-900 transition-transform duration-300 group-hover:scale-125`}
                      />
                      <span
                        className={`absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-gradient-to-br ${edu.color}`}
                        style={{
                          animation: 'pulse-ring 2.5s ease-out infinite',
                        }}
                      />
                      <div className="glass rounded-xl border border-white/20 dark:border-white/10 p-5 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 group-hover:-translate-y-0.5">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl mt-0.5">{edu.icon}</span>
                          <div>
                            <h4 className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {edu.title}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                              {edu.place}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-mono tracking-wide">
                              {edu.detail}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── CTA ── */}
              <div
                className={`flex flex-wrap gap-4 pt-2 transition-all duration-700 delay-[1400ms] ${
                  isInView
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0'
                }`}
              >
                <a
                  href="#projects"
                  className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white overflow-hidden transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 transition-transform duration-500 group-hover:scale-105" />
                  <span className="relative z-10 flex items-center gap-2">
                    View My Projects
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </a>

                <a
                  href="#contact"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/10"
                >
                  Let's Connect
                  <span className="transition-transform duration-300 group-hover:rotate-12">
                    👋
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;