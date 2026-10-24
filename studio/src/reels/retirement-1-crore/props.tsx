import React from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';
import {Marker} from '../../components/paper';
import {clamp, ease, pop, stepped} from '../../lib/motion';
import {C, F} from '../../theme';

export const grid = (cell = 40, color = 'rgba(70, 110, 150, 0.16)') => ({
  backgroundImage: `linear-gradient(${color} 1.5px, transparent 1.5px), linear-gradient(90deg, ${color} 1.5px, transparent 1.5px)`,
  backgroundSize: `${cell}px ${cell}px`,
});

// 6% inflation for 25 years: price level each year (1 → 4.29).
export const PRICES = Array.from({length: 26}, (_, k) => 1.06 ** k);

// ₹1 crore at 7% while yearly spending starts at ₹25.8 lakh and rises 6%:
// balance at the start of each year until it runs out (~5 years).
export const JAR = (() => {
  const out = [1];
  let c = 1e7, e = 50000 * 12 * 1.06 ** 25;
  for (let y = 0; y < 5; y++) {
    c = Math.max(0, c * 1.07 - e);
    e *= 1.06;
    out.push(c / 1e7);
  }
  return out;
})();

// Visible only inside [at, out) (scene-local frames), with a small pop on entry.
export const Show: React.FC<{at: number; out?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, out, children, style}) => {
  const frame = useCurrentFrame();
  if (stepped(frame) < at || (out !== undefined && stepped(frame) >= out)) return null;
  const p = Math.min(1.05, pop(frame, at));
  return <div style={{position: 'absolute', transform: `scale(${0.85 + 0.15 * p})`, opacity: Math.min(1, p * 1.5), ...style}}>{children}</div>;
};

// Paper bars standing on a baseline; bar i grows in as `p` passes i/n.
export const Stairs: React.FC<{
  id: string; x: number; base: number; values: number[]; unit: number; p: number;
  bw?: number; gap?: number; color?: (i: number) => string;
}> = ({id, x, base, values, unit, p, bw = 26, gap = 6, color = () => C.card}) => {
  const built = Math.max(0, Math.min(1, p)) * values.length;
  return (
    <>
      {values.map((v, i) => {
        const q = Math.max(0, Math.min(1, built - i));
        if (q <= 0) return null;
        const h = v * unit * (0.2 + 0.8 * q);
        return (
          <div key={i} style={{position: 'absolute', left: x + i * (bw + gap), top: base - h, width: bw, height: h, background: color(i),
            border: `2.5px solid ${C.ink}`, boxSizing: 'border-box', transform: `rotate(${(random(id + i) - 0.5) * 1.6}deg)`,
            boxShadow: '3px 4px 0 rgba(30,22,10,0.22)'}} />
        );
      })}
    </>
  );
};

// A stack of banknote strips seen edge-on; `k` (0..1) is how much of the
// full height is left, with the lost part drawn as a dashed outline.
export const NoteStack: React.FC<{x: number; y: number; w: number; h: number; k: number; color?: string}> = ({x, y, w, h, k, color = C.paperLight}) => {
  const n = 22;
  const shown = Math.max(1, Math.round(n * k));
  const sh = h / n;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
      <div style={{position: 'absolute', inset: 0, border: `3px dashed ${C.grey}`, opacity: k < 0.99 ? 1 : 0}} />
      {Array.from({length: shown}).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: (random('ns' + i) - 0.5) * 10, top: h - (i + 1) * sh, width: w, height: sh - 3,
          background: color, border: `2.5px solid ${C.ink}`, boxSizing: 'border-box'}}>
          <div style={{position: 'absolute', left: w * 0.42, top: 2, width: sh - 9, height: sh - 9, borderRadius: '50%', border: `2px solid ${C.inkSoft}`}} />
        </div>
      ))}
    </div>
  );
};

// A paper jar whose fill level is `level` (0..1).
export const Jar: React.FC<{w: number; h: number; level: number; label: string}> = ({w, h, level, label}) => {
  const body = h - 60;
  return (
    <div style={{position: 'relative', width: w, height: h}}>
      <div style={{position: 'absolute', left: w * 0.18, top: 0, width: w * 0.64, height: 34, background: C.ink}} />
      <div style={{position: 'absolute', left: 0, top: 50, width: w, height: body, border: `6px solid ${C.ink}`, borderRadius: '18px 18px 30px 30px', boxSizing: 'border-box', background: 'rgba(255,255,255,0.35)', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${Math.max(0, level) * 100}%`, background: C.yellow, borderTop: level > 0.01 ? `4px solid ${C.ink}` : undefined}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 50 + body * 0.38, textAlign: 'center', fontFamily: F.display, fontSize: 62, lineHeight: 1}}>{label}</div>
    </div>
  );
};

// A hammock between two posts, drawn on in marker.
export const Hammock: React.FC<{x: number; y: number; at: number; out?: number}> = ({x, y, at, out}) => (
  <>
    <Marker id="hm1" d={`M${x},${y} L${x},${y + 150}`} at={at} dur={4} out={out} color={C.ink} width={10} />
    <Marker id="hm2" d={`M${x + 360},${y} L${x + 360},${y + 150}`} at={at + 2} dur={4} out={out} color={C.ink} width={10} />
    <Marker id="hm3" d={`M${x},${y + 20} Q${x + 180},${y + 140} ${x + 360},${y + 20}`} at={at + 4} dur={8} out={out} color={C.ink} width={9} />
    <Marker id="hm4" d={`M${x + 40},${y + 46} Q${x + 180},${y + 150} ${x + 320},${y + 46}`} at={at + 8} dur={8} out={out} color={C.ink} width={6} />
  </>
);

// Hand-drawn tick.
export const Tick: React.FC<{at: number; size?: number}> = ({at, size = 56}) => {
  const frame = useCurrentFrame();
  if (stepped(frame) < at) return <span style={{display: 'inline-block', width: size, height: size}} />;
  const p = ease(stepped(frame), at, at + 6);
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" style={{display: 'inline-block', verticalAlign: 'middle'}}>
      <path d="M8,32 L24,48 L54,10" pathLength={1} fill="none" stroke={C.ink} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - p} />
    </svg>
  );
};

// Linear 0..1 progress between two frames, stepped on twos.
export const prog = (frame: number, a: number, b: number) => interpolate(stepped(frame), [a, b], [0, 1], clamp);
