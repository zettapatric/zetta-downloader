
import React, { useState } from 'react';
import { MediaItem, User } from '../types';

interface DownloadModalProps {
  song: MediaItem;
  user: User | null;
  onConfirm: (format: 'mp3' | 'mp4', quality: string) => void;
  onClose: () => void;
}

const DownloadModal: React.FC<DownloadModalProps> = ({ song, user, onConfirm, onClose }) => {
  const [selectedAudioQuality, setSelectedAudioQuality] = useState(user?.settings?.preferredAudioQuality || '320');
  const [selectedVideoQuality, setSelectedVideoQuality] = useState(user?.settings?.preferredVideoQuality || '1080');

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-slate-900 border border-blue-500/30 rounded-[40px] p-10 max-w-lg w-full relative z-10 shadow-3xl animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl overflow-hidden border-2 border-blue-500/20 shadow-2xl">
            <img src={song.thumbnail} className="w-full h-full object-cover" alt={song.title} />
          </div>
          <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Download Terminal</h3>
          <p className="text-slate-400 text-sm mt-2 font-medium">Configure extraction for <span className="text-blue-500">{song.title}</span></p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Audio Extraction</p>
              <select 
                value={selectedAudioQuality}
                // Fix: Cast e.target.value to the allowed literal types for audio quality
                onChange={(e) => setSelectedAudioQuality(e.target.value as '128' | '320')}
                className="bg-slate-800 text-[10px] font-bold text-blue-400 rounded-lg px-2 py-1 outline-none border border-slate-700"
              >
                <option value="128">128kbps (Standard)</option>
                <option value="320">320kbps (High Fidelity)</option>
              </select>
            </div>
            <button 
              onClick={() => onConfirm('mp3', `${selectedAudioQuality}kbps`)}
              className="w-full group bg-slate-800/50 hover:bg-blue-600 border border-slate-700 hover:border-blue-400 p-5 rounded-3xl flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600/10 group-hover:bg-white/20 rounded-2xl flex items-center justify-center text-blue-500 group-hover:text-white">
                  <i className="fa-solid fa-music text-xl"></i>
                </div>
                <div className="text-left">
                  <p className="font-black text-white uppercase text-xs tracking-widest">Download MP3</p>
                  <p className="text-[10px] text-slate-500 group-hover:text-blue-100 uppercase font-bold tracking-widest mt-0.5">Estimated Size: {(song.size / (1024 * 1024)).toFixed(1)} MB</p>
                </div>
              </div>
              <i className="fa-solid fa-download text-slate-600 group-hover:text-white transition-all"></i>
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Video Extraction</p>
              <select 
                value={selectedVideoQuality}
                // Fix: Cast e.target.value to the allowed literal types for video quality
                onChange={(e) => setSelectedVideoQuality(e.target.value as '360' | '720' | '1080')}
                className="bg-slate-800 text-[10px] font-bold text-indigo-400 rounded-lg px-2 py-1 outline-none border border-slate-700"
              >
                <option value="360">360p (Mobile)</option>
                <option value="720">720p (HD)</option>
                <option value="1080">1080p (Full HD)</option>
              </select>
            </div>
            <button 
              onClick={() => onConfirm('mp4', `${selectedVideoQuality}p`)}
              className="w-full group bg-slate-800/50 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-400 p-5 rounded-3xl flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600/10 group-hover:bg-white/20 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:text-white">
                  <i className="fa-solid fa-video text-xl"></i>
                </div>
                <div className="text-left">
                  <p className="font-black text-white uppercase text-xs tracking-widest">Download MP4</p>
                  <p className="text-[10px] text-slate-500 group-hover:text-indigo-100 uppercase font-bold tracking-widest mt-0.5">Estimated Size: {(song.size * 2 / (1024 * 1024)).toFixed(1)} MB</p>
                </div>
              </div>
              <i className="fa-solid fa-download text-slate-600 group-hover:text-white transition-all"></i>
            </button>
          </div>
        </div>

        <p className="mt-8 text-[9px] text-slate-600 text-center font-bold uppercase tracking-[3px]">Z Downloader Precision Engine v3.0</p>
      </div>
    </div>
  );
};

export default DownloadModal;
