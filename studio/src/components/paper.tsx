import React from 'react';
import {Audio, Img, interpolate, random, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {boil, clamp, ease, pop, stepped} from '../lib/motion';
import {Edges, markerEllipse, tornPolygon} from '../lib/torn';
import {C, F, H, W} from '../theme';

export const Sfx: React.FC<{at: number; name: string; volume?: number}> = ({at, name, volume = 0.35}) => (
  <Sequence from={Math.max(0, at)} durationInFrames={40} layout="none">
    <Audio src={staticFile(`audio/sfx_${name}.wav`)} volume={volume} />
  </Sequence>
);

type Enter = 'drop' | 'left' | 'right' | 'up' | 'down' | 'fade' | 'none';
type Exit = 'left' | 'right' | 'up' | 'down' | 'fade' | 'lift';

const TEX = {
  paper: 'img/proc/tex_paper.jpg',
  kraft: 'img/proc/tex_kraft.jpg',
  news: 'img/proc/tex_news.jpg',
} as const;

const enterOffset = (mode: Enter, p: number): {x: number; y: number; s: number; r: number; o: number} => {
  const q = 1 - p;
  switch (mode) {
    case 'drop':
      return {x: 0, y: -40 * q, s: 1 + 0.12 * q, r: 0, o: p > 0 ? 1 : 0};
    case 'left':
      return {x: -1200 * q, y: 0, s: 1, r: -6 * q, o: 1};
    case 'right':
      return {x: 1200 * q, y: 0, s: 1, r: 6 * q, o: 1};
    case 'up':
      return {x: 0, y: 1500 * q, s: 1, r: 4 * q, o: 1};
    case 'down':
      return {x: 0, y: -1500 * q, s: 1, r: -4 * q, o: 1};
    case 'fade':
      return {x: 0, y: 0, s: 1, r: 0, o: p};
    default:
      return {x: 0, y: 0, s: 1, r: 0, o: 1};
  }
};

export const usePlacement = (seed: string, at: number, enter: Enter, out?: number, exit: Exit = 'left') => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  const p = enter === 'none' ? 1 : enter === 'fade' ? ease(frame, at, at + 8) : Math.min(pop(frame, at), 1.08);
  const e = enterOffset(enter, Math.max(0, p));
  let lift = enter === 'drop' ? Math.max(0, 1 - p) : 0;
  let ox = 0, oy = 0, oo = 1, orot = 0;
  if (out !== undefined && f >= out) {
    const k = ease(f, out, out + 9, 0, 1);
    if (exit === 'left') { ox = -1300 * k; orot = -5 * k; }
    if (exit === 'right') { ox = 1300 * k; orot = 5 * k; }
    if (exit === 'up') oy = -1700 * k;
    if (exit === 'down') oy = 1700 * k;
    if (exit === 'fade') oo = 1 - k;
    if (exit === 'lift') { lift = k; oy = -30 * k; oo = 1 - k; }
  }
  const b = boil(seed, frame, 1);
  const visible = frame >= at && !(out !== undefined && f >= out + 10);
  return {visible, x: e.x + ox + b.x, y: e.y + oy + b.y, s: e.s + lift * 0.06, r: e.r + orot + b.r, o: e.o * oo, lift};
};

export type CardProps = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rot?: number;
  at?: number;
  out?: number;
  enter?: Enter;
  exit?: Exit;
  bg?: string;
  torn?: Edges;
  rough?: number;
  texture?: keyof typeof TEX | null;
  depth?: number;
  z?: number;
  sfx?: string | null;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

// A cut or torn piece of paper lying on the desk, lit from the top-left.
export const Card: React.FC<CardProps> = ({id, x, y, w, h, rot = 0, at = 0, out, enter = 'drop', exit = 'left', bg = C.card, torn = {}, rough = 10, texture = 'paper', depth = 1, z, sfx, style, children}) => {
  const pl = usePlacement(id, at, enter, out, exit);
  const sound = sfx === undefined ? (enter === 'drop' ? 'drop' : enter === 'none' || enter === 'fade' ? null : 'slide') : sfx;
  const audio = sound ? <Sfx at={at} name={sound} volume={sound === 'drop' ? 0.3 : 0.22} /> : null;
  if (!pl.visible) return audio;
  const clip = tornPolygon(id, w, h, torn, rough);
  const sh = depth * (1 + pl.lift * 3);
  const tx = random(id + 'tx') * 60, ty = random(id + 'ty') * 60;
  return (
    <>
    {audio}
    <div
      style={{
        position: 'absolute', left: x, top: y, width: w, height: h, zIndex: z,
        transform: `translate(${pl.x}px, ${pl.y}px) rotate(${rot + pl.r}deg) scale(${pl.s})`,
        opacity: pl.o,
        filter: `drop-shadow(0 1px 0.5px rgba(0,0,0,0.28)) drop-shadow(${5 * sh}px ${9 * sh}px ${10 * sh}px ${C.shadow})`,
        ...style,
      }}
    >
      <div style={{position: 'absolute', inset: 0, clipPath: clip, background: bg, overflow: 'hidden'}}>
        {texture ? (
          <Img src={staticFile(TEX[texture])} style={{position: 'absolute', left: -tx, top: -ty, width: w + 120, height: h + 120, objectFit: 'cover', mixBlendMode: 'multiply', opacity: 0.55}} />
        ) : null}
        <div style={{position: 'absolute', inset: 0}}>{children}</div>
      </div>
    </div>
    </>
  );
};

