import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmosphere, Desk} from '../../components/chrome';
import {Card, HL, Label, Photo, Stamp, Tape} from '../../components/paper';
import {loadFonts} from '../../lib/fonts';
import {C, F} from '../../theme';
import {Ticket} from './props';

loadFonts();

// Grid thumbnail: everything that matters sits in the centre 1080x1350.
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Desk />
    <div style={{position: 'absolute', left: 90, top: 330}}>
      <Label size={28}>Money Theory · Business</Label>
    </div>
    <div style={{position: 'absolute', left: 90, right: 90, top: 400, fontFamily: F.display, fontSize: 132, lineHeight: 0.98, color: C.ink}}>
      TICKET <HL at={-10}>₹280</HL>
      <br />POPCORN <HL at={-10}>₹400</HL>
    </div>
    <Photo id="cpc" src="popcorn.jpg" x={520} y={700} w={470} h={600} rot={4} at={0} enter="none" torn={{top: true, left: true}} rough={14} zoom={0} />
    <Card id="ctk" x={90} y={760} w={480} h={250} rot={-6} at={0} enter="none" bg={C.paperLight} sfx={null}>
      <Ticket w={480} h={250} price={<>₹280</>} />
    </Card>
    <Tape id="ctape" x={260} y={742} w={140} rot={-12} at={0} />
    <Stamp id="ckyun" text="Kyun?" x={330} y={1150} at={-10} size={130} rot={-8} paper />
    <Atmosphere />
  </AbsoluteFill>
);
