
import React from 'react';
import { MediaItem } from '../types';

interface DetailsModalProps {
  song: MediaItem;
  onClose: () => void;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ song, onClose }) => {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={onClose}></div>
      <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-10 max-w-2xl w-full relative z-10 shadow-3xl animate-in slide-in-from-bottom-10">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
          <i className="fa-solid fa-xmark text-2xl"></i>
        </button>

        <div className="flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-56 space-y-4">
            <img src={song.thumbnail} className="w-full aspect-square object-cover rounded-[32px] shadow-2xl border-2 border-slate-800" alt={song.title} />
            <div className="grid grid-cols-2 gap-2">
               <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/30 text-center">
                  <p className="text-[9px] font-black text-slate-500 uppercase">Format</p>
                  <p className="text-sm font-bold text-white uppercase">{song.format}</p>
               </div>
               <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/30 text-center">
                  <p className="text-[9px] font-black text-slate-500 uppercase">Size</p>
                  <p className="text-sm font-bold text-white uppercase">{(song.size / (1024 * 1024)).toFixed(1)}MB</p>
               </div>
            </div>
          </div>
          
          <div className="flex-1 space-y-6">
            <div>
              <span className="bg-blue-600/10 text-blue-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-3 inline-block">Song Node Details</span>
              <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-tight">{song.title}</h3>
              <p className="text-xl text-slate-400 font-bold mt-1">{song.artist}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/20">
                 <i className="fa-solid fa-clock text-blue-500"></i>
                 <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Duration</p>
                   <p className="text-sm font-bold text-slate-200">{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</p>
                 </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/20">
                 <i className="fa-solid fa-globe text-blue-500"></i>
                 <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Region / Origin</p>
                   <p className="text-sm font-bold text-slate-200">{song.region || 'Global Cluster'}</p>
                 </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Metadata Extraction</p>
              <p className="text-slate-400 text-sm leading-relaxed italic bg-slate-950/30 p-5 rounded-3xl border border-slate-800/50">
                {song.details || "This node represents a high-fidelity semantic extraction from the Rwandan Music Cluster. All metadata is verified clean and optimized for Z Downloader's neural audio engine."}
              </p>
            </div>
            
            <div className="flex gap-4">
               <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-blue-600/20">
                 Add to Playlist
               </button>
               <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest transition-all active:scale-95">
                 Share Hub
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
