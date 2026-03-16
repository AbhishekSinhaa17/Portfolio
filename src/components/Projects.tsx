import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ExternalLink, Github, Sparkles, ArrowUpRight, Code2, Eye } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import geminiImage from '../images/gemini.png';
import pokemonImage from '../images/pokemon.png';
import loanImage from '../images/loan calculator.png';
import tunexImage from '../images/tunex.png';
import hirehubImage from '../images/hirehub.png';

// ── Floating particle background ──────────────────────────────────────
const ParticleField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      pulse: number;
    }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const init = () => {
      resize();
      particles = Array.from({ length: 50 }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;

        if (p.x < 0) p.x = canvas.offsetWidth;
        if (p.x > canvas.offsetWidth) p.x = 0;
        if (p.y < 0) p.y = canvas.offsetHeight;
        if (p.y > canvas.offsetHeight) p.y = 0;

        const currentOpacity = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${currentOpacity})`;
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

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
      style={{ opacity: 0.6 }}
    />
  );
};

// ── Magnetic tilt card wrapper ────────────────────────────────────────
const TiltCard: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({
  children,
  className = '',
  style,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.15,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlare({ x: 50, y: 50, opacity: 0 });
  }, []);

  return (
    <div
      ref={cardRef}
      className={className}
      style={{
        ...style,
        transform,
        transition: 'transform 0.4s cubic-bezier(.03,.98,.52,.99)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {/* Glare overlay */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none z-10"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 60%)`,
          transition: 'opacity 0.4s ease',
        }}
      />
    </div>
  );
};

// ── Animated counter ──────────────────────────────────────────────────
const AnimatedText: React.FC<{ text: string; delay?: number; isVisible: boolean }> = ({
  text,
  delay = 0,
  isVisible,
}) => (
  <span className="inline-block overflow-hidden">
    <span
      className="inline-block transition-all duration-700 ease-out"
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
        opacity: isVisible ? 1 : 0,
        transitionDelay: `${delay}ms`,
      }}
    >
      {text}
    </span>
  </span>
);

