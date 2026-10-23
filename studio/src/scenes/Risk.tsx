import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Card, Cross, Hand, Label, Marker, Stamp} from '../components/paper';
import {ease, stepped} from '../lib/motion';
import {useCues} from '../lib/timeline';
import {C, F} from '../theme';
import {grid} from './Math';

// Jio GMP readings from public trackers (₹): 20 Oct 273, 22 Oct ~240, 23 Oct 245.
const POINTS = [
  {d: '20 OCT', v: 273},
  {d: '21 OCT', v: null},
  {d: '22 OCT', v: 240},
  {d: '23 OCT', v: 245},
];

export const Risk: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l33 = at('L33'), l34 = at('L34'), l35 = at('L35');

  // L34: the GMP tag is yanked up and down on its strings
  const yank = frame >= l34 ? Math.sin(stepped(frame - l34) / 5) * 70 * ease(frame, l34, l34 + 8) : 0;

  // chart geometry (inside the chart card, card at x=90,y=430)
  const cx0 = 90 + 90, cw = 760, cy0 = 430 + 170, ch = 440;
  const vy = (v: number) => cy0 + ch - ((v - 200) / 100) * ch;
  const px = (i: number) => cx0 + (i / 3) * cw;
  const known = POINTS.map((p, i) => ({...p, i})).filter((p) => p.v !== null) as {d: string; v: number; i: number}[];
  const path = known.map((p, k) => `${k ? 'L' : 'M'}${px(p.i)},${vy(p.v)}`).join(' ');

  return (
    <AbsoluteFill>
      {/* L32: where do you complain? */}
      <Card id="complaint" x={110} y={420} w={860} h={700} rot={-1.5} at={0} out={l33} enter="up" bg={C.paperLight}>
        <div style={{padding: '46px 54px', fontFamily: F.type, fontSize: 40, lineHeight: 1.6}}>
          <Label size={24}>Shikayat form</Label>
          <div style={{fontFamily: F.display, fontSize: 84, marginTop: 20}}>DEALER BHAAG GAYA?</div>
          {['SEBI', 'Stock exchange', 'Broker', 'Court case'].map((t) => (
            <div key={t} style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 14}}>
              <div style={{width: 44, height: 44, border: `4px solid ${C.ink}`}} />
              {t}
            </div>
          ))}
        </div>
      </Card>
      {[0, 1, 2, 3].map((i) => (
        <Cross key={i} id={'cx' + i} x={150} y={712 + i * 80} w={52} h={50} at={word('L32', 'shikayat', 6 + i * 4)} out={l33} />
      ))}
      <Stamp id="kahin" text="Kahin nahi" x={640} y={980} at={word('L32', 'kahin', -2)} out={l33} size={100} rot={-8} />

      {/* L33-L34: a few dealers pull the number on strings */}
      {[0, 1, 2].map((i) => (
        <Card key={i} id={'dl' + i} x={140 + i * 290} y={400} w={240} h={110} rot={[-3, 2, -2][i]} at={l33 + i * 4} out={l35} bg={C.ink} texture="kraft">
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 3, color: C.paperLight, textAlign: 'center', marginTop: 36}}>DEALER {'ABC'[i]}</div>
        </Card>
      ))}
      {frame >= l33 + 10 && frame < l35 + 10 ? (
        <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
          {[0, 1, 2].map((i) => (
            <line key={i} x1={260 + i * 290} y1={505} x2={420 + i * 120} y2={760 + yank - (i === 1 ? 10 : 0)} stroke={C.inkSoft} strokeWidth={2.5} />
          ))}
        </svg>
      ) : null}
      <Card id="tag" x={330} y={750 + yank} w={420} h={260} rot={3 + yank * 0.03} at={l33 + 10} out={l35} enter="drop" bg={C.yellow}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 28, letterSpacing: 3, textAlign: 'center', marginTop: 26}}>GMP</div>
        <div style={{fontFamily: F.display, fontSize: 150, textAlign: 'center', lineHeight: 1}}>₹{Math.round(245 - yank * 0.6)}</div>
      </Card>
      <Hand x={110} y={1070} at={word('L34', 'volume', -2)} out={l35} size={60} rot={-3}>volume chhota → hilana aasaan</Hand>

      {/* L35: the number moves every day */}
      <Card id="chart" x={90} y={430} w={900} h={760} rot={-1} at={l35 - 2} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid(40)}} />
        <div style={{position: 'relative', padding: '34px 40px'}}>
          <Label size={22}>Jio IPO · GMP trend</Label>
        </div>
        <div style={{position: 'absolute', left: 40, bottom: 30, fontFamily: F.mono, fontSize: 20, letterSpacing: 1, color: C.inkSoft}}>SOURCE: PUBLIC GMP TRACKERS · UNOFFICIAL</div>
      </Card>
      {frame >= l35 + 4 ? (
        <>
          {POINTS.map((p, i) => (
            <div key={p.d} style={{position: 'absolute', left: px(i) - 60, top: cy0 + ch + 16, width: 120, textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 22, zIndex: 66}}>{p.d}</div>
          ))}
          <Marker id="trend" d={path} at={word('L35', '273', -4)} dur={20} color={C.ink} width={7} />
          {known.map((p, k) => {
            const show = frame >= word('L35', k === 0 ? '273' : '245', k * 6 - 4);
            return show ? (
              <div key={p.d} style={{position: 'absolute', left: px(p.i) - 70, top: vy(p.v) - (k === 1 ? -26 : 92), width: 140, textAlign: 'center', zIndex: 67}}>
                <div style={{display: 'inline-block', background: k === 0 ? C.ink : C.yellow, color: k === 0 ? C.paperLight : C.ink, fontFamily: F.display, fontSize: 52, padding: '2px 12px'}}>₹{p.v}</div>
              </div>
            ) : null;
          })}
          {known.map((p) => (frame >= word('L35', '273', 4) ? <div key={'d' + p.d} style={{position: 'absolute', left: px(p.i) - 11, top: vy(p.v) - 11, width: 22, height: 22, borderRadius: 11, background: C.red, zIndex: 68}} /> : null))}
          <Hand x={420} y={1092} at={word('L35', 'teen', 0)} size={56} rot={-4} color={C.red}>3 din, 28 rupaye neeche</Hand>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
