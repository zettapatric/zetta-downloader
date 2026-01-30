
import React, { useState } from 'react';
import { User } from '../types';
import { updateUserData } from '../services/mockApi';

interface Props {
  user: User | null;
  onUpdate: (user: User) => void;
}

const AccountSettings: React.FC<Props> = ({ user, onUpdate }) => {
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback(null);
    try {
      const updated = await updateUserData({ username, email });
      onUpdate(updated);
      setFeedback({ type: 'success', msg: 'Profile updated successfully!' });
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Failed to update profile.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl">
          <i className="fas fa-user-gear"></i>
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">Account Settings</h1>
          <p className="text-slate-400">Manage your identity and communication preferences.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 shadow-2xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative group">
              <img src={user?.avatar} alt="Avatar" className="w-24 h-24 rounded-3xl object-cover border-4 border-slate-800" />
              <button type="button" className="absolute inset-0 bg-black/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <i className="fas fa-camera text-xl"></i>
              </button>
            </div>
            <div>
              <h4 className="font-bold text-white text-lg">Profile Picture</h4>
              <p className="text-sm text-slate-500 mb-2">JPG, GIF or PNG. Max size of 2MB.</p>
              <button type="button" className="text-blue-500 text-sm font-bold hover:underline">Upload New Picture</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">New Password (Optional)</label>
            <input 
              type="password" 
              placeholder="Leave blank to keep current"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          {feedback && (
            <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-3 ${feedback.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
              <i className={`fas ${feedback.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
              {feedback.msg}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl text-white font-black transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            {isLoading ? <i className="fas fa-circle-notch animate-spin"></i> : 'Save Account Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountSettings;
