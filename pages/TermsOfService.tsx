
import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-white mb-4">Terms of Service</h1>
        <p className="text-slate-500">Effective Date: June 15, 2024</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-10 space-y-10 text-slate-400 leading-relaxed shadow-2xl">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white italic">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Zetta Downloader, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services. We reserve the right to modify these terms at any time.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white italic">2. Use of Service</h2>
          <p>
            Zetta Downloader is a tool designed to help you download and manage your media. You are solely responsible for ensuring that your use of the service complies with the copyright laws and terms of service of the third-party platforms from which you download content.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You may not use Zetta for illegal distribution of copyrighted material.</li>
            <li>You must be at least 13 years old to use this service.</li>
            <li>Commercial use without written consent is strictly prohibited.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white italic">3. Intellectual Property</h2>
          <p>
            The software, branding, and proprietary algorithms of Zetta Downloader are owned by Zetta Media Ltd. User-uploaded content remains the property of the respective owners, and Zetta claims no ownership over your media library.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white italic">4. Termination</h2>
          <p>
            We reserve the right to suspend or terminate accounts that violate our usage policies, specifically those involved in mass-scraping or abusive automated behaviors.
          </p>
        </section>

        <section className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 text-sm italic">
          Disclaimer: Zetta Downloader provides tools for format conversion and media management. We do not host or store content that is not explicitly uploaded to your private cloud instance by you.
        </section>

        <div className="flex items-center gap-4 pt-6 border-t border-slate-800">
           <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-xl shadow-blue-600/20">I Understand and Accept</button>
           <button className="text-slate-500 hover:text-white font-bold px-8 py-3 transition-all" onClick={() => window.print()}>Print Policy</button>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
