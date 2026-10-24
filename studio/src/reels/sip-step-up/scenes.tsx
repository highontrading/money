import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Card, Circle, Count, Hand, HL, Label, Marker, Sfx, Stamp, Tape} from '../../components/paper';
import {clamp, ease, pop, stepped} from '../../lib/motion';
import {useCues} from '../../lib/timeline';
import {C, F} from '../../theme';
import {SignOff} from '../common';
import {flat, grid, PopWords, Show, Stairs, stepUp, Tick, Toggle} from './parts';

const MAX = stepUp[stepUp.length - 1];
const lakh = (n: number) => `₹${Math.round(n)} LAKH`;

// Upward arrow drawn on in marker.
const UpArrow: React.FC<{x: number; y: number; h: number; at: number; out?: number; color?: string}> = ({x, y, h, at, out, color = C.ink}) => (
  <>
    <Marker id={`ua${x}${y}`} d={`M${x},${y + h} L${x},${y}`} at={at} dur={6} out={out} color={color} width={12} />
    <Marker id={`ub${x}${y}`} d={`M${x - 40},${y + 44} L${x},${y} L${x + 40},${y + 44}`} at={at + 6} dur={4} out={out} color={color} width={12} />
  </>
);

/* ------------------------------------------------------------------ hook */

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l02 = at('L02'), l03 = at('L03');
  const gone = word('L05', 'step', -4);
  const unit = 300 / MAX;
  const pA = ease(stepped(frame), word('L02', 'same', -4), word('L02', '₹1', -6));
  const pB = ease(stepped(frame), word('L03', 'badhaya', -8), word('L03', '₹2', -6));
  const resA = word('L02', '₹1', -2), resB = word('L03', '₹2', -2);
  return (
    <AbsoluteFill>
      {/* L01: two friends, same ₹10,000 SIP, 20 years */}
      {[0, 1].map((i) => (
        <Card key={i} id={'slip' + i} x={i ? 560 : 110} y={450} w={410} h={420} rot={i ? 2 : -2} at={word('L01', i ? 'dost' : 'do', i ? 4 : -4)} out={l02} enter={i ? 'right' : 'left'} bg={C.card}>
          <div style={{padding: '30px 34px'}}>
            <Label size={26}>{i ? 'Dost 2' : 'Dost 1'}</Label>
            <Show from={word('L01', 'sip', -4)}>
              <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 2, marginTop: 36, color: C.inkSoft}}>SIP · HAR MAHINA</div>
              <div style={{fontFamily: F.display, fontSize: 100, lineHeight: 1.1}}><HL at={word('L01', '10,000', -2)}>₹10,000</HL></div>
            </Show>
          </div>
        </Card>
      ))}
      <Stamp id="s20" text="20 saal" x={540} y={990} at={word('L01', '20', -2)} out={l02} size={90} rot={-6} color={C.ink} paper />

      {/* L02: friend 1 keeps it flat */}
      <Card id="pA" x={90} y={420} w={900} h={330} rot={-1} at={l02 - 2} out={gone} enter="left" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'absolute', left: 36, top: 26}}><Label size={24}>Dost 1 · har saal same</Label></div>
        <Stairs id="sa" x={40} base={290} values={flat} unit={unit} p={pA} />
        <Show from={resA}>
          <div style={{position: 'absolute', left: 560, top: 80, width: 300, height: 130, background: C.paperLight, border: `4px solid ${C.ink}`, transform: `rotate(2deg) scale(${Math.min(1.05, pop(frame, resA))})`, textAlign: 'center'}}>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 16, letterSpacing: 1, marginTop: 12}}>LAGBHAG · 20 SAAL BAAD</div>
            <div style={{fontFamily: F.display, fontSize: 72, lineHeight: 1}}>₹1 CR</div>
          </div>
        </Show>
      </Card>
      <Sfx at={resA} name="pop" volume={0.3} />

      {/* L03: friend 2 raises it 10% every year */}
      <Card id="pB" x={90} y={780} w={900} h={440} rot={0.8} at={word('L03', 'doosre', -4)} out={gone} enter="right" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'absolute', left: 36, top: 26, display: 'flex', gap: 12}}>
          <Label size={24}>Dost 2</Label>
          <Show from={word('L03', '10%', -2)}><Label size={24} dark={false}>+10% har saal</Label></Show>
        </div>
        <Stairs id="sb" x={40} base={410} values={stepUp} unit={unit} p={pB} color={(i) => (i === stepUp.length - 1 ? C.yellow : C.card)} />
        <Show from={resB}>
          <div style={{position: 'absolute', left: 50, top: 96, width: 330, height: 140, background: C.yellow, border: `4px solid ${C.ink}`, transform: `rotate(-2deg) scale(${Math.min(1.05, pop(frame, resB))})`, textAlign: 'center'}}>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 17, letterSpacing: 1, marginTop: 14}}>LAGBHAG · 20 SAAL BAAD</div>
            <div style={{fontFamily: F.display, fontSize: 80, lineHeight: 1}}>₹2 CR</div>
          </div>
        </Show>
      </Card>
      <Sfx at={resB} name="coin" volume={0.25} />

      {/* L04: same fund, same return, double the money */}
      <Stamp id="same" text="Same fund · same return" x={540} y={766} at={word('L04', 'same', -2)} out={gone} size={44} rot={-2} color={C.ink} paper />
      <Circle id="dug" cx={305} cy={945} rx={215} ry={100} at={word('L04', 'dugna', -4)} out={gone} color={C.ink} />
      <Stamp id="x2" text="2× dugna" x={640} y={960} at={word('L04', 'dugna', 0)} out={gone} size={84} rot={-8} color={C.ink} paper />

      {/* L05: the name */}
      <Card id="name" x={130} y={560} w={820} h={380} rot={-2} at={gone} enter="drop" bg={C.yellow} torn={{top: true, right: true}} rough={14}>
        <div style={{fontFamily: F.display, fontSize: 190, lineHeight: 0.95, textAlign: 'center', marginTop: 46}}>STEP-UP<br />SIP</div>
      </Card>
      <Tape id="nt" x={470} y={540} w={150} rot={-5} at={gone} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ step */

