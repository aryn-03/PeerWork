import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, AlertTriangle, DollarSign, Ban, Scale, RefreshCw, Mail, ChevronDown, CheckCircle2 } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { show: { transition: { staggerChildren: 0.08 } } };

const SECTIONS = [
  {
    icon: <Users size={18} />,
    title: '1. Eligibility & Accounts',
    content: [
      {
        sub: 'Who Can Use PeerWork',
        text: 'PeerWork is open to currently enrolled or recently graduated students. By registering, you confirm that the information you provide is accurate and that you are at least 16 years of age.',
      },
      {
        sub: 'Account Responsibility',
        text: 'You are fully responsible for all activity that occurs under your account. You must not share your login credentials with any other person. PeerWork reserves the right to suspend accounts found in violation of this policy.',
      },
      {
        sub: 'One Account Per User',
        text: 'Each person may register only one account. Creating duplicate or fake accounts to circumvent suspensions or exploit platform features is strictly prohibited.',
      },
    ],
  },
  {
    icon: <FileText size={18} />,
    title: '2. Posting Tasks & Proposals',
    content: [
      {
        sub: 'Client Obligations',
        text: 'Clients must post accurate, honest task descriptions. Misrepresenting scope, budget, or deliverables is a violation of these terms. Tasks must represent lawful work and must not involve illegal content or services.',
      },
      {
        sub: 'Freelancer Proposals',
        text: 'Proposals must represent your genuine intention to complete the work as described. Submitting proposals without intent to deliver, or submitting on tasks you are unqualified for, may result in account restrictions.',
      },
      {
        sub: 'Prohibited Content',
        text: 'Tasks or proposals involving academic dishonesty (e.g. writing essays to be submitted as another person\'s work), illegal activities, harassment, or adult content are strictly prohibited and will result in immediate account termination.',
      },
    ],
  },
  {
    icon: <DollarSign size={18} />,
    title: '3. Payments & Fees',
    content: [
      {
        sub: 'Platform Fee',
        text: 'PeerWork currently operates with no commission fee during its beta phase. This may change upon full launch — all registered users will be notified in advance of any fee structure changes.',
      },
      {
        sub: 'Payment Responsibility',
        text: 'All payment arrangements between clients and freelancers are currently handled off-platform during beta. PeerWork is not liable for payment disputes between users at this stage.',
      },
      {
        sub: 'Future Escrow System',
        text: 'A built-in escrow and payment release system is planned for the production release. When implemented, funds will be held securely and released upon client confirmation of satisfactory delivery.',
      },
    ],
  },
  {
    icon: <AlertTriangle size={18} />,
    title: '4. User Conduct',
    content: [
      {
        sub: 'Respectful Communication',
        text: 'All interactions on PeerWork — including proposal discussions, comments, and profile content — must remain professional and respectful. Harassment, discrimination, or threatening behaviour of any kind will not be tolerated.',
      },
      {
        sub: 'Spam & Manipulation',
        text: 'Sending unsolicited bulk messages, artificially inflating ratings, or attempting to game the platform\'s recommendation algorithms are violations subject to immediate suspension.',
      },
      {
        sub: 'Intellectual Property',
        text: 'You retain ownership of all original work you create on PeerWork. By using the platform, you grant PeerWork a non-exclusive licence to display your public profile and portfolio content for platform-related promotional purposes.',
      },
    ],
  },
  {
    icon: <Ban size={18} />,
    title: '5. Termination & Suspension',
    content: [
      {
        sub: 'Our Rights',
        text: 'PeerWork reserves the right to suspend, restrict, or permanently terminate any account that violates these Terms of Service, without prior notice, at our sole discretion.',
      },
      {
        sub: 'Your Right to Leave',
        text: 'You may delete your account at any time. Upon deletion, your public profile will be removed. Completed project records may be retained for 90 days for dispute resolution purposes.',
      },
    ],
  },
  {
    icon: <Scale size={18} />,
    title: '6. Liability & Disclaimers',
    content: [
      {
        sub: 'No Warranty',
        text: 'PeerWork is provided "as is" without warranties of any kind. We do not guarantee uninterrupted service, specific outcomes from task postings, or that all freelancers/clients are accurately represented.',
      },
      {
        sub: 'Limitation of Liability',
        text: 'To the maximum extent permitted by law, PeerWork shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform, including disputes between clients and freelancers.',
      },
      {
        sub: 'Third-Party Links',
        text: 'PeerWork may contain links to external sites. We are not responsible for the content or practices of any third-party websites linked from the platform.',
      },
    ],
  },
  {
    icon: <RefreshCw size={18} />,
    title: '7. Changes to These Terms',
    content: [
      {
        sub: 'Policy Updates',
        text: 'We may revise these Terms of Service at any time. The "Last Updated" date at the top of this page will always reflect the most recent revision. Continued use of PeerWork after changes constitutes acceptance.',
      },
      {
        sub: 'Notification',
        text: 'For material changes — such as fee introductions or significant policy shifts — we will notify all registered users via their registered email address at least 14 days before the change takes effect.',
      },
    ],
  },
  {
    icon: <Mail size={18} />,
    title: '8. Contact & Disputes',
    content: [
      {
        sub: 'Dispute Resolution',
        text: 'If you have a dispute with another user, we encourage direct resolution first. If unresolvable, contact our support team who will mediate in good faith.',
      },
      {
        sub: 'Legal Contact',
        text: 'For legal notices, terms-related inquiries, or formal complaints, contact us at: legal@peerwork.io — we aim to respond to all formal inquiries within 10 business days.',
      },
    ],
  },
];

