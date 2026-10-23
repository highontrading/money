import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {Big, Card, Circle, Cross, Hand, HL, Label, Marker, Photo, Sfx, Stamp, Tape} from '../../components/paper';
import {ease, pop, stepped} from '../../lib/motion';
import {useCues} from '../../lib/timeline';
import {C, F} from '../../theme';
import {SignOff} from '../common';

// A stack of paper notes growing from the desk. `h` is the final height in px;
// `p` (0..1) how much of it is built, `stop` caps it (for a tower that stops early).
const Tower: React.FC<{id: string; x: number; base: number; w: number; h: number; p: number; out?: boolean; tint?: string}> = ({id, x, base, w, h, p, out, tint = C.card}) => {
  if (out) return null;
  const strip = 26;
  const n = Math.max(1, Math.round(h / strip));
  const shown = Math.floor(n * Math.max(0, Math.min(1, p)));
  return (
    <div style={{position: 'absolute', left: x, top: base - n * strip, width: w, height: n * strip, filter: `drop-shadow(5px 8px 8px ${C.shadow})`}}>
      {Array.from({length: shown}).map((_, i) => {
        const r = random(id + i);
        return (
          <div key={i} style={{position: 'absolute', left: (r - 0.5) * 14, bottom: i * strip, width: w, height: strip - 3, background: i % 3 === 2 ? C.newsprint : tint, border: `2px solid ${C.ink}`, transform: `rotate(${(random(id + 'r' + i) - 0.5) * 2.2}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', boxSizing: 'border-box', fontFamily: F.mono, fontWeight: 700, fontSize: 15, color: C.inkSoft}}>
            <span>₹</span><span style={{flex: 1, height: 2, margin: '0 10px', background: 'rgba(20,20,20,0.18)'}} /><span>₹</span>
          </div>
        );
      })}
    </div>
  );
};

const Row: React.FC<{label: string; value: React.ReactNode; at: number; frame: number; hi?: boolean}> = ({label, value, at, frame, hi}) => {
  if (stepped(frame) < at) return <div style={{height: 92}} />;
  const p = Math.min(1, pop(frame, at, 12, 0.5));
  return (
    <div style={{height: 92, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `2px dashed rgba(20,20,20,0.3)`, transform: `translateX(${(1 - p) * -30}px)`, opacity: p, background: hi ? 'rgba(245,197,24,0.35)' : undefined, padding: '0 10px'}}>
      <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2}}>{label}</div>
      <div style={{fontFamily: F.display, fontSize: 40}}>{value}</div>
    </div>
  );
};

// One plan's "factsheet": title band, who sells it, and comparable rows.
const Sheet: React.FC<{id: string; x: number; title: string; at: number; out?: number; rot: number; enter?: 'left' | 'right' | 'drop' | 'fade' | 'none'; children?: React.ReactNode}> = ({id, x, title, at, out, rot, enter = 'drop', children}) => (
  <Card id={id} x={x} y={420} w={440} h={790} rot={rot} at={at} out={out} enter={enter} bg={C.card}>
    <div style={{background: C.ink, color: C.paperLight, fontFamily: F.display, fontSize: 64, textAlign: 'center', padding: '14px 0 10px', letterSpacing: 2}}>{title}</div>
    <div style={{padding: '18px 26px'}}>{children}</div>
  </Card>
);

const Chip: React.FC<{text: string; at: number; frame: number; yellow?: boolean}> = ({text, at, frame, yellow}) => {
  if (stepped(frame) < at) return null;
  const p = Math.min(1.05, pop(frame, at, 10, 0.5));
  return (
    <span style={{display: 'inline-block', margin: '0 10px 12px 0', transform: `scale(${p}) rotate(${(random(text) - 0.5) * 5}deg)`}}>
      <Label size={24} dark={!yellow}>{text}</Label>
    </span>
  );
};

/* ------------------------------------------------------------------ hook */

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l02 = at('L02'), l03 = at('L03'), l04 = at('L04'), l05 = at('L05');
  const grow = ease(stepped(frame), l02 + 4, word('L02', '1.90', -2));
  const base = 1200, full = 640, short = Math.round(full * 159 / 190);
  const towersOut = frame >= l05;
  return (
    <AbsoluteFill>
      {/* L01: two friends, same fund, same SIP */}
      {[0, 1].map((i) => (
        <React.Fragment key={i}>
          <Card id={'friend' + i} x={i ? 560 : 110} y={430} w={410} h={330} rot={i ? 2 : -2} at={word('L01', i ? 'dost' : 'do', i ? 4 : -4)} out={l02} enter={i ? 'right' : 'left'} bg={C.card}>
            <div style={{padding: '30px 34px'}}>
              <Label size={26}>{i ? 'Dost 2' : 'Dost 1'}</Label>
              {stepped(frame) >= word('L01', 'sip', -2) ? (
                <>
                  <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 2, marginTop: 30, color: C.inkSoft}}>SIP · HAR MAHINA</div>
                  <div style={{fontFamily: F.display, fontSize: 100, lineHeight: 1.05}}><HL at={word('L01', '10,000', -2)}>₹10,000</HL></div>
                </>
              ) : null}
            </div>
          </Card>
        </React.Fragment>
      ))}
      <Card id="samefund" x={250} y={820} w={580} h={190} rot={-1.5} at={word('L01', 'fund', -4)} out={l02} bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 110, textAlign: 'center', marginTop: 22, letterSpacing: 2}}>SAME FUND</div>
      </Card>
      <Tape id="sft" x={470} y={800} w={140} rot={-6} at={word('L01', 'fund')} out={l02} />

      {/* L02-L04: two stacks grow for 25 years; one stops early */}
      {frame >= l02 && !towersOut ? (
        <>
          <Tower id="ta" x={150} base={base} w={330} h={full} p={grow} />
          <Tower id="tb" x={600} base={base} w={330} h={short} p={grow * full / short} />
          <div style={{position: 'absolute', left: 140, top: base + 22}}>
            <Label size={22}>Saal {Math.round(grow * 25)} / 25</Label>
          </div>
          <div style={{position: 'absolute', left: 140, top: base + 8, width: 800, height: 8, background: C.ink}} />
        </>
      ) : null}
      <Card id="la" x={140} y={base - full - 140} w={350} h={110} rot={-2} at={word('L02', '1.90', -3)} out={l05} bg={C.yellow} sfx="pop">
        <div style={{fontFamily: F.display, fontSize: 80, textAlign: 'center', marginTop: 8}}>₹1.90 CR</div>
      </Card>
      <Card id="lb" x={590} y={base - short - 140} w={350} h={110} rot={2} at={word('L03', '1.59', -3)} out={l05} bg={C.card} sfx="pop">
        <div style={{fontFamily: F.display, fontSize: 80, textAlign: 'center', marginTop: 8}}>₹1.59 CR</div>
      </Card>
      {/* gap bracket between the two tops */}
      <Marker id="gapline" d={`M600,${base - full} L940,${base - full}`} at={word('L04', '31', -6)} dur={6} out={l05} color={C.ink} width={5} />
      <Marker id="gapbr" d={`M955,${base - full} L955,${base - short}`} at={word('L04', '31', -2)} dur={6} out={l05} color={C.red} width={9} />
      <Card id="g31" x={640} y={base - full - 10} w={280} h={96} rot={-3} at={word('L04', '31', 0)} out={l05} bg={C.yellow} sfx="pop" z={5}>
        <div style={{fontFamily: F.display, fontSize: 64, textAlign: 'center', marginTop: 10}}>₹31 LAKH</div>
      </Card>
      <Stamp id="sfs" text="Same fund" x={540} y={760} at={word('L04', 'same', -2)} out={l05} size={70} rot={-9} color={C.ink} />

      {/* L05: the reason, a tiny 1% */}
      <Card id="one" x={230} y={470} w={620} h={560} rot={-2.5} at={word('L05', 'wajah', 0)} enter="drop" bg={C.yellow} torn={{top: true, right: true}} rough={14}>
        <div style={{fontFamily: F.display, fontSize: 400, lineHeight: 1, textAlign: 'center', marginTop: 70}}>1%</div>
      </Card>
      <Hand x={230} y={1070} at={word('L05', 'chhota', -2)} size={72} rot={-4}>ek chhota sa...</Hand>
    </AbsoluteFill>
  );
};

/* ----------------------------------------------------------------- plans */

const Plans: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l07 = at('L07'), l08 = at('L08'), l09 = at('L09');
  return (
    <AbsoluteFill>
      {/* L06: one fund, two plans */}
      <Card id="onefund" x={250} y={430} w={580} h={200} rot={-1} at={0} out={l07} enter="drop" bg={C.card}>
        <div style={{textAlign: 'center', paddingTop: 30}}>
          <Label size={24}>Ek mutual fund</Label>
          <div style={{fontFamily: F.display, fontSize: 84, marginTop: 10}}>SAME PORTFOLIO</div>
        </div>
      </Card>
      <Marker id="arL" d="M440,650 Q380,740 300,820" at={word('L06', 'do', -2)} out={l07} color={C.ink} width={7} />
      <Marker id="arR" d="M640,650 Q700,740 780,820" at={word('L06', 'do', 0)} out={l07} color={C.ink} width={7} />
      <Card id="pA" x={120} y={840} w={360} h={170} rot={-3} at={word('L06', 'plan', -2)} out={l07} bg={C.paperLight}>
        <div style={{fontFamily: F.display, fontSize: 88, textAlign: 'center', marginTop: 28}}>PLAN 1</div>
      </Card>
      <Card id="pB" x={600} y={840} w={360} h={170} rot={3} at={word('L06', 'plan', 2)} out={l07} bg={C.paperLight}>
        <div style={{fontFamily: F.display, fontSize: 88, textAlign: 'center', marginTop: 28}}>PLAN 2</div>
      </Card>

      {/* L07-L09: two factsheets */}
      <Sheet id="sReg" x={90} title="REGULAR" at={l07 - 2} rot={-1.5} enter="left">
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: 2, color: C.inkSoft, marginBottom: 14}}>KAHAN SE LIYA</div>
        <div style={{minHeight: 150}}>
          <Chip text="Bank" at={word('L07', 'bank', -2)} frame={frame} />
          <Chip text="Agent" at={word('L07', 'agent', -2)} frame={frame} />
          <Chip text="Distributor" at={word('L07', 'distributor', -2)} frame={frame} />
        </div>
        <Row label="PORTFOLIO" value="✓" at={word('L09', 'portfolio', -2)} frame={frame} />
        <Row label="FUND MANAGER" value="✓" at={word('L09', 'manager', -2)} frame={frame} />
        <Row label="SHARES" value="✓" at={word('L09', 'shares', -2)} frame={frame} />
      </Sheet>
      <Sheet id="sDir" x={550} title="DIRECT" at={l08 - 2} rot={1.5} enter="right">
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: 2, color: C.inkSoft, marginBottom: 14}}>KAHAN SE LIYA</div>
        <div style={{minHeight: 150}}>
          <Chip text="Seedha" at={word('L08', 'seedha', -2)} frame={frame} yellow />
          <Chip text="Fund house" at={word('L08', 'house', -4)} frame={frame} />
          <Chip text="App" at={word('L08', 'app', -2)} frame={frame} />
        </div>
        <Row label="PORTFOLIO" value="✓" at={word('L09', 'portfolio', -2)} frame={frame} />
        <Row label="FUND MANAGER" value="✓" at={word('L09', 'manager', -2)} frame={frame} />
        <Row label="SHARES" value="✓" at={word('L09', 'shares', -2)} frame={frame} />
      </Sheet>
      <Stamp id="same3" text="Sab same" x={540} y={1110} at={word('L09', 'shares', 8)} size={80} rot={-6} color={C.ink} />
      {frame >= l09 ? <Sfx at={l09} name="tick" volume={0.3} /> : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------- fee */

const Fee: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l12 = at('L12'), l13 = at('L13');
  const navAt = word('L13', 'nav', -4);
  return (
    <AbsoluteFill>
      {/* L10-L11: the only different line */}
      <Sheet id="fReg" x={90} title="REGULAR" at={0} out={l12} rot={-1.5} enter="fade">
        <div style={{opacity: 0.45}}>
          <Row label="PORTFOLIO" value="✓" at={-99} frame={frame} />
          <Row label="FUND MANAGER" value="✓" at={-99} frame={frame} />
          <Row label="SHARES" value="✓" at={-99} frame={frame} />
        </div>
        <div style={{marginTop: 30}}>
          <Row label="EXPENSE RATIO" value="?" at={word('L10', 'expense', -2)} frame={frame} hi />
        </div>
        {stepped(frame) >= word('L11', 'commission', -4) ? (
          <div style={{marginTop: 26, transform: `rotate(-3deg) scale(${Math.min(1.05, pop(frame, word('L11', 'commission', -4)))})`}}>
            <div style={{background: C.yellow, border: `3px solid ${C.ink}`, fontFamily: F.display, fontSize: 46, textAlign: 'center', padding: '14px 0 8px'}}>+ COMMISSION</div>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: 2, textAlign: 'center', marginTop: 8}}>DISTRIBUTOR KA HISSA</div>
          </div>
        ) : null}
      </Sheet>
      <Sheet id="fDir" x={550} title="DIRECT" at={0} out={l12} rot={1.5} enter="fade">
        <div style={{opacity: 0.45}}>
          <Row label="PORTFOLIO" value="✓" at={-99} frame={frame} />
          <Row label="FUND MANAGER" value="✓" at={-99} frame={frame} />
          <Row label="SHARES" value="✓" at={-99} frame={frame} />
        </div>
        <div style={{marginTop: 30}}>
          <Row label="EXPENSE RATIO" value="?" at={word('L10', 'expense', -2)} frame={frame} hi />
        </div>
      </Sheet>
      <Circle id="erc" cx={540} cy={884} rx={480} ry={72} at={word('L10', 'ratio', 0)} out={word('L11', 'regular', 0)} />
      <Tape id="cmt" x={140} y={890} w={130} rot={-14} at={word('L11', 'commission', 2)} out={l12} />

      {/* L12: regular costs more, every year */}
      <Card id="more" x={110} y={440} w={860} h={470} rot={-1.5} at={l12} out={l13} enter="up" bg={C.card}>
        <div style={{padding: '40px 50px'}}>
          <Label size={24}>Regular ki fee</Label>
          <div style={{fontFamily: F.display, fontSize: 170, lineHeight: 1, marginTop: 26}}>
            <HL at={word('L12', '0.5', -2)}>+0.5–1.5%</HL>
          </div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 3, marginTop: 26}}>DIRECT SE ZYADA</div>
        </div>
      </Card>
      <Stamp id="hs" text="Har saal" x={720} y={1000} at={word('L12', 'saal', -2)} out={l13} size={96} rot={-8} />

      {/* L13: no bill; it leaves through the NAV */}
      <Card id="bill" x={130} y={440} w={420} h={520} rot={-3} at={l13} out={navAt} enter="left" bg={C.paperLight}>
        <div style={{padding: '34px 34px', fontFamily: F.type, fontSize: 30, lineHeight: 1.6}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, borderBottom: `3px double ${C.ink}`, paddingBottom: 8, marginBottom: 14}}>BILL / INVOICE</div>
          <div>Fund fee ........ ?</div>
          <div>Commission ...... ?</div>
          <div>GST ............. ?</div>
          <div style={{marginTop: 30, fontFamily: F.mono, fontWeight: 700, fontSize: 22, color: C.inkSoft}}>KABHI NAHI AATA</div>
        </div>
      </Card>
      <Cross id="billx" x={160} y={470} w={360} h={460} at={word('L13', 'nahi', -2)} out={navAt} />
      <Card id="nav" x={190} y={480} w={700} h={520} rot={1.5} at={navAt} enter="drop" bg={C.card}>
        <div style={{padding: '40px 50px'}}>
          <Label size={24}>Fund ki NAV</Label>
          <div style={{fontFamily: F.display, fontSize: 260, lineHeight: 1, marginTop: 20}}>NAV</div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 2, marginTop: 10}}>FEE ROZ CHUPCHAAP ISI SE KATTI HAI</div>
        </div>
      </Card>
      <Card id="slice" x={560} y={470} w={300} h={100} rot={-4} at={navAt + 4} out={word('L13', 'katti', -2)} exit="right" enter="fade" bg={C.yellow} sfx={null} z={10}>
        <div style={{fontFamily: F.display, fontSize: 58, textAlign: 'center', marginTop: 12}}>FEE ✂</div>
      </Card>
      <Marker id="cut" d="M560,600 L880,560" at={word('L13', 'katti', -6)} dur={5} color={C.red} width={7} />
      {stepped(frame) >= word('L13', 'katti', -2) ? <Sfx at={word('L13', 'katti', -2)} name="slide" volume={0.3} /> : null}
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------- compound */

const GAPS = [
  {years: 5, label: '₹22,000', amount: 0.22, line: 'L17', needle: '22,000'},
  {years: 15, label: '₹4.6 LAKH', amount: 4.6, line: 'L18', needle: '4.6'},
  {years: 25, label: '₹31 LAKH', amount: 31, line: 'L19', needle: '31'},
];

const Compound: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l15 = at('L15'), l16 = at('L16'), l17 = at('L17');
  const yearsAt = word('L14', 'har', -2);
  return (
    <AbsoluteFill>
      {/* L14: 1% looks small, but it's every year on the whole corpus */}
      <Card id="small1" x={110} y={430} w={300} h={170} rot={-4} at={0} out={l15} bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 130, textAlign: 'center', marginTop: 10}}>1%</div>
      </Card>
      <Hand x={440} y={480} at={word('L14', 'chhota', -2)} out={l15} size={70} rot={-4}>chhota lagta hai?</Hand>
      {frame >= yearsAt && frame < l15 ? (
        <div style={{position: 'absolute', left: 130, top: 650, width: 820, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14}}>
          {Array.from({length: 25}).map((_, i) => {
            const p = Math.max(0, Math.min(1.05, pop(frame, yearsAt + i)));
            return (
              <div key={i} style={{height: 62, background: i % 2 ? C.card : C.paperLight, border: `2px solid ${C.ink}`, transform: `scale(${p}) rotate(${(random('yr' + i) - 0.5) * 6}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', boxShadow: `3px 4px 5px ${C.shadow}`}}>
                <span style={{fontFamily: F.mono, fontWeight: 700, fontSize: 16, color: C.inkSoft}}>Y{i + 1}</span>
                <span style={{fontFamily: F.display, fontSize: 30, color: C.red}}>−1%</span>
              </div>
            );
          })}
        </div>
      ) : null}
      <Card id="corpus" x={240} y={1110} w={600} h={110} rot={1.5} at={word('L14', 'corpus', -3)} out={l15} bg={C.ink} texture={null}>
        <div style={{fontFamily: F.display, fontSize: 70, color: C.paperLight, textAlign: 'center', marginTop: 12}}>POORE CORPUS PE</div>
      </Card>

      {/* L15: money taken as fee stops compounding */}
      <Photo id="note" src="note500.jpg" x={140} y={470} w={560} h={280} rot={-4} at={l15} out={word('L15', 'gaya', 2)} exit="right" enter="left" zoom={0} />
      <Card id="feebin" x={640} y={500} w={320} h={230} rot={4} at={l15 + 2} out={l16} bg={C.newsprint} texture="news">
        <div style={{fontFamily: F.display, fontSize: 96, textAlign: 'center', marginTop: 40}}>FEE</div>
      </Card>
      <Card id="growth" x={150} y={820} w={780} h={300} rot={-1} at={word('L15', 'woh', -2)} out={l16} bg={C.card}>
        <svg width={780} height={300} style={{position: 'absolute', left: 0, top: 0}}>
          <path d="M60,250 Q300,240 450,170 T720,40" fill="none" stroke={C.ink} strokeWidth={8} strokeLinecap="round" />
          <path d="M690,40 L725,38 L712,72" fill="none" stroke={C.ink} strokeWidth={8} strokeLinecap="round" />
        </svg>
        <div style={{position: 'absolute', left: 60, top: 40, fontFamily: F.display, fontSize: 70}}>COMPOUND</div>
      </Card>
      <Cross id="nogrow" x={190} y={840} w={700} h={260} at={word('L15', 'nahi', -2)} out={l16} />

      {/* L16: 12% vs 11% */}
      <Card id="r12" x={100} y={430} w={420} h={330} rot={-2} at={word('L16', 'direct', -3)} out={l17} enter="left" bg={C.card}>
        <div style={{padding: '30px 34px'}}>
          <Label size={24}>Direct</Label>
          <div style={{fontFamily: F.display, fontSize: 170, lineHeight: 1, marginTop: 20}}><HL at={word('L16', '12%', -2)}>12%</HL></div>
        </div>
      </Card>
      <Card id="r11" x={560} y={430} w={420} h={330} rot={2} at={word('L16', 'regular', -3)} out={l17} enter="right" bg={C.card}>
        <div style={{padding: '30px 34px'}}>
          <Label size={24}>Regular</Label>
          <div style={{fontFamily: F.display, fontSize: 170, lineHeight: 1, marginTop: 20}}>
            {stepped(frame) >= word('L16', '11%', -2) ? <HL at={word('L16', '11%', -2)}>11%</HL> : '12%'}
          </div>
        </div>
      </Card>
      <Card id="minus1" x={600} y={800} w={340} h={130} rot={-4} at={word('L16', '1%', -2)} out={l17} bg={C.yellow} sfx="pop">
        <div style={{fontFamily: F.display, fontSize: 80, textAlign: 'center', marginTop: 16}}>−1% FEE</div>
      </Card>
      <Marker id="arr11" d="M770,800 Q760,780 760,760" at={word('L16', '1%', 2)} dur={4} out={l17} color={C.ink} width={6} />
      <Hand x={130} y={830} at={word('L16', 'maan', 0)} out={l17} size={58} rot={-3}>maan lo...</Hand>

      {/* L17-L19: the gap after 5, 15, 25 years */}
      <Card id="chart" x={90} y={420} w={900} h={800} rot={-0.8} at={l17 - 2} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(70,110,150,0.14) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(70,110,150,0.14) 1.5px, transparent 1.5px)', backgroundSize: '40px 40px'}} />
        <div style={{position: 'absolute', left: 40, top: 30}}><Label size={24}>Direct − Regular · kitna farak</Label></div>
        <div style={{position: 'absolute', left: 40, right: 40, top: 700, height: 6, background: C.ink}} />
      </Card>
      {GAPS.map((g, i) => {
        const a = word(g.line, g.needle, -4);
        const hpx = Math.max(10, (g.amount / 31) * 480);
        const p = ease(stepped(frame), a, a + 12);
        const x = 160 + i * 280;
        if (frame < at(g.line, -2)) return null;
        return (
          <React.Fragment key={g.years}>
            <div style={{position: 'absolute', left: x, top: 1120 - hpx * p, width: 200, height: hpx * p, background: i === 2 ? C.yellow : C.ink, border: `4px solid ${C.ink}`, boxShadow: `5px 7px 8px ${C.shadow}`}} />
            <div style={{position: 'absolute', left: x - 20, top: 1140, width: 240, textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 2}}>{g.years} SAAL</div>
            {stepped(frame) >= a ? (
              <div style={{position: 'absolute', left: x - 40, top: 1120 - hpx - 100, width: 280, textAlign: 'center', fontFamily: F.display, fontSize: i === 2 ? 72 : 56, transform: `scale(${Math.min(1.05, pop(frame, a))})`}}>
                {i === 2 ? <HL at={a + 2}>{g.label}</HL> : g.label}
              </div>
            ) : null}
            <Sfx at={a} name={i === 2 ? 'coin' : 'pop'} volume={0.3} />
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------- gap */

const Gap: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const base = 1180;
  const pA = ease(stepped(frame), word('L20', '30', -6), word('L20', '30', 10));
  const pB = ease(stepped(frame), word('L20', '31', -10), word('L20', '31', 8));
  const hA = Math.round(560 * 30 / 31), hB = 560;
  return (
    <AbsoluteFill>
      {/* L20: invested ₹30 lakh, lost ₹31 lakh to 1% */}
      {frame >= at('L20') ? <Tower id="inv" x={140} base={base} w={340} h={hA} p={pA} /> : null}
      {frame >= word('L20', 'aur', -4) ? <Tower id="lost" x={600} base={base} w={340} h={hB} p={pB} tint={C.paperLight} /> : null}
      {frame >= at('L20') ? <div style={{position: 'absolute', left: 120, top: base + 8, width: 840, height: 8, background: C.ink}} /> : null}
      <Card id="invl" x={120} y={420} w={380} h={170} rot={-2} at={word('L20', '30', -4)} bg={C.card} sfx="pop">
        <div style={{padding: '18px 26px'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: 2}}>AAPNE LAGAYE</div>
          <div style={{fontFamily: F.display, fontSize: 84, lineHeight: 1.1}}>₹30 LAKH</div>
        </div>
      </Card>
      <Card id="lostl" x={580} y={420} w={380} h={170} rot={2} at={word('L20', '31', -4)} bg={C.yellow} sfx="pop">
        <div style={{padding: '18px 26px'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: 2}}>1% NE KHA LIYE</div>
          <div style={{fontFamily: F.display, fontSize: 84, lineHeight: 1.1}}>₹31 LAKH</div>
        </div>
      </Card>

      {/* L21: more than everything you put in */}
      <Circle id="bigger" cx={770} cy={base - hB - 10} rx={210} ry={60} at={word('L21', 'poori', -4)} />
      <Stamp id="zyada" text="Jama se zyada" x={540} y={820} at={word('L21', 'zyada', -6)} size={92} rot={-10} />
    </AbsoluteFill>
  );
};

/* ----------------------------------------------------------------- check */

const NameStrip: React.FC<{id: string; y: number; plan: string; at: number; hiAt: number; out?: number; rot: number; ring?: boolean}> = ({id, y, plan, at, hiAt, out, rot, ring}) => (
  <Card id={id} x={80} y={y} w={920} h={150} rot={rot} at={at} out={out} enter="right" bg={C.paperLight}>
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontFamily: F.type, fontSize: 40, gap: 14, whiteSpace: 'nowrap'}}>
      <span>XYZ Fund –</span>
      <span style={{fontFamily: F.display, fontSize: 58}}>{ring ? plan : <HL at={hiAt}>{plan}</HL>}</span>
      <span>– Growth</span>
    </div>
  </Card>
);

const Check: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l23 = at('L23'), l24 = at('L24');
  return (
    <AbsoluteFill>
      {/* L22: read the fund's name */}
      <div style={{position: 'absolute', left: 100, top: 440}}>
        {frame < l23 ? <Big words={['Naam', 'padho']} at={word('L22', 'naam', -4)} size={170} /> : null}
      </div>
      <NameStrip id="nDir" y={720} plan="DIRECT PLAN" at={word('L22', 'naam', 0)} hiAt={word('L22', 'direct', -2)} out={l23} rot={-1.5} />
      <NameStrip id="nReg" y={920} plan="REGULAR PLAN" at={word('L22', 'regular', -6)} hiAt={0} out={l23} rot={1.2} ring />
      <Circle id="regc" cx={505} cy={995} rx={195} ry={62} at={word('L22', 'regular', 0)} out={l23} />

      {/* L23: statement / CAS */}
      <Card id="cas" x={100} y={430} w={880} h={760} rot={-1} at={l23} out={l24} enter="up" bg={C.paperLight}>
        <div style={{padding: '40px 46px', fontFamily: F.type, fontSize: 30, lineHeight: 1.5}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `3px double ${C.ink}`, paddingBottom: 12}}>
            <span style={{fontFamily: F.display, fontSize: 64}}>STATEMENT</span>
            {stepped(frame) >= word('L23', 'cas', -3) ? <Label size={24} dark={false}>CAS</Label> : null}
          </div>
          {[
            ['XYZ Flexi Cap Fund', 'Direct Plan'],
            ['ABC Large Cap Fund', 'Regular Plan'],
            ['PQR Index Fund', 'Direct Plan'],
          ].map(([n, p], i) => (
            <div key={i} style={{marginTop: 34}}>
              <div>{n}</div>
              <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30}}>– {stepped(frame) >= word('L23', 'likha', -2 + i * 3) ? <HL at={word('L23', 'likha', -2 + i * 3)}>{p}</HL> : p} – Growth</div>
              <div style={{height: 8, width: '70%', background: 'rgba(30,30,30,0.18)', marginTop: 12}} />
            </div>
          ))}
        </div>
      </Card>
      <Hand x={560} y={1090} at={word('L23', 'har', -2)} out={l24} size={56} rot={-4}>har fund ke saath ↑</Hand>

      {/* L24: SEBI, 2013, without commission */}
      <Card id="sebi" x={130} y={450} w={820} h={520} rot={-2} at={l24} enter="drop" bg={C.card}>
        <div style={{padding: '40px 50px'}}>
          <Label size={26}>Direct plan · SEBI</Label>
          <div style={{fontFamily: F.display, fontSize: 270, lineHeight: 1, marginTop: 30}}><HL at={word('L24', '2013', -2)}>2013</HL></div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 28, letterSpacing: 3, marginTop: 20}}>SE HAR FUND MEIN</div>
        </div>
      </Card>
      <Stamp id="nocom" text="No commission" x={560} y={1060} at={word('L24', 'commission', -2)} size={84} rot={-7} />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- switch */

