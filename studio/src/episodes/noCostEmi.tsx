import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Checklist, Headline, Hold, Note, SignOff, Tile} from '../components/kit';
import {Card, Cross, Hand, HL, Label, Photo, Stamp, Tape} from '../components/paper';
import {EpisodeDef} from '../Episode';
import {Timeline, useCues} from '../lib/timeline';
import {C, F} from '../theme';
import timeline from '../data/no-cost-emi.json';

// Phone photo is 1400x1051 with the screen centred at (656, 543), tilted 17.9°.
const PS = 0.62;
const EmiScreen: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 656 * PS - (262 * PS) / 2, top: 543 * PS - (436 * PS) / 2, width: 262 * PS, height: 436 * PS, transform: 'rotate(17.9deg)', background: C.paperLight, borderRadius: 10, fontFamily: F.mono, textAlign: 'center', paddingTop: 20, opacity: frame >= at ? 1 : 0}}>
      <div style={{fontSize: 11, fontWeight: 700, letterSpacing: 2}}>CHECKOUT</div>
      <div style={{fontFamily: F.display, fontSize: 30, marginTop: 14}}>₹60,000</div>
      <div style={{margin: '14px 14px 0', background: C.yellow, border: `2px solid ${C.ink}`, fontSize: 12, fontWeight: 700, padding: '6px 0'}}>NO-COST EMI</div>
      <div style={{fontSize: 12, marginTop: 8}}>₹10,000 × 6</div>
    </div>
  );
};

const Row: React.FC<{at: number; k: string; v: string; bold?: boolean; red?: boolean}> = ({at, k, v, bold, red}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: F.type, fontSize: bold ? 48 : 40, fontWeight: bold ? 700 : 400, color: red ? C.red : C.ink, padding: '12px 0', borderTop: bold ? `3px dashed ${C.ink}` : undefined}}>
      <span>{k}</span><span>{v}</span>
    </div>
  );
};

const Hook: React.FC = () => {
  const {at, word} = useCues();
  return (
    <AbsoluteFill>
      <Photo id="phone" src="phone.jpg" x={40} y={430} w={1400 * PS} h={1051 * PS} rot={-3} at={0} enter="up" torn={{right: true, bottom: true}} rough={14} zoom={0.02} overlay={<EmiScreen at={word('L01', 'no', -4)} />} />
      <Stamp id="free" text="Free?" x={760} y={560} at={at('L02')} size={120} rot={8} paper />
      <Hand x={140} y={1130} at={word('L02', 'poora', -2)} size={62} rot={-2} color={C.red}>poora nahi…</Hand>
    </AbsoluteFill>
  );
};

const How: React.FC = () => {
  const {at, word} = useCues();
  const l4 = at('L04'), l5 = at('L05');
  return (
    <AbsoluteFill>
      <Headline words={['EMI', '=', 'loan']} at={0} out={l4} size={220} y={520} label="Bank free mein loan nahi deta" />
      <Card id="shop" x={80} y={440} w={300} h={260} rot={-2} at={l4} bg={C.card}>
        <div style={{fontFamily: F.display, fontSize: 70, textAlign: 'center', marginTop: 70}}>DUKAAN</div>
      </Card>
      <Card id="you" x={390} y={760} w={300} h={260} rot={1.5} at={l4 + 6} bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 80, textAlign: 'center', marginTop: 70}}>AAP</div>
      </Card>
      <Card id="bank" x={700} y={440} w={300} h={260} rot={2} at={l4 + 12} bg={C.card}>
        <div style={{fontFamily: F.display, fontSize: 80, textAlign: 'center', marginTop: 70}}>BANK</div>
      </Card>
      <Hand x={250} y={720} at={word('L04', 'discount', -2)} size={44} rot={10}>discount ↘</Hand>
      <Hand x={690} y={720} at={word('L05', 'byaaj', -2)} size={44} rot={-10}>↙ byaaj</Hand>
      <Card id="eq" x={110} y={1060} w={860} h={150} rot={-1} at={l5} bg={C.card}>
        <div style={{fontFamily: F.display, fontSize: 70, textAlign: 'center', marginTop: 30}}>DISCOUNT ~₹2,600 = <HL at={word('L05', 'barabar', -4)}>BYAAJ ~₹2,600</HL></div>
      </Card>
    </AbsoluteFill>
  );
};

