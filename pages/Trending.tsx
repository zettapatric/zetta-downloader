
import React from 'react';
import { Icons } from '../constants';
import { MediaItem } from '../types';

interface Props {
  onPlayTrack: (track: MediaItem) => void;
}

const TrendingPage: React.FC<Props> = ({ onPlayTrack }) => {
  // Simulated trending data
  // Fixed: Added missing downloadCount, favoriteCount, and playCount to trendingItems
  const trendingItems: MediaItem[] = [
    {
      id: 't1',
      title: 'Neon Nights (Zetta Remix)',
      artist: 'Digital Dreamer',
      genre: 'PARTY', 
      duration: 215,
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      thumbnail: 'https://picsum.photos/seed/trend1/400/400',
      format: 'mp3',
      size: 5000000,
      isFavorite: false,
      isVisible: true,
      downloadDate: new Date().toISOString(),
      downloadCount: 0,
      favoriteCount: 0,
      playCount: 0
    },
    {
      id: 't2',
      title: 'Kigali Sunset',
      artist: 'Vibe Master',
      genre: 'CHILL', 
      duration: 185,
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      thumbnail: 'https://picsum.photos/seed/trend2/400/400',
      format: 'mp3',
      size: 4000000,
      isFavorite: true,
      isVisible: true,
      downloadDate: new Date().toISOString(),
      downloadCount: 0,
      favoriteCount: 0,
      playCount: 0
    },
    {
      id: 't3',
      title: 'Neural Pulse',
      artist: 'Synth Wave',
      genre: 'REELS', 
      duration: 300,
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      thumbnail: 'https://picsum.photos/seed/trend3/400/400',
      format: 'mp3',
      size: 7000000,
      isFavorite: false,
      isVisible: true,
      downloadDate: new Date().toISOString(),
      downloadCount: 0,
      favoriteCount: 0,
      playCount: 0
    }
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <header>
        <h2 className="text-4xl font-black text-white italic tracking-tight uppercase">Trending <span className="text-blue-500">Now</span></h2>
        <p className="text-slate-400 font-medium">Global top extractions and streaming pulses.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trendingItems.map((item, idx) => (
          <div key={item.id} className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-6 group hover:border-blue-500/50 transition-all shadow-xl">
             <div className="relative mb-6 aspect-video">
                <img src={item.thumbnail} className="w-full h-full object-cover rounded-2xl shadow-2xl" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                   <button 
                     onClick={() => onPlayTrack(item)}
                     className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-100 transition-all"
                   >
                     <Icons.Play />
                   </button>
                </div>
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                  #{idx + 1} Trending
                </div>
             </div>
             <div className="flex justify-between items-start">
               <div>
                 <h4 className="text-lg font-black text-white truncate">{item.title}</h4>
                 <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{item.artist}</p>
               </div>
               <button className="text-slate-600 hover:text-blue-500 transition-colors">
                 <Icons.Downloader />
               </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingPage;
