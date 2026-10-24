import React, {useContext} from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {Sfx, usePlacement} from '../../components/paper';
import {pop, stepped} from '../../lib/motion';
import {SceneCtx, useTL} from '../../lib/timeline';
import {C, F} from '../../theme';

// Scene-local frame of the i-th word of a line (needles like "₹1" would also match "₹1,000").
export const useWordAt = () => {
  const tl = useTL();
  const scene = useContext(SceneCtx);
  return (id: string, i: number, offset = 0) => {
    const l = tl.lines.find((x) => x.id === id);
    if (!l) throw new Error('unknown line ' + id);
    const w = l.words[Math.min(i, l.words.length - 1)];
    return w.start - scene.start + offset;
  };
};

export const Show: React.FC<{from?: number; until?: number; children: React.ReactNode}> = ({from = 0, until, children}) => {
  const frame = useCurrentFrame();
  if (frame < from || (until !== undefined && frame >= until)) return null;
  return <>{children}</>;
};

// Inline element that pops in on its beat (keeps its space before it appears).
export const Pop: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, children, style}) => {
  const frame = useCurrentFrame();
  if (stepped(frame) < at) return <span style={{display: 'inline-block', opacity: 0, ...style}}>{children}</span>;
  const p = Math.min(1.06, pop(frame, at));
  return <span style={{display: 'inline-block', transform: `translateY(${(1 - p) * -24}px) scale(${0.9 + 0.1 * p})`, ...style}}>{children}</span>;
};

const TAG_CLIP = 'polygon(50% 0%, 100% 13%, 100% 100%, 0% 100%, 0% 13%)';

// A shop price tag hanging on a string: drops in, then sways and settles.
export const Tag: React.FC<{id: string; x: number; y: number; w: number; h: number; rot?: number; at: number; out?: number; bg?: string; string?: number; children: React.ReactNode}> = ({id, x, y, w, h, rot = 0, at, out, bg = C.card, string = 40, children}) => {
  const frame = useCurrentFrame();
  const pl = usePlacement(id, at, 'drop', out, 'up');
  const audio = <Sfx at={at} name="drop" volume={0.3} />;
  if (!pl.visible) return audio;
  const t = Math.max(0, stepped(frame) - at);
  const sway = 5 * Math.exp(-t / 18) * Math.sin(t / 3.2);
  return (
    <>
      {audio}
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: pl.o, transformOrigin: '50% 0%', transform: `translate(${pl.x}px, ${pl.y}px) rotate(${rot + pl.r + sway}deg) scale(${pl.s})`, filter: `drop-shadow(0 1px 0.5px rgba(0,0,0,0.28)) drop-shadow(6px 10px 10px ${C.shadow})`}}>
        <svg width={w} height={string + 30} style={{position: 'absolute', left: 0, top: -string, overflow: 'visible'}}>
          <path d={`M${w / 2},0 Q${w / 2 + 8},${string * 0.6} ${w / 2},${string + 22}`} fill="none" stroke={C.inkSoft} strokeWidth={3} />
        </svg>
        <div style={{position: 'absolute', inset: 0, clipPath: TAG_CLIP, background: bg, overflow: 'hidden'}}>
          <Img src={staticFile('img/proc/tex_paper.jpg')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply', opacity: 0.5}} />
          <div style={{position: 'absolute', left: w / 2 - 15, top: h * 0.075, width: 30, height: 30, borderRadius: 15, background: C.paper, boxShadow: 'inset 2px 3px 4px rgba(0,0,0,0.35)', border: `3px solid ${C.inkSoft}`}} />
          <div style={{position: 'absolute', inset: 0}}>{children}</div>
        </div>
      </div>
    </>
  );
};

