
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';
import { 
  getAdminAnalytics, 
  getAuditLogs, 
  getStoredLibrary, 
  deleteAuditLog, 
  updateAuditLog, 
  insertAuditLog 
} from '../services/mockApi';
import { AuditLog, AdminAnalytics } from '../types';

const AdminPanel: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'analytics' | 'logs'>('overview');
  
  // CRUD States
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [editingLog, setEditingLog] = useState<AuditLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<AuditLog>>({});

  // Simulated database/env password
  const ADMIN_KEY = "zetta-admin-2025";

  useEffect(() => {
    if (isAuthorized) {
      refreshData();
    }
  }, [isAuthorized]);

  const refreshData = () => {
    setLogs(getAuditLogs());
    setAnalytics(getAdminAnalytics());
  };

  const handleAuthorize = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_KEY) {
      setIsAuthorized(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  const handleDeleteLog = (id: string) => {
    if (window.confirm('Are you sure you want to purge this login record from history?')) {
      deleteAuditLog(id);
      refreshData();
    }
  };

  const handleOpenModal = (log?: AuditLog) => {
    if (log) {
      setEditingLog(log);
      setFormData(log);
    } else {
      setEditingLog(null);
      setFormData({
        id: Math.random().toString(36).substr(2, 9),
        action: 'System Event',
        userId: 'u1',
        timestamp: new Date().toISOString(),
        ip: '192.168.1.1',
        location: 'San Francisco, US'
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLog) {
      updateAuditLog(editingLog.id, formData);
    } else {
      insertAuditLog(formData as AuditLog);
    }
    setIsModalOpen(false);
    refreshData();
  };

  const stats = [
    { label: 'System Access Count', value: analytics?.totalLogins || 0, icon: 'fa-fingerprint', color: 'bg-emerald-600' },
    { label: 'Active Pro Users', value: '482', icon: 'fa-crown', color: 'bg-amber-600' },
    { label: 'Total Node Events', value: analytics?.totalSystemEvents || 0, icon: 'fa-microchip', color: 'bg-blue-600' },
    { label: 'Infrastructure Health', value: '99.9%', icon: 'fa-heart-pulse', color: 'bg-indigo-600' },
  ];

  const SimpleLineChart = ({ data, color }: { data: { count: number }[], color: string }) => {
    if (!data || data.length === 0) return null;
    const max = Math.max(...data.map(d => d.count));
    const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d.count / max) * 100}`).join(' ');
    return (
      <svg viewBox="0 0 100 100" className="w-full h-32 mt-4" preserveAspectRatio="none">
        <polyline fill="none" stroke={color} strokeWidth="3" points={points} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center animate-fade-in">
        <div className="max-w-md w-full bg-slate-900 border border-red-500/20 rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600"></div>
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-red-600/10 text-red-500 rounded-3xl flex items-center justify-center text-4xl mx-auto border border-red-500/20">
              <i className="fas fa-shield-halved"></i>
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Restricted Area</h2>
              <p className="text-slate-500 text-sm mt-2">Not everyone can enter the Zetta Admin Node. Authorization key required for access.</p>
            </div>
            
            <form onSubmit={handleAuthorize} className="space-y-4">
              <div className="relative">
                <i className="fas fa-key absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"></i>
                <input 
                  type="password" 
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Security Protocol Key"
                  className={`w-full bg-slate-950 border ${error ? 'border-red-500' : 'border-slate-800'} rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500 transition-all text-center tracking-[0.5em]`}
                />
              </div>
              {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Access Denied: Invalid Protocol Key</p>}
              <button 
                type="submit"
                className="w-full bg-white text-slate-950 font-black py-4 rounded-2xl hover:bg-slate-200 transition-all shadow-xl active:scale-[0.98]"
              >
                REQUEST UPLINK
              </button>
            </form>
            
            <p className="text-[9px] text-slate-700 font-bold uppercase tracking-[4px]">Access attempts are logged by IP: 192.168.1.1</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in pb-20 relative">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tight uppercase">System <span className="text-blue-500">Node Controller</span></h1>
          <p className="text-slate-400 font-medium">Global infrastructure management and dynamic user oversight.</p>
        </div>
        <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
          {['overview', 'users', 'analytics', 'logs'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'overview' && analytics && (
        <div className="space-y-10 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] hover:border-slate-700 transition-all shadow-xl group">
                <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-2xl group-hover:scale-110 transition-transform`}>
                  <i className={`fas ${s.icon} text-2xl`}></i>
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[3px] mb-1">{s.label}</p>
                <h4 className="text-3xl font-black text-white">{s.value}</h4>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[32px]">
              <h3 className="text-xl font-bold text-white mb-6 italic border-b border-slate-800 pb-4">Dynamic Access Growth</h3>
              <SimpleLineChart data={analytics.dailyLogins} color="#3b82f6" />
              <div className="flex justify-between mt-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                 <span>Rolling Period</span>
                 <span>Peak Utilization</span>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[32px]">
              <h3 className="text-xl font-bold text-white mb-6 italic border-b border-slate-800 pb-4">Global Network Traffic</h3>
              <SimpleLineChart data={analytics.dailyDownloads} color="#10b981" />
              <div className="flex justify-between mt-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                 <span>Standard Tier</span>
                 <span>Enterprise Peak</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="space-y-6 animate-fade-in">
           <div className="bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl">
             <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-950/20">
                <div>
                  <h3 className="text-xl font-bold text-white italic">Access Management Console</h3>
                  <p className="text-xs text-slate-500 font-medium">Create, edit, or purge security login history.</p>
                </div>
                <button 
                  onClick={() => handleOpenModal()}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2"
                >
                  <i className="fas fa-plus"></i> Insert Login Record
                </button>
             </div>
             
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-slate-950/50">
                   <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                     <th className="px-8 py-6">Identity & IP</th>
                     <th className="px-8 py-6">Operation</th>
                     <th className="px-8 py-6">Geo-Location</th>
                     <th className="px-8 py-6">Temporal Stamp</th>
                     <th className="px-8 py-6 text-right">Node Controls</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800/50">
                   {logs.map(log => (
                     <tr key={log.id} className="hover:bg-slate-800/30 transition-colors group">
                       <td className="px-8 py-6">
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-blue-500">
                             <i className="fas fa-shield"></i>
                           </div>
                           <div>
                             <p className="text-sm font-bold text-white">{log.userId}</p>
                             <p className="text-[10px] text-slate-500 font-mono">{log.ip}</p>
                           </div>
                         </div>
                       </td>
                       <td className="px-8 py-6">
                         <span className="px-3 py-1 bg-blue-600/10 text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-600/20">
                           {log.action}
                         </span>
                       </td>
                       <td className="px-8 py-6">
                         <div className="flex items-center gap-2">
                            <i className="fas fa-location-dot text-slate-600 text-xs"></i>
                            <span className="text-xs font-bold text-slate-300">{log.location}</span>
                         </div>
                       </td>
                       <td className="px-8 py-6">
                         <p className="text-xs font-black text-slate-500 uppercase">{new Date(log.timestamp).toLocaleDateString()}</p>
                         <p className="text-[10px] text-slate-700">{new Date(log.timestamp).toLocaleTimeString()}</p>
                       </td>
                       <td className="px-8 py-6 text-right">
                         <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleOpenModal(log)}
                              className="w-9 h-9 bg-slate-800 hover:bg-slate-700 text-blue-500 rounded-lg flex items-center justify-center transition-all"
                            >
                              <i className="fas fa-pen-to-square"></i>
                            </button>
                            <button 
                              onClick={() => handleDeleteLog(log.id)}
                              className="w-9 h-9 bg-slate-800 hover:bg-red-900/40 text-red-500 rounded-lg flex items-center justify-center transition-all"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && analytics && (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] shadow-2xl">
               <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 italic">
                  <i className="fas fa-fire text-orange-500"></i>
                  Content Velocity
               </h3>
               <div className="space-y-6">
                  {analytics.mostDownloaded.map((item, idx) => (
                    <div key={idx} className="space-y-2">
                       <div className="flex justify-between text-sm">
                          <span className="font-bold text-slate-300">{item.title}</span>
                          <span className="font-black text-blue-400">{item.count} Nodes</span>
                       </div>
                       <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${(item.count / analytics.mostDownloaded[0].count) * 100}%` }}></div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] shadow-2xl">
               <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 italic">
                  <i className="fas fa-search text-blue-500"></i>
                  Search Infrastructure Trends
               </h3>
               <div className="flex flex-wrap gap-3">
                  {analytics.mostSearched.map((s, idx) => (
                    <div key={idx} className="bg-slate-800 border border-slate-700 px-6 py-3 rounded-2xl flex items-center gap-3 group hover:border-blue-500/50 transition-all cursor-default">
                       <span className="text-sm font-bold text-white">{s.query}</span>
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-blue-400">{s.count}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      )}

      {/* CRUD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 animate-fade-in">
           <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-[40px] p-10 shadow-3xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              <h3 className="text-2xl font-black text-white mb-8 italic uppercase tracking-tight">
                {editingLog ? 'Update Protocol Record' : 'Inject New Access Node'}
              </h3>
              
              <form onSubmit={handleSaveLog} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] ml-1">User Identity</label>
                      <input 
                        type="text" 
                        required
                        value={formData.userId}
                        onChange={(e) => setFormData({...formData, userId: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white outline-none focus:border-blue-500 transition-all"
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] ml-1">Protocol Action</label>
                      <select 
                        value={formData.action}
                        onChange={(e) => setFormData({...formData, action: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white outline-none focus:border-blue-500 transition-all"
                      >
                         <option>User Login</option>
                         <option>System Event</option>
                         <option>Library Audit</option>
                         <option>Security Alert</option>
                      </select>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] ml-1">IP Address</label>
                      <input 
                        type="text" 
                        required
                        value={formData.ip}
                        onChange={(e) => setFormData({...formData, ip: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white font-mono outline-none focus:border-blue-500 transition-all"
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] ml-1">Location Hub</label>
                      <input 
                        type="text" 
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white outline-none focus:border-blue-500 transition-all"
                      />
                   </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] ml-1">Timestamp Iso-8601</label>
                    <input 
                      type="text" 
                      required
                      value={formData.timestamp}
                      onChange={(e) => setFormData({...formData, timestamp: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white font-mono outline-none focus:border-blue-500 transition-all"
                    />
                </div>

                <div className="flex gap-4 pt-4">
                   <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all"
                   >
                     Cancel Protocol
                   </button>
                   <button 
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20"
                   >
                     Commit Changes
                   </button>
                </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
