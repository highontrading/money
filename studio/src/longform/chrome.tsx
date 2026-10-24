import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {Sfx} from '../components/paper';
import {boil, clamp, ease, pop, stepped} from '../lib/motion';
import {useTL} from '../lib/timeline';
import {tornPolygon} from '../lib/torn';
import {C, F, FPS} from '../theme';
import {LH, LW} from './frame';

export type Chapter = {id: string; title: string; start: number};

export const Desk16: React.FC = () => (
  <AbsoluteFill>
    <Img src={staticFile('img/proc/bg_wide.jpg')} style={{width: LW, height: LH}} />
  </AbsoluteFill>
);

// Lamp light, vignette and film grain over the whole frame.
export const Atmosphere16: React.FC = () => {
  const frame = useCurrentFrame();
  const g = Math.floor(frame / 2) % 6;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', zIndex: 900}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 110% at 32% 26%, rgba(255,246,225,0.10) 0%, rgba(0,0,0,0) 52%, rgba(40,28,12,0.24) 100%)'}} />
      <Img src={staticFile(`img/proc/grainw_${g}.png`)} style={{position: 'absolute', inset: 0, width: LW, height: LH, mixBlendMode: 'overlay', opacity: 0.16}} />
    </AbsoluteFill>
  );
};

export const timecode = (frame: number) => {
  const s = Math.floor(frame / FPS);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `00:${pad(Math.floor(s / 60))}:${pad(s % 60)}:${pad(frame % FPS)}`;
};

const Crosshair: React.FC<{x: number; y: number}> = ({x, y}) => (
  <svg width={40} height={40} style={{position: 'absolute', left: x - 20, top: y - 20, opacity: 0.5}}>
    <circle cx={20} cy={20} r={8} fill="none" stroke={C.ink} strokeWidth={1.5} />
    <line x1={0} y1={20} x2={40} y2={20} stroke={C.ink} strokeWidth={1.5} />
    <line x1={20} y1={0} x2={20} y2={40} stroke={C.ink} strokeWidth={1.5} />
  </svg>
);

// Corner furniture: series bug, chapter chip, running timecode, registration marks.
export const Header16: React.FC<{chapters: Chapter[]; hideFrom: number}> = ({chapters, hideFrom}) => {
  const frame = useCurrentFrame();
  if (frame >= hideFrom) return null;
  const inP = ease(stepped(frame), 6, 16);
  const idx = chapters.reduce((k, c, i) => (frame >= c.start ? i : k), 0);
  const ch = chapters[idx];
  return (
    <AbsoluteFill style={{zIndex: 800, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 56, top: 40, transform: `translateX(${(1 - inP) * -400}px)`, background: C.ink, color: C.paperLight, fontFamily: F.display, fontSize: 30, letterSpacing: 2, padding: '6px 14px 4px'}}>MONEY THEORY</div>
      {idx > 0 && idx < chapters.length - 1 ? (
        <div style={{position: 'absolute', right: 60, top: 44, transform: 'rotate(1.5deg)', background: C.paperLight, border: `2px solid ${C.ink}`, fontFamily: F.mono, fontWeight: 700, fontSize: 19, letterSpacing: 3, padding: '7px 13px', color: C.ink, textTransform: 'uppercase'}}>
          ● CH {idx} · {ch.title}
        </div>
      ) : null}
      <div style={{position: 'absolute', left: 58, bottom: 34, fontFamily: F.mono, fontWeight: 500, fontSize: 17, letterSpacing: 2, color: C.inkSoft, opacity: 0.8 * inP}}>{timecode(frame)}</div>
      <Crosshair x={1870} y={1040} />
      <Crosshair x={34} y={120} />
    </AbsoluteFill>
  );
};

