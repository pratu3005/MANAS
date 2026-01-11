
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`${className} bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center overflow-hidden shadow-md`}>
      <svg viewBox="0 0 100 100" className="w-8 h-8 fill-slate-800 dark:fill-slate-200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="30" r="10" />
        <path d="M50 45c-8 0-15 4-15 12v5c0 2 2 4 4 4h22c2 0 4-2 4-4v-5c0-8-7-12-15-12z" />
        <path d="M35 70c-5 0-10 2-10 6s5 6 10 6c3 0 7-1 10-3l5 3c3 2 7 3 10 3 5 0 10-2 10-6s-5-6-10-6c-3 0-7 1-10 3l-5-3c-3-2-7-3-10-3z" />
      </svg>
    </div>
  );
};

export default Logo;
