import React from 'react';
import { Moon, Sun, Aperture } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 dark:bg-[#0F172A]/70 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 transition-all duration-300">
      <div className="max-w-[1200px] mx-auto px-6 h-[88px] flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-4 group cursor-default select-none">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-md shadow-violet-500/20 transition-transform duration-300 group-hover:scale-105">
            <Aperture className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none font-sans">
              Prestes Studio
            </h1>
            <span className="text-[11px] font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-0.5">
              Dashboard
            </span>
          </div>
        </div>

        {/* Theme Toggle - Minimalist */}
        <button
          onClick={toggleTheme}
          className="group relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 transition-all duration-200"
          aria-label="Alternar tema"
        >
          {isDark ? (
            <Moon className="h-5 w-5 text-violet-400" />
          ) : (
             <Sun className="h-5 w-5 text-amber-500" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;