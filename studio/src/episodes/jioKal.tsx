import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Bars, Headline, Hold, Note, SignOff, Tile} from '../components/kit';
import {Card, Count, Hand, HL, Label, Marker, Photo, Sfx, Stamp, Tape} from '../components/paper';
import {EpisodeDef} from '../Episode';
import {clamp, stepped} from '../lib/motion';
import {Timeline, useCues} from '../lib/timeline';
import {C, F} from '../theme';
import timeline from '../data/jio-kal.json';

// Flip-clock style countdown card: "KAL 10:00 AM".
const Clock: React.FC<{id: string; x: number; y: number; at: number; out?: number; rot?: number}> = ({id, x, y, at, out, rot = 0}) => {
  const frame = useCurrentFrame();
  const blink = Math.floor(stepped(frame) / 15) % 2 === 0;
  return (
    <Card id={id} x={x} y={y} w={520} h={270} rot={rot} at={at} out={out} bg={C.ink}>
      <div style={{padding: '22px 30px', color: C.paperLight}}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: C.yellow}}>LISTING · KAL · 28 OCT</div>
        <div style={{fontFamily: F.display, fontSize: 150, lineHeight: 1.1}}>10<span style={{opacity: blink ? 1 : 0.15}}>:</span>00</div>
      </div>
    </Card>
  );
};

const Hook: React.FC = () => {
  const {at, word} = useCues();
  const l2 = at('L02'), l3 = at('L03');
  return (
    <AbsoluteFill>
      <Photo id="tower" src="tower.jpg" x={70} y={410} w={940} h={560} rot={-2} at={0} out={l2} enter="up" torn={{top: true, bottom: true}} rough={14} caption="JIO PLATFORMS" />
      <Stamp id="big" text="Sabse bada IPO" sub="INDIA KA" x={540} y={560} at={word('L01', 'sabse', -2)} out={l2} size={96} rot={-6} paper />
      <Clock id="clk" x={280} y={960} at={word('L01', 'kal', -4)} out={l2} rot={2} />
      <Bars id="rec" at={l2} out={l3} h={640} title="Sabse bade IPO · ₹ crore" max={33000} note="HYUNDAI MOTOR INDIA: OCT 2024"
        bars={[
          {label: 'HYUNDAI\n2024', value: 27870, text: '27,870', at: l2 + 4},
          {label: 'JIO\n2026', value: 30213, text: '30,213', at: word('L02', '30,213', -2), hi: true},
        ]} />
      <Stamp id="toota" text="Record toota" x={540} y={1150} at={word('L02', 'toot', -2)} out={l3} size={84} rot={-5} />
      <Card id="lot" x={110} y={440} w={860} h={420} rot={-1.5} at={l3} enter="up" bg={C.yellow}>
        <div style={{padding: '34px 44px'}}>
          <Label size={22}>Aapka 1 lot · 12 shares</Label>
          <div style={{fontFamily: F.display, fontSize: 210, lineHeight: 1.1, marginTop: 20}}>₹13,428</div>
        </div>
      </Card>
      <Clock id="clk2" x={280} y={900} at={word('L03', 'kal', -4)} rot={-2} />
      <Hand x={150} y={1190} at={word('L03', 'ghante', -2)} size={50} rot={-2} color={C.red}>faisla: 1 ghante mein</Hand>
    </AbsoluteFill>
  );
};

const Hype: React.FC = () => {
  const {at, word} = useCues();
  const l5 = at('L05'), l6 = at('L06');
  return (
    <AbsoluteFill>
      <Headline words={['Craze', 'dekho']} at={0} out={word('L04', 'anchor', -2)} size={210} y={520} />
      <Card id="anchor" x={110} y={440} w={860} h={360} rot={-1.5} at={word('L04', 'anchor', -4)} out={l6} enter="left" bg={C.card}>
        <div style={{padding: '30px 40px'}}>
          <Label size={22}>Anchor book · demand</Label>
          <div style={{fontFamily: F.display, fontSize: 170, lineHeight: 1.1, marginTop: 20}}>₹<Count from={0} to={2.5} at={word('L04', '2.5', -6)} dur={14} fmt={(n) => n.toFixed(1)} /> L CR</div>
        </div>
      </Card>
      <Card id="day1" x={110} y={850} w={860} h={330} rot={1.5} at={l5} out={l6} enter="right" bg={C.yellow}>
        <div style={{padding: '30px 40px'}}>
          <Label size={22}>Day 1 · boli</Label>
          <div style={{fontFamily: F.display, fontSize: 150, lineHeight: 1.1, marginTop: 16}}>₹<Count from={0} to={3.73} at={word('L05', '3.73', -6)} dur={14} fmt={(n) => n.toFixed(2)} /> L CR</div>
        </div>
      </Card>
      <Bars id="subs" at={l6} title="Kitna guna bhara · final" max={75} note="SUBSCRIPTION AT CLOSE, 23 OCT 2026"
        bars={[
          {label: 'BADE\nINSTITUTIONS', value: 70.55, text: '70x', at: word('L06', 'institutions', -4), hi: true},
          {label: 'NII', value: 14, text: '14x', at: word('L06', 'institutions', 4)},
          {label: 'RETAIL', value: 2.72, text: '2.7x', at: word('L07', 'retail', -4), color: C.red},
        ]} />
      <Stamp id="22" text="22x" sub="OVERALL" x={760} y={600} at={word('L06', '22', -2)} size={110} rot={8} paper />
      <Hand x={560} y={1140} at={word('L07', 'sabko', -2)} size={50} rot={-3} color={C.red}>sabko nahi mila</Hand>
    </AbsoluteFill>
  );
};

