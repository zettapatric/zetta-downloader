
import React, { useMemo } from 'react';
import { MediaItem, User, GenreType } from '../types';
import SongCard from '../components/SongCard';
import { trackPlayback } from '../services/mockApi';

interface DashboardProps {
  user: User | null;
  library: MediaItem[];
  onPlayTrack: (track: MediaItem) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, library, onPlayTrack }) => {
  const GENRES: GenreType[] = ['CHILL', 'WORKOUT', 'LOVE', 'PARTY', 'TIKTOK SOUNDS', 'DJ PACKS', 'REELS'];

  // Sorting genres by user affinity (highest engagement first)
  const sortedGenres = useMemo(() => {
    if (!user) return GENRES;
    return [...GENRES].sort((a, b) => (user.affinity[b] || 0) - (user.affinity[a] || 0));
  }, [user]);

  const handlePlay = (track: MediaItem) => {
    trackPlayback(track.genre);
    onPlayTrack(track);
  };

  return (
    <div className="space-y-16 animate-fade-in pb-40">
      {/* Dynamic Hero Section */}
      <section className="bg-gradient-to-br from-blue-900/40 to-slate-950 border border-blue-500/20 rounded-[50px] p-12 relative overflow-hidden group">
        <div className="relative z-10 max-w-2xl space-y-6">
          <span className="bg-blue-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[4px]">Neural Experience</span>
          <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">
            {user?.username.split(' ')[0]}'s <br/><span className="text-blue-500">Pulse</span>
          </h1>
          <p className="text-slate-400 text-xl font-medium italic">
            Dashboard reorganized based on your <span className="text-white font-bold">{sortedGenres[0]}</span> affinity.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 blur-3xl pointer-events-none">
          <div className="w-full h-full bg-blue-600 rounded-full animate-pulse"></div>
        </div>
      </section>

      {/* Dynamic Genre Sections */}
      {sortedGenres.map((genre, idx) => {
        const items = library.filter(i => i.genre === genre && i.isVisible);
        if (items.length === 0 && idx > 2) return null; // Hide empty sections if they aren't top affinity

        return (
          <section key={genre} className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-800/50 pb-6">
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 flex items-center justify-center rounded-2xl text-xl ${idx === 0 ? 'bg-blue-600 shadow-[0_0_20px_#2563eb]' : 'bg-slate-800'}`}>
                  <i className={`fas ${
                    genre === 'CHILL' ? 'fa-couch' : 
                    genre === 'WORKOUT' ? 'fa-dumbbell' : 
                    genre === 'LOVE' ? 'fa-heart' : 
                    genre === 'PARTY' ? 'fa-champagne-glasses' : 
                    genre === 'TIKTOK SOUNDS' ? 'fa-music' : 
                    genre === 'DJ PACKS' ? 'fa-compact-disc' : 'fa-video'
                  }`}></i>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white italic tracking-tight uppercase">{genre}</h3>
                  <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">
                    {user?.affinity[genre] || 0} Synapses • {items.length} Identity Nodes
                  </p>
                </div>
              </div>
              <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-white transition-colors">
                Open Full Registry <i className="fa-solid fa-arrow-right-long ml-2"></i>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {items.length > 0 ? items.slice(0, 5).map(song => (
                <SongCard 
                  key={song.id} 
                  song={song} 
                  onPlay={() => handlePlay(song)}
                  onDownload={() => {}} 
                  onViewCover={() => {}}
                  onViewGallery={() => {}}
                  onViewDetails={() => {}}
                />
              )) : (
                <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-800/50 rounded-[32px] opacity-30">
                  <p className="font-black uppercase tracking-[5px] text-slate-500">No content nodes in {genre} registry</p>
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default Dashboard;
