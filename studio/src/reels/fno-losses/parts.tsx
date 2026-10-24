import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, ease, pop, stepped} from '../../lib/motion';
import {C, F} from '../../theme';

export const grid = (cell = 40, color = 'rgba(70, 110, 150, 0.16)') => ({
  backgroundImage: `linear-gradient(${color} 1.5px, transparent 1.5px), linear-gradient(90deg, ${color} 1.5px, transparent 1.5px)`,
  backgroundSize: `${cell}px ${cell}px`,
});

// Show children only inside [from, until) (scene-local frames).
export const Show: React.FC<{from?: number; until?: number; children: React.ReactNode}> = ({from = 0, until, children}) => {
  const frame = useCurrentFrame();
  if (frame < from || (until !== undefined && frame >= until)) return null;
  return <>{children}</>;
};

// Pops its children in at `at`.
export const Pop: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties; origin?: string}> = ({at, children, style, origin = 'center'}) => {
  const frame = useCurrentFrame();
  if (stepped(frame) < at) return null;
  const p = Math.min(1.06, pop(frame, at, 11, 0.5));
  return <div style={{transform: `scale(${0.7 + 0.3 * p})`, transformOrigin: origin, ...style}}>{children}</div>;
};

// Hand-drawn tick / cross that write themselves on.
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

export const XMark: React.FC<{at: number; size?: number; color?: string}> = ({at, size = 60, color = C.red}) => {
  const frame = useCurrentFrame();
  if (stepped(frame) < at) return <span style={{display: 'inline-block', width: size, height: size}} />;
  const p = ease(stepped(frame), at, at + 6);
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" style={{display: 'inline-block', verticalAlign: 'middle'}}>
      <path d="M10,10 L50,50 M50,10 L10,50" pathLength={1} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - p} />
    </svg>
  );
};

// A paper cut-out person (head + shoulders), ink or coloured.
export const Figure: React.FC<{w?: number; color?: string; stroke?: string}> = ({w = 70, color = C.card, stroke = C.ink}) => (
  <svg width={w} height={w * 1.5} viewBox="0 0 70 105" style={{display: 'block', filter: 'drop-shadow(2px 4px 3px rgba(30,22,10,0.35))'}}>
    <circle cx={35} cy={24} r={17} fill={color} stroke={stroke} strokeWidth={4} />
    <path d="M6,102 C6,62 18,48 35,48 C52,48 64,62 64,102 Z" fill={color} stroke={stroke} strokeWidth={4} strokeLinejoin="round" />
  </svg>
);