// Black-and-white photo cut out of a magazine.
export const Photo: React.FC<Omit<CardProps, 'children' | 'bg' | 'texture'> & {src: string; pos?: string; zoom?: number; caption?: string; overlay?: React.ReactNode}> = ({src, pos = '50% 50%', zoom = 0.04, caption, overlay, ...card}) => {
  const frame = useCurrentFrame();
  const z = 1 + zoom * ease(frame, card.at ?? 0, (card.at ?? 0) + 240);
  return (
    <Card {...card} bg="#d9d4c8" texture={null}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`}}>
        <Img src={staticFile('img/proc/' + src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, filter: 'contrast(1.08)'}} />
        {overlay}
      </div>
      <Img src={staticFile(TEX.paper)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply', opacity: 0.35}} />
      {caption ? (
        <div style={{position: 'absolute', left: 14, bottom: 12, background: C.ink, color: C.paperLight, fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, padding: '5px 10px'}}>{caption}</div>
      ) : null}
    </Card>
  );
};

export const Tape: React.FC<{id: string; x: number; y: number; w?: number; rot?: number; at?: number; out?: number; color?: string}> = ({id, x, y, w = 150, rot = -8, at = 0, out, color = 'rgba(236, 226, 196, 0.82)'}) => {
  const frame = useCurrentFrame();
  if (frame < at || (out !== undefined && frame >= out)) return null;
  const clip = tornPolygon(id, w, 44, {left: true, right: true}, 6);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: 44, transform: `rotate(${rot}deg)`, clipPath: clip, background: color, boxShadow: 'inset 0 0 12px rgba(120,100,60,0.18)', zIndex: 50}} />
  );
};

// Rubber stamp: slams in oversized, settles, ink slightly uneven.
export const Stamp: React.FC<{id: string; text: string; x: number; y: number; at: number; out?: number; rot?: number; size?: number; color?: string; sub?: string; paper?: boolean}> = ({id, text, x, y, at, out, rot = -8, size = 64, color = C.red, sub, paper = false}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at || (out !== undefined && f >= out)) return null;
  const s = interpolate(f - at, [0, 2, 4, 6], [1.9, 0.94, 1.03, 1], clamp);
  const audio = <Sfx at={at + 2} name="stamp" volume={0.45} />;
  const o = interpolate(f - at, [0, 2], [0.4, 0.88], clamp);
  return (
    <>
    {audio}
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${s})`, opacity: paper ? 1 : o, zIndex: 60, mixBlendMode: paper ? 'normal' : 'multiply'}}>
      <div style={{border: `${size * 0.09}px solid ${color}`, borderRadius: size * 0.12, padding: `${size * 0.12}px ${size * 0.3}px`, color, fontFamily: F.display, fontSize: size, lineHeight: 1, letterSpacing: size * 0.04, textTransform: 'uppercase', whiteSpace: 'nowrap', textAlign: 'center', background: paper ? C.paperLight : undefined, boxShadow: paper ? `4px 6px 10px ${C.shadow}` : undefined,
        WebkitMaskImage: paper ? undefined : `url(${staticFile('img/proc/ink_mask.png')})`, WebkitMaskSize: '420px'}}>
        {text}
        {sub ? <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: size * 0.28, letterSpacing: 3, marginTop: size * 0.08}}>{sub}</div> : null}
      </div>
    </div>
    </>
  );
};

// Felt-tip marker stroke, drawn on over `dur` frames (stepped).
export const Marker: React.FC<{id: string; d: string; at: number; dur?: number; out?: number; color?: string; width?: number}> = ({id, d, at, dur = 8, out, color = C.red, width = 9}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at || (out !== undefined && f >= out)) return null;
  const p = ease(f, at, at + dur);
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, zIndex: 70, pointerEvents: 'none', overflow: 'visible'}}>
      <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - p} opacity={0.92} />
      <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={width * 0.45} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - p} opacity={0.5} transform={`translate(${random(id) * 3 - 1.5}, ${random(id + 'y') * 3 - 1.5})`} />
    </svg>
  );
};

