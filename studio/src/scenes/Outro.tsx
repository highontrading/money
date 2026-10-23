import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Card, Hand, HL, Photo, Sfx} from '../components/paper';
import {ease, pop, stepped} from '../lib/motion';
import {useCues} from '../lib/timeline';
import {C, F} from '../theme';

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l50 = at('L50');
  const logo = word('L50', 'money', -4);
  const p = Math.min(1.05, pop(frame, logo, 10, 0.6));
  return (
    <AbsoluteFill>
      {/* L49: send it to that friend */}
      <Photo id="phone2" src="phone.jpg" x={60} y={420} w={868} h={652} rot={-3} at={0} out={l50} enter="up" torn={{right: true, top: true}} rough={14} zoom={0.02} />
      <Card id="share" x={560} y={460} w={420} h={170} rot={5} at={word('L49', 'bhejo', -8)} out={l50} enter="drop" bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 92, textAlign: 'center', marginTop: 28}}>SHARE ↗</div>
      </Card>
      <Hand x={120} y={1090} at={word('L49', 'dost', 0)} out={l50} size={60} rot={-3}>us dost ko jo sirf GMP dekhta hai →</Hand>

      {/* L50: sign-off */}
      {frame >= logo ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 520, textAlign: 'center', transform: `scale(${0.8 + 0.2 * p})`}}>
          <div style={{fontFamily: F.display, fontSize: 250, lineHeight: 0.9, color: C.ink}}>MONEY</div>
          <div style={{fontFamily: F.display, fontSize: 250, lineHeight: 0.9, color: C.ink}}><HL at={logo + 6}>THEORY</HL></div>
          <div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 84, marginTop: 30, opacity: ease(stepped(frame), word('L50', 'paisa', 0) + 30, word('L50', 'paisa', 0) + 40)}}>Paisa samjho.</div>
        </div>
      ) : (
        <div style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', opacity: frame >= l50 ? 1 : 0}}>
          <div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 110}}>Paisa samjho.</div>
        </div>
      )}
      <Sfx at={logo} name="stamp" volume={0.4} />
      {frame >= logo + 20 ? (
        <div style={{position: 'absolute', left: 90, right: 150, top: 1200, fontFamily: F.mono, fontWeight: 500, fontSize: 20, letterSpacing: 1, color: C.inkSoft, textAlign: 'center', lineHeight: 1.6, opacity: ease(frame, logo + 20, logo + 30)}}>
          EDUCATIONAL ONLY · NOT INVESTMENT ADVICE<br />GMP: UNOFFICIAL, PUBLIC TRACKERS, 20-23 OCT 2026 · LISTINGS: NSE
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
