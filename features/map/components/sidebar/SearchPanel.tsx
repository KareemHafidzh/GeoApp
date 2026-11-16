import type { useMapSearch } from '@/features/map/hooks/useMapSearch';

// Kolom cari lokasi beserta pesan status dan daftar hasil pencarian.
export default function SearchPanel({ search }: { search: ReturnType<typeof useMapSearch> }) {
  const { searchQuery, setSearchQuery, handleSearch, searching, searchMessage, searchResults, activeResult, selectResult } = search;
  return (
    <div data-tour="search" className="p-4 pt-3 border-b border-slate-100 bg-slate-50/50">
      <form onSubmit={handleSearch} className="relative flex items-center">
        <input
          type="text"
          placeholder="Cari Lokasi"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:border-[#0aab8a] focus:ring-1 focus:ring-[#0aab8a] transition-all"
        />
        <button type="submit" aria-label="Cari" disabled={searching} className="absolute right-1.5 p-1.5 bg-[#0aab8a] text-white rounded-lg hover:bg-[#088c71] disabled:opacity-60 disabled:cursor-wait transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </form>
      <p role="status" aria-live="polite" className="empty:hidden mt-2 px-1 text-[12px] text-slate-600">
        {searching ? 'Mencari…' : searchMessage}
      </p>
      {searchResults.length > 0 && (
        <ul className="mt-2 bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
          {searchResults.map((r, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => selectResult(r)}
                aria-current={r === activeResult}
                className={`w-full text-left px-3 py-2 text-[12px] transition-colors ${r === activeResult ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700 hover:bg-emerald-50'}`}>
                <span className="line-clamp-2">{r.display_name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
