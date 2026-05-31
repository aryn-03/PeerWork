import React from 'react';
import { Clock, User, Star, Check, X, MessageSquare } from 'lucide-react';

export const BidCard = ({ bid, onAccept, onReject, onOpenChat, showActions = false }) => {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-900/10 dark:border-slate-700 p-5 relative overflow-hidden transition-colors duration-300">
      <div className="flex justify-between items-start gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-300">
            <User size={14} />
          </div>
          <div>
            <h4 className="font-heading font-black text-slate-800 dark:text-slate-100 text-sm uppercase tracking-tight">{bid.freelancerName}</h4>
            <div className="flex items-center gap-1 mt-0.5">
              <Star size={11} className="text-amber-500 fill-amber-500" />
              <span className="text-[9px] font-black text-slate-500 dark:text-slate-400">
                {(bid.freelancerRating ?? 5.0).toFixed(1)} RATING
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-lg font-black font-heading text-indigo-600 dark:text-indigo-400 tracking-tighter leading-none">${bid.amount}</p>
          <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">{bid.deliveryTime} DAYS DELIVERY</p>
        </div>
      </div>

      <p className="text-slate-600 dark:text-slate-400 text-xs font-semibold leading-relaxed mb-4 p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 italic">
        "{bid.proposal}"
      </p>

      <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-700">
        {onOpenChat ? (
          <button
            onClick={() => onOpenChat(bid)}
            className="flex items-center gap-1.5 text-[9px] font-black text-indigo-600 dark:text-indigo-400 hover:text-slate-900 dark:hover:text-slate-100 uppercase tracking-widest transition-all"
          >
            <MessageSquare size={12} />
            <span>Discuss ({bid.comments?.length || 0})</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[8px] font-bold uppercase tracking-wider">
            <Clock size={10} />
            <span>SUBMITTED RECENTLY</span>
          </div>
        )}

        {showActions && bid.status === 'pending' ? (
          <div className="flex gap-2">
            <button
              onClick={() => onReject?.(bid._id)}
              className="px-3 py-1.5 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-[9px] font-bold uppercase tracking-wider transition-colors"
            >
              Reject
            </button>
            <button
              onClick={() => onAccept?.(bid._id)}
              className="px-3 py-1.5 bg-slate-900 dark:bg-indigo-600 text-white hover:bg-indigo-600 dark:hover:bg-indigo-500 text-[9px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
            >
              <Check size={10} />
              Accept
            </button>
          </div>
        ) : (
          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border ${
            bid.status === 'accepted'
              ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800'
              : bid.status === 'rejected'
              ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800'
              : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800'
          }`}>
            {bid.status}
          </span>
        )}
      </div>
    </div>
  );
};
