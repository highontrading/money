import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Checklist, Headline, Hold, Note, SignOff, Tile} from '../components/kit';
import {Card, Hand, HL, Label, Marker, Photo, Sfx, Stamp, Tape} from '../components/paper';
import {EpisodeDef} from '../Episode';
import {Timeline, useCues} from '../lib/timeline';
import {C, F} from '../theme';
import timeline from '../data/muhurat.json';

const Hook: React.FC = () => {
  const {at, word} = useCues();
  const l2 = at('L02');
  return (
    <AbsoluteFill>
      <Photo id="diya" src="diya.jpg" x={70} y={410} w={940} h={620} rot={-2} at={0} out={l2} enter="up" torn={{top: true, bottom: true}} rough={14} caption="DIWALI KI SHAAM" />
      <Card id="closed" x={130} y={960} w={500} h={170} rot={-3} at={word('L01', 'band', -4)} out={l2} bg={C.card}>
        <div style={{fontFamily: F.display, fontSize: 84, textAlign: 'center', marginTop: 30, textDecoration: 'line-through', textDecorationColor: C.red, textDecorationThickness: 8}}>BAZAAR BAND</div>
      </Card>
      <Stamp id="1h" text="Sirf 1 ghanta" x={720} y={540} at={word('L01', 'ghante', -6)} out={l2} size={88} rot={-7} paper />
      <Headline words={['Muhurat', 'trading']} at={l2} size={200} y={560} label="Diwali ka ek ghanta" />
    </AbsoluteFill>
  );
};

const What: React.FC = () => {
  const {at, word} = useCues();
  const l4 = at('L04'), l5 = at('L05');
  return (
    <AbsoluteFill>
      <Note id="khata" x={110} y={430} w={860} h={420} at={0} out={l5} rot={-1.5} label="Purani parampara" size={54}>
        Diwali = vyapari ke <HL at={word('L03', 'naye', -2)}>naye khaate</HL>
      </Note>
      <Card id="samvat" x={160} y={900} w={760} h={250} rot={1.5} at={l4} out={l5} bg={C.yellow}>
        <div style={{padding: '30px 40px'}}>
          <Label size={22}>Naya Samvat saal</Label>
          <div style={{fontFamily: F.display, fontSize: 82, marginTop: 14, whiteSpace: 'nowrap'}}>PEHLI SHUBH KHAREED</div>
        </div>
      </Card>
      <Photo id="bse" src="bse.jpg" x={70} y={410} w={940} h={600} rot={1.5} at={l5} enter="up" torn={{top: true, bottom: true}} rough={14} caption="STOCK EXCHANGE" />
      <Hand x={130} y={1060} at={word('L05', 'zinda', -4)} size={62} rot={-2}>yahi parampara, aaj bhi</Hand>
    </AbsoluteFill>
  );
};

const Clock: React.FC<{at: number; out?: number; pre: number; main: number}> = ({at, out, pre, main}) => {
  const frame = useCurrentFrame();
  // 2:00 PM to 3:40 PM laid across the strip.
  const x0 = 60, span = 760, t = (m: number) => x0 + (m / 100) * span;
  return (
    <Card id="slot" x={100} y={720} w={880} h={420} rot={-1} at={at} out={out} enter="up" bg={C.card}>
      <div style={{padding: '28px 36px'}}><Label size={22}>Ravivaar · 8 Nov · dopahar</Label></div>
      <div style={{position: 'absolute', left: x0, width: span, top: 210, height: 6, background: C.ink}} />
      {[0, 20, 40, 60, 80, 100].map((m) => (
        <div key={m} style={{position: 'absolute', left: t(m) - 40, width: 80, top: 236, textAlign: 'center', fontFamily: F.mono, fontSize: 20, color: C.inkSoft}}>{`${m < 60 ? 2 : 3}:${String(m % 60).padStart(2, '0')}`}</div>
      ))}
      {frame >= pre ? (
        <div style={{position: 'absolute', left: t(5), width: t(20) - t(5), top: 140, height: 70, background: C.paperLight, border: `4px solid ${C.ink}`, fontFamily: F.mono, fontWeight: 700, fontSize: 18, textAlign: 'center', lineHeight: '62px'}}>PRE</div>
      ) : null}
      {frame >= main ? (
        <div style={{position: 'absolute', left: t(20), width: t(90) - t(20), top: 120, height: 90, background: C.yellow, border: `4px solid ${C.ink}`, fontFamily: F.display, fontSize: 52, textAlign: 'center', lineHeight: '82px'}}>TRADING 2:20–3:30</div>
      ) : null}
      {frame >= pre ? <div style={{position: 'absolute', left: 36, top: 300, fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 1.5}}>PRE-OPEN 2:05–2:20</div> : null}
    </Card>
  );
};

