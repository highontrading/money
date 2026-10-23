import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Card, Circle, Hand, HL, Label, Photo, Stamp, Tape} from '../components/paper';
import {useCues} from '../lib/timeline';
import {C, F} from '../theme';

const DAYS = [
  {d: '23', w: 'FRI', tag: 'T', label: 'Bidding band', key: 'band', on: true},
  {d: '24', w: 'SAT', tag: '', label: '', key: '', on: false},
  {d: '25', w: 'SUN', tag: '', label: '', key: '', on: false},
  {d: '26', w: 'MON', tag: 'T+1', label: 'Allotment', key: 'allotment', on: true},
  {d: '27', w: 'TUE', tag: 'T+2', label: '', key: '', on: true},
  {d: '28', w: 'WED', tag: 'T+3', label: 'Listing', key: 'listing', on: true},
];

export const Gap: React.FC = () => {
  const {at, word} = useCues();
  const l8 = at('L08');
  const l10 = at('L10');
  return (
    <AbsoluteFill>
      {/* L07: money goes in, shares come out later; a gap in between */}
      <Photo id="note" src="note500.jpg" x={90} y={430} w={470} h={200} rot={-5} at={at('L07', 0)} out={l8} enter="left" pos="50% 50%" zoom={0} />
      <Card id="inlabel" x={110} y={660} w={400} h={90} rot={-2} at={word('L07', 'lagane', -2)} out={l8} bg={C.ink} texture={null} sfx={null}>
        <div style={{fontFamily: F.mono, fontWeight: 700, color: C.paperLight, fontSize: 32, letterSpacing: 3, textAlign: 'center', marginTop: 24}}>PAISA LAGAYA</div>
      </Card>
      <Card id="shares" x={600} y={430} w={380} h={320} rot={3} at={word('L07', 'shares', -4)} out={l8} enter="right" bg={C.card}>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, padding: 34}}>
          {Array.from({length: 12}).map((_, i) => (
            <div key={i} style={{height: 50, background: C.yellow, border: `3px solid ${C.ink}`}} />
          ))}
        </div>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 28, letterSpacing: 3, textAlign: 'center'}}>SHARES MILE</div>
      </Card>
      <Hand x={420} y={800} at={word('L07', 'gap', -2)} out={l8} size={120} rot={-4} color={C.red}>gap ?</Hand>
      <Circle id="gapc" cx={530} cy={880} rx={170} ry={90} at={word('L07', 'gap', 2)} out={l8} />

      {/* L08: T, T+1, T+3 on a paper calendar (Jio's actual dates) */}
      <Card id="cal" x={70} y={420} w={940} h={520} rot={-1} at={l8 - 2} out={l10} exit="up" bg={C.card} torn={{top: true}}>
        <div style={{padding: '34px 36px 0'}}>
          <Label size={24}>Jio IPO · Oct 2026</Label>
          <div style={{display: 'flex', gap: 14, marginTop: 28}}>
            {DAYS.map((d) => (
              <div key={d.d} style={{flex: 1, border: `3px solid ${d.on ? C.ink : C.grey}`, background: d.on ? C.paperLight : 'transparent', opacity: d.on ? 1 : 0.45, padding: '10px 0 14px', textAlign: 'center'}}>
                <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2}}>{d.w}</div>
                <div style={{fontFamily: F.display, fontSize: 84, lineHeight: 1.05}}>{d.d}</div>
                <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, color: C.inkSoft, height: 26}}>{d.tag}</div>
              </div>
            ))}
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 34, fontFamily: F.sans, fontWeight: 800, fontSize: 40}}>
            <span>Band: <HL at={word('L08', 'band')}>23</HL></span>
            <span>Allot: <HL at={word('L08', 'allotment')}>26</HL></span>
            <span>List: <HL at={word('L08', 'listing')}>28</HL></span>
          </div>
        </div>
      </Card>
      <Circle id="c23" cx={155} cy={600} rx={78} ry={110} at={word('L08', 'band', 2)} out={l10} />
      <Circle id="c26" cx={620} cy={600} rx={78} ry={110} at={word('L08', 'allotment', 2)} out={l10} />
      <Circle id="c28" cx={925} cy={600} rx={78} ry={110} at={word('L08', 'listing', 2)} out={l10} />
      <Hand x={330} y={980} at={word('L08', 'teen')} out={l10} size={84} rot={-3}>3 working din</Hand>

      {/* L09: nothing trades in between */}
      <Stamp id="notrade" text="No trading" sub="EXCHANGE PE ABHI NAHI" x={540} y={1110} at={word('L09', 'trade', -2)} out={l10} size={92} rot={-6} paper />

      {/* L10: but people keep guessing */}
      {[
        ['Listing kitne pe?', -6, 110, 430],
        ['₹1,300? ₹1,400?', 4, 520, 560],
        ['Kitna faayda?', -3, 150, 760],
      ].map(([t, r, x, y], i) => (
        <React.Fragment key={i}>
          <Card id={'guess' + i} x={x as number} y={y as number} w={430} h={150} rot={r as number} at={l10 + i * 7} enter="drop" bg={i === 1 ? C.yellow : C.card}>
            <div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 64, textAlign: 'center', marginTop: 34}}>{t}</div>
          </Card>
          <Tape id={'tg' + i} x={(x as number) + 150} y={(y as number) - 18} w={120} rot={(r as number) * -1.5} at={l10 + i * 7 + 2} />
        </React.Fragment>
      ))}
      <Card id="andaza" x={250} y={990} w={580} h={140} rot={-2} at={word('L10', 'andaza', -2)} bg={C.ink} texture="kraft">
        <div style={{fontFamily: F.display, fontSize: 104, color: C.paperLight, textAlign: 'center', marginTop: 8, letterSpacing: 3}}>ANDAZA</div>
      </Card>
    </AbsoluteFill>
  );
};
