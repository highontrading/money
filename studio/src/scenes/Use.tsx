import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Big, Card, Circle, Cross, Hand, HL, Label, Marker, Stamp, Tape} from '../components/paper';
import {ease, stepped} from '../lib/motion';
import {useCues} from '../lib/timeline';
import {C, F} from '../theme';

const Thermo: React.FC<{level: number}> = ({level}) => (
  <div style={{position: 'relative', width: 120, height: 520}}>
    <div style={{position: 'absolute', left: 30, top: 0, width: 60, height: 430, borderRadius: 30, background: C.paperLight, border: `5px solid ${C.ink}`}} />
    <div style={{position: 'absolute', left: 45, bottom: 90, width: 30, height: 60 + 300 * level, background: C.red, borderRadius: 15}} />
    <div style={{position: 'absolute', left: 10, bottom: 0, width: 100, height: 100, borderRadius: 50, background: C.red, border: `5px solid ${C.ink}`}} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <div key={i} style={{position: 'absolute', left: 92, top: 50 + i * 60, width: 26, height: 4, background: C.ink}} />
    ))}
  </div>
);

export const Use: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l44 = at('L44'), l45 = at('L45'), l46 = at('L46'), l47 = at('L47'), l48 = at('L48');
  const level = 0.45 + 0.25 * Math.sin(stepped(frame) / 9) * ease(frame, l45, l45 + 10);
  return (
    <AbsoluteFill>
      {/* L43 */}
      {frame < l44 + 6 ? (
        <div style={{position: 'absolute', left: 90, top: 470}}>
          <Big words={['Toh', 'GMP', 'kaise', 'padhein?']} at={2} gap={4} size={170} />
        </div>
      ) : null}

      {/* L44-L45: a thermometer, not a forecast */}
      <Card id="thermo" x={90} y={420} w={430} h={760} rot={-2} at={l44 - 2} out={l46} enter="left" bg={C.card}>
        <div style={{padding: '30px 30px 0'}}>
          <Label size={22}>GMP</Label>
          <div style={{fontFamily: F.display, fontSize: 64, marginTop: 10}}><HL at={word('L44', 'thermometer')}>THERMOMETER</HL></div>
        </div>
        <div style={{position: 'absolute', left: 150, top: 200}}><Thermo level={level} /></div>
      </Card>
      <Card id="forecast" x={560} y={460} w={430} h={420} rot={3} at={word('L44', 'forecast', -4)} out={l46} enter="right" bg={C.paperLight}>
        <div style={{padding: 30}}>
          <Label size={22}>Forecast</Label>
          <div style={{fontFamily: F.type, fontSize: 40, marginTop: 24, lineHeight: 1.5}}>LISTING DAY:<br />₹ ????<br />GUARANTEED</div>
        </div>
      </Card>
      <Cross id="xf" x={600} y={500} w={350} h={340} at={word('L44', 'nahi', 0)} out={l46} />
      <Hand x={570} y={920} at={word('L45', 'mood', -2)} out={l46} size={64} rot={-3}>✓ aaj ka mood</Hand>
      <Hand x={570} y={1020} at={word('L45', 'listing', 0)} out={l46} size={64} rot={-3} color={C.red}>✕ listing price</Hand>

      {/* L46: what to actually look at */}
      <Card id="check" x={110} y={420} w={860} h={760} rot={-1.5} at={l46 - 2} out={l48} enter="up" bg={C.paperLight}>
        <div style={{position: 'absolute', left: 90, top: 0, bottom: 0, width: 3, background: 'rgba(210,52,31,0.45)'}} />
        <div style={{padding: '44px 60px 0 130px'}}>
          <Label size={24}>Official data dekho</Label>
          {[
            ['Subscription', 'NSE / BSE · roz update', 'subscription'],
            ['QIB demand', 'bade institutions kitna maang rahe', 'qib'],
            ['Company ke numbers', 'RHP: revenue, profit, debt', 'numbers'],
            ['Valuation', 'peers ke mukable mehnga ya sasta?', 'valuation'],
          ].map(([t, s], i) => (
            <div key={t} style={{marginTop: 34}}>
              <div style={{fontFamily: F.sans, fontWeight: 900, fontSize: 56}}>{t}</div>
              <div style={{fontFamily: F.mono, fontWeight: 500, fontSize: 24, color: C.inkSoft, marginTop: 4}}>{s}</div>
            </div>
          ))}
        </div>
      </Card>
      {['subscription', 'qib', 'numbers', 'valuation'].map((k, i) => (
        <Marker key={k} id={'tick' + k} d={`M150,${560 + i * 145} l20,24 l42,-58`} at={word('L46', k, 0)} out={l48} dur={5} color={C.ink} width={10} />
      ))}

      {/* L47: SEBI's proposal */}
      <Card id="sebi" x={160} y={560} w={780} h={330} rot={3} at={l47 - 2} out={l48} enter="drop" bg={C.card} z={20}>
        <div style={{padding: '36px 44px', fontFamily: F.type, fontSize: 36, lineHeight: 1.5}}>
          <Label size={22}>SEBI · Idea on the table</Label>
          <div style={{marginTop: 18}}>"WHEN-LISTED" TRADING: allotment aur listing ke beech, exchange pe official trading.</div>
        </div>
      </Card>
      <Stamp id="prop" text="Proposal" sub="ABHI LAGU NAHI" x={760} y={900} at={word('L47', 'baat', -2)} out={l48} size={64} rot={-10} color={C.ink} paper />

      {/* L48: gossip vs data */}
      <Card id="gossip" x={90} y={460} w={420} h={300} rot={-4} at={l48} enter="left" bg={C.paperLight}>
        <div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 64, textAlign: 'center', marginTop: 50, lineHeight: 1.1}}>"Sun, GMP 245 chal raha!"</div>
      </Card>
      <Card id="data" x={560} y={760} w={430} h={330} rot={3} at={word('L48', 'faisla', -4)} enter="right" bg={C.yellow}>
        <div style={{padding: 34}}>
          <Label size={22}>File</Label>
          <div style={{fontFamily: F.display, fontSize: 130, marginTop: 10}}>DATA</div>
        </div>
      </Card>
      <Tape id="tg1" x={220} y={444} w={130} rot={-10} at={l48 + 2} />
      <Hand x={110} y={790} at={word('L48', 'gossip', 2)} size={60} rot={-3}>= gossip</Hand>
      <Circle id="dc" cx={775} cy={925} rx={250} ry={200} at={word('L48', 'data', 0)} color={C.ink} />
    </AbsoluteFill>
  );
};
