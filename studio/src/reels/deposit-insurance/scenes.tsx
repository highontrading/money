import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Big, Card, Circle, Count, Cross, Hand, HL, Label, Marker, Sfx, Stamp, Tape} from '../../components/paper';
import {pop, stepped} from '../../lib/motion';
import {useCues} from '../../lib/timeline';
import {C, F} from '../../theme';
import {SignOff} from '../common';
import {Bank, Center, Hide, Lines, Pop, Rain, Slip, Umbrella} from './props';

const SX = (i: number) => 100 + i * 215; // four FD slips in a row
const SW = 195;

// L01-L05: ₹20 lakh FD, the bank sinks, only ₹5 lakh is guaranteed.
const Hook: React.FC = () => {
  const {at, word} = useCues();
  const l3 = at('L03'), l4 = at('L04'), l5 = at('L05');
  return (
    <AbsoluteFill>
      <Bank seed="h-bank" x={560} y={420} w={380} h={370} ground={800} at={word('L01', 'bank', -4)} sinkAt={word('L02', 'doob', -2)} out={l3 + 4} />
      <Marker id="h-ground" d="M520,800 L965,800" at={word('L01', 'bank', -2)} dur={6} out={l3 + 4} color={C.ink} width={5} />
      <Stamp id="h-fail" text="Bank fail" x={745} y={600} at={word('L02', 'doob', 6)} out={l3 + 4} size={72} rot={-9} />
      <Card id="h-fd" x={110} y={840} w={760} h={330} rot={-1.5} at={0} out={l4} exit="left" bg={C.card}>
        <Slip title="FIXED DEPOSIT RECEIPT · EK BANK" amount={<HL at={word('L01', '₹20', 0)}>₹20,00,000</HL>} size={128} />
      </Card>
      <Tape id="h-fdt" x={620} y={822} w={150} rot={-5} at={4} out={l4} />

      {/* L03: how much comes back? */}
      <Hand x={130} y={520} at={l3} out={l4} size={70} rot={-4}>kitna wapas milega?</Hand>
      <Card id="h-q" x={560} y={600} w={400} h={200} rot={3} at={word('L03', '₹20', -4)} out={l4} bg={C.paperLight}>
        <Center><div style={{fontFamily: F.display, fontSize: 86, lineHeight: 1}}>₹20 LAKH ?</div></Center>
      </Card>

      {/* L04: four ₹5L slips, one umbrella */}
      {[0, 1, 2, 3].map((i) => (
        <Card key={i} id={'h-s' + i} x={SX(i)} y={860} w={SW} h={280} rot={[-2, 1.5, -1, 2][i]} at={l4 + i * 3} bg={C.card} sfx={i ? null : 'drop'}>
          <Slip title="FD" amount="₹5L" size={78} />
        </Card>
      ))}
      <Umbrella cx={SX(0) + SW / 2} top={560} r={150} at={word('L04', 'guarantee', 0)} label={<HL at={word('L04', '₹5', 0)}>₹5 LAKH</HL>} size={50} />
      <Pop x={430} y={450} at={word('L04', 'guarantee', -2)} out={l5} size={34} font={F.mono}>GUARANTEE SIRF</Pop>
      <Pop x={430} y={500} at={word('L04', '₹5', -3)} out={l5} size={130}>₹5 LAKH</Pop>

      {/* L05: the other ₹15 lakh is in the rain */}
      <Pop x={430} y={450} at={l5} size={34} font={F.mono}>BAAKI</Pop>
      <Pop x={430} y={500} at={word('L05', '₹15', -3)} size={130}>₹15 LAKH ?</Pop>
      <Rain seed="h-rain" x={SX(1) - 10} y={660} w={SW * 3 + 70} h={440} at={word('L05', 'baaki', 0)} />
      {[1, 2, 3].map((i) => (
        <Stamp key={i} id={'h-qq' + i} text="?" x={SX(i) + SW / 2} y={1010} at={word('L05', 'pata', -4 + (i - 1) * 3)} size={96} rot={[-8, 6, -4][i - 1]} />
      ))}
      <Hand x={150} y={1178} at={word('L05', 'pata', 0)} size={56} rot={-2}>pata nahi...</Hand>
    </AbsoluteFill>
  );
};

