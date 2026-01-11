
import React, { useState } from 'react';
import { User } from '../types';
import Logo from './Logo';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const usersStr = localStorage.getItem('manas_users') || '[]';
    const users: User[] = JSON.parse(usersStr);

    if (isLogin) {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        localStorage.setItem('manas_current_user', JSON.stringify(userWithoutPassword));
        onLogin(userWithoutPassword as User);
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } else {
      if (users.some(u => u.email === email)) {
        setError('This email is already registered.');
        return;
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        password,
        preferences: { theme: 'light' }
      };
      
      users.push(newUser);
      localStorage.setItem('manas_users', JSON.stringify(users));
      
      const { password: _, ...userWithoutPassword } = newUser;
      localStorage.setItem('manas_current_user', JSON.stringify(userWithoutPassword));
      onLogin(userWithoutPassword as User);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden transition-colors duration-300">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-sky-200/30 dark:bg-sky-900/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-200/30 dark:bg-emerald-900/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-sky-100 dark:shadow-none border border-white dark:border-slate-800 relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-8">
          <Logo className="w-20 h-20 mx-auto mb-6 shadow-xl" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Manas</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            {isLogin ? 'Welcome back to your sanctuary.' : 'Begin your journey to mindfulness.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-800 animate-in slide-in-from-top-2">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl focus:ring-2 focus:ring-sky-500 transition-all outline-none text-slate-800 dark:text-white"
                placeholder="How should we call you?"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl focus:ring-2 focus:ring-sky-500 transition-all outline-none text-slate-800 dark:text-white"
              placeholder="yourname@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl focus:ring-2 focus:ring-sky-500 transition-all outline-none text-slate-800 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-sky-600 text-white rounded-2xl font-bold shadow-lg shadow-sky-100 dark:shadow-none hover:shadow-sky-200 hover:bg-sky-700 transition-all transform active:scale-[0.98]"
          >
            {isLogin ? 'Step Inside' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          {isLogin ? "Don't have an account yet?" : "Already have an account?"}{' '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-sky-600 dark:text-sky-400 font-bold hover:underline"
          >
            {isLogin ? 'Join Manas' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
