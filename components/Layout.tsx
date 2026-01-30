
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { Icons, APP_NAME } from '../constants';
import { User, MediaItem } from '../types';
import { getStoredLibrary } from '../services/mockApi';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    const library = getStoredLibrary();
    const filtered = library.filter(item => 
      item.title.toLowerCase().includes(q.toLowerCase()) || 
      item.artist.toLowerCase().includes(q.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const navGroups = [
    {
      title: 'Discover',
      icon: <i className="fas fa-compass"></i>,
      items: [
        { to: '/', icon: <i className="fas fa-home"></i>, label: 'Dashboard' },
        { to: '/downloader', icon: <i className="fas fa-bolt"></i>, label: 'Downloader' },
      ]
    },
    {
      title: 'Library',
      icon: <i className="fas fa-folder"></i>,
      items: [
        { to: '/library', icon: <i className="fas fa-music"></i>, label: 'All Media' },
        { to: '/playlists', icon: <i className="fas fa-play-circle"></i>, label: 'Playlists' },
      ]
    },
    {
      title: 'Tools & Help',
      icon: <i className="fas fa-tools"></i>,
      items: [
        { to: '/tools', icon: <i className="fas fa-screwdriver-wrench"></i>, label: 'Audio Suite' },
        { to: '/support', icon: <i className="fas fa-headset"></i>, label: 'Support Hub' },
        { to: '/help', icon: <i className="fas fa-question-circle"></i>, label: 'Help Center' },
      ]
    }
  ];

  return (
    <div className={`flex h-screen overflow-hidden text-slate-200 ${user?.settings?.theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950'}`}>
      {/* Sidebar */}
      <aside className={`w-64 flex-shrink-0 flex flex-col border-r ${user?.settings?.theme === 'light' ? 'bg-white border-slate-200' : 'glass border-slate-800/50'}`}>
        <div className="p-8 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-blue-600/20">
            <i className="fa-solid fa-bolt"></i>
          </div>
          <h1 className={`text-xl font-black tracking-tight uppercase italic ${user?.settings?.theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{APP_NAME}</h1>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto no-scrollbar">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2">
              <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[3px] flex items-center gap-2">
                {group.icon} {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                        isActive 
                          ? 'bg-blue-600/10 text-blue-500 border border-blue-600/20 shadow-xl' 
                          : 'text-slate-500 hover:text-slate-400 hover:bg-slate-800/10'
                      }`
                    }
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-bold text-sm">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}

          {user?.role === 'ADMIN' && (
            <div className="pt-4 border-t border-slate-800/50">
              <p className="px-4 text-[10px] font-black text-amber-500 uppercase tracking-[3px] mb-2">
                <i className="fas fa-shield-halved"></i> Global Control
              </p>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-amber-600/10 text-amber-400 border border-amber-600/20' 
                      : 'text-slate-500 hover:text-white hover:bg-slate-800/40'
                  }`
                }
              >
                <span className="text-lg"><i className="fas fa-terminal"></i></span>
                <span className="font-bold text-sm">Command Center</span>
              </NavLink>
            </div>
          )}
        </nav>

        <div className="p-6 space-y-2 border-t border-slate-800/50">
          <Link to="/tos" className="block px-4 py-2 text-[10px] font-bold text-slate-600 hover:text-slate-400 uppercase tracking-widest transition-all">
             Protocol & Terms
          </Link>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold text-sm"
          >
            <Icons.Logout />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col relative overflow-hidden ${user?.settings?.theme === 'light' ? 'bg-slate-50' : 'bg-slate-950/40'}`}>
        <header className={`h-20 border-b flex items-center justify-between px-8 z-50 ${user?.settings?.theme === 'light' ? 'bg-white border-slate-200' : 'glass border-slate-800/50'}`}>
          <div className="flex items-center gap-8 flex-1">
             <div className="relative w-full max-w-xl group" ref={searchRef}>
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors"></i>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Global network search..." 
                  className={`w-full border rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:ring-1 focus:ring-blue-500/50 outline-none transition-all ${
                    user?.settings?.theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-900' : 'bg-slate-900/50 border-slate-700/30 text-slate-200'
                  }`}
                />
                
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 animate-fade-in z-[100]">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3 px-2">Library Hits</p>
                    <div className="space-y-2">
                      {searchResults.map(item => (
                        <button 
                          key={item.id} 
                          onClick={() => { setSearchResults([]); navigate('/library'); }}
                          className="w-full flex items-center gap-4 p-2 rounded-xl hover:bg-slate-800 transition-all text-left"
                        >
                          <img src={item.thumbnail} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <p className="text-sm font-bold text-white leading-tight">{item.title}</p>
                            <p className="text-xs text-slate-500">{item.artist}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
             </div>
             
             <nav className="hidden xl:flex items-center gap-6">
                <Link to="/tools" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-all">Audio Engine</Link>
                <Link to="/support" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-all">Support</Link>
                <Link to="/help" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-all">Docs</Link>
             </nav>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <button onClick={() => navigate('/support')} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800/50 transition-all">
                  <i className="fa-solid fa-headset text-xl"></i>
               </button>
               <button onClick={() => navigate('/settings')} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800/50 transition-all">
                  <i className="fa-solid fa-gear text-xl"></i>
               </button>
            </div>

            <div className="h-8 w-px bg-slate-800/50"></div>

            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className={`flex items-center gap-3 p-1.5 pr-4 border rounded-2xl hover:border-blue-500/30 transition-all group ${
                  user?.settings?.theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg- slate-800/40 border-slate-700/50'
                }`}
              >
                <img src={user?.avatar} alt="Avatar" className="w-8 h-8 rounded-xl object-cover shadow-lg" />
                <div className="text-left hidden md:block">
                  <p className={`text-xs font-black leading-tight ${user?.settings?.theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{user?.username}</p>
                  <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">{user?.plan || 'Free'} Tier</p>
                </div>
                <i className={`fas fa-chevron-down text-[10px] text-slate-500 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`}></i>
              </button>

              {showUserDropdown && (
                <div className="absolute top-full right-0 mt-4 w-72 bg-slate-900 border border-slate-800 rounded-[28px] shadow-2xl p-4 animate-fade-in z-[100]">
                   <div className="flex items-center gap-4 p-4 border-b border-slate-800 mb-2">
                      <img src={user?.avatar} className="w-12 h-12 rounded-2xl shadow-xl" />
                      <div>
                        <p className="font-bold text-white leading-tight">{user?.username}</p>
                        <p className="text-xs text-slate-500 truncate w-32 italic">{user?.email}</p>
                      </div>
                   </div>
                   <div className="py-2 space-y-1">
                     <button onClick={() => { navigate('/account'); setShowUserDropdown(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800 flex items-center gap-3 text-sm font-bold text-slate-400 hover:text-white transition-all">
                       <i className="fas fa-id-card-clip w-5 text-blue-500"></i> Account Identity
                     </button>
                     <button onClick={() => { navigate('/privacy'); setShowUserDropdown(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800 flex items-center gap-3 text-sm font-bold text-slate-400 hover:text-white transition-all">
                       <i className="fas fa-fingerprint w-5 text-blue-500"></i> Vault & Security
                     </button>
                     <button onClick={() => { navigate('/settings'); setShowUserDropdown(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800 flex items-center gap-3 text-sm font-bold text-slate-400 hover:text-white transition-all">
                       <i className="fas fa-microchip w-5 text-blue-500"></i> Preferences
                     </button>
                     <div className="h-px bg-slate-800 my-2 mx-4"></div>
                     <button 
                      onClick={onLogout}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-500/10 flex items-center gap-3 text-sm font-bold text-red-400 transition-all"
                     >
                      <i className="fas fa-power-off w-5"></i> Logout Node
                     </button>
                   </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
          <div className="flex-1 p-10">
            {children}
          </div>
          
          <footer className="mt-auto px-10 py-10 border-t border-slate-800/30 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-600">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-sm font-black">Z</div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Zetta Infrastructure v2.5.4</p>
             </div>
             <div className="flex gap-8">
                <Link to="/help" className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-500 transition-colors">Help Center</Link>
                <Link to="/support" className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-500 transition-colors">Contact Node</Link>
                <Link to="/tos" className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-500 transition-colors">Protocol</Link>
                <Link to="/privacy" className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-500 transition-colors">Vault</Link>
             </div>
             <div className="flex gap-4">
                <a href="#" className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center hover:text-blue-400 hover:border-blue-400 transition-all"><i className="fab fa-twitter"></i></a>
                <a href="#" className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center hover:text-blue-400 hover:border-blue-400 transition-all"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center hover:text-blue-400 hover:border-blue-400 transition-all"><i className="fab fa-instagram"></i></a>
             </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Layout;
