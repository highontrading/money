import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Checklist, Headline, Hold, Note, SignOff, Steps, Tile} from '../components/kit';
import {Card, Hand, HL, Label, Marker, Photo, Stamp, Tape} from '../components/paper';
import {EpisodeDef} from '../Episode';
import {clamp, stepped} from '../lib/motion';
import {Timeline, useCues} from '../lib/timeline';
import {C, F} from '../theme';
import timeline from '../data/crude.json';

const Hook: React.FC = () => {
  const {at, word} = useCues();
  const l2 = at('L02'), l3 = at('L03');
  return (
    <AbsoluteFill>
      <Photo id="tanker" src="tanker.jpg" x={70} y={410} w={940} h={600} rot={-2} at={0} out={l2} enter="up" torn={{top: true, bottom: true}} rough={14} caption="OIL TANKER · KOCHI" />
      <Card id="117" x={240} y={930} w={600} h={250} rot={2} at={word('L01', '117', -6)} out={l2} bg={C.yellow}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 3, textAlign: 'center', marginTop: 20}}>BRENT · PER BARREL</div>
        <div style={{fontFamily: F.display, fontSize: 160, textAlign: 'center', lineHeight: 1.05}}>$117</div>
      </Card>
      <Photo id="flats" src="flats.jpg" x={70} y={410} w={940} h={520} rot={1.5} at={l2} out={l3} enter="up" torn={{top: true, bottom: true}} rough={14} caption="HOME LOAN" />
      <Hand x={130} y={960} at={l2 + 2} out={l3} size={64} rot={-3}>car nahi chalate? phir bhi…</Hand>
      <Card id="emiq" x={260} y={1060} w={560} h={170} rot={-3} at={word('L02', 'emi', -4)} out={l3} bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 120, textAlign: 'center', marginTop: 16}}>EMI ?</div>
      </Card>
      <Headline words={['Ek-ek', 'kadam']} at={l3} size={200} y={560} label="Tel se EMI tak" />
    </AbsoluteFill>
  );
};

// Two torn pieces of kraft "land" with a narrow sea lane between them.
const Strait: React.FC<{at: number; out?: number; arrow: number}> = ({at, out, arrow}) => (
  <>
    <Card id="sea" x={80} y={430} w={920} h={560} rot={-1} at={at} out={out} enter="up" bg="#C9D3D6">
      <div style={{padding: '28px 36px'}}><Label size={22}>Sketch · Strait of Hormuz</Label></div>
    </Card>
    <Card id="land1" x={80} y={520} w={560} h={240} rot={-4} at={at + 4} out={out} enter="left" bg={C.kraft} texture="kraft" torn={{bottom: true, right: true}} rough={22}>
      <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 3, padding: '120px 0 0 60px', color: C.ink}}>IRAN</div>
    </Card>
    <Card id="land2" x={520} y={800} w={480} h={190} rot={3} at={at + 8} out={out} enter="right" bg={C.kraft} texture="kraft" torn={{top: true, left: true}} rough={22}>
      <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 3, padding: '80px 0 0 150px', color: C.ink}}>OMAN</div>
    </Card>
    <Marker id="lane" d="M110,890 C320,860 470,795 585,782 C700,770 850,745 990,725" at={arrow} out={out} dur={14} color={C.red} width={10} />
  </>
);

const Why: React.FC = () => {
  const {at, word} = useCues();
  const l5 = at('L05'), l6 = at('L06');
  return (
    <AbsoluteFill>
      <Headline words={['Daam', 'badha', 'kyun?']} at={0} out={l5} size={170} y={450} />
      <Stamp id="war" text="Jung · Iran" sub="MIDDLE EAST" x={540} y={900} at={word('L04', 'iran', -4)} out={l5} size={110} rot={-6} />
      <Strait at={l5} out={l6} arrow={word('L05', 'raah', -2)} />
      <Card id="20" x={140} y={1020} w={800} h={200} rot={1.5} at={word('L05', '20%', -4)} out={l6} bg={C.yellow}>
        <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 40px'}}>
          <div style={{fontFamily: F.display, fontSize: 130, flex: 1}}>~20%</div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 2, textAlign: 'right'}}>DUNIYA KA TEL<br />{'HORMUZ SE'}</div>
        </div>
      </Card>
      <Stamp id="risk" text="Khatra" x={540} y={560} at={l6} size={110} rot={-8} />
      <Tile id="79" y={760} at={word('L06', '79%', -4)} value={<HL at={word('L06', '79%', 0)}>+79%</HL>} label={'BRENT\nEK SAAL MEIN'} rot={-1} size={140} h={230} />
    </AbsoluteFill>
  );
};

