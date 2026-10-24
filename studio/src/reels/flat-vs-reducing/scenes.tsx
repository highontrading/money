import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Big, Card, Circle, Count, Cross, Hand, HL, Label, Sfx, Stamp, Tape} from '../../components/paper';
import {ease, pop, stepped} from '../../lib/motion';
import {useCues} from '../../lib/timeline';
import {C, F} from '../../theme';
import {SignOff} from '../common';
import {grid, LoanChart, N, Pop, Row, Show, Ticks} from './props';

const pct1 = (n: number) => n.toFixed(1) + '%';

// ---------------------------------------------------------------- hook
const Hook: React.FC = () => {
  const {at, word} = useCues();
  const l2 = at('L02');
  const l4 = word('L04', 'ek', -2); // keep the offer on screen through "Kaise?"
  const banner = 2;
  return (
    <AbsoluteFill>
      {/* L01: the showroom offer */}
      <Hand x={250} y={930} at={0} out={l2} size={70} rot={-4}>— dealer bhaiya</Hand>
      <Card id="banner" x={90} y={470} w={900} h={380} rot={-2} at={banner} out={l4} enter="drop" bg={C.yellow} torn={{bottom: true}} rough={12}>
        <div style={{padding: '34px 50px'}}>
          <Label size={24}>Festive offer · showroom</Label>
          <div style={{fontFamily: F.display, fontSize: 92, lineHeight: 1, marginTop: 22}}>LOAN SIRF</div>
          <div style={{fontFamily: F.display, fontSize: 190, lineHeight: 1, marginTop: 4, whiteSpace: 'nowrap'}}>10% FLAT<span style={{fontSize: 110, verticalAlign: 'top'}}>*</span></div>
        </div>
      </Card>
      <Tape id="tban" x={460} y={452} w={160} rot={-5} at={banner + 2} out={l4} />

      {/* L02: the loan slip */}
      <Card id="slip" x={150} y={890} w={780} h={330} rot={1.5} at={l2} out={l4} enter="up" bg={C.card} torn={{bottom: true}}>
        <div style={{padding: '22px 44px'}}>
          <Row label="Loan" value={<Pop at={word('L02', 'lakh', -4)}>₹1,00,000</Pop>} />
          <Row label="Tenure" value={<Pop at={word('L02', 'saal', -4)}>3 saal</Pop>} />
          <Row label="EMI" value={<Pop at={word('L02', '3,611', -2)}><HL at={word('L02', '3,611', 2)}><span style={{fontFamily: F.display, fontSize: 56}}>₹3,611</span></HL></Pop>} style={{borderBottom: 'none'}} />
        </div>
      </Card>

      {/* L03: the real rate */}
      <Cross id="x10" x={130} y={640} w={400} h={180} at={word('L03', 'asli', -4)} out={l4} />
      <Stamp id="s18" text="Asli ~18%" x={720} y={700} at={word('L03', '18%', -4)} out={l4} size={96} rot={-8} paper />

      {/* L04: one small word */}
      <div style={{position: 'absolute', left: 100, top: 440, width: 880}}>
        <Show from={l4}><Big words={['EK', 'CHHOTA', 'SA', 'SHABD:']} at={word('L04', 'ek', -2)} gap={4} size={150} /></Show>
      </div>
      <Card id="flatword" x={150} y={800} w={780} h={330} rot={-3} at={word('L04', 'flat', -4)} enter="drop" bg={C.yellow} torn={{top: true, right: true}} rough={14}>
        <div style={{fontFamily: F.display, fontSize: 280, lineHeight: 1, textAlign: 'center', marginTop: 20, letterSpacing: 6}}>FLAT</div>
      </Card>
      <Circle id="cflat" cx={540} cy={965} rx={430} ry={200} at={word('L04', 'flat', 8)} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- flat
const YearCol: React.FC<{id: string; i: number; at: number; out: number}> = ({id, i, at, out}) => (
  <Card id={id} x={95 + i * 305} y={420} w={280} h={500} rot={[-2, 1.5, -1][i]} at={at} out={out} enter="up" bg={C.card}>
    <div style={{position: 'absolute', inset: 0, ...grid(30)}} />
    <div style={{position: 'relative', padding: '22px 24px'}}>
      <Label size={22}>{`Saal ${i + 1}`}</Label>
    </div>
    <div style={{position: 'absolute', left: 40, right: 40, bottom: 30, height: 270, background: C.ink, color: C.paperLight, fontFamily: F.display, fontSize: 52, textAlign: 'center', paddingTop: 100}}>₹1L</div>
    <div style={{position: 'absolute', left: 26, right: 26, bottom: 316, height: 82, background: C.yellow, border: `3px solid ${C.ink}`, fontFamily: F.display, fontSize: 50, textAlign: 'center', paddingTop: 8}}>+₹10,000</div>
  </Card>
);

const Flat: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l6 = at('L06'), l8 = at('L08');
  return (
    <AbsoluteFill>
      {/* L05: interest on the full lakh */}
      <Card id="lbar" x={90} y={460} w={900} h={420} rot={-1} at={0} out={l6} enter="up" bg={C.card}>
        <div style={{padding: '34px 46px'}}>
          <Label size={24}>Flat rate</Label>
          <div style={{fontFamily: F.display, fontSize: 64, lineHeight: 1.05, marginTop: 22}}>INTEREST LAGTA HAI</div>
          <div style={{marginTop: 30, height: 130, background: C.ink, color: C.paperLight, fontFamily: F.display, fontSize: 90, textAlign: 'center', paddingTop: 14}}>₹1,00,000</div>
        </div>
      </Card>
      <Card id="lchip" x={560} y={820} w={400} h={110} rot={4} at={word('L05', 'poore', -2)} out={l6} bg={C.yellow} sfx={null}>
        <div style={{fontFamily: F.display, fontSize: 58, textAlign: 'center', marginTop: 18}}>POORE PE ↑</div>
      </Card>

      {/* L06: every year, the full lakh */}
      <YearCol id="y1" i={0} at={word('L06', 'pehle', -4)} out={l8} />
      <YearCol id="y2" i={1} at={word('L06', 'doosre', -4)} out={l8} />
      <YearCol id="y3" i={2} at={word('L06', 'teesre', -4)} out={l8} />

      {/* L07: 10% x 3 = ₹30,000 */}
      <Card id="sum" x={110} y={960} w={860} h={220} rot={-1.5} at={at('L07')} out={l8} enter="right" bg={C.paperLight}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 26, fontFamily: F.display, fontSize: 84, whiteSpace: 'nowrap'}}>
          <Pop at={word('L07', '10%', -2)}>10%</Pop>
          <Pop at={word('L07', '3', -2)}>× 3 SAAL</Pop>
          <Pop at={word('L07', '30,000', -2)}>= <HL at={word('L07', '30,000', 4)}>₹30,000</HL></Pop>
        </div>
      </Card>

      {/* L08: ₹1,30,000 / 36 = ₹3,611 */}
      <Card id="eq" x={110} y={420} w={860} h={280} rot={-1} at={l8} enter="up" bg={C.card}>
        <div style={{padding: '30px 46px', fontFamily: F.display, lineHeight: 1.05}}>
          <div style={{fontSize: 72, color: C.inkSoft}}>₹1,00,000 + ₹30,000</div>
          <div style={{fontSize: 118}}>= ₹1,30,000</div>
        </div>
      </Card>
      <Card id="slips" x={110} y={735} w={860} h={250} rot={1} at={word('L08', '36', -4)} enter="fade" bg={C.paperLight} sfx={null}>
        <div style={{position: 'absolute', left: 30, top: 20, fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 2}}>÷ 36 MAHINE</div>
        <div style={{position: 'absolute', left: 30, top: 62, display: 'grid', gridTemplateColumns: 'repeat(12, 60px)', gap: 7}}>
          {Array.from({length: N}).map((_, i) => {
            const p = Math.min(1, Math.max(0, pop(frame, word('L08', '36', -2) + Math.floor(i / 2))));
            return <div key={i} style={{height: 50, background: i % 2 ? C.card : '#efe7d4', border: `2px solid ${C.ink}`, transform: `scale(${p})`, fontFamily: F.mono, fontSize: 16, fontWeight: 700, textAlign: 'center', paddingTop: 13}}>{i + 1}</div>;
          })}
        </div>
      </Card>
      <Sfx at={word('L08', '36', 0)} name="slide" volume={0.25} />
      <Card id="emi" x={200} y={1015} w={680} h={190} rot={-2} at={word('L08', '3,611', -4)} enter="drop" bg={C.yellow}>
        <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 20, marginTop: 26}}>
          <div style={{fontFamily: F.display, fontSize: 130, lineHeight: 1}}>₹3,611</div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 2}}>EMI</div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- catch
