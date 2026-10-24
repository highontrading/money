import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Bars, Checklist, Headline, Hold, Note, SignOff, Tile} from '../components/kit';
import {Card, Cross, Hand, HL, Label, Photo, Stamp, Tape} from '../components/paper';
import {EpisodeDef} from '../Episode';
import {pop, stepped} from '../lib/motion';
import {Timeline, useCues} from '../lib/timeline';
import {C, F} from '../theme';
import timeline from '../data/jio-listing.json';

// Phone photo is 1400x1051 with the screen centred at (656, 543), tilted 17.9°.
const PS = 0.62;
const StatusScreen: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 656 * PS - (262 * PS) / 2, top: 543 * PS - (436 * PS) / 2, width: 262 * PS, height: 436 * PS, transform: 'rotate(17.9deg)', background: C.paperLight, borderRadius: 10, fontFamily: F.mono, textAlign: 'center', paddingTop: 24, opacity: frame >= at ? 1 : 0}}>
      <div style={{fontSize: 12, fontWeight: 700, letterSpacing: 2}}>KFIN · IPO STATUS</div>
      <div style={{margin: '14px 12px', border: `2px solid ${C.ink}`, fontSize: 13, padding: '6px 0'}}>PAN: ABCDE••••F</div>
      <div style={{fontFamily: F.display, fontSize: 30, marginTop: 18}}>{frame >= at + 30 ? 'ALLOTTED?' : '...'}</div>
      <div style={{fontSize: 12, marginTop: 8}}>JIO PLATFORMS LTD</div>
    </div>
  );
};

const Hook: React.FC = () => {
  const {at, word} = useCues();
  const l2 = at('L02'), l3 = at('L03');
  return (
    <AbsoluteFill>
      <Bars id="subs" at={0} out={l2} title="Final subscription · 23 Oct 2026" max={75} note="SOURCE: PUBLIC TRACKERS · FINAL EXCHANGE DATA MAY VARY SLIGHTLY"
        bars={[
          {label: 'QIB', value: 68, text: '~68x', at: word('L01', '21', -6), hi: true},
          {label: 'NII', value: 14, text: '~14x', at: word('L01', '21', -2)},
          {label: 'RETAIL', value: 2.7, text: '~2.7x', at: word('L01', '21', 2)},
        ]} />
      <Stamp id="21x" text="~21x overall" x={560} y={1150} at={word('L01', 'subscribe', -2)} out={l2} size={80} rot={-6} paper />
      <Photo id="sim" src="jiosim.jpg" x={80} y={410} w={920} h={540} rot={-2} at={l2} out={l3} enter="up" torn={{top: true, bottom: true}} rough={14} pos="40% 50%" />
      <Card id="gmp" x={180} y={860} w={720} h={300} rot={2} at={word('L02', '1,364', -4)} out={l3} bg={C.yellow}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, textAlign: 'center', marginTop: 24}}>GREY MARKET KA ANDAZA · 23 OCT</div>
        <div style={{fontFamily: F.display, fontSize: 160, textAlign: 'center', lineHeight: 1.1}}>₹1,364 ?</div>
      </Card>
      <Hold from={l3}>
        <Headline words={['26', '→', '28', 'Oct']} at={l3} y={430} size={180} />
        {[['26', 'ALLOTMENT'], ['27', 'REFUND / CREDIT'], ['28', 'LISTING']].map(([d, t], i) => (
          <Card key={d} id={'d' + d} x={80 + i * 310} y={760} w={290} h={360} rot={[-2, 1, 2][i]} at={l3 + 8 + i * 6} bg={i === 2 ? C.yellow : C.card}>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, textAlign: 'center', marginTop: 26}}>OCT</div>
            <div style={{fontFamily: F.display, fontSize: 150, textAlign: 'center', lineHeight: 1}}>{d}</div>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20, textAlign: 'center', marginTop: 10, padding: '0 10px'}}>{t}</div>
          </Card>
        ))}
      </Hold>
    </AbsoluteFill>
  );
};

