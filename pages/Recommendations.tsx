
import React from 'react';
import { Icons } from '../constants';
import { MediaItem } from '../types';

interface Props {
  onPlayTrack: (track: MediaItem) => void;
}

const RecommendationsPage: React.FC<Props> = ({ onPlayTrack }) => {
  // Simulated recommendations
  // Fixed: Added missing downloadCount, favoriteCount, and playCount to recommended items
  const recs: MediaItem[] = Array.from({ length: 6 }, (_, i) => ({
    id: `r${i}`,
    title: `Curated Node #${i + 1}`,
    artist: 'AI Oracle',
    genre: 'CHILL', 
    duration: 240,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    thumbnail: `https://picsum.photos/seed/rec${i}/400/400`,
    format: 'mp3',
    size: 6000000,
    isFavorite: false,
    isVisible: true,
    downloadDate: new Date().toISOString(),
    downloadCount: 0,
    favoriteCount: 0,
    playCount: 0
  }));

  const handleUplinkNow = () => {
    // Start playback of the first curated recommendation
    if (recs.length > 0) {
      onPlayTrack(recs[0]);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      <header className="flex flex-col gap-2">
        <h2 className="text-4xl font-black text-white italic tracking-tight uppercase">Neural <span className="text-blue-500">Picks</span></h2>
        <p className="text-slate-400 font-medium italic">Curated by the Zetta Intelligence Layer based on your library footprint.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="col-span-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-[40px] p-10 flex items-center gap-10 overflow-hidden relative group">
           <div className="relative z-10 space-y-4 max-w-lg">
             <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[2px] shadow-xl">Daily Uplink</span>
             <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">The Semantic Mix</h3>
             <p className="text-slate-300 leading-relaxed text-lg">A specialized collection synthesized from your recent extraction history. Updated every 24 hours for optimal resonance.</p>
             <button 
              onClick={handleUplinkNow}
              className="bg-white text-slate-950 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-2xl transition-all active:scale-95 shadow-xl"
             >
               Uplink Now
             </button>
           </div>
           <i className="fa-solid fa-brain absolute -right-10 -bottom-10 text-[260px] text-white/5 rotate-12 group-hover:scale-110 group-hover:text-white/10 transition-all duration-1000"></i>
        </div>

        {recs.map(item => (
          <div key={item.id} className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-6 flex items-center gap-6 hover:border-blue-500/30 transition-all group">
             <img src={item.thumbnail} className="w-24 h-24 rounded-2xl object-cover shadow-2xl group-hover:scale-105 transition-transform" />
             <div className="flex-1 min-w-0">
               <h4 className="text-lg font-black text-white truncate mb-1 italic tracking-tight uppercase">{item.title}</h4>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-[3px]">{item.artist}</p>
               <div className="flex gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onPlayTrack(item)} className="text-blue-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
                    <i className="fa-solid fa-play"></i> Sync Play
                  </button>
                  <button className="text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
                    <i className="fa-solid fa-plus"></i> Collect
                  </button>
               </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsPage;
