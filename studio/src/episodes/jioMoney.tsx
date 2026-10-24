import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Checklist, Headline, Hold, Note, SignOff, Tile} from '../components/kit';
import {Card, Cross, Hand, HL, Label, Photo, Stamp, Tape} from '../components/paper';
import {EpisodeDef} from '../Episode';
import {clamp, stepped} from '../lib/motion';
import {Timeline, useCues} from '../lib/timeline';
import {C, F} from '../theme';
import timeline from '../data/jio-money.json';

const Hook: React.FC = () => {
  const {at, word} = useCues();
  const l2 = at('L02'), l3 = at('L03');
  return (
    <AbsoluteFill>
      <Photo id="sim" src="jiosim.jpg" x={80} y={400} w={920} h={600} rot={-2} at={0} out={l2} enter="up" torn={{top: true, bottom: true}} rough={14} pos="40% 50%" caption="JIO PLATFORMS IPO" />
      <Card id="size" x={170} y={880} w={740} h={280} rot={2} at={word('L01', '30,213', -3)} out={l2} bg={C.yellow}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, textAlign: 'center', marginTop: 24}}>ISSUE SIZE · 21–23 OCT 2026</div>
        <div style={{fontFamily: F.display, fontSize: 150, textAlign: 'center', lineHeight: 1.1}}>₹30,213 CR</div>
      </Card>
      {[['AMBANI?', 'ambani'], ['JIO?', 'jio'], ['KISI AUR?', 'aur']].map(([t, k], i) => (
        <Card key={k} id={'who' + k} x={100 + (i % 2) * 120} y={430 + i * 240} w={760} h={200} rot={[-3, 2, -1][i]} at={word('L02', k, -4)} out={l3} enter={i % 2 ? 'right' : 'left'} bg={i === 2 ? C.yellow : C.card}>
          <div style={{fontFamily: F.display, fontSize: 120, textAlign: 'center', marginTop: 30}}>{t}</div>
        </Card>
      ))}
      <Headline words={['₹1', 'ka', 'safar']} at={l3} y={480} size={220} label="Aapka IPO ka paisa, step by step" />
    </AbsoluteFill>
  );
};

const Issue: React.FC = () => {
  const {at, word} = useCues();
  const l5 = at('L05'), l6 = at('L06'), l7 = at('L07');
  return (
    <AbsoluteFill>
      <Headline words={['Do', 'tarah', 'ke', 'IPO']} at={0} out={l5} size={180} />
      <Card id="ofs" x={70} y={420} w={460} h={600} rot={-2} at={l5 - 2} enter="left" bg={C.card}>
        <div style={{padding: 30}}>
          <Label size={22}>01 · Offer for sale</Label>
          <div style={{fontFamily: F.display, fontSize: 80, lineHeight: 1, marginTop: 20}}>PURANE MALIK BECHTE</div>
          <div style={{fontFamily: F.type, fontSize: 36, marginTop: 30, lineHeight: 1.5}}>aap → ₹ →<br /><HL at={word('L05', 'jeb', -2)}>purane shareholder</HL></div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, marginTop: 30}}>COMPANY KO: ₹0</div>
        </div>
      </Card>
      <Card id="fresh" x={550} y={450} w={460} h={600} rot={2} at={l6 - 2} enter="right" bg={C.yellow}>
        <div style={{padding: 30}}>
          <Label size={22}>02 · Fresh issue</Label>
          <div style={{fontFamily: F.display, fontSize: 80, lineHeight: 1, marginTop: 20}}>NAYE SHARES BANTE</div>
          <div style={{fontFamily: F.type, fontSize: 36, marginTop: 30, lineHeight: 1.5}}>aap → ₹ →<br /><HL at={word('L06', 'company', -2)} color={C.paperLight}>company</HL></div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, marginTop: 30}}>COMPANY KO: POORA PAISA</div>
        </div>
      </Card>
      <Stamp id="fresh100" text="Jio: 100% fresh" sub="27 CRORE NAYE SHARES" x={540} y={1110} at={word('L07', 'fresh', -2)} size={84} rot={-6} paper />
      <Cross id="xofs" x={110} y={460} w={380} h={520} at={word('L07', 'koi', 0)} />
      <Tape id="tf" x={720} y={430} w={140} rot={6} at={l7} />
    </AbsoluteFill>
  );
};

