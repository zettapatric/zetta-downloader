
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  getAdminAnalytics, getAuditLogs, getStoredLibrary, getStoredUsers, getStoredArtists, getStoredNews,
  deleteUser, deleteMediaItem, deleteArtist, deleteNews, toggleUserStatus, addMediaItem, 
  resetMediaStats, logAudit, addArtist, addNews,
  getFastTrackItems, saveFastTrackItems, addFastTrackItem, removeFastTrackItem, FastTrackItem
} from '../services/mockApi';
import { User, MediaItem, Artist, NewsArticle, AuditLog, AdminAnalytics, GenreType } from '../types';

type TabType = 'overview' | 'users' | 'media' | 'creators' | 'broadcast' | 'telemetry' | 'fasttrack';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [library, setLibrary] = useState<MediaItem[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [fastTrack, setFastTrack] = useState<FastTrackItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal / Form States
  const [showModal, setShowModal] = useState<'song' | 'artist' | 'news' | 'user' | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Controlled Form Inputs
  const [songForm, setSongForm] = useState({ title: '', artist: '', genre: 'CHILL' as GenreType, url: '', uploadType: 'url' as 'url' | 'file' });
  const [artistForm, setArtistForm] = useState({ name: '', genre: '', bio: '', image: '' });
  const [newsForm, setNewsForm] = useState({ title: '', category: '', excerpt: '', content: '' });
  const [fastTrackUrl, setFastTrackUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fastTrackFileInputRef = useRef<HTMLInputElement>(null);

  const refresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setAnalytics(getAdminAnalytics());
      setUsers(getStoredUsers());
      setLibrary(getStoredLibrary());
      setArtists(getStoredArtists());
      setNews(getStoredNews());
      setLogs(getAuditLogs());
      setFastTrack(getFastTrackItems());
      setIsRefreshing(false);
    }, 300);
  };

  useEffect(() => {
    refresh();
    const events = ['zetta-library-updated', 'zetta-logs-updated', 'zetta-user-updated', 'zetta-artists-updated', 'zetta-news-updated', 'zetta-fast-track-updated'];
    events.forEach(e => window.addEventListener(e, refresh));
    return () => events.forEach(e => window.removeEventListener(e, refresh));
  }, []);

  const filteredItems = useMemo(() => {
    const q = searchTerm.toLowerCase();
    switch (activeTab) {
      case 'users': return users.filter(u => u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
      case 'media': return library.filter(s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q));
      case 'creators': return artists.filter(a => a.name.toLowerCase().includes(q));
      case 'broadcast': return news.filter(n => n.title.toLowerCase().includes(q));
      case 'fasttrack': return fastTrack.filter(f => f.title.toLowerCase().includes(q));
      default: return [];
    }
  }, [searchTerm, activeTab, users, library, artists, news, fastTrack]);

  const handleExportCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    const csv = "data:text/csv;charset=utf-8," + Object.keys(data[0]).join(",") + "\n" + data.map(r => Object.values(r).map(v => `"${v}"`).join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `${filename}_export.csv`;
    link.click();
    logAudit('Admin', `Data Export Protocol Initialized: ${filename}`, 'Governance');
  };

  const handleSongSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songForm.url && songForm.uploadType === 'url') {
      alert("Please provide an audio source URL.");
      return;
    }
    
    setFormLoading(true);
    const newItem: MediaItem = {
      id: 's-' + Date.now(),
      title: songForm.title,
      artist: songForm.artist,
      genre: songForm.genre,
      url: songForm.url,
      thumbnail: `https://picsum.photos/seed/${Date.now()}/400/400`,
      duration: 180,
      format: 'mp3',
      size: 5000000,
      isFavorite: false,
      isVisible: true,
      downloadDate: new Date().toISOString(),
      downloadCount: 0,
      favoriteCount: 0,
      playCount: 0
    };
    addMediaItem(newItem);
    setSongForm({ title: '', artist: '', genre: 'CHILL', url: '', uploadType: 'url' });
    setShowModal(null);
    setFormLoading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSongForm({ ...songForm, url, title: songForm.title || file.name.split('.')[0] });
    }
  };

  // Fast Track Handlers
  const handleFastTrackBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Fixed: Explicitly typed 'file' as 'File' to avoid 'unknown' type errors when accessing properties like 'type' and 'name'.
    Array.from(files).forEach((file: File) => {
      if (file.type.startsWith('audio/')) {
        const item: FastTrackItem = {
          id: 'ft-' + Math.random().toString(36).substr(2, 9),
          title: file.name,
          url: URL.createObjectURL(file),
          timestamp: Date.now()
        };
        addFastTrackItem(item);
      }
    });
    if (fastTrackFileInputRef.current) fastTrackFileInputRef.current.value = '';
  };

  const handleFastTrackUrlAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fastTrackUrl.trim()) return;
    
    const item: FastTrackItem = {
      id: 'ft-' + Math.random().toString(36).substr(2, 9),
      title: fastTrackUrl.split('/').pop()?.split('?')[0] || 'Remote Stream',
      url: fastTrackUrl,
      timestamp: Date.now()
    };
    addFastTrackItem(item);
    setFastTrackUrl('');
  };

  const handleFastTrackDownload = (item: FastTrackItem) => {
    // We don't prevent default, the link is a download link
    // But we trigger removal after a short delay so the browser can start the download
    setTimeout(() => {
      removeFastTrackItem(item.id);
      logAudit('Admin', `Fast-Track Node Extracted: ${item.title}`, 'Deployment');
    }, 500);
  };

  const handleArtistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    const newArtist: Artist = {
      id: 'a-' + Date.now(),
      ...artistForm,
      stats: '0 Monthly Pulse',
      officialLink: '#'
    };
    addArtist(newArtist);
    setArtistForm({ name: '', genre: '', bio: '', image: '' });
    setShowModal(null);
    setFormLoading(false);
  };

  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    const newArticle: NewsArticle = {
      id: Date.now(),
      ...newsForm,
      date: 'Just Now',
      image: `https://picsum.photos/seed/${Date.now()}/800/400`
    } as any;
    addNews(newArticle);
    setNewsForm({ title: '', category: '', excerpt: '', content: '' });
    setShowModal(null);
    setFormLoading(false);
  };

  const renderTabBtn = (id: TabType, label: string) => (
    <button 
      onClick={() => { setActiveTab(id); setSearchTerm(''); }}
      className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[2px] transition-all whitespace-nowrap ${activeTab === id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
    >
      {label}
    </button>
  );

  const renderActionHeader = (title: string, onAdd?: () => void) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 bg-slate-900/30 p-3 rounded-xl border border-slate-800/50">
      <h3 className="text-xs font-black text-white uppercase tracking-[4px] italic">{title}</h3>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="relative flex-1 sm:w-40">
          <i className="fa-solid fa-search absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600 text-[8px]"></i>
          <input 
            type="text" placeholder="Filter pulse..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1 pl-7 pr-2 text-[9px] text-white outline-none focus:border-blue-500 transition-all"
          />
        </div>
        {onAdd && <button onClick={onAdd} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-lg text-[8px] font-black uppercase active:scale-95 transition-all">Add Node</button>}
        <button onClick={() => handleExportCSV(filteredItems, title.toLowerCase().replace(/\s/g, '_'))} className="bg-slate-800 text-slate-500 hover:text-white px-3 py-1 rounded-lg text-[8px] font-black uppercase transition-all">Export</button>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { lab: 'Nodes', val: users.length, icon: 'fa-users', color: 'text-blue-500' },
          { lab: 'Extractions', val: analytics?.totalDownloads || 0, icon: 'fa-cloud-arrow-down', color: 'text-emerald-500' },
          { lab: 'Sentiment', val: analytics?.totalFavorites || 0, icon: 'fa-heart', color: 'text-pink-500' },
          { lab: 'Velocity', val: `+${analytics?.growthRate}%`, icon: 'fa-chart-line', color: 'text-amber-500' }
        ].map((s, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800 p-3 rounded-xl flex items-center gap-3 group hover:border-blue-500/20 transition-all shadow-sm">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${s.color} bg-white/5`}><i className={`fa-solid ${s.icon}`}></i></div>
            <div>
              <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">{s.lab}</p>
              <p className="text-base font-black text-white italic">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 bg-slate-900/40 border border-slate-800 p-5 rounded-2xl h-52 flex flex-col relative overflow-hidden shadow-inner">
          <div className="flex justify-between items-center mb-6 relative z-10">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[3px]">Global Extraction Velocity</p>
            <span className="text-[8px] text-blue-500 font-black uppercase animate-pulse">Live Uplink Active</span>
          </div>
          <div className="flex-1 flex items-end justify-between gap-2 px-1 relative z-10">
            {analytics?.dailyActiveUsers.map((v, i) => (
              <div key={i} className="flex-1 bg-blue-600/10 group relative rounded-t-lg transition-all hover:bg-blue-600/40" style={{ height: `${(v / 150) * 100}%` }}>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-slate-950 px-1.5 py-0.5 rounded text-[7px] font-black opacity-0 group-hover:opacity-100 shadow-lg">{v} Nodes</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-[7px] font-black text-slate-700 uppercase tracking-widest relative z-10"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-600/5 blur-3xl pointer-events-none"></div>
        </div>

        <div className="lg:col-span-4 bg-slate-900/40 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-inner">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[3px] mb-6">Neural Delta Health</p>
          <div className="space-y-4">
            {['Registry Depth', 'Cloud Integrity', 'Node Scaling'].map((l, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase"><span>{l}</span><span className="text-white">{85+i*4}%</span></div>
                <div className="h-1 bg-slate-950 rounded-full overflow-hidden p-px border border-white/5"><div className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)] rounded-full transition-all duration-1000" style={{width: `${85+i*4}%`}}></div></div>
              </div>
            ))}
          </div>
          <button onClick={refresh} className="mt-6 w-full py-1.5 bg-slate-800 hover:bg-white hover:text-slate-950 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">Flush Logs</button>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-4 animate-fade-in">
      {renderActionHeader("Identity Terminal")}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left text-[10px]">
          <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-600 uppercase font-black tracking-[3px]">
            <tr><th className="px-4 py-3">Node Identity</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Last Sync</th><th className="px-4 py-3 text-right">Governance</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30">
            {filteredItems.map((u: any) => (
              <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-4 py-2.5 flex items-center gap-3">
                  <img src={u.avatar} className="w-7 h-7 rounded-lg object-cover border border-slate-800 group-hover:border-blue-500/40 transition-all" alt="" />
                  <div><p className="font-black text-white italic uppercase tracking-tighter">{u.username}</p><p className="text-[8px] text-slate-600 font-mono">{u.email}</p></div>
                </td>
                <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${u.status === 'active' ? 'bg-green-600/10 text-green-500' : 'bg-red-600/10 text-red-500'}`}>{u.status}</span></td>
                <td className="px-4 py-2.5 text-slate-600 italic">{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}</td>
                <td className="px-4 py-2.5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all scale-90">
                    <button onClick={() => toggleUserStatus(u.id)} className="w-7 h-7 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded-lg transition-all" title="Toggle Access"><i className="fa-solid fa-lock-open"></i></button>
                    <button onClick={() => { if(confirm("Terminate Entity?")) deleteUser(u.id); }} className="w-7 h-7 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-lg transition-all" title="Terminate Node"><i className="fa-solid fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderMedia = () => (
    <div className="space-y-4 animate-fade-in">
      {renderActionHeader("Media Node Registry", () => setShowModal('song'))}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {(filteredItems as MediaItem[]).map(s => (
          <div key={s.id} className="bg-slate-900 border border-slate-800 p-3 rounded-xl group hover:border-emerald-500/30 transition-all flex flex-col relative overflow-hidden shadow-sm">
            <div className="relative aspect-square mb-3 overflow-hidden rounded-lg">
              <img src={s.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                 <button onClick={() => { const win = window.open(s.url, '_blank'); win?.focus(); }} className="w-7 h-7 bg-white text-slate-950 rounded-lg shadow-xl active:scale-90 transition-all" title="Preview Audio"><i className="fa-solid fa-play text-[10px]"></i></button>
                 <button onClick={() => resetMediaStats(s.id)} className="w-7 h-7 bg-white text-slate-950 rounded-lg shadow-xl active:scale-90 transition-all" title="Reset Stats"><i className="fa-solid fa-rotate text-[10px]"></i></button>
                 <button onClick={() => deleteMediaItem(s.id)} className="w-7 h-7 bg-red-600 text-white rounded-lg shadow-xl active:scale-90 transition-all" title="Delete"><i className="fa-solid fa-trash text-[10px]"></i></button>
              </div>
            </div>
            <h4 className="text-[10px] font-black text-white truncate uppercase italic mb-0.5">{s.title}</h4>
            <p className="text-[8px] text-slate-600 uppercase truncate font-bold">{s.artist}</p>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-800/50">
               <span className="text-[7px] text-emerald-500 font-black">{(s.downloadCount || 0)} D</span>
               <span className="text-[7px] text-pink-500 font-black">{(s.favoriteCount || 0)} F</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCreators = () => (
    <div className="space-y-4 animate-fade-in">
      {renderActionHeader("Identity Creators Cluster", () => setShowModal('artist'))}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {(filteredItems as Artist[]).map(a => (
          <div key={a.id} className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl group hover:border-indigo-500/30 text-center transition-all shadow-sm">
            <div className="relative mb-3 mx-auto w-14 h-14">
              <img src={a.image} className="w-full h-full rounded-full object-cover border-2 border-slate-800 group-hover:border-indigo-500 transition-all" alt="" />
              <div className="absolute -right-1 -bottom-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-slate-900 text-white text-[8px] opacity-0 group-hover:opacity-100 transition-opacity"><i className="fa-solid fa-pen"></i></div>
            </div>
            <h5 className="text-[9px] font-black text-white uppercase italic truncate leading-none mb-1">{a.name}</h5>
            <p className="text-[7px] text-indigo-500 font-black uppercase tracking-widest truncate">{a.genre}</p>
            <button onClick={() => { if(confirm("Purge Artist Node?")) deleteArtist(a.id); }} className="mt-2 text-[7px] text-slate-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><i className="fa-solid fa-trash-can mr-1"></i>Purge</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBroadcast = () => (
    <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-4 animate-fade-in">
      {renderActionHeader("Broadcast Signal Hub", () => setShowModal('news'))}
      <div className="space-y-2 max-h-[500px] overflow-y-auto no-scrollbar pr-1">
        {(filteredItems as NewsArticle[]).map(n => (
          <div key={n.id} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-5 group hover:bg-slate-800/40 transition-all border-l-4 border-l-transparent hover:border-l-amber-600">
            <img src={n.image} className="w-20 h-12 rounded-lg object-cover shadow-lg" alt="" />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                 <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest">{n.category}</span>
                 <span className="text-[8px] text-slate-700 font-bold uppercase">{n.date}</span>
              </div>
              <h4 className="text-[11px] font-black text-white truncate italic uppercase tracking-tight group-hover:text-amber-500 transition-colors">{n.title}</h4>
              <p className="text-[9px] text-slate-500 truncate italic font-medium">{n.excerpt}</p>
            </div>
            <div className="flex gap-2 scale-90 opacity-0 group-hover:opacity-100 transition-all">
               <button onClick={() => deleteNews(n.id)} className="w-8 h-8 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-lg transition-all"><i className="fa-solid fa-trash-can text-[10px]"></i></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTelemetry = () => (
    <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 font-mono shadow-2xl relative overflow-hidden">
      <div className="absolute right-0 top-0 w-64 h-64 bg-blue-600/5 blur-[100px] pointer-events-none"></div>
      <div className="flex justify-between items-center mb-6 border-b border-slate-900 pb-4 relative z-10">
        <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[4px] flex items-center gap-3">
          <i className="fa-solid fa-terminal animate-pulse"></i> Telemetry Pulse Feed
        </h4>
        <div className="flex gap-2">
           <button onClick={refresh} className="w-7 h-7 bg-slate-900 hover:bg-blue-600 text-slate-600 hover:text-white rounded-lg transition-all"><i className="fa-solid fa-rotate text-[10px]"></i></button>
           <button onClick={() => handleExportCSV(logs, 'telemetry_log')} className="px-3 bg-slate-900 hover:bg-white hover:text-slate-950 text-slate-600 font-black uppercase text-[8px] rounded-lg tracking-widest transition-all">Export Log</button>
        </div>
      </div>
      <div className="space-y-1.5 max-h-[400px] overflow-y-auto no-scrollbar pr-1 relative z-10">
        {logs.map(l => (
          <div key={l.id} className="text-[9px] flex gap-5 py-1.5 px-3 rounded-lg hover:bg-white/[0.02] border-b border-white/[0.01] last:border-none group">
            <span className="text-slate-700 shrink-0 font-bold">[{new Date(l.timestamp).toLocaleTimeString()}]</span>
            <span className="text-blue-500 font-black shrink-0 tracking-widest uppercase text-[8px] bg-blue-500/10 px-2 py-0.5 rounded">{l.details}</span>
            <span className="text-white font-black shrink-0 italic uppercase tracking-tighter group-hover:text-blue-400 transition-colors">{l.username}</span>
            <span className="text-slate-500 font-medium truncate group-hover:text-slate-300 transition-colors">{l.action}</span>
            <span className="ml-auto text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity font-bold">{l.ip}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Added missing renderFastTrack function to handle fast-track deployment queue
  const renderFastTrack = () => (
    <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-4 animate-fade-in">
      {renderActionHeader("Fast-Track Deployment Queue")}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-950/40 p-5 rounded-xl border border-slate-800">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[3px] mb-4">Remote Uplink (URL)</p>
          <form onSubmit={handleFastTrackUrlAdd} className="flex gap-2">
            <input 
              type="text" 
              value={fastTrackUrl}
              onChange={e => setFastTrackUrl(e.target.value)}
              placeholder="Paste direct audio URL..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-[10px] text-white outline-none focus:border-blue-500"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all">Add</button>
          </form>
        </div>
        
        <div className="bg-slate-950/40 p-5 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[3px] mb-4">Bulk Disk Extraction</p>
          <button 
            onClick={() => fastTrackFileInputRef.current?.click()}
            className="w-full bg-slate-800 hover:bg-white hover:text-slate-950 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border border-white/5"
          >
            Browse Local Nodes
          </button>
          <input 
            type="file" 
            ref={fastTrackFileInputRef} 
            onChange={handleFastTrackBulkUpload} 
            className="hidden" 
            multiple 
            accept="audio/*" 
          />
        </div>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto no-scrollbar pr-1">
        {(filteredItems as FastTrackItem[]).map(item => (
          <div key={item.id} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-4 group hover:bg-slate-800/40 transition-all">
            <div className="w-8 h-8 bg-blue-600/10 rounded-lg flex items-center justify-center text-blue-500 text-xs">
              <i className="fa-solid fa-cloud-arrow-down"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[10px] font-black text-white truncate uppercase italic">{item.title}</h4>
              <p className="text-[8px] text-slate-600 font-mono truncate">{item.url}</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
              <a 
                href={item.url} 
                download={item.title} 
                onClick={() => handleFastTrackDownload(item)}
                className="w-8 h-8 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white rounded-lg flex items-center justify-center transition-all"
              >
                <i className="fa-solid fa-download text-[10px]"></i>
              </a>
              <button 
                onClick={() => removeFastTrackItem(item.id)}
                className="w-8 h-8 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-lg transition-all"
              >
                <i className="fa-solid fa-trash-can text-[10px]"></i>
              </button>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="py-20 text-center opacity-20">
            <i className="fa-solid fa-microchip text-4xl mb-3"></i>
            <p className="text-[9px] font-black uppercase tracking-widest">Fast-Track Queue Empty</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderModal = () => {
    if (!showModal) return null;
    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 animate-fade-in">
        <div className="bg-slate-900 border border-slate-800 max-w-lg w-full rounded-[40px] p-8 shadow-3xl relative overflow-hidden animate-in zoom-in-95 duration-200">
           <button onClick={() => setShowModal(null)} className="absolute top-6 right-6 w-10 h-10 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white rounded-full flex items-center justify-center transition-all"><i className="fa-solid fa-xmark"></i></button>
           <div className="mb-8">
              <h3 className="text-xl font-black text-white italic uppercase tracking-[3px] mb-2">Deploy <span className="text-blue-500">{showModal}</span> Node</h3>
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Registry Injection protocol active.</p>
           </div>
           
           {showModal === 'song' && (
             <form className="space-y-4" onSubmit={handleSongSubmit}>
                <div className="space-y-1">
                   <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity Title</label>
                   <input required value={songForm.title} onChange={e => setSongForm({...songForm, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-blue-600" placeholder="Cyber Pulse" />
                </div>
                <div className="space-y-1">
                   <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Artist Cluster</label>
                   <input required value={songForm.artist} onChange={e => setSongForm({...songForm, artist: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-blue-600" placeholder="Bruce Melodie" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Source Protocol</label>
                  <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1 gap-1">
                    <button type="button" onClick={() => setSongForm({...songForm, uploadType: 'url'})} className={`flex-1 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${songForm.uploadType === 'url' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}>Audio URL</button>
                    <button type="button" onClick={() => { setSongForm({...songForm, uploadType: 'file'}); fileInputRef.current?.click(); }} className={`flex-1 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${songForm.uploadType === 'file' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}>Local Disk</button>
                  </div>
                </div>

                {songForm.uploadType === 'url' ? (
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Audio Source URL (.mp3, .wav)</label>
                    <input required value={songForm.url} onChange={e => setSongForm({...songForm, url: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-blue-600 font-mono" placeholder="https://example.com/audio.mp3" />
                  </div>
                ) : (
                  <div className="p-4 bg-slate-950 border-2 border-dashed border-slate-800 rounded-xl text-center">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">{songForm.url ? 'File Synced: Ready' : 'Choose local audio node'}</p>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[10px] bg-blue-600/10 text-blue-500 px-4 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all font-black uppercase">Browse Files</button>
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="audio/*" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Genre Registry</label>
                      <select required value={songForm.genre} onChange={e => setSongForm({...songForm, genre: e.target.value as GenreType})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-blue-600">
                         {['CHILL', 'WORKOUT', 'LOVE', 'PARTY', 'TIKTOK SOUNDS', 'DJ PACKS', 'REELS'].map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Download Permission</label>
                      <div className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-[10px] text-green-500 font-black uppercase tracking-widest flex items-center gap-2">
                        <i className="fa-solid fa-circle-check"></i> Enabled
                      </div>
                   </div>
                </div>
                
                {songForm.url && (
                  <div className="pt-2">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Sync Preview</p>
                    <audio controls src={songForm.url} className="w-full h-8 opacity-80" />
                  </div>
                )}

                <button type="submit" disabled={formLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[5px] transition-all active:scale-[0.98] mt-4 disabled:opacity-50">
                   {formLoading ? 'Syncing...' : 'Initialize Sync'}
                </button>
             </form>
           )}

           {showModal === 'artist' && (
             <form className="space-y-4" onSubmit={handleArtistSubmit}>
                <div className="space-y-1">
                   <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Creator Name</label>
                   <input required value={artistForm.name} onChange={e => setArtistForm({...artistForm, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-indigo-600" placeholder="Stage Name..." />
                </div>
                <div className="space-y-1">
                   <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Genre Signature</label>
                   <input required value={artistForm.genre} onChange={e => setArtistForm({...artistForm, genre: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-indigo-600" placeholder="Afro-fusion" />
                </div>
                <div className="space-y-1">
                   <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Dossier Bio</label>
                   <textarea rows={3} required value={artistForm.bio} onChange={e => setArtistForm({...artistForm, bio: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-indigo-600 resize-none" placeholder="Short biography insight..." />
                </div>
                <button type="submit" disabled={formLoading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[5px] transition-all active:scale-[0.98] mt-4">
                   {formLoading ? 'Injecting...' : 'Commit Registry'}
                </button>
             </form>
           )}

           {showModal === 'news' && (
             <form className="space-y-4" onSubmit={handleNewsSubmit}>
                <div className="space-y-1">
                   <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Headline</label>
                   <input required value={newsForm.title} onChange={e => setNewsForm({...newsForm, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-amber-600" placeholder="Breakthrough Pulse..." />
                </div>
                <div className="space-y-1">
                   <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Signal Category</label>
                   <input required value={newsForm.category} onChange={e => setNewsForm({...newsForm, category: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-amber-600" placeholder="Global Update" />
                </div>
                <div className="space-y-1">
                   <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Excerpt Signal</label>
                   <input required value={newsForm.excerpt} onChange={e => setNewsForm({...newsForm, excerpt: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-amber-600" placeholder="Brief summary for feed..." />
                </div>
                <div className="space-y-1">
                   <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Content Stream</label>
                   <textarea rows={4} required value={newsForm.content} onChange={e => setNewsForm({...newsForm, content: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-amber-600 resize-none" placeholder="Detailed signal content..." />
                </div>
                <button type="submit" disabled={formLoading} className="w-full bg-amber-600 hover:bg-amber-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[5px] transition-all active:scale-[0.98] mt-4">
                   {formLoading ? 'Broadcasting...' : 'Broadcast Signal'}
                </button>
             </form>
           )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-fade-in pb-20">
      <header className="flex flex-col lg:flex-row justify-between items-center bg-slate-900/50 border border-slate-800/80 p-3.5 rounded-2xl gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg shadow-2xl shadow-blue-600/30 group-hover:scale-105 transition-transform"><i className="fa-solid fa-user-shield"></i></div>
          <div>
            <h1 className="text-base font-black text-white italic tracking-tighter uppercase leading-none">Master <span className="text-blue-500">Command</span> Node</h1>
            <p className="text-[8px] font-bold text-slate-600 uppercase tracking-[4px] mt-1.5 italic">Session Secure: Authenticated Phase 8</p>
          </div>
        </div>
        <nav className="flex bg-slate-950/90 p-1 rounded-xl border border-slate-800/60 gap-1 overflow-x-auto no-scrollbar max-w-full lg:max-w-none">
          {renderTabBtn('overview', 'Pulse')}
          {renderTabBtn('users', 'Identity')}
          {renderTabBtn('media', 'Registry')}
          {renderTabBtn('creators', 'Creators')}
          {renderTabBtn('broadcast', 'Signal')}
          {renderTabBtn('telemetry', 'Telemetry')}
          {renderTabBtn('fasttrack', 'Fast-Track')}
        </nav>
      </header>

      <main className="min-h-[500px]">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'media' && renderMedia()}
        {activeTab === 'creators' && renderCreators()}
        {activeTab === 'broadcast' && renderBroadcast()}
        {activeTab === 'telemetry' && renderTelemetry()}
        {activeTab === 'fasttrack' && renderFastTrack()}
      </main>

      {renderModal()}

      <div className="fixed bottom-10 right-10 z-[500]">
        <button 
          onClick={refresh} 
          className={`w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-[0_15px_35px_rgba(37,99,235,0.4)] hover:scale-110 active:scale-95 transition-all group ${isRefreshing ? 'animate-spin' : ''}`}
        >
          <i className="fa-solid fa-rotate text-xl group-hover:rotate-180 transition-transform duration-700"></i>
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
