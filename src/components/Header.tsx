import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X, Moon, Sun, Code2, Sparkles, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  scrollY: number;
}

/* ── Active Section Tracker Hook ────────────────────────────────────── */
const useActiveSection = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'projects', 'testimonials', 'contact'];
      const scrollPos = window.scrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return activeSection;
};

/* ── Magnetic Element Wrapper ───────────────────────────────────────── */
const Magnetic: React.FC<{
  children: React.ReactNode;
  className?: string;
  strength?: number;
}> = ({ children, className = '', strength = 0.3 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      setPos({ x: x * strength, y: y * strength });
    },
    [strength],
  );

  const handleMouseLeave = useCallback(() => setPos({ x: 0, y: 0 }), []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: 'transform 0.2s ease-out',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

/* ── Theme Toggle with Morphing Animation ───────────────────────────── */
const ThemeToggle: React.FC<{
  theme: string;
  toggleTheme: () => void;
}> = ({ theme, toggleTheme }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <Magnetic strength={0.4}>
      <button
        onClick={handleToggle}
        className={`relative w-10 h-10 rounded-xl 
          bg-gray-100 dark:bg-white/10 
          hover:bg-gray-200 dark:hover:bg-white/20 
          border border-gray-200/50 dark:border-white/10
          flex items-center justify-center 
          transition-all duration-300 
          hover:scale-110 active:scale-95
          hover:shadow-lg hover:shadow-indigo-500/10
          group overflow-hidden`}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {/* Rotating container */}
        <span
          className={`relative z-10 transition-transform duration-500 ${
            isAnimating ? 'rotate-[360deg] scale-0' : 'rotate-0 scale-100'
          }`}
        >
          {theme === 'dark' ? (
            <Sun size={18} className="text-amber-400" />
          ) : (
            <Moon size={18} className="text-indigo-600" />
          )}
        </span>

        {/* Background glow on hover */}
        <span
          className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/10'
              : 'bg-gradient-to-br from-indigo-500/20 to-purple-500/10'
          }`}
        />

        {/* Stars/rays animation */}
        {isAnimating && (
          <>
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className={`absolute w-1 h-1 rounded-full ${
                  theme === 'dark' ? 'bg-amber-400' : 'bg-indigo-400'
                }`}
                style={{
                  animation: `theme-particle 0.6s ease-out ${i * 0.05}s forwards`,
                  transform: `rotate(${i * 60}deg) translateY(0)`,
                }}
              />
            ))}
          </>
        )}

        <style>{`
          @keyframes theme-particle {
            0% { transform: rotate(var(--r, 0deg)) translateY(0) scale(1); opacity: 1; }
            100% { transform: rotate(var(--r, 0deg)) translateY(-20px) scale(0); opacity: 0; }
          }
        `}</style>
      </button>
    </Magnetic>
  );
};

/* ── Nav Link with Animated Indicator ───────────────────────────────── */
const NavLink: React.FC<{
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  index: number;
}> = ({ href, label, isActive, onClick, index }) => (
  <Magnetic strength={0.15}>
    <a
      href={href}
      onClick={onClick}
      className={`relative px-1 py-2 text-sm font-medium tracking-wide transition-all duration-300 group ${
        isActive
          ? 'text-gray-900 dark:text-white'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <span className="relative z-10">{label}</span>

      {/* Active dot indicator */}
      <span
        className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ${
          isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`}
      />

      {/* Hover underline */}
      <span
        className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ${
          isActive ? 'w-full' : 'w-0 group-hover:w-full'
        }`}
      />

      {/* Hover background glow */}
      <span className="absolute inset-0 -mx-2 rounded-lg bg-indigo-500/5 dark:bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
    </a>
  </Magnetic>
);

/* ── Mobile Menu Link ───────────────────────────────────────────────── */
const MobileNavLink: React.FC<{
  href: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
  index: number;
  isOpen: boolean;
}> = ({ href, label, isActive, onClick, index, isOpen }) => (
  <a
    href={href}
    onClick={onClick}
    className={`group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
      isActive
        ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 border border-indigo-200/50 dark:border-indigo-500/20'
        : 'hover:bg-gray-100/80 dark:hover:bg-white/5'
    }`}
    style={{
      transform: isOpen ? 'translateX(0)' : 'translateX(-40px)',
      opacity: isOpen ? 1 : 0,
      transition: `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.06 + 0.1}s`,
    }}
  >
    {/* Number */}
    <span
      className={`text-xs font-mono font-bold w-6 text-right ${
        isActive
          ? 'text-indigo-500 dark:text-indigo-400'
          : 'text-gray-300 dark:text-gray-600'
      }`}
    >
      0{index + 1}
    </span>

    {/* Divider */}
    <span
      className={`w-6 h-[1px] transition-all duration-300 ${
        isActive
          ? 'bg-indigo-500 w-8'
          : 'bg-gray-300 dark:bg-gray-600 group-hover:w-8 group-hover:bg-gray-400'
      }`}
    />

    {/* Label */}
    <span
      className={`text-lg font-semibold transition-colors duration-300 ${
        isActive
          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent'
          : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
      }`}
    >
      {label}
    </span>

    {/* Arrow */}
    <ChevronRight
      size={16}
      className={`ml-auto transition-all duration-300 ${
        isActive
          ? 'text-indigo-500 translate-x-0 opacity-100'
          : 'text-gray-300 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
      }`}
    />
  </a>
);

/* ── Main Header Component ──────────────────────────────────────────── */
const Header: React.FC<HeaderProps> = ({ scrollY }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const activeSection = useActiveSection();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const isScrolled = scrollY > 20;

  const links = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed w-full top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-2'
            : 'py-4'
        }`}
      >
        {/* Background layers */}
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            isScrolled
              ? 'bg-white/70 dark:bg-[#0a0a18]/70 backdrop-blur-2xl shadow-lg shadow-black/[0.03] dark:shadow-black/20 border-b border-gray-200/50 dark:border-white/[0.04]'
              : 'bg-transparent'
          }`}
        />

        {/* Gradient top line when scrolled */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent transition-opacity duration-500 ${
            isScrolled ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div className="container relative z-10 mx-auto px-4 md:px-6 flex justify-between items-center">
          {/* ── Logo ─────────────────────────────────────────────── */}
          <Magnetic strength={0.2}>
            <a href="#" className="group flex items-center gap-2.5">
              {/* Logo Icon */}
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                <Code2 size={18} className="text-white" />
                {/* Shimmer */}
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                </div>
              </div>

              {/* Logo Text */}
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white leading-none">
                  Abhishek
                  <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                    .
                  </span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 leading-none mt-0.5">
                  Developer
                </span>
              </div>
            </a>
          </Magnetic>

          {/* ── Desktop Navigation ───────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Nav container with subtle bg */}
            <div
              className={`flex items-center gap-1 px-2 py-1.5 rounded-2xl transition-all duration-500 ${
                isScrolled
                  ? 'bg-gray-100/50 dark:bg-white/[0.04] border border-gray-200/30 dark:border-white/[0.04]'
                  : ''
              }`}
            >
              {links.map((link, i) => (
                <NavLink
                  key={link.name}
                  href={link.href}
                  label={link.name}
                  isActive={activeSection === link.href.slice(1)}
                  index={i}
                />
              ))}
            </div>

            {/* Divider */}
            <div className="w-[1px] h-6 bg-gray-200 dark:bg-white/10 mx-3" />

            {/* Theme toggle */}
            {isMounted && <ThemeToggle theme={theme} toggleTheme={toggleTheme} />}

            {/* CTA Button */}
            <a
              href="#contact"
              className="group relative ml-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-[length:200%_200%] animate-gradient-flow" />
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </span>
              <span className="relative flex items-center gap-1.5">
                <Sparkles size={14} className="group-hover:rotate-12 transition-transform duration-300" />
                Hire Me
              </span>
            </a>
          </nav>

          {/* ── Mobile Controls ──────────────────────────────────── */}
          <div className="flex items-center gap-2 md:hidden">
            {isMounted && <ThemeToggle theme={theme} toggleTheme={toggleTheme} />}

            {/* Hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isMenuOpen
                  ? 'bg-red-500/10 dark:bg-red-500/20 text-red-500'
                  : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20'
              }`}
              aria-label="Toggle menu"
            >
              <span className="relative w-5 h-5">
                {/* Top bar */}
                <span
                  className={`absolute left-0 w-full h-[2px] rounded-full bg-current transition-all duration-300 ${
                    isMenuOpen
                      ? 'top-1/2 -translate-y-1/2 rotate-45'
                      : 'top-0.5'
                  }`}
                />
                {/* Middle bar */}
                <span
                  className={`absolute top-1/2 -translate-y-1/2 left-0 h-[2px] rounded-full bg-current transition-all duration-300 ${
                    isMenuOpen ? 'w-0 opacity-0' : 'w-3/4 opacity-100'
                  }`}
                />
                {/* Bottom bar */}
                <span
                  className={`absolute left-0 w-full h-[2px] rounded-full bg-current transition-all duration-300 ${
                    isMenuOpen
                      ? 'bottom-1/2 translate-y-1/2 -rotate-45'
                      : 'bottom-0.5'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Overlay ──────────────────────────────────── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-500 ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Menu Panel */}
      <div
        className={`fixed top-0 right-0 z-40 w-[85%] max-w-sm h-full md:hidden transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="relative h-full bg-white/95 dark:bg-[#0c0c1d]/95 backdrop-blur-2xl border-l border-gray-200/50 dark:border-white/[0.06] overflow-y-auto">
          {/* Decorative gradient blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <div className="flex items-center justify-between p-6 pb-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
              Navigation
            </span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all duration-300"
            >
              <X size={18} />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="px-4 py-4 space-y-1">
            {links.map((link, i) => (
              <MobileNavLink
                key={link.name}
                href={link.href}
                label={link.name}
                isActive={activeSection === link.href.slice(1)}
                onClick={() => setIsMenuOpen(false)}
                index={i}
                isOpen={isMenuOpen}
              />
            ))}
          </nav>

          {/* Divider */}
          <div className="mx-6 my-4 h-[1px] bg-gray-200/50 dark:bg-white/[0.06]" />

          {/* CTA in mobile menu */}
          <div
            className="px-6"
            style={{
              transform: isMenuOpen ? 'translateY(0)' : 'translateY(20px)',
              opacity: isMenuOpen ? 1 : 0,
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
            }}
          >
            <a
              href="#contact"
              onClick={() => setIsMenuOpen(false)}
              className="group flex items-center justify-center gap-2 w-full px-6 py-4 rounded-2xl text-white font-semibold text-base overflow-hidden relative transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl hover:shadow-indigo-500/20"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </span>
              <span className="relative flex items-center gap-2">
                <Sparkles size={16} className="group-hover:rotate-12 transition-transform duration-300" />
                Let's Work Together
              </span>
            </a>
          </div>

          {/* Bottom info */}
          <div
            className="absolute bottom-0 left-0 right-0 px-6 py-6 border-t border-gray-200/30 dark:border-white/[0.04]"
            style={{
              transform: isMenuOpen ? 'translateY(0)' : 'translateY(20px)',
              opacity: isMenuOpen ? 1 : 0,
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.6s',
            }}
          >
            <p className="text-xs text-gray-400 dark:text-gray-600 text-center">
              © {new Date().getFullYear()} Abhishek Sinha
            </p>
            <div className="flex justify-center gap-4 mt-3">
              {[
                { href: 'https://github.com/AbhishekSinhaa17', label: 'GH' },
                { href: 'https://www.linkedin.com/in/abhisheksinha17', label: 'LI' },
                { href: 'https://x.com/Abhishe85338077', label: 'X' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200/50 dark:border-white/[0.06] flex items-center justify-center text-[10px] font-bold text-gray-400 dark:text-gray-500 hover:text-indigo-500 hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-all duration-300"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Keyframes ─────────────────────────────────────────────── */}
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

export default Header;