// GMP over the week before listing: peak ₹273 on 20 Oct, ~₹247 on 26 Oct.
const GmpLine: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  return (
    <>
      <Card id="gchart" x={80} y={430} w={920} h={560} rot={-1} at={at} enter="up" bg={C.card}>
        <div style={{padding: '28px 40px'}}><Label size={22}>GMP · ₹ per share</Label></div>
        <div style={{position: 'absolute', left: 60, top: 160, fontFamily: F.display, fontSize: 70}}>₹273</div>
        <div style={{position: 'absolute', left: 64, top: 240, fontFamily: F.mono, fontWeight: 700, fontSize: 20}}>20 OCT · PEAK</div>
        <div style={{position: 'absolute', right: 60, top: 330, fontFamily: F.display, fontSize: 70}}>₹247</div>
        <div style={{position: 'absolute', right: 64, top: 410, fontFamily: F.mono, fontWeight: 700, fontSize: 20}}>26 OCT</div>
      </Card>
      <Marker id="gl" d="M180,700 C300,690 380,740 480,760 S700,790 860,800" at={at + 6} dur={16} width={10} />
    </>
  );
};

const Gmp: React.FC = () => {
  const {at, word} = useCues();
  const l9 = at('L09'), l10 = at('L10'), l11 = at('L11');
  return (
    <AbsoluteFill>
      <Photo id="sim" src="jiosim.jpg" x={70} y={410} w={940} h={520} rot={-2} at={0} out={l9} enter="up" torn={{top: true, bottom: true}} rough={14} pos="40% 50%" caption="GREY MARKET" />
      <Card id="gmp" x={200} y={900} w={680} h={280} rot={2} at={word('L08', '247', -6)} out={l9} bg={C.yellow}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, textAlign: 'center', marginTop: 24}}>GMP · 26 OCT</div>
        <div style={{fontFamily: F.display, fontSize: 160, textAlign: 'center', lineHeight: 1.1}}>~₹247</div>
      </Card>
      <Hold from={l9} to={l11}>
        <Tile id="issue" y={430} at={l9} value="₹1,119" label={'ISSUE PRICE'} rot={-1.5} size={110} h={170} />
        <Tile id="plus" y={620} at={l9 + 8} op="+" value="₹247" label={'GMP\n(ANDAAZA)'} rot={1} size={110} h={170} />
        <Tile id="eq" y={810} at={word('L09', '1,366', -6)} op="≈" value={<HL at={word('L09', '1,366', 0)}>₹1,366</HL>} label={'KAL KA\nANDAAZA'} rot={-1} size={110} h={170} hi />
        <Card id="lotgain" x={110} y={1000} w={860} h={190} rot={1.5} at={l10} bg={C.card} z={30}>
          <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 40px'}}>
            <div style={{fontFamily: F.display, fontSize: 110, flex: 1}}>+₹2,964</div>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 2, textAlign: 'right'}}>PER LOT<br />247 × 12</div>
          </div>
        </Card>
        <Stamp id="agar" text="Agar!" x={800} y={1000} at={word('L10', 'agar', -2)} size={110} rot={10} />
      </Hold>
      <GmpLine at={l11} />
      <Stamp id="badalta" text="Andaaza badalta hai" x={540} y={1090} at={word('L11', 'badalta', -4)} size={76} rot={-5} paper />
    </AbsoluteFill>
  );
};

