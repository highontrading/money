import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Checklist, Headline, Hold, Note, SignOff, Steps, Tile} from '../components/kit';
import {Card, Cross, Hand, HL, Label, Marker, Photo, Sfx, Stamp, Tape} from '../components/paper';
import {EpisodeDef} from '../Episode';
import {clamp, stepped} from '../lib/motion';
import {Timeline, useCues} from '../lib/timeline';
import {C, F} from '../theme';
import timeline from '../data/silver.json';

const Hook: React.FC = () => {
  const {at, word} = useCues();
  const l2 = at('L02'), l3 = at('L03');
  return (
    <AbsoluteFill>
      <Photo id="tanker" src="tanker.jpg" x={70} y={410} w={940} h={600} rot={-2} at={0} out={l2} enter="up" torn={{top: true, bottom: true}} rough={14} caption="BRENT · 23 OCT 2026" />
      <Stamp id="jung" text="Jung ka darr" x={330} y={560} at={word('L01', 'jung', -2)} out={l2} size={78} rot={-7} />
      <Card id="117" x={240} y={930} w={600} h={250} rot={2} at={word('L01', '117', -4)} out={l2} bg={C.yellow}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 3, textAlign: 'center', marginTop: 20}}>TEL · PER BARREL</div>
        <div style={{fontFamily: F.display, fontSize: 160, textAlign: 'center', lineHeight: 1.05}}>$117</div>
      </Card>
      <Photo id="bangle" src="silverbangle.jpg" x={80} y={410} w={920} h={560} rot={1.5} at={l2} out={l3} enter="up" torn={{top: true, bottom: true}} rough={14} caption="CHANDI" />
      <Hand x={130} y={1000} at={l2 + 2} out={word('L02', 'par', 0)} size={70} rot={-3}>chandi ↑ hogi na?</Hand>
      <Stamp id="13" text="13% ↓" sub="3 HAFTE MEIN" x={700} y={1080} at={word('L02', '13%', -2)} out={l3} size={120} rot={-8} paper />
      <Tile id="price" y={440} at={l3} value={<HL at={word('L03', '2.02', 0)}>₹2.02 lakh</HL>} label={'DELHI · PER KG\n23 OCT 2026'} rot={-1.5} size={120} h={210} />
      <Tile id="drop" y={700} at={word('L03', '30', -4)} op="−" value="₹30,000" label={'30 SEPTEMBER\nSE SASTI'} rot={1} size={120} h={210} />
      <Hand x={140} y={960} at={word('L03', 'sasti', -2)} size={60} rot={-2} color={C.red}>jung ke beech, chandi neeche?</Hand>
    </AbsoluteFill>
  );
};

const Chain: React.FC = () => {
  const {at, word} = useCues();
  return (
    <AbsoluteFill>
      <Headline words={['Ek', 'chain']} at={0} out={at('L05')} size={210} y={760} label="Shuruaat tel se" />
      <Steps id="ch" y={420} steps={[
        {t: 'TEL ↑', s: '$117', at: word('L04', 'tel', -2)},
        {t: 'MEHNGAI KA DARR', s: 'DUNIYA BHAR', at: word('L05', 'mehngai', -4)},
        {t: 'US RATES ↑', s: 'LAMBE SAMAY\nTAK', at: word('L06', 'america', -2)},
        {t: 'BOND · FD ↑', s: 'ACHHA INTEREST', at: word('L07', 'bond', -2)},
        {t: 'CHANDI ↓', s: 'KAM AAKARSHAK', at: word('L07', 'aakarshak', -6), hi: true},
      ]} />
    </AbsoluteFill>
  );
};

