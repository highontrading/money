import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmosphere, Desk} from '../../components/chrome';
import {Card, HL, Label, Stamp, Tape} from '../../components/paper';
import {loadFonts} from '../../lib/fonts';
import {C, F} from '../../theme';
import {flat, grid, Stairs, stepUp} from './parts';

loadFonts();

const MAX = stepUp[stepUp.length - 1];

// Grid thumbnail: everything that matters sits in the centre 1080x1350.
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Desk />
    <div style={{position: 'absolute', left: 90, top: 320}}>
      <Label size={30}>Money Theory · SIP</Label>
    </div>
    <div style={{position: 'absolute', left: 90, right: 90, top: 390, fontFamily: F.display, fontSize: 132, lineHeight: 0.98}}>
      HAR SAAL SIP<br /><HL at={-10}>10% BADHAO</HL>
    </div>
    <Card id="cpanel" x={90} y={680} w={900} h={600} rot={-1} at={0} enter="none" bg={C.card} sfx={null}>
      <div style={{position: 'absolute', inset: 0, ...grid()}} />
      <Stairs id="cy" x={40} base={540} values={stepUp} unit={420 / MAX} p={1} bw={32} gap={9} color={(i) => (i === stepUp.length - 1 ? C.yellow : C.paperLight)} />
      <Stairs id="cf" x={40} base={540} values={flat} unit={420 / MAX} p={1} bw={32} gap={9} color={() => C.newsprint} />
      <div style={{position: 'absolute', left: 30, top: 552, width: 840, height: 6, background: C.ink}} />
      <div style={{position: 'absolute', left: 40, top: 40, width: 330, height: 150, background: C.yellow, border: `4px solid ${C.ink}`, transform: 'rotate(-2deg)', textAlign: 'center'}}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: 2, marginTop: 12}}>STEP-UP SIP</div>
        <div style={{fontFamily: F.display, fontSize: 92, lineHeight: 1}}>₹2 CR</div>
      </div>
      <div style={{position: 'absolute', left: 40, top: 230, width: 300, height: 120, background: C.paperLight, border: `4px solid ${C.ink}`, transform: 'rotate(1.5deg)', textAlign: 'center'}}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: 2, marginTop: 10}}>SAME SIP</div>
        <div style={{fontFamily: F.display, fontSize: 72, lineHeight: 1}}>₹1 CR</div>
      </div>
    </Card>
    <Tape id="ct" x={470} y={662} w={150} rot={-5} at={0} />
    <Stamp id="cdug" text="Dugna" x={760} y={1350} at={-10} size={88} rot={-8} color={C.ink} paper />
    <div style={{position: 'absolute', left: 100, top: 1330, fontFamily: F.hand, fontWeight: 700, fontSize: 62, transform: 'rotate(-3deg)'}}>salary badhi? SIP bhi.</div>
    <Atmosphere />
  </AbsoluteFill>
);
