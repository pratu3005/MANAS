
import React, { useState } from 'react';
import { MoodType, MoodEntry } from '../types';
import { MOOD_CONFIG } from '../constants';

interface MoodTrackerProps {
  onAddEntry: (entry: MoodEntry) => void;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ onAddEntry }) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [stressLevel, setStressLevel] = useState(3);
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) return;

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      mood: selectedMood,
      stressLevel,
      note,
    };

    onAddEntry(newEntry);
    setSelectedMood(null);
    setStressLevel(3);
    setNote('');
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Mann ki Baat</h2>
        <p className="text-slate-500">Checking in with yourself is an act of courage.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div>
          <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">
            How is your mood right now?
          </label>
          <div className="grid grid-cols-5 gap-3">
            {(Object.keys(MOOD_CONFIG) as MoodType[]).map((mood) => (
              <button
                key={mood}
                type="button"
                onClick={() => setSelectedMood(mood)}
                className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-300 ${
                  selectedMood === mood 
                    ? `${MOOD_CONFIG[mood].bg} ring-2 ring-sky-500 ring-offset-4 scale-105` 
                    : 'hover:bg-slate-50 grayscale hover:grayscale-0'
                }`}
              >
                <span className="text-4xl mb-2">{MOOD_CONFIG[mood].emoji}</span>
                <span className={`text-[10px] font-bold uppercase ${selectedMood === mood ? MOOD_CONFIG[mood].color : 'text-slate-400'}`}>
                  {MOOD_CONFIG[mood].label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl">
          <label className="block text-sm font-bold text-slate-500 mb-4">
            Stress Level (Tanaav): <span className="text-sky-600 ml-2">{stressLevel}/5</span>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={stressLevel}
            onChange={(e) => setStressLevel(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
          />
          <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">
            <span>Calm</span>
            <span>Balanced</span>
            <span>Overwhelmed</span>
          </div>
        </div>

        <div>
          <label htmlFor="note" className="block text-sm font-bold text-slate-500 mb-2">
            Journaling (Swa-Chintan)
          </label>
          <textarea
            id="note"
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-sky-500 text-slate-800 transition-all outline-none resize-none"
            placeholder="Pour your heart onto the page..."
          />
        </div>

        <button
          type="submit"
          disabled={!selectedMood}
          className={`w-full py-5 rounded-2xl font-bold text-lg transition-all transform active:scale-[0.98] ${
            selectedMood 
              ? 'bg-sky-600 text-white shadow-xl shadow-sky-100 hover:bg-sky-700' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          Save Log
        </button>
      </form>
    </div>
  );
};

export default MoodTracker;
