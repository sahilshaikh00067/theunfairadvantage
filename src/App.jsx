import React, { useState, useEffect, useRef } from 'react';
import { HeroTitle, ImageWall, PinnedStory, Bento, Ticket3D, TestimonialRows, StickyCTA, CursorRing, useScrollDir, TrustBar, Guarantee } from './Advanced';
import { Heading3D, ScrollTilt, Cubes, Aurora, CursorAura, Grain, Loader } from './Fx3D';
import { SmoothScroll, WordReveal, ZoomReveal, HorizontalShowcase, StackingCards, VelocityMarquee } from './ScrollFX';
import {
  motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, AnimatePresence,
} from 'framer-motion';
import {
  ArrowUpRight, Play, Crown, CheckCircle2, ChevronLeft, ChevronRight, ChevronDown, X, Lock,
  TrendingUp, Clock, Star, Cpu, ShieldCheck, Zap, BarChart3, Users, Radio, Sparkles,
} from 'lucide-react';

const U = (id, w = 1000) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=85`;
const INK = '#0B1220', LIME = '#C9A66B', BLUSH = '#E6EAF2';
const serif = { fontFamily: "'Playfair Display', Georgia, serif" };

/* ---------- 3D TILT CARD ---------- */
const Tilt = ({ children, className = '', glare = 'rgba(201,166,107,.35)' }) => {
  const ref = useRef(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rx = useSpring(0, { stiffness: 220, damping: 20 }), ry = useSpring(0, { stiffness: 220, damping: 20 });
  const sheen = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, ${glare}, transparent 70%)`;
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    mx.set(x); my.set(y);
    rx.set((y / r.height - 0.5) * -14); ry.set((x / r.width - 0.5) * 14);
  };
  const leave = () => { rx.set(0); ry.set(0); };
  return (
    <div style={{ perspective: 1200 }} className="h-full">
      <motion.div ref={ref} onMouseMove={move} onMouseLeave={leave}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className={`group relative h-full overflow-hidden rounded-[28px] ${className}`}>
        <motion.div className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: sheen }} />
        <div style={{ transform: 'translateZ(30px)' }} className="relative z-10 h-full">{children}</div>
      </motion.div>
    </div>
  );
};

