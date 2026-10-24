import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Card, Label, Photo, Stamp, Tape} from '../../components/paper';
import {loadFonts} from '../../lib/fonts';
import {C, F} from '../../theme';

loadFonts();

// YouTube thumbnails (1280×720). Two variants for Test & Compare. Text stays big
// enough to read at 168×94 (the smallest size YouTube shows), and the bottom-right
// corner is left quiet because the duration badge covers it.

const Desk: React.FC = () => (
  <AbsoluteFill>
    <Img src={staticFile('img/proc/bg_wide.jpg')} style={{width: 1280, height: 720, objectFit: 'cover'}} />
  </AbsoluteFill>
);

const Grain: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 110% at 35% 30%, rgba(255,246,225,0.08) 0%, rgba(0,0,0,0) 55%, rgba(40,28,12,0.26) 100%)'}} />
    <Img src={staticFile('img/proc/grainw_0.png')} style={{position: 'absolute', inset: 0, width: 1280, height: 720, mixBlendMode: 'overlay', opacity: 0.14}} />
  </AbsoluteFill>
);

// A: then vs now — 1977 share certificate, 2026 phone, "IPO KA POORA SAFAR".
export const ThumbA: React.FC = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Desk />
    <Photo id="ta-cert" src="certificate1909.jpg" x={34} y={40} w={430} h={380} rot={-5} at={0} enter="none" torn={{bottom: true, right: true}} rough={12} zoom={0} sfx={null} />
    <Photo id="ta-phone" src="phone.jpg" x={850} y={30} w={420} h={330} rot={4} at={0} enter="none" torn={{left: true, bottom: true}} rough={12} zoom={0} pos="45% 50%" sfx={null}
      overlay={<div style={{position: 'absolute', left: 158, top: 150, transform: 'rotate(17deg)', fontFamily: F.display, fontSize: 42, color: C.ink}}>UPI</div>} />
    <Card id="ta-strip" x={210} y={300} w={860} h={150} rot={-2} at={0} enter="none" bg={C.yellow} torn={{left: true, right: true}} rough={12} sfx={null} z={20}>
      <div style={{fontFamily: F.display, fontSize: 132, lineHeight: '150px', textAlign: 'center', letterSpacing: 2}}>IPO KA</div>
    </Card>
    <div style={{position: 'absolute', left: 0, right: 0, top: 440, textAlign: 'center', fontFamily: F.display, fontSize: 168, lineHeight: 1, color: C.ink, zIndex: 25, textShadow: `0 4px 0 ${C.paperLight}`}}>POORA SAFAR</div>
    <Tape id="ta-tape" x={520} y={60} w={240} rot={-3} at={0} />
    <div style={{position: 'absolute', left: 470, top: 120, zIndex: 30, transform: 'rotate(-3deg)'}}>
      <Label size={34}>₹10 → ₹30,213 CR</Label>
    </div>
    <Stamp id="ta-t3" text="T+3" x={1150} y={300} at={-10} size={84} rot={10} paper />
    <div style={{position: 'absolute', left: 40, top: 640, zIndex: 30}}><Label size={22} dark>1977 → 2026</Label></div>
    <Grain />
  </AbsoluteFill>
);

// B: the lottery hook — "1 LOT ya 14? SAME CHANCE".
export const ThumbB: React.FC = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Desk />
    <Photo id="tb-drum" src="drum.jpg" x={640} y={40} w={600} h={460} rot={3} at={0} enter="none" torn={{left: true, top: true}} rough={14} zoom={0} pos="50% 75%" sfx={null} />
    <div style={{position: 'absolute', left: 50, top: 60, zIndex: 25, fontFamily: F.display, fontSize: 210, lineHeight: 0.92, color: C.ink}}>
      1 LOT<br />
      <span style={{fontSize: 150}}>ya 14?</span>
    </div>
    <Card id="tb-same" x={50} y={480} w={900} h={180} rot={-2} at={0} enter="none" bg={C.yellow} torn={{left: true, right: true}} rough={12} sfx={null} z={20}>
      <div style={{fontFamily: F.display, fontSize: 132, lineHeight: '180px', textAlign: 'center', whiteSpace: 'nowrap'}}>SAME CHANCE</div>
    </Card>
    <Stamp id="tb-ipo" text="IPO lottery" x={1010} y={90} at={-10} size={60} rot={6} paper />
    <Grain />
  </AbsoluteFill>
);
