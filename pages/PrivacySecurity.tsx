
import React, { useState } from 'react';
import { getMockSessions } from '../services/mockApi';

const PrivacySecurity: React.FC = () => {
  const [sessions] = useState(getMockSessions());
  const [tfaEnabled, setTfaEnabled] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl">
          <i className="fas fa-shield-halved"></i>
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">Privacy & Security</h1>
          <p className="text-slate-400">Control your visibility and secure your cloud account.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <i className="fas fa-key text-blue-500"></i>
            Authentication
          </h3>
          <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white">Two-Factor Auth</span>
              <button 
                onClick={() => setTfaEnabled(!tfaEnabled)}
                className={`w-12 h-6 rounded-full relative transition-colors ${tfaEnabled ? 'bg-green-600' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${tfaEnabled ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">Add an extra layer of security to your account by requiring more than just a password to log in.</p>
          </div>
          <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-white text-sm font-bold transition-all">Change Account Password</button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <i className="fas fa-database text-blue-500"></i>
            Data Management
          </h3>
          <p className="text-sm text-slate-500">You have full control over your data. You can request a copy of your library or permanently delete your account.</p>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-slate-800/30 border border-slate-800 hover:border-blue-500/30 rounded-2xl transition-all">
              <span className="text-sm font-bold text-white">Export All Media Data</span>
              <i className="fas fa-download text-slate-500"></i>
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-red-500/5 border border-red-500/10 hover:border-red-500/30 rounded-2xl transition-all group">
              <span className="text-sm font-bold text-red-500">Delete Account Permanently</span>
              <i className="fas fa-trash-can text-red-500 opacity-50 group-hover:opacity-100"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <i className="fas fa-desktop text-blue-500"></i>
          Active Sessions
        </h3>
        <div className="space-y-4">
          {sessions.map(session => (
            <div key={session.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center text-blue-400">
                  <i className={`fas ${session.device.includes('iPhone') ? 'fa-mobile-screen' : 'fa-laptop'}`}></i>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-white">{session.device}</h5>
                    {session.current && <span className="bg-green-600/20 text-green-500 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">Current</span>}
                  </div>
                  <p className="text-xs text-slate-500">{session.location} • {session.lastActive}</p>
                </div>
              </div>
              <button className="text-slate-500 hover:text-red-400 text-sm font-bold p-2">Revoke</button>
            </div>
          ))}
        </div>
        <button className="mt-6 text-red-500 text-sm font-bold hover:underline">Logout from all other devices</button>
      </div>
    </div>
  );
};

export default PrivacySecurity;
