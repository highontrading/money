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
      <Label size={28}>Money Theory · Income tax</Label>
    </div>
    <div style={{position: 'absolute', left: 80, right: 80, top: 390, fontFamily: F.display, fontSize: 128, lineHeight: 0.95, color: C.ink}}>
      TAX BACHANE KE LIYE <HL at={-10}>POLICY LI?</HL>
    </div>
    <Card id="cslip" x={90} y={700} w={620} h={330} rot={-3} at={0} enter="none" bg={C.card} sfx={null}>
      <Head>SALARY SLIP</Head>
      <div style={{padding: '28px 40px'}}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 3, color: C.inkSoft}}>CTC</div>
        <div style={{fontFamily: F.display, fontSize: 130, lineHeight: 1, marginTop: 8}}>₹12 LAKH</div>
      </div>
    </Card>
    <Card id="crc" x={560} y={900} w={430} h={290} rot={5} at={0} enter="none" bg={C.paperLight} torn={{bottom: true}} sfx={null}>
      <div style={{padding: '26px 34px'}}>
        <Label size={22}>Policy + ELSS · 80C</Label>
        <div style={{fontFamily: F.display, fontSize: 92, marginTop: 30}}>₹1.5 LAKH</div>
      </div>
    </Card>
    <Tape id="ctp" x={680} y={884} w={150} rot={-8} at={0} />
    <Stamp id="cna" text="New regime: N/A" x={420} y={1290} at={-10} size={78} rot={-6} />
    <Card id="czero" x={180} y={1380} w={720} h={200} rot={-2} at={0} enter="none" bg={C.yellow} torn={{top: true, right: true}} sfx={null}>
      <div style={{fontFamily: F.display, fontSize: 130, textAlign: 'center', marginTop: 24}}>BACHA: ₹0</div>
    </Card>
    <Atmosphere />
  </AbsoluteFill>
);
