
import React, { useState, useEffect } from 'react';
import { Playlist } from '../types';
import { getStoredPlaylists, savePlaylists, deletePlaylist } from '../services/mockApi';
import { Icons } from '../constants';
import { useNavigate } from 'react-router-dom';
import DeletePlaylistModal from '../components/DeletePlaylistModal';

const PlaylistsPage: React.FC = () => {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [playlistToDelete, setPlaylistToDelete] = useState<Playlist | null>(null);
  const [showToast, setShowToast] = useState<{show: boolean, msg: string}>({show: false, msg: ''});

  useEffect(() => {
    refreshData();
    const handleUpdate = () => refreshData();
    window.addEventListener('zetta-playlists-updated', handleUpdate);
    return () => window.removeEventListener('zetta-playlists-updated', handleUpdate);
  }, []);

  const refreshData = () => {
    setPlaylists(getStoredPlaylists());
  };

  const handleCreatePlaylist = () => {
    const name = prompt("Enter Cluster Identity (Name):");
    if (name && name.trim()) {
      const currentPlaylists = getStoredPlaylists();
      const newPlaylist: Playlist = {
        id: 'pl-' + Date.now(),
        name: name.trim(),
        description: 'User-defined extraction cluster node.',
        coverImage: `https://picsum.photos/seed/${Date.now()}/400/400`,
        itemIds: [],
        createdAt: new Date().toISOString()
      };
      const updated = [...currentPlaylists, newPlaylist];
      savePlaylists(updated);
      setPlaylists(updated);
      triggerToast('New Cluster Synchronized');
    }
  };

  const handleConfirmDelete = () => {
    if (playlistToDelete) {
      deletePlaylist(playlistToDelete.id);
      setPlaylistToDelete(null);
      refreshData();
      triggerToast('Cluster Node Terminated');
    }
  };

  const triggerToast = (msg: string) => {
    setShowToast({ show: true, msg });
    setTimeout(() => setShowToast({ show: false, msg: '' }), 3000);
  };

  return (
    <div className="space-y-10 animate-fade-in pb-40 relative">
      {showToast.show && (
        <div className="fixed top-24 right-10 z-[400] bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-2xl font-black uppercase text-[10px] tracking-widest border border-blue-400/30 animate-in slide-in-from-right-4">
          <i className="fa-solid fa-circle-check mr-2"></i> {showToast.msg}
        </div>
      )}

      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tight uppercase">Registry <span className="text-blue-500">Clusters</span></h2>
          <p className="text-slate-400 font-medium italic">Manage and deploy custom media collection nodes.</p>
        </div>
        <button 
          onClick={handleCreatePlaylist}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-blue-600/20 transition-all active:scale-95 flex items-center gap-3"
        >
          <i className="fa-solid fa-plus-circle text-sm"></i>
          Create New Cluster
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {playlists.map(playlist => (
          <div 
            key={playlist.id} 
            onClick={() => navigate(`/playlist/${playlist.id}`)}
            className="bg-slate-900/50 border border-slate-800/60 rounded-[40px] overflow-hidden hover:border-blue-500/40 transition-all group cursor-pointer shadow-xl relative flex flex-col h-full"
          >
            <div className="relative aspect-square">
              <img src={playlist.coverImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={playlist.name} />
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <div className="w-16 h-16 bg-white text-slate-950 rounded-full flex items-center justify-center text-xl shadow-2xl transform scale-75 group-hover:scale-100 transition-all duration-300">
                  <Icons.Play />
                </div>
              </div>
              <div className="absolute top-6 right-6 flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); setPlaylistToDelete(playlist); }}
                  className="w-10 h-10 bg-red-600/20 text-red-500 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white z-20 active:scale-90 border border-red-500/20"
                  title="Terminate Cluster"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-black text-xl text-white truncate italic tracking-tight">{playlist.name}</h3>
                <span className="text-[9px] bg-blue-600/10 text-blue-500 px-2 py-0.5 rounded-full font-black uppercase">Active</span>
              </div>
              <p className="text-xs text-slate-500 mb-6 line-clamp-2 font-medium leading-relaxed italic">{playlist.description}</p>
              <div className="mt-auto flex items-center justify-between border-t border-slate-800/50 pt-4">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[3px]">{playlist.itemIds.length} Identity Nodes</span>
                <i className="fas fa-arrow-right text-slate-700 group-hover:text-blue-500 transition-all"></i>
              </div>
            </div>
          </div>
        ))}
        
        {playlists.length === 0 && (
          <div className="col-span-full py-40 text-center bg-slate-900/10 border-2 border-slate-800 border-dashed rounded-[50px]">
            <i className="fas fa-folder-plus text-7xl mb-6 text-slate-800 opacity-20"></i>
            <p className="font-black uppercase tracking-[5px] text-slate-600">No Clusters Initialized</p>
            <p className="text-slate-700 text-xs mt-2 italic">Deploy your first media collection cluster to start organizing extractions.</p>
            <button 
              onClick={handleCreatePlaylist}
              className="mt-8 bg-slate-800 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
            >
              Initialize Node
            </button>
          </div>
        )}
      </div>

      {playlistToDelete && (
        <DeletePlaylistModal 
          playlist={playlistToDelete} 
          onConfirm={handleConfirmDelete} 
          onClose={() => setPlaylistToDelete(null)} 
        />
      )}
    </div>
  );
};

export default PlaylistsPage;
