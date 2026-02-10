
import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MapPin, Users, 
  Sparkles, Loader2, Upload, Save, User, ArrowLeft, 
  Image as ImageIcon, Trash2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// Memberitahu TypeScript supaya tidak ralat dengan process.env di Vercel
declare const process: any;

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

const KUMPULAN_GURU: { [key: string]: string } = {
  "A": "EN AKIF (K), PN TAI SEE NEE, CIK KAMILIA, CIK CHONG, EN SAMARU, PN. AFIQAH, CIK ZUFADHILA, CIK KALISWARY, EN ANBA",
  "B": "PN KHADIJAH (K), PN CHUA, CIK A'LIYAH, EN MUHAIMIN, PN WONG, EN FARHAN, CIK AZLIN, PN ZAINAB",
  "C": "EN. DAMSHIK (K), EN FAIZ , EN ZUL'AMIN, PN. NAZHATULNAJIHAH , PN FARAH, PN. SHAARIEGAA, CIK FATIN, EN SAFUAN"
};

const SENARAI_GURU_PENYEDIA = [
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

export const ReportForm: React.FC<{ onBack: () => void, onSave: (report: any) => void, initialData?: Report | null }> = ({ onBack, onSave, initialData }) => {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Report>({
    id: initialData?.id || Math.random().toString(36).substring(2, 11),
    tarikh: initialData?.tarikh || new Date().toISOString().split('T')[0],
    hari: initialData?.hari || '',
    minggu: initialData?.minggu || '1',
    masa: initialData?.masa || '',
    tempat: initialData?.tempat || 'DEWAN SEMARAK ILMU',
    kumpulan: initialData?.kumpulan || 'A',
    tema: initialData?.tema || '',
    huraian: initialData?.huraian || '',
    ucapanGuruLepas: initialData?.ucapanGuruLepas || '',
    ucapanGuruIni: initialData?.ucapanGuruIni || '',
    pentadbirBerucap: initialData?.pentadbirBerucap || 'GURU BESAR',
    ucapanPentadbir: initialData?.ucapanPentadbir || '',
    images: initialData?.images || [],
    disediakanOleh: initialData?.disediakanOleh || ''
  });

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const days = ['AHAD', 'ISNIN', 'SELASA', 'RABU', 'KHAMIS', 'JUMAAT', 'SABTU'];
      const parts = formData.tarikh.split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0]);
        const m = parseInt(parts[1]) - 1;
        const d = parseInt(parts[2]);
        const dateObj = new Date(y, m, d);
        const dayName = days[dateObj.getDay()];
        const timeStr = now.toLocaleTimeString('ms-MY', { hour12: false, hour: '2-digit', minute: '2-digit' });
        setFormData(prev => ({ ...prev, hari: dayName, masa: prev.masa || timeStr }));
      }
    };
    updateDateTime();
  }, [formData.tarikh]);

  // Fix: Correctly initialize GoogleGenAI and call generateContent as per guidelines
  const generateWithAI = async (field: keyof Report, context: string) => {
    setLoading(prev => ({ ...prev, [field as string]: true }));
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const promptText = `Tulis satu ${field.toString().replace(/([A-Z])/g, ' $1').toLowerCase()} ringkas (MAKSIMUM 40 PATAH PERKATAAN) untuk perhimpunan sekolah SK Methodist Petaling Jaya. Konteks: ${context}. Sila berikan jawapan dalam Bahasa Melayu yang padat.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: promptText,
      });
      
      const generatedText = response.text || '';
      if (typeof (formData as any)[field] === 'string') {
        setFormData(prev => ({ ...prev, [field]: generatedText }));
      }
    } catch (error) {
      console.error("AI Error:", error);
      alert("Gagal menjana teks. Sila cuba lagi.");
    } finally {
      setLoading(prev => ({ ...prev, [field as string]: false }));
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

  const handleSave = () => {
    if (!formData.disediakanOleh) {
      alert("Sila pilih nama penyedia laporan.");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      onSave(formData);
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 animate-in fade-in slide-in-from-bottom-5 duration-700 text-left">
      <div className="flex items-center justify-between mb-10">
        <button onClick={onBack} className="flex items-center space-x-3 text-slate-500 hover:text-blue-600 font-bold transition-all group">
          <div className="p-3 rounded-2xl bg-white shadow-md border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <ArrowLeft size={20} />
          </div>
          <span>Kembali</span>
        </button>
        <div className="text-right">
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter leading-none">BORANG LAPORAN PERHIMPUNAN</h2>
          <p className="text-blue-600 font-bold text-[10px] uppercase tracking-widest mt-1">Sesi Persekolahan 2026</p>
        </div>
      </div>
      
      <div className="glass-card rounded-[3rem] p-8 md:p-12 shadow-2xl space-y-10 border border-white relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="space-y-2">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center"><Calendar size={12} className="mr-2"/> Tarikh</label>
             <input type="date" name="tarikh" value={formData.tarikh} onChange={handleInputChange} className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-blue-50 text-sm" />
           </div>
           <div className="space-y-2">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">Hari</label>
             <div className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-600 text-sm uppercase">{formData.hari}</div>
           </div>
           <div className="space-y-2">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Minggu</label>
             <select name="minggu" value={formData.minggu} onChange={handleInputChange} className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold outline-none text-sm">
               {Array.from({length: 43}, (_, i) => <option key={i+1} value={i+1}>Minggu {i+1}</option>)}
             </select>
           </div>
           <div className="space-y-2">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center"><Clock size={12} className="mr-2"/> Masa</label>
             <input 
               type="time" 
               name="masa" 
               value={formData.masa} 
               onChange={handleInputChange} 
               className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-blue-50 text-sm cursor-pointer" 
             />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
           <div className="space-y-2">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center"><MapPin size={12} className="mr-2"/> Tempat</label>
             <select name="tempat" value={formData.tempat} onChange={handleInputChange} className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold outline-none text-sm">
               <option value="DEWAN SEMARAK ILMU">DEWAN SEMARAK ILMU</option>
               <option value="TAPAK PERHIMPUNAN">TAPAK PERHIMPUNAN</option>
               <option value="KANTIN">KANTIN</option>
             </select>
           </div>
           <div className="space-y-2">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center"><Users size={12} className="mr-2"/> Kumpulan Guru Bertugas</label>
             <select name="kumpulan" value={formData.kumpulan} onChange={handleInputChange} className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold outline-none text-sm">
               <option value="A">KUMPULAN A</option>
               <option value="B">KUMPULAN B</option>
               <option value="C">KUMPULAN C</option>
             </select>
           </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 text-left shadow-xl animate-in fade-in duration-500">
           <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">Ahli Kumpulan {formData.kumpulan}:</p>
           <p className="text-xs font-black text-white leading-relaxed uppercase tracking-tight">
             {KUMPULAN_GURU[formData.kumpulan]}
           </p>
        </div>

        <div className="space-y-6 pt-4 border-t border-slate-100">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">1. Tema Perhimpunan</label>
            <input name="tema" value={formData.tema} onChange={handleInputChange} className="w-full p-5 bg-white border border-slate-200 rounded-2xl font-bold outline-none focus:border-blue-400 text-sm" placeholder="Contoh: DISIPLIN ASAS KEJAYAAN" />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">2. Huraian Tema Perhimpunan (AI - Had 40 Perkataan)</label>
              <button onClick={() => generateWithAI('huraian', `Huraian untuk tema perhimpunan: ${formData.tema}`)} disabled={loading.huraian} className="flex items-center space-x-2 text-[9px] font-black text-white px-4 py-2 bg-slate-900 rounded-xl hover:bg-blue-600 transition-all">
                {loading.huraian ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                <span>JANA AI</span>
              </button>
            </div>
            <textarea name="huraian" value={formData.huraian} onChange={handleInputChange} className="w-full p-5 bg-white border border-slate-200 rounded-2xl min-h-[80px] text-sm outline-none focus:ring-4 focus:ring-blue-50 font-medium" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">1. Ucapan Guru (Minggu Lepas - AI)</label>
              <button onClick={() => generateWithAI('ucapanGuruLepas', 'Laporan ringkas disiplin and kebersihan murid minggu lepas')} disabled={loading.ucapanGuruLepas} className="p-2 bg-slate-100 rounded-lg hover:bg-blue-100 text-blue-600 transition-all">
                {loading.ucapanGuruLepas ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
              </button>
            </div>
            <textarea name="ucapanGuruLepas" value={formData.ucapanGuruLepas} onChange={handleInputChange} className="w-full p-5 bg-white border border-slate-200 rounded-2xl min-h-[100px] text-sm outline-none" placeholder="Ringkasan minggu lepas..." />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">2. Ucapan Guru (Minggu Ini - AI)</label>
              <button onClick={() => generateWithAI('ucapanGuruIni', 'Pesanan disiplin and motivasi untuk murid-murid minggu ini')} disabled={loading.ucapanGuruIni} className="p-2 bg-slate-100 rounded-lg hover:bg-blue-100 text-blue-600 transition-all">
                {loading.ucapanGuruIni ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
              </button>
            </div>
            <textarea name="ucapanGuruIni" value={formData.ucapanGuruIni} onChange={handleInputChange} className="w-full p-5 bg-white border border-slate-200 rounded-2xl min-h-[100px] text-sm outline-none" placeholder="Pesanan minggu ini..." />
          </div>
        </div>

        <div className="space-y-6 pt-4 border-t border-slate-100">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pentadbir Berucap</label>
                <select name="pentadbirBerucap" value={formData.pentadbirBerucap} onChange={handleInputChange} className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold outline-none text-sm">
                  <option value="GURU BESAR">GURU BESAR</option>
                  <option value="PK KURIKULUM">PK KURIKULUM</option>
                  <option value="PK HAL EHWAL MURID">PK HAL EHWAL MURID</option>
                  <option value="PK KOKURIKULUM">PK KOKURIKULUM</option>
                </select>
              </div>
              <div className="flex items-end pb-1">
                <button onClick={() => generateWithAI('ucapanPentadbir', `Amanat penting daripada ${formData.pentadbirBerucap} untuk perhimpunan sekolah`)} disabled={loading.ucapanPentadbir} className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg w-full justify-center">
                  {loading.ucapanPentadbir ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  <span>JANA HURAIAN PENTADBIR (AI)</span>
                </button>
              </div>
           </div>
           <textarea name="ucapanPentadbir" value={formData.ucapanPentadbir} onChange={handleInputChange} className="w-full p-5 bg-white border border-slate-200 rounded-2xl min-h-[100px] text-sm outline-none font-medium" />
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center"><ImageIcon size={12} className="mr-2"/> Lensa Perhimpunan (Maksimum 2 Keping)</label>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative aspect-video rounded-3xl overflow-hidden group shadow-lg border border-slate-100">
                  <img src={img} className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(idx)} className="absolute top-4 right-4 p-2 bg-rose-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg"><Trash2 size={16}/></button>
                </div>
              ))}
              {formData.images.length < 2 && (
                <label className="aspect-video rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-all hover:border-blue-400 group">
                  <Upload size={32} className="text-slate-300 mb-3 group-hover:text-blue-500 transition-colors" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600">Muat Naik Gambar</span>
                  <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                </label>
              )}
           </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center"><User size={12} className="mr-2"/> Disediakan Oleh:</label>
           <select name="disediakanOleh" value={formData.disediakanOleh} onChange={handleInputChange} className="w-full p-5 bg-white border border-slate-200 rounded-2xl font-bold outline-none text-sm focus:ring-4 focus:ring-blue-100">
             <option value="">-- SILA PILIH NAMA GURU --</option>
             {SENARAI_GURU_PENYEDIA.map(g => <option key={g} value={g}>{g}</option>)}
           </select>
        </div>

        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className={`w-full py-6 rounded-[2.5rem] font-black uppercase tracking-widest transition-all shadow-2xl transform active:scale-[0.98] flex items-center justify-center space-x-3 ${isSaving ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-blue-600'}`}
        >
          {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          <span>{isSaving ? 'Sila Tunggu...' : 'Simpan Laporan Sekarang'}</span>
        </button>
      </div>
    </div>
  );
};
