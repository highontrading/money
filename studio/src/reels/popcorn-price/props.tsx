import React from 'react';
import {random, useCurrentFrame} from 'remotion';
import {ease, pop, stepped} from '../../lib/motion';
import {C, F} from '../../theme';

// Show children only inside [at, out) (scene-local frames), with a small pop-in.
export const Show: React.FC<{at: number; out?: number; children: React.ReactNode; style?: React.CSSProperties; popIn?: boolean}> = ({at, out, children, style, popIn = true}) => {
  const frame = useCurrentFrame();
  if (stepped(frame) < at || (out !== undefined && stepped(frame) >= out)) return null;
  const p = popIn ? Math.min(1.05, pop(frame, at)) : 1;
  return <div style={{position: 'absolute', transform: `scale(${0.85 + 0.15 * p})`, opacity: Math.min(1, p * 1.5), ...style}}>{children}</div>;
};

// Paper movie ticket: perforated stub on the right, punched notches on the sides.
export const Ticket: React.FC<{w: number; h: number; price: React.ReactNode; hiPrice?: boolean}> = ({w, h, price, hiPrice}) => {
  const stub = w * 0.28;
  return (
    <div style={{position: 'absolute', inset: 0, background: C.paperLight}}>
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 26, background: C.ink}} />
      <div style={{position: 'absolute', left: 50, top: 30, fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: C.inkSoft}}>CINEMA · ADMIT ONE</div>
      <div style={{position: 'absolute', left: 50, top: 66, fontFamily: F.display, fontSize: h * 0.3, lineHeight: 1, color: C.ink}}>TICKET</div>
      <div style={{position: 'absolute', left: 50, bottom: 26, fontFamily: F.mono, fontSize: 20, letterSpacing: 2, color: C.inkSoft}}>ROW F · SEAT 12</div>
      <div style={{position: 'absolute', right: stub, top: 12, bottom: 12, borderLeft: `4px dashed ${C.grey}`}} />
      <div style={{position: 'absolute', right: 0, width: stub, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: F.display, fontSize: h * 0.24, background: hiPrice ? C.yellow : undefined, padding: '0 8px', transform: 'rotate(-90deg)', whiteSpace: 'nowrap'}}>{price}</div>
      </div>
    </div>
  );
};

// Corn kernels scattered on a card.
export const Kernels: React.FC<{w: number; h: number; n?: number; at: number}> = ({w, h, n = 14, at}) => {
  const frame = useCurrentFrame();
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0}}>
      {Array.from({length: n}).map((_, i) => {
        const x = 50 + random('kx' + i) * (w - 100);
        const y = 50 + random('ky' + i) * (h - 100);
        const r = random('kr' + i) * 360;
        const p = Math.min(1, Math.max(0, pop(frame, at + i * 1)));
        return (
          <g key={i} transform={`translate(${x}, ${y}) rotate(${r}) scale(${p})`}>
            <path d="M0,-26 C18,-22 22,6 12,22 C6,30 -6,30 -12,22 C-22,6 -18,-22 0,-26 Z" fill="#E9B830" stroke={C.ink} strokeWidth={3} />
            <path d="M-4,-14 C2,-12 4,-2 2,6" fill="none" stroke="#FFF2B8" strokeWidth={3} strokeLinecap="round" />
            <path d="M-8,16 C-2,22 4,22 8,16" fill="none" stroke="#B57E10" strokeWidth={3} />
          </g>
        );
      })}
    </svg>
  );
};

// One horizontal split bar that grows its segments on cue.
export type Seg = {label: string; sub?: string; frac: number; color: string; ink?: string; at: number; hatch?: boolean};
export const SplitBar: React.FC<{w: number; h: number; segs: Seg[]}> = ({w, h, segs}) => {
  const frame = useCurrentFrame();
  let x = 0;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, border: `4px solid ${C.ink}`, boxSizing: 'border-box', overflow: 'hidden', background: C.paperLight}}>
      {segs.map((s) => {
        const p = ease(stepped(frame), s.at, s.at + 8);
        const sw = w * s.frac;
        const left = x;
        x += sw;
        if (p <= 0) return null;
        return (
          <div key={s.label} style={{position: 'absolute', left, top: 0, bottom: 0, width: sw * p, background: s.color, borderRight: `4px solid ${C.ink}`, overflow: 'hidden', boxSizing: 'border-box',
            backgroundImage: s.hatch ? `repeating-linear-gradient(-45deg, ${C.red}55 0 6px, transparent 6px 16px)` : undefined}}>
            <div style={{position: 'absolute', left: 14, top: 14, fontFamily: F.display, fontSize: 44, color: s.ink ?? C.ink, whiteSpace: 'nowrap', opacity: p >= 1 ? 1 : 0}}>{s.label}</div>
            {s.sub ? <div style={{position: 'absolute', left: 14, bottom: 14, fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: 2, color: s.ink ?? C.inkSoft, whiteSpace: 'nowrap', opacity: p >= 1 ? 1 : 0}}>{s.sub}</div> : null}
          </div>
        );
      })}
    </div>
  );
};

// Water glass drawn in ink.
export const Glass: React.FC<{w: number; h: number; fill: number}> = ({w, h, fill}) => {
  const top = 20, bot = h - 20, lt = w * 0.18, rt = w * 0.82, lb = w * 0.28, rb = w * 0.72;
  const wy = bot - (bot - top - 30) * fill;
  const lx = (y: number) => lt + ((lb - lt) * (y - top)) / (bot - top);
  const rx = (y: number) => rt + ((rb - rt) * (y - top)) / (bot - top);
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0}}>
      <path d={`M${lx(wy)},${wy} Q${w / 2},${wy - 10} ${rx(wy)},${wy} L${rb},${bot} L${lb},${bot} Z`} fill="#C9DCE4" />
      <path d={`M${lt},${top} L${lb},${bot} L${rb},${bot} L${rt},${top}`} fill="none" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
      <ellipse cx={w / 2} cy={top} rx={(rt - lt) / 2} ry={10} fill="none" stroke={C.ink} strokeWidth={4} />
      <path d={`M${lt + 26},${top + 30} L${lb + 18},${bot - 30}`} stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" opacity={0.7} />
    </svg>
  );
};

// Red "no" sign (circle + slash) over a small icon.
export const NoSign: React.FC<{size: number; children: React.ReactNode}> = ({size, children}) => (
  <div style={{position: 'relative', width: size, height: size}}>
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: size * 0.32}}>{children}</div>
    <svg width={size} height={size} style={{position: 'absolute', left: 0, top: 0}}>
      <circle cx={size / 2} cy={size / 2} r={size / 2 - 8} fill="none" stroke={C.red} strokeWidth={12} />
      <line x1={size * 0.2} y1={size * 0.8} x2={size * 0.8} y2={size * 0.2} stroke={C.red} strokeWidth={12} />
    </svg>
  </div>
);
