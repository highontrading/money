import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Checklist, Headline, Hold, Note, SignOff, Tile} from '../components/kit';
import {Card, Count, Hand, HL, Label, Photo, Stamp, Tape} from '../components/paper';
import {EpisodeDef} from '../Episode';
import {Timeline, useCues} from '../lib/timeline';
import {C, F} from '../theme';
import timeline from '../data/jio-result.json';

const Hook: React.FC = () => {
  const {at, word} = useCues();
  const l2 = at('L02'), l3 = at('L03');
  return (
    <AbsoluteFill>
      <Photo id="sim" src="jiosim.jpg" x={70} y={410} w={940} h={520} rot={-2} at={0} out={l2} enter="up" torn={{top: true, bottom: true}} rough={14} pos="40% 50%" caption="GREY MARKET" />
      <Card id="gmp" x={200} y={900} w={680} h={280} rot={2} at={word('L01', '1,366', -6)} out={l3} bg={C.card}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, textAlign: 'center', marginTop: 24}}>GMP KA ANDAAZA</div>
        <div style={{fontFamily: F.display, fontSize: 160, textAlign: 'center', lineHeight: 1.1}}>~₹1,366</div>
      </Card>
      <Card id="board" x={110} y={430} w={860} h={420} rot={-1.5} at={l2} enter="drop" bg={C.ink}>
        <div style={{padding: '30px 40px', color: C.paperLight}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: C.yellow}}>NSE · BSE · 28 OCT · LISTING</div>
          <div style={{fontFamily: F.display, fontSize: 220, lineHeight: 1.2}}><Count from={1119} to={1358} at={word('L02', '1,358', -8)} dur={16} /></div>
        </div>
      </Card>
      <Stamp id="fark" text="Sirf ₹8 fark" x={540} y={1050} at={word('L03', '8', -2)} size={110} rot={-6} paper />
      <Hand x={130} y={1170} at={word('L03', 'sahi', -4)} size={50} rot={-2} color={C.red}>is baar GMP lagbhag sahi ✓</Hand>
    </AbsoluteFill>
  );
};

const Calc: React.FC = () => {
  const {at, word} = useCues();
  const l6 = at('L06'), l8 = at('L08');
  return (
    <AbsoluteFill>
      <Hold to={l6}>
        <Tile id="issue" y={440} at={0} value="₹1,119" label={'ISSUE PRICE'} rot={-1.5} size={120} h={200} />
        <Tile id="list" y={680} at={word('L04', 'listing', -4)} value={<HL at={word('L04', '1,358', 0)}>₹1,358</HL>} label={'LISTING\n28 OCT'} rot={1} size={120} h={200} />
        <Stamp id="21" text="+21%" sub="LISTING GAIN" x={540} y={1050} at={word('L05', '21%', -4)} size={140} rot={-6} paper />
      </Hold>
      <Hold from={l6} to={l8 + 8}>
        <Tile id="lot" y={440} at={l6} value="₹13,428" label={'1 LOT\n12 SHARES'} rot={-1.5} size={120} h={200} />
        <Tile id="gain" y={680} at={word('L07', '2,868', -6)} op="+" value={<HL at={word('L07', '2,868', 0)} color={C.paperLight}>₹2,868</HL>} label={'PER LOT\n239 × 12'} rot={1} size={120} h={200} hi />
        <Hand x={140} y={930} at={word('L07', 'fayda', -2)} size={58} rot={-2}>listing pe, har lot</Hand>
      </Hold>
      <Photo id="tower" src="tower.jpg" x={70} y={410} w={940} h={480} rot={-2} at={l8 - 6} z={20} enter="up" torn={{top: true, bottom: true}} rough={14} caption="JIO PLATFORMS" />
      <Card id="val" x={110} y={920} w={860} h={260} rot={1.5} at={word('L08', '12.5', -6)} bg={C.yellow}>
        <div style={{padding: '26px 40px'}}>
          <Label size={22}>Listing pe kul keemat</Label>
          <div style={{fontFamily: F.display, fontSize: 130, marginTop: 10}}>~₹12.5 LAKH CR</div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

const Gmp: React.FC = () => {
  const {at, word} = useCues();
  const l10 = at('L10'), l11 = at('L11');
  return (
    <AbsoluteFill>
      <Note id="gmpnote" x={110} y={440} w={860} h={330} at={0} out={l10} rot={-1.5} label="Yaad rakho" size={52}>
        GMP = <HL at={word('L09', 'official', -2)}>official daam nahi</HL>
      </Note>
      <Stamp id="har" text="Har baar nahi" x={540} y={900} at={word('L09', 'har', -2)} out={l10} size={100} rot={-6} />
      <Card id="auction" x={110} y={430} w={860} h={250} rot={-1} at={l10} enter="up" bg={C.yellow}>
        <div style={{padding: '30px 40px'}}>
          <Label size={22}>9:00–10:00 · call auction</Label>
          <div style={{fontFamily: F.display, fontSize: 104, marginTop: 14, whiteSpace: 'nowrap'}}>SPECIAL PRE-OPEN</div>
        </div>
      </Card>
      {[['KHARIDAAR', 'kharidaar', 80, -2], ['BECHNE WALE', 'bechne', 570, 2]].map(([t, k, x, r]) => (
        <Card key={k as string} id={'side' + k} x={x as number} y={740} w={430} h={280} rot={r as number} at={word('L11', k as string, -4)} bg={C.card}>
          <div style={{fontFamily: F.display, fontSize: 70, textAlign: 'center', marginTop: 60}}>{t}</div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, textAlign: 'center', marginTop: 10}}>ASLI ORDERS</div>
        </Card>
      ))}
      <Hold from={l11}>
        <Hand x={250} y={1060} at={word('L11', 'demand', -2)} size={64} rot={-2} color={C.red}>demand + supply = ₹1,358</Hand>
      </Hold>
    </AbsoluteFill>
  );
};

