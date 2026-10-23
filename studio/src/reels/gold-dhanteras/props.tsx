import React from 'react';
import {random, useCurrentFrame} from 'remotion';
import {Card, HL, Sfx, usePlacement} from '../../components/paper';
import {ease, stepped} from '../../lib/motion';
import {C, F} from '../../theme';

const GOLD = '#E3B23C';
const GOLD_DARK = '#8C6510';
const GOLD_LIGHT = '#F7DD8A';

// A gold chain cut out of a catalogue: oval links along a hanging curve, with a small pendant.
export const Chain: React.FC<{w: number; h: number; links?: number; seed?: string}> = ({w, h, links = 34, seed = 'ch'}) => {
  const cx = w / 2, R = w / 2 - 50, top = 40, D = h - 130;
  const pts = Array.from({length: links}, (_, i) => {
    const t = Math.PI * (0.04 + 0.92 * (i / (links - 1)));
    const x = cx - R * Math.cos(t);
    const y = top + D * Math.sin(t);
    const ang = (Math.atan2(D * Math.cos(t), R * Math.sin(t)) * 180) / Math.PI;
    return {x, y, ang};
  });
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      {pts.map((p, i) => {
        const flat = i % 2 === 1;
        const rx = 15, ry = flat ? 4 : 9;
        const j = (random(seed + i) - 0.5) * 2;
        return (
          <g key={i} transform={`translate(${p.x + j}, ${p.y}) rotate(${p.ang})`}>
            <ellipse rx={rx} ry={ry} fill="none" stroke={GOLD_DARK} strokeWidth={8} />
            <ellipse rx={rx} ry={ry} fill="none" stroke={GOLD} strokeWidth={5} />
            <ellipse rx={rx - 2} ry={Math.max(1, ry - 2)} fill="none" stroke={GOLD_LIGHT} strokeWidth={1.6} strokeDasharray="6 18" />
          </g>
        );
      })}
      <g transform={`translate(${cx}, ${top + D + 52})`}>
        <line x1={0} y1={-44} x2={0} y2={-20} stroke={GOLD_DARK} strokeWidth={6} />
        <path d="M0,-22 C30,-10 34,30 0,58 C-34,30 -30,-10 0,-22 Z" fill={GOLD} stroke={GOLD_DARK} strokeWidth={5} />
        <path d="M-8,-4 C-18,10 -16,26 -6,38" fill="none" stroke={GOLD_LIGHT} strokeWidth={4} strokeLinecap="round" />
      </g>
    </svg>
  );
};

// Gold "biscuit" with stamped markings, cut out of paper.
export const GoldBar: React.FC<{id: string; x: number; y: number; w: number; h: number; at: number; out?: number; rot?: number; children?: React.ReactNode}> = ({id, x, y, w, h, at, out, rot = 0, children}) => {
  const pl = usePlacement(id, at, 'drop', out, 'left');
  const audio = <Sfx at={at} name="drop" volume={0.3} />;
  if (!pl.visible) return audio;
  const inset = w * 0.1;
  return (
    <>
      {audio}
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `translate(${pl.x}px, ${pl.y}px) rotate(${rot + pl.r}deg) scale(${pl.s})`, opacity: pl.o, filter: `drop-shadow(0 1px 0.5px rgba(0,0,0,0.3)) drop-shadow(6px 10px 12px ${C.shadow})`}}>
        <div style={{position: 'absolute', inset: 0, clipPath: `polygon(${inset}px 0, ${w - inset}px 0, ${w}px ${h}px, 0 ${h}px)`, background: `linear-gradient(160deg, ${GOLD_LIGHT} 0%, ${GOLD} 38%, #C9962A 70%, ${GOLD} 100%)`}} />
        <div style={{position: 'absolute', left: inset + 20, right: inset + 20, top: 18, height: h * 0.3, clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)', background: 'rgba(255,248,220,0.35)'}} />
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: GOLD_DARK}}>{children}</div>
      </div>
    </>
  );
};

// Two-pan balance; tilt in degrees (positive = left pan lower).
export const Scale: React.FC<{w: number; h: number; tilt: number; left?: React.ReactNode; right?: React.ReactNode}> = ({w, h, tilt, left, right}) => {
  const cx = w / 2, beamY = 130, arm = w * 0.36;
  const rad = (tilt * Math.PI) / 180;
  const lx = cx - arm * Math.cos(rad), ly = beamY + arm * Math.sin(rad);
  const rx = cx + arm * Math.cos(rad), ry = beamY - arm * Math.sin(rad);
  const drop = 230;
  const pan = (x: number, y: number, key: string, content?: React.ReactNode) => (
    <g key={key}>
      <line x1={x} y1={y} x2={x - 110} y2={y + drop} stroke={C.ink} strokeWidth={3} />
      <line x1={x} y1={y} x2={x + 110} y2={y + drop} stroke={C.ink} strokeWidth={3} />
      <path d={`M${x - 130},${y + drop} Q${x},${y + drop + 70} ${x + 130},${y + drop} Z`} fill={C.paperLight} stroke={C.ink} strokeWidth={5} />
      <foreignObject x={x - 130} y={y + drop - 120} width={260} height={124}>{content}</foreignObject>
    </g>
  );
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <rect x={cx - 14} y={beamY} width={28} height={h - beamY - 60} fill={C.ink} />
      <path d={`M${cx - 170},${h - 20} L${cx + 170},${h - 20} L${cx + 120},${h - 70} L${cx - 120},${h - 70} Z`} fill={C.ink} />
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={C.ink} strokeWidth={14} strokeLinecap="round" />
      <circle cx={cx} cy={beamY} r={20} fill={C.yellow} stroke={C.ink} strokeWidth={6} />
      <path d={`M${cx},${beamY - 22} L${cx - 12},${beamY - 70} L${cx + 12},${beamY - 70} Z`} fill={C.ink} />
      {pan(lx, ly, 'l', left)}
      {pan(rx, ry, 'r', right)}
    </svg>
  );
};

