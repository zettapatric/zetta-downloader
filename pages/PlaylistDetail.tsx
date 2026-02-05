
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Playlist, MediaItem } from '../types';
import { getStoredPlaylists, getStoredLibrary, deletePlaylist } from '../services/mockApi';
import { Icons } from '../constants';
import DeletePlaylistModal from '../components/DeletePlaylistModal';

interface Props {
  onPlayTrack: (track: MediaItem) => void;
}

const PlaylistDetailPage: React.FC<Props> = ({ onPlayTrack }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const allPlaylists = getStoredPlaylists();
    const lib = getStoredLibrary();
    
    let found: Playlist | undefined;
    
    if (id === 'mix1') found = { id: 'mix1', name: 'My Mix #1', description: 'Curated mix based on recent activity.', coverImage: 'https://picsum.photos/seed/mix1/400/400', itemIds: lib.slice(0, 5).map(i => i.id), createdAt: new Date().toISOString() };
    else if (id === 'liked') found = { id: 'liked', name: 'Liked Songs', description: 'Priority flagged nodes.', coverImage: 'https://picsum.photos/seed/liked/400/400', itemIds: lib.filter(i => i.isFavorite).map(i => i.id), createdAt: new Date().toISOString() };
    else found = allPlaylists.find(p => p.id === id);

    if (found) {
      setPlaylist(found);
      setItems(lib.filter(i => found!.itemIds.includes(i.id)));
    }
    setIsLoading(false);
  }, [id]);

  const handleDelete = () => {
    if (playlist) {
      deletePlaylist(playlist.id);
      setShowDeleteModal(false);
      navigate('/playlists');
    }
  };

  if (isLoading) return <div className="py-40 text-center font-black uppercase tracking-[5px] text-slate-700 animate-pulse">Synchronizing Cluster...</div>;
  if (!playlist) return <div className="py-40 text-center font-black uppercase tracking-[5px] text-slate-700">Collection Node Not Found</div>;

  const isSpecial = id === 'mix1' || id === 'liked';

  return (
    <div className="space-y-12 animate-fade-in pb-32">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigate('/playlists')}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-all font-bold group"
        >
          <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
          Back to Registry
        </button>
        
        {!isSpecial && (
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-3 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
          >
            <i className="fa-solid fa-trash-can"></i>
            Terminate Cluster
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-10 items-end">
        <div className="relative group">
          <img src={playlist.coverImage} className="w-56 h-56 rounded-[40px] object-cover shadow-2xl border-4 border-slate-800 group-hover:border-blue-500/30 transition-all" alt={playlist.name} />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[40px]">
             <button onClick={() => items[0] && onPlayTrack(items[0])} className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-100 transition-all">
               <Icons.Play />
             </button>
          </div>
        </div>
        <div className="flex-1 space-y-4 min-w-0">
          <p className="text-blue-500 font-black uppercase tracking-[5px] text-[10px]">Registry Cluster Node</p>
          <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none truncate">{playlist.name}</h1>
          <p className="text-slate-400 text-lg font-medium italic">{playlist.description}</p>
          <div className="flex items-center gap-6 pt-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{items.length} Identity Track Nodes</span>
            <div className="h-4 w-px bg-slate-800"></div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Active Since {new Date(playlist.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[3px] border-b border-slate-800/50 bg-slate-950/20">
              <th className="px-10 py-6">Identity Node</th>
              <th className="px-10 py-6">Artist Signature</th>
              <th className="px-10 py-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-slate-800/20 transition-all group">
                <td className="px-10 py-5">
                  <div className="flex items-center gap-4">
                    <img src={item.thumbnail} className="w-10 h-10 rounded-xl object-cover shadow-lg border border-slate-800" />
                    <span className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors italic uppercase">{item.title}</span>
                  </div>
                </td>
                <td className="px-10 py-5 text-sm font-bold text-slate-500 uppercase tracking-widest">{item.artist}</td>
                <td className="px-10 py-5 text-right">
                  <button 
                    onClick={() => onPlayTrack(item)}
                    className="w-10 h-10 bg-slate-800 hover:bg-blue-600 text-white rounded-xl flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 active:scale-90"
                  >
                    <Icons.Play />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={3} className="px-10 py-32 text-center text-slate-700 italic">
                  <i className="fa-solid fa-cloud-moon text-5xl mb-6 block opacity-20"></i>
                  This cluster node is currently vacant. Distribute nodes here to start streaming.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showDeleteModal && playlist && (
        <DeletePlaylistModal 
          playlist={playlist} 
          onConfirm={handleDelete} 
          onClose={() => setShowDeleteModal(false)} 
        />
      )}
    </div>
  );
};

export default PlaylistDetailPage;
