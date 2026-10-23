import React from 'react';
import {Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {Sfx} from '../../components/paper';
import {boil, clamp, ease, stepped} from '../../lib/motion';
import {C, F} from '../../theme';

export const grid = (cell = 40, color = 'rgba(70, 110, 150, 0.16)') => ({
  backgroundImage: `linear-gradient(${color} 1.5px, transparent 1.5px), linear-gradient(90deg, ${color} 1.5px, transparent 1.5px)`,
  backgroundSize: `${cell}px ${cell}px`,
});

// The face of a ₹100 note, printed on paper (not a real note design).
export const NoteFace: React.FC<{w: number; h: number}> = ({w, h}) => (
  <div style={{position: 'absolute', inset: 0, background: '#E4DDCB', overflow: 'hidden'}}>
    <Img src={staticFile('img/proc/tex_paper.jpg')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply', opacity: 0.7}} />
    <div style={{position: 'absolute', inset: h * 0.045, border: `3px solid ${C.inkSoft}`}} />
    <div style={{position: 'absolute', inset: h * 0.075, border: `1.5px solid ${C.inkSoft}`}} />
    {/* guilloche rosette */}
    <div style={{position: 'absolute', right: w * 0.08, top: h * 0.2, width: h * 0.6, height: h * 0.6, borderRadius: '50%',
      backgroundImage: `repeating-radial-gradient(circle, transparent 0 7px, rgba(20,20,20,0.35) 7px 8.5px)`, opacity: 0.8}} />
    <div style={{position: 'absolute', right: w * 0.08 + h * 0.2, top: h * 0.4, width: h * 0.2, height: h * 0.2, borderRadius: '50%', background: '#E4DDCB', border: `3px solid ${C.ink}`, fontFamily: F.display, fontSize: h * 0.13, textAlign: 'center', lineHeight: `${h * 0.19}px`}}>₹</div>
    {/* wavy security lines across the middle */}
    <div style={{position: 'absolute', left: w * 0.36, top: h * 0.12, width: w * 0.26, height: h * 0.76,
      backgroundImage: 'repeating-linear-gradient(115deg, rgba(20,20,20,0.18) 0 2px, transparent 2px 9px)'}} />
    <div style={{position: 'absolute', left: w * 0.075, top: h * 0.14, fontFamily: F.display, fontSize: h * 0.42, lineHeight: 1, color: C.ink, letterSpacing: 2}}>₹100</div>
    <div style={{position: 'absolute', left: w * 0.08, top: h * 0.62, fontFamily: F.mono, fontWeight: 700, fontSize: h * 0.06, letterSpacing: 4, color: C.inkSoft}}>ONE HUNDRED RUPEES</div>
    <div style={{position: 'absolute', left: w * 0.08, bottom: h * 0.13, fontFamily: F.mono, fontWeight: 500, fontSize: h * 0.065, letterSpacing: 5, color: C.ink}}>4MT 100100</div>
    <div style={{position: 'absolute', right: w * 0.08, bottom: h * 0.12, fontFamily: F.display, fontSize: h * 0.16, color: C.ink}}>100</div>
  </div>
);

// Clip for the slice [f0, f1] of the note's width; scissor-cut edges get a small wobble.
const sliceClip = (seed: string, f0: number, f1: number) => {
  const pts: string[] = [];
  const n = 18;
  const wob = (k: string) => ((random(seed + k) - 0.5) * 0.6).toFixed(2);
  pts.push(`${f0 * 100}% 0%`, `${f1 * 100}% 0%`);
  for (let i = 1; i < n; i++) pts.push(`${f1 < 1 ? f1 * 100 + +wob('r' + i) : 100}% ${(i / n) * 100}%`);
  pts.push(`${f1 * 100}% 100%`, `${f0 * 100}% 100%`);
  for (let i = n - 1; i > 0; i--) pts.push(`${f0 > 0 ? f0 * 100 + +wob('l' + i) : 0}% ${(i / n) * 100}%`);
  return `polygon(${pts.join(',')})`;
};

// A slice of the note lying on the desk. `from` offsets animate it in, `to` animates it away.
export const NotePiece: React.FC<{
  id: string; x: number; y: number; w: number; h: number; f0?: number; f1?: number;
  at: number; out?: number; rot?: number;
  from?: {x: number; y: number; r?: number}; inDur?: number;
  leave?: {at: number; x: number; y: number; r?: number; fade?: boolean};
  sfx?: string | null;
}> = ({id, x, y, w, h, f0 = 0, f1 = 1, at, out, rot = 0, from, inDur = 10, leave, sfx = 'slide'}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (frame < at || (out !== undefined && frame >= out)) return null;
  const p = from ? ease(f, at, at + inDur) : 1;
  let dx = from ? from.x * (1 - p) : 0, dy = from ? from.y * (1 - p) : 0, dr = from ? (from.r ?? 0) * (1 - p) : 0, o = 1;
  if (leave && f >= leave.at) {
    const k = ease(f, leave.at, leave.at + 12);
    dx += leave.x * k; dy += leave.y * k; dr += (leave.r ?? 0) * k;
    if (leave.fade) o = 1 - k;
  }
  const b = boil(id, frame, 1);
  return (
    <>
      {sfx && from ? <Sfx at={at} name={sfx} volume={0.22} /> : null}
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: o,
        transform: `translate(${dx + b.x}px, ${dy + b.y}px) rotate(${rot + dr + b.r}deg)`,
        filter: `drop-shadow(0 1px 0.5px rgba(0,0,0,0.3)) drop-shadow(5px 9px 10px ${C.shadow})`}}>
        <div style={{position: 'absolute', inset: 0, clipPath: sliceClip(id, f0, f1)}}>
          <NoteFace w={w} h={h} />
        </div>
      </div>
    </>
  );
};

