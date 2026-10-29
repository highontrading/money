import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Bars, Headline, Hold, SignOff, Steps} from '../components/kit';
import {Card, Count, Hand, HL, Label, Photo, Stamp} from '../components/paper';
import {EpisodeDef} from '../Episode';
import {Timeline, useCues} from '../lib/timeline';
import {C, F} from '../theme';
import timeline from '../data/diwali-bonus.json';

const Hook: React.FC = () => {
  const {at, word} = useCues();
  const l3 = at('L03');
  return (
    <AbsoluteFill>
      <Photo id="diyas" src="diyas.jpg" x={70} y={410} w={940} h={440} rot={-2} at={0} enter="up" torn={{top: true, bottom: true}} rough={14} caption="DIWALI" />
      <Card id="sms" x={150} y={800} w={780} h={300} rot={1.5} at={word('L01', 'account', -6)} bg={C.paperLight}>
        <div style={{padding: '26px 40px', fontFamily: F.mono}}>
          <div style={{fontWeight: 700, fontSize: 22, letterSpacing: 3}}>BANK SMS · CREDITED</div>
          <div style={{fontFamily: F.display, fontSize: 150, lineHeight: 1.15}}>
            <Count from={50000} to={0} at={word('L02', 'baad', -2)} dur={24} />
          </div>
          <div style={{fontWeight: 700, fontSize: 22, letterSpacing: 2}}>{'DIWALI BONUS'}</div>
        </div>
      </Card>
      <Stamp id="gone" text="15 din baad?" x={700} y={520} at={word('L02', 'baad', -4)} out={l3} size={84} rot={8} paper />
      <Stamp id="salary" text="Bonus = salary" sub="TAX KAT KAR AATA HAI" x={540} y={560} at={word('L03', 'salary', -2)} size={92} rot={-6} paper />
    </AbsoluteFill>
  );
};

const Box: React.FC<{id: string; n: string; x: number; y: number; at: number; title: string; sub: string; hi?: boolean; rot: number}> = ({id, n, x, y, at, title, sub, hi, rot}) => (
  <Card id={id} x={x} y={y} w={430} h={340} rot={rot} at={at} enter="drop" bg={hi ? C.yellow : C.card} texture="kraft">
    <div style={{padding: 28}}>
      <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24}}>DABBA {n}</div>
      <div style={{fontFamily: F.display, fontSize: 70, lineHeight: 1, marginTop: 24}}>{title}</div>
      <div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 40, marginTop: 20, lineHeight: 1.05}}>{sub}</div>
    </div>
  </Card>
);

const Plan: React.FC = () => {
  const {at} = useCues();
  return (
    <AbsoluteFill>
      <Headline words={['Chaar', 'dabbe']} at={0} out={at('L05')} size={210} y={560} label="Isi kram mein" />
      <Box id="b1" n="1" x={80} y={420} at={at('L05')} title="EMERGENCY FUND" sub="6 mahine ka kharcha" rot={-2} />
      <Box id="b2" n="2" x={570} y={440} at={at('L06')} title="MEHENGA KARZ" sub="credit card: 36%+ saal" hi rot={2} />
      <Box id="b3" n="3" x={80} y={800} at={at('L08')} title="INVESTMENT" sub="SIP / index fund" rot={1} />
      <Box id="b4" n="4" x={570} y={820} at={at('L09')} title="KHUSHI" sub="bina guilt ke" rot={-1.5} />
      <Hold from={at('L07')} to={at('L08')}>
        <Stamp id="pakka" text="Karz chukao" sub="SABSE PAKKA RETURN" x={540} y={1010} at={at('L07') + 4} size={84} rot={-6} paper />
      </Hold>
    </AbsoluteFill>
  );
};

const Split: React.FC = () => {
  const {at, word} = useCues();
  return (
    <AbsoluteFill>
      <Bars id="split" at={0} title="₹50,000 ka ek example" max={22000} h={720} note="EXAMPLE SPLIT · AAPKA HISAAB ALAG HOGA"
        bars={[
          {label: 'EMERGENCY\nFUND', value: 20000, text: '₹20k', at: word('L10', '20,000', -4), hi: true},
          {label: 'KARZ', value: 15000, text: '₹15k', at: word('L10', '15,000', -4)},
          {label: 'INVEST', value: 10000, text: '₹10k', at: word('L10', '10,000', -4)},
          {label: 'MASTI', value: 5000, text: '₹5k', at: word('L10', 'masti', -8), color: C.red},
        ]} />
      <Hand x={140} y={1160} at={at('L11')} size={56} rot={-2} color={C.red}>amount alag, kram wahi</Hand>
    </AbsoluteFill>
  );
};

const Trick: React.FC = () => {
  const {word} = useCues();
  return (
    <AbsoluteFill>
      <Steps id="tr" y={460} h={150} gap={70} size={72} steps={[
        {t: 'BONUS AAYA', s: 'SALARY ACCOUNT', at: 0},
        {t: 'PEHLE TRANSFER', s: 'FUND · KARZ · SIP', at: word('L12', 'transfer', -6), hi: true},
        {t: 'PHIR KHARCH', s: 'JO BACHA', at: word('L12', 'kharch', -4)},
      ]} />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <SignOff shareLine="L13" logoLine="L14" shareWord="bhejo" friendNote="us dost ko jiska bonus aate hi ud jaata hai →"
    disclaimer={'EDUCATIONAL ONLY · NOT FINANCIAL ADVICE\nSPLIT IS AN EXAMPLE · CREDIT CARD RATES ~3–3.75% A MONTH\nBONUS IS TAXED AS SALARY'} />
);

export const diwaliBonus: EpisodeDef = {
  id: 'diwali-bonus',
  topic: 'DIWALI BONUS',
  timeline: timeline as Timeline,
  scenes: {hook: Hook, plan: Plan, split: Split, trick: Trick, outro: Outro},
};
