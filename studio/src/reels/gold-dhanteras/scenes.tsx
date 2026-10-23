import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, Card, Circle, Count, Cross, Hand, HL, Label, Marker, Sfx, Stamp, Tape} from '../../components/paper';
import {clamp, ease, stepped} from '../../lib/motion';
import {useCues} from '../../lib/timeline';
import {C, F} from '../../theme';
import {SignOff} from '../common';
import {BillRow, Chain, Chip, GOLD_DARK, GoldBar, Scale, Scissors, Sign} from './props';

const grid = (cell = 40, color = 'rgba(70, 110, 150, 0.16)') => ({
  backgroundImage: `linear-gradient(${color} 1.5px, transparent 1.5px), linear-gradient(90deg, ${color} 1.5px, transparent 1.5px)`,
  backgroundSize: `${cell}px ${cell}px`,
});

const VELVET = '#2a2826';

// Big math row: operator, amount, small label.
const Row: React.FC<{id: string; y: number; at: number; out?: number; op?: string; value: React.ReactNode; label: string; hi?: boolean; rot?: number}> = ({id, y, at, out, op = '', value, label, hi, rot = 0}) => (
  <Card id={id} x={110} y={y} w={860} h={170} rot={rot} at={at} out={out} enter="right" bg={hi ? C.yellow : C.card}>
    <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 40px'}}>
      <div style={{fontFamily: F.display, fontSize: 96, width: 80, color: C.inkSoft}}>{op}</div>
      <div style={{fontFamily: F.display, fontSize: 100, flex: 1, whiteSpace: 'nowrap'}}>{value}</div>
      <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 2, textAlign: 'right', width: 210, lineHeight: 1.35, whiteSpace: 'pre-line'}}>{label}</div>
    </div>
  </Card>
);