const Yield: React.FC = () => {
  const {at, word} = useCues();
  const l9 = at('L09'), l10 = at('L10');
  return (
    <AbsoluteFill>
      <Checklist id="no" at={0} out={l9} title="Chandi aapko deti hai…" h={620}
        items={[
          {t: 'Interest', s: 'koi nahi', at: word('L08', 'interest', -2), bad: true},
          {t: 'Rent', s: 'nahi', at: word('L08', 'rent', -2), bad: true},
          {t: 'Dividend', s: 'nahi', at: word('L08', 'dividend', -2), bad: true},
        ]} />
      <Card id="fd" x={80} y={430} w={430} h={330} rot={-2} at={l9} out={l10} enter="left" bg={C.yellow}>
        <div style={{padding: 30}}><Label size={22}>FD · Bond</Label><div style={{fontFamily: F.display, fontSize: 72, marginTop: 30, whiteSpace: 'nowrap'}}>INTEREST ✓</div></div>
      </Card>
      <Card id="ag" x={570} y={460} w={430} h={330} rot={2} at={l9 + 6} out={l10} enter="right" bg={C.card}>
        <div style={{padding: 30}}><Label size={22}>Chandi</Label><div style={{fontFamily: F.display, fontSize: 72, marginTop: 30, whiteSpace: 'nowrap'}}>KUCH NAHI</div></div>
      </Card>
      <Note id="oc" x={110} y={850} w={860} h={300} at={word('L09', 'opportunity', -6)} out={l10} rot={-1} label="Isse kehte hain" size={64}>
        <HL at={word('L09', 'opportunity', 0)}>Opportunity cost</HL>
      </Note>
      <Card id="au" x={90} y={460} w={400} h={420} rot={-2} at={l10} enter="left" bg={C.card}>
        <div style={{padding: 30, textAlign: 'center'}}><Label size={22}>Sona</Label><div style={{fontFamily: F.display, fontSize: 150, marginTop: 40}}>↓</div></div>
      </Card>
      <Card id="ag2" x={540} y={440} w={450} h={520} rot={2} at={word('L10', 'chandi', -2)} enter="right" bg={C.yellow}>
        <div style={{padding: 30, textAlign: 'center'}}><Label size={22}>Chandi</Label><div style={{fontFamily: F.display, fontSize: 230, marginTop: 30, lineHeight: 1}}>↓↓</div></div>
      </Card>
      <Stamp id="kyun" text="Kyun?" x={540} y={1100} at={word('L10', 'kyun', -2)} size={110} rot={-6} />
    </AbsoluteFill>
  );
};

const Pie: React.FC<{at: number; split: number}> = ({at, split}) => {
  const frame = useCurrentFrame();
  const p = interpolate(stepped(frame), [at, at + 14], [0, split], clamp);
  return (
    <div style={{position: 'absolute', left: 60, top: 110, width: 380, height: 380, borderRadius: '50%', border: `5px solid ${C.ink}`, background: `conic-gradient(${C.yellow} 0 ${p}%, ${C.paperLight} ${p}% 100%)`}} />
  );
};

const Metal: React.FC = () => {
  const {at, word} = useCues();
  const l12 = at('L12'), l13 = at('L13'), l14 = at('L14');
  return (
    <AbsoluteFill>
      <Card id="pie" x={80} y={420} w={920} h={620} rot={-1} at={0} out={l12} enter="up" bg={C.card}>
        <div style={{padding: '30px 40px'}}><Label size={22}>Chandi kahan jaati hai · 2025</Label></div>
        <Pie at={word('L11', '58%', -4)} split={58} />
        <div style={{position: 'absolute', left: 490, top: 160, fontFamily: F.display, fontSize: 150, lineHeight: 1}}>~58%</div>
        <div style={{position: 'absolute', left: 494, top: 320, fontFamily: F.mono, fontWeight: 700, fontSize: 28, letterSpacing: 2, lineHeight: 1.4}}>INDUSTRY<br /><span style={{color: C.inkSoft}}>BAAKI: GEHNE, SIKKE,<br />BARS, BARTAN</span></div>
        <div style={{position: 'absolute', left: 40, bottom: 22, fontFamily: F.mono, fontSize: 20, color: C.inkSoft}}>SOURCE: SILVER INSTITUTE · WORLD SILVER SURVEY 2026</div>
      </Card>
      <Hand x={130} y={1080} at={word('L11', 'gehna', -2)} out={l12} size={58} rot={-2}>sirf gehna nahi…</Hand>
      <Photo id="solar" src="solar.jpg" x={70} y={410} w={940} h={560} rot={-1.5} at={l12} out={l13} enter="up" torn={{top: true, bottom: true}} rough={14} caption="SOLAR PANEL" />
      {['ELECTRONICS', 'GAADIYAN'].map((t, i) => (
        <Card key={t} id={'use' + i} x={90 + i * 440} y={980} w={420} h={120} rot={[-2, 2][i]} at={word('L12', i ? 'gaadiyan' : 'electronics', -4)} out={l13} bg={C.card}>
          <div style={{fontFamily: F.display, fontSize: 64, textAlign: 'center', marginTop: 18}}>{t}</div>
        </Card>
      ))}
      <Stamp id="17" text="Solar ≈ 17%" x={640} y={560} at={word('L12', '17%', -4)} out={l13} size={92} rot={-6} paper />
      <Photo id="ref" src="refinery.jpg" pos="50% 62%" x={70} y={410} w={940} h={540} rot={1.5} at={l13} out={l14} enter="up" torn={{top: true, bottom: true}} rough={14} caption="FACTORY KA KHARCHA ↑" />
      <Stamp id="slow" text="Economy slow?" x={540} y={1060} at={word('L13', 'economy', -2)} out={l14} size={90} rot={-5} />
      <Card id="hit1" x={80} y={440} w={430} h={360} rot={-2} at={l14} enter="left" bg={C.card}>
        <div style={{padding: 30}}><Label size={22}>Maar 1</Label><div style={{fontFamily: F.display, fontSize: 92, marginTop: 24, lineHeight: 1}}>RATES ↑</div><div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, marginTop: 16}}>INTEREST NAHI DETI</div></div>
      </Card>
      <Card id="hit2" x={570} y={470} w={430} h={360} rot={2} at={word('L14', 'industry', -4)} enter="right" bg={C.card}>
        <div style={{padding: 30}}><Label size={22}>Maar 2</Label><div style={{fontFamily: F.display, fontSize: 92, marginTop: 24, lineHeight: 1}}>DEMAND ↓</div><div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, marginTop: 16}}>INDUSTRY SLOW</div></div>
      </Card>
      <Card id="double" x={160} y={900} w={760} h={220} rot={-1.5} at={word('L14', 'double', -4)} bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 140, textAlign: 'center', marginTop: 24}}>DOUBLE MAAR</div>
      </Card>
    </AbsoluteFill>
  );
};

