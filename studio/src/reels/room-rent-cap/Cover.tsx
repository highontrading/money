import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmosphere, Desk} from '../../components/chrome';
import {Card, Hand, HL, Label, Stamp, Tape} from '../../components/paper';
import {loadFonts} from '../../lib/fonts';
import {C, F} from '../../theme';
import {hatch} from './props';

loadFonts();

// Grid cover: key content inside the centre 1080x1350 (y ~285-1635).
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Desk />
    <div style={{position: 'absolute', left: 90, top: 330}}>
      <Label size={28}>Money Theory · Health insurance</Label>
    </div>
    <div style={{position: 'absolute', left: 90, top: 400, width: 900, fontFamily: F.display, fontSize: 150, lineHeight: 0.95}}>
      ROOM RENT<br /><HL at={-10}>LIMIT</HL> KA JAAL
    </div>
    <Card id="cbill" x={110} y={730} w={860} h={650} rot={-1.5} at={0} enter="none" sfx={null}>
      <div style={{background: C.ink, color: C.paperLight, fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 4, padding: '18px 40px'}}>HOSPITAL BILL · CLAIM</div>
      <div style={{padding: '24px 44px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: F.display}}>
          <span style={{fontSize: 60}}>POLICY COVER</span>
          <span style={{fontSize: 84}}>₹5,00,000</span>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: F.display, marginTop: 14}}>
          <span style={{fontSize: 60}}>BILL</span>
          <span style={{fontSize: 84}}>₹3,00,000</span>
        </div>
        <div style={{position: 'relative', marginTop: 22, height: 40, border: `4px solid ${C.ink}`, background: C.paperLight, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: '75%', background: C.yellow}} />
          <div style={{position: 'absolute', left: '75%', right: 0, top: 0, bottom: 0, ...hatch()}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: F.display, marginTop: 24}}>
          <span style={{fontSize: 60}}>CLAIM MILA</span>
          <span style={{fontSize: 110, background: C.yellow, padding: '0 14px'}}>₹2,25,000</span>
        </div>
      </div>
    </Card>
    <Tape id="cbt" x={460} y={712} w={160} rot={-5} at={0} />
    <Stamp id="cjeb" text="₹75,000" sub="JEB SE ?" x={300} y={1470} at={-10} size={96} rot={-8} paper />
    <Hand x={560} y={1430} at={-20} size={56} rot={-4} w={460}>sirf ek line ki wajah se…</Hand>
    <Atmosphere />
  </AbsoluteFill>
);
