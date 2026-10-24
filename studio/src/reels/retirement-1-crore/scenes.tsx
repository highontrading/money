import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Card, Count, Cross, Hand, HL, Label, Marker, Sfx, Stamp, Tape} from '../../components/paper';
import {stepped} from '../../lib/motion';
import {useCues} from '../../lib/timeline';
import {C, F} from '../../theme';
import {SignOff} from '../common';
import {grid, Hammock, Jar, JAR, NoteStack, PRICES, prog, Show, Stairs, Tick} from './props';

const Arrow: React.FC<{id: string; x1: number; y1: number; x2: number; y2: number; at: number; out?: number; color?: string}> = ({id, x1, y1, x2, y2, at, out, color = C.ink}) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const hx = (d: number) => x2 - 40 * Math.cos(a + d), hy = (d: number) => y2 - 40 * Math.sin(a + d);
  return (
    <>
      <Marker id={id + 'l'} d={`M${x1},${y1} L${x2},${y2}`} at={at} dur={6} out={out} color={color} width={10} />
      <Marker id={id + 'h'} d={`M${hx(0.5)},${hy(0.5)} L${x2},${y2} L${hx(-0.5)},${hy(-0.5)}`} at={at + 6} dur={4} out={out} color={color} width={10} />
    </>
  );
};

/* ------------------------------------------------------------------ hook */

const Hook: React.FC = () => {
  const {at, word} = useCues();
  const l03 = at('L03'), l04 = at('L04');
  return (
    <AbsoluteFill>
      {/* L01: the plan — ₹1 crore by 60, then rest */}
      <Card id="plan" x={110} y={420} w={860} h={440} rot={-1.5} at={0} out={l04} enter="drop" bg={C.card}>
        <div style={{padding: '34px 44px'}}>
          <div style={{display: 'flex', gap: 14}}>
            <Label size={26}>Retirement plan</Label>
            <Show at={word('L01', '60', -3)} style={{position: 'relative'}}><Label size={26} dark={false}>60 tak</Label></Show>
          </div>
          <div style={{fontFamily: F.display, fontSize: 210, lineHeight: 1, marginTop: 44}}>
            <Show at={word('L01', '₹1', -3)} style={{position: 'relative'}}><HL at={word('L01', 'crore', 0)}>₹1 CRORE</HL></Show>
          </div>
        </div>
      </Card>
      <Tape id="pt" x={470} y={400} w={150} rot={-4} at={2} out={l04} />
      <Hammock x={180} y={930} at={word('L01', 'aaraam', -4)} out={l03} />
      <Hand x={600} y={960} at={word('L01', 'aaraam', 2)} out={l03} size={84} rot={-5}>aaraam…</Hand>

      {/* L02: feels like a lot today */}
      <Stamp id="bahut" text="Aaj: bahut!" x={730} y={800} at={word('L02', 'bahut', -2)} out={l03} size={80} rot={-6} color={C.ink} paper />

      {/* L03: 25 years later it lasts only 5 */}
      <Card id="later" x={140} y={900} w={460} h={150} rot={2} at={word('L03', '25', -3)} out={l04} enter="left" bg={C.paperLight}>
        <div style={{fontFamily: F.display, fontSize: 82, textAlign: 'center', marginTop: 26}}>25 SAAL BAAD →</div>
      </Card>
      <Stamp id="sirf5" text="Sirf 5 saal" x={700} y={1140} at={word('L03', 'sirf', 2)} out={l04} size={88} rot={-8} />

      {/* L04: the villain */}
      <Card id="wanted" x={190} y={420} w={700} h={780} rot={1.5} at={l04} enter="drop" bg={C.newsprint} texture="news" torn={{top: true, bottom: true}} rough={12}>
        <div style={{textAlign: 'center', padding: '50px 40px'}}>
          <div style={{fontFamily: F.display, fontSize: 150, lineHeight: 1, letterSpacing: 8}}>WANTED</div>
          <div style={{marginTop: 30}}><Label size={30}>Villain</Label></div>
          <div style={{height: 3, background: C.ink, margin: '40px 20px'}} />
          <Show at={word('L04', 'mehngai', -3)} style={{position: 'relative'}}>
            <div style={{fontFamily: F.display, fontSize: 150, lineHeight: 1, color: C.red}}>MEHNGAI</div>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 4, marginTop: 30}}>AKA INFLATION</div>
          </Show>
        </div>
      </Card>
      <Tape id="wt1" x={180} y={400} w={140} rot={-14} at={l04 + 2} />
      <Tape id="wt2" x={760} y={400} w={140} rot={12} at={l04 + 2} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ infl */