const When: React.FC = () => {
  const {at, word} = useCues();
  const l7 = at('L07'), l8 = at('L08');
  return (
    <AbsoluteFill>
      <Card id="cal" x={300} y={430} w={480} h={520} rot={-2} at={0} out={l8} enter="drop" bg={C.card}>
        <div style={{height: 110, background: C.red, color: C.paperLight, fontFamily: F.display, fontSize: 80, textAlign: 'center', lineHeight: '110px'}}>NOV</div>
        <div style={{fontFamily: F.display, fontSize: 260, textAlign: 'center', lineHeight: 1.2}}>8</div>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 3, textAlign: 'center'}}>RAVIVAAR</div>
      </Card>
      <Tape id="tc" x={460} y={412} w={160} rot={-4} at={2} out={l8} />
      <Clock at={l7} out={l8} pre={word('L07', '2:05', -4)} main={word('L07', 'asli', -2)} />
      <Card id="cas" x={110} y={430} w={860} h={330} rot={-1.5} at={l8} enter="up" bg={C.yellow}>
        <div style={{padding: '34px 40px'}}>
          <Label size={22}>Pehli baar Diwali pe</Label>
          <div style={{fontFamily: F.display, fontSize: 104, marginTop: 20, whiteSpace: 'nowrap'}}>CLOSING AUCTION</div>
        </div>
      </Card>
      <Note id="boli" x={150} y={820} w={780} h={300} at={at('L09')} rot={1.5} size={46}>
        Aakhri daam = ek <HL at={word('L09', 'boli', -2)}>chhoti boli</HL> se tay
      </Note>
    </AbsoluteFill>
  );
};

// 20 Muhurat sessions as paper squares: yellow = Nifty closed higher.
const Grid: React.FC<{at: number; out?: number; upAt: number; smallAt: number}> = ({at, out, upAt, smallAt}) => {
  const frame = useCurrentFrame();
  const up = Array.from({length: 20}, (_, i) => (i < 15 ? 1 : 0));
  return (
    <Card id="grid" x={80} y={420} w={920} h={560} rot={-1} at={at} out={out} enter="up" bg={C.card}>
      <div style={{padding: '28px 36px'}}><Label size={22}>Pichhle 20 Muhurat session · Nifty</Label></div>
      <div style={{position: 'absolute', left: 50, top: 110, display: 'grid', gridTemplateColumns: 'repeat(5, 150px)', gap: 18}}>
        {up.map((u, i) => {
          const lit = frame >= upAt + i;
          return (
            <div key={i} style={{height: 84, border: `4px solid ${C.ink}`, background: lit ? (u ? C.yellow : C.grey) : C.paperLight, fontFamily: F.display, fontSize: frame >= smallAt ? 36 : 46, textAlign: 'center', lineHeight: '78px', color: frame >= smallAt && i === 0 ? C.red : C.ink}}>{!lit ? '' : frame >= smallAt ? (i === 0 ? '6%+' : '<1%') : u ? '↑' : '↓'}</div>
          );
        })}
      </div>
    </Card>
  );
};

