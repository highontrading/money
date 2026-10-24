import React from 'react';
import {Img, random, staticFile, useCurrentFrame} from 'remotion';
import {Sfx} from '../../components/paper';
import {boil, ease, pop, stepped} from '../../lib/motion';
import {C, F} from '../../theme';

export const Center: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', ...style}}>{children}</div>
);

// Show children only inside [from, until) (scene-local frames).
export const Show: React.FC<{from?: number; until?: number; children: React.ReactNode}> = ({from = 0, until, children}) => {
  const frame = useCurrentFrame();
  if (frame < from || (until !== undefined && frame >= until)) return null;
  return <>{children}</>;
};

// Text that pops in on its beat.
export const Pop: React.FC<{x: number; y: number; at: number; out?: number; size?: number; color?: string; font?: string; w?: number; align?: 'left' | 'center' | 'right'; rot?: number; children: React.ReactNode}> = ({x, y, at, out, size = 64, color = C.ink, font = F.display, w, align = 'left', rot = 0, children}) => {
  const frame = useCurrentFrame();
  if (stepped(frame) < at || (out !== undefined && frame >= out)) return null;
  const p = Math.min(1.05, pop(frame, at));
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, textAlign: align, fontFamily: font, fontWeight: 700, fontSize: size, lineHeight: 1, color, whiteSpace: 'nowrap', transform: `translateY(${(1 - p) * -24}px) scale(${0.9 + 0.1 * p}) rotate(${rot}deg)`, zIndex: 66}}>
      {children}
    </div>
  );
};

// Grey "text" lines for clippings and documents.
export const Lines: React.FC<{n: number; w?: number; gap?: number; seed: string}> = ({n, w = 100, gap = 22, seed}) => (
  <div>
    {Array.from({length: n}).map((_, i) => (
      <div key={i} style={{height: 9, marginBottom: gap - 9, width: `${w * (0.7 + random(seed + i) * 0.3)}%`, background: 'rgba(20,20,20,0.22)'}} />
    ))}
  </div>
);

// Typed line (typewriter reveal, stepped).
export const Typed: React.FC<{at: number; text: string; cps?: number; style?: React.CSSProperties}> = ({at, text, cps = 2.2, style}) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((stepped(frame) - at) * cps)));
  if (frame < at) return null;
  return (
    <div style={{fontFamily: F.type, fontSize: 30, lineHeight: 1.35, color: C.ink, whiteSpace: 'pre-wrap', ...style}}>
      {text.slice(0, n)}
      {n < text.length ? <span style={{opacity: 0.6}}>▌</span> : null}
    </div>
  );
};

// Halftone gold bars photo filling its box.
export const GoldPhoto: React.FC<{pos?: string}> = ({pos = '50% 50%'}) => (
  <Img src={staticFile('img/proc/gold_bars.jpg')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos}} />
);

// A generic paper bank facade: pediment, label band, columns, steps. Drawn to fill w×h.
export const BankFacade: React.FC<{w: number; h: number; fill?: string; label?: string}> = ({w, h, fill = C.paperLight, label = 'BANK'}) => {
  const ped = h * 0.2, band = h * 0.14, steps = h * 0.14, colTop = ped + band, colH = h - colTop - steps;
  const n = 4, cw = w * 0.09, gap = (w * 0.84 - n * cw) / (n - 1);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <path d={`M${w * 0.04},${ped} L${w / 2},${h * 0.02} L${w * 0.96},${ped} Z`} fill={fill} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
      <rect x={w * 0.05} y={ped} width={w * 0.9} height={band} fill={C.ink} />
      <text x={w / 2} y={ped + band * 0.78} textAnchor="middle" fontFamily="Anton" fontSize={band * 0.78} letterSpacing={4} fill={C.paperLight}>{label}</text>
      {Array.from({length: n}).map((_, i) => (
        <rect key={i} x={w * 0.08 + i * (cw + gap)} y={colTop} width={cw} height={colH} fill={fill} stroke={C.ink} strokeWidth={4} />
      ))}
      <rect x={w * 0.03} y={h - steps} width={w * 0.94} height={steps * 0.5} fill={fill} stroke={C.ink} strokeWidth={4} />
      <rect x={0} y={h - steps * 0.5} width={w} height={steps * 0.5} fill={fill} stroke={C.ink} strokeWidth={4} />
    </svg>
  );
};

