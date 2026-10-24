import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Big, Card, Cross, Hand, HL, Label, Photo, Stamp, Tape} from '../../components/paper';
import {useCues} from '../../lib/timeline';
import {C, F} from '../../theme';
import {SignOff} from '../common';
import {Center, Flood, Hide, House, Lines, Magnifier, Phone, Pop, Room, Scratch, Soundbox, Tick} from './props';

const Row: React.FC<{label: string; value?: React.ReactNode; top?: boolean}> = ({label, value, top}) => (
  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 30px', borderTop: top ? `2px dashed ${C.grey}` : undefined}}>
    <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 3, color: C.inkSoft}}>{label}</div>
    <div style={{fontFamily: F.display, fontSize: 64, lineHeight: 1}}>{value}</div>
  </div>
);

// L01-L03: a free payment, billions of them, and a valuation in thousands of crores.
const Hook: React.FC = () => {
  const {at, word} = useCues();
  const l2 = at('L02'), val = word('L03', 'valuation', -4);
  return (
    <AbsoluteFill>
      <Card id="h-phone" x={300} y={420} w={480} h={790} rot={-2} at={0} out={l2} enter="up" bg={C.ink} texture={null} sfx="slide">
        <Phone w={480} h={790}>
          <div style={{background: C.ink, color: C.paperLight, fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 4, padding: '40px 0 16px', textAlign: 'center'}}>UPI · PAY</div>
          <Center style={{height: 'auto', marginTop: 50}}>
            <div style={{width: 120, height: 120, borderRadius: '50%', background: C.yellow, border: `4px solid ${C.ink}`, fontFamily: F.display, fontSize: 70, lineHeight: '120px', textAlign: 'center'}}>D</div>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 2, marginTop: 18}}>DOST KO</div>
            <div style={{fontFamily: F.display, fontSize: 62, marginTop: 26, lineHeight: 1}}>PAISE BHEJE</div>
            <div style={{marginTop: 14}}><Tick size={86} /></div>
          </Center>
          <Hide from={word('L01', 'fee', -3)}>
            <div style={{position: 'absolute', left: 30, right: 30, bottom: 70, borderTop: `3px dashed ${C.grey}`, paddingTop: 26, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 34, letterSpacing: 4}}>FEE</div>
              <div style={{fontFamily: F.display, fontSize: 92, lineHeight: 1}}>{'₹'}<Hide from={word('L01', 'zero', -2)}><HL at={word('L01', 'zero', 0)}>0</HL></Hide><Hide until={word('L01', 'zero', -2)}>?</Hide></div>
            </div>
          </Hide>
        </Phone>
      </Card>
      <Stamp id="h-zero" text="Zero" x={200} y={960} at={word('L01', 'zero', 4)} out={l2} size={76} rot={-10} />

      {/* L02: billions of payments every month */}
      <Flood seed="h-flood" x={90} y={420} w={900} h={560} at={l2 - 2} out={val} />
      <Card id="h-arab" x={150} y={1010} w={780} h={190} rot={-1.5} at={word('L02', 'arabon', -4)} out={val} bg={C.yellow} torn={{top: true}} rough={10} z={40}>
        <Center>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 4}}>HAR MAHINE</div>
          <div style={{fontFamily: F.display, fontSize: 96, lineHeight: 1, marginTop: 6}}>ARABON PAYMENTS</div>
        </Center>
      </Card>

      {/* L03: valuation tag, and the question */}
      <Card id="h-tag" x={140} y={470} w={800} h={430} rot={-3} at={val} bg={C.card} enter="drop">
        <div style={{position: 'absolute', left: 40, top: 40, width: 46, height: 46, borderRadius: '50%', border: `5px solid ${C.ink}`}} />
        <div style={{padding: '40px 50px 0 120px'}}>
          <Label size={26}>Payment apps ki valuation</Label>
        </div>
        <div style={{padding: '30px 50px', fontFamily: F.display, fontSize: 132, lineHeight: 1}}>
          ₹ <HL at={word('L03', 'hazaaron', -2)}>HAZAARON</HL>
          <div>CRORE ?</div>
        </div>
      </Card>
      <Tape id="h-tagt" x={420} y={452} w={160} rot={-6} at={val + 2} />
      <Hand x={160} y={960} at={word('L03', 'kamaate', -2)} size={84} rot={-3}>kamaate kahan se?</Hand>
      <Stamp id="h-q" text="?" x={860} y={1060} at={word('L03', 'kahan', 0)} size={120} rot={8} />
    </AbsoluteFill>
  );
};

