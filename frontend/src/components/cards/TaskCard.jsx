import React from 'react';
import { Clock, DollarSign, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const TaskCard = ({ task, onClick }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-slate-800 border border-slate-900/10 dark:border-slate-700 p-6 flex flex-col justify-between min-h-[250px] cursor-pointer group hover:border-indigo-600 dark:hover:border-indigo-400 transition-colors"
      onClick={onClick}
    >
      <div>
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex flex-col gap-1.5">
            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border ${
              task.isDemo
                ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800'
                : task.status === 'open'
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800'
                : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800'
            }`}>
              {task.isDemo ? 'SAMPLE GIG' : (task.status || 'open')}
            </span>
            {(task.clientName || task.postedBy?.name) && (
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Client: <span className="text-slate-650 dark:text-slate-350">{task.clientName || task.postedBy.name}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-0.5 font-bold text-slate-800 dark:text-slate-200 text-sm">
            <DollarSign size={13} className="text-indigo-600 dark:text-indigo-400" />
            <span className="font-heading font-black text-base tracking-tight">${task.budget}</span>
          </div>
        </div>

        <h3 className="font-heading font-black text-lg text-slate-900 dark:text-slate-100 uppercase tracking-tight mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {task.title}
        </h3>

        <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold leading-relaxed line-clamp-3 mb-6">
          {task.description}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
          <Clock size={12} />
          <span className="text-[9px] font-bold uppercase tracking-wider">{formatDate(task.deadline)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform duration-300">
          <span className="text-[10px] tracking-wider uppercase">Details</span>
          <ArrowRight size={12} />
        </div>
      </div>
    </motion.div>
  );
};
