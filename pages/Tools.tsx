
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStoredLibrary, updateMediaItem, triggerDirectDownload } from '../services/mockApi';
import { MediaItem } from '../types';

const ToolsPage: React.FC = () => {
  const { toolId } = useParams<{ toolId?: string }>();
  const navigate = useNavigate();
  const [library, setLibrary] = useState<MediaItem[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<MediaItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [targetFormat, setTargetFormat] = useState('mp3');
  
  // Tag Editor State
  const [editData, setEditData] = useState<Partial<MediaItem>>({});

  useEffect(() => {
    setLibrary(getStoredLibrary());
  }, []);

  useEffect(() => {
    if (selectedTrack) {
      setEditData({
        title: selectedTrack.title,
        artist: selectedTrack.artist,
        album: selectedTrack.album || '',
        genre: selectedTrack.genre || '',
        year: selectedTrack.year || ''
      });
    }
  }, [selectedTrack]);

  const handleStartConversion = () => {
    if (!selectedTrack) return;
    setIsProcessing(true);
    let prog = 0;
    const interval = setInterval(() => {
      prog += 5;
      setProcessProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsProcessing(false);
          setProcessProgress(0);
          
          // CRITICAL: Direct Media Download (No ZIP)
          triggerDirectDownload(selectedTrack, targetFormat);
          
          alert(`Conversion Protocol Finalized. Your ${targetFormat.toUpperCase()} file has been deployed to local disk.`);
        }, 300);
      }
    }, 80);
  };

  const handleSaveTags = () => {
    if (!selectedTrack) return;
    updateMediaItem(selectedTrack.id, editData);
    setLibrary(getStoredLibrary());
    alert("Metadata Synced Successfully.");
  };

  const renderConverter = () => (
    <div className="space-y-8 animate-fade-in">
       <div className="bg-slate-900 border border-slate-800 p-10 rounded-[40px] shadow-3xl flex flex-col space-y-10">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Music Converter Terminal</h3>
            <p className="text-slate-500 max-w-lg mx-auto">Guided conversion protocol. Choose a node from your library to begin extraction.</p>
          </div>

          {!selectedTrack ? (
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[4px] ml-2">Choose Node from Registry</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                {library.map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => setSelectedTrack(item)}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/30 border border-transparent hover:border-blue-500/30 hover:bg-slate-800/60 transition-all text-left"
                  >
                    <img src={item.thumbnail} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm truncate">{item.title}</p>
                      <p className="text-[10px] text-slate-500 font-black uppercase truncate">{item.artist}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-xl mx-auto w-full space-y-8 animate-in zoom-in-95 duration-200">
               <div className="bg-slate-800/50 p-6 rounded-[32px] flex items-center gap-6 border border-slate-700">
                  <img src={selectedTrack.thumbnail} className="w-20 h-20 rounded-2xl object-cover shadow-2xl" />
                  <div className="flex-1">
                    <h4 className="text-xl font-black text-white italic truncate">{selectedTrack.title}</h4>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{selectedTrack.artist}</p>
                  </div>
                  <button onClick={() => setSelectedTrack(null)} className="text-slate-600 hover:text-white transition-colors">
                    <i className="fa-solid fa-rotate-left"></i> Change
                  </button>
               </div>

               {isProcessing ? (
                 <div className="space-y-6 py-10 text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="space-y-2">
                       <p className="text-blue-500 font-black uppercase tracking-[4px] text-xs">Transcoding Node: {processProgress}%</p>
                       <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 transition-all duration-150" style={{ width: `${processProgress}%` }}></div>
                       </div>
                    </div>
                    <p className="text-slate-500 italic text-sm">Deploying high-fidelity audio stream to disk...</p>
                 </div>
               ) : (
                 <div className="space-y-8 bg-slate-950/40 p-8 rounded-[32px] border border-slate-800">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Select Target Modality</label>
                      <div className="grid grid-cols-2 gap-4">
                        {['mp3', 'wav', 'aac', 'flac', 'mp4'].map(fmt => (
                          <button 
                            key={fmt}
                            onClick={() => setTargetFormat(fmt)}
                            className={`py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all border ${targetFormat === fmt ? 'bg-blue-600 border-blue-400 text-white shadow-xl shadow-blue-600/20' : 'bg-slate-800 text-slate-500 border-slate-700 hover:bg-slate-700'}`}
                          >
                            {fmt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button 
                      onClick={handleStartConversion} 
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl uppercase text-sm tracking-widest shadow-2xl shadow-blue-600/30 transition-all active:scale-95"
                    >
                      Initialize Conversion & Download
                    </button>
                 </div>
               )}
            </div>
          )}
       </div>
    </div>
  );

  const renderTagEditor = () => (
    <div className="space-y-8 animate-fade-in">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-slate-900 border border-slate-800 p-10 rounded-[40px] shadow-3xl space-y-8">
             <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">Library Nodes</h3>
             <div className="space-y-3 max-h-[450px] overflow-y-auto no-scrollbar pr-2">
                {library.map(item => (
                  <div key={item.id} onClick={() => setSelectedTrack(item)} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${selectedTrack?.id === item.id ? 'bg-blue-600/10 border-blue-500/50 shadow-xl' : 'bg-slate-800/20 border-transparent hover:border-slate-700'}`}>
                     <img src={item.thumbnail} className="w-12 h-12 rounded-xl object-cover" />
                     <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm truncate">{item.title}</p>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{item.artist}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 p-10 rounded-[40px] shadow-3xl space-y-6">
             {selectedTrack ? (
               <div className="space-y-6">
                  <div className="flex items-center gap-6 mb-8">
                     <img src={selectedTrack.thumbnail} className="w-24 h-24 rounded-3xl object-cover border-4 border-slate-800 shadow-2xl" />
                     <button className="bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black px-6 py-2 rounded-xl uppercase tracking-widest transition-all">Modify Cover</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Title</label>
                        <input type="text" value={editData.title || ''} onChange={e => setEditData({...editData, title: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white outline-none focus:border-blue-500" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Artist</label>
                        <input type="text" value={editData.artist || ''} onChange={e => setEditData({...editData, artist: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white outline-none focus:border-blue-500" />
                     </div>
                  </div>
                  <button onClick={handleSaveTags} className="w-full bg-pink-600 hover:bg-pink-500 text-white font-black py-4 rounded-2xl uppercase text-xs tracking-widest transition-all active:scale-95">Apply Metadata Sync</button>
               </div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-50">
                  <i className="fa-solid fa-tags text-7xl mb-6"></i>
                  <p className="font-black uppercase tracking-widest text-slate-600">Select Node to Edit</p>
               </div>
             )}
          </div>
       </div>
    </div>
  );

  const renderMobileSync = () => (
    <div className="space-y-8 animate-fade-in">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-slate-900 border border-slate-800 p-10 rounded-[40px] shadow-3xl flex flex-col items-center text-center space-y-6">
             <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/20 rounded-3xl flex items-center justify-center text-blue-500 text-3xl">
                <i className="fa-solid fa-qrcode"></i>
             </div>
             <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">QR Extraction Hub</h4>
             <p className="text-slate-500 text-sm">Scan this terminal node with your Zetta Mobile App to establish an immediate cloud uplink.</p>
             <div className="bg-white p-6 rounded-[32px] shadow-2xl">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=zetta-sync-node-8892" className="w-36 h-36" />
             </div>
             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest animate-pulse">Waiting for Uplink...</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-10 rounded-[40px] shadow-3xl space-y-8">
             <h4 className="text-2xl font-black text-white italic uppercase tracking-tight">Active Devices</h4>
             <div className="space-y-4">
                {[
                  { name: 'iPhone 15 Pro', status: 'Synced', icon: 'fa-mobile-screen' },
                  { name: 'Galaxy Tab S9', status: 'Syncing...', icon: 'fa-tablet-screen' }
                ].map((d, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-slate-800/30 border border-slate-800 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <i className={`fa-solid ${d.icon} text-blue-500`}></i>
                      <span className="font-bold text-white text-sm">{d.name}</span>
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${d.status === 'Synced' ? 'bg-green-600/10 text-green-500' : 'bg-blue-600/10 text-blue-500 animate-pulse'}`}>{d.status}</span>
                  </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );

  return (
    <div className="space-y-12 animate-fade-in pb-32">
       <header>
          <h2 className="text-4xl font-black text-white italic tracking-tight uppercase">Terminal <span className="text-blue-500">Suite</span></h2>
          <p className="text-slate-400 font-medium italic">Advanced extraction and synchronization tools.</p>
       </header>

       {toolId === 'converter' && renderConverter()}
       {toolId === 'tag-editor' && renderTagEditor()}
       {toolId === 'audio-editor' && <p className="text-center py-40 text-slate-500 font-black uppercase tracking-[5px]">Audio Trimmer coming soon...</p>}
       {toolId === 'mobile-sync' && renderMobileSync()}
       
       {!toolId && (
         <div className="py-20 text-center opacity-40">
            <p className="font-black uppercase tracking-[5px] text-slate-500">Select specialized terminal from sidebar</p>
         </div>
       )}
    </div>
  );
};

export default ToolsPage;
