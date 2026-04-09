import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Github,
  Linkedin,
  Twitter,
  Sparkles,
  Download,
  ChevronRight,
  Rocket,
  Coffee,
  Terminal,
  Code2,
  Layers,
  Mail,
} from "lucide-react";


/* ═══════════════════════════════════════════════════════════════
   INTERACTIVE WIREFRAME GLOBE
   ═══════════════════════════════════════════════════════════════ */
const InteractiveGlobe: React.FC<{ isVisible: boolean; isDark: boolean }> = ({
  isVisible,
  isDark,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const canvasMouse = useRef({ x: -999, y: -999 });
  const isDarkRef = useRef(isDark);

  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let time = 0;

    const N = 200;
    const phi = Math.PI * (3 - Math.sqrt(5));
    const pts: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = phi * i;
      pts.push({ x: Math.cos(th) * r, y, z: Math.sin(th) * r });
    }

    const conns: [number, number][] = [];
    for (let i = 0; i < N; i++)
      for (let j = i + 1; j < N; j++) {
        const a = pts[i],
          b = pts[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
        if (d < 0.38) conns.push([i, j]);
      }

    const render = () => {
      time += 0.002;
      const dark = isDarkRef.current;
      const dpr = devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) {
        raf = requestAnimationFrame(render);
        return;
      }
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2,
        cy = h / 2;
      const R = Math.min(w, h) * 0.44;
      const mx = (mouseRef.current.x - 0.5) * 0.8;
      const my = (mouseRef.current.y - 0.5) * 0.5;
      const ry = time + mx,
        rx = 0.3 + my;
      const cY = Math.cos(ry),
        sY = Math.sin(ry);
      const cX = Math.cos(rx),
        sX = Math.sin(rx);

      const cmx = canvasMouse.current.x * w;
      const cmy = canvasMouse.current.y * h;

      const proj = pts.map((p) => {
        const x1 = p.x * cY - p.z * sY;
        const z1 = p.x * sY + p.z * cY;
        const y1 = p.y * cX - z1 * sX;
        const z2 = p.y * sX + z1 * cX;
        const depth = (z2 + 1) / 2;
        const sx = cx + x1 * R,
          sy = cy + y1 * R;
        const distCur = Math.hypot(sx - cmx, sy - cmy);
        const hl = distCur < 70 ? (70 - distCur) / 70 : 0;
        return { sx, sy, depth, oy: p.y, hl };
      });

      // Atmosphere
      const ag = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R * 1.25);
      const atmAlpha = dark ? 0.02 : 0.04;
      ag.addColorStop(0, `rgba(139,92,246,0)`);
      ag.addColorStop(0.6, `rgba(139,92,246,${atmAlpha})`);
      ag.addColorStop(1, `rgba(139,92,246,0)`);
      ctx.fillStyle = ag;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // Connections
      for (const [i, j] of conns) {
        const a = proj[i],
          b = proj[j];
        const md = Math.min(a.depth, b.depth);
        if (md < 0.15) continue;
        const avgY = (a.oy + b.oy) / 2;
        const hue = 290 - ((avgY + 1) / 2) * 100;
        const maxHl = Math.max(a.hl, b.hl);
        const baseAlpha = dark ? 0.18 : 0.25;
        const alpha = md * md * (baseAlpha + maxHl * 0.4);
        const lightness = dark ? 60 + maxHl * 15 : 45 + maxHl * 10;
        const sat = dark ? 65 : 75;
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.strokeStyle = `hsla(${hue},${sat}%,${lightness}%,${alpha})`;
        ctx.lineWidth = 0.5 + maxHl * 0.8;
        ctx.stroke();
      }

      // Points
      for (const p of proj) {
        if (p.depth < 0.08) continue;
        const hue = 290 - ((p.oy + 1) / 2) * 100;
        const baseAlpha = dark ? 0.7 : 0.85;
        const alpha = p.depth * p.depth * (baseAlpha + p.hl * 0.5);
        const lightness = dark ? 68 + p.hl * 15 : 50 + p.hl * 10;
        const sat = dark ? 65 : 80;
        const sz = 0.6 + p.depth * 1.8 + p.hl * 3;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, sz, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue},${sat}%,${lightness}%,${alpha})`;
        ctx.fill();
        if (p.depth > 0.6 || p.hl > 0.3) {
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, sz * (3 + p.hl * 4), 0, Math.PI * 2);
          const glowAlpha = dark
            ? (p.depth - 0.4) * 0.04 + p.hl * 0.08
            : (p.depth - 0.4) * 0.06 + p.hl * 0.1;
          ctx.fillStyle = `hsla(${hue},${sat}%,${dark ? 60 : 50}%,${glowAlpha})`;
          ctx.fill();
        }
      }

      // Orbit ring
      ctx.save();
      ctx.setLineDash([3, 10]);
      ctx.beginPath();
      ctx.ellipse(
        cx,
        cy,
        R * 1.18,
        R * Math.abs(Math.cos(rx)) * 0.15,
        0,
        0,
        Math.PI * 2,
      );
      ctx.strokeStyle = dark
        ? "rgba(139,92,246,0.035)"
        : "rgba(139,92,246,0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      raf = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const c = canvasRef.current;
      if (!c) return;
      const r = c.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - r.left) / r.width,
        y: (e.clientY - r.top) / r.height,
      };
      canvasMouse.current = { ...mouseRef.current };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      className={`relative transition-all duration-[1.6s] ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-[0.6]"
      }`}
      style={{
        transitionDelay: "600ms",
        transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div className="absolute inset-0 m-auto w-4/5 h-4/5 rounded-full bg-violet-500/[0.08] dark:bg-violet-500/[0.08] blur-[120px]" />
      <canvas
        ref={canvasRef}
        className="w-[480px] h-[480px] xl:w-[600px] xl:h-[600px] 2xl:w-[680px] 2xl:h-[680px]"
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   LINE REVEAL
   ═══════════════════════════════════════════════════════════════ */
const LineReveal: React.FC<{
  children: React.ReactNode;
  delay: number;
  isVisible: boolean;
  duration?: number;
}> = ({ children, delay, isVisible, duration = 900 }) => (
  <div className="overflow-hidden">
    <div
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(115%)",
        opacity: isVisible ? 1 : 0,
        transitionProperty: "transform, opacity",
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   ROLE CAROUSEL
   ═══════════════════════════════════════════════════════════════ */
const RoleCarousel: React.FC<{ roles: string[] }> = ({ roles }) => {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");

  useEffect(() => {
    const t = setInterval(() => {
      setPhase("out");
      setTimeout(() => {
        setIdx((i) => (i + 1) % roles.length);
        setPhase("in");
      }, 400);
    }, 3200);
    return () => clearInterval(t);
  }, [roles.length]);

  return (
    <span className="relative inline-flex h-[1.35em] overflow-hidden align-bottom">
      <span
        className="inline-block transition-all duration-500"
        style={{
          transform: phase === "out" ? "translateY(-120%)" : "translateY(0)",
          opacity: phase === "out" ? 0 : 1,
          transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <span className="bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 dark:from-cyan-400 dark:via-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent font-bold whitespace-nowrap">
          {roles[idx]}
        </span>
      </span>
    </span>
  );
};

/* ═══════════════════════════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════════════════════════ */
const Counter: React.FC<{
  to: number;
  suffix?: string;
  isVisible: boolean;
  delay?: number;
}> = ({ to, suffix = "", isVisible, delay = 0 }) => {
  const [v, setV] = useState(0);
  const ran = useRef(false);

  useEffect(() => {
    if (!isVisible || ran.current) return;
    const t = setTimeout(() => {
      ran.current = true;
      const t0 = performance.now();
      const dur = 2000;
      const tick = (now: number) => {
        const p = Math.min((now - t0) / dur, 1);
        setV(Math.floor((1 - (1 - p) ** 3) * to));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [isVisible, to, delay]);

  return (
    <span className="tabular-nums">
      {v}
      {suffix}
    </span>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAGNETIC BUTTON
   ═══════════════════════════════════════════════════════════════ */
const MagneticButton: React.FC<{
  href: string;
  children: React.ReactNode;
  className?: string;
  download?: string;
  external?: boolean;
}> = ({ href, children, className = "", download, external }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      x: (e.clientX - r.left - r.width / 2) * 0.3,
      y: (e.clientY - r.top - r.height / 2) * 0.3,
    });
  }, []);

  return (
    <a
      ref={ref}
      href={href}
      className={className}
      download={download}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition:
          pos.x === 0
            ? "transform 0.5s cubic-bezier(0.16,1,0.3,1)"
            : "transform 0.1s ease-out",
      }}
      onMouseMove={onMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
    >
      {children}
    </a>
  );
};

/* ═══════════════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════════════ */
const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);
  const [mp, setMp] = useState({ x: 0, y: 0 });
  const [isDark, setIsDark] = useState(true);

  const roles = [
    "Full Stack Developer",
    "Software Engineer",
    "MERN Stack Developer",
    "Problem Solver",
  ];

  const stats = [
    {
      icon: <Rocket size={14} />,
      v: 10,
      s: "+",
      l: "Projects",
      g: "from-cyan-500 to-blue-500",
    },
    {
      icon: <Layers size={14} />,
      v: 8,
      s: "+",
      l: "Technologies",
      g: "from-violet-500 to-purple-500",
    },
    {
      icon: <Code2 size={14} />,
      v: 200,
      s: "+",
      l: "Contributions",
      g: "from-fuchsia-500 to-pink-500",
    },
    {
      icon: <Coffee size={14} />,
      v: 999,
      s: "+",
      l: "Chai Cups",
      g: "from-amber-500 to-orange-500",
    },
  ];

  // Detect dark mode changes
  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => checkDark();
    mq.addEventListener("change", handler);

    return () => {
      observer.disconnect();
      mq.removeEventListener("change", handler);
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setVis(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const r = heroRef.current.getBoundingClientRect();
      setMp({
        x: (e.clientX - r.left) / r.width - 0.5,
        y: (e.clientY - r.top) / r.height - 0.5,
      });
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-gray-50 dark:bg-[#07070e] transition-colors duration-500"
    >
      {/* ── BG Layers ──────────────────────────────── */}

      {/* Animated gradient orbs */}
      <div
        className="absolute w-[700px] h-[700px] rounded-full bg-cyan-400/[0.08] dark:bg-cyan-500/[0.05] blur-[180px] pointer-events-none transition-colors duration-500 z-[1]"
        style={{
          top: "-15%",
          left: "-8%",
          transform: `translate(${mp.x * 50}px,${mp.y * 50}px)`,
          transition: "transform 4s ease-out",
          animation: "drift-1 16s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[600px] h-[600px] rounded-full bg-violet-400/[0.08] dark:bg-violet-500/[0.06] blur-[160px] pointer-events-none transition-colors duration-500 z-[1]"
        style={{
          top: "25%",
          right: "-12%",
          transform: `translate(${mp.x * -40}px,${mp.y * -40}px)`,
          transition: "transform 4s ease-out",
          animation: "drift-2 20s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full bg-fuchsia-400/[0.06] dark:bg-fuchsia-500/[0.04] blur-[160px] pointer-events-none transition-colors duration-500 z-[1]"
        style={{
          bottom: "-8%",
          left: "30%",
          transform: `translate(${mp.x * 30}px,${mp.y * 30}px)`,
          transition: "transform 4s ease-out",
          animation: "drift-3 22s ease-in-out infinite",
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.035] pointer-events-none z-[2]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(100,100,120,0.8) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none dark:block hidden z-[3]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 40%, #07070e 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none dark:hidden block z-[3]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 40%, rgb(249 250 251) 100%)",
        }}
      />

      {/* Cursor spotlight */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none z-[4]"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 60%)"
            : "radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 60%)",
          left: `calc(50% + ${mp.x * 350}px - 300px)`,
          top: `calc(50% + ${mp.y * 350}px - 300px)`,
          transition: "left 2s ease-out, top 2s ease-out",
        }}
      />

      {/* ── Content ────────────────────────────────── */}
      <div className="container relative z-10 mx-auto px-6 md:px-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center min-h-[80vh]">
          {/* ── LEFT ─────────────────────────────── */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-6">
            {/* Badge */}
            <div
              className={`transition-all duration-700 ${
                vis ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
              }`}
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gray-100/80 dark:bg-white/[0.04] backdrop-blur-xl border border-gray-200 dark:border-white/[0.07] transition-colors duration-500">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.6)]" />
                </span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Open to opportunities
                </span>
                <span className="text-gray-300 dark:text-gray-700 text-xs">
                  ·
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                  Bangalore, IN
                </span>
              </div>
            </div>

            {/* Greeting */}
            <LineReveal delay={250} isVisible={vis}>
              <p className="text-base md:text-lg text-gray-400 dark:text-gray-500 font-medium tracking-wide">
                <span
                  className="inline-block mr-2"
                  style={{
                    animation: vis ? "wave 2.5s ease-in-out infinite" : "none",
                  }}
                >
                  👋
                </span>
                Hello World, I&apos;m
              </p>
            </LineReveal>

            {/* Name */}
            <div>
              <h1 className="text-[3.6rem] sm:text-7xl lg:text-[5.2rem] xl:text-[6rem] font-black tracking-[-0.04em] leading-[0.92]">
                <LineReveal delay={400} isVisible={vis}>
                  <span className="block text-gray-900 dark:text-white transition-colors duration-500">
                    ABHISHEK
                  </span>
                </LineReveal>
                <LineReveal delay={550} isVisible={vis}>
                  <span className="block bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 dark:from-cyan-400 dark:via-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                    KUMAR SINHA
                  </span>
                </LineReveal>
              </h1>

              {/* Gradient bar */}
              <div
                className="h-[3px] mt-3 rounded-full bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 origin-left"
                style={{
                  transform: vis ? "scaleX(1)" : "scaleX(0)",
                  width: 120,
                  transition: "transform 1s cubic-bezier(0.16,1,0.3,1) 0.9s",
                }}
              />
            </div>

            {/* Role */}
            <LineReveal delay={750} isVisible={vis}>
              <p className="text-xl md:text-2xl">
                <span className="text-gray-300 dark:text-gray-600 font-mono text-sm mr-2">
                  {">"}
                </span>
                <RoleCarousel roles={roles} />
              </p>
            </LineReveal>

            {/* Description */}
            <LineReveal delay={900} isVisible={vis}>
              <p className="text-[15px] text-gray-500 dark:text-gray-400/90 leading-relaxed max-w-lg transition-colors duration-500">
                A passionate developer crafting full-stack solutions with modern
                technologies. Turning complex challenges into elegant,
                high-performing digital experiences.
              </p>
            </LineReveal>

            {/* CTAs */}
            <div
              className={`flex flex-wrap items-center gap-3 transition-all duration-700 ${
                vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "1050ms" }}
            >
              {/* Primary */}
              <MagneticButton
                href="#projects"
                className="group relative inline-flex items-center gap-2 px-8 py-[14px] rounded-full font-bold text-sm text-white overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_50px_rgba(139,92,246,.3)]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500" />
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                <span className="absolute inset-0 overflow-hidden rounded-full">
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </span>
                <Rocket
                  size={15}
                  className="relative z-10 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300"
                />
                <span className="relative z-10">Explore My Work</span>
                <ChevronRight
                  size={14}
                  className="relative z-10 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300"
                />
              </MagneticButton>

              {/* Secondary */}
              <MagneticButton
                href="#contact"
                className="group inline-flex items-center gap-2 px-8 py-[14px] rounded-full font-bold text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.02] hover:border-violet-400 dark:hover:border-violet-500/30 hover:bg-violet-50 dark:hover:bg-violet-500/[0.06] hover:text-violet-600 dark:hover:text-white transition-all duration-300"
              >
                <Sparkles
                  size={15}
                  className="text-violet-500 dark:text-violet-400 group-hover:rotate-12 transition-transform duration-300"
                />
                Let&apos;s Connect
              </MagneticButton>

              {/* Resume */}
              <MagneticButton
                href="/resume.pdf"
                download="Abhishek_Sinha_Resume.pdf"
                external
                className="group inline-flex items-center gap-1.5 px-5 py-[14px] rounded-full text-sm text-gray-400 dark:text-gray-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-300"
              >
                <Download
                  size={14}
                  className="group-hover:translate-y-0.5 transition-transform duration-300"
                />
                <span className="font-semibold">Resume</span>
              </MagneticButton>
            </div>

            {/* Socials */}
            <div
              className={`flex items-center gap-1 transition-all duration-700 ${
                vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "1200ms" }}
            >
              {[
                {
                  href: "https://github.com/AbhishekSinhaa17",
                  icon: <Github size={16} />,
                  l: "GitHub",
                },
                {
                  href: "https://www.linkedin.com/in/abhisheksinha17",
                  icon: <Linkedin size={16} />,
                  l: "LinkedIn",
                },
                {
                  href: "https://x.com/Abhishe85338077",
                  icon: <Twitter size={16} />,
                  l: "Twitter",
                },
              ].map((s) => (
                <a
                  key={s.l}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.l}
                  className="group w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white border border-transparent hover:border-gray-200 dark:hover:border-white/[0.08] hover:bg-gray-100 dark:hover:bg-white/[0.03] transition-all duration-300 hover:scale-110"
                >
                  {s.icon}
                </a>
              ))}
              <div className="w-px h-5 bg-gray-200 dark:bg-white/[0.06] mx-2 transition-colors duration-500" />
              <a
                href="mailto:abhiks1710@gmail.com"
                className="flex items-center gap-1.5 text-xs font-mono text-gray-400 dark:text-gray-600 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-300"
              >
                <Mail size={11} />
                abhiks1710@gmail.com
              </a>
            </div>

            {/* Terminal */}
            <div
              className={`flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-100/80 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.04] font-mono text-xs transition-all duration-700 ${
                vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "1350ms" }}
            >
              <Terminal size={13} className="text-emerald-500 flex-shrink-0" />
              <span className="text-emerald-600 dark:text-emerald-500">~$</span>
              <span className="text-gray-500 dark:text-gray-500">
                npx create-awesome-app{" "}
                <span className="text-cyan-600 dark:text-cyan-400">
                  --by abhishek
                </span>
              </span>
              <span
                className="w-1.5 h-4 bg-emerald-500 rounded-sm ml-auto flex-shrink-0"
                style={{ animation: "blink 1s step-end infinite" }}
              />
            </div>

            {/* Stats */}
            <div
              className={`grid grid-cols-2 sm:grid-cols-4 gap-2.5 transition-all duration-700 ${
                vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "1500ms" }}
            >
              {stats.map((d, i) => (
                <div
                  key={d.l}
                  className="group relative rounded-2xl bg-white/80 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.05] p-3.5 hover:border-gray-300 dark:hover:border-white/[0.1] transition-all duration-300 hover:scale-[1.04] cursor-default overflow-hidden shadow-sm dark:shadow-none"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${d.g} opacity-0 group-hover:opacity-[0.08] dark:group-hover:opacity-[0.05] transition-opacity duration-500`}
                  />
                  <div className="relative">
                    <div
                      className={`w-7 h-7 rounded-lg bg-gradient-to-br ${d.g} flex items-center justify-center text-white mb-2.5 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}
                    >
                      {d.icon}
                    </div>
                    <p className="text-xl font-black text-gray-900 dark:text-white leading-none mb-0.5 transition-colors duration-500">
                      <Counter
                        to={d.v}
                        suffix={d.s}
                        isVisible={vis}
                        delay={1700 + i * 100}
                      />
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-gray-400 dark:text-gray-500">
                      {d.l}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT — Globe ────────────────────── */}
          <div className="lg:col-span-6 xl:col-span-7 hidden lg:flex items-center justify-center lg:-translate-y-12">
            <InteractiveGlobe isVisible={vis} isDark={isDark} />
          </div>
        </div>
      </div>

      {/* ── Scroll Indicator ───────────────────────── */}
      <a
        href="#about"
        className="group absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
        aria-label="Scroll down"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-gray-400 dark:text-gray-600 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors duration-300">
          Explore
        </span>
        <div className="relative w-[2px] h-14 bg-gray-200 dark:bg-white/[0.05] rounded-full overflow-hidden transition-colors duration-500">
          <div
            className="absolute top-0 w-full rounded-full bg-gradient-to-b from-cyan-500 via-violet-500 to-transparent dark:from-cyan-400 dark:via-violet-400"
            style={{
              height: "40%",
              animation: "beam 2.4s ease-in-out infinite",
            }}
          />
        </div>
      </a>

      {/* ── Keyframes ──────────────────────────────── */}
      <style>{`
        @keyframes wave {
          0%,60%,100% { transform: rotate(0) }
          10% { transform: rotate(14deg) }
          20% { transform: rotate(-8deg) }
          30% { transform: rotate(14deg) }
          40% { transform: rotate(-4deg) }
          50% { transform: rotate(10deg) }
        }
        @keyframes blink {
          0%,100% { opacity: 1 }
          50% { opacity: 0 }
        }
        @keyframes beam {
          0%   { transform: translateY(-110%); opacity: 0 }
          25%  { opacity: 1 }
          75%  { opacity: 1 }
          100% { transform: translateY(300%); opacity: 0 }
        }
        @keyframes drift-1 {
          0%,100% { transform: translate(0,0) scale(1) }
          33% { transform: translate(80px,-50px) scale(1.1) }
          66% { transform: translate(-40px,40px) scale(0.95) }
        }
        @keyframes drift-2 {
          0%,100% { transform: translate(0,0) scale(1) }
          33% { transform: translate(-60px,60px) scale(1.05) }
          66% { transform: translate(50px,-30px) scale(0.9) }
        }
        @keyframes drift-3 {
          0%,100% { transform: translate(0,0) scale(1) }
          33% { transform: translate(50px,40px) scale(0.95) }
          66% { transform: translate(-70px,-50px) scale(1.08) }
        }
      `}</style>
    </section>
  );
};

export default Hero;