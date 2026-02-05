
import React from 'react';
import { MediaItem } from '../types';

interface PlaybackChoiceModalProps {
  song: MediaItem;
  onChoose: (mode: 'audio' | 'video') => void;
  onClose: () => void;
}

const PlaybackChoiceModal: React.FC<PlaybackChoiceModalProps> = ({ song, onChoose, onClose }) => {
  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-2xl animate-fade-in">
      <div className="bg-slate-900 border border-white/10 rounded-[50px] p-12 max-w-2xl w-full shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
        >
          <i className="fa-solid fa-xmark text-2xl"></i>
        </button>

        <div className="text-center space-y-6 mb-12">
          <img src={song.thumbnail} className="w-32 h-32 mx-auto rounded-3xl object-cover shadow-2xl border-2 border-white/5" alt={song.title} />
          <div>
            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">{song.title}</h2>
            <p className="text-slate-500 font-bold uppercase tracking-[3px] text-xs mt-2">{song.artist}</p>
          </div>
          <p className="text-slate-400 max-w-sm mx-auto font-medium">Select your preferred stream modality for this extraction node.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button 
            onClick={() => onChoose('audio')}
            className="group bg-blue-600 hover:bg-blue-500 p-8 rounded-[32px] transition-all active:scale-95 shadow-xl shadow-blue-600/20 text-left relative overflow-hidden"
          >
            <i className="fa-solid fa-music text-6xl absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform"></i>
            <span className="block text-white font-black uppercase tracking-[4px] text-[10px] mb-2">Neural Link</span>
            <span className="block text-white text-2xl font-black italic">Play Audio</span>
            <span className="block text-blue-100 text-[10px] font-bold mt-2">Hi-Fi 320kbps Stream</span>
          </button>

          <button 
            onClick={() => onChoose('video')}
            className="group bg-white/5 hover:bg-white/10 border border-white/10 p-8 rounded-[32px] transition-all active:scale-95 text-left relative overflow-hidden"
          >
            <i className="fa-solid fa-video text-6xl absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform"></i>
            <span className="block text-indigo-500 font-black uppercase tracking-[4px] text-[10px] mb-2">Visual Uplink</span>
            <span className="block text-white text-2xl font-black italic">Play Video</span>
            <span className="block text-slate-500 text-[10px] font-bold mt-2">Full HD 1080p Stream</span>
          </button>
        </div>

        <p className="text-center mt-10 text-[9px] font-black text-slate-700 uppercase tracking-[5px]">Zetta Media Orchestrator v3.4</p>
      </div>
    </div>
  );
};

export default PlaybackChoiceModal;