const STEPS = [
  {amt: '₹10,000', cue: '10,000', h: 440},
  {amt: '₹11,000', cue: '11,000', h: 484},
  {amt: '₹12,100', cue: '12,100', h: 532},
];

const Step: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l08 = at('L08');
  const l07 = word('L07', '10,000', -6); // L06 visuals hold until the first step lands
  const base = 1180;
  const unit = 560 / MAX;
  const p = ease(stepped(frame), l08 + 2, word('L08', '61', -6));
  const lastAt = word('L08', '61', -4);
  return (
    <AbsoluteFill>
      {/* L06: salary goes up, so does the SIP */}
      <div style={{position: 'absolute', left: 110, top: 430, width: 880}}>
        <Show until={l07}>
          <PopWords size={110} items={[{t: 'Idea', at: at('L06')}, {t: 'simple', at: word('L06', 'simple', -2)}, {t: 'hai', at: word('L06', 'hai', -2)}]} />
        </Show>
      </div>
      <Card id="sal" x={110} y={600} w={400} h={480} rot={-2} at={word('L06', 'salary', -4)} out={l07} enter="left" bg={C.card}>
        <div style={{padding: '34px 36px'}}>
          <Label size={24}>Payslip</Label>
          <div style={{fontFamily: F.display, fontSize: 96, marginTop: 20}}>SALARY</div>
        </div>
      </Card>
      <UpArrow x={310} y={860} h={180} at={word('L06', 'badhti', -2)} out={l07} />
      <Card id="sip" x={570} y={600} w={400} h={480} rot={2} at={word('L06', 'sip', -4)} out={l07} enter="right" bg={C.yellow}>
        <div style={{padding: '34px 36px'}}>
          <Label size={24}>Har mahina</Label>
          <div style={{fontFamily: F.display, fontSize: 96, marginTop: 20}}>SIP BHI</div>
        </div>
      </Card>
      <UpArrow x={770} y={860} h={180} at={word('L06', 'badhao', -2)} out={l07} />

      {/* L07: the first three steps */}
      {STEPS.map((s, i) => {
        const a = word('L07', s.cue, -6);
        return (
          <React.Fragment key={s.cue}>
            <Card id={'st' + i} x={110 + i * 290} y={base - s.h} w={270} h={s.h} rot={[-1, 0.5, -0.5][i]} at={a} out={l08} enter="up" bg={i === 2 ? C.yellow : C.card}>
              <div style={{padding: '22px 22px'}}>
                <Label size={22}>Saal {i + 1}</Label>
                <div style={{fontFamily: F.display, fontSize: 74, marginTop: 18}}>{s.amt}</div>
                <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 18, letterSpacing: 2, color: C.inkSoft}}>/ MAHINA</div>
              </div>
            </Card>
            {i > 0 ? <Hand x={60 + i * 290} y={base - s.h - 80} at={a + 4} out={l08} size={56} rot={-6}>+10%</Hand> : null}
          </React.Fragment>
        );
      })}
      <Hand x={130} y={460} at={word('L07', 'doosre', -2)} out={l08} size={64} rot={-3}>har saal thoda upar...</Hand>

      {/* L08: twenty years of steps, up to ₹61,000 */}
      <Card id="all" x={90} y={420} w={900} h={790} rot={-0.6} at={l08 - 2} enter="drop" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'absolute', left: 36, top: 26}}><Label size={24}>SIP har mahina · saal 1 → 20</Label></div>
        <Stairs id="s20" x={40} base={730} values={stepUp} unit={unit} p={p} bw={32} gap={9} color={(i) => (i === stepUp.length - 1 && frame >= lastAt ? C.yellow : C.card)} />
        <div style={{position: 'absolute', left: 30, top: 742, width: 840, height: 6, background: C.ink}} />
        <div style={{position: 'absolute', left: 30, top: 600, fontFamily: F.mono, fontWeight: 700, fontSize: 22}}>₹10,000</div>
        <Show from={lastAt}>
          <div style={{position: 'absolute', left: 380, top: 120, width: 400, height: 130, background: C.paperLight, border: `4px solid ${C.ink}`, transform: `rotate(-2deg) scale(${Math.min(1.05, pop(frame, lastAt))})`, textAlign: 'center'}}>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: 2, marginTop: 10}}>SAAL 20</div>
            <div style={{fontFamily: F.display, fontSize: 76, lineHeight: 1}}><HL at={lastAt + 4}>₹61,000</HL></div>
          </div>
        </Show>
      </Card>
      <Sfx at={lastAt} name="pop" volume={0.3} />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- honest */