const Path: React.FC<{id: string; y: number; at: number; arrow: string; title: string; sub: string; bg: string; rot: number}> = ({id, y, at, arrow, title, sub, bg, rot}) => (
  <Card id={id} x={110} y={y} w={860} h={220} rot={rot} at={at} enter="right" bg={bg}>
    <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 40px', gap: 30}}>
      <div style={{fontFamily: F.display, fontSize: 150, width: 130, textAlign: 'center'}}>{arrow}</div>
      <div>
        <div style={{fontFamily: F.display, fontSize: 92, lineHeight: 1}}>{title}</div>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 2, marginTop: 10}}>{sub}</div>
      </div>
    </div>
  </Card>
);

const Paths: React.FC = () => {
  const {at, word} = useCues();
  return (
    <AbsoluteFill>
      <Headline words={['Kal:', '3', 'raaste']} at={0} out={at('L13')} size={200} y={540} />
      <Path id="p1" y={430} at={at('L13')} arrow="→" title="GMP KE AAS-PAAS" sub="~₹1,366 · SAB KHUSH" bg={C.card} rot={-1.5} />
      <Path id="p2" y={680} at={at('L14')} arrow="↗" title="GMP SE UPAR" sub="CRAZE AUR BADA" bg={C.yellow} rot={1} />
      <Path id="p3" y={930} at={at('L15')} arrow="↘" title="GMP SE NEECHE" sub="GREY MARKET GALAT" bg={C.card} rot={-1} />
      <Stamp id="before" text="Pehle bhi hua" x={760} y={1150} at={word('L15', 'pehle', -2)} size={70} rot={-7} />
    </AbsoluteFill>
  );
};

const Morning: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l17 = at('L17'), l18 = at('L18');
  const p = interpolate(stepped(frame), [word('L16', '9', 0), word('L16', '10', 0)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Card id="morning" x={80} y={430} w={920} h={420} rot={-1} at={0} enter="up" bg={C.card}>
        <div style={{padding: '28px 40px'}}><Label size={22}>Kal subah · 28 Oct</Label></div>
        <div style={{position: 'absolute', left: 60, right: 60, top: 150, height: 110, border: `4px solid ${C.ink}`, background: C.paperLight}} />
        <div style={{position: 'absolute', left: 64, top: 154, height: 102, width: 792 * 0.75 * p, background: C.yellow}} />
        <div style={{position: 'absolute', left: 64 + 792 * 0.75, top: 154, height: 102, width: 792 * 0.25, background: p >= 1 ? C.red : 'transparent'}} />
        <div style={{position: 'absolute', left: 80, top: 185, fontFamily: F.display, fontSize: 46}}>BOLI · PRE-OPEN</div>
        {p >= 1 ? <div style={{position: 'absolute', left: 64 + 792 * 0.75 + 20, top: 185, fontFamily: F.display, fontSize: 46, color: C.paperLight}}>DAAM</div> : null}
        {[['9:00', 0], ['9:45', 0.75], ['10:00', 1]].map(([t, x]) => (
          <div key={t as string} style={{position: 'absolute', left: 60 + 792 * (x as number) - 40, width: 90, top: 280, textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 24}}>{t}</div>
        ))}
        <div style={{position: 'absolute', left: 60, top: 340, fontFamily: F.mono, fontSize: 20, color: C.inkSoft}}>SPECIAL PRE-OPEN: ORDERS 9:00–9:45 · TRADING FROM 10:00</div>
      </Card>
      <Sfx at={word('L16', '10', 0)} name="stamp" volume={0.4} />
      <Note id="plan" x={110} y={900} w={860} h={290} at={l17} out={l18} rot={1.5} label="Aaj raat" size={50}>
        Bechna ya rakhna: <HL at={word('L17', 'panic', -2)}>panic nahi, plan</HL>
      </Note>
      <Tile id="tax" y={930} at={l18} value="20%" label={'SHORT-TERM TAX\nSIRF GAIN PE'} rot={-1} size={130} h={220} hi />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <SignOff shareLine="L19" logoLine="L20" shareWord="bhejo" friendNote="us dost ko jise Jio allot hua hai →"
    disclaimer={'EDUCATIONAL ONLY · NOT FINANCIAL ADVICE\nGMP: PUBLIC TRACKERS, 26 OCT 2026 · UNOFFICIAL\nLISTING 28 OCT (NSE / BSE) · ISSUE PRICE ₹1,119'} />
);

export const jioKal: EpisodeDef = {
  id: 'jio-listing-kal',
  topic: 'JIO: KAL LISTING',
  timeline: timeline as Timeline,
  scenes: {hook: Hook, hype: Hype, gmp: Gmp, paths: Paths, morning: Morning, outro: Outro},
};
