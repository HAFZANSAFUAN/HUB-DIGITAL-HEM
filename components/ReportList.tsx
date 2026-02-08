
import React, { useState } from 'react';
import { 
  Calendar, Edit3, FileText, Search, Plus, User, ArrowLeft, FileDown, 
  CheckSquare, XCircle, Download, CheckCircle, Trash2
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

interface ReportListProps {
  reports: Report[];
  onBack: () => void;
  onEdit: (report: Report) => void;
  onAddNew: () => void;
  isAdmin?: boolean;
}

export const ReportList: React.FC<ReportListProps> = ({ reports, onBack, onEdit, onAddNew, isAdmin }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Penapisan laporan berdasarkan carian
  const filteredReports = reports.filter(r => 
    r.tema.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.minggu.toString().includes(searchQuery) ||
    r.disediakanOleh.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const dateOnly = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr.split(':')[0].split(' ')[0];
    const parts = dateOnly.split('-');
    if (parts.length === 3 && parts[0].length === 4) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return dateOnly;
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    try {
      let hours: number, minutes: number;
      if (timeStr.includes('T')) {
        const date = new Date(timeStr);
        hours = date.getUTCHours();
        minutes = date.getUTCMinutes();
      } else if (timeStr.includes(':')) {
        const [h, m] = timeStr.split(':');
        hours = parseInt(h);
        minutes = parseInt(m);
      } else return timeStr;
      const ampm = hours >= 12 ? 'P.M.' : 'A.M.';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${displayHours}:${displayMinutes} ${ampm}`;
    } catch (e) { return timeStr; }
  };

  const generateReportBodyHTML = (report: Report) => {
    const logoUrl = "https://lh3.googleusercontent.com/d/1UAlLnJkiTebZU-nVAv1pByGQyUz2ZSpR";
    const displayDate = `${formatDate(report.tarikh)} (${report.hari.toUpperCase()})`;
    const displayTime = formatTime(report.masa);
    const imageGridHtml = report.images.length > 0 
      ? `<div class="photo-grid">${report.images.slice(0, 2).map(img => `<div class="photo-item"><img src="${img}" /></div>`).join('')}</div>`
      : '<p style="text-align:center; color:#999; padding:20px;">Tiada imej lensa perhimpunan dimuat naik.</p>';

    return `
      <div class="report-page">
        <div class="report-header">
          <img src="${logoUrl}" class="logo-print" />
          <h1 class="school-name">SK METHODIST PETALING JAYA</h1>
          <p class="report-title">LAPORAN DIGITAL PERHIMPUNAN RASMI MINGGUAN</p>
        </div>
        <table>
          <tr><th>Minggu</th><td>${report.minggu}</td><th>Kumpulan</th><td>${report.kumpulan}</td></tr>
          <tr><th>Tarikh / Hari</th><td>${displayDate}</td><th>Tempat</th><td>${report.tempat}</td></tr>
          <tr><th>Masa</th><td>${displayTime}</td><th>Tema</th><td><strong>${report.tema}</strong></td></tr>
        </table>
        <span class="section-label">Huraian Perincian Tema</span>
        <div class="content-area">${report.huraian || 'Tiada maklumat.'}</div>
        <span class="section-label">Laporan Guru Bertugas (Minggu Lepas)</span>
        <div class="content-area">${report.ucapanGuruLepas || 'Tiada maklumat.'}</div>
        <span class="section-label">Pesanan Guru Bertugas (Minggu Ini)</span>
        <div class="content-area">${report.ucapanGuruIni || 'Tiada maklumat.'}</div>
        <span class="section-label">Amanat / Ucapan Pentadbir (${report.pentadbirBerucap})</span>
        <div class="content-area">${report.ucapanPentadbir || 'Tiada maklumat.'}</div>
        <span class="section-label">Lensa Perhimpunan</span>
        <div class="content-area" style="min-height: auto; padding: 25px;">${imageGridHtml}</div>
        <div class="signature-section">
          <div class="sig-box"><p>Disediakan oleh:</p><div class="sig-line">${report.disediakanOleh}</div><p style="font-size: 9pt; margin: 0;">Guru Bertugas Mingguan</p></div>
          <div class="sig-box"><p>Disemak oleh:</p><div class="sig-line">__________________________</div><p style="font-size: 9pt; margin: 0;">Penyelaras Perhimpunan</p></div>
          <div class="sig-box"><p>Disahkan oleh:</p><div class="sig-line">__________________________</div><p style="font-size: 9pt; margin: 0;">Pentadbir Sekolah</p></div>
        </div>
      </div>
    `;
  };

  const wrapWithFullHTML = (content: string) => `
    <!DOCTYPE html><html><head><title>Laporan Perhimpunan SKMPJ</title>
    <style>@page { size: A4; margin: 1.5cm; } body { font-family: 'Arial', sans-serif; line-height: 1.4; font-size: 11pt; text-align: justify; } .report-page { page-break-after: always; } .report-header { text-align: center; border-bottom: 3px double #000; padding-bottom: 10px; margin-bottom: 20px; } .logo-print { width: 80px; height: auto; } .school-name { font-size: 14pt; font-weight: bold; text-transform: uppercase; } .report-title { font-size: 11pt; font-weight: bold; text-decoration: underline; text-transform: uppercase; } table { width: 100%; border-collapse: collapse; margin-bottom: 15px; } th, td { border: 1px solid #000; padding: 8px; text-align: left; vertical-align: top; font-size: 10pt; } th { background-color: #f2f2f2; width: 140px; } .section-label { font-weight: bold; background-color: #e9e9e9; padding: 6px 10px; border: 1px solid #000; border-bottom: none; display: block; font-size: 10pt; text-transform: uppercase; } .content-area { border: 1px solid #000; padding: 12px; min-height: 60px; margin-bottom: 15px; white-space: pre-wrap; } .photo-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; justify-items: center; } .photo-item { border: 1px solid #000; height: 10cm; width: 8cm; display: flex; align-items: center; justify-content: center; overflow: hidden; background-color: #f9f9f9; } .photo-item img { width: 100%; height: 100%; object-fit: cover; } .signature-section { display: flex; justify-content: space-between; margin-top: 40px; } .sig-box { width: 30%; text-align: center; } .sig-line { border-top: 1px solid #000; margin-top: 50px; padding-top: 5px; font-weight: bold; }</style>
    </head><body>${content}<script>window.onload = function() { setTimeout(() => { window.print(); }, 800); };</script></body></html>
  `;

  const handleDownloadPDF = (report: Report) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(wrapWithFullHTML(generateReportBodyHTML(report)));
    printWindow.document.close();
  };

  const handleBulkDownload = () => {
    if (selectedIds.size === 0) return;
    const combinedContent = reports.filter(r => selectedIds.has(r.id)).map(r => generateReportBodyHTML(r)).join('');
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(wrapWithFullHTML(combinedContent));
    printWindow.document.close();
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in duration-700 px-4">
      
      {/* 1. Header Visual */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-50">
        <button onClick={onBack} className="flex items-center space-x-3 text-slate-500 hover:text-blue-600 font-bold text-sm group">
          <div className="p-3 rounded-2xl bg-white shadow-md border border-slate-100 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all">
            <ArrowLeft size={20} />
          </div>
          <div className="flex flex-col items-start text-left">
            <span className="tracking-widest uppercase text-[10px] opacity-60">Kembali Ke</span>
            <span className="tracking-tight uppercase font-black">Menu Pilihan</span>
          </div>
        </button>
        <div className="text-right">
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase leading-none">Rekod Pengisian</h2>
          <p className="text-blue-600 font-bold text-xs uppercase tracking-[0.2em] mt-2">KEMASKINI LAPORAN MINGGUAN</p>
        </div>
      </div>

      {/* 2. Bar Carian & Kawalan */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-10">
        <div className="relative flex-grow max-w-xl w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari tema, minggu atau nama guru..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-[2rem] py-4.5 pl-14 pr-6 text-sm font-bold focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none shadow-lg transition-all"
          />
        </div>
        <div className="flex items-center gap-4 w-full lg:w-auto">
          {isAdmin && (
            <button 
              onClick={() => { setIsBulkMode(!isBulkMode); if (isBulkMode) setSelectedIds(new Set()); }}
              className={`flex items-center space-x-3 px-6 py-4.5 rounded-[1.5rem] font-black text-[10px] uppercase transition-all shadow-xl ${isBulkMode ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
            >
              {isBulkMode ? <XCircle size={18} /> : <CheckSquare size={18} />}
              <span>{isBulkMode ? 'Batal Pilihan' : 'Pilihan Muat Turun'}</span>
            </button>
          )}
          <button onClick={onAddNew} className="flex items-center space-x-3 bg-slate-900 text-white px-8 py-4.5 rounded-[1.5rem] font-black text-xs uppercase shadow-2xl hover:bg-blue-600 transition-all transform active:scale-95">
            <Plus size={20} />
            <span>Isi Laporan Baru</span>
          </button>
        </div>
      </div>

      {/* 3. Senarai Rekod */}
      <div className="space-y-6">
        {filteredReports.length === 0 ? (
          <div className="glass-card rounded-[3rem] p-20 text-center border-dashed border-2 border-slate-200">
            <FileText size={48} className="mx-auto mb-4 text-slate-200" />
            <p className="font-black text-slate-400 uppercase tracking-widest">Tiada Rekod Dijumpai</p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const isSelected = selectedIds.has(report.id);
            return (
              <div 
                key={report.id} 
                onClick={() => isBulkMode && setSelectedIds(new Set(selectedIds).has(report.id) ? (s => { s.delete(report.id); return new Set(s); })(selectedIds) : new Set(selectedIds).add(report.id))}
                className={`glass-card rounded-[2.5rem] p-8 border transition-all duration-300 relative overflow-hidden ${isBulkMode ? 'cursor-pointer' : ''} ${isSelected ? 'border-blue-500 bg-blue-50/20 ring-4 ring-blue-100 shadow-xl' : 'border-white/60 hover:shadow-2xl'}`}
              >
                {/* Penunjuk Warna Kumpulan */}
                <div className={`absolute left-0 top-0 w-2 h-full ${report.kumpulan === 'A' ? 'bg-blue-600' : report.kumpulan === 'B' ? 'bg-indigo-600' : 'bg-emerald-600'}`}></div>
                
                <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 ${isBulkMode ? 'pl-10' : ''}`}>
                  <div className="flex items-start space-x-6">
                    <div className="w-20 h-20 bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-white shadow-xl flex-shrink-0">
                      <span className="text-[8px] font-black opacity-60">MINGGU</span>
                      <span className="text-3xl font-black">{report.minggu}</span>
                    </div>
                    <div className="text-left space-y-2">
                      <div className="flex items-center space-x-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span>{formatDate(report.tarikh)} ({report.hari})</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className={`${report.kumpulan === 'A' ? 'text-blue-600' : report.kumpulan === 'B' ? 'text-indigo-600' : 'text-emerald-600'}`}>KUMP {report.kumpulan}</span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-800 tracking-tighter leading-none">{report.tema || "TIADA TEMA"}</h3>
                      <div className="flex items-center space-x-3 pt-2">
                        <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                          <User size={12} className="text-blue-500" />
                          <span>Oleh: {report.disediakanOleh}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {!isBulkMode && (
                    <div className="flex items-center space-x-3">
                      {isAdmin && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDownloadPDF(report); }} 
                          className="p-4 bg-emerald-600 text-white rounded-xl shadow-lg hover:bg-emerald-700 transition-all active:scale-95"
                          title="Muat Turun PDF"
                        >
                          <FileDown size={18} />
                        </button>
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); onEdit(report); }} 
                        className="flex items-center space-x-3 px-6 py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase shadow-lg hover:bg-blue-600 transition-all transform active:scale-95"
                      >
                        <Edit3 size={16} />
                        <span>Kemaskini</span>
                      </button>
                    </div>
                  )}
                  
                  {isBulkMode && (
                    <div className="absolute right-8 top-1/2 -translate-y-1/2">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-transparent'}`}>
                        <CheckCircle size={18} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Action Button for Bulk Mode */}
      {isBulkMode && selectedIds.size > 0 && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-6">
          <button onClick={handleBulkDownload} className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-3xl hover:bg-blue-700 transition-all flex items-center justify-center space-x-4 animate-super-spring">
            <Download size={20} />
            <span>Muat Turun {selectedIds.size} Laporan Terpilih (PDF)</span>
          </button>
        </div>
      )}
    </div>
  );
};