// Chapter card, after the reference poster: a dark sheet slides over the desk,
// "CHAPTER n" on a black label, the title on a torn yellow strip, a handwritten
// aside and a film-strip timecode bar. Holds through the chapter gap and leaves
// just before the narration picks up again.
export const ChapterCard: React.FC<{n: number; title: string; note: string; at: number; out: number; label?: string}> = ({n, title, note, at, out, label}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at - 2 || f > out + 10) return null;
  const inX = interpolate(f, [at, at + 6], [LW + 200, 0], clamp);
  const outX = interpolate(f, [out, out + 8], [0, -LW - 300], clamp);
  const x = f < out ? inX : outX;
  const b = boil('chap' + n, frame, 1.2);
  const tp = pop(frame, at + 6, 10, 0.5);
  const words = title.split(' ');
  return (
    <>
      <Sfx at={at} name="whoosh" volume={0.45} />
      <Sfx at={at + 6} name="sting" volume={0.55} />
      <Sfx at={at + 10} name="stamp" volume={0.4} />
      <div style={{position: 'absolute', left: x - 120, top: -80, width: LW + 240, height: LH + 160, zIndex: 870, transform: `rotate(${-1.2 + b.r}deg) translate(${b.x}px, ${b.y}px)`, filter: `drop-shadow(-16px 0 22px ${C.shadow}) drop-shadow(16px 0 22px ${C.shadow})`}}>
        <div style={{position: 'absolute', inset: 0, background: '#1d1b18', clipPath: tornPolygon('chapbg' + n, LW + 240, LH + 160, {left: true, right: true}, 24)}}>
          <Img src={staticFile('img/proc/tex_kraft.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply', opacity: 0.85}} />
        </div>
        <div style={{position: 'absolute', right: 230, top: 150, fontFamily: F.display, fontSize: 620, lineHeight: 1, color: 'transparent', WebkitTextStroke: `4px ${C.paperLight}`, opacity: 0.22 * ease(f, at + 4, at + 12), transform: `rotate(-4deg) translateY(${(1 - ease(f, at + 4, at + 14)) * 40}px)`}}>{label ? '★' : String(n).padStart(2, '0')}</div>
        <div style={{position: 'absolute', left: 290, top: 330}}>
          <div style={{display: 'inline-block', background: C.paperLight, color: C.ink, fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 8, padding: '8px 18px', transform: `rotate(-1deg) scale(${Math.min(1, tp)})`, transformOrigin: 'left center'}}>{label ?? `CHAPTER ${n}`}</div>
          <div style={{position: 'relative', marginTop: 34, maxWidth: 1250}}>
            <div style={{position: 'absolute', left: -40, right: -60, top: 18, bottom: 6, background: C.yellow, clipPath: tornPolygon('chapy' + n, 1300, 300, {left: true, right: true, top: true, bottom: true}, 12), transform: `scaleX(${ease(f, at + 8, at + 16)}) rotate(-1.4deg)`, transformOrigin: 'left center'}} />
            <div style={{position: 'relative', fontFamily: F.display, fontSize: words.join(' ').length > 18 ? 136 : 176, lineHeight: 1.02, color: C.ink, textTransform: 'uppercase', padding: '14px 10px'}}>
              {words.map((w, i) => (
                <span key={i} style={{display: 'inline-block', marginRight: '0.22em', opacity: f >= at + 9 + i * 2 ? 1 : 0, transform: `translateY(${f >= at + 11 + i * 2 ? 0 : -24}px)`}}>{w}</span>
              ))}
            </div>
          </div>
          <div style={{marginTop: 40, fontFamily: F.hand, fontWeight: 700, fontSize: 66, color: C.paperLight, transform: 'rotate(-2deg)', opacity: f >= at + 18 ? 1 : 0, clipPath: `inset(-20% ${100 - ease(f, at + 18, at + 30) * 100}% -20% -5%)`}}>{note}</div>
        </div>
        <div style={{position: 'absolute', left: 290, right: 290, bottom: 150, height: 64, borderTop: `2px solid ${C.grey}`, borderBottom: `2px solid ${C.grey}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: F.mono, fontSize: 20, letterSpacing: 3, color: C.grey}}>
          {Array.from({length: 9}).map((_, i) => (
            <span key={i} style={{opacity: 0.4 + 0.6 * random('tc' + n + i)}}>{i === 4 ? timecode(frame) : '▮'}</span>
          ))}
        </div>
      </div>
    </>
  );
};

// A torn sheet sweeps across between scenes inside a chapter.
export const Wipe16: React.FC<{at: number; color: string; seed: string}> = ({at, color, seed}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at - 10 || f > at + 10) return null;
  const x = interpolate(f, [at - 10, at, at + 10], [LW + 100, -200, -LW - 700], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: -200, width: LW + 500, height: LH + 400, zIndex: 880, transform: 'rotate(-5deg)', filter: `drop-shadow(-14px 0 18px ${C.shadow}) drop-shadow(14px 0 18px ${C.shadow})`}}>
      <div style={{position: 'absolute', inset: 0, background: color, clipPath: tornPolygon(seed, LW + 500, LH + 400, {left: true, right: true}, 26)}}>
        <Img src={staticFile('img/proc/tex_kraft.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply', opacity: 0.6}} />
      </div>
    </div>
  );
};
