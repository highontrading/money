import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Card, CardProps} from '../../components/paper';
import {clamp, ease, pop, stepped} from '../../lib/motion';
import {C} from '../../theme';

export const grid = (cell = 40, color = 'rgba(70, 110, 150, 0.16)') => ({
  backgroundImage: `linear-gradient(${color} 1.5px, transparent 1.5px), linear-gradient(90deg, ${color} 1.5px, transparent 1.5px)`,
  backgroundSize: `${cell}px ${cell}px`,
});

// ₹3 lakh left in EPF at 8.25% a year, no new contributions.
export const PF = 300000;
export const RATE = 0.0825;
export const value = (years: number) => PF * (1 + RATE) ** years;

// Visible only inside [at, out) (scene-local frames), with a little pop on entry.
export const Show: React.FC<{at: number; out?: number; children: React.ReactNode; style?: React.CSSProperties; popIn?: boolean}> = ({at, out, children, style, popIn = true}) => {
  const frame = useCurrentFrame();
  if (stepped(frame) < at || (out !== undefined && stepped(frame) >= out)) return null;
  const p = popIn ? Math.min(1.05, pop(frame, at)) : 1;
  return <div style={{position: 'absolute', transform: `scale(${0.85 + 0.15 * p})`, opacity: Math.min(1, p * 1.5), ...style}}>{children}</div>;
};

// A generic paper cut-out of a motorbike.
export const Bike: React.FC<Omit<CardProps, 'children' | 'bg'>> = (p) => (
  <Card {...p} bg="transparent" texture={null}>
    <svg width={p.w} height={p.h} viewBox="0 0 420 260" style={{position: 'absolute', inset: 0}}>
      <circle cx="90" cy="190" r="56" fill={C.card} stroke={C.ink} strokeWidth="12" />
      <circle cx="330" cy="190" r="56" fill={C.card} stroke={C.ink} strokeWidth="12" />
      <circle cx="90" cy="190" r="12" fill={C.ink} />
      <circle cx="330" cy="190" r="12" fill={C.ink} />
      <polygon points="150,120 290,110 320,190 220,200 140,190" fill={C.yellow} stroke={C.ink} strokeWidth="8" strokeLinejoin="round" />
      <rect x="150" y="88" width="120" height="26" rx="10" fill={C.ink} />
      <line x1="300" y1="118" x2="330" y2="190" stroke={C.ink} strokeWidth="10" />
      <line x1="300" y1="118" x2="320" y2="60" stroke={C.ink} strokeWidth="10" strokeLinecap="round" />
      <line x1="300" y1="60" x2="350" y2="60" stroke={C.ink} strokeWidth="10" strokeLinecap="round" />
      <line x1="150" y1="150" x2="90" y2="190" stroke={C.ink} strokeWidth="10" />
    </svg>
  </Card>
);

// Sapling in a pot (₹3 lakh) and a full tree (₹32 lakh), both paper shapes.
export const Sapling: React.FC<Omit<CardProps, 'children' | 'bg'>> = (p) => (
  <Card {...p} bg="transparent" texture={null}>
    <svg width={p.w} height={p.h} viewBox="0 0 200 260" style={{position: 'absolute', inset: 0}}>
      <path d="M100,190 C100,150 98,120 102,80" stroke={C.ink} strokeWidth="8" fill="none" strokeLinecap="round" />
      <ellipse cx="72" cy="104" rx="32" ry="16" transform="rotate(-25 72 104)" fill={C.yellow} stroke={C.ink} strokeWidth="6" />
      <ellipse cx="130" cy="88" rx="32" ry="16" transform="rotate(20 130 88)" fill={C.yellow} stroke={C.ink} strokeWidth="6" />
      <polygon points="50,190 150,190 136,256 64,256" fill={C.kraft} stroke={C.ink} strokeWidth="7" strokeLinejoin="round" />
    </svg>
  </Card>
);

export const Tree: React.FC<Omit<CardProps, 'children' | 'bg'>> = (p) => (
  <Card {...p} bg="transparent" texture={null}>
    <svg width={p.w} height={p.h} viewBox="0 0 400 520" style={{position: 'absolute', inset: 0}}>
      <polygon points="180,520 220,520 236,300 164,300" fill={C.kraft} stroke={C.ink} strokeWidth="8" strokeLinejoin="round" />
      <line x1="200" y1="360" x2="130" y2="300" stroke={C.ink} strokeWidth="10" strokeLinecap="round" />
      <line x1="204" y1="340" x2="280" y2="290" stroke={C.ink} strokeWidth="10" strokeLinecap="round" />
      <circle cx="200" cy="170" r="130" fill={C.yellow} stroke={C.ink} strokeWidth="9" />
      <circle cx="96" cy="250" r="78" fill={C.yellow} stroke={C.ink} strokeWidth="9" />
      <circle cx="304" cy="250" r="78" fill={C.yellow} stroke={C.ink} strokeWidth="9" />
      <circle cx="200" cy="170" r="122" fill={C.yellow} />
      <circle cx="96" cy="250" r="70" fill={C.yellow} />
      <circle cx="304" cy="250" r="70" fill={C.yellow} />
    </svg>
  </Card>
);

