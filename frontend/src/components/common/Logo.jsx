import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export const Logo = ({ size = 36, showText = true, className = '' }) => {
  const { theme } = useTheme();
  const primaryColor = '#4F46E5'; // Indigo-600
  const secondaryColor = theme === 'dark' ? '#F8FAFC' : '#0F172A'; // Slate-50 vs Slate-900

  return (
    <motion.div 
      whileHover="hover"
      initial="initial"
      className={`flex items-center gap-3 select-none ${className}`}
    >
      <motion.svg 
        width={size} 
        height={size} 
        viewBox="0 0 120 120" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        variants={{
          hover: { scale: 1.05 }
        }}
      >
        {/* Left hand path */}
        <motion.path 
          d="M 32 90 C 18 70 22 45 40 45 C 50 45 58 60 68 72" 
          stroke={primaryColor} 
          strokeWidth="11" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          variants={{
            hover: { x: [0, -2, 0] }
          }}
        />
        <circle cx="40" cy="24" r="10" fill={primaryColor} />

        {/* Right hand path */}
        <motion.path 
          d="M 88 90 C 102 70 98 45 80 45 C 70 45 62 60 52 72" 
          stroke={secondaryColor} 
          strokeWidth="11" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          variants={{
            hover: { x: [0, 2, 0] }
          }}
        />
        <circle cx="80" cy="24" r="10" fill={secondaryColor} />

        {/* Handshake fingers overlay */}
        <motion.g 
          transform="translate(60, 72) rotate(-45)"
          variants={{
            hover: { rotate: [-45, -35, -45] }
          }}
        >
          <line x1="-12" y1="-6" x2="-2" y2="-6" stroke={primaryColor} strokeWidth="3.5" strokeLinecap="round" />
          <line x1="-10" y1="-2" x2="0" y2="-2" stroke={primaryColor} strokeWidth="3.5" strokeLinecap="round" />
          <line x1="-8" y1="2" x2="2" y2="2" stroke={primaryColor} strokeWidth="3.5" strokeLinecap="round" />
          <line x1="-6" y1="6" x2="4" y2="6" stroke={primaryColor} strokeWidth="3.5" strokeLinecap="round" />
        </motion.g>
      </motion.svg>

      {showText && (
        <div className="flex flex-col leading-none font-heading font-black tracking-tighter uppercase text-xl md:text-2xl">
          <div>
            <span style={{ color: primaryColor }}>PEER</span>
            <span style={{ color: secondaryColor }}>WORK</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};
