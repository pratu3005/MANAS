
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MoodEntry, MoodType, DailyQuote } from '../types';
import { getDailyQuote, generateInsights } from '../services/geminiService';

interface DashboardProps {
  entries: MoodEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ entries }) => {
  const [quote, setQuote] = useState<DailyQuote | null>(null);
  const [insight, setInsight] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Quote
      const cachedQuote = localStorage.getItem('manas_daily_quote');
      const today = new Date().toDateString();
      let currentQuote = null;

      if (cachedQuote) {
        const parsed = JSON.parse(cachedQuote) as DailyQuote;
        if (parsed.date === today) {
          currentQuote = parsed;
        }
      }

      if (!currentQuote) {
        currentQuote = await getDailyQuote();
        localStorage.setItem('manas_daily_quote', JSON.stringify(currentQuote));
      }
      setQuote(currentQuote);

      // Fetch Insights
      const aiInsight = await generateInsights(entries);
      setInsight(aiInsight);
      
      setIsLoading(false);
    };

    fetchData();
  }, [entries]);

  const moodToValue = (mood: MoodType): number => {
    switch (mood) {
      case 'excellent': return 5;
      case 'good': return 4;
      case 'neutral': return 3;
      case 'fair': return 2;
      case 'poor': return 1;
      default: return 0;
    }
  };

  const chartData = entries.slice(-7).map(e => ({
    name: new Date(e.timestamp).toLocaleDateString('en-US', { weekday: 'short' }),
    value: moodToValue(e.mood),
    stress: e.stressLevel
  }));

  const avgStress = entries.length > 0 
    ? (entries.reduce((acc, curr) => acc + curr.stressLevel, 0) / entries.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quote Card */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-center min-h-[200px]">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-slate-100 rounded w-3/4"></div>
              <div className="h-4 bg-slate-100 rounded w-1/2"></div>
            </div>
          ) : (
            <>
              <p className="text-xl md:text-2xl font-serif italic text-slate-800 leading-relaxed mb-4">
                "{quote?.text}"
              </p>
              <p className="text-sm font-bold text-slate-400">— {quote?.author}</p>
            </>
          )}
        </div>

        {/* AI Insight Card */}
        <div className="bg-sky-600 p-8 rounded-[2rem] text-white shadow-lg shadow-sky-100 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <i className="fas fa-sparkles text-sky-200"></i>
            <span className="text-[10px] uppercase tracking-widest font-bold text-sky-100">AI Insights</span>
          </div>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-3 bg-white/20 rounded w-full"></div>
              <div className="h-3 bg-white/20 rounded w-5/6"></div>
            </div>
          ) : (
            <p className="text-sm leading-relaxed opacity-90">{insight}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600">
            <i className="fas fa-calendar-check text-xl"></i>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Logs</p>
            <p className="text-2xl font-bold text-slate-800">{entries.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
            <i className="fas fa-bolt text-xl"></i>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Avg Stress</p>
            <p className="text-2xl font-bold text-slate-800">{avgStress}/5</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
            <i className="fas fa-leaf text-xl"></i>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Streak</p>
            <p className="text-2xl font-bold text-slate-800">7 Days</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold mb-8 text-slate-800">Your Emotional Trends</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} />
              <YAxis hide domain={[1, 5]} />
              <Tooltip 
                contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                itemStyle={{fontWeight: 'bold'}}
              />
              <Line name="Mood" type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={4} dot={{r: 6, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8}} />
              <Line name="Stress" type="monotone" dataKey="stress" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
