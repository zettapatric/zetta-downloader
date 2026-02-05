
import React from 'react';
import { Playlist } from '../types';

interface DeletePlaylistModalProps {
  playlist: Playlist;
  onConfirm: () => void;
  onClose: () => void;
}

const DeletePlaylistModal: React.FC<DeletePlaylistModalProps> = ({ playlist, onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl animate-fade-in">
      <div className="bg-[#121225] border border-red-500/30 rounded-[40px] p-12 max-w-md w-full shadow-[0_0_80px_rgba(239,68,68,0.15)] relative overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-transparent"></div>
        
        <div className="w-20 h-20 bg-red-600/10 text-red-500 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-8 shadow-inner border border-red-500/20 animate-pulse">
          <i className="fa-solid fa-trash-can"></i>
        </div>

        <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">Purge Cluster?</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          Are you sure you want to <span className="text-red-400 font-bold uppercase">permanently delete</span> <span className="text-white font-bold">"{playlist.name}"</span>? 
          <br /><br />
          <span className="text-[10px] font-black uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-lg text-slate-500 italic">
            Note: Your media nodes remain in the global registry.
          </span>
        </p>

        <div className="flex flex-col gap-4">
          <button 
            onClick={onConfirm}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-2xl uppercase tracking-widest text-xs transition-all shadow-xl shadow-red-600/20 active:scale-95 border border-red-400/20"
          >
            DELETE PERMANENTLY
          </button>
          <button 
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 rounded-2xl uppercase tracking-widest text-xs transition-all active:scale-95 border border-slate-700"
          >
            Abort Protocol
          </button>
        </div>

        <p className="mt-8 text-[9px] font-black text-slate-700 uppercase tracking-[5px]">Zetta Security Governance v1.2</p>
      </div>
    </div>
  );
};

export default DeletePlaylistModal;
