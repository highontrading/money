import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {grid, Hold} from '../../components/kit';
import {Big, Card, Count, Cross, Hand, HL, Label, Marker, Photo, Sfx, Stamp, Tape} from '../../components/paper';
import {ease, pop, stepped} from '../../lib/motion';
import {useCues} from '../../lib/timeline';
import {C, F} from '../../theme';
import {Person, Slip, Typed} from '../kit16';

// Chapter 5 · Lottery: T day, the T+3 clock, allotment by lottery, demat credit.

// T → T+3 ribbon. `reveal` = frame each step appears, `active` = step in yellow.
const STEPS: [string, string][] = [['T', 'ISSUE BAND'], ['T+1', 'ALLOTMENT'], ['T+2', 'DEMAT / REFUND'], ['T+3', 'LISTING']];
const Ribbon: React.FC<{id: string; x: number; y: number; w: number; h: number; at: number; out?: number; reveal: number[]; active?: number; activeAt?: number; done?: number}> = ({id, x, y, w, h, at, out, reveal, active = -1, activeAt = 0, done = -1}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  const bw = (w - 60 - 3 * 24) / 4;
  return (
    <Card id={id} x={x} y={y} w={w} h={h} rot={-0.8} at={at} out={out} enter="left" bg={C.kraft} texture="kraft" torn={{left: true, right: true}} rough={12}>
      <div style={{display: 'flex', gap: 24, padding: '0 30px', height: '100%', alignItems: 'center'}}>
        {STEPS.map(([t, s], i) => {
          const ra = reveal[i] ?? at;
          const p = f >= ra ? Math.min(1.06, Math.max(0, pop(frame, ra, 11, 0.5))) : 0;
          const isActive = i === active && f >= activeAt;
          return (
            <div key={t} style={{width: bw, height: h - 44, transform: `scale(${p}) rotate(${i % 2 ? 1.2 : -1.2}deg)`, background: isActive ? C.yellow : C.paperLight, border: `4px solid ${C.ink}`, boxShadow: `3px 5px 6px ${C.shadow}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
              <div style={{fontFamily: F.display, fontSize: h * 0.36, lineHeight: 1}}>{t}</div>
              <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: Math.max(16, h * 0.11), letterSpacing: 2, marginTop: 4}}>{s}</div>
              {i <= done ? <div style={{position: 'absolute', right: 10, top: 6, fontFamily: F.display, fontSize: h * 0.2, color: C.inkSoft}}>✓</div> : null}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

// Paper wall clock. `minutes` = minutes past midnight (hour and minute hands);
// `sec` drives a ticking second hand.
const PaperClock: React.FC<{id: string; x: number; y: number; size: number; at: number; out?: number; minutes: number; sec?: number}> = ({id, x, y, size, at, out, minutes, sec}) => {
  const ma = (minutes % 60) * 6;
  const ha = ((minutes / 60) % 12) * 30;
  return (
    <Card id={id} x={x} y={y} w={size} h={size} at={at} out={out} enter="drop" bg="transparent" texture={null} depth={1.2}>
      <svg width={size} height={size} viewBox="0 0 200 200">
        <circle cx={100} cy={100} r={96} fill={C.paperLight} stroke={C.ink} strokeWidth={6} />
        <circle cx={100} cy={100} r={84} fill="none" stroke={C.ink} strokeWidth={1.5} opacity={0.4} />
        {Array.from({length: 60}).map((_, i) => {
          const a = (i * 6 * Math.PI) / 180;
          const long = i % 5 === 0;
          return <line key={i} x1={100 + Math.sin(a) * (long ? 72 : 78)} y1={100 - Math.cos(a) * (long ? 72 : 78)} x2={100 + Math.sin(a) * 84} y2={100 - Math.cos(a) * 84} stroke={C.ink} strokeWidth={long ? 4 : 1.5} />;
        })}
        {[['12', 0], ['3', 90], ['6', 180], ['9', 270]].map(([t, d]) => {
          const a = ((d as number) * Math.PI) / 180;
          return <text key={t as string} x={100 + Math.sin(a) * 56} y={100 - Math.cos(a) * 56 + 9} textAnchor="middle" fontFamily="Anton" fontSize={26} fill={C.ink}>{t}</text>;
        })}
        <line x1={100} y1={100} x2={100 + Math.sin((ha * Math.PI) / 180) * 44} y2={100 - Math.cos((ha * Math.PI) / 180) * 44} stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
        <line x1={100} y1={100} x2={100 + Math.sin((ma * Math.PI) / 180) * 70} y2={100 - Math.cos((ma * Math.PI) / 180) * 70} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
        {sec !== undefined ? <line x1={100 - Math.sin((sec * 6 * Math.PI) / 180) * 14} y1={100 + Math.cos((sec * 6 * Math.PI) / 180) * 14} x2={100 + Math.sin((sec * 6 * Math.PI) / 180) * 78} y2={100 - Math.cos((sec * 6 * Math.PI) / 180) * 78} stroke={C.red} strokeWidth={2.5} /> : null}
        <circle cx={100} cy={100} r={7} fill={C.red} stroke={C.ink} strokeWidth={2} />
      </svg>
    </Card>
  );
};

// A ticket that flies along an arc from (x1,y1) into (x2,y2), then vanishes into the drum.
const Fly: React.FC<{id: string; x1: number; y1: number; x2: number; y2: number; at: number; dur?: number; text: string}> = ({id, x1, y1, x2, y2, at, dur = 18, text}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at || f > at + dur + 6) return null;
  const p = ease(f, at, at + dur);
  const x = x1 + (x2 - x1) * p;
  const y = y1 + (y2 - y1) * p - Math.sin(Math.PI * p) * 220;
  const o = f > at + dur ? 1 - (f - at - dur) / 6 : 1;
  return (
    <>
      <Sfx at={at} name="whoosh" volume={0.25} />
      <div style={{position: 'absolute', left: x - 70, top: y - 42, width: 140, height: 84, background: C.yellow, border: `4px solid ${C.ink}`, transform: `rotate(${p * 540 + random(id) * 20}deg) scale(${1 - 0.35 * p})`, opacity: o, fontFamily: F.display, fontSize: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `4px 6px 8px ${C.shadow}`, zIndex: 80}}>{text}</div>
    </>
  );
};

// Paper tickets tumbling inside the drum photo.
const Tumble: React.FC<{cx: number; cy: number; rx: number; ry: number; at: number; out?: number; n?: number}> = ({cx, cy, rx, ry, at, out, n = 14}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at || (out !== undefined && f >= out)) return null;
  return (
    <>
      {Array.from({length: n}).map((_, i) => {
        const sp = 0.05 + random('tsp' + i) * 0.05;
        const a = f * sp + random('ta' + i) * Math.PI * 2;
        const rr = 0.35 + random('tr' + i) * 0.6;
        const x = cx + Math.cos(a) * rx * rr;
        const y = cy + Math.sin(a) * ry * rr;
        return <div key={i} style={{position: 'absolute', left: x - 34, top: y - 20, width: 68, height: 40, background: i % 4 === 0 ? C.yellow : C.paperLight, border: `3px solid ${C.ink}`, transform: `rotate(${f * (3 + i) + i * 40}deg)`, boxShadow: `2px 3px 4px ${C.shadow}`, zIndex: 30}} />;
      })}
    </>
  );
};

const Clock: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word, length} = useCues();
  const tick = word('L085', 'ghadi', -4);
  const secs = Math.max(0, Math.floor((frame - tick) / 30));
  const ticks = Array.from({length: Math.max(0, Math.ceil((length - tick) / 30))});
  return (
    <AbsoluteFill>
      {ticks.map((_, i) => <Sfx key={i} at={tick + i * 30} name="clock" volume={0.28} />)}
      <PaperClock id="k-clock" x={150} y={150} size={640} at={2} minutes={17 * 60} sec={frame >= tick ? secs * 5 : 0} />
      <Stamp id="k-tday" text="T day" sub="ISSUE BAND · TEEN DIN KHATAM" x={470} y={860} at={word('L085', 'day', -2)} size={110} rot={-6} paper />
      <Card id="k-days" x={900} y={150} w={900} h={360} rot={1.5} at={word('L085', 'teen', -4)} out={word('L085', 'ab', -4)} enter="right" bg={C.paperLight}>
        <div style={{padding: '26px 34px'}}>
          <Label size={22}>Bidding · teen din</Label>
          <div style={{display: 'flex', gap: 26, marginTop: 26}}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{flex: 1, height: 200, border: `4px solid ${C.ink}`, background: C.card, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: 90}}>DIN</div>
            ))}
          </div>
        </div>
      </Card>
      {[0, 1, 2].map((i) => <Cross key={i} id={'k-x' + i} x={950 + i * 285} y={250} w={230} h={190} at={word('L085', 'khatam', -8) + i * 5} out={word('L085', 'ab', -4)} />)}
      <div style={{position: 'absolute', left: 900, top: 150}}>
        <Big words={['Ab', 'ghadi', 'chalti', 'hai']} at={word('L085', 'ab', -2)} size={130} />
      </div>
      <Hold from={at('L086') - 4}>
        <div style={{position: 'absolute', left: 900, top: 420}}><Label size={26}>SEBI ka niyam</Label></div>
      </Hold>
      <Ribbon id="k-rib" x={880} y={490} w={920} h={230} at={at('L086')} reveal={[at('L086'), word('L086', 'teen', 0), word('L086', 'working', 0), word('L086', 'T+3', -2)]} active={3} activeAt={word('L086', 'T+3', -2)} />
      <Hand x={900} y={760} at={word('L086', 'teen', -2)} size={64} rot={-2}>band hone ke 3 working din mein</Hand>
      <Stamp id="k-list" text="Listing" x={1620} y={920} at={word('L086', 'listing', -4)} size={78} rot={6} />
    </AbsoluteFill>
  );
};

// A paper phone with the allotment-status page, big enough to read.
const StatusPhone: React.FC<{at: number; pan: number; done: number}> = ({at, pan, done}) => {
  const frame = useCurrentFrame();
  return (
    <Card id="a-phone" x={330} y={110} w={520} h={880} rot={-3} at={at} enter="up" bg="#1f1d1a" texture={null}>
      <div style={{position: 'absolute', left: 26, right: 26, top: 70, bottom: 70, background: C.paperLight, borderRadius: 14, fontFamily: F.mono, textAlign: 'center', padding: '50px 30px'}}>
        <div style={{fontSize: 24, fontWeight: 700, letterSpacing: 3}}>IPO ALLOTMENT</div>
        <div style={{fontFamily: F.display, fontSize: 84, marginTop: 10}}>STATUS</div>
        <div style={{fontSize: 22, fontWeight: 700, letterSpacing: 2, marginTop: 40, textAlign: 'left'}}>PAN</div>
        <div style={{marginTop: 10, border: `4px solid ${C.ink}`, fontSize: 36, fontWeight: 700, padding: '16px 0', minHeight: 44}}>
          <Typed text="ABCDE1234F" at={pan} cps={20} style={{fontFamily: F.mono, fontSize: 36}} />
        </div>
        <div style={{margin: '50px 10px 0', background: frame >= done ? C.yellow : C.ink, color: frame >= done ? C.ink : C.paperLight, fontSize: 30, fontWeight: 700, padding: '20px 0', letterSpacing: 3, border: `4px solid ${C.ink}`}}>{frame >= done ? 'RESULT ✓' : 'CHECK'}</div>
      </div>
      <div style={{position: 'absolute', left: '50%', top: 26, width: 90, height: 14, marginLeft: -45, borderRadius: 7, background: '#3a3732'}} />
    </Card>
  );
};

const Allot: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, end, word} = useCues();
  const l88 = at('L088'), l89 = at('L089'), l90 = at('L090'), l91 = at('L091'), l92 = at('L092'), l93 = at('L093');
  const people = [300, 500, 700, 900, 1100, 1300, 1500, 1700];
  const giveAt = word('L088', 'logon', -6);
  const drumX = 560, drumY = 160, drumW = 800, drumH = 600;
  const harKisi = word('L092', 'har', -2);
  return (
    <AbsoluteFill>
      {/* T+1: who gets shares? */}
      <Ribbon id="a-rib" x={160} y={150} w={1600} h={180} at={0} out={l88} reveal={[0, 0, 4, 8]} active={1} activeAt={word('L087', 'T+1', -2)} done={0} />
      <Hold from={at('L087', 2)} to={l88}>
        <div style={{position: 'absolute', left: 170, top: 380}}><Big words={['Pehla', 'kaam:', 'shares', 'kisko', 'milenge?']} at={at('L087', 2)} gap={6} size={150} /></div>
      </Hold>
      {people.map((x, i) => (
        <Person key={i} id={'a-p' + i} x={x} y={995} s={1.05} at={at('L087', 14) + i * 3} out={l89} tone={i % 3 === 1 ? C.newsprint : C.card} sfx={i ? null : 'slide'} />
      ))}
      {people.map((x, i) => (
        <React.Fragment key={'q' + i}>
          <Hold from={word('L087', 'kisko', 0) + i * 2} to={giveAt + i * 4}>
            <div style={{position: 'absolute', left: x - 22, top: 680, fontFamily: F.display, fontSize: 64, color: C.red, transform: `rotate(${(i % 2 ? 8 : -8)}deg)`}}>?</div>
          </Hold>
          <Slip id={'a-lot' + i} x={x} y={705} at={giveAt + i * 4} out={l89} text="1 LOT" w={118} h={64} size={20} color={C.yellow} />
        </React.Fragment>
      ))}
      {/* the rule */}
      <Card id="a-rule" x={160} y={130} w={1600} h={430} rot={-1} at={l88} out={l89} enter="up" bg={C.paperLight}>
        <div style={{padding: '34px 50px'}}>
          <Label size={24}>Retail · demand zyada ho toh niyam</Label>
          <div style={{fontFamily: F.display, fontSize: 118, lineHeight: 1.05, marginTop: 26}}>
            <span style={{opacity: frame >= word('L088', 'zyada', 0) ? 1 : 0.15}}>ZYADA SE ZYADA LOGON KO,</span><br />
            <span style={{opacity: frame >= word('L088', 'kam', -2) ? 1 : 0.15}}><HL at={word('L088', 'kam', 0)}>KAM SE KAM 1 LOT</HL></span>
          </div>
        </div>
      </Card>
      {[0, 1, 2, 3, 4, 5].map((i) => <Sfx key={i} at={giveAt + i * 8} name="pop" volume={0.18} />)}

      {/* the lottery drum */}
      <Photo id="a-drum" src="drum.jpg" x={drumX} y={drumY} w={drumW} h={drumH} rot={-1.5} at={l89 - 2} out={l91} enter="up" torn={{top: true, bottom: true}} rough={14} zoom={0.02} caption="LOTTERY DRUM" />
      <Tumble cx={drumX + drumW * 0.5} cy={drumY + drumH * 0.47} rx={250} ry={150} at={l89 + 6} out={l91} />
      <Sfx at={word('L089', 'lottery', -6)} name="drum" volume={0.5} />
      <Sfx at={word('L089', 'lottery', 40)} name="drum" volume={0.35} />
      <Stamp id="a-lottery" text="Lottery" x={960} y={860} at={word('L089', 'lottery', -2)} out={l90} size={120} rot={-5} paper />
      <Card id="a-comp" x={130} y={240} w={400} h={330} rot={-3} at={word('L089', 'computer', -4)} out={l90} enter="left" bg={C.card}>
        <div style={{padding: 30}}>
          <Label size={20}>Kaise?</Label>
          <div style={{fontFamily: F.display, fontSize: 82, lineHeight: 1, marginTop: 24}}>COMPUTER SE</div>
          <div style={{fontFamily: F.type, fontSize: 30, marginTop: 16}}>random draw</div>
        </div>
      </Card>
      <Card id="a-nig" x={1400} y={300} w={400} h={380} rot={3} at={word('L089', 'stock', -4)} out={l90} enter="right" bg={C.yellow}>
        <div style={{padding: 30}}>
          <Label size={20}>Nigrani</Label>
          <div style={{fontFamily: F.display, fontSize: 70, lineHeight: 1.02, marginTop: 24}}>STOCK EXCHANGE KI NAZAR MEIN</div>
        </div>
      </Card>

      {/* twist: 1 lot vs 14 lots = one ticket each */}
      <Person id="a-one" x={300} y={960} s={1.5} at={l90} out={l91} tone={C.card} label="1 LOT" enter="left" />
      <Person id="a-14" x={1620} y={960} s={1.5} at={l90 + 4} out={l91} tone={C.newsprint} label="14 LOTS" enter="right" />
      {Array.from({length: 14}).map((_, i) => (
        <Slip key={i} id={'a-st' + i} x={1430 + (i % 2) * 22} y={640 - i * 22} at={word('L090', '14', -10) + i} out={l91} text="LOT" w={160} h={70} size={20} rot={(i % 3) * 3 - 3} />
      ))}
      <Slip id="a-st1" x={470} y={600} at={word('L090', 'lot', -8)} out={l91} text="1 LOT" w={160} h={70} size={22} color={C.paperLight} />
      <Fly id="a-f1" x1={330} y1={640} x2={drumX + drumW * 0.45} y2={drumY + drumH * 0.45} at={word('L090', 'lottery', -10)} text="PARCHI" />
      <Fly id="a-f14" x1={1590} y1={640} x2={drumX + drumW * 0.55} y2={drumY + drumH * 0.5} at={word('L090', 'lottery', -4)} text="PARCHI" />
      <Stamp id="a-ekhi" text="Ek hi parchi" sub="1 LOT YA 14 · CHANCE BARABAR" x={960} y={860} at={word('L090', 'parchi', -4)} out={l91} size={104} rot={-4} paper />

      {/* the Jio maths */}
      <Card id="a-math" x={150} y={130} w={1620} h={840} rot={-0.8} at={l91} out={l92} enter="up" bg={C.paperLight}>
        <div style={{position: 'absolute', inset: 0, ...grid(44)}} />
        <div style={{position: 'relative', padding: '40px 70px'}}>
          <Label size={26}>Jio · retail ka hissa</Label>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 40, marginTop: 30, opacity: frame >= word('L091', '8.5', -4) ? 1 : 0.12}}>
            <div style={{fontFamily: F.display, fontSize: 170, lineHeight: 1}}>~8.5 CRORE</div>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 34, letterSpacing: 3}}>SHARES</div>
          </div>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 40, marginTop: 6, opacity: frame >= word('L091', '12', -4) ? 1 : 0.12}}>
            <div style={{fontFamily: F.display, fontSize: 150, lineHeight: 1, color: C.inkSoft}}>÷ 12</div>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 34, letterSpacing: 3}}>SHARES KA 1 LOT</div>
          </div>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 40, marginTop: 40, opacity: frame >= word('L091', '70', -6) ? 1 : 0}}>
            <div style={{fontFamily: F.display, fontSize: 190, lineHeight: 1}}><HL at={word('L091', '70', 4)}>= ~<Count from={0} to={70} at={word('L091', '70', -6)} dur={20} fmt={(n) => String(Math.round(n))} /> LAKH</HL></div>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 3, lineHeight: 1.4}}>ZYADA SE ZYADA<br />JEETNE WALE</div>
          </div>
        </div>
      </Card>
      <Marker id="a-line" d="M230,598 Q900,590 1600,602" at={word('L091', 'yaani', -4)} out={l92} color={C.ink} width={8} />
      <Sfx at={word('L091', 'yaani', -4)} name="marker" volume={0.25} />

      {/* more applicants than winners */}
      <Photo id="a-crowd" src="crowd.jpg" x={110} y={140} w={1080} h={640} rot={-1.5} at={l92 - 2} out={l93} enter="left" torn={{top: true, right: true}} rough={14} caption="APPLY KARNE WALE" />
      <Hold from={l92} to={l93 + 8}>
        <div style={{position: 'absolute', left: 1250, top: 150}}><Label size={20}>Jeetne wale · baaki</Label></div>
      </Hold>
      {Array.from({length: 12}).map((_, i) => {
        const win = [1, 6, 8].includes(i);
        return <Person key={i} id={'a-g' + i} x={1310 + (i % 4) * 140} y={400 + Math.floor(i / 4) * 205} s={0.78} at={l92 + 4 + i} out={l93} tone={win && frame >= harKisi ? C.yellow : C.card} enter="drop" sfx={null} />;
      })}
      <Stamp id="a-nahi" text="Har kisi ko nahi" sub="MILEGA" x={650} y={700} at={word('L092', 'nahi', -4)} out={l93} size={92} rot={-5} paper />
      <Photo id="a-note" src="note500.jpg" x={1250} y={800} w={520} h={180} rot={-3} at={word('L092', 'chahe', -4)} out={l93} enter="up" torn={{left: true}} rough={10} />
      <Cross id="a-xnote" x={1270} y={810} w={480} h={160} at={word('L092', 'kitna', -2)} out={l93} />

      {/* check your status */}
      <StatusPhone at={l93 - 2} pan={word('L093', 'pan', -2)} done={end('L093', -8)} />
      {[
        {t: 'REGISTRAR KI SITE', w: 'registrar', y: 200, bg: C.yellow},
        {t: 'NSE', w: 'nse', y: 470, bg: C.paperLight},
        {t: 'BSE', w: 'bse', y: 690, bg: C.paperLight},
      ].map((c, i) => (
        <Card key={c.t} id={'a-site' + i} x={1180} y={c.y} w={600} h={190} rot={[2, -1.5, 1][i]} at={word('L093', c.w, -4)} enter="right" bg={c.bg}>
          <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 34px', gap: 24}}>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, color: C.inkSoft}}>0{i + 1}</div>
            <div style={{fontFamily: F.display, fontSize: i ? 110 : 70, lineHeight: 1}}>{c.t}</div>
          </div>
        </Card>
      ))}
      <Sfx at={end('L093', -8)} name="ping" volume={0.35} />
      <Tape id="a-tape" x={1440} y={182} w={150} rot={-8} at={word('L093', 'registrar', 0)} />
    </AbsoluteFill>
  );
};

// Paper locker for the demat credit.
const Locker: React.FC<{open: number}> = ({open}) => (
  <div style={{position: 'absolute', left: 60, top: 150, width: 300, height: 300, background: '#4a4741', border: `5px solid ${C.ink}`, boxShadow: `inset 0 0 0 14px #5b5750`}}>
    <div style={{position: 'absolute', left: 110, top: 110, width: 80, height: 80, borderRadius: 40, border: `6px solid ${C.paperLight}`, transform: `rotate(${open * 180}deg)`}}>
      <div style={{position: 'absolute', left: 30, top: -6, width: 8, height: 30, background: C.paperLight}} />
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 18, textAlign: 'center', fontFamily: F.display, fontSize: 40, color: C.paperLight}}>DEMAT</div>
  </div>
);

const Credit: React.FC = () => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  const {at, word} = useCues();
  const l95 = at('L095');
  const demat = word('L094', 'demat', -10);
  const rel = word('L094', 'release', -6);
  const relP = ease(f, rel, rel + 8);
  const cert = word('L095', 'certificate', -6);
  const drop = ease(f, cert, cert + 16);
  return (
    <AbsoluteFill>
      <Ribbon id="c-rib" x={160} y={120} w={1600} h={170} at={0} out={l95} reveal={[0, 0, 0, 6]} active={2} activeAt={word('L094', 'T+2', -2)} done={1} />
      {/* got it: shares into the demat locker */}
      <Card id="c-yes" x={150} y={340} w={790} h={630} rot={-1.5} at={4} out={l95} enter="left" bg={C.card}>
        <div style={{padding: '28px 36px'}}>
          <Label size={22}>Mila</Label>
          <Locker open={ease(f, demat, demat + 10)} />
          {Array.from({length: 12}).map((_, i) => {
            const a = demat + 4 + i * 2;
            const p = ease(f, a, a + 10);
            if (f < a - 6) return null;
            return <div key={i} style={{position: 'absolute', left: 700 - p * 450 + (i % 3) * 8, top: 190 + (i % 4) * 46 + p * 40, width: 110, height: 44, background: C.yellow, border: `3px solid ${C.ink}`, opacity: p > 0.95 ? 0 : 1, fontFamily: F.mono, fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${(i % 3) * 4 - 4}deg)`}}>SHARE</div>;
          })}
          <div style={{position: 'absolute', left: 400, top: 200, fontFamily: F.display, fontSize: 70, lineHeight: 1, opacity: f >= demat + 30 ? 1 : 0}}>SHARES<br />AAPKE<br />DEMAT<br />MEIN</div>
        </div>
      </Card>
      {Array.from({length: 4}).map((_, i) => <Sfx key={i} at={demat + 4 + i * 6} name="slide" volume={0.14} />)}
      {/* didn't get it: UPI block opens */}
      <Card id="c-no" x={990} y={340} w={790} h={630} rot={1.5} at={10} out={l95} enter="right" bg={C.paperLight}>
        <div style={{padding: '28px 36px'}}>
          <Label size={22}>Nahi mila</Label>
          <div style={{position: 'absolute', left: 70, top: 130, width: 380, height: 340, border: `5px solid ${C.ink}`, background: C.card, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: 110}}>₹ ₹ ₹</div>
          <svg width={200} height={240} style={{position: 'absolute', left: 360, top: 90}} viewBox="0 0 100 120">
            <path d={`M26,58 L26,${34 - relP * 18} C26,${12 - relP * 18} 74,${12 - relP * 18} 74,${34 - relP * 18} L74,${44 - relP * 18}`} fill="none" stroke={C.ink} strokeWidth={9} transform={`translate(${relP * 20},0)`} />
            <rect x={14} y={56} width={72} height={58} rx={6} fill={relP > 0.5 ? C.yellow : C.inkSoft} stroke={C.ink} strokeWidth={5} />
          </svg>
          <div style={{position: 'absolute', left: 70, bottom: 40, fontFamily: F.display, fontSize: 64}}>UPI BLOCK <HL at={rel + 4}>RELEASE</HL></div>
        </div>
      </Card>
      <Sfx at={rel} name="padlock" volume={0.5} />

      {/* 20 crore demat accounts; paper certificates are history */}
      <Card id="c-20" x={140} y={160} w={860} h={560} rot={-2} at={l95} enter="left" bg={C.yellow}>
        <div style={{padding: '40px 50px'}}>
          <Label size={24}>Aaj India mein</Label>
          <div style={{fontFamily: F.display, fontSize: 200, lineHeight: 1, marginTop: 24, whiteSpace: 'nowrap'}}><Count from={0} to={20} at={word('L095', '20', -4)} dur={18} fmt={(n) => String(Math.round(n))} /> CRORE+</div>
          <div style={{fontFamily: F.display, fontSize: 90, lineHeight: 1}}>DEMAT ACCOUNTS</div>
        </div>
      </Card>
      <Hand x={180} y={790} at={word('L095', 'kaagaz', -4)} size={74} rot={-2}>kaagaz → screen</Hand>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${drop * 470}px) rotate(${drop * 4}deg)`, transformOrigin: '1420px 400px'}}>
        <Photo id="c-cert" src="certificate1909.jpg" x={1150} y={140} w={540} h={450} rot={3} at={l95 + 10} enter="drop" torn={{bottom: true}} rough={12} zoom={0} caption="SHARE CERTIFICATE" />
      </div>
      <Card id="c-box" x={1080} y={600} w={680} h={390} rot={-1} at={l95 + 6} enter="up" bg={C.kraft} texture="kraft" z={20}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 26, background: 'rgba(0,0,0,0.25)'}} />
        <div style={{textAlign: 'center', marginTop: 50, fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: C.ink}}>PURANE KAAGAZ</div>
      </Card>
      <Sfx at={cert + 12} name="drop" volume={0.35} />
      <Stamp id="c-itihaas" text="Itihaas" x={1420} y={800} at={word('L095', 'itihaas', -4)} size={110} rot={-7} />
    </AbsoluteFill>
  );
};

export const c5: Record<string, React.FC> = {clock: Clock, allot: Allot, credit: Credit};
