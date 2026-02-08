
import React, { useState } from 'react';
import { 
  Calendar, ChevronRight, ChevronLeft, ArrowLeft, Home, Star, Coffee, Users, 
  BookOpen, AlertCircle, Sparkles, Filter, ListOrdered, Clock, 
  Palmtree, Handshake, Megaphone, Lightbulb, Zap, CalendarDays, Info
} from 'lucide-react';

interface TakwimEvent {
  bil: number;
  tarikh: string;
  hari: string;
  minggu?: string;
  aktiviti: string;
  catatan?: string;
  jenis: 'MESYUARAT' | 'PROGRAM' | 'CUTI' | 'TEMA' | 'LAIN';
}

const TAKWIM_DATA: { [key: string]: TakwimEvent[] } = {
  "JANUARI": [
    { bil: 1, tarikh: "1 Jan", hari: "Khamis", aktiviti: "Cuti Akhir Persekolahan / Cuti Tahun Baru 2026", jenis: "CUTI" },
    { bil: 2, tarikh: "2 Jan", hari: "Jumaat", aktiviti: "Cuti Akhir Persekolahan Sesi 2025", jenis: "CUTI" },
    { bil: 3, tarikh: "3 Jan", hari: "Sabtu", aktiviti: "Cuti Akhir Persekolahan Sesi 2025", jenis: "CUTI" },
    { bil: 4, tarikh: "4 Jan", hari: "Ahad", aktiviti: "Cuti Akhir Persekolahan Sesi 2025", jenis: "CUTI" },
    { bil: 8, tarikh: "8 Jan", hari: "Khamis", aktiviti: "MESYUARAT HEM BIL 1/2026", jenis: "MESYUARAT" },
    { bil: 9, tarikh: "9 Jan", hari: "Jumaat", aktiviti: "Persediaan & Pembersihan Kelas / Papan Kenyataan HEM", jenis: "PROGRAM" },
    { bil: 12, tarikh: "12 Jan", hari: "Isnin", minggu: "1", aktiviti: "PROGRAM SANTUN SAYANG MADANI", jenis: "PROGRAM" },
    { bil: 13, tarikh: "13 Jan", hari: "Selasa", minggu: "1", aktiviti: "TAKLIMAT DISIPLIN", jenis: "PROGRAM" },
    { bil: 14, tarikh: "14 Jan", hari: "Rabu", minggu: "1", aktiviti: "PROGRAM MAJALAH ASUH", jenis: "PROGRAM" },
    { bil: 15, tarikh: "15 Jan", hari: "Khamis", minggu: "1", aktiviti: "BACAAN YASSIN PERDANA / TAKLIMAT SPBT", jenis: "PROGRAM" },
    { bil: 19, tarikh: "19 Jan", hari: "Isnin", minggu: "2", aktiviti: "TEMA PERHIMPUNAN : PERATURAN SEKOLAH / MESYURAT AJK KEBAJIKAN BIL 1", jenis: "TEMA" },
    { bil: 21, tarikh: "21 Jan", hari: "Rabu", minggu: "2", aktiviti: "MESYUARAT UNIT DISIPLIN & PENGAWAS BIL 1", jenis: "MESYUARAT" },
    { bil: 26, tarikh: "26 Jan", hari: "Isnin", minggu: "3", aktiviti: "TEMA PERHIMPUNAN : DATANG AWAL KE SEKOLAH / MESYUARAT AJK 3K BIL 1", jenis: "TEMA" },
    { bil: 28, tarikh: "28 Jan", hari: "Rabu", minggu: "3", aktiviti: "SPOT CHECK SPBT", jenis: "PROGRAM" },
    { bil: 30, tarikh: "30 Jan", hari: "Jumaat", minggu: "3", aktiviti: "PELANCARAN PROGRAM GURU PENYAYANG / PROGRAM MENTOR - MENTEE", jenis: "PROGRAM" },
  ],
  "FEBRUARI": [
    { bil: 1, tarikh: "1 Feb", hari: "Ahad", aktiviti: "CUTI THAIPUSAM", jenis: "CUTI" },
    { bil: 2, tarikh: "2 Feb", hari: "Isnin", minggu: "4", aktiviti: "CUTI GANTI THAIPUSAM", jenis: "CUTI" },
    { bil: 3, tarikh: "3 Feb", hari: "Selasa", minggu: "4", aktiviti: "PELAPORAN PPDe ( JANUARI )", jenis: "PROGRAM" },
    { bil: 6, tarikh: "6 Feb", hari: "Jumaat", minggu: "4", aktiviti: "PELAPORAN RMT & PSS ( JANUARI )", jenis: "PROGRAM" },
    { bil: 9, tarikh: "9 Feb", hari: "Isnin", minggu: "5", aktiviti: "TEMA PERHIMPUNAN : KESELAMATAN DI PADANG", jenis: "TEMA" },
    { bil: 16, tarikh: "16 Feb", hari: "Isnin", minggu: "6", aktiviti: "CUTI TAMBAHAN KPM", jenis: "CUTI" },
    { bil: 17, tarikh: "17 Feb", hari: "Selasa", minggu: "6", aktiviti: "CUTI TAHUN BARU CINA", jenis: "CUTI" },
    { bil: 18, tarikh: "18 Feb", hari: "Rabu", minggu: "6", aktiviti: "CUTI TAHUN BARU CINA", jenis: "CUTI" },
    { bil: 19, tarikh: "19 Feb", hari: "Khamis", minggu: "6", aktiviti: "CUTI TAMBAHAN KPM", jenis: "CUTI" },
    { bil: 20, tarikh: "20 Feb", hari: "Jumaat", minggu: "6", aktiviti: "CUTI TAMBAHAN KPM", jenis: "CUTI" },
    { bil: 23, tarikh: "23 Feb", hari: "Isnin", minggu: "7", aktiviti: "TEMA PERHIMPUNAN : AMALAN BERSEDEKAH DI BULAN RAMADHAN", jenis: "TEMA" },
    { bil: 26, tarikh: "26 Feb", hari: "Khamis", minggu: "7", aktiviti: "PROGRAM ANTI-BULI DAN GANGGUAN SEKSUAL TAHAP 2", jenis: "PROGRAM" },
  ],
  "MAC": [
    { bil: 2, tarikh: "2 Mar", hari: "Isnin", minggu: "8", aktiviti: "TEMA PERHIMPUNAN : MENJAGA KEBERSIHAN KELAS / PELAPORAN PPDe ( FEBRUARI )", jenis: "TEMA" },
    { bil: 5, tarikh: "5 Mar", hari: "Khamis", minggu: "8", aktiviti: "PROGRAM MAJU DIRI TAHUN 4 - TAHUN 6", jenis: "PROGRAM" },
    { bil: 6, tarikh: "6 Mar", hari: "Jumaat", minggu: "8", aktiviti: "PELAPORAN RMT & PSS ( FEB )", jenis: "PROGRAM" },
    { bil: 9, tarikh: "9 Mar", hari: "Isnin", minggu: "9", aktiviti: "TEMA PERHIMPUNAN : MENJAGA ADAB SEMASA BULAN PUASA", jenis: "TEMA" },
    { bil: 13, tarikh: "13 Mar", hari: "Jumaat", minggu: "9", aktiviti: "MAJLIS BERBUKA PUASA", jenis: "PROGRAM" },
    { bil: 16, tarikh: "16 Mar", hari: "Isnin", minggu: "10", aktiviti: "TEMA PERHIMPUNAN : SILANG BUDAYA SAMBUTAN HARI RAYA AIDILFITRI", jenis: "TEMA" },
    { bil: 17, tarikh: "17 Mar", hari: "Selasa", minggu: "10", aktiviti: "BACAAN YASSIN PERDANA", jenis: "PROGRAM" },
    { bil: 19, tarikh: "19 Mar", hari: "Khamis", minggu: "10", aktiviti: "CUTI TAMBAHAN KPM", jenis: "CUTI" },
    { bil: 20, tarikh: "20 Mar", hari: "Jumaat", minggu: "10", aktiviti: "CUTI TAMBAHAN KPM", jenis: "CUTI" },
    { bil: 21, tarikh: "21 Mar", hari: "Sabtu", aktiviti: "CUTI PENGGAL 1 / HARI RAYA AIDIL FITRI", jenis: "CUTI" },
    { bil: 22, tarikh: "22 Mar", hari: "Ahad", aktiviti: "CUTI PENGGAL 1 / HARI RAYA AIDIL FITRI", jenis: "CUTI" },
    { bil: 23, tarikh: "23-29 Mar", hari: "Isnin-Ahad", aktiviti: "CUTI PENGGAL 1 PERSEKOLAHAN", jenis: "CUTI" },
    { bil: 30, tarikh: "30 Mar", hari: "Isnin", minggu: "11", aktiviti: "TEMA PERHIMPUNAN : DISIPLIN DI KANTIN", jenis: "TEMA" },
    { bil: 31, tarikh: "31 Mar", hari: "Selasa", minggu: "11", aktiviti: "MAJLIS WATIKAH PELANTIKAN PEMIMPIN MUDA SEKOLAH", jenis: "PROGRAM" },
  ],
  "APRIL": [
    { bil: 1, tarikh: "1 Apr", hari: "Rabu", minggu: "11", aktiviti: "PELAPORAN PPDe ( MAC )", jenis: "PROGRAM" },
    { bil: 2, tarikh: "2 Apr", hari: "Khamis", minggu: "11", aktiviti: "MAJLIS SAMBUTAN HARI RAYA AIDILFITRI", jenis: "PROGRAM" },
    { bil: 3, tarikh: "3 Apr", hari: "Jumaat", minggu: "11", aktiviti: "GOOD FRIDAY", jenis: "CUTI" },
    { bil: 6, tarikh: "6 Apr", hari: "Isnin", minggu: "12", aktiviti: "TEMA PERHIMPUNAN : SAYANGI BUKU TEKS / PENTAKSIRAN PSIKOMETRIK (IKEP) T5", jenis: "TEMA" },
    { bil: 7, tarikh: "7 Apr", hari: "Selasa", minggu: "12", aktiviti: "PELAPORAN RMT & PSS ( MAC )", jenis: "PROGRAM" },
    { bil: 8, tarikh: "8 Apr", hari: "Rabu", minggu: "12", aktiviti: "MESYUARAT UNIT DISIPLIN & PENGAWAS BIL 2", jenis: "MESYUARAT" },
    { bil: 13, tarikh: "13 Apr", hari: "Isnin", minggu: "13", aktiviti: "TEMA PERHIMPUNAN : BERTANGGUNGJAWAB", jenis: "TEMA" },
    { bil: 15, tarikh: "15 Apr", hari: "Rabu", minggu: "13", aktiviti: "KURSUS PEMIMPIN MUDA", jenis: "PROGRAM" },
    { bil: 20, tarikh: "20 Apr", hari: "Isnin", minggu: "14", aktiviti: "TEMA PERHIMPUNAN : KASIH SAYANG", jenis: "TEMA" },
    { bil: 21, tarikh: "21 Apr", hari: "Selasa", minggu: "14", aktiviti: "PROGRAM MOTIVASI TAHUN 2 - TAHUN 3", jenis: "PROGRAM" },
    { bil: 24, tarikh: "24 Apr", hari: "Jumaat", minggu: "14", aktiviti: "LATIHAN KECEMASAN & KEBAKARAN SIRI 1", jenis: "PROGRAM" },
    { bil: 27, tarikh: "27 Apr", hari: "Isnin", minggu: "15", aktiviti: "TEMA PERHIMPUNAN : HORMATI KELUARGA / MESYUARAT HEM BIL 2 2026", jenis: "TEMA" },
    { bil: 30, tarikh: "30 Apr", hari: "Khamis", minggu: "15", aktiviti: "PELANCARAN PROGRAM GURU PENYAYANG / SAMBUTAN HARIJADI JAN-APR", jenis: "PROGRAM" },
  ],
  "MEI": [
    { bil: 1, tarikh: "1 Mei", hari: "Jumaat", minggu: "15", aktiviti: "CUTI HARI PEKERJA", jenis: "CUTI" },
    { bil: 4, tarikh: "4 Mei", hari: "Isnin", minggu: "16", aktiviti: "TEMA PERHIMPUNAN : BAHAYA GAJET PADA ZAMAN SEKARANG / PELAPORAN PPDe ( APRIL )", jenis: "TEMA" },
    { bil: 5, tarikh: "5 Mei", hari: "Selasa", minggu: "16", aktiviti: "PENTAKSIRAN PSIKOMETRIK TAHUN 6", jenis: "PROGRAM" },
    { bil: 7, tarikh: "7 Mei", hari: "Khamis", minggu: "16", aktiviti: "PELAPORAN RMT & PSS ( APRIL )", jenis: "PROGRAM" },
    { bil: 11, tarikh: "11 Mei", hari: "Isnin", minggu: "17", aktiviti: "TEMA PERHIMPUNAN : JAUHI PERKARA NEGATIF / MESYUARAT AJK 3K BIL 2", jenis: "TEMA" },
    { bil: 18, tarikh: "18 Mei", hari: "Isnin", minggu: "18", aktiviti: "TEMA PERHIMPUNAN : MENGHORMATI GURU", jenis: "TEMA" },
    { bil: 21, tarikh: "21 Mei", hari: "Khamis", minggu: "18", aktiviti: "PEMERIKSAAN SCOLIOSIS ( TAHUN 6 ) KKM", jenis: "PROGRAM" },
    { bil: 22, tarikh: "22 Mei", hari: "Jumaat", minggu: "18", aktiviti: "BACAAN YASSIN PERDANA / PELAPORAN PPDe & RMT/PSS ( MEI )", jenis: "PROGRAM" },
    { bil: 23, tarikh: "23-31 Mei", hari: "Sabtu-Ahad", aktiviti: "CUTI PERTENGAHAN TAHUN / HARI RAYA QURBAN / HARI WESAK", jenis: "CUTI" },
  ],
  "JUN": [
    { bil: 1, tarikh: "1 Jun", hari: "Isnin", aktiviti: "CUTI PERTENGAHAN TAHUN / HARI KEPUTERAAN AGONG", jenis: "CUTI" },
    { bil: 2, tarikh: "2-7 Jun", hari: "Selasa-Ahad", aktiviti: "CUTI PERTENGAHAN TAHUN PERSEKOLAHAN", jenis: "CUTI" },
    { bil: 8, tarikh: "8 Jun", hari: "Isnin", minggu: "19", aktiviti: "TEMA PERHIMPUNAN : CELIK WANG", jenis: "TEMA" },
    { bil: 15, tarikh: "15 Jun", hari: "Isnin", minggu: "20", aktiviti: "TEMA PERHIMPUNAN : MENGHORMATI KEPELBAGAIAN AGAMA", jenis: "TEMA" },
    { bil: 17, tarikh: "17 Jun", hari: "Rabu", minggu: "20", aktiviti: "CUTI AWAL MUHARAM", jenis: "CUTI" },
    { bil: 22, tarikh: "22 Jun", hari: "Isnin", minggu: "21", aktiviti: "TEMA PERHIMPUNAN : SIKAP RAJIN / PENTAKSIRAN APTITUD AM (AAT4)", jenis: "TEMA" },
    { bil: 29, tarikh: "29 Jun", hari: "Isnin", minggu: "22", aktiviti: "TEMA PERHIMPUNAN : PENGARUH RAKAN SEBAYA / MESYUARAT HEM BIL 3/2026", jenis: "TEMA" },
    { bil: 30, tarikh: "30 Jun", hari: "Selasa", minggu: "22", aktiviti: "PELAPORAN PPDe ( JUN )", jenis: "PROGRAM" },
  ],
  "JULAI": [
    { bil: 1, tarikh: "1 Jul", hari: "Rabu", minggu: "22", aktiviti: "PROGRAM MOTIVASI TAHAP 2", jenis: "PROGRAM" },
    { bil: 6, tarikh: "6 Jul", hari: "Isnin", minggu: "23", aktiviti: "TEMA PERHIMPUNAN : MENGHORMATI GOLONGAN OKU / MESYUARAT AJK KEBAJIKAN BIL 2", jenis: "TEMA" },
    { bil: 7, tarikh: "7 Jul", hari: "Selasa", minggu: "23", aktiviti: "PELAPORAN RMT & PSS ( JUN )", jenis: "PROGRAM" },
    { bil: 10, tarikh: "10 Jul", hari: "Jumaat", minggu: "23", aktiviti: "BACAAN YASSIN PERDANA", jenis: "PROGRAM" },
    { bil: 13, tarikh: "13 Jul", hari: "Isnin", minggu: "24", aktiviti: "TEMA PERHIMPUNAN : BENCI RASUAH / MESYUARAT UNIT DISIPLIN & PENGAWAS BIL 3", jenis: "TEMA" },
    { bil: 20, tarikh: "20 Jul", hari: "Isnin", minggu: "25", aktiviti: "TEMA PERHIMPUNAN : SAYANGI FLORA DAN FAUNA", jenis: "TEMA" },
    { bil: 21, tarikh: "21 Jul", hari: "Selasa", minggu: "25", aktiviti: "PROGRAM SENTUHAN OK TAK OK TAHUN 2 - TAHUN 3", jenis: "PROGRAM" },
    { bil: 27, tarikh: "27 Jul", hari: "Isnin", minggu: "26", aktiviti: "TEMA PERHIMPUNAN : JIMAT AIR DAN ELEKTRIK", jenis: "TEMA" },
    { bil: 29, tarikh: "29 Jul", hari: "Rabu", minggu: "26", aktiviti: "SARINGAN MINDA SIHAT", jenis: "PROGRAM" },
    { bil: 31, tarikh: "31 Jul", hari: "Jumaat", minggu: "26", aktiviti: "PELAPORAN PPDe ( JULAI )", jenis: "PROGRAM" },
  ],
  "OGOS": [
    { bil: 3, tarikh: "3 Ogos", hari: "Isnin", minggu: "27", aktiviti: "TEMA PERHIMPUNAN : MENJAGA KEBERSIHAN TANDAS SEKOLAH", jenis: "TEMA" },
    { bil: 7, tarikh: "7 Ogos", hari: "Jumaat", minggu: "27", aktiviti: "PELAPORAN RMT & PSS ( JULAI )", jenis: "PROGRAM" },
    { bil: 10, tarikh: "10 Ogos", hari: "Isnin", minggu: "28", aktiviti: "TEMA PERHIMPUNAN : MENGHARGAI JASA PEMIMPIN NEGARA", jenis: "TEMA" },
    { bil: 17, tarikh: "17 Ogos", hari: "Isnin", minggu: "29", aktiviti: "TEMA PERHIMPUNAN : KENALI BENDERA MALAYSIA", jenis: "TEMA" },
    { bil: 21, tarikh: "21 Ogos", hari: "Jumaat", minggu: "29", aktiviti: "LATIHAN KECEMASAN & KEBAKARAN SIRI 2", jenis: "PROGRAM" },
    { bil: 24, tarikh: "24 Ogos", hari: "Isnin", minggu: "30", aktiviti: "TEMA PERHIMPUNAN : SEMANGAT PATRIOTIK", jenis: "TEMA" },
    { bil: 25, tarikh: "25 Ogos", hari: "Selasa", minggu: "30", aktiviti: "CUTI MAULIDUR RASUL", jenis: "CUTI" },
    { bil: 27, tarikh: "27 Ogos", hari: "Khamis", minggu: "30", aktiviti: "PROGRAM GURU PENYAYANG SAMBUTAN HARIJADI MEI - OGOS", jenis: "PROGRAM" },
    { bil: 28, tarikh: "28 Ogos", hari: "Jumaat", minggu: "30", aktiviti: "PELAPORAN PPDe ( OGOS ) / MAULIDURRASUL", jenis: "PROGRAM" },
    { bil: 29, tarikh: "29-31 Ogos", hari: "Sabtu-Isnin", aktiviti: "CUTI PENGGAL 2 / HARI KEBANGSAAN", jenis: "CUTI" },
  ],
  "SEPTEMBER": [
    { bil: 1, tarikh: "1-6 Sep", hari: "Selasa-Ahad", aktiviti: "CUTI PENGGAL 2 PERSEKOLAHAN", jenis: "CUTI" },
    { bil: 7, tarikh: "7 Sep", hari: "Isnin", minggu: "31", aktiviti: "TEMA PERHIMPUNAN : JANGAN MENCURI / PELAPORAN RMT & PSS ( OGOS )", jenis: "TEMA" },
    { bil: 14, tarikh: "14 Sep", hari: "Isnin", minggu: "32", aktiviti: "TEMA PERHIMPUNAN : JAUHI RASUAH", jenis: "TEMA" },
    { bil: 16, tarikh: "16 Sep", hari: "Rabu", minggu: "32", aktiviti: "CUTI HARI MALAYSIA", jenis: "CUTI" },
    { bil: 17, tarikh: "17 Sep", hari: "Khamis", minggu: "32", aktiviti: "BACAAN YASSIN PERDANA", jenis: "PROGRAM" },
    { bil: 21, tarikh: "21 Sep", hari: "Isnin", minggu: "33", aktiviti: "TEMA PERHIMPUNAN : KATAKAN TIDAK KEPADA ROKOK DAN DADAH / MINGGU KERJAYA T1", jenis: "TEMA" },
    { bil: 23, tarikh: "23 Sep", hari: "Rabu", minggu: "33", aktiviti: "PROGRAM MINGGU KERJAYA TAHAP 2", jenis: "PROGRAM" },
    { bil: 25, tarikh: "25 Sep", hari: "Jumaat", minggu: "33", aktiviti: "PROGRAM KESELAMATAN : BOMBA", jenis: "PROGRAM" },
    { bil: 28, tarikh: "28 Sep", hari: "Isnin", minggu: "34", aktiviti: "TEMA PERHIMPUNAN : BULI SIBER", jenis: "TEMA" },
  ],
  "OKTOBER": [
    { bil: 1, tarikh: "1 Okt", hari: "Khamis", minggu: "34", aktiviti: "PELAPORAN PPDe ( SEPT )", jenis: "PROGRAM" },
    { bil: 2, tarikh: "2 Okt", hari: "Jumaat", minggu: "34", aktiviti: "PROGRAM PENCEGAHAN JENAYAH ( UNIT K9 )", jenis: "PROGRAM" },
    { bil: 5, tarikh: "5 Okt", hari: "Isnin", minggu: "35", aktiviti: "TEMA PERHIMPUNAN : SELALU BERSYUKUR", jenis: "TEMA" },
    { bil: 7, tarikh: "7 Okt", hari: "Rabu", minggu: "35", aktiviti: "PELAPORAN RMT & PSS ( SEPT )", jenis: "PROGRAM" },
    { bil: 12, tarikh: "12 Okt", hari: "Isnin", minggu: "36", aktiviti: "TEMA PERHIMPUNAN : BUDAYA SENYUM DAN MEMBERI SALAM / MESYUARAT AJK 3K BIL 3", jenis: "TEMA" },
    { bil: 19, tarikh: "19 Okt", hari: "Isnin", minggu: "37", aktiviti: "TEMA PERHIMPUNAN : HINDARI VANDALISME / MESYUARAT HEM BIL 4/2026", jenis: "TEMA" },
    { bil: 26, tarikh: "26 Okt", hari: "Isnin", minggu: "38", aktiviti: "TEMA PERHIMPUNAN : CELIK IT", jenis: "TEMA" },
    { bil: 27, tarikh: "27 Okt", hari: "Selasa", minggu: "38", aktiviti: "PROGRAM AWAL REMAJA BERSAMA LPPKN", jenis: "PROGRAM" },
    { bil: 30, tarikh: "30 Okt", hari: "Jumaat", minggu: "38", aktiviti: "PELAPORAN PPDe ( OKT )", jenis: "PROGRAM" },
  ],
  "NOVEMBER": [
    { bil: 2, tarikh: "2 Nov", hari: "Isnin", minggu: "39", aktiviti: "TEMA PERHIMPUNAN : SILANG BUDAYA HARI DEEPAVALI / MESY DISIPLIN BIL 4", jenis: "TEMA" },
    { bil: 5, tarikh: "5 Nov", hari: "Khamis", minggu: "39", aktiviti: "PELAPORAN RMT & PSS ( OKT )", jenis: "PROGRAM" },
    { bil: 6, tarikh: "6 Nov", hari: "Jumaat", minggu: "39", aktiviti: "SAMBUTAN HARI KANAK-KANAK & PROGRAM GURU PENYAYANG SEPT - DIS", jenis: "PROGRAM" },
    { bil: 8, tarikh: "8 Nov", hari: "Ahad", aktiviti: "CUTI HARI DEEPAVALI", jenis: "CUTI" },
    { bil: 9, tarikh: "9 Nov", hari: "Isnin", minggu: "40", aktiviti: "CUTI GANTI DEEPAVALI", jenis: "CUTI" },
    { bil: 10, tarikh: "10 Nov", hari: "Selasa", minggu: "40", aktiviti: "CUTI TAMBAHAN KPM", jenis: "CUTI" },
    { bil: 16, tarikh: "16 Nov", hari: "Isnin", minggu: "41", aktiviti: "TEMA PERHIMPUNAN : MELIBATKAN DIRI DALAM AKTIVITI SEKOLAH", jenis: "TEMA" },
    { bil: 23, tarikh: "23 Nov", hari: "Isnin", minggu: "42", aktiviti: "TEMA PERHIMPUNAN : BERSOPAN SANTUN / PROGRAM MELANGKAH KE MENENGAH", jenis: "TEMA" },
    { bil: 25, tarikh: "25 Nov", hari: "Rabu", minggu: "42", aktiviti: "MESYUARAT AJK 3K BIL 4", jenis: "MESYUARAT" },
    { bil: 26, tarikh: "26 Nov", hari: "Khamis", minggu: "42", aktiviti: "HARI GRADUASI TAHUN 6", jenis: "PROGRAM" },
    { bil: 27, tarikh: "27 Nov", hari: "Jumaat", minggu: "42", aktiviti: "PELAPORAN PPDe ( NOV )", jenis: "PROGRAM" },
    { bil: 30, tarikh: "30 Nov", hari: "Isnin", minggu: "43", aktiviti: "TEMA PERHIMPUNAN : JAGA KESELAMATAN DIRI SEWAKTU CUTI", jenis: "TEMA" },
  ],
  "DISEMBER": [
    { bil: 3, tarikh: "3 Dis", hari: "Khamis", minggu: "43", aktiviti: "PELAPORAN RMT & PSS ( NOV & DIS )", jenis: "PROGRAM" },
    { bil: 4, tarikh: "4 Dis", hari: "Jumaat", minggu: "43", aktiviti: "PELAPORAN PPDe ( DEC )", jenis: "PROGRAM" },
    { bil: 5, tarikh: "5-31 Dis", hari: "Sabtu-Khamis", aktiviti: "CUTI AKHIR PERSEKOLAHAN SESI 2026", jenis: "CUTI" },
  ]
};

