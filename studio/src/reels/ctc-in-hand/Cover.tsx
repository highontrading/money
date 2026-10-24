import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmosphere, Desk} from '../../components/chrome';
import {Card, HL, Label, Stamp, Tape} from '../../components/paper';
import {loadFonts} from '../../lib/fonts';
import {C, F} from '../../theme';
import {Head} from './props';

loadFonts();

// Grid thumbnail: everything that matters sits in the centre 1080x1350.
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Desk />
    <div style={{position: 'absolute', left: 80, top: 320}}>
      <Label size={28}>Money Theory · Salary</Label>
    </div>
    <div style={{position: 'absolute', left: 80, right: 80, top: 392, fontFamily: F.display, fontSize: 132, lineHeight: 0.95, color: C.ink}}>
      CTC ₹12 LAKH,<br /><HL at={-10}>HAATH MEIN?</HL>
    </div>
    <Card id="coffer" x={90} y={720} w={600} h={300} rot={-3} at={0} enter="none" bg={C.card} sfx={null}>
      <Head>OFFER LETTER</Head>
      <div style={{padding: '26px 40px'}}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 3, color: C.inkSoft}}>ANNUAL CTC</div>
        <div style={{fontFamily: F.display, fontSize: 120, lineHeight: 1, marginTop: 8}}>₹12,00,000</div>
      </div>
    </Card>
    <Card id="cpay" x={400} y={1010} w={560} h={330} rot={4} at={0} enter="none" bg={C.paperLight} torn={{bottom: true}} sfx={null}>
      <Head>PAYSLIP</Head>
      <div style={{padding: '24px 36px'}}>
        <Label size={22}>In-hand · mahina</Label>
        <div style={{fontFamily: F.display, fontSize: 130, lineHeight: 1, marginTop: 20}}><HL at={-10}>₹79,000</HL></div>
      </div>
    </Card>
    <Tape id="ctp" x={580} y={992} w={150} rot={-8} at={0} />
    <Stamp id="cgap" text="₹21,000 kahan?" x={430} y={1430} at={-10} size={70} rot={-7} />
    <Atmosphere />
  </AbsoluteFill>
);
