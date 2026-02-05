
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MediaItem } from '../types';
import { Icons } from '../constants';
import { triggerDirectDownload } from '../services/mockApi';

interface MusicPlayerProps {
  currentTrack: MediaItem | null;
  queue: MediaItem[];
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ currentTrack, queue, onNext, onPrev, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.url;
      audioRef.current.play().catch(e => console.warn("Autoplay blocked", e));
      setIsPlaying(true);
    }
  }, [currentTrack]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const handleDirectDownload = () => {
    if (currentTrack) {
      triggerDirectDownload(currentTrack);
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#070718]/95 backdrop-blur-3xl border-t border-slate-800/40 h-28 z-[150] px-8 flex items-center justify-between shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onNext}
      />

      {/* Track Info */}
      <div className="flex items-center gap-5 w-1/4 min-w-[200px]">
        <img src={currentTrack.thumbnail} alt={currentTrack.title} className="w-16 h-16 rounded-xl object-cover shadow-2xl border border-white/5" />
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-black truncate text-white uppercase italic tracking-tight">{currentTrack.title}</h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate">{currentTrack.artist}</p>
        </div>
        <button onClick={handleDirectDownload} className="text-slate-600 hover:text-blue-500 transition-colors" title="Download Direct Node">
          <i className="fa-solid fa-cloud-arrow-down"></i>
        </button>
      </div>

      {/* Central Controls */}
      <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl px-12">
        <div className="flex items-center gap-8">
          <button className="text-slate-600 hover:text-white transition-all text-sm"><i className="fa-solid fa-shuffle"></i></button>
          <button onClick={onPrev} className="text-slate-300 hover:text-white text-lg transition-all active:scale-90"><i className="fa-solid fa-backward-step"></i></button>
          <button 
            onClick={togglePlay} 
            className="w-12 h-12 bg-white text-slate-950 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            {isPlaying ? <i className="fa-solid fa-pause text-xl"></i> : <i className="fa-solid fa-play text-xl ml-1"></i>}
          </button>
          <button onClick={onNext} className="text-slate-300 hover:text-white text-lg transition-all active:scale-90"><i className="fa-solid fa-forward-step"></i></button>
          <button className="text-slate-600 hover:text-blue-500 transition-all text-sm"><i className="fa-solid fa-repeat"></i></button>
        </div>
        
        <div className="w-full flex items-center gap-4">
          <span className="text-[10px] font-black text-slate-600 tabular-nums w-10 text-right">{formatTime(currentTime)}</span>
          <div className="flex-1 relative group h-1 bg-slate-800 rounded-full">
            <input 
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
            />
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full shadow-[0_0_10px_#2563eb]"
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            ></div>
            <div 
              className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-2xl"
              style={{ left: `${(currentTime / duration) * 100 || 0}%` }}
            ></div>
          </div>
          <span className="text-[10px] font-black text-slate-600 tabular-nums w-10">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right Tools */}
      <div className="flex items-center gap-5 w-1/4 justify-end min-w-[200px]">
        <button 
          onClick={() => setShowQueue(!showQueue)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-all ${showQueue ? 'bg-blue-600 text-white shadow-xl' : 'hover:bg-white/5'}`}
        >
          <i className="fa-solid fa-list-ul"></i>
        </button>
        <div className="flex items-center gap-3 group w-32">
          <button className="text-slate-500 hover:text-white transition-colors">
            {volume === 0 ? <i className="fa-solid fa-volume-xmark"></i> : <i className="fa-solid fa-volume-high"></i>}
          </button>
          <div className="flex-1 relative h-1 bg-slate-800 rounded-full group">
             <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
            />
            <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full" style={{ width: `${volume * 100}%` }}></div>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-white hover:bg-white/10 rounded-lg ml-2 transition-all">
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      {/* Queue Drawer */}
      {showQueue && (
        <div className="absolute bottom-32 right-10 w-96 bg-[#0a0a1f] border border-slate-800/60 rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.8)] p-6 animate-in fade-in slide-in-from-bottom-6 duration-300 z-[160]">
           <div className="flex items-center justify-between mb-6">
              <h5 className="font-black text-[11px] uppercase tracking-[4px] text-slate-500">Uplink Queue</h5>
              <button onClick={() => setShowQueue(false)} className="text-slate-500 hover:text-white"><i className="fa-solid fa-xmark"></i></button>
           </div>
           <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar pr-1">
              {queue.map((track, i) => (
                <div key={`${track.id}-${i}`} className={`flex items-center gap-4 p-3 rounded-2xl transition-all cursor-pointer ${track.id === currentTrack.id ? 'bg-blue-600/20 border border-blue-500/20' : 'hover:bg-white/5 border border-transparent'}`}>
                   <img src={track.thumbnail} className="w-11 h-11 rounded-lg object-cover" />
                   <div className="min-w-0 flex-1">
                      <p className={`text-xs font-black truncate uppercase tracking-tight ${track.id === currentTrack.id ? 'text-blue-400' : 'text-white'}`}>{track.title}</p>
                      <p className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">{track.artist}</p>
                   </div>
                   {track.id === currentTrack.id && (
                     <div className="flex gap-0.5 items-end h-3">
                        <div className="w-1 bg-blue-500 animate-[bounce_0.6s_infinite] h-full"></div>
                        <div className="w-1 bg-blue-500 animate-[bounce_0.8s_infinite] h-1/2"></div>
                        <div className="w-1 bg-blue-500 animate-[bounce_1s_infinite] h-3/4"></div>
                     </div>
                   )}
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
