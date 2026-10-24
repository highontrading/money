import React from 'react';
import {Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {Sfx} from '../../components/paper';
import {boil, clamp, ease, pop, stepped} from '../../lib/motion';
import {C, F} from '../../theme';

export const grid = (cell = 40, color = 'rgba(70, 110, 150, 0.16)') => ({
  backgroundImage: `linear-gradient(${color} 1.5px, transparent 1.5px), linear-gradient(90deg, ${color} 1.5px, transparent 1.5px)`,
  backgroundSize: `${cell}px ${cell}px`,
});

// Pops children in at `at` (stepped overshoot), hides at `out`.
export const Show: React.FC<{at: number; out?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, out, children, style}) => {
  const frame = useCurrentFrame();
  if (stepped(frame) < at || (out !== undefined && stepped(frame) >= out)) return null;
  const p = Math.min(1.05, pop(frame, at));
  return <div style={{position: 'absolute', transform: `scale(${0.85 + 0.15 * p})`, opacity: Math.min(1, p * 1.5), ...style}}>{children}</div>;
};

// Small generic paper banknote (not a real note design).
export const MiniNote: React.FC<{w?: number; h?: number; label?: string; rot?: number; style?: React.CSSProperties}> = ({w = 120, h = 58, label = '₹', rot = 0, style}) => (
  <div style={{width: w, height: h, position: 'relative', transform: `rotate(${rot}deg)`, background: '#E4DDCB', border: `3px solid ${C.inkSoft}`, boxShadow: `2px 4px 5px ${C.shadow}`, overflow: 'hidden', ...style}}>
    <div style={{position: 'absolute', inset: 4, border: `1.5px solid ${C.inkSoft}`}} />
    <div style={{position: 'absolute', right: h * 0.15, top: h * 0.18, width: h * 0.62, height: h * 0.62, borderRadius: '50%', backgroundImage: 'repeating-radial-gradient(circle, transparent 0 3px, rgba(20,20,20,0.35) 3px 4px)'}} />
    <div style={{position: 'absolute', left: h * 0.18, top: h * 0.12, fontFamily: F.display, fontSize: h * 0.6, lineHeight: 1, color: C.ink}}>{label}</div>
  </div>
);

