import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Big, Card, Cross, Hand, HL, Label, Tape} from '../components/paper';
import {useCues} from '../lib/timeline';
import {C, F} from '../theme';

const Row: React.FC<{ok: boolean; result: React.ReactNode; dim?: boolean}> = ({ok, result, dim}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 22, opacity: dim ? 0.35 : 1}}>
    <div style={{width: 54, height: 54, border: `4px solid ${C.ink}`, fontFamily: F.sans, fontWeight: 900, fontSize: 40, textAlign: 'center', lineHeight: '48px', color: ok ? C.ink : C.red}}>{ok ? '✓' : '✕'}</div>
    <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 1}}>{ok ? 'ALLOTMENT MILA' : 'NAHI MILA'}</div>
    <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 32, marginLeft: 'auto'}}>{result}</div>
  </div>
);

export const Deals: React.FC = () => {
  const {at, word} = useCues();
  const l22 = at('L22'), l23 = at('L23'), l24 = at('L24'), l25 = at('L25');
  return (
    <AbsoluteFill>
      {/* L21: two ways */}
      <div style={{position: 'absolute', left: 90, top: 410}}>
        <Big words={['Do', 'tareeke']} at={word('L21', 'do', -2)} size={150} />
      </div>
      <Hand x={560} y={430} at={word('L21', 'sauda', 0)} size={50} rot={-6} w={420}>grey market ke saude ↓</Hand>

      {/* L22-L23: Kostak */}
      <Card id="kostak" x={70} y={640} w={460} h={520} rot={-2} at={l22 - 2} enter="left" bg={C.card}>
        <div style={{padding: '30px 30px'}}>
          <Label size={22}>01</Label>
          <div style={{fontFamily: F.display, fontSize: 96, marginTop: 10}}><HL at={word('L22', 'kostak')}>KOSTAK</HL></div>
          <div style={{fontFamily: F.sans, fontWeight: 700, fontSize: 30, lineHeight: 1.25, marginTop: 6}}>Poori application dealer ko bech di</div>
          <div style={{marginTop: 14}}>
            {[true, false].map((ok) => (
              <div key={String(ok)} style={{opacity: 1}}>
                <Row ok={ok} result="₹ fixed" dim={false} />
              </div>
            ))}
          </div>
        </div>
      </Card>
      <Tape id="tk" x={220} y={620} w={140} rot={-6} at={l22} />
      <Hand x={110} y={1170} at={word("L23", "fixed", -2)} size={56} rot={-3} w={440}>dono case: paisa pakka</Hand>

      {/* L24-L25: Subject to Sauda */}
      <Card id="s2s" x={550} y={660} w={460} h={520} rot={2} at={l24 - 2} enter="right" bg={C.yellow}>
        <div style={{padding: '30px 30px'}}>
          <Label size={22}>02</Label>
          <div style={{fontFamily: F.display, fontSize: 66, lineHeight: 1, marginTop: 14}}>SUBJECT TO SAUDA</div>
          <div style={{fontFamily: F.sans, fontWeight: 700, fontSize: 30, lineHeight: 1.25, marginTop: 10}}>Deal tabhi, jab allotment mile</div>
          <div style={{marginTop: 14}}>
            <Row ok result="₹₹" />
            <Row ok={false} result="cancel" dim={false} />
          </div>
        </div>
      </Card>
      <Tape id="ts" x={720} y={640} w={140} rot={7} at={l24} />
      <Cross id="xcancel" x={870} y={1100} w={110} h={60} at={word('L25', 'cancel', 0)} />
      <Hand x={600} y={1210} at={word('L25', 'zyada', -2)} size={56} rot={-3} color={C.red}>rate zyada ↑</Hand>
    </AbsoluteFill>
  );
};