const Infl: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l08 = at('L08');
  const six = word('L05', '6%', -3);
  const p = prog(frame, word('L06', 'cheezein', -4), word('L07', 'guna', -6));
  const shrink = prog(frame, word('L08', 'aaj', -2), word('L08', '₹23', 2));
  return (
    <AbsoluteFill>
      {/* L05: assume 6% a year */}
      <Card id="rate" x={110} y={420} w={860} h={280} rot={-1} at={at('L05')} out={l08} enter="left" bg={C.card}>
        <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 44px', gap: 30}}>
          <div>
            <div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 64, transform: 'rotate(-3deg)', marginBottom: 16}}>maan lo…</div>
            <Label size={26}>Mehngai · saalana</Label>
          </div>
          <div style={{fontFamily: F.display, fontSize: 200, lineHeight: 1, marginLeft: 'auto'}}>
            {frame >= six ? <HL at={six + 4}><Count from={0} to={6} at={six} dur={10} fmt={(n) => `${Math.round(n)}%`} /></HL> : null}
          </div>
        </div>
      </Card>

      {/* L06-L07: prices compound, 25 years → ×4.3 */}
      <Card id="chart" x={90} y={740} w={900} h={480} rot={0.6} at={word('L06', 'har', -4)} out={l08} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'absolute', left: 34, top: 24}}><Label size={22}>Daam · har saal +6%</Label></div>
        <Stairs id="pr" x={34} base={430} values={PRICES} unit={78} p={p} color={(i) => (i === PRICES.length - 1 ? C.yellow : C.paperLight)} />
        <div style={{position: 'absolute', left: 20, top: 432, width: 860, height: 5, background: C.ink}} />
        <Show at={word('L07', '25', -3)} style={{left: 34, top: 444}}><span style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20}}>AAJ</span></Show>
        <Show at={word('L07', '25', -3)} style={{left: 740, top: 444}}><span style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20}}>25 SAAL</span></Show>
        <Show at={word('L07', '4.3', -3)} style={{left: 60, top: 80}}>
          <div style={{background: C.yellow, border: `4px solid ${C.ink}`, padding: '10px 26px', transform: 'rotate(-3deg)'}}>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: 2}}>DAAM</div>
            <div style={{fontFamily: F.display, fontSize: 110, lineHeight: 1}}>×4.3</div>
          </div>
        </Show>
      </Card>
      <Stamp id="comp" text="Compound" x={620} y={900} at={word('L06', 'compound', -2)} out={word('L07', '4.3', -3)} size={66} rot={-6} color={C.ink} paper />
      <Sfx at={word('L07', '4.3', -3)} name="pop" volume={0.3} />

      {/* L08: ₹1 crore then = ₹23 lakh today */}
      <Card id="stackcard" x={110} y={420} w={420} h={800} rot={-1} at={l08} enter="up" bg={C.card}>
        <div style={{position: 'absolute', left: 30, top: 26}}><Label size={22}>{shrink > 0 ? 'Aaj ki keemat' : '25 saal baad'}</Label></div>
        <NoteStack x={60} y={100} w={300} h={660} k={1 - 0.767 * shrink} color={shrink > 0.99 ? C.yellow : C.paperLight} />
      </Card>
      <Show at={word('L08', '₹1', -3)} style={{left: 570, top: 470}}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 2}}>25 SAAL BAAD KA</div>
        <div style={{fontFamily: F.display, fontSize: 96, lineHeight: 1}}>₹1 CRORE</div>
      </Show>
      <Arrow id="dn" x1={740} y1={660} x2={740} y2={830} at={word('L08', 'aaj', -2)} />
      <Show at={word('L08', '₹23', -3)} style={{left: 580, top: 860}}>
        <div style={{background: C.yellow, border: `4px solid ${C.ink}`, padding: '12px 22px', transform: 'rotate(-2deg)'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2}}>AAJ KE SIRF</div>
          <div style={{fontFamily: F.display, fontSize: 96, lineHeight: 1}}>₹23 LAKH</div>
        </div>
      </Show>
      <Sfx at={word('L08', '₹23', -3)} name="coin" volume={0.25} />
    </AbsoluteFill>
  );
};

