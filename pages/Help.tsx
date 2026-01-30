
import React, { useState } from 'react';
import { Icons } from '../constants';

const HelpPage: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    { q: "How do I download media from social links?", a: "Simply paste the URL in the downloader box, select your preferred format and quality, then click 'Download Now'. We support most major platforms including YouTube, SoundCloud, and Instagram." },
    { q: "Is Zetta Downloader free to use?", a: "Yes! Zetta Downloader offers a free plan with standard features. For advanced tools like batch processing and 4K downloads, we offer Pro subscriptions." },
    { q: "Where are my downloads stored?", a: "Downloads are stored within your private Zetta cloud library. You can also sync them to your local device using our Mobile Sync tool." },
    { q: "How do I edit audio tags?", a: "Navigate to the Audio Tools section, select 'Tag Editor', and upload or select a track from your library to modify its metadata." }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in">
      <div className="text-center">
        <h1 className="text-5xl font-black text-white mb-4 tracking-tight">
          Help & <span className="text-blue-500">Support</span>
        </h1>
        <p className="text-slate-400 text-lg">Find answers to your questions and get assistance with Zetta Downloader.</p>
      </div>

      <div className="relative group max-w-2xl mx-auto">
        <i className="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-blue-500 text-xl"></i>
        <input 
          type="text" 
          placeholder="Search for articles, guides, or FAQs..." 
          className="w-full bg-slate-900 border-2 border-slate-800 focus:border-blue-600 rounded-[24px] py-5 pl-16 pr-6 text-white text-lg transition-all outline-none shadow-2xl"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: 'fa-book', title: 'Getting Started', desc: 'Learn how to set up and start using your workspace.' },
          { icon: 'fa-download', title: 'Download Issues', desc: 'Troubleshoot common download and conversion problems.' },
          { icon: 'fa-credit-card', title: 'Billing & Plans', desc: 'Manage your subscription, invoices, and payment methods.' }
        ].map((sec, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:border-blue-600/50 transition-all cursor-pointer group">
            <i className={`fas ${sec.icon} text-4xl text-blue-500 mb-6 group-hover:scale-110 transition-transform`}></i>
            <h3 className="text-xl font-bold text-white mb-3">{sec.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">{sec.desc}</p>
            <button className="text-blue-500 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
              Learn More <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-10">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <i className="fas fa-comments text-blue-500"></i>
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-slate-800 rounded-2xl overflow-hidden">
              <button 
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-800/50 transition-colors"
              >
                <span className="font-bold text-slate-200">{faq.q}</span>
                <i className={`fas fa-chevron-down transition-transform ${activeFaq === i ? 'rotate-180' : ''} text-blue-500`}></i>
              </button>
              {activeFaq === i && (
                <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[32px] p-12 text-center shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white mb-4">Still Need Help?</h2>
          <p className="text-blue-100 mb-10 text-lg opacity-80">Our support team is available 24/7 to assist with your technical needs.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <button className="bg-white text-blue-700 px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-50 transition-all">
              <i className="fas fa-envelope mr-2"></i> Email Support
            </button>
            <button className="bg-blue-800 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-900 transition-all border border-blue-500/30">
              <i className="fas fa-comments mr-2"></i> Start Live Chat
            </button>
          </div>
        </div>
        <i className="fas fa-headset absolute -right-10 -bottom-10 text-[200px] text-white/10 rotate-12"></i>
      </div>
    </div>
  );
};

export default HelpPage;
