import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {Hold} from '../../components/kit';
import {Big, Card, Count, Cross, Hand, Label, Marker, Photo, Sfx, Stamp, Tape, usePlacement} from '../../components/paper';
import {boil, ease, pop, stepped} from '../../lib/motion';
import {useCues} from '../../lib/timeline';
import {C, F} from '../../theme';
import {Arrow, Footage, Person, Slip, Term} from '../kit16';

// Chapter 1 · Partner chahiye. Raju ki Chai is the running made-up example.

const AWNING = [C.red, C.paperLight];

// Raju's chai stall as a paper cut-out (base 320×300, scaled by s).
export const Stall: React.FC<{id: string; x: number; y: number; s?: number; at: number; out?: number; rot?: number; enter?: 'drop' | 'up' | 'left' | 'right' | 'none'; sign?: string}> = ({id, x, y, s = 1, at, out, rot = 0, enter = 'drop', sign = 'RAJU KI CHAI'}) => {
  const pl = usePlacement(id, at, enter, out, 'left');
  const audio = enter === 'none' ? null : <Sfx at={at} name="drop" volume={0.28} />;
  if (!pl.visible) return audio;
  const W = 320, H = 300;
  return (
    <>
      {audio}
      <div style={{position: 'absolute', left: x, top: y, width: W * s, height: H * s, transform: `translate(${pl.x}px, ${pl.y}px) rotate(${rot + pl.r}deg) scale(${pl.s})`, opacity: pl.o, filter: `drop-shadow(0 1px 0.5px rgba(0,0,0,0.3)) drop-shadow(${5 * s}px ${9 * s}px ${10 * s}px ${C.shadow})`, zIndex: 30}}>
        <svg width={W * s} height={H * s} viewBox={`0 0 ${W} ${H}`}>
          {/* posts */}
          <rect x={22} y={60} width={12} height={230} fill={C.kraft} stroke={C.ink} strokeWidth={3} />
          <rect x={286} y={60} width={12} height={230} fill={C.kraft} stroke={C.ink} strokeWidth={3} />
          {/* awning: scalloped stripes */}
          {Array.from({length: 8}).map((_, i) => (
            <path key={i} d={`M${10 + i * 37.5},18 h37.5 v44 a18.75,14 0 0 1 -37.5,0 Z`} fill={AWNING[i % 2]} stroke={C.ink} strokeWidth={3} />
          ))}
          <rect x={6} y={8} width={308} height={14} fill={C.ink} />
          {/* sign board */}
          <rect x={44} y={86} width={232} height={52} fill={C.yellow} stroke={C.ink} strokeWidth={4} />
          {/* counter */}
          <rect x={14} y={196} width={292} height={96} fill={C.kraft} stroke={C.ink} strokeWidth={4} />
          <line x1={14} y1={222} x2={306} y2={222} stroke={C.ink} strokeWidth={3} />
          {/* kettle */}
          <path d="M120,196 C112,160 128,150 150,150 C172,150 188,160 180,196 Z" fill="#9a958a" stroke={C.ink} strokeWidth={4} />
          <path d="M180,168 C200,166 206,178 212,160" fill="none" stroke={C.ink} strokeWidth={5} />
          <path d="M132,152 C134,136 166,136 168,152" fill="none" stroke={C.ink} strokeWidth={4} />
          {/* cups */}
          {[220, 248, 276].map((cx) => (
            <path key={cx} d={`M${cx - 10},176 h20 l-3,20 h-14 Z`} fill={C.paperLight} stroke={C.ink} strokeWidth={3} />
          ))}
          {/* steam */}
          <path d="M146,140 c-8,-12 8,-18 0,-32 M160,136 c-8,-12 8,-18 0,-30" fill="none" stroke={C.inkSoft} strokeWidth={3} opacity={0.6} />
        </svg>
        <div style={{position: 'absolute', left: 44 * s, top: 86 * s, width: 232 * s, height: 52 * s, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: 34 * s, color: C.ink, letterSpacing: 1}}>{sign}</div>
      </div>
    </>
  );
};

// Tiny stall icon for the multiplying grid.
const Mini: React.FC<{x: number; y: number; w: number; at: number; out?: number; seed: string}> = ({x, y, w, at, out, seed}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at || (out !== undefined && f >= out)) return null;
  const p = Math.min(1.1, Math.max(0, pop(frame, at, 12, 0.5)));
  const r = (random(seed) - 0.5) * 8;
  return (
    <svg width={w} height={w * 0.86} viewBox="0 0 100 86" style={{position: 'absolute', left: x, top: y, transform: `rotate(${r}deg) scale(${p})`, filter: `drop-shadow(2px 3px 2px ${C.shadow})`, zIndex: 30}}>
      {Array.from({length: 4}).map((_, i) => <rect key={i} x={4 + i * 23} y={4} width={23} height={20} fill={AWNING[i % 2]} stroke={C.ink} strokeWidth={2.5} />)}
      <rect x={8} y={24} width={5} height={58} fill={C.ink} />
      <rect x={87} y={24} width={5} height={58} fill={C.ink} />
      <rect x={4} y={52} width={92} height={30} fill={C.kraft} stroke={C.ink} strokeWidth={2.5} />
      <rect x={24} y={30} width={52} height={14} fill={C.yellow} stroke={C.ink} strokeWidth={2} />
    </svg>
  );
};

