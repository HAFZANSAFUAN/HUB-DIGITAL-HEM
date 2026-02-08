
import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MapPin, Users, BookOpen, 
  MessageSquare, Camera, ChevronLeft, Sparkles, 
  Loader2, UserCheck, Trash2, Upload, Save, User, ArrowLeft, Home
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

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

interface ReportFormProps {
  onBack: () => void;
  onSave: (report: Report) => void;
  initialData?: Report | null;
}

const KUMPULAN_DATA = {
  'A': ['En Akif (K)', 'Pn Tai See Nee', 'Cik Kamilia', 'Cik Chong', 'En Samaru', 'Pn. Afiqah', 'Cik Zufadhila', 'Cik Kaliswary', 'En Anba'],
  'B': ['Pn Khadijah (K)', 'Pn Chua', 'Cik A\'liyah', 'En Muhaimin', 'Pn Wong', 'En Farhan', 'Cik Azlin', 'Pn Zainab'],
  'C': ['En. Damshik (K)', 'En Faiz', 'En Zul\'Amin', 'Pn. Nazhatulnajihah', 'Pn Farah', 'Pn. Shaariegaa', 'Cik Fatin', 'En Safuan']
};

const PENTADBIR_LIST = [
  'Guru Besar',
  'Penolong Kanan Kurikulum',
  'Penolong Kanan HEM',
  'Penolong Kanan Kokurikulum'
];

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
  "MOHAMMAD AKIF BIN JAMAWI",
  "MOHD RAZIL BIN MD ATAN",
  "MUHAMMAD DAMSHIK BIN DANIAL",
  "MUHAMMAD FARHAN B AHAMAD KALAM",
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
  "ZUFADHILA BINTI NASRI"
].sort();

