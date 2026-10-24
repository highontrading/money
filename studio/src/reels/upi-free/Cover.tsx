import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmosphere, Desk} from '../../components/chrome';
import {HL, Label, Stamp} from '../../components/paper';
import {loadFonts} from '../../lib/fonts';
import {C, F} from '../../theme';
import {House, Room, Soundbox} from './props';

loadFonts();

// Grid crop is the centre 1080x1350 (y 285-1635): everything that matters sits inside it.
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Desk />
    <div style={{position: 'absolute', left: 80, top: 320}}>
      <Label size={28}>Money Theory · UPI</Label>
    </div>
    <div style={{position: 'absolute', left: 80, top: 385, fontFamily: F.display, fontSize: 132, lineHeight: 0.95}}>
      UPI <HL at={-10}>FREE</HL> HAI.
      <div style={{fontSize: 96, marginTop: 10}}>TOH KAMAAI KAHAN SE?</div>
    </div>
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: 'translate(0px, 300px) scale(0.86)', transformOrigin: '540px 800px'}}>
      <House seed="c-house" at={-40} doorAt={-30} />
      <Room i={0} n="01" title="LOANS" at={-30} />
      <Room i={1} n="02" title="INSURANCE" at={-30} />
      <Room i={2} n="03" title="SOUNDBOX" at={-30}>
        <div style={{position: 'absolute', right: 18, top: 18}}><Soundbox size={92} /></div>
      </Room>
      <Room i={3} n="04" title="ADS" at={-30} />
    </div>
    <Stamp id="c-fee" text="Fee ₹0" x={840} y={770} at={-10} size={70} rot={-9} paper />
    <Atmosphere />
  </AbsoluteFill>
);