const Share: React.FC<{at: number; value: number}> = ({at, value}) => {
  const frame = useCurrentFrame();
  const p = interpolate(stepped(frame), [at, at + 14], [0, value], clamp);
  return <div style={{position: 'absolute', left: 60, top: 100, width: 360, height: 360, borderRadius: '50%', border: `5px solid ${C.ink}`, background: `conic-gradient(${C.yellow} 0 ${p}%, ${C.paperLight} ${p}% 100%)`}} />;
};

const India: React.FC = () => {
  const {at, word} = useCues();
  const l8 = at('L08'), l9 = at('L09');
  return (
    <AbsoluteFill>
      <Card id="imp" x={80} y={420} w={920} h={560} rot={-1} at={0} enter="up" bg={C.card}>
        <div style={{padding: '28px 40px'}}><Label size={22}>India ka tel</Label></div>
        <Share at={word('L07', '85%', -4)} value={85} />
        <div style={{position: 'absolute', left: 470, top: 150, fontFamily: F.display, fontSize: 160, lineHeight: 1}}>~85%</div>
        <div style={{position: 'absolute', left: 476, top: 330, fontFamily: F.mono, fontWeight: 700, fontSize: 28, letterSpacing: 2, lineHeight: 1.4}}>BAHAR SE<br />KHAREEDTE HAIN</div>
      </Card>
      <Card id="usd" x={160} y={1010} w={760} h={190} rot={1.5} at={l8} out={l9} bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 110, textAlign: 'center', marginTop: 26}}>TEL = DOLLAR $</div>
      </Card>
      <Hold from={l9}>
        <Card id="bill" x={100} y={980} w={880} h={240} rot={-1.5} at={l9} bg={C.yellow} z={20}>
          <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 36px', gap: 24}}>
            <div style={{fontFamily: F.display, fontSize: 80, whiteSpace: 'nowrap'}}>+$10</div>
            <div style={{fontFamily: F.display, fontSize: 80}}>→</div>
            <div style={{fontFamily: F.display, fontSize: 80, whiteSpace: 'nowrap'}}><HL at={word('L09', 'billion', -6)} color={C.paperLight}>+$12–15 bn</HL></div>
          </div>
          <div style={{position: 'absolute', left: 36, bottom: 14, fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: 2}}>PER BARREL → SAAL KA IMPORT BILL (ANDAAZA)</div>
        </Card>
      </Hold>
    </AbsoluteFill>
  );
};

const Rupee: React.FC = () => {
  const {at, word} = useCues();
  const l11 = at('L11');
  return (
    <AbsoluteFill>
      <Photo id="note" src="note500.jpg" x={70} y={420} w={940} h={460} rot={-2} at={0} enter="up" torn={{top: true, bottom: true}} rough={14} caption="RUPEE" />
      <Stamp id="press" text="Dabaav" sub="ZYADA DOLLAR CHAHIYE" x={680} y={560} at={word('L10', 'rupee', -2)} size={100} rot={-8} paper />
      {['PHONE', 'DAWAI', 'KHAAD'].map((t, i) => (
        <Card key={t} id={'imp' + i} x={80 + i * 310} y={940} w={290} h={250} rot={[-2, 1, 2][i]} at={word('L11', 'phone', -4) + i * 8} bg={C.card}>
          <div style={{fontFamily: F.display, fontSize: 76, textAlign: 'center', marginTop: 40}}>{t}</div>
          <div style={{fontFamily: F.display, fontSize: 70, textAlign: 'center', color: C.red}}>↑</div>
        </Card>
      ))}
      <Hand x={110} y={890} at={l11 + 2} size={46} rot={-2}>bahar se aane wali har cheez mehengi</Hand>
    </AbsoluteFill>
  );
};

const Prices: React.FC = () => {
  const {at, word} = useCues();
  const l13 = at('L13'), l14 = at('L14'), l15 = at('L15');
  return (
    <AbsoluteFill>
      <Photo id="veg" src="veg.jpg" x={70} y={410} w={940} h={520} rot={-1.5} at={0} out={l13} enter="up" torn={{top: true, bottom: true}} rough={14} caption="SABZI MANDI" />
      <Card id="truck" x={110} y={960} w={860} h={200} rot={1} at={word('L12', 'diesel', -4)} out={l13} bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 78, textAlign: 'center', marginTop: 50, whiteSpace: 'nowrap'}}>DIESEL → TRUCK → SABZI</div>
      </Card>
      {['PLASTIC', 'PAINT', 'HAWAI SAFAR'].map((t, i) => (
        <Card key={t} id={'oil' + i} x={[90, 560, 220][i]} y={[440, 470, 720][i]} w={[420, 420, 640][i]} h={200} rot={[-3, 2, -1][i]} at={word('L13', t.split(' ')[0].toLowerCase(), -4)} out={l14} bg={C.card}>
          <div style={{fontFamily: F.display, fontSize: 96, textAlign: 'center', marginTop: 36}}>{t}</div>
        </Card>
      ))}
      <Stamp id="sab" text="Sab mein tel" x={540} y={1080} at={word('L13', 'sab', -2)} out={l14} size={96} rot={-5} />
      <Tile id="cpi" y={440} at={l14} out={l15} value={<HL at={word('L14', '0.2', 0)}>+0.2–0.3%</HL>} label={'MEHNGAI\nHAR $10 PE\nANDAAZA · DBS'} rot={-1.5} size={120} h={230} />
      <Hand x={130} y={720} at={word('L14', 'badh', -2)} out={l15} size={56} rot={-2}>har $10 ki badhat pe</Hand>
      <Note id="pump" x={110} y={430} w={860} h={330} at={l15} rot={-1} label="Petrol pump" size={50}>
        Daam abhi <HL at={word('L15', 'zyada', 0)}>zyada nahi hile</HL>
      </Note>
      <Hand x={130} y={820} at={word('L15', 'dabaav', -4)} size={58} rot={-2} color={C.red} w={800}>par dabaav kahin na kahin aata hai</Hand>
    </AbsoluteFill>
  );
};

