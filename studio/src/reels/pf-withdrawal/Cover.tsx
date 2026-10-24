import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmosphere, Desk} from '../../components/chrome';
import {Card, Hand, HL, Label, Stamp} from '../../components/paper';
import {loadFonts} from '../../lib/fonts';
import {C, F} from '../../theme';
import {Sapling, Tree} from './props';

loadFonts();

// Grid thumbnail: everything important sits in the centre 1080x1350 (y 285-1635).
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Desk />
    <div style={{position: 'absolute', left: 80, top: 330}}>
      <Label size={28}>Money Theory · PF</Label>
    </div>
    <div style={{position: 'absolute', left: 80, top: 430, width: 920, fontFamily: F.display, fontSize: 140, lineHeight: 0.95}}>
      JOB BADLI,<br /><HL at={-10}>PF NIKAALA?</HL>
    </div>
    <Sapling id="csap" x={110} y={850} w={250} h={330} rot={-3} at={0} enter="none" sfx={null} />
    <Card id="c3" x={90} y={1190} w={300} h={120} rot={-3} at={0} enter="none" bg={C.card} sfx={null}>
      <div style={{fontFamily: F.display, fontSize: 72, textAlign: 'center', marginTop: 18}}>₹3 LAKH</div>
    </Card>
    <Hand x={380} y={1010} at={-20} size={60} rot={-6}>30 saal →</Hand>
    <Tree id="ctree" x={560} y={700} w={400} h={520} rot={2} at={0} enter="none" sfx={null} />
    <Card id="c32" x={590} y={1200} w={360} h={140} rot={3} at={0} enter="none" bg={C.yellow} sfx={null}>
      <div style={{fontFamily: F.display, fontSize: 96, textAlign: 'center', marginTop: 16}}>₹32 LAKH</div>
    </Card>
    <Stamp id="cs" text="₹29 lakh gaye" x={540} y={1450} at={-10} size={90} rot={-5} paper />
    <Atmosphere />
  </AbsoluteFill>
);
