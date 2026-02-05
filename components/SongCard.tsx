
import React, { useState, useRef, useEffect } from 'react';
import { MediaItem } from '../types';
import { Icons } from '../constants';
import AddToPlaylistModal from './AddToPlaylistModal';

interface SongCardProps {
  song: MediaItem;
  onPlay: (song: MediaItem) => void;
  onDownload: (song: MediaItem) => void;
  onViewCover: (url: string) => void;
  onViewGallery: (gallery: string[]) => void;
  onViewDetails: (song: MediaItem) => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, onPlay, onDownload, onViewCover, onViewGallery, onViewDetails }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showAddPlaylist, setShowAddPlaylist] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <div className="bg-slate-900/50 border border-slate-800/60 rounded-[32px] p-5 group hover:bg-slate-800/40 hover:border-blue-500/40 transition-all shadow-xl relative animate-fade-in flex flex-col h-full">
        <div 
          className="relative aspect-square mb-5 overflow-hidden rounded-2xl cursor-pointer shadow-2xl" 
          onClick={() => onPlay(song)}
        >
          <img 
            src={song.thumbnail} 
            alt={song.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-3xl scale-90 group-hover:scale-100 transition-all">
               <i className="fa-solid fa-play text-xl ml-1"></i>
             </div>
          </div>
          <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-[9px] font-black uppercase tracking-widest text-white">
            <i className={`fa-solid ${song.format === 'mp4' ? 'fa-video' : 'fa-music'} mr-1.5 text-blue-400`}></i> Node
          </div>
        </div>

        <div className="flex justify-between items-start gap-3 flex-1">
          <div className="min-w-0 flex-1">
            <h4 className="text-white font-bold text-base truncate group-hover:text-blue-400 transition-colors tracking-tight">{song.title}</h4>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest truncate mt-0.5">{song.artist}</p>
          </div>
          
          <div className="relative flex items-center gap-1" ref={menuRef}>
            <button 
              onClick={() => onDownload(song)}
              className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all active:scale-90"
              title="Download Node"
            >
              <i className="fa-solid fa-cloud-arrow-down"></i>
            </button>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-90"
            >
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-800 rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2.5 z-[70] animate-in fade-in slide-in-from-top-2">
                <button onClick={() => { onPlay(song); setShowMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-300 hover:bg-blue-600 hover:text-white rounded-xl transition-all">
                  <i className="fa-solid fa-circle-play text-blue-500 group-hover:text-white"></i>
                  Play / Stream
                </button>
                <button onClick={() => { onDownload(song); setShowMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-300 hover:bg-blue-600 hover:text-white rounded-xl transition-all">
                  <i className="fa-solid fa-cloud-arrow-down text-blue-500 group-hover:text-white"></i>
                  Download Now
                </button>
                <button onClick={() => { setShowAddPlaylist(true); setShowMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-300 hover:bg-blue-600 hover:text-white rounded-xl transition-all">
                  <i className="fa-solid fa-list-ul text-blue-500 group-hover:text-white"></i>
                  Add to Playlist
                </button>
                <button onClick={() => { onViewDetails(song); setShowMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-300 hover:bg-blue-600 hover:text-white rounded-xl transition-all">
                  <i className="fa-solid fa-circle-info text-blue-500 group-hover:text-white"></i>
                  View Node Metadata
                </button>
                <button onClick={() => { onViewCover(song.thumbnail); setShowMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-300 hover:bg-blue-600 hover:text-white rounded-xl transition-all">
                  <i className="fa-solid fa-image text-blue-500 group-hover:text-white"></i>
                  HD Cover Image
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <div className={`w-1.5 h-1.5 rounded-full ${song.format === 'mp4' ? 'bg-indigo-500 shadow-[0_0_5px_#6366f1]' : 'bg-blue-500 shadow-[0_0_5px_#3b82f6]'}`}></div>
             <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{song.format === 'mp4' ? 'Video' : 'Audio'}</span>
           </div>
           <span className="text-[9px] font-bold text-slate-700">{(song.size / (1024 * 1024)).toFixed(1)}MB</span>
        </div>
      </div>

      {showAddPlaylist && <AddToPlaylistModal song={song} onClose={() => setShowAddPlaylist(false)} />}
    </>
  );
};

export default SongCard;
