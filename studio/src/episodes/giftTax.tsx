import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Checklist, Headline, Hold, Note, SignOff, Tile} from '../components/kit';
import {Card, Hand, HL, Label, Photo, Stamp, Tape} from '../components/paper';
import {EpisodeDef} from '../Episode';
import {clamp, stepped} from '../lib/motion';
import {Timeline, useCues} from '../lib/timeline';
import {C, F} from '../theme';
import timeline from '../data/gift-tax.json';

const Tag: React.FC<{id: string; x: number; y: number; at: number; out?: number; t: string; rot?: number; hi?: boolean}> = ({id, x, y, at, out, t, rot = 0, hi}) => (
  <Card id={id} x={x} y={y} w={300} h={130} rot={rot} at={at} out={out} bg={hi ? C.yellow : C.card}>
    <div style={{fontFamily: F.display, fontSize: 70, textAlign: 'center', marginTop: 22}}>{t}</div>
  </Card>
);

const Hook: React.FC = () => {
  const {at, word} = useCues();
  return (
    <AbsoluteFill>
      <Photo id="diyas" src="diyas.jpg" x={70} y={410} w={940} h={520} rot={-2} at={0} enter="up" torn={{top: true, bottom: true}} rough={14} caption="DIWALI" />
      <Tag id="g1" x={80} y={960} at={word('L01', 'mithai', -4)} t="MITHAI" rot={-3} />
      <Tag id="g2" x={390} y={990} at={word('L01', 'sona', -4)} t="SONA" rot={2} />
      <Tag id="g3" x={700} y={960} at={word('L01', 'cash', -4)} t="CASH" rot={-1} />
      <Tag id="g4" x={390} y={1120} at={word('L01', 'voucher', -4)} t="VOUCHER" rot={1} hi />
      <Stamp id="tax" text="Income tax?" x={540} y={620} at={word('L02', 'income', -2)} size={110} rot={-7} paper />
    </AbsoluteFill>
  );
};

