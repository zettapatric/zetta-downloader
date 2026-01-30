
import React, { useState } from 'react';
import { Icons } from '../constants';

const ToolsPage: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const tools = [
    {
      id: 'converter',
      title: 'Format Converter',
      description: 'Convert between MP3, WAV, FLAC, and OGG with high-fidelity output.',
      icon: <i className="fa-solid fa-arrows-rotate text-3xl"></i>,
      color: 'from-blue-600 to-indigo-700'
    },
    {
      id: 'editor',
      title: 'Tag Editor',
      description: 'AI-assisted metadata tagging for your music library. Fix artists and albums automatically.',
      icon: <i className="fa-solid fa-tags text-3xl"></i>,
      color: 'from-purple-600 to-pink-700'
    },
    {
      id: 'trimmer',
      title: 'Audio Trimmer',
      description: 'Quickly cut and trim audio files. Perfect for ringtones or sample extraction.',
      icon: <i className="fa-solid fa-scissors text-3xl"></i>,
      color: 'from-emerald-600 to-teal-700'
    },
    {
      id: 'analyzer',
      title: 'BPM Analyzer',
      description: 'Detect tempo and key of your music tracks automatically using our smart algorithm.',
      icon: <i className="fa-solid fa-wave-square text-3xl"></i>,
      color: 'from-amber-600 to-orange-700'
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <header>
        <h2 className="text-4xl font-black text-white mb-2">Audio Processing Suite</h2>
        <p className="text-slate-400">Professional-grade tools to manage and edit your media collection.</p>
      </header>

      {activeDemo ? (
        <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-12 shadow-2xl animate-fade-in relative overflow-hidden">
          <button 
            onClick={() => setActiveDemo(null)}
            className="absolute top-8 right-8 text-slate-500 hover:text-white transition-all"
          >
            <i className="fas fa-times text-2xl"></i>
          </button>
          
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <h3 className="text-3xl font-black text-white italic">Demo: {tools.find(t => t.id === activeDemo)?.title}</h3>
            
            <div className="aspect-video bg-slate-800 rounded-3xl border-4 border-dashed border-slate-700 flex flex-col items-center justify-center p-10 hover:border-blue-500/50 transition-all cursor-pointer group">
              <i className="fas fa-file-audio text-6xl text-slate-600 mb-6 group-hover:scale-110 transition-transform"></i>
              <p className="text-slate-400 font-bold uppercase tracking-widest mb-2">Drop a file to begin</p>
              <p className="text-xs text-slate-600">Free limit: 300MB per file</p>
            </div>

            <div className="bg-amber-600/10 border border-amber-600/20 p-6 rounded-2xl flex items-center gap-6 text-left">
              <i className="fas fa-crown text-3xl text-amber-500"></i>
              <div>
                <h5 className="font-black text-white">Upgrade to Pro</h5>
                <p className="text-xs text-slate-500 leading-relaxed">Free users are limited to 5 processes per day. Get unlimited high-fidelity conversions and batch processing with Zetta Pro.</p>
              </div>
              <button className="bg-amber-600 hover:bg-amber-500 text-white font-black px-6 py-2 rounded-xl text-xs transition-all flex-shrink-0">Upgrade Now</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tools.map((tool) => (
            <div key={tool.id} className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 hover:border-slate-700 transition-all group relative overflow-hidden flex flex-col justify-between">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tool.color} opacity-10 rounded-bl-full group-hover:opacity-20 transition-opacity`}></div>
              <div>
                <div className={`w-16 h-16 bg-gradient-to-br ${tool.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl`}>
                  {tool.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{tool.title}</h3>
                <p className="text-slate-400 leading-relaxed mb-8">{tool.description}</p>
              </div>
              <button 
                onClick={() => setActiveDemo(tool.id)}
                className="flex items-center gap-2 font-bold text-blue-500 hover:text-blue-400 transition-colors w-fit group"
              >
                Launch Tool
                <i className="fa-solid fa-arrow-right-long group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="bg-blue-600/10 border border-blue-600/20 p-10 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h4 className="text-2xl font-black text-white mb-2 italic">Mobile Sync Cloud</h4>
          <p className="text-slate-400 max-w-lg">Sync your processed library to your mobile device instantly. No cables required, just a secure sync code.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-blue-600/20 transition-all active:scale-95">
          Generate Cloud Code
        </button>
      </div>
    </div>
  );
};

export default ToolsPage;