// 100 squares = ₹100; the first 91 turn red ("loans") as the line is spoken.
const Hundred: React.FC<{at: number; from: number; to: number; restAt: number}> = ({at, from, to, restAt}) => {
  const frame = useCurrentFrame();
  const n = Math.round(interpolate(stepped(frame), [from, to], [0, 91], clamp));
  return (
    <Card id="hundred" x={140} y={420} w={800} h={640} rot={-1} at={at} enter="up" bg={C.card}>
      <div style={{padding: '26px 34px'}}>
        <Label size={22}>Har ₹100 ka hisaab</Label>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 8, marginTop: 22}}>
          {Array.from({length: 100}).map((_, i) => (
            <div key={i} style={{height: 44, border: `3px solid ${C.ink}`, background: i < n ? C.red : frame >= restAt && i >= 91 ? C.yellow : C.paperLight}} />
          ))}
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 22, fontFamily: F.display, fontSize: 52}}>
          <span style={{color: C.red}}>₹{n} LOANS</span>
          <span style={{opacity: frame >= restAt ? 1 : 0.2}}>₹9 BAAKI</span>
        </div>
      </div>
    </Card>
  );
};

const Split: React.FC = () => {
  const {at, word} = useCues();
  const l9 = at('L09'), l10 = at('L10'), l11 = at('L11'), l12 = at('L12');
  return (
    <AbsoluteFill>
      <Hold to={l11}>
        <Tile id="in" y={430} at={0} value="₹30,213 cr" label={'JIO KE PAAS\nAAYE'} rot={-1.5} size={100} />
        <Tile id="loan" y={620} at={l9} op="→" value={<HL at={word('L09', '27,500', -2)}>₹27,500 cr</HL>} label={'TAK · LOANS\nCHUKANE MEIN'} rot={1} size={100} />
        <Hold from={l10}>
          <Photo id="tower" src="tower.jpg" x={110} y={820} w={860} h={360} rot={-1.5} at={l10} enter="up" torn={{top: true, bottom: true}} rough={12} caption="RELIANCE JIO INFOCOMM · AAPKA JIO NETWORK" zoom={0.05} />
        </Hold>
      </Hold>
      <Hold from={l11}>
        <Hundred at={l11} from={l11 + 4} to={word('L11', '91', 6)} restAt={l12} />
        <Hand x={180} y={1090} at={l12} size={52} rot={-2} w={800}>₹9: general kaam + IPO kharche</Hand>
      </Hold>
      <Stamp id="docs" text="Source: RHP" sub="OBJECTS OF THE ISSUE" x={790} y={460} at={word('L09', 'document', -2)} out={l11} size={52} rot={8} paper />
    </AbsoluteFill>
  );
};

const Debt: React.FC = () => {
  const {at, word} = useCues();
  const l14 = at('L14'), l15 = at('L15'), l16 = at('L16'), l17 = at('L17');
  return (
    <AbsoluteFill>
      <Headline words={['Loan', 'kyun', 'chukana?']} at={0} out={l14} size={180} />
      <Hold from={l14} to={l16}>
        {[['LOAN ↓', 'loan'], ['INTEREST ↓', 'interest'], ['PROFIT ↑', 'profit']].map(([t, k], i) => (
          <Card key={k} id={'ch' + k} x={110 + i * 40} y={440 + i * 230} w={820} h={190} rot={[-2, 1.5, -1][i]} at={i === 0 ? l14 : i === 1 ? word('L14', 'interest', -4) : word('L15', k, -4)} enter={i % 2 ? 'right' : 'left'} bg={i === 2 ? C.yellow : C.card}>
            <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 40px', gap: 30}}>
              <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30, color: C.inkSoft}}>{`0${i + 1}`}</div>
              <div style={{fontFamily: F.display, fontSize: 104}}>{t}</div>
            </div>
          </Card>
        ))}
        <Hand x={140} y={1130} at={word('L14', 'profit', -2)} out={l15} size={56} rot={-3}>interest → profit se kat-ta hai</Hand>
      </Hold>
      <Hold from={l16} to={l17}>
        <Photo id="flats" src="flats.jpg" x={90} y={430} w={900} h={460} rot={-1.5} at={l16} enter="up" torn={{top: true, bottom: true}} rough={12} caption="JAISE BONUS SE HOME LOAN PREPAY" zoom={0.04} />
      </Hold>
      <Hold from={l17}>
        <Card id="nt" x={90} y={430} w={420} h={300} rot={-3} at={l17} enter="left" bg={C.card}>
          <div style={{fontFamily: F.display, fontSize: 84, textAlign: 'center', marginTop: 60, lineHeight: 1}}>NAYE TOWERS</div>
        </Card>
        <Card id="nb" x={560} y={460} w={420} h={300} rot={3} at={l17 + 6} enter="right" bg={C.card}>
          <div style={{fontFamily: F.display, fontSize: 84, textAlign: 'center', marginTop: 60, lineHeight: 1}}>NAYA BUSINESS</div>
        </Card>
        <Cross id="x1" x={120} y={460} w={360} h={240} at={word('L17', 'nahi', -2)} />
        <Cross id="x2" x={590} y={490} w={360} h={240} at={word('L17', 'nahi', 4)} />
        <Stamp id="bojh" text="Purana bojh ↓" sub="DEBT REDUCTION" x={540} y={930} at={word('L17', 'bojh', -4)} size={96} rot={-6} paper />
      </Hold>
    </AbsoluteFill>
  );
};

