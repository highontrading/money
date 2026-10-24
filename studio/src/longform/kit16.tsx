import React from 'react';
import {Loop, OffthreadVideo, random, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Card, CardProps, Marker, Sfx, usePlacement} from '../components/paper';
import {boil, ease, pop, stepped} from '../lib/motion';
import {C, F} from '../theme';

// Shared pieces for the 16:9 long-form episodes, on top of components/paper.

// Treated archival/stock clip (public/video/<src>.mp4, 12 fps, see tools/process_footage.py)
// playing inside a torn photo card. Loops if the card stays up longer than the clip.
export const Footage: React.FC<Omit<CardProps, 'children' | 'bg' | 'texture'> & {src: string; clip?: number; rate?: number; caption?: string; pos?: string; projector?: boolean}> = ({src, clip = 8, rate = 1, caption, pos = '50% 50%', projector = true, ...card}) => {
  const at = card.at ?? 0;
  const loopLen = Math.round((clip / rate) * 30) - 2;
  return (
    <>
      {projector ? <Sfx at={at + 2} name="projector" volume={0.16} /> : null}
      <Card {...card} bg="#1b1a17" texture={null} sfx={card.sfx === undefined ? 'slide' : card.sfx}>
        <Sequence from={at} layout="none">
          <Loop durationInFrames={loopLen} layout="none">
            <OffthreadVideo src={staticFile(`video/${src}.mp4`)} muted playbackRate={rate} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos}} />
          </Loop>
        </Sequence>
        {caption ? (
          <div style={{position: 'absolute', left: 14, bottom: 12, background: C.ink, color: C.paperLight, fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: 2, padding: '5px 10px'}}>{caption}</div>
        ) : null}
      </Card>
    </>
  );
};

// Keyword pop-up (long-form has no burned-in captions; terms get a chip instead).
export const Term: React.FC<{at: number; out?: number; text: string; sub?: string; x?: number; y?: number; rot?: number; hi?: boolean}> = ({at, out, text, sub, x = 110, y = 880, rot = -1.5, hi = true}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at || (out !== undefined && f >= out)) return null;
  const p = Math.min(1.06, pop(frame, at, 10, 0.5));
  return (
    <>
      <Sfx at={at} name="pop" volume={0.25} />
      <div style={{position: 'absolute', left: x, top: y, zIndex: 75, transform: `rotate(${rot}deg) scale(${p})`, transformOrigin: 'left center', filter: `drop-shadow(4px 6px 8px ${C.shadow})`}}>
        <div style={{display: 'inline-block', background: hi ? C.yellow : C.paperLight, border: `3px solid ${C.ink}`, padding: '8px 18px 6px'}}>
          <div style={{fontFamily: F.display, fontSize: 46, lineHeight: 1, color: C.ink, textTransform: 'uppercase'}}>{text}</div>
          {sub ? <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 18, letterSpacing: 2, marginTop: 4, textTransform: 'uppercase'}}>{sub}</div> : null}
        </div>
      </div>
    </>
  );
};

// Paper cut-out person: head + shoulders, lit like the cards. `tone` picks the paper.
export const Person: React.FC<{id: string; x: number; y: number; s?: number; at: number; out?: number; tone?: string; label?: string; rot?: number; enter?: 'drop' | 'up' | 'left' | 'right' | 'fade' | 'none'; badge?: string; sfx?: string | null}> = ({id, x, y, s = 1, at, out, tone = C.card, label, rot = 0, enter = 'up', badge, sfx}) => {
  const pl = usePlacement(id, at, enter, out, 'down');
  const sound = sfx === undefined ? (enter === 'none' || enter === 'fade' ? null : 'slide') : sfx;
  const audio = sound ? <Sfx at={at} name={sound} volume={0.16} /> : null;
  if (!pl.visible) return audio;
  const w = 150 * s, h = 210 * s;
  return (
    <>
      {audio}
      <div style={{position: 'absolute', left: x - w / 2, top: y - h, width: w, height: h, transform: `translate(${pl.x}px, ${pl.y}px) rotate(${rot + pl.r}deg) scale(${pl.s})`, opacity: pl.o, filter: `drop-shadow(0 1px 0.5px rgba(0,0,0,0.3)) drop-shadow(${4 * s}px ${7 * s}px ${8 * s}px ${C.shadow})`, zIndex: 40}}>
        <svg width={w} height={h} viewBox="0 0 150 210">
          <circle cx={75} cy={52} r={36} fill={tone} stroke={C.ink} strokeWidth={4} />
          <path d={`M14,210 C14,150 30,104 75,104 C120,104 136,150 136,210 Z`} fill={tone} stroke={C.ink} strokeWidth={4} />
          {badge ? <rect x={52} y={138} width={46} height={26} fill={C.yellow} stroke={C.ink} strokeWidth={3} /> : null}
        </svg>
        {badge ? <div style={{position: 'absolute', left: 0, right: 0, top: 136 * s, textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 13 * s, letterSpacing: 1}}>{badge}</div> : null}
        {label ? <div style={{position: 'absolute', left: -60, right: -60, top: h + 8, textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 20 * Math.max(0.8, s), letterSpacing: 2, textTransform: 'uppercase', color: C.ink}}>{label}</div> : null}
      </div>
    </>
  );
};

