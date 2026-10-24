import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmosphere, Desk} from '../../components/chrome';
import {Card, HL, Label, Photo, Stamp, Tape} from '../../components/paper';
import {loadFonts} from '../../lib/fonts';
import {C, F} from '../../theme';
import {PlaneShape} from './props';

loadFonts();

// Grid thumbnail: everything that matters sits inside the centre 1080x1350.
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Desk />
    <div style={{position: 'absolute', left: 80, top: 300}}><Label size={30}>Money Theory · History</Label></div>
    <div style={{position: 'absolute', left: 80, right: 80, top: 360, fontFamily: F.display, fontSize: 128, lineHeight: 0.95, color: C.ink, whiteSpace: 'nowrap'}}>
      1991: INDIA NE<br /><HL at={-10}>SONA</HL> GIRVI<br />KYUN RAKHA?
    </div>
    <Photo id="c-gold" src="gold_bars.jpg" x={110} y={760} w={860} h={520} rot={-2} at={0} enter="none" pos="50% 55%" torn={{top: true, bottom: true}} rough={14} zoom={0} />
    <Tape id="c-t" x={470} y={735} w={170} rot={-6} at={0} />
    <div style={{position: 'absolute', left: 660, top: 800, transform: 'rotate(-14deg) scale(1.4)', zIndex: 70}}><PlaneShape /></div>
    <Stamp id="c-girvi" text="Girvi" sub="46.91 TONNE" x={560} y={1180} at={-10} size={130} rot={-8} paper />
    <Card id="c-date" x={110} y={1290} w={340} h={110} rot={-3} at={0} enter="none" bg={C.yellow} sfx={null}>
      <div style={{fontFamily: F.display, fontSize: 70, textAlign: 'center', marginTop: 16}}>JULY 1991</div>
    </Card>
    <Atmosphere />
  </AbsoluteFill>
);
