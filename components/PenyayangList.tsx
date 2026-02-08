
import React, { useState } from 'react';
import { 
  Calendar, Heart, FileText, Search, Plus, User, ArrowLeft, FileDown, 
  CheckSquare, XCircle, Download, CheckCircle, MapPin, Users, Edit3
} from 'lucide-react';

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

interface PenyayangListProps {
  reports: PenyayangReport[];
  onBack: () => void;
  onEdit: (report: PenyayangReport) => void;
  isAdmin?: boolean;
}

export const PenyayangList: React.FC<PenyayangListProps> = ({ reports, onBack, onEdit, isAdmin }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = reports.filter(r => 
    r.sasaran?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.aktiviti?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.disediakanOleh?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.tarikh?.includes(searchQuery)
  );

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const dateOnly = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr.split(':')[0].split(' ')[0];
    const parts = dateOnly.split('-');
    if (parts.length === 3 && parts[0].length === 4) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return dateOnly;
  };

  const generateReportBodyHTML = (report: PenyayangReport) => {
    const logoSekolah = "https://lh3.googleusercontent.com/d/1UAlLnJkiTebZU-nVAv1pByGQyUz2ZSpR";
    const logoTS25 = "https://blogger.googleusercontent.com/img/a/AVvXsEi8KyegQEb-lGll1QFpHT9LMNagd2WurlH85-jtG2lq3qWJqd-W6ZvEkktV31KBMpX-H59_a5GaTaMPu8trWPQtlMNoDZRmkzALLy_eSp3DvkP-0bZd7pWBCHWxyPJLAp0MqwQ2HyhJXGHOj73ZCeW24z5FIfcZIL7MqMqhii1Jp3kvTrV_DtYNsLj7=s320";
    
    const displayDate = `${formatDate(report.tarikh)}`;
    const lokasi = report.tempat === 'LAIN-LAIN (SILA NYATAKAN)' ? report.tempatLain : report.tempat;
    
    const imageGridHtml = report.images.length > 0 
      ? `<div class="opr-image-container">
          ${report.images.map(img => `<div class="opr-photo"><img src="${img}" /></div>`).join('')}
         </div>`
      : '<div class="no-image">TIADA GAMBAR AKTIVITI</div>';

    return `
      <div class="opr-page">
        <!-- Header OPR -->
        <div class="opr-header">
          <img src="${logoSekolah}" class="logo-left" />
          <img src="${logoTS25}" class="logo-right" />
          <div class="header-text">
            <h2>LAPORAN OPR LAPORAN GURU PENYAYANG SK METHODIST PJ</h2>
            <h3>UNIT HAL EHWAL MURID (HEM)</h3>
          </div>
        </div>

        <!-- Jadual Maklumat -->
        <table class="opr-table">
          <tr>
            <td class="label-cell">PROGRAM / AKTIVITI</td>
            <td colspan="3" class="value-cell"><strong>${report.program.toUpperCase()}</strong></td>
          </tr>
          <tr>
            <td class="label-cell">TARIKH</td>
            <td class="value-cell">${displayDate}</td>
            <td class="label-cell">HARI</td>
            <td class="value-cell">${report.hari.toUpperCase()}</td>
          </tr>
          <tr>
            <td class="label-cell">LOKASI</td>
            <td class="value-cell">${lokasi.toUpperCase()}</td>
            <td class="label-cell">SASARAN</td>
            <td class="value-cell">${report.sasaran.toUpperCase()}</td>
          </tr>
        </table>

        <!-- Kandungan Utama -->
        <div class="opr-section">
          <div class="section-title">OBJEKTIF PROGRAM</div>
          <div class="section-body">${report.objektif || 'Tiada maklumat.'}</div>
        </div>

        <div class="opr-section">
          <div class="section-title">LAPORAN AKTIVITI / RINGKASAN PROGRAM</div>
          <div class="section-body">${report.aktiviti || 'Tiada maklumat.'}</div>
        </div>

        <!-- Lensa Bergambar -->
        <div class="opr-section">
          <div class="section-title">LENSA BERGAMBAR (EVIDENCE)</div>
          <div class="section-body" style="padding: 10px; display: flex; justify-content: center;">
            ${imageGridHtml}
          </div>
        </div>

        <!-- Footer / Pengesahan -->
        <div class="opr-footer">
          <div class="signature-box">
            <p>Disediakan oleh:</p>
            <div class="sig-line"></div>
            <p><strong>${report.disediakanOleh.toUpperCase()}</strong></p>
            <p>Guru Bertugas</p>
          </div>
          <div class="signature-box">
            <p>Disemak oleh:</p>
            <div class="sig-line"></div>
            <p><strong>PN RITA SELVAMALAR</strong></p>
            <p>Penyelaras Guru Penyayang</p>
          </div>
          <div class="signature-box">
            <p>Disahkan oleh:</p>
            <div class="sig-line"></div>
            <p><strong>PENTADBIR SEKOLAH</strong></p>
            <p>SK Methodist PJ</p>
          </div>
        </div>
      </div>
    `;
  };

  const wrapWithFullHTML = (content: string) => `
    <!DOCTYPE html>
    <html lang="ms">
    <head>
      <meta charset="UTF-8">
      <title>OPR Guru Penyayang SKMPJ</title>
      <style>
        @page { size: A4; margin: 1cm; }
        body { font-family: 'Arial', sans-serif; color: #000; line-height: 1.2; font-size: 10pt; margin: 0; padding: 0; }
        .opr-page { border: 2px solid #000; padding: 20px; box-sizing: border-box; min-height: 27.7cm; position: relative; }
        
        .opr-header { display: flex; align-items: center; justify-content: center; position: relative; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 15px; }
        .logo-left { position: absolute; left: 0; top: 0; width: 65px; height: auto; }
        .logo-right { position: absolute; right: 0; top: 0; width: 85px; height: auto; }
        .header-text { text-align: center; width: 80%; margin: 0 auto; }
        .header-text h2 { margin: 0; font-size: 14pt; font-weight: bold; text-transform: uppercase; }
        .header-text h3 { margin: 5px 0 0 0; font-size: 11pt; font-weight: normal; }

        .opr-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        .opr-table td { border: 1px solid #000; padding: 8px; vertical-align: top; }
        .label-cell { background-color: #f2f2f2; font-weight: bold; width: 150px; text-transform: uppercase; font-size: 9pt; }
        .value-cell { font-size: 10pt; }

        .opr-section { border: 1px solid #000; margin-bottom: 10px; }
        .section-title { background-color: #e6e6e6; padding: 5px 10px; font-weight: bold; border-bottom: 1px solid #000; text-transform: uppercase; font-size: 9pt; }
        .section-body { padding: 10px; min-height: 50px; white-space: pre-wrap; font-size: 10pt; }

        .opr-image-container { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; width: 100%; }
        /* Saiz Diubah kepada 8cm Lebar x 10cm Tinggi */
        .opr-photo { border: 1px solid #000; width: 8cm; height: 10cm; overflow: hidden; display: flex; align-items: center; justify-content: center; background-color: #f9f9f9; }
        .opr-photo img { width: 100%; height: 100%; object-fit: cover; }
        .no-image { text-align: center; color: #999; padding: 30px; font-style: italic; border: 1px dashed #ccc; width: 100%; }

        .opr-footer { display: flex; justify-content: space-between; margin-top: 30px; }
        .signature-box { width: 30%; text-align: center; font-size: 9pt; }
        .sig-line { border-top: 1px solid #000; margin: 40px auto 5px auto; width: 80%; }
        
        @media print {
          .opr-page { border: none; padding: 0; }
          body { -webkit-print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      ${content}
      <script>
        window.onload = function() {
          setTimeout(() => { window.print(); }, 1000);
        };
      </script>
    </body>
    </html>
  `;

  const handleDownloadPDF = (report: PenyayangReport) => {
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
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-50">
        <button onClick={onBack} className="flex items-center space-x-3 text-slate-500 hover:text-rose-600 font-bold text-sm group">
          <div className="p-3 rounded-2xl bg-white shadow-md border border-slate-100 group-hover:bg-rose-600 group-hover:text-white group-hover:scale-110 transition-all">
            <ArrowLeft size={20} />
          </div>
          <div className="flex flex-col items-start text-left">
            <span className="tracking-widest uppercase text-[10px] opacity-60">Kembali Ke</span>
            <span className="tracking-tight uppercase font-black">Menu Pilihan</span>
          </div>
        </button>
        <div className="text-right">
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase leading-none">Rekod Guru Penyayang</h2>
          <p className="text-rose-600 font-bold text-xs uppercase tracking-[0.2em] mt-2">DOKUMENTASI PROGRAM HARIAN</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-10">
        <div className="relative flex-grow max-w-xl w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari sasaran, aktiviti atau nama guru..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-[2rem] py-4.5 pl-14 pr-6 text-sm font-bold focus:ring-4 focus:ring-rose-100 focus:border-rose-400 outline-none shadow-lg transition-all"
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
        </div>
      </div>

      <div className="space-y-6">
        {filteredReports.length === 0 ? (
          <div className="glass-card rounded-[3rem] p-20 text-center border-dashed border-2 border-slate-200">
            <Heart size={48} className="mx-auto mb-4 text-slate-200" />
            <p className="font-black text-slate-400 uppercase tracking-widest">Tiada Rekod Dijumpai</p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const isSelected = selectedIds.has(report.id);
            const lokasi = report.tempat === 'LAIN-LAIN (SILA NYATAKAN)' ? report.tempatLain : report.tempat;
            return (
              <div 
                key={report.id} 
                onClick={() => isBulkMode && setSelectedIds(new Set(selectedIds).has(report.id) ? (s => { s.delete(report.id); return new Set(s); })(selectedIds) : new Set(selectedIds).add(report.id))}
                className={`glass-card rounded-[2.5rem] p-8 border transition-all duration-300 relative overflow-hidden ${isBulkMode ? 'cursor-pointer' : ''} ${isSelected ? 'border-rose-500 bg-rose-50/20 ring-4 ring-rose-100 shadow-xl' : 'border-white/60 hover:shadow-2xl'}`}
              >
                <div className="absolute left-0 top-0 w-2 h-full bg-rose-500"></div>
                
                <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 ${isBulkMode ? 'pl-10' : ''}`}>
                  <div className="flex items-start space-x-6">
                    <div className="w-20 h-20 bg-rose-500 rounded-2xl flex flex-col items-center justify-center text-white shadow-xl flex-shrink-0">
                      <Heart size={24} fill="currentColor" className="mb-1" />
                      <span className="text-[8px] font-black uppercase tracking-widest">DAILY</span>
                    </div>
                    <div className="text-left space-y-2">
                      <div className="flex items-center space-x-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span>{formatDate(report.tarikh)} ({report.hari})</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="flex items-center"><MapPin size={10} className="mr-1" /> {lokasi}</span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-800 tracking-tighter leading-none">{report.sasaran || "TIADA SASARAN"}</h3>
                      <div className="flex items-center space-x-3 pt-2">
                        <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                          <User size={12} className="text-rose-500" />
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
                          title="Muat Turun PDF (OPR)"
                        >
                          <FileDown size={18} />
                        </button>
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); onEdit(report); }} 
                        className="flex items-center space-x-3 px-6 py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase shadow-lg hover:bg-rose-600 transition-all transform active:scale-95"
                      >
                        <Edit3 size={16} />
                        <span>Kemaskini</span>
                      </button>
                    </div>
                  )}
                  
                  {isBulkMode && (
                    <div className="absolute right-8 top-1/2 -translate-y-1/2">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white border-slate-200 text-transparent'}`}>
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

      {isBulkMode && selectedIds.size > 0 && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-6">
          <button onClick={handleBulkDownload} className="w-full bg-rose-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-3xl hover:bg-rose-700 transition-all flex items-center justify-center space-x-4 animate-super-spring">
            <Download size={20} />
            <span>Muat Turun {selectedIds.size} Laporan Terpilih (PDF)</span>
          </button>
        </div>
      )}
    </div>
  );
};
