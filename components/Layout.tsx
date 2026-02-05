
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { User, MediaItem, UserRole, Playlist } from '../types';
import { getStoredLibrary, logSearch, getStoredPlaylists, savePlaylists, deletePlaylist } from '../services/mockApi';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MediaItem[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // Playlist Management State
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isPlaylistsOpen, setIsPlaylistsOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreatingInSidebar, setIsCreatingInSidebar] = useState(false);
  const [sidebarNewName, setSidebarNewName] = useState('');
  
  const searchRef = useRef<HTMLDivElement>(null);
  const playlistDropdownRef = useRef<HTMLDivElement>(null);
  const sidebarInputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<number | null>(null);

  useEffect(() => {
    const refreshPlaylists = () => {
      setPlaylists(getStoredPlaylists());
    };
    refreshPlaylists();
    window.addEventListener('zetta-playlists-updated', refreshPlaylists);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults(null);
      }
      if (playlistDropdownRef.current && !playlistDropdownRef.current.contains(event.target as Node)) {
        setIsPlaylistsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('zetta-playlists-updated', refreshPlaylists);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isCreatingInSidebar && sidebarInputRef.current) {
      sidebarInputRef.current.focus();
    }
  }, [isCreatingInSidebar]);

  const performSearch = (q: string) => {
    if (!q.trim()) {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }

    const library = getStoredLibrary();
    const filtered = library.filter(item => 
      item.title.toLowerCase().includes(q.toLowerCase()) || 
      item.artist.toLowerCase().includes(q.toLowerCase())
    );
    
    setSearchResults(filtered);
    setIsSearching(false);
    if (filtered.length > 0) logSearch(q);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    setIsSearching(true);

    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = window.setTimeout(() => {
      performSearch(q);
    }, 300);
  };

  const handleResultClick = (item: MediaItem) => {
    setSearchResults(null);
    setSearchQuery('');
    navigate(`/library`);
    window.dispatchEvent(new CustomEvent('zetta-play-now', { detail: item }));
  };

  const executeCreatePlaylist = (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const current = getStoredPlaylists();
    const newPlaylist: Playlist = {
      id: 'pl-' + Date.now(),
      name: trimmedName,
      description: 'User-defined collection node.',
      coverImage: `https://picsum.photos/seed/${Date.now()}/400/400`,
      itemIds: [],
      createdAt: new Date().toISOString()
    };
    savePlaylists([...current, newPlaylist]);
    return newPlaylist;
  };

  const handleDropdownCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (executeCreatePlaylist(newPlaylistName)) {
      setNewPlaylistName('');
      setIsPlaylistsOpen(false);
    }
  };

  const handleSidebarCreate = () => {
    if (executeCreatePlaylist(sidebarNewName)) {
      setSidebarNewName('');
      setIsCreatingInSidebar(false);
    }
  };

  const handleDeletePlaylist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm("ARE YOU SURE? This will PERMANENTLY DELETE this playlist and its registry index. This action cannot be undone.")) {
      deletePlaylist(id);
      // If currently viewing the playlist, navigate home
      if (location.pathname.includes(`/playlist/${id}`)) {
        navigate('/playlists');
      }
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-4 px-4 py-2.5 rounded-xl font-bold text-sm transition-all group ${
      isActive 
      ? 'bg-blue-600/10 text-blue-400 shadow-[inset_0_0_10px_rgba(37,99,235,0.1)]' 
      : 'text-slate-500 hover:text-white hover:bg-white/5'
    }`;

  const playlistLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center justify-between px-4 py-2 rounded-xl font-bold text-sm transition-all group/item ${
      isActive ? 'bg-white/5 text-white' : 'text-slate-500 hover:text-white'
    }`;

  return (
    <div className={`flex h-screen w-full overflow-hidden ${user?.settings?.theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-[#050510] text-slate-200'}`}>
      
      {/* SIDEBAR */}
      <aside className={`w-[280px] flex-shrink-0 flex flex-col border-r transition-all duration-300 relative z-[60] h-full ${user?.settings?.theme === 'light' ? 'bg-white border-slate-200 shadow-xl' : 'bg-gradient-to-b from-[#0e0e24] to-[#070718] border-slate-800/40'}`}>
        
        {/* LOGO */}
        <div className="p-8 pb-6 flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-2xl shadow-blue-600/30 group-hover:scale-110 transition-transform duration-500">
            <i className="fa-solid fa-bolt"></i>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none text-white">ZETTA</h1>
            <p className="text-[10px] font-black tracking-[2px] text-blue-500 mt-0.5 uppercase">Downloader</p>
          </div>
        </div>

        {/* NAVIGATION WRAPPER */}
        <nav className="flex-1 px-4 pb-4 space-y-6 overflow-y-auto no-scrollbar">
          
          {/* DISCOVER SECTION */}
          <div className="space-y-1">
            <h3 className="px-4 mb-2 text-[10px] font-black text-slate-600 uppercase tracking-[4px]">Discover</h3>
            <NavLink to="/" end className={navLinkClass}>
              <i className="fa-solid fa-house-chimney w-5"></i> Dashboard
            </NavLink>
            <NavLink to="/trending" className={navLinkClass}>
              <i className="fa-solid fa-fire-flame-curved w-5 text-orange-500"></i> Trending
            </NavLink>
            <NavLink to="/charts" className={navLinkClass}>
              <i className="fa-solid fa-chart-simple w-5 text-blue-400"></i> Top Charts
            </NavLink>
            <NavLink to="/recommendations" className={navLinkClass}>
              <i className="fa-solid fa-brain w-5 text-purple-400"></i> Recommendations
            </NavLink>
          </div>

          {/* LIBRARY SECTION */}
          <div className="space-y-1">
            <h3 className="px-4 mb-2 text-[10px] font-black text-slate-600 uppercase tracking-[4px]">Library</h3>
            <NavLink to="/downloader" className={navLinkClass}>
              <i className="fa-solid fa-cloud-arrow-down w-5 text-emerald-500"></i> Recent Downloads
            </NavLink>
            <NavLink to="/favorites" className={navLinkClass}>
              <i className="fa-solid fa-heart w-5 text-red-500"></i> Favorites
            </NavLink>
            <NavLink to="/playlists" className={navLinkClass}>
              <i className="fa-solid fa-layer-group w-5 text-indigo-400"></i> Playlists
            </NavLink>
            <NavLink to="/artists" className={navLinkClass}>
              <i className="fa-solid fa-users w-5 text-amber-500"></i> Artists
            </NavLink>
          </div>

          {/* PLAYLISTS SECTION (Quick Access) */}
          <div className="space-y-1">
            <h3 className="px-4 mb-2 text-[10px] font-black text-slate-600 uppercase tracking-[4px]">Playlists</h3>
            <div className="space-y-1">
              <NavLink to="/playlist/mix1" className={playlistLinkClass}>
                <div className="flex items-center gap-4 truncate">
                  <i className="fa-solid fa-compact-disc w-5 text-indigo-500/60"></i>
                  <span className="truncate">My Mix #1</span>
                </div>
              </NavLink>
              <NavLink to="/playlist/liked" className={playlistLinkClass}>
                <div className="flex items-center gap-4 truncate">
                  <i className="fa-solid fa-heart w-5 text-red-500/60"></i>
                  <span className="truncate">Liked Songs</span>
                </div>
              </NavLink>
              <NavLink to="/vibes/workout" className={playlistLinkClass}>
                <div className="flex items-center gap-4 truncate">
                  <i className="fa-solid fa-dumbbell w-5 text-orange-500/60"></i>
                  <span className="truncate">Workout</span>
                </div>
              </NavLink>
              <NavLink to="/vibes/chill" className={playlistLinkClass}>
                <div className="flex items-center gap-4 truncate">
                  <i className="fa-solid fa-mug-hot w-5 text-blue-500/60"></i>
                  <span className="truncate">Chill Vibes</span>
                </div>
              </NavLink>
              
              {/* Dynamic user playlists */}
              {playlists.map(p => (
                <NavLink key={p.id} to={`/playlist/${p.id}`} className={playlistLinkClass}>
                  <div className="flex items-center gap-4 truncate">
                    <i className="fa-solid fa-folder-music w-5 text-blue-400 opacity-60"></i>
                    <span className="truncate">{p.name}</span>
                  </div>
                  <button 
                    onClick={(e) => handleDeletePlaylist(p.id, e)} 
                    className="opacity-0 group-hover/item:opacity-100 text-slate-600 hover:text-red-500 transition-all p-1"
                    title="Delete Permanently"
                  >
                    <i className="fa-solid fa-trash-can text-[11px]"></i>
                  </button>
                </NavLink>
              ))}

              {/* Inline Create Input */}
              {isCreatingInSidebar && (
                <div className="px-4 py-2 animate-fade-in">
                  <div className="relative">
                    <input 
                      ref={sidebarInputRef}
                      type="text" 
                      value={sidebarNewName}
                      onChange={(e) => setSidebarNewName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSidebarCreate();
                        if (e.key === 'Escape') { setIsCreatingInSidebar(false); setSidebarNewName(''); }
                      }}
                      onBlur={() => { if (!sidebarNewName.trim()) setIsCreatingInSidebar(false); }}
                      placeholder="Name..."
                      className="w-full bg-slate-800 border border-blue-500/30 rounded-lg py-2 pl-3 pr-10 text-xs text-white outline-none"
                    />
                    <button 
                      onClick={handleSidebarCreate}
                      disabled={!sidebarNewName.trim()}
                      className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 bg-blue-600 text-white rounded-md flex items-center justify-center disabled:opacity-30 transition-all active:scale-90"
                    >
                      <i className="fa-solid fa-check text-[10px]"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {!isCreatingInSidebar && (
              <button 
                onClick={() => setIsCreatingInSidebar(true)}
                className="w-full flex items-center gap-4 px-4 py-2 mt-2 rounded-xl font-bold text-sm text-blue-500 hover:text-white hover:bg-blue-600/10 transition-all"
              >
                <i className="fa-solid fa-square-plus w-5"></i> Create New Playlist
              </button>
            )}
          </div>

          {/* TOOLS SECTION */}
          <div className="space-y-1">
            <h3 className="px-4 mb-2 text-[10px] font-black text-slate-600 uppercase tracking-[4px]">Tools</h3>
            <NavLink to="/tools/converter" className={navLinkClass}>
              <i className="fa-solid fa-repeat w-5 text-emerald-400"></i> Converter
            </NavLink>
            <NavLink to="/tools/tag-editor" className={navLinkClass}>
              <i className="fa-solid fa-tags w-5 text-pink-400"></i> Tag Editor
            </NavLink>
            <NavLink to="/tools/audio-editor" className={navLinkClass}>
              <i className="fa-solid fa-sliders w-5 text-purple-400"></i> Audio Editor
            </NavLink>
            <NavLink to="/tools/mobile-sync" className={navLinkClass}>
              <i className="fa-solid fa-mobile-screen w-5 text-blue-500"></i> Mobile Sync
            </NavLink>
          </div>

          {/* ADMIN SECTION */}
          {user?.role === UserRole.ADMIN && (
            <div className="space-y-1 pt-4 border-t border-slate-800/20">
              <h3 className="px-4 mb-2 text-[10px] font-black text-amber-600 uppercase tracking-[4px]">Governance</h3>
              <NavLink to="/admin" className={navLinkClass}>
                <i className="fa-solid fa-user-shield w-5"></i> Admin Terminal
              </NavLink>
            </div>
          )}
        </nav>

        {/* FOOTER */}
        <Footer />

        {/* LOGOUT */}
        <div className="p-6 pt-2 border-t border-slate-800/20 bg-slate-900/5">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <i className="fas fa-power-off"></i> Terminate Session
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative overflow-hidden h-full">
        <header className={`h-20 border-b flex items-center justify-between px-8 z-50 flex-shrink-0 ${user?.settings?.theme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#050510]/80 backdrop-blur-2xl border-slate-800/40'}`}>
          <div className="flex-1 max-w-xl relative" ref={searchRef}>
            <div className="relative">
              <i className={`fas ${isSearching ? 'fa-circle-notch animate-spin' : 'fa-search'} absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-all`}></i>
              <input 
                type="text" 
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search library nodes..."
                className={`w-full bg-transparent border-none py-2 pl-12 pr-4 text-sm outline-none transition-all ${user?.settings?.theme === 'light' ? 'text-slate-900' : 'text-white placeholder:text-slate-700'}`}
              />
            </div>

            {searchQuery && searchResults !== null && (
              <div className="absolute top-full left-0 w-full mt-3 bg-[#0a0a20] border border-slate-800 rounded-[30px] shadow-[0_30px_60px_rgba(0,0,0,0.8)] p-3 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/50 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-[3px] text-slate-500">Autocomplete Pulse</span>
                  <span className="text-[9px] bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full font-black">LIVE</span>
                </div>
                
                <div className="max-h-[400px] overflow-y-auto no-scrollbar space-y-1">
                  {searchResults.length > 0 ? (
                    searchResults.map(item => (
                      <div 
                        key={item.id} 
                        className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-2xl cursor-pointer transition-all group border border-transparent hover:border-slate-800"
                        onClick={() => handleResultClick(item)}
                      >
                        <img src={item.thumbnail} className="w-11 h-11 rounded-xl object-cover shadow-lg group-hover:scale-105 transition-transform" alt={item.title} />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-black text-white truncate group-hover:text-blue-400 transition-colors uppercase tracking-tight">{item.title}</p>
                          <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest truncate">{item.artist}</p>
                        </div>
                        <i className="fa-solid fa-chevron-right text-[10px] text-slate-700 group-hover:text-blue-500 transition-colors"></i>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center">
                      <i className="fa-solid fa-ghost text-4xl text-slate-800 mb-3 block opacity-20"></i>
                      <p className="text-[10px] font-black uppercase tracking-[5px] text-slate-600">No matching nodes found</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 relative">
            <div className="relative" ref={playlistDropdownRef}>
              <button 
                onClick={() => setIsPlaylistsOpen(!isPlaylistsOpen)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isPlaylistsOpen ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
              >
                <i className="fa-solid fa-layer-group"></i>
                Quick Access
              </button>

              {isPlaylistsOpen && (
                <div className="absolute top-full right-0 mt-3 w-80 bg-[#0a0a20] border border-slate-800 rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.8)] p-6 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h5 className="font-black text-[11px] uppercase tracking-[4px] text-slate-500">Quick Clusters</h5>
                    <span className="text-[9px] font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">{playlists.length} Nodes</span>
                  </div>

                  {/* Create New Playlist Input in Dropdown */}
                  <form onSubmit={handleDropdownCreate} className="mb-6 relative group">
                    <input 
                      type="text" 
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      placeholder="New Cluster Name..."
                      className="w-full bg-slate-900 border border-slate-800 focus:border-blue-600/50 rounded-xl py-3 pl-4 pr-12 text-xs text-white outline-none transition-all placeholder:text-slate-700"
                    />
                    <button 
                      type="submit"
                      disabled={!newPlaylistName.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center disabled:opacity-30 disabled:grayscale transition-all hover:bg-blue-500 shadow-lg shadow-blue-600/20 active:scale-90"
                    >
                      <i className="fa-solid fa-plus text-[10px]"></i>
                    </button>
                  </form>

                  {/* Playlist List in Dropdown */}
                  <div className="space-y-2 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
                    {playlists.length > 0 ? (
                      playlists.map(p => (
                        <div 
                          key={p.id}
                          onClick={() => { navigate(`/playlist/${p.id}`); setIsPlaylistsOpen(false); }}
                          className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-slate-800/50 cursor-pointer transition-all group/p"
                        >
                          <img src={p.coverImage} className="w-10 h-10 rounded-xl object-cover shadow-lg border border-slate-800" alt={p.name} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-white truncate group-hover/p:text-blue-400 transition-colors uppercase tracking-tight">{p.name}</p>
                            <p className="text-[9px] text-slate-600 uppercase font-bold tracking-widest">{p.itemIds.length} Nodes</p>
                          </div>
                          <button 
                            onClick={(e) => handleDeletePlaylist(p.id, e)}
                            className="w-8 h-8 flex items-center justify-center text-slate-800 hover:text-red-500 opacity-0 group-hover/p:opacity-100 transition-all"
                            title="Delete Permanently"
                          >
                            <i className="fa-solid fa-trash-can text-[11px]"></i>
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center opacity-30">
                        <i className="fa-solid fa-folder-open text-3xl mb-3 block"></i>
                        <p className="text-[10px] font-black uppercase tracking-[3px]">Registry Empty</p>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => { navigate('/playlists'); setIsPlaylistsOpen(false); }}
                    className="w-full mt-6 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest border-t border-slate-800/50 pt-4 transition-colors"
                  >
                    Open Full Registry <i className="fa-solid fa-arrow-right-long ml-2"></i>
                  </button>
                </div>
              )}
            </div>

            <button onClick={() => navigate('/settings')} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all"><i className="fas fa-gear text-lg"></i></button>
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/account')}>
               <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors leading-none">{user?.username}</p>
                  <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1">Authorized</p>
               </div>
               <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username || 'U'}&background=random`} className="w-10 h-10 rounded-xl border border-slate-800 shadow-lg group-hover:border-blue-500/50" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar bg-transparent">
          <div className="p-8 md:p-12 min-h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
