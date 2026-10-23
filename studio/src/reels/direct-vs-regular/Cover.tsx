import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {Atmosphere, Desk} from '../../components/chrome';
import {Card, HL, Label, Stamp, Tape} from '../../components/paper';
import {loadFonts} from '../../lib/fonts';
import {C, F} from '../../theme';

loadFonts();

const Stack: React.FC<{id: string; x: number; base: number; n: number; w: number}> = ({id, x, base, n, w}) => (
  <div style={{position: 'absolute', left: x, top: base - n * 26, width: w, height: n * 26, filter: `drop-shadow(5px 8px 8px ${C.shadow})`}}>
    {Array.from({length: n}).map((_, i) => (
      <div key={i} style={{position: 'absolute', left: (random(id + i) - 0.5) * 14, bottom: i * 26, width: w, height: 23, background: i % 3 === 2 ? C.newsprint : C.card, border: `2px solid ${C.ink}`, transform: `rotate(${(random(id + 'r' + i) - 0.5) * 2.2}deg)`}} />
    ))}
  </div>
);

// Grid thumbnail: everything that matters sits in the centre 1080x1350.
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Desk />
    <div style={{position: 'absolute', left: 80, top: 330}}>
      <Label size={30}>Money Theory · Mutual funds</Label>
    </div>
    <Stack id="cA" x={120} base={1330} n={20} w={300} />
    <Stack id="cB" x={660} base={1330} n={13} w={300} />
    <div style={{position: 'absolute', left: 100, top: 1336, width: 880, height: 8, background: C.ink}} />
    <Card id="cdir" x={110} y={740} w={320} h={100} rot={-3} at={0} enter="none" bg={C.card} sfx={null}>
      <div style={{fontFamily: F.display, fontSize: 64, textAlign: 'center', marginTop: 12}}>DIRECT</div>
    </Card>
    <Card id="creg" x={650} y={920} w={320} h={100} rot={3} at={0} enter="none" bg={C.card} sfx={null}>
      <div style={{fontFamily: F.display, fontSize: 64, textAlign: 'center', marginTop: 12}}>REGULAR</div>
    </Card>
    <div style={{position: 'absolute', left: 0, right: 0, top: 410, textAlign: 'center', fontFamily: F.display, fontSize: 124, lineHeight: 0.95}}>
      SIRF <HL at={-10}>1%</HL> KA FARAK
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 550, textAlign: 'center', fontFamily: F.display, fontSize: 130, lineHeight: 1}}>
      = ₹31 LAKH
    </div>
    <Stamp id="csame" text="Same fund" x={760} y={1150} at={-10} size={70} rot={-8} paper />
    <Tape id="ct" x={210} y={724} w={130} rot={-8} at={0} />
    <Atmosphere />
  </AbsoluteFill>
);
