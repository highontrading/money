import React from 'react';
import {random, useCurrentFrame} from 'remotion';
import {Sfx} from '../../components/paper';
import {boil, ease, pop, stepped} from '../../lib/motion';
import {C, F} from '../../theme';

export const Center: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', ...style}}>{children}</div>
);

// Show children only inside [from, until) (scene-local frames).
export const Hide: React.FC<{from?: number; until?: number; children: React.ReactNode}> = ({from = 0, until, children}) => {
  const frame = useCurrentFrame();
  if (frame < from || (until !== undefined && frame >= until)) return null;
  return <>{children}</>;
};

// Text that pops in on its beat.
export const Pop: React.FC<{x: number; y: number; at: number; out?: number; size?: number; color?: string; font?: string; w?: number; align?: 'left' | 'center'; rot?: number; children: React.ReactNode}> = ({x, y, at, out, size = 64, color = C.ink, font = F.display, w, align = 'left', rot = 0, children}) => {
  const frame = useCurrentFrame();
  if (stepped(frame) < at || (out !== undefined && frame >= out)) return null;
  const p = Math.min(1.05, pop(frame, at));
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, textAlign: align, fontFamily: font, fontWeight: 700, fontSize: size, lineHeight: 1, color, whiteSpace: 'nowrap', transform: `translateY(${(1 - p) * -24}px) scale(${0.9 + 0.1 * p}) rotate(${rot}deg)`, zIndex: 66}}>
      {children}
    </div>
  );
};

// A paper phone: ink body, light screen. Children are laid out inside the screen.
export const Phone: React.FC<{w: number; h: number; children?: React.ReactNode}> = ({w, h, children}) => (
  <div style={{position: 'absolute', inset: 0, background: C.ink, borderRadius: 46, padding: 18, boxSizing: 'border-box'}}>
    <div style={{position: 'absolute', left: w / 2 - 50, top: 26, width: 100, height: 14, borderRadius: 7, background: '#2b2a28', zIndex: 2}} />
    <div style={{position: 'relative', width: w - 36, height: h - 36, background: C.paperLight, borderRadius: 30, overflow: 'hidden'}}>{children}</div>
  </div>
);

// A flood of tiny payment slips popping in, scattered inside a box.
export const Flood: React.FC<{x: number; y: number; w: number; h: number; at: number; out?: number; n?: number; span?: number; seed: string}> = ({x, y, w, h, at, out, n = 42, span = 34, seed}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at || (out !== undefined && f >= out)) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, zIndex: 30}}>
      <Sfx at={at} name="slide" volume={0.3} />
      {Array.from({length: n}).map((_, i) => {
        const t0 = at + Math.floor(random(seed + 't' + i) * span);
        if (f < t0) return null;
        const p = Math.min(1.05, pop(frame, t0, 12, 0.45));
        const sx = random(seed + 'x' + i) * (w - 150), sy = random(seed + 'y' + i) * (h - 80);
        const r = (random(seed + 'r' + i) - 0.5) * 24;
        const amt = [99, 250, 40, 1200, 75, 500, 30, 180][i % 8];
        return (
          <div key={i} style={{position: 'absolute', left: sx, top: sy, width: 150, height: 78, background: i % 5 === 0 ? C.yellow : C.card, border: `3px solid ${C.ink}`, transform: `rotate(${r}deg) scale(${p})`, boxShadow: `3px 5px 6px ${C.shadow}`, fontFamily: F.mono, fontWeight: 700}}>
            <div style={{fontSize: 14, letterSpacing: 2, padding: '6px 8px 0', color: C.inkSoft}}>UPI · PAID</div>
            <div style={{fontSize: 30, padding: '2px 8px', color: C.ink}}>₹{amt} ✓</div>
          </div>
        );
      })}
    </div>
  );
};

// The app as a house: roof, walls, four rooms (outlines only) and a front door labelled UPI.
export const HOUSE = {x: 120, y: 420, w: 840, h: 770, roof: 170};
export const ROOMS = [
  {x: 160, y: 625, w: 370, h: 205},
  {x: 550, y: 625, w: 370, h: 205},
  {x: 160, y: 845, w: 370, h: 205},
  {x: 550, y: 845, w: 370, h: 205},
];
export const DOOR = {x: 445, y: 1065, w: 190, h: 125};

export const House: React.FC<{at: number; out?: number; doorAt?: number; seed: string}> = ({at, out, doorAt, seed}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at || (out !== undefined && f >= out)) return null;
  const p = Math.min(1.05, pop(frame, at, 12, 0.6));
  const b = boil(seed, frame, 0.8);
  const {x, y, w, h, roof} = HOUSE;
  const dl = doorAt !== undefined ? ease(f, doorAt, doorAt + 8) : 0;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `translate(${b.x}px, ${b.y + (1 - p) * 60}px)`, opacity: Math.min(1, p * 1.4), zIndex: 10, pointerEvents: 'none'}}>
      <Sfx at={at} name="drop" volume={0.32} />
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', filter: `drop-shadow(6px 10px 10px ${C.shadow})`}}>
        <path d={`M${x - 10},${y + roof} L${x + w / 2},${y} L${x + w + 10},${y + roof} Z`} fill={C.ink} />
        <rect x={x + 10} y={y + roof} width={w - 20} height={h - roof} fill={C.paperLight} stroke={C.ink} strokeWidth={6} />
        {ROOMS.map((r, i) => (
          <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill="none" stroke={C.grey} strokeWidth={3} strokeDasharray="10 8" />
        ))}
        <rect x={DOOR.x} y={DOOR.y} width={DOOR.w} height={DOOR.h} fill={dl > 0 ? C.yellow : C.card} stroke={C.ink} strokeWidth={6} />
        <circle cx={DOOR.x + DOOR.w - 26} cy={DOOR.y + DOOR.h / 2 + 10} r={7} fill={C.ink} />
      </svg>
      <div style={{position: 'absolute', left: x, width: w, top: y + 72, textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 6, color: C.paperLight}}>PAYMENT APP</div>
      <div style={{position: 'absolute', left: DOOR.x, width: DOOR.w, top: DOOR.y + 22, textAlign: 'center', fontFamily: F.display, fontSize: 64, lineHeight: 1, color: C.ink}}>UPI</div>
    </div>
  );
};

