import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Card, CardProps} from '../../components/paper';
import {clamp, ease, pop, stepped} from '../../lib/motion';
import {C, F} from '../../theme';

export const grid = (cell = 40, color = 'rgba(70, 110, 150, 0.16)') => ({
  backgroundImage: `linear-gradient(${color} 1.5px, transparent 1.5px), linear-gradient(90deg, ${color} 1.5px, transparent 1.5px)`,
  backgroundSize: `${cell}px ${cell}px`,
});

// ₹50 lakh at 8.5% for 240 months: the yearly split of what the EMIs pay.
export const LOAN = 5_000_000;
export const RATE = 0.085 / 12;
export const EMI = (LOAN * RATE) / (1 - (1 + RATE) ** -240);
export const YEARS: {interest: number; principal: number; balance: number}[] = (() => {
  const out: {interest: number; principal: number; balance: number}[] = [];
  let b = LOAN;
  for (let y = 0; y < 20; y++) {
    let i = 0, p = 0;
    for (let m = 0; m < 12; m++) {
      const it = b * RATE;
      i += it; p += EMI - it; b -= EMI - it;
    }
    out.push({interest: i, principal: p, balance: Math.max(0, b)});
  }
  return out;
})();

export const lakh = (n: number, d = 1) => `₹${(n / 100000).toFixed(d)} L`;

// Visible only inside [at, out) (scene-local frames), with a little pop on entry.
export const Show: React.FC<{at: number; out?: number; children: React.ReactNode; style?: React.CSSProperties; popIn?: boolean}> = ({at, out, children, style, popIn = true}) => {
  const frame = useCurrentFrame();
  if (stepped(frame) < at || (out !== undefined && stepped(frame) >= out)) return null;
  const p = popIn ? Math.min(1.05, pop(frame, at)) : 1;
  return <div style={{position: 'absolute', transform: `scale(${0.85 + 0.15 * p})`, opacity: Math.min(1, p * 1.5), ...style}}>{children}</div>;
};

// One line on a statement / receipt: label left, amount right.
export const Row: React.FC<{label: React.ReactNode; value?: React.ReactNode; size?: number; bold?: boolean; show?: boolean; style?: React.CSSProperties}> = ({label, value, size = 40, bold, show = true, style}) => (
  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: bold ? F.display : F.type, fontSize: size, lineHeight: 1.15, padding: '14px 0', borderBottom: `2px dashed ${C.grey}`, opacity: show ? 1 : 0, ...style}}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

// A paper cut-out of a house (generic, hand-made shapes).
export const House: React.FC<Omit<CardProps, 'children' | 'bg'>> = (p) => (
  <Card {...p} bg="transparent" texture={null}>
    <svg width={p.w} height={p.h} viewBox="0 0 400 360" style={{position: 'absolute', inset: 0}}>
      <polygon points="200,18 384,170 16,170" fill={C.ink} />
      <rect x="300" y="50" width="38" height="80" fill={C.ink} />
      <rect x="48" y="160" width="304" height="190" fill={C.card} stroke={C.ink} strokeWidth="8" />
      <rect x="170" y="230" width="62" height="120" fill={C.yellow} stroke={C.ink} strokeWidth="6" />
      <rect x="80" y="200" width="62" height="56" fill={C.paperLight} stroke={C.ink} strokeWidth="6" />
      <rect x="262" y="200" width="62" height="56" fill={C.paperLight} stroke={C.ink} strokeWidth="6" />
      <line x1="111" y1="200" x2="111" y2="256" stroke={C.ink} strokeWidth="4" />
      <line x1="293" y1="200" x2="293" y2="256" stroke={C.ink} strokeWidth="4" />
    </svg>
  </Card>
);

// A horizontal loan bar whose filled part shrinks from `from` to `to` (fractions of the full loan).
export const LoanBar: React.FC<{x: number; y: number; w: number; h: number; from: number; to: number; at: number; dur?: number; color?: string; ghost?: boolean}> = ({x, y, w, h, from, to, at, dur = 14, color = C.ink, ghost = true}) => {
  const frame = useCurrentFrame();
  const v = interpolate(stepped(frame), [at, at + dur], [from, to], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
      {ghost ? <div style={{position: 'absolute', inset: 0, border: `4px dashed ${C.grey}`}} /> : null}
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: w * v, background: color, boxShadow: `3px 5px 6px ${C.shadow}`}} />
    </div>
  );
};

// Twenty yearly columns: dark = interest paid that year, yellow = loan repaid. They pop in left to right.
export const YearColumns: React.FC<{x: number; y: number; w: number; h: number; at: number; gap?: number; stagger?: number; highlight?: number[]}> = ({x, y, w, h, at, gap = 8, stagger = 2, highlight = []}) => {
  const frame = useCurrentFrame();
  const cw = (w - gap * 19) / 20;
  const max = YEARS[0].interest + YEARS[0].principal;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
      {YEARS.map((yr, i) => {
        const p = Math.min(1, Math.max(0, ease(stepped(frame), at + i * stagger, at + i * stagger + 6)));
        const ih = (yr.interest / max) * h * p, ph = (yr.principal / max) * h * p;
        const hi = highlight.includes(i);
        return (
          <div key={i} style={{position: 'absolute', left: i * (cw + gap), bottom: 0, width: cw, height: h}}>
            <div style={{position: 'absolute', bottom: 0, width: '100%', height: ph, background: C.yellow, border: `2px solid ${C.ink}`, boxSizing: 'border-box'}} />
            <div style={{position: 'absolute', bottom: ph, width: '100%', height: ih, background: C.ink, outline: hi ? `4px solid ${C.red}` : undefined}} />
          </div>
        );
      })}
    </div>
  );
};

// A grid of month "pages"; pages after `base` are the extra ones (drawn in red outline) that appear from `extraAt`.
export const MonthPages: React.FC<{x: number; y: number; cols: number; cell: number; base: number; extra: number; at: number; extraAt: number}> = ({x, y, cols, cell, base, extra, at, extraAt}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  const shownBase = Math.round(interpolate(f, [at, at + 16], [0, base], clamp));
  const shownExtra = Math.round(interpolate(f, [extraAt, extraAt + 14], [0, extra], clamp));
  const g = 4;
  return (
    <div style={{position: 'absolute', left: x, top: y}}>
      {Array.from({length: shownBase + shownExtra}).map((_, i) => {
        const ex = i >= base;
        return (
          <div key={i} style={{position: 'absolute', left: (i % cols) * (cell + g), top: Math.floor(i / cols) * (cell + g), width: cell, height: cell,
            background: ex ? C.paperLight : C.newsprint, border: `2px solid ${ex ? C.red : C.inkSoft}`, boxSizing: 'border-box'}} />
        );
      })}
    </div>
  );
};