// L04-L05: merchant fee zero for years -> apps earn from you, not from payments.
const Free: React.FC = () => {
  const {at, word} = useCues();
  const l5 = at('L05');
  return (
    <AbsoluteFill>
      <Photo id="f-shop" src="card_terminal.jpg" x={110} y={420} w={860} h={470} rot={-1.5} at={0} out={l5} enter="up" torn={{top: true, bottom: true}} rough={12} pos="50% 55%" caption="DUKAAN KA COUNTER" />
      <Card id="f-sign" x={150} y={920} w={780} h={270} rot={1.5} at={word('L04', 'merchant', -4)} out={l5} bg={C.ink} texture={null}>
        <div style={{padding: '26px 40px', color: C.paperLight}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 4, opacity: 0.8}}>SAALON TAK · SARKAR KA RULE</div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20}}>
            <div style={{fontFamily: F.display, fontSize: 92, lineHeight: 1}}>MERCHANT FEE</div>
            <div style={{fontFamily: F.display, fontSize: 120, lineHeight: 1, color: C.ink}}><Hide from={word('L04', 'zero', -2)}><HL at={word('L04', 'zero', 0)}>₹0</HL></Hide></div>
          </div>
        </div>
      </Card>
      <Hand x={130} y={900} at={word('L04', 'sarkar', -2)} out={word('L04', 'merchant', -4)} size={60} rot={-3}>saalon tak...</Hand>

      {/* L05 */}
      <Card id="f-pay" x={110} y={450} w={860} h={240} rot={-1} at={l5} enter="left" bg={C.paperLight}>
        <Center><div style={{fontFamily: F.display, fontSize: 120, lineHeight: 1}}>PAYMENT SE</div></Center>
      </Card>
      <Cross id="f-x" x={150} y={480} w={780} h={180} at={word('L05', 'nahi', -2)} />
      <Card id="f-aap" x={110} y={760} w={860} h={300} rot={1.5} at={word('L05', 'aap', -4)} bg={C.yellow} torn={{bottom: true, right: true}} rough={12}>
        <Center><div style={{fontFamily: F.display, fontSize: 200, lineHeight: 1}}>AAP SE</div></Center>
      </Card>
      <Hand x={420} y={1090} at={word('L05', 'kamaana', -2)} size={66} rot={-3}>kamaana seekha!</Hand>
    </AbsoluteFill>
  );
};

