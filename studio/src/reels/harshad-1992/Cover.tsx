import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmosphere, Desk} from '../../components/chrome';
import {Card, HL, Label, Photo, Stamp, Tape} from '../../components/paper';
import {loadFonts} from '../../lib/fonts';
import {C, F} from '../../theme';
import {Center, ReceiptBody} from './props';

loadFonts();

// Grid thumbnail: everything that matters sits in the centre 1080x1350.
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Desk />
    <div style={{position: 'absolute', left: 80, top: 300}}>
      <Label size={28}>Money Theory · 1992</Label>
    </div>
    <div style={{position: 'absolute', left: 80, right: 80, top: 370, fontFamily: F.display, fontSize: 210, lineHeight: 0.9}}>
      SCAM <HL at={-10}>1992</HL>
    </div>
    <Photo id="cv-bse" src="bse.jpg" x={90} y={600} w={900} h={430} rot={-2} at={0} enter="none" torn={{top: true, bottom: true}} rough={14} pos="50% 35%" zoom={0} />
    <Card id="cv-br" x={130} y={900} w={560} h={360} rot={-4} at={0} enter="none" bg={C.paperLight} torn={{bottom: true}} rough={10} sfx={null}>
      <ReceiptBody bank="BANK RECEIPT" at={-1000} size={30} />
    </Card>
    <Tape id="cv-t" x={330} y={884} w={150} rot={-8} at={0} />
    <div style={{position: 'absolute', left: 720, top: 960, width: 260, height: 220, border: `5px dashed ${C.ink}`, background: 'rgba(246,242,233,0.85)'}}>
      <Center><div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 2, textAlign: 'center'}}>SECURITIES:<br /><span style={{fontFamily: F.display, fontSize: 110}}>?</span></div></Center>
    </div>
    <Card id="cv-amt" x={560} y={640} w={420} h={140} rot={5} at={0} enter="none" bg={C.yellow} sfx={null}>
      <Center><div style={{fontFamily: F.display, fontSize: 86, lineHeight: 1, whiteSpace: 'nowrap'}}>₹4,025 CR</div></Center>
    </Card>
    <Stamp id="cv-s" text="Ek kaagaz" x={760} y={1270} at={-10} size={70} rot={-8} paper />
    <Atmosphere />
  </AbsoluteFill>
);
