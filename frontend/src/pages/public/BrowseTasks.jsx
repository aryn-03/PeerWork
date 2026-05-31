import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, Send, Clock, IndianRupee, User, ShieldCheck } from 'lucide-react';
import { TaskCard } from '../../components/cards/TaskCard';
import { BidCard } from '../../components/cards/BidCard';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../api';

export const BrowseTasks = () => {
  const { isAuthenticated, activeRole } = useAuth();
  const { toast } = useToast();
  const [tasksList, setTasksList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskBids, setTaskBids] = useState([]);

  // Proposal form state
  const [amount, setAmount] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [proposal, setProposal] = useState('');
  const [formError, setFormError] = useState('');

  const fetchTasks = React.useCallback(async () => {
    try {
      const data = await api.get('/tasks');
      setTasksList(data || []);
    } catch (err) {
      console.error(err);
      toast('Failed to load tasks from server.', 'error');
      setTasksList([]);
    }
  }, [toast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const fetchBidsForTask = async () => {
      if (selectedTask && isAuthenticated) {
        try {
          const data = await api.get(`/bids/task/${selectedTask._id}`);
          setTaskBids(data || []);
        } catch (err) {
          console.error(err);
          setTaskBids([]);
        }
      } else {
        setTaskBids([]);
      }
    };
    fetchBidsForTask();
  }, [selectedTask, isAuthenticated]);

  const filteredTasks = tasksList.filter(task => {
    if (task.status !== 'open') return false;

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(lowerSearch);
      const matchesDesc = task.description.toLowerCase().includes(lowerSearch);
      if (!matchesTitle && !matchesDesc) return false;
    }

    if (skillFilter) {
      const lowerSkill = skillFilter.toLowerCase();
      const matchesSkill = task.skillsRequired.some(skill =>
        skill.toLowerCase().includes(lowerSkill)
      );
      if (!matchesSkill) return false;
    }

    return true;
  });

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast('Please log in to submit a proposal.', 'warning');
      return;
    }
    if (activeRole !== 'freelancer') {
      toast('You must be a Student Freelancer to place a bid.', 'warning');
      return;
    }
    if (!amount || !deliveryTime || !proposal) {
      setFormError('Please fill out all fields.');
      return;
    }

    try {
      await api.post('/bids', {
        taskId: selectedTask._id,
        amount: parseFloat(amount),
        deliveryTime: parseInt(deliveryTime),
        proposal,
      });

      setAmount('');
      setDeliveryTime('');
      setProposal('');
      setFormError('');
      setSelectedTask(null);
      toast('Your bid proposal has been submitted successfully!', 'success');
      fetchTasks();
    } catch (err) {
      setFormError(err.message || 'Failed to submit proposal');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/50 py-16 relative transition-colors duration-300">
      <div className="container-max">
        {/* Header */}
        <div className="mb-12">
          <span className="text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest block mb-2">MARKETPLACE</span>
          <h1 className="text-4xl font-black font-heading text-slate-900 dark:text-slate-100 tracking-tighter uppercase mb-2">AVAILABLE GIGS</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider max-w-md leading-normal">
            Explore gigs posted by clients. Submit your bidding proposal and secure payments upon review.
          </p>
        </div>

        {/* Guest Call-To-Action Banner */}
        {!isAuthenticated && (
          <div className="border border-indigo-600/30 dark:border-indigo-500/30 bg-gradient-to-r from-indigo-500/5 to-violet-500/5 dark:from-indigo-950/15 dark:to-violet-950/15 p-8 mb-10 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden transition-all duration-300">
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 max-w-xl">
              <h3 className="font-heading font-black text-xl text-slate-800 dark:text-slate-100 uppercase tracking-tight mb-2">
                Join PeerWork to Bid or Post Gigs
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold leading-relaxed max-w-lg">
                Connect with student developers and clients across campus. Sign up for a free account to place bids, secure milestone payments, and grow your professional portfolio.
              </p>
            </div>
            <div className="relative z-10 flex gap-3 shrink-0">
              <Link to="/login" className="px-5 py-3 border border-slate-900/10 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-900 dark:hover:border-slate-500 text-xs font-bold uppercase tracking-wider transition-all">
                Login
              </Link>
              <Link to="/register" className="px-5 py-3 bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition-all">
                Register Free
              </Link>
            </div>
          </div>
        )}

        {/* Filter Controls */}
        <div className="border border-slate-900/10 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 mb-10 flex flex-col md:flex-row gap-4 items-center transition-colors duration-300">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-base pl-11"
            />
          </div>
          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="Filter by skill (e.g. React)..."
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="input-base"
            />
          </div>
          <button
            onClick={() => { setSearchTerm(''); setSkillFilter(''); }}
            className="w-full md:w-auto btn-secondary h-12 flex items-center justify-center"
          >
            Clear Filters
          </button>
        </div>

        {/* Task Grid */}
        {filteredTasks.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onClick={() => { setSelectedTask(task); setFormError(''); }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-slate-900/10 dark:border-slate-700 bg-white dark:bg-slate-800">
            <h3 className="font-heading font-black text-xl text-slate-800 dark:text-slate-200 uppercase tracking-tight mb-2">No tasks found</h3>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider mb-6">Try adjusting your search criteria</p>
            <button
              onClick={() => { setSearchTerm(''); setSkillFilter(''); }}
              className="btn-secondary"
            >
              Reset Search
            </button>
          </div>
        )}
      </div>

      {/* Slide-out details drawer */}
      <AnimatePresence>
        {selectedTask && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTask(null)}
              className="fixed inset-0 bg-slate-900 dark:bg-black z-50 cursor-pointer"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
              className="fixed top-0 right-0 h-full w-full sm:w-[500px] md:w-[600px] bg-white dark:bg-slate-900 border-l border-slate-900/10 dark:border-slate-700 shadow-2xl z-50 overflow-y-auto p-6 md:p-8 transition-colors"
            >
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100 dark:border-slate-700">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">PROJECT SPECIFICATIONS</span>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-1 border border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Title & Budget */}
              <div className="mb-6">
                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border border-indigo-100 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
                  {selectedTask.status}
                </span>
                <h2 className="font-heading font-black text-2xl md:text-3xl text-slate-900 dark:text-slate-100 uppercase tracking-tighter leading-tight mt-3 mb-2">
                  {selectedTask.title}
                </h2>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
                  {(selectedTask.clientName || selectedTask.postedBy?.name) && (
                    <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <User size={12} className="text-indigo-600 dark:text-indigo-400" />
                      <span>Poster: <span className="text-slate-800 dark:text-slate-200">{selectedTask.clientName || selectedTask.postedBy.name}</span></span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-slate-850 dark:text-slate-200">
                    <IndianRupee size={14} className="text-indigo-600 dark:text-indigo-400" />
                    <span className="font-heading font-black text-lg tracking-tight">₹{selectedTask.budget} Budget</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <Clock size={12} />
                    <span>Deadline: {new Date(selectedTask.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <p className="text-slate-600 dark:text-slate-400 text-xs font-semibold leading-relaxed font-body whitespace-pre-wrap">
                  {selectedTask.description}
                </p>
              </div>

              {/* Skills */}
              <div className="mb-8">
                <h4 className="font-heading font-black text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">REQUIRED SKILLSETS</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTask.skillsRequired.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 px-3 py-1 text-[10px] font-black uppercase tracking-wider"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Proposals list */}
              <div className="mb-10">
                <h4 className="font-heading font-black text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 pb-2 border-b border-slate-100 dark:border-slate-700">
                  SUBMITTED PROPOSALS ({taskBids.length})
                </h4>
                {taskBids.length > 0 ? (
                  <div className="space-y-4">
                    {taskBids.map((bid) => (
                      <BidCard key={bid._id} bid={bid} showActions={false} />
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider text-center py-6 border border-dashed border-slate-200 dark:border-slate-700">
                    No proposals submitted yet. Be the first to place a bid!
                  </p>
                )}
              </div>

              {/* Place a Bid Form */}
              {isAuthenticated && activeRole === 'freelancer' && (
                <div className="border border-indigo-600 dark:border-indigo-500 bg-white dark:bg-slate-800 p-6">
                  <h4 className="font-heading font-black text-xs uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-indigo-600 dark:text-indigo-400" />
                    SUBMIT PROPOSAL
                  </h4>

                  <form onSubmit={handlePlaceBid} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 font-body">BID AMOUNT (₹)</label>
                        <input
                          type="number"
                          placeholder="250"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="input-base"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 font-body">DELIVERY (DAYS)</label>
                        <input
                          type="number"
                          placeholder="7"
                          value={deliveryTime}
                          onChange={(e) => setDeliveryTime(e.target.value)}
                          className="input-base"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 font-body">PROPOSAL LETTER</label>
                      <textarea
                        placeholder="Detail why you are the best candidate..."
                        value={proposal}
                        onChange={(e) => setProposal(e.target.value)}
                        className="input-base h-28 resize-none text-xs font-semibold leading-relaxed"
                        required
                      />
                    </div>

                    {formError && <p className="text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider">{formError}</p>}

                    <button
                      type="submit"
                      className="w-full btn-accent flex items-center justify-center gap-2 py-3"
                    >
                      <Send size={12} />
                      SUBMIT PROPOSAL
                    </button>
                  </form>
                </div>
              )}

              {/* Guest CTA Guidance */}
              {!isAuthenticated && (
                <div className="border border-slate-900/10 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/45 p-6 text-center transition-colors">
                  <h4 className="font-heading font-black text-xs uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-2">
                    Want to Place a Bid?
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold leading-normal mb-5 max-w-sm mx-auto">
                    Sign up or log in to your student freelancer account to submit proposals for this task and start earning.
                  </p>
                  <div className="flex justify-center gap-3">
                    <Link to="/login" className="px-4 py-2 border border-slate-900/10 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold uppercase tracking-wider hover:border-slate-900 dark:hover:border-slate-400 transition-colors">
                      Sign In
                    </Link>
                    <Link to="/register" className="px-4 py-2 bg-slate-900 dark:bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors">
                      Register
                    </Link>
                  </div>
                </div>
              )}

              {/* Client Role Switcher Guidance */}
              {isAuthenticated && activeRole === 'client' && (
                <div className="border border-slate-900/10 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/45 p-6 text-center transition-colors">
                  <h4 className="font-heading font-black text-xs uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-2 font-heading">
                    Viewing as Client Poster
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold leading-normal max-w-sm mx-auto">
                    You are currently acting as a Client. To submit proposals on this gig, switch your role to Student Freelancer using the toggle button in the Navbar.
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