const Swing: React.FC = () => {
  const {at, word} = useCues();
  const l16 = at('L16'), l17 = at('L17');
  const gold = 'M140,880 C260,850 340,900 460,860 C580,820 660,870 780,830 L900,820';
  const silver = 'M140,900 C220,700 300,1080 400,760 C480,560 560,1120 660,780 C740,560 820,1100 900,980';
  return (
    <AbsoluteFill>
      <Photo id="pair" src="silverbangle.jpg" x={80} y={410} w={920} h={480} rot={-1.5} at={0} out={l16} enter="up" torn={{top: true, bottom: true}} rough={14} pos="50% 40%" />
      <Card id="behen" x={110} y={850} w={860} h={330} rot={1.5} at={word('L15', 'sone', -4)} out={l16} bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 104, textAlign: 'center', marginTop: 34, lineHeight: 1.05}}>SONE KI<br />TEZ-MIZAAJ BEHEN</div>
      </Card>
      <Hold from={l16} to={l17}>
        <Card id="chart" x={80} y={430} w={920} h={760} rot={-1} at={l16} enter="up" bg={C.card}>
          <div style={{padding: '30px 40px'}}><Label size={22}>Sketch · not to scale</Label></div>
        </Card>
        <Marker id="g" d={gold} at={l16 + 6} dur={14} color={C.inkSoft} width={9} />
        <Marker id="s" d={silver} at={word('L16', 'upar', 0)} dur={30} color={C.red} width={10} />
        <Hand x={720} y={760} at={l16 + 12} size={48} rot={-2} color={C.inkSoft}>sona</Hand>
        <Hand x={720} y={1060} at={word('L16', 'upar', 10)} size={52} rot={-2} color={C.red}>chandi</Hand>
        <Sfx at={word('L16', 'upar', 0)} name="marker" volume={0.3} />
      </Hold>
      <Tile id="mcx" y={450} at={l17} value={<HL at={word('L17', '2', 0)}>{'< ₹2 lakh'}</HL>} label={'MCX · PER KG\nDEC 2025 KE BAAD\nPEHLI BAAR'} rot={-1.5} size={120} h={220} />
      <Stamp id="first" text="Pehli baar" sub="DECEMBER 2025 KE BAAD" x={540} y={850} at={word('L17', 'december', -2)} size={100} rot={-6} paper />
    </AbsoluteFill>
  );
};

const You: React.FC = () => {
  const {at, word} = useCues();
  const l19 = at('L19');
  return (
    <AbsoluteFill>
      <Headline words={['Dhanteras', 'pe', 'chandi?']} at={0} out={l19} size={150} y={470} />
      <Stamp id="adv" text="Advice nahi" sub="BAS TEEN BAATEIN" x={540} y={960} at={word('L18', 'advice', -2)} out={l19} size={96} rot={-6} />
      <Checklist id="three" at={l19} title="Teen baatein"
        items={[
          {t: 'Gehna? Sasta daam = achhi khabar', s: 'pehnne ke liye khareed', at: word('L19', 'gehna', -4)},
          {t: 'Investment? Thoda-thoda', s: 'ek saath nahi, kai baar mein', at: word('L20', 'investment', -4)},
          {t: 'Portfolio ka chhota hissa', s: 'yeh tez-mizaaj hai', at: word('L21', 'chhota', -4)},
        ]} gap={170} h={700} />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <SignOff shareLine="L22" logoLine="L23" shareWord="bhejo" friendNote="us dost ko jo Dhanteras pe chandi lene wala hai →"
    disclaimer={'EDUCATIONAL ONLY · NOT FINANCIAL ADVICE\nPRICES: DELHI / MCX, 23 OCT 2026 · BRENT $116.72\nDEMAND: SILVER INSTITUTE 2026'} />
);

export const silver: EpisodeDef = {
  id: 'silver-crash',
  topic: 'CHANDI KYUN GIRI?',
  timeline: timeline as Timeline,
  scenes: {hook: Hook, chain: Chain, yield: Yield, metal: Metal, swing: Swing, you: You, outro: Outro},
};
