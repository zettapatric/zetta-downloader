
import React, { useState, useMemo } from 'react';
import { Icons } from '../constants';
import { MediaItem } from '../types';

interface Props {
  onPlayTrack: (track: MediaItem) => void;
}

const TopChartsPage: React.FC<Props> = ({ onPlayTrack }) => {
  const [chartScope, setChartScope] = useState<'global' | 'regional'>('global');

  // Simulated Global chart data
  const globalItems: MediaItem[] = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
    id: `gc${i}`,
    title: `Global Hit #${i + 1}`,
    artist: 'Various Artists',
    genre: 'CHILL',
    duration: 180 + (i * 10),
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    thumbnail: `https://picsum.photos/seed/chart${i}/400/400`,
    format: 'mp3',
    size: 5000000,
    isFavorite: false,
    isVisible: true,
    downloadDate: new Date().toISOString(),
    downloadCount: 4500,
    favoriteCount: 1200,
    playCount: 15000
  })), []);

  // Simulated Regional (Rwanda) chart data
  const regionalItems: MediaItem[] = useMemo(() => [
    { id: 'rc1', title: 'Katerina', artist: 'Bruce Melodie', genre: 'PARTY', duration: 210, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', thumbnail: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=400', format: 'mp3', size: 5000000, isFavorite: false, isVisible: true, downloadDate: new Date().toISOString(), downloadCount: 8900, favoriteCount: 3400, playCount: 45000 },
    { id: 'rc2', title: 'Vazi', artist: 'The Ben', genre: 'LOVE', duration: 195, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=400', format: 'mp3', size: 4800000, isFavorite: true, isVisible: true, downloadDate: new Date().toISOString(), downloadCount: 7500, favoriteCount: 2800, playCount: 38000 },
    { id: 'rc3', title: 'Slowly', artist: 'Meddy', genre: 'CHILL', duration: 245, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', thumbnail: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=400', format: 'mp3', size: 6000000, isFavorite: false, isVisible: true, downloadDate: new Date().toISOString(), downloadCount: 10200, favoriteCount: 4500, playCount: 62000 },
    { id: 'rc4', title: 'Inyogo', artist: 'Chriss Eazy', genre: 'PARTY', duration: 180, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', thumbnail: 'https://images.unsplash.com/photo-1514525253361-bee8718a74a2?auto=format&fit=crop&q=80&w=400', format: 'mp3', size: 4400000, isFavorite: false, isVisible: true, downloadDate: new Date().toISOString(), downloadCount: 6200, favoriteCount: 1500, playCount: 25000 },
    { id: 'rc5', title: 'Foula', artist: 'Element Eleéeh', genre: 'TIKTOK SOUNDS', duration: 165, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=400', format: 'mp3', size: 4100000, isFavorite: false, isVisible: true, downloadDate: new Date().toISOString(), downloadCount: 5400, favoriteCount: 1100, playCount: 21000 }
  ], []);

  const displayedItems = chartScope === 'global' ? globalItems : regionalItems;

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tight uppercase">Top <span className="text-blue-500">Charts</span></h2>
          <p className="text-slate-400 font-medium italic">The most frequent nodes in the {chartScope === 'global' ? 'Global' : 'Regional (Rwanda)'} registry.</p>
        </div>
        <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl shadow-xl">
          <button 
            onClick={() => setChartScope('global')}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${chartScope === 'global' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
          >
            Global
          </button>
          <button 
            onClick={() => setChartScope('regional')}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${chartScope === 'regional' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
          >
            Regional
          </button>
        </div>
      </header>

      <div className="bg-slate-900/50 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl animate-fade-in" key={chartScope}>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-800/50 text-slate-500 text-[10px] font-black uppercase tracking-widest bg-slate-950/20">
              <th className="px-10 py-6">Rank</th>
              <th className="px-10 py-6">Identity</th>
              <th className="px-10 py-6">Duration</th>
              <th className="px-10 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30">
            {displayedItems.map((item, idx) => (
              <tr key={item.id} className="hover:bg-slate-800/20 transition-colors group">
                <td className="px-10 py-6">
                  <span className="text-2xl font-black italic text-slate-700 group-hover:text-blue-500 transition-colors">{(idx + 1).toString().padStart(2, '0')}</span>
                </td>
                <td className="px-10 py-6">
                  <div className="flex items-center gap-4">
                    <img src={item.thumbnail} className="w-12 h-12 rounded-xl object-cover shadow-lg border border-slate-800" />
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors italic uppercase tracking-tight">{item.title}</h4>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.artist}</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-6 text-sm font-bold text-slate-400 tabular-nums">
                  {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
                </td>
                <td className="px-10 py-6 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onPlayTrack(item)} className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
                      <Icons.Play />
                    </button>
                    <button className="w-10 h-10 bg-slate-800 text-slate-400 rounded-xl flex items-center justify-center hover:text-red-500 transition-colors">
                      <Icons.Favorite filled={item.isFavorite} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopChartsPage;
