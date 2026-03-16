import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Quote,
  Star,
  MessageCircle,
} from 'lucide-react';
import { useInView } from '../hooks/useInView';

/* ── Animated Aurora Background ─────────────────────────────────────── */
const AuroraBackground: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="aurora-blob aurora-1" />
    <div className="aurora-blob aurora-2" />
    <div className="aurora-blob aurora-3" />
    <style>{`
      .aurora-blob {
        position: absolute;
        border-radius: 50%;
        filter: blur(100px);
        opacity: 0.12;
        animation: aurora-drift 12s ease-in-out infinite alternate;
      }
      .aurora-1 {
        width: 600px; height: 600px;
        background: linear-gradient(135deg, #6366f1, #a855f7);
        top: -200px; left: -100px;
        animation-duration: 14s;
      }
      .aurora-2 {
        width: 500px; height: 500px;
        background: linear-gradient(135deg, #3b82f6, #06b6d4);
        bottom: -150px; right: -100px;
        animation-duration: 18s;
        animation-delay: -4s;
      }
      .aurora-3 {
        width: 400px; height: 400px;
        background: linear-gradient(135deg, #ec4899, #f59e0b);
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        animation-duration: 16s;
        animation-delay: -8s;
      }
      @keyframes aurora-drift {
        0% { transform: translate(0, 0) scale(1) rotate(0deg); }
        33% { transform: translate(60px, -40px) scale(1.1) rotate(5deg); }
        66% { transform: translate(-40px, 60px) scale(0.9) rotate(-5deg); }
        100% { transform: translate(30px, 30px) scale(1.05) rotate(3deg); }
      }
    `}</style>
  </div>
);

/* ── Circular Auto-Play Progress Ring ───────────────────────────────── */
const ProgressRing: React.FC<{ progress: number; size?: number; stroke?: number }> = ({
  progress,
  size = 48,
  stroke = 3,
}) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        className="text-gray-200 dark:text-white/10"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#ring-gradient)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-100 ease-linear"
      />
      <defs>
        <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </svg>
  );
};

