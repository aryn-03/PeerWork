import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase, Users, TrendingUp, Award, ArrowUpRight,
  Code2, Palette, PenLine, Database, Megaphone, Globe,
  Star, CheckCircle2, Clock, Zap, Shield, ChevronRight,
  ChevronLeft, DollarSign, BarChart3, Quote
} from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../../api';

/* ─── Animation Variants ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

/* ─── Static Data ─────────────────────────────────────────── */
const STATS = [
  { value: '2,400+', label: 'Active Students', icon: <Users size={18} /> },
  { value: '$180K', label: 'Total Paid Out', icon: <DollarSign size={18} /> },
  { value: '98%', label: 'Satisfaction Rate', icon: <Star size={18} /> },
  { value: '1,100+', label: 'Projects Completed', icon: <CheckCircle2 size={18} /> },
];

const CATEGORIES = [
  { icon: <Code2 size={24} />, label: 'Web Dev', color: 'text-indigo-600', bg: 'bg-indigo-50', count: '340+ gigs' },
  { icon: <Palette size={24} />, label: 'UI/UX Design', color: 'text-violet-600', bg: 'bg-violet-50', count: '210+ gigs' },
  { icon: <PenLine size={24} />, label: 'Content', color: 'text-rose-600', bg: 'bg-rose-50', count: '180+ gigs' },
  { icon: <Database size={24} />, label: 'Backend & API', color: 'text-sky-600', bg: 'bg-sky-50', count: '150+ gigs' },
  { icon: <Megaphone size={24} />, label: 'Marketing', color: 'text-amber-600', bg: 'bg-amber-50', count: '130+ gigs' },
  { icon: <Globe size={24} />, label: 'SEO & Growth', color: 'text-emerald-600', bg: 'bg-emerald-50', count: '95+ gigs' },
];

const STEPS = [
  {
    step: '01',
    title: 'Create Your Profile',
    desc: 'Showcase your skills, education, and portfolio in under 5 minutes. No CV needed.',
    icon: <Users size={20} />,
  },
  {
    step: '02',
    title: 'Browse & Bid',
    desc: 'Explore scoped projects that match your schedule. Submit a tailored proposal and your price.',
    icon: <Briefcase size={20} />,
  },
  {
    step: '03',
    title: 'Deliver Value',
    desc: 'Complete the work, earn a review, and build your verified digital portfolio automatically.',
    icon: <Zap size={20} />,
  },
  {
    step: '04',
    title: 'Get Paid Fast',
    desc: 'Funds release within 24 h of delivery confirmation. No hidden fees, no payment delays.',
    icon: <DollarSign size={20} />,
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah Jenkins',
    role: 'CS Student · UCC',
    avatar: 'SJ',
    rating: 5,
    text: "I landed my first paid gig within 48 hours of signing up. PeerWork's structured bidding made the whole process feel professional and safe.",
    highlight: 'First gig in 48 hours',
    skill: 'Full-Stack Dev',
    earned: '$1,200',
    projects: 8,
    color: 'from-indigo-500 to-violet-600',
    accent: 'indigo',
  },
  {
    name: "Liam O'Brien",
    role: 'Design Student · NCAD',
    avatar: 'LO',
    rating: 5,
    text: "As a designer, finding real clients used to be a nightmare. Now I have a steady stream of logo and UI briefs that fit perfectly around my lectures.",
    highlight: 'Consistent client flow',
    skill: 'UI/UX Design',
    earned: '$870',
    projects: 5,
    color: 'from-violet-500 to-rose-500',
    accent: 'violet',
  },
  {
    name: 'Priya Mehta',
    role: 'Business Student · DCU',
    avatar: 'PM',
    rating: 5,
    text: "I wrote SEO articles for three startups and built a portfolio that helped me land an internship offer. This platform is genuinely life-changing.",
    highlight: 'Landed internship offer',
    skill: 'Content & SEO',
    earned: '$640',
    projects: 12,
    color: 'from-sky-500 to-emerald-500',
    accent: 'sky',
  },
  {
    name: 'Arjun Patel',
    role: 'Eng Student · TCD',
    avatar: 'AP',
    rating: 5,
    text: "PeerWork gave me the confidence to charge what I'm actually worth. Three months in and I've already funded my entire semester's expenses.",
    highlight: 'Self-funded a full semester',
    skill: 'Backend & APIs',
    earned: '$2,100',
    projects: 14,
    color: 'from-emerald-500 to-teal-600',
    accent: 'emerald',
  },
];

