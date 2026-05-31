import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { PrivateRoute } from './components/common/PrivateRoute';

import { Home } from './pages/public/Home';
import { BrowseTasks } from './pages/public/BrowseTasks';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Profile } from './pages/dashboard/Profile';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ProfileSetup } from './pages/auth/ProfileSetup';
import { PrivacyPolicy } from './pages/public/PrivacyPolicy';
import { TermsOfService } from './pages/public/TermsOfService';

function App() {
  return (
    <ThemeProvider>
    <Router>
      <AuthProvider>
        <ToastProvider>
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0D1117] transition-colors duration-300">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tasks" element={<BrowseTasks />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/setup" element={<PrivateRoute><ProfileSetup /></PrivateRoute>} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
    </ThemeProvider>
  );
}

export default App;