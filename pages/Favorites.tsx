
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';
import { MediaItem } from '../types';
import { getStoredLibrary } from '../services/mockApi';

interface Props {
  onPlayTrack: (track: MediaItem) => void;
}

const FavoritesPage: React.FC<Props> = ({ onPlayTrack }) => {
  const [favorites, setFavorites] = useState<MediaItem[]>([]);

  useEffect(() => {
    const library = getStoredLibrary();
    setFavorites(library.filter(item => item.isFavorite));
  }, []);

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <header className="flex items-center gap-6">
        <div className="w-16 h-16 bg-red-600/10 border border-red-600/20 rounded-[24px] flex items-center justify-center text-red-500 text-2xl shadow-[0_0_20px_rgba(239,68,68,0.1)]">
           <i className="fa-solid fa-heart"></i>
        </div>
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tight uppercase">Identity <span className="text-red-500">Favorites</span></h2>
          <p className="text-slate-400 font-medium">Nodes you have flagged for priority access.</p>
        </div>
      </header>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {favorites.map(item => (
            <div key={item.id} className="bg-slate-900/50 border border-slate-800 rounded-[24px] p-4 hover:border-red-500/30 transition-all group shadow-xl">
               <div className="relative mb-4 aspect-square cursor-pointer" onClick={() => onPlayTrack(item)}>
                  <img src={item.thumbnail} className="w-full h-full object-cover rounded-xl" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                     <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center shadow-2xl">
                       <Icons.Play />
                     </div>
                  </div>
               </div>
               <h5 className="font-bold text-white truncate text-sm">{item.title}</h5>
               <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest truncate">{item.artist}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-40 text-center bg-slate-900/20 border border-slate-800 border-dashed rounded-[40px]">
           <i className="fa-solid fa-heart-crack text-6xl text-slate-800 mb-6 block"></i>
           <p className="font-black uppercase tracking-[5px] text-slate-600">No Flagged Nodes</p>
           <p className="text-slate-700 text-xs mt-2">Add items to your favorites to see them here.</p>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
