import React, { useRef, useState, useEffect } from 'react';
import { useInView } from '../hooks/useInView';

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

/* ── circular progress ring ────────────────────────────────── */
const CircularSkill: React.FC<{
  name: string;
  level: number;
  index: number;
  inView: boolean;
  gradient: string;
}> = ({ name, level, index, inView, gradient }) => {
  const count = useCounter(level, 1800, inView);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * (inView ? level : 0)) / 100;

  return (
    <div
      className={`group relative flex flex-col items-center transition-all duration-700 ${
        inView
          ? 'translate-y-0 opacity-100 scale-100'
          : 'translate-y-10 opacity-0 scale-90'
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className="relative p-5 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-400/50 dark:hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 w-full">
        <div
          className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm`}
        />
        <div className="relative flex flex-col items-center">
          <div className="relative w-24 h-24 mb-3">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                className="stroke-gray-200 dark:stroke-gray-700"
                strokeWidth="6"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={`url(#grad-${index})`}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-[1800ms] ease-out"
              />
              <defs>
                <linearGradient
                  id={`grad-${index}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">
                {count}%
              </span>
            </div>
          </div>
          <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-center">
            {name}
          </h4>
        </div>
      </div>
    </div>
  );
};

/* ── horizontal skill bar ──────────────────────────────────── */
const SkillBar: React.FC<{
  name: string;
  level: number;
  index: number;
  inView: boolean;
}> = ({ name, level, index, inView }) => {
  const count = useCounter(level, 1800, inView);

  return (
    <div
      className={`group transition-all duration-700 ${
        inView ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex justify-between mb-2.5">
        <span className="font-semibold text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {name}
        </span>
        <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">
          {count}%
        </span>
      </div>
      <div className="relative w-full h-3 bg-gray-200/80 dark:bg-gray-700/80 rounded-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-teal-400 transition-all duration-[1800ms] ease-out relative overflow-hidden"
          style={{
            width: inView ? `${level}%` : '0%',
            transitionDelay: `${index * 100}ms`,
          }}
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
            style={{ animation: 'shimmer 2.5s ease-in-out infinite' }}
          />
        </div>
      </div>
    </div>
  );
};

/* ── tech badge ────────────────────────────────────────────── */
const TechBadge: React.FC<{
  name: string;
  index: number;
  inView: boolean;
  color: string;
}> = ({ name, index, inView, color }) => (
  <span
    className={`group/badge relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 cursor-default ${
      inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
    }`}
    style={{
      transitionDelay: `${index * 70}ms`,
      transitionDuration: '600ms',
    }}
  >
    <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${color}`} />
    <span className="relative z-10">{name}</span>
    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover/badge:opacity-100 transition-opacity duration-300" />
  </span>
);

/* ── main skills component ─────────────────────────────────── */
const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });

  const coreSkills = [
    { name: 'React.js', level: 95, gradient: 'from-blue-500 to-cyan-500' },
    { name: 'JavaScript', level: 90, gradient: 'from-yellow-500 to-orange-500' },
    { name: 'C++', level: 90, gradient: 'from-purple-500 to-pink-500' },
    { name: 'Node.js', level: 85, gradient: 'from-green-500 to-emerald-500' },
    { name: 'TypeScript', level: 85, gradient: 'from-blue-600 to-blue-400' },
    { name: 'Express.js', level: 85, gradient: 'from-gray-600 to-gray-400' },
  ];

  // ── SECOND TIER: Horizontal progress bars ──
  const barSkills = [
    { name: 'HTML5', level: 95 },
    { name: 'CSS', level: 92 },
    { name: 'Tailwind CSS', level: 90 },
    { name: 'Data Structures & Algorithms', level: 85 },
    { name: 'OOP', level: 85 },
    { name: 'REST APIs', level: 88 },
    { name: 'Authentication & Authorization', level: 82 },
    { name: 'JWT', level: 80 },
  ];

  // ── THIRD TIER: Badge categories (all remaining tech) ──
  const techCategories = [
    {
      title: 'Frontend Ecosystem',
      color: 'from-blue-500 to-cyan-500',
      techs: ['Redux', 'Vite'],
    },
    {
      title: 'Backend & Real‑time',
      color: 'from-green-500 to-teal-500',
      techs: ['Supabase', 'Socket.io'],
    },
    {
      title: 'Databases',
      color: 'from-purple-500 to-pink-500',
      techs: ['MongoDB', 'MySQL', 'PostgreSQL'],
    },
    {
      title: 'Tools & Platforms',
      color: 'from-orange-500 to-red-500',
      techs: ['Git', 'GitHub', 'Postman', 'npm', 'Vercel', 'Render', 'Cloudinary'],
    },
  ];

  const languages = [
    { name: 'English', level: 'Fluent', flag: '🇬🇧' },
    { name: 'Hindi', level: 'Native', flag: '🇮🇳' },
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
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes spin-slow {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <section
        id="skills"
        ref={sectionRef}
        className="relative py-24 md:py-36 overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/40 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 transition-colors"
      >
        {/* ── background decorations ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-36 right-0 w-[480px] h-[480px] bg-blue-400/[0.07] dark:bg-blue-500/[0.05]"
            style={{ animation: 'blob 9s ease-in-out infinite' }}
          />
          <div
            className="absolute bottom-0 -left-32 w-[400px] h-[400px] bg-purple-400/[0.07] dark:bg-purple-500/[0.05]"
            style={{ animation: 'blob 11s ease-in-out infinite 3s' }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-teal-400/[0.06] dark:bg-teal-500/[0.04]"
            style={{ animation: 'blob 13s ease-in-out infinite 5s' }}
          />

          <div
            className="absolute inset-0 opacity-[0.025] dark:opacity-[0.035]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,0,0,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.12) 1px,transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />

          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-400/20 dark:bg-blue-400/10"
              style={{
                width: `${3 + (i % 3) * 3}px`,
                height: `${3 + (i % 3) * 3}px`,
                top: `${8 + i * 13}%`,
                right: `${5 + i * 11}%`,
                animation: `${
                  i % 2 === 0 ? 'float' : 'float-reverse'
                } ${3 + i * 0.8}s ease-in-out infinite`,
              }}
            />
          ))}

          <div
            className="absolute top-20 right-20 w-40 h-40 border border-dashed border-blue-300/20 dark:border-blue-500/10 rounded-full"
            style={{ animation: 'spin-slow 30s linear infinite' }}
          />
          <div
            className="absolute bottom-32 left-16 w-28 h-28 border border-dashed border-purple-300/20 dark:border-purple-500/10 rounded-full"
            style={{ animation: 'spin-slow 25s linear infinite reverse' }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-6 max-w-7xl">
          {/* ── section header ── */}
          <div
            className={`text-center mb-20 transition-all duration-700 ${
              isInView
                ? 'translate-y-0 opacity-100'
                : '-translate-y-10 opacity-0'
            }`}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 text-[11px] font-semibold tracking-[0.2em] uppercase rounded-full bg-purple-100/80 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/50">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              What I bring to the table
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white">
              My{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-teal-400 bg-clip-text text-transparent">
                  Skills
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 120 8"
                  fill="none"
                >
                  <path
                    d="M2 6c20-4 40-4 58-2s38 2 58-2"
                    stroke="url(#skills-ug)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="skills-ug"
                      x1="0"
                      y1="0"
                      x2="120"
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
            <p className="mt-6 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              A fresher with hands‑on project experience across the{' '}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                full stack
              </span>
              . Here's every tool in my arsenal.
            </p>
          </div>

          {/* ── TIER 1: Circular skill rings ──
              Languages: JavaScript, TypeScript, C++
              Core Framework/Runtime: React.js, Node.js, Express.js
          */}
          <div
            className={`mb-20 transition-all duration-700 delay-100 ${
              isInView
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-gray-500 dark:text-gray-400 mb-8 flex items-center gap-2 justify-center">
              <span className="w-8 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
              Core Expertise
              <span className="w-8 h-[2px] bg-gradient-to-r from-purple-500 to-teal-500 rounded-full" />
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
              {coreSkills.map((skill, i) => (
                <CircularSkill
                  key={skill.name}
                  {...skill}
                  index={i}
                  inView={isInView}
                />
              ))}
            </div>
          </div>

          {/* ── two‑column layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* ── LEFT: Progress bars ──
                Frontend: HTML5, CSS, Tailwind CSS
                Backend: REST APIs, JWT
                Concepts: DSA, OOP, Authentication & Authorization
            */}
            <div>
              <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-gray-500 dark:text-gray-400 mb-8 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                Proficiency
              </h3>
              <div className="space-y-6">
                {barSkills.map((skill, i) => (
                  <SkillBar
                    key={skill.name}
                    {...skill}
                    index={i}
                    inView={isInView}
                  />
                ))}
              </div>

              {/* Languages spoken */}
              <div
                className={`mt-12 transition-all duration-700 delay-[900ms] ${
                  isInView
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0'
                }`}
              >
                <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-gray-500 dark:text-gray-400 mb-5 flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-gradient-to-r from-teal-500 to-blue-500 rounded-full" />
                  Languages I Speak
                </h3>
                <div className="flex flex-wrap gap-3">
                  {languages.map((lang, i) => (
                    <div
                      key={lang.name}
                      className={`group flex items-center gap-3 px-5 py-3 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-400/50 dark:hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10 ${
                        isInView
                          ? 'translate-y-0 opacity-100'
                          : 'translate-y-6 opacity-0'
                      }`}
                      style={{ transitionDelay: `${1000 + i * 120}ms` }}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <div>
                        <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {lang.name}
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                          {lang.level}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT: Tech badges ──
                Frontend: Redux, Vite
                Backend: Supabase, Socket.io
                Databases: MongoDB, MySQL, PostgreSQL
                Tools: Git, GitHub, Postman, npm, Vercel, Render, Cloudinary
            */}
            <div>
              <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-gray-500 dark:text-gray-400 mb-8 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-gradient-to-r from-purple-500 to-teal-500 rounded-full" />
                Technologies & Tools
              </h3>
              <div className="space-y-8">
                {techCategories.map((cat, catIdx) => (
                  <div
                    key={cat.title}
                    className={`transition-all duration-700 ${
                      isInView
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-8 opacity-0'
                    }`}
                    style={{ transitionDelay: `${400 + catIdx * 150}ms` }}
                  >
                    <h4
                      className={`text-xs font-bold tracking-[0.12em] uppercase mb-3 bg-gradient-to-r ${cat.color} bg-clip-text text-transparent`}
                    >
                      {cat.title}
                    </h4>
                    <div className="flex flex-wrap gap-2.5">
                      {cat.techs.map((tech, i) => (
                        <TechBadge
                          key={tech}
                          name={tech}
                          index={catIdx * 5 + i}
                          inView={isInView}
                          color={cat.color}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Complete Stack Verification Card ── */}
              <div
                className={`mt-10 transition-all duration-700 delay-[1000ms] ${
                  isInView
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0'
                }`}
              >
                <div className="relative group p-[1.5px] rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-teal-400 overflow-hidden">
                  <div className="rounded-2xl bg-white dark:bg-gray-900 p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className="text-3xl flex-shrink-0"
                        style={{
                          animation: 'float 4s ease-in-out infinite',
                        }}
                      >
                        🌱
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-1">
                          Currently Exploring
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                          Next.js, Docker, System Design, and AWS fundamentals
                          — always expanding my toolkit to build better,
                          scalable products.
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {['Next.js', 'Docker', 'AWS', 'System Design'].map(
                            (t) => (
                              <span
                                key={t}
                                className="px-3 py-1 rounded-full text-[11px] font-semibold bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50"
                              >
                                {t}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── bottom stat strip ── */}
          <div
            className={`mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-700 delay-[1400ms] ${
              isInView
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            {[
              { icon: '⚡', label: 'Technologies', value: '20+' },
              { icon: '🚀', label: 'Projects Built', value: '8+' },
              { icon: '📦', label: 'npm Packages Used', value: '50+' },
              { icon: '☕', label: 'Cups of Chai', value: '∞' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="group relative text-center p-5 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-400/50 dark:hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10"
              >
                <span
                  className="text-2xl block mb-2"
                  style={{
                    animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                  }}
                >
                  {stat.icon}
                </span>
                <p className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Skills;