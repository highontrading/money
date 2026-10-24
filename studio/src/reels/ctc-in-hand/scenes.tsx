import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Big, Card, Count, Cross, Hand, HL, Label, Sfx, Stamp, Tape} from '../../components/paper';
import {ease, stepped} from '../../lib/motion';
import {useCues} from '../../lib/timeline';
import {C, F} from '../../theme';
import {SignOff} from '../common';
import {Calendar, Confetti, grid, Head, Jar, Pop, Row, Show, Target, Umbrella} from './props';

const Tick: React.FC<{at: number; size?: number; mark?: string; color?: string}> = ({at, size = 50, mark = '✓', color = C.ink}) => (
  <span style={{display: 'inline-block', width: size, height: size, border: `4px solid ${C.ink}`, background: C.paperLight, textAlign: 'center', lineHeight: `${size - 6}px`, fontFamily: F.display, fontSize: size * 0.8, color, verticalAlign: 'middle'}}>
    <Pop at={at}>{mark}</Pop>
  </span>
);

// ---------------------------------------------------------------- hook
const Hook: React.FC = () => {
  const {at, word} = useCues();
  const l2 = at('L02'), l3 = at('L03'), l4 = at('L04');
  return (
    <AbsoluteFill>
      {/* L01: the offer letter */}
      <Card id="offer" x={110} y={420} w={860} h={640} rot={-1.5} at={2} out={l2} enter="up" bg={C.card}>
        <Head right="CONFIDENTIAL">OFFER LETTER</Head>
        <div style={{padding: '34px 50px'}}>
          <div style={{fontFamily: F.type, fontSize: 36, lineHeight: 1.5, color: C.inkSoft}}>
            Dear Candidate,<br />Congratulations! We are pleased to offer you…
          </div>
          <div style={{marginTop: 40, fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 4}}>ANNUAL CTC</div>
          <div style={{fontFamily: F.display, fontSize: 190, lineHeight: 1, marginTop: 10}}>
            <Pop at={word('L01', '₹12', -3)}><HL at={word('L01', '₹12', 3)}>₹12,00,000</HL></Pop>
          </div>
        </div>
      </Card>
      <Tape id="toffer" x={460} y={402} w={160} rot={-4} at={4} out={l2} />

      {/* L02: the dream: ₹1 lakh a month, party */}
      <Card id="dream" x={90} y={430} w={880} h={300} rot={-2.5} at={l2} enter="drop" bg={C.paperLight} torn={{right: true}}>
        <div style={{padding: '30px 46px'}}>
          <Label size={24}>Socha · har mahine</Label>
          <div style={{fontFamily: F.display, fontSize: 150, lineHeight: 1, marginTop: 20}}>
            <Pop at={word('L02', '₹1', -3)}>₹1,00,000</Pop>
          </div>
        </div>
      </Card>
      <Card id="party" x={620} y={620} w={330} h={130} rot={7} at={word('L02', 'party', -3)} out={l3} bg={C.yellow} z={55}>
        <div style={{fontFamily: F.display, fontSize: 86, textAlign: 'center', marginTop: 14, letterSpacing: 2}}>PARTY!</div>
      </Card>
      <Show until={l3}>
        <div style={{position: 'absolute', left: 600, top: 580}}>
          <Confetti at={word('L02', 'party', 0)} w={360} h={200} />
        </div>
      </Show>
      <Hand x={110} y={770} at={word('L02', 'har', -2)} out={l3} size={56} rot={-4} w={480}>CTC ÷ 12 = ?</Hand>

      {/* L03: the first payslip */}
      <Card id="slip1" x={140} y={830} w={840} h={340} rot={1.5} at={l3} enter="up" bg={C.card}>
        <Head right="MAHINA 1">PAYSLIP · CREDITED</Head>
        <div style={{position: 'absolute', left: 0, right: 0, top: 58, bottom: 0, ...grid(34)}} />
        <div style={{position: 'relative', padding: '26px 46px'}}>
          <Label size={22}>Pehli salary aayi</Label>
          <div style={{fontFamily: F.display, fontSize: 150, lineHeight: 1, marginTop: 14}}>
            <Show until={word('L03', '₹79', -3)}>₹ ?</Show>
            <Show from={word('L03', '₹79', -3)}><HL at={word('L03', '₹79', 4)}><Count from={100000} to={79000} at={word('L03', '₹79', -3)} dur={12} /></HL></Show>
          </div>
        </div>
      </Card>

      {/* L04: where did ₹21,000 go? */}
      <Stamp id="gap" text="₹21,000 kahan?" x={660} y={1160} at={word('L04', '₹21', -2)} size={76} rot={-7} />
      <Hand x={110} y={748} at={word('L04', 'kholte', -4)} size={54} rot={-3} w={700}>chalo, CTC kholte hain →</Hand>
      <Sfx at={l4} name="pop" volume={0.2} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- CTC sliced
const Piece: React.FC<{top: number; at: number; amountAt: number; subAt: number; label: string; amount: string; sub: string; icon: React.ReactNode; iconAt: number; tint?: string}> = ({top, at, amountAt, subAt, label, amount, sub, icon, iconAt, tint}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at) return null;
  const p = ease(f, at, at + 8);
  return (
    <div style={{position: 'absolute', left: 36, right: 36, top, height: 150, display: 'flex', alignItems: 'center', gap: 26, borderBottom: `2px dashed ${C.grey}`, opacity: p, transform: `translateX(${(1 - p) * -40}px)`, background: tint}}>
      <div style={{width: 100, display: 'flex', justifyContent: 'center'}}>{f >= iconAt ? <Pop at={iconAt}>{icon}</Pop> : null}</div>
      <div style={{flex: 1}}>
        <div style={{fontFamily: F.display, fontSize: 64, lineHeight: 1, whiteSpace: 'nowrap'}}>{label}</div>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, marginTop: 10, color: C.inkSoft, opacity: f >= subAt ? 1 : 0, textTransform: 'uppercase'}}>{sub}</div>
      </div>
      <div style={{fontFamily: F.display, fontSize: 74, whiteSpace: 'nowrap'}}>
        <Pop at={amountAt}><span style={{color: C.red}}>−</span><HL at={amountAt + 4}>{amount}</HL></Pop>
      </div>
    </div>
  );
};

