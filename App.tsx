
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
  AlertCircle, Loader2, Heart, ClipboardList, Check
} from 'lucide-react';

// === DATABASE UTAMA ===
const GOOGLE_SHEET_API_URL: string = "https://script.google.com/macros/s/AKfycbwVEbHPjycI6T6M6whpk3O9wWEJ7HXzJhyW5N4h9xNMIlUAbUVEKEU-HwSUqHi0GqPg/exec";
const PENYAYANG_API_URL: string = "https://script.google.com/macros/s/AKfycbz2SagBXI7_VWD5hQg3Rw6Sw1JSYUwU6pGh1Cca59_jrq9i0b4GxDUD6Lpjmplr8KVa/exec";

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

const App: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showPenyayangModal, setShowPenyayangModal] = useState(false);
  const [showPerhimpunanModal, setShowPerhimpunanModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentView, setCurrentView] = useState<'HUB' | 'FORM' | 'PENYAYANG_FORM' | 'LIST' | 'PENYAYANG_LIST' | 'DASHBOARD' | 'ADMIN_PORTAL' | 'TAKWIM'>('HUB');
  const [reports, setReports] = useState<Report[]>([]);
  const [penyayangReports, setPenyayangReports] = useState<any[]>([]);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [editingPenyayangReport, setEditingPenyayangReport] = useState<any | null>(null);
  const [syncStatus, setSyncStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginFeedback, setLoginFeedback] = useState<'SUCCESS' | 'ERROR' | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logoUrl = "https://lh3.googleusercontent.com/d/1UAlLnJkiTebZU-nVAv1pByGQyUz2ZSpR";

  const fetchReports = async (showLoading = true) => {
    if (showLoading) setSyncStatus('LOADING');
    try {
      const response = await fetch(GOOGLE_SHEET_API_URL);
      const data = await response.json();
      if (Array.isArray(data)) {
        const uniqueMap = new Map();
        data.filter(r => r.minggu).forEach(item => uniqueMap.set(item.id, item));
        const uniqueData = Array.from(uniqueMap.values()) as Report[];
        const sortedData = uniqueData.sort((a, b) => parseInt(b.minggu) - parseInt(a.minggu));
        setReports(sortedData);
        setSyncStatus('SUCCESS');
      }
    } catch (error) {
      console.error("Ralat Cloud:", error);
      setSyncStatus('ERROR');
    }
  };

  const fetchPenyayangReports = async (showLoading = true) => {
    if (showLoading) setSyncStatus('LOADING');
    try {
      const response = await fetch(PENYAYANG_API_URL);
      const data = await response.json();
      if (Array.isArray(data)) {
        const uniqueMap = new Map();
        data.forEach(item => uniqueMap.set(item.id, item));
        const uniqueData = Array.from(uniqueMap.values());
        const sortedData = uniqueData.sort((a, b) => new Date(b.tarikh).getTime() - new Date(a.tarikh).getTime());
        setPenyayangReports(sortedData);
        setSyncStatus('SUCCESS');
      }
    } catch (error) {
      console.error("Ralat Cloud Penyayang:", error);
      setSyncStatus('ERROR');
    }
  };

  useEffect(() => {
    fetchReports();
    fetchPenyayangReports(false);
  }, []);

  const handleSaveReport = (report: any) => {
    // 1. Paparkan tetingkap kejayaan SERTA-MERTA (Instant Feedback)
    setShowSuccessModal(true);
    setSyncStatus('LOADING');

    const isPenyayang = !!report.program;
    const targetUrl = isPenyayang ? PENYAYANG_API_URL : GOOGLE_SHEET_API_URL;

    // 2. Kemaskini state tempatan segera (Optimistic UI Update)
    if (!isPenyayang) {
      setReports(prev => {
        const existingIndex = prev.findIndex(r => r.id === report.id);
        const updated = [...prev];
        if (existingIndex > -1) {
          updated[existingIndex] = report;
        } else {
          updated.unshift(report);
        }
        return updated.sort((a, b) => parseInt(b.minggu) - parseInt(a.minggu));
      });
    } else {
      setPenyayangReports(prev => {
        const existingIndex = prev.findIndex(r => r.id === report.id);
        const updated = [...prev];
        if (existingIndex > -1) {
          updated[existingIndex] = report;
        } else {
          updated.unshift(report);
        }
        return updated.sort((a, b) => new Date(b.tarikh).getTime() - new Date(a.tarikh).getTime());
      });
    }

    // 3. Alihkan pengguna ke paparan senarai dengan pantas (Tutup tetingkap selepas animasi singkat)
    setTimeout(() => {
      setShowSuccessModal(false);
      setCurrentView(isPenyayang ? 'PENYAYANG_LIST' : 'LIST');
    }, 1200);

    // 4. Hantar data ke Google Sheets di latar belakang (Background Process)
    fetch(targetUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    })
    .then(() => {
      setSyncStatus('SUCCESS');
      // Sync semula data cloud selepas 2 saat untuk pastikan konsistensi tanpa mengganggu pengguna
      setTimeout(() => {
        if (!isPenyayang) fetchReports(false);
        else fetchPenyayangReports(false);
      }, 2000);
    })
    .catch(error => {
      console.error("Gagal menyegerakan ke Cloud di latar belakang:", error);
      setSyncStatus('ERROR');
    });
  };

  const handleMenuClick = (title: string) => {
    if (title === "LAPORAN PERHIMPUNAN RASMI SEKOLAH") {
      setShowPerhimpunanModal(true);
    } else if (title === "LAPORAN GURU PENYAYANG") {
      setShowPenyayangModal(true);
    } else if (title === "TAKWIM HEM 2026") {
      setCurrentView('TAKWIM');
    }
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      setIsLoggedIn(false);
      setId('');
      setPassword('');
      setCurrentView('HUB');
      setIsLoggingOut(false);
    }, 1500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if ((id === 'ADMIN' || id === 'RITA' || id === 'admin') && password === '123456') {
      setLoginFeedback('SUCCESS');
      setTimeout(() => {
        setIsLoggedIn(true);
        setLoginFeedback(null);
        setShowLogin(false);
        setCurrentView('ADMIN_PORTAL');
      }, 2200); 
    } else {
      setLoginFeedback('ERROR');
      setTimeout(() => setLoginFeedback(null), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      
      {/* Animasi Log Keluar Berjaya */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-2xl animate-backdrop-fade"></div>
          <div className="relative text-center animate-super-spring flex flex-col items-center">
             <div className="w-24 h-24 bg-rose-500 rounded-[2.5rem] flex items-center justify-center text-white mb-8 shadow-2xl animate-bounce">
                <LogOut size={48} />
             </div>
             <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none mb-4">LOG KELUAR<br/>BERJAYA</h2>
          </div>
        </div>
      )}

      {/* Animasi Log Masuk Berjaya */}
      {loginFeedback === 'SUCCESS' && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-blue-950/90 backdrop-blur-[30px] animate-backdrop-fade"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="relative text-center flex flex-col items-center">
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-blue-500 rounded-[3rem] blur-2xl opacity-40 animate-pulse"></div>
              <div className="absolute -inset-8 border border-blue-400/30 rounded-full animate-[ping_2s_infinite]"></div>
              <div className="absolute -inset-16 border border-blue-400/10 rounded-full animate-[ping_3s_infinite]"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-[2.8rem] flex items-center justify-center text-white shadow-[0_20px_50px_rgba(37,99,235,0.4)] border border-white/20 animate-super-spring">
                <ShieldCheck size={64} strokeWidth={2.5} />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-6xl md:text-7xl font-black text-white tracking-tighter uppercase leading-tight animate-reveal-up" style={{ animationDelay: '0.2s' }}>
                LOG MASUK<br/>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-200">BERJAYA</span>
              </h2>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-8 left-8 z-[100]">
        {syncStatus === 'LOADING' && (
          <div className="bg-slate-900/90 backdrop-blur-md text-white px-5 py-2.5 rounded-2xl flex items-center space-x-3 shadow-2xl border border-blue-500/30">
            <Loader2 size={14} className="animate-spin text-blue-400" />
            <span className="text-[9px] font-black uppercase tracking-widest">Cloud Syncing...</span>
          </div>
        )}
      </div>

      <main className="flex-grow container mx-auto px-6 py-12 md:py-20 relative z-10">
        
        {currentView === 'HUB' && (
          <div className="absolute top-4 right-6 md:top-8 md:right-8 z-30">
            {!isLoggedIn ? (
              <button 
                onClick={() => setShowLogin(true)}
                className="group flex items-center space-x-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl text-[10px] md:text-xs font-black shadow-xl hover:bg-blue-600 transition-all border border-white/10 active:scale-95"
              >
                <Lock size={14} />
                <span className="tracking-widest uppercase">ADMIN LOGIN</span>
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setCurrentView('ADMIN_PORTAL')}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3.5 rounded-2xl text-[10px] md:text-xs font-black shadow-xl animate-glow"
                >
                  <ShieldCheck size={14} />
                  <span className="tracking-widest uppercase">PORTAL PENYELARAS</span>
                </button>
                <button onClick={handleLogout} className="p-3.5 bg-rose-500 text-white rounded-2xl hover:bg-rose-600 transition-colors shadow-lg">
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {currentView === 'HUB' && (
          <>
            <div className="max-w-5xl mx-auto text-center mb-16 space-y-6">
              <div className="flex justify-center mb-6">
                <img src={logoUrl} alt="Lencana" className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl animate-in zoom-in duration-1000"/>
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-[0.95] tracking-tighter flex flex-col gap-4">
                <span>DIGITAL HUB</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-500 uppercase text-4xl md:text-7xl">Hal Ehwal Murid</span>
                <span className="text-2xl md:text-4xl font-extrabold text-slate-700">SK METHODIST PETALING JAYA</span>
              </h1>
            </div>
            <HubMenu onMenuClick={handleMenuClick} />
          </>
        )}

        {currentView === 'ADMIN_PORTAL' && isLoggedIn && (
          <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
             <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900 p-10 md:p-14 rounded-[3.5rem] text-white shadow-3xl relative overflow-hidden">
                <div className="relative z-10 flex items-center space-x-8 text-left">
                   <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center">
                      <Settings size={40} className="animate-spin-slow" />
                   </div>
                   <div>
                      <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">Portal Penyelaras</h2>
                      <p className="text-blue-400 font-bold uppercase tracking-widest text-xs mt-2">SESI AKTIF: TAHUN 2026</p>
                   </div>
                </div>
                <div className="relative z-10 flex items-center space-x-4 mt-8 md:mt-0">
                   <button onClick={() => setCurrentView('HUB')} className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-2xl font-black text-xs uppercase transition-all">UTAMA</button>
                   <button onClick={handleLogout} className="bg-rose-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase transition-all">LOG KELUAR</button>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <button onClick={() => setCurrentView('DASHBOARD')} className="glass-card p-10 rounded-[3rem] text-left hover:shadow-2xl transition-all border border-blue-100 group">
                   <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <BarChart3 size={32} />
                   </div>
                   <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">DASHBOARD PENGISIAN</h3>
                </button>

                <button onClick={() => setCurrentView('LIST')} className="glass-card p-10 rounded-[3rem] text-left hover:shadow-2xl transition-all border border-indigo-100 group">
                   <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <LayoutGrid size={32} />
                   </div>
                   <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">REKOD PERHIMPUNAN</h3>
                </button>

                <button onClick={() => setCurrentView('PENYAYANG_LIST')} className="glass-card p-10 rounded-[3rem] text-left hover:shadow-2xl transition-all border border-rose-100 group">
                   <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-6 group-hover:bg-rose-600 group-hover:text-white transition-all">
                    <Heart size={32} />
                   </div>
                   <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">REKOD GURU PENYAYANG</h3>
                </button>
             </div>
          </div>
        )}

        {currentView === 'FORM' && (
          <ReportForm 
            onBack={() => editingReport ? setCurrentView('LIST') : setCurrentView(isLoggedIn ? 'ADMIN_PORTAL' : 'HUB')} 
            onSave={handleSaveReport}
            initialData={editingReport}
          />
        )}

        {currentView === 'PENYAYANG_FORM' && (
          <PenyayangForm 
            onBack={() => editingPenyayangReport ? setCurrentView('PENYAYANG_LIST') : setCurrentView('HUB')} 
            onSave={handleSaveReport}
            initialData={editingPenyayangReport}
          />
        )}

        {currentView === 'LIST' && (
          <ReportList 
            reports={reports}
            onBack={() => setCurrentView(isLoggedIn ? 'ADMIN_PORTAL' : 'HUB')}
            onEdit={(report) => { setEditingReport(report); setCurrentView('FORM'); }}
            onAddNew={() => { setEditingReport(null); setCurrentView('FORM'); }}
            isAdmin={isLoggedIn}
          />
        )}

        {currentView === 'PENYAYANG_LIST' && (
          <PenyayangList 
            reports={penyayangReports}
            onBack={() => setCurrentView(isLoggedIn ? 'ADMIN_PORTAL' : 'HUB')}
            onEdit={(report) => { setEditingPenyayangReport(report); setCurrentView('PENYAYANG_FORM'); }}
            isAdmin={isLoggedIn}
          />
        )}

        {currentView === 'DASHBOARD' && (
          <Dashboard 
            reports={reports}
            onBack={() => setCurrentView(isLoggedIn ? 'ADMIN_PORTAL' : 'HUB')}
          />
        )}

        {currentView === 'TAKWIM' && (
          <TakwimView onBack={() => setCurrentView('HUB')} />
        )}

      </main>

      {/* Perhimpunan Modal (Pop-out dengan 3 pilihan) */}
      {showPerhimpunanModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowPerhimpunanModal(false)}></div>
          <div className="relative glass-card w-full max-w-xl p-10 md:p-14 rounded-[3.5rem] shadow-3xl animate-super-spring">
            <button onClick={() => setShowPerhimpunanModal(false)} className="absolute top-8 right-8 p-3 bg-slate-100 text-slate-400 rounded-2xl hover:bg-rose-500 hover:text-white transition-all">
              <X size={24} />
            </button>
            <div className="text-center mb-12">
              <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-6 shadow-2xl">
                <School size={48} />
              </div>
              <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter leading-none">Laporan Perhimpunan Rasmi</h3>
            </div>
            
            <div className="space-y-4">
              <button onClick={() => { setEditingReport(null); setCurrentView('FORM'); setShowPerhimpunanModal(false); }} className="group flex items-center justify-between w-full bg-white border border-slate-200 p-6 rounded-[2rem] hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                <div className="flex items-center space-x-5">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition-colors">
                    <FilePlus size={28} />
                  </div>
                  <div className="text-left">
                    <span className="block font-black uppercase tracking-tight text-lg">ISI LAPORAN PERHIMPUNAN RASMI</span>
                  </div>
                </div>
                <ArrowRight size={20} />
              </button>

              <button onClick={() => { setCurrentView('LIST'); setShowPerhimpunanModal(false); }} className="group flex items-center justify-between w-full bg-white border border-slate-200 p-6 rounded-[2rem] hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                <div className="flex items-center space-x-5">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition-colors">
                    <LayoutGrid size={28} />
                  </div>
                  <div className="text-left">
                    <span className="block font-black uppercase tracking-tight text-lg leading-tight">KEMASKINI REKOD PENGISIAN PERHIMPUNAN RASMI</span>
                  </div>
                </div>
                <ArrowRight size={20} />
              </button>

              <button onClick={() => { setCurrentView('DASHBOARD'); setShowPerhimpunanModal(false); }} className="group flex items-center justify-between w-full bg-slate-900 text-white p-6 rounded-[2rem] hover:bg-blue-500 transition-all shadow-xl">
                <div className="flex items-center space-x-5">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                    <BarChart3 size={28} />
                  </div>
                  <div className="text-left">
                    <span className="block font-black uppercase tracking-tight text-lg leading-tight">DASHBOARD PENGISIAN REKOD PERHIMPUNAN</span>
                  </div>
                </div>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>
          <div className="relative glass-card w-full max-sm p-10 rounded-[3rem] shadow-3xl animate-super-spring text-center">
            <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-6 shadow-2xl animate-bounce">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-2">Laporan Berjaya!</h3>
            <p className="text-slate-500 text-xs font-bold mb-8">Data sedang disimpan ke Cloud...</p>
            <button onClick={() => setShowSuccessModal(false)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl">Tutup</button>
          </div>
        </div>
      )}

      {showPenyayangModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowPenyayangModal(false)}></div>
          <div className="relative glass-card w-full max-w-lg p-12 rounded-[3.5rem] shadow-3xl animate-super-spring text-center">
            <button onClick={() => setShowPenyayangModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-rose-500"><X size={24} /></button>
            <div className="w-24 h-24 bg-rose-500 rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-8 shadow-2xl">
              <Heart size={48} fill="currentColor" />
            </div>
            <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-10">Guru Penyayang</h3>
            <div className="space-y-4">
              <button onClick={() => { setEditingPenyayangReport(null); setShowPenyayangModal(false); setCurrentView('PENYAYANG_FORM'); }} className="group flex items-center justify-between bg-white border border-slate-200 p-6 rounded-3xl hover:bg-rose-500 hover:text-white transition-all w-full shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center group-hover:bg-rose-400 group-hover:text-white"><FilePlus size={24} /></div>
                  <span className="font-black uppercase tracking-widest text-sm">Isi Laporan Baru</span>
                </div>
                <ArrowRight size={20} />
              </button>
              <button onClick={() => { setEditingPenyayangReport(null); setShowPenyayangModal(false); setCurrentView('PENYAYANG_LIST'); }} className="group flex items-center justify-between bg-slate-900 text-white p-6 rounded-3xl hover:bg-rose-600 transition-all w-full shadow-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center"><LayoutGrid size={24} /></div>
                  <span className="font-black uppercase tracking-widest text-sm">Rekod Laporan</span>
                </div>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogin && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowLogin(false)}></div>
          <div className="relative glass-card w-full max-w-md p-10 rounded-[3rem] shadow-3xl animate-super-spring text-center">
            <button onClick={() => setShowLogin(false)} className="absolute top-8 right-8 text-slate-400 hover:text-rose-500"><X size={24} /></button>
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-4 shadow-xl"><Lock size={32} /></div>
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Admin Access</h3>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <input type="text" placeholder="ID Pengguna" value={id} onChange={(e) => setId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold outline-none" />
              <input type="password" placeholder="Kata Laluan" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold outline-none" />
              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all">Log Masuk</button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default App;