const Catch: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const f = stepped(frame);
  const har = word('L09', 'har', -2), aadha = word('L10', 'aadha', 0), last = word('L11', '2,778', -2);
  const shown = Math.round(18 * ease(f, har, aadha) + 18 * ease(f, aadha + 6, last));
  const outline = ease(f, word('L12', 'interest', -2), word('L12', 'pe', 0));
  const hatch = ease(f, word('L13', 'lauta', -4), word('L13', 'diya', 8));
  const hi = f >= last ? [36] : f >= aadha ? [19] : [];
  return (
    <AbsoluteFill>
      <Card id="chart" x={70} y={420} w={940} h={780} rot={-0.6} at={0} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid(40, 'rgba(70, 110, 150, 0.10)')}} />
        <div style={{position: 'absolute', left: 34, top: 26}}><Label size={22}>Baaki loan · har EMI ke baad</Label></div>
        <div style={{position: 'absolute', left: 0, top: 60, width: 940, height: 700}}>
          <LoanChart w={940} h={700} shown={shown} outline={outline} hatch={hatch} hi={hi} />
        </div>
      </Card>
      <Ticks a={har} b={last} />
      <Stamp id="ruko" text="Ruko!" x={820} y={600} at={word('L09', 'ruko', -2)} out={har + 16} size={90} rot={8} paper />

      {/* L10: half repaid at 18 months */}
      <Hand x={610} y={720} at={aadha} out={last} size={58} rot={-4}>← aadha wapas!</Hand>
      {/* L11: the last month, ₹2,778 left */}
      <Card id="c2778" x={700} y={850} w={250} h={100} rot={3} at={last} out={word('L12', 'interest', -2)} bg={C.yellow} sfx="pop">
        <div style={{fontFamily: F.display, fontSize: 64, textAlign: 'center', marginTop: 12}}>₹2,778</div>
      </Card>
      <Circle id="clast" cx={968} cy={1102} rx={42} ry={46} at={last + 6} out={word('L12', 'interest', -2)} />

      {/* L12: but flat interest still on the full lakh */}
      <Card id="chip" x={540} y={456} w={450} h={86} rot={2} at={word('L12', 'interest', -2)} bg={C.paperLight} sfx={null}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 25, letterSpacing: 1, textAlign: 'center', marginTop: 25, color: C.red, whiteSpace: 'nowrap'}}>- - - INTEREST: ₹1 LAKH PE</div>
      </Card>
      {/* L13: interest on money already returned */}
      <Stamp id="lauta" text="Lautaya paisa" sub="PE BHI INTEREST" x={520} y={760} at={word('L13', 'uspe', -4)} size={68} rot={-7} paper />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- reducing
