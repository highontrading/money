import React from 'react';
import {random, useCurrentFrame} from 'remotion';
import {Sfx} from '../../components/paper';
import {ease, pop, stepped} from '../../lib/motion';
import {C, F} from '../../theme';

export const grid = (cell = 40, color = 'rgba(70, 110, 150, 0.16)') => ({
  backgroundImage: `linear-gradient(${color} 1.5px, transparent 1.5px), linear-gradient(90deg, ${color} 1.5px, transparent 1.5px)`,
  backgroundSize: `${cell}px ${cell}px`,
});

// Yearly SIP amounts (₹/month) for a flat SIP and a 10%-a-year step-up.
export const YEARS = 20;
export const flat = Array.from({length: YEARS}, () => 10000);
export const stepUp = Array.from({length: YEARS}, (_, k) => 10000 * 1.1 ** k);

// A staircase of paper strips: one strip per year, height ∝ value, built left to
// right as `p` goes 0..1. Coordinates are relative to the parent (e.g. a Card).
export const Stairs: React.FC<{
  id: string; x: number; base: number; values: number[]; unit: number; p: number;
  bw?: number; gap?: number; color?: (i: number) => string; outline?: boolean;
}> = ({id, x, base, values, unit, p, bw = 30, gap = 8, color = () => C.card, outline = true}) => {
  const n = values.length;
  const built = Math.max(0, Math.min(1, p)) * n;
  return (
    <>
      {values.map((v, i) => {
        const q = Math.max(0, Math.min(1, built - i));
        if (q <= 0) return null;
        const h = v * unit * (0.2 + 0.8 * q);
        const r = random(id + i);
        return (
          <div key={i} style={{position: 'absolute', left: x + i * (bw + gap), top: base - h, width: bw, height: h, background: color(i),
            border: outline ? `2.5px solid ${C.ink}` : undefined, boxSizing: 'border-box', transform: `rotate(${(r - 0.5) * 1.6}deg)`,
            boxShadow: `3px 4px 0 rgba(30,22,10,0.22)`}} />
        );
      })}
    </>
  );
};

// Words that drop in one by one, each on its own cue frame.
export const PopWords: React.FC<{items: {t: string; at: number; hi?: boolean}[]; size?: number; style?: React.CSSProperties}> = ({items, size = 140, style}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{fontFamily: F.display, fontSize: size, lineHeight: 0.95, textTransform: 'uppercase', ...style}}>
      {items.map((w, i) => {
        if (stepped(frame) < w.at) return <span key={i} style={{opacity: 0, marginRight: '0.2em'}}>{w.t}</span>;
        const p = Math.min(1.05, pop(frame, w.at, 12, 0.5));
        return (
          <span key={i} style={{display: 'inline-block', marginRight: '0.2em', transform: `translateY(${(1 - p) * -40}px) scale(${0.85 + 0.15 * p})`,
            background: w.hi ? C.yellow : undefined, padding: w.hi ? '0 0.08em' : undefined}}>{w.t}</span>
        );
      })}
    </div>
  );
};

// Show children only inside [from, until) (scene-local frames).
export const Show: React.FC<{from?: number; until?: number; children: React.ReactNode}> = ({from = 0, until, children}) => {
  const frame = useCurrentFrame();
  if (frame < from || (until !== undefined && frame >= until)) return null;
  return <>{children}</>;
};

// An on/off switch drawn in ink; flips at `on`.
export const Toggle: React.FC<{on: number; w?: number}> = ({on, w = 130}) => {
  const frame = useCurrentFrame();
  const k = ease(stepped(frame), on, on + 6);
  const h = w * 0.5;
  return (
    <>
      <Sfx at={on} name="tick" volume={0.4} />
      <div style={{position: 'relative', width: w, height: h, borderRadius: h, border: `4px solid ${C.ink}`, background: k > 0.5 ? C.yellow : C.paperLight, boxSizing: 'border-box'}}>
        <div style={{position: 'absolute', top: 4, left: 4 + k * (w - h), width: h - 16, height: h - 16, borderRadius: '50%', background: C.ink}} />
      </div>
    </>
  );
};

// Hand-drawn tick that writes itself on.
export const Tick: React.FC<{at: number; size?: number; color?: string}> = ({at, size = 60, color = C.ink}) => {
  const frame = useCurrentFrame();
  if (stepped(frame) < at) return <span style={{display: 'inline-block', width: size, height: size}} />;
  const p = ease(stepped(frame), at, at + 6);
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" style={{display: 'inline-block', verticalAlign: 'middle'}}>
      <path d="M8,32 L24,48 L54,10" pathLength={1} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - p} />
    </svg>
  );
};
