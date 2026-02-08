
import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MapPin, Users, Heart, 
  MessageSquare, Camera, ChevronLeft, Sparkles, 
  Loader2, UserCheck, Trash2, Upload, Save, User, ArrowLeft, Home, Book
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

const TEMPAT_LIST = [
  'PINTU PAGAR UTAMA SEKOLAH',
  'DEWAN',
  'KELAS',
  'BILIK KAUNSELING',
  'KANTIN',
  'LAIN-LAIN (SILA NYATAKAN)'
];

const HARI_LIST = ['ISNIN', 'SELASA', 'RABU', 'KHAMIS', 'JUMAAT'];

const SENARAI_GURU = [
  "AHMAD FAIZ BIN OSMAN",
  "AHMAD MUHAIMIN BIN ABDU RAHIM",
  "ANBALAGAN A/L VELU",
  "CHONG FOONG LING",
  "CHUA KAR LING",
  "FARAH FATIHAH BINTI MEGAT AHMAD FAUZI",
  "FATIN NUR THAQIFAH BINTI KAMARUZZAMAN",
  "HAFZAN SAFUAN BIN SHAMSUDDIN",
  "HARSHARANJIT KAUR A/P TEJINDER SINGH",
  "KALISWARY A/P BALIAYAN",
  "MOHD RAZIL BIN MD ATAN",
  "MUHAMMAD DAMSHIK BIN DANIAL",
  "MUHAMMAD FARHAN B AHAMAD KAMAL",
  "MUHD. ZUL' AMIN BIN MD ISA",
  "NAZHATULNAJIHAH BINTI HASHIM",
  "NIK NUR A'LIYAH BINTI MOHD KAMAROLZAMAN",
  "NIK NUR KAMILIA BT NIK MAWARDI",
  "NOR AIZA BINTI AYOB",
  "NORHAZME AFIQAH BINTI AROME",
  "RITA SELVAMALAR A/P JOHN STEPHEN HENRY",
  "ROZANI BINTI MURI",
  "SAMARU B DAUD",
  "SHAARIEGAA GANESARAO",
  "SITI AZLIN BT MOHAMMAD",
  "SITI KHADIJAH BINTI MUHAMMAD",
  "TAI SEE NEE",
  "WONG AI WEE",
  "ZAINAB BINTI RAHMAT",
  "ZUFADHILA BINTI NASRI",
  "MOHAMMAD AKIF BIN JAMAWI"
].sort();