export const ReportForm: React.FC<ReportFormProps> = ({ onBack, onSave, initialData }) => {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  
  // Fungsi helper untuk memastikan tarikh dalam format YYYY-MM-DD bagi input HTML
  const sanitizeDate = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr.includes('T')) {
      return dateStr.split('T')[0];
    }
    return dateStr;
  };

  // Fungsi helper untuk memastikan masa dalam format HH:mm bagi input HTML
  const sanitizeTime = (timeStr: string) => {
    if (!timeStr) return '07:30';
    // Jika format ISO (1899-12-30T00:34:35.000Z), ambil bahagian jam dan minit
    if (timeStr.includes('T')) {
      const date = new Date(timeStr);
      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    // Jika format HH:mm:ss, ambil HH:mm sahaja
    if (timeStr.includes(':')) {
      const parts = timeStr.split(':');
      if (parts.length >= 2) {
        return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
      }
    }
    return timeStr;
  };

  const [formData, setFormData] = useState<Report>({
    id: initialData?.id || Math.random().toString(36).substr(2, 9),
    tarikh: sanitizeDate(initialData?.tarikh || ''),
    hari: initialData?.hari || '',
    minggu: initialData?.minggu || '1',
    masa: sanitizeTime(initialData?.masa || '07:30'),
    tempat: initialData?.tempat || 'Tapak Perhimpunan',
    kumpulan: initialData?.kumpulan || 'A',
    tema: initialData?.tema || '',
    huraian: initialData?.huraian || '',
    ucapanGuruLepas: initialData?.ucapanGuruLepas || '',
    ucapanGuruIni: initialData?.ucapanGuruIni || '',
    pentadbirBerucap: initialData?.pentadbirBerucap || 'Guru Besar',
    ucapanPentadbir: initialData?.ucapanPentadbir || '',
    images: initialData?.images || [],
    disediakanOleh: initialData?.disediakanOleh || ''
  });

  const inputFocusClasses = "focus:scale-[1.01] focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:shadow-lg focus:shadow-blue-500/5 transition-all duration-300 outline-none";

  useEffect(() => {
    if (!initialData) {
      const today = new Date();
      const days = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];
      setFormData(prev => ({
        ...prev,
        tarikh: today.toISOString().split('T')[0],
        hari: days[today.getDay()]
      }));
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'tarikh') {
      const selectedDate = new Date(value);
      const days = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];
      const dayName = days[selectedDate.getDay()];
      setFormData(prev => ({ ...prev, tarikh: value, hari: dayName }));
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

  const handleSave = () => {
    if (!formData.tema.trim()) {
      alert('Sila isi Tema Perhimpunan terlebih dahulu.');
      return;
    }
    if (!formData.disediakanOleh) {
      alert('Sila pilih nama guru di bahagian "DISEDIAKAN OLEH".');
      return;
    }
    onSave(formData);
  };

  const generateWithAI = async (field: string, prompt: string) => {
    setLoading(prev => ({ ...prev, [field]: true }));
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Sebagai seorang pelapor perhimpunan sekolah yang profesional, hasilkan teks dalam Bahasa Melayu yang ringkas (bawah 50 patah perkatakan) untuk bahagian: ${prompt}. Berikan teks sahaja tanpa sebarang hiasan atau tanda petikan tambahan.`,
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

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-10 duration-700 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-50">
        <button 
          onClick={(e) => {
            e.preventDefault();
            onBack();
          }}
          className="flex items-center space-x-3 text-slate-500 hover:text-blue-600 transition-all font-bold text-sm group cursor-pointer"
        >
          <div className="p-3 rounded-2xl bg-white shadow-md border border-slate-100 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
            <ArrowLeft size={20} />
          </div>
          <div className="flex flex-col items-start text-left">
            <span className="tracking-widest uppercase text-[10px] opacity-60">Navigasi</span>
            <span className="tracking-tight uppercase">Kembali</span>
          </div>
        </button>
        
        <div className="text-right">
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase leading-none">
            {initialData ? 'Kemaskini Laporan' : 'Laporan Baru'}
          </h2>
          <p className="text-blue-600 font-bold text-[10px] uppercase tracking-widest mt-2">
            {initialData ? `REKOD MINGGU ${formData.minggu}` : 'PENGISIAN PERHIMPUNAN RASMI'}
          </p>
        </div>
      </div>

      <div className="glass-card rounded-[3.5rem] p-8 md:p-14 shadow-2xl border border-white/60 space-y-12">
        
        <section className="space-y-8">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Calendar size={18} />
            </div>
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm text-left">Butiran Perhimpunan</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tarikh</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="date" 
                  name="tarikh"
                  value={formData.tarikh}
                  onChange={handleInputChange}
                  className={`w-full bg-white border border-slate-200 rounded-2xl py-4 pl-11 pr-4 font-bold text-slate-700 ${inputFocusClasses}`}
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hari</label>
              <input 
                type="text" 
                name="hari"
                value={formData.hari}
                onChange={handleInputChange}
                placeholder="Isnin / Selasa..."
                className={`w-full bg-white border border-slate-200 rounded-2xl py-4 px-4 font-bold text-slate-700 ${inputFocusClasses}`}
              />
            </div>

            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Minggu</label>
              <select 
                name="minggu"
                value={formData.minggu}
                onChange={handleInputChange}
                className={`w-full bg-white border border-slate-200 rounded-2xl py-4 px-4 font-bold text-slate-700 appearance-none cursor-pointer ${inputFocusClasses}`}
              >
                {Array.from({ length: 43 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>Minggu {num}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Masa</label>
              <div className="relative">
                <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="time" 
                  name="masa"
                  value={formData.masa}
                  onChange={handleInputChange}
                  className={`w-full bg-white border border-slate-200 rounded-2xl py-4 pl-11 pr-4 font-bold text-slate-700 ${inputFocusClasses}`}
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tempat</label>
              <select 
                name="tempat"
                value={formData.tempat}
                onChange={handleInputChange}
                className={`w-full bg-white border border-slate-200 rounded-2xl py-4 px-4 font-bold text-slate-700 appearance-none cursor-pointer ${inputFocusClasses}`}
              >
                <option value="Dewan Semarak Ilmu">Dewan Semarak Ilmu</option>
                <option value="Tapak Perhimpunan">Tapak Perhimpunan</option>
              </select>
            </div>
          </div>
        </section>

        <section className="space-y-8 bg-blue-50/30 p-8 rounded-[2.5rem] border border-blue-100/50">
          <div className="flex items-center space-x-3 border-b border-blue-100 pb-4">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Users size={18} />
            </div>
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm text-left">Guru Bertugas</h3>
          </div>
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4">
              {['A', 'B', 'C'].map(grp => (
                <button
                  key={grp}
                  onClick={() => setFormData(prev => ({ ...prev, kumpulan: grp }))}
                  className={`flex-1 py-4 px-6 rounded-2xl font-black transition-all transform active:scale-95 ${
                    formData.kumpulan === grp 
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' 
                      : 'bg-white text-slate-400 border border-slate-200 hover:border-blue-300 hover:text-blue-500'
                  }`}
                >
                  KUMPULAN {grp}
                </button>
              ))}
            </div>
            <div className="bg-white/60 rounded-2xl p-6 border border-white text-left">
              <div className="flex items-center space-x-2 mb-4 text-blue-600">
                <UserCheck size={18} />
                <span className="font-black text-[10px] uppercase tracking-widest">Ahli Kumpulan</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {KUMPULAN_DATA[formData.kumpulan as keyof typeof KUMPULAN_DATA].map((nama, idx) => (
                  <div key={idx} className="bg-white px-4 py-2.5 rounded-xl text-[10px] font-bold text-slate-700 border border-slate-100 shadow-sm flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    <span>{nama}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <BookOpen size={18} />
            </div>
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm text-left">Tema & Perincian</h3>
          </div>
          <div className="space-y-6 text-left">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tema Mingguan</label>
              <input 
                type="text" 
                name="tema"
                value={formData.tema}
                onChange={handleInputChange}
                className={`w-full bg-white border border-slate-200 rounded-2xl py-4 px-4 font-bold text-slate-700 ${inputFocusClasses}`}
                placeholder="Contoh: Disiplin Diri Nadi Kejayaan"
              />
            </div>
            <div className="space-y-2 relative">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Huraian Perincian</label>
                <button 
                  onClick={() => generateWithAI('huraian', `Huraian perincian perhimpunan sekolah untuk tema: "${formData.tema}"`)}
                  disabled={loading.huraian || !formData.tema}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black hover:bg-indigo-100 transition-colors disabled:opacity-50"
                >
                  {loading.huraian ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  <span>BANTUAN AI</span>
                </button>
              </div>
              <textarea 
                name="huraian"
                value={formData.huraian}
                onChange={handleInputChange}
                className={`w-full bg-white border border-slate-200 rounded-3xl py-4 px-6 font-medium text-slate-700 min-h-[140px] resize-none ${inputFocusClasses}`}
                placeholder="Tulis huraian perincian di sini..."
              />
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
            <div className="p-2 bg-emerald-600 rounded-lg text-white">
              <MessageSquare size={18} />
            </div>
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm text-left">Sesi Ucapan</h3>
          </div>
          <div className="space-y-10 text-left">
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ucapan Guru Bertugas (Minggu Lepas)</label>
                <button onClick={() => generateWithAI('ucapanGuruLepas', 'Rumusan atau maklum balas guru bertugas minggu lepas')} disabled={loading.ucapanGuruLepas} className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black hover:bg-emerald-100 transition-colors disabled:opacity-50">
                  {loading.ucapanGuruLepas ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  <span>AI</span>
                </button>
              </div>
              <textarea name="ucapanGuruLepas" value={formData.ucapanGuruLepas} onChange={handleInputChange} className={`w-full bg-white border border-slate-200 rounded-3xl py-4 px-6 font-medium text-slate-700 min-h-[100px] resize-none ${inputFocusClasses}`} placeholder="Isi laporan guru bertugas minggu lepas..." />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Laporan Guru Bertugas (Minggu Ini)</label>
                <button onClick={() => generateWithAI('ucapanGuruIni', 'Laporan ringkas atau pesanan guru bertugas minggu ini')} disabled={loading.ucapanGuruIni} className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black hover:bg-emerald-100 transition-colors disabled:opacity-50">
                  {loading.ucapanGuruIni ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  <span>AI</span>
                </button>
              </div>
              <textarea name="ucapanGuruIni" value={formData.ucapanGuruIni} onChange={handleInputChange} className={`w-full bg-white border border-slate-200 rounded-3xl py-4 px-6 font-medium text-slate-700 min-h-[100px] resize-none ${inputFocusClasses}`} placeholder="Isi laporan guru bertugas minggu ini..." />
            </div>

            <div className="p-8 bg-slate-50/50 rounded-[3rem] border border-slate-100 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pentadbir Berucap</label>
                <select name="pentadbirBerucap" value={formData.pentadbirBerucap} onChange={handleInputChange} className={`w-full bg-white border border-slate-200 rounded-2xl py-4 px-4 font-bold text-slate-700 appearance-none cursor-pointer ${inputFocusClasses}`}>
                  {PENTADBIR_LIST.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Isi Ucapan Pentadbir</label>
                  <button onClick={() => generateWithAI('ucapanPentadbir', `Ucapan motivasi singkat daripada ${formData.pentadbirBerucap}`)} disabled={loading.ucapanPentadbir} className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black hover:bg-blue-100 transition-colors disabled:opacity-50">
                    {loading.ucapanPentadbir ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    <span>AI</span>
                  </button>
                </div>
                <textarea name="ucapanPentadbir" value={formData.ucapanPentadbir} onChange={handleInputChange} className={`w-full bg-white border border-slate-200 rounded-3xl py-4 px-6 font-medium text-slate-700 min-h-[100px] resize-none ${inputFocusClasses}`} placeholder="Ringkasan ucapan pentadbir..." />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-rose-500 rounded-lg text-white">
                <Camera size={18} />
              </div>
              <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm text-left">Lensa Perhimpunan</h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Maksimum 2 Gambar</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative group rounded-2xl overflow-hidden aspect-[8/6] border-2 border-white shadow-md bg-slate-100 max-w-[280px] mx-auto w-full transition-all">
                <img src={img} alt={`Lensa ${idx + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                <button onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))} className="absolute top-4 right-4 p-3 bg-rose-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg active:scale-90">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {formData.images.length < 2 && (
              <label className="flex flex-col items-center justify-center p-8 border-4 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all aspect-[8/6] group max-w-[280px] mx-auto w-full">
                <Upload size={32} className="text-slate-300 group-hover:text-blue-500 mb-4 transition-colors" />
                <span className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] group-hover:text-blue-600 transition-colors text-center leading-relaxed">Tambah<br/>Gambar ({formData.images.length}/2)</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>
        </section>

        <section className="space-y-8 bg-slate-50 p-10 rounded-[3rem] border border-slate-200 shadow-inner">
          <div className="flex items-center space-x-3 border-b border-slate-200 pb-4">
            <div className="p-2 bg-slate-800 rounded-lg text-white">
              <User size={18} />
            </div>
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm text-left">Pengesahan</h3>
          </div>
          <div className="space-y-4 text-left">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Disediakan Oleh</label>
            <select name="disediakanOleh" value={formData.disediakanOleh} onChange={handleInputChange} className={`w-full bg-white border border-slate-200 rounded-2xl py-5 px-6 font-bold text-slate-700 appearance-none cursor-pointer ${inputFocusClasses}`}>
              <option value="">-- Sila Pilih Nama Guru --</option>
              {SENARAI_GURU.map((guru) => (
                <option key={guru} value={guru}>{guru}</option>
              ))}
            </select>
          </div>
        </section>

        <div className="pt-10 flex flex-col md:flex-row gap-5">
          <button onClick={handleSave} className="flex-grow bg-blue-600 text-white py-6 rounded-[2rem] font-black tracking-[0.2em] uppercase shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all transform active:scale-[0.98] flex items-center justify-center space-x-3">
            <Save size={22} />
            <span>Simpan Laporan</span>
          </button>
          <button onClick={onBack} className="bg-slate-100 text-slate-500 py-6 px-12 rounded-[2rem] font-black tracking-[0.1em] uppercase hover:bg-slate-200 transition-all">Batal</button>
        </div>
      </div>
    </div>
  );
};
