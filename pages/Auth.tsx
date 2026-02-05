
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
      const user = await mockRegister(email, password, name);
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
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="mb-10 text-center relative z-10">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-2xl shadow-blue-500/40">
           <i className="fa-solid fa-bolt"></i>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight uppercase tracking-[4px]">{APP_NAME}</h1>
        <p className="text-slate-500 mt-2 font-black uppercase tracking-[3px] text-[10px]">Secure Media Infrastructure</p>
      </div>

      <div className="w-full max-w-md glass p-10 rounded-[40px] shadow-3xl relative z-10">
        {view !== 'forgot' && (
          <div className="flex mb-8 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/50">
            <button 
              onClick={() => { setView('login'); setError(''); }}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${view === 'login' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Uplink
            </button>
            <button 
              onClick={() => { setView('register'); setError(''); }}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${view === 'register' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Registry
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-fade-in">
             <i className="fa-solid fa-circle-exclamation text-lg"></i>
             {error}
          </div>
        )}

        <form onSubmit={view === 'login' ? handleLogin : view === 'register' ? handleRegister : handleForgot} className="space-y-6">
          {view === 'register' && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity Tag</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Neo Matrix"
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-6 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-700"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Protocol Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@zetta.com"
              className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-6 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-700"
            />
          </div>

          {view !== 'forgot' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Security Key</label>
                 {view === 'login' && (
                   <button type="button" onClick={() => setView('forgot')} className="text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase">
                     Recovery?
                   </button>
                 )}
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-6 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-700"
              />
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl text-white font-black text-xs uppercase tracking-[3px] transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            {isLoading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className={`fa-solid ${view === 'forgot' ? 'fa-paper-plane' : 'fa-right-to-bracket'}`}></i>}
            {view === 'login' ? 'Execute Uplink' : view === 'register' ? 'Register Entity' : 'Send Pulse'}
          </button>
        </form>

        {view === 'forgot' && (
          <button onClick={() => setView('login')} className="w-full mt-6 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
            <i className="fas fa-arrow-left mr-2"></i> Return to Terminal
          </button>
        )}
      </div>
    </div>
  );
};

export default Auth;