const Receipt: React.FC<{id: string; x: number; rot: number; at: number; out: number; title: string; emi: React.ReactNode; interest: React.ReactNode; showEmi: boolean; showInt: boolean; hi?: boolean}> = ({id, x, rot, at, out, title, emi, interest, showEmi, showInt, hi}) => (
  <Card id={id} x={x} y={420} w={440} h={560} rot={rot} at={at} out={out} enter={x < 300 ? 'left' : 'right'} bg={C.card} torn={{bottom: true}}>
    <div style={{padding: '30px 30px'}}>
      <div style={{background: hi ? C.yellow : C.ink, color: hi ? C.ink : C.paperLight, fontFamily: F.display, fontSize: 54, padding: '8px 16px', textAlign: 'center'}}>{title}</div>
      <div style={{marginTop: 20}}>
        <Row label="Loan" value="₹1,00,000" size={32} />
        <Row label="Tenure" value="3 saal" size={32} />
        <Row label="EMI" value={<span style={{fontFamily: F.display, fontSize: 48}}>{emi}</span>} size={32} show={showEmi} />
        <Row label="Interest" value={<span style={{fontFamily: F.display, fontSize: 56}}>{interest}</span>} size={32} show={showInt} style={{borderBottom: 'none'}} />
      </div>
    </div>
  </Card>
);