const Slip: React.FC<{x: number; w: number; h: number; base: number; title: string}> = ({x, w, h, base, title}) => (
  <div style={{position: 'absolute', left: x, top: base - h, width: w, height: h, background: C.card, border: `3px solid ${C.ink}`, boxSizing: 'border-box', boxShadow: `6px 9px 12px ${C.shadow}`}}>
    <div style={{background: C.ink, color: C.paperLight, fontFamily: F.display, fontSize: 40, padding: '8px 16px 4px'}}>SALARY</div>
    <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 18, letterSpacing: 2, padding: '8px 16px'}}>{title}</div>
    {Array.from({length: Math.max(0, Math.floor((h * 0.78 - 110) / 34))}).map((_, i) => (
      <div key={i} style={{margin: '14px 16px 0', height: 6, background: 'rgba(20,20,20,0.14)', width: `${60 + ((i * 37) % 35)}%`}} />
    ))}
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: h * 0.22, background: C.yellow, borderTop: `3px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: Math.min(64, h * 0.12)}}>SIP</div>
  </div>
);

const Honest: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l10 = at('L10'), l11 = at('L11'), l12 = at('L12');
  const base = 1180;
  const grow = ease(stepped(frame), word('L11', 'salary', -4), word('L11', 'badhi', 4));
  const h20 = 330 + 430 * grow;
  return (
    <AbsoluteFill>
      {/* L09: yes, friend 2 put in more */}
      <Hand x={120} y={450} at={word('L09', 'doosre', -2)} out={l10} size={64} rot={-3}>dost 2 ne...</Hand>
      <div style={{position: 'absolute', left: 110, top: 580, width: 880}}>
        <Show until={l10}>
          <PopWords size={170} items={[{t: 'Haan,', at: at('L09')}, {t: 'zyada', at: word('L09', 'zyada', -2), hi: true}, {t: 'lagaya', at: word('L09', 'lagaya', -2)}]} />
        </Show>
      </div>

      {/* L10: what each one invested */}
      {[0, 1].map((i) => (
        <Card key={i} id={'inv' + i} x={i ? 560 : 110} y={480} w={410} h={420} rot={i ? 2 : -2} at={word('L10', i ? 'doosra' : 'pehla', -4)} out={l11} enter={i ? 'right' : 'left'} bg={i ? C.yellow : C.card}>
          <div style={{padding: '30px 34px'}}>
            <Label size={24}>{i ? 'Dost 2 · step-up' : 'Dost 1 · same'}</Label>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 2, marginTop: 40, color: C.inkSoft}}>20 SAAL MEIN LAGAYA</div>
            <div style={{fontFamily: F.display, fontSize: 92, lineHeight: 1.1, marginTop: 10}}>
              {frame >= word('L10', i ? '69' : '24', -8) ? <Count from={0} to={i ? 69 : 24} at={word('L10', i ? '69' : '24', -8)} dur={10} fmt={lakh} /> : '₹ ?'}
            </div>
          </div>
        </Card>
      ))}
      <Hand x={140} y={960} at={word('L10', '69', 4)} out={l11} size={64} rot={-3}>haan, zyada. sach baat.</Hand>

      {/* L11-L12: salary and SIP grow together, the share stays the same */}
      <Show from={l11}>
        <Slip x={150} w={300} h={330} base={base} title="SAAL 1" />
        <Slip x={560} w={360} h={h20} base={base} title={grow > 0.5 ? 'SAAL 20' : 'SAAL 1'} />
      </Show>
      <Sfx at={word('L11', 'salary', -4)} name="slide" volume={0.25} />
      <Hand x={130} y={720} at={word('L11', 'utna', -2)} out={l12} size={56} rot={-4} w={420}>jitni salary badhi, utna hi SIP</Hand>
      <Circle id="c1" cx={300} cy={1144} rx={175} ry={58} at={word('L12', 'hissa', -4)} color={C.ink} />
      <Circle id="c2" cx={740} cy={base - (h20 * 0.22) / 2} rx={215} ry={Math.max(60, h20 * 0.13)} at={word('L12', 'hissa', 2)} color={C.ink} />
      <Stamp id="hw" text="Hissa wahi ✓" x={310} y={600} at={word('L12', 'wahi', -2)} size={66} rot={-6} color={C.ink} paper />
      <Hand x={130} y={720} at={word('L12', 'rupaye', -2)} size={58} rot={-4} w={420}>bas rupaye badhe</Hand>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------- why */

const NoteSlip: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, background: '#E4DDCB', border: `4px solid ${C.ink}`, boxSizing: 'border-box', boxShadow: `6px 10px 14px ${C.shadow}`}}>
    <div style={{position: 'absolute', inset: 14, border: `2px solid ${C.inkSoft}`}} />
    <div style={{position: 'absolute', right: 40, top: 70, width: 200, height: 200, borderRadius: '50%', backgroundImage: 'repeating-radial-gradient(circle, transparent 0 8px, rgba(20,20,20,0.3) 8px 10px)'}} />
    <div style={{position: 'absolute', left: 44, top: 60, fontFamily: F.display, fontSize: 170, lineHeight: 1}}>₹10,000</div>
    <div style={{position: 'absolute', left: 48, bottom: 50, fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: C.inkSoft}}>SIP · HAR MAHINA</div>
  </div>
);

const Why: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l14 = at('L14'), l15 = at('L15'), l16 = at('L16');
  const shrinkFrom = word('L14', 'keemat', -6), shrinkTo = word('L14', 'kam', 2);
  const s = interpolate(stepped(frame), [shrinkFrom, shrinkTo], [1, 0.614], clamp);
  const yr = Math.round(interpolate(stepped(frame), [l14, word('L14', 'baad', 4)], [0, 20], clamp));
  // panel geometry (global): x 90, y 560, h 600; bars base inside at 520
  const unit = 380 / 10000;
  const real = flat.map((v, k) => v / 1.05 ** k);
  const pReal = ease(stepped(frame), word('L15', 'toh', -4), word('L15', 'chhota', 2));
  const pStep = ease(stepped(frame), l16, word('L16', 'barabar', -2));
  return (
    <AbsoluteFill>
      {/* L13: the flat SIP hides a loss */}
      <Card id="flatc" x={110} y={460} w={860} h={330} rot={-1.5} at={0} out={l14} enter="drop" bg={C.card}>
        <div style={{padding: '30px 40px'}}>
          <Label size={24}>Flat SIP</Label>
          <div style={{fontFamily: F.display, fontSize: 110, marginTop: 18}}>₹10,000 × 20 SAAL</div>
        </div>
      </Card>
      <Stamp id="hid" text="Chhupa nuksaan?" x={540} y={930} at={word('L13', 'chhupa', -2)} out={l14} size={84} rot={-7} />

      {/* L14: the same ₹10,000 shrinks over 20 years */}
      <Show from={l14 - 2} until={l15}>
        <div style={{position: 'absolute', left: 120, top: 440}}><Label size={28}>Saal {yr}</Label></div>
      </Show>
      <Show from={l14 - 2} until={word('L15', 'toh', -6)}>
        {frame >= shrinkFrom ? <div style={{position: 'absolute', left: 160, top: 560, width: 760, height: 380, border: `4px dashed ${C.inkSoft}`, boxSizing: 'border-box'}} /> : null}
        <div style={{position: 'absolute', left: 160, top: 560, width: 760, height: 380, transform: `scale(${s})`, transformOrigin: '50% 50%'}}>
          <NoteSlip />
        </div>
      </Show>
      <Card id="half" x={250} y={1010} w={580} h={130} rot={2} at={word('L14', 'aadhe', -4)} out={word('L15', 'toh', -6)} bg={C.paperLight}>
        <div style={{fontFamily: F.display, fontSize: 72, textAlign: 'center', marginTop: 20}}>AADHE SE BHI KAM</div>
      </Card>

      {/* L15: inflation; in today's money a flat SIP walks down a staircase */}
      <Card id="infl" x={110} y={420} w={430} h={110} rot={-2} at={word('L15', 'mehngai', -4)} bg={C.ink} texture="kraft">
        <div style={{fontFamily: F.display, fontSize: 76, color: C.paperLight, textAlign: 'center', marginTop: 8}}>MEHNGAI</div>
      </Card>
      <Card id="realp" x={90} y={570} w={900} h={590} rot={0.6} at={word('L15', 'toh', -6)} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'absolute', left: 36, top: 26, display: 'flex', gap: 12}}>
          <Label size={22}>Flat SIP · aaj ki keemat mein</Label>
        </div>
        <Stairs id="ys" x={40} base={520} values={flat} unit={unit} p={pStep} bw={32} gap={9} color={() => C.yellow} />
        <Stairs id="rs" x={40} base={520} values={real} unit={unit} p={pReal} bw={32} gap={9} color={() => C.newsprint} />
        <div style={{position: 'absolute', left: 30, top: 532, width: 840, height: 6, background: C.ink}} />
        <Show from={l16}>
          <div style={{position: 'absolute', left: 560, top: 80}}><Label size={22} dark={false}>Step-up ke saath</Label></div>
        </Show>
      </Card>
      <Marker id="down" d={`M146,${570 + 520 - 380 - 30} L${90 + 40 + 19 * 41 + 16},${570 + 520 - 380 * 0.377 - 30}`} at={word('L15', 'chhota', -2)} dur={8} out={l16} color={C.red} width={10} />
      <Hand x={600} y={720} at={word('L15', 'chhota', 2)} out={l16} size={56} rot={-4} color={C.red}>har saal chhota</Hand>
      <Stamp id="bar" text="Barabar ✓" x={700} y={1190} at={word('L16', 'barabar', -2)} size={58} rot={-5} color={C.ink} paper />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------- how */

const Row: React.FC<{label: string; value: React.ReactNode; hi?: boolean}> = ({label, value, hi}) => (
  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 26px', height: 104, borderBottom: `2px dashed rgba(20,20,20,0.3)`, background: hi ? 'rgba(245,197,24,0.55)' : undefined}}>
    <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 2}}>{label}</div>
    <div style={{fontFamily: F.display, fontSize: 46}}>{value}</div>
  </div>
);

const Chip: React.FC<{text: string; on: boolean}> = ({text, on}) => (
  <span style={{display: 'inline-block', marginRight: 14, padding: '10px 18px 6px', border: `3px solid ${C.ink}`, background: on ? C.yellow : C.paperLight, fontFamily: F.display, fontSize: 40}}>{text}</span>
);

const How: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l18 = at('L18'), l19 = at('L19'), l20 = at('L20');
  const phoneAt = word('L17', 'zyaadatar', -6);
  const stepRow = frame >= word('L17', 'step-up', -4);
  const subAt = word('L18', 'har', -4);
  const fiveAt = word('L20', '5%', -4);
  const barAt = word('L20', '5%', 6);
  const b1 = word('L20', '₹1', -4), b2 = word('L20', '1.37', -4);
  const g1 = ease(stepped(frame), b1, b1 + 8), g2 = ease(stepped(frame), b2, b2 + 10);
  return (
    <AbsoluteFill>
      {/* L17: where to find it */}
      <div style={{position: 'absolute', left: 110, top: 560, width: 880}}>
        <Show until={phoneAt}>
          <PopWords size={160} items={[{t: 'Kaise', at: 0}, {t: 'karein?', at: word('L17', 'karein', -2)}]} />
        </Show>
      </div>
      <Card id="phone" x={210} y={420} w={660} h={790} rot={-1} at={phoneAt} out={l19} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, border: `10px solid ${C.ink}`, borderRadius: 40}} />
        <div style={{margin: '34px 34px 0', background: C.ink, color: C.paperLight, fontFamily: F.display, fontSize: 44, padding: '14px 22px 8px'}}>SIP SETTINGS</div>
        <div style={{margin: '10px 24px 0'}}>
          <Row label="AMOUNT" value="₹10,000 / mahina" />
          <Row label="FUND" value="EQUITY" />
          <Row hi={stepRow} label="STEP-UP" value={<Toggle on={word('L18', 'set', -2)} />} />
        </div>
        <Show from={subAt}>
          <div style={{margin: '26px 34px 0', transform: `scale(${Math.min(1.05, pop(frame, subAt))})`, transformOrigin: 'left top'}}>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, marginBottom: 14}}>HAR SAAL BADHAO:</div>
            <Chip text="10%" on={frame >= word('L18', '10%', -2)} />
            <Chip text="FIXED ₹ AMOUNT" on={frame >= word('L18', 'fixed', -2)} />
          </div>
        </Show>
      </Card>
      <Hand x={560} y={1080} at={word('L17', 'option', -2)} out={l18} size={56} rot={-5}>option hai ✓</Hand>
      <Hand x={250} y={1100} at={word('L18', 'ek', -2)} out={l19} size={56} rot={-3}>ek baar set, bas.</Hand>

      {/* L19: appraisal letter, first job */}
      <Card id="letter" x={130} y={430} w={820} h={760} rot={1.5} at={l19} out={l20} enter="right" bg={C.paperLight}>
        <div style={{padding: '40px 50px'}}>
          <div style={{fontFamily: F.type, fontSize: 52}}>APPRAISAL LETTER</div>
          <div style={{fontFamily: F.type, fontSize: 28, marginTop: 20, color: C.inkSoft, lineHeight: 1.4}}>Congratulations! Aapki salary revise ho gayi hai.</div>
          <div style={{height: 3, background: C.ink, margin: '30px 0'}} />
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, marginBottom: 20}}>TO-DO</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, fontFamily: F.display, fontSize: 84}}>
            <Tick at={word('L19', 'sip', -2)} size={72} />
            <span>1. <HL at={word('L19', 'sip', 0)}>SIP BADHAO</HL></span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, fontFamily: F.display, fontSize: 84, marginTop: 18, opacity: frame >= word('L19', 'phir', -4) ? 1 : 0}}>
            <Tick at={word('L19', 'shopping', -2)} size={72} />
            <span>2. PHIR SHOPPING</span>
          </div>
        </div>
      </Card>
      <Tape id="lt" x={460} y={412} w={150} rot={-4} at={l19} out={l20} />
      <Stamp id="first" text="Pehla kaam" x={700} y={1110} at={word('L19', 'pehla', -2)} out={l20} size={56} rot={8} color={C.ink} paper />

      {/* L20: start at 5% if 10% feels hard */}
      <Card id="ten" x={110} y={430} w={400} h={160} rot={-2} at={l20} enter="left" bg={C.card}>
        <div style={{fontFamily: F.display, fontSize: 64, textAlign: 'center', marginTop: 40, whiteSpace: 'nowrap'}}>10% MUSHKIL?</div>
      </Card>
      <Card id="five" x={570} y={430} w={400} h={160} rot={2} at={fiveAt} enter="right" bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 64, textAlign: 'center', marginTop: 40, whiteSpace: 'nowrap'}}>5% SE SHURU</div>
      </Card>
      <Card id="cmp" x={90} y={640} w={900} h={560} rot={-0.6} at={barAt} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'absolute', left: 36, top: 24}}><Label size={22}>20 saal baad</Label></div>
        {[
          {x: 150, h: 300 * g1, label: 'SAME SIP', val: '₹1 CR', on: frame >= b1, bg: C.paperLight},
          {x: 520, h: 411 * g2, label: '5% STEP-UP', val: '₹1.37 CR', on: frame >= b2, bg: C.yellow},
        ].map((b) => (
          <React.Fragment key={b.label}>
            {b.on ? (
              <>
                <div style={{position: 'absolute', left: b.x, top: 500 - b.h, width: 230, height: b.h, background: b.bg, border: `4px solid ${C.ink}`, boxSizing: 'border-box', boxShadow: `4px 6px 0 rgba(30,22,10,0.22)`}} />
                <div style={{position: 'absolute', left: b.x - 40, width: 310, top: 500 - b.h - 80, textAlign: 'center', fontFamily: F.display, fontSize: 64}}>{b.val}</div>
              </>
            ) : null}
            <div style={{position: 'absolute', left: b.x - 40, width: 310, top: 512, textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: 2}}>{b.label}</div>
          </React.Fragment>
        ))}
        <div style={{position: 'absolute', left: 60, top: 500, width: 780, height: 6, background: C.ink}} />
      </Card>
      <Sfx at={b2} name="coin" volume={0.25} />
    </AbsoluteFill>
  );
};

/* ----------------------------------------------------------------- outro */

const Outro: React.FC = () => (
  <AbsoluteFill>
    <SignOff share="L21" sign="L22" who="us dost ko jiska appraisal letter aaya hai →" note="ILLUSTRATIVE · ₹10,000 SIP · 12% A YEAR · 20 YEARS · 10% STEP-UP" />
  </AbsoluteFill>
);

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  step: Step,
  honest: Honest,
  why: Why,
  how: How,
  outro: Outro,
};
