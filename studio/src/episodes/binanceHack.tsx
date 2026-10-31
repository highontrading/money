import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Bars, Checklist, Headline, Hold, Note, SignOff, Steps, Tile} from '../components/kit';
import {Card, Count, Cross, Hand, HL, Label, Photo, Stamp} from '../components/paper';
import {EpisodeDef} from '../Episode';
import {Timeline, useCues} from '../lib/timeline';
import {C, F} from '../theme';
import timeline from '../data/binance-hack.json';

const Hook: React.FC = () => {
  const {at, word} = useCues();
  const l2 = at('L02');
  return (
    <AbsoluteFill>
      <Photo id="laptop" src="btclaptop.jpg" x={70} y={410} w={940} h={560} rot={-2} at={0} out={l2 + 40} enter="up" torn={{top: true, bottom: true}} rough={14} caption="EK LAPTOP" />
      <Stamp id="hacked" text="Hacked" x={760} y={540} at={word('L01', 'laptop', 6)} out={l2 + 40} size={110} rot={8} />
      <Card id="amt" x={140} y={930} w={800} h={270} rot={1.5} at={word('L01', '60,000', -6)} out={l2 + 40} bg={C.ink}>
        <div style={{padding: '26px 40px', color: C.paperLight}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: C.yellow}}>CRYPTO GAYAB · LAGBHAG</div>
          <div style={{fontFamily: F.display, fontSize: 150, lineHeight: 1.15}}>₹<Count from={0} to={60000} at={word('L01', '60,000', -2)} dur={18} fmt={(n) => Math.round(n).toLocaleString('en-IN')} /> CR</div>
        </div>
      </Card>
      <Hold from={l2 + 40}>
        <Headline words={['Itihaas', 'ki', 'sabse', 'badi', 'chori']} at={l2 + 40} size={150} y={470} label="Binance · duniya ka sabse bada crypto exchange" />
      </Hold>
    </AbsoluteFill>
  );
};

const What: React.FC = () => {
  const {at, word} = useCues();
  const l4 = at('L04'), l6 = at('L06'), l7 = at('L07');
  return (
    <AbsoluteFill>
      <Tile id="63" y={440} at={0} out={l4} value={<HL at={word('L03', '6.3', 0)}>$6.3 BN</HL>} label={'CLIENT ASSETS PE ASAR\n29 OCT 2026'} rot={-1.5} size={140} h={240} />
      <Hand x={140} y={720} at={word('L03', 'asar', -2)} out={l4} size={56} rot={-2}>≈ ₹60,000 crore</Hand>
      <Hold from={l4} to={l6}>
        <Steps id="how" y={440} h={150} gap={70} size={78} steps={[
          {t: 'LAPTOP HACK', s: 'EK ENGINEER KA', at: l4},
          {t: 'HACKER ANDAR', s: 'SYSTEM MEIN', at: word('L05', 'hacker', -4)},
          {t: 'NAKLI WITHDRAWALS', s: '', at: word('L05', 'nakli', -4), hi: true},
        ]} />
      </Hold>
      <Card id="nk" x={110} y={440} w={860} h={360} rot={-1.5} at={l6} out={l7} enter="up" bg={C.card}>
        <div style={{padding: '32px 40px'}}>
          <Label size={22}>Blockchain jaanch firms ke mutabik</Label>
          <div style={{fontFamily: F.display, fontSize: 124, marginTop: 30, whiteSpace: 'nowrap'}}>NORTH KOREA?</div>
        </div>
      </Card>
      <Bars id="rec" at={l7} title="Sabse badi crypto chori · $ billion" max={7} h={720} note="BYBIT: FEB 2025 · BINANCE: OCT 2026 (ESTIMATE)"
        bars={[
          {label: 'BYBIT\n2025', value: 1.5, text: '1.5', at: word('L07', '1.5', -4)},
          {label: 'BINANCE\n2026', value: 6.3, text: '6.3', at: word('L07', 'chaar', -6), color: C.red},
        ]} />
      <Stamp id="4x" text="4x+" x={760} y={1180} at={word('L07', 'guna', -4)} size={100} rot={-6} paper />
    </AbsoluteFill>
  );
};

