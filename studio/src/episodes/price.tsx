import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Bars, Headline, Hold, Note, SignOff, Tile} from '../components/kit';
import {Card, Circle, Cross, Hand, HL, Label, Marker, Photo, Sfx, Stamp} from '../components/paper';
import {EpisodeDef} from '../Episode';
import {clamp, stepped} from '../lib/motion';
import {Timeline, useCues} from '../lib/timeline';
import {C, F} from '../theme';
import timeline from '../data/ep05-price.json';

const BIDS: [string, number][] = [['99.90', 500], ['99.85', 1200], ['99.80', 900], ['99.75', 2000]];
const ASKS: [string, number][] = [['100.05', 300], ['100.10', 800], ['100.15', 1500], ['100.20', 600]];

// Paper order book. `fills` maps an ask row index to [cue frame, quantity left].
const OrderBook: React.FC<{at: number; out?: number; hiBids?: number; hiAsks?: number; fills?: Record<number, [number, number]>; y?: number}> = ({at, out, hiBids, hiAsks, fills = {}, y = 420}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  const row = (side: 'bid' | 'ask', [p, q]: [string, number], i: number) => {
    const fill = side === 'ask' ? fills[i] : undefined;
    const left = fill ? Math.round(interpolate(f, [fill[0], fill[0] + 10], [q, fill[1]], clamp)) : q;
    const gone = left === 0;
    return (
      <div key={side + i} style={{display: 'flex', justifyContent: 'space-between', padding: '12px 22px', borderBottom: `2px solid rgba(20,20,20,0.15)`, background: i === 0 ? (side === 'bid' ? 'rgba(245,197,24,0.35)' : 'rgba(210,52,31,0.12)') : 'transparent', opacity: gone ? 0.3 : 1, textDecoration: gone ? 'line-through' : 'none'}}>
        <span style={{fontFamily: F.display, fontSize: 52}}>₹{p}</span>
        <span style={{fontFamily: F.mono, fontWeight: 700, fontSize: 32, alignSelf: 'center'}}>{left.toLocaleString('en-IN')}</span>
      </div>
    );
  };
  const col = (title: string, rows: [string, number][], side: 'bid' | 'ask', hi?: number) => (
    <div style={{flex: 1, border: `4px solid ${C.ink}`, background: C.paperLight, boxShadow: hi !== undefined && frame >= hi ? `0 0 0 8px ${C.yellow}` : 'none'}}>
      <div style={{background: C.ink, color: C.paperLight, fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, padding: '10px 22px', display: 'flex', justifyContent: 'space-between'}}>
        <span>{title}</span><span>QTY</span>
      </div>
      {rows.map((r, i) => row(side, r, i))}
    </div>
  );
  return (
    <Card id="book" x={70} y={y} w={940} h={560} rot={-0.8} at={at} out={out} enter="up" bg={C.card}>
      <div style={{padding: '24px 30px'}}>
        <Label size={22}>Order book · ek share</Label>
        <div style={{display: 'flex', gap: 24, marginTop: 20}}>
          {col('BID · BUYERS', BIDS, 'bid', hiBids)}
          {col('ASK · SELLERS', ASKS, 'ask', hiAsks)}
        </div>
      </div>
    </Card>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l2 = at('L02'), l3 = at('L03');
  const tick = (100 + Math.sin(Math.floor(frame / 6) * 1.7) * 0.4).toFixed(2);
  return (
    <AbsoluteFill>
      <Photo id="bse" src="bse.jpg" x={80} y={400} w={920} h={600} rot={-2} at={0} out={l2} enter="up" torn={{top: true, bottom: true}} rough={14} pos="50% 35%" />
      <Card id="tick" x={170} y={900} w={740} h={240} rot={2} at={6} out={l2} bg={C.ink} texture="kraft">
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: C.yellow, textAlign: 'center', marginTop: 24}}>LIVE PRICE</div>
        <div style={{fontFamily: F.display, fontSize: 130, color: C.paperLight, textAlign: 'center'}}>₹{tick}</div>
      </Card>
      {[['COMPANY', 'company'], ['EXCHANGE', 'exchange'], ['SEBI', 'sebi']].map(([t, k], i) => (
        <React.Fragment key={k}>
          <Card id={'no' + k} x={130 + (i % 2) * 70} y={430 + i * 250} w={820} h={200} rot={[-2, 1.5, -1][i]} at={word('L02', k, -4)} out={l3} enter={i % 2 ? 'right' : 'left'} bg={C.card}>
            <div style={{fontFamily: F.display, fontSize: 120, textAlign: 'center', marginTop: 30}}>{t}</div>
          </Card>
          <Cross id={'xn' + k} x={200 + (i % 2) * 70} y={460 + i * 250} w={680} h={140} at={word('L02', k, 6)} out={l3} />
        </React.Fragment>
      ))}
      <Photo id="crowd" src="crowd.jpg" x={70} y={420} w={940} h={560} rot={1.5} at={l3} enter="up" torn={{top: true, bottom: true}} rough={14} zoom={0.06} />
      <Card id="aap" x={250} y={880} w={580} h={260} rot={-3} at={word('L03', 'aap', -2)} bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 200, textAlign: 'center', lineHeight: 1.25}}>AAP.</div>
      </Card>
    </AbsoluteFill>
  );
};

