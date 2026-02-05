
import React from 'react';

interface WelcomeModalProps {
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-blue-500/30 rounded-[32px] p-8 md:p-12 max-w-2xl w-full text-center shadow-2xl animate-fade-in">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center text-white text-4xl mx-auto mb-8 shadow-xl shadow-blue-600/20">
          <i className="fas fa-star"></i>
        </div>
        
        <h2 className="text-4xl font-extrabold text-white mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Welcome to Z Downloader!
        </h2>
        
        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
          Your ultimate all-in-one media solution. Download music, videos, and manage your library instantly in our professional suite.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left">
          {[
            { icon: 'fa-cloud-download-alt', title: 'Download Anything', desc: 'Music, videos, reels from any platform' },
            { icon: 'fa-music', title: 'Built-in Player', desc: 'Play downloaded media instantly' },
            { icon: 'fa-user-circle', title: 'Personal Profile', desc: 'Save preferences and history' },
            { icon: 'fa-sync', title: 'Sync Everywhere', desc: 'Access your library on any device' }
          ].map((feat, i) => (
            <div key={i} className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50 flex items-start gap-4">
              <i className={`fas ${feat.icon} text-2xl text-blue-500 mt-1`}></i>
              <div>
                <h4 className="font-bold text-white mb-1">{feat.title}</h4>
                <p className="text-xs text-slate-500">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98]"
        >
          Start Using Z Downloader
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;