// Thirty yearly bars for ₹3 lakh at 8.25%, popping in left to right over `dur` frames.
export const GrowthBars: React.FC<{x: number; y: number; w: number; h: number; at: number; dur?: number; years?: number}> = ({x, y, w, h, at, dur = 60, years = 30}) => {
  const frame = useCurrentFrame();
  const gap = 6;
  const bw = (w - gap * (years - 1)) / years;
  const max = value(years);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
      {Array.from({length: years}).map((_, i) => {
        const t = at + (i / years) * dur;
        const p = Math.min(1, Math.max(0, pop(frame, t, 12, 0.5)));
        const bh = (value(i + 1) / max) * h;
        const last = i === years - 1;
        if (p <= 0.01) return null;
        return (
          <div key={i} style={{position: 'absolute', left: i * (bw + gap), bottom: 0, width: bw, height: bh * p, background: last ? C.yellow : C.ink, border: last ? `4px solid ${C.ink}` : undefined, boxSizing: 'border-box'}} />
        );
      })}
      <div style={{position: 'absolute', left: -10, right: -10, bottom: -4, height: 5, background: C.ink}} />
    </div>
  );
};

// Balance that resets to zero at every job switch, against the uninterrupted curve (dashed).
export const Sawtooth: React.FC<{w: number; h: number; at: number; dur?: number; resets?: number[]; ghostAt?: number}> = ({w, h, at, dur = 50, resets = [7, 14, 21], ghostAt}) => {
  const frame = useCurrentFrame();
  const total = 30;
  const max = value(total);
  const X = (yr: number) => (yr / total) * w;
  const Y = (v: number) => h - (v / max) * h * 0.96;
  let full = '';
  for (let i = 0; i <= total * 2; i++) {
    const yr = i / 2;
    full += `${i ? ' L' : 'M'}${X(yr).toFixed(1)},${Y(value(yr)).toFixed(1)}`;
  }
  // actual: each stint starts from zero (new money only), so it never gets high
  let saw = '';
  const edges = [0, ...resets, total];
  edges.slice(0, -1).forEach((s, k) => {
    const e = edges[k + 1];
    for (let i = 0; i <= (e - s) * 2; i++) {
      const yr = s + i / 2;
      const v = (value(yr - s) - PF) * 1.6 + PF * 0.5 * ((yr - s) / (e - s));
      saw += `${k === 0 && i === 0 ? 'M' : ' L'}${X(yr).toFixed(1)},${Y(Math.max(0, v)).toFixed(1)}`;
    }
    if (e < total) saw += ` L${X(e).toFixed(1)},${Y(0).toFixed(1)}`;
  });
  const p = ease(stepped(frame), at, at + dur);
  const g = ghostAt === undefined ? 1 : ease(stepped(frame), ghostAt, ghostAt + 16);
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <path d={full} fill="none" stroke={C.grey} strokeWidth={5} strokeDasharray="14 10" opacity={0.8 * g} />
      <path d={saw} pathLength={1} fill="none" stroke={C.ink} strokeWidth={9} strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - p} />
      {resets.map((r) => (
        <g key={r} opacity={p > r / total ? 1 : 0}>
          <line x1={X(r)} y1={-10} x2={X(r)} y2={h} stroke={C.red} strokeWidth={4} strokeDasharray="8 8" />
        </g>
      ))}
    </svg>
  );
};

// A jar of PF money with a small measured pour taken out.
export const Jar: React.FC<{x: number; y: number; at: number; pourAt: number}> = ({x, y, at, pourAt}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at) return null;
  const p = ease(f, pourAt, pourAt + 14);
  const level = interpolate(p, [0, 1], [0.78, 0.6], clamp);
  return (
    <svg width={360} height={440} style={{position: 'absolute', left: x, top: y, overflow: 'visible', filter: `drop-shadow(5px 9px 9px ${C.shadow})`}}>
      <rect x={30} y={40} width={300} height={380} rx={30} fill={C.paperLight} stroke={C.ink} strokeWidth={8} />
      <rect x={38} y={40 + 380 * (1 - level)} width={284} height={372 * level} rx={22} fill={C.yellow} />
      <rect x={90} y={14} width={180} height={34} rx={8} fill={C.ink} />
      <text x={180} y={260} textAnchor="middle" fontFamily="Anton" fontSize={88} fill={C.ink}>PF</text>
    </svg>
  );
};

export const pct = (n: number) => `${n.toFixed(2)}%`;