const Book: React.FC = () => {
  const {at, word} = useCues();
  const l8 = at('L08');
  return (
    <AbsoluteFill>
      <OrderBook at={0} hiBids={word('L05', 'bid', -2)} hiAsks={word('L06', 'ask', -2)} />
      <Circle id="bb" cx={300} cy={588} rx={210} ry={52} at={word('L07', '99.90', -2)} color={C.ink} />
      <Circle id="ba" cx={770} cy={588} rx={210} ry={52} at={word('L07', '100.05', -2)} />
      <Hold from={l8}>
        <Card id="spread" x={210} y={1010} w={660} h={190} rot={-2} at={l8} bg={C.yellow}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, textAlign: 'center', marginTop: 20}}>SPREAD · 100.05 − 99.90</div>
          <div style={{fontFamily: F.display, fontSize: 100, textAlign: 'center'}}>15 PAISE</div>
        </Card>
        <Stamp id="nt" text="No trade" x={800} y={990} at={word('L08', 'trade', -2)} size={64} rot={-10} />
      </Hold>
    </AbsoluteFill>
  );
};

const Trade: React.FC = () => {
  const {at, word} = useCues();
  const l10 = at('L10'), l11 = at('L11'), l12 = at('L12'), l13 = at('L13');
  return (
    <AbsoluteFill>
      <OrderBook at={0} out={l12} fills={{0: [word('L10', '300', -2), 0], 1: [word('L11', '100.10', -4), 100]}} />
      <Card id="mo" x={150} y={1010} w={780} h={190} rot={2} at={0} out={l12} bg={C.ink} texture="kraft">
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: C.yellow, textAlign: 'center', marginTop: 22}}>MARKET ORDER</div>
        <div style={{fontFamily: F.display, fontSize: 96, color: C.paperLight, textAlign: 'center'}}>BUY 1,000 · ANY PRICE</div>
      </Card>
      <Hand x={140} y={960} at={l10} out={l12} size={46} rot={-4} color={C.red}>300 @ 100.05 ✓</Hand>
      <Hand x={580} y={960} at={l11} out={l12} size={46} rot={-3} color={C.red}>700 @ 100.10 ✓</Hand>
      <Tile id="ltp" y={480} at={l12} value={<HL at={word('L12', 'naya', -2)}>₹100.10</HL>} label={'NAYA PRICE\nAAKHRI TRADE'} hi rot={-1.5} size={140} h={220} />
      <Sfx at={word('L12', 'naya', 0)} name="coin" volume={0.2} />
      <Note id="ltpn" x={110} y={760} w={860} h={330} at={l13} rot={1} label="LTP" size={52}>
        Last Traded Price = screen pe dikhne wala price
      </Note>
    </AbsoluteFill>
  );
};

