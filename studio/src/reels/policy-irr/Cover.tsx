import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmosphere, Desk} from '../../components/chrome';
import {Card, HL, Label, Stamp, Tape} from '../../components/paper';
import {loadFonts} from '../../lib/fonts';
import {C, F} from '../../theme';

loadFonts();

// Grid thumbnail: the "₹15 LAKH!" brochure promise, stamped with its real IRR.
// Everything that matters sits in the centre 1080x1350 for the 4:5 crop.
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Desk />
    <Card id="cbro" x={110} y={360} w={860} h={640} rot={-2.5} at={0} enter="none" bg={C.card} sfx={null}>
      <div style={{height: 130, background: C.ink, color: C.paperLight, padding: '22px 40px'}}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 4, opacity: 0.8}}>TRADITIONAL ENDOWMENT PLAN</div>
        <div style={{fontFamily: F.display, fontSize: 64, letterSpacing: 2, marginTop: 4}}>GUARANTEED* SURAKSHA</div>
      </div>
      <div style={{padding: '30px 40px', fontFamily: F.display, lineHeight: 1}}>
        <div style={{fontSize: 96}}>₹10 LAKH DALO</div>
        <div style={{fontSize: 150, marginTop: 14}}><HL at={-10}>₹15 LAKH</HL> PAO</div>
      </div>
    </Card>
    <Tape id="ct1" x={440} y={340} w={180} rot={-5} at={0} />
    <Stamp id="cirr" text="IRR 3.7%" x={700} y={930} at={-10} size={120} rot={-9} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 1110, textAlign: 'center', fontFamily: F.display, fontSize: 124, lineHeight: 1}}>
      FD SE BHI <HL at={-10}>KAM?</HL>
    </div>
    <div style={{position: 'absolute', left: 80, top: 250}}>
      <Label size={30}>Money Theory</Label>
    </div>
    <Atmosphere />
  </AbsoluteFill>
);
