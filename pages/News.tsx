
import React, { useState } from 'react';

interface Article {
  id: number;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  content: string;
}

const NewsPage: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const articles: Article[] = [
    {
      id: 1,
      title: "Bruce Melodie Announces 'Zetta' World Tour",
      category: "Global Update",
      date: "2 hours ago",
      image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=800",
      excerpt: "The Rwandan superstar is set to headline a 20-city tour across Europe and North America starting next month.",
      content: "Bruce Melodie, the acclaimed 'New King' of Rwandan music, has officially unveiled his 2024 Zetta World Tour. This ambitious journey will span across 20 cities, including landmark performances in Paris, Brussels, New York, and Toronto. The tour is expected to bring the unique sound of Rwandan Afro-fusion to global mainstream audiences, marking a historic first for the local industry. Fans can expect state-of-the-art production and guest appearances from international collaborators."
    },
    {
      id: 2,
      title: "Meddy's 'Slowly' Hits 100M Streams on Zetta",
      category: "Milestone",
      date: "5 hours ago",
      image: "https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=800",
      excerpt: "A historic moment for Rwandan music as the soul-stirring ballad crosses a major digital threshold.",
      content: "The iconic track 'Slowly' by Meddy has reached the monumental milestone of 100 million streams on the Zetta Media platform. This achievement underscores the enduring popularity of Meddy's soulful R&B sound and the growing influence of Rwandan creators on the world stage. Zetta Media's analytics show that the song maintains a high pulse in markets as far as Japan and Brazil, proving that music transcends all borders."
    },
    {
      id: 3,
      title: "Top 10 Rising Artists in Kigali for 2024",
      category: "Trends",
      date: "Yesterday",
      image: "https://images.unsplash.com/photo-1514525253361-bee8718a74a2?auto=format&fit=crop&q=80&w=800",
      excerpt: "From Element to Ariel Wayz, see who is dominating the local cluster this season.",
      content: "The Kigali music scene is experiencing an unprecedented surge of talent. Leading the charge is Element Eleéeh, whose transition from producer to vocalist has been nothing short of explosive. Close behind is Ariel Wayz, whose experimental soul-fusion is redefining feminine vocals in Rwanda. Other names to watch include Juno Kizigenza, Chriss Eazy, and a new wave of drill artists coming out of Nyamirambo. The 'Kigali Sound' is officially evolving."
    }
  ];

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      <header>
        <h2 className="text-4xl font-black text-white italic tracking-tight uppercase">Music <span className="text-blue-500">News</span></h2>
        <p className="text-slate-400 font-medium italic">Real-time pulses from the Rwandan music ecosystem.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <div key={article.id} className="bg-slate-900/50 border border-slate-800 rounded-[40px] overflow-hidden group hover:border-blue-500/30 transition-all shadow-2xl flex flex-col">
            <div className="aspect-video relative overflow-hidden">
              <img src={article.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={article.title} />
              <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg">
                {article.category}
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{article.date}</p>
              <h3 className="text-xl font-black text-white italic mb-4 group-hover:text-blue-400 transition-colors leading-tight">{article.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">{article.excerpt}</p>
              <button 
                onClick={() => setSelectedArticle(article)}
                className="mt-auto flex items-center gap-2 text-blue-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors w-fit group"
              >
                Read Extraction <i className="fa-solid fa-arrow-right-long group-hover:translate-x-2 transition-transform"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Article Detail Overlay */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 max-w-4xl w-full max-h-[90vh] rounded-[50px] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(37,99,235,0.15)]">
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img src={selectedArticle.image} className="w-full h-full object-cover" alt={selectedArticle.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="absolute top-8 right-8 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center text-xl backdrop-blur-md transition-all active:scale-90"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              <div className="absolute bottom-8 left-8">
                <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[2px] shadow-lg mb-4 inline-block">
                  {selectedArticle.category}
                </span>
                <h3 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-tight">
                  {selectedArticle.title}
                </h3>
              </div>
            </div>
            <div className="p-8 md:p-12 overflow-y-auto no-scrollbar space-y-6">
              <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-6">
                <i className="fa-regular fa-clock text-blue-500"></i>
                Published {selectedArticle.date}
                <div className="h-1 w-1 bg-slate-700 rounded-full"></div>
                Source: Zetta Media Wire
              </div>
              <p className="text-slate-200 text-lg md:text-xl font-medium leading-relaxed first-letter:text-5xl first-letter:font-black first-letter:text-blue-500 first-letter:mr-3 first-letter:float-left">
                {selectedArticle.content}
              </p>
              <div className="pt-8 border-t border-slate-800 flex justify-between items-center">
                 <button className="text-blue-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors flex items-center gap-3">
                   <i className="fa-solid fa-share-nodes"></i> Distribute Node
                 </button>
                 <button 
                  onClick={() => setSelectedArticle(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
                 >
                   Return to Hub
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsPage;
