import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmosphere, Desk} from '../../components/chrome';
import {HL, Label, Photo, Stamp, Tape} from '../../components/paper';
import {loadFonts} from '../../lib/fonts';
import {C, F} from '../../theme';
import {Mango, PriceTag} from './props';

loadFonts();

// Grid thumbnail: key content inside the centre 1080x1350.
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Desk />
    <div style={{position: 'absolute', left: 80, top: 330}}>
      <Label size={30}>Money Theory · Economy</Label>
    </div>
    <div style={{position: 'absolute', left: 80, right: 80, top: 400, fontFamily: F.display, fontSize: 138, lineHeight: 0.95, color: C.ink}}>
      NOTE CHHAAPO,<br /><HL at={-10}>SAB AMIR?</HL>
    </div>
    <Photo id="cz" src="zim_note.jpg" x={90} y={720} w={900} h={447} rot={-3} at={0} enter="none" torn={{right: true, bottom: true}} rough={12} zoom={0} />
    <Tape id="ct" x={460} y={700} w={170} rot={-6} at={0} />
    <div style={{position: 'absolute', left: 120, top: 1200, display: 'flex', alignItems: 'center', gap: 24}}>
      <Mango s={1.6} />
      <PriceTag w={420} h={150} bg={C.yellow} rot={3}>
        <div style={{fontFamily: F.display, fontSize: 70, whiteSpace: 'nowrap'}}><span style={{textDecoration: 'line-through', color: C.red, marginRight: 18}}>₹10</span>₹100</div>
      </PriceTag>
    </div>
    <Stamp id="cs" text="Kyun nahi?" x={790} y={1180} at={-10} size={78} rot={8} paper />
    <Atmosphere />
  </AbsoluteFill>
);