// One room lighting up with its revenue stream.
export const Room: React.FC<{i: number; at: number; n: string; title: string; children?: React.ReactNode}> = ({i, at, n, title, children}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at) return null;
  const r = ROOMS[i];
  const k = ease(f, at, at + 6);
  const p = Math.min(1.05, pop(frame, at));
  return (
    <div style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, zIndex: 20}}>
      <Sfx at={at} name="pop" volume={0.3} />
      <div style={{position: 'absolute', inset: 0, background: C.yellow, opacity: 0.92 * k, border: `4px solid ${C.ink}`}} />
      <div style={{position: 'absolute', left: 18, top: 14, fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, color: C.inkSoft}}>{n}</div>
      <div style={{position: 'absolute', left: 18, top: 42, fontFamily: F.display, fontSize: 50, lineHeight: 1, whiteSpace: 'nowrap', transform: `scale(${0.9 + 0.1 * p})`, transformOrigin: 'left top'}}>{title}</div>
      {children}
    </div>
  );
};

// A countertop soundbox: rounded box with a speaker grille.
export const Soundbox: React.FC<{size?: number}> = ({size = 110}) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 100 115">
    <rect x={8} y={6} width={84} height={103} rx={18} fill={C.ink} />
    {Array.from({length: 4}).map((_, r) =>
      Array.from({length: 4}).map((__, c) => <circle key={`${r}-${c}`} cx={29 + c * 14} cy={30 + r * 14} r={4} fill={C.grey} />),
    )}
    <rect x={30} y={92} width={40} height={6} rx={3} fill={C.yellow} />
  </svg>
);

// A scratch card whose silver foil is wiped off left-to-right from `at`.
export const Scratch: React.FC<{w: number; h: number; at: number; children: React.ReactNode}> = ({w, h, at, children}) => {
  const frame = useCurrentFrame();
  const k = ease(stepped(frame), at, at + 10);
  return (
    <div style={{position: 'relative', width: w, height: h, background: C.paperLight, border: `3px solid ${C.ink}`, overflow: 'hidden'}}>
      <Center>{children}</Center>
      <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, #b9b5ad 0 6px, #a29e96 6px 12px)', clipPath: `inset(0 0 0 ${k * 100}%)`}} />
      {k < 1 ? <div style={{position: 'absolute', left: 0, right: 0, top: h / 2 - 12, textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 18, letterSpacing: 2, color: C.ink, clipPath: `inset(0 0 0 ${k * 100}%)`}}>SCRATCH KARO</div> : null}
    </div>
  );
};

// Magnifying glass over fine print: circle lens with a handle; children are the magnified text.
export const Magnifier: React.FC<{cx: number; cy: number; r: number; at: number; out?: number; children: React.ReactNode}> = ({cx, cy, r, at, out, children}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at || (out !== undefined && f >= out)) return null;
  const p = Math.min(1.05, pop(frame, at));
  return (
    <div style={{position: 'absolute', left: cx - r, top: cy - r, width: r * 2, height: r * 2, transform: `scale(${p}) rotate(-6deg)`, zIndex: 70}}>
      <Sfx at={at} name="pop" volume={0.3} />
      <svg width={r * 3.2} height={r * 3.2} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', filter: `drop-shadow(6px 10px 9px ${C.shadow})`}}>
        <line x1={r * 1.7} y1={r * 1.7} x2={r * 2.6} y2={r * 2.6} stroke={C.ink} strokeWidth={r * 0.22} strokeLinecap="round" />
      </svg>
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: C.paperLight, border: `${r * 0.09}px solid ${C.ink}`, boxShadow: `6px 10px 12px ${C.shadow}`, overflow: 'hidden'}}>
        <Center>{children}</Center>
      </div>
    </div>
  );
};

// Grey "text" lines for fine print.
export const Lines: React.FC<{n: number; w?: number; gap?: number; seed: string; h?: number}> = ({n, w = 100, gap = 22, seed, h = 9}) => (
  <div>
    {Array.from({length: n}).map((_, i) => (
      <div key={i} style={{height: h, marginBottom: gap - h, width: `${w * (0.7 + random(seed + i) * 0.3)}%`, background: 'rgba(20,20,20,0.22)'}} />
    ))}
  </div>
);

export const Tick: React.FC<{size?: number; color?: string}> = ({size = 56, color = C.ink}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{display: 'inline-block', verticalAlign: 'middle'}}>
    <path d="M6,21 L16,31 L35,8" fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