const Move: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l16 = at('L16'), l17 = at('L17');
  const steps = (dir: 1 | -1) => {
    let d = `M140,${dir > 0 ? 1050 : 520}`;
    for (let i = 0; i < 6; i++) d += ` h120 v${-dir * 90}`;
    return d;
  };
  return (
    <AbsoluteFill>
      <Hold to={l17}>
        <Card id="stairs" x={80} y={420} w={920} h={760} rot={-1} at={0} enter="up" bg={C.card}>
          <div style={{padding: 30}}>
            <Label size={22}>{frame < l16 ? 'Buyers jaldi mein: asks khaate jaao' : 'Sellers jaldi mein: bids pe becho'}</Label>
          </div>
        </Card>
        <Marker id="up" d={steps(1)} at={word('L14', 'jaldi', -2)} out={l16} dur={40} color={C.ink} width={9} />
        <Hold from={word('L15', 'seedhi', 0)} to={l16}><div style={{position: 'absolute', left: 780, top: 450, fontFamily: F.display, fontSize: 110, color: C.ink, zIndex: 70}}>↗ ₹</div></Hold>
        <Marker id="down" d={steps(-1)} at={l16 + 2} dur={20} color={C.red} width={9} />
        <Hold from={word('L16', 'neeche', -2)}><div style={{position: 'absolute', left: 780, top: 980, fontFamily: F.display, fontSize: 110, color: C.red, zIndex: 70}}>↘ ₹</div></Hold>
      </Hold>
      <Card id="good" x={80} y={440} w={430} h={520} rot={-2} at={l17} enter="left" bg={C.yellow}>
        <div style={{padding: 30}}>
          <Label size={22}>Achhi khabar</Label>
          <div style={{fontFamily: F.display, fontSize: 84, lineHeight: 1, marginTop: 20}}>BUYERS KI LINE</div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 30}}>{Array.from({length: 10}).map((_, i) => <div key={i} style={{width: 44, height: 44, borderRadius: 22, background: C.ink}} />)}</div>
          <div style={{fontFamily: F.display, fontSize: 90, marginTop: 20}}>PRICE ↑</div>
        </div>
      </Card>
      <Card id="bad" x={570} y={480} w={430} h={520} rot={2} at={word('L17', 'buri', -4)} enter="right" bg={C.card}>
        <div style={{padding: 30}}>
          <Label size={22}>Buri khabar</Label>
          <div style={{fontFamily: F.display, fontSize: 84, lineHeight: 1, marginTop: 20}}>SELLERS KI LINE</div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 30}}>{Array.from({length: 10}).map((_, i) => <div key={i} style={{width: 44, height: 44, borderRadius: 22, background: C.red}} />)}</div>
          <div style={{fontFamily: F.display, fontSize: 90, marginTop: 20, color: C.red}}>PRICE ↓</div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

