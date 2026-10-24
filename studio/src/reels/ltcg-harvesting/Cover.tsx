import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmosphere, Desk} from '../../components/chrome';
import {HL, Label, Stamp, Tape} from '../../components/paper';
import {loadFonts} from '../../lib/fonts';
import {C, F} from '../../theme';
import {Coupon} from './parts';

loadFonts();

// Grid thumbnail: everything that matters sits in the centre 1080x1350.
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Desk />
    <div style={{position: 'absolute', left: 90, top: 320}}>
      <Label size={30}>Money Theory · Tax</Label>
    </div>
    <div style={{position: 'absolute', left: 90, right: 90, top: 390, fontFamily: F.display, fontSize: 124, lineHeight: 0.98}}>
      HAR SAAL KA<br /><HL at={-10}>TAX-FREE COUPON</HL>
    </div>
    <Coupon id="cv" x={110} y={700} w={860} h={400} rot={-3} at={0} enter="none" sfx={null} value="₹15,625" />
    <Tape id="cvt" x={460} y={684} w={160} rot={-5} at={0} />
    <Stamp id="cvs" text="Expire hota hai" x={560} y={1220} at={-10} size={74} rot={-7} />
    <div style={{position: 'absolute', left: 110, top: 1300, fontFamily: F.hand, fontWeight: 700, fontSize: 60, transform: 'rotate(-3deg)'}}>…aur log use phenk dete hain</div>
    <Atmosphere />
  </AbsoluteFill>
);
