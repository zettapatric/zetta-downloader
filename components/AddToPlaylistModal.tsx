
import React, { useState, useEffect } from 'react';
import { MediaItem, Playlist } from '../types';
import { getStoredPlaylists, addItemToPlaylist } from '../services/mockApi';

interface AddToPlaylistModalProps {
  song: MediaItem;
  onClose: () => void;
}

const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({ song, onClose }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [successId, setSuccessId] = useState<string | null>(null);

  useEffect(() => {
    setPlaylists(getStoredPlaylists());
  }, []);

  const handleAdd = (pId: string) => {
    addItemToPlaylist(pId, song.id);
    setSuccessId(pId);
    setTimeout(onClose, 1000);
  };

  return (
    <div className="fixed inset-0 z-[260] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-fade-in">
      <div className="bg-slate-900 border border-white/10 rounded-[40px] p-10 max-w-md w-full shadow-3xl">
        <div className="flex justify-between items-center mb-8">
           <h3 className="text-2xl font-black text-white italic uppercase">Distribute Node</h3>
           <button onClick={onClose} className="text-slate-500 hover:text-white"><i className="fa-solid fa-xmark text-xl"></i></button>
        </div>

        <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
          {playlists.map(p => (
            <button 
              key={p.id}
              onClick={() => handleAdd(p.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all active:scale-[0.98] border ${successId === p.id ? 'bg-green-600/20 border-green-500/50' : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10'}`}
            >
              <img src={p.coverImage} className="w-12 h-12 rounded-xl object-cover" />
              <div className="flex-1 text-left min-w-0">
                <p className="text-white font-bold truncate">{p.name}</p>
                <p className="text-[10px] text-slate-500 font-black uppercase">{p.itemIds.length} Nodes Inside</p>
              </div>
              {successId === p.id && <i className="fa-solid fa-circle-check text-green-500 text-xl"></i>}
            </button>
          ))}
          {playlists.length === 0 && <p className="text-center py-10 text-slate-600 italic">No collections initialized.</p>}
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;