const Reducing: React.FC = () => {
  const {at, word} = useCues();
  const f = stepped(useCurrentFrame());
  const l15 = at('L15'), l16 = at('L16'), l17 = at('L17'), l18 = at('L18');
  const caps = ease(f, word('L14', 'interest', -2), word('L14', 'pe', 4));
  return (
    <AbsoluteFill>
      {/* L14: reducing balance: interest only on what's left */}
      <Card id="rtitle" x={110} y={420} w={860} h={140} rot={-1.5} at={at('L14')} out={l15} enter="left" bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 96, textAlign: 'center', marginTop: 16, whiteSpace: 'nowrap'}}>REDUCING BALANCE</div>
      </Card>
      <Card id="rchart" x={70} y={590} w={940} h={620} rot={0.8} at={word('L14', 'reducing', -4)} out={l15} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid(40, 'rgba(70, 110, 150, 0.10)')}} />
        <div style={{position: 'absolute', left: 0, top: 20, width: 940, height: 580}}>
          <LoanChart w={940} h={580} shown={N} caps={caps} capLabel="PEELA = INTEREST · SIRF BAAKI LOAN PE" />
        </div>
      </Card>

      {/* L15-L16: the two receipts */}
      <Receipt id="rred" x={560} rot={1.5} at={l15} out={l17} title="REDUCING 10%" hi
        emi={<HL at={word('L15', '3,227', 2)}>₹3,227</HL>} interest={<HL at={word('L15', '16,162', 2)}>₹16,162</HL>}
        showEmi={f >= word('L15', '3,227', -4)} showInt={f >= word('L15', '16,162', -4)} />
      <Receipt id="rflat" x={80} rot={-1.5} at={l16 - 4} out={l17} title="FLAT 10%"
        emi="₹3,611" interest={<span style={{color: C.red}}>₹30,000</span>} showEmi showInt={f >= word('L16', '30,000', -4)} />
      <Card id="dugna" x={170} y={1020} w={740} h={180} rot={-2} at={word('L16', 'dugna', -4)} out={l17} enter="drop" bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 100, textAlign: 'center', marginTop: 28, whiteSpace: 'nowrap'}}>≈ DUGNA INTEREST</div>
      </Card>
      <Circle id="c30k" cx={405} cy={826} rx={125} ry={52} at={word('L16', '30,000', 4)} out={l17} />

      {/* L17: convert the EMI to a real rate */}
      <Card id="conv" x={110} y={420} w={860} h={230} rot={-1} at={l17} out={l18} enter="right" bg={C.card}>
        <div style={{padding: '28px 46px'}}>
          <Label size={22}>Flat EMI</Label>
          <div style={{fontFamily: F.display, fontSize: 104, lineHeight: 1, marginTop: 18, whiteSpace: 'nowrap'}}>₹3,611 <span style={{fontSize: 56, color: C.inkSoft}}>× 36 MAHINE</span></div>
        </div>
      </Card>
      <Card id="arrow" x={190} y={680} w={700} h={100} rot={1.5} at={word('L17', 'reducing', -4)} out={l18} enter="fade" bg={C.ink} texture="kraft" sfx={null}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 3, color: C.paperLight, textAlign: 'center', marginTop: 30}}>↓ REDUCING RATE MEIN BADLO ↓</div>
      </Card>
      <Card id="r179" x={150} y={820} w={780} h={360} rot={-2.5} at={word('L17', '17.9%', -6)} out={l18} enter="drop" bg={C.yellow} torn={{top: true, right: true}} rough={14}>
        <div style={{fontFamily: F.display, fontSize: 260, lineHeight: 1, textAlign: 'center', marginTop: 40}}>
          <Count from={10} to={17.9} at={word('L17', '17.9%', -2)} dur={14} fmt={pct1} />
        </div>
      </Card>
      <Sfx at={word('L17', '17.9%', 12)} name="coin" volume={0.25} />

      {/* L18: thumb rule */}
      <Card id="thumb" x={100} y={430} w={880} h={560} rot={-1} at={l18} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid(40)}} />
        <div style={{position: 'relative', padding: '36px 50px'}}>
          <Label size={24}>Thumb rule</Label>
          <div style={{fontFamily: F.display, fontSize: 92, lineHeight: 1.05, marginTop: 30}}>FLAT RATE KA</div>
          <div style={{fontFamily: F.display, fontSize: 92, lineHeight: 1.05}}>ASLI RATE</div>
          <div style={{fontFamily: F.display, fontSize: 120, lineHeight: 1.1, marginTop: 10}}>≈ <HL at={word('L18', 'dugne', 0)}>DUGNE KE KAREEB</HL></div>
        </div>
      </Card>
      <Hand x={140} y={1040} at={word('L18', 'kareeb', 0)} size={56} rot={-3}>10% flat → ~18% asli</Hand>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- where
