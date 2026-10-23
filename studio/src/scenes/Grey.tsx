import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Card, Cross, Hand, Label, Photo, Stamp, Tape} from '../components/paper';
import {stepped} from '../lib/motion';
import {useCues} from '../lib/timeline';
import {C, F} from '../theme';

// The phone photo is 1400x1051; its screen is centred at (656, 543), ~268x444 px,
// tilted 17.9° clockwise. Card below is drawn at 0.62 scale.
const PS = 0.62;

const CallScreen: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const dots = '.'.repeat(1 + (Math.floor(stepped(frame - at) / 10) % 3));
  return (
    <div style={{position: 'absolute', left: 656 * PS - (262 * PS) / 2, top: 543 * PS - (436 * PS) / 2, width: 262 * PS, height: 436 * PS, transform: 'rotate(17.9deg)', background: '#111', borderRadius: 10, color: C.paperLight, fontFamily: F.mono, textAlign: 'center', paddingTop: 34, opacity: frame >= at ? 1 : 0}}>
      <div style={{fontSize: 12, letterSpacing: 2, opacity: 0.7}}>INCOMING CALL</div>
      <div style={{width: 56, height: 56, borderRadius: 28, background: C.yellow, margin: '18px auto 12px'}} />
      <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 22}}>Dealer bhai</div>
      <div style={{fontSize: 13, marginTop: 6, opacity: 0.8}}>+91 98•• •••••{dots}</div>
      <div style={{display: 'flex', justifyContent: 'space-around', marginTop: 46}}>
        <div style={{width: 34, height: 34, borderRadius: 17, background: C.red}} />
        <div style={{width: 34, height: 34, borderRadius: 17, background: '#3b9b5a'}} />
      </div>
    </div>
  );
};

export const Grey: React.FC = () => {
  const {at, word} = useCues();
  const l12 = at('L12');
  const l13 = at('L13');
  return (
    <AbsoluteFill>
      {/* L11: dealers, phone calls, cash */}
      <Photo id="phone" src="phone.jpg" x={40} y={400} w={1400 * PS} h={1051 * PS} rot={-3} at={0} out={l12} enter="up" torn={{right: true, bottom: true}} rough={14} zoom={0.02}
        overlay={<CallScreen at={word('L11', 'phone', -4)} />} />
      <Card id="dealer" x={600} y={420} w={380} h={110} rot={5} at={word('L11', 'dealers', -3)} out={l12} bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 72, textAlign: 'center', marginTop: 12}}>DEALERS</div>
      </Card>
      {[0, 1, 2].map((i) => (
        <Photo key={i} id={'cash' + i} src="note500.jpg" x={[520, 420, 600][i]} y={[880, 960, 1010][i]} w={420} h={176} rot={[-12, 6, -3][i]} at={word('L11', 'cash', -4 + i * 3)} out={l12} enter="right" zoom={0} />
      ))}

      {/* L12: no paperwork, only a verbal promise */}
      <Card id="receipt" x={150} y={410} w={520} h={720} rot={-3} at={l12 - 2} out={l13} enter="up" bg={C.paperLight} torn={{top: true, bottom: true}} rough={8}>
        <div style={{padding: '48px 44px', fontFamily: F.type, fontSize: 34, color: C.ink, lineHeight: 1.9}}>
          <div style={{fontSize: 40, textAlign: 'center', letterSpacing: 4}}>— SAUDA —</div>
          <div style={{borderTop: `2px dashed ${C.grey}`, margin: '18px 0'}} />
          <div>CONTRACT ......</div>
          <div>RECEIPT .......</div>
          <div>SIGNATURE .....</div>
          <div>COURT .........</div>
          <div style={{borderTop: `2px dashed ${C.grey}`, margin: '18px 0'}} />
          <div style={{fontSize: 28}}>SETTLEMENT: CASH</div>
        </div>
      </Card>
      <Cross id="xc" x={400} y={575} w={70} h={50} at={word('L12', 'contract', 2)} out={l13} />
      <Cross id="xr" x={400} y={640} w={70} h={50} at={word('L12', 'receipt', 2)} out={l13} />
      <Card id="bubble" x={600} y={720} w={380} h={200} rot={4} at={word('L12', 'zubaan', -4)} out={l13} bg={C.yellow}>
        <div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 70, textAlign: 'center', marginTop: 46}}>"Pakka, bhai!"</div>
      </Card>
      <Hand x={630} y={940} at={word('L12', 'zubaan', 4)} out={l13} size={58} rot={-4}>sirf zubaan</Hand>

      {/* L13: no regulator, no guarantee */}
      <Card id="doc" x={110} y={410} w={860} h={640} rot={-1.5} at={l13 - 2} enter="up" bg={C.card}>
        <div style={{padding: '50px 56px', fontFamily: F.type, fontSize: 34, lineHeight: 1.7, color: C.ink}}>
          <Label size={24}>Status check</Label>
          <div style={{marginTop: 30}}>Regulator (SEBI) ........ ✕</div>
          <div>Exchange guarantee ...... ✕</div>
          <div>Investor protection ..... ✕</div>
          <div>Official price .......... ✕</div>
        </div>
      </Card>
      <Tape id="td" x={460} y={392} w={160} rot={3} at={l13} />
      <Stamp id="nr" text="Not recognised" x={560} y={900} at={word('L13', 'recognise', 0)} size={84} rot={-8} />
      <Stamp id="ng" text="No guarantee" x={520} y={1120} at={word('L13', 'guarantee', 0)} size={70} rot={5} color={C.ink} paper />
    </AbsoluteFill>
  );
};
