import React, {useContext} from 'react';
import {useCurrentFrame} from 'remotion';
import {Sfx} from '../../components/paper';
import {ease, pop, stepped} from '../../lib/motion';
import {SceneCtx, useTL} from '../../lib/timeline';
import {C, F} from '../../theme';

// Scene-local start frame of the i-th word of a line (for repeated or
// ambiguous words such as "OT" inside "Doctor").
export const useWordAt = () => {
  const scene = useContext(SceneCtx);
  const tl = useTL();
  return (id: string, i: number, offset = 0) => {
    const l = tl.lines.find((x) => x.id === id);
    if (!l) throw new Error('unknown line ' + id);
    return l.words[Math.min(i, l.words.length - 1)].start - scene.start + offset;
  };
};

export const grid = (cell = 40, color = 'rgba(70, 110, 150, 0.16)') => ({
  backgroundImage: `linear-gradient(${color} 1.5px, transparent 1.5px), linear-gradient(90deg, ${color} 1.5px, transparent 1.5px)`,
  backgroundSize: `${cell}px ${cell}px`,
});

export const hatch = (color = C.red, gap = 14) => ({
  backgroundImage: `repeating-linear-gradient(-45deg, ${color} 0 3px, transparent 3px ${gap}px)`,
});

// Pops in (on twos) at `at`; invisible but space-holding before.
export const Appear: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, children, style}) => {
  const frame = useCurrentFrame();
  if (stepped(frame) < at) return <span style={{opacity: 0, ...style}}>{children}</span>;
  const p = Math.min(1.06, pop(frame, at));
  return <span style={{display: 'inline-block', transform: `translateY(${(1 - p) * -24}px) scale(${0.85 + 0.15 * p})`, ...style}}>{children}</span>;
};

// Hand-drawn tick, drawn on over a few frames.
export const Tick: React.FC<{at: number; size?: number; color?: string; sound?: boolean}> = ({at, size = 56, color = C.ink, sound = true}) => {
  const frame = useCurrentFrame();
  const p = ease(stepped(frame), at, at + 6);
  return (
    <>
      {sound ? <Sfx at={at} name="marker" volume={0.25} /> : null}
      <svg width={size} height={size} viewBox="0 0 60 60" style={{overflow: 'visible', opacity: frame >= at ? 1 : 0}}>
        <path d="M8,32 L24,48 L54,10" pathLength={1} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - p} />
      </svg>
    </>
  );
};

// Hospital room door with a hanging price tag.
export const Door: React.FC<{room: string; price: string; tag: string; hot?: boolean}> = ({room, price, tag, hot}) => (
  <div style={{position: 'absolute', inset: 0}}>
    <div style={{position: 'absolute', left: 30, right: 30, top: 30, bottom: 0, border: `5px solid ${C.ink}`, borderBottom: 'none', background: hot ? '#efe6cf' : C.paperLight}}>
      <div style={{position: 'absolute', left: 24, right: 24, top: 24, height: 150, border: `3px solid ${C.inkSoft}`, background: 'rgba(143,137,125,0.18)'}} />
      <div style={{position: 'absolute', left: 24, right: 24, top: 200, height: 150, border: `3px solid ${C.inkSoft}`}} />
      <div style={{position: 'absolute', right: 26, top: 250, width: 30, height: 30, borderRadius: 15, background: C.ink}} />
    </div>
    <div style={{position: 'absolute', left: 70, top: 56, background: C.ink, color: C.paperLight, fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, padding: '6px 12px'}}>{room}</div>
    <div style={{position: 'absolute', left: 40, right: 40, top: 150, transform: `rotate(${hot ? 3 : -3}deg)`, background: hot ? C.yellow : C.card, border: `3px solid ${C.ink}`, padding: '14px 10px 12px', textAlign: 'center', boxShadow: `4px 7px 8px ${C.shadow}`}}>
      <div style={{fontFamily: F.display, fontSize: 76, lineHeight: 1}}>{price}</div>
      <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: 2, marginTop: 6}}>/ DIN</div>
      <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, marginTop: 10, background: C.ink, color: C.paperLight, padding: '4px 6px'}}>{tag}</div>
    </div>
  </div>
);

// One itemised line of the hospital bill. At `cutAt` the strip below the label
// is sliced to `ratio` (yellow = paid, red hatch = cut); ratio 1 = paid in full.
export const BillLine: React.FC<{top: number; at: number; cutAt: number; newAt: number; label: string; sub: string; amount: string; paid: string; ratio: number}> = ({top, at, cutAt, newAt, label, sub, amount, paid, ratio}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at) return null;
  const inP = Math.min(1.05, pop(frame, at));
  const cut = ease(f, cutAt, cutAt + 8);
  const W = 520;
  const full = ratio >= 1;
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top, height: 140, transform: `translateX(${(1 - inP) * 60}px)`, opacity: Math.min(1, inP * 1.5), borderBottom: `3px dashed ${C.grey}`}}>
      <div style={{position: 'absolute', left: 0, top: 6, fontFamily: F.display, fontSize: 50, lineHeight: 1, whiteSpace: 'nowrap'}}>{label}</div>
      <div style={{position: 'absolute', left: 0, top: 60, fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: 2, color: C.inkSoft, whiteSpace: 'nowrap'}}>{sub}</div>
      <div style={{position: 'absolute', left: 0, top: 92, width: W, height: 32, border: `3px solid ${C.ink}`, background: C.paperLight, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(full ? cut : ratio * cut + (1 - cut)) * 100}%`, background: cut > 0 ? C.yellow : 'transparent'}} />
        {!full ? <div style={{position: 'absolute', left: `${ratio * 100}%`, right: 0, top: 0, bottom: 0, opacity: cut, ...hatch()}} /> : null}
        {full && f >= cutAt ? <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: 3, opacity: cut}}>NO KATAUTI</div> : null}
        {!full && cut > 0 ? <div style={{position: 'absolute', left: `${ratio * 100}%`, top: -4, bottom: -4, width: 4, background: C.ink}} /> : null}
      </div>
      <div style={{position: 'absolute', right: 0, top: 4, fontFamily: F.display, fontSize: 62, lineHeight: 1, color: f >= cutAt && !full ? C.inkSoft : C.ink}}>
        {amount}
        {f >= cutAt && !full ? <div style={{position: 'absolute', left: -6, right: -6, top: '52%', height: 6, background: C.red, transform: `scaleX(${cut}) rotate(-3deg)`, transformOrigin: 'left'}} /> : null}
      </div>
      {f >= newAt ? (
        <div style={{position: 'absolute', right: 0, top: 74, fontFamily: F.display, fontSize: 52, lineHeight: 1}}>
          <Appear at={newAt}><span style={{background: C.yellow, padding: '2px 10px'}}>{full ? '✓ ' : '→ '}{paid}</span></Appear>
        </div>
      ) : null}
      <Sfx at={cutAt} name="slide" volume={0.25} />
    </div>
  );
};

// Fine-print line placeholder (grey bar) for the policy-wording page.
export const FinePrint: React.FC<{w: number}> = ({w}) => (
  <div style={{height: 12, width: w, background: 'rgba(74,71,65,0.35)', borderRadius: 2, margin: '16px 0'}} />
);