// Dashed outline where a piece of the note used to be.
export const Ghost: React.FC<{x: number; y: number; w: number; h: number; at: number; out?: number; label?: string}> = ({x, y, w, h, at, out, label}) => {
  const frame = useCurrentFrame();
  if (frame < at || (out !== undefined && frame >= out)) return null;
  const o = ease(stepped(frame), at, at + 6);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, border: `5px dashed ${C.inkSoft}`, opacity: 0.75 * o, zIndex: 5,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.hand, fontWeight: 700, fontSize: 60, color: C.inkSoft}}>
      {label}
    </div>
  );
};

// Scissors travelling down a cut line from (x, y0) to (x, y1) between `at` and `at + dur`.
export const Scissors: React.FC<{x: number; y0: number; y1: number; at: number; dur?: number; out?: number}> = ({x, y0, y1, at, dur = 18, out}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (frame < at || (out !== undefined && frame >= out)) return null;
  const p = ease(f, at, at + dur);
  const y = y0 + (y1 - y0) * p;
  const open = p < 1 ? 10 + 12 * Math.abs(Math.sin(f / 2)) : 6;
  const cutLen = (y - y0);
  const blade = (s: number) => (
    <g transform={`rotate(${s * open})`}>
      <path d="M0,0 L-9,-6 L-4,-150 L4,-150 Z" fill="#cfcac0" stroke={C.ink} strokeWidth={3} transform={`translate(${s * 4},0)`} />
      <ellipse cx={-s * 26} cy={70} rx={30} ry={42} fill="none" stroke={C.ink} strokeWidth={14} />
      <line x1={0} y1={0} x2={-s * 18} y2={34} stroke={C.ink} strokeWidth={14} />
    </g>
  );
  return (
    <>
      {[0, 6, 12].map((d) => <Sfx key={d} at={at + d} name="tick" volume={0.5} />)}
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, zIndex: 75, pointerEvents: 'none'}}>
        <line x1={x} y1={y0} x2={x} y2={y0 + cutLen} stroke={C.ink} strokeWidth={3} strokeDasharray="14 9" opacity={0.8} />
        <g transform={`translate(${x}, ${y - 150}) rotate(180)`} style={{filter: `drop-shadow(6px 10px 8px ${C.shadow})`}}>
          {blade(1)}
          {blade(-1)}
          <circle r={7} fill={C.ink} />
        </g>
      </svg>
    </>
  );
};

// A paper strip that grows from a baseline (up or down) between `at` and `at + dur`.
export const Bar: React.FC<{id: string; x: number; base: number; w: number; h: number; from?: number; at: number; dur?: number; out?: number; dir?: 'up' | 'down'; color?: string; children?: React.ReactNode; sfx?: string | null}> = ({id, x, base, w, h, from = 0, at, dur = 10, out, dir = 'up', color = C.yellow, children, sfx = 'tick'}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (frame < at || (out !== undefined && frame >= out)) return null;
  const hh = interpolate(f, [at, at + dur], [from, h], clamp);
  const b = boil(id, frame, 0.8);
  return (
    <>
      {sfx ? <Sfx at={at} name={sfx} volume={0.35} /> : null}
      <div style={{position: 'absolute', left: x, width: w, height: Math.max(hh, 3), top: dir === 'up' ? base - hh : base, background: color, border: `4px solid ${C.ink}`, boxSizing: 'border-box',
        transform: `translate(${b.x}px, ${b.y}px)`, boxShadow: `5px 8px 10px ${C.shadow}`, zIndex: 15}}>
        <Img src={staticFile('img/proc/tex_paper.jpg')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply', opacity: 0.5}} />
        {children}
      </div>
    </>
  );
};

// Text that pops in at `at` (stepped scale settle).
export const Pop: React.FC<{x: number; y: number; at: number; out?: number; size?: number; color?: string; font?: string; w?: number; align?: 'left' | 'center'; children: React.ReactNode}> = ({x, y, at, out, size = 64, color = C.ink, font = F.display, w, align = 'left', children}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at || (out !== undefined && f >= out)) return null;
  const s = interpolate(f - at, [0, 2, 4], [1.5, 0.95, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, textAlign: align, fontFamily: font, fontWeight: 700, fontSize: size, color, lineHeight: 1, transform: `scale(${s})`, transformOrigin: align === 'center' ? '50% 50%' : '0 50%', zIndex: 40, whiteSpace: 'nowrap'}}>
      {children}
    </div>
  );
};

export const Egg: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 54 * s, height: 70 * s, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
    background: 'radial-gradient(circle at 35% 30%, #FFFDF6 0%, #EDE4D0 70%, #CDBF9F 100%)', border: `3px solid ${C.ink}`, boxShadow: `3px 5px 6px ${C.shadow}`}} />
);

// Weave pattern for kraft baskets.
export const weave = {
  backgroundImage: 'repeating-linear-gradient(0deg, rgba(60,35,10,0.35) 0 3px, transparent 3px 22px), repeating-linear-gradient(90deg, rgba(60,35,10,0.25) 0 3px, transparent 3px 26px)',
};