const Ctc: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l6 = at('L06');
  return (
    <AbsoluteFill>
      {/* L05: CTC = cost to company */}
      <Card id="def" x={100} y={430} w={880} h={680} rot={-1} at={2} out={l6} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid(40)}} />
        <div style={{position: 'relative', padding: '44px 50px'}}>
          <Label size={24}>CTC matlab</Label>
          <div style={{fontFamily: F.display, fontSize: 112, lineHeight: 1.02, marginTop: 24}}>
            <Pop at={word('L05', 'cost', -3)}>COST TO <HL at={word('L05', 'company', 2)}>COMPANY</HL></Pop>
          </div>
          <div style={{marginTop: 54, display: 'flex', flexDirection: 'column', gap: 26}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 24, opacity: stepped(frame) >= word('L05', 'kharcha', -4) ? 1 : 0}}>
              <Tick at={word('L05', 'kharcha', 0)} />
              <span style={{fontFamily: F.display, fontSize: 70}}>COMPANY KA KHARCHA</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 24, opacity: stepped(frame) >= word('L05', 'aapki', -4) ? 1 : 0}}>
              <Tick at={word('L05', 'nahi', -2)} mark="✗" color={C.red} />
              <span style={{fontFamily: F.display, fontSize: 70}}>AAPKI SALARY</span>
            </div>
          </div>
        </div>
      </Card>
      <Cross id="xsal" x={240} y={938} w={520} h={80} at={word('L05', 'nahi', 0)} out={l6} />

      {/* L06-L09: the four slices that never reach your monthly salary */}
      <Card id="tukde" x={80} y={410} w={920} h={800} rot={-0.6} at={l6 - 2} enter="up" bg={C.card} torn={{bottom: true}}>
        <Head right="₹12,00,000">CTC KE TUKDE</Head>
        <Piece top={78} at={l6} iconAt={word('L06', 'target', -2)} amountAt={word('L06', '₹1', -3)} subAt={word('L06', 'agar', -2)}
          label="VARIABLE PAY" amount="₹1,00,000" sub="saal ke end · agar target pura hua" icon={<Target size={84} />} />
        <Piece top={248} at={at('L07')} iconAt={word('L07', 'seedha', -2)} amountAt={word('L07', '₹60', -3)} subAt={word('L07', 'seedha', -2)}
          label="COMPANY KA PF" amount="₹60,000" sub="seedha PF account mein" icon={<Jar size={78} fill={0.55} />} />
        <Piece top={418} at={at('L08')} iconAt={word('L08', '5', -3)} amountAt={word('L08', '₹24', -3)} subAt={word('L08', 'aam', -2)}
          label="GRATUITY" amount="₹24,000" sub="aam taur pe 5 saal naukri ke baad" icon={<Calendar size={84} />} />
        <Piece top={588} at={at('L09')} iconAt={word('L09', 'insurance', -2)} amountAt={word('L09', '₹6', -3)} subAt={word('L09', 'lagbhag', -2)}
          label="GROUP INSURANCE" amount="₹6,000" sub="lagbhag · company ka cover" icon={<Umbrella size={86} />} />
      </Card>
      <Tape id="ttk" x={440} y={392} w={170} rot={-3} at={l6} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- monthly payslip