const Emi: React.FC = () => {
  const {at, word} = useCues();
  const l17 = at('L17'), l18 = at('L18'), l19 = at('L19');
  return (
    <AbsoluteFill>
      <Tile id="cpi" y={460} at={0} out={l17} value={<HL at={word('L16', '5.54', 0)}>5.54%</HL>} label={'MEHNGAI · CPI\nSEPTEMBER 2026'} rot={-1.5} size={140} h={240} />
      <Photo id="rbi" src="rbi.jpg" x={70} y={410} w={940} h={500} rot={-2} at={l17} out={l18} enter="up" torn={{top: true, bottom: true}} rough={14} caption="RBI · 7 OCT 2026" />
      <Tile id="repo" y={930} at={word('L17', 'repo', -4)} out={l18} value={<HL at={word('L17', '5.50', 0)}>5.50%</HL>} label={'REPO RATE\nBADHA'} rot={1} size={120} h={210} />
      <Photo id="flats" src="flats.jpg" x={70} y={410} w={940} h={480} rot={1.5} at={l18} out={l19} enter="up" torn={{top: true, bottom: true}} rough={14} caption="HOME LOAN" />
      {[['LOAN ↑', 'loan'], ['EMI ↑', 'emi']].map(([t, k], i) => (
        <Card key={k} id={'up' + k} x={90 + i * 460} y={940} w={430} h={220} rot={[-2, 2][i]} at={word('L18', k, -4)} out={l19} bg={i ? C.yellow : C.card}>
          <div style={{fontFamily: F.display, fontSize: 120, textAlign: 'center', marginTop: 34}}>{t}</div>
        </Card>
      ))}
      <Hold from={l19}>
        <Steps id="chain" y={420} steps={[
          {t: 'TEL ↑', s: '$117', at: word('L19', 'tel', -4)},
          {t: 'RUPEE ↓', s: 'DOLLAR KI MAANG', at: word('L19', 'rupaya', -4)},
          {t: 'MEHNGAI ↑', s: 'CPI 5.54%', at: word('L19', 'mehngai', -4)},
          {t: 'REPO ↑', s: '5.50%', at: word('L19', 'repo', -4)},
          {t: 'EMI ↑', s: 'AAPKI JEB', at: word('L19', 'emi', -4), hi: true},
        ]} />
      </Hold>
    </AbsoluteFill>
  );
};

const You: React.FC = () => {
  const {word} = useCues();
  return (
    <AbsoluteFill>
      <Checklist id="do" at={0} title="Aap kya karein" h={560} gap={180}
        items={[
          {t: 'Floating loan? Tenure check karo', s: 'EMI wahi, par loan lamba to nahi hua?', at: word('L20', 'tenure', -6)},
          {t: 'Emergency fund thoda mota', s: 'mehngai ke daur mein sahara', at: word('L21', 'emergency', -4)},
        ]} />
      <Tape id="t1" x={460} y={404} w={160} rot={-3} at={2} />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <SignOff shareLine="L22" logoLine="L23" shareWord="bhejo" friendNote="us dost ko jo kehta hai: mujhe tel se kya? →"
    disclaimer={'EDUCATIONAL ONLY · NOT FINANCIAL ADVICE\nBRENT $116.72 (23 OCT 2026) · CPI SEP 5.54% · REPO 5.50%\nPER-$10 SENSITIVITIES: DBS ESTIMATES'} />
);

export const crude: EpisodeDef = {
  id: 'crude-oil-emi',
  topic: 'TEL → EMI',
  timeline: timeline as Timeline,
  scenes: {hook: Hook, why: Why, india: India, rupee: Rupee, prices: Prices, emi: Emi, you: You, outro: Outro},
};