const FEATURES = [
  { icon: <Shield size={20} />, title: 'Verified Clients', desc: 'Every client is identity-verified before posting a task.' },
  { icon: <Zap size={20} />, title: 'Instant Payouts', desc: '24-hour payment release after delivery confirmation.' },
  { icon: <BarChart3 size={20} />, title: 'Skill Analytics', desc: 'Track your earnings, ratings and growth month over month.' },
  { icon: <Award size={20} />, title: 'Portfolio Badges', desc: 'Auto-generated reputation badges shared to LinkedIn.' },
];

const MARQUEE_WORDS = ['CONNECT', 'COLLABORATE', 'EARN', 'BUILD EXPERIENCE', 'PEERWORK', 'FIND GIGS', 'GET PAID'];
const DISPLAY_MARQUEE_WORDS = [...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS];

/* ─── Sub-components ─────────────────────────────────────── */
function SectionLabel({ text }) {
  return (
    <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">
      <span className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 inline-block" />
      {text}
    </span>
  );
}

function StarRow({ count = 5 }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
      ))}
    </span>
  );
}

/* ─── Testimonials Carousel ──────────────────────────────── */
function TestimonialsCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(null);
  const DURATION = 4000;
  const TICK = 40;

  const goTo = useCallback((idx) => {
    setActive(idx);
    setProgress(0);
  }, []);

  const prev = useCallback(() => goTo((active - 1 + TESTIMONIALS.length) % TESTIMONIALS.length), [active, goTo]);
  const next = useCallback(() => goTo((active + 1) % TESTIMONIALS.length), [active, goTo]);

  useEffect(() => {
    if (paused) return;
    progressRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          setActive(a => (a + 1) % TESTIMONIALS.length);
          return 0;
        }
        return p + (TICK / DURATION) * 100;
      });
    }, TICK);
    return () => clearInterval(progressRef.current);
  }, [paused, active]);

  const t = TESTIMONIALS[active];

  return (
    <section
      className="py-24 border-b border-slate-900/10 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container-max">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <SectionLabel text="STUDENT STORIES" />
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 font-heading uppercase tracking-tighter">
              REAL STUDENTS. REAL INCOME.
            </h2>
          </div>
          {/* Dot navigation */}
          <div className="flex items-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="group relative h-1 rounded-none overflow-hidden transition-all duration-300"
                style={{ width: i === active ? '48px' : '16px' }}
                aria-label={`Go to story ${i + 1}`}
              >
                <span className="absolute inset-0 bg-slate-200 dark:bg-slate-700" />
                {i === active && (
                  <motion.span
                    className="absolute inset-y-0 left-0 bg-indigo-600"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main spotlight + sidebar layout */}
        <div className="grid lg:grid-cols-[1fr_280px] gap-px bg-slate-900/10 dark:bg-slate-700 border border-slate-900/10 dark:border-slate-700">

          {/* Active spotlight card */}
          <motion.div
            key={active}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white dark:bg-slate-800 p-10 md:p-14 flex flex-col gap-8 relative overflow-hidden"
          >
            {/* Background gradient blob */}
            <div className={`absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br ${t.color} opacity-[0.06] rounded-full blur-3xl pointer-events-none`} />

            {/* Large quote mark */}
            <div className="absolute top-8 right-10 opacity-[0.06]">
              <Quote size={80} className="text-slate-900 dark:text-slate-100" />
            </div>

            {/* Skill pill */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5">
                <span className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                {t.skill}
              </span>
              <StarRow count={t.rating} />
            </div>

            {/* Quote text */}
            <blockquote className="text-slate-700 dark:text-slate-300 text-lg sm:text-xl font-semibold leading-relaxed relative z-10 flex-grow">
              "{t.text}"
            </blockquote>

            {/* Highlight callout */}
            <div className="inline-flex items-center gap-2 self-start border-l-2 border-indigo-600 pl-4">
              <CheckCircle2 size={13} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
              <span className="text-[11px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">{t.highlight}</span>
            </div>

            {/* Author row + stats */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-6 border-t border-slate-900/10 dark:border-slate-700">
              <div className="flex items-center gap-4 flex-grow">
                <div className={`w-12 h-12 bg-gradient-to-br ${t.color} text-white text-sm font-black font-heading flex items-center justify-center flex-shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="font-heading font-black text-base text-slate-900 dark:text-slate-100 uppercase tracking-tight">{t.name}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{t.role}</div>
                </div>
              </div>
              <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-widest shrink-0">
                <div className="flex flex-col gap-0.5">
                  <span className="text-2xl font-black font-heading text-emerald-600 dark:text-emerald-400 leading-none">{t.earned}</span>
                  <span className="text-slate-400 dark:text-slate-500">Total Earned</span>
                </div>
                <div className="w-px h-8 bg-slate-200 dark:bg-slate-600" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-2xl font-black font-heading text-slate-900 dark:text-slate-100 leading-none">{t.projects}</span>
                  <span className="text-slate-400 dark:text-slate-500">Projects</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar — inactive cards + arrows */}
          <div className="hidden lg:flex flex-col gap-px bg-slate-900/10 dark:bg-slate-700">
            {TESTIMONIALS.filter((_, i) => i !== active).map((s) => {
              const realIdx = TESTIMONIALS.indexOf(s);
              return (
                <button
                  key={realIdx}
                  onClick={() => goTo(realIdx)}
                  className="flex-1 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 p-6 text-left flex flex-col gap-3 transition-all duration-200 group border-l-2 border-transparent hover:border-indigo-500"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 bg-gradient-to-br ${s.color} text-white text-[10px] font-black font-heading flex items-center justify-center flex-shrink-0`}>
                      {s.avatar}
                    </div>
                    <div>
                      <div className="font-heading font-black text-xs text-slate-900 dark:text-slate-100 uppercase tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{s.name}</div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{s.role}</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-2">"{s.text}"</p>
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">{s.earned} earned</span>
                </button>
              );
            })}

            {/* Arrow controls */}
            <div className="flex bg-white dark:bg-slate-800">
              <button
                onClick={prev}
                className="flex-1 py-4 flex items-center justify-center border-r border-slate-900/10 dark:border-slate-700 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200"
                aria-label="Previous story"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="flex-1 py-4 flex items-center justify-center text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200"
                aria-label="Next story"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile arrow controls */}
        <div className="flex lg:hidden items-center justify-between mt-4">
          <button
            onClick={prev}
            className="flex items-center gap-2 py-2 px-4 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all text-[11px] font-black uppercase tracking-widest"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {active + 1} / {TESTIMONIALS.length}
          </span>
          <button
            onClick={next}
            className="flex items-center gap-2 py-2 px-4 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all text-[11px] font-black uppercase tracking-widest"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [hoveredCat, setHoveredCat] = useState(null);
  const [latestTasks, setLatestTasks] = useState([]);

  useEffect(() => {
    const fetchLatestTasks = async () => {
      try {
        const data = await api.get('/tasks');
        setLatestTasks(data.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };
    fetchLatestTasks();
  }, []);

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0D1117] transition-colors duration-300">

      {/* ══════════════════════════════════════════════════════
          01 · HERO
      ══════════════════════════════════════════════════════ */}
      <section className="relative pt-28 pb-24 md:py-40 border-b border-slate-900/10 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
        {/* Dot grid background */}
        <div className="absolute inset-0 bg-dot-pattern opacity-[0.04] pointer-events-none" />
        {/* Glow blob */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-indigo-200/25 blur-[120px] rounded-full pointer-events-none" />

        <div className="container-max relative z-10">
          <motion.div
            className="text-center"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            {/* Pill badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 border border-indigo-500/20 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                THE NEXT-GEN STUDENT GIG PORTAL — EST. 2025
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl md:text-8xl font-black font-heading text-slate-900 dark:text-slate-100 tracking-tighter leading-[0.9] mb-8 uppercase"
            >
              FREELANCE GIGS <br />
              FOR{' '}
              <span className="relative inline-block">
                <span className="text-indigo-600">STUDENTS.</span>
                <span className="absolute -bottom-2 left-0 w-full h-[3px] bg-indigo-600" />
              </span>
            </motion.h1>

            {/* Sub-copy */}
            <motion.p
              variants={fadeUp}
              className="text-slate-500 dark:text-slate-400 text-base sm:text-lg font-semibold leading-relaxed max-w-2xl mx-auto mb-12"
            >
              PeerWork connects talented students with clients hunting for fresh, affordable skills.
              No complex interviews — just place your bid, deliver real value, and build a portfolio
              that speaks for itself.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/tasks')}
                className="btn-accent flex items-center gap-2 text-sm px-8 py-3"
              >
                BROWSE MARKETPLACE <ArrowUpRight size={16} />
              </button>
              <button
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                className="btn-secondary text-sm px-8 py-3"
              >
                {isAuthenticated ? 'GO TO DASHBOARD' : 'SIGN IN'}
              </button>
            </motion.div>

            {/* Trust micro-copy */}
            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-wrap justify-center gap-6 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500"
            >
              {['No signup fees', 'Student-exclusive', '24-h payouts', '100% remote'].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-500" /> {t}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          02 · MARQUEE
      ══════════════════════════════════════════════════════ */}
      <section className="bg-slate-900 text-white py-5 border-b border-slate-700 overflow-hidden">
        <div className="marquee-container select-none">
          {[0, 1].map((clone) => (
            <div
              key={clone}
              className="marquee-content font-heading text-lg font-black uppercase tracking-wider flex items-center"
              aria-hidden={clone === 1}
            >
              {DISPLAY_MARQUEE_WORDS.map((text, idx) => (
                <span key={idx} className="flex items-center gap-6 mr-12">
                  <span>{text}</span>
                  <span className="w-2 h-2 bg-indigo-500 inline-block" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          03 · STATS TICKER
      ══════════════════════════════════════════════════════ */}
      <section className="bg-white dark:bg-slate-800 border-b border-slate-900/10 dark:border-slate-700 py-12 transition-colors">
        <div className="container-max">
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-slate-900/10 dark:border-slate-700">
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                className="border-r border-b border-slate-900/10 dark:border-slate-700 p-8 flex flex-col gap-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="w-9 h-9 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  {stat.icon}
                </div>
                <span className="text-4xl font-black font-heading text-slate-900 dark:text-slate-100 tracking-tighter">
                  {stat.value}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          04 · LIVE TASK PREVIEWS (uses real props.tasks)
      ══════════════════════════════════════════════════════ */}
      <section className="py-24 border-b border-slate-900/10 dark:border-slate-700 bg-[#F8FAFC] dark:bg-[#0D1117] transition-colors">
        <div className="container-max">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <SectionLabel text="LIVE OPPORTUNITIES" />
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 font-heading uppercase tracking-tighter">
                TASKS POSTED TODAY.
              </h2>
            </div>
            <button
              onClick={() => navigate('/tasks')}
              className="btn-secondary flex items-center gap-2 self-start md:self-auto"
            >
              VIEW ALL <ChevronRight size={15} />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-slate-900/10 dark:bg-slate-700 border border-slate-900/10 dark:border-slate-700">
            {latestTasks.map((task, i) => (
              <motion.div
                key={task._id}
                className="bg-white dark:bg-slate-800 p-8 group hover:bg-slate-900 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[260px]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                onClick={() => navigate('/tasks')}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 group-hover:text-indigo-400">
                      {task.status === 'open' ? '● OPEN' : '● IN PROGRESS'}
                    </span>
                    <ArrowUpRight size={16} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <h3 className="font-heading font-black text-lg uppercase tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-white mb-3 transition-colors">
                    {task.title}
                  </h3>
                  <p className="text-slate-400 text-xs font-semibold leading-relaxed group-hover:text-slate-300 line-clamp-2 transition-colors">
                    {task.description}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {(task.skillsRequired || []).slice(0, 2).map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border border-slate-200 text-slate-500 group-hover:border-slate-600 group-hover:text-slate-400 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <span className="font-heading font-black text-xl text-slate-900 dark:text-slate-100 group-hover:text-indigo-400 transition-colors">
                    ${task.budget}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          05 · SKILL CATEGORIES
      ══════════════════════════════════════════════════════ */}
      <section className="py-24 border-b border-slate-900/10 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors">
        <div className="container-max">
          <div className="mb-14">
            <SectionLabel text="EXPLORE BY SKILL" />
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 font-heading uppercase tracking-tighter">
              EVERY SKILL HAS A MARKET.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 border-t border-l border-slate-900/10 dark:border-slate-700">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={i}
                className="border-r border-b border-slate-900/10 dark:border-slate-700 p-8 cursor-pointer group flex flex-col gap-5 transition-all duration-300 hover:bg-slate-900"
                onMouseEnter={() => setHoveredCat(i)}
                onMouseLeave={() => setHoveredCat(null)}
                onClick={() => navigate('/tasks')}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.07 }}
                viewport={{ once: true }}
              >
                <div className={`w-12 h-12 flex items-center justify-center ${hoveredCat === i ? 'bg-indigo-600 text-white' : `${cat.bg} ${cat.color}`} transition-all duration-300`}>
                  {cat.icon}
                </div>
                <div>
                  <h3 className="font-heading font-black text-base uppercase tracking-tight text-slate-900 group-hover:text-white transition-colors mb-1">
                    {cat.label}
                  </h3>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-500 transition-colors">
                    {cat.count}
                  </p>
                </div>
                <ArrowUpRight
                  size={15}
                  className="text-slate-300 group-hover:text-indigo-400 transition-colors mt-auto"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          06 · HOW IT WORKS
      ══════════════════════════════════════════════════════ */}
      <section className="py-24 border-b border-slate-900/10 dark:border-slate-700 bg-[#F8FAFC] dark:bg-[#0D1117] transition-colors">
        <div className="container-max">
          <div className="mb-14">
            <SectionLabel text="THE PROCESS" />
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 font-heading uppercase tracking-tighter">
              FOUR STEPS TO YOUR FIRST GIG.
            </h2>
          </div>

          <div className="grid md:grid-cols-4 border-t border-l border-slate-900/10 dark:border-slate-700">
            {STEPS.map((s, i) => (
              <motion.div
                key={i}
                className="border-r border-b border-slate-900/10 dark:border-slate-700 p-8 bg-white dark:bg-slate-800 group hover:bg-indigo-600 transition-all duration-300 flex flex-col gap-6 min-h-[280px]"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 border border-slate-200 dark:border-slate-600 group-hover:border-white/30 flex items-center justify-center text-indigo-600 group-hover:text-white transition-colors">
                    {s.icon}
                  </div>
                  <span className="font-heading font-black text-4xl text-slate-200 dark:text-slate-600 group-hover:text-white/20 transition-colors">
                    {s.step}
                  </span>
                </div>
                <div>
                  <h3 className="font-heading font-black text-base uppercase tracking-tight mb-2 text-slate-900 dark:text-slate-100 group-hover:text-white transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold leading-relaxed group-hover:text-indigo-100 transition-colors">
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          07 · TESTIMONIALS — Interactive Carousel
      ══════════════════════════════════════════════════════ */}
      <TestimonialsCarousel />

      {/* ══════════════════════════════════════════════════════
          08 · PLATFORM FEATURES STRIP
      ══════════════════════════════════════════════════════ */}
      <section className="py-24 border-b border-slate-900/10 dark:border-slate-700 bg-[#F8FAFC] dark:bg-[#0D1117] transition-colors">
        <div className="container-max">
          <div className="mb-14">
            <SectionLabel text="WHY PEERWORK" />
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 font-heading uppercase tracking-tighter">
              BUILT FOR STUDENT SUCCESS.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 border-t border-l border-slate-900/10 dark:border-slate-700">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                className="border-r border-b border-slate-900/10 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 group hover:bg-slate-900 transition-all duration-300 flex flex-col gap-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <div className="w-10 h-10 border border-slate-200 dark:border-slate-600 group-hover:border-indigo-500/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-heading font-black text-sm uppercase tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-white transition-colors">
                  {f.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold leading-relaxed group-hover:text-slate-400 transition-colors">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          09 · FINAL CTA BANNER
      ══════════════════════════════════════════════════════ */}
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-[0.06] pointer-events-none" />
        <div className="absolute -top-20 right-1/4 w-[500px] h-[400px] bg-indigo-600/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="container-max relative z-10 text-center">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 border border-indigo-500/30 px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                JOIN 2,400+ STUDENTS EARNING TODAY
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-7xl font-black font-heading text-white tracking-tighter leading-none uppercase mb-8"
            >
              YOUR SKILLS ARE <br />
              <span className="text-indigo-400">WORTH MONEY.</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-slate-400 text-base font-semibold max-w-xl mx-auto mb-12"
            >
              Stop undercharging. Stop underestimating yourself. Create a free account and browse
              real client briefs posted right now.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate(isAuthenticated ? '/tasks' : '/register')}
                className="btn-accent flex items-center gap-2 text-sm px-8 py-3"
              >
                START BIDDING NOW <ArrowUpRight size={16} />
              </button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-12 flex flex-wrap justify-center gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-600"
            >
              <span className="flex items-center gap-2"><Clock size={12} className="text-indigo-500" /> Live in 5 minutes</span>
              <span className="flex items-center gap-2"><Shield size={12} className="text-indigo-500" /> Free to join</span>
              <span className="flex items-center gap-2"><TrendingUp size={12} className="text-indigo-500" /> No commission until you earn</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};
