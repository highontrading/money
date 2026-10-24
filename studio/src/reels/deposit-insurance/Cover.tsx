import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmosphere, Desk} from '../../components/chrome';
import {Card, Hand, HL, Label, Stamp} from '../../components/paper';
import {loadFonts} from '../../lib/fonts';
import {C, F} from '../../theme';
import {Bank, Rain, Slip, Umbrella} from './props';

loadFonts();

// Grid crop is the centre 1080x1350 (y 285-1635): everything that matters sits inside it.
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Desk />
    <div style={{position: 'absolute', left: 80, top: 330}}>
      <Label size={28}>Money Theory · Bank deposits</Label>
    </div>
    <div style={{position: 'absolute', left: 80, top: 400, fontFamily: F.display, fontSize: 150, lineHeight: 0.95}}>
      BANK <HL at={-10}>DOOB</HL> GAYA?
    </div>
    <Bank seed="c-bank" x={640} y={600} w={330} h={320} ground={930} at={-30} sinkAt={-60} />
    <div style={{position: 'absolute', left: 600, top: 928, width: 400, height: 6, background: C.ink}} />
    {[0, 1, 2, 3].map((i) => (
      <Card key={i} id={'c-s' + i} x={100 + i * 215} y={1190} w={195} h={250} rot={[-2, 1.5, -1, 2][i]} at={0} enter="none" bg={C.card} sfx={null}>
        <Slip title="FD" amount="₹5L" size={76} />
      </Card>
    ))}
    <Umbrella cx={197} top={900} r={150} at={-30} label="₹5 LAKH" size={50} />
    <Rain seed="c-rain" x={300} y={1030} w={680} h={330} at={-40} n={20} />
    <Stamp id="c-q" text="Baaki ₹15 lakh?" x={640} y={1530} at={-10} size={84} rot={-5} paper />
    <Hand x={90} y={720} at={-20} size={66} rot={-4}>₹20 lakh ki FD...</Hand>
    <Hand x={90} y={800} at={-20} size={66} rot={-4}>kitna milega?</Hand>
    <Atmosphere />
  </AbsoluteFill>
);
