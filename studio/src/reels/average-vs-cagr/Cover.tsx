import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmosphere, Desk} from '../../components/chrome';
import {Card, Circle, HL, Label, Tape} from '../../components/paper';
import {loadFonts} from '../../lib/fonts';
import {C, F} from '../../theme';
import {Ghost, NotePiece} from './parts';

loadFonts();

// Grid thumbnail: everything that matters sits in the centre 1080x1350.
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Desk />
    <div style={{position: 'absolute', left: 90, top: 320}}>
      <Label size={28}>Money Theory</Label>
    </div>
    <div style={{position: 'absolute', left: 90, right: 90, top: 395, fontFamily: F.display, fontSize: 150, lineHeight: 0.95, color: C.ink}}>
      <div><span style={{color: C.red}}>50%</span> GIRA,</div>
      <div><HL at={-20}>50% CHADHA</HL></div>
    </div>
    <NotePiece id="cv-left" x={120} y={760} w={840} h={380} f1={0.5} at={0} rot={-1.5} />
    <NotePiece id="cv-q" x={120} y={760} w={840} h={380} f0={0.5} f1={0.75} at={0} rot={-1.5} />
    <Tape id="cv-t" x={465} y={870} w={150} rot={86} at={0} />
    <Ghost x={750} y={765} w={210} h={370} at={-20} />
    <Circle id="cv-c" cx={855} cy={950} rx={150} ry={235} at={-30} />
    <Card id="cv-75" x={170} y={1180} w={560} h={250} rot={-4} at={0} enter="none" bg={C.yellow} torn={{top: true, right: true}} rough={14} sfx={null}>
      <div style={{fontFamily: F.display, fontSize: 200, lineHeight: 1, textAlign: 'center', marginTop: 24}}>₹75 ?</div>
    </Card>
    <div style={{position: 'absolute', left: 760, top: 1230, fontFamily: F.hand, fontWeight: 700, fontSize: 64, transform: 'rotate(-6deg)', lineHeight: 1}}>₹100 the!</div>
    <Atmosphere />
  </AbsoluteFill>
);
