import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Bars, Checklist, Headline, Hold, Note, SignOff, Tile} from '../components/kit';
import {Card, Hand, HL, Label, Photo, Stamp, Tape} from '../components/paper';
import {EpisodeDef} from '../Episode';
import {clamp, stepped} from '../lib/motion';
import {Timeline, useCues} from '../lib/timeline';
import {C, F} from '../theme';
import timeline from '../data/fii-dii.json';

const Hook: React.FC = () => {
  const {at, word} = useCues();
  const l2 = at('L02');
  return (
    <AbsoluteFill>
      <Photo id="nse" src="nse.jpg" x={70} y={410} w={940} h={520} rot={-2} at={0} enter="up" torn={{top: true, bottom: true}} rough={14} caption="NSE · MUMBAI" />
      <Tile id="out" y={960} at={word('L01', '3', -6)} out={l2} op="−" value={<HL at={word('L01', 'crore', 0)}>₹3 lakh cr+</HL>} label={'FII · IS SAAL\nRECORD'} rot={-1.5} size={104} h={200} />
      <Stamp id="rec" text="Record" x={760} y={520} at={word('L01', 'record', -2)} out={l2} size={96} rot={8} />
      <Card id="who" x={180} y={960} w={720} h={240} rot={2} at={l2} bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 120, textAlign: 'center', marginTop: 40}}>KAUN KHAREEDE?</div>
      </Card>
    </AbsoluteFill>
  );
};

const Who: React.FC = () => {
  const {at, word} = useCues();
  return (
    <AbsoluteFill>
      <Card id="fii" x={80} y={440} w={430} h={560} rot={-2} at={word('L03', 'fii', -4)} enter="left" bg={C.card}>
        <div style={{padding: 30}}>
          <div style={{fontFamily: F.display, fontSize: 150}}>FII</div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, lineHeight: 1.5}}>FOREIGN<br />INSTITUTIONAL<br />INVESTORS</div>
          <div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 46, marginTop: 30}}>bahar ke bade fund</div>
        </div>
      </Card>
      <Card id="dii" x={570} y={470} w={430} h={560} rot={2} at={at('L04')} enter="right" bg={C.yellow}>
        <div style={{padding: 30}}>
          <div style={{fontFamily: F.display, fontSize: 150}}>DII</div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, lineHeight: 1.5}}>DOMESTIC<br />INSTITUTIONAL<br />INVESTORS</div>
          <div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 40, marginTop: 24, lineHeight: 1.1}}>mutual fund, insurance, pension</div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

const Why: React.FC = () => {
  const {at, word} = useCues();
  return (
    <AbsoluteFill>
      <Headline words={['FII', 'kyun', 'bech', 'rahe?']} at={0} size={150} y={440} />
      {[['TEL ↑', 'tel'], ['RUPEE ↓', 'rupee'], ['US INTEREST ↑', 'america']].map(([t, k], i) => (
        <Card key={k} id={'w' + k} x={[80, 560, 200][i]} y={[680, 700, 900][i]} w={[440, 440, 680][i]} h={170} rot={[-2, 2, -1][i]} at={word('L05', k, -4)} bg={i === 1 ? C.yellow : C.card}>
          <div style={{fontFamily: F.display, fontSize: 84, textAlign: 'center', marginTop: 32}}>{t}</div>
        </Card>
      ))}
      <Hand x={130} y={1110} at={at('L06')} size={52} rot={-2} color={C.red}>rupee gira → unka dollar return ghata</Hand>
    </AbsoluteFill>
  );
};

const Flows: React.FC = () => {
  const {at, word} = useCues();
  const l9 = at('L09');
  return (
    <AbsoluteFill>
      <Bars id="oct" at={0} out={l9} title="1–15 October 2026 · ₹ crore" max={60000} note="SOURCE: EXCHANGE / NSDL DATA VIA MARKET REVIEWS · ROUNDED"
        bars={[
          {label: 'FII\nBECHA', value: 48000, text: '−48,000', at: word('L07', '48', -6), color: C.paperLight},
          {label: 'DII\nKHAREEDA', value: 52000, text: '+52,000', at: word('L08', '52', -6), hi: true},
        ]} />
      <Tile id="yr" y={460} at={l9} value={<HL at={word('L09', '6.8', 0)}>₹6.8 lakh cr+</HL>} label={'DII KHAREED\nIS SAAL AB TAK'} rot={-1.5} size={110} h={220} hi />
      <Stamp id="absorb" text="Selling ka jawab" x={540} y={860} at={word('L09', '6.8', 8)} size={90} rot={-6} paper />
    </AbsoluteFill>
  );
};