const Monthly: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l11 = at('L11'), l13 = at('L13'), l14 = at('L14');
  const zero = word('L13', 'zero', -3);
  return (
    <AbsoluteFill>
      {/* L10: what's left: gross */}
      <Card id="gross" x={110} y={440} w={860} h={640} rot={-1.5} at={2} out={l11} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid(40)}} />
        <div style={{position: 'relative', padding: '44px 54px'}}>
          <Label size={24}>Bacha · gross salary</Label>
          <div style={{fontFamily: F.display, fontSize: 168, lineHeight: 1, marginTop: 26}}>
            <Show until={word('L10', '₹10', -3)}>₹ ?</Show>
            <Show from={word('L10', '₹10', -3)}><Pop at={word('L10', '₹10', -3)}><HL at={word('L10', '₹10', 3)}>₹10.1 LAKH</HL></Pop></Show>
          </div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 3, color: C.inkSoft, marginTop: 10}}>SAAL KA</div>
          <div style={{height: 4, background: C.ink, margin: '40px 0 30px', opacity: stepped(frame) >= word('L10', 'mahine', -3) ? 1 : 0}} />
          <div style={{display: 'flex', alignItems: 'baseline', gap: 30, opacity: stepped(frame) >= word('L10', 'mahine', -3) ? 1 : 0}}>
            <span style={{fontFamily: F.display, fontSize: 64}}>MAHINE KA</span>
            <span style={{fontFamily: F.display, fontSize: 130}}><Pop at={word('L10', '₹84', -3)}><HL at={word('L10', '₹84', 3)}>₹84,000</HL></Pop></span>
          </div>
        </div>
      </Card>

      {/* L11-L14: the payslip */}
      <Card id="pay" x={90} y={420} w={900} h={790} rot={-0.8} at={l11 - 2} enter="up" bg={C.card} torn={{bottom: true}}>
        <Head right="HAR MAHINA">PAYSLIP</Head>
        <div style={{padding: '18px 46px'}}>
          <Row label="Gross salary" value="₹84,000" size={50} at={l11} />
          <Row label="− Aapka PF" value={<HL at={word('L11', '₹5', 3)}>₹5,000</HL>} size={50} at={word('L11', '₹5', -3)} sub={<Pop at={word('L11', 'pf', 0)}>aapke apne PF account mein</Pop>} />
          <Row label="− Professional tax" value="₹200" size={50} at={word('L12', '₹200', -3)} sub="kuch states mein" />
          <Row label="− Income tax" size={50} at={l13}
            value={<><Show until={zero}>?</Show><Show from={zero}><Pop at={zero}><HL at={zero + 3}>₹0</HL></Pop></Show></>} />
          <div style={{height: 5, background: C.ink, margin: '16px 0 10px', opacity: stepped(frame) >= l14 ? 1 : 0}} />
          <Row label="IN-HAND" bold size={92} at={l14} last value={<Pop at={word('L14', '₹79', -3)}><HL at={word('L14', '₹79', 3)}>₹79,000</HL></Pop>} />
        </div>
      </Card>
      <Card id="nr" x={500} y={812} w={280} h={78} rot={4} at={word('L13', 'new', -3)} bg={C.yellow} z={60}>
        <div style={{fontFamily: F.display, fontSize: 46, textAlign: 'center', marginTop: 11, letterSpacing: 2}}>NEW REGIME</div>
      </Card>
      <Hand x={420} y={812} at={word('L12', 'states', -2)} out={l13} size={44} rot={-3} w={300}>(sab states nahi)</Hand>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- reassurance + checklist
