import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmosphere, Desk} from './components/chrome';
import {Card, HL, Label, Photo, Stamp, Tape} from './components/paper';
import {loadFonts} from './lib/fonts';
import {C, F} from './theme';

loadFonts();

// Reel cover / grid thumbnail. Everything important sits in the centre 1080x1350
// so the 4:5 profile-grid crop still reads.
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Desk />
    <Photo id="cbse" src="bse.jpg" x={80} y={330} w={920} h={560} rot={-2.5} at={0} enter="none" torn={{top: true, bottom: true}} rough={14} pos="50% 40%" zoom={0} />
    <Card id="cgmp" x={110} y={760} w={860} h={420} rot={-3} at={0} enter="none" bg={C.yellow} torn={{top: true, right: true}} rough={14} sfx={null}>
      <div style={{fontFamily: F.display, fontSize: 330, lineHeight: 1, textAlign: 'center', marginTop: 36, letterSpacing: 6}}>GMP</div>
    </Card>
    <Tape id="ct" x={460} y={740} w={170} rot={-6} at={0} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 1220, textAlign: 'center', fontFamily: F.display, fontSize: 120, lineHeight: 1}}>
      <HL at={-10}>GREY MARKET</HL> KA SACH
    </div>
    <Stamp id="cs" text="₹1,364 ?" x={760} y={380} at={-10} size={96} rot={8} paper />
    <div style={{position: 'absolute', left: 80, top: 230}}>
      <Label size={30}>Money Theory · EP 01</Label>
    </div>
    <Atmosphere />
  </AbsoluteFill>
);