// Paper cut-out brain with felt-tip folds.
export const Brain: React.FC<{w: number}> = ({w}) => {
  const h = w * 0.72;
  return (
    <svg width={w} height={h} viewBox="0 0 200 144" style={{overflow: 'visible'}}>
      <path d="M40,120 C10,118 4,88 18,72 C2,52 18,24 44,28 C52,6 88,4 100,20 C114,2 150,6 156,28 C186,26 198,58 182,74 C196,94 182,122 154,118 C146,138 116,140 104,126 C92,140 58,138 52,124 C48,124 44,122 40,120 Z"
        fill="#F2D7CF" stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
      <path d="M100,22 C96,50 104,80 98,126" fill="none" stroke={C.ink} strokeWidth={3.5} strokeLinecap="round" />
      {['M44,46 C58,44 64,58 76,54', 'M30,82 C46,74 58,92 74,84', 'M56,108 C66,98 80,108 86,100', 'M126,44 C138,56 152,44 164,54', 'M120,84 C134,74 146,92 168,82', 'M122,110 C134,100 146,112 150,104', 'M68,30 C70,40 80,38 82,46', 'M138,26 C134,36 140,40 136,48']
        .map((d, i) => <path key={i} d={d} fill="none" stroke={C.ink} strokeWidth={3} strokeLinecap="round" />)}
    </svg>
  );
};

export const Magnifier: React.FC<{r: number}> = ({r}) => (
  <svg width={r * 3.2} height={r * 3.2} style={{overflow: 'visible'}}>
    <circle cx={r + 10} cy={r + 10} r={r} fill="rgba(255,255,255,0.18)" stroke={C.ink} strokeWidth={14} />
    <circle cx={r + 10} cy={r + 10} r={r - 10} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={4} strokeDasharray="30 400" />
    <line x1={r + 10 + r * 0.72} y1={r + 10 + r * 0.72} x2={r * 2.9} y2={r * 2.9} stroke={C.ink} strokeWidth={26} strokeLinecap="round" />
  </svg>
);

export const Anchor: React.FC<{size: number; color?: string}> = ({size, color = C.ink}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible'}}>
    <circle cx={50} cy={14} r={9} fill="none" stroke={color} strokeWidth={6} />
    <line x1={50} y1={23} x2={50} y2={88} stroke={color} strokeWidth={8} strokeLinecap="round" />
    <line x1={32} y1={36} x2={68} y2={36} stroke={color} strokeWidth={7} strokeLinecap="round" />
    <path d="M14,62 C18,84 36,92 50,92 C64,92 82,84 86,62" fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" />
    <path d="M6,68 L14,56 L24,68 M76,68 L86,56 L94,68" fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Glasses: React.FC<{w: number}> = ({w}) => (
  <svg width={w} height={w * 0.42} viewBox="0 0 200 84" style={{overflow: 'visible'}}>
    <circle cx={50} cy={46} r={34} fill="rgba(245,197,24,0.35)" stroke={C.ink} strokeWidth={8} />
    <circle cx={150} cy={46} r={34} fill="rgba(245,197,24,0.35)" stroke={C.ink} strokeWidth={8} />
    <path d="M84,42 C94,32 106,32 116,42" fill="none" stroke={C.ink} strokeWidth={7} />
    <path d="M16,40 L2,22 M184,40 L198,22" fill="none" stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
  </svg>
);

// A price whose every "9" gets its own highlighter swipe at `at`.
export const Nines: React.FC<{text: string; at: number}> = ({text, at}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {text.split('').map((ch, i) => {
        if (ch !== '9') return <span key={i}>{ch}</span>;
        const on = stepped(frame) >= at + i;
        return (
          <span key={i} style={{position: 'relative', display: 'inline-block', isolation: 'isolate'}}>
            {on ? <span style={{position: 'absolute', left: '-0.04em', right: '-0.04em', top: '6%', bottom: '4%', background: C.yellow, zIndex: -1, transform: 'skewX(-5deg)'}} /> : null}
            {ch}
          </span>
        );
      })}
    </>
  );
};

export const mono = (size: number): React.CSSProperties => ({fontFamily: F.mono, fontWeight: 700, fontSize: size, letterSpacing: size * 0.12, textTransform: 'uppercase'});
