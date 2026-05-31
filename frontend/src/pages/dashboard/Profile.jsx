import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, Mail, Briefcase, Star, Edit, Save, X } from 'lucide-react';
import { api } from '../../api';

export const Profile = () => {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState(user?.name || '');
  const [skills, setSkills] = useState(user?.skills?.join(', ') || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [university, setUniversity] = useState(user?.university || '');
  const [organization, setOrganization] = useState(user?.organization || '');
  const [year, setYear] = useState(user?.year || '');

  const [stats, setStats] = useState({ label1: 'COMPLETED', val1: 0, label2: 'EARNED', val2: '$0' });

  // Load fresh statistics from database
  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user?.role === 'freelancer') {
          const bids = await api.get('/bids/my-submitted');
          const accepted = bids.filter(b => b.status === 'accepted');
          setStats({
            label1: 'COMPLETED',
            val1: accepted.length,
            label2: 'EARNED',
            val2: `$${accepted.reduce((sum, b) => sum + b.amount, 0)}`,
          });
        } else {
          const tasks = await api.get('/tasks/my-posted');
          const bids = await api.get('/bids/all');
          const accepted = bids.filter(b => b.status === 'accepted');
          setStats({
            label1: 'TASKS POSTED',
            val1: tasks.length,
            label2: 'SPENT',
            val2: `$${accepted.reduce((sum, b) => sum + b.amount, 0)}`,
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (user) {
      fetchStats();
      setName(user.name || '');
      setSkills(user.skills?.join(', ') || '');
      setBio(user.bio || '');
      setUniversity(user.university || '');
      setOrganization(user.organization || '');
      setYear(user.year || '');
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.put('/auth/profile', {
        name,
        skills: (user?.role === 'freelancer' || user?.role === 'both') ? skills.split(',').map(s => s.trim()).filter(s => s) : [],
        bio,
        university: (user?.role === 'freelancer' || user?.role === 'both') ? university : '',
        organization: (user?.role === 'client' || user?.role === 'both') ? organization : '',
        year: (user?.role === 'freelancer' || user?.role === 'both') ? year : '',
      });
      login(data);
      setIsEditing(false);
      toast('Profile updated successfully!', 'success');
    } catch (err) {
      toast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/50 py-16 transition-colors duration-300">
      <div className="container-max max-w-2xl">
        {/* Header */}
        <div className="mb-12 pb-6 border-b border-slate-900/10 dark:border-slate-700">
          <span className="text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest block mb-2">SETTINGS</span>
          <h1 className="text-3xl sm:text-4xl font-black font-heading text-slate-900 dark:text-slate-100 tracking-tighter uppercase leading-none mb-2">
            MY PROFILE
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Manage your student freelance portal settings
          </p>
        </div>

        {/* Profile Card */}
        <div className="border border-slate-900/10 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 mb-10 transition-colors">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-700 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-2xl font-black font-heading text-indigo-600 dark:text-indigo-400">
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="font-heading font-black text-2xl text-slate-800 dark:text-slate-100 uppercase tracking-tight leading-tight">{name}</h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <Star size={12} className="text-amber-500 fill-amber-500" />
                  <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {(user?.rating ?? 5.0).toFixed(1)} RATING
                  </span>
                </div>
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-secondary flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Edit size={12} />
                EDIT PROFILE
              </button>
            )}
          </div>

          {/* Form / Details */}
          {!isEditing ? (
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 font-body">
                  <Mail size={12} />
                  EMAIL ADDRESS
                </label>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-body">{user?.email || ''}</p>
              </div>

              {(user?.role === 'freelancer' || user?.role === 'both') && (
                <div>
                  <label className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 select-none font-body">
                    <Briefcase size={12} />
                    DEVELOPMENT EXPERTISE
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(user?.skills || []).map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 px-3 py-1 text-[10px] font-black uppercase tracking-wider"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(user?.role === 'freelancer' || user?.role === 'both') && user?.university && (
                <div>
                  <label className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 font-body">
                    UNIVERSITY / INSTITUTION
                  </label>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-body">{user.university}</p>
                </div>
              )}

              {(user?.role === 'freelancer' || user?.role === 'both') && user?.year && (
                <div>
                  <label className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 font-body">
                    YEAR OF STUDY
                  </label>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-body">{user.year}</p>
                </div>
              )}

              {(user?.role === 'client' || user?.role === 'both') && user?.organization && (
                <div>
                  <label className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 font-body">
                    ORGANIZATION / COMPANY
                  </label>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-body">{user.organization}</p>
                </div>
              )}

              <div>
                <label className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 font-body">
                  BIO & STATEMENT
                </label>
                <p className="text-slate-600 dark:text-slate-400 text-xs font-semibold leading-relaxed font-body">
                  {bio || 'No bio written yet.'}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 font-body">FULL NAME</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-base" required />
              </div>

              {(user?.role === 'freelancer' || user?.role === 'both') && (
                <>
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 font-body">SKILLS (COMMA-SEPARATED)</label>
                    <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} className="input-base" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 font-body">UNIVERSITY / INSTITUTION</label>
                    <input type="text" value={university} onChange={(e) => setUniversity(e.target.value)} className="input-base" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 font-body">YEAR OF STUDY</label>
                    <div className="flex gap-2 flex-wrap">
                      {['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgrad', 'Alumni'].map(y => (
                        <button
                          key={y}
                          type="button"
                          onClick={() => setYear(y)}
                          className={`px-4 py-2 text-[11px] font-bold border transition-all duration-200 ${
                            year === y
                              ? 'bg-slate-900 dark:bg-indigo-600 border-slate-900 dark:border-indigo-600 text-white'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600'
                          }`}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {(user?.role === 'client' || user?.role === 'both') && (
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 font-body">ORGANIZATION / COMPANY</label>
                  <input type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} className="input-base" required={user?.role === 'client'} />
                </div>
              )}

              <div>
                <label className="block text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 font-body">BIO</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="input-base h-28 resize-none text-xs font-semibold leading-relaxed" required />
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button type="submit" disabled={loading} className="btn-accent flex items-center gap-1.5 disabled:opacity-50">
                  <Save size={12} />
                  {loading ? 'SAVING…' : 'SAVE'}
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setName(user?.name || '');
                    setSkills(user?.skills?.join(', ') || '');
                    setBio(user?.bio || '');
                    setUniversity(user?.university || '');
                    setOrganization(user?.organization || '');
                    setYear(user?.year || '');
                    setIsEditing(false);
                  }}
                  className="btn-secondary flex items-center gap-1.5"
                >
                  <X size={12} />
                  CANCEL
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 border-t border-l border-slate-900/10 dark:border-slate-700">
          <div className="p-6 border-r border-b border-slate-900/10 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors">
            <p className="text-2xl font-black font-heading text-indigo-600 dark:text-indigo-400 leading-none mb-1">{stats.val1}</p>
            <p className="text-slate-400 dark:text-slate-500 text-[8px] font-black tracking-wider uppercase font-body">{stats.label1}</p>
          </div>
          <div className="p-6 border-r border-b border-slate-900/10 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors">
            <p className="text-2xl font-black font-heading text-slate-900 dark:text-slate-100 leading-none mb-1">{stats.val2}</p>
            <p className="text-slate-400 dark:text-slate-500 text-[8px] font-black tracking-wider uppercase font-body">{stats.label2}</p>
          </div>
          <div className="p-6 border-r border-b border-slate-900/10 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors">
            <p className="text-2xl font-black font-heading text-amber-500 leading-none mb-1">{(user?.rating ?? 5.0).toFixed(1)}</p>
            <p className="text-slate-400 dark:text-slate-500 text-[8px] font-black tracking-wider uppercase font-body">RATING</p>
          </div>
        </div>
      </div>
    </div>
  );
};
