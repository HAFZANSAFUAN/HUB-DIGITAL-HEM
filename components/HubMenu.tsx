
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
      className="group relative glass-card p-10 rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-left w-full overflow-hidden flex flex-col h-full"
    >
      {/* Decorative Gradient Overlay */}
      <div className={`absolute top-0 right-0 w-48 h-48 -mr-16 -mt-16 opacity-[0.03] rounded-full bg-current transition-transform duration-700 group-hover:scale-150 ${accentColor}`}></div>
      
      <div className="flex justify-between items-start mb-8">
        <div className={`w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center text-white relative z-10 group-hover:scale-110 transition-transform duration-500 overflow-hidden`}>
          <div className={`absolute inset-0 opacity-90 ${accentColor}`}></div>
          <div className="relative z-20">
            {icon}
          </div>
        </div>
        <span className="bg-white/50 backdrop-blur-sm border border-slate-200 text-slate-500 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">
          {badge}
        </span>
      </div>
      
      <div className="flex-grow">
        <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-4 tracking-tight leading-tight group-hover:text-indigo-700 transition-colors">
          {title}
        </h3>
        
        <p className="text-slate-500 text-base font-medium leading-relaxed opacity-90">
          {description}
        </p>
      </div>
      
      <div className="mt-10 flex items-center space-x-3 text-slate-800 font-bold text-sm">
        <span className="group-hover:mr-2 transition-all">Lihat Maklumat</span>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-md border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300`}>
          <ArrowRight size={18} />
        </div>
      </div>
    </button>
  );
};

interface HubMenuProps {
  onMenuClick: (title: string) => void;
}

export const HubMenu: React.FC<HubMenuProps> = ({ onMenuClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
      <MenuCard
        title="TAKWIM HEM TAHUN 2026"
        badge="Penuh"
        description="Jadual perancangan aktiviti HEM, mesyuarat unit, cuti sekolah, dan tema perhimpunan sepanjang sesi persekolahan 2026."
        icon={<CalendarDays size={36} strokeWidth={2.5} />}
        accentColor="bg-indigo-600"
        onClick={() => onMenuClick("TAKWIM HEM 2026")}
      />

      <MenuCard
        title="BACKDROP PERHIMPUNAN"
        badge="Slaid"
        description="Akses arkib digital paparan backdrop perhimpunan rasmi untuk kegunaan visual di dewan atau tapak perhimpunan."
        icon={<Presentation size={36} strokeWidth={2.5} />}
        accentColor="bg-cyan-600"
        onClick={() => window.open("https://drive.google.com/drive/folders/1gMVFqkzdHmBgHsF7iUCtuODE8DSezwWq?usp=sharing", "_blank")}
      />

      <MenuCard
        title="LAPORAN PERHIMPUNAN RASMI"
        badge="Mingguan"
        description="Rakamkan butiran perhimpunan rasmi, amanat guru besar, dan laporan guru bertugas dengan format digital yang kemas."
        icon={<School size={36} strokeWidth={2.5} />}
        accentColor="bg-blue-600"
        onClick={() => onMenuClick("LAPORAN PERHIMPUNAN RASMI SEKOLAH")}
      />
      
      <MenuCard
        title="LAPORAN GURU PENYAYANG"
        badge="Harian"
        description="Dokumentasi impak program Guru Penyayang, sambutan mesra murid di pagar sekolah, dan aktiviti bimbingan emosi."
        icon={<Heart size={36} strokeWidth={2.5} />}
        accentColor="bg-rose-500"
        onClick={() => onMenuClick("LAPORAN GURU PENYAYANG")}
      />
    </div>
  );
};