// The big "100 trillion" note, printed on paper: generic, no national emblem.
export const BigNote: React.FC<{w: number; h: number}> = ({w, h}) => (
  <div style={{position: 'absolute', inset: 0, background: '#DCE0CC', overflow: 'hidden'}}>
    <Img src={staticFile('img/proc/tex_paper.jpg')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply', opacity: 0.7}} />
    <div style={{position: 'absolute', inset: h * 0.04, border: `4px solid ${C.inkSoft}`}} />
    <div style={{position: 'absolute', inset: h * 0.07, border: `1.5px solid ${C.inkSoft}`}} />
    <div style={{position: 'absolute', right: w * 0.06, top: h * 0.16, width: h * 0.66, height: h * 0.66, borderRadius: '50%',
      backgroundImage: 'repeating-radial-gradient(circle, transparent 0 8px, rgba(20,20,20,0.32) 8px 9.5px)'}} />
    <div style={{position: 'absolute', left: w * 0.4, top: h * 0.1, width: w * 0.2, height: h * 0.8, backgroundImage: 'repeating-linear-gradient(115deg, rgba(20,20,20,0.16) 0 2px, transparent 2px 9px)'}} />
    <div style={{position: 'absolute', left: w * 0.07, top: h * 0.12, fontFamily: F.display, fontSize: h * 0.36, lineHeight: 1, color: C.ink}}>100</div>
    <div style={{position: 'absolute', left: w * 0.07, top: h * 0.5, fontFamily: F.display, fontSize: h * 0.17, lineHeight: 1, color: C.ink, letterSpacing: 2}}>TRILLION DOLLARS</div>
    <div style={{position: 'absolute', left: w * 0.075, bottom: h * 0.12, fontFamily: F.mono, fontWeight: 700, fontSize: h * 0.06, letterSpacing: 4, color: C.inkSoft}}>AA 0000001 · 2009</div>
    <div style={{position: 'absolute', right: w * 0.075, bottom: h * 0.1, fontFamily: F.display, fontSize: h * 0.16, color: C.ink}}>100T</div>
  </div>
);

// A printing press: dark body, two rollers, notes sliding out to a pile on the right.
export const Press: React.FC<{x: number; y: number; at: number; printAt: number; out?: number; count?: number; scale?: number}> = ({x, y, at, printAt, out, count = 9, scale = 1}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (frame < at || (out !== undefined && frame >= out)) return null;
  const p = Math.min(1.05, pop(frame, at));
  const spin = f >= printAt ? (f - printAt) * 18 : 0;
  const b = boil('press', frame, 1);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 760, height: 360, transform: `translate(${b.x}px, ${b.y}px) scale(${scale * (0.85 + 0.15 * p)})`, transformOrigin: '0 0'}}>
      {[0, 1, 2].map((i) => <Sfx key={i} at={printAt + i * 8} name="tick" volume={0.4} />)}
      {/* body */}
      <div style={{position: 'absolute', left: 0, top: 40, width: 400, height: 300, background: '#2a2826', borderRadius: 10, boxShadow: `6px 10px 12px ${C.shadow}`, overflow: 'hidden'}}>
        <Img src={staticFile('img/proc/tex_kraft.jpg')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply', opacity: 0.5}} />
        <div style={{position: 'absolute', left: 30, top: 24, fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: C.paperLight}}>NOTE PRESS</div>
        {[110, 230].map((cy, i) => (
          <div key={i} style={{position: 'absolute', left: 60 + i * 40, top: cy - 50, width: 100, height: 100, borderRadius: '50%', background: '#8F897D', border: `5px solid ${C.ink}`,
            backgroundImage: 'repeating-conic-gradient(rgba(20,20,20,0.5) 0 12deg, transparent 12deg 45deg)', transform: `rotate(${(i ? -1 : 1) * spin}deg)`}} />
        ))}
        <div style={{position: 'absolute', right: 0, top: 150, width: 40, height: 50, background: C.ink}} />
        <div style={{position: 'absolute', left: 220, top: 210, width: 150, height: 60, background: C.yellow, border: `3px solid ${C.ink}`, fontFamily: F.display, fontSize: 34, textAlign: 'center', lineHeight: '56px'}}>₹ ₹ ₹</div>
      </div>
      {/* lever */}
      <div style={{position: 'absolute', left: 300, top: -10, width: 14, height: 70, background: C.ink, transform: `rotate(${f >= printAt ? -25 : 0}deg)`, transformOrigin: '50% 100%'}} />
      {/* notes flying out to the pile */}
      {Array.from({length: count}).map((_, i) => {
        const t0 = printAt + i * 4;
        if (f < t0) return null;
        const k = ease(f, t0, t0 + 6);
        const px = 430 + (i % 3) * 18, py = 300 - i * 14;
        return (
          <div key={i} style={{position: 'absolute', left: 380 + (px - 380) * k, top: 200 + (py - 200) * k, zIndex: 2}}>
            <MiniNote w={230} h={100} rot={(random('pn' + i) - 0.5) * 14} />
          </div>
        );
      })}
    </div>
  );
};

// Paper villager.
export const Person: React.FC<{s?: number; color?: string}> = ({s = 1, color = C.paperLight}) => (
  <div style={{width: 64 * s, height: 120 * s, position: 'relative'}}>
    <div style={{position: 'absolute', left: 16 * s, top: 0, width: 32 * s, height: 32 * s, borderRadius: '50%', background: color, border: `3px solid ${C.ink}`}} />
    <div style={{position: 'absolute', left: 4 * s, top: 36 * s, width: 56 * s, height: 80 * s, borderRadius: `${26 * s}px ${26 * s}px 6px 6px`, background: color, border: `3px solid ${C.ink}`, boxShadow: `3px 5px 6px ${C.shadow}`}} />
  </div>
);

export const Mango: React.FC<{s?: number}> = ({s = 1}) => (
  <div style={{width: 62 * s, height: 72 * s, position: 'relative'}}>
    <div style={{position: 'absolute', left: 4 * s, top: 12 * s, width: 54 * s, height: 58 * s, borderRadius: '55% 45% 50% 50% / 60% 55% 45% 40%', background: 'radial-gradient(circle at 35% 30%, #FFE27A 0%, #F5C518 60%, #D9A40C 100%)', border: `3px solid ${C.ink}`, boxShadow: `3px 4px 5px ${C.shadow}`}} />
    <div style={{position: 'absolute', left: 30 * s, top: 0, width: 22 * s, height: 12 * s, borderRadius: '0 100% 0 100%', background: C.inkSoft, transform: 'rotate(-20deg)'}} />
  </div>
);

