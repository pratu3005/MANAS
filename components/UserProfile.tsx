
import React, { useState, useEffect } from 'react';

const Meditation: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Wait'>('Wait');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isActive) {
      setTimer(0);
      setPhase('Inhale');
      interval = setInterval(() => {
        setTimer((t) => {
          const nextT = (t + 1) % 16;
          if (nextT < 4) setPhase('Inhale');
          else if (nextT < 8) setPhase('Hold');
          else if (nextT < 12) setPhase('Exhale');
          else setPhase('Hold');
          return nextT;
        });
      }, 1000);
    } else {
      setPhase('Wait');
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center max-w-xl mx-auto overflow-hidden">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Box Breathing</h2>
      <p className="text-slate-500 mb-12">Calm your nervous system in seconds.</p>

      <div className="relative flex items-center justify-center mb-16 h-64">
        {/* Animated Background Rings */}
        <div className={`absolute w-32 h-32 bg-sky-100 rounded-full transition-all duration-1000 ${
          isActive && phase === 'Inhale' ? 'scale-[2] opacity-50' : 
          isActive && phase === 'Exhale' ? 'scale-1 opacity-0' : 'scale-1 opacity-50'
        }`}></div>
        
        {/* Main Breathing Circle */}
        <div className={`z-10 w-32 h-32 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl shadow-sky-100 transition-transform duration-[4000ms] ease-in-out ${
          isActive && phase === 'Inhale' ? 'scale-150' : 
          isActive && phase === 'Exhale' ? 'scale-100' : ''
        }`}>
          {isActive ? phase : <i className="fas fa-wind text-2xl"></i>}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between max-w-xs mx-auto text-xs text-slate-400 font-medium uppercase tracking-widest">
          <span className={phase === 'Inhale' ? 'text-sky-600 font-bold' : ''}>Inhale</span>
          <span className={phase === 'Hold' ? 'text-sky-600 font-bold' : ''}>Hold</span>
          <span className={phase === 'Exhale' ? 'text-sky-600 font-bold' : ''}>Exhale</span>
        </div>

        <button
          onClick={() => setIsActive(!isActive)}
          className={`px-8 py-3 rounded-full font-semibold transition-all ${
            isActive 
              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
              : 'bg-sky-600 text-white hover:bg-sky-700 shadow-lg shadow-sky-100'
          }`}
        >
          {isActive ? 'Stop Practice' : 'Start Session'}
        </button>
      </div>
    </div>
  );
};

export default Meditation;
