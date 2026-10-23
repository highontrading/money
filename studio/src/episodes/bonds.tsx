import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Bars, Headline, Hold, Note, SignOff, Tile} from '../components/kit';
import {Card, Count, Cross, Hand, HL, Label, Photo, Sfx, Stamp, Tape} from '../components/paper';
import {EpisodeDef} from '../Episode';
import {clamp, stepped} from '../lib/motion';
import {Timeline, useCues} from '../lib/timeline';
import {C, F} from '../theme';
import timeline from '../data/ep03-bonds.json';

// Paper see-saw: rate on the left, bond price on the right. `keys` are
// [frame, angle] pairs; positive angle = left end up (rates up, price down).
const Seesaw: React.FC<{x?: number; y?: number; w?: number; keys: [number, number][]; left?: string; right?: string; at: number; out?: number}> = ({x = 120, y = 760, w = 840, keys, left = 'RATE', right = 'PRICE', at, out}) => {
  const frame = useCurrentFrame();
  if (frame < at || (out !== undefined && frame >= out)) return null;
  const f = stepped(frame);
  const angle = keys.length > 1 ? interpolate(f, keys.map((k) => k[0]), keys.map((k) => k[1]), clamp) : keys[0][1];
  return (
    <>
      <div style={{position: 'absolute', left: x + w / 2 - 70, top: y + 10, width: 0, height: 0, borderLeft: '70px solid transparent', borderRight: '70px solid transparent', borderBottom: `150px solid ${C.ink}`, zIndex: 40}} />
      <div style={{position: 'absolute', left: x, top: y - 14, width: w, height: 28, transform: `rotate(${-angle}deg)`, transformOrigin: '50% 50%', zIndex: 41}}>
        <div style={{position: 'absolute', inset: 0, background: C.kraft, border: `3px solid ${C.ink}`, boxShadow: `4px 8px 10px ${C.shadow}`}} />
        <div style={{position: 'absolute', left: -10, bottom: 26, width: 300, height: 150, background: C.yellow, border: `4px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: 64, boxShadow: `4px 8px 10px ${C.shadow}`}}>{left}</div>
        <div style={{position: 'absolute', right: -10, bottom: 26, width: 300, height: 150, background: C.paperLight, border: `4px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: 64, boxShadow: `4px 8px 10px ${C.shadow}`}}>{right}</div>
      </div>
    </>
  );
};

const Hook: React.FC = () => {
  const {at, word} = useCues();
  const l2 = at('L02'), l3 = at('L03');
  const up = word('L01', 'badha', -2);
  return (
    <AbsoluteFill>
      <Seesaw at={0} out={l3} y={820} keys={[[0, 0], [up, 0], [up + 10, 14]]} left="RATE ↑" right="PRICE ↓" />
      <Stamp id="loss" text="Nuksaan" x={760} y={470} at={word('L01', 'nuksaan', -2)} out={l3} size={96} rot={-8} />
      <Hand x={140} y={470} at={l2} out={l3} size={90} rot={-4} color={C.red}>ulta kyun?!</Hand>
      <Headline words={['The', 'see-saw']} at={l3} y={420} size={160} label="Interest rate vs bond price" />
      <Seesaw at={l3 + 8} y={1060} w={760} keys={[[l3 + 8, -12], [l3 + 30, 12], [l3 + 52, -12], [l3 + 74, 12]]} left="RATE" right="PRICE" />
    </AbsoluteFill>
  );
};