// One coin drops for every few frames: lakhs of small SIPs piling up.
const Pile: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const n = Math.floor(interpolate(stepped(frame), [at, at + 40], [0, 24], clamp));
  return (
    <>
      {Array.from({length: n}, (_, i) => (
        <div key={i} style={{position: 'absolute', left: 300 + (i % 6) * 80 + (Math.floor(i / 6) % 2) * 40, top: 1080 - Math.floor(i / 6) * 46, width: 70, height: 40, borderRadius: '50%', background: C.yellow, border: `4px solid ${C.ink}`, zIndex: 40}} />
      ))}
    </>
  );
};

const Sip: React.FC = () => {
  const {at, word} = useCues();
  const l11 = at('L11'), l12 = at('L12'), l13 = at('L13');
  return (
    <AbsoluteFill>
      <Headline words={['Paisa', 'kahan', 'se?']} at={0} out={l11} size={170} y={480} />
      <Stamp id="you" text="Aapse" x={540} y={950} at={word('L10', 'aapse', -2)} out={l11} size={140} rot={-6} />
      <Tile id="sip" y={440} at={l11} out={l13} value={<HL at={word('L11', '32,490', 0)}>₹32,490 cr</HL>} label={'SIP · SEPTEMBER\nRECORD'} rot={-1.5} size={110} h={210} />
      <Hand x={130} y={700} at={l12} out={l13} size={58} rot={-2}>bazaar gira, SIP chalti rahi</Hand>
      <Photo id="crowd" src="crowd.jpg" x={70} y={410} w={940} h={520} rot={1.5} at={l13} enter="up" torn={{top: true, bottom: true}} rough={14} caption="LAKHON CHHOTI SIP" />
      <Pile at={l13 + 6} />
    </AbsoluteFill>
  );
};

const Lesson: React.FC = () => {
  const {at, word} = useCues();
  const l15 = at('L15'), l16 = at('L16');
  return (
    <AbsoluteFill>
      <Note id="less" x={110} y={440} w={860} h={330} at={0} rot={-1.5} label="Isliye" size={50}>
        FII ke nikalne ka asar ab pehle se <HL at={word('L14', 'kam', -2)}>kam</HL>
      </Note>
      <Card id="but" x={160} y={820} w={760} h={180} rot={1.5} at={l15} out={l16} bg={C.card}>
        <div style={{fontFamily: F.display, fontSize: 84, textAlign: 'center', marginTop: 40}}>PAR GIRAWAT ≠ BAND</div>
      </Card>
      <Card id="power" x={110} y={820} w={860} h={300} rot={-1} at={l16} bg={C.yellow}>
        <div style={{padding: '30px 40px'}}>
          <Label size={22}>Bazaar mein</Label>
          <div style={{fontFamily: F.display, fontSize: 110, marginTop: 20}}>INDIAN PAISA ↑</div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

const Do: React.FC = () => {
  const {word} = useCues();
  return (
    <AbsoluteFill>
      <Checklist id="do" at={0} title="SIP chal rahi hai?" h={600} gap={190}
        items={[
          {t: 'Girte bazaar = zyada units', s: 'usi paise se', at: word('L17', 'units', -6)},
          {t: 'Goal aur time dekho', s: 'headline nahi', at: word('L18', 'goal', -4)},
        ]} />
      <Tape id="t" x={460} y={404} w={160} rot={-3} at={2} />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <SignOff shareLine="L19" logoLine="L20" shareWord="bhejo" friendNote="us dost ko jo kehta hai: FII bech rahe, sab bech do →"
    disclaimer={'EDUCATIONAL ONLY · NOT FINANCIAL ADVICE\nFPI ~₹3.08 LAKH CR OUT, DII ~₹6.83 LAKH CR IN (CY26 TO MID-OCT)\nSIP: AMFI, SEP 2026 · FIGURES ROUNDED'} />
);

export const fiiDii: EpisodeDef = {
  id: 'fii-vs-dii',
  topic: 'FII vs DII',
  timeline: timeline as Timeline,
  scenes: {hook: Hook, who: Who, why: Why, flows: Flows, sip: Sip, lesson: Lesson, do: Do, outro: Outro},
};