const Open: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l19 = at('L19'), l20 = at('L20'), l21 = at('L21');
  const slots = [['9:00', 'Orders jama', 'L19', '9'], ['9:08', 'Price discovery', 'L20', 'exchange'], ['9:15', 'Normal trading', 'L21', '9:15']];
  return (
    <AbsoluteFill>
      <Hold to={l20}>
        <Card id="clock" x={80} y={420} w={920} h={420} rot={-1} at={0} enter="up" bg={C.card}>
          <div style={{padding: 30}}>
            <Label size={22}>Pre-open session · NSE / BSE</Label>
            <div style={{display: 'flex', gap: 20, marginTop: 30}}>
              {slots.map(([t, s, l, k], i) => (
                <div key={t} style={{flex: 1, border: `4px solid ${C.ink}`, padding: '16px 10px', textAlign: 'center', background: i === 0 ? C.yellow : C.paperLight, opacity: frame >= (i === 0 ? 0 : word(l, k, -4)) ? 1 : 0.3}}>
                  <div style={{fontFamily: F.display, fontSize: 84}}>{t}</div>
                  <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, marginTop: 6}}>{s.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Stamp id="nt2" text="No trade" sub="SIRF ORDERS" x={320} y={960} at={word('L19', 'trade', -2)} size={80} rot={-6} />
      </Hold>
      <Hold from={l20}>
        <Bars id="auction" at={l20} title="Kis price pe kitne shares trade ho sakte? (example)" max={30} note="EXCHANGE CHUNTA HAI: MAXIMUM VOLUME"
          bars={[
            {label: '₹99', value: 9, text: '9K', at: l20 + 6},
            {label: '₹100', value: 18, text: '18K', at: l20 + 10},
            {label: '₹101', value: 27, text: '27K', at: l20 + 14, hi: true},
            {label: '₹102', value: 14, text: '14K', at: l20 + 18},
          ]} />
        <Stamp id="op" text="Opening ₹101" x={560} y={1130} at={word('L21', 'opening', -2)} size={84} rot={-6} paper />
      </Hold>
    </AbsoluteFill>
  );
};

const Band: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l23 = at('L23');
  const p = interpolate(stepped(frame), [l23, l23 + 30], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Card id="band" x={80} y={420} w={920} h={760} rot={-1} at={0} enter="up" bg={C.card}>
        <div style={{padding: 30}}>
          <Label size={22}>Price band (circuit)</Label>
          <div style={{display: 'flex', gap: 14, marginTop: 26}}>
            {['2%', '5%', '10%', '20%'].map((b, i) => (
              <div key={b} style={{flex: 1, textAlign: 'center', fontFamily: F.display, fontSize: 80, border: `4px solid ${C.ink}`, background: i === 2 ? C.yellow : C.paperLight, opacity: frame >= word('L22', b.replace('%', ''), -4) ? 1 : 0.25}}>{b}</div>
            ))}
          </div>
        </div>
      </Card>
      <div style={{position: 'absolute', left: 140, top: 760, width: 800, height: 300, zIndex: 66}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 30, borderTop: `5px dashed ${C.red}`}} />
        <div style={{position: 'absolute', right: 0, top: -12, fontFamily: F.mono, fontWeight: 700, fontSize: 22, color: C.red}}>UPPER BAND +10%</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 270, borderTop: `5px dashed ${C.red}`}} />
        <div style={{position: 'absolute', right: 0, top: 280, fontFamily: F.mono, fontWeight: 700, fontSize: 22, color: C.red}}>LOWER BAND −10%</div>
        <svg width={800} height={300} style={{position: 'absolute', inset: 0}}>
          <path d="M0,150 L120,130 L220,160 L320,110 L420,90 L520,60 L620,40 L700,32 L800,32" fill="none" stroke={C.ink} strokeWidth={7} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
        </svg>
      </div>
      <Stamp id="uc" text="Upper circuit" sub="AAGE TRADE NAHI" x={600} y={1110} at={word('L23', 'trade', -6)} size={72} rot={-6} paper />
    </AbsoluteFill>
  );
};

const Long: React.FC = () => {
  const {at, word} = useCues();
  const l25 = at('L25');
  return (
    <AbsoluteFill>
      <Tile id="earn" y={440} at={0} value={<HL at={word('L24', 'kamaai', -2)}>KAMAAI</HL>} label={'LAMBE SAMAY KA\nINJAN'} rot={-1.5} size={130} h={210} />
      <Card id="vote" x={80} y={700} w={430} h={480} rot={-2} at={word('L25', 'voting', -4)} enter="left" bg={C.card}>
        <div style={{padding: 30}}>
          <Label size={22}>Short term</Label>
          <div style={{fontFamily: F.display, fontSize: 96, lineHeight: 1, marginTop: 20}}>VOTING MACHINE</div>
          <div style={{fontFamily: F.sans, fontWeight: 700, fontSize: 32, marginTop: 20}}>mood, khabar, dar, laalach</div>
        </div>
      </Card>
      <Card id="weigh" x={570} y={740} w={430} h={480} rot={2} at={word('L25', 'weighing', -4)} enter="right" bg={C.yellow}>
        <div style={{padding: 30}}>
          <Label size={22}>Long term</Label>
          <div style={{fontFamily: F.display, fontSize: 96, lineHeight: 1, marginTop: 20}}>WEIGHING MACHINE</div>
          <div style={{fontFamily: F.sans, fontWeight: 700, fontSize: 32, marginTop: 20}}>profit, cash, growth</div>
        </div>
      </Card>
      <Hand x={140} y={650} at={l25} size={44} rot={-2}>— Benjamin Graham</Hand>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <SignOff shareLine="L26" logoLine="L27" shareWord="bhejo" friendNote="us dost ko jo kehta hai 'market manipulated hai' →"
    disclaimer={'EDUCATIONAL ONLY · NOT INVESTMENT ADVICE\nORDER BOOK & AUCTION NUMBERS ARE EXAMPLES · PRE-OPEN: NSE'} />
);

export const price: EpisodeDef = {
  id: 'share-price',
  topic: 'SHARE PRICE',
  timeline: timeline as Timeline,
  scenes: {hook: Hook, book: Book, trade: Trade, move: Move, open: Open, band: Band, long: Long, outro: Outro},
};
