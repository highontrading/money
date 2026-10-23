import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Bars, Checklist, Headline, Hold, Note, SignOff, Tile} from '../components/kit';
import {Card, Circle, Count, Cross, Hand, HL, Label, Photo, Stamp, Tape} from '../components/paper';
import {EpisodeDef} from '../Episode';
import {ease, stepped} from '../lib/motion';
import {Timeline, useCues} from '../lib/timeline';
import {C, F} from '../theme';
import timeline from '../data/ep02-inflation.json';

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l2 = at('L02'), l3 = at('L03');
  const cut = ease(stepped(frame), word('L02', 'chupchaap', 0), word('L02', 'chupchaap', 14));
  return (
    <AbsoluteFill>
      <Photo id="veg" src="veg.jpg" x={80} y={400} w={920} h={560} rot={-2} at={0} out={l2} enter="up" torn={{top: true, bottom: true}} rough={14} caption="SABZI MANDI" />
      <Card id="cpi" x={250} y={820} w={620} h={330} rot={3} at={word('L01', '5.54', -3)} out={l2} bg={C.yellow}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, textAlign: 'center', marginTop: 26}}>RETAIL INFLATION · SEP 2026</div>
        <div style={{fontFamily: F.display, fontSize: 210, textAlign: 'center', lineHeight: 1}}>5.54%</div>
      </Card>
      {/* L02: a slice of the note quietly goes missing */}
      <Hold from={l2} to={l3}>
        <div style={{position: 'absolute', left: 90, top: 560, width: 900, height: 378}}>
          <Card id="note-a" x={0} y={0} w={760} h={378} rot={-2} at={l2} enter="left" bg="#d9d4c8" texture={null} torn={{right: true}} rough={10}>
            <Img src={staticFile('img/proc/note500.jpg')} style={{width: 900, height: 378, objectFit: 'cover'}} />
          </Card>
          <div style={{position: 'absolute', left: 760 + cut * 160, top: 40 * cut, width: 140, height: 378, opacity: 1 - cut * 0.9, transform: `rotate(${cut * 18}deg)`}}>
            <Card id="note-b" x={0} y={0} w={140} h={378} rot={-2} at={l2} enter="left" bg="#d9d4c8" texture={null} torn={{left: true}} rough={10} sfx={null}>
              <Img src={staticFile('img/proc/note500.jpg')} style={{width: 900, height: 378, objectFit: 'cover', marginLeft: -760}} />
            </Card>
          </div>
        </div>
        <Hand x={560} y={990} at={word('L02', 'chupchaap', 6)} size={64} rot={-4} color={C.red}>chupchaap ✂</Hand>
      </Hold>
      <Headline words={['Inflation', 'kya', 'hai?']} at={l3} y={500} size={190} label="Mehngai, simple bhasha mein" />
    </AbsoluteFill>
  );
};

const What: React.FC = () => {
  const {at, word} = useCues();
  const l6 = at('L06');
  return (
    <AbsoluteFill>
      <Card id="up" x={80} y={430} w={440} h={380} rot={-3} at={0} out={l6} enter="left" bg={C.yellow}>
        <div style={{padding: 34}}>
          <Label size={22}>Daam</Label>
          <div style={{fontFamily: F.display, fontSize: 220, lineHeight: 1, marginTop: 10}}>↑</div>
          <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 36}}>cheezein mehngi</div>
        </div>
      </Card>
      <Card id="down" x={560} y={480} w={440} h={380} rot={3} at={word('L05', 'taakat', -4)} out={l6} enter="right" bg={C.card}>
        <div style={{padding: 34}}>
          <Label size={22}>Rupaye ki taakat</Label>
          <div style={{fontFamily: F.display, fontSize: 220, lineHeight: 1, marginTop: 10, color: C.red}}>↓</div>
          <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 36}}>₹100 mein kam saaman</div>
        </div>
      </Card>
      <Hand x={330} y={900} at={word('L05', 'ulta', 0)} out={l6} size={60} rot={-3}>ek hi sikke ke do pehlu</Hand>
      <Tile id="bag1" y={450} at={l6} op="" value="₹100" label={'PICHHLE SAAL\nEK THAILA'} rot={-1.5} />
      <Tile id="bag2" y={650} at={word('L06', 'aaj', -2)} op="→" value={<HL at={word('L06', '105.5')}>₹105.5</HL>} label={'AAJ\nWAHI THAILA'} rot={1} />
      <Hand x={140} y={880} at={word('L06', '105.5', 6)} size={58} rot={-2}>+5.54% = inflation</Hand>
    </AbsoluteFill>
  );
};