const Allot: React.FC = () => {
  const {at, word} = useCues();
  const l5 = at('L05'), l6 = at('L06');
  return (
    <AbsoluteFill>
      <Tile id="d26" y={430} at={0} value={<HL at={word('L04', 'allotment', -2)}>26 Oct</HL>} label={'BASIS OF\nALLOTMENT'} rot={-1.5} size={130} h={210} />
      <Photo id="phone" src="phone.jpg" x={40} y={680} w={1400 * PS} h={1051 * PS} rot={-3} at={l5 - 2} enter="up" torn={{right: true, bottom: true}} rough={14} zoom={0.02} overlay={<StatusScreen at={l5 + 10} />} />
      <Card id="where" x={620} y={700} w={380} h={300} rot={4} at={word('L05', 'kfin', -2)} bg={C.yellow}>
        <div style={{padding: 26, fontFamily: F.type, fontSize: 36, lineHeight: 1.5}}>
          <Label size={20}>Kahan check karein</Label>
          <div style={{marginTop: 10}}>KFin Tech<br />NSE · BSE</div>
        </div>
      </Card>
      <Stamp id="lottery" text="Lottery" sub="RETAIL ~2.7x BHARA" x={760} y={1110} at={word('L06', 'lottery', -2)} size={84} rot={-8} paper />
      <Hand x={110} y={1120} at={word('L06', 'sabko', -2)} size={50} rot={-3} color={C.red}>sabko nahi milega</Hand>
    </AbsoluteFill>
  );
};

const Money: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l9 = at('L09');
  return (
    <AbsoluteFill>
      <Card id="no" x={70} y={420} w={460} h={640} rot={-2} at={0} enter="left" bg={C.card}>
        <div style={{padding: 30}}>
          <Label size={22}>Nahi mila</Label>
          <div style={{fontFamily: F.display, fontSize: 84, lineHeight: 1, marginTop: 20}}>PAISA KATA HI NAHI</div>
          <div style={{fontFamily: F.type, fontSize: 36, marginTop: 30, lineHeight: 1.5}}>UPI <HL at={word('L07', 'block', -2)}>block</HL> tha<br />→ release ~27 Oct</div>
        </div>
      </Card>
      <Card id="yes" x={550} y={450} w={460} h={640} rot={2} at={l9 - 2} enter="right" bg={C.yellow}>
        <div style={{padding: 30}}>
          <Label size={22}>Mila</Label>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 24}}>
            {Array.from({length: 12}).map((_, i) => {
              const p = Math.min(1, Math.max(0, pop(frame, l9 + 6 + i * 2)));
              return <div key={i} style={{height: 56, background: C.paperLight, border: `3px solid ${C.ink}`, transform: `scale(${p})`}} />;
            })}
          </div>
          <div style={{fontFamily: F.display, fontSize: 64, marginTop: 20, lineHeight: 1}}>12 SHARES → DEMAT</div>
          <div style={{fontFamily: F.display, fontSize: 70, marginTop: 14}}>−₹13,428</div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20}}>12 × ₹1,119 (UPPER BAND)</div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

const Open: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l11 = at('L11'), l12 = at('L12'), l13 = at('L13'), l14 = at('L14');
  const slots: [string, string, number][] = [['9:00–9:45', 'SIRF ORDERS', l11], ['9:45–9:55', 'PRICE MATCHING', l12], ['10:00', 'NORMAL TRADING', word('L13', '10', -4)]];
  return (
    <AbsoluteFill>
      <Hold to={l12}>
        <Card id="sp" x={80} y={420} w={920} h={560} rot={-1} at={0} enter="up" bg={C.card}>
          <div style={{padding: 30}}>
            <Label size={22}>Listing day · special pre-open (NSE)</Label>
            {slots.map(([t, s, a], i) => (
              <div key={t} style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 26, opacity: frame >= a - 4 ? 1 : 0.25}}>
                <div style={{width: 330, fontFamily: F.display, fontSize: 78, background: i === 0 ? C.yellow : C.paperLight, border: `4px solid ${C.ink}`, textAlign: 'center'}}>{t}</div>
                <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 28}}>{s}</div>
              </div>
            ))}
          </div>
        </Card>
        <Stamp id="nt" text="No trade" x={760} y={1060} at={word('L11', 'trade', -2)} size={76} rot={-8} />
      </Hold>
      <Hold from={l12} to={l14}>
        <Bars id="auc" at={l12} title="Kis price pe kitne shares? (example)" max={30} note="EXAMPLE NUMBERS · EXCHANGE CHUNTA HAI: MAXIMUM VOLUME"
          bars={[
            {label: '₹1,300', value: 10, text: '10L', at: l12 + 8},
            {label: '₹1,330', value: 19, text: '19L', at: l12 + 12},
            {label: '₹1,350', value: 26, text: '26L', at: l12 + 16, hi: true},
            {label: '₹1,380', value: 15, text: '15L', at: l12 + 20},
          ]} />
        <Stamp id="lp" text="Listing price" sub="10 BAJE SE TRADING" x={560} y={1130} at={word('L13', 'listing', -2)} size={84} rot={-6} paper />
      </Hold>
      <Hold from={l14}>
        <Card id="g" x={80} y={440} w={430} h={420} rot={-3} at={l14} enter="left" bg={C.card}>
          <div style={{padding: 30}}><Label size={22}>Grey market</Label><div style={{fontFamily: F.display, fontSize: 110, marginTop: 30}}>GMP</div><div style={{fontFamily: F.sans, fontWeight: 700, fontSize: 32}}>sirf andaza</div></div>
        </Card>
        <Cross id="xg" x={110} y={480} w={370} h={340} at={word('L14', 'gmp', 4)} />
        <Card id="bs" x={560} y={480} w={440} h={420} rot={3} at={word('L14', 'buyers', -4)} enter="right" bg={C.yellow}>
          <div style={{padding: 30}}><Label size={22}>Exchange pe</Label><div style={{fontFamily: F.display, fontSize: 84, lineHeight: 1, marginTop: 30}}>BUYERS + SELLERS</div><div style={{fontFamily: F.sans, fontWeight: 700, fontSize: 32, marginTop: 14}}>asli price</div></div>
        </Card>
      </Hold>
    </AbsoluteFill>
  );
};

