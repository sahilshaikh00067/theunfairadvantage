import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import {
  motion, useScroll, useTransform, useSpring, useVelocity, useMotionValue, useAnimationFrame,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const U = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=85`;
const serif = { fontFamily: "'Playfair Display', Georgia, serif" };

/* 1. LENIS SMOOTH SCROLL (buttery inertia + anchor links) */
export function SmoothScroll({ children }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ duration: 1.25, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    let id;
    const raf = (t) => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    const click = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute('href') === '#') return;
      const el = document.querySelector(a.getAttribute('href'));
      if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -80, duration: 1.6 }); }
    };
    document.addEventListener('click', click);
    return () => { cancelAnimationFrame(id); document.removeEventListener('click', click); lenis.destroy(); };
  }, []);
  return children;
}

/* 2. WORD-BY-WORD SCROLL TEXT REVEAL */
const Word = ({ children, p, range }) => {
  const o = useTransform(p, range, [0.12, 1]);
  const y = useTransform(p, range, [8, 0]);
  return <span className="mr-[0.28em] inline-block"><motion.span style={{ opacity: o, y }} className="inline-block">{children}</motion.span></span>;
};
export function WordReveal({ text, className = '' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'start 0.25'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className={className} style={serif}>
      {words.map((w, i) => <Word key={i} p={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{w}</Word>)}
    </p>
  );
}

/* 3. SCROLL ZOOM REVEAL (small rounded image grows to fullscreen) */
export function ZoomReveal({ img = '1505373877841-8d25f7d46678', title, sub }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const scale = useTransform(p, [0, 0.7], [0.42, 1]);
  const radius = useTransform(p, [0, 0.7], [56, 0]);
  const textO = useTransform(p, [0.45, 0.75], [0, 1]);
  const textY = useTransform(p, [0.45, 0.75], [40, 0]);
  return (
    <section ref={ref} className="relative h-[260vh] bg-[#0B1220]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <motion.div style={{ scale, borderRadius: radius }} className="relative h-full w-full overflow-hidden">
          <img src={U(img, 2000)} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/45" />
        </motion.div>
        <motion.div style={{ opacity: textO, y: textY }} className="absolute inset-x-6 max-w-4xl text-center text-white">
          <h2 className="text-4xl font-bold leading-tight sm:text-6xl" style={serif}>{title}</h2>
          <p className="mt-4 text-lg text-white/75">{sub}</p>
        </motion.div>
      </div>
    </section>
  );
}

/* 4. PINNED HORIZONTAL SCROLL GALLERY */
const slides = [
  ['1540575467063-178a50c2df87', 'Live keynotes', 'Four operators, one stage, zero slides of fluff.'],
  ['1552664730-d307ca884978', 'Boardroom audits', 'Real P&Ls restructured on screen.'],
  ['1515187029135-18ee286d815b', 'Strategy teardowns', 'Funnels and offers rebuilt in real time.'],
  ['1591115765373-5207764f72e7', 'Founder syndicate', 'Vetted founders and C-suite in one room.'],
  ['1517245386807-bb43f82c33c4', 'Implementation vault', 'SOPs and prompts to install in 24 hours.'],
];
export function HorizontalShowcase() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 100, damping: 26 });
  const x = useTransform(p, [0, 1], ['4%', '-72%']);
  const bar = useTransform(p, [0, 1], ['0%', '100%']);
  return (
    <section ref={ref} className="relative h-[400vh] bg-[#E6EAF2]/40">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-8 flex w-full max-w-7xl items-end justify-between px-6">
          <h2 className="text-4xl font-bold sm:text-5xl" style={serif}>What happens inside Jet Digital Infotech</h2>
          <div className="hidden h-1 w-48 overflow-hidden rounded-full bg-[#0B1220]/10 sm:block"><motion.div style={{ width: bar }} className="h-full bg-[#0B1220]" /></div>
        </div>
        <motion.div style={{ x }} className="flex gap-6 pl-6">
          {slides.map(([id, t, d], i) => (
            <div key={t} className="group relative h-[58vh] w-[78vw] shrink-0 overflow-hidden rounded-[32px] shadow-2xl md:w-[42vw]">
              <img src={U(id, 1200)} alt={t} className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-x-7 bottom-7 text-white">
                <span className="rounded-full bg-[#C9A66B] px-3 py-1 text-xs font-bold text-[#0B1220]">0{i + 1}</span>
                <h3 className="mt-3 text-3xl font-bold" style={serif}>{t}</h3>
                <p className="mt-1 text-sm text-white/75">{d}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* 5. STICKY STACKING CARDS */
const stack = [
  ['1552664730-d307ca884978', 'Diagnose', 'Find where price compression and commoditization are eating your margin.', 'bg-[#C9A66B]'],
  ['1531482615713-2afd69097998', 'Install', 'Deploy private AI agents for research, outbound and delivery.', 'bg-[#E6EAF2]'],
  ['1519085360753-af0119f7cbe7', 'Anchor', 'Package your expertise into high-ticket annual retainers.', 'bg-white'],
  ['1522071820081-009f0129c71c', 'Scale', 'Join the founder syndicate and compound deal flow.', 'bg-[#C9A66B]'],
];
const StackCard = ({ i, n, p, d, onClick }) => {
  const scale = useTransform(p, [i / n, 1], [1, 1 - (n - i) * 0.05]);
  return (
    <div className="sticky top-0 flex h-screen items-center justify-center px-6">
      <motion.div style={{ scale, top: `calc(-4vh + ${i * 26}px)` }}
        className={`relative grid h-[460px] w-full max-w-5xl overflow-hidden rounded-[36px] border border-[#0B1220]/10 shadow-[0_40px_90px_-30px_rgba(11,18,32,.4)] md:grid-cols-2 ${d[3]}`}>
        <div className="flex flex-col justify-center p-10">
          <span className="font-mono text-sm font-bold opacity-60">Step {i + 1} of {n}</span>
          <h3 className="mt-3 text-5xl font-bold" style={serif}>{d[1]}</h3>
          <p className="mt-4 max-w-sm text-[#0B1220]/75">{d[2]}</p>
          <button onClick={onClick} className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-[#0B1220] px-6 py-3 text-sm font-bold text-white">Reserve a seat <ArrowUpRight className="h-4 w-4" /></button>
        </div>
        <img src={U(d[0], 1000)} alt={d[1]} className="hidden h-full w-full object-cover md:block" />
      </motion.div>
    </div>
  );
};
export function StackingCards({ onCta }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  return <div ref={ref} className="relative">{stack.map((d, i) => <StackCard key={d[1]} i={i} n={stack.length} p={scrollYProgress} d={d} onClick={onCta} />)}</div>;
}

/* 6. SCROLL-VELOCITY MARQUEE (speeds up and skews as you scroll) */
const wrap = (min, max, v) => { const r = max - min; return ((((v - min) % r) + r) % r) + min; };
export function VelocityMarquee({ words = ['Unfair Advantage', 'Live 28 Nov', 'Only 250 Seats'] }) {
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const smooth = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 5], { clamp: false });
  const skew = useTransform(smooth, [-2000, 0, 2000], [-6, 0, 6]);
  const dir = useRef(1);
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);
  useAnimationFrame((_, delta) => {
    const f = factor.get();
    if (f < 0) dir.current = -1; else if (f > 0) dir.current = 1;
    base.set(base.get() + dir.current * -3 * (delta / 1000) * (1 + Math.abs(f)));
  });
  return (
    <div className="overflow-hidden bg-[#C9A66B] py-6">
      <motion.div style={{ x, skewX: skew }} className="flex w-max whitespace-nowrap">
        {[...Array(2)].map((_, k) => (
          <div key={k} className="flex shrink-0">
            {words.concat(words).map((w, i) => <span key={i} className="mx-8 text-5xl font-bold text-[#0B1220] sm:text-7xl" style={serif}>{w} <span className="text-[#0B1220]/30">✦</span></span>)}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* 7. PARALLAX IMAGE (inner image drifts inside a frame) */
export function ParallaxImage({ id, className = '', alt = '' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img src={U(id, 1400)} alt={alt} style={{ y, scale: 1.25 }} className="h-full w-full object-cover" />
    </div>
  );
}