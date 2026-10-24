import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmosphere, Desk} from '../../components/chrome';
import {Card, HL, Label, Stamp, Tape} from '../../components/paper';
import {loadFonts} from '../../lib/fonts';
import {C, F} from '../../theme';
import {grid, LoanChart, N} from './props';

loadFonts();

// Grid crop is the centre 1080x1350 (y 285-1635): everything that matters sits inside it.
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Desk />
    <div style={{position: 'absolute', left: 90, top: 330}}>
      <Label size={28}>Money Theory · Loans</Label>
    </div>
    <div style={{position: 'absolute', left: 90, top: 400, width: 900, fontFamily: F.display, fontSize: 168, lineHeight: 0.95}}>
      <div>10% FLAT?</div>
      <div><HL at={-10}>ASLI ~18%</HL></div>
    </div>
    <Card id="cvchart" x={80} y={800} w={920} h={560} rot={-1.5} at={0} enter="none" bg={C.card} sfx={null}>
      <div style={{position: 'absolute', inset: 0, ...grid(40, 'rgba(70, 110, 150, 0.10)')}} />
      <div style={{position: 'absolute', left: 30, top: 22}}><Label size={20}>Lautaya paisa pe bhi interest</Label></div>
      <div style={{position: 'absolute', left: 0, top: 50, width: 920, height: 500}}>
        <LoanChart w={920} h={500} shown={N} outline={1} hatch={1} />
      </div>
    </Card>
    <Tape id="cvt" x={440} y={782} w={170} rot={-4} at={0} />
    <Stamp id="cvs" text="Flat rate ka jaal" x={560} y={1450} at={-10} size={80} rot={-5} paper />
    <Atmosphere />
  </AbsoluteFill>
);
