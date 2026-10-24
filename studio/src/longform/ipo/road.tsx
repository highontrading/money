import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {Sfx} from '../../components/paper';
import {boil, ease, pop, stepped} from '../../lib/motion';
import {tornPolygon} from '../../lib/torn';
import {C, F} from '../../theme';

// The IPO journey as a paper road with stops. Introduced in the cold open and
// travelled again in the recap, so the whole video hangs on one picture.
export const STOPS = ['IDEA', 'PARTNERS', 'DRHP', 'SEBI', 'PRICE BAND', '3 DIN BOLI', 'LOTTERY', 'LISTING'];

const Bell: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M50,12 C30,12 24,32 24,50 L24,64 L14,78 L86,78 L76,64 L76,50 C76,32 70,12 50,12 Z" fill={C.yellow} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
    <circle cx={50} cy={86} r={8} fill={C.ink} />
    <rect x={44} y={4} width={12} height={10} fill={C.ink} />
  </svg>
);

export const Road: React.FC<{
  at: number; // strip unrolls from here
  stopsAt: number[]; // reveal frame for each stop (scene-local)
  out?: number;
  y?: number;
  active?: number; // index of the stop to emphasise (-1 none)
  activeAt?: number;
  questions?: {i: number; at: number}[]; // red "?" tags on stops
}> = ({at, stopsAt, out, y = 600, active = -1, activeAt = 0, questions = []}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at || (out !== undefined && f >= out + 10)) return null;
  const unroll = ease(f, at, at + 14);
  const o = out !== undefined && f >= out ? 1 - ease(f, out, out + 8) : 1;
  const x0 = 120, x1 = 1800, W = x1 - x0;
  const step = W / STOPS.length;
  const b = boil('road', frame, 0.8);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: o, transform: `translate(${b.x}px, ${b.y}px)`}}>
      <Sfx at={at} name="tear" volume={0.35} />
      {/* the strip */}
      <div style={{position: 'absolute', left: x0 - 40, top: y, width: (W + 80) * unroll, height: 120, overflow: 'hidden', filter: `drop-shadow(5px 9px 9px ${C.shadow})`, transform: 'rotate(-0.6deg)'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: W + 80, height: 120, background: C.kraft, clipPath: tornPolygon('roadstrip', W + 80, 120, {top: true, bottom: true}, 9)}}>
          <Img src={staticFile('img/proc/tex_kraft.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply', opacity: 0.8}} />
          <div style={{position: 'absolute', left: 20, right: 20, top: 56, borderTop: `7px dashed ${C.paperLight}`, opacity: 0.85}} />
        </div>
      </div>
      {STOPS.map((s, i) => {
        const sa = stopsAt[i] ?? at;
        if (f < sa) return null;
        const p = Math.min(1.08, Math.max(0, pop(frame, sa, 11, 0.5)));
        const cx = x0 + step * i + step / 2;
        const isActive = i === active && f >= activeAt;
        const last = i === STOPS.length - 1;
        const lift = isActive ? -26 * ease(f, activeAt, activeAt + 6) : 0;
        return (
          <React.Fragment key={s}>
            <Sfx at={sa} name="pop" volume={0.18} />
            <div style={{position: 'absolute', left: cx - 8, top: y + 46, width: 16, height: 16, borderRadius: 8, background: C.ink, transform: `scale(${p})`}} />
            <div style={{position: 'absolute', left: cx - 92, top: y - 150 + lift, width: 184, height: 120, transform: `scale(${p}) rotate(${(i % 2 ? 1.5 : -1.5)}deg)`, transformOrigin: '50% 100%', background: isActive || last ? C.yellow : C.paperLight, border: `4px solid ${C.ink}`, boxShadow: `4px 7px 8px ${C.shadow}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              {last ? <Bell size={56} /> : <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 18, letterSpacing: 2, color: C.inkSoft}}>{String(i + 1).padStart(2, '0')}</div>}
              <div style={{fontFamily: F.display, fontSize: s.length > 8 ? 30 : 36, lineHeight: 1, textAlign: 'center', marginTop: 4}}>{s}</div>
            </div>
            <div style={{position: 'absolute', left: cx - 2, top: y - 30 + lift, width: 4, height: 76 - lift, background: C.ink, transform: `scaleY(${p})`, transformOrigin: 'top'}} />
          </React.Fragment>
        );
      })}
      {questions.map(({i, at: qa}) => {
        if (f < qa) return null;
        const cx = x0 + step * i + step / 2;
        const s = Math.min(1.1, pop(frame, qa, 9, 0.5));
        return (
          <React.Fragment key={'q' + i}>
            <Sfx at={qa} name="stamp" volume={0.28} />
            <div style={{position: 'absolute', left: cx + 40, top: y - 200, width: 70, height: 70, borderRadius: 35, background: C.red, color: C.paperLight, fontFamily: F.display, fontSize: 56, lineHeight: '74px', textAlign: 'center', transform: `scale(${s}) rotate(10deg)`, boxShadow: `3px 5px 6px ${C.shadow}`}}>?</div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
