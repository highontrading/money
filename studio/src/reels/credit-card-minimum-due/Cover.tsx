import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmosphere, Desk} from '../../components/chrome';
import {Card, HL, Label, Stamp, Tape} from '../../components/paper';
import {loadFonts} from '../../lib/fonts';
import {C, F} from '../../theme';
import {CreditCard} from './props';

loadFonts();

// Reel cover / grid thumbnail. Everything important sits in the centre 1080x1350
// (y 285-1635) so the 4:5 profile-grid crop still reads.
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Desk />
    <div style={{position: 'absolute', left: 80, top: 320}}>
      <Label size={30}>Money Theory · Credit card</Label>
    </div>
    <div style={{position: 'absolute', left: 80, right: 80, top: 400, fontFamily: F.display, fontSize: 150, lineHeight: 0.95, whiteSpace: 'nowrap', color: C.ink}}>
      MINIMUM DUE<br />
      <HL at={-10}>KA JAAL</HL>
    </div>
    <CreditCard id="cvcard" x={90} y={860} w={560} h={340} rot={-8} at={0} enter="none" sfx={null} />
    <Card id="cvbill" x={500} y={930} w={490} h={380} rot={4} at={0} enter="none" bg={C.card} torn={{bottom: true}} rough={10} sfx={null}>
      <div style={{padding: '34px 40px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: F.type, fontSize: 40, borderBottom: `2px dashed ${C.grey}`, paddingBottom: 14}}>
          <span>BHARA</span>
          <span style={{fontFamily: F.display, fontSize: 70}}>₹2,500</span>
        </div>
        <div style={{fontFamily: F.type, fontSize: 40, marginTop: 20}}>INTEREST LAGA</div>
        <div style={{fontFamily: F.display, fontSize: 150, lineHeight: 1}}><HL at={-10}>₹3,244</HL></div>
      </div>
    </Card>
    <Tape id="cvt" x={680} y={912} w={150} rot={-8} at={0} />
    <Stamp id="cvst" text="Phir bhi?" x={330} y={1390} at={-10} size={110} rot={-7} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 1490, textAlign: 'center', fontFamily: F.hand, fontWeight: 700, fontSize: 76, color: C.ink}}>
      minimum bhara, time pe...
    </div>
    <Atmosphere />
  </AbsoluteFill>
);
