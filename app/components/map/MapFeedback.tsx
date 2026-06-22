'use client';

import { useState } from 'react';

/**
 * Feedback form for the map dashboard.
 *
 * Surface depends on viewport:
 * - tablet/desktop (≥640px): slide-in drawer anchored to the right edge.
 * - phone (<640px): centered popup card, vertically scrollable when the form
 *   overflows the screen.
 *
 * Triggered by a floating "Beri Masukan" button (bottom-left, above the tour
 * help button). All copy is in Bahasa Indonesia to match the rest of the app.
 *
 * NOTE: this is UI only — the questions are placeholder/dummy content and
 * submitting just shows a local success state (no backend wired up yet).
 */

type ChoiceQuestion = {
  id: string;
  type: 'choice';
  label: string;
  options: string[];
};

type TextQuestion = {
  id: string;
  type: 'text';
  label: string;
  placeholder: string;
};

type Question = ChoiceQuestion | TextQuestion;

// Dummy questions — replace with the real survey later.
const QUESTIONS: Question[] = [
  {
    id: 'ease',
    type: 'choice',
    label: 'Seberapa mudah aplikasi peta ini digunakan?',
    options: ['Sangat mudah', 'Mudah', 'Cukup', 'Sulit'],
  },
  {
    id: 'accuracy',
    type: 'choice',
    label: 'Menurut Anda, seberapa akurat informasi zona risiko bencana?',
    options: ['Sangat akurat', 'Akurat', 'Kurang akurat', 'Tidak tahu'],
  },
  {
    id: 'favorite',
    type: 'choice',
    label: 'Fitur mana yang paling bermanfaat bagi Anda?',
    options: ['Peta zona risiko', 'Pencarian lokasi', 'Alat pengukuran', 'Titik fasilitas (RS & Sekolah)'],
  },
  {
    id: 'recommend',
    type: 'choice',
    label: 'Apakah Anda akan merekomendasikan aplikasi ini ke orang lain?',
    options: ['Ya, pasti', 'Mungkin', 'Tidak'],
  },
  {
    id: 'likes',
    type: 'text',
    label: 'Apa yang paling Anda sukai dari aplikasi ini?',
    placeholder: 'Ceritakan bagian yang menurut Anda paling membantu…',
  },
  {
    id: 'suggestion',
    type: 'text',
    label: 'Saran atau masukan untuk perbaikan ke depan?',
    placeholder: 'Tulis ide, kendala, atau fitur yang Anda harapkan…',
  },
];

export default function MapFeedback() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const setAnswer = (id: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [id]: value }));

  const close = () => setOpen(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // UI-only: no backend yet. Just log and show the thank-you state.
    console.log('Feedback submitted (dummy):', answers);
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setOpen(false);
    // Reset after the panel is gone so the success card doesn't flash on close.
    setTimeout(() => {
      setSubmitted(false);
      setAnswers({});
    }, 250);
  };

  return (
    <>
      {/* Floating trigger — bottom-left, above the tour help button. */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Beri masukan"
        title="Beri Masukan"
        className={`absolute bottom-[6.5rem] left-4 z-50 flex items-center gap-2 pl-3 pr-4 py-2.5 bg-[#0aab8a] text-white rounded-full shadow-lg hover:bg-[#088c71] transition-all ${open ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
        <span className="text-[13px] font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>Beri Masukan</span>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={close}
            className="fixed inset-0 z-[55] bg-slate-900/40 backdrop-blur-[2px] anim-fade-in"
          />

          {/* Panel: phone = centered popup card; sm+ = right slide-in drawer. */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Formulir masukan"
            className="anim-feedback-pop fixed z-[56] flex flex-col bg-white shadow-2xl border border-slate-200
              inset-x-4 top-1/2 -translate-y-1/2 max-h-[85vh] rounded-2xl
              sm:inset-x-auto sm:inset-y-0 sm:right-0 sm:top-0 sm:bottom-0 sm:translate-y-0
              sm:max-h-none sm:w-[420px] sm:max-w-[92vw] sm:rounded-none sm:rounded-l-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 p-5 border-b border-slate-100 shrink-0">
              <div>
                <h2 className="text-[18px] font-extrabold text-slate-900 leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Beri Masukan
                </h2>
                <p className="text-[12.5px] text-slate-500 font-medium mt-0.5">
                  Bantu kami meningkatkan BekasiGIS 🙌
                </p>
              </div>
              <button
                onClick={resetAndClose}
                aria-label="Tutup formulir"
                className="p-2 -mr-1 -mt-1 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-500 shrink-0"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {submitted ? (
              /* Success state */
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 p-8">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-600">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[17px] font-extrabold text-slate-900" style={{ fontFamily: 'Syne, sans-serif' }}>
                    Terima kasih! 🎉
                  </h3>
                  <p className="text-[13px] text-slate-600 font-medium mt-1 max-w-[260px]">
                    Masukan Anda sudah kami terima dan sangat berarti untuk pengembangan selanjutnya.
                  </p>
                </div>
                <button
                  onClick={resetAndClose}
                  className="mt-2 px-5 py-2.5 text-[13px] font-bold rounded-xl bg-[#0aab8a] text-white hover:bg-[#088c71] transition-colors"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  Selesai
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                {/* Scrollable questions */}
                <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
                  {QUESTIONS.map((q, i) => (
                    <div key={q.id}>
                      <label className="block text-[13.5px] font-bold text-slate-800 mb-2.5" style={{ fontFamily: 'Syne, sans-serif' }}>
                        <span className="text-[#0aab8a]">{i + 1}.</span> {q.label}
                      </label>

                      {q.type === 'choice' ? (
                        <div className="flex flex-col gap-2">
                          {q.options.map((opt) => {
                            const checked = answers[q.id] === opt;
                            return (
                              <label
                                key={opt}
                                className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${checked ? 'bg-emerald-50 border-[#0aab8a]' : 'bg-slate-50/60 border-slate-200 hover:border-[#0aab8a]/60 hover:bg-white'}`}
                              >
                                <input
                                  type="radio"
                                  name={q.id}
                                  value={opt}
                                  checked={checked}
                                  onChange={() => setAnswer(q.id, opt)}
                                  className="w-4 h-4 accent-[#0aab8a] cursor-pointer shrink-0"
                                />
                                <span className="text-[13px] font-medium text-slate-700">{opt}</span>
                              </label>
                            );
                          })}
                        </div>
                      ) : (
                        <textarea
                          value={answers[q.id] || ''}
                          onChange={(e) => setAnswer(q.id, e.target.value)}
                          placeholder={q.placeholder}
                          rows={3}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-700 placeholder:text-slate-400 resize-none focus:outline-none focus:border-[#0aab8a] focus:ring-1 focus:ring-[#0aab8a] transition-all"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer actions */}
                <div className="shrink-0 border-t border-slate-100 p-4 flex items-center gap-2 bg-white">
                  <button
                    type="button"
                    onClick={resetAndClose}
                    className="px-4 py-2.5 text-[13px] font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 text-[13px] font-bold rounded-xl bg-[#0aab8a] text-white hover:bg-[#088c71] transition-colors"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    Kirim Masukan
                  </button>
                </div>
              </form>
            )}
          </div>
        </>
      )}
    </>
  );
}