const Decide: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l16 = at('L16'), l20 = at('L20');
  return (
    <AbsoluteFill>
      <Headline words={['Becho', 'ya', 'rakho?']} at={0} out={l16} size={200} label="Advice nahi, sawaal" />
      <Hold from={l16} to={l20}>
        <Checklist id="q" at={l16} title="Khud se pucho"
          items={[
            {t: 'Maine kyun apply kiya tha?', s: 'listing gain ya lambe samay ke liye', at: at('L17', 0)},
            {t: '₹10.3 lakh cr pe khareedta?', s: 'bina IPO hype ke, aaj ke price pe', at: at('L18', 0)},
            {t: 'Portfolio ka kitna % isme?', s: 'ek stock mein zyada = zyada risk', at: at('L19', 0)},
          ]} gap={170} />
      </Hold>
      <Hold from={l20}>
        <Card id="half" x={110} y={460} w={860} h={560} rot={-1.5} at={l20} enter="up" bg={C.card}>
          <div style={{padding: 34}}>
            <Label size={22}>Beech ka raasta</Label>
            <div style={{display: 'flex', gap: 12, marginTop: 40, justifyContent: 'center'}}>
              {Array.from({length: 12}).map((_, i) => (
                <div key={i} style={{width: 52, height: 90, border: `3px solid ${C.ink}`, background: i < 6 ? (frame >= word('L20', 'becho', -2) ? C.red : C.paperLight) : frame >= word('L20', 'rakho', -2) ? C.yellow : C.paperLight, marginLeft: i === 6 ? 30 : 0}} />
              ))}
            </div>
            <div style={{display: 'flex', justifyContent: 'space-around', marginTop: 30, fontFamily: F.display, fontSize: 70}}>
              <span>6 BECHO</span><span>6 RAKHO</span>
            </div>
          </div>
        </Card>
      </Hold>
    </AbsoluteFill>
  );
};

const Tax: React.FC = () => {
  const {at, word} = useCues();
  const l22 = at('L22'), l23 = at('L23'), l24 = at('L24');
  return (
    <AbsoluteFill>
      <Headline words={['Tax', 'mat', 'bhoolna']} at={0} out={l22} size={190} />
      <Tile id="st" y={430} at={l22} value={<HL at={word('L22', '20%', -2)}>20%</HL>} label={'SHORT TERM\n12 MAHINE SE PEHLE'} rot={-1.5} size={130} h={210} />
      <Hold from={l23} to={l24}>
        <Note id="ex" x={110} y={680} w={860} h={420} at={l23} rot={1} label="Example (GMP jitna munafa)" size={44}>
          ₹245 × 12 shares = ₹2,940 munafa<br />× 20% = <HL at={word('L23', '588', -2)}>₹588 tax</HL> + cess
        </Note>
      </Hold>
      <Tile id="lt" y={680} at={l24} value="12.5%" label={'LONG TERM\n12 MAHINE+'} rot={1} size={130} h={210} />
      <Hand x={130} y={920} at={word('L24', 'lakh', -4)} size={56} rot={-2}>+ saal ka pehla ₹1.25 lakh gain tax-free</Hand>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <SignOff shareLine="L25" logoLine="L26" shareWord="bhejo" friendNote="us dost ko jiska allotment aane wala hai →"
    disclaimer={'EDUCATIONAL ONLY · NOT INVESTMENT ADVICE\nDATES TENTATIVE · SUBSCRIPTION: PUBLIC TRACKERS · TAX: FY 2026-27 RULES'} />
);

export const jioListing: EpisodeDef = {
  id: 'jio-ipo-listing-day',
  topic: 'JIO IPO',
  timeline: timeline as Timeline,
  scenes: {hook: Hook, allot: Allot, money: Money, open: Open, decide: Decide, tax: Tax, outro: Outro},
};
