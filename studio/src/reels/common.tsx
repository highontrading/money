import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Card, Hand, HL, Photo, Sfx} from '../components/paper';
import {ease, pop, stepped} from '../lib/motion';
import {useCues} from '../lib/timeline';
import {C, F} from '../theme';

// Shared closing scene: "send this to ..." on a phone cut-out, then the
// MONEY THEORY sign-off with the disclaimer / source line.
export const SignOff: React.FC<{share: string; sign: string; who: string; note: React.ReactNode}> = ({share, sign, who, note}) => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const s = at(sign);
  const logo = word(sign, 'money', -4);
  const p = Math.min(1.05, pop(frame, logo, 10, 0.6));
  return (
    <>
      <Photo id="so-phone" src="phone.jpg" x={60} y={420} w={868} h={652} rot={-3} at={0} out={s} enter="up" torn={{right: true, top: true}} rough={14} zoom={0.02} />
      <Card id="so-share" x={560} y={460} w={420} h={170} rot={5} at={word(share, 'bhejo', -8)} out={s} enter="drop" bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 92, textAlign: 'center', marginTop: 28}}>SHARE ↗</div>
      </Card>
      <Hand x={110} y={1090} at={at(share, 4)} out={s} size={58} rot={-3} w={860}>{who}</Hand>
      {frame >= logo ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 520, textAlign: 'center', transform: `scale(${0.8 + 0.2 * p})`}}>
          <div style={{fontFamily: F.display, fontSize: 250, lineHeight: 0.9, color: C.ink}}>MONEY</div>
          <div style={{fontFamily: F.display, fontSize: 250, lineHeight: 0.9, color: C.ink}}><HL at={logo + 6}>THEORY</HL></div>
          <div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 84, marginTop: 30, opacity: ease(stepped(frame), logo + 24, logo + 34)}}>Paisa samjho.</div>
        </div>
      ) : (
        <div style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', opacity: frame >= s ? 1 : 0}}>
          <div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 110}}>Paisa samjho.</div>
        </div>
      )}
      <Sfx at={logo} name="stamp" volume={0.4} />
      {frame >= logo + 20 ? (
        <div style={{position: 'absolute', left: 90, right: 150, top: 1180, fontFamily: F.mono, fontWeight: 500, fontSize: 20, letterSpacing: 1, color: C.inkSoft, textAlign: 'center', lineHeight: 1.6, opacity: ease(frame, logo + 20, logo + 30)}}>
          EDUCATIONAL ONLY · NOT INVESTMENT ADVICE<br />{note}
        </div>
      ) : null}
    </>
  );
};
