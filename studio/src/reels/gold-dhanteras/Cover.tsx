import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmosphere, Desk} from '../../components/chrome';
import {Card, HL, Label, Stamp, Tape} from '../../components/paper';
import {loadFonts} from '../../lib/fonts';
import {C, F} from '../../theme';
import {Chain} from './props';

loadFonts();

// Reel cover / grid thumbnail. Everything important sits in the centre 1080x1350
// so the 4:5 profile-grid crop still reads.
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Desk />
    <div style={{position: 'absolute', left: 90, top: 310}}>
      <Label size={30}>Money Theory · Dhanteras</Label>
    </div>
    <Card id="cv" x={90} y={390} w={900} h={560} rot={-2} at={0} enter="none" bg="#2a2826" texture="kraft" torn={{top: true, bottom: true}} rough={14} sfx={null}>
      <div style={{position: 'absolute', left: 100, top: 30, width: 700, height: 500}}>
        <Chain w={700} h={480} seed="cover" />
      </div>
    </Card>
    <Card id="cb" x={120} y={880} w={840} h={300} rot={2} at={0} enter="none" bg={C.paperLight} sfx={null}>
      <div style={{display: 'grid', gridTemplateColumns: '1fr auto', padding: '26px 46px', rowGap: 6, alignItems: 'baseline'}}>
        <div style={{fontFamily: F.type, fontSize: 46}}>Diye</div>
        <div style={{fontFamily: F.display, fontSize: 92}}>₹1,15,360</div>
        <div style={{fontFamily: F.type, fontSize: 46}}>Agle din mile</div>
        <div style={{fontFamily: F.display, fontSize: 92}}>₹97,000</div>
      </div>
    </Card>
    <Tape id="ct" x={470} y={862} w={160} rot={-5} at={0} />
    <div style={{position: 'absolute', left: 60, right: 60, top: 1230, textAlign: 'center', fontFamily: F.display, fontSize: 150, lineHeight: 1.02}}>
      SONE KA <HL at={-10}>ASLI DAAM</HL>
    </div>
    <Stamp id="cs" text="−₹18,360" x={770} y={480} at={-10} size={96} rot={8} paper />
    <Atmosphere />
  </AbsoluteFill>
);
