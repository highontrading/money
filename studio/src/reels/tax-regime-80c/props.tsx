import React from 'react';
import {useCurrentFrame} from 'remotion';
import {pop, stepped} from '../../lib/motion';
import {C, F} from '../../theme';

export const grid = (cell = 40, color = 'rgba(70, 110, 150, 0.16)') => ({
  backgroundImage: `linear-gradient(${color} 1.5px, transparent 1.5px), linear-gradient(90deg, ${color} 1.5px, transparent 1.5px)`,
  backgroundSize: `${cell}px ${cell}px`,
});

// Children visible only inside [from, until) (scene-local frames).
export const Show: React.FC<{from?: number; until?: number; children: React.ReactNode}> = ({from = 0, until, children}) => {
  const frame = useCurrentFrame();
  if (frame < from || (until !== undefined && frame >= until)) return null;
  return <>{children}</>;
};

// Inline element that pops in on its beat (keeps its space before it lands).
export const Pop: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, children, style}) => {
  const frame = useCurrentFrame();
  if (stepped(frame) < at) return <span style={{opacity: 0, ...style}}>{children}</span>;
  const p = Math.min(1.06, pop(frame, at));
  return <span style={{display: 'inline-block', transform: `translateY(${(1 - p) * -24}px) scale(${0.9 + 0.1 * p})`, ...style}}>{children}</span>;
};

// One receipt row: label left, amount right. Hidden rows keep their height.
export const Row: React.FC<{label: React.ReactNode; value?: React.ReactNode; size?: number; at?: number; bold?: boolean; last?: boolean; style?: React.CSSProperties}> = ({label, value, size = 40, at = -1, bold, last, style}) => {
  const frame = useCurrentFrame();
  const shown = stepped(frame) >= at;
  const p = shown ? Math.min(1.04, pop(frame, at)) : 0;
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: bold ? F.display : F.type, fontSize: size, lineHeight: 1.15, padding: '13px 0', borderBottom: last ? 'none' : `2px dashed ${C.grey}`, opacity: shown ? 1 : 0, transform: `translateX(${(1 - p) * -30}px)`, ...style}}>
      <span>{label}</span>
      <span style={{whiteSpace: 'nowrap'}}>{value}</span>
    </div>
  );
};

// Black header strip used on forms and receipts.
export const Head: React.FC<{children: React.ReactNode; right?: React.ReactNode; size?: number}> = ({children, right, size = 24}) => (
  <div style={{display: 'flex', justifyContent: 'space-between', background: C.ink, color: C.paperLight, fontFamily: F.mono, fontWeight: 700, fontSize: size, letterSpacing: 3, padding: '16px 34px'}}>
    <span>{children}</span>
    {right ? <span>{right}</span> : null}
  </div>
);

// Paper padlock, drawn in SVG; `shut` 0..1 lowers the shackle.
export const Padlock: React.FC<{size?: number; shut?: number}> = ({size = 150, shut = 1}) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 100 115" style={{overflow: 'visible'}}>
    <path d={`M28 ${52 - (1 - shut) * 16} V34 a22 22 0 0 1 44 0 V${52 - (1 - shut) * 16}`} fill="none" stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
    <rect x={14} y={50} width={72} height={60} rx={7} fill={C.yellow} stroke={C.ink} strokeWidth={5} />
    <circle cx={50} cy={74} r={7} fill={C.ink} />
    <rect x={47} y={76} width={6} height={18} fill={C.ink} />
  </svg>
);

// Hand-drawn balance scale; tilt in degrees (positive = right pan down).
export const Scale: React.FC<{w?: number; tilt?: number; left: React.ReactNode; right: React.ReactNode}> = ({w = 760, tilt = 0, left, right}) => {
  const arm = w * 0.42;
  const rad = (tilt * Math.PI) / 180;
  const dy = Math.sin(rad) * arm;
  const pan = (side: -1 | 1, label: React.ReactNode) => {
    const x = w / 2 + side * Math.cos(rad) * arm;
    const y = 120 + side * dy;
    return (
      <div style={{position: 'absolute', left: x - 140, top: y, width: 280, textAlign: 'center'}}>
        <svg width={280} height={70} style={{display: 'block'}}>
          <line x1={140} y1={0} x2={30} y2={66} stroke={C.ink} strokeWidth={3} />
          <line x1={140} y1={0} x2={250} y2={66} stroke={C.ink} strokeWidth={3} />
          <path d="M14 64 Q140 104 266 64 Z" fill={C.paperLight} stroke={C.ink} strokeWidth={4} />
        </svg>
        <div style={{marginTop: 24}}>{label}</div>
      </div>
    );
  };
  return (
    <div style={{position: 'relative', width: w, height: 420}}>
      <svg width={w} height={420} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <rect x={w / 2 - 8} y={110} width={16} height={270} fill={C.ink} />
        <rect x={w / 2 - 110} y={372} width={220} height={22} rx={4} fill={C.ink} />
        <line x1={w / 2 - Math.cos(rad) * arm} y1={120 - dy} x2={w / 2 + Math.cos(rad) * arm} y2={120 + dy} stroke={C.ink} strokeWidth={10} strokeLinecap="round" />
        <circle cx={w / 2} cy={118} r={16} fill={C.yellow} stroke={C.ink} strokeWidth={4} />
      </svg>
      {pan(-1, left)}
      {pan(1, right)}
    </div>
  );
};
