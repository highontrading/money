import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmosphere, Desk} from '../../components/chrome';
import {Card, HL, Label, Stamp, Tape} from '../../components/paper';
import {loadFonts} from '../../lib/fonts';
import {C, F} from '../../theme';
import {Jar} from './props';

loadFonts();

// Grid thumbnail: everything that matters sits in the centre 1080x1350.
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Desk />
    <div style={{position: 'absolute', left: 90, top: 320}}>
      <Label size={30}>Money Theory · Retirement</Label>
    </div>
    <div style={{position: 'absolute', left: 90, right: 90, top: 390, fontFamily: F.display, fontSize: 150, lineHeight: 0.98}}>
      ₹1 CRORE<br /><HL at={-10}>KAAFI HAI?</HL>
    </div>
    <Card id="cjar" x={90} y={720} w={440} h={700} rot={-2} at={0} enter="none" bg={C.card} sfx={null}>
      <div style={{position: 'absolute', left: 30, top: 24}}>
        <Jar w={380} h={650} level={0.12} label="₹1 CRORE" />
      </div>
    </Card>
    <Tape id="ct" x={240} y={700} w={150} rot={-5} at={0} />
    <Card id="c23" x={580} y={780} w={410} h={300} rot={2.5} at={0} enter="none" bg={C.yellow} sfx={null}>
      <div style={{padding: '28px 30px'}}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2}}>25 SAAL BAAD · AAJ KE</div>
        <div style={{fontFamily: F.display, fontSize: 92, lineHeight: 1.1, marginTop: 14, whiteSpace: 'nowrap'}}>₹23 LAKH</div>
      </div>
    </Card>
    <Stamp id="c5" text="Sirf 5 saal" x={780} y={1260} at={-10} size={82} rot={-8} />
    <div style={{position: 'absolute', left: 590, top: 1110, fontFamily: F.hand, fontWeight: 700, fontSize: 58, transform: 'rotate(-3deg)'}}>villain: mehngai</div>
    <Atmosphere />
  </AbsoluteFill>
);
