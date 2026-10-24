import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Card, CardProps, Sfx} from '../../components/paper';
import {clamp, ease, pop, stepped} from '../../lib/motion';
import {C, F} from '../../theme';

export const grid = (cell = 40, color = 'rgba(70, 110, 150, 0.16)') => ({
  backgroundImage: `linear-gradient(${color} 1.5px, transparent 1.5px), linear-gradient(90deg, ${color} 1.5px, transparent 1.5px)`,
  backgroundSize: `${cell}px ${cell}px`,
});

export const hatch = (color = C.red, gap = 14) => ({
  backgroundImage: `repeating-linear-gradient(-45deg, ${color} 0 3px, transparent 3px ${gap}px)`,
});

// Render children only inside [from, until).
export const Show: React.FC<{from?: number; until?: number; children: React.ReactNode}> = ({from = 0, until, children}) => {
  const frame = useCurrentFrame();
  if (frame < from || (until !== undefined && frame >= until)) return null;
  return <>{children}</>;
};

// Pops in (on twos) at `at`; holds its space before.
export const Appear: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, children, style}) => {
  const frame = useCurrentFrame();
  if (stepped(frame) < at) return <span style={{opacity: 0, ...style}}>{children}</span>;
  const p = Math.min(1.06, pop(frame, at));
  return <span style={{display: 'inline-block', transform: `translateY(${(1 - p) * -24}px) scale(${0.85 + 0.15 * p})`, ...style}}>{children}</span>;
};

// Hand-drawn tick, drawn on over a few frames.
export const Tick: React.FC<{at: number; size?: number; color?: string}> = ({at, size = 56, color = C.ink}) => {
  const frame = useCurrentFrame();
  const p = ease(stepped(frame), at, at + 6);
  return (
    <>
      <Sfx at={at} name="marker" volume={0.25} />
      <svg width={size} height={size} viewBox="0 0 60 60" style={{overflow: 'visible', opacity: frame >= at ? 1 : 0}}>
        <path d="M8,32 L24,48 L54,10" pathLength={1} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - p} />
      </svg>
    </>
  );
};

// A generic paper credit card (no bank, no network). `old` = faded, dusty, tagged PURANA.
export const CreditCard: React.FC<Omit<CardProps, 'children' | 'bg'> & {old?: boolean; limit?: React.ReactNode}> = ({old, limit, ...p}) => (
  <Card {...p} bg={old ? '#6f675b' : '#23211f'} texture="kraft" torn={{}} rough={4}>
    <div style={{position: 'absolute', inset: 0, padding: `${p.h * 0.1}px ${p.w * 0.08}px`, color: C.paperLight}}>
      <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: p.w * 0.05, letterSpacing: 4}}>CREDIT CARD</div>
      <div style={{width: p.w * 0.16, height: p.h * 0.2, background: old ? '#a38f5e' : '#c9a646', borderRadius: 8, marginTop: p.h * 0.1, border: '2px solid #8a7130'}} />
      <div style={{fontFamily: F.mono, fontWeight: 500, fontSize: p.w * 0.05, letterSpacing: 3, marginTop: p.h * 0.1, whiteSpace: 'nowrap'}}>XXXX XXXX XXXX {old ? '1107' : '4821'}</div>
      <div style={{fontFamily: F.mono, fontSize: p.w * 0.034, letterSpacing: 2, marginTop: p.h * 0.06, whiteSpace: 'nowrap', opacity: 0.85}}>AAPKA NAAM</div>
    </div>
    {old ? <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 30%, rgba(236,230,218,0.0) 0%, rgba(236,230,218,0.22) 70%)', mixBlendMode: 'screen'}} /> : null}
    {limit ? (
      <div style={{position: 'absolute', right: p.w * 0.06, bottom: p.h * 0.1, background: C.yellow, color: C.ink, fontFamily: F.display, fontSize: p.w * 0.075, padding: '4px 12px', transform: 'rotate(-3deg)'}}>{limit}</div>
    ) : null}
  </Card>
);

// Scissors closing along a vertical cut line from y0 to y1 at x.
export const Scissors: React.FC<{x: number; y0: number; y1: number; at: number; dur?: number; out?: number}> = ({x, y0, y1, at, dur = 16, out}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (frame < at || (out !== undefined && frame >= out)) return null;
  const p = ease(f, at, at + dur);
  const y = y0 + (y1 - y0) * p;
  const open = p < 1 ? 10 + 12 * Math.abs(Math.sin(f / 2)) : 6;
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
        <line x1={x} y1={y0} x2={x} y2={y} stroke={C.ink} strokeWidth={3} strokeDasharray="14 9" opacity={0.8} />
        <g transform={`translate(${x}, ${y - 150}) rotate(180)`} style={{filter: `drop-shadow(6px 10px 8px ${C.shadow})`}}>
          {blade(1)}
          {blade(-1)}
          <circle r={7} fill={C.ink} />
        </g>
      </svg>
    </>
  );
};

