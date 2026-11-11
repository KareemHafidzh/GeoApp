// Shared tokens for the homepage dashboard cards.
import { RISK_LEVELS } from '@/features/map/constants';
import { KECAMATAN } from '@/features/home/data/stats';

export const mono = { fontFamily: 'DM Mono, monospace' };
export const syne = { fontFamily: 'Syne, sans-serif' };
export const card = 'bg-white/80 backdrop-blur-md border border-white rounded-3xl shadow-[0_8px_30px_rgba(15,23,42,0.06)]';

export const RISK_HEX: Record<string, string> = Object.fromEntries(RISK_LEVELS.map((r) => [r.label, r.color]));
export const riskCount = (label: string) => KECAMATAN.filter((k) => k.risk === label).length;
export const fmt = (n: number) => n.toLocaleString('id-ID');
