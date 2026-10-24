import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Big, Card, Cross, HL, Label, Marker, Photo, Sfx, Stamp, Tape} from '../../components/paper';
import {ease, stepped} from '../../lib/motion';
import {useCues} from '../../lib/timeline';
import {C, F} from '../../theme';
import {SignOff} from '../common';
import {Arrow, Bank, Center, Crowd, crashPath, grid, Hide, Pop, ReceiptBody, risePath, Typed} from './props';

const fmt = (n: number) => Math.round(n).toLocaleString('en-IN');

// Graph-paper panel for the Sensex line (the line itself is drawn with Marker in frame coords).
const ChartCard: React.FC<{id: string; x: number; y: number; w: number; h: number; at: number; out?: number; title?: string; enter?: 'up' | 'right' | 'drop' | 'fade' | 'none'}> = ({id, x, y, w, h, at, out, title = 'SENSEX', enter = 'up'}) => (
  <Card id={id} x={x} y={y} w={w} h={h} rot={-0.6} at={at} out={out} enter={enter} bg={C.card}>
    <div style={{position: 'absolute', inset: 0, ...grid()}} />
    <div style={{position: 'absolute', left: 26, top: 22}}><Label size={22}>{title}</Label></div>
  </Card>
);

// ---------------------------------------------------------------- hook
const Hook: React.FC = () => {
  const {at, word} = useCues();
  const l2 = at('L02'), l3 = at('L03'), l4 = at('L04');
  const tagIn = word('L02', 'harshad', -4);
  // chart geometry (frame coords)
  const X0 = 190, Y0 = 1160, X1 = 900, Y1 = 860;
  return (
    <AbsoluteFill>
      {/* L01: the exchange + the 1992 rally */}
      <Photo id="h-bse" src="bse.jpg" x={110} y={400} w={860} h={350} rot={-1.5} at={0} out={tagIn} enter="up" torn={{top: true, bottom: true}} rough={14} pos="50% 35%" caption="DALAL STREET, MUMBAI" />
      <Card id="h-1992" x={700} y={380} w={260} h={120} rot={5} at={word('L01', '1992', -4)} out={tagIn} bg={C.yellow}>
        <Center><div style={{fontFamily: F.display, fontSize: 92, lineHeight: 1}}>1992</div></Center>
      </Card>
      <Tape id="h-t1" x={780} y={366} w={110} rot={-8} at={word('L01', '1992', -2)} out={tagIn} />
      <ChartCard id="h-chart" x={110} y={780} w={860} h={450} at={word('L01', 'sensex', -6)} out={l3} />
      <Marker id="h-rise" d={risePath('h', X0, Y0, X1, Y1)} at={word('L01', '1,000', 2)} dur={34} out={l3} color={C.ink} width={8} />
      <Pop x={X0 - 40} y={Y0 - 66} at={word('L01', '1,000', -2)} out={l3} size={46}>1,000</Pop>
      <Pop x={X1 - 150} y={Y1 - 74} at={word('L01', '4,500', -2)} out={l3} size={64}><HL at={word('L01', '4,500', 0)}>4,500</HL></Pop>
      <Pop x={560} y={1040} at={word('L01', 'saal', -2)} out={l3} size={40} font={F.hand}>do saal mein ↗</Pop>

      {/* L02: the name everyone followed (text only) */}
      <Card id="h-tag" x={130} y={420} w={820} h={250} rot={-2} at={tagIn} out={l3} enter="drop" bg={C.paperLight}>
        <div style={{padding: '24px 40px'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: C.inkSoft}}>IS RALLY KE PEECHE · EK NAAM</div>
          <div style={{fontFamily: F.type, fontSize: 86, marginTop: 18, whiteSpace: 'nowrap'}}><Typed text="HARSHAD MEHTA" at={tagIn + 2} cps={1.2} /></div>
        </div>
      </Card>
      <Card id="h-bull" x={620} y={640} w={330} h={110} rot={6} at={word('L02', 'big', -4)} out={l3} bg={C.yellow} z={40}>
        <Center><div style={{fontFamily: F.display, fontSize: 70, lineHeight: 1, whiteSpace: 'nowrap'}}>'BIG BULL'</div></Center>
      </Card>
      <Pop x={170} y={700} at={word('L02', 'log', -2)} out={l3} size={46} font={F.hand} rot={-3}>log kehte the…</Pop>

      {/* L03: the money came from banks */}
      <Card id="h-mkt" x={300} y={1000} w={480} h={170} rot={1.5} at={l3} out={l4} enter="up" bg={C.ink} texture="kraft">
        <Center><div style={{fontFamily: F.display, fontSize: 82, color: C.paperLight, lineHeight: 1}}>SHARE BAZAAR</div></Center>
      </Card>
      <Card id="h-note" x={560} y={760} w={300} h={150} rot={-8} at={word('L03', 'paisa', -4)} out={l4} enter="drop" bg={C.card}>
        <div style={{position: 'absolute', inset: 14, border: `3px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14}}>
          <div style={{fontFamily: F.display, fontSize: 64, color: C.ink}}>₹</div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: C.inkSoft, lineHeight: 1.3}}>NOTON KI<br />GADDI</div>
        </div>
      </Card>
      <Pop x={130} y={800} at={word('L03', 'paisa', 0)} out={l4} size={50} font={F.hand} rot={-4}>paisa aa raha tha…</Pop>
      <Bank x={380} y={420} w={320} h={300} at={word('L03', 'banks', -6)} out={l4} label="BANK" seed="h-bank" />
      <Arrow id="h-arr" x1={540} y1={735} x2={540} y2={990} at={word('L03', 'banks', 4)} out={l4} />
      <Pop x={730} y={480} at={word('L03', 'banks', 2)} out={l4} size={56}><HL at={word('L03', 'banks', 4)}>BANKS KA</HL></Pop>

      {/* L04: how? a piece of paper */}
      <div style={{position: 'absolute', left: 110, top: 430, width: 860}}>
        <Hide from={l4}><Big words={['KAISE?']} at={l4} size={170} /></Hide>
      </div>
      <Card id="h-br" x={170} y={640} w={740} h={420} rot={-2.5} at={word('L04', 'kaagaz', -4)} enter="drop" bg={C.paperLight} torn={{bottom: true}} rough={10}>
        <ReceiptBody bank="EK KAAGAZ" at={word('L04', 'kaagaz', 4)} line="Received with thanks…" size={36} />
      </Card>
      <Stamp id="h-brs" text="Bank Receipt" x={640} y={1010} at={word('L04', 'receipt', -3)} size={64} rot={-8} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- how BRs worked
const BR: React.FC = () => {
  const {at, word} = useCues();
  const l6 = at('L06'), l7 = at('L07'), l8 = at('L08');
  const swap = word('L06', 'receipt', -4);
  return (
    <AbsoluteFill>
      {/* L05: banks lend to each other against government securities */}
      <Bank x={90} y={430} w={300} h={270} at={0} out={l7} label="BANK A" seed="b-a" />
      <Bank x={690} y={430} w={300} h={270} at={4} out={l7} label="BANK B" seed="b-b" />
      <Arrow id="b-lend" x1={410} y1={500} x2={670} y2={500} at={word('L05', 'lend', -4)} out={l7} />
      <Card id="b-udh" x={395} y={530} w={290} h={110} rot={-2} at={word('L05', 'lend', 0)} out={l7} bg={C.yellow}>
        <Center><div style={{fontFamily: F.display, fontSize: 40, lineHeight: 1.05, textAlign: 'center'}}>₹ UDHAAR<br /><span style={{fontFamily: F.mono, fontSize: 20, letterSpacing: 2}}>SHORT-TERM</span></div></Center>
      </Card>
      <Arrow id="b-sec" x1={670} y1={720} x2={410} y2={720} at={word('L05', 'securities', -4)} out={l7} />
      <Card id="b-gsec" x={290} y={760} w={500} h={170} rot={2} at={word('L05', 'government', -4)} out={swap} enter="right" bg={C.card}>
        <div style={{padding: '22px 30px'}}>
          <Label size={20}>Badle mein</Label>
          <div style={{fontFamily: F.display, fontSize: 62, marginTop: 12, whiteSpace: 'nowrap'}}>GOVT SECURITIES</div>
        </div>
      </Card>

      {/* L06: a receipt instead of the securities */}
      <Cross id="b-gx" x={310} y={775} w={460} h={140} at={word('L06', 'jagah', -2)} out={swap} />
      <Card id="b-rcpt" x={250} y={750} w={580} h={380} rot={-2} at={swap} out={l7} enter="drop" bg={C.paperLight} torn={{bottom: true}} rough={10}>
        <ReceiptBody bank="BANK B" at={word('L06', 'securities', -6)} />
      </Card>
      <Pop x={120} y={1000} at={swap + 6} out={l7} size={44} font={F.hand} rot={-4}>sirf kaagaz →</Pop>
      <Stamp id="b-br" text="BR" x={800} y={1060} at={word('L06', 'br', -3)} out={l7} size={110} rot={-10} />

      {/* L07: two small banks, nothing behind the paper */}
      {[0, 1].map((i) => (
        <React.Fragment key={i}>
          <Card id={'b-cb' + i} x={110 + i * 450} y={430} w={410} h={330} rot={i ? 2 : -2} at={l7 + i * 5} out={l8} enter={i ? 'right' : 'left'} bg={C.paperLight} torn={{bottom: true}} rough={8}>
            <ReceiptBody bank={`CHHOTA BANK ${i + 1}`} at={l7 + 10 + i * 5} size={26} />
          </Card>
          <Hide from={word('L07', 'peeche', -4)} until={l8}>
            <div style={{position: 'absolute', left: 140 + i * 450, top: 800, width: 350, height: 300, border: `5px dashed ${C.inkSoft}`, borderRadius: 6, zIndex: 30}}>
              <Center><div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 3, color: C.inkSoft, textAlign: 'center'}}>SECURITIES:<br /><span style={{fontFamily: F.display, fontSize: 110, color: C.ink}}>?</span></div></Center>
            </div>
          </Hide>
          <Cross id={'b-cx' + i} x={170 + i * 450} y={830} w={290} h={240} at={word('L07', 'nahi', -4) + i * 4} out={l8} />
        </React.Fragment>
      ))}
      <Sfx at={word('L07', 'peeche', -4)} name="drop" volume={0.25} />

      {/* L08: big banks paid crores against the paper; it went into the market */}
      <Bank x={100} y={430} w={380} h={330} at={l8} label="BADA BANK" seed="b-big" />
      {[0, 1, 2].map((i) => (
        <Card key={i} id={'b-cr' + i} x={560 + i * 22} y={440 + i * 96} w={380} h={110} rot={[-4, 3, -2][i]} at={word('L08', 'croron', -4) + i * 4} bg={C.yellow} sfx={i ? null : 'drop'}>
          <Center><div style={{fontFamily: F.display, fontSize: 60, lineHeight: 1}}>₹ CRORE</div></Center>
        </Card>
      ))}
      <Card id="b-pin" x={590} y={760} w={300} h={90} rot={4} at={word('L08', 'kaagazon', -4)} bg={C.paperLight} z={40}>
        <Center><div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 3}}>BR · BR · BR</div></Center>
      </Card>
      <Arrow id="b-mk" x1={500} y1={870} x2={500} y2={980} at={word('L08', 'gaya', -4)} />
      <Card id="b-mkt" x={260} y={990} w={560} h={170} rot={-1.5} at={word('L08', 'share', -4)} enter="up" bg={C.ink} texture="kraft">
        <Center><div style={{fontFamily: F.display, fontSize: 90, color: C.paperLight, lineHeight: 1}}>SHARE BAZAAR</div></Center>
      </Card>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- exposure and crash
const Crash: React.FC = () => {
  const {at, word} = useCues();
  const frame = useCurrentFrame();
  const l10 = at('L10'), l11 = at('L11'), l12 = at('L12');
  // chart geometry for L10 / L12
  const X0 = 190, Y0 = 1160, XP = 720, YP = 760, XC = 920, YC = 1110;
  const crowd: [number, number][] = [[640, 790], [680, 772], [722, 758], [760, 770], [600, 812]];
  const cnt = ease(stepped(frame), word('L11', '₹4,025', -4), word('L11', '₹4,025', 14));
  return (
    <AbsoluteFill>
      {/* L09: the exposé */}
      <Card id="c-clip" x={100} y={430} w={880} h={720} rot={-1.5} at={0} out={l10} enter="up" bg={C.newsprint} texture="news" torn={{top: true, bottom: true, left: true, right: true}} rough={12}>
        <div style={{padding: '34px 46px'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 5, borderBottom: `3px solid ${C.ink}`, paddingBottom: 10}}>1992 · NEWSPAPER</div>
          <div style={{fontFamily: F.display, fontSize: 120, lineHeight: 0.95, marginTop: 22}}>KHEL KHUL GAYA</div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 28, letterSpacing: 3, marginTop: 22, minHeight: 34}}>
            {stepped(frame) >= word('L09', 'sucheta', -4) ? <>BY <HL at={word('L09', 'sucheta', -2)}>SUCHETA DALAL</HL></> : null}
          </div>
          {Array.from({length: 7}).map((_, i) => (
            <div key={i} style={{display: 'flex', gap: 22, marginTop: 20}}>
              <div style={{height: 14, flex: 1, background: 'rgba(20,20,20,0.28)'}} />
              <div style={{height: 14, flex: i % 3 === 2 ? 0.4 : 1, background: 'rgba(20,20,20,0.28)'}} />
            </div>
          ))}
        </div>
      </Card>
      <Card id="c-date" x={560} y={1050} w={400} h={120} rot={-4} at={word('L09', '23', -4)} out={l10} bg={C.yellow} z={40}>
        <Center><div style={{fontFamily: F.display, fontSize: 64, lineHeight: 1, whiteSpace: 'nowrap'}}>23 APRIL 1992</div></Center>
      </Card>
      <Pop x={150} y={1090} at={word('L09', 'journalist', -2)} out={l10} size={44} font={F.hand} rot={-3}>ek journalist ne…</Pop>

      {/* L10: banks want their money back; market crashes */}
      <ChartCard id="c-ch1" x={110} y={680} w={860} h={550} at={l10} out={l11} enter="right" />
      <Marker id="c-up1" d={risePath('c1', X0, Y0, XP, YP, 10)} at={l10 + 2} dur={8} out={l11} color={C.ink} width={8} />
      {[0, 1, 2].map((i) => (
        <Card key={i} id={'c-wd' + i} x={130 + i * 280} y={420 + (i % 2) * 40} w={270} h={170} rot={[-5, 3, -2][i]} at={word('L10', 'wapas', -6) + i * 4} out={l11} bg={C.paperLight} sfx={i ? null : 'drop'}>
          <div style={{padding: '16px 20px'}}>
            <Label size={16}>Bank ki chitthi</Label>
            <div style={{fontFamily: F.display, fontSize: 46, lineHeight: 1, marginTop: 12}}>PAISA WAPAS DO</div>
          </div>
        </Card>
      ))}
      <Marker id="c-dn1" d={crashPath('c1', XP, YP, XC, YC)} at={word('L10', 'bazaar', -2)} dur={10} out={l11} color={C.red} width={10} />
      <Stamp id="c-dh" text="Dhadaam" x={430} y={980} at={word('L10', 'dhadaam', -2)} out={l11} size={96} rot={-9} />

      {/* L11: the committee's number */}
      <Card id="c-rbi" x={110} y={440} w={860} h={560} rot={-1} at={l11} out={l12} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid(36)}} />
        <div style={{position: 'relative', padding: '34px 44px'}}>
          <Label size={22}>RBI · Committee report</Label>
          <div style={{fontFamily: F.type, fontSize: 46, marginTop: 30}}><Typed text="Scam ka size:" at={word('L11', 'size', -6)} cps={1.4} /></div>
          <div style={{fontFamily: F.display, fontSize: 150, lineHeight: 1, marginTop: 26, whiteSpace: 'nowrap'}}>
            {stepped(frame) >= word('L11', '₹4,025', -4) ? <HL at={word('L11', 'crore', -2)}>₹{fmt(4025 * cnt)} CR</HL> : <span style={{color: C.inkSoft}}>₹ ? ? ?</span>}
          </div>
        </div>
      </Card>
      <Pop x={170} y={1030} at={word('L11', 'lagbhag', -2)} out={l12} size={44} font={F.hand} rot={-2}>lagbhag…</Pop>
      <Stamp id="c-s92" text="Scam 1992" x={720} y={1090} at={word('L11', 'crore', 4)} out={l12} size={78} rot={-8} />

      {/* L12: those who bought at the top */}
      <ChartCard id="c-ch2" x={110} y={470} w={860} h={760} at={l12} enter="up" />
      <Marker id="c-up2" d={risePath('c2', X0, Y0, XP, YP, 10)} at={l12 + 4} dur={14} color={C.ink} width={8} />
      <Crowd pts={crowd} at={word('L12', 'oonche', -6)} fallAt={word('L12', 'sabse', -2)} seed="c-crowd" />
      <Card id="c-top" x={380} y={560} w={420} h={100} rot={-3} at={word('L12', 'daam', -2)} bg={C.yellow} z={40}>
        <Center><div style={{fontFamily: F.display, fontSize: 52, lineHeight: 1, whiteSpace: 'nowrap'}}>OONCHE DAAM PE</div></Center>
      </Card>
      <Pop x={160} y={690} at={word('L12', 'big', -2)} size={40} font={F.hand} rot={-4}>Big Bull ke peeche →</Pop>
      <Marker id="c-dn2" d={crashPath('c2', XP, YP, XC, YC)} at={word('L12', 'sabse', -4)} dur={10} color={C.red} width={10} />
      <Stamp id="c-nk" text="Sabse bada nuksaan" x={470} y={1060} at={word('L12', 'nuksaan', -3)} size={56} rot={-6} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- what changed after
const Row: React.FC<{y: number; at: number; n: string; title: string; sub: string; tick: number}> = ({y, at, n, title, sub, tick}) => {
  const frame = useCurrentFrame();
  if (stepped(frame) < at) return null;
  const p = ease(stepped(frame), at, at + 6);
  return (
    <div style={{position: 'absolute', left: 150, top: y, width: 780, height: 150, opacity: p, transform: `translateX(${(1 - p) * -40}px)`, borderBottom: `3px solid ${C.ink}`, display: 'flex', alignItems: 'center', gap: 24, zIndex: 30}}>
      <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 32, color: C.inkSoft}}>{n}</div>
      <div style={{flex: 1}}>
        <div style={{fontFamily: F.display, fontSize: 60, lineHeight: 1, whiteSpace: 'nowrap'}}>{title}</div>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, marginTop: 8, color: C.inkSoft}}>{sub}</div>
      </div>
      <div style={{width: 64, height: 64, border: `5px solid ${C.ink}`, fontFamily: F.display, fontSize: 60, lineHeight: '60px', textAlign: 'center', background: stepped(frame) >= tick ? C.yellow : C.paperLight}}>{stepped(frame) >= tick ? '✓' : ''}</div>
    </div>
  );
};

const After: React.FC = () => {
  const {word} = useCues();
  const khatam = word('L14', 'khatam', -4);
  return (
    <AbsoluteFill>
      <Card id="a-list" x={100} y={420} w={880} h={800} rot={-0.8} at={0} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid(36)}} />
        <div style={{position: 'relative', padding: '30px 50px'}}>
          <Label size={22}>Scam ke baad</Label>
          <div style={{fontFamily: F.display, fontSize: 96, lineHeight: 1, marginTop: 16}}>KYA BADLA?</div>
        </div>
      </Card>
      <Row y={640} at={word('L13', 'sebi', -6)} tick={word('L13', 'taakat', -2)} n="01" title="SEBI: KANOONI TAAKAT" sub="REGULATOR KO ASLI POWER" />
      <Row y={810} at={word('L14', 'nse', -6)} tick={word('L14', 'screen', 4)} n="02" title="NSE: SCREEN PE TRADING" sub="TRADING FLOOR NAHI, SCREEN" />
      <Row y={980} at={word('L14', 'demat', -6)} tick={khatam + 6} n="03" title="DEMAT" sub="KAAGAZI SHARE KHATAM" />
      {/* paper share certificate, crossed out */}
      <Card id="a-cert" x={600} y={985} w={250} h={140} rot={4} at={word('L14', 'kaagazi', -4)} bg={C.newsprint} texture="news" z={40}>
        <div style={{padding: '12px 16px', border: `3px double ${C.ink}`, margin: 8, height: 'calc(100% - 16px)', boxSizing: 'border-box'}}>
          <div style={{fontFamily: F.type, fontSize: 22, textAlign: 'center'}}>SHARE CERTIFICATE</div>
          <div style={{height: 10, background: 'rgba(20,20,20,0.25)', marginTop: 14}} />
          <div style={{height: 10, width: '70%', background: 'rgba(20,20,20,0.25)', marginTop: 10}} />
        </div>
      </Card>
      <Cross id="a-cx" x={610} y={995} w={230} h={120} at={khatam} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- lesson
const Lesson: React.FC = () => {
  const {word} = useCues();
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 110, top: 420, width: 860}}>
        <Big words={['SEEKH?']} at={0} size={150} />
      </div>
      <Photo id="l-crowd" src="crowd.jpg" x={110} y={600} w={860} h={420} rot={1.5} at={word('L15', 'sab', -6)} enter="up" torn={{top: true, bottom: true}} rough={14} pos="50% 60%" caption="SAB EK HI TARAF" />
      <Card id="l-hero" x={600} y={430} w={340} h={140} rot={6} at={word('L15', 'hero', -4)} bg={C.yellow} z={40}>
        <Center><div style={{fontFamily: F.display, fontSize: 84, lineHeight: 1}}>'HERO'</div></Center>
      </Card>
      <Card id="l-q" x={110} y={1040} w={860} h={190} rot={-1.5} at={word('L15', 'poocho', -4)} enter="drop" bg={C.paperLight} z={45}>
        <Center><div style={{fontFamily: F.display, fontSize: 66, lineHeight: 1.05, textAlign: 'center'}}>PAISA AA <HL at={word('L15', 'kahan', -2)}>KAHAN SE</HL> RAHA HAI?</div></Center>
      </Card>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <AbsoluteFill>
    <SignOff share="L16" sign="L17" who="us dost ko jo har tip pe share khareedta hai →" note="1992 SECURITIES SCAM · SIZE PER RBI'S JANAKIRAMAN COMMITTEE (~₹4,025 CR)" />
  </AbsoluteFill>
);

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  br: BR,
  crash: Crash,
  after: After,
  lesson: Lesson,
  outro: Outro,
};