// Hand-drawn marker arrow from (x1,y1) to (x2,y2) with a bow and an arrowhead.
export const Arrow: React.FC<{id: string; x1: number; y1: number; x2: number; y2: number; at: number; out?: number; bow?: number; color?: string; width?: number; dur?: number}> = ({id, x1, y1, x2, y2, at, out, bow = 40, color = C.ink, width = 8, dur = 8}) => {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
  const cx = mx - (dy / len) * bow, cy = my + (dx / len) * bow;
  const ang = Math.atan2(y2 - cy, x2 - cx);
  const hl = 26;
  const h1 = `M${x2},${y2} L${x2 - hl * Math.cos(ang - 0.45)},${y2 - hl * Math.sin(ang - 0.45)}`;
  const h2 = `M${x2},${y2} L${x2 - hl * Math.cos(ang + 0.45)},${y2 - hl * Math.sin(ang + 0.45)}`;
  return (
    <>
      <Sfx at={at} name="marker" volume={0.22} />
      <Marker id={id} d={`M${x1},${y1} Q${cx},${cy} ${x2},${y2}`} at={at} dur={dur} out={out} color={color} width={width} />
      <Marker id={id + 'h1'} d={h1} at={at + dur} dur={2} out={out} color={color} width={width} />
      <Marker id={id + 'h2'} d={h2} at={at + dur} dur={2} out={out} color={color} width={width} />
    </>
  );
};

// A stack of paper "share" slips, used for counting and splitting.
export const Slip: React.FC<{id: string; x: number; y: number; at: number; out?: number; w?: number; h?: number; rot?: number; color?: string; text?: string; size?: number}> = ({id, x, y, at, out, w = 90, h = 56, rot, color = C.paperLight, text = 'SHARE', size = 15}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at || (out !== undefined && f >= out + 6)) return null;
  const p = Math.min(1.08, Math.max(0, pop(frame, at, 12, 0.5)));
  const o = out !== undefined && f >= out ? 1 - ease(f, out, out + 6) : 1;
  const r = rot ?? (random(id) - 0.5) * 10;
  const b = boil(id, frame, 0.6);
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `translate(${b.x}px, ${b.y}px) rotate(${r}deg) scale(${p})`, opacity: o, background: color, border: `3px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: size, letterSpacing: 2, boxShadow: `3px 5px 6px ${C.shadow}`, zIndex: 45}}>{text}</div>
  );
};

// Typewriter text: characters appear on twos at `cps` chars/second, with key clacks.
export const Typed: React.FC<{text: string; at: number; cps?: number; style?: React.CSSProperties; caret?: boolean}> = ({text, at, cps = 14, style, caret = true}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  const n = Math.max(0, Math.min(text.length, Math.floor(((f - at) / 30) * cps)));
  const done = n >= text.length;
  const clacks = Math.ceil(text.replace(/\s/g, '').length / 3);
  return (
    <>
      {Array.from({length: clacks}).map((_, i) => <Sfx key={i} at={at + Math.round((i * 3 * 30) / cps)} name="type" volume={0.22} />)}
      <span style={{fontFamily: F.type, whiteSpace: 'pre-wrap', ...style}}>
        {text.slice(0, n)}
        {caret && !done && f >= at ? <span style={{opacity: Math.floor(frame / 8) % 2 ? 1 : 0.2}}>▌</span> : null}
      </span>
    </>
  );
};
