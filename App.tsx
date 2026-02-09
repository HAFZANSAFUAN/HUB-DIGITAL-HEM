
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HubMenu } from './components/HubMenu';
import { Footer } from './components/Footer';
import { ReportForm } from './components/ReportForm';
import { PenyayangForm } from './components/PenyayangForm';
import { ReportList } from './components/ReportList';
import { PenyayangList } from './components/PenyayangList';
import { Dashboard } from './components/Dashboard';
import { TakwimView } from './components/TakwimView';
import { 
  Lock, X, School, FilePlus, LayoutGrid, BarChart3, 
  CheckCircle2, ArrowRight, Settings, ShieldCheck, LogOut, 
  Loader2, Heart, CheckCircle, Database
} from 'lucide-react';

// === DATABASE URLS ===
const GOOGLE_SHEET_API_URL = "https://script.google.com/macros/s/AKfycbwVEbHPjycI6T6M6whpk3O9wWEJ7HXzJhyW5N4h9xNMIlUAbUVEKEU-HwSUqHi0GqPg/exec";
const PENYAYANG_API_URL = "https://script.google.com/macros/s/AKfycbz2SagBXI7_VWD5hQg3Rw6Sw1JSYUwU6pGh1Cca59_jrq9i0b4GxDUD6Lpjmplr8KVa/exec";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showPerhimpunanModal, setShowPerhimpunanModal] = useState(false);
  const [showPenyayangModal, setShowPenyayangModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentView, setCurrentView] = useState<'HUB' | 'FORM' | 'PENYAYANG_FORM' | 'LIST' | 'PENYAYANG_LIST' | 'DASHBOARD' | 'ADMIN_PORTAL' | 'TAKWIM'>('HUB');
  const [reports, setReports] = useState<any[]>([]);
  const [penyayangReports, setPenyayangReports] = useState<any[]>([]);
  const [syncStatus, setSyncStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [editingReport, setEditingReport] = useState<any | null>(null);
  const [editingPenyayangReport, setEditingPenyayangReport] = useState<any | null>(null);

  // Logo URL
  const logoUrl = "https://lh3.googleusercontent.com/d/1UAlLnJkiTebZU-nVAv1pByGQyUz2ZSpR";

  const fetchAllData = async () => {
    // Jalankan fetch data di belakang tabir tanpa mengganggu UI utama
    try {
      const [resPerhimpunan, resPenyayang] = await Promise.all([
        fetch(GOOGLE_SHEET_API_URL).then(res => res.json()),
        fetch(PENYAYANG_API_URL).then(res => res.json())
      ]);
      
      if (Array.isArray(resPerhimpunan)) setReports(resPerhimpunan);
      if (Array.isArray(resPenyayang)) setPenyayangReports(resPenyayang);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSaveReport = (data: any) => {
    const isPenyayang = !!data.program;
    const targetUrl = isPenyayang ? PENYAYANG_API_URL : GOOGLE_SHEET_API_URL;

    // --- OPTIMISTIC UI: Paparkan mesej kejayaan SERTA-MERTA ---
    setShowSuccess(true);
    setSyncStatus('LOADING');

    // Hantar data ke Google Sheet di belakang tabir
    fetch(targetUrl, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(data)
    }).then(() => {
      setSyncStatus('SUCCESS');
      fetchAllData(); // Kemaskini data secara senyap
    }).catch(err => {
      console.error("Save Error:", err);
      setSyncStatus('ERROR');
    });
    
    // Tukar skrin dengan lebih pantas (2 saat sahaja)
    setTimeout(() => {
      setShowSuccess(false);
      setCurrentView(isPenyayang ? 'PENYAYANG_LIST' : 'LIST');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-[#f0f9ff]">
      <Header />
      
      <main className="flex-grow container mx-auto px-6 py-12 md:py-20 relative z-10">
        {/* Admin Login Button */}
        {currentView === 'HUB' && (
          <div className="absolute top-4 right-6 z-30">
            {!isLoggedIn ? (
              <button onClick={() => setShowLogin(true)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">
                ADMIN LOGIN
              </button>
            ) : (
              <button onClick={() => setCurrentView('ADMIN_PORTAL')} className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                PORTAL ADMIN
              </button>
            )}
          </div>
        )}

        {currentView === 'HUB' && (
          <div className="max-w-5xl mx-auto text-center animate-in fade-in duration-1000">
            <div className="flex justify-center mb-8">
              <img src={logoUrl} alt="Lencana" className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl"/>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-none tracking-tighter mb-4">
              DIGITAL HUB <span className="text-blue-600">HEM</span>
            </h1>
            <p className="text-xl md:text-2xl font-bold text-slate-500 mb-16 uppercase">SK METHODIST PETALING JAYA</p>
            
            <HubMenu onMenuClick={(title) => {
              if (title.includes("PERHIMPUNAN")) setShowPerhimpunanModal(true);
              else if (title.includes("PENYAYANG")) setShowPenyayangModal(true);
              else if (title.includes("TAKWIM")) setCurrentView('TAKWIM');
            }} />
          </div>
        )}

        {/* Views Router */}
        {currentView === 'TAKWIM' && <TakwimView onBack={() => setCurrentView('HUB')} />}
        {currentView === 'FORM' && <ReportForm onBack={() => setCurrentView('HUB')} onSave={handleSaveReport} initialData={editingReport} />}
        {currentView === 'PENYAYANG_FORM' && <PenyayangForm onBack={() => setCurrentView('HUB')} onSave={handleSaveReport} initialData={editingPenyayangReport} />}
        {currentView === 'LIST' && <ReportList reports={reports} onBack={() => setCurrentView('HUB')} onEdit={(r) => { setEditingReport(r); setCurrentView('FORM'); }} onAddNew={() => { setEditingReport(null); setCurrentView('FORM'); }} isAdmin={isLoggedIn} />}
        {currentView === 'PENYAYANG_LIST' && <PenyayangList reports={penyayangReports} onBack={() => setCurrentView('HUB')} onEdit={(r) => { setEditingPenyayangReport(r); setCurrentView('PENYAYANG_FORM'); }} isAdmin={isLoggedIn} />}
        {currentView === 'DASHBOARD' && <Dashboard reports={reports} onBack={() => setCurrentView('HUB')} />}
        
        {currentView === 'ADMIN_PORTAL' && isLoggedIn && (
          <div className="max-w-4xl mx-auto space-y-8 text-center py-10">
            <h2 className="text-4xl font-black text-slate-900">PORTAL PENGURUSAN</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button onClick={() => setCurrentView('DASHBOARD')} className="glass-card p-10 rounded-3xl hover:bg-blue-600 hover:text-white transition-all">
                <BarChart3 className="mx-auto mb-4" size={48} />
                <span className="font-black uppercase">Dashboard</span>
              </button>
              <button onClick={() => setCurrentView('LIST')} className="glass-card p-10 rounded-3xl hover:bg-indigo-600 hover:text-white transition-all">
                <LayoutGrid className="mx-auto mb-4" size={48} />
                <span className="font-black uppercase">Rekod Perhimpunan</span>
              </button>
              <button onClick={() => setCurrentView('PENYAYANG_LIST')} className="glass-card p-10 rounded-3xl hover:bg-rose-600 hover:text-white transition-all">
                <Heart className="mx-auto mb-4" size={48} />
                <span className="font-black uppercase">Rekod Penyayang</span>
              </button>
            </div>
            <button onClick={() => setIsLoggedIn(false)} className="mt-10 text-rose-500 font-bold uppercase tracking-widest flex items-center mx-auto space-x-2">
              <LogOut size={16} /> <span>LOG KELUAR</span>
            </button>
          </div>
        )}
      </main>

      {/* Success Notification Modal (Pantas) */}
      {showSuccess && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-sm p-12 rounded-[3.5rem] border border-emerald-500/30 text-center shadow-[0_32px_64px_-16px_rgba(16,185,129,0.4)] animate-in zoom-in slide-in-from-bottom-10 duration-400">
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-200 animate-bounce">
              <CheckCircle size={56} className="text-white" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-center items-center space-x-2 text-emerald-600">
                <Database size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Syncing to Cloud...</span>
              </div>
              <h3 className="text-2xl font-black text-slate-800 leading-tight tracking-tighter uppercase">
                LAPORAN TELAH BERJAYA DIHANTAR KE DATABASE ONLINE
              </h3>
              <div className="flex items-center justify-center space-x-2 pt-4">
                 <Loader2 size={14} className="animate-spin text-slate-400" />
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Memproses Rekod...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals & Popups */}
      {showPerhimpunanModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative glass-card w-full max-w-lg p-10 md:p-12 rounded-[3rem] animate-super-spring">
            <button onClick={() => setShowPerhimpunanModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-rose-500 transition-colors"><X /></button>
            <h3 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tighter mb-8 text-center">LAPORAN PERHIMPUNAN RASMI</h3>
            <div className="space-y-4">
              <button onClick={() => { setCurrentView('FORM'); setShowPerhimpunanModal(false); }} className="w-full bg-slate-900 text-white p-6 rounded-3xl font-black transition-all hover:bg-blue-600 hover:-translate-y-1 shadow-xl flex justify-between items-center group">
                <div className="text-left">
                  <p className="text-lg uppercase leading-none mb-1">ISI LAPORAN BARU</p>
                  <p className="text-[10px] text-blue-200 opacity-80 font-bold uppercase tracking-widest">(KLIK SINI UNTUK ISI LAPORAN BARU)</p>
                </div>
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </button>

              <button onClick={() => { setCurrentView('LIST'); setShowPerhimpunanModal(false); }} className="w-full bg-white border border-slate-200 text-slate-800 p-6 rounded-3xl font-black transition-all hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-1 shadow-lg flex justify-between items-center group">
                <div className="text-left">
                  <p className="text-lg uppercase leading-none mb-1">REKOD LAPORAN</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">(KLIK SINI UNTUK KEMASKINI LAPORAN)</p>
                </div>
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </button>

              <button onClick={() => { setCurrentView('DASHBOARD'); setShowPerhimpunanModal(false); }} className="w-full bg-indigo-600 text-white p-6 rounded-3xl font-black transition-all hover:bg-indigo-700 hover:-translate-y-1 shadow-xl flex justify-between items-center group">
                <div className="text-left">
                  <div className="flex items-center space-x-2">
                    <BarChart3 size={18} className="text-indigo-200" />
                    <p className="text-lg uppercase leading-none">DASHBOARD PELAPORAN</p>
                  </div>
                  <p className="text-[10px] text-indigo-100 opacity-80 font-bold uppercase tracking-widest mt-1">(KESEMUA PELAPORAN DIPAPARKAN DISINI)</p>
                </div>
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {showPenyayangModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative glass-card w-full max-w-lg p-12 rounded-[3rem] animate-super-spring">
            <button onClick={() => setShowPenyayangModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-rose-500"><X /></button>
            <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-8 text-center">Guru Penyayang</h3>
            <div className="space-y-4">
              <button onClick={() => { setCurrentView('PENYAYANG_FORM'); setShowPenyayangModal(false); }} className="w-full bg-rose-600 text-white p-6 rounded-2xl font-black uppercase tracking-widest hover:bg-rose-700 transition-all flex justify-between items-center">
                <span>Isi Laporan Harian</span>
                <ArrowRight size={20} />
              </button>
              <button onClick={() => { setCurrentView('PENYAYANG_LIST'); setShowPenyayangModal(false); }} className="w-full bg-white border border-slate-200 p-6 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex justify-between items-center text-slate-700">
                <span>Rekod Harian</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative glass-card w-full max-w-sm p-10 rounded-[2.5rem] animate-super-spring text-center">
            <button onClick={() => setShowLogin(false)} className="absolute top-6 right-6 text-slate-400"><X /></button>
            <Settings className="mx-auto mb-4 text-blue-600" size={40} />
            <h3 className="text-xl font-black mb-6 uppercase">Admin Access</h3>
            <input 
              type="password" 
              placeholder="Kata Laluan" 
              className="w-full p-4 border border-slate-200 rounded-xl mb-4 font-bold text-center outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.currentTarget.value === '123456' || e.currentTarget.value === 'admin')) {
                  setIsLoggedIn(true);
                  setShowLogin(false);
                }
              }}
            />
            <p className="text-[10px] text-slate-400 font-bold uppercase">Tekan Enter Selepas Taip</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default App;