const Hidden: React.FC = () => {
  const {at, word} = useCues();
  const l9 = at('L09');
  return (
    <AbsoluteFill>
      <Card id="stmt" x={140} y={420} w={800} h={560} rot={-1.5} at={0} enter="up" bg={C.paperLight} torn={{bottom: true}} rough={12}>
        <div style={{padding: '30px 46px'}}>
          <div style={{textAlign: 'center', marginBottom: 12}}><Label size={22}>Card statement · example</Label></div>
          <Row at={0} k="EMI × 6" v="₹60,000" />
          <Row at={word('L06', 'gst', -4)} k="GST 18% on byaaj" v="+ ~₹470" red />
          <Row at={word('L08', 'processing', -4)} k="Processing fee" v="+ ~₹200 + GST" red />
          <Row at={word('L08', 'gst', 4)} k="Aapka total" v="> ₹60,000" bold />
        </div>
      </Card>
      <Card id="cash" x={110} y={1010} w={860} h={200} rot={1.5} at={l9} bg={C.yellow}>
        <div style={{padding: '24px 36px'}}>
          <Label size={22}>Teesra, sabse bada</Label>
          <div style={{fontFamily: F.display, fontSize: 84, marginTop: 10}}>CASH DISCOUNT CHHOOTA</div>
        </div>
      </Card>
      <Stamp id="miss" text="Chhoot gaya" x={760} y={980} at={word('L10', 'chhoot', -2)} size={70} rot={-8} />
    </AbsoluteFill>
  );
};

const Credit: React.FC = () => {
  const {at, word} = useCues();
  const l13 = at('L13');
  return (
    <AbsoluteFill>
      <Card id="report" x={110} y={430} w={860} h={560} rot={-1.5} at={0} enter="up" bg={C.card}>
        <div style={{padding: '30px 44px', fontFamily: F.type}}>
          <Label size={22}>Credit report</Label>
          <div style={{fontSize: 38, marginTop: 30}}>Consumer loan · Phone · ₹60,000</div>
          <div style={{fontSize: 38, marginTop: 16, opacity: 0.6}}>Consumer loan · TV</div>
          <div style={{fontSize: 38, marginTop: 16, opacity: 0.6}}>Consumer loan · Laptop</div>
          <div style={{fontSize: 38, marginTop: 16, color: C.red}}>{'Payment: '}{'✓ ✓ ✗'}</div>
        </div>
      </Card>
      <Stamp id="late" text="Late fee" x={720} y={760} at={word('L12', 'late', -2)} size={84} rot={-8} />
      <Card id="score" x={160} y={1020} w={760} h={180} rot={1.5} at={word('L12', 'credit', -4)} out={l13} bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 96, textAlign: 'center', marginTop: 36}}>CREDIT SCORE ↓</div>
      </Card>
      <Hand x={130} y={1060} at={l13} size={54} rot={-2} color={C.red}>kai EMI = bada loan mushkil</Hand>
    </AbsoluteFill>
  );
};

const Check: React.FC = () => {
  const {word} = useCues();
  return (
    <AbsoluteFill>
      <Checklist id="q" at={0} title="Tap karne se pehle" gap={175} h={700}
        items={[
          {t: 'Poora paisa = kitna discount?', s: 'dono ka final daam milao', at: word('L15', 'discount', -6)},
          {t: 'GST + fee milaakar total?', s: 'statement wala asli daam', at: word('L16', 'gst', -4)},
          {t: 'Zaroorat hai?', s: 'ya sirf EMI chhoti dikhi?', at: word('L17', 'zaroorat', -4)},
        ]} />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <SignOff shareLine="L18" logoLine="L19" shareWord="bhejo" friendNote="us dost ko jo sale mein sab EMI pe le raha hai →"
    disclaimer={'EDUCATIONAL ONLY · NOT FINANCIAL ADVICE\nEXAMPLE: ₹60,000 × 6 MONTHS AT ~16% BANK RATE · ROUNDED\nFEES AND OFFERS VARY BY BANK AND SELLER'} />
);

export const noCostEmi: EpisodeDef = {
  id: 'no-cost-emi',
  topic: 'NO-COST EMI',
  timeline: timeline as Timeline,
  scenes: {hook: Hook, how: How, hidden: Hidden, credit: Credit, check: Check, outro: Outro},
};
