
import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Users, Heart, 
  Camera, Sparkles, 
  Loader2, Trash2, Upload, Save, ArrowLeft
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface PenyayangReport {
  id: string;
  program: string;
  tarikh: string;
  hari: string;
  tempat: string;
  tempatLain: string;
  sasaran: string;
  objektif: string;
  aktiviti: string;
  images: string[];
  disediakanOleh: string;
}

interface PenyayangFormProps {
  onBack: () => void;
  onSave: (report: any) => void;
  initialData?: PenyayangReport | null;
}

const SENARAI_GURU = [
  "AHMAD FAIZ BIN OSMAN", "AHMAD MUHAIMIN BIN ABDU RAHIM", "ANBALAGAN A/L VELU",
  "CHONG FOONG LING", "CHUA KAR LING", "FARAH FATIHAH BINTI MEGAT AHMAD FAUZI",
  "FATIN NUR THAQIFAH BINTI KAMARUZZAMAN", "HAFZAN SAFUAN BIN SHAMSUDDIN",
  "HARSHARANJIT KAUR A/P TEJINDER SINGH", "KALISWARY A/P BALIAYAN",
  "MOHD RAZIL BIN MD ATAN", "MUHAMMAD DAMSHIK BIN DANIAL",
  "MUHAMMAD FARHAN B AHAMAD KALAM", "MUHD. ZUL' AMIN BIN MD ISA",
  "NAZHATULNAJIHAH BINTI HASHIM", "NIK NUR A'LIYAH BINTI MOHD KAMAROLZAMAN",
  "NIK NUR KAMILIA BT NIK MAWARDI", "NOR AIZA BINTI AYOB", "NORHAZME AFIQAH BINTI AROME",
  "RITA SELVAMALAR A/P JOHN STEPHEN HENRY", "ROZANI BINTI MURI", "SAMARU B DAUD",
  "SHAARIEGAA GANESARAO", "SITI AZLIN BT MOHAMMAD", "SITI KHADIJAH BINTI MUHAMMAD",
  "TAI SEE NEE", "WONG AI WEE", "ZAINAB BINTI RAHMAT", "ZUFADHILA BINTI NASRI",
  "MOHAMMAD AKIF BIN JAMAWI"
].sort();

const TEMPAT_LIST = [
  "DEWAN SEMARAK ILMU", "KANTIN", "KELAS", "BILIK KAUNSELING", 
  "PINTU PAGAR UTAMA SEKOLAH", "LAIN-LAIN"
];

