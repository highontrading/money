import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Checklist, Hold, Note, SignOff, Tile} from '../components/kit';
import {Card, Cross, Hand, HL, Label, Photo, Stamp} from '../components/paper';
import {EpisodeDef} from '../Episode';
import {Timeline, useCues} from '../lib/timeline';
import {C, F} from '../theme';
import timeline from '../data/festive-loans.json';

const Hook: React.FC = () => {
  const {at, word} = useCues();
  return (
    <AbsoluteFill>
      <Photo id="show" src="showroom.jpg" x={70} y={410} w={940} h={560} rot={-2} at={0} enter="up" torn={{top: true, bottom: true}} rough={14} caption="DIWALI OFFER" />
      <Stamp id="zero" text="Zero fee!" x={330} y={560} at={word('L01', 'zero', -2)} size={110} rot={-8} paper />
      <Stamp id="spl" text="Special rate!" x={760} y={820} at={word('L01', 'special', -2)} size={76} rot={6} paper />
      <Card id="real" x={140} y={1000} w={800} h={200} rot={1.5} at={at('L02')} bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 84, textAlign: 'center', marginTop: 50, whiteSpace: 'nowrap'}}>ASLI KHARCHA = <HL at={word('L02', 'byaaj', -2)} color={C.paperLight}>BYAAJ</HL></div>
      </Card>
    </AbsoluteFill>
  );
};

const Offer: React.FC<{id: string; x: number; rot: number; at: number; name: string; rate: string; fee: string; interest?: React.ReactNode; interestAt: number; hi?: boolean}> = ({id, x, rot, at, name, rate, fee, interest, interestAt, hi}) => (
  <Card id={id} x={x} y={620} w={430} h={540} rot={rot} at={at} enter={x < 300 ? 'left' : 'right'} bg={hi ? C.yellow : C.card}>
    <div style={{padding: 28}}>
      <Label size={22}>{name}</Label>
      <div style={{fontFamily: F.display, fontSize: 110, marginTop: 20, lineHeight: 1}}>{rate}</div>
      <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, marginTop: 6}}>BYAAJ</div>
      <div style={{fontFamily: F.display, fontSize: 64, marginTop: 24}}>FEE {fee}</div>
      <Hold from={interestAt}>
        <div style={{borderTop: `3px dashed ${C.ink}`, marginTop: 24, paddingTop: 16}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20}}>KUL BYAAJ (5 SAAL)</div>
          <div style={{fontFamily: F.display, fontSize: 72}}>{interest}</div>
        </div>
      </Hold>
    </div>
  </Card>
);

const Calc: React.FC = () => {
  const {at, word} = useCues();
  return (
    <AbsoluteFill>
      <Card id="loan" x={110} y={430} w={860} h={160} rot={-1} at={0} bg={C.card}>
        <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 40px'}}>
          <div style={{fontFamily: F.display, fontSize: 96, flex: 1}}>₹8 LAKH</div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 2, textAlign: 'right'}}>CAR LOAN<br />5 SAAL · EXAMPLE</div>
        </div>
      </Card>
      <Offer id="a" x={80} rot={-2} at={at('L04')} name="Offer A" rate="9%" fee="₹0" interestAt={word('L06', '1.96', -4)} interest="~₹1.96 L" />
      <Offer id="b" x={570} rot={2} at={at('L05')} name="Offer B" rate="8.5%" fee="₹5,000" interestAt={word('L06', '1.85', -4)} interest="~₹1.85 L" hi />
      <Stamp id="cheap" text="B ~₹6,600 sasta" sub="FEE JOD KAR BHI" x={540} y={515} at={word('L07', '6,600', -6)} size={84} rot={-5} paper />
      <Hand x={140} y={1180} at={word('L05', '5,000', 6)} out={at('L06')} size={50} rot={-2} color={C.red}>zyada log A chunte hain…</Hand>
    </AbsoluteFill>
  );
};

const Traps: React.FC = () => {
  const {at, word} = useCues();
  const l9 = at('L09'), l10 = at('L10');
  return (
    <AbsoluteFill>
      <Card id="teaser" x={110} y={430} w={860} h={300} rot={-1.5} at={0} bg={C.card}>
        <div style={{padding: '28px 40px'}}>
          <Label size={22}>Jaal 2 · teaser rate</Label>
          <div style={{display: 'flex', alignItems: 'flex-end', gap: 24, marginTop: 24, height: 150}}>
            <div style={{width: 160, height: 70, background: C.yellow, border: `4px solid ${C.ink}`}} />
            <div style={{width: 160, height: 140, background: C.red, border: `4px solid ${C.ink}`}} />
            <div style={{width: 160, height: 140, background: C.red, border: `4px solid ${C.ink}`}} />
            <div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 44, marginLeft: 10}}>saal 1 → baad mein</div>
          </div>
        </div>
      </Card>
      <Tile id="repo" y={770} at={l9} out={l10} value={<HL at={word('L09', '5.50', 0)}>5.50%</HL>} label={'REPO · 7 OCT\nFLOATING ↑'} rot={1} size={120} h={200} />
      <Note id="ins" x={110} y={770} w={860} h={330} at={l10} rot={1} label="Jaal 3" size={46}>
        Loan + <HL at={word('L10', 'insurance', -2)}>insurance</HL> chipka diya. Premium bhi loan mein.
      </Note>
    </AbsoluteFill>
  );
};

const Check: React.FC = () => {
  const {word} = useCues();
  return (
    <AbsoluteFill>
      <Checklist id="q" at={0} title="Sign karne se pehle" gap={175} h={700}
        items={[
          {t: 'Kul kharcha kitna?', s: 'byaaj + saari fees', at: word('L12', 'kul', -4)},
          {t: 'Fixed ya floating?', s: 'pehle saal ke baad kya', at: word('L13', 'fixed', -4)},
          {t: 'Insurance zaroori?', s: 'ya optional', at: word('L14', 'insurance', -4)},
        ]} />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <SignOff shareLine="L15" logoLine="L16" shareWord="bhejo" friendNote="us dost ko jo is Diwali gaadi lene wala hai →"
    disclaimer={'EDUCATIONAL ONLY · NOT FINANCIAL ADVICE\nEXAMPLE: ₹8 LAKH, 60 MONTHS · INTEREST ROUNDED\nREPO 5.50% (RBI, 7 OCT 2026) · CHECK EACH LENDER'} />
);

export const festiveLoans: EpisodeDef = {
  id: 'festive-loan-offers',
  topic: 'DIWALI LOAN OFFER',
  timeline: timeline as Timeline,
  scenes: {hook: Hook, math: Calc, traps: Traps, check: Check, outro: Outro},
};
