import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Big, Card, Circle, Cross, Hand, HL, Label, Marker, Photo, Stamp, Tape} from '../components/paper';
import {pop, stepped} from '../lib/motion';
import {useCues} from '../lib/timeline';
import {C, F} from '../theme';

export const Hook: React.FC = () => {
  const {at, end, word} = useCues();
  const frame = useCurrentFrame();
  const l4 = at('L04');
  const l5 = at('L05');
  const l6 = at('L06');
  return (
    <AbsoluteFill>
      {/* L01: the exchange, and a stamp: not listed yet */}
      <Photo id="bse" src="bse.jpg" x={110} y={400} w={860} h={640} rot={-2.5} at={0} enter="up" out={at('L02', 4)} torn={{top: true, bottom: true}} rough={14} pos="50% 40%" caption="BSE · DALAL STREET, MUMBAI" />
      <Card id="jiotag" x={560} y={380} w={400} h={120} rot={4} at={word('L01', 'jio', -2)} out={at('L02', 4)} bg={C.yellow} texture="paper">
        <div style={{fontFamily: F.display, fontSize: 64, color: C.ink, textAlign: 'center', marginTop: 18, letterSpacing: 1}}>JIO IPO</div>
      </Card>
      <Tape id="t1" x={720} y={364} w={130} rot={-12} at={word('L01', 'jio')} out={at('L02', 4)} />
      <Stamp id="nl" text="Not listed" sub="LISTING ~ 28 OCT" x={560} y={1020} at={word('L01', 'nahi', -2)} out={at('L02', 4)} size={80} rot={-7} paper />

      {/* L02: a price exists anyway */}
      <Card id="quote" x={120} y={420} w={840} h={520} rot={-1.5} at={at('L02', 2)} out={l4} enter="right" bg={C.card}>
        <div style={{padding: '40px 50px'}}>
          <Label>Jio Platforms · 1 share</Label>
          <div style={{fontFamily: F.mono, fontSize: 30, color: C.inkSoft, marginTop: 26, letterSpacing: 2}}>KAHIN PE CHAL RAHA RATE</div>
          <div style={{fontFamily: F.display, fontSize: 230, lineHeight: 1, marginTop: 10, color: C.ink}}>
            <HL at={word('L02', '1,364')}>₹1,364</HL>
          </div>
        </div>
      </Card>
      <Hand x={620} y={850} at={word('L02', 'bik', 0)} out={l4} size={64} rot={-6}>pehle se!</Hand>

      {/* L03: not on any official venue */}
      {[['NSE', 'nse'], ['BSE', 'bse'], ['APP', 'app']].map(([t, k], i) => (
        <React.Fragment key={k}>
          <Card id={'chip' + k} x={130 + i * 285} y={985} w={250} h={150} rot={[-3, 2, -1][i]} at={word('L03', k === 'app' ? 'koi' : k, -4)} out={l4} bg={C.paperLight}>
            <div style={{fontFamily: F.display, fontSize: 88, textAlign: 'center', marginTop: 22, color: C.ink}}>{t}</div>
          </Card>
          <Cross id={'x' + k} x={150 + i * 285} y={1000} w={210} h={120} at={word('L03', k === 'app' ? 'app' : k, 6)} out={l4} />
        </React.Fragment>
      ))}

      {/* L04: the grey market */}
      <Photo id="crowd" src="crowd.jpg" x={70} y={390} w={940} h={760} rot={1.5} at={l4 - 2} enter="up" out={l5 + 2} exit="up" torn={{top: true, bottom: true, left: true}} rough={16} pos="50% 60%" zoom={0.08} />
      <Card id="greystrip" x={40} y={640} w={1000} h={230} rot={-4} at={word('L04', 'grey', -4)} out={l5 + 2} exit="up" enter="left" bg="#2a2826" texture="kraft" torn={{left: true, right: true, top: true, bottom: true}} rough={12}>
        <div style={{fontFamily: F.display, fontSize: 170, color: C.paperLight, textAlign: 'center', marginTop: 14, letterSpacing: 2}}>GREY MARKET</div>
      </Card>
      <Card id="unof" x={600} y={880} w={330} h={80} rot={5} at={word('L04', 'market', 6)} out={l5 + 2} exit="up" bg={C.yellow} sfx={null}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 4, textAlign: 'center', marginTop: 20}}>UNOFFICIAL</div>
      </Card>

      {/* L05: GMP */}
      <Card id="gmp" x={110} y={430} w={860} h={560} rot={-2} at={word('L05', 'gmp', -3)} out={l6 + 2} enter="drop" bg={C.yellow} torn={{top: true, right: true}} rough={14}>
        <div style={{fontFamily: F.display, fontSize: 420, lineHeight: 1, textAlign: 'center', marginTop: 50, color: C.ink, letterSpacing: 8}}>GMP</div>
      </Card>
      <Hand x={150} y={1010} at={word('L05', 'gmp', 10)} out={l6 + 2} size={70} rot={-3}>= Grey Market Premium</Hand>
      <Card id="q" x={140} y={410} w={240} h={110} rot={-8} at={word('L05', 'number', -2)} out={word('L05', 'gmp', -3)} bg={C.paperLight}>
        <div style={{fontFamily: F.display, fontSize: 74, textAlign: 'center', marginTop: 10}}>₹1,364 ?</div>
      </Card>

      {/* L06: three questions */}
      {[
        ['01', 'Kya hai?', 'kya'],
        ['02', 'Kaise banta hai?', 'kaise'],
        ['03', 'Kitna bharosa?', 'bharosa'],
      ].map(([n, t, k], i) => (
        <React.Fragment key={k}>
          <Card id={'qq' + k} x={120 + i * 40} y={420 + i * 235} w={820} h={200} rot={[-2, 1.5, -1][i]} at={word('L06', k, -6)} enter={i % 2 ? 'right' : 'left'} bg={i === 2 ? C.yellow : C.card}>
            <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 46px', gap: 36}}>
              <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 44, color: C.inkSoft}}>{n}</div>
              <div style={{fontFamily: F.display, fontSize: 88, color: C.ink, textTransform: 'uppercase', whiteSpace: 'nowrap'}}>{t}</div>
            </div>
          </Card>
          <Tape id={'tq' + k} x={140 + i * 40 + (i % 2 ? 640 : 0)} y={400 + i * 235} w={140} rot={i % 2 ? 10 : -10} at={word('L06', k, -2)} />
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};
