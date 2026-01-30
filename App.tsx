
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import MusicPlayer from './components/MusicPlayer';
import WelcomeModal from './components/WelcomeModal';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Downloader from './pages/Downloader';
import PlaylistsPage from './pages/Playlists';
import ToolsPage from './pages/Tools';
import HelpPage from './pages/Help';
import AccountSettings from './pages/AccountSettings';
import PrivacySecurity from './pages/PrivacySecurity';
import SupportHub from './pages/Support';
import GeneralSettings from './pages/GeneralSettings';
import TermsOfService from './pages/TermsOfService';
import AdminPanel from './pages/Admin';
import { User, MediaItem, Playlist } from './types';
import { getStoredLibrary, saveLibrary, getStoredPlaylists, savePlaylists, addItemToPlaylist } from './services/mockApi';
import { Icons, STORAGE_KEYS } from './constants';

// Media Action Menu Component
const MediaActionMenu: React.FC<{ 
  item: MediaItem; 
  onClose: () => void; 
  onPlay: (item: MediaItem) => void;
  playlists: Playlist[];
  onAddToPlaylist: (playlistId: string, itemId: string) => void;
  onRemove: (itemId: string) => void;
}> = ({ item, onClose, onPlay, playlists, onAddToPlaylist, onRemove }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [showPlaylistSubmenu, setShowPlaylistSubmenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div ref={menuRef} className="absolute top-10 right-4 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-3xl z-[100] p-2 animate-fade-in overflow-visible">
      <button onClick={() => { onPlay(item); onClose(); }} className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-slate-800 text-sm font-bold text-slate-400 hover:text-white flex items-center gap-3 transition-all">
        <i className="fas fa-play text-[10px] text-blue-500"></i> Play Track
      </button>
      
      <div className="relative group/sub">
        <button 
          onMouseEnter={() => setShowPlaylistSubmenu(true)}
          className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-slate-800 text-sm font-bold text-slate-400 hover:text-white flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-3">
            <i className="fas fa-list-ul text-[10px] text-blue-500"></i> Add to Cluster
          </div>
          <i className="fas fa-chevron-right text-[8px]"></i>
        </button>

        {(showPlaylistSubmenu || true) && (
          <div className={`absolute left-full top-0 ml-1 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-3xl p-2 invisible group-hover/sub:visible opacity-0 group-hover/sub:opacity-100 transition-all z-[110]`}>
             <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest p-2 border-b border-slate-800/50 mb-1">Select Collection</p>
             {playlists.length > 0 ? playlists.map(p => (
               <button key={p.id} onClick={() => { onAddToPlaylist(p.id, item.id); onClose(); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-[11px] font-bold text-slate-400 hover:text-white truncate transition-all">
                 {p.name}
               </button>
             )) : <p className="text-[10px] p-2 text-slate-600 italic">No clusters found.</p>}
          </div>
        )}
      </div>

      <button onClick={() => { navigator.clipboard.writeText(item.url); onClose(); }} className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-slate-800 text-sm font-bold text-slate-400 hover:text-white flex items-center gap-3 transition-all">
        <i className="fas fa-link text-[10px] text-blue-500"></i> Copy Protocol Link
      </button>
      
      <div className="h-px bg-slate-800 my-1 mx-2"></div>
      
      <button onClick={() => { onRemove(item.id); onClose(); }} className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-red-500/10 text-sm font-bold text-red-500 flex items-center gap-3 transition-all">
        <i className="fas fa-trash-can text-[10px]"></i> Purge from Node
      </button>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  const [library, setLibrary] = useState<MediaItem[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentTrack, setCurrentTrack] = useState<MediaItem | null>(null);
  const [queue, setQueue] = useState<MediaItem[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('zetta_user');
    const token = localStorage.getItem('zetta_token');
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        refreshCollections();
      } catch (e) {
        localStorage.clear();
      }
    }
    
    const firstTime = localStorage.getItem('zetta_first_time');
    if (!firstTime) {
      setShowWelcome(true);
      localStorage.setItem('zetta_first_time', 'completed');
    }
    
    setIsInitializing(false);
  }, []);

  const refreshCollections = () => {
    setLibrary(getStoredLibrary());
    setPlaylists(getStoredPlaylists());
  };

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    refreshCollections();
  };

  const handleLogout = () => {
    localStorage.removeItem('zetta_user');
    localStorage.removeItem('zetta_token');
    setUser(null);
    setIsAuthenticated(false);
    setCurrentTrack(null);
  };

  const handleAddMedia = (item: MediaItem) => {
    const updated = [item, ...library];
    setLibrary(updated);
    saveLibrary(updated);
  };

  const handleRemoveMedia = (itemId: string) => {
    const updated = library.filter(i => i.id !== itemId);
    setLibrary(updated);
    saveLibrary(updated);
    // Also remove from all playlists for consistency
    const updatedPlaylists = playlists.map(p => ({
      ...p,
      itemIds: p.itemIds.filter(id => id !== itemId)
    }));
    setPlaylists(updatedPlaylists);
    savePlaylists(updatedPlaylists);
  };

  const handleAddToPlaylist = (playlistId: string, itemId: string) => {
    addItemToPlaylist(playlistId, itemId);
    refreshCollections();
  };

  const handlePlayTrack = (track: MediaItem) => {
    setCurrentTrack(track);
    const index = library.findIndex(t => t.id === track.id);
    setQueue(library.slice(index));
  };

  const handleNext = useCallback(() => {
    if (!currentTrack || queue.length <= 1) return;
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    if (currentIndex !== -1 && currentIndex < queue.length - 1) {
      setCurrentTrack(queue[currentIndex + 1]);
    }
  }, [currentTrack, queue]);

  const handlePrev = useCallback(() => {
    if (!currentTrack || queue.length === 0) return;
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    if (currentIndex > 0) {
      setCurrentTrack(queue[currentIndex - 1]);
    }
  }, [currentTrack, queue]);

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
         <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-3xl animate-spin mb-6"></div>
         <p className="text-slate-500 font-black uppercase tracking-[6px] text-[10px] animate-pulse">Initializing Zetta Protocol</p>
      </div>
    );
  }

  return (
    <HashRouter>
      {!isAuthenticated ? (
        <Routes>
          <Route path="/login" element={<Auth onLoginSuccess={handleLoginSuccess} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <Layout user={user} onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Dashboard user={user} library={library} onPlayTrack={handlePlayTrack} />} />
            <Route path="/downloader" element={<Downloader onAddMedia={handleAddMedia} />} />
            <Route path="/library" element={
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 animate-fade-in">
                {library.map(item => (
                  <div key={item.id} className="bg-slate-900/50 border border-slate-800 rounded-[28px] p-5 hover:border-blue-600/50 transition-all group relative">
                     <div className="relative mb-6 aspect-square cursor-pointer" onClick={() => handlePlayTrack(item)}>
                        <img src={item.thumbnail} className="w-full h-full object-cover rounded-2xl shadow-2xl" />
                        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center backdrop-blur-sm">
                           <div className="w-14 h-14 bg-white text-slate-950 rounded-full flex items-center justify-center text-xl shadow-2xl transform scale-90 group-hover:scale-100 transition-transform">
                             <Icons.Play />
                           </div>
                        </div>
                     </div>
                     
                     <div className="flex justify-between items-start">
                        <div className="min-w-0 flex-1">
                          <h5 className="font-bold text-white truncate text-base mb-1">{item.title}</h5>
                          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest truncate">{item.artist}</p>
                        </div>
                        <div className="relative">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === item.id ? null : item.id); }}
                            className="text-slate-600 hover:text-white p-1.5 rounded-lg transition-colors"
                          >
                             <i className="fas fa-ellipsis-v"></i>
                          </button>
                          {activeMenuId === item.id && (
                            <MediaActionMenu 
                              item={item} 
                              playlists={playlists}
                              onClose={() => setActiveMenuId(null)}
                              onPlay={handlePlayTrack}
                              onAddToPlaylist={handleAddToPlaylist}
                              onRemove={handleRemoveMedia}
                            />
                          )}
                        </div>
                     </div>
                  </div>
                ))}
                {library.length === 0 && (
                   <div className="col-span-full py-32 text-center text-slate-600 border border-slate-800 border-dashed rounded-[40px] bg-slate-900/10">
                      <i className="fas fa-music text-6xl mb-6 opacity-20"></i>
                      <p className="font-black uppercase tracking-[5px]">Library Cluster is Offline</p>
                   </div>
                )}
              </div>
            )} />
            <Route path="/playlists" element={<PlaylistsPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/account" element={<AccountSettings user={user} onUpdate={handleUserUpdate} />} />
            <Route path="/privacy" element={<PrivacySecurity />} />
            <Route path="/support" element={<SupportHub />} />
            <Route path="/settings" element={<GeneralSettings user={user} onUpdate={handleUserUpdate} />} />
            <Route path="/tos" element={<TermsOfService />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      )}

      {currentTrack && (
        <MusicPlayer 
          currentTrack={currentTrack} 
          queue={queue}
          onNext={handleNext}
          onPrev={handlePrev}
          onClose={() => setCurrentTrack(null)}
        />
      )}

      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
    </HashRouter>
  );
};

export default App;
