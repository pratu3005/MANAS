
import React, { useState, useEffect } from 'react';
import { MoodEntry, User } from './types';
import { ARTICLES, MOOD_CONFIG } from './constants';
import Dashboard from './components/Dashboard';
import MoodTracker from './components/MoodTracker';
import ChatBot from './components/ChatBot';
import Meditation from './components/Meditation';
import ResourceDirectory from './components/ResourceDirectory';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';
import Logo from './components/Logo';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'mood' | 'history' | 'chat' | 'explore' | 'meditate' | 'resources' | 'profile'>('home');
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const currentUserStr = localStorage.getItem('manas_current_user');
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);
      setUser(currentUser);
      
      // Apply theme preference
      if (currentUser.preferences?.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    setIsCheckingAuth(false);

    const saved = localStorage.getItem('manas_moods');
    if (saved) {
      setMoodEntries(JSON.parse(saved));
    } else {
      const now = Date.now();
      const seed: MoodEntry[] = [
        { id: '1', timestamp: now - 86400000 * 4, mood: 'neutral', stressLevel: 3, note: 'Feeling a bit tired today.' },
        { id: '2', timestamp: now - 86400000 * 3, mood: 'good', stressLevel: 2, note: 'Productive day at work.' },
        { id: '3', timestamp: now - 86400000 * 2, mood: 'excellent', stressLevel: 1, note: 'Spent time with friends!' },
        { id: '4', timestamp: now - 86400000 * 1, mood: 'fair', stressLevel: 4, note: 'A bit stressed out.' },
      ];
      setMoodEntries(seed);
      localStorage.setItem('manas_moods', JSON.stringify(seed));
    }
  }, []);

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('manas_current_user', JSON.stringify(updatedUser));
    
    // Update in users list
    const usersStr = localStorage.getItem('manas_users') || '[]';
    const users: User[] = JSON.parse(usersStr);
    const updatedUsers = users.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u);
    localStorage.setItem('manas_users', JSON.stringify(updatedUsers));

    // Apply theme
    if (updatedUser.preferences?.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleAddMood = (entry: MoodEntry) => {
    const updated = [...moodEntries, entry];
    setMoodEntries(updated);
    localStorage.setItem('manas_moods', JSON.stringify(updated));
    setActiveTab('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('manas_current_user');
    setUser(null);
    setActiveTab('home');
    document.documentElement.classList.remove('dark');
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={(u) => {
      setUser(u);
      if (u.preferences?.theme === 'dark') document.documentElement.classList.add('dark');
    }} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col pb-24 md:pb-0 md:pt-24 transition-colors duration-300">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 z-50 px-8 py-5 hidden md:flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
          <Logo className="w-10 h-10" />
          <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Manas</span>
        </div>
        
        <div className="flex items-center gap-10">
          {[
            { id: 'home', label: 'Home', icon: 'fa-home' },
            { id: 'mood', label: 'Log Mood', icon: 'fa-plus' },
            { id: 'history', label: 'History', icon: 'fa-list-ul' },
            { id: 'chat', label: 'AI Buddy', icon: 'fa-robot' },
            { id: 'meditate', label: 'Breathe', icon: 'fa-wind' },
            { id: 'resources', label: 'Resources', icon: 'fa-shield-heart' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 font-bold text-sm tracking-wide transition-all ${
                activeTab === tab.id ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <i className={`fas ${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 p-1 pr-4 rounded-2xl transition-all ${
              activeTab === 'profile' ? 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-900/40 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 font-black">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-left hidden xl:block">
              <p className="text-xs font-bold leading-none mb-1">My Profile</p>
              <p className="text-[10px] opacity-70 leading-none truncate max-w-[80px]">{user.name}</p>
            </div>
          </button>
          <button onClick={handleLogout} className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors">
            <i className="fas fa-sign-out-alt mr-1"></i> Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome, {user.name.split(' ')[0]}</h1>
                <p className="text-slate-400 dark:text-slate-500 font-medium mt-1">Take a deep breath. You're in a safe space.</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setActiveTab('mood')}
                  className="px-6 py-4 bg-slate-900 dark:bg-sky-600 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-sky-700 transition-all shadow-xl shadow-slate-200 dark:shadow-none"
                >
                  Log New Mood
                </button>
              </div>
            </header>
            <Dashboard entries={moodEntries} />
          </div>
        )}

        {activeTab === 'mood' && <MoodTracker onAddEntry={handleAddMood} />}

        {activeTab === 'history' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <header>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Your Journey History</h2>
              <p className="text-slate-500 dark:text-slate-400">A timeline of your emotional well-being.</p>
            </header>
            <div className="flex flex-col gap-4">
              {moodEntries.length > 0 ? [...moodEntries].reverse().map(entry => (
                <div key={entry.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center gap-6 shadow-sm hover:shadow-md transition-all">
                  <div className="text-4xl w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                    {MOOD_CONFIG[entry.mood].emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className={`font-bold uppercase text-xs tracking-widest ${MOOD_CONFIG[entry.mood].color}`}>
                        {MOOD_CONFIG[entry.mood].label}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase">
                        {new Date(entry.timestamp).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{entry.note || "No notes captured for this entry."}</p>
                    <div className="flex gap-4 mt-4">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1">
                        <i className="fas fa-bolt text-orange-400"></i> Stress: {entry.stressLevel}/5
                      </span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
                  <i className="fas fa-history text-slate-200 dark:text-slate-800 text-6xl mb-4"></i>
                  <p className="text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest text-sm">No history yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <ChatBot />
          </div>
        )}

        {activeTab === 'meditate' && <Meditation />}
        
        {activeTab === 'resources' && (
          <div className="space-y-10">
            <header>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Support Resources</h2>
              <p className="text-slate-500 dark:text-slate-400">Trusted organizations and crisis lines available to help.</p>
            </header>
            <ResourceDirectory />
          </div>
        )}

        {activeTab === 'profile' && <UserProfile user={user} onUpdate={handleUpdateUser} />}

        {activeTab === 'explore' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ARTICLES.map(article => (
              <div key={article.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 group hover:shadow-2xl transition-all duration-700">
                <div className="h-56 overflow-hidden relative">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <span className="absolute bottom-6 left-6 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-lg">
                    {article.category}
                  </span>
                </div>
                <div className="p-8">
                  <h3 className="font-bold text-2xl text-slate-900 dark:text-white mb-4 leading-tight">{article.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed mb-6">{article.summary}</p>
                  <button className="text-sky-600 dark:text-sky-400 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                    Read Article <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navbar for Mobile */}
      <div className="fixed bottom-6 left-6 right-6 bg-slate-900/90 dark:bg-slate-800/95 backdrop-blur-2xl rounded-[2.5rem] p-3 flex justify-around items-center md:hidden z-50 shadow-2xl">
        {[
          { id: 'home', icon: 'fa-home' },
          { id: 'mood', icon: 'fa-plus' },
          { id: 'history', icon: 'fa-list-ul' },
          { id: 'chat', icon: 'fa-robot' },
          { id: 'meditate', icon: 'fa-wind' },
          { id: 'profile', icon: 'fa-user' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all ${
              activeTab === tab.id ? 'bg-sky-500 text-white' : 'text-slate-500'
            }`}
          >
            <i className={`fas ${tab.icon} text-lg`}></i>
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
