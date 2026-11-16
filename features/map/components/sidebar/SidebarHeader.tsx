import { useState } from 'react';
import Link from 'next/link';

// Baris atas panel: tombol sembunyikan, tombol bagikan, judul, dan tautan kembali ke beranda.
export default function SidebarHeader({ onHide }: { onHide: () => void }) {
  const [copied, setCopied] = useState(false);

  // URL peta sudah memuat #zoom/lat/lng, jadi membagikan location.href ikut membagikan tampilan peta.
  const shareView = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: 'Geodashboard Bekasi', url }); } catch { /* dibatalkan pengguna */ }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="p-4 flex items-center justify-between border-b border-slate-100">
        <button onClick={onHide} aria-label="Sembunyikan panel" title="Sembunyikan panel" className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-700">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={shareView}
          title="Bagikan tampilan peta"
          className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 text-[12px] font-bold">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          {copied ? 'Tersalin!' : 'Bagikan'}
        </button>
        <div className="leading-tight font-extrabold text-slate-900 tracking-wider text-[12px] uppercase text-right">
          GIS<br />KOTA<br />BEKASI
        </div>
      </div>
      <Link href="/" className="mx-4 mt-3 py-2 text-center rounded-lg bg-[#0aab8a] hover:bg-[#088c71] transition-colors text-white text-[12px] font-bold shadow-sm">
        Kembali ke Beranda
      </Link>
    </>
  );
}