const ITEMS = [['Khana', 'khana'], ['Kapde', 'kapde'], ['Kiraya', 'kiraya'], ['Dawai', 'dawai'], ['Transport', 'transport']];

const Basket: React.FC = () => {
  const {at, word} = useCues();
  const l9 = at('L09'), l10 = at('L10');
  return (
    <AbsoluteFill>
      <Card id="basket" x={170} y={700} w={740} h={420} rot={-1} at={0} out={l10} enter="up" bg={C.kraft} texture="kraft" torn={{top: true}} rough={12}>
        <div style={{fontFamily: F.display, fontSize: 96, color: C.paperLight, textAlign: 'center', marginTop: 140, letterSpacing: 4}}>CPI BASKET</div>
      </Card>
      {ITEMS.map(([t, k], i) => (
        <Card key={k} id={'it' + k} x={[150, 420, 690, 270, 560][i]} y={[440, 410, 450, 570, 590][i]} w={260} h={110} rot={[-6, 3, 7, -3, 4][i]} at={word('L08', k, -3)} out={l10} bg={i % 2 ? C.yellow : C.card}>
          <div style={{fontFamily: F.display, fontSize: 62, textAlign: 'center', marginTop: 14}}>{t.toUpperCase()}</div>
        </Card>
      ))}
      <Stamp id="cpi" text="CPI" sub="CONSUMER PRICE INDEX" x={540} y={1010} at={word('L09', 'cpi', -2)} out={l10} size={110} rot={-6} color={C.ink} paper />
      <Hold from={l9 - 4} to={l10}>
        <Hand x={120} y={1140} at={l9} size={52} rot={-2}>har mahine, sainkdon daam</Hand>
      </Hold>
      <Tile id="cpi1" y={450} at={l10} op="" value="CPI aaj" label={'IS SAAL'} rot={-1} />
      <Tile id="cpi2" y={640} at={l10 + 8} op="vs" value="CPI saal pehle" label={'PICHHLE SAAL'} rot={1} size={100} />
      <Tile id="cpi3" y={830} at={word('L10', 'inflation', -2)} op="=" value={<HL at={word('L10', 'inflation')}>Inflation %</HL>} label={'YEAR-ON-YEAR'} rot={-1} />
    </AbsoluteFill>
  );
};

const Why: React.FC = () => {
  const {at, word} = useCues();
  const l12 = at('L12'), l13 = at('L13'), l14 = at('L14');
  return (
    <AbsoluteFill>
      <Headline words={['Do', 'kaaran']} at={0} out={l12 + 4} size={200} label="Daam badhte kyun hain?" />
      <Card id="demand" x={70} y={420} w={460} h={640} rot={-2} at={l12} enter="left" bg={C.card}>
        <div style={{padding: 32}}>
          <Label size={22}>01 · Demand-pull</Label>
          <div style={{fontFamily: F.display, fontSize: 80, lineHeight: 1, marginTop: 18}}><HL at={word('L12', 'demand')}>DEMAND ZYADA</HL></div>
          <div style={{fontFamily: F.display, fontSize: 80, lineHeight: 1, marginTop: 10, color: C.inkSoft}}>SAAMAN KAM</div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 30}}>
            {Array.from({length: 12}).map((_, i) => <div key={i} style={{width: 46, height: 46, borderRadius: 23, background: C.ink}} />)}
          </div>
          <div style={{display: 'flex', gap: 10, marginTop: 20}}>
            {Array.from({length: 3}).map((_, i) => <div key={i} style={{width: 46, height: 46, background: C.yellow, border: `4px solid ${C.ink}`}} />)}
          </div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, marginTop: 14}}>12 KHAREEDAR · 3 CHEEZEIN</div>
        </div>
      </Card>
      <Card id="cost" x={550} y={460} w={460} h={640} rot={2} at={l13} enter="right" bg={C.yellow}>
        <div style={{padding: 32}}>
          <Label size={22}>02 · Cost-push</Label>
          <div style={{fontFamily: F.display, fontSize: 80, lineHeight: 1, marginTop: 18}}>BANANE KA KHARCHA ↑</div>
          {[['Petrol', 'petrol'], ['Raw material', 'raw'], ['Majdoori', 'majdoori']].map(([t, k]) => (
            <div key={k} style={{fontFamily: F.type, fontSize: 42, marginTop: 22, opacity: 1}}>+ {t}</div>
          ))}
        </div>
      </Card>
      <Hand x={560} y={1130} at={word('L14', 'aap', -2)} size={64} rot={-3} color={C.red}>→ aapke bill mein</Hand>
      <Stamp id="pass" text="Passed on" x={760} y={980} at={l14 + 4} size={64} rot={-8} />
    </AbsoluteFill>
  );
};

