import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/common/Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../api';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    
    try {
      const data = await api.post('/auth/login', {
        email: form.email,
        password: form.password,
      });
      login(data.user);
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setErrors({ form: err.message || 'Invalid credentials' });
    }
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const floatingDots = Array.from({ length: 12 });

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] dark:bg-[#0D1117] relative overflow-hidden transition-colors duration-300">
      {/* ── Decorative left panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 dark:bg-slate-950 flex-col items-center justify-center px-16 overflow-hidden">
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'linear-gradient(#6366F1 1px, transparent 1px), linear-gradient(90deg, #6366F1 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-violet-500/15 rounded-full blur-2xl" />

        {/* Floating dots */}
        {floatingDots.map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-indigo-400/40 rounded-full"
            style={{
              left: `${10 + (i * 73) % 80}%`,
              top: `${10 + (i * 57) % 80}%`,
            }}
            animate={{ y: [0, -12, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        <div className="relative z-10 text-center max-w-md">
          <Link to="/" className="mb-10 flex justify-center active:scale-[0.98] transition-all">
            <Logo size={52} showText={false} />
          </Link>
          <h1 className="font-heading text-4xl font-black text-white leading-tight mb-4 tracking-tight uppercase">
            PEER<span className="text-indigo-400">WORK</span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed font-body mb-10">
            The student-first freelance marketplace. Post tasks, place bids, and build your portfolio — all within your campus community.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '2.4K+', label: 'Students' },
              { value: '800+', label: 'Tasks Done' },
              { value: '98%', label: 'Satisfaction' },
            ].map((stat) => (
              <div key={stat.label} className="border border-slate-700 bg-slate-800/60 px-4 py-4 backdrop-blur-sm">
                <p className="font-heading font-black text-2xl text-white">{stat.value}</p>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Login form ── */}
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

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 px-3 py-1 mb-4">
              <Sparkles size={10} className="text-indigo-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Welcome Back</span>
            </div>
            <h2 className="font-heading text-3xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight leading-tight">
              Sign In to<br />Your Account
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-body">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-600 font-bold hover:underline">
                Create one free →
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={15} />
                </span>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@student.edu"
                  value={form.email}
                  onChange={handleChange('email')}
                  className={`input-base pl-10 ${errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : ''}`}
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-1.5 text-[11px] text-red-500 font-semibold"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
                  Password
                </label>
                <button type="button" className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline uppercase tracking-wider">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={15} />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange('password')}
                  className={`input-base pl-10 pr-11 ${errors.password ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-1.5 text-[11px] text-red-500 font-semibold"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <motion.button
              id="login-submit"
              type="submit"
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 bg-slate-900 dark:bg-indigo-600 text-white font-heading font-black text-xs uppercase tracking-widest hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={14} />
                </>
              )}
            </motion.button>

            {errors.form && (
              <p className="text-red-500 text-xs font-semibold text-center mt-2 uppercase tracking-wide">
                {errors.form}
              </p>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};