const Tag: React.FC<{id: string; i: number; at: number; out: number; text: string; sub?: string}> = ({id, i, at, out, text, sub}) => (
  <>
    <Card id={id} x={85 + i * 310} y={790} w={290} h={250} rot={[-5, 3, -2][i]} at={at} out={out} enter="drop" bg={i === 1 ? C.yellow : C.card} torn={{bottom: true}}>
      <div style={{position: 'absolute', left: 125, top: 16, width: 36, height: 36, borderRadius: '50%', border: `4px solid ${C.ink}`, background: C.paper}} />
      <div style={{fontFamily: F.display, fontSize: 64, lineHeight: 1, textAlign: 'center', marginTop: 74}}>{text}</div>
      {sub ? <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, textAlign: 'center', marginTop: 10}}>{sub}</div> : null}
    </Card>
  </>
);

const Where: React.FC = () => {
  const {at, word} = useCues();
  const l20 = at('L20');
  return (
    <AbsoluteFill>
      {/* L19: where flat rates hide */}
      <div style={{position: 'absolute', left: 100, top: 440, width: 880}}>
        <Show until={l20}><Big words={['YEH', 'KAHAN', 'MILTA', 'HAI?']} at={at('L19')} gap={4} size={150} /></Show>
      </div>
      <Tag id="tbike" i={0} at={word('L19', 'bike', -4)} out={l20} text="BIKE LOAN" />
      <Tag id="tcons" i={1} at={word('L19', 'consumer', -4)} out={l20} text="CONSUMER LOAN" />
      <Tag id="tpers" i={2} at={word('L19', 'personal', -4)} out={l20} text="PERSONAL LOAN" sub="(KUCH)" />

      {/* L20: the ₹999 a month offers */}
      <Card id="offer" x={90} y={460} w={900} h={460} rot={-2.5} at={l20} enter="drop" bg={C.yellow} torn={{top: true, bottom: true}} rough={14}>
        <div style={{padding: '40px 50px'}}>
          <Label size={24}>Offer!</Label>
          <div style={{fontFamily: F.display, fontSize: 110, lineHeight: 1, marginTop: 24}}>SIRF</div>
          <div style={{fontFamily: F.display, fontSize: 190, lineHeight: 1, whiteSpace: 'nowrap'}}>₹999<span style={{fontSize: 80}}>/MAHINA</span><span style={{fontSize: 110, verticalAlign: 'top'}}>*</span></div>
        </div>
      </Card>
      <Circle id="cstar" cx={815} cy={705} rx={62} ry={62} at={word('L20', 'offers', -6)} />
      <Hand x={560} y={950} at={word('L20', 'offers', 0)} size={64} rot={-4}>* flat rate?</Hand>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- check
const Check: React.FC = () => {
  const {at, word} = useCues();
  const l23 = at('L23'), l24 = at('L24');
  return (
    <AbsoluteFill>
      {/* L21: before you sign, one question */}
      <div style={{position: 'absolute', left: 100, top: 440, width: 880}}>
        <Show until={l23}><Big words={['LOAN', 'LENE', 'SE', 'PEHLE:']} at={at('L21')} gap={4} size={140} /></Show>
      </div>
      <Card id="sawaal" x={110} y={760} w={520} h={130} rot={-2} at={word('L21', 'ek', -4)} out={l23} bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 86, textAlign: 'center', marginTop: 14}}>EK SAWAAL</div>
      </Card>
      {/* L22: flat or reducing? */}
      <Card id="q" x={110} y={930} w={860} h={250} rot={1} at={at('L22', -2)} out={l23} enter="up" bg={C.card}>
        <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '100%', fontFamily: F.display, fontSize: 84}}>
          <Pop at={word('L22', 'flat', -2)}><span style={{border: `5px solid ${C.ink}`, padding: '6px 22px'}}>FLAT?</span></Pop>
          <span style={{fontFamily: F.hand, fontWeight: 700, fontSize: 64}}>ya</span>
          <Pop at={word('L22', 'reducing', -2)}><span style={{border: `5px solid ${C.ink}`, padding: '6px 22px', background: C.yellow}}>REDUCING?</span></Pop>
        </div>
      </Card>

      {/* L23: ask the APR */}
      <Card id="apr" x={110} y={430} w={860} h={420} rot={-1.5} at={l23} out={l24} enter="drop" bg={C.yellow} torn={{bottom: true}}>
        <div style={{padding: '30px 50px'}}>
          <Label size={24}>Poocho</Label>
          <div style={{fontFamily: F.display, fontSize: 250, lineHeight: 1, marginTop: 16}}>APR</div>
        </div>
      </Card>
      <Card id="aprdef" x={150} y={890} w={780} h={260} rot={1.5} at={word('L23', 'saari', -4)} out={l24} enter="up" bg={C.card}>
        <div style={{padding: '26px 40px', fontFamily: F.display, fontSize: 60, lineHeight: 1.15}}>
          <Pop at={word('L23', 'fees', -2)}>INTEREST + SAARI FEES</Pop>
          <div><Pop at={word('L23', 'saalana', -2)}>= <HL at={word('L23', 'asli', 0)}>SAALANA ASLI RATE</HL></Pop></div>
        </div>
      </Card>

      {/* L24: RBI's Key Fact Statement */}
      <Card id="kfs" x={110} y={420} w={860} h={760} rot={-1} at={l24} enter="up" bg={C.card}>
        <div style={{padding: '36px 50px'}}>
          <Label size={24}>Key Fact Statement</Label>
          <div style={{fontFamily: F.type, fontSize: 26, color: C.inkSoft, marginTop: 16}}>Loan agreement se pehle milna chahiye</div>
          <div style={{marginTop: 20}}>
            <Row label="Loan amount" value="₹1,00,000" size={34} />
            <Row label="Tenure" value="36 mahine" size={34} />
            <Row label="EMI" value="₹3,611" size={34} />
            <Row label="Fees & charges" value="₹ ......" size={34} />
            <Row label={<HL at={word('L24', 'apr', 0)}>APR (saalana)</HL>} value={<HL at={word('L24', 'apr', 2)}>.... %</HL>} size={44} bold style={{borderBottom: 'none', marginTop: 8}} />
          </div>
        </div>
      </Card>
      <Circle id="capr" cx={540} cy={868} rx={420} ry={54} at={word('L24', 'dikhana', -2)} />
      <Stamp id="rbi" text="RBI rule" sub="KFS · OCT 2024" x={720} y={1060} at={word('L24', 'rbi', 4)} size={70} rot={8} color={C.ink} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- outro
const Outro: React.FC = () => (
  <AbsoluteFill>
    <SignOff share="L25" sign="L26" who="us dost ko jo showroom mein loan le raha hai →" note="ILLUSTRATIVE: ₹1 LAKH · 3 SAAL · 10% FLAT ≈ 17.9% REDUCING · RBI KFS RULE, OCT 2024" />
  </AbsoluteFill>
);

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  flat: Flat,
  catch: Catch,
  reducing: Reducing,
  where: Where,
  check: Check,
  outro: Outro,
};
