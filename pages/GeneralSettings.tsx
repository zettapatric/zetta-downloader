
import React, { useState, useEffect } from 'react';
import { AppSettings, User } from '../types';
import { saveAppSettings } from '../services/mockApi';

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
    downloadFormat: 'mp3',
    downloadQuality: '320',
    autoMetadata: true
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (user?.settings) setSettings(user.settings);
  }, [user]);

  const handleToggle = (key: keyof AppSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelect = (key: keyof AppSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const updated = await saveAppSettings(settings);
    if (user) onUpdate({ ...user, settings: updated });
    setIsSaving(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-fade-in pb-20 relative">
      {showToast && (
        <div className="fixed top-24 right-10 bg-green-600 text-white px-6 py-3 rounded-2xl shadow-2xl animate-fade-in z-[100] font-bold">
          Settings saved successfully!
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-white text-2xl">
          <i className="fas fa-sliders"></i>
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">System Preferences</h1>
          <p className="text-slate-400">Configure how Zetta behaves across all your sessions.</p>
        </div>
      </div>

      <div className="space-y-6">
        <section className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-3 border-b border-slate-800 pb-4">
            <i className="fas fa-bell text-blue-500"></i>
            Communication & Alerts
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Email Notifications</p>
                <p className="text-xs text-slate-500">Weekly library summaries and security alerts.</p>
              </div>
              <button 
                onClick={() => handleToggle('notifications')}
                className={`w-12 h-6 rounded-full relative transition-colors ${settings.notifications ? 'bg-blue-600' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.notifications ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Desktop Push Notifications</p>
                <p className="text-xs text-slate-500">Live download progress and completions.</p>
              </div>
              <button 
                onClick={() => handleToggle('inAppNotifications')}
                className={`w-12 h-6 rounded-full relative transition-colors ${settings.inAppNotifications ? 'bg-blue-600' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.inAppNotifications ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-3 border-b border-slate-800 pb-4">
            <i className="fas fa-download text-blue-500"></i>
            Download Quality Defaults
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Preferred Format</label>
              <select 
                value={settings.downloadFormat}
                onChange={(e) => handleSelect('downloadFormat', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none"
              >
                <option value="mp3">Audio (MP3)</option>
                <option value="wav">Lossless (WAV)</option>
                <option value="mp4">Video (MP4)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Preferred Quality</label>
              <select 
                value={settings.downloadQuality}
                onChange={(e) => handleSelect('downloadQuality', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none"
              >
                <option value="128">Standard (128kbps)</option>
                <option value="320">High (320kbps)</option>
                <option value="lossless">Studio Lossless</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="font-bold text-white">Auto-generate Metadata</p>
              <p className="text-xs text-slate-500">Enable Gemini-AI to automatically tag artist and genre information.</p>
            </div>
            <button 
              onClick={() => handleToggle('autoMetadata')}
              className={`w-12 h-6 rounded-full relative transition-colors ${settings.autoMetadata ? 'bg-blue-600' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.autoMetadata ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-3 border-b border-slate-800 pb-4">
            <i className="fas fa-eye text-blue-500"></i>
            Appearance & Locale
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Interface Language</label>
              <select 
                value={settings.language}
                onChange={(e) => handleSelect('language', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Color Theme</label>
              <div className="flex bg-slate-800 rounded-xl p-1">
                <button 
                  onClick={() => handleSelect('theme', 'dark')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${settings.theme === 'dark' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500'}`}
                >
                  Dark
                </button>
                <button 
                  onClick={() => handleSelect('theme', 'light')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${settings.theme === 'light' ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-500'}`}
                >
                  Light
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="flex justify-end gap-4">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center gap-3 active:scale-95"
        >
          {isSaving ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-save"></i>}
          Save All Changes
        </button>
      </div>
    </div>
  );
};

export default GeneralSettings;