// One of ten traders; flips to a LOSS (red) or PROFIT (yellow) tag at `tagAt`.
export const Trader: React.FC<{at: number; tagAt: number; win?: boolean; w?: number}> = ({at, tagAt, win = false, w = 70}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at) return <div style={{width: w, height: w * 1.5 + 44}} />;
  const p = Math.min(1.06, pop(frame, at, 11, 0.5));
  const tagged = f >= tagAt;
  const tp = Math.min(1.08, pop(frame, tagAt, 10, 0.5));
  return (
    <div style={{width: w, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translateY(${(1 - p) * -30}px) scale(${0.8 + 0.2 * p})`}}>
      <Figure w={w} color={tagged ? (win ? C.yellow : '#e7d2c8') : C.card} />
      <div style={{height: 44, marginTop: 6}}>
        {tagged ? (
          <div style={{transform: `scale(${tp}) rotate(${win ? 4 : -6}deg)`, background: win ? C.yellow : C.paperLight, border: `3px solid ${win ? C.ink : C.red}`, color: win ? C.ink : C.red,
            fontFamily: F.display, fontSize: 24, padding: '3px 6px 1px', letterSpacing: 1}}>{win ? 'PROFIT' : 'LOSS'}</div>
        ) : null}
      </div>
    </div>
  );
};

// Section header chip: "01 · ZERO-SUM".
export const Tab: React.FC<{n: string; title: string; hi?: boolean}> = ({n, title, hi}) => (
  <div style={{display: 'flex', alignItems: 'stretch', fontFamily: F.display}}>
    <div style={{background: C.ink, color: C.paperLight, fontSize: 64, padding: '10px 22px 4px'}}>{n}</div>
    <div style={{background: hi ? C.yellow : C.paperLight, color: C.ink, fontSize: 64, padding: '10px 26px 4px', border: `4px solid ${C.ink}`, borderLeft: 'none'}}>{title}</div>
  </div>
);

// Code-built phone showing a "get rich" reel.
export const PhoneReel: React.FC<{lit: number}> = ({lit}) => {
  const frame = useCurrentFrame();
  const glow = stepped(frame) >= lit;
  return (
    <div style={{position: 'absolute', inset: 0, background: '#1c1b19', borderRadius: 54, padding: 22}}>
      <div style={{position: 'absolute', left: '50%', top: 12, width: 110, height: 14, marginLeft: -55, borderRadius: 8, background: '#3a3835'}} />
      <div style={{position: 'absolute', left: 22, right: 22, top: 40, bottom: 40, borderRadius: 30, background: '#2c2a27', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 22, top: 22, fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: C.paperLight, opacity: 0.8}}>REELS</div>
        <div style={{position: 'absolute', left: 28, right: 28, top: 110, fontFamily: F.display, fontSize: 66, lineHeight: 1.02, color: C.paperLight, textTransform: 'uppercase'}}>
          Options se roz
          <div style={{display: 'inline-block', marginTop: 10, background: glow ? C.yellow : 'transparent', color: glow ? C.ink : C.paperLight, padding: '2px 12px 0', transform: 'rotate(-2deg)'}}>₹5,000</div>
        </div>
        {/* a fake "profit screenshot" rising line */}
        <svg width={320} height={150} viewBox="0 0 320 150" style={{position: 'absolute', left: 30, bottom: 120}}>
          <path d="M5,140 L60,120 L110,128 L160,80 L210,92 L260,40 L312,12" fill="none" stroke="#7bd88f" strokeWidth={7} strokeLinejoin="round" />
          <path d="M290,10 L314,10 L314,34" fill="none" stroke="#7bd88f" strokeWidth={7} strokeLinecap="round" />
        </svg>
        {/* play button + like/share rail */}
        <svg width={70} height={70} viewBox="0 0 70 70" style={{position: 'absolute', right: 26, bottom: 220, opacity: 0.85}}>
          <circle cx={35} cy={35} r={30} fill="none" stroke={C.paperLight} strokeWidth={5} />
          <path d="M28,22 L50,35 L28,48 Z" fill={C.paperLight} />
        </svg>
        <div style={{position: 'absolute', left: 30, bottom: 50, fontFamily: F.mono, fontWeight: 500, fontSize: 22, color: C.paperLight, opacity: 0.7}}>@trading_guru · follow</div>
      </div>
    </div>
  );
};

// Ice block that melts: height shrinks to `left` (0..1) of its full height.
export const Ice: React.FC<{w: number; h: number; left: number; label?: string}> = ({w, h, left, label}) => {
  const hh = Math.max(8, h * left);
  return (
    <div style={{width: w, height: h, position: 'relative'}}>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: hh, background: C.yellow, border: `4px solid ${C.ink}`, borderRadius: '10px 10px 4px 4px',
        boxShadow: 'inset -10px -10px 0 rgba(0,0,0,0.07)'}}>
        {label && left > 0.4 ? <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 18, letterSpacing: 2, textAlign: 'center', marginTop: 8}}>{label}</div> : null}
      </div>
      {/* puddle */}
      <div style={{position: 'absolute', left: -16, right: -16, bottom: -10, height: 16, borderRadius: '50%', background: 'rgba(245,197,24,0.45)', transform: `scaleX(${0.5 + (1 - left) * 0.7})`}} />
    </div>
  );
};

export const lerp = (frame: number, a: number, b: number, from: number, to: number) => interpolate(stepped(frame), [a, b], [from, to], clamp);