// Side-view paper cargo plane, nose pointing right, drawn in a 220×90 box.
export const PlaneShape: React.FC<{cargo?: boolean}> = ({cargo = true}) => (
  <svg width={220} height={90} viewBox="0 0 220 90" style={{overflow: 'visible', filter: `drop-shadow(5px 8px 6px ${C.shadow})`}}>
    <path d="M20,52 Q18,38 40,36 L170,34 Q205,36 214,48 Q205,58 170,60 L40,62 Q22,62 20,52 Z" fill={C.paperLight} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
    <path d="M28,40 L10,8 L34,8 L62,37 Z" fill={C.paperLight} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
    <path d="M92,50 L60,86 L92,86 L136,52 Z" fill={C.paperLight} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
    <path d="M186,40 Q198,42 204,47 L186,47 Z" fill={C.ink} />
    {cargo ? <rect x={78} y={39} width={70} height={14} rx={2} fill={C.yellow} stroke={C.ink} strokeWidth={3} /> : null}
    {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={60 + i * 22} cy={44} r={0} />)}
  </svg>
);

// Quadratic bezier point.
const qb = (a: number, c: number, b: number, t: number) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * c + t * t * b;

// Dashed route from (x1,y1) to (x2,y2) bowing up to (cx,cy); a plane flies along it between `fly` and `land`.
export const Route: React.FC<{x1: number; y1: number; cx: number; cy: number; x2: number; y2: number; at: number; fly: number; land: number; out?: number; seed: string}> = ({x1, y1, cx, cy, x2, y2, at, fly, land, out, seed}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at || (out !== undefined && f >= out)) return null;
  const draw = ease(f, at, at + 12);
  const t = ease(f, fly, land);
  const px = qb(x1, cx, x2, t), py = qb(y1, cy, y2, t);
  const t2 = Math.min(1, t + 0.02);
  const ang = (Math.atan2(qb(y1, cy, y2, t2) - py, qb(x1, cx, x2, t2) - px) * 180) / Math.PI;
  const b = boil(seed, frame, 1);
  const d = `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
  const flip = x2 < x1;
  return (
    <>
      <Sfx at={fly} name="whoosh" volume={0.35} />
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, zIndex: 55, pointerEvents: 'none', overflow: 'visible'}}>
        <path d={d} pathLength={1} fill="none" stroke={C.ink} strokeWidth={5} strokeDasharray="0.018 0.014" strokeDashoffset={0} opacity={0.75 * draw} />
      </svg>
      {f >= fly ? (
        <div style={{position: 'absolute', left: px - 110, top: py - 45, width: 220, height: 90, zIndex: 58, transform: `translate(${b.x}px, ${b.y}px) rotate(${flip ? ang + 180 : ang}deg) scaleX(${flip ? -1 : 1})`}}>
          <PlaneShape />
        </div>
      ) : null}
    </>
  );
};

// A map pin with a place label.
export const Pin: React.FC<{x: number; y: number; at: number; out?: number; label: string; dark?: boolean; side?: 'left' | 'right'}> = ({x, y, at, out, label, dark = true, side = 'right'}) => {
  const frame = useCurrentFrame();
  if (stepped(frame) < at || (out !== undefined && frame >= out)) return null;
  const p = Math.min(1.05, pop(frame, at));
  return (
    <div style={{position: 'absolute', left: x, top: y, zIndex: 57, transform: `scale(${p})`}}>
      <div style={{position: 'absolute', left: -14, top: -14, width: 28, height: 28, borderRadius: 14, background: C.red, border: `4px solid ${C.ink}`}} />
      <div style={{position: 'absolute', top: -22, [side === 'right' ? 'left' : 'right']: 26, background: dark ? C.ink : C.yellow, color: dark ? C.paperLight : C.ink, fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 3, padding: '6px 12px', whiteSpace: 'nowrap'}}>{label}</div>
    </div>
  );
};

// Semicircle "fuel gauge": needle angle from full (right) to `level` (0 = empty, 1 = full).
export const Gauge: React.FC<{w: number; level: number; label: string}> = ({w, level, label}) => {
  const r = w * 0.42, cx = w / 2, cy = r + 30;
  const ang = Math.PI * (1 - level);
  const nx = cx + Math.cos(ang) * r * 0.86, ny = cy - Math.sin(ang) * r * 0.86;
  return (
    <svg width={w} height={cy + 40} viewBox={`0 0 ${w} ${cy + 40}`} style={{overflow: 'visible'}}>
      <path d={`M${cx - r},${cy} A${r},${r} 0 0 1 ${cx + r},${cy}`} fill="none" stroke={C.newsprint} strokeWidth={46} />
      <path d={`M${cx - r},${cy} A${r},${r} 0 0 1 ${cx - r * Math.cos(Math.PI * 0.18)},${cy - r * Math.sin(Math.PI * 0.18)}`} fill="none" stroke={C.red} strokeWidth={46} />
      {Array.from({length: 9}).map((_, i) => {
        const a = (Math.PI * i) / 8;
        return <line key={i} x1={cx - Math.cos(a) * (r - 34)} y1={cy - Math.sin(a) * (r - 34)} x2={cx - Math.cos(a) * (r - 14)} y2={cy - Math.sin(a) * (r - 14)} stroke={C.ink} strokeWidth={4} />;
      })}
      <text x={cx - r} y={cy + 52} textAnchor="middle" fontFamily="Anton" fontSize={44} fill={C.red}>E</text>
      <text x={cx + r} y={cy + 52} textAnchor="middle" fontFamily="Anton" fontSize={44} fill={C.ink}>F</text>
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={C.ink} strokeWidth={10} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={18} fill={C.ink} />
      <text x={cx} y={cy - r * 0.38} textAnchor="middle" fontFamily="IBM Plex Mono" fontWeight={700} fontSize={26} letterSpacing={3} fill={C.inkSoft}>{label}</text>
    </svg>
  );
};

// Hourglass doodle.
export const Hourglass: React.FC<{size: number; p: number}> = ({size, p}) => {
  const w = size * 0.7, h = size;
  const top = 1 - p, bot = p;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x={0} y={0} width={w} height={h * 0.07} fill={C.ink} />
      <rect x={0} y={h * 0.93} width={w} height={h * 0.07} fill={C.ink} />
      <path d={`M${w * 0.12},${h * 0.07} L${w * 0.88},${h * 0.07} Q${w * 0.88},${h * 0.32} ${w * 0.55},${h * 0.5} Q${w * 0.88},${h * 0.68} ${w * 0.88},${h * 0.93} L${w * 0.12},${h * 0.93} Q${w * 0.12},${h * 0.68} ${w * 0.45},${h * 0.5} Q${w * 0.12},${h * 0.32} ${w * 0.12},${h * 0.07} Z`} fill={C.paperLight} stroke={C.ink} strokeWidth={5} />
      <path d={`M${w * 0.22},${h * (0.12 + 0.3 * (1 - top))} L${w * 0.78},${h * (0.12 + 0.3 * (1 - top))} L${w * 0.52},${h * 0.47} L${w * 0.48},${h * 0.47} Z`} fill={C.yellow} opacity={top > 0.02 ? 1 : 0} />
      <path d={`M${w * 0.5 - w * 0.36 * bot},${h * 0.9} L${w * 0.5 + w * 0.36 * bot},${h * 0.9} L${w * 0.5},${h * (0.9 - 0.3 * bot)} Z`} fill={C.yellow} />
      <line x1={w / 2} y1={h * 0.5} x2={w / 2} y2={h * 0.88} stroke={C.yellow} strokeWidth={4} opacity={top > 0.02 ? 1 : 0} />
    </svg>
  );
};

// Hand-drawn arrow (felt-tip) between two points, drawn over `dur` frames.
export const arrowPath = (x1: number, y1: number, x2: number, y2: number) => {
  const a = Math.atan2(y2 - y1, x2 - x1), L = 26;
  const hx1 = x2 - L * Math.cos(a - 0.5), hy1 = y2 - L * Math.sin(a - 0.5);
  const hx2 = x2 - L * Math.cos(a + 0.5), hy2 = y2 - L * Math.sin(a + 0.5);
  return `M${x1},${y1} L${x2},${y2} M${hx1},${hy1} L${x2},${y2} L${hx2},${hy2}`;
};
