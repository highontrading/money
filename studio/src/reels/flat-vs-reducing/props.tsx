import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Sfx} from '../../components/paper';
import {ease, pop, stepped} from '../../lib/motion';
import {C, F} from '../../theme';

export const grid = (cell = 40, color = 'rgba(70, 110, 150, 0.16)') => ({
  backgroundImage: `linear-gradient(${color} 1.5px, transparent 1.5px), linear-gradient(90deg, ${color} 1.5px, transparent 1.5px)`,
  backgroundSize: `${cell}px ${cell}px`,
});

// Children visible only inside [from, until) (scene-local frames).
export const Show: React.FC<{from?: number; until?: number; children: React.ReactNode}> = ({from = 0, until, children}) => {
  const frame = useCurrentFrame();
  if (frame < from || (until !== undefined && frame >= until)) return null;
  return <>{children}</>;
};

// Inline element that pops in on its beat.
export const Pop: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, children, style}) => {
  const frame = useCurrentFrame();
  if (stepped(frame) < at) return <span style={{opacity: 0, ...style}}>{children}</span>;
  const p = Math.min(1.06, pop(frame, at));
  return <span style={{display: 'inline-block', transform: `translateY(${(1 - p) * -24}px) scale(${0.9 + 0.1 * p})`, ...style}}>{children}</span>;
};

// One line on a receipt: label left, amount right.
export const Row: React.FC<{label: React.ReactNode; value?: React.ReactNode; size?: number; show?: boolean; bold?: boolean; style?: React.CSSProperties}> = ({label, value, size = 38, show = true, bold, style}) => (
  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: bold ? F.display : F.type, fontSize: size, lineHeight: 1.15, padding: '12px 0', borderBottom: `2px dashed ${C.grey}`, opacity: show ? 1 : 0, ...style}}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

export const N = 36; // EMIs
// Outstanding loan (fraction of ₹1 lakh) when EMI m (0-based) is paid: 36/36, 35/36 ... 1/36.
export const owed = (m: number) => (N - m) / N;

/**
 * 36 months of a ₹1 lakh loan as paper bars: the black bar is what is still owed.
 * shown: months drawn (0..36, animated); outline: dashed ₹1 lakh line over every month (0..1, draws left->right);
 * hatch: red hatch on the repaid part that flat interest still charges on (0..1); caps: yellow interest caps
 * proportional to what's owed (reducing balance, 0..1); hi: highlighted months (1-based).
 */
export const LoanChart: React.FC<{w: number; h: number; shown: number; outline?: number; hatch?: number; caps?: number; hi?: number[]; capLabel?: string}> = ({w, h, shown, outline = 0, hatch = 0, caps = 0, hi = [], capLabel}) => {
  const L = 92, R = 30, T = 70, B = 70;
  const pw = w - L - R, ph = h - T - B;
  const step = pw / N, bw = step * 0.68;
  const base = T + ph;
  const capMax = ph * 0.16;
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <defs>
        <pattern id="fvrHatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="10" height="10" fill="rgba(210,52,31,0.12)" />
          <line x1="0" y1="0" x2="0" y2="10" stroke={C.red} strokeWidth="3.5" />
        </pattern>
      </defs>
      {/* axes */}
      <line x1={L} y1={T - 10} x2={L} y2={base} stroke={C.ink} strokeWidth={3} />
      <line x1={L} y1={base} x2={L + pw} y2={base} stroke={C.ink} strokeWidth={3} />
      {[[1, '₹1L'], [0.5, '₹50K'], [0, '0']].map(([v, t]) => (
        <text key={t as string} x={L - 14} y={base - (v as number) * ph + 8} textAnchor="end" fontFamily="IBM Plex Mono" fontWeight={700} fontSize={22} fill={C.inkSoft}>{t}</text>
      ))}
      {[1, 18, 36].map((m) => (
        <text key={m} x={L + (m - 0.5) * step} y={base + 34} textAnchor="middle" fontFamily="IBM Plex Mono" fontWeight={700} fontSize={22} fill={C.inkSoft}>{m}</text>
      ))}
      <text x={L + pw} y={base + 62} textAnchor="end" fontFamily="IBM Plex Mono" fontWeight={500} fontSize={20} fill={C.inkSoft}>MAHINA →</text>
      {Array.from({length: N}).map((_, m) => {
        if (m >= shown) return null;
        const x = L + m * step + (step - bw) / 2;
        const bh = owed(m) * ph;
        const isHi = hi.includes(m + 1);
        const hx = Math.max(0, Math.min(1, hatch * N - m));
        const ox = Math.max(0, Math.min(1, outline * N - m));
        const cp = Math.max(0, Math.min(1, caps * N - m));
        const ch = owed(m) * capMax * cp;
        return (
          <g key={m}>
            {hx > 0 ? <rect x={x} y={T} width={bw} height={(ph - bh) * hx} fill="url(#fvrHatch)" /> : null}
            <rect x={x} y={base - bh} width={bw} height={bh} fill={isHi ? C.yellow : C.ink} stroke={C.ink} strokeWidth={isHi ? 3 : 0} />
            {cp > 0 ? <rect x={x} y={base - bh - ch} width={bw} height={ch} fill={C.yellow} stroke={C.ink} strokeWidth={1.5} /> : null}
            {ox > 0 ? <line x1={x - 1} y1={T} x2={x + (bw + 2) * ox} y2={T} stroke={C.red} strokeWidth={4} strokeDasharray="7 5" /> : null}
          </g>
        );
      })}
      {capLabel && caps > 0 ? <text x={L + 50} y={T - 36} fontFamily="IBM Plex Mono" fontWeight={700} fontSize={24} fill={C.ink}>{capLabel}</text> : null}
    </svg>
  );
};

// Month bars grow in over [a, b], with a soft tick every few bars.
export const useShown = (a: number, b: number) => {
  const frame = useCurrentFrame();
  return Math.round(ease(stepped(frame), a, b) * N);
};

export const Ticks: React.FC<{a: number; b: number; every?: number}> = ({a, b, every = 6}) => (
  <>
    {Array.from({length: Math.floor(N / every)}).map((_, i) => (
      <Sfx key={i} at={Math.round(a + ((b - a) * (i + 1) * every) / N)} name="tick" volume={0.18} />
    ))}
  </>
);
