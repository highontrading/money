import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmosphere, Desk} from '../../components/chrome';
import {Card, HL, Label, Stamp} from '../../components/paper';
import {loadFonts} from '../../lib/fonts';
import {C, F} from '../../theme';
import {Brain, mono, Tag} from './props';

loadFonts();

// Grid crop is the centre 1080x1350 (y 285-1635): everything that matters sits inside it.
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Desk />
    <div style={{position: 'absolute', left: 90, top: 330}}>
      <Label size={28}>Money Theory · Psychology</Label>
    </div>
    <div style={{position: 'absolute', left: 90, top: 400, width: 900, fontFamily: F.display, fontSize: 176, lineHeight: 0.95}}>
      <div><HL at={-10}>₹999</HL> KYUN?</div>
      <div style={{fontSize: 96, marginTop: 10}}>₹1,000 KYUN NAHI?</div>
    </div>
    <Card id="cvrail" x={70} y={738} w={940} h={20} at={0} enter="none" bg={C.kraft} texture="kraft" sfx={null} depth={0.4} />
    <Tag id="cv999" x={110} y={790} w={380} h={440} rot={-4} at={-30} bg={C.yellow}>
      <div style={{textAlign: 'center', marginTop: 120}}>
        <div style={mono(24)}>Sale price</div>
        <div style={{fontFamily: F.display, fontSize: 150, lineHeight: 1.05}}>₹999</div>
      </div>
    </Tag>
    <Tag id="cv1000" x={590} y={790} w={380} h={440} rot={3} at={-30}>
      <div style={{textAlign: 'center', marginTop: 120}}>
        <div style={mono(24)}>Price</div>
        <div style={{fontFamily: F.display, fontSize: 132, lineHeight: 1.12}}>₹1,000</div>
      </div>
    </Tag>
    <div style={{position: 'absolute', left: 120, top: 1270, transform: 'rotate(-5deg)', filter: `drop-shadow(5px 9px 8px ${C.shadow})`}}>
      <Brain w={300} />
    </div>
    <Card id="cvbub" x={440} y={1290} w={420} h={170} rot={3} at={0} enter="none" bg={C.card} sfx={null} torn={{left: true}}>
      <div style={{fontFamily: F.display, fontSize: 80, textAlign: 'center', lineHeight: 0.95, marginTop: 24}}>BAHUT<br />SASTA!</div>
    </Card>
    <Stamp id="cvs" text="3 chaalein" x={790} y={1530} at={-10} size={70} rot={-7} paper />
    <Atmosphere />
  </AbsoluteFill>
);
