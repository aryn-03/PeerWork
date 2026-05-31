import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  BookOpen, Code, Briefcase, GraduationCap, Plus, X,
  ChevronRight, ChevronLeft, Rocket, Camera, Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/common/Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../api';

const ALL_SKILLS = [
  'React', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'Node.js',
  'Python', 'Django', 'FastAPI', 'Java', 'Spring Boot', 'PHP',
  'Laravel', 'Go', 'Rust', 'C++', 'MongoDB', 'PostgreSQL',
  'MySQL', 'Tailwind CSS', 'Figma', 'UI/UX Design', 'SEO',
  'Content Writing', 'Technical Writing', 'Graphic Design',
  'Branding', 'Video Editing', 'Data Analysis', 'Machine Learning',
  'DevOps', 'Docker', 'AWS', 'Firebase',
];

const ROLES = [
  {
    id: 'freelancer',
    icon: Code,
    title: 'Student Freelancer',
    desc: 'I want to take on tasks, earn money & build my portfolio.',
    color: 'indigo',
  },
  {
    id: 'client',
    icon: Briefcase,
    title: 'Task Client',
    desc: 'I want to post tasks, delegate work & find talented students.',
    color: 'violet',
  },
  {
    id: 'both',
    icon: Rocket,
    title: 'Both',
    desc: 'I want the full experience — post tasks and take them too.',
    color: 'emerald',
  },
];

const STEPS = [
  { label: 'Role', icon: GraduationCap },
  { label: 'Skills', icon: Code },
  { label: 'About', icon: BookOpen },
];

