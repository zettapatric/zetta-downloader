
import React, { useState } from 'react';
import { analyzeMediaUrl } from '../services/geminiService';
import { searchYouTube, YouTubeResult } from '../services/youtubeService';
import { DownloadTask, MediaItem } from '../types';
import { Icons } from '../constants';

interface DownloaderProps {
  onAddMedia: (item: MediaItem) => void;
}

const Downloader: React.FC<DownloaderProps> = ({ onAddMedia }) => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [preview, setPreview] = useState<any | null>(null);
  const [ytResults, setYtResults] = useState<YouTubeResult[]>([]);
  const [downloadingTasks, setDownloadingTasks] = useState<DownloadTask[]>([]);
  const [activeTab, setActiveTab] = useState<'url' | 'yt'>('url');

  const handleAnalyze = async () => {
    if (!url) return;
    setIsAnalyzing(true);
    const result = await analyzeMediaUrl(url);
    setIsAnalyzing(false);
    if (result && result.isSafe) {
      setPreview(result);
    } else {
      alert("Invalid or unsafe URL provided.");
    }
  };

  const handleYTSearch = async () => {
    if (!url) return;
    setIsAnalyzing(true);
    const results = await searchYouTube(url);
    setYtResults(results);
    setIsAnalyzing(false);
  };

  const startDownload = (data: any) => {
    const newTask: DownloadTask = {
      id: Math.random().toString(36).substr(2, 9),
      url: data.url || 'youtube-link',
      title: data.title,
      status: 'downloading',
      progress: 0
    };

    setDownloadingTasks(prev => [newTask, ...prev]);
    setPreview(null);
    setYtResults([]);
    setUrl('');

    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 20;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
        
        const newItem: MediaItem = {
          id: newTask.id,
          title: data.title,
          artist: data.artist || data.author || 'YouTube Content',
          duration: data.duration || 180,
          url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 
          thumbnail: data.thumbnail || 'https://picsum.photos/seed/download/400/400',
          format: 'mp3',
          size: 1024 * 1024 * 5,
          isFavorite: false,
          downloadDate: new Date().toISOString()
        };
        onAddMedia(newItem);
        
        setDownloadingTasks(prev => 
          prev.map(t => t.id === newTask.id ? { ...t, status: 'completed', progress: 100 } : t)
        );
      } else {
        setDownloadingTasks(prev => 
          prev.map(t => t.id === newTask.id ? { ...t, progress: prog } : t)
        );
      }
    }, 400);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in pb-20">
      <header className="text-center">
        <h1 className="text-5xl font-black text-white italic tracking-tighter mb-4">
          Zetta <span className="text-blue-500">Downloader</span>
        </h1>
        <p className="text-slate-400 text-lg">Extract high-fidelity audio and video from over 1,000 sources instantly.</p>
      </header>

      <div className="flex justify-center mb-8">
        <div className="bg-slate-900/80 p-1.5 rounded-2xl flex border border-slate-800">
          <button 
            onClick={() => { setActiveTab('url'); setPreview(null); setYtResults([]); }}
            className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'url' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
          >
            Direct Link
          </button>
          <button 
            onClick={() => { setActiveTab('yt'); setPreview(null); setYtResults([]); }}
            className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'yt' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
          >
            YouTube Search
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px]"></div>
        <div className="flex gap-4 relative z-10">
          <div className="relative flex-1 group">
            <i className={`fa-solid ${activeTab === 'url' ? 'fa-link' : 'fa-magnifying-glass'} absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors`}></i>
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={activeTab === 'url' ? "Paste TikTok, Instagram, or YouTube URL..." : "Search for any song or artist on YouTube..."}
              className="w-full bg-slate-800 border-2 border-slate-700/50 focus:border-blue-600 rounded-3xl py-5 pl-14 pr-4 text-white placeholder:text-slate-600 outline-none transition-all shadow-inner"
              onKeyDown={(e) => e.key === 'Enter' && (activeTab === 'url' ? handleAnalyze() : handleYTSearch())}
            />
          </div>
          <button 
            onClick={activeTab === 'url' ? handleAnalyze : handleYTSearch}
            disabled={isAnalyzing || !url}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-10 rounded-3xl font-black flex items-center gap-3 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
          >
            {isAnalyzing ? (
              <i className="fa-solid fa-circle-notch animate-spin text-xl"></i>
            ) : (
              <i className="fa-solid fa-bolt text-xl"></i>
            )}
            {activeTab === 'url' ? 'Analyze' : 'Search'}
          </button>
        </div>
      </div>

      {preview && (
        <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 animate-in slide-in-from-top-4 duration-300 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-8">
            <img src={preview.thumbnail} alt="Thumb" className="w-full md:w-56 aspect-square rounded-2xl object-cover shadow-2xl border-4 border-slate-800" />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-black text-white mb-2">{preview.title}</h3>
                <p className="text-xl text-slate-400 font-medium mb-6 italic">{preview.artist}</p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-slate-800 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 border border-slate-700 flex items-center gap-2">
                    <i className="fa-regular fa-clock text-blue-400"></i>
                    {Math.floor(preview.duration / 60)}:{(preview.duration % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="bg-green-600/10 px-4 py-2 rounded-xl text-xs font-black text-green-400 border border-green-600/20 flex items-center gap-2 uppercase tracking-widest">
                    <i className="fa-solid fa-shield-check"></i> Verified Clean
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
                <select className="w-full sm:w-auto bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-1 focus:ring-blue-500">
                  <option>Audio - MP3 (320kbps)</option>
                  <option>Audio - WAV (Lossless)</option>
                  <option>Video - MP4 (1080p)</option>
                </select>
                <button 
                  onClick={() => startDownload(preview)}
                  className="w-full sm:flex-1 bg-green-600 hover:bg-green-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-green-600/30 flex items-center justify-center gap-3 active:scale-95"
                >
                  <i className="fas fa-cloud-arrow-down"></i>
                  Confirm and Start Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {ytResults.length > 0 && (
        <div className="space-y-6">
          <h4 className="text-xl font-black text-white flex items-center gap-3">
             <i className="fa-brands fa-youtube text-red-600 text-2xl"></i>
             YouTube Cloud Search Results
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ytResults.map(item => (
              <div key={item.id} className="bg-slate-900 border border-slate-800 p-4 rounded-[24px] flex gap-4 hover:border-blue-600/50 transition-all group">
                <img src={item.thumbnail} className="w-24 h-24 rounded-xl object-cover shadow-lg" />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-white truncate text-sm">{item.title}</h5>
                    <p className="text-xs text-slate-500 truncate">{item.author}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{item.publishedTime || '4:12'}</span>
                    <button 
                      onClick={() => startDownload(item)}
                      className="bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white px-4 py-1.5 rounded-lg text-xs font-black transition-all"
                    >
                      Extract
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {downloadingTasks.length > 0 && (
        <div className="space-y-4 animate-fade-in pt-10 border-t border-slate-800">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-xl font-black text-white uppercase tracking-widest italic">Active Transfer Node</h4>
            <button 
              onClick={() => setDownloadingTasks([])}
              className="text-slate-500 hover:text-white text-xs font-bold"
            >
              Clear Completed
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {downloadingTasks.map(task => (
              <div key={task.id} className="bg-slate-900/40 border border-slate-800 rounded-[28px] p-6 flex items-center gap-6 group hover:bg-slate-900 transition-all">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${task.status === 'completed' ? 'bg-green-600/10 text-green-500 shadow-inner' : 'bg-blue-600/10 text-blue-500 animate-pulse'}`}>
                  {task.status === 'completed' ? <i className="fa-solid fa-check-circle"></i> : <i className="fa-solid fa-cloud-arrow-down"></i>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-base font-bold text-white truncate">{task.title}</span>
                    <span className="text-xs font-black text-blue-400 tabular-nums">{Math.round(task.progress)}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full transition-all duration-300 ${task.status === 'completed' ? 'bg-green-500' : 'bg-gradient-to-r from-blue-600 to-indigo-500'}`}
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                   {task.status !== 'completed' && <button className="text-slate-600 hover:text-red-500 p-2 transition-colors"><i className="fas fa-times"></i></button>}
                   {task.status === 'completed' && <div className="text-[10px] font-black uppercase tracking-[3px] text-green-500 bg-green-500/10 px-4 py-2 rounded-xl">Synced</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Downloader;