export const PenyayangForm: React.FC<PenyayangFormProps> = ({ onBack, onSave, initialData }) => {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  
  const [formData, setFormData] = useState<PenyayangReport>({
    id: initialData?.id || Math.random().toString(36).substr(2, 9),
    program: initialData?.program || 'AMALAN GURU PENYAYANG',
    tarikh: initialData?.tarikh || new Date().toISOString().split('T')[0],
    hari: initialData?.hari || '',
    tempat: initialData?.tempat || 'PINTU PAGAR UTAMA SEKOLAH',
    tempatLain: initialData?.tempatLain || '',
    sasaran: initialData?.sasaran || '',
    objektif: initialData?.objektif || '',
    aktiviti: initialData?.aktiviti || '',
    images: initialData?.images || [],
    disediakanOleh: initialData?.disediakanOleh || ''
  });

  useEffect(() => {
    const days = ['AHAD', 'ISNIN', 'SELASA', 'RABU', 'KHAMIS', 'JUMAAT', 'SABTU'];
    const parts = formData.tarikh.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0]);
      const m = parseInt(parts[1]) - 1;
      const d = parseInt(parts[2]);
      const dateObj = new Date(y, m, d);
      setFormData(prev => ({ ...prev, hari: days[dateObj.getDay()] }));
    }
  }, [formData.tarikh]);

  const generateWithAI = async (field: string, promptText: string) => {
    setLoading(prev => ({ ...prev, [field]: true }));
    try {
      // Use process.env.API_KEY directly as per guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const promptValue = `Hasilkan satu ${field} ringkas dan menarik (maksimum 40 patah perkataan) untuk laporan program Guru Penyayang sekolah. Tema: ${promptText || 'Amalan Guru Penyayang'}.`;
      
      // Fix: Use explicit content structure to avoid Type/Blob conflict errors in some environments
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: promptValue }] }],
      });
      const generatedText = response.text || '';
      setFormData(prev => ({ ...prev, [field]: generatedText }));
    } catch (error: any) {
      console.error('AI Error:', error);
      alert('AI tidak dapat menjana teks. Sila taip secara manual.');
    } finally {
      setLoading(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    if (formData.images.length + files.length > 2) {
      alert("Maksimum 2 keping gambar sahaja dibenarkan.");
      return;
    }
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-10 duration-700 px-4 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <button onClick={onBack} className="flex items-center space-x-3 text-slate-500 hover:text-rose-600 transition-all font-bold text-sm group">
          <div className="p-3 rounded-2xl bg-white shadow-md border border-slate-100 group-hover:bg-rose-500 group-hover:text-white transition-all">
            <ArrowLeft size={20} />
          </div>
          <span>Kembali</span>
        </button>
        <div className="text-right">
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase leading-none">Laporan Program</h2>
          <p className="text-rose-500 font-bold text-[10px] uppercase tracking-widest mt-2">GURU PENYAYANG</p>
        </div>
      </div>

      <div className="glass-card rounded-[3.5rem] p-8 md:p-14 shadow-2xl border border-white space-y-12">
        <section className="space-y-4">
          <div className="flex items-center space-x-3 border-b border-rose-100 pb-4">
            <div className="p-2 bg-rose-500 rounded-lg text-white"><Heart size={18} fill="currentColor" /></div>
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Nama Program</h3>
          </div>
          <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100">
            <span className="text-2xl font-black text-rose-700 tracking-tight">{formData.program}</span>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tarikh Program</label>
            <input type="date" name="tarikh" value={formData.tarikh} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 font-bold text-slate-700 focus:ring-4 focus:ring-rose-50 outline-none" />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hari</label>
            <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-bold text-slate-600 outline-none uppercase">{formData.hari}</div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-50">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center"><MapPin size={12} className="mr-2" /> Tempat Program</label>
            <select name="tempat" value={formData.tempat} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-rose-50">
              {TEMPAT_LIST.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {formData.tempat === 'LAIN-LAIN' && (
              <input type="text" name="tempatLain" placeholder="Sila nyatakan tempat..." value={formData.tempatLain} onChange={handleInputChange} className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-medium text-sm outline-none animate-in slide-in-from-top-2 duration-300" />
            )}
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center"><Users size={12} className="mr-2" /> Sasaran</label>
            <input type="text" name="sasaran" value={formData.sasaran} onChange={handleInputChange} placeholder="contoh murid tahun 2 Jasmine" className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-rose-50" />
          </div>
        </section>
        
        <section className="space-y-4 pt-4 border-t border-slate-50">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Objektif Program</label>
            <button onClick={() => generateWithAI('objektif', formData.program)} className={`flex items-center space-x-2 text-[10px] font-black text-white px-4 py-2 rounded-xl transition-all shadow-lg ${loading.objektif ? 'bg-slate-400' : 'bg-rose-500 hover:scale-105 active:scale-95 animate-pulse-soft'}`}>
              {loading.objektif ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
              <span>{loading.objektif ? 'MENJANA...' : 'JANA DENGAN AI'}</span>
            </button>
          </div>
          <textarea name="objektif" value={formData.objektif} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-2xl p-5 font-medium text-slate-700 min-h-[100px] outline-none focus:ring-4 focus:ring-rose-50" placeholder="Terangkan objektif program..." />
        </section>

        <section className="space-y-4 pt-4 border-t border-slate-50">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ringkasan Aktiviti</label>
            <button onClick={() => generateWithAI('aktiviti', `Aktiviti program Guru Penyayang di ${formData.tempat}`)} className={`flex items-center space-x-2 text-[10px] font-black text-white px-4 py-2 rounded-xl transition-all shadow-lg ${loading.aktiviti ? 'bg-slate-400' : 'bg-rose-500 hover:scale-105 active:scale-95'}`}>
              {loading.aktiviti ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
              <span>{loading.aktiviti ? 'MENJANA...' : 'JANA DENGAN AI'}</span>
            </button>
          </div>
          <textarea name="aktiviti" value={formData.aktiviti} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-2xl p-5 font-medium text-slate-700 min-h-[120px] outline-none focus:ring-4 focus:ring-rose-50" placeholder="Terangkan ringkasan aktiviti yang dijalankan..." />
        </section>

        <section className="space-y-4 pt-4 border-t border-slate-50">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center"><Camera size={12} className="mr-2"/> Lensa Bergambar (Maksimum 2 Keping)</label>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative aspect-video rounded-3xl overflow-hidden group shadow-lg border border-slate-100">
                  <img src={img} className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(idx)} className="absolute top-4 right-4 p-2 bg-rose-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg"><Trash2 size={16}/></button>
                </div>
              ))}
              {formData.images.length < 2 && (
                <label className="aspect-video rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-rose-50 transition-all hover:border-rose-400 group">
                  <Upload size={32} className="text-slate-300 mb-3 group-hover:text-rose-500 transition-colors" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600">Muat Naik Gambar</span>
                  <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                </label>
              )}
           </div>
        </section>

        <section className="space-y-4 pt-4 border-t border-slate-50">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Disediakan Oleh</label>
          <select name="disediakanOleh" value={formData.disediakanOleh} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-2xl py-5 px-6 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-rose-50">
            <option value="">-- Sila Pilih Nama Guru --</option>
            {SENARAI_GURU.map((guru) => <option key={guru} value={guru}>{guru}</option>)}
          </select>
        </section>

        <div className="pt-10 flex flex-col md:flex-row gap-5">
          <button onClick={() => onSave(formData)} className="flex-grow bg-rose-600 text-white py-6 rounded-[2rem] font-black tracking-[0.2em] uppercase shadow-2xl hover:bg-rose-700 transition-all flex items-center justify-center space-x-3 transform active:scale-[0.98]">
            <Save size={22} /><span>Simpan Laporan</span>
          </button>
          <button onClick={onBack} className="bg-slate-100 text-slate-500 py-6 px-12 rounded-[2rem] font-black tracking-[0.1em] uppercase hover:bg-slate-200 transition-all">Batal</button>
        </div>
      </div>
    </div>
  );
};
