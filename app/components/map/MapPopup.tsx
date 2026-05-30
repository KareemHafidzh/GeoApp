import { Popup } from 'react-map-gl/maplibre';
import type { PopupInfo } from '@/app/types/map';
import { getRiskColor } from '@/app/constants/map';

interface MapPopupProps {
  popupInfo: PopupInfo | null;
  onClose: () => void;
}

export default function MapPopup({ popupInfo, onClose }: MapPopupProps) {
  if (!popupInfo) return null;

  return (
    <Popup longitude={popupInfo.longitude} latitude={popupInfo.latitude} anchor="bottom" onClose={onClose} closeOnClick={false} maxWidth="340px" className="modern-popup">
      <div className="p-2 min-w-[260px]">
        
        {/* Popup Header */}
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-widest text-[#0aab8a] font-bold mb-1" style={{ fontFamily: 'DM Mono, monospace' }}>
            Kec. {popupInfo.district}
          </div>
          <h3 className="font-extrabold text-slate-900 text-xl leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            {popupInfo.village}
          </h3>
        </div>
        
        {/* Risk Layer Specific UI */}
        <div className="space-y-3">
          <div className={`inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-bold tracking-wide ${getRiskColor(popupInfo.riskLabel)}`}>
            {popupInfo.riskLabel}
          </div>
          
          {/* Data Grid */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 pt-3 border-t border-slate-100">
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5" style={{ fontFamily: 'DM Mono, monospace' }}>Penduduk</div>
              <div className="text-sm font-bold text-slate-800">{popupInfo.totalPenduduk?.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5" style={{ fontFamily: 'DM Mono, monospace' }}>Pertumbuhan</div>
              <div className="text-sm font-bold text-slate-800">{popupInfo.lajuPertumbuhan}%</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5" style={{ fontFamily: 'DM Mono, monospace' }}>Total RS</div>
              <div className="text-sm font-bold text-slate-800">{popupInfo.totalRS}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5" style={{ fontFamily: 'DM Mono, monospace' }}>Sekolah (SMA/K)</div>
              <div className="text-sm font-bold text-slate-800">{popupInfo.totalSma}</div>
            </div>
            <div className="col-span-2 mt-1">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5" style={{ fontFamily: 'DM Mono, monospace' }}>Luas Area</div>
              <div className="text-sm font-bold text-slate-800">{popupInfo.luasWilayahKm} km²</div>
            </div>
          </div>

          {/* Histori Bencana Section */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider" style={{ fontFamily: 'DM Mono, monospace' }}>Histori Bencana</div>
              <div className="text-[9px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">Total: {popupInfo.totalBencana} Kejadian</div>
            </div>
            
            <div className="overflow-hidden border border-slate-200 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[9px] uppercase text-slate-500 border-b border-slate-200" style={{ fontFamily: 'DM Mono, monospace' }}>
                    <th className="py-1.5 px-2 font-semibold">Bencana</th>
                    <th className="py-1.5 px-2 font-semibold text-center border-l border-slate-200">2020</th>
                    <th className="py-1.5 px-2 font-semibold text-center border-l border-slate-200">2021</th>
                    <th className="py-1.5 px-2 font-semibold text-center border-l border-slate-200">2024</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-slate-700 bg-white">
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 px-2 font-medium text-blue-700">Banjir</td>
                    <td className="py-1.5 px-2 text-center border-l border-slate-100 font-bold">{popupInfo.banjir2020}</td>
                    <td className="py-1.5 px-2 text-center border-l border-slate-100 font-bold">{popupInfo.banjir2021}</td>
                    <td className="py-1.5 px-2 text-center border-l border-slate-100 font-bold">{popupInfo.banjir2024}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 px-2 font-medium text-orange-700">Longsor</td>
                    <td className="py-1.5 px-2 text-center border-l border-slate-100 font-bold">{popupInfo.longsor2020}</td>
                    <td className="py-1.5 px-2 text-center border-l border-slate-100 font-bold">{popupInfo.longsor2021}</td>
                    <td className="py-1.5 px-2 text-center border-l border-slate-100 font-bold">{popupInfo.longsor2024}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 font-medium text-yellow-700">Gempa</td>
                    <td className="py-1.5 px-2 text-center border-l border-slate-100 font-bold">{popupInfo.gempa2020}</td>
                    <td className="py-1.5 px-2 text-center border-l border-slate-100 font-bold">{popupInfo.gempa2021}</td>
                    <td className="py-1.5 px-2 text-center border-l border-slate-100 font-bold">{popupInfo.gempa2024}</td>
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
