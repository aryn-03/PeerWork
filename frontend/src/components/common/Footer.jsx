import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  // Hide Footer on authentication and onboarding pages
  if (['/login', '/register', '/setup'].includes(location.pathname)) {
    return null;
  }

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-900/10 dark:border-slate-700 py-12 mt-24 transition-colors duration-300">
      <div className="container-max">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Logo size={28} />
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Link to="/tasks" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Marketplace</Link>
            <Link to="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</Link>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            &copy; {currentYear} PEERWORK. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};