// L06-L10: the app is a house; UPI is the door, the money is in the rooms.
const Money: React.FC = () => {
  const {word} = useCues();
  const sub = (y: number, at: number, children: React.ReactNode, size = 24) => (
    <Pop x={18} y={y} at={at} size={size} font={F.mono}>{children}</Pop>
  );
  return (
    <AbsoluteFill>
      <House seed="m-house" at={0} doorAt={word('L10', 'darwaza', -2)} />
      <Room i={0} n="01" title="LOANS" at={word('L06', 'loans', -3)}>
        {sub(110, word('L06', 'data', -3), 'PAYMENT DATA → LOAN OFFER')}
        <Pop x={18} y={146} at={word('L06', 'commission', -3)} size={34}>HAR LOAN PE <span style={{background: C.ink, color: C.yellow, padding: '0 8px'}}>COMMISSION</span></Pop>
      </Room>
      <Room i={1} n="02" title="INSURANCE" at={word('L07', 'insurance', -3)}>
        <Pop x={18} y={104} at={word('L07', 'mutual', -3)} size={44}>+ MUTUAL FUNDS</Pop>
        {sub(160, word('L07', 'bechna', -2), 'BECHNA = COMMISSION')}
      </Room>
      <Room i={2} n="03" title="SOUNDBOX" at={word('L08', 'soundbox', -3)}>
        <div style={{position: 'absolute', right: 18, top: 18}}><Soundbox size={92} /></div>
        <Pop x={18} y={104} at={word('L08', 'received', -6)} size={30} font={F.hand}>"payment received!"</Pop>
        {sub(152, word('L08', 'kiraya', -6), 'MAHINE KA KIRAYA')}
      </Room>
      <Room i={3} n="04" title="ADS + REWARDS" at={word('L09', 'ads', -3)}>
        <div style={{position: 'absolute', left: 18, top: 102}}>
          <Hide from={word('L09', 'scratch', -4)}>
            <Scratch w={230} h={88} at={word('L09', 'brand', -2)}>
              <div style={{fontFamily: F.display, fontSize: 40, lineHeight: 1}}>BRAND KA AD</div>
            </Scratch>
          </Hide>
        </div>
      </Room>
      <Hand x={180} y={1095} at={word('L10', 'darwaza', -2)} size={54} rot={-3}>darwaza →</Hand>
      <Hand x={652} y={1095} at={word('L10', 'kamaai', -2)} size={48} rot={3}>kamaai andar ↑</Hand>
    </AbsoluteFill>
  );
};

