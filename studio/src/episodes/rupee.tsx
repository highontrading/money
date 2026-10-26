import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Checklist, Headline, Hold, Note, SignOff, Steps, Tile} from '../components/kit';
import {Card, Count, Hand, HL, Label, Photo, Stamp, Tape} from '../components/paper';
import {EpisodeDef} from '../Episode';
import {Timeline, useCues} from '../lib/timeline';
import {C, F} from '../theme';
import timeline from '../data/rupee.json';

const Rate: React.FC<{id: string; x: number; y: number; at: number; out?: number; year: string; value: string; hi?: boolean; rot?: number}> = ({id, x, y, at, out, year, value, hi, rot = 0}) => (
  <Card id={id} x={x} y={y} w={430} h={300} rot={rot} at={at} out={out} bg={hi ? C.yellow : C.card}>
    <div style={{padding: '26px 30px'}}>
      <Label size={22}>{year}</Label>
      <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, marginTop: 18}}>$1 =</div>
      <div style={{fontFamily: F.display, fontSize: 130, lineHeight: 1}}>{value}</div>
    </div>
  </Card>
);

const Hook: React.FC = () => {
  const {word} = useCues();
  return (
    <AbsoluteFill>
      <Photo id="dollar" src="dollar.jpg" x={70} y={410} w={940} h={420} rot={-2} at={0} enter="up" torn={{top: true, bottom: true}} rough={14} caption="US DOLLAR" />
      <Rate id="then" x={80} y={860} at={word('L01', '88', -6)} year="Oct 2025" value="₹88" rot={-2} />
      <Rate id="now" x={570} y={880} at={word('L01', '95', -6)} year="Aaj" value="₹95" hi rot={2} />
      <Stamp id="cheap" text="Rupee sasta" x={540} y={620} at={word('L02', 'rupee', -2)} size={110} rot={-7} paper />
      <Hand x={140} y={1200} at={word('L02', 'jeb', -4)} size={52} rot={-2} color={C.red}>bill → aapki jeb</Hand>
    </AbsoluteFill>
  );
};

const Why: React.FC = () => {
  const {at, word} = useCues();
  const l4 = at('L04'), l7 = at('L07');
  return (
    <AbsoluteFill>
      <Headline words={['Demand', '&', 'supply']} at={0} out={l4} size={180} y={520} label="Rupee ka daam bhi aise hi tay hota hai" />
      <Hold from={l4} to={l7}>
        <Steps id="why" y={430} h={130} gap={60} steps={[
          {t: 'TEL MEHENGA', s: 'ZYADA DOLLAR\nCHAHIYE', at: word('L04', 'tel', -2)},
          {t: 'FII NIKLE', s: '₹3 LAKH CR+\nIS SAAL', at: word('L05', 'videshi', -2)},
          {t: 'RUPEE BECHO, $ LO', s: 'DOLLAR KI\nDEMAND ↑', at: word('L06', 'bech', -4)},
          {t: 'RUPEE ↓', s: '', at: word('L06', 'gira', -4), hi: true},
        ]} size={74} />
      </Hold>
      <Tile id="low" y={480} at={l7} value={<HL at={word('L07', '97', 0)}>~₹97</HL>} label={'RECORD LOW\nMAY 2026'} rot={-1.5} size={140} h={240} />
      <Hand x={140} y={780} at={word('L07', 'neeche', -4)} size={58} rot={-2} color={C.red}>ab tak ka sabse neeche</Hand>
    </AbsoluteFill>
  );
};

const You: React.FC = () => {
  const {at, word} = useCues();
  const l10 = at('L10'), l11 = at('L11');
  return (
    <AbsoluteFill>
      <Photo id="air" src="airport.jpg" x={70} y={410} w={940} h={400} rot={-1.5} at={0} out={l10} enter="up" torn={{top: true, bottom: true}} rough={14} caption="DELHI T3 · DEPARTURE" />
      <Card id="fees" x={110} y={840} w={860} h={150} rot={1} at={word('L08', '40,000', -6)} out={l10} bg={C.card}>
        <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 36px'}}>
          <div style={{fontFamily: F.display, fontSize: 96, flex: 1}}>$40,000</div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, textAlign: 'right'}}>US FEES<br />HAR SAAL</div>
        </div>
      </Card>
      <Card id="feesr" x={110} y={1010} w={860} h={200} rot={-1.5} at={at('L09')} out={l10} bg={C.yellow}>
        <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 36px', gap: 20}}>
          <div style={{fontFamily: F.display, fontSize: 84, color: C.inkSoft, textDecoration: 'line-through', textDecorationColor: C.red, textDecorationThickness: 7}}>₹35 L</div>
          <div style={{fontFamily: F.display, fontSize: 84}}>→</div>
          <div style={{fontFamily: F.display, fontSize: 110}}><Count from={35} to={38} at={word('L09', '38', -4)} dur={10} fmt={(n) => `₹${Math.round(n)} L`} /></div>
        </div>
      </Card>
      {['TRIP', 'PHONE', 'LAPTOP'].map((t, i) => (
        <Card key={t} id={'imp' + i} x={80 + i * 310} y={[440, 470, 450][i]} w={290} h={260} rot={[-2, 1, 2][i]} at={l10 + i * 6} out={l11} bg={C.card}>
          <div style={{fontFamily: F.display, fontSize: 80, textAlign: 'center', marginTop: 50}}>{t}</div>
          <div style={{fontFamily: F.display, fontSize: 70, textAlign: 'center', color: C.red}}>↑</div>
        </Card>
      ))}
      <Stamp id="mehenga" text="Sab mehenga" x={540} y={880} at={word('L10', 'mehenga', -4)} out={l11} size={100} rot={-6} />
      <Photo id="tanker" src="tanker.jpg" x={70} y={410} w={940} h={460} rot={1.5} at={l11} enter="up" torn={{top: true, bottom: true}} rough={14} caption="TEL BHI DOLLAR MEIN" />
      <Card id="infl" x={160} y={920} w={760} h={190} rot={-1.5} at={word('L11', 'mehngai', -4)} bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 104, textAlign: 'center', marginTop: 30}}>MEHNGAI KA DABAAV</div>
      </Card>
    </AbsoluteFill>
  );
};

