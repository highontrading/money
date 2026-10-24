import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmosphere, Desk} from '../../components/chrome';
import {Card, Hand, HL, Label, Stamp} from '../../components/paper';
import {loadFonts} from '../../lib/fonts';
import {C, F} from '../../theme';
import {Bubble, Center, PhoneBody, Stairs, Thumb} from './props';

loadFonts();

// Grid crop is the centre 1080x1350 (y 285-1635): everything that matters sits inside it.
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Desk />
    <div style={{position: 'absolute', left: 80, top: 330}}>
      <Label size={28}>Money Theory · Scam alert</Label>
    </div>
    <div style={{position: 'absolute', left: 80, top: 400, fontFamily: F.display, fontSize: 140, lineHeight: 0.95}}>
      LIKE KARO,<br /><HL at={-10}>₹150 KAMAO?</HL>
    </div>
    <Card id="c-phone" x={80} y={720} w={420} h={640} rot={-3} at={0} enter="none" bg="transparent" texture={null} sfx={null}>
      <PhoneBody w={420} h={640} app="WHATSAPP · UNKNOWN">
        <Bubble at={-30}>Ghar baithe kamao!</Bubble>
        <Bubble at={-30} tone="yellow">Har like = ₹150</Bubble>
        <Bubble at={-30} side="right" tone="yellow" who="UPI">₹450 credited ✓</Bubble>
      </PhoneBody>
    </Card>
    <div style={{position: 'absolute', left: 560, top: 740}}>
      <Thumb size={150} fill={C.yellow} />
    </div>
    <div style={{position: 'absolute', left: 530, top: 990, width: 900, height: 220, transform: 'scale(0.5)', transformOrigin: '0 0'}}>
      <Stairs x={0} y={0} active={3} at={-40} done={3} fallAt={-60} />
    </div>
    <Stamp id="c-gaye" text="₹5 lakh gaye" x={740} y={1290} at={-10} size={84} rot={-7} paper />
    <Hand x={560} y={1420} at={-20} size={56} rot={-3}>ek hafte mein...</Hand>
    <Card id="c-1930" x={80} y={1440} w={400} h={140} rot={2} at={0} enter="none" bg={C.ink} texture={null} sfx={null}>
      <Center><div style={{fontFamily: F.display, fontSize: 64, color: C.yellow}}>HELPLINE 1930</div></Center>
    </Card>
    <Atmosphere />
  </AbsoluteFill>
);
