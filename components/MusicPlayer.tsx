
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MediaItem } from '../types';
import { Icons } from '../constants';

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
      audioRef.current.play();
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

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 h-24 z-50 px-6 flex items-center justify-between shadow-2xl">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onNext}
      />

      {/* Track Info */}
      <div className="flex items-center gap-4 w-1/4">
        <img src={currentTrack.thumbnail} alt={currentTrack.title} className="w-14 h-14 rounded-lg object-cover shadow-lg" />
        <div className="min-w-0">
          <h4 className="text-sm font-bold truncate text-white">{currentTrack.title}</h4>
          <p className="text-xs text-slate-400 truncate">{currentTrack.artist}</p>
        </div>
        <button className="text-slate-500 hover:text-red-500 transition-colors ml-2">
          <Icons.Favorite filled={currentTrack.isFavorite} />
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-1 flex-1 max-w-2xl px-8">
        <div className="flex items-center gap-6">
          <button className="text-slate-500 hover:text-white transition-colors"><Icons.Shuffle /></button>
          <button onClick={onPrev} className="text-slate-300 hover:text-white text-xl transition-colors"><Icons.Prev /></button>
          <button 
            onClick={togglePlay} 
            className="w-10 h-10 bg-white text-slate-950 rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-lg"
          >
            {isPlaying ? <Icons.Pause /> : <Icons.Play />}
          </button>
          <button onClick={onNext} className="text-slate-300 hover:text-white text-xl transition-colors"><Icons.Next /></button>
          <button className="text-slate-500 hover:text-white transition-colors"><Icons.Repeat /></button>
        </div>
        
        <div className="w-full flex items-center gap-3">
          <span className="text-[10px] text-slate-500 tabular-nums w-8">{formatTime(currentTime)}</span>
          <div className="flex-1 relative group h-1.5 bg-slate-800 rounded-full">
            <input 
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
            />
            <div 
              className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            ></div>
            <div 
              className="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${(currentTime / duration) * 100 || 0}%` }}
            ></div>
          </div>
          <span className="text-[10px] text-slate-500 tabular-nums w-8">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume & Additional */}
      <div className="flex items-center gap-4 w-1/4 justify-end">
        <button 
          onClick={() => setShowQueue(!showQueue)}
          className={`text-slate-400 hover:text-white transition-colors ${showQueue ? 'text-blue-400' : ''}`}
        >
          <i className="fa-solid fa-list-check"></i>
        </button>
        <div className="flex items-center gap-2 group w-24">
          <Icons.Volume />
          <input 
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-1 bg-slate-800 rounded-full accent-white"
          />
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white ml-2">
          <Icons.Close />
        </button>
      </div>

      {/* Queue Drawer */}
      {showQueue && (
        <div className="absolute bottom-28 right-6 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
           <div className="flex items-center justify-between mb-4">
              <h5 className="font-bold text-sm uppercase tracking-wider text-slate-500">Play Queue</h5>
              <button onClick={() => setShowQueue(false)} className="text-slate-500 hover:text-white"><Icons.Close /></button>
           </div>
           <div className="space-y-2 max-h-80 overflow-y-auto no-scrollbar">
              {queue.map((track, i) => (
                <div key={`${track.id}-${i}`} className={`flex items-center gap-3 p-2 rounded-lg ${track.id === currentTrack.id ? 'bg-blue-600/20' : 'hover:bg-slate-800'} cursor-pointer transition-colors`}>
                   <img src={track.thumbnail} className="w-10 h-10 rounded object-cover" />
                   <div className="min-w-0 flex-1">
                      <p className={`text-xs font-semibold truncate ${track.id === currentTrack.id ? 'text-blue-400' : 'text-white'}`}>{track.title}</p>
                      <p className="text-[10px] text-slate-500 truncate">{track.artist}</p>
                   </div>
                   {track.id === currentTrack.id && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>}
                </div>
              ))}
              {queue.length === 0 && <p className="text-xs text-slate-500 text-center py-4">No tracks in queue</p>}
           </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