const Win: React.FC = () => {
  const {at, word} = useCues();
  const l13 = at('L13'), l14 = at('L14');
  return (
    <AbsoluteFill>
      <Headline words={['Kuch', 'log', 'khush']} at={0} out={l13} size={190} y={540} />
      <Card id="remit" x={110} y={430} w={860} h={430} rot={-1.5} at={l13} enter="up" bg={C.card}>
        <div style={{padding: '30px 40px'}}>
          <Label size={22}>Ghar paisa bhejna · $1,000</Label>
          <div style={{display: 'flex', alignItems: 'center', gap: 30, marginTop: 40}}>
            <div style={{fontFamily: F.display, fontSize: 100, color: C.inkSoft}}>₹88,000</div>
            <div style={{fontFamily: F.display, fontSize: 90}}>→</div>
            <div style={{fontFamily: F.display, fontSize: 110}}><HL at={word('L13', '95,000', -2)}>₹95,000</HL></div>
          </div>
          <div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 48, marginTop: 30}}>NRI parivaar ke liye achhi khabar</div>
        </div>
      </Card>
      <Card id="it" x={160} y={920} w={760} h={230} rot={1.5} at={l14} bg={C.yellow}>
        <div style={{padding: '28px 40px'}}>
          <Label size={22}>Dollar mein kamaai</Label>
          <div style={{fontFamily: F.display, fontSize: 110, marginTop: 10}}>IT COMPANIES ↑</div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

const Rbi: React.FC = () => {
  const {at, word} = useCues();
  return (
    <AbsoluteFill>
      <Photo id="rbi" src="rbi.jpg" x={70} y={410} w={940} h={480} rot={-2} at={0} enter="up" torn={{top: true, bottom: true}} rough={14} caption="RBI" />
      <Card id="sell" x={110} y={900} w={860} h={180} rot={1} at={word('L15', 'reserve', -4)} bg={C.card}>
        <div style={{fontFamily: F.display, fontSize: 84, textAlign: 'center', marginTop: 40}}>RESERVE SE $ BECHTA HAI</div>
      </Card>
      <Stamp id="slow" text="Girawat dheemi" sub="ROKTA NAHI" x={560} y={1170} at={at('L16')} size={88} rot={-6} paper />
    </AbsoluteFill>
  );
};

const Do: React.FC = () => {
  const {word} = useCues();
  return (
    <AbsoluteFill>
      <Checklist id="do" at={0} title="Aap kya karein" h={600} gap={190}
        items={[
          {t: 'Videsh ka bada kharcha?', s: 'dollar thoda-thoda lo, ek saath nahi', at: word('L17', 'thoda', -8)},
          {t: 'Thoda international hissa', s: 'rupee girne se kuch bachaav', at: word('L18', 'international', -4)},
        ]} />
      <Tape id="t" x={460} y={404} w={160} rot={-3} at={2} />
      <Hand x={140} y={1080} at={word('L18', 'bachaav', 0)} size={56} rot={-2}>advice nahi, bas samajh</Hand>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <SignOff shareLine="L19" logoLine="L20" shareWord="bhejo" friendNote="us dost ko jiska bachcha bahar padh raha hai →"
    disclaimer={'EDUCATIONAL ONLY · NOT FINANCIAL ADVICE\n$/₹ ~88.2 (OCT 2025) → ~94.8 (22 OCT 2026) · RECORD ~96.97 (MAY 2026)\nFPI OUTFLOWS CY26: BUSINESS STANDARD · ROUNDED'} />
);

export const rupee: EpisodeDef = {
  id: 'rupee-95',
  topic: 'RUPEE ₹95',
  timeline: timeline as Timeline,
  scenes: {hook: Hook, why: Why, you: You, win: Win, rbi: Rbi, do: Do, outro: Outro},
};
