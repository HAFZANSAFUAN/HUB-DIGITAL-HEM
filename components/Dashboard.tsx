
import React, { useMemo } from 'react';
import { 
  BarChart3, CheckCircle2, AlertCircle, 
  Calendar, Activity, Timer,
  Trophy, Target, User, Home, ArrowLeft, Users, UserCheck, Info
} from 'lucide-react';

interface Report {
  id: string;
  tarikh: string;
  hari: string;
  minggu: string;
  masa: string;
  tempat: string;
  kumpulan: string;
  tema: string;
  huraian: string;
  ucapanGuruLepas: string;
  ucapanGuruIni: string;
  pentadbirBerucap: string;
  ucapanPentadbir: string;
  images: string[];
  disediakanOleh: string;
}

interface DashboardProps {
  reports: Report[];
  onBack: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ reports, onBack }) => {
  const totalWeeks = 43;
  
  /**
   * LOGIK PENGIRAAN MINGGU AKADEMIK 2026
   * Berdasarkan Kalendar Rasmi 2026 (M1 bermula 12 Jan 2026)
   */
  const currentAcademicWeek = useMemo(() => {
    const startDate = new Date('2026-01-12T00:00:00');
    
    // Simulasi tarikh sekarang sebagai tahun 2026 untuk ketepatan paparan
    const now = new Date();
    const simulatedNow = new Date(now);
    simulatedNow.setFullYear(2026); 
    
    if (simulatedNow < startDate) return 1;
    
    // Kira beza minggu mentah
    const diffInMs = simulatedNow.getTime() - startDate.getTime();
    const rawWeeks = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7)) + 1;
    
    /**
     * PENYELARASAN CUTI SEKOLAH (MELANGKAU MINGGU AKADEMIK)
     * 1. Cuti Penggal 1: 21-29 Mac (1 minggu)
     * 2. Cuti Pertengahan Tahun: 23 Mei - 07 Jun (2 minggu)
     * 3. Cuti Penggal 2: 29 Ogos - 06 Sept (1 minggu)
     */
    let weekAdjustment = 0;
    
    // Selepas Cuti Mac
    if (simulatedNow > new Date('2026-03-29T23:59:59')) {
      weekAdjustment += 1;
    }
    // Selepas Cuti Jun
    if (simulatedNow > new Date('2026-06-07T23:59:59')) {
      weekAdjustment += 2;
    }
    // Selepas Cuti Sept
    if (simulatedNow > new Date('2026-09-06T23:59:59')) {
      weekAdjustment += 1;
    }
    
    const finalWeek = rawWeeks - weekAdjustment;
    
    if (finalWeek < 1) return 1;
    if (finalWeek > totalWeeks) return totalWeeks;
    
    return finalWeek;
  }, [totalWeeks]);

  const filledWeeksCount = reports.length;
  const percentage = Math.round((filledWeeksCount / totalWeeks) * 100);

  const isWeekFilled = (weekNum: number) => {
    return reports.some(r => parseInt(String(r.minggu)) === weekNum);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [y, m, d] = dateStr.split('-');
      return `${parseInt(d)}/${parseInt(m)}/${y}`;
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-10 duration-700 px-4 md:px-0">
      
      {/* Header Visual */}
      <div className="relative z-[60] flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-4">
          <button 
            onClick={(e) => { e.preventDefault(); onBack(); }}
            className="flex items-center space-x-3 text-slate-500 hover:text-blue-600 transition-all font-bold text-sm group cursor-pointer"
          >
            <div className="p-3 rounded-2xl bg-white shadow-md border border-slate-100 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
              <ArrowLeft size={20} />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="tracking-widest uppercase text-[10px] opacity-60">Navigasi</span>
              <span className="tracking-tight uppercase font-black">Dashboard Pengisian</span>
            </div>
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="w-1.5 h-12 bg-blue-600 rounded-full hidden md:block shadow-lg shadow-blue-200"></div>
            <div className="text-left">
              <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase leading-none">Statistik Live HEM</h2>
              <p className="text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center mt-2">
                <Activity size={14} className="mr-2 animate-pulse" />
                SISTEM PENGESANAN MINGGU AKADEMIK 2026
              </p>
            </div>
          </div>
        </div>

        {/* Paparan Visual Minggu Semasa */}
        <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md p-2 rounded-[2.5rem] border border-white shadow-xl">
           <div className="px-8 py-4 bg-slate-900 rounded-3xl text-white flex items-center space-x-5 shadow-2xl shadow-slate-200">
             <div className="p-2.5 bg-blue-600 rounded-xl animate-bounce">
                <Calendar size={24} className="text-white" />
             </div>
             <div className="text-left">
               <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.2em] leading-none mb-1.5">Minggu Semasa</p>
               <p className="text-2xl font-black tracking-tighter uppercase">MINGGU {currentAcademicWeek}</p>
             </div>
           </div>
        </div>
      </div>

      {/* Grid Kad Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="glass-card rounded-[2.5rem] p-8 border border-white/60 shadow-xl relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 p-6 text-blue-600/5 group-hover:scale-110 transition-transform duration-700">
            <Trophy size={120} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Kadar Pengisian</p>
          <div className="flex items-end space-x-2 mb-4">
            <h3 className="text-5xl font-black text-slate-800 tracking-tighter">{percentage}%</h3>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>

        <div className="glass-card rounded-[2.5rem] p-8 border border-white/60 shadow-xl flex items-center space-x-6 hover:shadow-emerald-500/5 transition-all group">
          <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500 shadow-inner group-hover:rotate-6 transition-transform">
            <CheckCircle2 size={32} />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selesai</p>
            <h3 className="text-3xl font-black text-slate-800">{filledWeeksCount} <span className="text-sm text-slate-400 font-bold uppercase tracking-widest">Laporan</span></h3>
          </div>
        </div>

        <div className="glass-card rounded-[2.5rem] p-8 border border-white/60 shadow-xl flex items-center space-x-6 hover:shadow-rose-500/5 transition-all group">
          <div className="w-16 h-16 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 shadow-inner group-hover:-rotate-6 transition-transform">
            <AlertCircle size={32} />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tercicir</p>
            <h3 className="text-3xl font-black text-slate-800">{Math.max(0, currentAcademicWeek - filledWeeksCount)} <span className="text-sm text-slate-400 font-bold uppercase tracking-widest">Minggu</span></h3>
          </div>
        </div>

        <div className="glass-card rounded-[2.5rem] p-8 border border-white/60 shadow-xl flex items-center space-x-6 bg-blue-600 text-white shadow-blue-200">
          <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center text-white backdrop-blur-sm">
            <Target size={32} />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest">Sasaran</p>
            <h3 className="text-3xl font-black">{totalWeeks} <span className="text-sm text-blue-200 font-bold uppercase tracking-widest">Minggu</span></h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6 text-left">
          <div className="glass-card rounded-[3rem] p-8 border border-white/60 shadow-xl h-full flex flex-col">
            <div className="flex items-center space-x-3 mb-8 border-b border-slate-100 pb-4">
              <div className="p-2.5 bg-blue-600 rounded-xl text-white">
                <Users size={20} />
              </div>
              <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Ringkasan Guru Bertugas</h3>
            </div>
            
            <div className="flex-grow overflow-y-auto max-h-[500px] pr-2 space-y-4 custom-scrollbar">
              {reports.length > 0 ? (
                reports.map((report) => (
                  <div key={report.id} className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 flex items-center space-x-4 group hover:bg-white hover:shadow-md transition-all">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center font-black text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {report.minggu}
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Minggu {report.minggu}</p>
                      <h4 className="text-[11px] font-black text-slate-800 truncate uppercase">{report.disediakanOleh}</h4>
                    </div>
                    <UserCheck size={16} className="text-emerald-500 flex-shrink-0" />
                  </div>
                ))
              ) : (
                <div className="text-center py-20 opacity-40">
                  <User size={48} className="mx-auto mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Tiada Rekod Pengisian</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass-card rounded-[3.5rem] p-8 md:p-14 border border-white/60 shadow-2xl relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 border-b border-slate-100 pb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                    <Timer size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Log Kalendar Akademik 2026</h3>
                    <p className="text-slate-400 text-[10px] font-bold">Paparan Visual 43 Minggu Persekolahan</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Selesai</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse"></div>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Minggu Ini</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2.5 h-2.5 bg-rose-500 rounded-full"></div>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Tertinggal</span>
                  </div>
                </div>
              </div>

              {/* Grid 43 Minggu */}
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-9 gap-4">
                {Array.from({ length: totalWeeks }, (_, i) => i + 1).map(week => {
                  const filled = isWeekFilled(week);
                  const isCurrent = week === currentAcademicWeek;
                  const isPast = week < currentAcademicWeek;
                  
                  let statusClasses = "bg-slate-50 border-slate-100 opacity-40 grayscale";
                  let textStatusColor = "text-slate-400";
                  let badgeColor = "bg-slate-200 text-slate-400";
                  
                  if (filled) {
                    statusClasses = "bg-emerald-50/60 border-emerald-200 shadow-sm hover:shadow-emerald-200/40 hover:-translate-y-1 hover:bg-emerald-50 opacity-100 grayscale-0";
                    textStatusColor = "text-emerald-600";
                    badgeColor = "bg-emerald-500 text-white shadow-lg shadow-emerald-200";
                  } else if (isCurrent) {
                    statusClasses = "bg-blue-50 border-blue-300 ring-4 ring-blue-100 scale-105 z-20 shadow-xl opacity-100 grayscale-0";
                    textStatusColor = "text-blue-600";
                    badgeColor = "bg-blue-600 text-white shadow-lg shadow-blue-200 animate-pulse";
                  } else if (isPast && !filled) {
                    statusClasses = "bg-rose-50 border-rose-200 hover:bg-rose-100/50 transition-all opacity-100 grayscale-0";
                    textStatusColor = "text-rose-600";
                    badgeColor = "bg-rose-500 text-white shadow-lg shadow-rose-200";
                  }

                  return (
                    <div key={week} className={`group relative p-2 rounded-xl border transition-all duration-500 flex flex-col items-center justify-center space-y-1 h-20 ${statusClasses}`}>
                      <div className={`absolute top-1 left-1/2 -translate-x-1/2 text-[6px] font-black tracking-widest uppercase ${textStatusColor}`}>
                        M{week}
                      </div>
                      
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${badgeColor}`}>
                        {filled ? <CheckCircle2 size={12} /> : isCurrent ? <Activity size={12} /> : isPast ? <AlertCircle size={12} /> : <Calendar size={12} className="opacity-40" />}
                      </div>

                      <span className={`text-[5px] font-black uppercase tracking-widest ${textStatusColor}`}>
                        {filled ? 'DONE' : isCurrent ? 'NOW' : isPast ? 'X' : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto bg-white/40 backdrop-blur-sm p-10 rounded-[3rem] border border-white/60 shadow-lg">
          <div className="flex items-start space-x-5 max-w-xl text-left">
            <div className="p-4 bg-blue-100 text-blue-600 rounded-3xl shadow-inner">
              <Info size={28} />
            </div>
            <div>
              <h4 className="font-black text-slate-800 text-sm uppercase tracking-widest mb-2">Penyelarasan Minggu 2026</h4>
              <p className="text-xs font-medium text-slate-500 leading-relaxed italic">
                "Sistem secara automatik menyelaraskan minggu akademik dengan melangkau cuti penggal Mac, Jun, dan September supaya cikgu sentiasa tahu minggu sebenar sesi persekolahan."
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Kalendar</span>
            <div className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 rounded-full text-white font-black text-[10px] shadow-lg shadow-blue-200">
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
              <span>43 MINGGU AKTIF</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <button 
            onClick={(e) => { e.preventDefault(); onBack(); }}
            className="group flex items-center space-x-4 bg-slate-900 text-white px-12 py-6 rounded-[2.5rem] font-black text-sm tracking-[0.2em] uppercase shadow-2xl shadow-slate-300 hover:bg-blue-600 transition-all duration-500 hover:-translate-y-2 active:scale-95 border border-white/10"
          >
            <Home size={20} className="group-hover:rotate-12 transition-transform duration-500" />
            <span>Kembali Ke Hub Utama</span>
          </button>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};