/* ── Animated Star Rating ───────────────────────────────────────────── */
const AnimatedStars: React.FC<{ rating: number; isVisible: boolean; delay?: number }> = ({
  rating,
  isVisible,
  delay = 0,
}) => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={18}
        className={`transition-all duration-500 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        } ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
        style={{
          transitionDelay: `${delay + i * 100}ms`,
          filter: i < rating ? 'drop-shadow(0 0 4px rgba(251,191,36,0.4))' : 'none',
        }}
      />
    ))}
  </div>
);

/* ── Floating Decorator Dots ────────────────────────────────────────── */
const FloatingDots: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {Array.from({ length: 20 }).map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-indigo-400/20 dark:bg-indigo-400/10"
        style={{
          width: `${Math.random() * 6 + 2}px`,
          height: `${Math.random() * 6 + 2}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float-dot ${8 + Math.random() * 12}s ease-in-out infinite`,
          animationDelay: `${-Math.random() * 10}s`,
        }}
      />
    ))}
    <style>{`
      @keyframes float-dot {
        0%, 100% { transform: translate(0, 0); opacity: 0.3; }
        25% { transform: translate(20px, -30px); opacity: 0.8; }
        50% { transform: translate(-10px, -60px); opacity: 0.4; }
        75% { transform: translate(15px, -20px); opacity: 0.7; }
      }
    `}</style>
  </div>
);

/* ── Main Testimonials Component ────────────────────────────────────── */
const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isAnimating, setIsAnimating] = useState(false);
  const [autoPlayProgress, setAutoPlayProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.2 });
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const testimonials = [
    {
      id: 1,
      name: 'Alica Walker',
      role: 'CEO, TechCorp',
      avatar:
        'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      content:
        'Working with this developer was an absolute pleasure. They delivered our project ahead of schedule and exceeded all our expectations. The attention to detail and thoughtful approach to UX made all the difference in our product launch.',
      rating: 5,
      gradient: 'from-violet-500 to-purple-600',
      bgAccent: 'violet',
    },
    {
      id: 2,
      name: 'Michael Johnson',
      role: 'Product Manager, InnovateX',
      avatar:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      content:
        'I was impressed by the technical expertise and problem-solving skills. Our complex web application was developed with clean code and intuitive design. Communication was clear throughout the project, making collaboration seamless.',
      rating: 5,
      gradient: 'from-blue-500 to-cyan-500',
      bgAccent: 'blue',
    },
    {
      id: 3,
      name: 'Sarah Chen',
      role: 'Founder, DesignLab',
      avatar:
        'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      content:
        'The redesign of our platform transformed our user engagement. The developer brought both technical skill and design sensibility to the project, resulting in a product that not only functions flawlessly but looks beautiful as well.',
      rating: 5,
      gradient: 'from-pink-500 to-rose-500',
      bgAccent: 'pink',
    },
  ];

  const AUTO_PLAY_DURATION = 6000;

  const goTo = useCallback(
    (index: number, dir: 'left' | 'right') => {
      if (isAnimating) return;
      setIsAnimating(true);
      setDirection(dir);
      setActiveIndex(index);
      setAutoPlayProgress(0);
      setTimeout(() => setIsAnimating(false), 700);
    },
    [isAnimating],
  );

  const handlePrev = useCallback(() => {
    goTo(
      (activeIndex - 1 + testimonials.length) % testimonials.length,
      'left',
    );
  }, [activeIndex, goTo, testimonials.length]);

  const handleNext = useCallback(() => {
    goTo((activeIndex + 1) % testimonials.length, 'right');
  }, [activeIndex, goTo, testimonials.length]);

  // Auto-play with progress
  useEffect(() => {
    if (!isInView || isPaused) {
      if (progressRef.current) clearInterval(progressRef.current);
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    const progressStep = 50;
    progressRef.current = setInterval(() => {
      setAutoPlayProgress((p) => {
        const next = p + progressStep / AUTO_PLAY_DURATION;
        return next >= 1 ? 0 : next;
      });
    }, progressStep);

    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, AUTO_PLAY_DURATION);

    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isInView, isPaused, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handlePrev, handleNext]);

  const getCardStyle = (index: number): React.CSSProperties => {
    const diff =
      (index - activeIndex + testimonials.length) % testimonials.length;

    if (diff === 0) {
      return {
        transform: 'translateX(0) scale(1) rotateY(0deg)',
        opacity: 1,
        zIndex: 30,
        filter: 'blur(0px)',
      };
    }
    if (diff === 1 || (diff === testimonials.length - 1 && diff !== 1)) {
      const isRight = diff === 1;
      return {
        transform: `translateX(${isRight ? '65%' : '-65%'}) scale(0.85) rotateY(${isRight ? '-8' : '8'}deg)`,
        opacity: 0.5,
        zIndex: 20,
        filter: 'blur(2px)',
      };
    }
    return {
      transform: `translateX(${diff > testimonials.length / 2 ? '-120%' : '120%'}) scale(0.7) rotateY(0deg)`,
      opacity: 0,
      zIndex: 10,
      filter: 'blur(4px)',
    };
  };

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative py-24 md:py-36 bg-white dark:bg-[#080816] transition-colors overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Backgrounds */}
      <AuroraBackground />
      <FloatingDots />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        {/* ─── Section Header ───────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full
              bg-gradient-to-r from-purple-500/10 to-pink-500/10
              dark:from-purple-500/20 dark:to-pink-500/20
              border border-purple-200/50 dark:border-purple-500/20
              mb-6 transition-all duration-700 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
          >
            <MessageCircle
              size={14}
              className="text-purple-500 animate-bounce"
              style={{ animationDuration: '2s' }}
            />
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              What People Say
            </span>
          </div>

          {/* Title */}
          <h2
            className={`text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight transition-all duration-700 delay-100 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="text-gray-900 dark:text-white">Voices of </span>
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 dark:from-purple-400 dark:via-pink-400 dark:to-rose-400 bg-clip-text text-transparent">
                Trust
              </span>
              {/* Animated sparkle dots */}
              <span
                className={`absolute -top-2 -right-4 w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-500 delay-700 ${
                  isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`}
                style={{
                  animation: isInView ? 'ping-slow 2s ease-in-out infinite' : 'none',
                }}
              />
              <span
                className={`absolute -bottom-1 -left-3 w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400 transition-all duration-500 delay-900 ${
                  isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`}
                style={{
                  animation: isInView ? 'ping-slow 2.5s ease-in-out infinite 0.5s' : 'none',
                }}
              />
            </span>
          </h2>

          <p
            className={`text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Don't just take my word for it — here's what friends and colleagues
            have to say about working with me.
          </p>
        </div>

        {/* ─── 3D Coverflow Carousel ────────────────────────────── */}
        <div
          className={`relative max-w-5xl mx-auto transition-all duration-1000 delay-300 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{ perspective: '1200px' }}
        >
          {/* Stacked cards */}
          <div className="relative h-[420px] md:h-[380px] flex items-center justify-center">
            {testimonials.map((testimonial, index) => {
              const cardStyle = getCardStyle(index);
              const isActive = index === activeIndex;

              return (
                <div
                  key={testimonial.id}
                  className="absolute w-full max-w-3xl px-4 cursor-pointer"
                  style={{
                    ...cardStyle,
                    transition:
                      'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                    transformStyle: 'preserve-3d',
                  }}
                  onClick={() => {
                    if (!isActive) {
                      const diff =
                        (index - activeIndex + testimonials.length) %
                        testimonials.length;
                      goTo(
                        index,
                        diff <= testimonials.length / 2 ? 'right' : 'left',
                      );
                    }
                  }}
                >
                  {/* Card */}
                  <div
                    className={`relative rounded-3xl overflow-hidden transition-shadow duration-700 ${
                      isActive
                        ? 'shadow-2xl shadow-purple-500/10 dark:shadow-purple-500/5'
                        : 'shadow-lg'
                    }`}
                  >
                    {/* Gradient border effect */}
                    <div
                      className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${testimonial.gradient} p-[1.5px] transition-opacity duration-700 ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <div className="w-full h-full rounded-3xl bg-white dark:bg-[#0f0f23]" />
                    </div>

                    {/* Content container */}
                    <div className="relative bg-white/80 dark:bg-[#0f0f23]/80 backdrop-blur-2xl rounded-3xl border border-gray-100 dark:border-white/[0.06] p-8 md:p-10">
                      {/* Top section: Quote icon + Stars */}
                      <div className="flex items-start justify-between mb-8">
                        <div
                          className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center shadow-lg transition-all duration-500 ${
                            isActive ? 'scale-100 rotate-0' : 'scale-90 rotate-12'
                          }`}
                          style={{
                            boxShadow: isActive
                              ? `0 8px 32px rgba(139, 92, 246, 0.3)`
                              : 'none',
                          }}
                        >
                          <Quote size={24} className="text-white" />
                          {/* Floating ring */}
                          <div
                            className={`absolute inset-0 rounded-2xl border-2 border-white/30 transition-all duration-700 ${
                              isActive ? 'scale-125 opacity-0' : 'scale-100 opacity-0'
                            }`}
                            style={{
                              animation: isActive
                                ? 'ring-pulse 2s ease-out infinite'
                                : 'none',
                            }}
                          />
                        </div>

                        <AnimatedStars
                          rating={testimonial.rating}
                          isVisible={isActive && isInView}
                          delay={200}
                        />
                      </div>

                      {/* Testimonial text */}
                      <blockquote
                        className={`text-lg md:text-xl leading-relaxed mb-8 transition-all duration-700 ${
                          isActive
                            ? 'text-gray-800 dark:text-gray-200'
                            : 'text-gray-500 dark:text-gray-500'
                        }`}
                        style={{ fontFamily: "'Georgia', serif" }}
                      >
                        <span className="text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-serif">
                          "
                        </span>
                        {testimonial.content}
                        <span className="text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-serif">
                          "
                        </span>
                      </blockquote>

                      {/* Author info */}
                      <div className="flex items-center gap-4">
                        {/* Avatar with ring */}
                        <div className="relative">
                          <div
                            className={`absolute inset-0 rounded-full bg-gradient-to-br ${testimonial.gradient} p-[2px] transition-all duration-500 ${
                              isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                            }`}
                            style={{
                              animation: isActive
                                ? 'spin 4s linear infinite'
                                : 'none',
                            }}
                          >
                            <div className="w-full h-full rounded-full bg-white dark:bg-[#0f0f23]" />
                          </div>
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="relative w-14 h-14 rounded-full object-cover"
                          />
                          {/* Online indicator */}
                          <div
                            className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white dark:border-[#0f0f23] transition-all duration-500 ${
                              isActive ? 'scale-100' : 'scale-0'
                            }`}
                          />
                        </div>

                        {/* Name & role */}
                        <div>
                          <h4
                            className={`font-bold text-lg transition-colors duration-500 ${
                              isActive
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-500 dark:text-gray-500'
                            }`}
                          >
                            {testimonial.name}
                          </h4>
                          <p
                            className={`text-sm font-medium bg-gradient-to-r ${testimonial.gradient} bg-clip-text text-transparent transition-opacity duration-500 ${
                              isActive ? 'opacity-100' : 'opacity-50'
                            }`}
                          >
                            {testimonial.role}
                          </p>
                        </div>

                        {/* Spacer + tiny branding */}
                        <div className="ml-auto hidden md:block">
                          <div
                            className={`px-3 py-1.5 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-xs text-gray-400 dark:text-gray-500 font-medium transition-all duration-500 ${
                              isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                            }`}
                          >
                            ✦ Verified
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ─── Controls Bar ───────────────────────────────────── */}
          <div
            className={`flex items-center justify-center gap-6 mt-12 transition-all duration-700 delay-500 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Prev button */}
            <button
              className="group relative w-12 h-12 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-purple-300 dark:hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:scale-110 active:scale-95"
              onClick={handlePrev}
              aria-label="Previous testimonial"
            >
              <ChevronLeft
                size={20}
                className="group-hover:-translate-x-0.5 transition-transform duration-300"
              />
            </button>

            {/* Navigation Dots with Progress Ring */}
            <div className="flex items-center gap-3">
              {testimonials.map((t, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    key={t.id}
                    onClick={() =>
                      goTo(
                        index,
                        index > activeIndex ? 'right' : 'left',
                      )
                    }
                    className="relative flex items-center justify-center"
                    aria-label={`Go to testimonial ${index + 1}`}
                  >
                    {isActive ? (
                      <div className="relative">
                        <ProgressRing progress={autoPlayProgress} size={40} stroke={2} />
                        <div
                          className={`absolute inset-0 flex items-center justify-center`}
                        >
                          <img
                            src={t.avatar}
                            alt={t.name}
                            className="w-7 h-7 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-white/15 hover:bg-gray-400 dark:hover:bg-white/30 hover:scale-125 transition-all duration-300 cursor-pointer" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Next button */}
            <button
              className="group relative w-12 h-12 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-purple-300 dark:hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:scale-110 active:scale-95"
              onClick={handleNext}
              aria-label="Next testimonial"
            >
              <ChevronRight
                size={20}
                className="group-hover:translate-x-0.5 transition-transform duration-300"
              />
            </button>
          </div>

          {/* Pause indicator */}
          <div
            className={`text-center mt-4 transition-all duration-300 ${
              isPaused ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="text-xs text-gray-400 dark:text-gray-600 font-medium tracking-wider uppercase">
              ⏸ Paused
            </span>
          </div>
        </div>

        {/* ─── Bottom Floating Avatars ──────────────────────────── */}
        <div
          className={`flex justify-center items-center gap-3 mt-16 transition-all duration-700 delay-600 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex -space-x-3">
            {testimonials.map((t, i) => (
              <img
                key={t.id}
                src={t.avatar}
                alt={t.name}
                className={`w-10 h-10 rounded-full border-3 border-white dark:border-[#080816] object-cover transition-all duration-500 hover:scale-110 hover:z-10 ${
                  activeIndex === i
                    ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-white dark:ring-offset-[#080816]'
                    : ''
                }`}
                style={{
                  animationDelay: `${i * 100}ms`,
                }}
              />
            ))}
          </div>
          <div className="ml-3">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              100% Satisfaction
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              from all collaborators
            </p>
          </div>
        </div>
      </div>

      {/* ─── Keyframe Animations ──────────────────────────────────── */}
      <style>{`
        @keyframes ping-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
        }
        @keyframes ring-pulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;