export const ProfileSetup = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [role, setRole] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState('');
  const [bio, setBio] = useState('');
  const [university, setUniversity] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const colorMap = {
    indigo: 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300',
    violet: 'border-violet-500 bg-violet-50/60 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300',
    emerald: 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300',
  };

  const iconWrapperMap = {
    indigo: 'border-indigo-300 dark:border-indigo-800 bg-indigo-100 dark:bg-indigo-900/30',
    violet: 'border-violet-300 dark:border-violet-800 bg-violet-100 dark:bg-violet-900/30',
    emerald: 'border-emerald-300 dark:border-emerald-800 bg-emerald-100 dark:bg-emerald-900/30',
  };

  const iconTextMap = {
    indigo: 'text-indigo-600 dark:text-indigo-400',
    violet: 'text-violet-600 dark:text-violet-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
  };

  const checkboxMap = {
    indigo: 'bg-indigo-500 border-indigo-500 dark:bg-indigo-600 dark:border-indigo-600',
    violet: 'bg-violet-500 border-violet-500 dark:bg-violet-600 dark:border-violet-600',
    emerald: 'bg-emerald-500 border-emerald-500 dark:bg-emerald-600 dark:border-emerald-600',
  };

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    const s = customSkill.trim();
    if (s && !selectedSkills.includes(s)) {
      setSelectedSkills(prev => [...prev, s]);
      setCustomSkill('');
    }
  };

  const activeSteps = role === 'client' 
    ? [
        { label: 'Role', icon: GraduationCap },
        { label: 'About', icon: BookOpen },
      ]
    : [
        { label: 'Role', icon: GraduationCap },
        { label: 'Skills', icon: Code },
        { label: 'About', icon: BookOpen },
      ];

  const getActiveIndex = () => {
    if (role === 'client' && step === 2) return 1;
    return step;
  };

  const nextStep = () => {
    const e = {};
    if (step === 0 && !role) e.role = 'Please select your role';
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    if (role === 'client') {
      setStep(2);
    } else {
      setStep(s => s + 1);
    }
  };

  const handleFinish = async () => {
    const e = {};
    if (!university.trim()) {
      e.university = role === 'client' 
        ? 'Organization / University name is required' 
        : 'University name is required';
    }
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);

    try {
      const data = await api.put('/auth/profile', {
        role,
        skills: role === 'client' ? [] : selectedSkills,
        bio,
        university: role === 'client' ? '' : university,
        organization: role === 'client' ? university : '',
        year: role === 'client' ? '' : year,
        isNewUser: false,
      });
      login(data);
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setErrors({ form: err.message || 'Profile setup failed' });
    }
  };

  const activeIndex = getActiveIndex();
  const progress = (activeIndex / activeSteps.length) * 100;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0D1117] flex flex-col transition-colors duration-300">
      {/* Top bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-900/10 dark:border-slate-700 px-6 py-4 flex items-center justify-between sticky top-0 z-40 transition-colors">
        <Link to="/" className="active:scale-[0.98] transition-all">
          <Logo size={28} />
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1">
            {activeSteps.map((s, i) => {
              const activeIndex = getActiveIndex();
              const isCompleted = i < activeIndex;
              const isActive = i === activeIndex;
              return (
                <div key={s.label} className="flex items-center gap-1">
                  <div className={`w-6 h-6 flex items-center justify-center rounded-sm text-[10px] font-black border transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : isActive
                        ? 'bg-slate-900 dark:bg-indigo-600 border-slate-900 dark:border-indigo-600 text-white'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500'
                  }`}>
                    {isCompleted ? <Check size={10} /> : i + 1}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}`}>
                    {s.label}
                  </span>
                  {i < activeSteps.length - 1 && <div className="w-4 h-px bg-slate-200 dark:bg-slate-600 mx-1" />}
                </div>
              );
            })}
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            Skip for now →
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-100 dark:bg-slate-700 w-full">
        <motion.div
          className="h-1 bg-indigo-600"
          animate={{ width: `${progress + (100 / activeSteps.length)}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {/* ── Step 0: Role ── */}
            {step === 0 && (
              <motion.div
                key="step-role"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35 }}
              >
                <div className="mb-8">
                  <span className="inline-block text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">Step 1 of {activeSteps.length}</span>
                  <h2 className="font-heading text-3xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight leading-tight mb-2">
                    How will you<br />use PeerWork?
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-body">Choose your primary role — you can always change it later.</p>
                </div>

                <div className="grid gap-4">
                  {ROLES.map((r) => {
                    const Icon = r.icon;
                    const isSelected = role === r.id;
                    return (
                      <motion.button
                        key={r.id}
                        id={`role-${r.id}`}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => { setRole(r.id); setErrors({}); }}
                        className={`w-full flex items-center gap-5 px-6 py-5 border-2 text-left transition-all duration-300 ${
                          isSelected ? colorMap[r.color] : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500'
                        }`}
                      >
                        <div className={`w-12 h-12 flex items-center justify-center border flex-shrink-0 ${
                          isSelected ? iconWrapperMap[r.color] : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                        }`}>
                          <Icon size={20} className={isSelected ? iconTextMap[r.color] : 'text-slate-500 dark:text-slate-400'} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-heading font-black text-sm uppercase tracking-wide text-slate-900 dark:text-slate-100">{r.title}</p>
                          <p className="text-slate-500 dark:text-slate-400 text-xs font-body mt-0.5 leading-snug">{r.desc}</p>
                        </div>
                        <div className={`w-5 h-5 border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          isSelected ? checkboxMap[r.color] : 'border-slate-300 dark:border-slate-600'
                        }`}>
                          {isSelected && <Check size={10} className="text-white" />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {errors.role && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mt-3 text-[11px] text-red-500 font-semibold">{errors.role}</motion.p>
                  )}
                </AnimatePresence>

                <div className="flex justify-end mt-8">
                  <button
                    id="setup-next-role"
                    onClick={nextStep}
                    className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 dark:bg-indigo-600 text-white font-heading font-black text-xs uppercase tracking-widest hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all duration-300"
                  >
                    Continue <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 1: Skills ── */}
            {step === 1 && (
              <motion.div
                key="step-skills"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35 }}
              >
                <div className="mb-8">
                  <span className="inline-block text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">Step 2 of 3</span>
                  <h2 className="font-heading text-3xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight leading-tight mb-2">
                    What are<br />your skills?
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-body">
                    Pick from the list or add your own. Select up to 10 skills.
                  </p>
                </div>

                {/* Selected skills */}
                {selectedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5 p-4 bg-indigo-50/60 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
                    <span className="w-full text-[9px] font-black uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-1">Selected ({selectedSkills.length})</span>
                    {selectedSkills.map(skill => (
                      <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600 text-white text-[11px] font-bold">
                        {skill}
                        <button onClick={() => toggleSkill(skill)} className="hover:text-indigo-200 transition-colors">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Skill grid */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {ALL_SKILLS.map(skill => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        onClick={() => selectedSkills.length < 10 || isSelected ? toggleSkill(skill) : null}
                        className={`px-3 py-1.5 text-[11px] font-bold border transition-all duration-200 ${
                          isSelected
                            ? 'bg-slate-900 dark:bg-indigo-600 border-slate-900 dark:border-indigo-600 text-white'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400'
                        } ${selectedSkills.length >= 10 && !isSelected ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>

                {/* Custom skill input */}
                <div className="flex gap-2">
                  <input
                    id="setup-custom-skill"
                    type="text"
                    placeholder="Add custom skill…"
                    value={customSkill}
                    onChange={e => setCustomSkill(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                    className="input-base flex-1"
                  />
                  <button
                    type="button"
                    onClick={addCustomSkill}
                    className="px-4 py-3 bg-slate-900 dark:bg-indigo-600 text-white hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all duration-300 flex items-center gap-1"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setStep(0)}
                    className="flex items-center gap-2 px-6 py-3.5 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-heading font-black text-xs uppercase tracking-widest hover:border-slate-900 dark:hover:border-slate-300 transition-all"
                  >
                    <ChevronLeft size={14} /> Back
                  </button>
                  <button
                    id="setup-next-skills"
                    onClick={() => { setErrors({}); setStep(2); }}
                    className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 dark:bg-indigo-600 text-white font-heading font-black text-xs uppercase tracking-widest hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all duration-300"
                  >
                    Continue <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: About ── */}
            {step === 2 && (
              <motion.div
                key="step-about"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35 }}
              >
                <div className="mb-8">
                  <span className="inline-block text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">
                    Step {activeSteps.length} of {activeSteps.length}
                  </span>
                  <h2 className="font-heading text-3xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight leading-tight mb-2">
                    Tell us about<br />yourself
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-body">
                    {role === 'client' ? 'Tell us about your organization or university project plans.' : 'Help others know who you are. This appears on your public profile.'}
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Avatar placeholder */}
                  <div className="flex items-center gap-5 p-5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/40 border-2 border-indigo-200 dark:border-indigo-700 flex items-center justify-center flex-shrink-0">
                      <span className="font-heading font-black text-xl text-indigo-600 dark:text-indigo-400">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-heading font-black text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wide">{user?.name || 'Your Name'}</p>
                      <p className="text-slate-400 dark:text-slate-500 text-xs font-body mt-0.5">{user?.email || 'your@email.com'}</p>
                      <button className="mt-2 flex items-center gap-1.5 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
                        <Camera size={11} /> Upload Photo
                      </button>
                    </div>
                  </div>

                  {/* University */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-2">
                      {role === 'client' ? 'Organization / Department / University' : 'University / Institution'} <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="setup-university"
                      type="text"
                      placeholder={role === 'client' ? 'e.g. Acme Org, Tech Club, or University Name' : 'e.g. SRM Institute of Science & Technology'}
                      value={university}
                      onChange={e => { setUniversity(e.target.value); setErrors(p => ({ ...p, university: '' })); }}
                      className={`input-base ${errors.university ? 'border-red-400' : ''}`}
                    />
                    <AnimatePresence>
                      {errors.university && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="mt-1.5 text-[11px] text-red-500 font-semibold">{errors.university}</motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Year of study */}
                  {role !== 'client' && (
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-2">
                        Year of Study
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgrad', 'Alumni'].map(y => (
                          <button
                            key={y}
                            type="button"
                            onClick={() => setYear(y)}
                            className={`px-4 py-2 text-[11px] font-bold border transition-all duration-200 ${
                              year === y
                                ? 'bg-slate-900 dark:bg-indigo-600 border-slate-900 dark:border-indigo-600 text-white'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400'
                            }`}
                          >
                            {y}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bio */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-2">
                      Short Bio
                    </label>
                    <textarea
                      id="setup-bio"
                      rows={4}
                      placeholder={role === 'client' ? 'Describe your organization, types of gigs you plan to post, etc...' : "Describe your background, what you're studying, and what kind of work you love…"}
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      maxLength={300}
                      className="input-base resize-none"
                    />
                    <p className="text-right text-[10px] text-slate-400 dark:text-slate-500 mt-1">{bio.length}/300</p>
                  </div>
                </div>

                {errors.form && (
                  <p className="text-red-500 text-xs font-semibold text-right mb-4 uppercase tracking-wide">{errors.form}</p>
                )}

                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setStep(role === 'client' ? 0 : 1)}
                    className="flex items-center gap-2 px-6 py-3.5 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-heading font-black text-xs uppercase tracking-widest hover:border-slate-900 dark:hover:border-slate-300 transition-all"
                  >
                    <ChevronLeft size={14} /> Back
                  </button>
                  <motion.button
                    id="setup-finish"
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFinish}
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white font-heading font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all duration-300 disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Saving…
                      </>
                    ) : (
                      <>
                        <Rocket size={14} /> Launch Profile
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