const Now: React.FC = () => {
  const {word} = useCues();
  return (
    <AbsoluteFill>
      <Checklist id="q" at={0} title="Allotment mila? Teen sawaal" gap={175} h={700}
        items={[
          {t: 'Listing gain ya lamba samay?', s: 'kis liye liya tha', at: word('L13', 'listing', -6)},
          {t: 'Jio kamaata kaise hai?', s: 'business samjho', at: word('L14', 'jio', -4)},
          {t: 'Portfolio ka chhota hissa?', s: 'ek stock pe sab nahi', at: word('L15', 'chhota', -6)},
        ]} />
    </AbsoluteFill>
  );
};

const Tax: React.FC = () => {
  const {at, word} = useCues();
  return (
    <AbsoluteFill>
      <Tile id="stcg" y={460} at={0} value="20%" label={'SHORT-TERM TAX\n12 MAHINE SE PEHLE'} rot={-1.5} size={150} h={240} hi />
      <Card id="gainonly" x={160} y={760} w={760} h={190} rot={1.5} at={at('L17')} bg={C.card}>
        <div style={{fontFamily: F.display, fontSize: 92, textAlign: 'center', marginTop: 40}}>SIRF GAIN PE</div>
      </Card>
      <Hand x={200} y={990} at={word('L17', 'poore', -2)} size={56} rot={-2} color={C.red}>poore paise pe nahi</Hand>
    </AbsoluteFill>
  );
};

const Lesson: React.FC = () => (
  <AbsoluteFill>
    <Headline words={['GMP', '=', 'andaaza.']} at={0} size={190} y={470} />
    <Card id="guar" x={160} y={900} w={760} h={190} rot={-1.5} at={30} bg={C.yellow}>
      <div style={{fontFamily: F.display, fontSize: 104, textAlign: 'center', marginTop: 36}}>GUARANTEE NAHI</div>
    </Card>
    <Tape id="t" x={460} y={884} w={160} rot={-3} at={32} />
  </AbsoluteFill>
);

const Outro: React.FC = () => (
  <SignOff shareLine="L19" logoLine="L20" shareWord="bhejo" friendNote="us dost ko jisne Jio ke liye apply kiya tha →"
    disclaimer={'EDUCATIONAL ONLY · NOT FINANCIAL ADVICE\nLISTING ₹1,358 ON NSE / BSE, 28 OCT 2026 · ISSUE PRICE ₹1,119\nGMP ~₹247 (26 OCT, UNOFFICIAL) · STCG 20% + CESS'} />
);

export const jioResult: EpisodeDef = {
  id: 'jio-listing-result',
  topic: 'JIO: LISTING RESULT',
  timeline: timeline as Timeline,
  scenes: {hook: Hook, math: Calc, gmp: Gmp, now: Now, tax: Tax, lesson: Lesson, outro: Outro},
};
