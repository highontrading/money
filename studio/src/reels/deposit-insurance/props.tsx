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

// A generic paper bank facade: pediment, "BANK" band, columns, steps. Drawn to fill w×h.
export const BankFacade: React.FC<{w: number; h: number; fill?: string; label?: string}> = ({w, h, fill = C.paperLight, label = 'BANK'}) => {
  const ped = h * 0.2, band = h * 0.13, steps = h * 0.14, colTop = ped + band, colH = h - colTop - steps;
  const n = 4, cw = w * 0.09, gap = (w * 0.84 - n * cw) / (n - 1);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <path d={`M${w * 0.04},${ped} L${w / 2},${h * 0.02} L${w * 0.96},${ped} Z`} fill={fill} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
      <rect x={w * 0.05} y={ped} width={w * 0.9} height={band} fill={C.ink} />
      <text x={w / 2} y={ped + band * 0.78} textAnchor="middle" fontFamily="Anton" fontSize={band * 0.8} letterSpacing={6} fill={C.paperLight}>{label}</text>
      {Array.from({length: n}).map((_, i) => (
        <rect key={i} x={w * 0.08 + i * (cw + gap)} y={colTop} width={cw} height={colH} fill={fill} stroke={C.ink} strokeWidth={4} />
      ))}
      <rect x={w * 0.03} y={h - steps} width={w * 0.94} height={steps * 0.5} fill={fill} stroke={C.ink} strokeWidth={4} />
      <rect x={0} y={h - steps * 0.5} width={w} height={steps * 0.5} fill={fill} stroke={C.ink} strokeWidth={4} />
    </svg>
  );
};

// Bank building that pops in, and optionally tilts and sinks below a ground line (clipped at `ground`).
export const Bank: React.FC<{x: number; y: number; w: number; h: number; at: number; out?: number; sinkAt?: number; ground?: number; label?: string; fill?: string; seed: string}> = ({x, y, w, h, at, out, sinkAt, ground, label, fill, seed}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at || (out !== undefined && f >= out)) return null;
  const p = Math.min(1.05, pop(frame, at));
  const k = sinkAt !== undefined ? ease(f, sinkAt, sinkAt + 26) : 0;
  const b = boil(seed, frame, 1);
  const clipH = ground !== undefined ? ground - y + 6 : h + 60;
  return (
    <div style={{position: 'absolute', left: x - 40, top: y - 40, width: w + 80, height: clipH + 40, overflow: 'hidden', zIndex: 20}}>
      <Sfx at={at} name="drop" volume={0.3} />
      {sinkAt !== undefined ? <Sfx at={sinkAt} name="whoosh" volume={0.35} /> : null}
      <div style={{position: 'absolute', left: 40, top: 40, width: w, height: h, transformOrigin: '50% 100%',
        transform: `translate(${b.x + k * 30}px, ${b.y + (1 - p) * -40 + k * h * 0.62}px) rotate(${b.r + k * 9}deg) scale(${0.9 + 0.1 * p})`,
        filter: `drop-shadow(5px 9px 9px ${C.shadow})`}}>
        <BankFacade w={w} h={h} label={label} fill={fill} />
      </div>
    </div>
  );
};

const canopy = (r: number) => {
  const n = 6;
  let d = `M${-r},0 A${r},${r} 0 0 1 ${r},0`;
  for (let i = n; i > 0; i--) {
    const x0 = -r + (2 * r * i) / n, x1 = -r + (2 * r * (i - 1)) / n;
    d += ` Q${(x0 + x1) / 2},${-r * 0.16} ${x1},0`;
  }
  return d + ' Z';
};

// Paper umbrella; (cx, top) = centre of the canopy and its top edge. Label sits inside the canopy.
export const Umbrella: React.FC<{cx: number; top: number; r: number; at: number; out?: number; label: React.ReactNode; color?: string; size?: number; handle?: number}> = ({cx, top, r, at, out, label, color = C.yellow, size, handle = 0.9}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at || (out !== undefined && f >= out)) return null;
  const p = Math.min(1.05, pop(frame, at));
  return (
    <div style={{position: 'absolute', left: cx - r - 10, top, width: 2 * r + 20, height: r * (1 + handle) + 30, transform: `scale(${p})`, transformOrigin: '50% 100%', zIndex: 40}}>
      <Sfx at={at} name="pop" volume={0.3} />
      <svg width={2 * r + 20} height={r * (1 + handle) + 30} viewBox={`${-r - 10} ${-r - 10} ${2 * r + 20} ${r * (1 + handle) + 30}`} style={{overflow: 'visible', filter: `drop-shadow(6px 9px 8px ${C.shadow})`}}>
        <path d={canopy(r)} fill={color} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
        <path d={`M0,0 L0,${r * handle} Q0,${r * (handle + 0.14)} ${-r * 0.14},${r * (handle + 0.1)}`} fill="none" stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
      </svg>
      <div style={{position: 'absolute', left: 0, width: 2 * r + 20, top: r * 0.42, textAlign: 'center', fontFamily: F.display, fontSize: size ?? r * 0.36, lineHeight: 1, whiteSpace: 'nowrap'}}>{label}</div>
    </div>
  );
};

// Red felt-tip "rain" falling inside a box.
export const Rain: React.FC<{x: number; y: number; w: number; h: number; at: number; out?: number; n?: number; seed: string}> = ({x, y, w, h, at, out, n = 22, seed}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at || (out !== undefined && f >= out)) return null;
  const t = f - at;
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: x, top: y, overflow: 'hidden', zIndex: 45, pointerEvents: 'none'}}>
      {Array.from({length: n}).map((_, i) => {
        const sx = random(seed + 'x' + i) * w;
        const speed = 22 + random(seed + 's' + i) * 10;
        const yy = ((random(seed + 'o' + i) * (h + 60) + t * speed) % (h + 60)) - 50;
        return <line key={i} x1={sx} y1={yy} x2={sx - 9} y2={yy + 38} stroke={C.red} strokeWidth={6} strokeLinecap="round" opacity={0.85} />;
      })}
    </svg>
  );
};

// FD slip face (inside a Card).
export const Slip: React.FC<{title?: string; amount: React.ReactNode; sub?: string; size?: number}> = ({title = 'FIXED DEPOSIT', amount, sub, size = 64}) => (
  <div style={{position: 'absolute', inset: 0}}>
    <div style={{background: C.ink, color: C.paperLight, fontFamily: F.mono, fontWeight: 700, fontSize: 18, letterSpacing: 2, padding: '10px 12px'}}>{title}</div>
    <div style={{position: 'absolute', left: 10, right: 10, top: 46, bottom: 10, border: `2px dashed ${C.grey}`}} />
    <Center style={{height: 'auto', position: 'absolute', left: 0, right: 0, top: 60, bottom: 20}}>
      <div style={{fontFamily: F.display, fontSize: size, lineHeight: 1, whiteSpace: 'nowrap'}}>{amount}</div>
      {sub ? <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 18, letterSpacing: 2, marginTop: 10, color: C.inkSoft}}>{sub}</div> : null}
    </Center>
  </div>
);

// Grey "text" lines for clippings and documents.
export const Lines: React.FC<{n: number; w?: number; gap?: number; seed: string}> = ({n, w = 100, gap = 22, seed}) => (
  <div>
    {Array.from({length: n}).map((_, i) => (
      <div key={i} style={{height: 9, marginBottom: gap - 9, width: `${w * (0.7 + random(seed + i) * 0.3)}%`, background: 'rgba(20,20,20,0.22)'}} />
    ))}
  </div>
);
