import React, {useContext} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, Card, Circle, Cross, Hand, HL, Label, Sfx, Stamp, Tape} from '../../components/paper';
import {clamp, ease, stepped} from '../../lib/motion';
import {SceneCtx, useCues, useTL} from '../../lib/timeline';
import {C, F} from '../../theme';
import {SignOff} from '../common';
import {grid, Head, Padlock, Pop, Row, Scale, Show} from './props';

// Frame (scene-local) of the i-th word of a line, for lines that repeat a word.
const useWordAt = () => {
  const tl = useTL();
  const scene = useContext(SceneCtx);
  return (id: string, i: number, off = 0) => {
    const l = tl.lines.find((x) => x.id === id);
    if (!l) throw new Error('unknown line ' + id);
    return l.words[Math.min(i, l.words.length - 1)].start - scene.start + off;
  };
};

const Tick: React.FC<{at: number; size?: number}> = ({at, size = 46}) => (
  <span style={{display: 'inline-block', width: size, height: size, border: `4px solid ${C.ink}`, background: C.paperLight, textAlign: 'center', lineHeight: `${size - 6}px`, fontFamily: F.display, fontSize: size * 0.8, verticalAlign: 'middle'}}>
    <Pop at={at}>✓</Pop>
  </span>
);

// ---------------------------------------------------------------- hook
const Hook: React.FC = () => {
  const {at, word} = useCues();
  const l3 = at('L03'), l5 = at('L04');
  return (
    <AbsoluteFill>
      {/* L01: salary + tax-saving purchases */}
      <Card id="slip" x={90} y={420} w={900} h={400} rot={-1.5} at={4} out={l3} enter="up" bg={C.card}>
        <Head right="SAALANA">SALARY SLIP</Head>
        <div style={{position: 'absolute', left: 0, right: 0, top: 60, bottom: 0, ...grid(36)}} />
        <div style={{position: 'relative', padding: '40px 50px'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 28, letterSpacing: 3, color: C.inkSoft}}>CTC</div>
          <div style={{fontFamily: F.display, fontSize: 190, lineHeight: 1, marginTop: 12}}>
            <Pop at={word('L01', '₹12', -3)}><HL at={word('L01', '₹12', 3)}>₹12,00,000</HL></Pop>
          </div>
        </div>
      </Card>
      <Card id="rcpt" x={420} y={780} w={540} h={350} rot={4} at={word('L01', '₹1.5', -4)} out={l3} enter="drop" bg={C.paperLight} torn={{bottom: true}}>
        <div style={{padding: '26px 36px'}}>
          <Label size={22}>Tax-saving · 80C</Label>
          <Row label="Policy" value="✓" size={36} />
          <Row label="ELSS" value={<Pop at={word('L01', 'elss', -2)}>✓</Pop>} size={36} />
          <div style={{fontFamily: F.display, fontSize: 84, textAlign: 'right', marginTop: 12}}>₹1,50,000</div>
        </div>
      </Card>
      <Tape id="trc" x={600} y={762} w={150} rot={-8} at={word('L01', '₹1.5', 0)} out={l3} />

      {/* L02: what did it save? */}
      <Hand x={100} y={860} at={at('L02')} out={l3} size={64} rot={-5} w={330}>tax kitna bacha?</Hand>
      <Stamp id="zero" text="Tax bacha: ₹0" x={510} y={630} at={word('L02', 'ek', -2)} out={l3} size={92} rot={-8} />

      {/* L03-L04: the new regime form; 80C doesn't exist there */}
      <Card id="nform" x={140} y={430} w={800} h={660} rot={-1} at={l3} enter="up" bg={C.card}>
        <Head right="ITR">TAX FORM · NEW REGIME</Head>
        <div style={{padding: '30px 46px'}}>
          <Row label="Salary" value="✓" at={l3 + 4} />
          <Row label="Standard deduction" value="✓" at={l3 + 8} />
          <Row label="80C · policy, ELSS" value="" at={word('L03', '80c', -6)} />
          <Row label="Slab rates" value="✓" at={l3 + 12} last />
        </div>
      </Card>
      <Stamp id="na" text="N/A" sub="80C YAHAN NAHI CHALTA" x={700} y={790} at={word('L03', 'chalta', -2)} size={110} rot={-9} />
      <Card id="dflt" x={640} y={392} w={300} h={100} rot={7} at={word('L04', 'default', -3)} bg={C.yellow} z={60}>
        <div style={{fontFamily: F.display, fontSize: 64, textAlign: 'center', marginTop: 12, letterSpacing: 2}}>DEFAULT</div>
      </Card>
      <Hand x={150} y={1110} at={word('L04', 'chuna', -2)} size={58} rot={-3} w={800}>kuch na chuna? → yahi lagega</Hand>
      <Sfx at={l5} name="pop" volume={0.2} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- two roads
const Two: React.FC = () => {
  const {at, word} = useCues();
  const l6 = at('L06');
  return (
    <AbsoluteFill>
      <Card id="old" x={70} y={450} w={460} h={680} rot={-2} at={4} enter="left" bg={C.card}>
        <Head>OLD REGIME</Head>
        <div style={{padding: '26px 32px'}}>
          <Row label="Deductions" value="✓" size={38} at={word('L05', 'deductions', -3)} />
          <Row label="80C" value="✓" size={38} at={word('L05', 'deductions', 6)} />
          <Row label="HRA" value="✓" size={38} at={word('L05', 'deductions', 12)} />
          <Row label="Tax rates" value={<span style={{color: C.red, fontFamily: F.display}}>↑ ZYADA</span>} size={38} at={word('L05', 'zyada', -4)} last />
        </div>
      </Card>
      <Card id="new" x={550} y={450} w={460} h={680} rot={1.5} at={word('L05', 'do', 4)} enter="right" bg={C.card}>
        <Head>NEW REGIME</Head>
        <div style={{padding: '26px 32px'}}>
          <Row label="Tax rates" value={<span style={{fontFamily: F.display}}><HL at={word('L06', 'kam', 2)}>↓ KAM</HL></span>} size={38} at={word('L06', 'kam', -4)} />
          <Row label="80C" value="✗" size={38} at={word('L06', '80c', -3)} />
          <Row label="HRA" value="✗" size={38} at={word('L06', 'deductions', -3)} />
          <Row label="Std. deduction" value="✓" size={38} at={word('L06', 'nahi', 0)} last />
        </div>
      </Card>
      <Card id="dflt2" x={730} y={410} w={250} h={84} rot={6} at={l6} bg={C.yellow} z={60}>
        <div style={{fontFamily: F.display, fontSize: 52, textAlign: 'center', marginTop: 10, letterSpacing: 2}}>DEFAULT</div>
      </Card>
      <Hand x={100} y={1150} at={word('L05', 'old', -2)} size={52} rot={-2} w={420}>deductions wala</Hand>
      <Hand x={600} y={1150} at={word('L06', 'rates', -2)} size={52} rot={-2} w={400}>kam rate wala</Hand>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- new regime maths
const NewMath: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l9 = at('L09');
  const zero = word('L09', 'zero', -3);
  return (
    <AbsoluteFill>
      <Card id="nrc" x={100} y={420} w={880} h={790} rot={-1} at={2} enter="up" bg={C.card} torn={{bottom: true}}>
        <Head right="₹12 LAKH SALARY">NEW REGIME · HISAAB</Head>
        <div style={{padding: '24px 46px'}}>
          <Row label="Salary" value="₹12,00,000" size={44} at={word('L07', '₹12', -3)} />
          <Row label="− Standard deduction" value={<HL at={word('L07', '₹75', 3)}>₹75,000</HL>} size={44} at={word('L07', '₹75', -3)} />
          <Row label="= Taxable" value={<HL at={word('L08', '₹11', 3)}>₹11,25,000</HL>} size={44} at={word('L08', '₹11', -3)} bold />
          <Row label="Rebate: ₹12 lakh tak" value="✓" size={44} at={word('L08', '₹12', -3)} />
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, opacity: stepped(frame) >= l9 ? 1 : 0}}>
            <span style={{fontFamily: F.display, fontSize: 110}}>TAX</span>
            <span style={{fontFamily: F.display, fontSize: 150}}>
              <Show until={zero}>?</Show>
              <Show from={zero}><Pop at={zero}><HL at={zero + 2}>₹0</HL></Pop></Show>
            </span>
          </div>
        </div>
      </Card>
      <Circle id="crb" cx={540} cy={826} rx={420} ry={56} at={word('L08', 'rebate', -2)} />
      <Stamp id="zst" text="Zero" x={360} y={1100} at={zero + 4} size={96} rot={-10} paper />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- old regime maths
const OldMath: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const wAt = useWordAt();
  const l11 = at('L11'), l12 = at('L12'), l13 = at('L13');
  const t117 = word('L11', '₹1.17', -3);
  const band = word('L13', 'band', -2);
  const shut = ease(stepped(frame), band, band + 6);
  return (
    <AbsoluteFill>
      {/* L10-L11: same salary, old regime, with 80C */}
      <Card id="orc" x={100} y={420} w={880} h={720} rot={1} at={2} out={l12} enter="up" bg={C.card} torn={{bottom: true}}>
        <Head right="WAHI SALARY">OLD REGIME · HISAAB</Head>
        <div style={{padding: '24px 46px'}}>
          <Row label="Salary" value="₹12,00,000" size={44} at={word('L10', 'salary', -3)} />
          <Row label="− 80C · policy + ELSS" value="₹1,50,000" size={44} at={word('L10', '₹1.5', -3)} />
          <Row label="Old slab rates" value={<span style={{color: C.red}}>↑</span>} size={44} at={word('L10', '80c', 0)} />
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, opacity: stepped(frame) >= l11 ? 1 : 0}}>
            <span style={{fontFamily: F.display, fontSize: 100}}>TAX</span>
            <span style={{fontFamily: F.display, fontSize: 120}}>
              <Show until={t117}>?</Show>
              <Show from={t117}><Pop at={t117}>≈ <HL at={t117 + 3}>₹1,17,000</HL></Pop></Show>
            </span>
          </div>
        </div>
      </Card>
      <Circle id="c117" cx={700} cy={890} rx={260} ry={90} at={word('L11', 'lakh', 0)} out={l12} />

      {/* L12: the policy didn't save it; the new regime did */}
      <Card id="pol" x={80} y={460} w={440} h={420} rot={-3} at={l12} out={l13} enter="left" bg={C.paperLight}>
        <div style={{padding: '34px 36px'}}>
          <Label size={22}>80C policy</Label>
          <div style={{fontFamily: F.display, fontSize: 80, lineHeight: 1.02, marginTop: 24}}>POLICY NE BACHAYA?</div>
        </div>
      </Card>
      <Cross id="xpol" x={100} y={480} w={400} h={380} at={wAt('L12', 4, -2)} out={l13} />
      <Card id="nr" x={560} y={480} w={440} h={420} rot={2.5} at={wAt('L12', 6, -3)} out={l13} enter="right" bg={C.yellow}>
        <div style={{padding: '34px 36px'}}>
          <Label size={22}>Asli wajah</Label>
          <div style={{fontFamily: F.display, fontSize: 92, lineHeight: 1, marginTop: 24}}>NEW REGIME</div>
          <div style={{fontFamily: F.display, fontSize: 70, marginTop: 18}}>TAX ₹0</div>
        </div>
      </Card>
      <Stamp id="bch" text="Bachaya ✓" x={780} y={960} at={wAt('L12', 9, -2)} out={l13} size={76} rot={-6} paper />

      {/* L13: ₹1.5 lakh locked in a policy you may not need */}
      <Card id="env" x={150} y={450} w={780} h={520} rot={-1.5} at={l13} enter="drop" bg="#c9a36d" texture="kraft" torn={{top: true}} rough={10}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 0, borderLeft: '390px solid transparent', borderRight: '390px solid transparent', borderTop: `200px solid rgba(80,55,25,0.22)`}} />
        <div style={{position: 'relative', padding: '210px 50px 0'}}>
          <Label size={24}>Policy · lock-in</Label>
          <div style={{fontFamily: F.display, fontSize: 150, lineHeight: 1, marginTop: 14}}>
            <Pop at={word('L13', '₹1.5', -3)}>₹1,50,000</Pop>
          </div>
        </div>
      </Card>
      <Show from={band}>
        <div style={{position: 'absolute', left: 760, top: 830, transform: `rotate(8deg) scale(${interpolate(stepped(frame) - band, [0, 3, 6], [1.3, 0.95, 1], clamp)})`, zIndex: 70, filter: `drop-shadow(4px 6px 6px ${C.shadow})`}}>
          <Padlock size={150} shut={shut} />
        </div>
      </Show>
      <Sfx at={band + 4} name="stamp" volume={0.35} />
      <Hand x={150} y={1040} at={word('L13', 'chahiye', -4)} size={62} rot={-3} w={800}>sach mein chahiye thi?</Hand>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- when does old regime win
