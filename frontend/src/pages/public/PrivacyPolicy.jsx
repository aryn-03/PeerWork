import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database, Bell, Trash2, Mail, ChevronDown } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { show: { transition: { staggerChildren: 0.08 } } };

const SECTIONS = [
  {
    icon: <Eye size={18} />,
    title: '1. Information We Collect',
    content: [
      {
        sub: 'Account Information',
        text: 'When you register on PeerWork, we collect your name, email address, university/institution name, year of study, role (freelancer or client), and any skills or portfolio links you choose to provide.',
      },
      {
        sub: 'Usage Data',
        text: 'We automatically collect information on how you interact with PeerWork — including pages visited, tasks viewed, proposals submitted, and session timestamps. This data is used solely to improve platform experience.',
      },
      {
        sub: 'Communications',
        text: 'Any messages, proposal discussions, or comments you send through the platform are stored to enable the discussion feature and maintain a record of project conversations.',
      },
    ],
  },
  {
    icon: <Database size={18} />,
    title: '2. How We Use Your Information',
    content: [
      {
        sub: 'Platform Operations',
        text: 'Your data is used to operate and maintain PeerWork — including matching freelancers with tasks, processing proposals, managing bids, and facilitating client-freelancer communication.',
      },
      {
        sub: 'Personalisation',
        text: 'We use your skills, role, and activity history to recommend relevant tasks, tailor your dashboard, and surface opportunities matching your profile.',
      },
      {
        sub: 'Security & Fraud Prevention',
        text: 'Account data and usage logs help us detect suspicious activity, enforce our Terms of Service, and protect all users on the platform.',
      },
    ],
  },
  {
    icon: <Lock size={18} />,
    title: '3. Data Security',
    content: [
      {
        sub: 'Encryption',
        text: 'All passwords are hashed using industry-standard bcrypt before storage. Data in transit is protected via HTTPS/TLS encryption.',
      },
      {
        sub: 'Authentication',
        text: 'We use JWT-based session tokens with secure expiry policies. Sessions are invalidated immediately upon logout.',
      },
      {
        sub: 'Access Controls',
        text: 'Proposal data, bid details, and discussion threads are scoped by authorization — only the task poster (client) and the bidding freelancer can access their shared conversation.',
      },
    ],
  },
  {
    icon: <Bell size={18} />,
    title: '4. Cookies & Tracking',
    content: [
      {
        sub: 'Essential Cookies',
        text: 'PeerWork uses minimal session cookies required to keep you logged in and maintain your theme preference (light/dark mode). No third-party advertising cookies are used.',
      },
      {
        sub: 'Local Storage',
        text: 'We store your active role selection (freelancer/client mode) and session state in browser local storage for a smoother experience across sessions.',
      },
    ],
  },
  {
    icon: <Shield size={18} />,
    title: '5. Sharing of Information',
    content: [
      {
        sub: 'We Do Not Sell Your Data',
        text: 'PeerWork does not sell, rent, or trade your personal information to any third party for marketing or commercial purposes.',
      },
      {
        sub: 'Limited Disclosure',
        text: 'We may share data only when required by law, to protect our legal rights, or with service providers strictly necessary for platform operation (e.g. database hosting) under confidentiality agreements.',
      },
    ],
  },
  {
    icon: <Trash2 size={18} />,
    title: '6. Data Retention & Deletion',
    content: [
      {
        sub: 'Retention Period',
        text: 'Your account and activity data is retained for as long as your account is active. Inactive accounts may be archived after 24 months of no activity.',
      },
      {
        sub: 'Right to Deletion',
        text: 'You may request deletion of your account and all associated data at any time by contacting us at the email below. Data will be purged within 30 business days of a verified request.',
      },
    ],
  },
  {
    icon: <Mail size={18} />,
    title: '7. Contact Us',
    content: [
      {
        sub: 'Data Queries & Requests',
        text: 'For privacy-related concerns, data access requests, or deletion inquiries, reach us at: privacy@peerwork.io — we aim to respond within 5 business days.',
      },
    ],
  },
];

function AccordionItem({ section }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      variants={fadeUp}
      className="border border-slate-900/10 dark:border-slate-700 overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-colors duration-200 group"
      >
        <div className="flex items-center gap-3">
          <span className="text-indigo-600 dark:text-indigo-400 flex-shrink-0">
            {section.icon}
          </span>
          <span className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-100 font-heading">
            {section.title}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`text-slate-400 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-indigo-500' : ''}`}
        />
      </button>

      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6 border-t border-slate-900/10 dark:border-slate-700 pt-5 space-y-4">
          {section.content.map((item, i) => (
            <div key={i}>
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-1">
                {item.sub}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export const PrivacyPolicy = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0D1117] min-h-screen transition-colors duration-300">

      {/* ── Hero Banner ── */}
      <section className="relative pt-28 pb-20 border-b border-slate-900/10 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-[0.04] pointer-events-none" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-200/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="container-max relative z-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="max-w-3xl"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 border border-indigo-500/30 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-1.5 mb-6">
              <Shield size={12} className="text-indigo-600 dark:text-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Privacy Policy
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-6xl font-black font-heading text-slate-900 dark:text-slate-100 tracking-tighter leading-none uppercase mb-6"
            >
              YOUR DATA. <br />
              <span className="text-indigo-600">YOUR CONTROL.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-slate-500 dark:text-slate-400 text-base font-semibold leading-relaxed max-w-xl">
              PeerWork is built for students, by people who value trust. Here's exactly what data we collect, why we collect it, and how you can control it.
            </motion.p>

            <motion.p variants={fadeUp} className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-6">
              Last updated: May 2025 · Effective immediately
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Accordion Content ── */}
      <section className="py-20">
        <div className="container-max max-w-3xl">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-2"
          >
            {SECTIONS.map((section, i) => (
              <AccordionItem key={i} section={section} />
            ))}
          </motion.div>

          {/* Bottom note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-16 border border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-900/10 p-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <Shield size={18} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
                  Our Commitment
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  We are committed to handling your data with integrity. This policy may be updated periodically — continued use of PeerWork after any changes constitutes your acceptance of the updated terms. We will always notify users of material changes via the registered email.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