const Data: React.FC = () => {
  const {at, word} = useCues();
  const l11 = at('L11'), l12 = at('L12'), l13 = at('L13'), l14 = at('L14'), l15 = at('L15');
  return (
    <AbsoluteFill>
      <Headline words={['Upar', 'hi', 'jaata', 'hai?']} at={0} out={l11} size={190} y={500} />
      <Grid at={l11} out={l13} upAt={l11 + 6} smallAt={word('L12', '19', -2)} />
      <Tile id="15" y={1010} at={word('L11', '15', -4)} out={l12} value={<HL at={word('L11', '15', 0)}>15 / 20</HL>} label={'UPAR BAND\nHUA'} rot={1} size={120} h={200} />
      <Tile id="19" y={1010} at={word('L12', '19', -4)} out={l13} value="19 / 20" label={'BADLAAV\n±1% SE KAM'} hi rot={-1} size={120} h={200} />
      <Tile id="last" y={460} at={l13} out={l15} value="+0.10%" label={'PICHHLI BAAR\n2025'} rot={-1.5} size={140} h={230} />
      <Card id="2008" x={110} y={760} w={860} h={330} rot={1.5} at={l14} out={l15} bg={C.yellow}>
        <div style={{padding: '30px 40px'}}>
          <Label size={22}>2008 · Muhurat</Label>
          <div style={{fontFamily: F.display, fontSize: 130, marginTop: 14}}>+6% SE ZYADA</div>
        </div>
      </Card>
      <Hand x={130} y={1120} at={word('L14', 'bura', -6)} out={l15} size={60} rot={-2} color={C.red}>phir bhi woh saal bura raha</Hand>
      <Headline words={['1', 'ghanta', '≠', 'saal']} at={l15} size={190} y={500} />
      <Stamp id="sig" text="Signal nahi" x={540} y={1020} at={word('L15', 'signal', -4)} size={110} rot={-6} />
    </AbsoluteFill>
  );
};

const Real: React.FC = () => {
  const {at, word} = useCues();
  const l17 = at('L17');
  return (
    <AbsoluteFill>
      <Checklist id="real" at={0} out={l17} title="Yeh asli trading hai" h={520} gap={130}
        items={[
          {t: 'Khareeda = paisa katega', at: word('L16', 'khareeda', -4)},
          {t: 'Settlement normal', at: word('L16', 'settlement', -4)},
        ]} />
      <Card id="vol" x={80} y={430} w={920} h={680} rot={-1} at={l17} enter="up" bg={C.card}>
        <div style={{padding: '30px 40px'}}><Label size={22}>Sketch · kam volume</Label></div>
      </Card>
      <Marker id="jolt" d="M140,850 L260,820 L320,700 L390,960 L470,760 L540,1000 L620,690 L700,930 L780,780 L900,880" at={l17 + 8} dur={18} out={undefined} color={C.red} width={10} />
      <Sfx at={l17 + 8} name="marker" volume={0.3} />
      <Hand x={600} y={540} at={word('L17', 'jhatke', -4)} size={62} rot={-3} color={C.red}>jhatke!</Hand>
    </AbsoluteFill>
  );
};

const You: React.FC = () => {
  const {at, word} = useCues();
  const l21 = at('L21');
  return (
    <AbsoluteFill>
      <Checklist id="do" at={0} out={l21} title="Shagun ke liye kharidna hai?" gap={165} h={680}
        items={[
          {t: 'Limit order lagao', s: 'daam aap tay karo', at: word('L18', 'limit', -4)},
          {t: 'Wahi jo waise bhi lene the', s: 'muhurat ke liye naya nahi', at: word('L19', 'wahi', -4)},
          {t: 'Bada daav nahi', s: 'ek ghanta, kam volume', at: word('L20', 'bada', -4), bad: true},
        ]} />
      <Headline words={['Muhurat', 'shubh.', 'Paisa:', 'plan']} at={l21} size={170} y={500} />
      <Hold from={word('L21', 'plan', 0)}>
        <Marker id="ul" d="M90,985 C300,1000 560,975 760,992" at={word('L21', 'plan', 0)} dur={8} />
      </Hold>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <SignOff shareLine="L22" logoLine="L23" shareWord="bhejo" friendNote="us dost ko jo shubh share dhoondh raha hai →"
    disclaimer={'EDUCATIONAL ONLY · NOT FINANCIAL ADVICE\nTIMINGS: NSE / BSE CIRCULARS · NIFTY: LAST 20 MUHURAT SESSIONS\nPAST MOVES DO NOT PREDICT THE YEAR'} />
);

export const muhurat: EpisodeDef = {
  id: 'muhurat-trading',
  topic: 'MUHURAT TRADING',
  timeline: timeline as Timeline,
  scenes: {hook: Hook, what: What, when: When, data: Data, real: Real, you: You, outro: Outro},
};
