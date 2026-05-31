import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Logo } from './Logo';

export const Navbar = () => {
  const { isAuthenticated, user, logout, activeRole, toggleRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide Navbar on authentication and onboarding pages to prevent double headers
  if (['/login', '/register', '/setup'].includes(location.pathname)) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { path: '/tasks', label: 'Marketplace' },
    ...(isAuthenticated ? [{ path: '/dashboard', label: 'Dashboard' }] : []),
  ];

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-900/10 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-300">
      <div className="container-max">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link
            to="/"
            className="active:scale-[0.98] transition-all"
            onClick={() => { if (location.pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <Logo size={32} />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative py-1 text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-800 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                    } group`}
                  >
                    {link.label}
                    <span className={`absolute bottom-0 left-0 h-[2px] bg-indigo-600 dark:bg-indigo-400 transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-700 pl-6">
              {/* Theme Toggle */}
              <button
                id="theme-toggle"
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="p-2 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400 transition-all duration-300"
              >
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              </button>

              {isAuthenticated ? (
                <>
                  {/* Role Switcher if user.role is 'both' */}
                  {user?.role === 'both' && (
                    <button
                      onClick={toggleRole}
                      className="px-3 py-1.5 border border-indigo-200 dark:border-indigo-750 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition-all duration-300 font-bold text-[10px] uppercase tracking-wider"
                      title={`Switch to ${activeRole === 'freelancer' ? 'Client' : 'Freelancer'} Mode`}
                    >
                      Act as {activeRole === 'freelancer' ? 'Client' : 'Freelancer'}
                    </button>
                  )}

                  {/* User Link */}
                  <Link
                    to="/profile"
                    className={`flex items-center gap-2 px-3 py-1.5 border transition-all duration-300 font-bold text-[10px] uppercase tracking-wider ${
                      location.pathname === '/profile'
                        ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30 dark:border-indigo-400 dark:text-indigo-400 dark:bg-indigo-900/20'
                        : 'border-slate-200 dark:border-slate-600 hover:border-slate-900 dark:hover:border-slate-300 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <User size={12} />
                    <span>{user?.name?.split(' ')[0]}</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="p-2 border border-transparent hover:border-red-200 dark:hover:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-all"
                    title="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-5 py-2 bg-slate-900 dark:bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Right: theme + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-all"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              className="p-2 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 active:scale-95 transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-4 transition-colors">
          <div className="container-max flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 font-bold text-xs uppercase tracking-wider border-l-2 ${
                    isActive
                      ? 'border-indigo-600 bg-indigo-50/10 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                      : 'border-transparent text-slate-800 dark:text-slate-300'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {isAuthenticated ? (
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                {user?.role === 'both' && (
                  <button
                    onClick={() => { toggleRole(); setMobileMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 font-bold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border-l-2 border-indigo-500"
                  >
                    Act as {activeRole === 'freelancer' ? 'Client' : 'Freelancer'}
                  </button>
                )}

                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 font-bold text-xs uppercase tracking-wider flex items-center gap-2 text-slate-800 dark:text-slate-200"
                >
                  <User size={14} />
                  Profile ({user?.name})
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 font-bold text-xs uppercase tracking-wider text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                  className="w-full text-center py-2.5 border border-slate-200 dark:border-slate-600 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Login
                </button>
                <button
                  onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}
                  className="w-full text-center py-2.5 bg-slate-900 dark:bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