export const House: React.FC<{s?: number}> = ({s = 1}) => (
  <svg width={140 * s} height={130 * s} viewBox="0 0 140 130" style={{overflow: 'visible', filter: `drop-shadow(3px 5px 5px ${C.shadow})`}}>
    <polygon points="10,58 70,10 130,58" fill={C.ink} />
    <rect x={22} y={56} width={96} height={68} fill={C.paperLight} stroke={C.ink} strokeWidth={4} />
    <rect x={58} y={84} width={24} height={40} fill={C.yellow} stroke={C.ink} strokeWidth={3} />
    <rect x={32} y={70} width={18} height={16} fill="none" stroke={C.ink} strokeWidth={3} />
    <rect x={90} y={70} width={18} height={16} fill="none" stroke={C.ink} strokeWidth={3} />
  </svg>
);

// Hanging price tag.
export const PriceTag: React.FC<{children: React.ReactNode; w?: number; h?: number; bg?: string; rot?: number}> = ({children, w = 300, h = 150, bg = C.paperLight, rot = 4}) => (
  <div style={{width: w, height: h, position: 'relative', transform: `rotate(${rot}deg)`, filter: `drop-shadow(4px 7px 8px ${C.shadow})`}}>
    <div style={{position: 'absolute', inset: 0, background: bg, clipPath: `polygon(0 50%, ${h * 0.4}px 0, 100% 0, 100% 100%, ${h * 0.4}px 100%)`}} />
    <div style={{position: 'absolute', left: h * 0.18, top: h / 2 - 10, width: 20, height: 20, borderRadius: '50%', background: C.paper, border: `3px solid ${C.ink}`}} />
    <div style={{position: 'absolute', left: h * 0.5, right: 10, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
  </div>
);

// Balance scale; `tilt` in degrees (+ = right pan down).
export const Scale: React.FC<{x: number; y: number; tilt: number; left: React.ReactNode; right: React.ReactNode; leftLabel: string; rightLabel: string}> = ({x, y, tilt, left, right, leftLabel, rightLabel}) => {
  const L = 330;
  const rad = (tilt * Math.PI) / 180;
  const lx = -L * Math.cos(rad), ly = -L * Math.sin(rad);
  const rx = L * Math.cos(rad), ry = L * Math.sin(rad);
  const pan = (px: number, py: number, content: React.ReactNode, label: string) => (
    <div style={{position: 'absolute', left: px - 140, top: py, width: 280}}>
      <svg width={280} height={120} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <line x1={140} y1={0} x2={30} y2={110} stroke={C.ink} strokeWidth={3} />
        <line x1={140} y1={0} x2={250} y2={110} stroke={C.ink} strokeWidth={3} />
        <path d="M10,110 Q140,170 270,110 Z" fill={C.paperLight} stroke={C.ink} strokeWidth={4} />
      </svg>
      <div style={{position: 'absolute', left: 0, width: 280, top: -10, height: 120, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 6, flexWrap: 'wrap-reverse'}}>{content}</div>
      <div style={{position: 'absolute', left: 0, width: 280, top: 158, textAlign: 'center'}}>
        <span style={{background: C.ink, color: C.paperLight, fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, padding: '6px 12px'}}>{label}</span>
      </div>
    </div>
  );
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 0, height: 0}}>
      <div style={{position: 'absolute', left: -12, top: 0, width: 24, height: 330, background: C.ink}} />
      <div style={{position: 'absolute', left: -110, top: 320, width: 220, height: 26, background: C.ink, borderRadius: 6}} />
      <div style={{position: 'absolute', left: -L - 10, top: -9, width: 2 * L + 20, height: 18, background: C.ink, borderRadius: 9, transform: `rotate(${tilt}deg)`, transformOrigin: '50% 50%'}} />
      <div style={{position: 'absolute', left: -16, top: -16, width: 32, height: 32, borderRadius: '50%', background: C.yellow, border: `4px solid ${C.ink}`}} />
      {pan(lx, ly, left, leftLabel)}
      {pan(rx, ry, right, rightLabel)}
    </div>
  );
};

export const prog = (frame: number, a: number, b: number) => interpolate(stepped(frame), [a, b], [0, 1], clamp);
export const wobble = (seed: string, frame: number) => boil(seed, frame, 1);
