import type { MapTool } from '@/features/map/types';

// Petunjuk langkah per alat ukur, karena gerakannya tidak bisa ditebak dari ikon saja.
const TOOL_HINTS: Record<MapTool, string> = {
  marker: 'Ketuk peta untuk menaruh titik.',
  line: 'Ketuk peta untuk menambah titik garis. Ketuk titik terakhir sekali lagi untuk selesai.',
  polygon: 'Ketuk peta untuk menambah sudut. Ketuk titik pertama untuk menutup area.',
  circle: 'Ketuk titik pusat, lalu ketuk lagi di tepi untuk menentukan besar lingkaran.',
  rectangle: 'Ketuk satu sudut, lalu ketuk sudut seberangnya.',
  freehand: 'Tekan dan seret di peta untuk menggambar area, lalu lepas untuk selesai.',
  edit: 'Seret titik putih pada bentuk untuk mengubah ukuran atau bentuknya.',
  drag: 'Seret bentuk untuk memindahkannya.',
  delete: 'Ketuk bentuk yang ingin dihapus.',
};

// Banner gelap di atas peta yang menjelaskan alat aktif, dengan tombol Selesai.
export default function ToolHint({ tool, onDone }: { tool: MapTool; onDone: () => void }) {
  return (
    <div role="status" className="absolute z-20 top-24 lg:top-4 left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-[340px] flex items-center gap-3 bg-slate-900/90 backdrop-blur-md text-white rounded-2xl pl-4 pr-2 py-2 shadow-xl anim-fade-in">
      <p className="flex-1 text-[12px] leading-snug font-medium">{TOOL_HINTS[tool]}</p>
      <button onClick={onDone} className="shrink-0 px-3 py-1.5 rounded-xl bg-[#0aab8a] hover:bg-[#088c71] text-[12px] font-bold transition-colors">
        Selesai
      </button>
    </div>
  );
}
