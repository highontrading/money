import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, Card, Circle, Count, Cross, Hand, HL, Label, Marker, Sfx, Stamp, Tape} from '../../components/paper';
import {clamp, ease, pop, stepped} from '../../lib/motion';
import {useCues} from '../../lib/timeline';
import {C, F} from '../../theme';
import {SignOff} from '../common';
import {grid, House, LoanBar, MonthPages, Row, Show, YearColumns} from './props';

const lakhFmt = (d = 1) => (n: number) => `₹${(n / 100000).toFixed(d)} LAKH`;

// ---------------------------------------------------------------- hook
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l2 = at('L02'), l3 = at('L03'), l6 = at('L06');
  const l5 = at('L05');
  return (
    <AbsoluteFill>
      {/* L01: ₹50 lakh home loan, 20 years, 8.5% */}
      <House id="house" x={250} y={420} w={580} h={520} rot={-1.5} at={0} out={l2} enter="up" />
      <Card id="t50" x={110} y={940} w={420} h={170} rot={-3} at={word('L01', '50', -3)} out={l2} bg={C.yellow}>
        <div style={{padding: '18px 30px'}}>
          <Label size={20}>Home loan</Label>
          <div style={{fontFamily: F.display, fontSize: 92, lineHeight: 1, marginTop: 10}}>₹50 LAKH</div>
        </div>
      </Card>
      <Card id="t20" x={560} y={930} w={190} h={150} rot={3} at={word('L01', '20', -3)} out={l2} bg={C.card}>
        <div style={{fontFamily: F.display, fontSize: 64, textAlign: 'center', marginTop: 14, lineHeight: 0.95}}>20<br /><span style={{fontSize: 34}}>SAAL</span></div>
      </Card>
      <Card id="t85" x={770} y={950} w={200} h={150} rot={-4} at={word('L01', 'rate', -3)} out={l2} bg={C.card}>
        <div style={{fontFamily: F.display, fontSize: 72, textAlign: 'center', marginTop: 20}}>8.5%</div>
      </Card>
      <Tape id="th" x={470} y={402} w={140} rot={-6} at={4} out={l2} />

      {/* L02: the EMI */}
      <Card id="emi" x={110} y={430} w={860} h={420} rot={-1.5} at={l2} out={l3} enter="right" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid(40)}} />
        <div style={{position: 'relative', padding: '44px 54px'}}>
          <Label size={26}>EMI · har mahina</Label>
          <div style={{fontFamily: F.display, fontSize: 210, lineHeight: 1, marginTop: 30}}>
            <HL at={word('L02', '43,391', 14)}><Count from={0} to={43391} at={word('L02', '43,391', -2)} dur={16} /></HL>
          </div>
        </div>
      </Card>
      <Hand x={360} y={890} at={word('L02', 'mahina', -2)} out={l3} size={70} rot={-4}>20 saal tak, har mahine</Hand>

      {/* L03: first year paid ₹5.2 lakh */}
      <Card id="yr1" x={90} y={420} w={900} h={330} rot={-1} at={l3} out={l6} enter="left" bg={C.card}>
        <div style={{padding: '30px 44px'}}>
          <Label size={24}>Pehle saal bhare · 12 EMI</Label>
          <div style={{display: 'flex', gap: 10, marginTop: 24}}>
            {Array.from({length: 12}).map((_, i) => {
              const p = pop(frame, l3 + 2 + i * 2);
              return <div key={i} style={{width: 54, height: 34, background: C.newsprint, border: `2px solid ${C.ink}`, transform: `scale(${Math.min(1, Math.max(0, p))})`, fontFamily: F.mono, fontSize: 14, fontWeight: 700, textAlign: 'center', lineHeight: '30px'}}>EMI</div>;
            })}
          </div>
          <div style={{fontFamily: F.display, fontSize: 130, lineHeight: 1, marginTop: 24}}>
            = {frame >= word('L03', '5.2', -2) ? <HL at={word('L03', '5.2', 2)}>₹5.2 LAKH</HL> : '₹ ?'}
          </div>
        </div>
      </Card>

      {/* L04: loan went down only ₹1 lakh */}
      <Card id="loanb" x={90} y={800} w={900} h={340} rot={1} at={at('L04', -2)} out={l5} enter="right" bg={C.paperLight}>
        <div style={{padding: '28px 44px'}}>
          <Label size={24}>Loan kitna ghata?</Label>
        </div>
      </Card>
      {frame >= at('L04') && frame < l5 ? (
        <>
          <LoanBar x={140} y={905} w={800} h={90} from={1} to={0.98} at={word('L04', '₹1', -2)} dur={8} />
          <div style={{position: 'absolute', left: 140, top: 1012, fontFamily: F.mono, fontWeight: 700, fontSize: 28, letterSpacing: 2}}>₹50 L</div>
          <div style={{position: 'absolute', left: 600, top: 1012, fontFamily: F.mono, fontWeight: 700, fontSize: 28, letterSpacing: 2, color: C.red, opacity: frame >= word('L04', '₹1') ? 1 : 0}}>−₹1 L · sirf itna →</div>
        </>
      ) : null}
      <Circle id="c1l" cx={922} cy={950} rx={60} ry={80} at={word('L04', 'lakh', 0)} out={l5} />

      {/* L05: the other ₹4.2 lakh went to interest */}
      <Card id="split52" x={90} y={800} w={900} h={360} rot={-1} at={l5} out={l6} enter="up" bg={C.paperLight}>
        <div style={{padding: '28px 44px'}}>
          <Label size={24}>₹5.2 lakh kahan gaye</Label>
          <div style={{display: 'flex', marginTop: 30, height: 150, border: `4px solid ${C.ink}`}}>
            <div style={{flex: 4.2, background: C.ink, color: C.paperLight, fontFamily: F.display, fontSize: 62, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: frame >= word('L05', '4.2', -2) ? 1 : 0.15}}>₹4.2 L INTEREST</div>
            <div style={{flex: 1, background: C.yellow, fontFamily: F.display, fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, textAlign: 'center'}}>₹1 L<br />LOAN</div>
          </div>
        </div>
      </Card>
      <Hand x={140} y={1180} at={word('L05', 'seedha', -2)} out={l6} size={60} rot={-2} color={C.red}>↑ seedha interest mein</Hand>

      {/* L06: the real maths of an EMI */}
      <div style={{position: 'absolute', left: 100, top: 470, width: 880}}>
        {frame >= l6 ? <Big words={['EMI', 'KA']} at={l6} size={200} /> : null}
      </div>
      <Card id="hisaab" x={100} y={760} w={880} h={270} rot={-2.5} at={word('L06', 'asli', -3)} bg={C.yellow} torn={{top: true, right: true}} rough={14}>
        <div style={{fontFamily: F.display, fontSize: 180, textAlign: 'center', lineHeight: 1, marginTop: 40}}>ASLI HISAAB</div>
      </Card>
      <Hand x={600} y={1070} at={word('L06', 'kholte', -4)} size={66} rot={-5}>kholte hain →</Hand>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- an EMI's two parts
