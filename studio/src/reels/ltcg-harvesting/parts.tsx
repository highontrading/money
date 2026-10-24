import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Card, CardProps} from '../../components/paper';
import {ease, pop, stepped} from '../../lib/motion';
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
export const Pop: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, children, style}) => {
  const frame = useCurrentFrame();
  if (stepped(frame) < at) return null;
  const p = Math.min(1.06, pop(frame, at, 11, 0.5));
  return <div style={{transform: `scale(${0.7 + 0.3 * p})`, transformOrigin: 'left center', ...style}}>{children}</div>;
};

// Hand-drawn tick that writes itself on.
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

// Perforation: a dashed vertical line with notches at both ends.
const Perf: React.FC<{x: number; h: number; r?: number}> = ({x, h, r = 16}) => (
  <>
    <div style={{position: 'absolute', left: x - 2, top: r + 4, height: h - 2 * r - 8, borderLeft: `4px dashed ${C.ink}`, opacity: 0.55}} />
    <div style={{position: 'absolute', left: x - r, top: -r, width: 2 * r, height: 2 * r, borderRadius: '50%', background: C.paper, boxShadow: `inset 0 -2px 3px rgba(0,0,0,0.18)`}} />
    <div style={{position: 'absolute', left: x - r, top: h - r, width: 2 * r, height: 2 * r, borderRadius: '50%', background: C.paper, boxShadow: `inset 0 2px 3px rgba(0,0,0,0.18)`}} />
  </>
);

// The big "tax-free coupon": yellow stub on the left, the offer on the right.
export const Coupon: React.FC<Omit<CardProps, 'children' | 'bg'> & {value?: React.ReactNode; title?: string}> = ({value, title = 'Har saal · aapke naam', ...card}) => {
  const {w, h} = card;
  const stub = Math.round(w * 0.24);
  return (
    <Card {...card} bg={C.paperLight} rough={card.rough ?? 6}>
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: stub, background: C.yellow}} />
      <div style={{position: 'absolute', left: stub / 2 - h / 2, top: h / 2 - 50, width: h, height: 100, transform: 'rotate(-90deg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: F.display, fontSize: Math.round(h * 0.17), letterSpacing: 2, color: C.ink, whiteSpace: 'nowrap'}}>TAX-FREE</div>
      <Perf x={stub} h={h} />
      <div style={{position: 'absolute', left: stub + 18, right: 18, top: 16, bottom: 16, border: `3px dashed ${C.inkSoft}`, opacity: 0.45}} />
      <div style={{position: 'absolute', left: stub + 44, right: 36, top: 34}}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: Math.round(h * 0.06), letterSpacing: 3, color: C.inkSoft, textTransform: 'uppercase'}}>{title}</div>
        <div style={{fontFamily: F.display, fontSize: Math.round(h * 0.26), lineHeight: 1.05, marginTop: 6}}>₹1.25 LAKH</div>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: Math.round(h * 0.055), letterSpacing: 2, marginTop: 2}}>LONG-TERM PROFIT · TAX-FREE</div>
      </div>
      <div style={{position: 'absolute', left: stub + 44, right: 36, bottom: 34, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: Math.round(h * 0.05), letterSpacing: 2, color: C.inkSoft}}>VALID TILL MARCH</div>
        {value !== undefined ? (
          <div style={{textAlign: 'right'}}>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: Math.round(h * 0.045), letterSpacing: 2}}>KEEMAT</div>
            <div style={{fontFamily: F.display, fontSize: Math.round(h * 0.17), lineHeight: 1}}>{value}</div>
          </div>
        ) : null}
      </div>
    </Card>
  );
};

// A small coupon for coupon books and rows. state: plain | used | expired | faded.
export const Mini: React.FC<{x: number; y: number; w?: number; h?: number; label?: string; state?: 'plain' | 'used' | 'expired' | 'faded'; hi?: boolean; rot?: number}> = ({x, y, w = 160, h = 110, label = '₹1.25L', state = 'plain', hi = false, rot = 0}) => {
  const stub = Math.round(w * 0.22);
  const faded = state === 'faded' || state === 'expired';
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${rot}deg)`, filter: `drop-shadow(3px 5px 4px ${C.shadow})`}}>
      <div style={{position: 'absolute', inset: 0, background: hi ? C.yellow : C.paperLight, border: `3px solid ${C.ink}`, boxSizing: 'border-box', opacity: faded ? 0.55 : 1}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: stub, background: hi ? C.paperLight : C.yellow, borderRight: `3px dashed ${C.ink}`}} />
        <div style={{position: 'absolute', left: stub, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: Math.round(Math.min(h * 0.3, w * 0.2)), whiteSpace: 'nowrap'}}>{label}</div>
      </div>
      {state === 'used' ? (
        <div style={{position: 'absolute', right: -14, top: -16, width: 48, height: 48, borderRadius: '50%', background: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width={30} height={30} viewBox="0 0 60 60"><path d="M10,32 L25,46 L52,14" fill="none" stroke={C.paperLight} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      ) : null}
      {state === 'expired' ? (
        <svg width={w} height={h} style={{position: 'absolute', inset: 0}}>
          <path d={`M${w * 0.12},${h * 0.15} L${w * 0.88},${h * 0.85} M${w * 0.88},${h * 0.15} L${w * 0.12},${h * 0.85}`} fill="none" stroke={C.red} strokeWidth={7} strokeLinecap="round" opacity={0.9} />
        </svg>
      ) : null}
    </div>
  );
};
