export default function MapLegend() {
  return (
    <div className="absolute top-4 right-4 z-10 w-[280px] bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-slate-200 flex flex-col gap-3">
      <h3 className="font-extrabold text-slate-900 text-sm tracking-wide uppercase" style={{ fontFamily: 'Syne, sans-serif' }}>
        Informasi Risiko Bencana
      </h3>
      <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
        Peta ini menampilkan zona klasifikasi risiko bencana di wilayah Kota Bekasi. Klasifikasi didasarkan pada tingkat risiko yang dipetakan per wilayah.
      </p>
      <div className="flex flex-col gap-2.5 mt-2">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100">
          <span className="w-3.5 h-3.5 rounded-full bg-[#a50026] shadow-sm"></span>
          <span className="text-xs font-bold text-slate-800" style={{ fontFamily: 'Syne, sans-serif' }}>Very High Risk</span>
        </div>
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100">
          <span className="w-3.5 h-3.5 rounded-full bg-[#f46d43] shadow-sm"></span>
          <span className="text-xs font-bold text-slate-800" style={{ fontFamily: 'Syne, sans-serif' }}>High Risk</span>
        </div>
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100">
          <span className="w-3.5 h-3.5 rounded-full bg-[#fee08b] shadow-sm"></span>
          <span className="text-xs font-bold text-slate-800" style={{ fontFamily: 'Syne, sans-serif' }}>Medium Risk</span>
        </div>
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100">
          <span className="w-3.5 h-3.5 rounded-full bg-[#1a9850] shadow-sm"></span>
          <span className="text-xs font-bold text-slate-800" style={{ fontFamily: 'Syne, sans-serif' }}>Low Risk</span>
        </div>
      </div>
    </div>
  );
}