// A door in a frame; the panel swings open at `openAt` to show what's inside.
const Door: React.FC<{id: string; x: number; y: number; w: number; h: number; at: number; openAt: number; out?: number; num: string; title: string; hi?: boolean; children?: React.ReactNode}> = ({id, x, y, w, h, at, openAt, out, num, title, hi, children}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  const open = ease(f, openAt, openAt + 10);
  const ix = 30, iy = 96, iw = w - 60, ih = h - 126;
  return (
    <>
      <Sfx at={openAt} name="slide" volume={0.3} />
      <Card id={id} x={x} y={y} w={w} h={h} at={at} out={out} enter="up" bg={hi && f >= openAt ? C.yellow : C.card} rot={0}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14}}>
          <div style={{fontFamily: F.display, fontSize: 52, background: C.ink, color: C.paperLight, width: 62, height: 62, textAlign: 'center', lineHeight: '64px'}}>{num}</div>
          <div style={{fontFamily: F.display, fontSize: 56, lineHeight: 1}}>{title}</div>
        </div>
        <div style={{position: 'absolute', left: ix, top: iy, width: iw, height: ih, background: '#2a2622', overflow: 'hidden', border: `4px solid ${C.ink}`}}>
          <div style={{position: 'absolute', inset: 0, background: C.paperLight, opacity: open}}>{f >= openAt ? children : null}</div>
          {/* the panel */}
          <div style={{position: 'absolute', inset: 0, transformOrigin: 'left center', transform: `perspective(1400px) rotateY(${-82 * open}deg)`, background: C.kraft, border: `4px solid ${C.ink}`, boxShadow: open > 0 ? `12px 0 18px ${C.shadow}` : undefined}}>
            <div style={{position: 'absolute', left: 30, right: 30, top: 34, height: ih * 0.36, border: `4px solid rgba(20,20,20,0.5)`}} />
            <div style={{position: 'absolute', left: 30, right: 30, bottom: 34, height: ih * 0.36, border: `4px solid rgba(20,20,20,0.5)`}} />
            <div style={{position: 'absolute', right: 26, top: ih / 2 - 14, width: 28, height: 28, borderRadius: 14, background: C.yellow, border: `4px solid ${C.ink}`}} />
          </div>
        </div>
      </Card>
    </>
  );
};

