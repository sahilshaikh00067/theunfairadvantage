import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };

/* 3D word-flip heading (each word rotates up from the floor) */
export const Heading3D = ({ children, className = '' }) => (
  <h2 className={className} style={serif}>
    {String(children).split(' ').map((w, i) => (
      <span key={i} className="mr-[0.25em] inline-block overflow-hidden pb-2 align-bottom" style={{ perspective: 800, marginBottom: '-0.5rem' }}>
        <motion.span className="inline-block origin-bottom" initial={{ rotateX: -90, y: '60%', opacity: 0 }}
          whileInView={{ rotateX: 0, y: 0, opacity: 1 }} viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, delay: i * 0.06, ease: [0.2, 0.8, 0.2, 1] }}>{w}</motion.span>
      </span>
    ))}
  </h2>
);

/* Card tilts up from the floor as you scroll into it */
export const ScrollTilt = ({ children, className = 'h-full' }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.55'] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });
  const rotateX = useTransform(p, [0, 1], [38, 0]);
  const y = useTransform(p, [0, 1], [80, 0]);
  const scale = useTransform(p, [0, 1], [0.9, 1]);
  const opacity = useTransform(p, [0, 0.5], [0, 1]);
  return (
    <div ref={ref} style={{ perspective: 1400 }} className={className}>
      <motion.div style={{ rotateX, y, scale, opacity, transformOrigin: '50% 100%' }} className="h-full">{children}</motion.div>
    </div>
  );
};

/* Real CSS-3D rotating glass cubes */
const faces = ['rotateY(0deg)', 'rotateY(90deg)', 'rotateY(180deg)', 'rotateY(-90deg)', 'rotateX(90deg)', 'rotateX(-90deg)'];
const Cube = ({ size, x, y, dur, tone }) => (
  <div className="absolute" style={{ left: x, top: y, perspective: 900 }}>
    <motion.div animate={{ rotateX: 360, rotateY: 360 }} transition={{ duration: dur, repeat: Infinity, ease: 'linear' }}
      style={{ width: size, height: size, transformStyle: 'preserve-3d' }} className="relative">
      {faces.map((f) => <div key={f} style={{ transform: `${f} translateZ(${size / 2}px)` }} className={`absolute inset-0 border border-white/25 ${tone}`} />)}
    </motion.div>
  </div>
);
export const Cubes = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
    <Cube size={90} x="5%" y="64%" dur={22} tone="bg-[#C9A66B]/15" />
    <Cube size={56} x="47%" y="10%" dur={16} tone="bg-[#E6EAF2]/15" />
    <Cube size={120} x="86%" y="68%" dur={28} tone="bg-white/5" />
    <Cube size={40} x="93%" y="14%" dur={12} tone="bg-[#C9A66B]/25" />
  </div>
);

/* Slow drifting colour aurora */
export const Aurora = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
    <motion.div animate={{ x: [0, 90, 0], y: [0, 40, 0] }} transition={{ duration: 14, repeat: Infinity }} className="absolute -left-20 top-10 h-[420px] w-[420px] rounded-full bg-[#C9A66B]/20 blur-[110px]" />
    <motion.div animate={{ x: [0, -80, 0], y: [0, 60, 0] }} transition={{ duration: 18, repeat: Infinity }} className="absolute -right-20 bottom-0 h-[480px] w-[480px] rounded-full bg-[#E6EAF2]/20 blur-[120px]" />
  </div>
);

/* Cursor-following glow (desktop only) */
export const CursorAura = () => {
  const x = useMotionValue(-300), y = useMotionValue(-300);
  const sx = useSpring(x, { stiffness: 110, damping: 20 }), sy = useSpring(y, { stiffness: 110, damping: 20 });
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    setOn(true);
    const m = (e) => { x.set(e.clientX - 200); y.set(e.clientY - 200); };
    window.addEventListener('mousemove', m);
    return () => window.removeEventListener('mousemove', m);
  }, []);
  return on ? <motion.div style={{ x: sx, y: sy }} className="pointer-events-none fixed left-0 top-0 z-[45] h-[400px] w-[400px] rounded-full bg-[#C9A66B]/10 blur-3xl" /> : null;
};

/* Subtle film grain for a tactile premium finish */
export const Grain = () => (
  <div aria-hidden className="pointer-events-none fixed inset-0 z-[44] opacity-[0.06]"
    style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>\")" }} />
);

/* Intro curtain with counter */
export const Loader = () => {
  const [n, setN] = useState(0), [show, setShow] = useState(true);
  useEffect(() => {
    const i = setInterval(() => setN((p) => Math.min(100, p + 4)), 50);
    const t = setTimeout(() => setShow(false), 1600);
    return () => { clearInterval(i); clearTimeout(t); };
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div exit={{ y: '-100%' }} transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0B1220] text-white">
          <p className="text-3xl font-bold sm:text-5xl" style={serif}>The Unfair Advantage</p>
          <div className="mt-8 h-1 w-56 overflow-hidden rounded-full bg-white/15"><div style={{ width: `${n}%` }} className="h-full bg-[#C9A66B] transition-all" /></div>
          <p className="mt-3 font-mono text-sm text-white/60">{n}%</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};