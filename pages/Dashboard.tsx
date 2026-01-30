
import React from 'react';
import { Link } from 'react-router-dom';
import { MediaItem, User } from '../types';
import { Icons } from '../constants';

interface DashboardProps {
  user: User | null;
  library: MediaItem[];
  onPlayTrack: (track: MediaItem) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, library, onPlayTrack }) => {
  const stats = [
    { label: 'Total Downloads', value: library.length, icon: <Icons.Downloader />, color: 'bg-blue-600' },
    { label: 'Favorites', value: library.filter(t => t.isFavorite).length, icon: <Icons.Favorite filled />, color: 'bg-red-600' },
    { label: 'Storage Used', value: '1.2 GB', icon: <i className="fa-solid fa-hard-drive"></i>, color: 'bg-emerald-600' },
    { label: 'Playlists', value: '4', icon: <Icons.Playlists />, color: 'bg-amber-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.username}!</h2>
        <p className="text-slate-400">Here's what's happening with your media library today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all hover:shadow-xl hover:-translate-y-1">
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white mb-4 shadow-lg`}>
              {stat.icon}
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Recent Downloads</h3>
            <Link to="/library" className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors">
              View All
            </Link>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4">Track</th>
                    <th className="px-6 py-4">Artist</th>
                    <th className="px-6 py-4">Format</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {library.slice(0, 5).map((track) => (
                    <tr key={track.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={track.thumbnail} className="w-10 h-10 rounded-lg object-cover" />
                          <span className="text-sm font-semibold text-white">{track.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">{track.artist}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold uppercase">{track.format}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => onPlayTrack(track)}
                          className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Icons.Play />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {library.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-slate-600 italic">
                        No recent activity recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions / Featured */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-xl font-bold text-white mb-2">Smart Tools</h4>
              <p className="text-blue-100/80 text-sm mb-4">Try our AI-powered audio tag editor and trim your clips instantly.</p>
              <Link to="/tools" className="inline-block bg-white text-blue-600 px-6 py-2.5 rounded-xl text-sm font-black hover:shadow-2xl transition-all active:scale-95">
                Try Tools
              </Link>
            </div>
            <i className="fa-solid fa-wand-sparkles absolute -right-4 -bottom-4 text-8xl text-white/10 group-hover:scale-110 transition-transform duration-500"></i>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
             <h4 className="font-bold text-white mb-4">Quick Links</h4>
             <ul className="space-y-4">
               <li>
                <Link to="/help" className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors group">
                  <i className="fa-solid fa-circle-question w-5 text-blue-500 group-hover:scale-110 transition-transform"></i> 
                  Help Center
                </Link>
               </li>
               <li>
                <Link to="/privacy" className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors group">
                  <i className="fa-solid fa-shield-halved w-5 text-blue-500 group-hover:scale-110 transition-transform"></i> 
                  Privacy Policy
                </Link>
               </li>
               <li>
                <Link to="/tos" className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors group">
                  <i className="fa-solid fa-file-contract w-5 text-blue-500 group-hover:scale-110 transition-transform"></i> 
                  Terms of Service
                </Link>
               </li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
