import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Card, HL, Label, Marker, Sfx} from '../../components/paper';
import {boil, clamp, stepped} from '../../lib/motion';
import {useCues} from '../../lib/timeline';
import {C, F} from '../../theme';

// Index card pinned to the board: shows its number face-down, flips over (on twos)
// at `flipAt` to the handwritten question, then gets a pencil tick at `tickAt`.
const IndexCard: React.FC<{id: string; n: number; x: number; y: number; w: number; h: number; rot: number; at: number; flipAt: number; tickAt: number; active: boolean; q: string; children: React.ReactNode}> = ({id, n, x, y, w, h, rot, at, flipAt, tickAt, active, q, children}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at) return null;
  const drop = interpolate(f, [at, at + 6], [-40, 0], clamp);
  const flip = interpolate(f, [flipAt, flipAt + 4, flipAt + 8], [1, 0, 1], clamp);
  const front = f >= flipAt + 4;
  const lift = active ? -16 : 0;
  const b = boil(id, frame, 0.8);
  return (
    <>
      <Sfx at={at} name="drop" volume={0.18} />
      <Sfx at={flipAt} name="page" volume={0.4} />
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `translate(${b.x}px, ${drop + lift + b.y}px) rotate(${rot + b.r}deg) scaleX(${flip}) scale(${active ? 1.04 : 1})`, filter: `drop-shadow(0 1px 0.5px rgba(0,0,0,0.3)) drop-shadow(${active ? 10 : 5}px ${active ? 16 : 9}px ${active ? 16 : 9}px ${C.shadow})`, zIndex: active ? 30 : 20}}>
        <div style={{position: 'absolute', inset: 0, background: front ? C.paperLight : C.card, overflow: 'hidden'}}>
          <Img src={staticFile('img/proc/tex_paper.jpg')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply', opacity: 0.5}} />
          {/* ruled index-card lines */}
          {Array.from({length: 11}).map((_, i) => <div key={i} style={{position: 'absolute', left: 0, right: 0, top: 120 + i * 46, borderTop: '2px solid rgba(70,110,150,0.22)'}} />)}
          <div style={{position: 'absolute', left: 0, right: 0, top: 96, borderTop: `3px solid rgba(210,52,31,0.45)`}} />
          {front ? (
            <div style={{position: 'relative', padding: '18px 20px'}}>
              <div style={{fontFamily: F.display, fontSize: 44, lineHeight: 1}}>{n}</div>
              <div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 52, lineHeight: 0.95, marginTop: 26, minHeight: 150}}>{q}</div>
              <div style={{marginTop: 14}}>{children}</div>
            </div>
          ) : (
            <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: 200, color: C.inkSoft, opacity: 0.6}}>{n}</div>
          )}
        </div>
        {/* push pin */}
        <div style={{position: 'absolute', left: w / 2 - 16, top: -10, width: 32, height: 32, borderRadius: 16, background: C.red, boxShadow: `2px 4px 4px ${C.shadow}`, border: `2px solid #8c1f12`}} />
      </div>
      {front ? <Marker id={id + 'tick'} d={`M${x + w - 92},${y + 54} l18,22 l40,-52`} at={tickAt} dur={5} color={C.ink} width={9} /> : null}
      {front ? <Sfx at={tickAt} name="marker" volume={0.25} /> : null}
    </>
  );
};

// one line of an answer: mono tag that shows up when it's said
const Line: React.FC<{at: number; children: React.ReactNode; size?: number}> = ({at, children, size = 26}) => {
  const frame = useCurrentFrame();
  return <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: size, letterSpacing: 0, lineHeight: 1.25, marginTop: 14, opacity: frame >= at ? 1 : 0, textTransform: 'uppercase'}}>{children}</div>;
};