export const TakwimView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const months = Object.keys(TAKWIM_DATA);

  // Logik Automatik untuk Tarikh Semasa (Simulasi 2026)
  const now = new Date();
  const currentMonthIdx = now.getMonth();
  const monthsLong = ["JANUARI", "FEBRUARI", "MAC", "APRIL", "MEI", "JUN", "JULAI", "OGOS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DISEMBER"];
  const currentDay = now.getDate();
  const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogos', 'Sep', 'Okt', 'Nov', 'Dis'];
  const todayDateStr = `${currentDay} ${monthsShort[currentMonthIdx]}`;

  const [activeMonth, setActiveMonth] = useState(monthsLong[currentMonthIdx] || "JANUARI");

  const getEventTagColor = (jenis: string) => {
    switch (jenis) {
      case 'MESYUARAT': return 'bg-blue-600';
      case 'PROGRAM': return 'bg-emerald-500';
      case 'CUTI': return 'bg-rose-500';
      case 'TEMA': return 'bg-indigo-600';
      default: return 'bg-slate-500';
    }
  };

  const getEventLightColor = (jenis: string) => {
    switch (jenis) {
      case 'MESYUARAT': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'PROGRAM': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'CUTI': return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'TEMA': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 animate-in fade-in slide-in-from-bottom-10 duration-700 px-4 md:px-0">
      
      {/* Header Interaktif */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-50">
        <div className="flex flex-col space-y-4">
          <button 
            onClick={onBack}
            className="flex items-center space-x-3 text-slate-500 hover:text-indigo-600 transition-all font-bold text-sm group cursor-pointer w-fit"
          >
            <div className="p-3 rounded-2xl bg-white shadow-md border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
              <ArrowLeft size={20} />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="tracking-widest uppercase text-[10px] opacity-60">Kembali Ke</span>
              <span className="tracking-tight uppercase font-black">Laman Utama</span>
            </div>
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="w-1.5 h-12 bg-indigo-600 rounded-full shadow-lg shadow-indigo-200"></div>
            <div className="text-left">
              <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter uppercase leading-none">TAKWIM HEM 2026</h2>
              <p className="text-indigo-600 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center mt-2">
                <Calendar size={14} className="mr-2" />
                UNIT HAL EHWAL MURID SK METHODIST PETALING JAYA
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 bg-white/60 backdrop-blur-md p-2 rounded-[2.5rem] border border-white shadow-xl">
           <div className="px-6 py-4 bg-amber-400/10 border border-amber-200 rounded-3xl flex items-center space-x-4">
             <Zap size={24} className="text-amber-500 fill-amber-500 animate-pulse" />
             <div className="text-left">
               <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] leading-none mb-1">Tarikh Hari Ini</p>
               <p className="text-xl font-black text-slate-800 tracking-tighter uppercase">{todayDateStr} 2026</p>
             </div>
           </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigasi Bulan (Sidebar Moden) */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="glass-card rounded-[3rem] p-8 border border-white shadow-2xl sticky top-24">
             <div className="flex items-center space-x-3 mb-8 px-2">
                <Filter size={18} className="text-indigo-500" />
                <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Pilih Bulan</h3>
             </div>
             
             <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                {months.map(month => (
                  <button
                    key={month}
                    onClick={() => setActiveMonth(month)}
                    className={`px-6 py-4 rounded-2xl text-[11px] font-black tracking-widest uppercase transition-all duration-300 text-left flex items-center justify-between group ${
                      activeMonth === month 
                        ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200 translate-x-2' 
                        : 'bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 border border-transparent hover:border-indigo-100'
                    }`}
                  >
                    <span>{month}</span>
                    {activeMonth === month ? (
                      <Sparkles size={14} className="animate-pulse" />
                    ) : (
                      <ChevronLeft size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all rotate-180" />
                    )}
                  </button>
                ))}
             </div>

             <div className="mt-10 pt-8 border-t border-slate-100 text-left">
                <div className="bg-slate-900 rounded-[2rem] p-6 text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center">
                    <Info size={12} className="mr-2" />
                    Petunjuk Ikon
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>
                      <span className="text-[9px] font-bold uppercase tracking-widest opacity-80">Tema Minggu</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
                      <span className="text-[9px] font-bold uppercase tracking-widest opacity-80">Program HEM</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                      <span className="text-[9px] font-bold uppercase tracking-widest opacity-80">Mesyuarat</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2.5 h-2.5 bg-rose-500 rounded-full"></div>
                      <span className="text-[9px] font-bold uppercase tracking-widest opacity-80">Cuti Persekolahan</span>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Paparan Takwim */}
        <div className="flex-grow">
          <div className="glass-card rounded-[3.5rem] p-8 md:p-14 border border-white shadow-3xl relative overflow-hidden">
             
             {/* Header Bulan */}
             <div className="flex flex-col md:flex-row items-center justify-between mb-12 pb-8 border-b border-slate-100 gap-6">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl animate-in zoom-in duration-500">
                    <Calendar size={40} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-4xl font-black text-slate-800 tracking-tighter uppercase leading-none">{activeMonth}</h3>
                    <p className="text-slate-400 text-[10px] font-black tracking-[0.3em] uppercase mt-2">Sesi Persekolahan 2026</p>
                  </div>
                </div>
             </div>

             {/* Jadual Takwim */}
             <div className="space-y-4">
                {/* Header Jadual Visual */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 mb-2 bg-slate-900 rounded-2xl text-[9px] font-black text-indigo-200 uppercase tracking-widest">
                  <div className="col-span-1 flex items-center"><ListOrdered size={12} className="mr-2" /> Bil</div>
                  <div className="col-span-1">Minggu</div>
                  <div className="col-span-2">Tarikh</div>
                  <div className="col-span-1">Hari</div>
                  <div className="col-span-7">Butiran Aktiviti / Program HEM</div>
                </div>

                {TAKWIM_DATA[activeMonth].map((event, idx) => {
                  const isToday = event.tarikh === todayDateStr;
                  return (
                    <div 
                      key={idx} 
                      className={`group bg-white/40 hover:bg-white transition-all duration-300 rounded-[2rem] p-6 md:p-8 border shadow-indigo-500/5 md:grid md:grid-cols-12 gap-6 items-center flex flex-col md:flex-row text-left ${
                        isToday 
                          ? 'border-amber-400 ring-4 ring-amber-100 shadow-xl bg-amber-50/20 scale-[1.02] z-10' 
                          : 'border-slate-100 hover:border-indigo-100 hover:shadow-2xl'
                      }`}
                    >
                      {/* Bil & Minggu */}
                      <div className="col-span-1 hidden md:block">
                        <span className="text-xs font-black text-slate-300">#{event.bil}</span>
                      </div>
                      <div className="col-span-1 w-full md:w-auto flex justify-between md:block">
                        <span className="md:hidden text-[10px] font-black text-slate-400 uppercase">Minggu</span>
                        <div className={`px-3 py-1.5 rounded-xl font-black text-[10px] tracking-widest text-center ${event.minggu ? (isToday ? 'bg-amber-500 text-white' : 'bg-slate-900 text-white') : 'bg-slate-100 text-slate-300'}`}>
                          {event.minggu ? `M${event.minggu}` : '-'}
                        </div>
                      </div>

                      {/* Tarikh & Hari */}
                      <div className="col-span-2 w-full md:w-auto flex flex-col text-left">
                        <div className="flex items-center space-x-2">
                           <span className="text-base font-black text-slate-800 tracking-tight">{event.tarikh}</span>
                           {isToday && (
                             <div className="bg-amber-400 text-slate-900 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest animate-pulse flex items-center shadow-lg shadow-amber-200">
                                <Zap size={8} className="mr-1 fill-current" /> HARI INI
                             </div>
                           )}
                        </div>
                      </div>
                      <div className="col-span-1 w-full md:w-auto flex justify-between md:block">
                         <span className="md:hidden text-[10px] font-black text-slate-400 uppercase">Hari</span>
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{event.hari}</span>
                      </div>

                      {/* Aktiviti & Tag */}
                      <div className="col-span-7 w-full space-y-3">
                         <div className="flex flex-wrap items-center gap-3">
                            <span className={`${getEventTagColor(event.jenis)} w-2 h-2 rounded-full`}></span>
                            <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getEventLightColor(event.jenis)}`}>
                              {event.jenis}
                            </div>
                         </div>
                         <h4 className="text-lg md:text-xl font-black text-slate-800 tracking-tighter leading-tight group-hover:text-indigo-600 transition-colors">
                            {event.aktiviti}
                         </h4>
                         {event.catatan && (
                           <div className="flex items-center space-x-2 text-rose-500 text-[10px] font-bold bg-rose-50 px-3 py-1 rounded-lg w-fit">
                              <AlertCircle size={10} />
                              <span className="uppercase tracking-widest">{event.catatan}</span>
                           </div>
                         )}
                      </div>
                    </div>
                  );
                })}

                {TAKWIM_DATA[activeMonth].length === 0 && (
                  <div className="py-32 text-center flex flex-col items-center">
                     <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                       <Calendar size={48} />
                     </div>
                     <p className="font-black text-slate-400 uppercase tracking-widest text-sm">Tiada rekod aktiviti untuk bulan ini</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>

      {/* Footer Navigasi */}
      <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-6">
        <button 
          onClick={onBack}
          className="group flex items-center space-x-4 bg-slate-900 text-white px-12 py-6 rounded-[2.5rem] font-black text-sm tracking-[0.2em] uppercase shadow-2xl shadow-slate-300 hover:bg-indigo-600 transition-all duration-500 hover:-translate-y-2 active:scale-95 border border-white/10"
        >
          <Home size={20} className="group-hover:rotate-12 transition-transform duration-500" />
          <span>Kembali Ke Laman Utama</span>
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .glass-card {
            border-radius: 2rem;
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};
