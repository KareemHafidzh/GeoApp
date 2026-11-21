import { Popup } from 'react-map-gl/maplibre';
import type { PopupInfo } from '@/features/map/types';
import { getRiskColor } from '@/features/map/constants';

interface MapPopupProps {
  popupInfo: PopupInfo | null;
  onClose: () => void;
}

// Kartu detail kelurahan saat zona diklik: kelas risiko, alasan warnanya, data wilayah, dan riwayat bencana.
export default function MapPopup({ popupInfo, onClose }: MapPopupProps) {
  if (!popupInfo) return null;

  return (
    <Popup longitude={popupInfo.longitude} latitude={popupInfo.latitude} anchor="bottom" onClose={onClose} closeOnClick={false} maxWidth="min(460px, calc(100vw - 32px))" className="modern-popup">
      <div className="p-0.5 sm:p-2 min-w-[250px] sm:min-w-[440px] max-h-[70vh] overflow-y-auto">
        
        <div className="mb-2 sm:mb-4 pr-5">
          <div className="text-[10px] uppercase tracking-widest text-[#0aab8a] font-bold mb-1 font-mono">
            Kec. {popupInfo.district}
          </div>
          <h3 className="font-extrabold text-slate-900 text-base sm:text-xl leading-tight">
            {popupInfo.village}
          </h3>
        </div>
        
        <div className="space-y-2 sm:space-y-3">
          <div className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border text-[11px] sm:text-xs font-bold tracking-wide ${getRiskColor(popupInfo.riskLabel)}`}>
            {popupInfo.riskLabel}
          </div>

          {/* "Kenapa warnanya ini?": nilai input model untuk kecamatan ini, memakai <details> bawaan tanpa state. */}
          {popupInfo.factors.length > 0 && (
            <details className="group rounded-lg border border-blue-200 bg-blue-50/60 text-[11px] text-slate-600 leading-snug">
              {/* Biru agar terlihat bisa diklik; saat terbuka berubah penuh biru dengan panah putih untuk menutup. */}
              <summary className="cursor-pointer select-none px-2.5 py-2 font-bold flex items-center justify-between gap-2 list-none [&::-webkit-details-marker]:hidden rounded-lg text-blue-700 hover:bg-blue-100 transition-colors group-open:bg-blue-600 group-open:text-white group-open:hover:bg-blue-700 group-open:rounded-b-none">
                <span>Kenapa {popupInfo.riskLabel}?</span>
                <span className="flex items-center gap-1.5 shrink-0">
                  <span className="hidden group-open:inline text-[10px] font-semibold">Tutup</span>
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white group-open:bg-white group-open:text-blue-600 transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-open:rotate-180"><polyline points="6 9 12 15 18 9" /></svg>
                  </span>
                </span>
              </summary>
              <div className="px-2.5 py-2.5">
                <p className="mb-1.5">Data Kec. {popupInfo.district} dibanding kecamatan lain:</p>
                <ul className="grid grid-cols-2 gap-x-2 sm:gap-x-5 gap-y-1 text-[clamp(8px,2.3vw,11px)]">
                  {popupInfo.factors.map((f) => (
                    <li key={f.label} className="flex items-baseline justify-between gap-x-1 whitespace-nowrap">
                      <span>{f.label}</span>
                      <span className={`font-bold whitespace-nowrap ${f.raises ? 'text-red-600' : 'text-emerald-600'}`}>{f.value} {f.raises ? '▲' : '▼'}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-1.5 text-[10px] text-slate-400"><span className="text-red-600">▲</span> menaikkan risiko · <span className="text-emerald-600">▼</span> menurunkan. Sekolah, guru, RS &amp; puskesmas dihitung per 100 ribu warga.</p>
              </div>
            </details>
          )}
          
          <div className="grid grid-cols-3 sm:grid-cols-2 gap-y-2 sm:gap-y-3 gap-x-3 sm:gap-x-4 pt-2 sm:pt-3 border-t border-slate-100">
            <div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wide sm:tracking-wider mb-0.5 truncate font-mono">Penduduk</div>
              <div className="text-[13px] sm:text-sm font-bold text-slate-800">{popupInfo.totalPenduduk.toLocaleString('id-ID')}</div>
            </div>
            <div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wide sm:tracking-wider mb-0.5 truncate font-mono">Pertumbuhan</div>
              <div className="text-[13px] sm:text-sm font-bold text-slate-800">{popupInfo.lajuPertumbuhan.toLocaleString('id-ID')}%</div>
            </div>
            <div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wide sm:tracking-wider mb-0.5 truncate font-mono">Total RS</div>
              <div className="text-[13px] sm:text-sm font-bold text-slate-800">{popupInfo.totalRS}</div>
            </div>
            <div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wide sm:tracking-wider mb-0.5 truncate font-mono">SMA/K</div>
              <div className="text-[13px] sm:text-sm font-bold text-slate-800">{popupInfo.totalSma}</div>
            </div>
            <div className="sm:col-span-2 sm:mt-1">
              <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wide sm:tracking-wider mb-0.5 truncate font-mono">Luas Area</div>
              <div className="text-[13px] sm:text-sm font-bold text-slate-800">{popupInfo.luasWilayahKm.toLocaleString('id-ID')} km²</div>
            </div>
          </div>

          {/* Jumlah kelurahan terdampak per jenis bencana dan tahun. */}
          <div className="pt-2 sm:pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2">
              <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wide sm:tracking-wider font-mono">Riwayat Kelurahan Terdampak</div>
              <div className="text-[9px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">Total 3 tahun: {popupInfo.totalBencana}</div>
            </div>
            
            <p className="text-[10px] text-slate-400 mb-1.5">Hanya informasi, tidak memengaruhi warna risiko.</p>
            <div className="overflow-hidden border border-slate-200 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[9px] uppercase text-slate-500 border-b border-slate-200 font-mono">
                    <th className="py-1 sm:py-1.5 px-2 font-semibold">Bencana</th>
                    <th className="py-1 sm:py-1.5 px-2 font-semibold text-center border-l border-slate-200">2021</th>
                    <th className="py-1 sm:py-1.5 px-2 font-semibold text-center border-l border-slate-200">2024</th>
                    <th className="py-1 sm:py-1.5 px-2 font-semibold text-center border-l border-slate-200">2025</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-slate-700 bg-white">
                  <tr className="border-b border-slate-100">
                    <td className="py-1 sm:py-1.5 px-2 font-medium text-blue-700">Banjir</td>
                    <td className="py-1 sm:py-1.5 px-2 text-center border-l border-slate-100 font-bold">{popupInfo.banjir2021}</td>
                    <td className="py-1 sm:py-1.5 px-2 text-center border-l border-slate-100 font-bold">{popupInfo.banjir2024}</td>
                    <td className="py-1 sm:py-1.5 px-2 text-center border-l border-slate-100 font-bold">{popupInfo.banjir2025}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1 sm:py-1.5 px-2 font-medium text-orange-700">Longsor</td>
                    <td className="py-1 sm:py-1.5 px-2 text-center border-l border-slate-100 font-bold">{popupInfo.longsor2021}</td>
                    <td className="py-1 sm:py-1.5 px-2 text-center border-l border-slate-100 font-bold">{popupInfo.longsor2024}</td>
                    <td className="py-1 sm:py-1.5 px-2 text-center border-l border-slate-100 font-bold">{popupInfo.longsor2025}</td>
                  </tr>
                  <tr>
                    <td className="py-1 sm:py-1.5 px-2 font-medium text-yellow-700">Gempa</td>
                    <td className="py-1 sm:py-1.5 px-2 text-center border-l border-slate-100 font-bold">{popupInfo.gempa2021}</td>
                    <td className="py-1 sm:py-1.5 px-2 text-center border-l border-slate-100 font-bold">{popupInfo.gempa2024}</td>
                    <td className="py-1 sm:py-1.5 px-2 text-center border-l border-slate-100 font-bold">{popupInfo.gempa2025}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </Popup>
  );
}