const Stake: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l19 = at('L19'), l20 = at('L20'), l21 = at('L21');
  const sliver = interpolate(stepped(frame), [word('L18', '3%', -6), word('L18', '3%', 6)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Card id="bar" x={80} y={420} w={920} h={380} rot={-1} at={0} enter="up" bg={C.card}>
        <div style={{padding: '28px 34px'}}><Label size={22}>Poori Jio Platforms = 100%</Label></div>
        <div style={{position: 'absolute', left: 34, right: 34, top: 120, height: 150, display: 'flex', border: `4px solid ${C.ink}`}}>
          <div style={{flex: 97, background: C.paperLight, display: 'flex', alignItems: 'center', paddingLeft: 24, fontFamily: F.display, fontSize: 60}}>PURANE MALIK</div>
          <div style={{flex: 3 + 3 * (1 - sliver), background: C.yellow, borderLeft: `4px solid ${C.ink}`, opacity: sliver}} />
        </div>
        <div style={{position: 'absolute', right: 30, top: 290, fontFamily: F.display, fontSize: 56, opacity: sliver}}>IPO ≈ 3% ↑</div>
      </Card>
      <Tile id="val" y={840} at={l19} value={<HL at={word('L19', 'lakh', -2)}>₹10.3 lakh cr</HL>} label={'VALUATION\nUPPER BAND PE'} rot={1} size={104} />
      <Hand x={130} y={1040} at={word('L19', 'lakh', 6)} out={l20} size={48} rot={-2}>30,213 ÷ 10,30,000 ≈ 2.9%</Hand>
      <Hold from={l20}>
        <Note id="dil" x={110} y={830} w={860} h={330} at={l20} rot={-1.5} label="Dilution" size={46} bg={C.yellow}>
          naye shares aaye → har purane malik ka % thoda kam
        </Note>
      </Hold>
      <Stamp id="maj" text="Reliance = majority" x={560} y={1110} at={word('L21', 'majority', -2)} size={70} rot={-6} paper />
    </AbsoluteFill>
  );
};

const You: React.FC = () => {
  const {word} = useCues();
  return (
    <AbsoluteFill>
      <Checklist id="you" at={0} title="Aapke liye matlab"
        items={[
          {t: 'Paisa Ambani ki jeb mein', s: 'koi promoter shares nahi bech raha', at: word('L23', 'ambani', -2), bad: true},
          {t: 'Aapne company ka hissa liya', s: '12 shares = Jio ka chhota sa hissa', at: word('L23', 'hissa', -2)},
          {t: 'Company ka loan halka', s: 'kam interest → aage zyada profit ho sakta', at: word('L24', 'halka', -2)},
          {t: '"Objects of the issue" padho', s: 'har IPO ke offer document mein', at: word('L25', 'objects', -2)},
        ]} />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <SignOff shareLine="L26" logoLine="L27" shareWord="bhejo" friendNote="us dost ko jisne Jio IPO bhara hai →"
    disclaimer={'EDUCATIONAL ONLY · NOT INVESTMENT ADVICE\nSOURCE: JIO PLATFORMS RHP · VALUATION AT UPPER BAND ₹1,119'} />
);

export const jioMoney: EpisodeDef = {
  id: 'jio-ipo-money',
  topic: 'JIO IPO',
  timeline: timeline as Timeline,
  scenes: {hook: Hook, issue: Issue, split: Split, debt: Debt, stake: Stake, you: You, outro: Outro},
};
