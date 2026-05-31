import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Logo } from '../../components/common/Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../api';

const STEPS = ['Account', 'Security', 'Done'];

export const Register = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(0); // 0 = Account Info, 1 = Password
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const validateStep0 = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    return e;
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Must be at least 6 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleNext = () => {
    const errs = validateStep0();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateStep1();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    try {
      const data = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      login(data.user);
      setLoading(false);
      setDone(true);
      setTimeout(() => navigate('/setup'), 1500);
    } catch (err) {
      setLoading(false);
      setErrors({ confirmPassword: err.message || 'Registration failed' });
      toast(err.message || 'Registration failed. Please make sure backend is running.', 'error');
    }
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { label: 'Weak', color: 'bg-red-400', w: 'w-1/4' };
    if (score === 2) return { label: 'Fair', color: 'bg-amber-400', w: 'w-2/4' };
    if (score === 3) return { label: 'Good', color: 'bg-lime-500', w: 'w-3/4' };
    return { label: 'Strong', color: 'bg-emerald-500', w: 'w-full' };
  };

  const strength = passwordStrength();

  /* ── Success screen ── */
  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0D1117] transition-colors">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-center p-12 border border-slate-900/10 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 260 }}
            className="flex justify-center mb-6"
          >
            <CheckCircle2 size={56} className="text-emerald-500" strokeWidth={1.5} />
          </motion.div>
          <h2 className="font-heading text-2xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight mb-2">Account Created!</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-body">Setting up your profile…</p>
          <div className="mt-6 flex justify-center">
            <div className="h-1 w-32 bg-slate-100 dark:bg-slate-700 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, ease: 'linear' }}
                className="h-1 bg-indigo-600"
              />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] dark:bg-[#0D1117] relative overflow-hidden transition-colors duration-300">
      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-gradient-to-br from-indigo-600 to-violet-700 flex-col items-center justify-center px-14 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl -translate-x-1/4 translate-y-1/4" />

        <div className="relative z-10 text-center">
          <Link to="/" className="mb-8 flex justify-center active:scale-[0.98] transition-all">
            <Logo size={52} showText={false} />
          </Link>
          <h1 className="font-heading text-4xl font-black text-white uppercase tracking-tight leading-tight mb-4">
            Join the<br />Community
          </h1>
          <p className="text-indigo-100 text-sm leading-relaxed font-body mb-10 max-w-xs mx-auto">
            Create your free student account and start earning or delegating tasks today.
          </p>

          {/* Feature list */}
          <div className="space-y-3 text-left">
            {[
              'Post tasks & receive competitive bids',
              'Showcase your skills & build portfolio',
              'Secure milestone-based payments',
              'Rate & review collaborations',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-indigo-200 mt-0.5 shrink-0" />
                <p className="text-indigo-100 text-xs font-body leading-snug">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Back to Home Link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors mb-6 group"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Mobile logo */}
          <Link to="/" className="lg:hidden mb-10 flex justify-center active:scale-[0.98] transition-all">
            <Logo size={36} />
          </Link>

          {/* Step indicator */}
          <div className="flex items-center gap-0 mb-8">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 flex items-center justify-center text-[10px] font-black border transition-all duration-300 ${
                    i < step
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : i === step
                        ? 'bg-slate-900 dark:bg-indigo-600 border-slate-900 dark:border-indigo-600 text-white'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500'
                  }`}>
                    {i < step ? <CheckCircle2 size={12} /> : i + 1}
                  </div>
                  <span className={`mt-1 text-[9px] font-black uppercase tracking-widest ${
                    i === step ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'
                  }`}>{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-14 h-px mb-4 mx-1 transition-all duration-500 ${i < step ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-slate-600'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h2 className="font-heading text-3xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight leading-tight mb-2">
              {step === 0 ? 'Create Your\nAccount' : 'Set Your\nPassword'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-body">
              {step === 0 ? (
                <>Already have an account?{' '}
                  <Link to="/login" className="text-indigo-600 font-bold hover:underline">Sign in →</Link>
                </>
              ) : (
                'Make it strong — you\'ll need it to access your account.'
              )}
            </p>
          </div>

          <form onSubmit={step === 0 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit} className="space-y-5" noValidate>
            <AnimatePresence mode="wait">
              {step === 0 ? (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-5"
                >
                  {/* Name */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-2">Full Name</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><User size={15} /></span>
                      <input
                        id="register-name"
                        type="text"
                        autoComplete="name"
                        placeholder="Gowtham K"
                        value={form.name}
                        onChange={handleChange('name')}
                        className={`input-base pl-10 ${errors.name ? 'border-red-400' : ''}`}
                      />
                    </div>
                    <AnimatePresence>
                      {errors.name && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="mt-1.5 text-[11px] text-red-500 font-semibold">{errors.name}</motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-2">Email Address</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={15} /></span>
                      <input
                        id="register-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@student.edu"
                        value={form.email}
                        onChange={handleChange('email')}
                        className={`input-base pl-10 ${errors.email ? 'border-red-400' : ''}`}
                      />
                    </div>
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="mt-1.5 text-[11px] text-red-500 font-semibold">{errors.email}</motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.button
                    id="register-next"
                    type="submit"
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-3 py-3.5 bg-slate-900 text-white font-heading font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all duration-300 mt-2"
                  >
                    Continue <ArrowRight size={14} />
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  {/* Password */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-2">Password</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={15} /></span>
                      <input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Min. 6 characters"
                        value={form.password}
                        onChange={handleChange('password')}
                        className={`input-base pl-10 pr-11 ${errors.password ? 'border-red-400' : ''}`}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors">
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {/* Strength bar */}
                    {form.password && strength && (
                      <div className="mt-2">
                        <div className="h-1 bg-slate-100 dark:bg-slate-700 w-full">
                          <motion.div
                            className={`h-1 ${strength.color} transition-all duration-500`}
                            animate={{ width: strength.w === 'w-1/4' ? '25%' : strength.w === 'w-2/4' ? '50%' : strength.w === 'w-3/4' ? '75%' : '100%' }}
                          />
                        </div>
                        <p className={`text-[10px] font-bold mt-1 ${strength.color.replace('bg-', 'text-')}`}>{strength.label} password</p>
                      </div>
                    )}
                    <AnimatePresence>
                      {errors.password && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="mt-1.5 text-[11px] text-red-500 font-semibold">{errors.password}</motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-2">Confirm Password</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={15} /></span>
                      <input
                        id="register-confirm-password"
                        type={showConfirm ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Repeat your password"
                        value={form.confirmPassword}
                        onChange={handleChange('confirmPassword')}
                        className={`input-base pl-10 pr-11 ${errors.confirmPassword ? 'border-red-400' : form.confirmPassword && form.confirmPassword === form.password ? 'border-emerald-400' : ''}`}
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors">
                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    <AnimatePresence>
                      {errors.confirmPassword && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="mt-1.5 text-[11px] text-red-500 font-semibold">{errors.confirmPassword}</motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setStep(0); setErrors({}); }}
                      className="flex-1 py-3.5 border border-slate-900/10 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-heading font-black text-xs uppercase tracking-widest hover:border-slate-900 dark:hover:border-slate-300 transition-all duration-300"
                    >
                      ← Back
                    </button>
                    <motion.button
                      id="register-submit"
                      type="submit"
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                      className="flex-[2] flex items-center justify-center gap-3 py-3.5 bg-slate-900 text-white font-heading font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all duration-300 disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Creating Account…
                        </>
                      ) : (
                        <>Create Account <ArrowRight size={14} /></>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 font-body pt-1">
              By creating an account you agree to our{' '}
              <Link to="/terms" className="text-indigo-600 font-bold hover:underline">Terms of Service</Link>
              {' '}& {' '}
              <Link to="/privacy" className="text-indigo-600 font-bold hover:underline">Privacy Policy</Link>.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
