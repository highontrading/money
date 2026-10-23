import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmosphere, Desk} from './components/chrome';
import {Card, HL, Label, Photo, Stamp, Tape} from './components/paper';
import {loadFonts} from './lib/fonts';
import {C, F} from './theme';

loadFonts();

export type CoverProps = {big: string; bigSize?: number; line1: string; line2?: string; photo: string; photoPos?: string; stamp: string};

// Reel cover / grid thumbnail. Everything important sits in the centre 1080x1350
// so the 4:5 profile-grid crop still reads.
export const Cover: React.FC<CoverProps> = ({big, bigSize = 330, line1, line2, photo, photoPos = '50% 40%', stamp}) => (
  <AbsoluteFill style={{background: C.paper}}>
    <Desk />
    <Photo id="cphoto" src={photo} x={80} y={330} w={920} h={560} rot={-2.5} at={0} enter="none" torn={{top: true, bottom: true}} rough={14} pos={photoPos} zoom={0} />
    <Card id="cbig" x={110} y={760} w={860} h={420} rot={-3} at={0} enter="none" bg={C.yellow} torn={{top: true, right: true}} rough={14} sfx={null}>
      <div style={{fontFamily: F.display, fontSize: bigSize, lineHeight: 1, textAlign: 'center', marginTop: (420 - bigSize) / 2 - 10, letterSpacing: 4, whiteSpace: 'nowrap'}}>{big}</div>
    </Card>
    <Tape id="ct" x={460} y={740} w={170} rot={-6} at={0} />
    <div style={{position: 'absolute', left: 40, right: 40, top: 1220, textAlign: 'center', fontFamily: F.display, fontSize: 110, lineHeight: 1.05}}>
      <HL at={-10}>{line1}</HL> {line2}
    </div>
    <Stamp id="cs" text={stamp} x={740} y={380} at={-10} size={84} rot={8} paper />
    <div style={{position: 'absolute', left: 80, top: 230}}>
      <Label size={30}>Money Theory</Label>
    </div>
    <Atmosphere />
  </AbsoluteFill>
);
