
import React, { useState } from 'react';
import { X, HelpCircle, ShieldCheck, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'help' | 'privacy' | null>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <>
      <footer className="mt-20 py-12 px-6 border-t border-slate-200/60 glass-card">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-slate-200">
                M
              </div>
              <div className="text-left">
                <h4 className="font-extrabold text-slate-800 tracking-tight text-sm uppercase">SK METHODIST PETALING JAYA</h4>
                <div className="flex items-center text-blue-600 mt-1">
                  <MapPin size={10} className="mr-1.5 opacity-70" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Jalan 5/37, 46000, Petaling Jaya, Selangor
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-end space-y-4">
              <p className="text-slate-500 text-xs font-semibold">
                &copy; {new Date().getFullYear()} Digital Hub HEM. Dibangunkan untuk kecemerlangan murid.
              </p>
              <div className="flex space-x-10 text-[10px] font-black text-blue-600 uppercase tracking-[0.25em]">
                <button 
                  onClick={() => setActiveModal('help')}
                  className="hover:text-blue-800 hover:scale-110 transition-all active:scale-95 flex items-center space-x-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Bantuan</span>
                </button>
                <button 
                  onClick={() => setActiveModal('privacy')}
                  className="hover:text-blue-800 hover:scale-110 transition-all active:scale-95 flex items-center space-x-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>Privasi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Pop-out Modal for Help & Privacy */}
      {activeModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center px-6">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-fade-blur"
            onClick={closeModal}
          ></div>
          <div className="relative glass-card w-full max-w-sm p-10 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/80 animate-spring-in text-center">
            <button 
              onClick={closeModal}
              className="absolute top-8 right-8 p-2.5 rounded-2xl bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white transition-all active:scale-90 shadow-sm"
            >
              <X size={20} />
            </button>

            <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl ${activeModal === 'help' ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-indigo-600 text-white shadow-indigo-200'}`}>
              {activeModal === 'help' ? <HelpCircle size={48} strokeWidth={2.5} /> : <ShieldCheck size={48} strokeWidth={2.5} />}
            </div>

            <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tighter uppercase">
              {activeModal === 'help' ? 'Pusat Bantuan' : 'Polisi Privasi'}
            </h3>
            
            <div className="h-1.5 w-16 bg-blue-600 mx-auto mb-8 rounded-full"></div>

            <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-100">
              <p className="text-slate-700 font-black text-sm leading-relaxed tracking-tight">
                {activeModal === 'help' 
                  ? 'SILA HUBUNGI UNIT ICT SK METHODIST PJ' 
                  : '© SK Methodist PJ. All Rights Reserved'}
              </p>
            </div>

            <button 
              onClick={closeModal}
              className="mt-10 w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-[10px] tracking-[0.3em] uppercase shadow-xl hover:bg-blue-600 transition-all active:scale-[0.98] border border-white/10"
            >
              Faham & Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
};
