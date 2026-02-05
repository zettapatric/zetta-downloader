
import React from 'react';
import { MediaItem } from '../types';

interface VideoPlayerProps {
  song: MediaItem;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ song, onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-12 animate-fade-in">
      <div className="max-w-6xl w-full aspect-video bg-black rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.2)] border border-white/10 relative">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
        
        <video 
          src={song.url} 
          className="w-full h-full object-contain" 
          controls 
          autoPlay
          poster={song.thumbnail}
        />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
          <p className="text-blue-500 font-black uppercase tracking-[4px] text-[10px] mb-2">Streaming 1080p Node</p>
          <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">{song.title}</h3>
          <p className="text-slate-400 font-bold">{song.artist}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