export const Cross: React.FC<{id: string; x: number; y: number; w: number; h: number; at: number; out?: number; color?: string}> = ({id, x, y, w, h, at, out, color}) => (
  <>
    <Sfx at={at} name="marker" volume={0.3} />
    <Marker id={id + 'a'} d={`M${x},${y} Q${x + w * 0.55},${y + h * 0.45} ${x + w},${y + h}`} at={at} dur={4} out={out} color={color} width={12} />
    <Marker id={id + 'b'} d={`M${x + w},${y} Q${x + w * 0.45},${y + h * 0.55} ${x},${y + h}`} at={at + 4} dur={4} out={out} color={color} width={12} />
  </>
);

export const Circle: React.FC<{id: string; cx: number; cy: number; rx: number; ry: number; at: number; out?: number; color?: string}> = ({id, cx, cy, rx, ry, at, out, color}) => (
  <>
    <Sfx at={at} name="marker" volume={0.3} />
    <Marker id={id} d={markerEllipse(id, cx, cy, rx, ry)} at={at} dur={10} out={out} color={color} width={8} />
  </>
);

// Yellow highlighter swipe behind inline text.
export const HL: React.FC<{at: number; children: React.ReactNode; color?: string; pad?: number}> = ({at, children, color = C.yellow, pad = 0.08}) => {
  const frame = useCurrentFrame();
  const p = ease(stepped(frame), at, at + 6);
  return (
    <span style={{position: 'relative', display: 'inline-block', isolation: 'isolate'}}>
      <span style={{position: 'absolute', left: `-${pad}em`, right: `-${pad}em`, top: '8%', bottom: '2%', background: color, zIndex: -1, transform: `scaleX(${p}) skewX(-4deg) rotate(-0.8deg)`, transformOrigin: 'left center', clipPath: 'polygon(0 6%, 4% 0, 98% 4%, 100% 50%, 97% 100%, 2% 94%, 0 60%)'}} />
      {children}
    </span>
  );
};

// Text block that types/appears in sync with a cue.
export const Hand: React.FC<{x: number; y: number; at: number; out?: number; size?: number; rot?: number; color?: string; children: React.ReactNode; w?: number}> = ({x, y, at, out, size = 54, rot = -3, color = C.ink, children, w}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at || (out !== undefined && f >= out)) return null;
  const p = ease(f, at, at + 10);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `rotate(${rot}deg)`, fontFamily: F.hand, fontWeight: 700, fontSize: size, color, lineHeight: 1.05, clipPath: `inset(-20% ${100 - p * 100}% -20% -5%)`, zIndex: 65}}>
      {children}
    </div>
  );
};

export const Label: React.FC<{children: React.ReactNode; dark?: boolean; size?: number; style?: React.CSSProperties}> = ({children, dark = true, size = 26, style}) => (
  <span style={{display: 'inline-block', background: dark ? C.ink : C.yellow, color: dark ? C.paperLight : C.ink, fontFamily: F.mono, fontWeight: 700, fontSize: size, letterSpacing: size * 0.12, padding: `${size * 0.25}px ${size * 0.45}px`, textTransform: 'uppercase', ...style}}>{children}</span>
);

// Big condensed headline; each word drops in on its own beat.
export const Big: React.FC<{words: string[]; at: number; gap?: number; size?: number; color?: string; style?: React.CSSProperties; align?: 'left' | 'center'}> = ({words, at, gap = 3, size = 150, color = C.ink, style, align = 'left'}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{fontFamily: F.display, fontSize: size, lineHeight: 0.92, color, textTransform: 'uppercase', textAlign: align, ...style}}>
      {words.map((w, i) => {
        const p = pop(frame, at + i * gap, 12, 0.5);
        if (stepped(frame) < at + i * gap) return <span key={i} style={{opacity: 0}}>{w} </span>;
        return (
          <span key={i} style={{display: 'inline-block', transform: `translateY(${(1 - Math.min(p, 1.05)) * -50}px) scale(${0.85 + 0.15 * Math.min(p, 1.05)})`, marginRight: '0.18em'}}>{w}</span>
        );
      })}
    </div>
  );
};

export const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

export const Count: React.FC<{from: number; to: number; at: number; dur?: number; fmt?: (n: number) => string}> = ({from, to, at, dur = 14, fmt = inr}) => {
  const frame = useCurrentFrame();
  const v = interpolate(stepped(frame), [at, at + dur], [from, to], clamp);
  return <>{fmt(v)}</>;
};
