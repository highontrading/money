import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Big, Card, Hand, HL, Label, Stamp, Tape} from '../components/paper';
import {useCues} from '../lib/timeline';
import {C, F} from '../theme';

// A newspaper-style clipping: what the grey market said vs what listing did.
const Clip: React.FC<{id: string; at: number; out?: number; rot: number; name: string; when: string; issue: string; said: string; listed: string; listedAt: number; saidAt: number}> = ({id, at, out, rot, name, when, issue, said, listed, listedAt, saidAt}) => (
  <Card id={id} x={90} y={430} w={900} h={700} rot={rot} at={at} out={out} enter="right" bg={C.newsprint} texture="news" torn={{left: true, right: true, top: true, bottom: true}} rough={8}>
    <div style={{padding: '44px 56px'}}>
      <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: C.inkSoft, borderBottom: `3px double ${C.ink}`, paddingBottom: 10}}>MARKETS · {when}</div>
      <div style={{fontFamily: F.display, fontSize: 86, lineHeight: 1, marginTop: 20, textTransform: 'uppercase'}}>{name}</div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr auto', rowGap: 20, marginTop: 34, fontFamily: F.sans, fontWeight: 800, fontSize: 44}}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 2, alignSelf: 'center'}}>IPO PRICE</div>
        <div>{issue}</div>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 2, alignSelf: 'center'}}>GMP KEH RAHA THA</div>
        <div><HL at={saidAt}>{said}</HL></div>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 2, alignSelf: 'center'}}>LISTING HUI</div>
        <div><HL at={listedAt} color={C.paperLight}>{listed}</HL></div>
      </div>
      {/* faux body copy, like the rest of a newspaper page */}
      <div style={{marginTop: 34, columns: 3, columnGap: 26}}>
        {Array.from({length: 18}).map((_, i) => (
          <div key={i} style={{height: 9, background: 'rgba(30,30,30,0.22)', marginBottom: 9, width: `${70 + ((i * 37) % 30)}%`}} />
        ))}
      </div>
    </div>
  </Card>
);

export const RecordScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l37 = at('L37'), l39 = at('L39'), l41 = at('L41');
  return (
    <AbsoluteFill>
      {/* L36 */}
      {frame < l37 + 8 ? (
        <>
          <div style={{position: 'absolute', left: 90, top: 470}}>
            <Big words={['Teen', 'asli', 'case']} at={word('L36', 'teen', -4)} size={190} />
          </div>
          <div style={{position: 'absolute', left: 96, top: 860}}>
            <Label size={30}>GMP vs actual listing</Label>
          </div>
        </>
      ) : null}

      {/* L37-L38: Bajaj Housing Finance, Sep 2024 */}
      <Clip id="bajaj" at={l37 - 2} out={l39 - 2} rot={-1.5} name="Bajaj Housing Finance" when="SEP 2024" issue="₹70" said="≈ +₹75 (~2x)" listed="₹150 (+114%)"
        saidAt={word('L37', 'double', -2)} listedAt={word('L38', '150', -2)} />
      <Stamp id="sahi" text="GMP sahi" x={700} y={1060} at={word('L38', 'sahi', -2)} out={l39 - 2} size={88} rot={-8} color={C.ink} />

      {/* L39-L40: Hyundai Motor India, Oct 2024 */}
      <Clip id="hyundai" at={l39 - 2} out={l41 - 2} rot={1.5} name="Hyundai Motor India" when="OCT 2024" issue="₹1,960" said="+₹147" listed="₹1,934 (−1.3%)"
        saidAt={word('L39', '147', -2)} listedAt={word('L40', '1,934', -2)} />
      <Stamp id="galat" text="GMP galat" x={700} y={1060} at={word('L40', 'neeche', -2)} out={l41 - 2} size={88} rot={-8} />

      {/* L41-L42: LIC, May 2022 */}
      <Clip id="lic" at={l41 - 2} rot={-1} name="LIC" when="MAY 2022" issue="₹949" said="+₹85 → minus" listed="₹872 (−8%)"
        saidAt={word('L41', 'minus', -2)} listedAt={word('L42', '8%', -2)} />
      <Stamp id="palat" text="Palat gaya" x={700} y={1060} at={word('L42', 'neeche', 0)} size={88} rot={-8} />
      <Tape id="tr" x={470} y={414} w={150} rot={4} at={l41} />
      <Hand x={110} y={1150} at={word('L42', 'list', 0)} size={46} rot={-2}>listing price: NSE, pehla din</Hand>
    </AbsoluteFill>
  );
};
