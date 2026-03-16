import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send,
  Phone,
  Mail,
  MapPin,
  Loader2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Globe,
  Clock,
} from 'lucide-react';
import { useInView } from '../hooks/useInView';
import emailjs from '@emailjs/browser';

/* ── Animated Mesh Gradient Background ──────────────────────────────── */
const MeshGradientBg: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="mesh-gradient-1" />
    <div className="mesh-gradient-2" />
    <div className="mesh-gradient-3" />
    <div className="mesh-gradient-4" />
    <style>{`
      .mesh-gradient-1,
      .mesh-gradient-2,
      .mesh-gradient-3,
      .mesh-gradient-4 {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        opacity: 0.07;
      }
      .mesh-gradient-1 {
        width: 500px; height: 500px;
        background: #6366f1;
        top: -10%; right: -5%;
        animation: mesh-float 20s ease-in-out infinite;
      }
      .mesh-gradient-2 {
        width: 400px; height: 400px;
        background: #ec4899;
        bottom: -10%; left: -5%;
        animation: mesh-float 16s ease-in-out infinite reverse;
      }
      .mesh-gradient-3 {
        width: 300px; height: 300px;
        background: #06b6d4;
        top: 40%; left: 30%;
        animation: mesh-float 22s ease-in-out infinite 3s;
      }
      .mesh-gradient-4 {
        width: 350px; height: 350px;
        background: #f59e0b;
        top: 20%; right: 25%;
        animation: mesh-float 18s ease-in-out infinite 6s;
      }
      @keyframes mesh-float {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(40px, -30px) scale(1.1); }
        50% { transform: translate(-20px, 40px) scale(0.95); }
        75% { transform: translate(30px, 20px) scale(1.05); }
      }
    `}</style>
  </div>
);

/* ── Animated Grid Lines ────────────────────────────────────────────── */
const AnimatedGrid: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="contact-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <path
            d="M 60 0 L 0 0 0 60"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-indigo-200/20 dark:text-indigo-500/[0.06]"
          />
        </pattern>
        <radialGradient id="grid-fade" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="grid-mask">
          <rect width="100%" height="100%" fill="url(#grid-fade)" />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#contact-grid)" mask="url(#grid-mask)" />
    </svg>
    {/* Scanning line effect */}
    <div className="scan-line" />
    <style>{`
      .scan-line {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent);
        animation: scan 8s linear infinite;
      }
      @keyframes scan {
        0% { top: -2px; opacity: 0; }
        5% { opacity: 1; }
        95% { opacity: 1; }
        100% { top: 100%; opacity: 0; }
      }
    `}</style>
  </div>
);

