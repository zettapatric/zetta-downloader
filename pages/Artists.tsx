
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface ArtistNode {
  id: string;
  name: string;
  genre: string;
  bio: string;
  stats: string;
  image: string;
  officialLink: string;
  songs: string[];
}

const ArtistsPage: React.FC = () => {
  const [selectedArtist, setSelectedArtist] = useState<ArtistNode | null>(null);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [extendedBio, setExtendedBio] = useState<string | null>(null);

  const artists: ArtistNode[] = [
    {
      id: 'a1',
      name: 'Bruce Melodie',
      genre: 'Afro-beat / R&B',
      bio: 'Known as "The New King", Bruce Melodie is a multiple award-winning artist and the first Rwandan to perform at major global arenas like the Trace Awards.',
      stats: '1.4M+ Monthly Pulse',
      image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=600',
      officialLink: 'https://www.youtube.com/@BruceMelodieOfficial',
      songs: ['Katerina', 'Ikinya', 'When She Dance', 'Sawa Sawa']
    },
    {
      id: 'a2',
      name: 'Meddy',
      genre: 'R&B / Soul',
      bio: 'Meddy is a pioneer of the modern R&B movement in Rwanda. His hit "Slowly" remains one of the most streamed Rwandan songs of all time globally.',
      stats: '950K+ Monthly Pulse',
      image: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=600',
      officialLink: 'https://www.youtube.com/@MeddyOfficial',
      songs: ['Slowly', 'Holy Spirit', 'Queen of Sheba', 'My Vow']
    },
    {
      id: 'a3',
      name: 'The Ben',
      genre: 'Pop / Afro-Soul',
      bio: 'A powerhouse vocalist known for his romantic ballads and high-energy performances. The Ben is a central figure in the East African music scene.',
      stats: '1.1M+ Monthly Pulse',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600',
      officialLink: 'https://www.youtube.com/@TheBenOfficial',
      songs: ['Vazi', 'Can’t Get Enough', 'Habibi', 'Fine Baby']
    },
    {
      id: 'a4',
      name: 'Ariel Wayz',
      genre: 'Alternative / R&B',
      bio: 'One of the most versatile voices in Kigali, Ariel Wayz blends soulful vocals with experimental production, leading the new wave of feminine artistry.',
      stats: '420K+ Monthly Pulse',
      image: 'https://images.unsplash.com/photo-1516715667182-779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600&seed=ariel',
      officialLink: 'https://www.youtube.com/@ArielWayz',
      songs: ['Away', 'Good Luck', 'La Vida Loca', '10 Days']
    },
    {
      id: 'a5',
      name: 'Juno Kizigenza',
      genre: 'Afro-fusion / Drill',
      bio: 'Juno is celebrated for his unique storytelling and genre-bending sound that captures the raw energy of Nyamirambo and the Kigali nightlife.',
      stats: '680K+ Monthly Pulse',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600&seed=juno',
      officialLink: 'https://www.youtube.com/@JunoKizigenza',
      songs: ['Solid', 'Nazubaye', 'Kuruma', 'Igitangaza']
    },
    {
      id: 'a6',
      name: 'Chriss Eazy',
      genre: 'Pop / Afro-beat',
      bio: 'The "Inyogo" hitmaker who brought a fresh visual aesthetic and catchy melodies to the Rwandan mainstream, dominating TikTok and radio charts.',
      stats: '510K+ Monthly Pulse',
      image: 'https://images.unsplash.com/photo-1514525253361-bee8718a74a2?auto=format&fit=crop&q=80&w=600&seed=eazy',
      officialLink: 'https://www.youtube.com/@ChrissEazy',
      songs: ['Inyogo', 'Amashu', 'Edeni', 'Stop It']
    }
  ];

  useEffect(() => {
    if (selectedArtist && !extendedBio) {
      handleGenerateExtendedBio(selectedArtist);
    }
  }, [selectedArtist]);

  const handleGenerateExtendedBio = async (artist: ArtistNode) => {
    setIsGeneratingBio(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a comprehensive, professional 4-paragraph biography for the Rwandan artist "${artist.name}" (${artist.genre}). 
        Focus on their early life, their rise to fame in Rwanda, their signature musical style, and their impact on the global African music scene. 
        Mention their significant contributions to "The Kigali Sound". Tone should be authoritative, like a high-end music journal.`,
      });
      setExtendedBio(response.text || "Neural connection timeout. Local data persistent.");
    } catch (err) {
      console.error(err);
      setExtendedBio(null);
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleArtistSelect = (artist: ArtistNode) => {
    setExtendedBio(null);
    setSelectedArtist(artist);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (selectedArtist) {
    return (
      <div className="animate-fade-in pb-32 space-y-8">
        <button 
          onClick={() => setSelectedArtist(null)} 
          className="flex items-center gap-3 text-slate-500 hover:text-white font-black text-[10px] uppercase tracking-widest group px-4"
        >
          <i className="fa-solid fa-arrow-left group-hover:-translate-x-2 transition-transform"></i> 
          Back to Artist Registry
        </button>

        {/* IDENTITY HEADER SECTION */}
        <div className="relative rounded-[60px] overflow-hidden border border-white/5 shadow-3xl bg-slate-900 flex flex-col items-center justify-center pt-20 pb-12">
          <div className="absolute inset-0 opacity-20 blur-[60px] pointer-events-none">
            <img src={selectedArtist.image} className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050510]/80 to-[#050510]"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-6 px-6">
            <div className="relative">
              <img src={selectedArtist.image} className="w-48 h-48 rounded-full border-4 border-blue-600 shadow-[0_0_50px_rgba(37,99,235,0.3)] object-cover" alt={selectedArtist.name} />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center border-4 border-[#050510] text-white text-xs">
                <i className="fa-solid fa-check"></i>
              </div>
            </div>
            
            <div>
              <h1 className="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">{selectedArtist.name}</h1>
              <p className="text-blue-500 font-black uppercase tracking-[6px] text-xs">{selectedArtist.genre}</p>
            </div>
          </div>
        </div>

        {/* DEDICATED BIOGRAPHY SECTION */}
        <section className="max-w-4xl mx-auto space-y-12">
          <div className="bg-[#0e0e24] border border-slate-800 rounded-[50px] p-8 md:p-16 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[100px] pointer-events-none"></div>
            
            <div className="relative z-10 space-y-10">
              <div className="flex items-center gap-4 border-b border-slate-800 pb-8">
                <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500">
                  <i className="fa-solid fa-feather-pointed text-xl"></i>
                </div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">The Artist Dossier</h3>
                {isGeneratingBio && (
                  <div className="ml-auto flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural Syncing...</span>
                  </div>
                )}
              </div>

              <div className="space-y-8">
                {isGeneratingBio && !extendedBio ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-slate-800 rounded-full w-full"></div>
                    <div className="h-4 bg-slate-800 rounded-full w-[90%]"></div>
                    <div className="h-4 bg-slate-800 rounded-full w-[95%]"></div>
                    <div className="h-4 bg-slate-800 rounded-full w-[80%]"></div>
                  </div>
                ) : (
                  <p className="text-slate-300 text-lg md:text-xl leading-relaxed font-medium italic first-letter:text-7xl first-letter:font-black first-letter:text-blue-500 first-letter:mr-4 first-letter:float-left first-letter:leading-[1]">
                    {extendedBio || selectedArtist.bio}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-10 border-t border-slate-800">
                 <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Global Pulse</p>
                   <p className="text-white font-black italic">{selectedArtist.stats}</p>
                 </div>
                 <div className="h-8 w-px bg-slate-800"></div>
                 <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Verification</p>
                   <p className="text-blue-500 font-black italic">Active Node</p>
                 </div>
                 <a 
                   href={selectedArtist.officialLink} 
                   target="_blank" 
                   rel="noreferrer"
                   className="ml-auto bg-white text-slate-950 px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl flex items-center gap-2"
                 >
                   <i className="fa-brands fa-youtube text-red-600"></i>
                   Official YouTube Channel
                 </a>
              </div>
            </div>
          </div>

          {/* DISCOGRAPHY GRID */}
          <div className="space-y-8">
             <h3 className="text-2xl font-black text-white italic uppercase tracking-tight ml-4 flex items-center gap-4">
               <i className="fa-solid fa-compact-disc text-blue-500"></i> Essential Extractions
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {selectedArtist.songs.map((song, i) => (
                 <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex items-center justify-between group hover:bg-blue-600/5 hover:border-blue-600/30 transition-all cursor-pointer">
                    <div className="flex items-center gap-6">
                      <span className="text-xl font-black text-slate-800 group-hover:text-blue-500 transition-colors">{(i+1).toString().padStart(2, '0')}</span>
                      <div>
                        <h4 className="text-white font-bold group-hover:text-blue-400 text-lg uppercase italic transition-colors">{song}</h4>
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Verified 320kbps Node</p>
                      </div>
                    </div>
                    <button className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white hover:bg-blue-600 transition-all shadow-xl active:scale-90">
                      <i className="fa-solid fa-play"></i>
                    </button>
                 </div>
               ))}
             </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in pb-32">
      <header className="border-b border-slate-800 pb-10">
        <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Identity <span className="text-blue-500">Registry</span></h2>
        <p className="text-slate-400 font-medium italic mt-2">Verified Rwandan creator nodes currently streaming within the Zetta infrastructure.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {artists.map(artist => (
          <div 
            key={artist.id} 
            onClick={() => handleArtistSelect(artist)} 
            className="bg-slate-900/40 border border-slate-800 rounded-[50px] p-10 hover:border-blue-500/30 transition-all group flex flex-col shadow-2xl cursor-pointer relative overflow-hidden text-center"
          >
             <div className="relative mb-8 mx-auto w-40 h-40">
                <img src={artist.image} className="w-full h-full rounded-full object-cover border-4 border-slate-800 group-hover:border-blue-500 transition-all shadow-2xl z-10 relative" alt={artist.name} />
                <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
             </div>
             <div className="space-y-3 relative z-10">
               <h4 className="text-2xl font-black text-white italic group-hover:text-blue-400 transition-colors uppercase tracking-tight leading-none">{artist.name}</h4>
               <span className="text-[9px] font-black text-blue-500 bg-blue-500/10 px-5 py-2 rounded-full uppercase tracking-[2px] inline-block border border-blue-500/20">
                 {artist.genre}
               </span>
               <p className="text-slate-500 text-[10px] font-black uppercase tracking-[3px] pt-4 opacity-60">
                 {artist.stats}
               </p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistsPage;