// Paper scissors that open and close as they travel along a cut line.
export const Scissors: React.FC<{x: number; y: number; rot?: number; size?: number; phase: number}> = ({x, y, rot = 0, size = 1, phase}) => {
  const open = 10 + 14 * Math.abs(Math.sin(phase));
  return (
    <svg width={260} height={160} style={{position: 'absolute', left: x - 130, top: y - 80, transform: `rotate(${rot}deg) scale(${size})`, overflow: 'visible', zIndex: 75, filter: `drop-shadow(4px 7px 6px ${C.shadow})`}}>
      <g transform="translate(110, 80)">
        <g transform={`rotate(${-open})`}>
          <path d="M0,-6 L-120,-2 L-122,6 L0,8 Z" fill="#cfd2d4" stroke={C.ink} strokeWidth={3} />
          <ellipse cx={58} cy={-6} rx={36} ry={22} fill="none" stroke={C.ink} strokeWidth={12} />
          <ellipse cx={58} cy={-6} rx={36} ry={22} fill="none" stroke={C.red} strokeWidth={7} />
        </g>
        <g transform={`rotate(${open})`}>
          <path d="M0,-8 L-122,-6 L-120,2 L0,6 Z" fill="#e4e6e7" stroke={C.ink} strokeWidth={3} />
          <ellipse cx={58} cy={6} rx={36} ry={22} fill="none" stroke={C.ink} strokeWidth={12} />
          <ellipse cx={58} cy={6} rx={36} ry={22} fill="none" stroke={C.red} strokeWidth={7} />
        </g>
        <circle r={7} fill={C.ink} />
      </g>
    </svg>
  );
};

// One line of a typed invoice: label on the left, amount on the right.
export const BillRow: React.FC<{label: string; sub?: string; amount: React.ReactNode; at: number; big?: boolean; hl?: number}> = ({label, sub, amount, at, big, hl}) => {
  const frame = useCurrentFrame();
  const o = ease(stepped(frame), at, at + 4);
  return (
    <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', opacity: o, transform: `translateY(${(1 - o) * 12}px)`, marginTop: big ? 18 : 12}}>
      <div style={{fontFamily: F.type, fontSize: big ? 46 : 38, color: C.ink}}>
        {label}
        {sub ? <span style={{fontSize: 26, color: C.inkSoft}}> {sub}</span> : null}
      </div>
      <div style={{fontFamily: big ? F.display : F.type, fontSize: big ? 84 : 42, color: C.ink}}>{hl !== undefined ? <HL at={hl}>{amount}</HL> : amount}</div>
    </div>
  );
};

// Arrow-shaped signboard (points left or right).
export const Sign: React.FC<{id: string; x: number; y: number; w: number; h: number; dir: 'left' | 'right'; at: number; out?: number; bg?: string; rot?: number; children: React.ReactNode}> = ({id, x, y, w, h, dir, at, out, bg = C.card, rot = 0, children}) => {
  const pl = usePlacement(id, at, dir, out, 'fade');
  const audio = <Sfx at={at} name="slide" volume={0.22} />;
  if (!pl.visible) return audio;
  const tip = h * 0.45;
  const clip = dir === 'right'
    ? `polygon(0 0, ${w - tip}px 0, ${w}px 50%, ${w - tip}px 100%, 0 100%)`
    : `polygon(${tip}px 0, 100% 0, 100% 100%, ${tip}px 100%, 0 50%)`;
  return (
    <>
      {audio}
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `translate(${pl.x}px, ${pl.y}px) rotate(${rot + pl.r}deg)`, opacity: pl.o, filter: `drop-shadow(5px 9px 9px ${C.shadow})`}}>
        <div style={{position: 'absolute', inset: 0, clipPath: clip, background: bg, border: 'none'}} />
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: dir === 'right' ? `0 ${tip}px 0 24px` : `0 24px 0 ${tip}px`, textAlign: 'center'}}>{children}</div>
      </div>
    </>
  );
};

// Small paper chip with a word on it.
export const Chip: React.FC<{id: string; x: number; y: number; w: number; h?: number; at: number; out?: number; rot?: number; bg?: string; size?: number; enter?: 'drop' | 'left' | 'right' | 'up'; children: React.ReactNode}> = ({id, x, y, w, h = 130, at, out, rot = 0, bg = C.paperLight, size = 64, enter = 'drop', children}) => (
  <Card id={id} x={x} y={y} w={w} h={h} rot={rot} at={at} out={out} enter={enter} bg={bg}>
    <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: size, lineHeight: 1, textAlign: 'center', textTransform: 'uppercase', color: C.ink, padding: '0 16px'}}>{children}</div>
  </Card>
);

export {GOLD, GOLD_DARK};