/* ── Floating Label Input ───────────────────────────────────────────── */
const FloatingInput: React.FC<{
  id: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  error?: string;
  icon: React.ReactNode;
  delay?: number;
  isVisible: boolean;
}> = ({ id, name, type = 'text', value, onChange, label, error, icon, delay = 0, isVisible }) => {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;

  return (
    <div
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className={`relative group rounded-2xl transition-all duration-500 ${
          focused
            ? 'shadow-lg shadow-indigo-500/10 dark:shadow-indigo-500/5'
            : ''
        }`}
      >
        {/* Animated border gradient */}
        <div
          className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-opacity duration-500 ${
            focused ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Error border */}
        <div
          className={`absolute -inset-[1px] rounded-2xl bg-red-500 transition-opacity duration-300 ${
            error ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div className="relative bg-white dark:bg-[#0d0d24] rounded-2xl">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <span
              className={`transition-colors duration-300 ${
                focused
                  ? 'text-indigo-500'
                  : error
                  ? 'text-red-400'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {icon}
            </span>
          </div>
          <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="relative w-full pl-12 pr-4 pt-6 pb-2 bg-transparent rounded-2xl border border-gray-200 dark:border-white/[0.08] focus:border-transparent focus:outline-none text-gray-900 dark:text-white text-base transition-all duration-300"
            placeholder=" "
          />
          <label
            htmlFor={id}
            className={`absolute left-12 transition-all duration-300 pointer-events-none ${
              isActive
                ? 'top-2 text-xs font-semibold'
                : 'top-1/2 -translate-y-1/2 text-sm'
            } ${
              focused
                ? 'text-indigo-500 dark:text-indigo-400'
                : error
                ? 'text-red-400'
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            {label}
          </label>
        </div>
      </div>
      {/* Error message */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          error ? 'max-h-8 opacity-100 mt-2' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1 pl-1">
          <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />
          {error}
        </p>
      </div>
    </div>
  );
};

/* ── Floating Label Textarea ────────────────────────────────────────── */
const FloatingTextarea: React.FC<{
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label: string;
  error?: string;
  delay?: number;
  isVisible: boolean;
}> = ({ id, name, value, onChange, label, error, delay = 0, isVisible }) => {
  const [focused, setFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const isActive = focused || value.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
    onChange(e);
  };

  return (
    <div
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className={`relative group rounded-2xl transition-all duration-500 ${
          focused ? 'shadow-lg shadow-indigo-500/10 dark:shadow-indigo-500/5' : ''
        }`}
      >
        <div
          className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-opacity duration-500 ${
            focused ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute -inset-[1px] rounded-2xl bg-red-500 transition-opacity duration-300 ${
            error ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div className="relative bg-white dark:bg-[#0d0d24] rounded-2xl">
          <textarea
            id={id}
            name={name}
            rows={5}
            value={value}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="relative w-full px-5 pt-8 pb-3 bg-transparent rounded-2xl border border-gray-200 dark:border-white/[0.08] focus:border-transparent focus:outline-none text-gray-900 dark:text-white text-base resize-none transition-all duration-300"
            placeholder=" "
          />
          <label
            htmlFor={id}
            className={`absolute left-5 transition-all duration-300 pointer-events-none ${
              isActive
                ? 'top-2.5 text-xs font-semibold'
                : 'top-5 text-sm'
            } ${
              focused
                ? 'text-indigo-500 dark:text-indigo-400'
                : error
                ? 'text-red-400'
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            {label}
          </label>

          {/* Character count */}
          <div
            className={`absolute bottom-3 right-4 text-xs transition-opacity duration-300 ${
              focused ? 'opacity-100' : 'opacity-0'
            } ${
              charCount > 500
                ? 'text-amber-500'
                : 'text-gray-400 dark:text-gray-600'
            }`}
          >
            {charCount}
          </div>
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          error ? 'max-h-8 opacity-100 mt-2' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1 pl-1">
          <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />
          {error}
        </p>
      </div>
    </div>
  );
};

/* ── Magnetic Button ────────────────────────────────────────────────── */
const MagneticButton: React.FC<{
  children: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}> = ({ children, disabled, type = 'button', className = '' }) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      const btn = btnRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      setPosition({ x: x * 0.2, y: y * 0.2 });
    },
    [disabled],
  );

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return (
    <button
      ref={btnRef}
      type={type}
      disabled={disabled}
      className={className}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: 'transform 0.2s ease-out',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
};

/* ── Success Celebration ────────────────────────────────────────────── */
const SuccessAnimation: React.FC = () => (
  <div className="relative flex flex-col items-center justify-center py-16">
    {/* Confetti particles */}
    {Array.from({ length: 30 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 rounded-full"
        style={{
          background: ['#6366f1', '#ec4899', '#f59e0b', '#06b6d4', '#22c55e'][i % 5],
          left: '50%',
          top: '30%',
          animation: `confetti-burst 1.5s ease-out ${i * 0.03}s forwards`,
          transform: 'scale(0)',
        }}
      />
    ))}

    {/* Success ring */}
    <div className="relative mb-8">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-xl shadow-emerald-500/30 animate-success-pop">
        <CheckCircle2 size={48} className="text-white" strokeWidth={2.5} />
      </div>
      {/* Ripple rings */}
      <div className="absolute inset-0 rounded-full border-2 border-emerald-400/50 animate-ripple-1" />
      <div className="absolute inset-0 rounded-full border-2 border-emerald-400/30 animate-ripple-2" />
      <div className="absolute inset-0 rounded-full border-2 border-emerald-400/10 animate-ripple-3" />
    </div>

    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 animate-fade-up-1">
      Message Sent! 🎉
    </h3>
    <p className="text-gray-600 dark:text-gray-400 text-center max-w-md leading-relaxed animate-fade-up-2">
      Thank you for reaching out. I'll get back to you within 24 hours.
    </p>

    <style>{`
      @keyframes confetti-burst {
        0% { transform: scale(0) translate(0, 0) rotate(0deg); opacity: 1; }
        100% {
          transform: scale(1) translate(
            ${() => ''}var(--tx, 0px),
            ${() => ''}var(--ty, 0px)
          ) rotate(720deg);
          opacity: 0;
        }
      }
      @keyframes success-pop {
        0% { transform: scale(0) rotate(-45deg); }
        50% { transform: scale(1.2) rotate(10deg); }
        70% { transform: scale(0.9) rotate(-5deg); }
        100% { transform: scale(1) rotate(0deg); }
      }
      .animate-success-pop { animation: success-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      @keyframes ripple {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(2.5); opacity: 0; }
      }
      .animate-ripple-1 { animation: ripple 1.5s ease-out 0.2s infinite; }
      .animate-ripple-2 { animation: ripple 1.5s ease-out 0.5s infinite; }
      .animate-ripple-3 { animation: ripple 1.5s ease-out 0.8s infinite; }
      @keyframes fade-up {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-up-1 { animation: fade-up 0.6s ease-out 0.4s both; }
      .animate-fade-up-2 { animation: fade-up 0.6s ease-out 0.6s both; }
    `}</style>
  </div>
);

/* ── Interface ──────────────────────────────────────────────────────── */
interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

/* ── Main Contact Component ─────────────────────────────────────────── */
const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.2 });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const serviceID = 'service_4eheq8m';
    const templateID = 'template_zi2ntts';
    const userID = 'Fpn8wAL-SgnUSeYgo';

    emailjs
      .send(serviceID, templateID, formData, userID)
      .then(() => {
        setSubmitting(false);
        setSubmitted(true);
        setTimeout(() => {
          setFormData({ name: '', email: '', subject: '', message: '' });
          setSubmitted(false);
        }, 4000);
      })
      .catch((error) => {
        console.error('Email sending failed:', error);
        setSubmitting(false);
        alert(
          'An error occurred while sending the message. Please try again later.',
        );
      });
  };

  const contactInfo = [
    {
      icon: <Phone size={22} />,
      title: 'Phone',
      content: '+91 8051311335',
      link: 'tel:+918051311335',
      gradient: 'from-blue-500 to-cyan-400',
      bgGlow: 'rgba(59, 130, 246, 0.15)',
      description: 'Mon-Fri, 9am-6pm IST',
    },
    {
      icon: <Mail size={22} />,
      title: 'Email',
      content: 'abhiks1710@gmail.com',
      link: 'https://mail.google.com/mail/?view=cm&fs=1&to=abhiks1710@gmail.com',
      gradient: 'from-purple-500 to-pink-500',
      bgGlow: 'rgba(168, 85, 247, 0.15)',
      description: 'Response within 24 hours',
    },
    {
      icon: <MapPin size={22} />,
      title: 'Location',
      content: 'Bangalore, India',
      link: 'https://www.google.com/maps/search/?api=1&query=Bangalore,India',
      gradient: 'from-amber-500 to-orange-500',
      bgGlow: 'rgba(245, 158, 11, 0.15)',
      description: 'Open to remote work',
    },
  ];

  const statusItems = [
    { icon: <Zap size={14} />, text: 'Available for hire', color: 'text-emerald-500' },
    { icon: <Clock size={14} />, text: '< 24h response', color: 'text-blue-500' },
    { icon: <Globe size={14} />, text: 'Remote friendly', color: 'text-purple-500' },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-24 md:py-36 bg-gray-50/50 dark:bg-[#060612] transition-colors overflow-hidden"
    >
      {/* Backgrounds */}
      <MeshGradientBg />
      <AnimatedGrid />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        {/* ─── Section Header ───────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full
              bg-gradient-to-r from-indigo-500/10 to-cyan-500/10
              dark:from-indigo-500/20 dark:to-cyan-500/20
              border border-indigo-200/50 dark:border-indigo-500/20
              mb-6 transition-all duration-700 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
          >
            <Sparkles
              size={14}
              className="text-indigo-500"
              style={{ animation: 'spin 3s linear infinite' }}
            />
            <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Let's Connect
            </span>
          </div>

          <h2
            className={`text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight transition-all duration-700 delay-100 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="text-gray-900 dark:text-white">Get in </span>
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 dark:from-indigo-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Touch
              </span>
              {/* Decorative underline */}
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
              >
                <path
                  d="M2 10C50 2 150 2 198 10"
                  stroke="url(#contact-underline)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: 200,
                    strokeDashoffset: isInView ? 0 : 200,
                    transition: 'stroke-dashoffset 1.2s ease-out 0.6s',
                  }}
                />
                <defs>
                  <linearGradient id="contact-underline" x1="0" y1="0" x2="200" y2="0">
                    <stop stopColor="#6366f1" />
                    <stop offset="0.5" stopColor="#a855f7" />
                    <stop offset="1" stopColor="#06b6d4" />
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
            Have a project in mind? Let's discuss how we can work together to
            bring your ideas to life. I'm currently available for freelance work.
          </p>

          {/* Status indicators */}
          <div
            className={`flex flex-wrap justify-center gap-4 mt-8 transition-all duration-700 delay-300 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {statusItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10"
              >
                <span className={item.color}>{item.icon}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Main Content Grid ────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl mx-auto">
          {/* ── Left: Contact Info ──────────────────────────────── */}
          <div
            className={`lg:col-span-5 transition-all duration-1000 ${
              isInView ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
            }`}
          >
            <div className="space-y-5 mb-8">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  target={item.link.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className={`group relative block rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] ${
                    isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${400 + index * 150}ms` }}
                >
                  {/* Card */}
                  <div className="relative bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl border border-gray-200/60 dark:border-white/[0.06] rounded-2xl p-6 hover:border-indigo-300/50 dark:hover:border-indigo-500/20 transition-all duration-500">
                    {/* Hover glow */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                      style={{ background: `radial-gradient(circle at 30% 50%, ${item.bgGlow}, transparent 70%)` }}
                    />

                    <div className="relative flex items-center gap-5">
                      {/* Icon */}
                      <div
                        className={`relative flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
                      >
                        {item.icon}
                        {/* Pulse ring */}
                        <div
                          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-40 transition-opacity duration-500`}
                          style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-0.5 uppercase tracking-wider">
                          {item.title}
                        </p>
                        <p className="text-base font-bold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                          {item.content}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          {item.description}
                        </p>
                      </div>

                      {/* Arrow */}
                      <ArrowRight
                        size={18}
                        className="text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0"
                      />
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* ── Decorative Card ──────────────────────────────── */}
            <div
              className={`relative rounded-2xl overflow-hidden transition-all duration-700 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '850ms' }}
            >
              <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white overflow-hidden">
                {/* Pattern overlay */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '24px 24px',
                  }}
                />

                {/* Floating shapes */}
                <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/10 blur-lg animate-pulse" />
                <div
                  className="absolute bottom-4 left-4 w-16 h-16 rounded-2xl bg-white/10 blur-lg"
                  style={{ animation: 'pulse 3s ease-in-out infinite 1s' }}
                />

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-5">
                    <Send size={22} className="text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-2">Let's Build Together</h4>
                  <p className="text-white/70 text-sm leading-relaxed mb-5">
                    Whether it's a web app, mobile solution, or creative project
                    — I'm here to bring your vision to life.
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="relative flex -space-x-2">
                      {['🚀', '💡', '⚡'].map((emoji, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-sm border-2 border-white/30"
                        >
                          {emoji}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-white/60">
                      Fast • Reliable • Creative
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Contact Form ─────────────────────────────── */}
          <div
            className={`lg:col-span-7 transition-all duration-1000 delay-300 ${
              isInView ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
            }`}
          >
            {submitted ? (
              <div className="bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl border border-gray-200/60 dark:border-white/[0.06] rounded-3xl h-full flex items-center justify-center">
                <SuccessAnimation />
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="relative bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl border border-gray-200/60 dark:border-white/[0.06] rounded-3xl p-8 md:p-10 hover:shadow-xl hover:shadow-indigo-500/5 transition-shadow duration-700"
              >
                {/* Form header */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-3 text-xs font-mono text-gray-400 dark:text-gray-600">
                    contact-form.tsx
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <FloatingInput
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    label="Your Name"
                    error={errors.name}
                    icon={<Sparkles size={18} />}
                    delay={500}
                    isVisible={isInView}
                  />
                  <FloatingInput
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    label="Your Email"
                    error={errors.email}
                    icon={<Mail size={18} />}
                    delay={600}
                    isVisible={isInView}
                  />
                </div>

                <div className="mb-5">
                  <FloatingInput
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    label="Subject"
                    icon={<Zap size={18} />}
                    delay={700}
                    isVisible={isInView}
                  />
                </div>

                <div className="mb-8">
                  <FloatingTextarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    label="Your Message"
                    error={errors.message}
                    delay={800}
                    isVisible={isInView}
                  />
                </div>

                {/* Submit button */}
                <div
                  className={`transition-all duration-700 ${
                    isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                  style={{ transitionDelay: '900ms' }}
                >
                  <MagneticButton
                    type="submit"
                    disabled={submitting}
                    className={`group relative w-full md:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-semibold text-base text-white overflow-hidden transition-all duration-500 disabled:opacity-60 disabled:cursor-not-allowed ${
                      submitting
                        ? ''
                        : 'hover:shadow-xl hover:shadow-indigo-500/25 active:scale-[0.98]'
                    }`}
                  >
                    {/* Button gradient background */}
                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-[length:200%_200%] animate-gradient-shift" />

                    {/* Shimmer effect */}
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </span>

                    {/* Content */}
                    <span className="relative flex items-center gap-3">
                      {submitting ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          <span>Sending...</span>
                          {/* Progress dots */}
                          <span className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                              <span
                                key={i}
                                className="w-1.5 h-1.5 rounded-full bg-white/60"
                                style={{
                                  animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite both`,
                                }}
                              />
                            ))}
                          </span>
                        </>
                      ) : (
                        <>
                          <Send
                            size={20}
                            className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
                          />
                          <span>Send Message</span>
                          <ArrowRight
                            size={18}
                            className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300"
                          />
                        </>
                      )}
                    </span>
                  </MagneticButton>
                </div>

                {/* Privacy note */}
                <p
                  className={`mt-5 text-xs text-gray-400 dark:text-gray-600 flex items-center gap-2 transition-all duration-700 ${
                    isInView ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ transitionDelay: '1000ms' }}
                >
                  <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </span>
                  Your information is secure and will never be shared with third parties.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ─── Keyframes ────────────────────────────────────────────── */}
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-shift {
          animation: gradient-shift 4s ease infinite;
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default Contact;