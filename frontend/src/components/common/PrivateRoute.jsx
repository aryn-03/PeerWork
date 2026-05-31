import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * PrivateRoute — wraps protected pages.
 * - While the session validation is in-flight (authLoading) render nothing (or a spinner).
 * - Once resolved: redirect to /login if not authenticated, otherwise render children.
 */
export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useAuth();

  // Wait for AuthContext to finish validating the session before making a decision.
  // Without this guard, after a refresh the context starts with isAuthenticated=false
  // and would redirect even valid sessions before /auth/me responds.
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0D1117]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Verifying session…
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