// L06-L08: DICGC, ₹5 lakh per depositor, ~90 days.
const Dicgc: React.FC = () => {
  const {at, word} = useCues();
  const l7 = at('L07'), l8 = at('L08');
  return (
    <AbsoluteFill>
      <Card id="d-ins" x={110} y={420} w={860} h={330} rot={-1} at={0} out={l7} enter="up" bg={C.card}>
        <div style={{padding: '44px 50px'}}>
          <Label size={26}>Har bank deposit ka</Label>
          <div style={{fontFamily: F.display, fontSize: 150, lineHeight: 1, marginTop: 26}}><HL at={word('L06', 'insurance', -2)}>INSURANCE</HL></div>
        </div>
      </Card>
      <Card id="d-rbi" x={110} y={775} w={430} h={84} rot={-2} at={word('L06', 'rbi', -3)} out={l7} bg={C.ink} texture={null}>
        <Center><div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: C.paperLight}}>RBI KI COMPANY</div></Center>
      </Card>
      <Card id="d-dicgc" x={110} y={880} w={860} h={300} rot={1.5} at={word('L06', 'dicgc', -5)} bg={C.yellow} torn={{top: true, right: true}} rough={12}>
        <Center>
          <div style={{fontFamily: F.display, fontSize: 190, lineHeight: 1, letterSpacing: 6}}>DICGC</div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 19, letterSpacing: 2, marginTop: 8}}>DEPOSIT INSURANCE & CREDIT GUARANTEE CORPORATION</div>
        </Center>
      </Card>
      <Tape id="d-t" x={470} y={862} w={150} rot={4} at={word('L06', 'dicgc', -2)} />

      {/* L07: bank fails -> up to ₹5 lakh per depositor */}
      <Umbrella cx={260} top={440} r={160} at={l7} label="DICGC" size={54} />
      <Pop x={480} y={455} at={word('L07', 'fail', -3)} out={l8} size={76}>BANK FAIL?</Pop>
      <Pop x={482} y={560} at={word('L07', 'depositor', -4)} out={l8} size={30} font={F.mono}>HAR DEPOSITOR KO</Pop>
      <Pop x={480} y={610} at={word('L07', '₹5', -3)} out={l8} size={96}><HL at={word('L07', '₹5', 0)}>₹5 LAKH</HL> TAK</Pop>

      {/* L08: about 90 days */}
      <Card id="d-cal" x={500} y={430} w={440} h={380} rot={2.5} at={l8} enter="right" bg={C.card}>
        <div style={{height: 70, background: C.ink, color: C.paperLight, fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 4, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>PAYOUT · LAGBHAG</div>
        <Center style={{height: 300}}>
          <div style={{fontFamily: F.display, fontSize: 170, lineHeight: 1}}><Count from={0} to={90} at={word('L08', '90', -4)} dur={12} fmt={(n) => String(Math.round(n))} /></div>
          <div style={{fontFamily: F.display, fontSize: 64, lineHeight: 1}}>DIN</div>
        </Center>
      </Card>
    </AbsoluteFill>
  );
};

const Head: React.FC<{id: string; n: string; text: React.ReactNode; at: number; out?: number}> = ({id, n, text, at, out}) => (
  <Card id={id} x={110} y={420} w={860} h={150} rot={-1} at={at} out={out} enter="left" bg={C.card}>
    <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 40px', gap: 30}}>
      <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 56, color: C.inkSoft}}>{n}</div>
      <div style={{fontFamily: F.display, fontSize: 76, lineHeight: 1, whiteSpace: 'nowrap'}}>{text}</div>
    </div>
  </Card>
);

