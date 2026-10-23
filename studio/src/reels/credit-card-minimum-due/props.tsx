import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Card, CardProps} from '../../components/paper';
import {stepped} from '../../lib/motion';
import {C, F} from '../../theme';

export const grid = (cell = 40, color = 'rgba(70, 110, 150, 0.16)') => ({
  backgroundImage: `linear-gradient(${color} 1.5px, transparent 1.5px), linear-gradient(90deg, ${color} 1.5px, transparent 1.5px)`,
  backgroundSize: `${cell}px ${cell}px`,
});

// A paper cut-out of a generic credit card (no real bank or network).
export const CreditCard: React.FC<Omit<CardProps, 'children' | 'bg'>> = (p) => (
  <Card {...p} bg="#23211f" texture="kraft" torn={{}} rough={4}>
    <div style={{position: 'absolute', inset: 0, padding: `${p.h * 0.1}px ${p.w * 0.08}px`, color: C.paperLight}}>
      <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: p.w * 0.05, letterSpacing: 4}}>CREDIT CARD</div>
      <div style={{width: p.w * 0.16, height: p.h * 0.2, background: '#c9a646', borderRadius: 8, marginTop: p.h * 0.1, border: '2px solid #8a7130'}} />
      <div style={{fontFamily: F.mono, fontWeight: 500, fontSize: p.w * 0.05, letterSpacing: 3, marginTop: p.h * 0.1, whiteSpace: 'nowrap'}}>XXXX XXXX XXXX 4821</div>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: F.mono, fontSize: p.w * 0.034, letterSpacing: 2, marginTop: p.h * 0.06, whiteSpace: 'nowrap', opacity: 0.85}}>
        <span>AAPKA NAAM</span>
        <span>VALID 11/30</span>
      </div>
    </div>
  </Card>
);

// One line on a statement / receipt: label left, amount right.
export const Row: React.FC<{label: React.ReactNode; value?: React.ReactNode; size?: number; bold?: boolean; show?: boolean; style?: React.CSSProperties}> = ({label, value, size = 40, bold, show = true, style}) => (
  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: bold ? F.display : F.type, fontSize: size, lineHeight: 1.15, padding: '14px 0', borderBottom: `2px dashed ${C.grey}`, opacity: show ? 1 : 0, ...style}}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

// Typewriter text: characters appear in stepped beats from `at`.
export const Typed: React.FC<{text: string; at: number; cps?: number}> = ({text, at, cps = 2.2}) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((stepped(frame) - at) * cps)));
  return (
    <>
      {text.slice(0, n)}
      <span style={{opacity: 0}}>{text.slice(n)}</span>
    </>
  );
};
