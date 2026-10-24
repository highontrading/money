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

// Black header strip used on letters and payslips.
export const Head: React.FC<{children: React.ReactNode; right?: React.ReactNode; size?: number}> = ({children, right, size = 24}) => (
  <div style={{display: 'flex', justifyContent: 'space-between', background: C.ink, color: C.paperLight, fontFamily: F.mono, fontWeight: 700, fontSize: size, letterSpacing: 3, padding: '16px 34px'}}>
    <span>{children}</span>
    {right ? <span>{right}</span> : null}
  </div>
);

// One payslip row: label left, amount right. Hidden rows keep their height.
export const Row: React.FC<{label: React.ReactNode; value?: React.ReactNode; size?: number; at?: number; bold?: boolean; last?: boolean; sub?: React.ReactNode; style?: React.CSSProperties}> = ({label, value, size = 44, at = -1, bold, last, sub, style}) => {
  const frame = useCurrentFrame();
  const shown = stepped(frame) >= at;
  const p = shown ? Math.min(1.04, pop(frame, at)) : 0;
  return (
    <div style={{padding: '12px 0', borderBottom: last ? 'none' : `2px dashed ${C.grey}`, opacity: shown ? 1 : 0, transform: `translateX(${(1 - p) * -30}px)`, ...style}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: bold ? F.display : F.type, fontSize: size, lineHeight: 1.15}}>
        <span>{label}</span>
        <span style={{whiteSpace: 'nowrap'}}>{value}</span>
      </div>
      {sub ? <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: 2, color: C.inkSoft, marginTop: 4, textTransform: 'uppercase'}}>{sub}</div> : null}
    </div>
  );
};

// ---------------------------------------------------------------- tiny paper icons

export const Target: React.FC<{size?: number}> = ({size = 80}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx={50} cy={50} r={44} fill={C.paperLight} stroke={C.ink} strokeWidth={6} />
    <circle cx={50} cy={50} r={28} fill={C.yellow} stroke={C.ink} strokeWidth={5} />
    <circle cx={50} cy={50} r={11} fill={C.ink} />
    <line x1={50} y1={50} x2={92} y2={8} stroke={C.red} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

// PF jar; fill 0..1 is the coin level.
export const Jar: React.FC<{size?: number; fill?: number; label?: string}> = ({size = 90, fill = 0.6, label = 'PF'}) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 100 120" style={{overflow: 'visible'}}>
    <rect x={22} y={4} width={56} height={14} rx={3} fill={C.ink} />
    <path d="M18 22 H82 V108 Q82 116 74 116 H26 Q18 116 18 108 Z" fill={C.paperLight} stroke={C.ink} strokeWidth={5} />
    <rect x={22} y={112 - 88 * fill} width={56} height={88 * fill} fill={C.yellow} />
    <path d="M18 22 H82 V108 Q82 116 74 116 H26 Q18 116 18 108 Z" fill="none" stroke={C.ink} strokeWidth={5} />
    <text x={50} y={78} textAnchor="middle" fontFamily="Anton, sans-serif" fontSize={30} fill={C.ink}>{label}</text>
  </svg>
);

export const Umbrella: React.FC<{size?: number}> = ({size = 84}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M8 50 Q50 -4 92 50 Q81 42 71 50 Q60 42 50 50 Q40 42 29 50 Q19 42 8 50 Z" fill={C.yellow} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
    <path d="M50 50 V86 Q50 96 40 94" fill="none" stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

export const Calendar: React.FC<{size?: number; text?: string}> = ({size = 84, text = '5 SAAL'}) => (
  <div style={{width: size, height: size, border: `4px solid ${C.ink}`, background: C.paperLight, display: 'flex', flexDirection: 'column'}}>
    <div style={{height: size * 0.26, background: C.red}} />
    <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: size * 0.24, lineHeight: 1, textAlign: 'center'}}>{text}</div>
  </div>
);

// Paper confetti burst, popped on `at`.
export const Confetti: React.FC<{at: number; w?: number; h?: number}> = ({at, w = 300, h = 160}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at) return null;
  const p = Math.min(1, (f - at) / 8);
  const bits = Array.from({length: 18}, (_, i) => {
    const a = (i / 18) * Math.PI * 2 + (i % 3) * 0.3;
    const r = 30 + (i * 37) % 70;
    return {x: w / 2 + Math.cos(a) * r * p * 1.6, y: h / 2 + Math.sin(a) * r * p, rot: i * 47, c: [C.yellow, C.ink, C.red, C.kraft][i % 4]};
  });
  return (
    <div style={{position: 'relative', width: w, height: h}}>
      {bits.map((b, i) => (
        <div key={i} style={{position: 'absolute', left: b.x, top: b.y, width: 16, height: 8, background: b.c, transform: `rotate(${b.rot}deg)`}} />
      ))}
    </div>
  );
};