// A block that drops into a box.
const Block: React.FC<{at: number; top: number; h: number; bg: string; children: React.ReactNode}> = ({at, top, h, bg, children}) => {
  const frame = useCurrentFrame();
  if (stepped(frame) < at) return null;
  const p = Math.min(1.05, pop(frame, at));
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top, height: h, background: bg, border: `4px solid ${C.ink}`, transform: `translateY(${(1 - p) * -60}px)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: 64, boxShadow: `4px 6px 8px ${C.shadow}`}}>
      <Sfx at={at} name="drop" volume={0.25} />
      {children}
    </div>
  );
};

// L09-L13: three fine-print points.
const Fine: React.FC = () => {
  const {at, word} = useCues();
  const l10 = at('L10'), l11 = at('L11'), l12 = at('L12'), l13 = at('L13');
  return (
    <AbsoluteFill>
      {/* L09 */}
      <div style={{position: 'absolute', left: 110, top: 440}}>
        <Hide until={l10}><Big words={['TEEN', 'BAATEIN']} at={word('L09', 'teen', -3)} gap={5} size={180} /></Hide>
      </div>
      <Hand x={120} y={640} at={word('L09', 'miss', -2)} out={l10} size={68} rot={-3}>jo log miss karte hain...</Hand>
      {['01', '02', '03'].map((n, i) => (
        <Card key={n} id={'f-tab' + n} x={110 + i * 290} y={830} w={260} h={220} rot={[-3, 2, -1.5][i]} at={word('L09', 'baatein', i * 4)} out={l10} bg={i === 2 ? C.yellow : C.card}>
          <Center><div style={{fontFamily: F.display, fontSize: 130, lineHeight: 1}}>{n}</div></Center>
        </Card>
      ))}

      {/* L10: interest counts inside the ₹5 lakh */}
      <Head id="f-h1" n="01" text={<>INTEREST <HL at={word('L10', 'interest', -2)}>BHI SHAAMIL</HL></>} at={l10} out={l11} />
      <Card id="f-box1" x={230} y={610} w={620} h={590} rot={1} at={l10 + 4} out={l11} enter="up" bg={C.paperLight} sfx={null}>
        <div style={{position: 'absolute', left: 30, right: 30, top: 24, fontFamily: F.mono, fontWeight: 700, fontSize: 28, letterSpacing: 3, textAlign: 'center'}}>LIMIT: <HL at={word('L10', '₹5', 0)}>₹5 LAKH</HL></div>
        <div style={{position: 'absolute', left: 24, right: 24, top: 80, borderTop: `4px dashed ${C.red}`}} />
        <Block at={word('L10', 'interest', -2)} top={100} h={110} bg={C.yellow}>INTEREST</Block>
        <Block at={word('L10', '₹5', -2)} top={214} h={340} bg={C.card}>PRINCIPAL</Block>
      </Card>

      {/* L11: per bank, not per branch */}
      <Head id="f-h2" n="02" text={<>LIMIT <HL at={word('L11', 'per', -2)}>PER BANK</HL></>} at={l11} out={l13} />
      <Bank seed="f-bank" x={340} y={610} w={400} h={330} at={l11 + 6} out={l12} />
      {[0, 1, 2].map((i) => (
        <Card key={i} id={'f-br' + i} x={110 + i * 290} y={990} w={260} h={130} rot={[-2, 1.5, -1][i]} at={word('L11', i === 0 ? 'account' : 'branch', -4 + i * 3)} out={l12} bg={C.card}>
          <Center>
            <div style={{fontFamily: F.display, fontSize: 52, lineHeight: 1}}>BRANCH {i + 1}</div>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 18, letterSpacing: 2, marginTop: 6, color: C.inkSoft}}>+ ACCOUNTS</div>
          </Center>
        </Card>
      ))}
      <Stamp id="f-one" text="Ek hi limit" sub="ALAG NAHI" x={540} y={800} at={word('L11', 'nahi', -3)} out={l12} size={86} rot={-7} paper />

      {/* L12: savings + FD + RD together */}
      <Pop x={110} y={620} w={860} align="center" at={word('L12', 'mila', -3)} out={l13} size={72}>SAB MILA KE</Pop>
      <Card id="f-box2" x={230} y={720} w={620} h={480} rot={-1} at={l12} out={l13} enter="up" bg={C.paperLight}>
        <div style={{position: 'absolute', left: 30, right: 30, top: 22, fontFamily: F.mono, fontWeight: 700, fontSize: 28, letterSpacing: 3, textAlign: 'center'}}>EK BANK · <HL at={word('L12', '₹5', 0)}>₹5 LAKH</HL></div>
        <div style={{position: 'absolute', left: 24, right: 24, top: 74, borderTop: `4px dashed ${C.red}`}} />
        <Block at={word('L12', 'savings', -3)} top={350} h={100} bg={C.card}>SAVINGS</Block>
        <Block at={word('L12', 'fd', -3)} top={240} h={100} bg={C.card}>FD</Block>
        <Block at={word('L12', 'rd', -3)} top={130} h={100} bg={C.card}>RD</Block>
      </Card>

      {/* L13: not covered */}
      <Head id="f-h3" n="03" text={<>YEH <span style={{color: C.red}}>COVER NAHI</span></>} at={l13} />
      <Card id="f-nbfc" x={110} y={640} w={410} h={330} rot={-2} at={word('L13', 'nbfc', -4)} bg={C.card}>
        <Center>
          <div style={{fontFamily: F.display, fontSize: 84, lineHeight: 1}}>NBFC /</div>
          <div style={{fontFamily: F.display, fontSize: 72, lineHeight: 1.05, marginTop: 6}}>COMPANY FD</div>
        </Center>
      </Card>
      <Card id="f-mf" x={560} y={650} w={410} h={330} rot={2} at={word('L13', 'mutual', -4)} bg={C.card}>
        <Center>
          <div style={{fontFamily: F.display, fontSize: 84, lineHeight: 1}}>MUTUAL</div>
          <div style={{fontFamily: F.display, fontSize: 84, lineHeight: 1.05}}>FUND</div>
        </Center>
      </Card>
      <Cross id="f-x1" x={150} y={680} w={330} h={250} at={word('L13', 'cover', -4)} />
      <Cross id="f-x2" x={600} y={690} w={330} h={250} at={word('L13', 'cover', 2)} />
      <Stamp id="f-nc" text="Not covered" x={540} y={1090} at={word('L13', 'nahi', -2)} size={84} rot={-5} />
    </AbsoluteFill>
  );
};

// L14-L15: PMC Bank 2019; cover went from ₹1 lakh to ₹5 lakh in 2020.
const History: React.FC = () => {
  const {at, word} = useCues();
  const clip = word('L14', '2019', -8), l15 = at('L15');
  return (
    <AbsoluteFill>
      <Hand x={150} y={560} at={0} out={clip} size={84} rot={-4}>yeh sirf darr nahi...</Hand>
      <Card id="y-clip" x={100} y={430} w={880} h={720} rot={-1.5} at={clip} out={l15} enter="drop" bg={C.newsprint} texture="news" torn={{top: true, bottom: true, left: true, right: true}} rough={10}>
        <div style={{padding: '40px 50px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 3, borderBottom: `3px solid ${C.ink}`, paddingBottom: 10}}>
            <span>BANKING · NEWS</span><span>2019</span>
          </div>
          <div style={{fontFamily: F.display, fontSize: 96, lineHeight: 0.98, marginTop: 26}}>PMC BANK:</div>
          <div style={{fontFamily: F.display, fontSize: 78, lineHeight: 1, marginTop: 6}}>DEPOSITORS KA <HL at={word('L14', 'paisa', -2)}>PAISA ATKA</HL></div>
          <div style={{display: 'flex', gap: 34, marginTop: 34}}>
            <div style={{flex: 1}}><Lines n={9} seed="ya" /></div>
            <div style={{flex: 1}}><Lines n={9} seed="yb" /></div>
          </div>
        </div>
      </Card>
      <Card id="y-2019" x={680} y={385} w={270} h={130} rot={6} at={word('L14', '2019', -3)} out={l15} bg={C.yellow}>
        <Center><div style={{fontFamily: F.display, fontSize: 100, lineHeight: 1}}>2019</div></Center>
      </Card>
      <Stamp id="y-atka" text="Saalon atka" x={560} y={1060} at={word('L14', 'saalon', -3)} out={l15} size={90} rot={-7} />

      {/* L15 */}
      <Card id="y-then" x={110} y={450} w={860} h={250} rot={-1.5} at={l15} bg={C.paperLight}>
        <div style={{padding: '34px 46px'}}>
          <Label size={24}>Tab · 2019</Label>
          <div style={{fontFamily: F.display, fontSize: 110, lineHeight: 1, marginTop: 20}}>COVER: <HL at={word('L15', '₹1', 0)}>₹1 LAKH</HL></div>
        </div>
      </Card>
      <Marker id="y-arr" d="M540,725 L540,835 M505,800 L540,840 L575,800" at={word('L15', '2020', -6)} dur={6} color={C.ink} width={8} />
      <Card id="y-now" x={110} y={860} w={860} h={280} rot={1.5} at={word('L15', '2020', -3)} bg={C.yellow} torn={{right: true}} rough={12}>
        <div style={{padding: '36px 46px'}}>
          <Label size={24}>2020 se</Label>
          <div style={{fontFamily: F.display, fontSize: 124, lineHeight: 1, marginTop: 22}}>COVER: ₹5 LAKH</div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

// L16-L21: split across banks, joint account, small banks, check the list.
const Spread: React.FC = () => {
  const {at, word} = useCues();
  const l17 = at('L17'), l19 = at('L19'), l20 = at('L20'), l21 = at('L21');
  const baant = word('L16', 'baant', 0);
  const andar = word('L18', 'andar', -3);
  return (
    <AbsoluteFill>
      {/* L16: cut the ₹20 lakh into pieces */}
      <Card id="s-fd" x={110} y={470} w={860} h={360} rot={-1} at={0} out={l17} exit="lift" enter="up" bg={C.card}>
        <Slip title="FIXED DEPOSIT RECEIPT · EK BANK" amount="₹20,00,000" size={140} />
      </Card>
      {[325, 540, 755].map((x, i) => (
        <Marker key={x} id={'s-cut' + i} d={`M${x},480 L${x + (i - 1) * 4},820`} at={baant + i * 3} dur={5} out={l17} color={C.ink} width={5} />
      ))}
      <Hand x={250} y={880} at={word('L16', 'bachaayein', -4)} out={baant} size={72} rot={-3}>kaise bachaayein?</Hand>
      <Stamp id="s-baant" text="Baant do" x={540} y={1010} at={baant} out={l17} size={110} rot={-6} paper />

      {/* L17: separate banks, a bit under ₹5 lakh each */}
      {[0, 1, 2, 3].map((i) => (
        <Bank key={i} seed={'s-b' + i} x={SX(i)} y={430} w={SW} h={220} at={word('L17', 'alag', 6 + i * 3)} out={andar} label={`BANK ${i + 1}`} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <Card key={i} id={'s-sl' + i} x={SX(i)} y={720} w={SW} h={270} rot={[-2, 1.5, -1, 2][i]} at={word('L17', 'har', -2 + i * 2)} out={l19} bg={C.card} sfx={i ? null : 'drop'}>
          <Slip title="FD" amount={<>&lt; <HL at={word('L17', '₹5', 0)}>₹5L</HL></>} sub="THODA KAM" size={62} />
        </Card>
      ))}

      {/* L18: interest fits inside the limit; each slip under its own umbrella */}
      {[0, 1, 2, 3].map((i) => (
        <Card key={i} id={'s-int' + i} x={SX(i) + 14} y={925} w={SW - 28} h={50} rot={[-2, 1.5, -1, 2][i]} at={word('L18', 'interest', i * 2)} out={l19} bg={C.yellow} texture={null} sfx={null} depth={0.4}>
          <Center><div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 18, letterSpacing: 2}}>+ INTEREST</div></Center>
        </Card>
      ))}
      {[0, 1, 2, 3].map((i) => (
        <Umbrella key={i} cx={SX(i) + SW / 2} top={490} r={92} handle={1.15} at={andar + i * 2} out={l19} label="✓" size={44} />
      ))}
      <Stamp id="s-ok" text="Limit ke andar" x={540} y={1100} at={word('L18', 'andar', 2)} out={l19} size={78} rot={-4} color={C.ink} />

      {/* L19: joint account is a separate cover */}
      <Umbrella cx={300} top={440} r={165} at={l19 + 8} out={l20} label="COVER 1" size={46} />
      <Umbrella cx={780} top={440} r={165} at={word('L19', 'joint', -3)} out={l20} label="COVER 2" size={46} color={C.paperLight} />
      <Card id="s-own" x={150} y={800} w={300} h={230} rot={-2} at={l19 + 10} out={l20} bg={C.card}>
        <Slip title="AAPKA ACCOUNT" amount="AAPKA" size={70} />
      </Card>
      <Card id="s-joint" x={630} y={800} w={300} h={230} rot={2} at={word('L19', 'joint', 0)} out={l20} bg={C.card}>
        <Slip title="JOINT ACCOUNT" amount="JOINT" size={70} />
      </Card>
      <Stamp id="s-alag" text="Alag cover" x={540} y={1115} at={word('L19', 'alag', -3)} out={l20} size={80} rot={-5} color={C.ink} />

      {/* L20: small finance / co-op banks with higher rates */}
      <Bank seed="s-sfb" x={130} y={450} w={340} h={310} at={word('L20', 'small', -3)} out={l21} />
      <Bank seed="s-coop" x={610} y={450} w={340} h={310} at={word('L20', 'co-op', -3)} out={l21} />
      <Pop x={130} y={790} w={340} align="center" at={word('L20', 'small', 0)} out={l21} size={26} font={F.mono}>SMALL FINANCE</Pop>
      <Pop x={610} y={790} w={340} align="center" at={word('L20', 'co-op', 0)} out={l21} size={26} font={F.mono}>CO-OP BANK</Pop>
      <Card id="s-rate" x={230} y={850} w={620} h={130} rot={-2} at={word('L20', 'zyada', -3)} out={l21} bg={C.yellow}>
        <Center><div style={{fontFamily: F.display, fontSize: 80, lineHeight: 1}}>ZYADA INTEREST ↑</div></Center>
      </Card>
      <Stamp id="s-rule" text="Aur bhi zaroori" x={540} y={1105} at={word('L20', 'rule', -3)} out={l21} size={80} rot={-6} />

      {/* L21: check the insured-banks list */}
      <Card id="s-list" x={110} y={430} w={860} h={760} rot={-1} at={l21} enter="up" bg={C.card}>
        <div style={{height: 76, background: C.ink, color: C.paperLight, fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 3, display: 'flex', alignItems: 'center', padding: '0 34px'}}>DICGC · INSURED BANKS LIST</div>
        {Array.from({length: 8}).map((_, i) => (
          <div key={i} style={{position: 'absolute', left: 40, right: 40, top: 110 + i * 78, height: 60, display: 'flex', alignItems: 'center', gap: 20, borderBottom: `2px solid rgba(20,20,20,0.12)`}}>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, color: C.grey, width: 40}}>{String(i + 1).padStart(2, '0')}</div>
            {i === 4 ? (
              <div style={{fontFamily: F.display, fontSize: 46, lineHeight: 1}}><HL at={word('L21', 'check', -2)}>AAPKA BANK</HL></div>
            ) : (
              <div style={{height: 12, width: `${45 + ((i * 37) % 30)}%`, background: 'rgba(20,20,20,0.22)'}} />
            )}
            <div style={{marginLeft: 'auto', fontFamily: F.display, fontSize: 40, color: C.inkSoft}}>✓</div>
          </div>
        ))}
      </Card>
      <Tape id="s-lt" x={460} y={412} w={160} rot={-3} at={l21 + 2} />
      <Hand x={600} y={1196} at={word('L21', 'naam', -2)} size={52} rot={-3}>naam dhoondo →</Hand>
      <Circle id="s-lc" cx={540} cy={430 + 110 + 4 * 78 + 30} rx={400} ry={56} at={word('L21', 'check', 2)} />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <AbsoluteFill>
    <SignOff share="L22" sign="L23" who="us dost ko jiski saari savings ek hi bank mein hai →" note="DICGC: ₹5 LAKH PER DEPOSITOR PER BANK (PRINCIPAL + INTEREST) · LIMIT AS OF OCT 2026" />
  </AbsoluteFill>
);

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  dicgc: Dicgc,
  fine: Fine,
  history: History,
  spread: Spread,
  outro: Outro,
};
