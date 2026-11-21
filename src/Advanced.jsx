import React, { useEffect, useRef, useState } from 'react';
import {
  motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, useMotionValueEvent, useInView, AnimatePresence,
} from 'framer-motion';
import { ArrowUpRight, Star, Crown, ShieldCheck, Users, Award } from 'lucide-react';

const U = (id, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=85`;
const serif = { fontFamily: "'Playfair Display', Georgia, serif" };

/* Nav hides on scroll down, returns on scroll up */
export const useScrollDir = () => {
  const { scrollY } = useScroll();
  const [hide, setHide] = useState(false);
  useMotionValueEvent(scrollY, 'change', (y) => setHide(y > 200 && y > (scrollY.getPrevious() ?? 0)));
  return hide;
};

/* Masked line-by-line hero headline */
export const HeroTitle = () => (
  <h1 className="mt-6 text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-[68px]" style={serif}>
    {[['Stop competing fairly.', ''], ['Build the advantage', ''], ['nobody can copy.', 'bg-gradient-to-r from-[#E8D3A2] via-[#C9A66B] to-[#E8D3A2] bg-clip-text text-transparent']].map(([t, c], i) => (
      <span key={t} className="block overflow-hidden pb-2">
        <motion.span className={`block ${c}`} initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: 1.7 + i * 0.15, ease: [0.2, 0.8, 0.2, 1] }}>{t}</motion.span>
      </span>
    ))}
  </h1>
);

/* Custom cursor ring that grows over links and buttons */
export const CursorRing = () => {
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 400, damping: 30 }), sy = useSpring(y, { stiffness: 400, damping: 30 });
  const [big, setBig] = useState(false), [on, setOn] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    setOn(true);
    const m = (e) => { x.set(e.clientX - 16); y.set(e.clientY - 16); setBig(!!e.target.closest('a, button, input')); };
    window.addEventListener('mousemove', m);
    return () => window.removeEventListener('mousemove', m);
  }, []);
  return on ? <motion.div style={{ x: sx, y: sy }} animate={{ scale: big ? 2.2 : 1 }} className="pointer-events-none fixed left-0 top-0 z-[90] h-8 w-8 rounded-full border border-white mix-blend-difference" /> : null;
};

/* Floating CTA bar after the hero */
export const StickyCTA = ({ onCta }) => {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, 'change', (y) => setShow(y > 800));
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
          className="fixed bottom-5 left-1/2 z-40 flex w-[92%] max-w-xl -translate-x-1/2 items-center justify-between gap-4 rounded-full border border-white/15 bg-[#0B1220]/85 py-2.5 pl-6 pr-2.5 text-white shadow-2xl backdrop-blur-xl">
          <p className="text-sm"><span className="font-bold text-[#C9A66B]">16 VIP seats left</span> · Live 28 Nov</p>
          <button onClick={onCta} className="flex items-center gap-1.5 rounded-full bg-[#C9A66B] px-5 py-2.5 text-sm font-bold text-[#0B1220]">Reserve <ArrowUpRight className="h-4 w-4" /></button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* Tilted 3D wall of photos moving at different speeds */
const cols = [
  ['1540575467063-178a50c2df87', '1552664730-d307ca884978', '1515187029135-18ee286d815b'],
  ['1591115765373-5207764f72e7', '1505373877841-8d25f7d46678', '1531482615713-2afd69097998'],
  ['1517245386807-bb43f82c33c4', '1522071820081-009f0129c71c', '1497366216548-37526070297c'],
];
export const ImageWall = ({ onCta }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '-28%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['-28%', '4%']);
  const scale = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [1, 1.1, 1]);
  const ys = [y1, y2, y1];
  return (
    <section ref={ref} className="relative h-[130vh] overflow-hidden bg-[#0B1220]">
      <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: 1400 }}>
        <motion.div style={{ rotateX: 24, rotateZ: -12, scale }} className="grid w-[150%] shrink-0 grid-cols-3 gap-5">
          {cols.map((c, i) => (
            <motion.div key={i} style={{ y: ys[i] }} className="space-y-5">
              {c.concat(c).map((id, k) => <img key={k} src={U(id, 700)} alt="" className="h-72 w-full rounded-3xl object-cover opacity-80" />)}
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[radial-gradient(circle,rgba(11,18,32,.35),rgba(11,18,32,.92))] px-6 text-center text-white">
        <h2 className="max-w-4xl text-5xl font-bold leading-tight sm:text-7xl" style={serif}>One room. Sixty countries. Zero fluff.</h2>
        <p className="mt-5 max-w-xl text-white/70">Founders, operators and investors from 60+ countries rebuild their margins live, together.</p>
        <button onClick={onCta} className="mt-8 flex items-center gap-2 rounded-full bg-[#C9A66B] px-8 py-4 text-sm font-bold text-[#0B1220]">Join the room <ArrowUpRight className="h-4 w-4" /></button>
      </div>
    </section>
  );
};

/* Pinned scroll story: left list highlights, right image flips in 3D */
export const PinnedStory = ({ steps }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [a, setA] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => setA(Math.min(steps.length - 1, Math.floor(v * steps.length))));
  return (
    <section id="thesis" ref={ref} className="relative bg-[#F5F6F8]" style={{ height: `${steps.length * 100 + 40}vh` }}>
      <div className="sticky top-0 mx-auto grid h-screen max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <div>
          <h2 className="text-4xl font-bold leading-tight sm:text-5xl" style={serif}>Four levers that separate the top 0.1%</h2>
          <ul className="mt-9 space-y-3">
            {steps.map((s, i) => (
              <li key={s.t} className={`rounded-2xl border p-5 transition-all duration-500 ${i === a ? 'scale-[1.02] border-[#0B1220] bg-[#C9A66B] shadow-xl' : 'border-[#0B1220]/10 opacity-45'}`}>
                <div className="flex items-center gap-4"><span className="font-mono text-sm font-bold">0{i + 1}</span><p className="text-xl font-bold" style={serif}>{s.t}</p></div>
                {i === a && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2 pl-9 text-sm text-[#0B1220]/75">{s.d}</motion.p>}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ perspective: 1400 }} className="relative h-[58vh]">
          <AnimatePresence mode="wait">
            <motion.div key={a} initial={{ rotateY: -70, opacity: 0, x: 60 }} animate={{ rotateY: 0, opacity: 1, x: 0 }} exit={{ rotateY: 70, opacity: 0, x: -60 }} transition={{ duration: 0.6 }}
              className="absolute inset-0 overflow-hidden rounded-[36px] shadow-[0_50px_100px_-30px_rgba(11,18,32,.5)]">
              <img src={U(steps[a].img, 1100)} alt={steps[a].t} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <p className="absolute bottom-6 left-6 text-3xl font-bold text-white" style={serif}>{steps[a].t}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

/* Bento stats with animated counters */
const Count = ({ to, prefix = '', suffix = '' }) => {
  const ref = useRef(null), inView = useInView(ref, { once: true, margin: '-80px' });
  const mv = useMotionValue(0), sp = useSpring(mv, { stiffness: 60, damping: 20 });
  const [v, setV] = useState(0);
  useEffect(() => { if (inView) mv.set(to); }, [inView]);
  useMotionValueEvent(sp, 'change', (x) => setV(Math.round(x)));
  return <span ref={ref}>{prefix}{v.toLocaleString()}{suffix}</span>;
};
export const Bento = () => {
  const tiles = [
    { c: 'lg:col-span-2 lg:row-span-2 bg-[#0B1220] text-white', n: <Count to={2300} suffix="+" />, l: 'founders and operators attended past briefings', img: '1540575467063-178a50c2df87' },
    { c: 'bg-[#C9A66B]', n: <Count to={318} suffix="%" />, l: 'average margin lift reported by alumni' },
    { c: 'bg-[#E6EAF2]', n: <Count to={60} suffix="+" />, l: 'countries represented' },
    { c: 'bg-white border border-[#0B1220]/10', n: <Count to={94} />, l: 'page executive dossier' },
    { c: 'bg-[#0B1220] text-white', n: '4.9/5', l: 'average session rating' },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-28">
      <h2 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl" style={serif}>The numbers behind the room</h2>
      <div className="mt-12 grid auto-rows-[190px] gap-5 lg:grid-cols-4">
        {tiles.map((t, i) => (
          <motion.div key={i} initial={{ opacity: 0, rotateX: 30, y: 50 }} whileInView={{ opacity: 1, rotateX: 0, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.08 }} whileHover={{ rotateY: 4, rotateX: -3, scale: 1.02 }} style={{ transformPerspective: 1000 }}
            className={`relative flex flex-col justify-end overflow-hidden rounded-[28px] p-7 shadow-lg ${t.c}`}>
            {t.img && <><img src={U(t.img, 900)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" /><div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] to-transparent" /></>}
            <p className="relative text-5xl font-bold sm:text-6xl" style={serif}>{t.n}</p>
            <p className="relative mt-1 text-sm opacity-70">{t.l}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

/* Two-row opposite-direction testimonial marquee */
const quotes = [
  ['Siddharth Malhotra', 'CEO, Verve Cloud', 'We restructured pricing the Monday after and closed a $140K retainer within 11 days.'],
  ['Meera Krishnan', 'MD, Lumina Advisory', 'The AI blueprint saved our 28-person firm 160+ hours a month.'],
  ['Jonathan Sterling', 'Partner, Sterling Capital', 'No filler. Institutional-grade strategy presented with surgical clarity.'],
  ['Aditi Rao', 'Founder, Northwind Studio', 'The hot-seat alone paid for the pass. We rebuilt our offer in one evening.'],
  ['Kabir Shah', 'COO, Helix Logistics', 'The vault SOPs went straight into our ops stack the next morning.'],
  ['Laura Chen', 'Director, Orbit Growth', 'Clear, specific and immediately usable. Rare for a live event.'],
];
const Row = ({ items, rev }) => (
  <motion.div animate={{ x: rev ? ['-50%', '0%'] : ['0%', '-50%'] }} transition={{ duration: 45, repeat: Infinity, ease: 'linear' }} className="flex w-max gap-5">
    {items.concat(items).map(([n, r, q], i) => (
      <div key={i} className="w-[380px] shrink-0 rounded-3xl border border-[#0B1220]/10 bg-white p-7 shadow-md">
        <div className="flex gap-1">{[...Array(5)].map((_, k) => <Star key={k} className="h-4 w-4 fill-[#0B1220]" />)}</div>
        <p className="mt-4 text-lg leading-relaxed" style={serif}>“{q}”</p>
        <p className="mt-5 text-sm font-bold">{n}<span className="font-normal text-[#0B1220]/55"> · {r}</span></p>
      </div>
    ))}
  </motion.div>
);
export const TestimonialRows = () => (
  <section className="overflow-hidden bg-[#E6EAF2]/35 py-24">
    <h2 className="mx-auto mb-12 max-w-3xl px-6 text-center text-4xl font-bold sm:text-5xl" style={serif}>What operators say after the session</h2>
    <div className="space-y-5">
      <Row items={quotes.slice(0, 3)} />
      <Row items={quotes.slice(3)} rev />
    </div>
  </section>
);

/* Interactive holographic 3D pass */
export const Ticket3D = ({ onCta }) => {
  const mx = useMotionValue(0.5), my = useMotionValue(0.5);
  const rY = useSpring(useTransform(mx, [0, 1], [-24, 24]), { stiffness: 120, damping: 16 });
  const rX = useSpring(useTransform(my, [0, 1], [18, -18]), { stiffness: 120, damping: 16 });
  const ang = useTransform(mx, [0, 1], [100, 260]);
  const holo = useMotionTemplate`linear-gradient(${ang}deg, rgba(201,166,107,1), rgba(230,234,242,1), rgba(255,255,255,.85), rgba(201,166,107,1))`;
  return (
    <section className="relative overflow-hidden bg-[#0B1220] py-28 text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
        <div>
          <h2 className="text-4xl font-bold leading-tight sm:text-5xl" style={serif}>Your seat in the room, in your hands</h2>
          <p className="mt-5 max-w-md text-white/70">Move your cursor over the pass. Executive VIP holders get the live hot-seat, the full vault and lifetime recordings.</p>
          <button onClick={onCta} className="mt-8 flex items-center gap-2 rounded-full bg-[#C9A66B] px-8 py-4 text-sm font-bold text-[#0B1220]">Claim my VIP pass <ArrowUpRight className="h-4 w-4" /></button>
        </div>
        <div style={{ perspective: 1400 }} className="flex justify-center"
          onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width); my.set((e.clientY - r.top) / r.height); }}
          onMouseLeave={() => { mx.set(0.5); my.set(0.5); }}>
          <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
            <motion.div style={{ rotateX: rX, rotateY: rY, transformStyle: 'preserve-3d', background: holo }}
              className="relative h-[460px] w-[320px] rounded-[32px] p-7 text-[#0B1220] shadow-[0_60px_120px_-30px_rgba(201,166,107,.45)]">
              <div style={{ transform: 'translateZ(50px)' }} className="flex h-full flex-col justify-between">
                <div className="flex items-center justify-between"><Crown className="h-7 w-7" /><span className="rounded-full bg-[#0B1220] px-3 py-1 text-xs font-bold text-[#C9A66B]">VIP</span></div>
                <div>
                  <p className="text-4xl font-bold leading-tight" style={serif}>The Unfair Advantage</p>
                  <p className="mt-2 text-sm font-semibold">28 Nov 2026 · 7 PM IST · Live</p>
                </div>
                <div className="flex items-end justify-between">
                  <div className="grid grid-cols-7 gap-[3px]">{[...Array(49)].map((_, i) => <span key={i} className={`h-2.5 w-2.5 ${(i * 7 + (i % 3) + Math.floor(i / 5)) % 2 ? 'bg-[#0B1220]' : 'bg-transparent'}`} />)}</div>
                  <p className="font-mono text-xs font-bold">SEAT 234/250</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


/* Trust strip under the hero */
export const TrustBar = () => (
  <section className="border-b border-[#0B1220]/10 bg-white py-8">
    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6">
      <p className="text-sm font-semibold text-[#0B1220]/55">Trusted by operators from</p>
      {['Forbes Council', 'Sequoia Alumni', 'Y Combinator', 'Goldman Alumni', 'McKinsey Network'].map((l) => <span key={l} className="text-lg font-bold text-[#0B1220]/70" style={serif}>{l}</span>)}
    </div>
  </section>
);

/* Guarantee and assurance cards */
export const Guarantee = () => (
  <section className="bg-[#0B1220] py-24 text-white">
    <div className="mx-auto max-w-7xl px-6">
      <h2 className="mx-auto max-w-3xl text-center text-4xl font-bold leading-tight sm:text-5xl" style={serif}>Attend with zero risk</h2>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {[[ShieldCheck, 'Full refund guarantee', 'Attend the entire live briefing. If you gain no actionable leverage, we refund your pass.'],
          [Users, 'Vetted private room', 'Every seat is reviewed, so the people you meet are operators, founders and decision makers.'],
          [Award, 'Implementation vault', 'Leave with SOPs, prompt libraries and models you can install within 24 hours.']].map(([I, t, d], i) => (
          <motion.div key={t} initial={{ opacity: 0, rotateX: 30, y: 40 }} whileInView={{ opacity: 1, rotateX: 0, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.1 }}
            whileHover={{ y: -6 }} style={{ transformPerspective: 1000 }} className="rounded-[28px] border border-[#C9A66B]/30 bg-gradient-to-b from-white/10 to-white/[0.02] p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C9A66B] text-[#0B1220]"><I className="h-6 w-6" /></span>
            <h3 className="mt-6 text-2xl font-bold" style={serif}>{t}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{d}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);