const VALUES = [100, 90.7, 82.3, 74.6, 67.7, 61.4];

const Compound: React.FC = () => {
  const {at, word} = useCues();
  const l16 = at('L16'), l17 = at('L17');
  const t0 = word('L16', 'value', -6), span = word('L16', '61', -4) - t0;
  return (
    <AbsoluteFill>
      <Headline words={['Saalon', 'ka', 'khel']} at={0} out={l16} size={190} />
      <Bars id="decay" at={l16 - 2} out={l17} title="Aaj ke ₹100 ki value · 5% inflation" max={110} note="ARITHMETIC: 100 ÷ 1.05^SAAL"
        bars={VALUES.map((v, i) => ({label: `${i * 2} SAAL`, value: v, text: `₹${Math.round(v)}`, at: t0 + Math.round((i / 5) * span), hi: i === 5}))} />
      <Circle id="c61" cx={880} cy={800} rx={100} ry={80} at={word('L16', '61', 2)} out={l17} />
      <Note id="r72" x={110} y={440} w={860} h={420} at={l17} rot={-1.5} label="Rule of 72" size={60}>
        72 ÷ inflation = <HL at={word('L17', 'bhaag')}>saal</HL> jisme daam DOUBLE
      </Note>
      <Tile id="r72b" y={900} at={word('L17', '6%', -2)} op="" value="72 ÷ 6 = 12 saal" label={'6% INFLATION\nDAAM 2X'} hi rot={1} size={96} />
    </AbsoluteFill>
  );
};

const Real: React.FC = () => {
  const {at, word} = useCues();
  const l19 = at('L19'), l20 = at('L20'), l21 = at('L21');
  return (
    <AbsoluteFill>
      <Tile id="fd" y={440} at={0} out={l21} op="" value="FD 7%" label={'INTEREST\n(EXAMPLE)'} rot={-1} />
      <Tile id="inf" y={630} at={l19} out={l20} op="−" value="5.5%" label={'INFLATION'} rot={1} />
      <Tile id="real" y={820} at={word('L19', 'asli', -2)} out={l20} op="=" value={<HL at={word('L19', '1.5')}>1.5%</HL>} label={'ASLI KAMAAI'} rot={-1} />
      <Tile id="tax" y={630} at={l20} out={l21} op="×" value="0.7 = 4.9%" label={'30% SLAB\nTAX KE BAAD'} rot={1} />
      <Tile id="neg" y={820} at={word('L20', 'real', -2)} out={l21} op="=" value={<span style={{color: C.red}}>−0.6%</span>} label={'4.9 − 5.5\nREAL RETURN'} rot={-1} />
      <Stamp id="minus" text="Minus" x={700} y={1080} at={word('L20', 'minus', -2)} out={l21} size={96} rot={-8} />
      <Note id="def" x={110} y={640} w={860} h={360} at={l21} rot={-1} bg={C.yellow} label="Yaad rakho" size={58}>
        REAL RETURN =<br />INTEREST − INFLATION
      </Note>
    </AbsoluteFill>
  );
};