const Good: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l16 = at('L16'), l17 = at('L17'), l18 = at('L18');
  const nahi = word('L15', 'nahi', -2);
  return (
    <AbsoluteFill>
      {/* L15: gone? no */}
      <div style={{position: 'absolute', left: 110, top: 450, width: 860}}>
        <Show until={l16}><Big words={['₹21,000', 'GAYE?']} at={2} gap={5} size={170} /></Show>
      </div>
      <Stamp id="nahi" text="Nahi" x={730} y={690} at={nahi} out={l16} size={120} rot={-10} />
      <Card id="apna" x={130} y={800} w={820} h={190} rot={-2} at={word('L15', 'zyaadatar', -3)} out={l16} bg={C.yellow} torn={{right: true}}>
        <div style={{fontFamily: F.display, fontSize: 82, textAlign: 'center', marginTop: 46, whiteSpace: 'nowrap'}}>AAPKA HI PAISA ✓</div>
      </Card>

      {/* L16: PF = retirement; variable = earned */}
      <Card id="pfcard" x={80} y={440} w={440} h={640} rot={-2} at={l16} out={l17} enter="left" bg={C.card}>
        <Head>PF</Head>
        <div style={{padding: '30px 30px', textAlign: 'center'}}>
          <Jar size={190} fill={Math.min(0.9, 0.3 + 0.6 * ease(stepped(frame), word('L16', 'retirement', -2), word('L16', 'retirement', 40)))} />
          <div style={{fontFamily: F.display, fontSize: 60, marginTop: 30, opacity: stepped(frame) >= word('L16', 'retirement', -2) ? 1 : 0}}>→ <HL at={word('L16', 'retirement', 2)}>RETIREMENT</HL></div>
          <div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 46, marginTop: 14, opacity: stepped(frame) >= word('L16', 'jud', -2) ? 1 : 0}}>jud raha hai…</div>
        </div>
      </Card>
      <Card id="varcard" x={560} y={460} w={440} h={620} rot={2} at={word('L16', 'variable', -3)} out={l17} enter="right" bg={C.card}>
        <Head>VARIABLE</Head>
        <div style={{padding: '34px 30px', textAlign: 'center'}}>
          <Target size={170} />
          <div style={{fontFamily: F.display, fontSize: 56, marginTop: 30, opacity: stepped(frame) >= word('L16', 'achha', -2) ? 1 : 0}}>ACHHA KAAM</div>
          <div style={{fontFamily: F.display, fontSize: 64, marginTop: 6, opacity: stepped(frame) >= word('L16', 'milega', -3) ? 1 : 0}}>= <HL at={word('L16', 'milega', 2)}>MILEGA ✓</HL></div>
        </div>
      </Card>

      {/* L17-L18: offer checklist */}
      <Card id="check" x={100} y={430} w={880} h={720} rot={-1} at={l17} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid(40)}} />
        <div style={{position: 'relative', padding: '40px 50px'}}>
          <Label size={24}>Offer compare karte waqt</Label>
          <div style={{marginTop: 34, display: 'flex', flexDirection: 'column', gap: 34}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
              <Tick at={word('L17', 'ctc', 0)} mark="✗" color={C.red} />
              <span style={{fontFamily: F.display, fontSize: 70, opacity: stepped(frame) >= l17 + 6 ? 1 : 0}}>SIRF CTC DEKHNA</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 26, opacity: stepped(frame) >= word('L17', 'in-hand', -4) ? 1 : 0}}>
              <Tick at={word('L17', 'in-hand', 2)} />
              <span style={{fontFamily: F.display, fontSize: 70}}><HL at={word('L17', 'in-hand', 2)}>IN-HAND</HL> POOCHO</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 26, opacity: stepped(frame) >= l18 ? 1 : 0}}>
              <Tick at={word('L18', 'breakup', 0)} />
              <span style={{fontFamily: F.display, fontSize: 70}}>SALARY <HL at={word('L18', 'breakup', 2)}>BREAKUP</HL> MAANGO</span>
            </div>
            <div style={{display: 'flex', gap: 22, marginLeft: 76}}>
              <Pop at={word('L18', 'basic', -3)}><span style={{display: 'inline-block', border: `4px solid ${C.ink}`, background: C.paperLight, fontFamily: F.display, fontSize: 48, padding: '8px 20px'}}>BASIC KITNA?</span></Pop>
              <Pop at={word('L18', 'variable', -3)}><span style={{display: 'inline-block', border: `4px solid ${C.ink}`, background: C.yellow, fontFamily: F.display, fontSize: 48, padding: '8px 20px'}}>VARIABLE KITNA?</span></Pop>
            </div>
          </div>
        </div>
      </Card>
      <Cross id="xctc" x={250} y={612} w={560} h={70} at={word('L17', 'nahi', -2)} />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <AbsoluteFill>
    <SignOff share="L19" sign="L20" who="us dost ko jisne abhi offer letter paaya hai →" note="ILLUSTRATIVE · CTC ₹12 LAKH · BASIC ₹5 LAKH · NEW REGIME FY 2026-27" />
  </AbsoluteFill>
);

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  ctc: Ctc,
  monthly: Monthly,
  good: Good,
  outro: Outro,
};
