
import React, { useState, useEffect } from 'react';
import { Playlist, MediaItem } from '../types';
import { getStoredPlaylists, savePlaylists, getStoredLibrary, deletePlaylist, removeItemFromPlaylist } from '../services/mockApi';
import { Icons } from '../constants';

const PlaylistsPage: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [library, setLibrary] = useState<MediaItem[]>([]);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    const p = getStoredPlaylists();
    setPlaylists(p);
    setLibrary(getStoredLibrary());
    if (selectedPlaylist) {
      setSelectedPlaylist(p.find(pl => pl.id === selectedPlaylist.id) || null);
    }
  };

  const handleCreatePlaylist = () => {
    const name = window.prompt("Playlist Name:", "New Collection");
    if (!name) return;
    const desc = window.prompt("Description:", "My favorite music...");
    
    const newPlaylist: Playlist = {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      description: desc || '',
      coverImage: `https://picsum.photos/seed/${Math.random()}/400/400`,
      itemIds: [],
      createdAt: new Date().toISOString()
    };
    const updated = [...playlists, newPlaylist];
    setPlaylists(updated);
    savePlaylists(updated);
  };

  const handleDeletePlaylist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Permanently delete this playlist?")) {
      deletePlaylist(id);
      refreshData();
      if (selectedPlaylist?.id === id) setSelectedPlaylist(null);
    }
  };

  const handleRemoveItem = (mediaId: string) => {
    if (selectedPlaylist) {
      removeItemFromPlaylist(selectedPlaylist.id, mediaId);
      refreshData();
    }
  };

  if (selectedPlaylist) {
    const playlistItems = library.filter(item => selectedPlaylist.itemIds.includes(item.id));

    return (
      <div className="space-y-8 animate-fade-in">
        <button 
          onClick={() => setSelectedPlaylist(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-all font-bold group"
        >
          <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
          Back to Collections
        </button>

        <div className="flex flex-col md:flex-row gap-8 items-end">
          <img src={selectedPlaylist.coverImage} className="w-48 h-48 rounded-[32px] object-cover shadow-2xl" alt={selectedPlaylist.name} />
          <div className="flex-1">
            <p className="text-blue-500 font-black uppercase tracking-[4px] text-[10px] mb-2">User Collection</p>
            <h1 className="text-5xl font-black text-white italic tracking-tighter mb-2">{selectedPlaylist.name}</h1>
            <p className="text-slate-400 font-medium mb-4">{selectedPlaylist.description}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{playlistItems.length} Tracks In Cluster</p>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                <th className="px-8 py-6">Track</th>
                <th className="px-8 py-6">Artist</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {playlistItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-all group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <img src={item.thumbnail} className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-bold text-white text-sm">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-sm text-slate-400">{item.artist}</td>
                  <td className="px-8 py-4 text-right">
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-slate-600 hover:text-red-500 transition-colors p-2"
                    >
                      <i className="fas fa-minus-circle"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {playlistItems.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center text-slate-600 italic">
                    <i className="fas fa-layer-group text-4xl mb-4 block opacity-20"></i>
                    No tracks manually added to this collection yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tight uppercase">Your <span className="text-blue-500">Clusters</span></h2>
          <p className="text-slate-400 font-medium">Manually organized media nodes.</p>
        </div>
        <button 
          onClick={handleCreatePlaylist}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
        >
          <Icons.Plus />
          New Collection
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {playlists.map(playlist => (
          <div 
            key={playlist.id} 
            onClick={() => setSelectedPlaylist(playlist)}
            className="bg-slate-900/50 border border-slate-800 rounded-[32px] overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer shadow-xl relative"
          >
            <div className="relative aspect-square">
              <img src={playlist.coverImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={playlist.name} />
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <button className="w-16 h-16 bg-white text-slate-950 rounded-full flex items-center justify-center text-xl shadow-2xl transform scale-75 group-hover:scale-100 transition-all duration-300">
                  <Icons.Play />
                </button>
              </div>
              <button 
                onClick={(e) => handleDeletePlaylist(playlist.id, e)}
                className="absolute top-4 right-4 w-10 h-10 bg-red-600/20 text-red-500 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white"
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
            <div className="p-6">
              <h3 className="font-black text-lg text-white truncate italic tracking-tight mb-1">{playlist.name}</h3>
              <p className="text-xs text-slate-500 mb-4 line-clamp-1 font-medium">{playlist.description || 'Custom collection'}</p>
              <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[3px]">{playlist.itemIds.length} Nodes</span>
                <i className="fas fa-chevron-right text-slate-700 text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>
          </div>
        ))}
        {playlists.length === 0 && (
          <div className="col-span-full py-32 text-center bg-slate-900/20 border border-slate-800/50 rounded-[40px] border-dashed">
            <i className="fas fa-folder-plus text-6xl mb-6 text-slate-800"></i>
            <p className="font-black uppercase tracking-[5px] text-slate-600">No Custom Clusters Found</p>
            <p className="text-slate-700 text-xs mt-2">Initialize your first collection to start organizing.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistsPage;