export const PenyayangForm: React.FC<PenyayangFormProps> = ({ onBack, onSave, initialData }) => {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  
  const sanitizeDate = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr.includes('T')) return dateStr.split('T')[0];
    return dateStr;
  };

  const [formData, setFormData] = useState<PenyayangReport>({
    id: initialData?.id || Math.random().toString(36).substr(2, 9),
    program: initialData?.program || 'AMALAN GURU PENYAYANG',
    tarikh: sanitizeDate(initialData?.tarikh || new Date().toISOString().split('T')[0]),
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
    if (!initialData) {
      const today = new Date();
      const days = ['AHAD', 'ISNIN', 'SELASA', 'RABU', 'KHAMIS', 'JUMAAT', 'SABTU'];
      setFormData(prev => ({ ...prev, hari: days[today.getDay()] }));
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'tarikh') {
      const selectedDate = new Date(value);
      const days = ['AHAD', 'ISNIN', 'SELASA', 'RABU', 'KHAMIS', 'JUMAAT', 'SABTU'];
      setFormData(prev => ({ ...prev, tarikh: value, hari: days[selectedDate.getDay()] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 2 - formData.images.length);
      const readers = files.map((file: File) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then((results: string[]) => {
        setFormData(prev => ({ ...prev, images: [...prev.images, ...results].slice(0, 2) }));
      });
    }
  };

  const generateWithAI = async (field: string, prompt: string) => {
    setLoading(prev => ({ ...prev, [field]: true }));
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Sebagai seorang guru yang melaksanakan program Guru Penyayang, hasilkan teks ringkas untuk bahagian: ${prompt}. Berikan 2-3 ayat sahaja dalam Bahasa Melayu. Fokus kepada aspek keceriaan, kasih sayang, dan motivasi murid.`,
      });
      const text = response.text || '';
      setFormData(prev => ({ ...prev, [field]: text.trim() }));
    } catch (error) {
      console.error('AI Error:', error);
      alert('Gagal menjana teks AI. Sila cuba lagi.');
    } finally {
      setLoading(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleSave = () => {
    if (!formData.sasaran || !formData.disediakanOleh) {
      alert('Sila lengkapkan sasaran dan nama guru.');
      return;
    }
    onSave(formData);
  };

  const inputFocusClasses = "focus:scale-[1.01] focus:ring-4 focus:ring-rose-100 focus:border-rose-400 focus:shadow-lg focus:shadow-rose-500/5 transition-all duration-300 outline-none";

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-10 duration-700 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-50">
        <button 
          onClick={onBack}
          className="flex items-center space-x-3 text-slate-500 hover:text-rose-600 transition-all font-bold text-sm group cursor-pointer"
        >
          <div className="p-3 rounded-2xl bg-white shadow-md border border-slate-100 group-hover:bg-rose-500 group-hover:text-white group-hover:scale-110 transition-all duration-300">
            <ArrowLeft size={20} />
          </div>
          <div className="flex flex-col items-start text-left">
            <span className="tracking-widest uppercase text-[10px] opacity-60">Navigasi</span>
            <span className="tracking-tight uppercase">Kembali</span>
          </div>
        </button>
        
        <div className="text-right">
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase leading-none">
            {initialData ? 'Kemaskini Laporan' : 'Laporan Program'}
          </h2>
          <p className="text-rose-500 font-bold text-[10px] uppercase tracking-widest mt-2">
            GURU PENYAYANG (DAILY REPORT)
          </p>
        </div>
      </div>

      <div className="glass-card rounded-[3.5rem] p-8 md:p-14 shadow-2xl border border-white/60 space-y-12">
        
        <section className="space-y-4 text-left">
          <div className="flex items-center space-x-3 border-b border-rose-100 pb-4">
            <div className="p-2 bg-rose-500 rounded-lg text-white">
              <Heart size={18} fill="currentColor" />
            </div>
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Nama Program</h3>
          </div>
          <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100">
            <span className="text-2xl font-black text-rose-700 tracking-tight">{formData.program}</span>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tarikh Program</label>
            <div className="relative">
              <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400" />
              <input 
                type="date" 
                name="tarikh"
                value={formData.tarikh}
                onChange={handleInputChange}
                className={`w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-700 ${inputFocusClasses}`}
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hari</label>
            <select 
              name="hari"
              value={formData.hari}
              onChange={handleInputChange}
              className={`w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 font-bold text-slate-700 appearance-none cursor-pointer ${inputFocusClasses}`}
            >
              <option value="">-- Pilih Hari --</option>
              {HARI_LIST.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        </section>

        <section className="space-y-4 text-left">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lokasi Aktiviti</label>
          <div className="grid grid-cols-1 gap-4">
            <select 
              name="tempat"
              value={formData.tempat}
              onChange={handleInputChange}
              className={`w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 font-bold text-slate-700 appearance-none cursor-pointer ${inputFocusClasses}`}
            >
              {TEMPAT_LIST.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {formData.tempat === 'LAIN-LAIN (SILA NYATAKAN)' && (
              <div className="relative animate-in slide-in-from-top-4 duration-300">
                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400" />
                <input 
                  type="text" 
                  name="tempatLain"
                  value={formData.tempatLain}
                  onChange={handleInputChange}
                  placeholder="Sila nyatakan tempat..."
                  className={`w-full bg-white border border-rose-200 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-700 ${inputFocusClasses}`}
                />
              </div>
            )}
          </div>
        </section>

        <section className="space-y-4 text-left">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sasaran Murid / Kumpulan</label>
          <div className="relative">
            <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400" />
            <input 
              type="text" 
              name="sasaran"
              value={formData.sasaran}
              onChange={handleInputChange}
              placeholder="Contoh: Murid Tahun 1, Murid Prasekolah, Semua Murid"
              className={`w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-700 ${inputFocusClasses}`}
            />
          </div>
        </section>

        <section className="space-y-10 text-left">
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Objektif Program</label>
              <button 
                onClick={() => generateWithAI('objektif', 'Objektif program Guru Penyayang di sekolah')}
                disabled={loading.objektif}
                className="flex items-center space-x-2 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black hover:bg-rose-100 transition-colors"
              >
                {loading.objektif ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                <span>BANTUAN AI</span>
              </button>
            </div>
            <textarea name="objektif" value={formData.objektif} onChange={handleInputChange} className={`w-full bg-white border border-slate-200 rounded-3xl py-4 px-6 font-medium text-slate-700 min-h-[100px] resize-none ${inputFocusClasses}`} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Aktiviti Ringkas</label>
              <button 
                onClick={() => generateWithAI('aktiviti', 'Laporan ringkas aktiviti menyambut murid di pagar sekolah')}
                disabled={loading.aktiviti}
                className="flex items-center space-x-2 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black hover:bg-rose-100 transition-colors"
              >
                {loading.aktiviti ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                <span>BANTUAN AI</span>
              </button>
            </div>
            <textarea name="aktiviti" value={formData.aktiviti} onChange={handleInputChange} className={`w-full bg-white border border-slate-200 rounded-3xl py-4 px-6 font-medium text-slate-700 min-h-[120px] resize-none ${inputFocusClasses}`} />
          </div>
        </section>

        <section className="space-y-8 text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-rose-500 rounded-lg text-white"><Camera size={18} /></div>
              <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Lensa Bergambar</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative group rounded-2xl overflow-hidden aspect-[8/6] border-2 border-white shadow-md bg-slate-100 max-w-[320px] mx-auto w-full transition-all">
                <img src={img} alt={`Lensa ${idx + 1}`} className="w-full h-full object-cover" />
                <button onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))} className="absolute top-4 right-4 p-3 bg-rose-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {formData.images.length < 2 && (
              <label className="flex flex-col items-center justify-center p-8 border-4 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 cursor-pointer hover:border-rose-400 hover:bg-rose-50/30 transition-all aspect-[8/6] group max-w-[320px] mx-auto w-full">
                <Upload size={32} className="text-slate-300 group-hover:text-rose-500 mb-4 transition-colors" />
                <span className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] group-hover:text-rose-600 transition-colors text-center leading-tight">Tambah Gambar<br/>({formData.images.length}/2)</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>
        </section>

        <section className="space-y-4 bg-slate-50 p-10 rounded-[3rem] border border-slate-200 shadow-inner text-left">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Disediakan Oleh</label>
          <div className="relative">
            <UserCheck size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-rose-500" />
            <select name="disediakanOleh" value={formData.disediakanOleh} onChange={handleInputChange} className={`w-full bg-white border border-slate-200 rounded-2xl py-5 pl-14 pr-6 font-bold text-slate-700 appearance-none cursor-pointer ${inputFocusClasses}`}>
              <option value="">-- Sila Pilih Nama Guru --</option>
              {SENARAI_GURU.map((guru) => (
                <option key={guru} value={guru}>{guru}</option>
              ))}
            </select>
          </div>
        </section>

        <div className="pt-10 flex flex-col md:flex-row gap-5">
          <button onClick={handleSave} className="flex-grow bg-rose-600 text-white py-6 rounded-[2rem] font-black tracking-[0.2em] uppercase shadow-2xl shadow-rose-200 hover:bg-rose-700 transition-all flex items-center justify-center space-x-3">
            <Save size={22} />
            <span>Simpan Laporan</span>
          </button>
          <button onClick={onBack} className="bg-slate-100 text-slate-500 py-6 px-12 rounded-[2rem] font-black tracking-[0.1em] uppercase hover:bg-slate-200 transition-all">Batal</button>
        </div>
      </div>
    </div>
  );
};
