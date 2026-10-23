import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {clamp, ease, stepped} from '../lib/motion';
import {Line, TL} from '../lib/timeline';
import {tornPolygon} from '../lib/torn';
import {C, F, FPS, H, W} from '../theme';

export const Desk: React.FC = () => (
  <AbsoluteFill>
    <Img src={staticFile('img/proc/bg_paper.jpg')} style={{width: W, height: H}} />
  </AbsoluteFill>
);

// Lamp light, vignette and film grain over the whole frame.
export const Atmosphere: React.FC = () => {
  const frame = useCurrentFrame();
  const g = Math.floor(frame / 2) % 6;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', zIndex: 900}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 120% 80% at 30% 22%, rgba(255,246,225,0.10) 0%, rgba(0,0,0,0) 50%, rgba(40,28,12,0.22) 100%)'}} />
      <Img src={staticFile(`img/proc/grain_${g}.png`)} style={{position: 'absolute', inset: 0, width: W, height: H, mixBlendMode: 'overlay', opacity: 0.16}} />
    </AbsoluteFill>
  );
};

const Crosshair: React.FC<{x: number; y: number}> = ({x, y}) => (
  <svg width={44} height={44} style={{position: 'absolute', left: x - 22, top: y - 22, opacity: 0.55}}>
    <circle cx={22} cy={22} r={9} fill="none" stroke={C.ink} strokeWidth={1.5} />
    <line x1={0} y1={22} x2={44} y2={22} stroke={C.ink} strokeWidth={1.5} />
    <line x1={22} y1={0} x2={22} y2={44} stroke={C.ink} strokeWidth={1.5} />
  </svg>
);

const timecode = (frame: number) => {
  const s = Math.floor(frame / FPS);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `00:${pad(Math.floor(s / 60))}:${pad(s % 60)}:${pad(frame % FPS)}`;
};

export const Header: React.FC<{episode: string; topic: string}> = ({episode, topic}) => {
  const frame = useCurrentFrame();
  const inP = ease(stepped(frame), 4, 14);
  return (
    <AbsoluteFill style={{zIndex: 800, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 64, top: 232, display: 'flex', alignItems: 'stretch', transform: `translateX(${(1 - inP) * -500}px)`}}>
        <div style={{background: C.ink, color: C.paperLight, fontFamily: F.display, fontSize: 34, letterSpacing: 2, padding: '8px 16px 6px'}}>MONEY THEORY</div>
        <div style={{background: C.yellow, color: C.ink, fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 3, padding: '14px 12px 0'}}>{episode}</div>
      </div>
      <div style={{position: 'absolute', right: 150, top: 236, transform: `translateX(${(1 - inP) * 500}px) rotate(2deg)`}}>
        <div style={{background: C.paperLight, border: `2px solid ${C.ink}`, fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 3, padding: '8px 14px', color: C.ink}}>● {topic}</div>
      </div>
      <div style={{position: 'absolute', left: 66, top: 300, fontFamily: F.mono, fontWeight: 500, fontSize: 20, letterSpacing: 2, color: C.inkSoft, opacity: inP}}>{timecode(frame)}</div>
      <Crosshair x={1000} y={330} />
      <Crosshair x={50} y={1530} />
    </AbsoluteFill>
  );
};

const CAP_TOP = 1268;

// Karaoke captions on a torn strip of paper: words darken as they're spoken and
// *keywords* get a highlighter swipe.
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const line: Line | undefined = TL.lines.find((l) => frame >= l.start - 2 && frame < l.end + 6);
  if (!line) return null;
  const local = frame - line.start;
  const inP = interpolate(stepped(local + 2), [0, 4], [0, 1], clamp);
  const size = line.words.length > 13 ? 50 : 56;
  return (
    <AbsoluteFill style={{zIndex: 850, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 60, width: 900, top: CAP_TOP, display: 'flex', justifyContent: 'center'}}>
        <div style={{position: 'relative', padding: '22px 34px 26px', transform: `translateY(${(1 - inP) * 24}px) rotate(-0.6deg)`, opacity: inP, filter: `drop-shadow(4px 7px 8px ${C.shadow})`}}>
          <div style={{position: 'absolute', inset: 0, background: C.card, clipPath: tornPolygon('cap' + line.id, 900, 200, {top: true, bottom: true}, 7)}} />
          <div style={{position: 'relative', fontFamily: F.sans, fontWeight: 800, fontSize: size, lineHeight: 1.16, color: C.ink, textAlign: 'center', letterSpacing: -0.5, textWrap: 'balance'} as React.CSSProperties}>
            {line.words.map((w, i) => {
              const spoken = frame >= w.start - 3; // captions lead the voice slightly
              const hp = ease(stepped(frame), w.start - 3, w.start + 2);
              return (
                <span key={i} style={{position: 'relative', display: 'inline-block', marginRight: '0.24em', opacity: spoken ? 1 : 0.28, isolation: 'isolate'}}>
                  {w.hi ? (
                    <span style={{position: 'absolute', left: '-0.08em', right: '-0.1em', top: '10%', bottom: '4%', background: C.yellow, zIndex: -1, transform: `scaleX(${hp}) skewX(-5deg)`, transformOrigin: 'left center'}} />
                  ) : null}
                  {w.text}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// A torn sheet sweeps across the frame between scenes.
export const Wipe: React.FC<{at: number; color: string; seed: string}> = ({at, color, seed}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at - 10 || f > at + 10) return null;
  const x = interpolate(f, [at - 10, at, at + 10], [W + 100, -150, -W - 500], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: -100, width: W + 400, height: H + 200, zIndex: 880, transform: 'rotate(-4deg)', filter: `drop-shadow(-14px 0 18px ${C.shadow}) drop-shadow(14px 0 18px ${C.shadow})`}}>
      <div style={{position: 'absolute', inset: 0, background: color, clipPath: tornPolygon(seed, W + 400, H + 200, {left: true, right: true}, 26)}}>
        <Img src={staticFile('img/proc/tex_kraft.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply', opacity: 0.6}} />
      </div>
    </div>
  );
};