// ------------------------------------------------------------------ hook
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l2 = at('L02'), l3 = at('L03'), l4 = at('L04'), l5 = at('L05');
  const phir = word('L04', 'phir', -2);
  const cutStart = l5 + 10;
  const cutP = interpolate(stepped(frame), [cutStart, cutStart + 40], [0, 1], clamp);
  return (
    <AbsoluteFill>
      {/* L01: a 10 gram chain on velvet */}
      <Card id="velvet" x={110} y={420} w={860} h={640} rot={-1.5} at={0} out={l2} enter="up" bg={VELVET} texture="kraft" torn={{top: true, bottom: true}} rough={12}>
        <div style={{position: 'absolute', left: 80, top: 30, width: 700, height: 520}}>
          <Chain w={700} h={520} />
        </div>
      </Card>
      <Card id="dtag" x={590} y={385} w={340} h={112} rot={5} at={word('L01', 'dhanteras', -4)} out={l2} bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 70, textAlign: 'center', marginTop: 16}}>DHANTERAS</div>
      </Card>
      <Tape id="dtt" x={700} y={372} w={120} rot={-10} at={word('L01', 'dhanteras')} out={l2} />
      <Chip id="g10" x={150} y={980} w={330} h={120} rot={-4} at={word('L01', '10', -3)} out={l2} size={72}>10 gram</Chip>

      {/* L02: the bill */}
      <Card id="bill1" x={110} y={410} w={860} h={330} rot={-1} at={l2} out={phir} enter="right" bg={C.paperLight}>
        <div style={{padding: '30px 46px'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: C.inkSoft, borderBottom: `3px double ${C.ink}`, paddingBottom: 8}}>TAX INVOICE · 22K CHAIN · 10 G</div>
          <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 20}}>
            <div style={{fontFamily: F.type, fontSize: 50}}>Diye</div>
            <div style={{fontFamily: F.display, fontSize: 150, lineHeight: 1.05}}><HL at={word('L02', '1,15,360')}>₹1,15,360</HL></div>
          </div>
        </div>
      </Card>

      {/* L03: next day, sold back */}
      <Card id="bill2" x={110} y={790} w={860} h={330} rot={1.2} at={l3} out={phir} enter="left" bg={C.card}>
        <div style={{padding: '30px 46px'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: C.inkSoft, borderBottom: `3px double ${C.ink}`, paddingBottom: 8}}>BUYBACK SLIP · AGLE DIN</div>
          <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 20}}>
            <div style={{fontFamily: F.type, fontSize: 50}}>Mile</div>
            <div style={{fontFamily: F.display, fontSize: 150, lineHeight: 1.05}}>
              {frame >= word('L03', '97,000', -2) ? <HL at={word('L03', '97,000')}>₹97,000</HL> : <span style={{opacity: 0.2}}>₹ ?</span>}
            </div>
          </div>
        </div>
      </Card>
      <Hand x={640} y={736} at={word('L03', 'agle', 0)} out={word('L04', 'sona', -2)} size={56} rot={-5}>1 din baad ↓</Hand>

      {/* L04: same gold, same rate */}
      <Stamp id="sw" text="Sona wahi" x={360} y={760} at={word('L04', 'sona', -2)} out={phir} size={66} rot={-7} color={C.ink} />
      <Stamp id="rw" text="Rate wahi" x={720} y={772} at={word('L04', 'rate', -2)} out={phir} size={66} rot={5} color={C.ink} />
      {frame >= phir && frame < l5 + 6 ? (
        <div style={{position: 'absolute', left: 90, right: 120, top: 470, opacity: frame >= l5 ? 1 - ease(frame, l5, l5 + 6) : 1}}>
          <Big words={['₹18,360']} at={word('L04', '18,360', -2)} size={230} align="center" color={C.red} />
        </div>
      ) : null}
      {frame >= phir && frame < l5 + 6 ? (
        <div style={{position: 'absolute', left: 90, right: 120, top: 760, opacity: frame >= l5 ? 1 - ease(frame, l5, l5 + 6) : 1}}>
          <Big words={['KAHAN', 'GAYE?']} at={word('L04', 'kahan', -2)} gap={6} size={190} align="center" />
        </div>
      ) : null}

      {/* L05: cut the bill into pieces */}
      <Card id="cutbill" x={220} y={420} w={640} h={700} rot={-1} at={l5 - 2} enter="drop" bg={C.paperLight}>
        <div style={{padding: '30px 40px'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: C.inkSoft, borderBottom: `3px double ${C.ink}`, paddingBottom: 8}}>TAX INVOICE</div>
          {['Tukda 1', 'Tukda 2', 'Tukda 3'].map((t, i) => (
            <div key={t} style={{height: 170, borderBottom: i < 2 ? `4px dashed ${C.inkSoft}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div style={{fontFamily: F.type, fontSize: 46}}>{t}</div>
              <div style={{fontFamily: F.display, fontSize: 70, color: C.grey}}>₹ ?</div>
            </div>
          ))}
          <div style={{fontFamily: F.display, fontSize: 64, marginTop: 14, textAlign: 'right'}}>₹1,15,360</div>
        </div>
      </Card>
      {frame >= cutStart && frame < cutStart + 44 ? <Scissors x={880 - cutP * 640} y={420 + 30 + 46 + 170} rot={0} phase={stepped(frame) * 0.5} /> : null}
      <Sfx at={cutStart} name="slide" volume={0.3} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ rate
const Rate: React.FC = () => {
  const {at, word} = useCues();
  const l7 = at('L07');
  return (
    <AbsoluteFill>
      <Hand x={130} y={410} at={word('L06', 'maan', -2)} size={64} rot={-4}>maan lo...</Hand>
      <GoldBar id="bar" x={230} y={480} w={620} h={240} at={word('L06', '22', -4)} rot={-2}>
        <div style={{fontFamily: F.display, fontSize: 96, letterSpacing: 4, color: GOLD_DARK}}>22 CARAT</div>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: GOLD_DARK}}>10 GRAM</div>
      </GoldBar>
      <Card id="ratecard" x={150} y={780} w={780} h={300} rot={1.5} at={word('L06', 'rate', -4)} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid(36)}} />
        <div style={{position: 'relative', padding: '30px 44px'}}>
          <Label size={24}>Rate · 22 carat</Label>
          <div style={{fontFamily: F.display, fontSize: 150, lineHeight: 1.05, marginTop: 10}}>
            <HL at={word('L06', '1,00,000', 4)}><Count from={0} to={100000} at={word('L06', '1,00,000', -2)} dur={12} /></HL>
          </div>
          <div style={{position: 'absolute', right: 44, top: 40, fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 3, opacity: 0.85}}>PER 10 G</div>
        </div>
      </Card>
      <Stamp id="asli" text="Asli keemat" x={680} y={480} at={word('L07', 'asli', -2)} size={70} rot={8} color={C.ink} paper />
      <Card id="t1" x={150} y={1100} w={460} h={110} rot={-3} at={word('L07', 'pehla', -2)} bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 62, textAlign: 'center', marginTop: 18}}>TUKDA 1 · SONA</div>
      </Card>
      <Tape id="t1t" x={520} y={1088} w={110} rot={12} at={word('L07', 'pehla')} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ making
const Making: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l10 = at('L10'), l11 = at('L11');
  // scale 0..30 % across the ruler
  const rx0 = 170, rw = 740;
  const px = (p: number) => rx0 + (p / 30) * rw;
  const bandP = ease(stepped(frame), word('L10', '25%', -4), word('L10', '25%', 6));
  return (
    <AbsoluteFill>
      {/* L08 */}
      <Card id="mhead" x={110} y={420} w={860} h={230} rot={-1.5} at={0} out={l10} enter="left" bg={C.yellow} torn={{right: true}}>
        <div style={{padding: '26px 44px'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 28, letterSpacing: 4}}>TUKDA 2</div>
          <div style={{fontFamily: F.display, fontSize: 104, lineHeight: 1.1, whiteSpace: 'nowrap'}}>MAKING CHARGES</div>
        </div>
      </Card>
      {/* L09: what you pay for */}
      <Chip id="mz" x={110} y={720} w={270} h={200} rot={-3} at={word('L09', 'mazdoori', -4)} out={l10} size={58}>Mazdoori</Chip>
      <Chip id="ds" x={405} y={740} w={270} h={200} rot={2} at={word('L09', 'design', -4)} out={l10} size={58}>Design</Chip>
      <Chip id="pf" x={700} y={720} w={260} h={200} rot={-2} at={word('L09', 'profit', -6)} out={l10} size={52} bg={C.card}>Dukaan ka profit</Chip>
      <Hand x={140} y={980} at={word('L09', 'chain', 2)} out={l10} size={56} rot={-3}>chain banane ki keemat →</Hand>

      {/* L10: the usual range */}
      <Card id="ruler" x={110} y={440} w={860} h={420} rot={-1} at={l10} out={l11} enter="up" bg={C.card}>
        <div style={{padding: '30px 44px'}}>
          <Label size={24}>Making charge · aam taur pe</Label>
        </div>
      </Card>
      {frame >= l10 + 6 && frame < l11 + 6 ? (
        <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, zIndex: 5}}>
          <rect x={px(8)} y={640} width={(px(25) - px(8)) * bandP} height={70} fill={C.yellow} />
          <line x1={rx0} y1={710} x2={rx0 + rw} y2={710} stroke={C.ink} strokeWidth={6} />
          {Array.from({length: 31}).map((_, i) => (
            <line key={i} x1={px(i)} y1={710} x2={px(i)} y2={i % 5 === 0 ? 680 : 696} stroke={C.ink} strokeWidth={i % 5 === 0 ? 4 : 2} />
          ))}
          {[0, 10, 20, 30].map((p) => (
            <text key={p} x={px(p)} y={760} textAnchor="middle" fontFamily="IBM Plex Mono" fontWeight={700} fontSize={26} fill={C.inkSoft}>{p}%</text>
          ))}
        </svg>
      ) : null}
      <Hand x={px(8) - 40} y={560} at={word('L10', '8', -2)} out={l11} size={64} rot={-4}>8%</Hand>
      <Hand x={px(25) - 50} y={560} at={word('L10', '25%', -2)} out={l11} size={64} rot={3}>25%</Hand>
      <Circle id="c12" cx={px(12)} cy={700} rx={60} ry={50} at={word('L10', '12%', -4)} out={l11} />
      <Card id="hum12" x={200} y={890} w={680} h={150} rot={2} at={word('L10', 'hum', -2)} out={l11} bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 80, textAlign: 'center', marginTop: 22}}>HUM LETE HAIN {frame >= word('L10', '12%', -4) ? '12%' : '…'}</div>
      </Card>

      {/* L11: subtotal */}
      <Row id="r1" y={430} at={l11} rot={-1.5} value="₹1,00,000" label={'TUKDA 1\nSONA'} />
      <Row id="r2" y={620} at={word('L11', '12,000', -4)} rot={1} op="+" value={<Count from={0} to={12000} at={word('L11', '12,000', -2)} dur={10} />} label={'TUKDA 2\nMAKING 12%'} />
      <Card id="rule" x={150} y={808} w={780} h={10} at={word('L11', 'subtotal', -4)} enter="fade" bg={C.ink} texture={null} sfx={null} depth={0.2} />
      <Row id="r3" y={835} at={word('L11', 'subtotal', -2)} rot={-1} op="=" value={<HL at={word('L11', '1,12,000')}>₹1,12,000</HL>} label="SUBTOTAL" />
      <Sfx at={word('L11', '1,12,000')} name="coin" volume={0.22} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ gst
const Gst: React.FC = () => {
  const {at, word} = useCues();
  const l14 = at('L14'), l15 = at('L15');
  return (
    <AbsoluteFill>
      {/* L12 */}
      <Card id="ghead" x={110} y={420} w={860} h={220} rot={1.5} at={0} out={l14} enter="right" bg={C.kraft} texture="kraft" torn={{left: true}}>
        <div style={{padding: '26px 44px'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 28, letterSpacing: 4}}>TUKDA 3</div>
          <div style={{fontFamily: F.display, fontSize: 124, lineHeight: 1.05}}>GST</div>
        </div>
      </Card>
      <Stamp id="g3" text="3% GST" x={720} y={540} at={word('L13', '3%', -2)} out={l14} size={92} rot={-6} color={C.ink} paper />

      {/* L13: on the whole bill, making included */}
      <Card id="bgold" x={130} y={760} w={560} h={230} rot={-1} at={word('L13', 'poore', -6)} out={l14} enter="up" bg={C.paperLight}>
        <div style={{padding: '30px 34px'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3}}>SONA</div>
          <div style={{fontFamily: F.display, fontSize: 100, lineHeight: 1.1}}>₹1,00,000</div>
        </div>
      </Card>
      <Card id="bmake" x={705} y={760} w={260} h={230} rot={1.5} at={word('L13', 'poore', -2)} out={l14} enter="up" bg={C.yellow}>
        <div style={{padding: '30px 22px'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3}}>MAKING</div>
          <div style={{fontFamily: F.display, fontSize: 56, lineHeight: 1.6}}>₹12,000</div>
        </div>
      </Card>
      <Marker id="brk" d="M140,735 L140,705 L955,705 L955,735" at={word('L13', 'poore', 2)} out={l14} dur={8} color={C.ink} width={7} />
      <Hand x={330} y={652} at={word('L13', 'poore', 4)} out={l14} size={58} rot={-2}>poore bill pe 3%</Hand>
      <Circle id="cmk" cx={835} cy={875} rx={150} ry={135} at={word('L13', 'making', -2)} out={l14} />
      <Hand x={560} y={1030} at={word('L13', 'bhi', -4)} out={l14} size={62} rot={-4}>making pe bhi!</Hand>

      {/* L14: 3% of 1,12,000 */}
      <Row id="g1" y={430} at={l14} out={l15} rot={-1.5} value="₹1,12,000" label="SUBTOTAL" />
      <Row id="g2" y={620} at={word('L14', '3%', -4)} out={l15} rot={1} op="×" value="3%" label="GST" />
      <Card id="grule" x={150} y={808} w={780} h={10} at={word('L14', '3,360', -6)} out={l15} enter="fade" bg={C.ink} texture={null} sfx={null} depth={0.2} />
      <Row id="g3r" y={835} at={word('L14', '3,360', -4)} out={l15} rot={-1} op="=" value={<HL at={word('L14', '3,360', 2)}>₹3,360</HL>} label={'TUKDA 3\nGST'} hi={false} />

      {/* L15: the full receipt */}
      <Card id="rcpt" x={150} y={410} w={780} h={760} rot={-1} at={l15} enter="up" bg={C.paperLight} torn={{bottom: true}} rough={10}>
        <div style={{padding: '34px 46px'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: C.inkSoft, borderBottom: `3px double ${C.ink}`, paddingBottom: 10, textAlign: 'center'}}>TAX INVOICE · 22K CHAIN · 10 G</div>
          <BillRow label="Sona" sub="(22K, 10 g)" amount="₹1,00,000" at={l15 + 2} />
          <BillRow label="Making" sub="(12%)" amount="₹12,000" at={l15 + 6} />
          <BillRow label="GST" sub="(3%)" amount="₹3,360" at={l15 + 10} />
          <div style={{borderTop: `4px dashed ${C.ink}`, marginTop: 26}} />
          <BillRow label="TOTAL" amount="₹1,15,360" at={word('L15', 'bill', -2)} big hl={word('L15', '1,15,360')} />
          <div style={{fontFamily: F.type, fontSize: 28, color: C.inkSoft, marginTop: 40, textAlign: 'center'}}>* Dhanyavaad. Phir padhaarein *</div>
        </div>
      </Card>
      <Hand x={420} y={1150} at={word('L15', 'bechne', -2)} size={62} rot={-4}>ab bechne chalo →</Hand>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ sell
const Sell: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l17 = at('L17'), l18 = at('L18'), l19 = at('L19');
  const tilt = 9 * Math.min(1, ease(stepped(frame), 6, 22)) + Math.sin(stepped(frame) / 6) * 1.2 * (1 - ease(frame, 20, 60));
  const gst = word('L17', 'gst', -2);
  const wap2 = word('L17', 'gst', 20);
  const cut = word('L19', '3%', 2);
  const slice = ease(stepped(frame), cut + 8, cut + 20);
  return (
    <AbsoluteFill>
      {/* L16: only the gold is weighed */}
      {frame < l17 + 10 ? (
        <div style={{position: 'absolute', left: 140, top: 470, width: 800, height: 600, transform: `translateX(${-1300 * ease(frame, l17, l17 + 9)}px)`}}>
          <Scale w={800} h={600} tilt={tilt}
            left={<div style={{position: 'relative', width: 260, height: 124}}><div style={{position: 'absolute', left: 22, top: 4, width: 620, height: 360, transform: 'scale(0.35)', transformOrigin: '0 0'}}><Chain w={620} h={360} links={26} seed="mini" /></div></div>}
            right={<div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center', height: '100%', gap: 8, paddingBottom: 6}}>
              <div style={{width: 70, height: 70, background: C.ink, color: C.paperLight, fontFamily: F.mono, fontWeight: 700, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px 8px 2px 2px'}}>5 G</div>
              <div style={{width: 70, height: 70, background: C.ink, color: C.paperLight, fontFamily: F.mono, fontWeight: 700, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px 8px 2px 2px'}}>5 G</div>
            </div>} />
        </div>
      ) : null}
      <Card id="tol" x={110} y={400} w={600} h={100} rot={-2} at={word('L16', 'sona', -4)} out={l17} bg={C.yellow} sfx={null}>
        <div style={{fontFamily: F.display, fontSize: 60, textAlign: 'center', marginTop: 16}}>SIRF SONA TOLTA HAI</div>
      </Card>
      <Chip id="dsg" x={600} y={1060} w={320} h={130} rot={4} at={word('L16', 'design', -3)} out={l17} size={70}>Design</Chip>
      <Cross id="xdsg" x={620} y={1070} w={280} h={110} at={word('L16', 'nahi', -2)} out={l17} />
      <Hand x={130} y={1090} at={word('L16', 'daam', -2)} out={l17} size={58} rot={-3}>design ka daam: kuch nahi</Hand>

      {/* L17: making and GST don't come back */}
      <Card id="smk" x={110} y={440} w={860} h={250} rot={-1.5} at={word('L17', 'making', -4)} out={l18} enter="left" bg={C.yellow} torn={{left: true, right: true}} rough={14}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', padding: '0 60px'}}>
          <div style={{fontFamily: F.type, fontSize: 54}}>Making</div>
          <div style={{fontFamily: F.display, fontSize: 130}}>₹12,000</div>
        </div>
      </Card>
      <Cross id="xmk" x={160} y={470} w={760} h={190} at={word('L17', 'wapas', -2)} out={l18} />
      <Stamp id="wn1" text="Wapas nahi" x={600} y={690} at={word('L17', 'wapas', 2)} out={l18} size={80} rot={-8} />
      <Card id="sgst" x={110} y={800} w={860} h={250} rot={1.2} at={gst} out={l18} enter="right" bg={C.kraft} texture="kraft" torn={{left: true, right: true}} rough={14}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', padding: '0 60px'}}>
          <div style={{fontFamily: F.type, fontSize: 54}}>GST</div>
          <div style={{fontFamily: F.display, fontSize: 130}}>₹3,360</div>
        </div>
      </Card>
      <Cross id="xgst" x={160} y={830} w={760} h={190} at={wap2 - 2} out={l18} />
      <Stamp id="wn2" text="Wapas nahi" x={480} y={1050} at={wap2 + 2} out={l18} size={80} rot={6} />

      {/* L18-L19: deductions on the gold itself */}
      <Card id="sgold" x={110} y={430} w={860 - 60 * slice} h={240} rot={-1} at={l18} enter="up" bg={C.paperLight} torn={{left: true}} rough={12}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', padding: '0 50px'}}>
          <div style={{fontFamily: F.type, fontSize: 54}}>Sona</div>
          <div style={{fontFamily: F.display, fontSize: 130}}>₹1,00,000</div>
        </div>
      </Card>
      <Chip id="pur" x={110} y={740} w={400} h={140} rot={-3} at={word('L18', 'purity', -4)} out={l19} size={64}>Purity check</Chip>
      <Chip id="mlt" x={550} y={760} w={360} h={140} rot={2} at={word('L18', 'melting', -4)} out={l19} size={64}>Melting</Chip>
      <Stamp id="k25" text="−2 se 5%" sub="KATAUTI" x={540} y={1050} at={word('L18', '2', -2)} out={l19} size={100} rot={-6} />

      <Chip id="m3" x={600} y={700} w={330} h={150} rot={4} at={word('L19', '3%', -4)} size={96} bg={C.card}>−3%</Chip>
      {frame >= cut && frame < cut + 26 ? <Scissors x={940 - 40 * slice} y={460 + 120} rot={90} phase={stepped(frame) * 0.6} /> : null}
      {frame >= cut + 8 ? (
        <Card id="slice" x={910} y={430} w={60} h={240} rot={6} at={cut + 8} out={cut + 18} exit="down" enter="none" bg={C.paperLight} torn={{left: true, right: true}} rough={8} sfx={null} />
      ) : null}
      <Sfx at={cut + 4} name="slide" volume={0.3} />
      <Card id="hm" x={110} y={900} w={860} h={260} rot={-1.5} at={word('L19', 'haath', -4)} enter="up" bg={C.card}>
        <div style={{padding: '24px 50px'}}>
          <Label size={24}>Haath mein</Label>
          <div style={{fontFamily: F.display, fontSize: 150, lineHeight: 1.1}}><HL at={word('L19', '97,000')}>₹97,000</HL></div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ gap
const Gap: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l21 = at('L21'), l22 = at('L22');
  const base = 1170, k = 0.0115, v0 = 60000;
  const hh = (v: number) => (v - v0) * k;
  const pDiye = ease(stepped(frame), 0, 14);
  const pMile = ease(stepped(frame), word('L20', '97,000', -4), word('L20', '97,000', 10));
  const pGap = ease(stepped(frame), word('L20', '18,360', -4), word('L20', '18,360', 8));
  const tDiye = base - hh(115360), tMile = base - hh(97000);
  const bars = frame >= 0;
  return (
    <AbsoluteFill>
      {bars ? (
        <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
          <defs>
            <pattern id="hatch" width={18} height={18} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width={18} height={18} fill="rgba(210,52,31,0.12)" />
              <line x1={0} y1={0} x2={0} y2={18} stroke={C.red} strokeWidth={6} />
            </pattern>
            <filter id="bsh"><feDropShadow dx={6} dy={9} stdDeviation={7} floodColor="rgba(30,22,10,0.38)" /></filter>
          </defs>
          <g filter="url(#bsh)">
            <rect x={150} y={base - hh(115360) * pDiye} width={320} height={hh(115360) * pDiye} fill={C.paperLight} stroke={C.ink} strokeWidth={5} />
            {pMile > 0 ? <rect x={590} y={base - hh(97000) * pMile} width={320} height={hh(97000) * pMile} fill={C.yellow} stroke={C.ink} strokeWidth={5} /> : null}
          </g>
          {pGap > 0 ? <rect x={590} y={tDiye + (tMile - tDiye) * (1 - pGap)} width={320} height={(tMile - tDiye) * pGap} fill="url(#hatch)" stroke={C.red} strokeWidth={4} strokeDasharray="14 8" /> : null}
          {/* axis break: zigzag near the base */}
          <path d={`M130,${base - 40} ${Array.from({length: 40}, (_, q) => (q % 2 ? 'l20,14' : 'l20,-14')).join(' ')}`} fill="none" stroke={C.paper} strokeWidth={14} />
          <line x1={110} y1={base} x2={960} y2={base} stroke={C.ink} strokeWidth={6} />
        </svg>
      ) : null}
      <div style={{position: 'absolute', left: 150, width: 320, top: tDiye - 112, textAlign: 'center', fontFamily: F.display, fontSize: 86, opacity: ease(frame, 8, 14)}}>₹1,15,360</div>
      <div style={{position: 'absolute', left: 150, width: 320, top: base - 120, textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 34, letterSpacing: 5, opacity: ease(frame, 8, 14)}}>DIYE</div>
      {frame >= word('L20', '97,000', 6) ? (
        <>
          <div style={{position: 'absolute', left: 590, width: 320, top: tMile + 20, textAlign: 'center', fontFamily: F.display, fontSize: 86}}>₹97,000</div>
          <div style={{position: 'absolute', left: 590, width: 320, top: base - 120, textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 34, letterSpacing: 5}}>MILE</div>
        </>
      ) : null}
      {frame >= word('L20', '18,360', 4) ? (
        <div style={{position: 'absolute', left: 590, width: 320, top: tDiye + 50, textAlign: 'center', fontFamily: F.display, fontSize: 90, color: C.red, opacity: frame >= l22 ? 1 - ease(frame, l22, l22 + 6) : 1}}>−₹18,360</div>
      ) : null}
      <Stamp id="ekdin" text="Ek din mein" x={310} y={820} at={word('L20', 'ek', -2)} out={l22} size={64} rot={-6} />

      {/* L21: 16% of the bill */}
      <Circle id="c16" cx={750} cy={(tDiye + tMile) / 2} rx={210} ry={140} at={word('L21', '16%', -6)} out={l22} />
      <Card id="p16" x={560} y={410} w={400} h={120} rot={3} at={word('L21', '16%', -2)} out={l22} bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 64, textAlign: 'center', marginTop: 22}}>BILL KA ~16%</div>
      </Card>
      <Sfx at={l21} name="tick" volume={0.2} />

      {/* L22: needs +19% just to break even */}
      <Marker id="up19" d={`M945,${tMile - 4} L945,${tDiye + 6}`} at={word('L22', 'barabar', -2)} dur={10} color={C.ink} width={8} />
      <Marker id="up19h" d={`M925,${tDiye + 34} L945,${tDiye + 6} L965,${tDiye + 34}`} at={word('L22', 'barabar', 8)} dur={4} color={C.ink} width={8} />
      <Card id="p19l" x={540} y={405} w={420} h={100} rot={-2} at={word('L22', 'barabar', -4)} bg={C.ink} texture={null} sfx={null}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 2, color: C.paperLight, textAlign: 'center', marginTop: 18, lineHeight: 1.3}}>SIRF BARABAR AANE KE LIYE</div>
      </Card>
      <Card id="p19" x={615} y={tDiye + 30} w={270} h={150} rot={-3} at={word('L22', '19%', -3)} bg={C.card}>
        <div style={{fontFamily: F.display, fontSize: 104, textAlign: 'center', marginTop: 12}}>+19%</div>
      </Card>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ smart
const Smart: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l24 = at('L24'), l25 = at('L25'), l26 = at('L26'), l28 = at('L28'), l29 = at('L29');
  const lo2 = word('L23', 'pehno', -19);
  return (
    <AbsoluteFill>
      {/* L23 */}
      {frame < l24 + 4 ? (
        <div style={{position: 'absolute', left: 90, right: 130, top: 440, opacity: frame >= l24 ? 1 - ease(frame, l24, l24 + 4) : 1}}>
          <Big words={['JEWELLERY', 'MAT', 'LO?']} at={0} gap={4} size={140} align="center" />
        </div>
      ) : null}
      <Card id="velvet2" x={200} y={700} w={680} h={420} rot={2} at={6} out={l24} enter="up" bg={VELVET} texture="kraft" torn={{top: true}} rough={10}>
        <div style={{position: 'absolute', left: 90, top: 10, width: 500, height: 380}}>
          <Chain w={500} h={380} links={28} seed="ch2" />
        </div>
      </Card>
      <Stamp id="lo" text="LO!" x={790} y={740} at={lo2 - 2} out={l24} size={130} rot={-10} color={C.ink} paper />
      <Hand x={150} y={1140} at={word('L23', 'pehno', -2)} out={l24} size={66} rot={-3}>pehno, shauk se</Hand>

      {/* L24: it's spending, not investing */}
      <Chip id="inv" x={150} y={470} w={780} h={220} rot={-2} at={l24} out={l25} size={120} enter="left">Investment</Chip>
      <Cross id="xinv" x={190} y={490} w={700} h={180} at={word('L24', 'mat', -2)} out={l25} />
      <Chip id="kh" x={150} y={800} w={780} h={240} rot={1.5} at={word('L24', 'kharcha', -6)} out={l25} size={140} bg={C.yellow} enter="right">Kharcha</Chip>

      {/* L25: two different roads */}
      {frame >= l25 && frame < l26 + 10 ? (
        <div style={{position: 'absolute', left: 520, top: 440, width: 40, height: 760, background: C.kraft, boxShadow: `6px 10px 12px ${C.shadow}`, transform: `translateY(${(1 - Math.min(1, ease(stepped(frame), l25, l25 + 8))) * 900}px)`, opacity: frame >= l26 ? 1 - ease(frame, l26, l26 + 8) : 1}} />
      ) : null}
      <Sign id="sgj" x={110} y={520} w={470} h={200} dir="left" at={word('L25', 'sona', -2)} out={l26} bg={C.card} rot={-3}>
        <div style={{fontFamily: F.display, fontSize: 64, lineHeight: 1}}>JEWELLERY<div style={{fontFamily: F.hand, fontSize: 46, fontWeight: 700}}>pehno</div></div>
      </Sign>
      <Sign id="sgi" x={500} y={800} w={470} h={200} dir="right" at={word('L25', 'rasta', -4)} out={l26} bg={C.yellow} rot={3}>
        <div style={{fontFamily: F.display, fontSize: 64, lineHeight: 1}}>INVESTMENT<div style={{fontFamily: F.hand, fontSize: 46, fontWeight: 700}}>rasta alag</div></div>
      </Sign>

      {/* L26-L27: gold ETF / gold fund */}
      <Chip id="etf" x={110} y={420} w={400} h={160} rot={-3} at={word('L26', 'etf', -6)} out={l28} size={90} bg={C.yellow}>Gold ETF</Chip>
      <Hand x={520} y={460} at={word('L26', 'ya', -2)} out={l28} size={56} rot={-4}>ya</Hand>
      <Chip id="gmf" x={590} y={420} w={370} h={160} rot={2} at={word('L26', 'mutual', -6)} out={l28} size={56} bg={C.card}>Gold mutual fund</Chip>
      <Card id="list" x={110} y={620} w={860} h={560} rot={-1} at={word('L26', 'na', -4)} out={l28} enter="up" bg={C.paperLight}>
        <div style={{position: 'absolute', inset: 0, ...grid(40)}} />
        <div style={{position: 'relative', padding: '34px 50px', display: 'grid', gridTemplateColumns: '1fr auto', rowGap: 34, alignItems: 'center'}}>
          {[
            ['Making charge', 'NAHI', word('L26', 'making', -2)],
            ['GST', 'NAHI', word('L26', 'gst', -2)],
            ['Expense ratio', 'CHHOTA SA', word('L27', 'expense', -2)],
            ['Bechne pe', 'MARKET RATE', word('L27', 'market', -2)],
          ].map(([k, v, t]) => (
            <React.Fragment key={k as string}>
              <div style={{fontFamily: F.type, fontSize: 48, opacity: frame >= (t as number) ? 1 : 0}}>{k}</div>
              <div style={{fontFamily: F.display, fontSize: 64, opacity: frame >= (t as number) ? 1 : 0}}><HL at={(t as number) + 4}>{v}</HL></div>
            </React.Fragment>
          ))}
        </div>
      </Card>
      {[word('L26', 'making', -2), word('L26', 'gst', -2), word('L27', 'expense', -2), word('L27', 'market', -2)].map((t, i) => <Sfx key={i} at={t} name="tick" volume={0.25} />)}

      {/* L28: hallmark + HUID */}
      <Card id="hm" x={110} y={430} w={860} h={330} rot={-1.5} at={l28} out={l29} enter="up" bg={C.card}>
        <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 50px', gap: 40}}>
          <svg width={180} height={170}><path d="M90,12 L170,158 L10,158 Z" fill="none" stroke={C.ink} strokeWidth={10} strokeLinejoin="round" /><text x={90} y={130} textAnchor="middle" fontFamily="Anton" fontSize={48} fill={C.ink}>22K</text></svg>
          <div>
            <div style={{fontFamily: F.display, fontSize: 92, lineHeight: 1}}>HALLMARK</div>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 3, marginTop: 8, color: C.inkSoft}}>PURITY KI GUARANTEE</div>
          </div>
        </div>
      </Card>
      <Card id="huid" x={110} y={810} w={860} h={300} rot={1.5} at={word('L28', 'huid', -6)} out={l29} enter="up" bg={C.paperLight}>
        <div style={{padding: '36px 50px'}}>
          <div style={{fontFamily: F.display, fontSize: 110, lineHeight: 1}}>HUID</div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 3, marginTop: 10, color: C.inkSoft}}>HAR PIECE KA UNIQUE CODE</div>
        </div>
      </Card>
      <Marker id="tk1" d="M845,575 L872,610 L925,525" at={word('L28', 'check', -6)} out={l29} dur={6} color={C.ink} width={14} />
      <Marker id="tk2" d="M845,945 L872,980 L925,895" at={word('L28', 'check', 0)} out={l29} dur={6} color={C.ink} width={14} />
      <Sfx at={word('L28', 'check', -6)} name="marker" volume={0.3} />

      {/* L29: ask for making charge as a separate line */}
      <Card id="rc2" x={150} y={420} w={780} h={600} rot={-1} at={l29} enter="up" bg={C.paperLight} torn={{bottom: true}}>
        <div style={{padding: '34px 46px'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: C.inkSoft, borderBottom: `3px double ${C.ink}`, paddingBottom: 10, textAlign: 'center'}}>TAX INVOICE</div>
          <BillRow label="Sona" sub="(rate × gram)" amount="₹ ......" at={l29 + 2} />
          <div style={{marginTop: 18, padding: '6px 0'}}>
            <BillRow label="Making charge" amount={<HL at={word('L29', 'alag', -2)}>₹ ......</HL>} at={l29 + 6} />
          </div>
          <BillRow label="GST" sub="(3%)" amount="₹ ......" at={l29 + 10} />
        </div>
      </Card>
      <Hand x={170} y={1040} at={word('L29', 'negotiate', -4)} size={66} rot={-3}>↑ yahi negotiate hota hai!</Hand>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ outro
const Outro: React.FC = () => (
  <AbsoluteFill>
    <SignOff share="L30" sign="L31" who="us dost ko jo sone ko 'investment' samajh ke le raha hai →" note="ILLUSTRATIVE NUMBERS · MAKING 12% · GST 3% · BUYBACK −3%" />
  </AbsoluteFill>
);

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  rate: Rate,
  making: Making,
  gst: Gst,
  sell: Sell,
  gap: Gap,
  smart: Smart,
  outro: Outro,
};
