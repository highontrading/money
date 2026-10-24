import React from 'react';
import {random, useCurrentFrame} from 'remotion';
import {Marker} from '../../components/paper';
import {boil, ease, pop, stepped} from '../../lib/motion';
import {C, F} from '../../theme';

export const grid = (cell = 40, color = 'rgba(70, 110, 150, 0.16)') => ({
  backgroundImage: `linear-gradient(${color} 1.5px, transparent 1.5px), linear-gradient(90deg, ${color} 1.5px, transparent 1.5px)`,
  backgroundSize: `${cell}px ${cell}px`,
});

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

// Typewriter text: characters appear at `cps` per frame (stepped).
export const Typed: React.FC<{text: string; at: number; cps?: number}> = ({text, at, cps = 1.6}) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((stepped(frame) - at) * cps)));
  return (
    <>
      {text.slice(0, n)}
      <span style={{opacity: 0}}>{text.slice(n)}</span>
    </>
  );
};

// Generic paper bank facade drawn to fill w×h.
export const BankFacade: React.FC<{w: number; h: number; fill?: string; label?: string}> = ({w, h, fill = C.paperLight, label = 'BANK'}) => {
  const ped = h * 0.2, band = h * 0.13, steps = h * 0.14, colTop = ped + band, colH = h - colTop - steps;
  const n = 4, cw = w * 0.09, gap = (w * 0.84 - n * cw) / (n - 1);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <path d={`M${w * 0.04},${ped} L${w / 2},${h * 0.02} L${w * 0.96},${ped} Z`} fill={fill} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
      <rect x={w * 0.05} y={ped} width={w * 0.9} height={band} fill={C.ink} />
      <text x={w / 2} y={ped + band * 0.78} textAnchor="middle" fontFamily="Anton" fontSize={band * 0.72} letterSpacing={4} fill={C.paperLight}>{label}</text>
      {Array.from({length: n}).map((_, i) => (
        <rect key={i} x={w * 0.08 + i * (cw + gap)} y={colTop} width={cw} height={colH} fill={fill} stroke={C.ink} strokeWidth={4} />
      ))}
      <rect x={w * 0.03} y={h - steps} width={w * 0.94} height={steps * 0.5} fill={fill} stroke={C.ink} strokeWidth={4} />
      <rect x={0} y={h - steps * 0.5} width={w} height={steps * 0.5} fill={fill} stroke={C.ink} strokeWidth={4} />
    </svg>
  );
};

// Bank building that pops in on its beat.
export const Bank: React.FC<{x: number; y: number; w: number; h: number; at: number; out?: number; label?: string; fill?: string; seed: string}> = ({x, y, w, h, at, out, label, fill, seed}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at || (out !== undefined && f >= out)) return null;
  const p = Math.min(1.05, pop(frame, at));
  const b = boil(seed, frame, 1);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, zIndex: 20, transformOrigin: '50% 100%',
      transform: `translate(${b.x}px, ${b.y + (1 - p) * -40}px) rotate(${b.r}deg) scale(${0.9 + 0.1 * p})`,
      filter: `drop-shadow(5px 9px 9px ${C.shadow})`}}>
      <BankFacade w={w} h={h} label={label} fill={fill} />
    </div>
  );
};

// Jagged index line between two points (absolute frame coords), seeded so it's stable.
export const risePath = (seed: string, x0: number, y0: number, x1: number, y1: number, n = 14) => {
  let d = `M${x0},${y0}`;
  for (let i = 1; i <= n; i++) {
    const t = i / n;
    const x = x0 + (x1 - x0) * t;
    // accelerating rally: slow start, steep end
    const curve = Math.pow(t, 1.8);
    const jit = i === n ? 0 : (random(`${seed}${i}`) - 0.5) * 46;
    d += ` L${x.toFixed(1)},${(y0 + (y1 - y0) * curve + jit).toFixed(1)}`;
  }
  return d;
};

export const crashPath = (seed: string, x0: number, y0: number, x1: number, y1: number, n = 6) => {
  let d = `M${x0},${y0}`;
  for (let i = 1; i <= n; i++) {
    const t = i / n;
    const jit = i === n ? 0 : (random(`${seed}${i}`) - 0.5) * 34;
    d += ` L${(x0 + (x1 - x0) * t).toFixed(1)},${(y0 + (y1 - y0) * Math.sqrt(t) + jit).toFixed(1)}`;
  }
  return d;
};