const Split: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l8 = at('L08'), l9 = at('L09'), l10 = at('L10'), l11 = at('L11');
  const cut = ease(stepped(frame), word('L10', '35,417', -4), word('L10', '35,417', 10));
  return (
    <AbsoluteFill>
      {/* L07: interest + principal */}
      <Card id="emi2" x={140} y={430} w={800} h={250} rot={-1.5} at={0} out={l8} enter="drop" bg={C.card}>
        <div style={{padding: '30px 44px'}}>
          <Label size={24}>Ek EMI</Label>
          <div style={{fontFamily: F.display, fontSize: 130, lineHeight: 1, marginTop: 16}}>₹43,391</div>
        </div>
      </Card>
      <Marker id="arL" d="M400,700 Q330,760 300,820" at={word('L07', 'do', -2)} out={l8} color={C.ink} width={7} />
      <Marker id="arR" d="M680,700 Q750,760 780,820" at={word('L07', 'do', 2)} out={l8} color={C.ink} width={7} />
      <Card id="pInt" x={100} y={840} w={420} h={170} rot={-3} at={word('L07', 'interest', -3)} out={l8} bg={C.ink} texture="kraft">
        <div style={{fontFamily: F.display, fontSize: 80, color: C.paperLight, textAlign: 'center', marginTop: 34}}>INTEREST</div>
      </Card>
      <Card id="pPrin" x={560} y={840} w={420} h={170} rot={3} at={word('L07', 'principal', -3)} out={l8} bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 80, textAlign: 'center', marginTop: 34}}>PRINCIPAL</div>
      </Card>
      <Hand x={110} y={1040} at={word('L07', 'interest', 4)} out={l8} size={48} rot={-2}>bank ki kamaai</Hand>
      <Hand x={600} y={1040} at={word('L07', 'principal', 4)} out={l8} size={48} rot={2}>loan ghatta hai</Hand>

      {/* L08: interest is charged on what's left */}
      <Card id="rule" x={100} y={440} w={880} h={500} rot={-1} at={l8} out={l9} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid(40)}} />
        <div style={{position: 'relative', padding: '40px 50px'}}>
          <Label size={24}>Rule</Label>
          <div style={{fontFamily: F.display, fontSize: 92, lineHeight: 1.05, marginTop: 26}}>INTEREST =</div>
          <div style={{fontFamily: F.display, fontSize: 92, lineHeight: 1.05}}><HL at={word('L08', 'baaki', -2)}>BAAKI LOAN</HL> × RATE</div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 2, marginTop: 30, color: C.inkSoft}}>RATE: 8.5% SAALANA</div>
        </div>
      </Card>
      <Hand x={420} y={980} at={word('L08', 'uspe', -4)} out={l9} size={64} rot={-3}>jitna baaki, utna interest</Hand>

      {/* L09: big loan at the start, so big interest */}
      <Card id="bigL" x={100} y={450} w={560} h={480} rot={-2} at={l9} out={l10} enter="left" bg={C.ink} texture="kraft">
        <div style={{fontFamily: F.display, fontSize: 70, color: C.paperLight, padding: '40px 44px', lineHeight: 1}}>SHURU MEIN<br />LOAN<br /><span style={{fontSize: 130, color: C.yellow}}>₹50 L</span></div>
      </Card>
      <Card id="bigI" x={620} y={700} w={360} h={300} rot={4} at={word('L09', 'interest', -3)} out={l10} bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 64, textAlign: 'center', marginTop: 40, lineHeight: 1}}>INTEREST<br /><span style={{fontSize: 110}}>BADA</span></div>
      </Card>

      {/* L10: first EMI cut into ₹35,417 interest + ₹7,974 principal */}
      <Card id="emiCut" x={90} y={430} w={900} h={250} rot={-1} at={l10} out={l11} enter="drop" bg={C.card}>
        <div style={{padding: '28px 44px'}}>
          <Label size={24}>Pehli EMI · ₹43,391</Label>
        </div>
      </Card>
      {frame >= l10 + 4 && frame < l11 ? (
        <div style={{position: 'absolute', left: 140, top: 540, width: 800, height: 110, display: 'flex', gap: 10 * cut, transform: 'rotate(-1deg)'}}>
          <div style={{width: 800 * 0.816, height: '100%', background: C.ink, transform: `translateX(${-14 * cut}px) rotate(${-2 * cut}deg)`, boxShadow: `4px 6px 8px ${C.shadow}`}} />
          <div style={{width: 800 * 0.184, height: '100%', background: C.yellow, border: `3px solid ${C.ink}`, boxSizing: 'border-box', transform: `translateX(${18 * cut}px) rotate(${4 * cut}deg)`, boxShadow: `4px 6px 8px ${C.shadow}`}} />
        </div>
      ) : null}
      <Card id="int35" x={90} y={730} w={600} h={230} rot={-2} at={word('L10', '35,417', -3)} out={l11} bg={C.ink} texture="kraft">
        <div style={{padding: '26px 36px', color: C.paperLight}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 3}}>INTEREST</div>
          <div style={{fontFamily: F.display, fontSize: 120, lineHeight: 1, marginTop: 10}}><Count from={0} to={35417} at={word('L10', '35,417', -2)} dur={14} /></div>
        </div>
      </Card>
      <Card id="pr79" x={640} y={850} w={350} h={230} rot={3} at={word('L10', 'loan', -3)} out={l11} bg={C.yellow}>
        <div style={{padding: '26px 30px'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3}}>LOAN GHATA</div>
          <div style={{fontFamily: F.display, fontSize: 92, lineHeight: 1, marginTop: 14}}><Count from={0} to={7974} at={word('L10', '7,974', -2)} dur={12} /></div>
        </div>
      </Card>
      <Hand x={130} y={1000} at={word('L10', 'sirf', -2)} out={l11} size={58} rot={-3} color={C.red}>zyaadatar interest!</Hand>

      {/* L11: the balance slowly flips over 20 years */}
      <Card id="cols" x={80} y={420} w={920} h={760} rot={0.6} at={l11} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid(40)}} />
        <div style={{position: 'relative', padding: '30px 40px'}}>
          <Label size={22}>Har saal ki EMI · ₹5.2 lakh</Label>
          <div style={{display: 'flex', gap: 24, marginTop: 16, fontFamily: F.mono, fontWeight: 700, fontSize: 24}}>
            <span><span style={{display: 'inline-block', width: 22, height: 22, background: C.ink, marginRight: 8, verticalAlign: -3}} />INTEREST</span>
            <span><span style={{display: 'inline-block', width: 22, height: 22, background: C.yellow, border: `2px solid ${C.ink}`, marginRight: 8, verticalAlign: -3}} />LOAN</span>
          </div>
        </div>
      </Card>
      {frame >= l11 + 2 ? (
        <>
          <YearColumns x={130} y={600} w={820} h={480} at={l11 + 4} stagger={2} />
          <div style={{position: 'absolute', left: 130, top: 1100, width: 820, display: 'flex', justifyContent: 'space-between', fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 2}}>
            <span>SAAL 1</span><span>SAAL 10</span><span>SAAL 20</span>
          </div>
        </>
      ) : null}
      <Hand x={560} y={560} at={word('L11', 'palatta', -2)} size={52} rot={-3}>dheere dheere palatta →</Hand>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- halfway
