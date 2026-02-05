
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="mt-auto pt-6 pb-4 px-4 border-t border-slate-800/40 flex flex-col items-center gap-5">
      {/* Social Media Row - Minimalist Icons */}
      <div className="flex items-center justify-center gap-5">
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-400 text-base transition-all hover:scale-110 active:scale-90">
          <i className="fa-brands fa-twitter"></i>
        </a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-red-500 text-lg transition-all hover:scale-110 active:scale-90">
          <i className="fa-brands fa-square-youtube"></i>
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-pink-500 text-base transition-all hover:scale-110 active:scale-90">
          <i className="fa-brands fa-instagram"></i>
        </a>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-600 text-base transition-all hover:scale-110 active:scale-90">
          <i className="fa-brands fa-facebook-f"></i>
        </a>
      </div>

      {/* Vertical Branding Stack */}
      <div className="text-center space-y-1">
        <h2 className="text-slate-600 text-[10px] font-black uppercase tracking-[3px] select-none opacity-80 leading-none">
          ZETTA PROTOCOL V2.4.1
        </h2>
        <p className="text-[8px] font-bold text-slate-800 uppercase tracking-widest leading-none">
          &copy; {currentYear} Z MEDIA CLOUD
        </p>
      </div>
    </div>
  );
};

export default Footer;