// Straight hand-drawn arrow (line + head) via Marker.
export const Arrow: React.FC<{id: string; x1: number; y1: number; x2: number; y2: number; at: number; out?: number; color?: string; width?: number; dur?: number}> = ({id, x1, y1, x2, y2, at, out, color = C.ink, width = 9, dur = 8}) => {
  const a = Math.atan2(y2 - y1, x2 - x1), L = 34;
  const h1 = `${x2 - L * Math.cos(a - 0.5)},${y2 - L * Math.sin(a - 0.5)}`;
  const h2 = `${x2 - L * Math.cos(a + 0.5)},${y2 - L * Math.sin(a + 0.5)}`;
  return (
    <>
      <Marker id={id} d={`M${x1},${y1} L${x2},${y2}`} at={at} dur={dur} out={out} color={color} width={width} />
      <Marker id={id + 'h'} d={`M${h1} L${x2},${y2} L${h2}`} at={at + dur} dur={3} out={out} color={color} width={width} />
    </>
  );
};

// A generic paper "investor" peg figure (no faces, not anyone real).
export const Peg: React.FC<{x: number; y: number; s?: number; color?: string}> = ({x, y, s = 1, color = C.ink}) => (
  <svg width={40 * s} height={86 * s} viewBox="0 0 40 86" style={{position: 'absolute', left: x - 20 * s, top: y - 86 * s, overflow: 'visible', filter: `drop-shadow(2px 4px 3px ${C.shadow})`}}>
    <circle cx={20} cy={13} r={11} fill={color} />
    <path d="M6,86 L6,40 Q6,28 20,28 Q34,28 34,40 L34,86 Z" fill={color} />
  </svg>
);

// Falling group of pegs: stand still, then drop with a slight tumble after `fallAt`.
export const Crowd: React.FC<{pts: [number, number][]; at: number; fallAt?: number; out?: number; seed: string}> = ({pts, at, fallAt, out, seed}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at || (out !== undefined && f >= out)) return null;
  return (
    <div style={{position: 'absolute', inset: 0, zIndex: 72, pointerEvents: 'none'}}>
      {pts.map(([x, y], i) => {
        const p = Math.min(1.05, pop(frame, at + i * 3));
        if (f < at + i * 3) return null;
        const k = fallAt !== undefined ? ease(f, fallAt + i * 2, fallAt + i * 2 + 14) : 0;
        const r = (random(seed + i) - 0.5) * 70 * k;
        return (
          <div key={i} style={{position: 'absolute', left: 0, top: 0, transform: `translate(${k * (random(seed + 'x' + i) - 0.5) * 60}px, ${(1 - p) * -30 + k * 300}px) rotate(${r}deg)`, transformOrigin: `${x}px ${y}px`, opacity: 1 - k * 0.6}}>
            <Peg x={x} y={y} s={0.9} color={i % 2 ? C.inkSoft : C.ink} />
          </div>
        );
      })}
    </div>
  );
};

// Typewritten bank-receipt body.
export const ReceiptBody: React.FC<{bank: string; at: number; line?: string; size?: number}> = ({bank, at, line = 'Securities hamare paas hain.', size = 30}) => (
  <div style={{padding: '22px 30px', fontFamily: F.type, color: C.ink}}>
    <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: `3px double ${C.ink}`, paddingBottom: 8}}>
      <span style={{fontFamily: F.mono, fontWeight: 700, fontSize: size * 0.72, letterSpacing: 3}}>{bank}</span>
      <span style={{fontFamily: F.mono, fontWeight: 700, fontSize: size * 0.72, letterSpacing: 3}}>BR</span>
    </div>
    <div style={{fontFamily: F.display, fontSize: size * 1.25, marginTop: 14, letterSpacing: 1}}>BANK RECEIPT</div>
    <div style={{fontSize: size, marginTop: 10, lineHeight: 1.3}}><Typed text={line} at={at} /></div>
    <div style={{fontSize: size * 0.8, marginTop: 14, color: C.inkSoft}}>Sd/- ............</div>
  </div>
);