const Raju: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l12 = at('L012'), l13 = at('L013'), l14 = at('L014'), l15 = at('L015'), l16 = at('L016'), l17 = at('L017');
  const one = word('L012', 'ek', -2), five = word('L012', 'paanch', -4), fifty = word('L012', 'pachaas', -4), k500 = word('L013', '500', -4);
  const n = frame >= k500 ? 500 : frame >= fifty ? 50 : frame >= five ? 5 : 1;
  return (
    <AbsoluteFill>
      {/* the stall */}
      <Footage id="r-pour" src="chai_pour" x={140} y={150} w={480} h={640} rot={-2.5} at={2} out={fifty} enter="left" torn={{top: true, bottom: true}} rough={14} caption="EK CHAI KI DUKAAN" />
      <Stall id="r-stall" x={680} y={150} s={1.9} at={word('L011', 'chai', -6)} out={fifty} />
      <Hand x={720} y={780} at={word('L011', 'dukaan', -4)} out={fifty} size={72} rot={-3}>yahin se shuru…</Hand>
      <Person id="r-raju" x={1610} y={950} s={1.6} at={word('L012', 'raju', -6)} out={l14} tone={C.yellow} label="Raju" />
      <Card id="r-count" x={1420} y={150} w={380} h={330} rot={2.5} at={one} out={l14} enter="drop" bg={C.paperLight}>
        <div style={{padding: '24px 30px'}}>
          <Label size={22}>Dukaanein</Label>
          <div style={{fontFamily: F.display, fontSize: n >= 500 ? 190 : 210, lineHeight: 1.05, marginTop: 10}}>{n >= 500 ? <Count from={50} to={500} at={k500} dur={24} fmt={(v) => String(Math.round(v))} /> : n}</div>
        </div>
      </Card>
      <Sfx at={five} name="pop" volume={0.3} />
      <Sfx at={fifty} name="pop" volume={0.3} />
      {/* ek → paanch → pachaas */}
      {Array.from({length: 5}).map((_, i) => (
        <Mini key={'m5' + i} seed={'m5' + i} x={150 + i * 215} y={815} w={180} at={five + i * 2} out={fifty} />
      ))}
      {Array.from({length: 50}).map((_, i) => (
        <Mini key={'m50' + i} seed={'m50' + i} x={150 + (i % 10) * 124} y={170 + Math.floor(i / 10) * 150} w={112} at={fifty + 2 + Math.floor(i / 4)} out={k500} />
      ))}
      {/* 500 shops: a field of tiny stall marks */}
      <Hold from={k500} to={l14}>
        <div style={{position: 'absolute', left: 140, top: 150, width: 1220, height: 600}}>
          {Array.from({length: 500}).map((_, i) => {
            const c = i % 25, r = Math.floor(i / 25);
            const show = frame >= k500 + Math.floor(i / 12);
            return show ? <div key={i} style={{position: 'absolute', left: c * 48 + (r % 2) * 10, top: r * 29, width: 34, height: 20, background: i % 7 === 0 ? C.red : C.kraft, border: `2px solid ${C.ink}`, borderTop: `6px solid ${i % 2 ? C.red : C.ink}`, transform: `rotate(${(random('f' + i) - 0.5) * 10}deg)`}} /> : null;
          })}
        </div>
        <Hand x={1390} y={540} at={word('L013', 'kholni', -2)} size={58} rot={-4} color={C.red}>itna paisa?</Hand>
      </Hold>
      <Card id="r-100" x={260} y={720} w={1020} h={250} rot={-1.5} at={word('L013', '₹100', -6)} out={l14} enter="up" bg={C.yellow}>
        <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 44px', gap: 34}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 3, width: 210, lineHeight: 1.3}}>CHAHIYE LAGBHAG</div>
          <div style={{fontFamily: F.display, fontSize: 150, whiteSpace: 'nowrap'}}>₹100 CR</div>
        </div>
      </Card>
      <Sfx at={word('L013', '₹100', -2)} name="riffle" volume={0.35} />

      {/* three doors */}
      <Hold from={l14}>
        <div style={{position: 'absolute', left: 150, top: 120}}>
          <Big words={['Paisa', 'kahan', 'se?']} at={l14 + 2} size={130} />
        </div>
      </Hold>
      <Door id="r-d1" x={150} y={310} w={500} h={640} at={word('L014', 'teen', -4)} openAt={l15 + 4} num="1" title="BACHAT">
        <svg width={440} height={420} viewBox="0 0 440 420" style={{position: 'absolute', left: 0, top: 0}}>
          <path d="M150,110 h140 v30 c40,20 50,60 50,120 v100 c0,30 -20,40 -50,40 h-140 c-30,0 -50,-10 -50,-40 v-100 c0,-60 10,-100 50,-120 Z" fill="#dfe6e3" stroke={C.ink} strokeWidth={6} opacity={0.9} />
          <rect x={140} y={90} width={160} height={28} fill={C.kraft} stroke={C.ink} strokeWidth={5} />
          {[[190, 360], [235, 352], [280, 360], [212, 330], [258, 330]].map(([cx, cy], i) => (
            <ellipse key={i} cx={cx} cy={cy} rx={26} ry={10} fill={C.yellow} stroke={C.ink} strokeWidth={4} />
          ))}
        </svg>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 14, textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2}}>APNI BACHAT</div>
      </Door>
      <Sfx at={l15 + 8} name="coin" volume={0.3} />
      <Cross id="r-x1" x={180} y={420} w={440} h={500} at={word('L015', 'nahi', -4)} />
      <Stamp id="r-kam" text="Kam padegi" x={400} y={850} at={word('L015', 'hoti', -2)} size={58} rot={-8} paper />

      <Door id="r-d2" x={710} y={310} w={500} h={640} at={word('L014', 'teen', 0)} openAt={l16 + 4} num="2" title="BANK LOAN" />
      <Footage id="r-loan" src="bank_loan" x={744} y={410} w={432} h={300} at={l16 + 8} enter="fade" sfx={null} caption="LOAN DEPARTMENT" />
      <Stamp id="r-int" text="Interest" sub="HAR MAHINE" x={960} y={790} at={word('L016', 'interest', -2)} size={64} rot={-6} paper />
      <Hand x={770} y={852} at={word('L016', 'chai', -2)} size={40} rot={-2} color={C.red} w={420}>chai bike ya na bike!</Hand>

      <Door id="r-d3" x={1270} y={310} w={500} h={640} at={word('L014', 'teen', 4)} openAt={l17 + 4} num="3" title="PARTNER" hi>
        <svg width={440} height={420} viewBox="0 0 440 420" style={{position: 'absolute', left: 0, top: 0}}>
          {/* Raju (yellow) and a partner, a coin going one way, a slice the other */}
          <circle cx={160} cy={150} r={44} fill={C.yellow} stroke={C.ink} strokeWidth={5} />
          <path d="M90,330 C90,250 120,212 160,212 C200,212 230,250 230,330 Z" fill={C.yellow} stroke={C.ink} strokeWidth={5} />
          <circle cx={330} cy={150} r={44} fill={C.card} stroke={C.ink} strokeWidth={5} />
          <path d="M260,330 C260,250 290,212 330,212 C370,212 400,250 400,330 Z" fill={C.card} stroke={C.ink} strokeWidth={5} />
        </svg>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 14, textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2}}>RAJU · PARTNER</div>
      </Door>
      <Hold from={word('L017', 'paisa', -2)}>
        <PassItem id="r-coin" x1={1630} x2={1460} y={600} at={word('L017', 'paisa', -2)} label="₹" bg={C.yellow} />
        <PassItem id="r-slice" x1={1460} x2={1630} y={680} at={word('L017', 'hissa', -6)} label="HISSA" bg={C.paperLight} w={110} />
      </Hold>
      <Sfx at={word('L017', 'paisa', 0)} name="coin" volume={0.3} />
      <Marker id="r-tick" d="M1300,250 l34,40 l70,-96" at={word('L017', 'dhoondo', -2)} dur={6} color={C.ink} width={14} />
      <Sfx at={word('L017', 'dhoondo', -2)} name="marker" volume={0.3} />
    </AbsoluteFill>
  );
};

