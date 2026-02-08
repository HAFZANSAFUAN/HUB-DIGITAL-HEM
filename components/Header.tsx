
import React, { useState, useEffect } from 'react';

export const Header: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  
  // Direct link format for Google Drive image
  const logoUrl = "https://lh3.googleusercontent.com/d/1UAlLnJkiTebZU-nVAv1pByGQyUz2ZSpR";

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Kira anjakan parallax (hadkan kepada julat kecil untuk kehalusan)
  const parallaxOffset = Math.min(scrollY * 0.15, 20);

  return (
    <header className="sticky top-0 z-40 glass-card border-b border-white/40 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
      <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row items-center md:items-start md:justify-between gap-4">
        <div className="flex items-center space-x-5">
          <div 
            className="relative group flex-shrink-0 transition-transform duration-300 ease-out"
            style={{ transform: `translateY(${parallaxOffset}px)` }}
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-sky-300 rounded-2xl blur-[4px] opacity-10 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative w-16 h-16 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-md border border-slate-100 overflow-hidden ring-4 ring-white/50">
              <img 
                src={logoUrl} 
                alt="Lencana SK Methodist PJ" 
                className="w-full h-full object-contain transform group-hover:scale-110 group-hover-slow-spin transition-all duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=SKM&background=0284c7&color=fff";
                }}
              />
            </div>
          </div>
          
          <div className="flex flex-col justify-center border-l border-slate-200/60 pl-5">
            <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tighter leading-none">
              SK METHODIST <span className="text-blue-600 uppercase">Petaling Jaya</span>
            </h1>
            <p className="text-[10px] md:text-xs text-blue-600 font-black tracking-[0.2em] uppercase mt-1">
              LAPORAN PERHIMPUNAN RASMI SK METHODIST PETALING JAYA
            </p>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center space-x-3 bg-slate-50/50 px-4 py-2 rounded-2xl border border-slate-100 self-center shadow-inner">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Infrastruktur Digital</span>
            <span className="text-xs font-black text-blue-600 flex items-center">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
              HUB AKTIF
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
