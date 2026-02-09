
import React from 'react';
import { School, Heart, ArrowRight, CalendarDays, Presentation } from 'lucide-react';

interface MenuCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  accentColor: string;
  badge: string;
}

const MenuCard: React.FC<MenuCardProps> = ({ title, description, icon, onClick, accentColor, badge }) => {
  return (
    <button
      onClick={onClick}
      className="group relative glass-card p-6 md:p-8 rounded-[2rem] shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 text-left w-full overflow-hidden flex items-center gap-6 border border-white/80"
    >
      {/* Decorative Gradient Overlay */}
      <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 opacity-[0.03] rounded-full bg-current transition-transform duration-700 group-hover:scale-150 ${accentColor}`}></div>
      
      {/* Icon Section */}
      <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center text-white relative z-10 group-hover:scale-105 transition-transform duration-500 flex-shrink-0 overflow-hidden`}>
        <div className={`absolute inset-0 opacity-90 ${accentColor}`}></div>
        <div className="relative z-20">
          {React.cloneElement(icon as React.ReactElement, { size: 32 })}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="flex-grow min-w-0">
        <div className="flex flex-wrap items-center gap-3 mb-1">
          <h3 className="text-lg md:text-xl font-black text-slate-800 tracking-tight leading-tight group-hover:text-blue-600 transition-colors uppercase">
            {title}
          </h3>
          <span className="bg-white/50 backdrop-blur-sm border border-slate-200 text-slate-500 px-3 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase">
            {badge}
          </span>
        </div>
        
        <p className="text-slate-500 text-xs md:text-sm font-medium leading-tight opacity-80 line-clamp-1 md:line-clamp-2">
          {description}
        </p>
      </div>
      
      {/* Arrow Section */}
      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-white shadow-md border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 flex-shrink-0`}>
        <ArrowRight size={20} />
      </div>
    </button>
  );
};

interface HubMenuProps {
  onMenuClick: (title: string) => void;
}

export const HubMenu: React.FC<HubMenuProps> = ({ onMenuClick }) => {
  return (
    <div className="flex flex-col gap-4 md:gap-6 max-w-3xl mx-auto px-4 pb-10">
      <MenuCard
        title="TAKWIM HEM TAHUN 2026"
        badge="Penuh"
        description="Jadual perancangan aktiviti HEM, mesyuarat unit, cuti sekolah, dan tema perhimpunan sepanjang sesi persekolahan 2026."
        icon={<CalendarDays />}
        accentColor="bg-indigo-600"
        onClick={() => onMenuClick("TAKWIM HEM 2026")}
      />

      <MenuCard
        title="BACKDROP PERHIMPUNAN"
        badge="Slaid"
        description="Akses arkib digital paparan backdrop perhimpunan rasmi untuk kegunaan visual di dewan atau tapak perhimpunan."
        icon={<Presentation />}
        accentColor="bg-cyan-600"
        onClick={() => window.open("https://drive.google.com/drive/folders/1gMVFqkzdHmBgHsF7iUCtuODE8DSezwWq?usp=sharing", "_blank")}
      />

      <MenuCard
        title="LAPORAN PERHIMPUNAN RASMI"
        badge="Mingguan"
        description="Rakamkan butiran perhimpunan rasmi, amanat guru besar, dan laporan guru bertugas dengan format digital yang kemas."
        icon={<School />}
        accentColor="bg-blue-600"
        onClick={() => onMenuClick("LAPORAN PERHIMPUNAN RASMI SEKOLAH")}
      />
      
      <MenuCard
        title="LAPORAN GURU PENYAYANG"
        badge="Harian"
        description="Dokumentasi impak program Guru Penyayang, sambutan mesra murid di pagar sekolah, dan aktiviti bimbingan emosi."
        icon={<Heart />}
        accentColor="bg-rose-500"
        onClick={() => onMenuClick("LAPORAN GURU PENYAYANG")}
      />
    </div>
  );
};