// A token sliding between two people.
const PassItem: React.FC<{id: string; x1: number; x2: number; y: number; at: number; label: string; bg: string; w?: number}> = ({id, x1, x2, y, at, label, bg, w = 70}) => {
  const frame = useCurrentFrame();
  const p = ease(stepped(frame), at, at + 14);
  const b = boil(id, frame, 0.8);
  return (
    <div style={{position: 'absolute', left: x1 + (x2 - x1) * p - w / 2 + b.x, top: y - 35 - Math.sin(p * Math.PI) * 40 + b.y, width: w, height: 70, borderRadius: w === 70 ? 35 : 8, background: bg, border: `4px solid ${C.ink}`, fontFamily: F.display, fontSize: w === 70 ? 44 : 30, lineHeight: '64px', textAlign: 'center', zIndex: 60, boxShadow: `3px 5px 6px ${C.shadow}`}}>{label}</div>
  );
};

// Company pie: slices are cut and handed out one by one.
type Slice = {who: string; frac: number; at: number; color: string};
const Pie: React.FC<{cx: number; cy: number; r: number; at: number; out?: number; slices: Slice[]}> = ({cx, cy, r, at, out, slices}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at || (out !== undefined && f >= out)) return null;
  const p = Math.min(1.06, Math.max(0, pop(frame, at, 12, 0.6)));
  const rest = 1 - slices.reduce((a, s) => a + s.frac, 0);
  let a0 = -Math.PI / 2;
  const arc = (a1: number, a2: number, rr: number, ox: number, oy: number) => {
    const large = a2 - a1 > Math.PI ? 1 : 0;
    return `M${ox},${oy} L${ox + rr * Math.cos(a1)},${oy + rr * Math.sin(a1)} A${rr},${rr} 0 ${large} 1 ${ox + rr * Math.cos(a2)},${oy + rr * Math.sin(a2)} Z`;
  };
  const parts: React.ReactNode[] = [];
  const labels: React.ReactNode[] = [];
  // Raju's share: everything not yet given away stays yellow
  const ungiven = slices.filter((s) => f < s.at).reduce((a, s) => a + s.frac, 0) + rest;
  slices.forEach((s) => {
    const a1 = a0, a2 = a0 + s.frac * Math.PI * 2;
    a0 = a2;
    if (f < s.at) return;
    const k = ease(f, s.at, s.at + 8);
    const mid = (a1 + a2) / 2;
    const ox = cx + Math.cos(mid) * 34 * k, oy = cy + Math.sin(mid) * 34 * k;
    parts.push(<path key={s.who} d={arc(a1, a2, r, ox, oy)} fill={s.color} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />);
    labels.push(
      <div key={s.who} style={{position: 'absolute', left: ox + Math.cos(mid) * r * 0.62 - 90, top: oy + Math.sin(mid) * r * 0.62 - 18, width: 180, textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 2, opacity: k}}>{s.who}</div>,
    );
  });
  const ra1 = a0, ra2 = -Math.PI / 2 + Math.PI * 2;
  const la = (200 * Math.PI) / 180;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${p})`, transformOrigin: `${cx}px ${cy}px`, zIndex: 20}}>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', filter: `drop-shadow(6px 10px 10px ${C.shadow})`}}>
        {ungiven > 0.999 ? <circle cx={cx} cy={cy} r={r} fill={C.yellow} stroke={C.ink} strokeWidth={6} /> : <path d={arc(ra1 - (ungiven - rest) * Math.PI * 2, ra2, r, cx, cy)} fill={C.yellow} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />}
        {parts}
      </svg>
      {labels}
      <div style={{position: 'absolute', left: cx + Math.cos(la) * r * 0.55 - 90, top: cy + Math.sin(la) * r * 0.55 - 26, width: 180, textAlign: 'center', fontFamily: F.display, fontSize: 52}}>RAJU</div>
    </div>
  );
};

const Partners: React.FC = () => {
  const {at, word} = useCues();
  const l19 = at('L019'), l20 = at('L020'), l21 = at('L021');
  const tFam = word('L018', 'family', -4), tDost = word('L018', 'dost', -4);
  const tAngel = word('L019', 'angel', -4), tVc = word('L019', 'venture', -4), tPe = word('L019', 'private', -4);
  const priv = word('L021', 'private', -4);
  const slices: Slice[] = [
    {who: 'FAMILY', frac: 0.1, at: tFam, color: C.paperLight},
    {who: 'DOST', frac: 0.08, at: tDost, color: '#d9d2c3'},
    {who: 'ANGEL', frac: 0.12, at: tAngel, color: C.card},
    {who: 'VC', frac: 0.14, at: tVc, color: '#c9c2b2'},
    {who: 'PE', frac: 0.14, at: tPe, color: C.paperLight},
  ];
  const people: [string, string, number, number, number][] = [
    ['p-fam', 'Family', 1210, 540, tFam],
    ['p-dost', 'Dost', 1440, 540, tDost],
    ['p-angel', 'Angel', 1670, 540, tAngel],
    ['p-vc', 'Venture cap.', 1210, 930, tVc],
    ['p-pe', 'Private equity', 1440, 930, tPe],
  ];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 300, top: 120, transform: 'rotate(-1.5deg)'}}><Label size={28}>Raju ki Chai Pvt Ltd · company ka pie</Label></div>
      <Pie cx={660} cy={560} r={330} at={2} slices={slices} />
      {slices.map((s) => <Sfx key={s.who} at={s.at} name="scissors" volume={0.35} />)}
      <Person id="p-raju" x={1670} y={930} s={1.15} at={2} out={priv} tone={C.yellow} label="Raju" enter="right" />
      {people.map(([id, label, x, y, t]) => (
        <Person key={id} id={id} x={x} y={y} s={1.15} at={t} out={priv} label={label} tone={id === 'p-vc' || id === 'p-pe' || id === 'p-angel' ? '#d6cfbf' : C.card} badge={id === 'p-vc' || id === 'p-pe' || id === 'p-angel' ? '₹₹' : undefined} />
      ))}
      {/* everyone gets shares */}
      {[...people, ['p-raju', 'Raju', 1670, 930, 0] as [string, string, number, number, number]].map(([id, , x, y], i) => (
        <Slip key={'s' + id} id={'ps' + id} x={x + 78} y={y - 210} at={word('L020', 'shares', -6) + i * 3} out={priv} text="SHARE" w={96} h={50} color={C.yellow} />
      ))}
      <Term at={word('L020', 'tukde', -8)} out={priv} text="Share = company ka tukda" x={300} y={930} />
      {/* private: locked box over the pie, no market */}
      <Card id="p-lid" x={260} y={200} w={800} h={740} rot={-1.5} at={priv} enter="down" bg={C.kraft} texture="kraft" torn={{bottom: true}} z={40}>
        <div style={{position: 'absolute', inset: 30, border: `5px dashed rgba(20,20,20,0.45)`}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 190, textAlign: 'center', fontFamily: F.display, fontSize: 170, color: C.ink, letterSpacing: 4}}>PRIVATE</div>
        <svg width={170} height={200} viewBox="0 0 170 200" style={{position: 'absolute', left: 315, top: 420}}>
          <path d="M40,90 v-30 a45,45 0 0 1 90,0 v30" fill="none" stroke={C.ink} strokeWidth={16} />
          <rect x={20} y={88} width={130} height={100} rx={10} fill={C.yellow} stroke={C.ink} strokeWidth={8} />
          <circle cx={85} cy={130} r={12} fill={C.ink} />
          <rect x={80} y={134} width={10} height={30} fill={C.ink} />
        </svg>
      </Card>
      <Sfx at={priv + 8} name="padlock" volume={0.55} />
      <Photo id="p-bse" src="bse.jpg" x={1150} y={170} w={640} h={500} rot={2} at={word('L021', 'bazaar', -8)} enter="right" torn={{top: true, right: true}} rough={12} caption="SHARE BAZAAR" pos="50% 30%" />
      <Cross id="p-xb" x={1180} y={200} w={580} h={440} at={word('L021', 'nahi', -4)} />
      <Hand x={1170} y={730} at={word('L021', 'khareed-bech', -2)} size={66} rot={-3} color={C.red} w={640}>khareed-bech nahi!</Hand>
      <Tape id="p-tape" x={1390} y={150} w={170} rot={-4} at={word('L021', 'bazaar', -4)} />
    </AbsoluteFill>
  );
};

// Money pipe: a thick kraft tube that draws itself on, sitting behind the cards,
// with dashes flowing along it once it's full.
const Pipe: React.FC<{d: string; at: number; out?: number}> = ({d, at, out}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at || (out !== undefined && f >= out)) return null;
  const p = ease(f, at, at + 12);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, zIndex: 10, overflow: 'visible', filter: `drop-shadow(4px 7px 6px ${C.shadow})`}}>
      <path d={d} pathLength={1} fill="none" stroke={C.ink} strokeWidth={60} strokeLinejoin="round" strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - p} />
      <path d={d} pathLength={1} fill="none" stroke={C.kraft} strokeWidth={46} strokeLinejoin="round" strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - p} />
      {p >= 1 ? <path d={d} fill="none" stroke={C.yellow} strokeWidth={10} strokeLinecap="round" strokeDasharray="22 30" strokeDashoffset={-stepped(frame - at) * 3} /> : null}
    </svg>
  );
};

const Ipo: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l23 = at('L023'), l24 = at('L024'), l25 = at('L025'), l26 = at('L026'), l27 = at('L027'), l28 = at('L028'), l29 = at('L029'), l30 = at('L030');
  const aao = word('L025', 'aao', -6);
  const kill = word('L030', 'poora', -4);
  const zar = ease(stepped(frame), word('L023', 'itna', -2), word('L023', 'itna', 12));
  const priv = ease(stepped(frame), word('L023', 'private', -2), word('L023', 'private', 10));
  return (
    <AbsoluteFill>
      {/* two things happen */}
      <Hold to={l25}>
        <div style={{position: 'absolute', left: 140, top: 120}}><Big words={['Phir', 'ek', 'din…']} at={4} size={120} /></div>
      </Hold>
      <Card id="i-c1" x={140} y={290} w={800} h={660} rot={-1.5} at={word('L022', 'do', -4)} out={l25} enter="left" bg={C.card}>
        <div style={{position: 'absolute', left: 30, top: 24, fontFamily: F.display, fontSize: 90, color: C.inkSoft, opacity: 0.5}}>1</div>
        <div style={{position: 'absolute', left: 130, top: 44}}><Label size={22}>Zaroorat vs private paisa</Label></div>
        {frame >= l23 ? (
          <>
            <div style={{position: 'absolute', left: 150, bottom: 110, width: 200, height: 420 * zar, background: C.yellow, border: `5px solid ${C.ink}`}} />
            <div style={{position: 'absolute', left: 450, bottom: 110, width: 200, height: 170 * priv, background: C.paperLight, border: `5px solid ${C.ink}`}} />
            <div style={{position: 'absolute', left: 110, bottom: 40, width: 280, textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 2}}>ZAROORAT</div>
            <div style={{position: 'absolute', left: 410, bottom: 28, width: 280, textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, lineHeight: 1.2}}>PRIVATE<br />PARTNERS</div>
          </>
        ) : null}
      </Card>
      <Marker id="i-gap" d="M815,425 L815,665" at={word('L023', 'kam', -4)} out={l25} dur={5} color={C.red} width={8} />
      <Hand x={835} y={575} at={word('L023', 'kam', -2)} out={l25} size={46} rot={-4} color={C.red} w={260}>kam pad gaye!</Hand>
      <Card id="i-c2" x={1000} y={290} w={780} h={660} rot={1.5} at={word('L022', 'do', 0)} out={l25} enter="right" bg={C.card}>
        <div style={{position: 'absolute', left: 30, top: 24, fontFamily: F.display, fontSize: 90, color: C.inkSoft, opacity: 0.5}}>2</div>
        <div style={{position: 'absolute', left: 130, top: 44}}><Label size={22}>Purane partners</Label></div>
      </Card>
      <Person id="i-vc" x={1220} y={880} s={1.25} at={l24 + 2} out={l25} label="VC" tone="#d6cfbf" badge="₹₹" />
      <Person id="i-pe" x={1440} y={880} s={1.25} at={l24 + 6} out={l25} label="PE" tone="#d6cfbf" badge="₹₹" />
      <Card id="i-bub" x={1090} y={400} w={560} h={150} rot={-2} at={word('L024', 'kehte', -2)} out={l25} enter="drop" bg={C.paperLight} sfx="pop">
        <div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 56, textAlign: 'center', lineHeight: '150px'}}>“hamein nikalna hai!”</div>
      </Card>
      <Arrow id="i-exit" x1={1560} y1={760} x2={1740} y2={640} at={word('L024', 'nikalna', -2)} out={l25} bow={-20} />
      <Stamp id="i-exitst" text="Exit" x={1680} y={560} at={word('L024', 'nikalna', 4)} out={l25} size={60} rot={8} paper />

      {/* aao, partner bano */}
      <Footage id="i-crowd" src="train_crowd" x={140} y={130} w={1640} h={650} rot={-1} at={l25 - 2} out={l26} enter="up" torn={{top: true, bottom: true}} rough={16} caption="POORA DESH" />
      <Card id="i-ban" x={330} y={600} w={1260} h={230} rot={-2.5} at={aao} out={l26} enter="drop" bg={C.yellow} torn={{left: true, right: true}} rough={14} z={45}>
        <div style={{fontFamily: F.display, fontSize: 136, textAlign: 'center', lineHeight: '230px', whiteSpace: 'nowrap'}}>AAO, PARTNER BANO!</div>
      </Card>
      <Sfx at={aao} name="crowd" volume={0.4} />
      {Array.from({length: 11}).map((_, i) => (
        <Person key={i} id={'i-cr' + i} x={220 + i * 150} y={1000} s={0.75 + random('crs' + i) * 0.2} at={aao + 6 + i * 2} out={l26} enter="right" tone={i % 3 === 0 ? '#d6cfbf' : i % 3 === 1 ? C.paperLight : C.card} sfx={i === 0 ? 'slide' : null} />
      ))}

      {/* I · P · O */}
      {['I', 'P', 'O'].map((L, i) => {
        const w = ['Initial', 'Public', 'Offering'][i];
        const wa = word('L026', w.toLowerCase(), -4);
        return (
          <Card key={L} id={'i-l' + L} x={240 + i * 490} y={140} w={460} h={570} rot={[-2, 1.5, -1][i]} at={word('L026', 'ipo', -6) + i * 3} out={l27} enter="drop" bg={i === 1 ? C.yellow : C.paperLight}>
            <div style={{fontFamily: F.display, fontSize: 370, textAlign: 'center', lineHeight: 1.05}}>{L}</div>
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 40, textAlign: 'center', fontFamily: F.display, fontSize: 72, opacity: frame >= wa ? 1 : 0, transform: `translateY(${frame >= wa + 2 ? 0 : -16}px)`}}>{w.toUpperCase()}</div>
          </Card>
        );
      })}
      <Stamp id="i-pehli" text="Pehli baar" x={1560} y={840} at={word('L026', 'pehli', -2)} out={l27} size={78} rot={-7} paper />
      <Hand x={260} y={780} at={word('L026', 'shares', -16)} out={l27} size={84} rot={-2} w={1150}>public ko shares ka offer</Hand>

      {/* where the money goes: two pipes */}
      <Photo id="i-note" src="note500.jpg" x={740} y={120} w={440} h={220} rot={-2} at={l27} out={kill + 4} enter="drop" caption="IPO KA PAISA" zoom={0} />
      <Pipe d="M960,330 V470 Q960,490 940,490 H490 Q460,490 460,520 V630" at={word('L027', 'do', -6)} />
      <Pipe d="M960,330 V470 Q960,490 980,490 H1440 Q1470,490 1470,520 V670" at={word('L027', 'do', -2)} />
      <Sfx at={word('L027', 'do', -6)} name="slide" volume={0.3} />
      <Card id="i-fresh" x={120} y={290} w={420} h={110} rot={-3} at={l28} enter="left" bg={C.yellow} z={50}>
        <div style={{fontFamily: F.display, fontSize: 70, textAlign: 'center', lineHeight: '110px'}}>FRESH ISSUE</div>
      </Card>
      {[0, 1, 2].map((i) => (
        <Slip key={'n' + i} id={'i-new' + i} x={640 + i * 34} y={600 + i * 24} at={word('L028', 'naye', -4) + i * 3} text="NAYA SHARE" w={150} h={60} color={C.paperLight} size={14} />
      ))}
      <Card id="i-safe" x={180} y={620} w={560} h={330} rot={-1} at={word('L028', 'company', -6)} enter="up" bg={C.card}>
        <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 30px', gap: 26}}>
          <svg width={180} height={200} viewBox="0 0 180 200">
            <rect x={10} y={10} width={160} height={170} rx={8} fill="#8f897d" stroke={C.ink} strokeWidth={7} />
            <circle cx={90} cy={92} r={40} fill={C.paperLight} stroke={C.ink} strokeWidth={6} />
            <path d="M90,62 v60 M60,92 h60" stroke={C.ink} strokeWidth={6} />
            <rect x={30} y={180} width={24} height={14} fill={C.ink} /><rect x={126} y={180} width={24} height={14} fill={C.ink} />
          </svg>
          <div>
            <div style={{fontFamily: F.display, fontSize: 70, lineHeight: 1}}>COMPANY</div>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 2, marginTop: 8}}>KI TIJORI</div>
          </div>
        </div>
      </Card>
      <Sfx at={word('L028', 'company', 0)} name="coin" volume={0.35} />
      <Hand x={760} y={890} at={word('L028', 'kaam', -4)} size={56} rot={-3} w={500}>← kaam ke liye</Hand>

      <Card id="i-ofs" x={1370} y={290} w={430} h={110} rot={2.5} at={l29} out={kill + 10} enter="right" bg={C.paperLight} z={50}>
        <div style={{fontFamily: F.display, fontSize: 58, textAlign: 'center', lineHeight: '110px'}}>OFFER FOR SALE</div>
      </Card>
      <Person id="i-o1" x={1610} y={640} s={0.8} at={word('L029', 'purane', -4)} out={kill + 10} tone="#d6cfbf" badge="₹₹" />
      <Person id="i-o2" x={1730} y={640} s={0.8} at={word('L029', 'partners', -4)} out={kill + 10} tone="#d6cfbf" badge="₹₹" />
      <Slip id="i-old" x={1560} y={470} at={word('L029', 'shares', -4)} out={kill + 10} text="PURANA SHARE" w={160} h={56} size={14} />
      <Card id="i-jeb" x={1180} y={660} w={580} h={300} rot={1.5} at={word('L029', 'jeb', -8)} out={kill + 10} enter="up" bg={C.card}>
        <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 30px', gap: 24}}>
          <svg width={170} height={190} viewBox="0 0 170 190">
            <path d="M15,15 h140 v100 c0,45 -35,65 -70,65 c-35,0 -70,-20 -70,-65 Z" fill="#6f7a8a" stroke={C.ink} strokeWidth={7} />
            <path d="M15,45 h140" stroke={C.paperLight} strokeWidth={4} strokeDasharray="10 8" />
            <ellipse cx={85} cy={22} rx={40} ry={12} fill={C.yellow} stroke={C.ink} strokeWidth={5} />
          </svg>
          <div>
            <div style={{fontFamily: F.display, fontSize: 60, lineHeight: 1}}>UNKI JEB</div>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: 2, marginTop: 8}}>PURANE PARTNERS</div>
          </div>
        </div>
      </Card>
      <Sfx at={word('L029', 'jeb', 0)} name="coin" volume={0.35} />

      {/* Jio */}
      <Cross id="i-xofs" x={1200} y={430} w={560} h={520} at={kill} out={kill + 14} />
      <Photo id="i-jio" src="jiosim.jpg" x={740} y={120} w={460} h={300} rot={2} at={l30} enter="drop" pos="40% 50%" caption="JIO PLATFORMS" zoom={0} z={55} />
      <Stamp id="i-100" text="100% fresh issue" x={270} y={520} size={50} at={word('L030', 'fresh', -2)} rot={-7} paper />
      <Card id="i-27" x={1230} y={170} w={560} h={290} rot={-2} at={word('L030', '27', -6)} enter="right" bg={C.yellow} z={50}>
        <div style={{padding: '22px 34px'}}>
          <Label size={20}>Jio · naye shares</Label>
          <div style={{fontFamily: F.display, fontSize: 130, lineHeight: 1.05, marginTop: 6}}>27 CRORE</div>
        </div>
      </Card>
      <Card id="i-loan" x={1230} y={560} w={560} h={330} rot={1.5} at={word('L030', 'loan', -8)} enter="up" bg={C.paperLight} z={50}>
        <div style={{padding: '26px 34px'}}>
          <Label size={20}>Bada hissa</Label>
          <div style={{fontFamily: F.display, fontSize: 104, lineHeight: 1, marginTop: 14, color: C.red}}>LOAN</div>
          <div style={{fontFamily: F.display, fontSize: 104, lineHeight: 1}}>CHUKANE</div>
        </div>
      </Card>
      <Arrow id="i-ar" x1={760} y1={800} x2={1215} y2={760} at={word('L030', 'bada', -2)} bow={-40} color={C.red} />
    </AbsoluteFill>
  );
};

export const c1: Record<string, React.FC> = {raju: Raju, partners: Partners, ipo: Ipo};