const Rbi: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l23 = at('L23'), l24 = at('L24'), l25 = at('L25');
  const x0 = 140, wBand = 800; // 0%..8% scale
  const px = (v: number) => x0 + (v / 8) * wBand;
  return (
    <AbsoluteFill>
      <Photo id="rbi" src="rbi.jpg" x={90} y={410} w={900} h={560} rot={-2} at={0} out={l23} enter="up" torn={{top: true, bottom: true}} rough={14} caption="RESERVE BANK OF INDIA, MUMBAI" />
      <Hold from={l23 - 2} to={l24}>
        <Card id="band" x={80} y={440} w={920} h={560} rot={-1} at={l23 - 2} enter="up" bg={C.card}>
          <div style={{padding: '30px 40px'}}><Label size={22}>RBI ka inflation target</Label></div>
        </Card>
        <div style={{position: 'absolute', left: px(2), width: px(6) - px(2), top: 700, height: 90, background: C.yellow, border: `4px solid ${C.ink}`, zIndex: 66, opacity: ease(stepped(frame), word('L23', '2', -2), word('L23', '2', 6))}} />
        {[0, 2, 4, 6, 8].map((v) => (
          <div key={v} style={{position: 'absolute', left: px(v) - 40, width: 80, top: 810, textAlign: 'center', fontFamily: F.display, fontSize: 52, zIndex: 66}}>{v}%</div>
        ))}
        <div style={{position: 'absolute', left: px(4) - 3, top: 670, width: 6, height: 150, background: C.ink, zIndex: 67}} />
        <div style={{position: 'absolute', left: px(4) - 110, width: 220, top: 600, textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 26, zIndex: 67}}>TARGET 4%</div>
        <Hand x={px(5.54) - 70} y={890} at={word('L23', '6', 4)} size={56} rot={-3} color={C.red}>↑ abhi 5.54%</Hand>
      </Hold>
      {[['RATE ↑', 'interest'], ['LOAN MEHENGE', 'loan'], ['KHARCHA ↓', 'kharcha'], ['DAAM THANDE', 'thande']].map(([t, k], i) => (
        <Card key={k} id={'ch' + k} x={110 + (i % 2) * 440} y={450 + Math.floor(i / 2) * 260} w={410} h={200} rot={[-2, 2, 1, -1][i]} at={word('L24', k, -3)} out={l25} bg={i === 3 ? C.yellow : C.card}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, padding: '18px 22px'}}>{`0${i + 1}`}</div>
          <div style={{fontFamily: F.display, fontSize: 70, textAlign: 'center'}}>{t}</div>
        </Card>
      ))}
      <Tile id="repo" y={500} at={l25} op="" value={<>5.25% → <HL at={word('L25', '5.50')}>5.50%</HL></>} label={'REPO RATE\n7 OCT 2026'} rot={-1.5} size={92} />
      <Stamp id="hike" text="Rate hike" x={560} y={800} at={word('L25', '5.50', 4)} size={100} rot={-7} />
    </AbsoluteFill>
  );
};

const Protect: React.FC = () => {
  const {word} = useCues();
  return (
    <AbsoluteFill>
      <Checklist id="todo" at={0} title="Inflation se bachav"
        items={[
          {t: 'Lambe goals: return > inflation', s: 'jahan asli kamaai plus mein ho', at: word('L26', 'upar', -4)},
          {t: 'Emergency fund: savings / FD', s: 'yahan suraksha zaroori, return nahi', at: word('L27', 'emergency', 0)},
          {t: '10 saal ka paisa FD mein', s: 'real return zero ya minus', at: word('L27', 'saal', 0), bad: true},
          {t: 'Salary hike > inflation?', s: 'kam badhi = asal mein ghati', at: word('L28', 'salary', 0)},
        ]} />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <SignOff shareLine="L29" logoLine="L30" shareWord="bhejo" friendNote="us dost ko jiska saara paisa savings mein hai →"
    disclaimer={'EDUCATIONAL ONLY · NOT INVESTMENT ADVICE\nCPI: MoSPI, SEP 2026 (PROVISIONAL) · REPO: RBI, 7 OCT 2026'} />
);

export const inflation: EpisodeDef = {
  id: 'inflation',
  topic: 'INFLATION',
  timeline: timeline as Timeline,
  scenes: {hook: Hook, what: What, basket: Basket, why: Why, compound: Compound, real: Real, rbi: Rbi, protect: Protect, outro: Outro},
};
