
import React, { useState } from 'react';
import { mockLogin, mockRegister } from '../services/mockApi';
import { APP_NAME } from '../constants';

interface AuthProps {
  onLoginSuccess: (user: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const user = await mockLogin(email, password);
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const user = await mockRegister(email, password);
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setSuccess(`Reset link sent to ${email}`);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="mb-10 text-center relative z-10">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-2xl shadow-blue-500/40">
           <i className="fa-solid fa-bolt"></i>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight uppercase">{APP_NAME}</h1>
        <p className="text-slate-500 mt-2 font-medium">Professional SaaS Media Management</p>
      </div>

      <div className="w-full max-w-md glass p-8 md:p-10 rounded-[32px] shadow-2xl relative z-10">
        {view !== 'forgot' && (
          <div className="flex mb-8 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/50">
            <button 
              onClick={() => { setView('login'); setError(''); }}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${view === 'login' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setView('register'); setError(''); }}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${view === 'register' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Sign Up
            </button>
          </div>
        )}

        {view === 'forgot' && (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
            <p className="text-slate-500 text-sm">Enter your email to receive a recovery link.</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold flex items-center gap-3 animate-fade-in">
             <i className="fa-solid fa-circle-exclamation text-lg"></i>
             {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-xs font-bold flex items-center gap-3 animate-fade-in">
             <i className="fa-solid fa-circle-check text-lg"></i>
             {success}
          </div>
        )}

        <form onSubmit={view === 'login' ? handleLogin : view === 'register' ? handleRegister : handleForgot} className="space-y-6">
          {view === 'register' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <i className="fa-solid fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              />
            </div>
          </div>

          {view !== 'forgot' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                 {view === 'login' && (
                   <button type="button" onClick={() => setView('forgot')} className="text-xs font-bold text-blue-500 hover:text-blue-400">
                     Forgot?
                   </button>
                 )}
              </div>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                />
              </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl text-white font-black text-lg transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            {isLoading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className={`fa-solid ${view === 'forgot' ? 'fa-paper-plane' : 'fa-right-to-bracket'}`}></i>}
            {view === 'login' ? 'Sign In' : view === 'register' ? 'Create Account' : 'Send Recovery Link'}
          </button>
        </form>

        {view === 'forgot' && (
          <button 
            onClick={() => { setView('login'); setSuccess(''); }}
            className="w-full mt-6 text-slate-400 font-bold hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-arrow-left"></i> Back to Login
          </button>
        )}

        <div className="mt-10 flex items-center gap-4 text-slate-700">
           <div className="h-px bg-slate-800 flex-1"></div>
           <span className="text-[10px] font-black uppercase tracking-[3px] text-slate-500">Trusted Access</span>
           <div className="h-px bg-slate-800 flex-1"></div>
        </div>

        <p className="mt-8 text-center text-[10px] text-slate-500 leading-relaxed px-6 font-medium uppercase tracking-widest">
          Secure, encrypted, and HIPAA compliant infrastructure.
        </p>
      </div>
    </div>
  );
};

export default Auth;