const Questions: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, end, word} = useCues();
  const qs = ['L115', 'L116', 'L117', 'L118', 'L119'];
  const starts = qs.map((l) => at(l));
  const activeIdx = starts.reduce((k, s, i) => (frame >= s ? i : k), -1);
  const cw = 312, gap = 24, x0 = 150, y0 = 330, ch = 600;
  const dealAt = word('L114', 'paanch', -10);
  const content: {q: string; tick: number; body: React.ReactNode}[] = [
    {q: 'Paisa kiske paas?', tick: word('L115', 'mein?', 2), body: (
      <>
        <Line at={word('L115', 'company', -2)}>→ company ke paas</Line>
        <Line at={word('L115', 'ya', -2)}>ya</Line>
        <Line at={word('L115', 'purane', -2)}>→ purane partners ki jeb</Line>
      </>
    )},
    {q: 'Kis kaam aayega?', tick: word('L116', 'padho', 2), body: (
      <>
        <Line at={word('L116', 'naya', -2)}>naya business?</Line>
        <Line at={word('L116', 'purana', -2)}>purana loan?</Line>
        <Line at={word('L116', 'objects', -4)} size={24}><HL at={word('L116', 'objects', 0)}>Objects of the issue</HL></Line>
      </>
    )},
    {q: 'Company kamaati hai?', tick: word('L117', 'karz', 6), body: (
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 26, height: 230, marginTop: 6}}>
        {[
          {t: 'PROFIT', h: 200, a: word('L117', 'profit', -2), c: C.yellow},
          {t: 'KARZ', h: 110, a: word('L117', 'karz', -2), c: C.red},
        ].map((b) => {
          const p = interpolate(stepped(frame), [b.a, b.a + 8], [0, 1], clamp);
          return (
            <div key={b.t} style={{textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 22}}>
              <div style={{width: 90, height: b.h * p, background: b.c, border: p > 0 ? `3px solid ${C.ink}` : 'none'}} />
              <div style={{marginTop: 6, opacity: p > 0 ? 1 : 0}}>{b.t} {b.t === 'PROFIT' ? '↑' : '?'}</div>
            </div>
          );
        })}
      </div>
    )},
    {q: 'Daam sahi hai?', tick: word('L118', 'karo', 2), body: (
      <>
        <Line at={word('L118', 'rhp', -2)} size={24}>RHP mein dekho:</Line>
        <Line at={word('L118', 'basis', -2)} size={24}><HL at={word('L118', 'basis', 0)}>basis for offer price</HL></Line>
        <Line at={word('L118', 'tulna', -6)} size={24}>doosri companies se tulna</Line>
      </>
    )},
    {q: 'Main kyun apply kar raha hoon?', tick: end('L119', -4), body: (
      <>
        <Line at={word('L119', 'listing', -2)}>listing ka ek din?</Line>
        <Line at={word('L119', 'ya', -2)}>ya</Line>
        <Line at={word('L119', 'paanch', -2)}><HL at={word('L119', 'saal', -2)}>paanch saal?</HL></Line>
      </>
    )},
  ];
  return (
    <AbsoluteFill>
      {/* the cork board */}
      <Card id="q-board" x={110} y={130} w={1700} h={860} rot={-0.6} at={0} enter="up" bg="#9c6e42" texture="kraft" torn={{top: true}} rough={10} sfx="slide">
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 40% 30%, rgba(255,230,190,0.18), rgba(0,0,0,0.12))'}} />
      </Card>
      <div style={{position: 'absolute', left: 170, top: 165, display: 'flex', alignItems: 'center', gap: 26, zIndex: 25, opacity: frame >= word('L114', 'agla', -4) ? 1 : 0}}>
        <Label size={28} style={{transform: 'rotate(-1deg)'}}>Agla IPO aaye?</Label>
        <div style={{fontFamily: F.display, fontSize: 90, lineHeight: 1, color: C.paperLight, textShadow: `3px 4px 0 ${C.ink}`, opacity: frame >= word('L114', 'apply', -2) ? 1 : 0}}>
          APPLY SE PEHLE · <span style={{color: C.yellow}}>{frame >= word('L114', 'paanch', -4) ? '5 SAWAAL' : ''}</span>
        </div>
      </div>
      {content.map((c, i) => (
        <IndexCard key={i} id={'q' + i} n={i + 1} x={x0 + i * (cw + gap)} y={y0} w={cw} h={ch} rot={[-2.5, 1.5, -1, 2, -1.8][i]} at={dealAt + i * 5} flipAt={starts[i] - 2} tickAt={c.tick} active={activeIdx === i} q={c.q}>
          {c.body}
        </IndexCard>
      ))}
    </AbsoluteFill>
  );
};

export const c8: Record<string, React.FC> = {questions: Questions};