const Now: React.FC = () => {
  const {at, word} = useCues();
  const l9 = at('L09'), l10 = at('L10'), l11 = at('L11');
  return (
    <AbsoluteFill>
      <Photo id="app" src="phone.jpg" x={60} y={430} w={868} h={652} rot={-3} at={0} out={l11} enter="up" torn={{right: true, top: true}} rough={14} zoom={0.02} />
      <Stamp id="paused" text="Withdrawals paused" x={540} y={520} at={word('L08', 'withdrawals', -2)} out={l11} size={76} rot={-6} paper />
      <Tile id="frz" y={1010} at={l9} out={l10} value="$3 BN" label={'BLOCKCHAIN PE\nFREEZE'} rot={1} size={110} h={190} hi />
      <Note id="cover" x={110} y={980} w={860} h={230} at={l10} out={l11} rot={1} size={44} label="Binance ka vaada">
        Nuksaan <HL at={word('L10', 'apne', -2)}>apne fund</HL> se bharenge
      </Note>
      <Photo id="coin" src="btccoin.jpg" x={70} y={410} w={940} h={500} rot={-1.5} at={l11} enter="up" torn={{top: true, bottom: true}} rough={14} caption="BITCOIN" />
      <Tile id="77" y={950} at={word('L11', '77,000', -6)} value={<>{'< $77,000'}</>} label={'BITCOIN\nGIRA'} rot={-1} size={110} h={200} />
    </AbsoluteFill>
  );
};

const Lesson: React.FC = () => {
  const {at, word} = useCues();
  const l14 = at('L14'), l15 = at('L15');
  return (
    <AbsoluteFill>
      <Hold to={l14}>
        <Card id="ex" x={80} y={440} w={430} h={460} rot={-2} at={0} enter="left" bg={C.card}>
          <div style={{padding: 28}}>
            <Label size={22}>Exchange ka wallet</Label>
            <div style={{fontFamily: F.display, fontSize: 80, marginTop: 30, lineHeight: 1.05}}>AAPKA CRYPTO YAHAN</div>
          </div>
        </Card>
        <Card id="you" x={570} y={470} w={430} h={460} rot={2} at={word('L13', 'vaada', -6)} enter="right" bg={C.yellow}>
          <div style={{padding: 28}}>
            <Label size={22}>Aapke paas</Label>
            <div style={{fontFamily: F.display, fontSize: 96, marginTop: 30, lineHeight: 1.05}}>EK VAADA</div>
          </div>
        </Card>
        <Hand x={140} y={980} at={word('L12', 'nahi', -4)} size={56} rot={-2} color={C.red}>exchange pe = aapke paas nahi</Hand>
      </Hold>
      <Hold from={l14} to={l15}>
        <Headline words={['Not', 'your', 'keys,', 'not', 'your', 'coins.']} at={l14} size={140} y={480} />
      </Hold>
      <Card id="dicgc" x={160} y={460} w={760} h={330} rot={-1.5} at={l15} bg={C.card}>
        <div style={{padding: '30px 40px'}}>
          <Label size={22}>Bank FD jaisa</Label>
          <div style={{fontFamily: F.display, fontSize: 110, marginTop: 20}}>DICGC ₹5 LAKH</div>
        </div>
      </Card>
      <Cross id="nx" x={180} y={480} w={720} h={290} at={word('L15', 'nahi', -2)} />
      <Stamp id="noins" text="Insurance nahi" x={540} y={950} at={word('L15', 'dicgc', -2)} size={96} rot={-6} />
    </AbsoluteFill>
  );
};

const Do: React.FC = () => {
  const {word} = useCues();
  return (
    <AbsoluteFill>
      <Checklist id="do" at={0} title="Aap kya karein" gap={180} h={720}
        items={[
          {t: 'Ek exchange pe sab nahi', s: 'baant kar rakho', at: word('L16', 'exchange', -6)},
          {t: '"Help desk" call / DM = scam', s: 'kabhi OTP ya seed phrase mat do', at: word('L17', 'call', -6), bad: true},
          {t: 'Portfolio ka chhota hissa', s: 'aur gains pe 30% tax', at: word('L18', 'chhota', -6)},
        ]} />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <SignOff shareLine="L19" logoLine="L20" shareWord="bhejo" friendNote="us dost ko jiska crypto Binance pe hai →"
    disclaimer={'EDUCATIONAL ONLY · NOT FINANCIAL ADVICE\nFIGURES: BINANCE + REPORTS, 29–30 OCT 2026 · DEVELOPING\nATTRIBUTION: CHAINALYSIS / TRM LABS · ₹ AT ~95 PER $'} />
);

export const binanceHack: EpisodeDef = {
  id: 'binance-hack',
  topic: 'BINANCE HACK',
  timeline: timeline as Timeline,
  scenes: {hook: Hook, what: What, now: Now, lesson: Lesson, do: Do, outro: Outro},
};