const Half: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l14 = at('L14');
  const mk = ease(stepped(frame), word('L12', '10', -2), word('L12', 'aadha', 4));
  const rx0 = 150, rx1 = 930;
  return (
    <AbsoluteFill>
      {/* L12: 10 years later, half the tenure gone */}
      <Card id="ruler" x={90} y={430} w={900} h={260} rot={-1} at={0} out={l14} enter="drop" bg={C.paperLight}>
        <div style={{padding: '24px 40px'}}>
          <Label size={22}>Tenure · 20 saal</Label>
        </div>
      </Card>
      {frame < l14 ? (
        <>
          <div style={{position: 'absolute', left: rx0, top: 580, width: rx1 - rx0, height: 8, background: C.ink, opacity: frame >= 4 ? 1 : 0}} />
          <div style={{position: 'absolute', left: rx0, top: 556, width: (rx1 - rx0) * 0.5 * mk, height: 56, background: C.yellow, opacity: 0.9, transform: 'skewX(-4deg)'}} />
          {Array.from({length: 21}).map((_, i) => (
            <div key={i} style={{position: 'absolute', left: rx0 + ((rx1 - rx0) * i) / 20 - 1.5, top: i % 5 === 0 ? 556 : 570, width: 3, height: i % 5 === 0 ? 56 : 28, background: C.ink, opacity: frame >= 4 ? 1 : 0}} />
          ))}
          {[0, 5, 10, 15, 20].map((y) => (
            <div key={y} style={{position: 'absolute', left: rx0 + ((rx1 - rx0) * y) / 20 - 40, width: 80, top: 622, textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 24, opacity: frame >= 4 ? 1 : 0}}>{y}</div>
          ))}
        </>
      ) : null}
      <Stamp id="aadha" text="Aadha khatam" x={720} y={470} at={word('L12', 'aadha', 0)} out={l14} size={56} rot={6} color={C.ink} />

      {/* L13: still ₹35 lakh (70%) owed */}
      <Card id="bal" x={90} y={740} w={900} h={430} rot={1} at={at('L13', -2)} out={l14} enter="up" bg={C.card}>
        <div style={{padding: '30px 44px'}}>
          <Label size={22}>Loan baaki · saal 10</Label>
          <div style={{fontFamily: F.display, fontSize: 130, lineHeight: 1, marginTop: 20}}>
            {frame >= word('L13', '35', -2) ? <HL at={word('L13', '35', 4)}><Count from={50} to={35} at={word('L13', '35', -2)} dur={12} fmt={(n) => `₹${Math.round(n)} LAKH`} /></HL> : '₹50 LAKH ?'}
          </div>
        </div>
      </Card>
      {frame >= at('L13') && frame < l14 ? (
        <>
          <LoanBar x={140} y={1010} w={800} h={80} from={1} to={0.7} at={word('L13', '35', -2)} dur={12} />
          <div style={{position: 'absolute', left: 140 + 800 * 0.7 + 12, top: 1028, fontFamily: F.mono, fontWeight: 700, fontSize: 26, color: C.inkSoft, opacity: frame >= word('L13', '35', 12) ? 1 : 0}}>← chuka sirf itna</div>
        </>
      ) : null}
      <Stamp id="s70" text="70% baaki" x={800} y={850} at={word('L13', '70', -2)} out={l14} size={58} rot={-7} />

      {/* L14: you'll pay ₹1.04 crore in total */}
      <Card id="rcpt" x={120} y={420} w={840} h={720} rot={-1.2} at={l14} enter="up" bg={C.card} torn={{bottom: true}} rough={10}>
        <div style={{padding: '40px 50px'}}>
          <Label size={24}>20 saal ka hisaab</Label>
          <div style={{marginTop: 30}}>
            <Row label="Loan" value="₹50,00,000" size={46} />
            <Row label={frame >= word('L15', '54', -2) ? <HL at={word('L15', '54', -2)}>Interest</HL> : 'Interest'} value={frame >= word('L15', '54', -2) ? <HL at={word('L15', '54', -2)}>₹54,13,879</HL> : '₹ . . . . . .'} size={46} />
            <div style={{height: 20}} />
            <Row label="TOTAL" bold value={frame >= word('L14', '1.04', -2) ? <span style={{fontSize: 96}}>₹1.04 CRORE</span> : ''} size={64} style={{borderBottom: 'none'}} />
          </div>
        </div>
      </Card>
      <Hand x={160} y={1010} at={word('L14', 'chukaoge', -2)} size={58} rot={-3}>saari EMI jod ke</Hand>

      {/* L15: ₹54 lakh of interest, more than the loan */}
      <Circle id="c54" cx={640} cy={700} rx={290} ry={70} at={word('L15', '54', 4)} />
      <Stamp id="zyada" text="Loan se zyada" x={560} y={1170} at={word('L15', 'zyada', -6)} size={80} rot={-6} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- the rate twist
const Rate: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l17 = at('L17'), l18 = at('L18'), l19 = at('L19');
  const up = ease(stepped(frame), word('L16', 'badha', -2), word('L16', 'badha', 8));
  return (
    <AbsoluteFill>
      {/* L16: rate goes up, the EMI doesn't */}
      <Card id="twist" x={110} y={420} w={340} h={120} rot={-4} at={0} out={l17} enter="drop" bg={C.ink} texture="kraft">
        <div style={{fontFamily: F.display, fontSize: 76, color: C.yellow, textAlign: 'center', marginTop: 18}}>TWIST</div>
      </Card>
      <Card id="rate" x={110} y={600} w={400} h={300} rot={-2} at={word('L16', 'rate', -3)} out={l17} bg={C.card}>
        <div style={{padding: '24px 36px'}}>
          <Label size={22}>Rate</Label>
          <div style={{fontFamily: F.display, fontSize: 120, lineHeight: 1, marginTop: 18}}>{up > 0.5 ? <span style={{color: C.red}}>9.5%</span> : '8.5%'}</div>
          <div style={{fontFamily: F.display, fontSize: 60, color: C.red, opacity: up, transform: `translateY(${(1 - up) * 20}px)`}}>↑ BADHA</div>
        </div>
      </Card>
      <Card id="emiS" x={560} y={620} w={420} h={300} rot={2} at={word('L16', 'bank', -3)} out={l17} bg={C.card}>
        <div style={{padding: '24px 36px'}}>
          <Label size={22}>EMI</Label>
          <div style={{fontFamily: F.display, fontSize: 104, lineHeight: 1, marginTop: 22}}>₹43,391</div>
        </div>
      </Card>
      <Stamp id="same" text="Wahi" sub="EMI NAHI BADHI" x={770} y={980} at={word('L16', 'nahi', -2)} out={l17} size={84} rot={-6} color={C.ink} />

      {/* L17: the tenure grows quietly */}
      <Card id="ten" x={110} y={460} w={860} h={300} rot={-1.5} at={l17} out={l18} enter="right" bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 150, textAlign: 'center', marginTop: 60, lineHeight: 1}}>TENURE ↑</div>
      </Card>
      <Hand x={200} y={810} at={word('L17', 'chupchaap', -2)} out={l18} size={74} rot={-3}>chupchaap... 🤫</Hand>

      {/* L18: 8.5 → 9.5% after 5 years: 27 more months */}
      <Card id="cal" x={90} y={420} w={900} h={780} rot={-0.8} at={l18} enter="up" bg={C.card}>
        <div style={{padding: '28px 40px'}}>
          <Label size={22}>Bachi EMI · har dabba = 1 mahina</Label>
          <div style={{fontFamily: F.display, fontSize: 54, marginTop: 14}}>5 SAAL BAAD: 8.5% → <span style={{color: C.red}}>9.5%</span></div>
        </div>
      </Card>
      {frame >= l18 + 4 ? <MonthPages x={182} y={590} cols={18} cell={36} base={180} extra={27} at={l18 + 4} extraAt={word('L18', '27', -4)} /> : null}
      <Card id="p27" x={590} y={1085} w={380} h={105} rot={3} at={word('L18', 'mahine', -2)} bg={C.yellow} sfx={null}>
        <div style={{fontFamily: F.display, fontSize: 66, textAlign: 'center', marginTop: 14}}>+27 MAHINE</div>
      </Card>
      <Sfx at={word('L18', '27', -4)} name="tick" volume={0.4} />

      {/* L19: the EMI looks the same; 2 extra years got added */}
      <Hand x={130} y={1100} at={word('L19', 'emi', -2)} size={52} rot={-2}>EMI wahi dikhegi...</Hand>
      <Circle id="c27" cx={540} cy={1030} rx={400} ry={58} at={word('L19', 'extra', -2)} />
      <Stamp id="s2" text="+2 saal ki EMI" x={540} y={800} at={word('L19', '2', -2)} size={84} rot={-7} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- what to do
