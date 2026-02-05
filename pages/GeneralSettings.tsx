
import React, { useState, useEffect } from 'react';
import { AppSettings, User } from '../types';
import { saveAppSettings, logAudit } from '../services/mockApi';

interface Props {
  user: User | null;
  onUpdate: (user: User) => void;
}

const GeneralSettings: React.FC<Props> = ({ user, onUpdate }) => {
  const [settings, setSettings] = useState<AppSettings>(user?.settings || {
    notifications: true,
    inAppNotifications: true,
    language: 'English',
    theme: 'dark',
    preferredFormat: 'mp3',
    preferredAudioQuality: '320',
    preferredVideoQuality: '1080',
    autoMetadata: true
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (user?.settings) setSettings(user.settings);
  }, [user]);

  const handleToggle = (key: keyof AppSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] } as any));
  };

  const handleSelect = (key: keyof AppSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value } as any));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const updated = await saveAppSettings(settings);
    if (user) {
      const updatedUser = { ...user, settings: updated };
      onUpdate(updatedUser);
      logAudit(user.id, 'System Preferences Updated');
    }
    setIsSaving(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-fade-in pb-20 relative">
      {showToast && (
        <div className="fixed top-24 right-10 bg-green-600 text-white px-6 py-3 rounded-2xl shadow-2xl animate-fade-in z-[100] font-bold border border-green-500/30">
          <i className="fas fa-check-circle mr-2"></i> Settings Synced Successfully
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-blue-600/10 border border-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500 text-xl">
          <i className="fas fa-sliders"></i>
        </div>
        <div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tight">System <span className="text-blue-500">Preferences</span></h1>
          <p className="text-slate-400 font-medium">Configure your Zetta experience across all sessions.</p>
        </div>
      </div>

      <div className="space-y-6">
        <section className={`border rounded-[32px] p-8 space-y-6 transition-colors ${settings.theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
          <h3 className="text-lg font-black text-white italic uppercase tracking-widest flex items-center gap-3 border-b border-slate-800/50 pb-4">
            <i className="fas fa-bell text-blue-500"></i>
            Communication & Alerts
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Email Sync Notifications</p>
                <p className="text-xs text-slate-500">Receive summaries of library extractions.</p>
              </div>
              <button onClick={() => handleToggle('notifications')} className={`w-12 h-6 rounded-full relative transition-colors ${settings.notifications ? 'bg-blue-600' : 'bg-slate-700'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.notifications ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </section>

        <section className={`border rounded-[32px] p-8 space-y-6 transition-colors ${settings.theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
          <h3 className="text-lg font-black text-white italic uppercase tracking-widest flex items-center gap-3 border-b border-slate-800/50 pb-4">
            <i className="fas fa-download text-blue-500"></i>
            Extraction Defaults
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Preferred Protocol</label>
              <select value={settings.preferredFormat} onChange={(e) => handleSelect('preferredFormat', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500">
                <option value="mp3">Audio (MP3)</option>
                <option value="mp4">Video (MP4)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Audio Quality</label>
              <select value={settings.preferredAudioQuality} onChange={(e) => handleSelect('preferredAudioQuality', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500">
                <option value="128">Standard (128kbps)</option>
                <option value="320">High Def (320kbps)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Video Resolution</label>
              <select value={settings.preferredVideoQuality} onChange={(e) => handleSelect('preferredVideoQuality', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500">
                <option value="360">360p</option>
                <option value="720">720p (HD)</option>
                <option value="1080">1080p (Full HD)</option>
              </select>
            </div>
          </div>
        </section>

        <section className={`border rounded-[32px] p-8 space-y-6 transition-colors ${settings.theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
          <h3 className="text-lg font-black text-white italic uppercase tracking-widest flex items-center gap-3 border-b border-slate-800/50 pb-4">
            <i className="fas fa-palette text-blue-500"></i>
            Luminance Mode
          </h3>
          <div className="flex bg-slate-800 rounded-xl p-1 border border-slate-700">
            <button onClick={() => handleSelect('theme', 'dark')} className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${settings.theme === 'dark' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}>
              Dark
            </button>
            <button onClick={() => handleSelect('theme', 'light')} className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${settings.theme === 'light' ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-500'}`}>
              Light
            </button>
          </div>
        </section>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={isSaving} className="px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50">
          {isSaving ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-cloud-upload"></i>}
          Save Global Config
        </button>
      </div>
    </div>
  );
};

export default GeneralSettings;
