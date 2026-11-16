// Gaya kartu dan fungsi bantu yang dipakai bersama oleh komponen hero beranda.
import { RISK_LEVELS } from '@/features/map/constants';
import { KECAMATAN } from '@/features/home/data/stats';

export const card = 'bg-white/85 backdrop-blur-md border border-slate-100 rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.06)]';

export const RISK_HEX: Record<string, string> = Object.fromEntries(RISK_LEVELS.map((r) => [r.label, r.color]));
export const riskCount = (label: string) => KECAMATAN.filter((k) => k.risk === label).length;
export const fmt = (n: number) => n.toLocaleString('id-ID');
