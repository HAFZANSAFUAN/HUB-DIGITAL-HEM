
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
  "AHMAD FAIZ BIN OSMAN", "AHMAD MUHAIMIN BIN ABDU RAHIM", "ANBALAGAN A/L VELU",
  "CHONG FOONG LING", "CHUA KAR LING", "FARAH FATIHAH BINTI MEGAT AHMAD FAUZI",
  "FATIN NUR THAQIFAH BINTI KAMARUZZAMAN", "HAFZAN SAFUAN BIN SHAMSUDDIN",
  "HARSHARANJIT KAUR A/P TEJINDER SINGH", "KALISWARY A/P BALIAYAN",
  "MOHAMMAD AKIF BIN JAMAWI", "MOHD RAZIL BIN MD ATAN", "MUHAMMAD DAMSHIK BIN DANIAL",
  "MUHAMMAD FARHAN B AHAMAD KALAM", "MUHD. ZUL' AMIN BIN MD ISA",
  "NAZHATULNAJIHAH BINTI HASHIM", "NIK NUR A'LIYAH BINTI MOHD KAMAROLZAMAN",
  "NIK NUR KAMILIA BT NIK MAWARDI", "NOR AIZA BINTI AYOB", "NORHAZME AFIQAH BINTI AROME",
  "RITA SELVAMALAR A/P JOHN STEPHEN HENRY", "ROZANI BINTI MURI", "SAMARU B DAUD",
  "SHAARIEGAA GANESARAO", "SITI AZLIN BT MOHAMMAD", "SITI KHADIJAH BINTI MUHAMMAD",
  "TAI SEE NEE", "WONG AI WEE", "ZAINAB BINTI RAHMAT", "ZUFADHILA BINTI NASRI"
].sort();

export const ReportForm: React.FC<{ onBack: () => void, onSave: (report: any) => void, initialData?: Report | null }> = ({ onBack, onSave, initialData }) => {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [formData, setFormData] = useState<Report>({
    id: initialData?.id || Math.random().toString(36).substr(2, 9),
    tarikh: initialData?.tarikh || new Date().toISOString().split('T')[0],
    hari: initialData?.hari || 'Isnin',
    minggu: initialData?.minggu || '1',
    masa: initialData?.masa || '07:30',
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

  const generateWithAI = async (field: string, prompt: string) => {
    setLoading(prev => ({ ...prev, [field]: true }));
    try {
      // Akses secara selamat menggunakan window.process
      const apiKey = (window as any).process?.env?.API_KEY || "";
      if (!apiKey) {
        alert("Kunci API belum diset. Sila isi secara manual.");
        setLoading(prev => ({ ...prev, [field]: false }));
        return;
      }
      
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Sebagai seorang pelapor perhimpunan sekolah, hasilkan teks ringkas dalam Bahasa Melayu untuk: ${prompt}`,
      });
      setFormData(prev => ({ ...prev, [field]: response.text?.trim() || '' }));
    } catch (error) {
      console.error(error);
      alert("AI gagal berfungsi. Sila pastikan sambungan internet stabil.");
    } finally {
      setLoading(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const inputFocusClasses = "focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none";

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 animate-super-spring">
      <div className="flex items-center justify-between mb-10">
        <button onClick={onBack} className="flex items-center space-x-2 text-slate-500 hover:text-blue-600 font-bold">
          <ArrowLeft size={20} /><span>Kembali</span>
        </button>
        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Laporan Perhimpunan</h2>
      </div>
      <div className="glass-card rounded-[3rem] p-8 md:p-12 shadow-2xl space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
           <div className="space-y-1">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tarikh</label>
             <input type="date" name="tarikh" value={formData.tarikh} onChange={handleInputChange} className={`w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold ${inputFocusClasses}`} />
           </div>
           <div className="space-y-1">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Minggu</label>
             <input type="number" name="minggu" value={formData.minggu} onChange={handleInputChange} className={`w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold ${inputFocusClasses}`} />
           </div>
           <div className="space-y-1">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kumpulan</label>
             <select name="kumpulan" value={formData.kumpulan} onChange={handleInputChange} className={`w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold ${inputFocusClasses}`}>
               <option value="A">Kumpulan A</option>
               <option value="B">Kumpulan B</option>
               <option value="C">Kumpulan C</option>
             </select>
           </div>
        </div>

        <div className="space-y-6 text-left">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tema Perhimpunan</label>
            <input name="tema" value={formData.tema} onChange={handleInputChange} className={`w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold ${inputFocusClasses}`} placeholder="Contoh: Disiplin Diri" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Huraian Perincian</label>
              <button onClick={() => generateWithAI('huraian', `Huraian tema ${formData.tema}`)} className="text-[10px] font-bold text-blue-600 flex items-center bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors">
                {loading.huraian ? <Loader2 size={12} className="animate-spin mr-1" /> : <Sparkles size={12} className="mr-1" />} BANTUAN AI
              </button>
            </div>
            <textarea name="huraian" value={formData.huraian} onChange={handleInputChange} className={`w-full p-4 bg-white border border-slate-200 rounded-2xl min-h-[100px] ${inputFocusClasses}`} placeholder="Isi perincian di sini..." />
          </div>
        </div>

        <div className="space-y-4 text-left">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Disediakan Oleh</label>
           <select name="disediakanOleh" value={formData.disediakanOleh} onChange={handleInputChange} className={`w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold ${inputFocusClasses}`}>
             <option value="">-- Pilih Nama Guru --</option>
             {SENARAI_GURU.map(g => <option key={g} value={g}>{g}</option>)}
           </select>
        </div>

        <button onClick={() => onSave(formData)} className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-[0.98]">
          Simpan Laporan
        </button>
      </div>
    </div>
  );
};
