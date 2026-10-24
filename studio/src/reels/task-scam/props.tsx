import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Sfx} from '../../components/paper';
import {boil, clamp, ease, pop, stepped} from '../../lib/motion';
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

// Chat bubble that pops in inside a phone screen (relative positioning, stacks top-down).
export const Bubble: React.FC<{at: number; side?: 'left' | 'right'; tone?: 'paper' | 'yellow' | 'red'; who?: string; children: React.ReactNode}> = ({at, side = 'left', tone = 'paper', who, children}) => {
  const frame = useCurrentFrame();
  if (stepped(frame) < at) return null;
  const p = Math.min(1.05, pop(frame, at));
  const bg = tone === 'yellow' ? C.yellow : tone === 'red' ? '#F3D3CB' : C.paperLight;
  return (
    <div style={{display: 'flex', justifyContent: side === 'left' ? 'flex-start' : 'flex-end', marginTop: 14, transform: `scale(${0.85 + 0.15 * p})`, transformOrigin: side === 'left' ? 'left top' : 'right top', opacity: Math.min(1, p * 1.4)}}>
      <Sfx at={at} name="pop" volume={0.25} />
      <div style={{maxWidth: '86%', background: bg, border: `3px solid ${C.ink}`, borderRadius: side === 'left' ? '4px 22px 22px 22px' : '22px 4px 22px 22px', padding: '12px 18px', boxShadow: `3px 4px 0 ${C.ink}`}}>
        {who ? <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 18, letterSpacing: 1.5, color: C.inkSoft, marginBottom: 4}}>{who}</div> : null}
        <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 34, lineHeight: 1.12, color: C.ink}}>{children}</div>
      </div>
    </div>
  );
};

// Paper phone: dark bezel, cream screen with a plain-text app header.
export const PhoneBody: React.FC<{w: number; h: number; app: string; children?: React.ReactNode}> = ({w, h, app, children}) => (
  <div style={{position: 'absolute', inset: 0, background: C.ink, borderRadius: 48, padding: 18}}>
    <div style={{position: 'absolute', left: w / 2 - 50, top: 16, width: 100, height: 14, borderRadius: 7, background: '#333'}} />
    <div style={{position: 'absolute', left: 18, top: 40, width: w - 36, height: h - 76, background: C.card, borderRadius: 26, overflow: 'hidden'}}>
      <div style={{background: '#2a2826', color: C.paperLight, fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, padding: '14px 22px'}}>{app}</div>
      <div style={{padding: '4px 18px'}}>{children}</div>
    </div>
  </div>
);

// Hand-drawn thumbs-up "like" button.
export const Thumb: React.FC<{size?: number; fill?: string}> = ({size = 120, fill = C.paperLight}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible'}}>
    <rect x={8} y={44} width={18} height={44} rx={3} fill={C.ink} />
    <path d="M30,46 L46,14 C50,6 62,10 60,22 L56,38 L84,38 C92,38 96,46 92,54 L84,82 C82,88 78,90 72,90 L30,90 Z" fill={fill} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
  </svg>
);

// Fishing hook with the bait hanging off it.
export const FishHook: React.FC<{h?: number; color?: string}> = ({h = 300, color = C.ink}) => (
  <svg width={h * 0.55} height={h} viewBox="0 0 110 200" style={{overflow: 'visible'}}>
    <line x1={55} y1={-60} x2={55} y2={20} stroke={color} strokeWidth={3} />
    <path d="M55,20 L55,140 C55,190 10,190 12,150 L28,162" fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={55} cy={18} r={8} fill="none" stroke={color} strokeWidth={5} />
  </svg>
);

// Simple paper-doll group member: circle head + shoulders. `same` turns every face into one face.
export const Doll: React.FC<{size?: number; fill?: string; face?: 'smile' | 'same'}> = ({size = 90, fill = C.paperLight, face = 'smile'}) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 100 120" style={{overflow: 'visible'}}>
    <path d="M10,118 C10,80 30,70 50,70 C70,70 90,80 90,118 Z" fill={fill} stroke={C.ink} strokeWidth={5} />
    <circle cx={50} cy={40} r={26} fill={fill} stroke={C.ink} strokeWidth={5} />
    {face === 'smile' ? (
      <>
        <circle cx={41} cy={36} r={3.5} fill={C.ink} /><circle cx={59} cy={36} r={3.5} fill={C.ink} />
        <path d="M38,48 Q50,58 62,48" fill="none" stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
      </>
    ) : (
      <>
        <rect x={30} y={30} width={40} height={10} fill={C.ink} />
        <path d="M40,52 L60,52" stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
      </>
    )}
  </svg>
);