const Fix: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l21 = at('L21'), l22 = at('L22'), l23 = at('L23'), l24 = at('L24'), l25 = at('L25'), l26 = at('L26');
  const shrink = interpolate(stepped(frame), [word('L22', '14', -4), word('L22', '14', 8)], [1, 0.7], clamp);
  return (
    <AbsoluteFill>
      {/* L20: prepayment */}
      <div style={{position: 'absolute', left: 110, top: 450, width: 880}}>{frame < l21 ? <Big words={['TOH', 'KAREIN', 'KYA?']} at={0} size={150} /> : null}</div>
      <Card id="prep" x={100} y={800} w={880} h={300} rot={-2.5} at={word('L20', 'prepayment', -4)} out={l21} bg={C.yellow} torn={{top: true, right: true}} rough={14}>
        <div style={{fontFamily: F.display, fontSize: 160, textAlign: 'center', marginTop: 56}}>PREPAYMENT</div>
      </Card>

      {/* L21: ₹1 lakh a year straight into the principal */}
      <Card id="loanL" x={90} y={430} w={900} h={300} rot={-1} at={l21} out={l23} enter="up" bg={C.paperLight}>
        <div style={{padding: '24px 40px'}}>
          <Label size={22}>Loan · principal</Label>
        </div>
      </Card>
      {frame >= l21 && frame < l23 ? (
        <>
          <LoanBar x={140} y={540} w={800} h={100} from={1} to={0.94} at={word('L21', 'principal', -2)} dur={10} />
          {[0, 1, 2].map((i) => (
            <Show key={i} at={word('L21', 'lakh', -4) + i * 5} style={{left: 690 + i * 90, top: 650}}>
              <div style={{width: 80, height: 80, borderRadius: 40, background: C.yellow, border: `4px solid ${C.ink}`, fontFamily: F.display, fontSize: 30, textAlign: 'center', lineHeight: '72px', boxShadow: `3px 5px 6px ${C.shadow}`}}>₹1L</div>
            </Show>
          ))}
        </>
      ) : null}
      <Card id="1l" x={120} y={780} w={480} h={200} rot={-3} at={word('L21', '₹1', -3)} out={l22} bg={C.yellow}>
        <div style={{padding: '22px 34px'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3}}>HAR SAAL EXTRA</div>
          <div style={{fontFamily: F.display, fontSize: 100, lineHeight: 1, marginTop: 10}}>₹1 LAKH</div>
        </div>
      </Card>
      <Hand x={600} y={860} at={word('L21', 'principal', -2)} out={l22} size={56} rot={-4}>← seedha principal</Hand>

      {/* L22: 14 years instead of 20 */}
      <Card id="yrs" x={90} y={780} w={900} h={360} rot={1} at={l22} out={l23} enter="right" bg={C.card}>
        <div style={{padding: '24px 40px'}}>
          <Label size={22}>Loan khatam</Label>
        </div>
      </Card>
      {frame >= l22 + 2 && frame < l23 ? (
        <>
          <div style={{position: 'absolute', left: 140, top: 900, width: 800 * shrink, height: 90, background: C.yellow, border: `4px solid ${C.ink}`, boxSizing: 'border-box', boxShadow: `3px 5px 6px ${C.shadow}`, fontFamily: F.display, fontSize: 60, lineHeight: '82px', paddingLeft: 24}}>
            {shrink < 0.85 ? '14 SAAL' : '20 SAAL'}
          </div>
          <div style={{position: 'absolute', left: 140 + 800 * 0.7, top: 900, width: 800 * 0.3, height: 90, border: `4px dashed ${C.grey}`, boxSizing: 'border-box', opacity: shrink < 0.95 ? 1 : 0}} />
        </>
      ) : null}
      <Cross id="x20" x={710} y={895} w={220} h={100} at={word('L22', '14', 6)} out={l23} />
      <Hand x={700} y={1020} at={word('L22', 'khatam', -2)} out={l23} size={54} rot={-3}>20 → 14 saal</Hand>

      {/* L23: ₹18.5 lakh interest saved */}
      <Card id="saved" x={110} y={500} w={860} h={420} rot={-2} at={l23} out={l24} enter="drop" bg={C.yellow} torn={{bottom: true, right: true}} rough={12}>
        <div style={{padding: '40px 50px'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 3}}>INTEREST BACHA</div>
          <div style={{fontFamily: F.display, fontSize: 190, lineHeight: 1, marginTop: 20}}><Count from={0} to={18.5} at={l23 + 4} dur={Math.max(10, word('L23', '18.5') - l23)} fmt={(n) => `₹${n.toFixed(1)} L`} /></div>
        </div>
      </Card>
      <Hand x={160} y={960} at={word('L23', 'lakh', 0)} out={l24} size={60} rot={-3}>sirf ₹1 lakh saalana se</Hand>

      {/* L24: prepay early — that's where the interest is */}
      <Card id="cols2" x={80} y={420} w={920} h={720} rot={0.6} at={l24} out={l25} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid(40)}} />
        <div style={{position: 'relative', padding: '30px 40px'}}>
          <Label size={22}>Interest sabse zyada · shuru mein</Label>
        </div>
      </Card>
      {frame >= l24 + 2 && frame < l25 ? (
        <>
          <YearColumns x={130} y={560} w={820} h={460} at={l24 + 2} stagger={1} highlight={word('L24', 'shuru', 0) <= frame ? [0, 1, 2, 3, 4] : []} />
          <div style={{position: 'absolute', left: 130, top: 1040, width: 820, display: 'flex', justifyContent: 'space-between', fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 2}}>
            <span>SAAL 1</span><span>SAAL 20</span>
          </div>
        </>
      ) : null}
      <Hand x={330} y={1072} at={word('L24', 'kaam', -4)} out={l25} size={52} rot={-2} color={C.red}>↖ yahan prepay karo</Hand>

      {/* L25: ask the bank to raise the EMI, not the tenure */}
      <Card id="optE" x={110} y={460} w={860} h={250} rot={-1.5} at={word('L25', 'poocho', -4)} out={l26} enter="left" bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 120, textAlign: 'center', marginTop: 58}}>EMI BADHAO ✓</div>
      </Card>
      <Card id="optT" x={110} y={770} w={860} h={230} rot={1.5} at={word('L25', 'tenure', -4)} out={l26} enter="right" bg={C.paperLight}>
        <div style={{fontFamily: F.display, fontSize: 110, textAlign: 'center', marginTop: 52, color: C.inkSoft}}>TENURE BADHAO</div>
      </Card>
      <Cross id="xT" x={170} y={790} w={740} h={190} at={word('L25', 'nahi', -2)} out={l26} />
      <Hand x={140} y={470} at={l25} out={word('L25', 'poocho', -4)} size={70} rot={-3}>rate badhe toh, bank se poocho...</Hand>

      {/* L26: no prepayment charge on floating-rate loans */}
      <Card id="float" x={110} y={440} w={860} h={360} rot={-1} at={l26} enter="up" bg={C.card}>
        <div style={{padding: '36px 46px'}}>
          <Label size={24}>Floating rate home loan</Label>
          <div style={{fontFamily: F.display, fontSize: 100, lineHeight: 1.02, marginTop: 24}}>PREPAYMENT<br />CHARGE: <HL at={word('L26', 'nahi', -2)}>₹0</HL></div>
        </div>
      </Card>
      <Stamp id="rbi" text="RBI ka rule" sub="INDIVIDUALS · FLOATING RATE" x={560} y={960} at={word('L26', 'rbi', -2)} size={92} rot={-6} />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <AbsoluteFill>
    <SignOff share="L27" sign="L28" who="us dost ko jisne abhi flat book kiya hai →" note="ILLUSTRATIVE: ₹50 LAKH · 8.5% · 20 SAAL · EMI ₹43,391" />
  </AbsoluteFill>
);

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  split: Split,
  half: Half,
  rate: Rate,
  fix: Fix,
  outro: Outro,
};