const Switch: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l26 = at('L26'), l27 = at('L27');
  return (
    <AbsoluteFill>
      {/* L25: a switch is a sale + a purchase */}
      <Card id="sw" x={110} y={440} w={860} h={240} rot={-1.5} at={0} out={l26} enter="drop" bg={C.card}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 30, fontFamily: F.display, fontSize: 96}}>
          <span>REGULAR</span><span style={{fontSize: 80}}>→</span><span><HL at={8}>DIRECT</HL></span>
        </div>
      </Card>
      <Hand x={140} y={720} at={word('L25', 'matlab', -2)} out={l26} size={72} rot={-3}>switch matlab =</Hand>
      <Card id="sell" x={110} y={850} w={400} h={200} rot={-3} at={word('L25', 'bechna', -3)} out={l26} bg={C.paperLight}>
        <div style={{fontFamily: F.display, fontSize: 104, textAlign: 'center', marginTop: 38}}>BECHNA</div>
      </Card>
      <div style={{position: 'absolute', left: 515, top: 900, fontFamily: F.display, fontSize: 110, opacity: frame >= word('L25', 'aur', -2) && frame < l26 ? 1 : 0}}>+</div>
      <Card id="buy" x={580} y={850} w={400} h={200} rot={3} at={word('L25', 'kharidna', -3)} out={l26} bg={C.paperLight}>
        <div style={{fontFamily: F.display, fontSize: 104, textAlign: 'center', marginTop: 38}}>KHARIDNA</div>
      </Card>

      {/* L26: exit load + capital gains tax */}
      <Card id="el" x={110} y={450} w={860} h={210} rot={-1.5} at={word('L26', 'exit', -3)} out={l27} enter="left" bg={C.card}>
        <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 46px', gap: 30}}>
          <span style={{fontFamily: F.display, fontSize: 110, color: C.red}}>!</span>
          <span style={{fontFamily: F.display, fontSize: 104}}>EXIT LOAD</span>
        </div>
      </Card>
      <Card id="cg" x={110} y={700} w={860} h={210} rot={1.2} at={word('L26', 'capital', -3)} out={l27} enter="right" bg={C.card}>
        <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 46px', gap: 30}}>
          <span style={{fontFamily: F.display, fontSize: 110, color: C.red}}>!</span>
          <span style={{fontFamily: F.display, fontSize: 92}}>CAPITAL GAINS TAX</span>
        </div>
      </Card>
      <Card id="chk" x={250} y={960} w={580} h={140} rot={-2} at={word('L26', 'pehle', -3)} out={l27} bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 80, textAlign: 'center', marginTop: 22}}>PEHLE CHECK ✓</div>
      </Card>

      {/* L27: paying an adviser who helps is fine; just know it */}
      <Card id="adv" x={110} y={440} w={860} h={330} rot={-1.5} at={l27} enter="up" bg={C.card}>
        <div style={{padding: '36px 46px'}}>
          <Label size={24}>Achha advisor</Label>
          <div style={{fontFamily: F.display, fontSize: 104, lineHeight: 1.05, marginTop: 24}}>FEE DENA = <HL at={word('L27', 'galat', -2)}>GALAT NAHI</HL></div>
        </div>
      </Card>
      <div style={{position: 'absolute', left: 110, top: 850, width: 860}}>
        {stepped(frame) >= word('L27', 'bas', -4) ? (
          <Big words={['Bas', 'pata', 'hona', 'chahiye']} at={word('L27', 'bas', -4)} gap={4} size={150} />
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/* ----------------------------------------------------------------- outro */

const Outro: React.FC = () => (
  <AbsoluteFill>
    <SignOff share="L28" sign="L29" who="us dost ko jiska SIP bank wale bhaiya ne khulwaya →"
      note="ILLUSTRATIVE: ₹10,000/MONTH SIP, 12% VS 11% A YEAR · DIRECT PLANS: SEBI, 1 JAN 2013" />
  </AbsoluteFill>
);

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  plans: Plans,
  fee: Fee,
  compound: Compound,
  gap: Gap,
  check: Check,
  switch: Switch,
  outro: Outro,
};
