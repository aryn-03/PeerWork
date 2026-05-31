import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

/* ── Types: 'success' | 'error' | 'warning' | 'info' ── */

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  error:   XCircle,
  warning: AlertTriangle,
  info:    Info,
};

const STYLES = {
  success: {
    bar:  'bg-emerald-500',
    icon: 'text-emerald-500',
    badge:'bg-emerald-50 border-emerald-100 text-emerald-700',
    label:'SUCCESS',
  },
  error: {
    bar:  'bg-red-500',
    icon: 'text-red-500',
    badge:'bg-red-50 border-red-100 text-red-700',
    label:'ERROR',
  },
  warning: {
    bar:  'bg-amber-400',
    icon: 'text-amber-500',
    badge:'bg-amber-50 border-amber-100 text-amber-700',
    label:'WARNING',
  },
  info: {
    bar:  'bg-indigo-500',
    icon: 'text-indigo-500',
    badge:'bg-indigo-50 border-indigo-100 text-indigo-700',
    label:'INFO',
  },
};

/* ── Provider ── */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration + 400); // +400 for exit animation
  }, []);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};

/* ── Single Toast card ── */
const Toast = ({ id, message, type, duration, dismiss }) => {
  const style  = STYLES[type] || STYLES.info;
  const Icon   = ICONS[type]  || Info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 32, scale: 0.94 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      exit={{    opacity: 0, y: 16, scale: 0.96, transition: { duration: 0.22 } }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      className="relative w-full max-w-sm bg-white dark:bg-slate-800 border border-slate-900/10 dark:border-slate-700 shadow-xl shadow-slate-900/8 overflow-hidden pointer-events-auto"
    >
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${style.bar}`} />

      <div className="flex items-start gap-3 px-4 py-3.5 pl-5">
        {/* Icon */}
        <Icon size={17} className={`${style.icon} mt-0.5 shrink-0`} strokeWidth={2} />

        {/* Body */}
        <div className="flex-1 min-w-0 mr-1">
          <span className={`inline-block text-[9px] font-black uppercase tracking-widest border px-1.5 py-0.5 mb-1 ${style.badge}`}>
            {style.label}
          </span>
          <p className="text-slate-800 dark:text-slate-100 text-[12px] font-semibold leading-snug font-body break-words">
            {message}
          </p>
        </div>

        {/* Close */}
        <button
          onClick={() => dismiss(id)}
          className="text-slate-300 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors mt-0.5 shrink-0"
        >
          <X size={13} strokeWidth={2.5} />
        </button>
      </div>

      {/* Progress bar */}
      <motion.div
        className={`h-[2px] ${style.bar} opacity-30`}
        initial={{ scaleX: 1, originX: 0 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
      />
    </motion.div>
  );
};

/* ── Container (portal-style, fixed bottom-right) ── */
const ToastContainer = ({ toasts, dismiss }) => (
  <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none">
    <AnimatePresence mode="popLayout">
      {toasts.map(t => (
        <Toast key={t.id} {...t} dismiss={dismiss} />
      ))}
    </AnimatePresence>
  </div>
);