// A card cut in two along x = cut: the halves drift apart after `split`.
export const CutCard: React.FC<{id: string; x: number; y: number; w: number; h: number; rot?: number; at: number; out?: number; split: number; enter?: CardProps['enter']; exit?: CardProps['exit']}> = ({id, x, y, w, h, rot = 0, at, out, split, enter = 'none', exit = 'down'}) => {
  const frame = useCurrentFrame();
  const cut = x + w / 2;
  const d = ease(stepped(frame), split, split + 8, 0, 1);
  const half = (side: -1 | 1) => (
    <div style={{position: 'absolute', inset: 0, clipPath: side < 0 ? `polygon(0 0, ${cut}px 0, ${cut + 6}px 1920px, 0 1920px)` : `polygon(${cut}px 0, 1080px 0, 1080px 1920px, ${cut + 6}px 1920px)`, transform: `translate(${side * 36 * d}px, ${side * 10 * d}px) rotate(${side * 4 * d}deg)`, transformOrigin: `${cut}px ${y + h / 2}px`}}>
      <CreditCard id={id} x={x} y={y} w={w} h={h} rot={rot} at={at} out={out} enter={enter} exit={exit} old sfx={null} />
    </div>
  );
  return (
    <>
      {half(-1)}
      {half(1)}
    </>
  );
};

// Semi-circle score gauge (no numbers): needle angle goes from `from` to `to` (0 = low, 1 = high).
export const Dial: React.FC<{w: number; from: number; to: number; at: number; dur?: number}> = ({w, from, to, at, dur = 14}) => {
  const frame = useCurrentFrame();
  const v = interpolate(stepped(frame), [at, at + dur], [from, to], clamp);
  const r = w / 2 - 30;
  const cx = w / 2, cy = r + 30;
  const arc = (a0: number, a1: number) => {
    const p = (a: number) => [cx - r * Math.cos(Math.PI * a), cy - r * Math.sin(Math.PI * a)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `M${x0},${y0} A${r},${r} 0 0 1 ${x1},${y1}`;
  };
  const ang = Math.PI * v;
  const nx = cx - (r - 40) * Math.cos(ang), ny = cy - (r - 40) * Math.sin(ang);
  return (
    <svg width={w} height={cy + 40} style={{overflow: 'visible'}}>
      <path d={arc(0, 0.33)} fill="none" stroke={C.red} strokeWidth={46} opacity={0.85} />
      <path d={arc(0.335, 0.66)} fill="none" stroke={C.grey} strokeWidth={46} opacity={0.7} />
      <path d={arc(0.665, 1)} fill="none" stroke={C.yellow} strokeWidth={46} />
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={C.ink} strokeWidth={12} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={20} fill={C.ink} />
      <text x={30} y={cy + 40} fontFamily="IBM Plex Mono" fontWeight={700} fontSize={26} fill={C.inkSoft}>LOW</text>
      <text x={w - 30} y={cy + 40} textAnchor="end" fontFamily="IBM Plex Mono" fontWeight={700} fontSize={26} fill={C.inkSoft}>HIGH</text>
    </svg>
  );
};

// "Limit used" meter: a container (width scales from cap0 to cap1 at capAt) with a fill
// fraction of the ORIGINAL width (fill0 -> fill1 at fillAt).
export const Meter: React.FC<{w: number; h: number; fill0: number; fill1: number; fillAt: number; cap0?: number; cap1?: number; capAt?: number; dur?: number; red?: number; guide?: number; guideAt?: number}> = ({w, h, fill0, fill1, fillAt, cap0 = 1, cap1 = 1, capAt = 0, dur = 12, red, guide, guideAt = 0}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  const cap = interpolate(f, [capAt, capAt + dur], [cap0, cap1], clamp);
  const fill = interpolate(f, [fillAt, fillAt + dur], [fill0, fill1], clamp);
  const cw = w * cap;
  const isRed = red !== undefined && f >= red;
  const g = ease(f, guideAt, guideAt + 8);
  return (
    <div style={{position: 'relative', width: w, height: h}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, border: `3px dashed ${C.grey}`, opacity: cap < 0.999 ? 0.8 : 0}} />
      <div style={{position: 'absolute', left: 0, top: 0, width: cw, height: h, border: `5px solid ${C.ink}`, background: C.paperLight, boxSizing: 'border-box', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: w * fill, background: isRed ? C.red : C.yellow, borderRight: `4px solid ${C.ink}`}} />
        {cap < 0.999 && fill * w > cw ? null : null}
      </div>
      {guide !== undefined && frame >= guideAt ? (
        <div style={{position: 'absolute', left: cw * guide - 2, top: -30, height: (h + 60) * g, borderLeft: `5px dashed ${C.ink}`}} />
      ) : null}
    </div>
  );
};