// The scam as a staircase: four steps rising left to right, then a trapdoor.
// `active` = index of the current step (0-3), `fallAt` opens the trapdoor.
const STEP_LABELS = ['CHHOTA PAISA', 'GROUP', 'PREPAID', 'BADA TASK'];
export const Stairs: React.FC<{x: number; y: number; active: number; at: number; out?: number; fallAt?: number; done?: number}> = ({x, y, active, at, out, fallAt, done = active}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at || (out !== undefined && f >= out)) return null;
  const p = Math.min(1, ease(f, at, at + 8));
  const sw = 172, base = 160;
  const hs = [46, 78, 110, 142];
  const fall = fallAt !== undefined ? ease(f, fallAt, fallAt + 14) : 0;
  const b = boil('stairs', frame, 0.8);
  const manX = active * sw + sw / 2;
  const manY = base - hs[active];
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 4 * sw + 200, height: base + 40, opacity: p, transform: `translate(${b.x}px, ${b.y}px)`, zIndex: 30}}>
      <svg width={4 * sw + 200} height={base + 60} style={{overflow: 'visible'}}>
        {hs.map((h, i) => (
          <g key={i}>
            <rect x={i * sw} y={base - h} width={sw} height={h} fill={i === active && fall === 0 ? C.yellow : i < done || i === active ? C.paperLight : C.card} stroke={C.ink} strokeWidth={4} opacity={i <= Math.max(done, active) ? 1 : 0.45} />
            <text x={i * sw + sw / 2} y={base - h + 30} textAnchor="middle" fontFamily="IBM Plex Mono" fontWeight={700} fontSize={17} letterSpacing={1} fill={C.ink}>{`${i + 1}. ${STEP_LABELS[i]}`}</text>
          </g>
        ))}
        {/* trapdoor: a lid that swings down into a black hole */}
        <rect x={4 * sw + 10} y={base - 142} width={160} height={142} fill={fall > 0 ? C.ink : 'none'} stroke={C.ink} strokeWidth={4} strokeDasharray={fall > 0 ? undefined : '10 8'} />
        <g transform={`rotate(${fall * 80}, ${4 * sw + 10}, ${base - 142})`}>
          <rect x={4 * sw + 10} y={base - 150} width={160} height={10} fill={C.red} stroke={C.ink} strokeWidth={2} />
        </g>
        <text x={4 * sw + 90} y={base - 156} textAnchor="middle" fontFamily="IBM Plex Mono" fontWeight={700} fontSize={17} fill={C.red} opacity={fall > 0 || active === 3 ? 1 : 0}>TRAPDOOR</text>
        {/* "you": a small figure on the active step, drops through the trapdoor */}
        <g transform={`translate(${fall > 0 ? 4 * sw + 90 : manX}, ${fall > 0 ? manY + fall * 160 : manY}) scale(${1 - fall * 0.5})`} opacity={1 - fall}>
          <circle cx={0} cy={-56} r={13} fill={C.paperLight} stroke={C.ink} strokeWidth={4} />
          <path d="M-16,-6 C-16,-34 16,-34 16,-6 Z" fill={C.red} stroke={C.ink} strokeWidth={4} />
          <text x={0} y={-78} textAnchor="middle" fontFamily="Caveat" fontWeight={700} fontSize={26} fill={C.ink}>aap</text>
        </g>
      </svg>
      {fallAt !== undefined && f >= fallAt ? <Sfx at={fallAt} name="whoosh" volume={0.4} /> : null}
    </div>
  );
};

// Clock whose hand sweeps from `at` for `dur` frames.
export const Clock: React.FC<{size?: number; at: number; dur?: number}> = ({size = 260, at, dur = 60}) => {
  const frame = useCurrentFrame();
  const a = interpolate(stepped(frame), [at, at + dur], [0, 300], clamp);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx={50} cy={50} r={44} fill={C.paperLight} stroke={C.ink} strokeWidth={5} />
      {Array.from({length: 12}).map((_, i) => (
        <line key={i} x1={50} y1={10} x2={50} y2={i % 3 ? 15 : 18} stroke={C.ink} strokeWidth={i % 3 ? 2 : 4} transform={`rotate(${i * 30} 50 50)`} />
      ))}
      <path d={`M50,50 L50,10 A40,40 0 ${a > 180 ? 1 : 0} 1 ${50 + 40 * Math.sin((a * Math.PI) / 180)},${50 - 40 * Math.cos((a * Math.PI) / 180)} Z`} fill={C.red} opacity={0.3} />
      <line x1={50} y1={50} x2={50 + 34 * Math.sin((a * Math.PI) / 180)} y2={50 - 34 * Math.cos((a * Math.PI) / 180)} stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
      <circle cx={50} cy={50} r={5} fill={C.ink} />
    </svg>
  );
};

// Horizontal meter that fills between `at` and `at + dur`.
export const Meter: React.FC<{w: number; label: string; at: number; dur?: number; to?: number; color?: string}> = ({w, label, at, dur = 30, to = 1, color = C.yellow}) => {
  const frame = useCurrentFrame();
  const p = ease(stepped(frame), at, at + dur, 0, to);
  return (
    <div style={{width: w}}>
      <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 2, marginBottom: 8}}>{label}</div>
      <div style={{height: 46, border: `4px solid ${C.ink}`, background: C.paperLight, position: 'relative'}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${p * 100}%`, background: color}} />
      </div>
    </div>
  );
};

// Inline text that pops in on its beat (keeps its layout space while hidden).
export const Appear: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => {
  const frame = useCurrentFrame();
  const shown = stepped(frame) >= at;
  const p = shown ? Math.min(1.05, pop(frame, at)) : 0;
  return <span style={{display: 'inline-block', visibility: shown ? 'visible' : 'hidden', transform: `translateY(${(1 - p) * -24}px) scale(${0.9 + 0.1 * p})`}}>{children}</span>;
};