const CHIPS: [string, number][] = [
  ['HRA', 1],
  ['HOME LOAN INTEREST', 2],
  ['80C', 6],
  ['HEALTH INSURANCE', 7],
];

const When: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const wAt = useWordAt();
  const l15 = at('L15'), l16 = at('L16');
  const calc = word('L16', 'income', -4);
  const scaleIn = word('L16', 'hisaab', -4);
  const tilt = Math.sin((stepped(frame) - scaleIn) / 9) * 7 * ease(stepped(frame), scaleIn, scaleIn + 10);
  return (
    <AbsoluteFill>
      {/* L14: question, then the condition */}
      <div style={{position: 'absolute', left: 100, top: 440, width: 880}}>
        <Show until={l15}><Big words={['OLD', 'REGIME', 'KAB', 'JEETTA', 'HAI?']} at={6} gap={4} size={130} /></Show>
      </div>
      <Card id="bade" x={150} y={800} w={780} h={190} rot={-2} at={word('L14', 'bade', -3)} out={l15} bg={C.yellow} torn={{right: true}}>
        <div style={{fontFamily: F.display, fontSize: 96, textAlign: 'center', marginTop: 34}}>BADE DEDUCTIONS</div>
      </Card>

      {/* L15: the stack of deductions */}
      <Show from={l15} until={l16}>
        <div style={{position: 'absolute', left: 120, top: 430}}>
          <Label size={26}>Old regime ke deductions</Label>
        </div>
      </Show>
      {CHIPS.map(([t, wi], i) => (
        <Card key={t} id={'chip' + i} x={170 + (i % 2) * 30} y={1010 - i * 130} w={740} h={112} rot={[-1.5, 1, -1, 1.5][i]} at={wAt('L15', wi, -4)} out={l16} enter="drop" bg={i === 2 ? C.yellow : C.card}>
          <div style={{fontFamily: F.display, fontSize: 64, textAlign: 'center', marginTop: 18}}>{t}</div>
        </Card>
      ))}
      <Stamp id="sab" text="Sab mila ke" sub="TAB OLD JEET SAKTA HAI" x={700} y={520} at={wAt('L15', 9, -2)} out={l16} size={70} rot={-7} paper />

      {/* L16: weigh both, use a calculator */}
      <Show from={scaleIn}>
        <div style={{position: 'absolute', left: 160, top: 420, opacity: ease(stepped(frame), scaleIn, scaleIn + 6)}}>
          <Scale w={760} tilt={tilt}
            left={<Label size={30}>Old</Label>}
            right={<Label size={30} dark={false}>New</Label>} />
        </div>
      </Show>
      <Hand x={130} y={410} at={word('L16', 'dono', -2)} size={60} rot={-4}>dono taraf hisaab</Hand>
      <Card id="calc" x={150} y={880} w={780} h={330} rot={1.5} at={calc} enter="up" bg={C.card}>
        <Head>TAX CALCULATOR</Head>
        <div style={{padding: '18px 44px'}}>
          <Row label="Old regime" value="₹ ......" size={40} />
          <Row label="New regime" value="₹ ......" size={40} />
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 2, marginTop: 14, color: C.inkSoft}}>JO KAM, WAHI CHUNO</div>
        </div>
      </Card>
      <Sfx at={scaleIn} name="drop" volume={0.25} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- what to do