/* ---------- MAGNETIC BUTTON ---------- */
const Btn = ({ children, onClick, variant = 'lime', className = '', type = 'button' }) => {
  const ref = useRef(null);
  const x = useSpring(0, { stiffness: 300, damping: 20 }), y = useSpring(0, { stiffness: 300, damping: 20 });
  const v = {
    lime: 'bg-[#C9A66B] text-[#0B1220] shadow-[0_18px_40px_-12px_rgba(201,166,107,.8)]',
    ink: 'bg-[#0B1220] text-white shadow-[0_18px_40px_-12px_rgba(11,18,32,.5)]',
    ghost: 'bg-white/10 text-white border border-white/25 backdrop-blur',
    blush: 'bg-[#E6EAF2] text-[#0B1220]',
  }[variant];
  return (
    <motion.button ref={ref} type={type} onClick={onClick} style={{ x, y }} whileTap={{ scale: 0.96 }}
      onMouseMove={(e) => { const r = ref.current.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * 0.25); y.set((e.clientY - r.top - r.height / 2) * 0.25); }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-4 text-sm font-bold tracking-wide transition ${v} ${className}`}>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
    </motion.button>
  );
};

/* ---------- COUNTDOWN (real target date) ---------- */
const TARGET = new Date('2026-11-28T19:00:00+05:30').getTime();
const Countdown = () => {
  const calc = () => { const d = Math.max(0, TARGET - Date.now()); return [Math.floor(d / 864e5), Math.floor(d / 36e5) % 24, Math.floor(d / 6e4) % 60, Math.floor(d / 1e3) % 60]; };
  const [t, setT] = useState(calc());
  useEffect(() => { const i = setInterval(() => setT(calc()), 1000); return () => clearInterval(i); }, []);
  return (
    <div className="flex gap-3">
      {['Days', 'Hours', 'Mins', 'Secs'].map((l, i) => (
        <div key={l} className={`w-[72px] rounded-2xl border border-white/15 py-3 text-center backdrop-blur ${i === 3 ? 'bg-[#C9A66B] text-[#0B1220]' : 'bg-white/10 text-white'}`}>
          <div className="font-mono text-2xl font-black">{String(t[i]).padStart(2, '0')}</div>
          <div className="text-[10px] font-semibold opacity-70">{l}</div>
        </div>
      ))}
    </div>
  );
};

/* ---------- HERO 3D PHOTO STACK (mouse parallax) ---------- */
const HeroStack = ({ onPlay }) => {
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rY = useSpring(useTransform(mx, [-1, 1], [-14, 14]), { stiffness: 80, damping: 15 });
  const rX = useSpring(useTransform(my, [-1, 1], [10, -10]), { stiffness: 80, damping: 15 });
  return (
    <div className="relative mx-auto h-[520px] w-full max-w-[560px]" style={{ perspective: 1400 }}
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set(((e.clientX - r.left) / r.width) * 2 - 1); my.set(((e.clientY - r.top) / r.height) * 2 - 1); }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}>
      <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C9A66B]/30 blur-[100px]" />
      <motion.div style={{ rotateX: rX, rotateY: rY, transformStyle: 'preserve-3d' }} className="relative h-full w-full">
        <motion.img src={U('1505373877841-8d25f7d46678', 700)} alt="Stage" style={{ transform: 'translateZ(-60px) rotate(-8deg)' }}
          animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity }}
          className="absolute left-0 top-6 h-60 w-48 rounded-3xl object-cover opacity-80 shadow-2xl" />
        <motion.img src={U('1531482615713-2afd69097998', 700)} alt="Team" style={{ transform: 'translateZ(-30px) rotate(7deg)' }}
          animate={{ y: [0, 12, 0] }} transition={{ duration: 7, repeat: Infinity }}
          className="absolute right-0 top-0 h-64 w-52 rounded-3xl object-cover opacity-90 shadow-2xl" />
        <div style={{ transform: 'translateZ(60px)' }} className="absolute inset-x-6 top-24 overflow-hidden rounded-[32px] border border-white/20 bg-[#0B1220] p-2.5 shadow-[0_50px_100px_-20px_rgba(0,0,0,.7)]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[24px]">
            <video autoPlay loop muted playsInline poster={U('1540575467063-178a50c2df87', 1000)} className="h-full w-full object-cover">
              <source src="https://assets.mixkit.co/videos/preview/mixkit-business-people-walking-in-a-modern-building-4821-large.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <button onClick={onPlay} aria-label="Play film" className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#C9A66B] text-[#0B1220] transition hover:scale-110">
              <Play className="ml-1 h-7 w-7 fill-current" />
              <span className="absolute -inset-2 animate-ping rounded-full border-2 border-[#C9A66B]/60" />
            </button>
            <div className="absolute inset-x-5 bottom-4 flex items-end justify-between text-white">
              <div><span className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-0.5 text-[10px] font-bold"><Radio className="h-3 w-3" /> LIVE</span>
                <p className="mt-1.5 text-lg font-bold" style={serif}>Inside the Asymmetric War Room</p></div>
              <span className="rounded-lg bg-white/90 px-2.5 py-1 font-mono text-xs font-bold text-[#0B1220]">02:18</span>
            </div>
          </div>
        </div>
        <motion.div style={{ transform: 'translateZ(120px)' }} animate={{ y: [-8, 8, -8] }} transition={{ duration: 4.5, repeat: Infinity }}
          className="absolute -right-2 bottom-24 rounded-2xl bg-[#C9A66B] px-4 py-3 text-[#0B1220] shadow-2xl">
          <div className="flex items-center gap-2.5"><TrendingUp className="h-5 w-5" /><div><p className="text-[10px] font-semibold opacity-70">Alumni ROI</p><p className="font-black">+318% margin</p></div></div>
        </motion.div>
        <motion.div style={{ transform: 'translateZ(140px)' }} animate={{ y: [8, -8, 8] }} transition={{ duration: 5.2, repeat: Infinity }}
          className="absolute -left-2 bottom-4 rounded-2xl bg-[#E6EAF2] px-4 py-3 text-[#0B1220] shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">{['1507003211169-0a1dd7228f2d', '1573496359142-b8d87734a5a2', '1500648767791-00dcc994a43e'].map((id) => <img key={id} src={U(id, 100)} alt="" className="h-8 w-8 rounded-full border-2 border-white object-cover" />)}</div>
            <div><p className="text-xs font-extrabold">234 / 250 seats taken</p><p className="text-[11px] font-semibold opacity-70">16 VIP passes left</p></div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

/* ---------- 3D SPEAKER CAROUSEL ---------- */
const speakers = [
  { n: 'Vikramaditya Mehta', r: 'Managing Partner, Apex Venture', t: 'Category Monopoly & Asymmetric Positioning', m: '$420M+ valuation created', img: '1560250097-0b93528c311a', time: '7:00 PM' },
  { n: 'Elena Rostova', r: 'Chief AI Architect, Synthetix Labs', t: 'Autonomous AI Infrastructure & Margin Scale', m: '92% faster operations', img: '1573496359142-b8d87734a5a2', time: '7:35 PM' },
  { n: 'Marcus Vance', r: 'Senior M&A Advisor, London', t: 'High-Stakes Deal Framing & Capital Anchoring', m: '3.4x larger deals', img: '1519085360753-af0119f7cbe7', time: '8:10 PM' },
  { n: 'Ananya Deshmukh', r: 'Founder, Maison Executive', t: 'The Executive Brand & Authority Flywheel', m: '11.4% inbound conversion', img: '1580489944761-15a19d654956', time: '8:45 PM' },
];
const SpeakerRing = () => {
  const [i, setI] = useState(0);
  const [pause, setPause] = useState(false);
  useEffect(() => { if (pause) return; const t = setInterval(() => setI((p) => p + 1), 4500); return () => clearInterval(t); }, [pause]);
  const active = ((i % 4) + 4) % 4, s = speakers[active];
  return (
    <div onMouseEnter={() => setPause(true)} onMouseLeave={() => setPause(false)}>
      <div className="relative mx-auto h-[420px] w-full max-w-4xl" style={{ perspective: 1600 }}>
        <motion.div animate={{ rotateY: -i * 90 }} transition={{ type: 'spring', stiffness: 60, damping: 16 }}
          style={{ transformStyle: 'preserve-3d' }} className="absolute left-1/2 top-1/2 h-[360px] w-[260px] -translate-x-1/2 -translate-y-1/2">
          {speakers.map((sp, k) => (
            <div key={sp.n} style={{ transform: `rotateY(${k * 90}deg) translateZ(340px)`, backfaceVisibility: 'hidden' }}
              className="absolute inset-0 overflow-hidden rounded-[28px] border border-white/20 shadow-[0_40px_80px_-20px_rgba(0,0,0,.6)]">
              <img src={U(sp.img, 600)} alt={sp.n} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              <div className="absolute inset-x-5 bottom-5 text-white"><p className="text-xl font-bold" style={serif}>{sp.n}</p><p className="text-xs opacity-80">{sp.r}</p></div>
            </div>
          ))}
        </motion.div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={active} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}
          className="mx-auto mt-4 max-w-2xl rounded-3xl border border-white/15 bg-white/10 p-7 text-center text-white backdrop-blur-xl">
          <span className="rounded-full bg-[#C9A66B] px-3 py-1 text-xs font-bold text-[#0B1220]">Keynote {active + 1} · {s.time} IST</span>
          <h3 className="mt-4 text-3xl font-bold leading-tight" style={serif}>{s.t}</h3>
          <p className="mt-3 text-sm text-white/70">{s.n} — {s.r}</p>
          <p className="mt-4 font-bold text-[#C9A66B]">{s.m}</p>
        </motion.div>
      </AnimatePresence>
      <div className="mt-6 flex justify-center gap-3">
        <button aria-label="Previous" onClick={() => setI(i - 1)} className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white hover:bg-white/10"><ChevronLeft /></button>
        <button aria-label="Next" onClick={() => setI(i + 1)} className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A66B] text-[#0B1220] hover:scale-105"><ChevronRight /></button>
      </div>
    </div>
  );
};

/* ---------- ROI SIMULATOR ---------- */
const Simulator = ({ onClaim }) => {
  const [rev, setRev] = useState(45), [team, setTeam] = useState(8);
  const proj = Math.round(rev * 2.65), gain = (proj - rev) * 12;
  return (
    <div className="grid gap-8 rounded-[36px] border border-[#0B1220]/10 bg-white p-8 shadow-[0_40px_90px_-30px_rgba(11,18,32,.2)] sm:p-12 lg:grid-cols-2">
      <div>
        <h3 className="text-3xl font-bold sm:text-4xl" style={serif}>Model your upside before you attend</h3>
        <p className="mt-3 text-sm text-[#0B1220]/65">Adjust revenue and team size to estimate your 12-month impact. Illustrative projection, not a guarantee.</p>
        {[['Monthly revenue', rev, setRev, 10, 250, 5, `$${rev}K`], ['Team size', team, setTeam, 1, 50, 1, `${team} people`]].map(([l, v, set, mn, mx, st, show]) => (
          <div key={l} className="mt-7">
            <div className="flex justify-between text-sm font-semibold"><span className="text-[#0B1220]/60">{l}</span><span className="rounded-lg bg-[#C9A66B] px-2.5 py-0.5 font-mono">{show}</span></div>
            <input type="range" min={mn} max={mx} step={st} value={v} onChange={(e) => set(Number(e.target.value))} className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#E6EAF2] accent-[#0B1220]" />
          </div>
        ))}
      </div>
      <div className="rounded-[28px] bg-[#0B1220] p-8 text-white">
        <p className="text-sm text-white/60">Projected monthly run-rate</p>
        <p className="mt-1 text-5xl font-bold" style={serif}>${proj}K</p>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white/10 p-4"><p className="text-xs text-white/60">Hours saved</p><p className="text-2xl font-bold">{team * 18}/mo</p></div>
          <div className="rounded-2xl bg-[#C9A66B] p-4 text-[#0B1220]"><p className="text-xs opacity-70">Annual gain</p><p className="text-2xl font-bold">+${gain.toLocaleString()}K</p></div>
        </div>
        <Btn variant="lime" onClick={onClaim} className="mt-7 w-full">Get this blueprint <ArrowUpRight className="h-4 w-4" /></Btn>
      </div>
    </div>
  );
};

/* ---------- DATA ---------- */
const pillars = [
  { i: Zap, t: 'Leverage loops', d: 'Replace linear hours with compounding distribution, capital and software.', img: '1552664730-d307ca884978' },
  { i: Cpu, t: 'Private AI agent stack', d: 'Automate research, outbound and client delivery with your own agents.', img: '1531482615713-2afd69097998' },
  { i: ShieldCheck, t: 'Category-of-one moat', d: 'Be the only logical choice in your niche and stop discounting.', img: '1522071820081-009f0129c71c' },
  { i: BarChart3, t: 'Sovereign unit economics', d: 'Rebuild pricing and cash cycles using real 8-figure models.', img: '1497366216548-37526070297c' },
];
const agenda = [
  ['7:00 – 7:35 PM', 'Part I · Diagnostic', 'Why firms plateau at $1M–$3M, and the positioning shift that unlocks 60%+ gross margins.'],
  ['7:35 – 8:10 PM', 'Part II · Infrastructure', 'Live walkthrough of agent workflows for market intelligence, proposals and retention.'],
  ['8:10 – 8:45 PM', 'Part III · Capital & deals', 'Package advisory, software or services into annual retainers with upfront cash.'],
  ['8:45 – 9:30 PM', 'Part IV · VIP hot-seat', 'VIP attendees submit funnels and P&Ls for live restructuring by the panel.'],
];
const faqs = [
  ['Who is this for?', 'Founders, agency owners, consultants and senior operators generating $150K–$15M+ who want margin and authority without adding headcount.'],
  ['Is it live or pre-recorded?', 'Fully live, with real dashboards and unedited case studies, followed by a 45-minute hot-seat for VIP holders.'],
  ['Do I get the templates and prompts?', 'Yes. After the broadcast you get the private vault with Notion SOPs, prompt libraries and unit-economics calculators.'],
  ['What if I miss part of it?', 'Operator holders get 48-hour replay access. VIP members get lifetime on-demand access with transcripts.'],
];
const tiers = [
  { n: 'Operator', p: '$197', o: '$497', d: 'Live access and the core dossier.', f: ['Live stream of all 4 keynotes', '94-page executive PDF', '48-hour replay', 'Attendee channel'], tone: 'bg-white border border-[#0B1220]/10', btn: 'blush' },
  { n: 'Executive VIP', p: '$497', o: '$1,497', d: 'Hot-seat audit, full vault, lifetime replays.', f: ['Everything in Operator', '45-min live hot-seat audit', 'AI agent & Notion SOP vault', 'Lifetime recordings', '1-on-1 diagnostic call'], tone: 'bg-[#C9A66B]', btn: 'ink', flag: 'Most selected · 16 left' },
  { n: 'Sovereign Syndicate', p: '$1,950', o: '$4,500', d: 'Private advisory and custom AI build.', f: ['Everything in VIP', '2-hour boardroom session', 'Custom AI workflow by our team', '30-day WhatsApp access', 'Deal-flow invitations'], tone: 'bg-[#E6EAF2]', btn: 'ink', flag: 'Only 4 seats' },
];

/* ---------- APP ---------- */
export default function App() {
  const [modal, setModal] = useState(false), [video, setVideo] = useState(false);
  const [tier, setTier] = useState('Executive VIP ($497)'), [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '' }), [faq, setFaq] = useState(0);
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const gy = useTransform(scrollYProgress, [0.3, 0.7], [40, -40]);
  const gy2 = useTransform(scrollYProgress, [0.3, 0.7], [-40, 40]);
  const open = (t = 'Executive VIP ($497)') => { setTier(t); setDone(false); setModal(true); };
  const hideNav = useScrollDir();
  const FILM = 'https://assets.mixkit.co/videos/preview/mixkit-business-people-walking-in-a-modern-building-4821-large.mp4';

  return (
    <SmoothScroll>
    <div className="min-h-screen overflow-x-clip bg-[#F5F6F8] text-[#0B1220] selection:bg-[#C9A66B]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Loader />
      <CursorAura />
      <Grain />
        <CursorRing />
        <StickyCTA onCta={() => open()} />
      <motion.div style={{ scaleX: bar }} className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-[#C9A66B] via-[#E6EAF2] to-white" />

      {/* NAV */}
      <header className={`fixed top-0 z-40 w-full border-b border-[#C9A66B]/25 bg-[#0B1220]/75 backdrop-blur-2xl transition-transform duration-500 ${hideNav ? '-translate-y-full' : ''}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <a href="#" className="flex items-center gap-3 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9A66B] text-[#0B1220]"><Crown className="h-5 w-5" /></span>
            <span className="text-lg font-bold" style={serif}>The Unfair Advantage</span>
          </a>
          <nav className="hidden gap-8 text-sm font-medium text-white/70 md:flex">
            {[['Thesis', '#thesis'], ['Speakers', '#speakers'], ['ROI model', '#roi'], ['Agenda', '#agenda'], ['Pricing', '#pricing']].map(([l, h]) => <a key={l} href={h} className="transition hover:text-white">{l}</a>)}
          </nav>
          <Btn variant="lime" onClick={() => open()} className="!px-5 !py-2.5 !text-xs">Reserve seat</Btn>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0B1220] pb-24 pt-36 text-white">
        <Aurora /><Cubes />
        <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#fff 0.6px, transparent 0.6px)', backgroundSize: '32px 32px' }} />
        <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-[#E6EAF2]/15 blur-[120px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur"><Sparkles className="h-3.5 w-3.5 text-[#C9A66B]" /> Live closed-door broadcast · 28 Nov 2026, 7 PM IST</span>
            <HeroTitle />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">A 2.5-hour live intensive on proprietary AI infrastructure, asymmetric positioning and high-margin deal flow, taught by four operators who have done it.</p>
            <div className="mt-8"><p className="mb-3 flex items-center gap-2 text-xs font-semibold text-white/60"><Clock className="h-3.5 w-3.5" /> Registration closes in</p><Countdown /></div>
            <div className="mt-9 flex flex-wrap gap-4">
              <Btn variant="lime" onClick={() => open()}>Claim executive pass <ArrowUpRight className="h-4 w-4" /></Btn>
              <Btn variant="ghost" onClick={() => setVideo(true)}><Play className="h-4 w-4 fill-current" /> Watch studio film</Btn>
            </div>
            <div className="mt-10 flex items-center gap-8 text-sm text-white/70">
              <div><p className="text-3xl font-bold text-white" style={serif}>4.9/5</p>from 2,300+ attendees</div>
              <div><p className="text-3xl font-bold text-white" style={serif}>60+</p>countries joined</div>
            </div>
          </motion.div>
          <HeroStack onPlay={() => setVideo(true)} />
        </div>
      </section>

      {/* TRUST */}
        <TrustBar />

        {/* VELOCITY MARQUEE */}
      <VelocityMarquee />

      {/* WORD REVEAL */}
      <section className="mx-auto max-w-5xl px-6 py-32">
        <WordReveal className="text-3xl font-bold leading-snug sm:text-5xl"
          text="Most founders work harder to earn more. The top one percent build structures that earn while they sleep." />
      </section>

      {/* PINNED STORY */}
        <PinnedStory steps={pillars} />

        {/* ZOOM REVEAL */}
      <ZoomReveal title="Step inside the room where margins get rebuilt" sub="Live. Unedited. 28 Nov, 7 PM IST." />

      {/* SPEAKERS 3D */}
      <section id="speakers" className="relative overflow-hidden bg-[#0B1220] py-28">
        <Aurora /><Cubes />
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-[#C9A66B]/10 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-10 max-w-3xl text-center text-white">
            <Heading3D className="text-4xl font-bold sm:text-5xl">Four architects. One playbook.</Heading3D>
            <p className="mt-4 text-white/65">The ring rotates on its own. Hover to pause, or use the arrows.</p>
          </div>
          <SpeakerRing />
        </div>
      </section>

      {/* HORIZONTAL SHOWCASE */}
      <HorizontalShowcase />

      {/* IMAGE WALL + BENTO */}
        <ImageWall onCta={() => open()} />
        <Bento />

        {/* ROI */}
      <section id="roi" className="mx-auto max-w-7xl px-6 pb-28"><ScrollTilt><Simulator onClaim={() => open()} /></ScrollTilt></section>

      {/* STACKING CARDS */}
      <StackingCards onCta={() => open()} />

      {/* AGENDA */}
      <section id="agenda" className="bg-[#E6EAF2]/35 py-28">
        <div className="mx-auto max-w-4xl px-6">
          <Heading3D className="text-center text-4xl font-bold sm:text-5xl">The run of show</Heading3D>
          <div className="relative mt-16 space-y-8 border-l-2 border-[#0B1220]/15 pl-8">
            {agenda.map(([t, p, d], k) => (
              <motion.div key={p} initial={{ opacity: 0, x: -40, rotateY: -28 }} whileInView={{ opacity: 1, x: 0, rotateY: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: k * 0.08 }} style={{ transformPerspective: 1000 }}
                className="relative rounded-3xl border border-[#0B1220]/10 bg-white p-7 shadow-sm">
                <span className="absolute -left-[45px] top-8 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-[#C9A66B]" />
                <p className="font-mono text-xs font-bold text-[#0B1220]/55">{t} IST</p>
                <h3 className="mt-1 text-2xl font-bold" style={serif}>{p}</h3>
                <p className="mt-2 text-sm text-[#0B1220]/70">{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS + 3D PASS */}
        <TestimonialRows />
        <Ticket3D onCta={() => open()} />

        {/* PRICING */}
      <section id="pricing" className="bg-gradient-to-b from-white to-[#C9A66B]/20 py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center"><Heading3D className="text-4xl font-bold sm:text-5xl">Choose your level of access</Heading3D><p className="mx-auto mt-4 max-w-2xl text-[#0B1220]/65">Attend the full live briefing. If you gain no actionable leverage, we refund you.</p></div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {tiers.map((t) => (
              <ScrollTilt key={t.n}><Tilt key={t.n} className={`${t.tone} p-9 shadow-[0_30px_80px_-25px_rgba(11,18,32,.25)]`}>
                {t.flag && <span className="rounded-full bg-[#0B1220] px-3 py-1 text-xs font-bold text-[#C9A66B]">{t.flag}</span>}
                <h3 className="mt-4 text-3xl font-bold" style={serif}>{t.n}</h3>
                <div className="mt-3 flex items-baseline gap-2"><span className="text-5xl font-black">{t.p}</span><span className="text-sm line-through opacity-45">{t.o}</span></div>
                <p className="mt-3 text-sm opacity-75">{t.d}</p>
                <ul className="mt-7 space-y-3 text-sm font-medium">{t.f.map((f) => <li key={f} className="flex gap-3"><CheckCircle2 className="h-4 w-4 shrink-0 translate-y-0.5" />{f}</li>)}</ul>
                <Btn variant={t.btn} onClick={() => open(`${t.n} (${t.p})`)} className="mt-9 w-full">Select {t.n}</Btn>
              </Tilt></ScrollTilt>
            ))}
          </div>
        </div>
      </section>

      {/* GUARANTEE */}
        <Guarantee />

        {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-24">
        <Heading3D className="text-center text-4xl font-bold">Frequently asked questions</Heading3D>
        <div className="mt-12 space-y-4">
          {faqs.map(([q, a], k) => (
            <div key={q} className={`overflow-hidden rounded-2xl border border-[#0B1220]/10 ${faq === k ? 'bg-[#E6EAF2]/40' : ''}`}>
              <button onClick={() => setFaq(faq === k ? -1 : k)} className="flex w-full items-center justify-between px-6 py-5 text-left">
                <span className="text-lg font-bold" style={serif}>{q}</span><ChevronDown className={`h-5 w-5 transition ${faq === k ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>{faq === k && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-6 pb-5 text-sm leading-relaxed text-[#0B1220]/70">{a}</motion.p>}</AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-[#0B1220] py-24 text-center text-white">
          <Aurora /><Cubes />
        <img src={U('1505373877841-8d25f7d46678', 1600)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="relative mx-auto max-w-3xl px-6">
          <Heading3D className="text-4xl font-bold sm:text-5xl">16 VIP seats left. Doors close on 28 Nov.</Heading3D>
          <Btn variant="lime" onClick={() => open()} className="mt-8">Reserve my seat <ArrowUpRight className="h-4 w-4" /></Btn>
        </div>
      </section>

      <footer className="bg-[#0B1220] py-8 text-center text-xs text-white/50">© 2026 The Unfair Advantage Executive Summit. All rights reserved.</footer>

      {/* REGISTRATION MODAL */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1220]/70 p-4 backdrop-blur-md">
            <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }} className="relative w-full max-w-lg rounded-[32px] bg-white p-9 shadow-2xl">
              <button aria-label="Close" onClick={() => setModal(false)} className="absolute right-5 top-5 rounded-full bg-[#E6EAF2] p-2 hover:bg-[#C9A66B]"><X className="h-5 w-5" /></button>
              {!done ? (
                <>
                  <h3 className="text-3xl font-bold" style={serif}>Confirm your registration</h3>
                  <p className="mt-1 text-sm text-[#0B1220]/65">Selected: <strong>{tier}</strong></p>
                  <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} className="mt-6 space-y-4">
                    {[['name', 'Full name', 'text', 'Aarav Singhania'], ['email', 'Work email', 'email', 'aarav@company.com'], ['company', 'Company and role', 'text', 'Founder, Acme']].map(([k, l, ty, ph]) => (
                      <label key={k} className="block text-sm font-semibold text-[#0B1220]/75">{l}
                        <input required type={ty} placeholder={ph} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                          className="mt-1.5 w-full rounded-xl border border-[#0B1220]/15 bg-[#E6EAF2]/20 px-4 py-3 text-sm font-normal focus:border-[#0B1220] focus:bg-white focus:outline-none" />
                      </label>
                    ))}
                    <Btn type="submit" variant="lime" className="w-full"><Lock className="h-4 w-4" /> Complete reservation</Btn>
                  </form>
                </>
              ) : (
                <div className="py-6 text-center">
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A66B]"><CheckCircle2 className="h-9 w-9" /></span>
                  <h3 className="mt-5 text-3xl font-bold" style={serif}>You’re in, {form.name || 'friend'}</h3>
                  <p className="mt-3 text-sm text-[#0B1220]/70">Access details for <strong>{tier}</strong> are on their way to {form.email}.</p>
                  <button onClick={() => setModal(false)} className="mt-7 rounded-full bg-[#0B1220] px-8 py-3.5 text-sm font-bold text-white">Back to page</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIDEO MODAL */}
      <AnimatePresence>
        {video && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1220]/90 p-4 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }} className="relative w-full max-w-4xl overflow-hidden rounded-3xl border-2 border-[#C9A66B] bg-black">
              <button aria-label="Close video" onClick={() => setVideo(false)} className="absolute right-4 top-4 z-20 rounded-full bg-[#C9A66B] p-2.5"><X className="h-5 w-5" /></button>
              <video autoPlay controls playsInline className="aspect-video w-full"><source src={FILM} type="video/mp4" /></video>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </SmoothScroll>
  );
}