/* --------------------------------------------------------------- expense */

const Expense: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l12 = at('L12');
  const fifty = word('L09', '₹50,000', -3);
  const steps = [word('L12', '7%', -2), word('L12', 'return', 0), word('L12', 'saath', 0), word('L12', '5', -2), word('L12', 'khatam', -2)];
  const year = steps.filter((s) => stepped(frame) >= s).length;
  const level = JAR[Math.min(year, JAR.length - 1)];
  return (
    <AbsoluteFill>
      {/* L09: today ₹50,000 a month */}
      <Card id="slipA" x={110} y={430} w={400} h={430} rot={-2} at={at('L09')} out={l12} enter="left" bg={C.card}>
        <div style={{padding: '30px 30px'}}>
          <Label size={22}>Aaj · ghar ka kharcha</Label>
          <div style={{fontFamily: F.display, fontSize: 96, lineHeight: 1.1, marginTop: 60}}>
            {frame >= fifty ? <Count from={0} to={50000} at={fifty} dur={12} /> : '₹ ?'}
          </div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 2, marginTop: 10}}>/ MAHINA</div>
        </div>
      </Card>

      {/* L10: same life in 25 years: ₹2.15 lakh a month */}
      <Arrow id="ab" x1={470} y1={650} x2={590} y2={650} at={word('L10', '25', -2)} out={l12} />
      <Card id="slipB" x={570} y={430} w={400} h={430} rot={2} at={word('L10', '25', -2)} out={l12} enter="right" bg={C.yellow}>
        <div style={{padding: '30px 30px'}}>
          <Label size={22}>25 saal baad</Label>
          <Show at={word('L10', '₹2.15', -3)} style={{left: 30, top: 110}}>
            <div style={{fontFamily: F.display, fontSize: 130, lineHeight: 1}}>₹2.15</div>
            <div style={{fontFamily: F.display, fontSize: 64, lineHeight: 1}}>LAKH</div>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 2, marginTop: 10}}>/ MAHINA</div>
          </Show>
        </div>
      </Card>
      <Hand x={600} y={880} at={word('L10', 'wahi', -2)} out={l12} size={64} rot={-4}>wahi life!</Hand>

      {/* L11: ₹26 lakh a year */}
      <Card id="year" x={110} y={990} w={860} h={180} rot={-1} at={at('L11')} out={l12} enter="up" bg={C.paperLight}>
        <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 44px', justifyContent: 'space-between'}}>
          <div style={{fontFamily: F.display, fontSize: 80}}>SAAL KA</div>
          <div style={{fontFamily: F.display, fontSize: 110}}><Show at={word('L11', '₹26', -3)} style={{position: 'relative'}}><HL at={word('L11', '₹26', 2)}>₹26 LAKH</HL></Show></div>
        </div>
      </Card>

      {/* L12: ₹1 crore at 7% is gone in 5 years */}
      <Card id="jarcard" x={100} y={420} w={480} h={800} rot={-1} at={l12} enter="up" bg={C.card} texture="paper">
        <div style={{position: 'absolute', left: 30, top: 20}}>
          <Jar w={420} h={760} level={level} label="₹1 CRORE" />
        </div>
      </Card>
      <Show at={word('L12', '7%', -3)} style={{left: 640, top: 440}}><Label size={30} dark={false}>+7% return</Label></Show>
      {[0, 1, 2, 3, 4].map((i) => (
        <Show key={i} at={steps[i]} style={{left: 640, top: 520 + i * 125}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, background: C.paperLight, border: `3px solid ${C.ink}`, padding: '10px 18px', transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)`}}>
            <span style={{fontFamily: F.display, fontSize: 56}}>SAAL {i + 1}</span>
            <span style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, color: C.red}}>− KHARCHA</span>
          </div>
        </Show>
      ))}
      {steps.map((s, i) => <Sfx key={i} at={s} name="tick" volume={0.35} />)}
      <Stamp id="khatam" text="Khatam" x={340} y={1060} at={word('L12', 'khatam', 2)} size={110} rot={-10} />
    </AbsoluteFill>
  );
};


/* ------------------------------------------------------------------ need */

const Need: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l14 = at('L14');
  const comp = word('L14', 'compounding', -3);
  const six = word('L13', '₹6', -3);
  const g = prog(frame, six, six + 14);
  const sp = prog(frame, comp, comp + 40);
  return (
    <AbsoluteFill>
      {/* L13: how much is needed? */}
      <Show at={at('L13')} out={l14} style={{left: 110, top: 410}}>
        <div style={{fontFamily: F.display, fontSize: 120, lineHeight: 1}}>CHAHIYE KITNA?</div>
      </Show>
      <Card id="need" x={110} y={570} w={860} h={650} rot={-0.8} at={word('L13', '30', -3)} out={comp} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'absolute', left: 34, top: 24}}><Label size={22}>30 saal ka retirement</Label></div>
        <div style={{position: 'absolute', left: 30, top: 590, width: 800, height: 5, background: C.ink}} />
        <div style={{position: 'absolute', left: 110, top: 590 - 70, width: 220, height: 70, background: C.paperLight, border: `4px solid ${C.ink}`, boxSizing: 'border-box'}} />
        <div style={{position: 'absolute', left: 90, top: 440, width: 260, textAlign: 'center', fontFamily: F.display, fontSize: 60}}>₹1 CRORE</div>
        {frame >= six ? (
          <>
            <div style={{position: 'absolute', left: 480, top: 590 - 440 * g, width: 260, height: 440 * g, background: C.yellow, border: `4px solid ${C.ink}`, boxSizing: 'border-box'}} />
            <div style={{position: 'absolute', left: 430, top: 590 - 440 * g - 100, width: 360, textAlign: 'center', fontFamily: F.display, fontSize: 72, lineHeight: 1}}>₹6 CRORE<br />SE UPAR</div>
          </>
        ) : null}
      </Card>
      <Sfx at={six} name="pop" volume={0.3} />

      {/* L14: scared? compounding works for you too */}
      <Hand x={140} y={430} at={word('L14', 'darr', -2)} out={comp} size={90} rot={-4}>darr gaye?</Hand>
      <Stamp id="ruko" text="Ruko" x={760} y={470} at={word('L14', 'ruko', -2)} out={comp} size={96} rot={-8} color={C.ink} paper />
      <Card id="comp" x={110} y={440} w={860} h={760} rot={1} at={comp} enter="drop" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'absolute', left: 34, top: 28, display: 'flex', gap: 12}}>
          <Label size={26}>Compounding</Label>
          <Show at={word('L14', 'taraf', -3)} style={{position: 'relative'}}><Label size={26} dark={false}>Aapki taraf bhi</Label></Show>
        </div>
        <Stairs id="cs" x={50} base={700} values={Array.from({length: 22}, (_, k) => 1.12 ** k)} unit={50} p={sp} bw={28} gap={6} color={() => C.yellow} />
        <div style={{position: 'absolute', left: 30, top: 702, width: 800, height: 5, background: C.ink}} />
      </Card>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------- fix */

const ROWS = [
  {n: '01', t: 'AAJ KE RUPAYE MEIN MAT SOCHO', line: 'L15', cue: 'pehla', tick: 'socho'},
  {n: '02', t: 'JALDI SHURU KARO', line: 'L16', cue: 'doosra', tick: 'karo'},
  {n: '03', t: 'SALARY BADHE, SIP BADHAO', line: 'L17', cue: 'teesra', tick: 'badhao'},
  {n: '04', t: 'SIRF FD NAHI', line: 'L18', cue: 'aur', tick: 'nahi'},
];

const Fix: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l16 = at('L16'), l17 = at('L17'), l18 = at('L18');
  const b25 = prog(frame, word('L16', '25', -3), word('L16', '25', 10));
  const b15 = prog(frame, word('L16', '15', -3), word('L16', '15', 10));
  return (
    <AbsoluteFill>
      <Card id="list" x={90} y={410} w={900} h={560} rot={-0.6} at={at('L15', -4)} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid(36)}} />
        <div style={{position: 'relative', padding: '26px 36px'}}>
          <Label size={22}>Retirement checklist</Label>
          {ROWS.map((r) => (
            <Show key={r.n} at={word(r.line, r.cue, -3)} style={{position: 'relative', marginTop: 16}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 18, width: 820, height: 100, border: `4px solid ${C.ink}`, background: C.paperLight, padding: '0 20px', boxSizing: 'border-box'}}>
                <span style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30, color: C.inkSoft}}>{r.n}</span>
                <span style={{fontFamily: F.display, fontSize: 50, flex: 1, whiteSpace: 'nowrap'}}>{r.t}</span>
                <Tick at={word(r.line, r.tick, 0)} />
              </div>
            </Show>
          ))}
        </div>
      </Card>

      {/* L15 detail: think in future rupees */}
      <Card id="d15" x={110} y={1010} w={400} h={170} rot={-2} at={word('L15', 'aaj', -3)} out={l16} enter="left" bg={C.paperLight}>
        <div style={{fontFamily: F.display, fontSize: 60, textAlign: 'center', marginTop: 46}}>AAJ KE RUPAYE</div>
      </Card>
      <Cross id="x15" x={130} y={1030} w={360} h={130} at={word('L15', 'mat', -2)} out={l16} />
      <Card id="d15b" x={560} y={1010} w={410} h={170} rot={2} at={word('L15', 'mehngai', -3)} out={l16} enter="right" bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 60, textAlign: 'center', marginTop: 46}}>+ MEHNGAI JODO</div>
      </Card>

      {/* L16 detail: 25 years of SIP vs 15 */}
      <Card id="d16" x={90} y={1000} w={900} h={210} rot={-0.5} at={word('L16', '25', -4)} out={l17} enter="up" bg={C.paperLight}>
        <div style={{position: 'absolute', left: 30, top: 30, display: 'flex', alignItems: 'center', gap: 16}}>
          <span style={{fontFamily: F.display, fontSize: 44, width: 190}}>25 SAAL</span>
          <div style={{width: 600 * b25, height: 56, background: C.yellow, border: `4px solid ${C.ink}`, boxSizing: 'border-box'}} />
        </div>
        <div style={{position: 'absolute', left: 30, top: 116, display: 'flex', alignItems: 'center', gap: 16}}>
          <span style={{fontFamily: F.display, fontSize: 44, width: 190}}>15 SAAL</span>
          <div style={{width: 160 * b15, height: 56, background: C.card, border: `4px solid ${C.ink}`, boxSizing: 'border-box'}} />
        </div>
      </Card>
      <Hand x={560} y={1120} at={word('L16', 'zyada', -2)} out={l17} size={58} rot={-4}>kahin zyada!</Hand>

      {/* L17 detail: step the SIP up with the salary */}
      <Card id="d17" x={90} y={1000} w={900} h={210} rot={0.5} at={word('L17', 'salary', -4)} out={l18} enter="up" bg={C.paperLight}>
        <div style={{position: 'absolute', left: 36, top: 60, fontFamily: F.display, fontSize: 70}}>SALARY ↑</div>
        <Show at={word('L17', 'sip', -3)} style={{left: 360, top: 60}}><span style={{fontFamily: F.display, fontSize: 70, background: C.yellow, padding: '0 14px'}}>SIP ↑</span></Show>
        <Stairs id="d17s" x={600} base={190} values={Array.from({length: 8}, (_, k) => 1.1 ** k)} unit={80} p={prog(frame, word('L17', 'sip', -3), word('L17', 'badhao', 4))} bw={26} gap={6} color={() => C.yellow} />
      </Card>

      {/* L18 detail: not only FD */}
      <Card id="d18" x={110} y={1010} w={300} h={170} rot={-2} at={word('L18', 'fd', -4)} enter="left" bg={C.paperLight}>
        <div style={{fontFamily: F.display, fontSize: 100, textAlign: 'center', marginTop: 20}}>FD</div>
      </Card>
      <Cross id="x18" x={130} y={1030} w={260} h={130} at={word('L18', 'nahi', -2)} />
      <Card id="d18b" x={460} y={1010} w={510} h={170} rot={2} at={word('L18', 'tez', -4)} enter="right" bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 62, textAlign: 'center', marginTop: 46}}>MEHNGAI SE TEZ ↑</div>
      </Card>
    </AbsoluteFill>
  );
};

/* ----------------------------------------------------------------- outro */

const Outro: React.FC = () => (
  <AbsoluteFill>
    <SignOff share="L19" sign="L20" who="us dost ko jo kehta hai ₹1 crore kaafi hai →" note="ILLUSTRATIVE · MEHNGAI 6% · RETURN 7% · KHARCHA ₹50,000/MAHINA AAJ" />
  </AbsoluteFill>
);

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  infl: Infl,
  expense: Expense,
  need: Need,
  fix: Fix,
  outro: Outro,
};
