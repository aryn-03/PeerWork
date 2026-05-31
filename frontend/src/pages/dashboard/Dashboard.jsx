import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Briefcase, TrendingUp, Target, Star, Plus, CheckCircle, Clock, X, Send, MessageSquare, User } from 'lucide-react';
import { BidCard } from '../../components/cards/BidCard';
import { api } from '../../api';

export const Dashboard = () => {
  const { user, activeRole } = useAuth();
  const { toast } = useToast();

  // Loading and data states
  const [tasksList, setTasksList] = useState([]);
  const [bidsList, setBidsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Client States
  const [showPostForm, setShowPostForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [skills, setSkills] = useState('');
  const [formError, setFormError] = useState('');

  // Proposal Detail & Chat States
  const [activeBidChat, setActiveBidChat] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [sendingComment, setSendingComment] = useState(false);
  const chatEndRef = useRef(null);

  const fetchDashboardData = React.useCallback(async () => {
    setLoading(true);
    try {
      if (activeRole === 'freelancer') {
        const bidsData = await api.get('/bids/my-submitted');
        const tasksData = await api.get('/tasks/my-bids');
        setBidsList(bidsData);
        setTasksList(tasksData);
      } else {
        const tasksData = await api.get('/tasks/my-posted');
        const bidsData = await api.get('/bids/all');
        setBidsList(bidsData);
        setTasksList(tasksData);
      }
    } catch (err) {
      console.error(err);
      toast('Failed to load dashboard data.', 'error');
    } finally {
      setLoading(false);
    }
  }, [activeRole, toast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleOpenProposalChat = async (bid) => {
    try {
      const freshBid = await api.get(`/bids/${bid._id}`);
      setActiveBidChat(freshBid);
      setCommentText('');
      // Scroll to bottom after chat opens
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      console.error(err);
      toast('Failed to load proposal details.', 'error');
    }
  };

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !activeBidChat) return;

    setSendingComment(true);
    try {
      const updatedBid = await api.post(`/bids/${activeBidChat._id}/comment`, {
        text: commentText,
      });
      setActiveBidChat(updatedBid);
      setCommentText('');
      // Sync comment count in card list
      setBidsList(prev => prev.map(b => b._id === updatedBid._id ? updatedBid : b));
      // Scroll to bottom after new message
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    } catch (err) {
      toast(err.message || 'Failed to send comment.', 'error');
    } finally {
      setSendingComment(false);
    }
  };

  const handlePostTask = async (e) => {
    e.preventDefault();
    if (!title || !description || !budget || !deadline || !skills) {
      setFormError('Please fill out all fields.');
      return;
    }

    try {
      await api.post('/tasks', {
        title,
        description,
        budget: parseFloat(budget),
        deadline,
        skillsRequired: skills.split(',').map(s => s.trim()).filter(s => s)
      });

      setTitle('');
      setDescription('');
      setBudget('');
      setDeadline('');
      setSkills('');
      setFormError('');
      setShowPostForm(false);
      toast('Task posted successfully! Your gig is now live on the marketplace.', 'success');
      fetchDashboardData();
    } catch (err) {
      setFormError(err.message || 'Failed to post task.');
    }
  };

  const handleUpdateBidStatus = async (bidId, status) => {
    try {
      const updatedBid = await api.patch(`/bids/${bidId}/status`, { status });
      toast(`Proposal has been ${status === 'accepted' ? 'accepted' : 'rejected'}.`, 'success');
      if (activeBidChat && activeBidChat._id === bidId) {
        setActiveBidChat(updatedBid);
      }
      fetchDashboardData();
    } catch (err) {
      toast(err.message || 'Failed to update proposal status.', 'error');
    }
  };

  // Stats Calculations
  const activeFreelancerProjects = bidsList.filter(b => b.status === 'accepted').length;
  const activeClientProjects = tasksList.filter(t => t.status === 'in-progress').length;
  
  const estimatedEarnings = bidsList
    .filter(b => b.status === 'accepted')
    .reduce((sum, b) => sum + b.amount, 0);

  const spentBudget = bidsList
    .filter(b => b.status === 'accepted')
    .reduce((sum, b) => sum + b.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Loading dashboard data…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/50 py-16 transition-colors duration-300">
      <div className="container-max">
        {/* Welcome Header */}
        <div className="mb-12 pb-6 border-b border-slate-900/10 dark:border-slate-700 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <span className="text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest block mb-2">WORKSPACE</span>
            <h1 className="text-3xl md:text-4xl font-black font-heading text-slate-900 dark:text-slate-100 tracking-tighter uppercase leading-none mb-2">
              DASHBOARD
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
              Mode: <span className="text-slate-800 dark:text-slate-200 font-bold">{activeRole === 'freelancer' ? 'Student Freelancer' : 'Client Poster'}</span>
            </p>
          </div>

          {activeRole === 'client' && (
            <button
              onClick={() => setShowPostForm(!showPostForm)}
              className="btn-accent flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus size={14} />
              {showPostForm ? 'CLOSE TASK FORM' : 'POST A GIG'}
            </button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {activeRole === 'freelancer' ? (
            <>
              <div className="p-6 border border-slate-900/10 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors">
                <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">ACTIVE GIGS</p>
                <p className="text-3xl font-black font-heading text-slate-900 dark:text-slate-100 tracking-tight">{activeFreelancerProjects}</p>
              </div>
              <div className="p-6 border border-slate-900/10 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors">
                <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">TOTAL BIDDED</p>
                <p className="text-3xl font-black font-heading text-slate-900 dark:text-slate-100 tracking-tight">{bidsList.length}</p>
              </div>
              <div className="p-6 border border-slate-900/10 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors">
                <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">ESTIMATED EARNINGS</p>
                <p className="text-3xl font-black font-heading text-indigo-600 dark:text-indigo-400 tracking-tight">₹{estimatedEarnings}</p>
              </div>
              <div className="p-6 border border-slate-900/10 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors">
                <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">RATING</p>
                <p className="text-3xl font-black font-heading text-amber-500 tracking-tight">{(user?.rating ?? 5.0).toFixed(1)}</p>
              </div>
            </>
          ) : (
            <>
              <div className="p-6 border border-slate-900/10 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors">
                <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">TASKS POSTED</p>
                <p className="text-3xl font-black font-heading text-slate-900 dark:text-slate-100 tracking-tight">{tasksList.length}</p>
              </div>
              <div className="p-6 border border-slate-900/10 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors">
                <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">ACTIVE CONTRACTS</p>
                <p className="text-3xl font-black font-heading text-slate-900 dark:text-slate-100 tracking-tight">{activeClientProjects}</p>
              </div>
              <div className="p-6 border border-slate-900/10 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors">
                <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">SPENT BUDGET</p>
                <p className="text-3xl font-black font-heading text-indigo-600 dark:text-indigo-400 tracking-tight">₹{spentBudget}</p>
              </div>
              <div className="p-6 border border-slate-900/10 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors">
                <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">BIDS MODERATED</p>
                <p className="text-3xl font-black font-heading text-emerald-600 dark:text-emerald-400 tracking-tight">
                  {bidsList.filter(b => b.status !== 'pending').length}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Post Task Form */}
        {activeRole === 'client' && showPostForm && (
          <div className="border border-indigo-600 dark:border-indigo-500 bg-white dark:bg-slate-800 p-8 mb-10 max-w-2xl transition-colors">
            <h3 className="font-heading font-black text-lg text-slate-800 dark:text-slate-100 uppercase tracking-widest mb-6 pb-2 border-b border-slate-100 dark:border-slate-700">
              CREATE FREELANCE GIG
            </h3>
            <form onSubmit={handlePostTask} className="space-y-5">
              <div>
                <label className="block text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 font-body">TASK TITLE</label>
                <input type="text" placeholder="e.g. Design Landing Page for SaaS" value={title} onChange={(e) => setTitle(e.target.value)} className="input-base" required />
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 font-body">DETAILED DESCRIPTION</label>
                <textarea placeholder="Detail all specifications, requirements, and deliverables..." value={description} onChange={(e) => setDescription(e.target.value)} className="input-base h-32 resize-none text-xs font-semibold leading-relaxed" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 font-body">BUDGET (₹)</label>
                  <input type="number" placeholder="250" value={budget} onChange={(e) => setBudget(e.target.value)} className="input-base" required />
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 font-body">DEADLINE</label>
                  <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="input-base" required />
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 font-body">REQUIRED SKILLS (COMMA-SEPARATED)</label>
                <input type="text" placeholder="React, CSS, Writing..." value={skills} onChange={(e) => setSkills(e.target.value)} className="input-base" required />
              </div>
              {formError && <p className="text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider">{formError}</p>}
              <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button type="submit" className="btn-accent">Post Task</button>
                <button type="button" onClick={() => setShowPostForm(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Dash content */}
        {activeRole === 'freelancer' ? (
          <div className="space-y-6">
            <h2 className="font-heading font-black text-2xl text-slate-900 dark:text-slate-100 uppercase tracking-tight mb-6">Your Placed Bids</h2>
            {bidsList.length > 0 ? (
              <div className="space-y-4">
                {bidsList.map(bid => {
                  const linkedTask = tasksList.find(t => t._id === bid.taskId);
                  return (
                    <div key={bid._id} className="bg-white dark:bg-slate-800 border border-slate-900/10 dark:border-slate-700 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
                      <div>
                        <h4 className="font-heading font-black text-slate-800 dark:text-slate-100 text-base uppercase tracking-tight mb-2">{bid.taskTitle}</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold leading-relaxed mb-3 italic">"{bid.proposal}"</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                          <span>Quote: ₹{bid.amount}</span>
                          <span>Delivery: {bid.deliveryTime} Days</span>
                          {linkedTask?.postedBy?.name && (
                            <span>Client: <span className="text-slate-650 dark:text-slate-350">{linkedTask.postedBy.name}</span></span>
                          )}
                          {linkedTask && <span>Deadline: {new Date(linkedTask.deadline).toLocaleDateString()}</span>}
                          <button
                            onClick={() => handleOpenProposalChat(bid)}
                            className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-bold uppercase"
                          >
                            <MessageSquare size={10} />
                            Discuss ({bid.comments?.length || 0})
                          </button>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 border ${
                        bid.status === 'accepted'
                          ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800'
                          : bid.status === 'rejected'
                          ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800'
                          : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800'
                      }`}>
                        {bid.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 border border-slate-900/10 dark:border-slate-700 bg-white dark:bg-slate-800">
                <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">No bids submitted yet.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            <div>
              <h2 className="font-heading font-black text-2xl text-slate-900 dark:text-slate-100 uppercase tracking-tight mb-6">Manage Your Posted Tasks</h2>
              {tasksList.length > 0 ? (
                <div className="space-y-8">
                  {tasksList.map(task => {
                    const taskProposals = bidsList.filter(b => b.taskId === task._id);
                    return (
                      <div key={task._id} className="bg-white dark:bg-slate-800 border border-slate-900/10 dark:border-slate-700 p-6 transition-colors">
                        <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-700 pb-4 mb-6">
                          <div>
                            <h3 className="font-heading font-black text-xl text-slate-800 dark:text-slate-100 uppercase tracking-tight">{task.title}</h3>
                            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-1">
                              Budget: ₹{task.budget} • Status: <span className="font-bold text-slate-800 dark:text-slate-200">{task.status}</span>
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="font-heading font-black text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
                            PROPOSALS RECEIVED ({taskProposals.length})
                          </h4>
                          {taskProposals.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-4">
                              {taskProposals.map(bid => (
                                <BidCard
                                  key={bid._id}
                                  bid={bid}
                                  showActions={true}
                                  onAccept={(id) => handleUpdateBidStatus(id, 'accepted')}
                                  onReject={(id) => handleUpdateBidStatus(id, 'rejected')}
                                  onOpenChat={handleOpenProposalChat}
                                />
                              ))}
                            </div>
                          ) : (
                            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest py-3 italic">
                              No bids received for this task yet.
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 border border-slate-900/10 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">No tasks posted yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Proposal Chat & Details Modal */}
        {activeBidChat && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 border border-slate-900/10 dark:border-slate-700 w-full max-w-2xl flex flex-col max-h-[90vh] shadow-xl transition-all duration-300">
              
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <span className="text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase tracking-widest block mb-1">NEGOTIATION & PROPOSAL</span>
                  <h3 className="font-heading font-black text-slate-800 dark:text-slate-100 text-lg uppercase tracking-tight">
                    {activeBidChat.taskTitle}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveBidChat(null)}
                  className="w-8 h-8 flex items-center justify-center border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body / Scroll Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Bid Details Summary */}
                <div className="p-5 border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 rounded-sm">
                        <User size={12} />
                      </div>
                      <span className="font-heading font-black text-xs uppercase text-slate-800 dark:text-slate-100 tracking-wide">
                        {activeBidChat.freelancerName}
                      </span>
                      <div className="flex items-center gap-0.5 ml-1">
                        <Star size={10} className="text-amber-500 fill-amber-500" />
                        <span className="text-[8px] font-black text-slate-400">
                          {(activeBidChat.freelancerRating ?? 5.0).toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 italic bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3 leading-relaxed">
                      "{activeBidChat.proposal}"
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <p className="text-2xl font-black font-heading text-indigo-600 dark:text-indigo-400 leading-none">₹{activeBidChat.amount}</p>
                    <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                      {activeBidChat.deliveryTime} DAYS DELIVERY
                    </p>
                    <div className="mt-3">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border ${
                        activeBidChat.status === 'accepted'
                          ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800'
                          : activeBidChat.status === 'rejected'
                          ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800'
                          : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800'
                      }`}>
                        {activeBidChat.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Comment log thread */}
                <div className="space-y-3">
                  <h4 className="font-heading font-black text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Discussion Messages ({activeBidChat.comments?.length || 0})
                  </h4>
                  <div className="border border-slate-100 dark:border-slate-700 h-64 overflow-y-auto p-4 space-y-3 bg-slate-50/30 dark:bg-slate-900/20">
                    {activeBidChat.comments && activeBidChat.comments.length > 0 ? (
                      activeBidChat.comments.map((msg, index) => {
                        const currentUserId = (user?.id || user?._id || '').toString();
                        const msgSenderId = (msg.senderId || '').toString();
                        const isMe = msgSenderId === currentUserId;
                        return (
                          <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">
                                {msg.senderName}
                              </span>
                              <span className="text-[7px] text-slate-400">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className={`px-4 py-2 text-xs font-semibold max-w-[85%] ${
                              isMe
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                            }`}>
                              {msg.text}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">
                        No discussion history. Start negotiation below!
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                </div>

                {/* Send message form */}
                <form onSubmit={handleSendComment} className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Ask a question or offer negotiation terms..."
                    className="input-base flex-1"
                    disabled={sendingComment}
                  />
                  <button
                    type="submit"
                    disabled={sendingComment || !commentText.trim()}
                    className="px-4 py-3 bg-slate-900 dark:bg-indigo-600 text-white hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-colors flex items-center justify-center shrink-0 disabled:opacity-50"
                  >
                    <Send size={14} />
                  </button>
                </form>
              </div>

              {/* Modal Actions Footer */}
              <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <button
                  type="button"
                  onClick={() => setActiveBidChat(null)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-650 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest hover:border-slate-450 dark:hover:border-slate-400 transition-colors"
                >
                  Close
                </button>

                {activeRole === 'client' && activeBidChat.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateBidStatus(activeBidChat._id, 'rejected')}
                      className="px-4 py-2 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-[10px] font-black uppercase tracking-widest transition-colors"
                    >
                      Reject Proposal
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateBidStatus(activeBidChat._id, 'accepted')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle size={12} />
                      Accept Proposal
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
