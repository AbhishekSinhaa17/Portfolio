import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useInView } from '../hooks/useInView';
import croppedImage from '../images/cropped_image.jpeg';

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

/* ── tech category component ───────────────────────────────── */
const TechCategory: React.FC<{
  title: string;
  techs: string[];
  gradient: string;
  inView: boolean;
  delay: string;
}> = ({ title, techs, gradient, inView, delay }) => (
  <div
    className={`transition-all duration-700 ${
      inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
    }`}
    style={{ transitionDelay: delay }}
  >
    <h4
      className={`text-xs font-bold tracking-[0.15em] uppercase mb-3 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
    >
      {title}
    </h4>
    <div className="flex flex-wrap gap-2">
      {techs.map((tech, i) => (
        <span
          key={tech}
          className="group/badge relative px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border border-gray-200/80 dark:border-gray-700/80 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/10 cursor-default"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <span className="relative z-10">{tech}</span>
          <div
            className={`absolute inset-0 rounded-lg bg-gradient-to-r ${gradient} opacity-0 group-hover/badge:opacity-10 transition-opacity duration-300`}
          />
        </span>
      ))}
    </div>
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

  const techCategories = [
    {
      title: 'Languages',
      techs: ['JavaScript', 'TypeScript', 'C++'],
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      title: 'Frontend',
      techs: ['React.js', 'Redux', 'HTML5', 'CSS3', 'Tailwind CSS', 'Vite'],
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Backend',
      techs: ['Node.js', 'Express.js', 'Supabase', 'REST APIs', 'JWT', 'Socket.io'],
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Databases',
      techs: ['MongoDB', 'MySQL', 'PostgreSQL'],
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Tools & Platforms',
      techs: ['Git', 'GitHub', 'Postman', 'npm', 'Vercel', 'Render', 'Cloudinary'],
      gradient: 'from-red-500 to-orange-500',
    },
    {
      title: 'Concepts',
      techs: ['DSA', 'OOP', 'Authentication', 'Authorization'],
      gradient: 'from-teal-500 to-blue-500',
    },
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
        @keyframes code-scroll {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
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

          {/* grid */}
          <div
            className="absolute inset-0 opacity-[0.025] dark:opacity-[0.035]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,0,0,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.15) 1px,transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />

          {/* floating particles */}
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
              Discover my journey
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
                    stroke="url(#ug)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="ug" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
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
                isInView ? 'translate-x-0 opacity-100' : '-translate-x-14 opacity-0'
              }`}
            >
              <div className="relative mx-auto max-w-sm lg:max-w-none lg:sticky lg:top-28">
                {/* glow */}
                <div className="absolute -inset-5 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/15 to-teal-400/20 blur-3xl opacity-50" />

                {/* gradient border frame */}
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
                    {/* shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-600" />
                  </div>
                </div>

                {/* orbiting dot */}
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
                  style={{ animation: 'float-reverse 6s ease-in-out infinite' }}
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

                {/* deco shapes */}
                <div
                  className="absolute -bottom-5 -right-5 w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/15 to-purple-500/15 -z-10"
                  style={{ animation: 'float 7s ease-in-out infinite 1s' }}
                />
                <div
                  className="absolute -top-5 -left-5 w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500/15 to-blue-500/15 -z-10"
                  style={{ animation: 'float-reverse 5s ease-in-out infinite 2s' }}
                />
              </div>
            </div>

            {/* ── content column ── */}
            <div className="lg:col-span-7 space-y-10">
              {/* headline + bio */}
              <div
                className={`transition-all duration-700 delay-200 ${
                  isInView ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
                }`}
              >
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  A Fresher Full‑Stack Developer Who{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
                    Builds to Learn
                  </span>
                </h3>
                <p className="text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                  I'm a recent graduate with a{' '}
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    B.E in Information Science
                  </span>{' '}
                  from BMSIT&M and a genuine love for crafting web applications end‑to‑end.
                  I've channelled my curiosity into{' '}
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    8+ personal &amp; academic projects
                  </span>{' '}
                  spanning React front‑ends, Node/Express APIs, real‑time sockets, and cloud
                  databases — each one a lesson in shipping real code.
                </p>
              </div>

              <div
                className={`transition-all duration-700 delay-[350ms] ${
                  isInView ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
                }`}
              >
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  I thrive on solving problems — whether it's an algorithm puzzle in C++ or
                  architecting a clean REST API with proper auth flows. I'm comfortable across
                  the MERN stack, write TypeScript by default, and deploy on Vercel &amp; Render.
                  Right now I'm actively looking for my first professional role where I can grow
                  fast and make a real impact.
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

              {/* ── tech stack grid ── */}
              <div
                className={`space-y-5 transition-all duration-700 delay-[700ms] ${
                  isInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                  Tech Arsenal
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {techCategories.map((cat, i) => (
                    <TechCategory
                      key={cat.title}
                      {...cat}
                      inView={isInView}
                      delay={`${800 + i * 100}ms`}
                    />
                  ))}
                </div>
              </div>

              {/* ── education timeline ── */}
              <div
                className={`transition-all duration-700 delay-[1200ms] ${
                  isInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
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
                      {/* dot */}
                      <span
                        className={`absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-gradient-to-br ${edu.color} ring-4 ring-white dark:ring-gray-900 transition-transform duration-300 group-hover:scale-125`}
                      />
                      {/* pulse */}
                      <span
                        className={`absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-gradient-to-br ${edu.color}`}
                        style={{ animation: 'pulse-ring 2.5s ease-out infinite' }}
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
                  isInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
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