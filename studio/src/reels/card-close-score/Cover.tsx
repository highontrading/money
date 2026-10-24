import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmosphere, Desk} from '../../components/chrome';
import {Card, HL, Label, Stamp, Tape} from '../../components/paper';
import {loadFonts} from '../../lib/fonts';
import {C, F} from '../../theme';
import {CreditCard, CutCard, Dial, grid, Meter} from './props';

loadFonts();

// Grid cover: everything that matters sits inside the centre 1080x1350 (y 285-1635).
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Desk />
    <div style={{position: 'absolute', left: 80, top: 330}}>
      <Label size={30}>Money Theory · Credit score</Label>
    </div>
    <div style={{position: 'absolute', left: 80, right: 80, top: 400, fontFamily: F.display, fontSize: 124, lineHeight: 0.98, color: C.ink}}>
      CARD BAND KIYA,<br />SCORE <HL at={-10}>GIRA?</HL>
    </div>
    <CreditCard id="cv-new" x={90} y={760} w={420} h={262} rot={-5} at={0} enter="none" sfx={null} />
    <CutCard id="cv-old" x={530} y={770} w={420} h={262} rot={5} at={0} split={-20} />
    <Tape id="cv-t" x={670} y={752} w={120} rot={8} at={0} />
    <Card id="cv-meter" x={90} y={1090} w={900} h={420} rot={-1} at={0} enter="none" bg={C.card} sfx={null}>
      <div style={{position: 'absolute', inset: 0, ...grid()}} />
      <div style={{position: 'relative', padding: '28px 40px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
          <div style={{width: 150, fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 2}}>PEHLE</div>
          <Meter w={480} h={80} fill0={0.3} fill1={0.3} fillAt={0} />
          <div style={{fontFamily: F.display, fontSize: 80}}>30%</div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 40}}>
          <div style={{width: 150, fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 2}}>CARD BAND</div>
          <Meter w={480} h={80} fill0={0.3} fill1={0.3} fillAt={0} cap0={0.5} cap1={0.5} red={-100} />
          <div style={{fontFamily: F.display, fontSize: 80, color: C.red}}>60%</div>
        </div>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: C.inkSoft, marginTop: 30}}>SAME ₹60,000 KHARCHA</div>
      </div>
    </Card>
    <div style={{position: 'absolute', left: 640, top: 1360, transform: 'rotate(-4deg)'}}>
      <Dial w={300} from={0.45} to={0.45} at={0} />
    </div>
    <Stamp id="cv-s" text="Utilization" sub="ASLI WAJAH" x={300} y={1580} at={-10} size={64} rot={-6} />
    <Atmosphere />
  </AbsoluteFill>
);