const HIGHLIGHTS = [
  { icon: <CheckCircle2 size={14} />, text: 'No spam or selling your data' },
  { icon: <CheckCircle2 size={14} />, text: 'Zero commission during beta' },
  { icon: <CheckCircle2 size={14} />, text: 'Students-only safe environment' },
  { icon: <CheckCircle2 size={14} />, text: '14-day notice before major changes' },
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
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-violet-50/50 dark:hover:bg-violet-900/10 transition-colors duration-200 group"
      >
        <div className="flex items-center gap-3">
          <span className="text-violet-600 dark:text-violet-400 flex-shrink-0">
            {section.icon}
          </span>
          <span className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-100 font-heading">
            {section.title}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`text-slate-400 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-violet-500' : ''}`}
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
              <p className="text-[10px] font-black uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-1">
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

export const TermsOfService = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0D1117] min-h-screen transition-colors duration-300">

      {/* ── Hero Banner ── */}
      <section className="relative pt-28 pb-20 border-b border-slate-900/10 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-[0.04] pointer-events-none" />
        <div className="absolute -top-32 right-0 w-[500px] h-[400px] bg-violet-200/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="container-max relative z-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="max-w-3xl"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 border border-violet-500/30 bg-violet-50 dark:bg-violet-900/20 px-4 py-1.5 mb-6">
              <FileText size={12} className="text-violet-600 dark:text-violet-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-violet-600 dark:text-violet-400">
                Terms of Service
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-6xl font-black font-heading text-slate-900 dark:text-slate-100 tracking-tighter leading-none uppercase mb-6"
            >
              THE RULES WE <br />
              <span className="text-violet-600">ALL AGREE ON.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-slate-500 dark:text-slate-400 text-base font-semibold leading-relaxed max-w-xl">
              By using PeerWork, you agree to these terms. They exist to protect every student — whether you're a client posting a task or a freelancer building your portfolio.
            </motion.p>

            <motion.p variants={fadeUp} className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-6">
              Last updated: May 2025 · Effective immediately
            </motion.p>

            {/* Quick highlight pills */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mt-8">
              {HIGHLIGHTS.map((h, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5"
                >
                  <span className="text-emerald-500">{h.icon}</span>
                  {h.text}
                </span>
              ))}
            </motion.div>
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
            className="mt-16 border border-violet-500/30 bg-violet-50/50 dark:bg-violet-900/10 p-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-violet-600 flex items-center justify-center flex-shrink-0">
                <Scale size={18} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-2">
                  Governing Law
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  These Terms of Service are governed by and construed in accordance with applicable law. Any disputes arising from your use of PeerWork shall be subject to the exclusive jurisdiction of the courts in the operating territory. If any provision of these terms is found to be unenforceable, the remaining provisions shall remain in full effect.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