// L11-L13: from 15 Oct 2026 some merchant payments carry a fee; customers still pay nothing.
const New: React.FC = () => {
  const {at, end, word} = useCues();
  const l13 = at('L13');
  const free2 = end('L13', -12);
  return (
    <AbsoluteFill>
      <Hide until={l13}>
        <div style={{position: 'absolute', left: 110, top: 430}}>
          <Big words={['EK', 'BADLAAV']} at={at('L11')} gap={Math.max(4, word('L11', 'badlaav', -4) - at('L11'))} size={130} />
        </div>
      </Hide>
      <Card id="n-notice" x={110} y={600} w={860} h={600} rot={-1} at={word('L11', '15', -6)} out={l13} enter="up" bg={C.card}>
        <div style={{background: C.ink, color: C.paperLight, fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 4, padding: '18px 30px'}}>NOTICE · UPI MERCHANT FEE</div>
        <Hide from={word('L11', '15', -3)}><Row label="KAB SE" value={<HL at={word('L11', '2026', -2)}>15 OCT 2026</HL>} /></Hide>
        <Hide from={word('L11', 'merchant', -4)}><Row top label="KIN PE" value="BADE MERCHANT PAYMENTS" /></Hide>
        <Hide from={at('L12')}><Row top label="AMOUNT" value={<HL at={at('L12', 2)}>₹2,000 SE UPAR</HL>} /></Hide>
        <Hide from={word('L12', '0.4', -3)}><Row top label="FEE" value={<HL at={word('L12', '0.4', 0)}>0.4% TAK</HL>} /></Hide>
        <Hide from={word('L12', 'dukaandaar', -3)}><Row top label="KAUN BHAREGA" value="DUKAANDAAR" /></Hide>
      </Card>

      {/* L13 */}
      <Card id="n-you" x={110} y={460} w={860} h={330} rot={-1.5} at={l13} enter="left" bg={C.card}>
        <div style={{padding: '34px 50px'}}>
          <Label size={26}>Aapke liye</Label>
          <div style={{display: 'flex', alignItems: 'center', gap: 30, marginTop: 30}}>
            <div style={{fontFamily: F.display, fontSize: 140, lineHeight: 1}}>UPI: <HL at={word('L13', 'free', -2)}>FREE</HL></div>
            <Hide from={word('L13', 'free', 2)}><Tick size={110} /></Hide>
          </div>
        </div>
      </Card>
      <Card id="n-dost" x={110} y={840} w={860} h={330} rot={1.5} at={word('L13', 'dost', -4)} enter="right" bg={C.yellow} torn={{bottom: true}} rough={10}>
        <div style={{padding: '34px 50px'}}>
          <Label size={26}>Dost ko bhejna</Label>
          <div style={{display: 'flex', alignItems: 'center', gap: 30, marginTop: 30}}>
            <div style={{fontFamily: F.display, fontSize: 140, lineHeight: 1}}>FREE</div>
            <Hide from={free2}><Tick size={110} /></Hide>
          </div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

// L14-L15: if it's free, ask where the money comes from; read the loan's rate and fees.
const Lesson: React.FC = () => {
  const {at, word} = useCues();
  const l15 = at('L15');
  return (
    <AbsoluteFill>
      <Hide until={l15}>
        <div style={{position: 'absolute', left: 110, top: 440}}>
          <Big words={['SEEKH:']} at={0} size={140} />
        </div>
      </Hide>
      <Card id="l-free" x={560} y={430} w={400} h={210} rot={6} at={word('L14', 'free', -4)} out={l15} bg={C.paperLight}>
        <div style={{position: 'absolute', left: 26, top: 26, width: 34, height: 34, borderRadius: '50%', border: `4px solid ${C.ink}`}} />
        <Center><div style={{fontFamily: F.display, fontSize: 110, lineHeight: 1}}>FREE?</div></Center>
      </Card>
      <Card id="l-ask" x={110} y={720} w={860} h={360} rot={-1.5} at={word('L14', 'poocho', -4)} out={l15} bg={C.yellow} torn={{top: true, right: true}} rough={12}>
        <div style={{padding: '40px 50px'}}>
          <Label size={28}>Poocho</Label>
          <div style={{fontFamily: F.display, fontSize: 124, lineHeight: 1, marginTop: 30}}>KAMAAI <span style={{background: C.ink, color: C.yellow, padding: '0 14px'}}>KAHAN</span> SE?</div>
        </div>
      </Card>

      {/* L15: an in-app loan offer and its fine print */}
      <Card id="l-loan" x={130} y={430} w={820} h={660} rot={-1} at={l15} enter="up" bg={C.card}>
        <div style={{background: C.ink, color: C.paperLight, fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 4, padding: '18px 30px'}}>APP · AAPKE LIYE OFFER</div>
        <div style={{padding: '34px 40px 0'}}>
          <div style={{fontFamily: F.display, fontSize: 104, lineHeight: 1}}>PRE-APPROVED<br /><HL at={word('L15', 'loan', -2)}>LOAN!</HL></div>
          <div style={{display: 'inline-block', marginTop: 28, background: C.yellow, border: `4px solid ${C.ink}`, fontFamily: F.display, fontSize: 48, padding: '10px 30px'}}>ABHI LO →</div>
          <div style={{marginTop: 36}}><Lines n={4} gap={18} h={8} seed="l-fine" /></div>
          <div style={{fontFamily: F.mono, fontSize: 16, letterSpacing: 1, color: C.inkSoft, marginTop: 4}}>*T&amp;C · rate · processing fee · late fee</div>
        </div>
      </Card>
      <Magnifier cx={760} cy={960} r={150} at={word('L15', 'rate', -4)}>
        <div style={{fontFamily: F.display, fontSize: 52, lineHeight: 1.1, textAlign: 'center'}}>RATE ?<br /><HL at={word('L15', 'fees', -2)}>FEES ?</HL></div>
      </Magnifier>
      <Hand x={160} y={1125} at={word('L15', 'padho', -4)} size={64} rot={-3}>pehle zaroor padho!</Hand>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <AbsoluteFill>
    <SignOff share="L16" sign="L17" who="us dost ko jo har cheez UPI se bharta hai →" note="CONSUMERS PAY NO UPI FEE · MERCHANT FEE FROM 15 OCT 2026 PER NPCI FRAMEWORK" />
  </AbsoluteFill>
);

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  free: Free,
  money: Money,
  new: New,
  lesson: Lesson,
  outro: Outro,
};