const Family: React.FC = () => {
  const {at, word} = useCues();
  const l5 = at('L05');
  return (
    <AbsoluteFill>
      <Card id="rule1" x={110} y={430} w={860} h={300} rot={-1.5} at={0} enter="up" bg={C.yellow}>
        <div style={{padding: '30px 40px'}}>
          <Label size={22}>Rule 1 · rishtedaar</Label>
          <div style={{fontFamily: F.display, fontSize: 120, marginTop: 20}}>TAX-FREE ✓</div>
        </div>
      </Card>
      <Hand x={140} y={760} at={word('L03', 'kitna', -2)} out={at('L04')} size={56} rot={-2}>kitna bhi bada</Hand>
      {['MAA-BAAP', 'BHAI-BEHEN', 'PATI-PATNI', 'SAAS-SASUR'].map((t, i) => (
        <Card key={t} id={'rel' + i} x={i % 2 ? 560 : 100} y={770 + Math.floor(i / 2) * 150} w={420} h={130} rot={[-2, 1.5, 1, -1.5][i]} at={word('L04', t.split('-')[0].toLowerCase(), -4)} out={l5} bg={C.card}>
          <div style={{fontFamily: F.display, fontSize: 64, textAlign: 'center', marginTop: 28}}>{t}</div>
        </Card>
      ))}
      <Card id="shaadi" x={160} y={800} w={760} h={260} rot={1.5} at={l5} bg={C.card}>
        <div style={{padding: '28px 40px'}}>
          <Label size={22}>Apni shaadi pe</Label>
          <div style={{fontFamily: F.display, fontSize: 76, marginTop: 20, whiteSpace: 'nowrap'}}>KISI SE BHI · TAX-FREE</div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

// Running total of gifts from friends against the ₹50,000 line.
const Meter: React.FC<{at: number; to: number; overAt: number}> = ({at, to, overAt}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  const v = interpolate(f, [at, at + 16, overAt, overAt + 12], [0, 50000, 50000, to], clamp);
  const over = v > 50000;
  const W0 = 760, max = 70000;
  return (
    <>
      <div style={{position: 'absolute', left: 50, right: 50, top: 150, height: 90, border: `4px solid ${C.ink}`, background: C.paperLight}} />
      <div style={{position: 'absolute', left: 54, top: 154, height: 82, width: (W0 * v) / max, background: over ? C.red : C.yellow}} />
      <div style={{position: 'absolute', left: 50 + (W0 * 50000) / max, top: 120, height: 150, borderLeft: `5px dashed ${C.ink}`}} />
      <div style={{position: 'absolute', left: 50 + (W0 * 50000) / max - 90, top: 280, fontFamily: F.mono, fontWeight: 700, fontSize: 24}}>₹50,000</div>
      <div style={{position: 'absolute', left: 50, top: 330, fontFamily: F.display, fontSize: 90}}>₹{Math.round(v).toLocaleString('en-IN')}</div>
    </>
  );
};

const Friends: React.FC = () => {
  const {at, word} = useCues();
  const l7 = at('L07'), l8 = at('L08'), l9 = at('L09'), l10 = at('L10');
  return (
    <AbsoluteFill>
      <Headline words={['Dost', '&', 'jaan-pehchaan']} at={0} out={l7} size={130} y={540} />
      <Hold from={l7} to={l10}>
        <Card id="meter" x={80} y={430} w={920} h={480} rot={-1} at={l7} enter="up" bg={C.card}>
          <div style={{padding: '28px 40px'}}><Label size={22}>Dosto se gifts · saal bhar ka total</Label></div>
          <Meter at={word('L07', '50,000', -6)} to={60000} overAt={l9} />
        </Card>
      </Hold>
      <Card id="whole" x={110} y={960} w={860} h={230} rot={1.5} at={word('L08', 'poora', -4)} out={l10} bg={C.yellow}>
        <div style={{padding: '26px 40px'}}>
          <Label size={22}>₹50,000 se upar?</Label>
          <div style={{fontFamily: F.display, fontSize: 92, marginTop: 14}}>POORA AMOUNT TAXABLE</div>
        </div>
      </Card>
      <Hand x={600} y={880} at={word('L09', '60,000', 0)} out={l10} size={50} rot={-3} color={C.red}>poore ₹60,000 pe tax</Hand>
      <Photo id="gold" src="goldbangles.jpg" x={70} y={420} w={940} h={460} rot={-1.5} at={l10} enter="up" torn={{top: true, bottom: true}} rough={14} caption="SONA BHI GINTI MEIN" />
      <Tag id="shares" x={390} y={920} at={word('L10', 'shares', -4)} t="SHARES" rot={2} hi />
    </AbsoluteFill>
  );
};

const Office: React.FC = () => {
  const {at, word} = useCues();
  const l13 = at('L13');
  return (
    <AbsoluteFill>
      <Card id="voucher" x={140} y={440} w={800} h={380} rot={-2} at={0} enter="drop" bg={C.yellow}>
        <div style={{position: 'absolute', inset: 16, border: `4px dashed ${C.ink}`}} />
        <div style={{padding: '44px 56px'}}>
          <Label size={22}>Company · gift voucher</Label>
          <div style={{fontFamily: F.display, fontSize: 70, marginTop: 30}}>TAX-FREE TAK</div>
          <div style={{fontFamily: F.display, fontSize: 140, lineHeight: 1}}>
            <span style={{fontSize: 70, color: C.inkSoft, textDecoration: 'line-through', textDecorationColor: C.red, textDecorationThickness: 6, marginRight: 24}}>₹5,000</span>
            <HL at={word('L12', '15,000', 0)} color={C.paperLight}>₹15,000</HL>
          </div>
        </div>
      </Card>
      <Hand x={150} y={850} at={word('L12', 'naya', -2)} out={l13} size={54} rot={-2}>is saal se · saal bhar ka total</Hand>
      <Photo id="cash" src="note500.jpg" x={110} y={860} w={860} h={340} rot={1.5} at={l13} enter="up" torn={{top: true}} rough={14} caption="CASH / DIWALI BONUS" />
      <Stamp id="salary" text="= Salary" sub="PEHLE RUPAYE SE TAX" x={600} y={1030} at={word('L13', 'salary', -2)} size={96} rot={-6} paper />
    </AbsoluteFill>
  );
};

const Do: React.FC = () => {
  const {word} = useCues();
  return (
    <AbsoluteFill>
      <Checklist id="do" at={0} title="Bada gift mila?" gap={175} h={700}
        items={[
          {t: 'Likh kar rakho', s: 'kisne diya, kitna, kab', at: word('L14', 'likh', -6)},
          {t: 'Bank transfer', s: 'record apne aap', at: word('L15', 'bank', -4)},
          {t: 'ITR: other income', s: 'taxable gift dikhana mat bhoolo', at: word('L16', 'other', -6)},
        ]} />
      <Tape id="t" x={460} y={404} w={160} rot={-3} at={2} />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <SignOff shareLine="L17" logoLine="L18" shareWord="bhejo" friendNote="us dost ko jise is Diwali bada gift milne wala hai →"
    disclaimer={'EDUCATIONAL ONLY · NOT TAX ADVICE\nINCOME-TAX ACT 2025 · RULES 2026 (EMPLOYER GIFTS ₹15,000 FROM TAX YEAR 2026-27)\nCHECK WITH A CA FOR YOUR CASE'} />
);

export const giftTax: EpisodeDef = {
  id: 'diwali-gift-tax',
  topic: 'GIFT PE TAX?',
  timeline: timeline as Timeline,
  scenes: {hook: Hook, family: Family, friends: Friends, office: Office, do: Do, outro: Outro},
};