const Bond: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l5 = at('L05'), l6 = at('L06'), l7 = at('L07');
  return (
    <AbsoluteFill>
      <Note id="loan" x={110} y={440} w={860} h={330} at={0} rot={-1.5} label="Bond = loan" size={50}>
        Aap → <HL at={word('L04', 'sarkar')}>sarkar / company</HL><br />Woh aapko interest dete hain
      </Note>
      <Card id="cert" x={110} y={800} w={860} h={420} rot={1} at={l5 - 2} enter="up" bg={C.paperLight}>
        <div style={{position: 'absolute', inset: 16, border: `3px double ${C.ink}`}} />
        <div style={{padding: '40px 56px', fontFamily: F.type, fontSize: 40, lineHeight: 1.6}}>
          <div style={{fontFamily: F.display, fontSize: 60, letterSpacing: 4, textAlign: 'center'}}>BOND CERTIFICATE</div>
          <div>FACE VALUE ........ <HL at={word('L05', '1,000')}>₹1,000</HL></div>
          <div>MATURITY .......... <HL at={word('L05', 'saal')}>10 SAAL</HL></div>
          <div>COUPON ............ <HL at={word('L05', 'coupon')}>7% · ₹70/saal</HL></div>
        </div>
      </Card>
      <Hold from={l6}>
        <Card id="coupons" x={80} y={430} w={920} h={330} rot={-1} at={l6} enter="right" bg={C.card}>
          <div style={{padding: '26px 30px'}}><Label size={22}>10 saal ka cash-flow</Label></div>
          <div style={{display: 'flex', gap: 10, padding: '0 30px', alignItems: 'flex-end'}}>
            {Array.from({length: 10}).map((_, i) => {
              const on = stepped(frame) >= l6 + 4 + i * 3;
              return (
                <div key={i} style={{flex: 1, textAlign: 'center', opacity: on ? 1 : 0}}>
                  <div style={{height: i === 9 ? 170 : 70, background: i === 9 ? C.yellow : C.paperLight, border: `3px dashed ${C.ink}`, fontFamily: F.display, fontSize: i === 9 ? 24 : 30, lineHeight: 1.1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>{i === 9 ? <span>₹70<br />+<br />₹1,000</span> : '₹70'}</div>
                  <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 18, marginTop: 6}}>Y{i + 1}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </Hold>
      <Stamp id="fixed" text="Fixed ₹70" sub="BAZAAR KUCH BHI KARE" x={560} y={1000} at={word('L07', 'fix', -2)} size={100} rot={-6} paper />
    </AbsoluteFill>
  );
};

const BondCard: React.FC<{id: string; x: number; y: number; at: number; out?: number; title: string; rate: string; pays: string; hi?: boolean; rot: number}> = ({id, x, y, at, out, title, rate, pays, hi, rot}) => (
  <Card id={id} x={x} y={y} w={430} h={340} rot={rot} at={at} out={out} enter={x < 400 ? 'left' : 'right'} bg={hi ? C.yellow : C.card}>
    <div style={{padding: 30}}>
      <Label size={22}>{title}</Label>
      <div style={{fontFamily: F.display, fontSize: 130, lineHeight: 1, marginTop: 14}}>{rate}</div>
      <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 40, marginTop: 8}}>{pays}</div>
    </div>
  </Card>
);

const Rise: React.FC = () => {
  const {at, word} = useCues();
  const l10 = at('L10'), l11 = at('L11'), l12 = at('L12');
  return (
    <AbsoluteFill>
      <BondCard id="old" x={80} y={420} at={0} title="Aapka purana bond" rate="7%" pays="₹70 / saal" rot={-2} />
      <BondCard id="new" x={570} y={450} at={word('L08', 'naye', -4)} title="Naya bond" rate="8%" pays="₹80 / saal" hi rot={2} />
      <Hold from={l10} to={l12}>
        <Tile id="ask" y={850} at={l10} op="" value="₹1,000 ?" label={'PURANE BOND KI\nKEEMAT'} rot={-1} />
      </Hold>
      <Cross id="x1000" x={160} y={870} w={360} h={130} at={word('L10', 'koi', 0)} out={l12} />
      <Hand x={120} y={1060} at={l11} out={l12} size={52} rot={-2} w={880}>discount do, taaki khareedar ko bhi 8% mile</Hand>
      <Tile id="933" y={850} at={l12} op="" value={<HL at={word('L12', '933')}><Count from={1000} to={933} at={l12 + 2} dur={18} /></HL>} label={'NAYA PRICE\nYIELD = 8%'} rot={-1} />
      <Sfx at={word('L12', '933', 0)} name="coin" volume={0.2} />
      <Stamp id="down" text="Price ↓" x={780} y={1150} at={word('L12', '933', 6)} size={70} rot={-8} />
    </AbsoluteFill>
  );
};

const Fall: React.FC = () => {
  const {at, word} = useCues();
  const l14 = at('L14'), l15 = at('L15'), l16 = at('L16');
  return (
    <AbsoluteFill>
      <Tile id="r6" y={430} at={0} out={l16} op="" value="Rate → 6%" label={'RATES GIRE'} rot={-1.5} />
      <BondCard id="new6" x={80} y={640} at={l14} out={l16} title="Naya bond" rate="6%" pays="₹60 / saal" rot={-2} />
      <BondCard id="old7" x={570} y={660} at={word('L14', 'aapka', -2)} out={l16} title="Aapka bond" rate="7%" pays="₹70 / saal" hi rot={2} />
      <Hold from={l15} to={l16}>
        <Card id="1074" x={240} y={1020} w={600} h={170} rot={-2} at={l15} bg={C.card}>
          <div style={{fontFamily: F.display, fontSize: 110, textAlign: 'center', marginTop: 20}}><HL at={word('L15', '1,074')}><Count from={1000} to={1074} at={l15 + 4} dur={18} /></HL> ↑</div>
        </Card>
      </Hold>
      <Headline words={['Rate', 'upar,', 'price', 'neeche']} at={l16} y={440} size={150} />
      <Seesaw at={l16 + 4} y={1010} w={820} keys={[[l16 + 4, 0], [word('L16', 'upar', 0), 13], [word('L16', 'neeche,', 6), 13], [word('L16', 'neeche,', 16), -13]]} left="RATE" right="PRICE" />
    </AbsoluteFill>
  );
};

const Yield: React.FC = () => {
  const {at, word} = useCues();
  const l18 = at('L18');
  return (
    <AbsoluteFill>
      <Note id="yield" x={110} y={420} w={860} h={420} at={0} rot={-1.5} bg={C.yellow} label="Definition" size={46}>
        YIELD = naye khareedar ka <span style={{textDecoration: 'underline'}}>asli return</span><br />(₹933 do, ₹70 + ₹1,000 lo → 8%)
      </Note>
      <Card id="news" x={100} y={870} w={880} h={340} rot={1.5} at={l18} enter="right" bg={C.newsprint} texture="news" torn={{left: true, right: true, top: true, bottom: true}} rough={8}>
        <div style={{padding: '30px 50px'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: 3, borderBottom: `3px double ${C.ink}`, paddingBottom: 8}}>MARKETS · TODAY</div>
          <div style={{fontFamily: F.display, fontSize: 104, lineHeight: 1, marginTop: 16}}>BOND YIELDS <HL at={word('L18', 'up', -2)}>UP</HL></div>
          <div style={{marginTop: 20}}>{Array.from({length: 6}).map((_, i) => <div key={i} style={{height: 9, background: 'rgba(30,30,30,0.22)', marginBottom: 9, width: `${60 + ((i * 29) % 35)}%`}} />)}</div>
        </div>
      </Card>
      <Hand x={560} y={1170} at={word('L18', 'down', -4)} size={64} rot={-4} color={C.red}>= prices DOWN</Hand>
    </AbsoluteFill>
  );
};

const Duration: React.FC = () => {
  const {at, word} = useCues();
  const l20 = at('L20'), l21 = at('L21');
  return (
    <AbsoluteFill>
      <Headline words={['Lamba', 'bond', 'zyada', 'hilta']} at={0} out={l20} size={170} label="Duration ka twist" />
      <Bars id="drop" at={l20 - 2} h={720} title="Rate 7% → 8%: price kitna gira?" max={80} note="₹1,000 FACE, 7% COUPON · EXACT PRESENT VALUE"
        bars={[
          {label: '2 SAAL\n₹1,000 → ₹982', value: 18, text: '−₹18', at: word('L20', '982', -4), color: C.paperLight},
          {label: '10 SAAL\n₹1,000 → ₹933', value: 67, text: '−₹67', at: word('L20', '933', -4), color: C.red},
        ]} />
      <Hand x={260} y={1160} at={l21} size={48} rot={-2}>zyada saal = zyada der kam interest</Hand>
    </AbsoluteFill>
  );
};

const You: React.FC = () => {
  const {at, word} = useCues();
  const l23 = at('L23'), l24 = at('L24'), l25 = at('L25');
  return (
    <AbsoluteFill>
      <Card id="nav" x={80} y={420} w={920} h={330} rot={-1} at={0} out={l24} enter="up" bg={C.card}>
        <div style={{padding: 34}}>
          <Label size={22}>Debt mutual fund</Label>
          <div style={{fontFamily: F.display, fontSize: 96, marginTop: 14}}>RATE ↑ = <HL at={word('L22', 'nav')}>NAV ↓</HL></div>
          <div style={{fontFamily: F.sans, fontWeight: 700, fontSize: 34, marginTop: 8}}>fund ke andar bhi bonds hi hain</div>
        </div>
      </Card>
      <Hold from={l23} to={l24}>
        {[['Liquid', 8], ['Short duration', 25], ['Gilt / long', 70]].map(([t, v], i) => (
          <Card key={t as string} id={'d' + i} x={80 + i * 310} y={790} w={290} h={360} rot={[-2, 1, 2][i]} at={l23 + i * 6} bg={i === 2 ? C.yellow : C.card}>
            <div style={{padding: 20}}>
              <div style={{fontFamily: F.display, fontSize: 44, lineHeight: 1}}>{(t as string).toUpperCase()}</div>
              <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20, marginTop: 10}}>RATE SENSITIVITY</div>
              <div style={{height: 26, background: C.paperLight, border: `3px solid ${C.ink}`, marginTop: 20}}>
                <div style={{width: `${v}%`, height: '100%', background: C.red}} />
              </div>
            </div>
          </Card>
        ))}
      </Hold>
      <Card id="hold" x={80} y={430} w={920} h={420} rot={-1} at={l24} out={l25} enter="up" bg={C.paperLight}>
        <div style={{padding: 34}}>
          <Label size={22}>Maturity tak hold</Label>
          <svg width={850} height={180} style={{marginTop: 20}}>
            <path d="M10,90 C120,20 200,160 320,80 S520,150 640,60 S760,110 820,90" fill="none" stroke={C.inkSoft} strokeWidth={5} strokeDasharray="12 8" />
            <circle cx={820} cy={90} r={14} fill={C.red} />
          </svg>
          <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 40}}>beech mein upar-neeche, end mein <HL at={word('L24', 'wapas', -4)}>₹1,000 wapas</HL></div>
        </div>
      </Card>
      <Hold from={l25}>
        <Photo id="rbi2" src="rbi.jpg" x={90} y={420} w={900} h={520} rot={-2} at={l25} enter="up" torn={{top: true, bottom: true}} rough={14} caption="RBI · REPO 5.50% · 7 OCT 2026" />
        <Hand x={140} y={980} at={word('L25', 'saans', -4)} size={58} rot={-3}>har policy = bond market ki dhadkan</Hand>
      </Hold>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <SignOff shareLine="L26" logoLine="L27" shareWord="bhejo" friendNote="us dost ko jo debt fund ko 'safe' samajhta hai →"
    disclaimer={'EDUCATIONAL ONLY · NOT INVESTMENT ADVICE\nPRICES: 7% COUPON, ₹1,000 FACE, EXACT PV · REPO: RBI, 7 OCT 2026'} />
);

export const bonds: EpisodeDef = {
  id: 'bonds',
  topic: 'BONDS',
  timeline: timeline as Timeline,
  scenes: {hook: Hook, bond: Bond, rise: Rise, fall: Fall, yield: Yield, duration: Duration, you: You, outro: Outro},
};
