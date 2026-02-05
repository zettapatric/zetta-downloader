
import React, { useState, useRef } from 'react';
import { User } from '../types';
import { updateUserData, updateUserAvatar } from '../services/mockApi';

interface Props {
  user: User | null;
  onUpdate: (user: User) => void;
}

const AccountSettings: React.FC<Props> = ({ user, onUpdate }) => {
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback(null);
    try {
      const updated = await updateUserData({ username, email });
      onUpdate(updated);
      setFeedback({ type: 'success', msg: 'Profile nodes updated successfully.' });
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Uplink failed. Try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Extraction failed: Image too large. Max size is 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (user) {
        updateUserAvatar(user.id, base64String);
        // Instant UI feedback by calling onUpdate with a shallow copy
        onUpdate({ ...user, avatar: base64String });
        setFeedback({ type: 'success', msg: 'Identity visual updated successfully.' });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in pb-20">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 bg-blue-600/10 border border-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500 text-2xl">
          <i className="fas fa-user-gear"></i>
        </div>
        <div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tight">Identity <span className="text-blue-500">Settings</span></h1>
          <p className="text-slate-400 font-medium">Manage your Zetta account and cloud storage.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-10 shadow-3xl">
        <form onSubmit={handleSave} className="space-y-8">
          <div className="flex items-center gap-8 mb-4">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <img src={user?.avatar} alt="Avatar" className="w-32 h-32 rounded-[32px] object-cover border-4 border-slate-800 shadow-2xl group-hover:border-blue-500 transition-all" />
              <div className="absolute inset-0 bg-black/50 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <i className="fas fa-camera text-2xl"></i>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/png, image/jpeg, image/webp"
                onChange={handleAvatarUpload} 
              />
            </div>
            <div>
              <h4 className="font-black text-white text-xl italic uppercase tracking-tight">Identity Visual</h4>
              <p className="text-sm text-slate-500 mb-4 font-medium italic">JPG, PNG or WEBP. Max 2MB.</p>
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-xl transition-all"
              >
                Upload Photo from Disk
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity Tag</label>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Protocol Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {feedback && (
            <div className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-fade-in ${feedback.type === 'success' ? 'bg-green-600/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
              <i className={`fas ${feedback.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'} text-lg`}></i>
              {feedback.msg}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl text-white font-black uppercase text-sm tracking-widest transition-all shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fa-solid fa-cloud-arrow-up"></i>}
            Sync Account Protocol
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountSettings;
