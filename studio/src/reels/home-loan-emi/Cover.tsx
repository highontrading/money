import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmosphere, Desk} from '../../components/chrome';
import {Card, Hand, HL, Label, Stamp, Tape} from '../../components/paper';
import {loadFonts} from '../../lib/fonts';
import {C, F} from '../../theme';
import {House} from './props';

loadFonts();

// Grid thumbnail: everything important sits in the centre 1080x1350 (y 285-1635).
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Desk />
    <div style={{position: 'absolute', left: 80, top: 330}}>
      <Label size={28}>Money Theory · Home loan</Label>
    </div>
    <div style={{position: 'absolute', left: 80, top: 400, width: 920, fontFamily: F.display, fontSize: 150, lineHeight: 0.95}}>
      ₹50 LAKH LIYA,<br /><HL at={-10}>₹1.04 CRORE</HL><br />CHUKAOGE
    </div>
    <House id="chouse" x={90} y={900} w={440} h={400} rot={-3} at={0} enter="none" sfx={null} />
    <Card id="crcpt" x={500} y={900} w={480} h={400} rot={3} at={0} enter="none" bg={C.card} torn={{bottom: true}} rough={10} sfx={null}>
      <div style={{padding: '30px 34px', fontFamily: F.type, fontSize: 36, lineHeight: 1.5}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Loan</span><span>₹50 L</span></div>
        <div style={{display: 'flex', justifyContent: 'space-between', color: C.red}}><span>Interest</span><span>₹54 L</span></div>
        <div style={{borderTop: `3px solid ${C.ink}`, marginTop: 12, paddingTop: 12, fontFamily: F.display, fontSize: 64, display: 'flex', justifyContent: 'space-between'}}><span>TOTAL</span><span>₹1.04 CR</span></div>
      </div>
    </Card>
    <Tape id="ct" x={660} y={880} w={150} rot={-6} at={0} />
    <Stamp id="cs" text="EMI ka asli hisaab" x={540} y={1410} at={-10} size={84} rot={-5} paper />
    <Hand x={300} y={1500} at={-20} size={58} rot={-3}>pehle saal: ₹4.2 L interest!</Hand>
    <Atmosphere />
  </AbsoluteFill>
);
