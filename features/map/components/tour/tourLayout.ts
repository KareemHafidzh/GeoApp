export const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const PAD = 8; // jarak sorotan ke elemen
const GAP = 14; // jarak kartu ke sorotan

export type Placement = 'top' | 'bottom' | 'left' | 'right' | 'center';

export interface Layout {
  rect: { top: number; left: number; width: number; height: number } | null;
  tip: { top: number; left: number };
  placement: Placement;
  arrow: number; // posisi panah di sepanjang tepi kartu (px)
}

// Hitung kotak sorotan dan posisi kartu: kanan, bawah, atas, atau kiri elemen, mana yang muat.
export function computeLayout(selector: string | null, tooltip: HTMLElement | null): Layout {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let rect: Layout['rect'] = null;
  if (selector) {
    const el = document.querySelector(`[data-tour="${selector}"]`);
    if (el) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        // Dipotong ke batas layar: di HP sidebar setinggi layar membuat tepi sorotan keluar layar.
        const top = Math.max(4, r.top - PAD);
        const left = Math.max(4, r.left - PAD);
        rect = {
          top,
          left,
          width: Math.min(vw - 4, r.right + PAD) - left,
          height: Math.min(vh - 4, r.bottom + PAD) - top,
        };
      }
    }
  }

  const tt = tooltip?.getBoundingClientRect();
  const ttW = tt?.width ?? 320;
  const ttH = tt?.height ?? 200;

  const clampH = (x: number) => Math.max(12, Math.min(x, vw - ttW - 12));
  const clampV = (y: number) => Math.max(12, Math.min(y, vh - ttH - 12));

  let placement: Placement = 'center';
  let top = (vh - ttH) / 2;
  let left = (vw - ttW) / 2;
  let arrow = 0;

  if (rect) {
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const spaceRight = vw - (rect.left + rect.width);
    const spaceBelow = vh - (rect.top + rect.height);

    if (spaceRight >= ttW + GAP) {
      placement = 'right';
      left = rect.left + rect.width + GAP;
      top = clampV(cy - ttH / 2);
      arrow = cy - top;
    } else if (spaceBelow >= ttH + GAP) {
      placement = 'bottom';
      top = rect.top + rect.height + GAP;
      left = clampH(cx - ttW / 2);
      arrow = cx - left;
    } else if (rect.top >= ttH + GAP) {
      placement = 'top';
      top = rect.top - GAP - ttH;
      left = clampH(cx - ttW / 2);
      arrow = cx - left;
    } else if (rect.left >= ttW + GAP) {
      placement = 'left';
      left = rect.left - GAP - ttW;
      top = clampV(cy - ttH / 2);
      arrow = cy - top;
    } else {
      placement = 'center';
      top = clampV((vh - ttH) / 2);
      left = clampH((vw - ttW) / 2);
    }

    // Panah tetap berada di sepanjang tepi kartu.
    const max = (placement === 'left' || placement === 'right' ? ttH : ttW) - 18;
    arrow = Math.max(18, Math.min(arrow, max));
  }

  return { rect, tip: { top, left }, placement, arrow };
}