// ── Main Projects Component ───────────────────────────────────────────
const Projects: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });

  const categories = ['All', 'Web Development', 'UI/UX Design'];

  const projects = [
    {
      id: 1,
      title: 'Tunex',
      subtitle: 'Full Stack Music Player',
      category: 'Web Development',
      image: tunexImage,
      description:
        'Built a full-stack music streaming platform using the MERN stack, featuring user authentication, music playback, playlists, and responsive UI. Integrated real-time audio control and dynamic content rendering for a seamless listening experience.',
      technologies: ['React', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB'],
      demoLink: 'https://tunex.onrender.com',
      codeLink: 'https://github.com/AbhishekSinhaa17/Tunex',
      gradient: 'from-violet-600 via-purple-600 to-indigo-600',
      accent: '#7c3aed',
    },
    {
      id: 2,
      title: 'HireHub',
      subtitle: 'Job Board & ATS',
      category: 'Web Development',
      image: hirehubImage,
      description:
        'A full-stack job portal and applicant tracking system built with React, TypeScript, and Supabase, enabling role-based job management, candidate tracking pipelines, and secure authentication.',
      technologies: ['React+Vite', 'TypeScript', 'Supabase', 'Tailwind CSS', 'shadcn/ui'],
      demoLink: 'https://hirehub-blue.vercel.app/',
      codeLink: 'https://github.com/AbhishekSinhaa17/HireHub',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      accent: '#14b8a6',
    },
    {
      id: 3,
      title: 'Gemini Clone',
      subtitle: 'AI-Powered Chatbot',
      category: 'Web Development',
      image: geminiImage,
      description:
        'Built an AI-powered chatbot using Natural Language Processing (NLP). Enabled advanced contextual search and automated code assistance, improving developer efficiency.',
      technologies: ['React', 'Node.js', 'Hooks', 'Gemini API'],
      demoLink: 'https://gemini-clone-one-sand.vercel.app',
      codeLink: 'https://github.com/AbhishekSinhaa17/Gemini-Clone',
      gradient: 'from-blue-500 via-sky-500 to-cyan-400',
      accent: '#0ea5e9',
    },
    {
      id: 4,
      title: 'Pokémon App',
      subtitle: 'Interactive Comparison Platform',
      category: 'Web Development',
      image: pokemonImage,
      description:
        'Created an interactive Pokémon comparison platform with React.js and TypeScript. Used Firebase Authentication & Firestore Database for backend services.',
      technologies: ['Redux', 'TypeScript', 'Firebase', 'SCSS'],
      demoLink: 'https://pokemon-webapp-main.vercel.app',
      codeLink: 'https://github.com/AbhishekSinhaa17/pokemon_webapp-main',
      gradient: 'from-amber-500 via-orange-500 to-red-500',
      accent: '#f59e0b',
    },
    {
      id: 5,
      title: 'Movie Recommender',
      subtitle: 'Intelligent Recommendation System',
      category: 'Web Development',
      image:
        'https://user-images.githubusercontent.com/86877457/132905471-3ef27af4-ecc6-44bf-a47c-5ccf2250410c.jpg',
      description:
        'Built an intelligent movie recommendation system using Python and Jupyter Notebook. Implemented content-based and collaborative filtering techniques to suggest personalized movie recommendations.',
      technologies: ['Python', 'Jupyter Notebook', 'ML'],
      codeLink:
        'https://github.com/AbhishekSinhaa17/Movie-Recommender-System-master?tab=readme-ov-file',
      gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
      accent: '#ec4899',
    },
    {
      id: 6,
      title: 'Loan Calculator',
      subtitle: 'EMI Calculator App',
      category: 'UI/UX Design',
      image: loanImage,
      description:
        'A responsive React + Vite Loan EMI Calculator with real-time currency conversion using ExchangeRate API, amortization schedule, light/dark mode, and error handling. Built with Material UI.',
      technologies: ['React+Vite', 'Exchange Rate API', 'Material UI'],
      demoLink:
        'https://loan-calculator-92qor3bk7-abhishek-sinhas-projects-67ef53a1.vercel.app/',
      codeLink:
        'https://github.com/AbhishekSinhaa17/Loan-Calculator-App/tree/main/loan-calculator',
      gradient: 'from-lime-500 via-green-500 to-emerald-500',
      accent: '#22c55e',
    },
  ];

  const filteredProjects =
    activeFilter === 'All'
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-24 md:py-36 bg-gray-50 dark:bg-[#0a0a1a] transition-colors overflow-hidden"
    >
      {/* Particle canvas */}
      <ParticleField />

      {/* Decorative blurred blobs */}
      <div className="absolute top-20 -left-40 w-[500px] h-[500px] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 -right-40 w-[500px] h-[500px] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        {/* ─── Section Header ─────────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full 
              bg-gradient-to-r from-indigo-500/10 to-purple-500/10 
              dark:from-indigo-500/20 dark:to-purple-500/20 
              border border-indigo-200/50 dark:border-indigo-500/20 
              mb-6 transition-all duration-700 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
          >
            <Sparkles size={14} className="text-indigo-500 animate-pulse" />
            <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Featured Work
            </span>
          </div>

          {/* Title */}
          <h2
            className={`text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight transition-all duration-700 delay-100 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="text-gray-900 dark:text-white">Crafted with </span>
            <span className="relative">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Passion
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 10C50 2 150 2 198 10"
                  stroke="url(#underline-grad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className={`transition-all duration-1000 delay-500 ${
                    isInView ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    strokeDasharray: 200,
                    strokeDashoffset: isInView ? 0 : 200,
                    transition: 'stroke-dashoffset 1.2s ease-out 0.6s, opacity 0.3s ease',
                  }}
                />
                <defs>
                  <linearGradient id="underline-grad" x1="0" y1="0" x2="200" y2="0">
                    <stop stopColor="#6366f1" />
                    <stop offset="0.5" stopColor="#a855f7" />
                    <stop offset="1" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h2>

          <p
            className={`text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            A curated collection of projects that showcase my expertise in building
            modern, performant, and user-centric digital experiences.
          </p>

          {/* ─── Filter Buttons ─────────────────────────────────── */}
          <div
            className={`flex flex-wrap justify-center gap-3 mt-12 transition-all duration-700 delay-300 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {categories.map((category) => {
              const isActive = activeFilter === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={`relative px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-400 overflow-hidden group ${
                    isActive
                      ? 'text-white shadow-lg shadow-indigo-500/25'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-500/30'
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-x" />
                  )}
                  <span className="relative z-10">{category}</span>
                  {!isActive && (
                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Projects Grid ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {filteredProjects.map((project, index) => (
            <TiltCard
              key={project.id}
              className={`relative group rounded-2xl overflow-hidden transition-all duration-700 ease-out cursor-default ${
                isInView ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 120 + 400}ms` }}
            >
              {/* Card background with glassmorphism */}
              <div className="relative h-full bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl border border-gray-200/60 dark:border-white/[0.08] rounded-2xl overflow-hidden shadow-lg shadow-gray-200/40 dark:shadow-black/20 hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 transition-shadow duration-500">
                {/* Top gradient line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Image container */}
                <div
                  className="relative overflow-hidden h-56"
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
                  />

                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${project.gradient} opacity-0 group-hover:opacity-40 transition-opacity duration-500 mix-blend-overlay`}
                  />

                  {/* Dark overlay from bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Floating action buttons on hover */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center gap-4 transition-all duration-500 ${
                      hoveredProject === project.id
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                    }`}
                  >
                    {project.demoLink && (
                      <a
                        href={project.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/95 dark:bg-white text-gray-900 rounded-full text-sm font-semibold hover:scale-105 transition-transform duration-200 shadow-xl z-20"
                      >
                        <Eye size={15} /> Live Demo
                      </a>
                    )}
                    <a
                      href={project.codeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 bg-gray-900/90 dark:bg-gray-800/90 text-white rounded-full text-sm font-semibold hover:scale-105 transition-transform duration-200 shadow-xl backdrop-blur-sm z-20"
                    >
                      <Code2 size={15} /> Code
                    </a>
                  </div>

                  {/* Project number badge */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 text-sm font-bold z-10">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Bottom info on image */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`inline-block w-2 h-2 rounded-full bg-gradient-to-r ${project.gradient} shadow-lg`}
                        style={{ boxShadow: `0 0 8px ${project.accent}` }}
                      />
                      <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
                        {project.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white leading-tight">
                      {project.title}
                    </h3>
                    <p className="text-sm text-white/60 font-medium">{project.subtitle}</p>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-5 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs font-medium rounded-lg 
                          bg-gray-100 dark:bg-white/[0.06] 
                          text-gray-700 dark:text-gray-300 
                          border border-gray-200/60 dark:border-white/[0.08]
                          hover:border-indigo-300 dark:hover:border-indigo-500/30
                          transition-colors duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Bottom links */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/[0.06]">
                    {project.demoLink ? (
                      <a
                        href={project.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group/link flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent hover:gap-3 transition-all duration-300`}
                      >
                        View Project
                        <ArrowUpRight
                          size={16}
                          className="text-indigo-500 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-300"
                        />
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400 dark:text-gray-500 italic">
                        No live demo
                      </span>
                    )}
                    <a
                      href={project.codeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 group/code"
                    >
                      <Github
                        size={16}
                        className="group-hover/code:rotate-12 transition-transform duration-300"
                      />
                      Source
                    </a>
                  </div>
                </div>

                {/* Animated border glow on hover */}
                <div
                  className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}
                  style={{
                    background: `linear-gradient(135deg, ${project.accent}15, transparent 40%, transparent 60%, ${project.accent}10)`,
                  }}
                />
              </div>
            </TiltCard>
          ))}
        </div>

        {/* ─── Bottom CTA ─────────────────────────────────────────── */}
        <div
          className={`text-center mt-20 transition-all duration-700 delay-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <a
            href="https://github.com/AbhishekSinhaa17"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full 
              bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
              text-white font-semibold text-base 
              shadow-lg shadow-indigo-500/25 
              hover:shadow-xl hover:shadow-indigo-500/30 
              hover:scale-105 active:scale-[0.98]
              transition-all duration-300"
          >
            <Github size={20} className="group-hover:rotate-12 transition-transform duration-300" />
            View All Projects on GitHub
            <ArrowUpRight
              size={18}
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
            />
          </a>
        </div>
      </div>

      {/* ─── Custom Styles ────────────────────────────────────────── */}
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default Projects;