const Fix: React.FC = () => {
  const {at, word} = useCues();
  const wAt = useWordAt();
  const l18 = at('L18');
  return (
    <AbsoluteFill>
      {/* L17: ELSS is fine as an investment, not as a tax ritual */}
      <Card id="elss" x={100} y={430} w={880} h={340} rot={-1.5} at={2} out={l18} enter="up" bg={C.card}>
        <div style={{padding: '30px 46px'}}>
          <Label size={24}>ELSS</Label>
          <div style={{fontFamily: F.display, fontSize: 84, lineHeight: 1.05, marginTop: 22}}>
            <Pop at={word('L17', 'investment', -4)}>ACHHA INVESTMENT <Tick at={word('L17', 'investment', 2)} size={64} /></Pop>
          </div>
          <div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 48, marginTop: 10, color: C.inkSoft}}>
            <Pop at={word('L17', 'sakta', -2)}>ho sakta hai, agar goal ke liye ho</Pop>
          </div>
        </div>
      </Card>
      <Card id="naam" x={150} y={830} w={780} h={250} rot={2} at={wAt('L17', 8, -4)} out={l18} enter="right" bg={C.paperLight}>
        <div style={{fontFamily: F.display, fontSize: 92, textAlign: 'center', marginTop: 70}}>SIRF TAX KE NAAM PE?</div>
      </Card>
      <Cross id="xnaam" x={180} y={850} w={720} h={210} at={word('L17', 'mat', -2)} out={l18} />

      {/* L18: order of operations */}
      <Card id="hr" x={100} y={430} w={880} h={640} rot={-1} at={l18} enter="up" bg={C.card}>
        <Head>HR DECLARATION SE PEHLE</Head>
        <div style={{position: 'absolute', left: 0, right: 0, top: 60, bottom: 0, ...grid(40)}} />
        <div style={{position: 'relative', padding: '50px 54px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 30, marginBottom: 54}}>
            <Tick at={wAt('L18', 5, -2)} size={80} />
            <span style={{fontFamily: F.display, fontSize: 92}}>1. <HL at={wAt('L18', 4, 0)}>REGIME</HL> CHUNO</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
            <Tick at={wAt('L18', 7, -2)} size={80} />
            <span style={{fontFamily: F.display, fontSize: 92}}>2. PHIR INVESTMENT</span>
          </div>
        </div>
      </Card>
      <Sfx at={wAt('L18', 5, 0)} name="tick" volume={0.3} />
      <Sfx at={wAt('L18', 7, 0)} name="tick" volume={0.3} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- outro
const Outro: React.FC = () => (
  <AbsoluteFill>
    <SignOff share="L19" sign="L20" who="us dost ko jo March mein tax-saving policy dhoondhta hai →" note="ILLUSTRATIVE · SALARIED · ₹12 LAKH · FY 2026-27 SLABS · '80C' AS COMMONLY CALLED" />
  </AbsoluteFill>
);

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  two: Two,
  newmath: NewMath,
  oldmath: OldMath,
  when: When,
  fix: Fix,
  outro: Outro,
};
