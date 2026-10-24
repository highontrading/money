import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmosphere, Desk} from '../../components/chrome';
import {Card, HL, Label, Stamp, Tape} from '../../components/paper';
import {loadFonts} from '../../lib/fonts';
import {C, F} from '../../theme';
import {grid, Trader} from './parts';

loadFonts();

// Grid thumbnail: key content inside the centre 1080x1350.
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Desk />
    <div style={{position: 'absolute', left: 90, top: 330}}>
      <Label size={30}>Money Theory · F&amp;O</Label>
    </div>
    <div style={{position: 'absolute', left: 80, right: 80, top: 400, fontFamily: F.display, fontSize: 168, lineHeight: 0.95, color: C.ink}}>
      10 MEIN SE <HL at={-10}>9</HL><br />GHAATE MEIN
    </div>
    <Card id="crow" x={70} y={780} w={940} h={300} rot={-1} at={0} enter="none" bg={C.card} sfx={null}>
      <div style={{position: 'absolute', inset: 0, ...grid(36)}} />
      <div style={{position: 'absolute', left: 30, right: 30, top: 40, display: 'flex', justifyContent: 'space-between'}}>
        {Array.from({length: 10}).map((_, i) => <Trader key={i} at={-20} tagAt={-20} win={i === 6} w={74} />)}
      </div>
    </Card>
    <Tape id="ct" x={470} y={760} w={150} rot={-5} at={0} />
    <Card id="cfig" x={200} y={1110} w={680} h={170} rot={2} at={0} enter="none" bg={C.yellow} sfx={null}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 18}}>
        <span style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 2}}>SEBI · FY25</span>
        <span style={{fontFamily: F.display, fontSize: 84, color: C.red}}>₹1.06 LAKH CR</span>
      </div>
    </Card>
    <Stamp id="cs" text="91% loss" sub="SEBI STUDY" x={560} y={1400} at={-10} size={96} rot={-6} paper />
    <Atmosphere />
  </AbsoluteFill>
);
