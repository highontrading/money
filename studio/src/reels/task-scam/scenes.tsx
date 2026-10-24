import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Big, Card, Hand, HL, Label, Marker, Stamp, Tape} from '../../components/paper';
import {stepped} from '../../lib/motion';
import {useCues} from '../../lib/timeline';
import {C, F} from '../../theme';
import {SignOff} from '../common';
import {Appear, Bubble, Center, Hide, Clock, Doll, FishHook, Meter, PhoneBody, Pop, Stairs, Thumb} from './props';

const STAIRS_X = 100;
const STAIRS_Y = 400;

const Amount: React.FC<{label: string; children: React.ReactNode; size?: number; color?: string}> = ({label, children, size = 110, color = C.ink}) => (
  <Center>
    <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: C.inkSoft}}>{label}</div>
    <div style={{fontFamily: F.display, fontSize: size, lineHeight: 1.05, color}}>{children}</div>
  </Center>
);

// L01-L04: the WhatsApp offer, ₹150 per like, ₹450 really arrives... then ₹5 lakh gone.
const Hook: React.FC = () => {
  const {at, word} = useCues();
  const l4 = at('L04');
  return (
    <AbsoluteFill>
      <Card id="h-phone" x={90} y={420} w={450} h={800} rot={-2} at={0} out={l4} enter="up" bg="transparent" texture={null}>
        <PhoneBody w={450} h={800} app="WHATSAPP · UNKNOWN NUMBER">
          <Bubble at={word('L01', 'message', -4)} who="+91 9XXXX XXXXX">Ghar baithe kamao! Part-time job.</Bubble>
          <Bubble at={word('L02', 'kaam', -2)}>Kaam? Bas YouTube video LIKE karo.</Bubble>
          <Bubble at={word('L02', '₹150', -3)} tone="yellow">Har like = ₹150</Bubble>
          <Bubble at={word('L03', '₹450', -3)} side="right" tone="yellow" who="UPI">₹450 credited ✓</Bubble>
        </PhoneBody>
      </Card>

      {/* L02: the like button */}
      <Card id="h-like" x={590} y={450} w={370} h={300} rot={3} at={word('L02', 'like', -4)} out={l4} bg={C.paperLight}>
        <Center>
          <Thumb size={140} />
          <div style={{fontFamily: F.display, fontSize: 60, marginTop: 6}}>LIKE</div>
        </Center>
      </Card>
      <Card id="h-150" x={700} y={710} w={240} h={100} rot={-4} at={word('L02', '₹150', -3)} out={l4} bg={C.yellow} sfx="drop">
        <Center><div style={{fontFamily: F.display, fontSize: 64}}>+₹150</div></Center>
      </Card>

      {/* L03: three likes, ₹450 really arrives */}
      {[0, 1, 2].map((i) => (
        <Pop key={i} x={600 + i * 120} y={850} at={word('L03', 'teen', -2) + i * 5} out={l4} size={60} color={C.ink}>
          <div style={{width: 96, height: 96, border: `4px solid ${C.ink}`, background: C.paperLight, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Thumb size={66} fill={C.yellow} /></div>
        </Pop>
      ))}
      <Card id="h-450" x={590} y={980} w={370} h={170} rot={-2} at={word('L03', '₹450', -3)} out={l4} bg={C.yellow}>
        <Amount label="CREDITED ✓" size={96}>₹450</Amount>
      </Card>
      <Hand x={640} y={1160} at={word('L03', 'sach', 0)} out={l4} size={58} rot={-3}>sach mein!</Hand>

      {/* L04: a week later, ₹5 lakh gone */}
      <Pop x={120} y={450} at={l4} size={40} font={F.mono}>EK HAFTE BAAD...</Pop>
      <Card id="h-5l" x={110} y={540} w={860} h={380} rot={-1.5} at={word('L04', '₹5', -4)} bg={C.paperLight}>
        <div style={{position: 'absolute', inset: 14, border: `6px solid ${C.red}`}} />
        <Amount label="AAPKE ACCOUNT SE" size={200} color={C.red}>−₹5 LAKH</Amount>
      </Card>
      <Stamp id="h-gaye" text="Gaye" x={800} y={890} at={word('L04', 'gaye', -2)} size={90} rot={-10} />
      <div style={{position: 'absolute', left: 120, top: 990, width: 840}}>
        <Big words={['KAISE?']} at={word('L04', 'kaise', -3)} size={200} />
      </div>
    </AbsoluteFill>
  );
};

// L05-L06: step 1, small money to build trust; it was bait.
const Trust: React.FC = () => {
  const {at, word} = useCues();
  const l6 = at('L06');
  return (
    <AbsoluteFill>
      <Stairs x={STAIRS_X} y={STAIRS_Y} active={0} at={0} />
      <Hide until={l6}>
        <div style={{position: 'absolute', left: 110, top: 610, width: 860}}>
          <Big words={['CHHOTA', 'PAISA']} at={word('L05', 'chhota', -3)} size={120} />
        </div>
        <div style={{position: 'absolute', left: 580, top: 820}}>
          <Meter w={360} label="BHAROSA ↑" at={word('L05', 'bharosa', -2)} dur={24} />
        </div>
      </Hide>
      <Card id="t-450" x={110} y={790} w={420} h={220} rot={-2} at={0} out={l6} bg={C.yellow}>
        <Amount label="CREDITED ✓" size={120}>₹450</Amount>
      </Card>
      <Hand x={600} y={960} at={word('L05', 'banane', 0)} out={l6} size={52} rot={-3}>bharosa ban raha hai...</Hand>

      {/* L06: the ₹450 was bait on a hook */}
      <Pop x={330} y={640} at={l6} size={10}>
        <FishHook h={420} />
      </Pop>
      <Big words={['CHAARA']} at={l6 + 2} size={110} style={{position: 'absolute', left: 560, top: 640}} />
      <Card id="t-bait" x={210} y={1050} w={340} h={150} rot={6} at={word('L06', '₹450', -3)} bg={C.yellow}>
        <Center><div style={{fontFamily: F.display, fontSize: 90}}>₹450</div></Center>
      </Card>
      <Stamp id="t-inv" text="Unka investment" x={760} y={880} at={word('L06', 'investment', -3)} size={56} rot={-8} />
      <Hand x={600} y={1150} at={word('L06', 'aapke', 0)} size={50} rot={-2}>...aapke bharose mein</Hand>
    </AbsoluteFill>
  );
};

const MEMBERS = [0, 1, 2];

// L07-L08: step 2, the Telegram group where "everyone is earning".
const Group: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const unke = word('L08', 'unke', -3);
  const same = stepped(frame) >= unke;
  return (
    <AbsoluteFill>
      <Stairs x={STAIRS_X} y={STAIRS_Y} active={1} at={0} done={1} />
      <Card id="g-phone" x={90} y={600} w={540} h={640} rot={-1.5} at={0} enter="up" bg="transparent" texture={null}>
        <PhoneBody w={540} h={640} app="TELEGRAM GROUP · EARN DAILY">
          <Bubble at={at('L07', 4)} who="ADMIN">Welcome! Aaj ka task shuru.</Bubble>
          <Bubble at={word('L07', 'kama', -3)} who="ROHIT">Payout aa gaya!</Bubble>
          <Bubble at={word('L07', 'screenshots', -3)} who="PRIYA" tone="yellow">[screenshot] CREDITED ✓</Bubble>
          <Bubble at={word('L07', 'dhanyavaad', -3)} who="AMIT">Dhanyavaad sir!</Bubble>
        </PhoneBody>
      </Card>

      {/* members column; on "unke hi log" every face turns into the same face on strings */}
      <Pop x={680} y={610} at={word('L07', 'sab', -2)} size={26} font={F.mono}>GROUP MEMBERS</Pop>
      {MEMBERS.map((i) => (
        <Pop key={i} x={670 + i * 98} y={790} at={word('L07', 'sab', 0) + i * 3} size={10}>
          <Doll size={86} fill={same ? '#E9E3D6' : [C.paperLight, C.yellow, C.card][i]} face={same ? 'same' : 'smile'} />
        </Pop>
      ))}
      <Card id="g-bar" x={660} y={660} w={300} h={70} at={unke - 6} bg={C.ink} texture={null} sfx={null}>
        <Center><div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 3, color: C.paperLight}}>SCAMMER</div></Center>
      </Card>
      {MEMBERS.map((i) => (
        <Marker key={i} id={'g-str' + i} d={`M${713 + i * 98},${730} L${713 + i * 98},${792}`} at={unke - 4 + i * 2} dur={4} color={C.ink} width={3} />
      ))}
      <Hand x={680} y={920} at={word('L08', 'baaki', -2)} size={52} rot={-3}>baaki log?</Hand>
      <Stamp id="g-same" text="Unke hi log" x={810} y={1080} at={unke + 4} size={58} rot={-7} />
    </AbsoluteFill>
  );
};

// L09-L10: step 3, prepaid task: put in ₹1,000, get ₹1,300; greed grows.
const Prepaid: React.FC = () => {
  const {at, word} = useCues();
  const l10 = at('L10');
  return (
    <AbsoluteFill>
      <Stairs x={STAIRS_X} y={STAIRS_Y} active={2} at={0} done={2} />
      <Card id="p-task" x={110} y={600} w={860} h={330} rot={-1} at={at('L09')} bg={C.paperLight}>
        <div style={{padding: '26px 40px'}}>
          <Label size={24}>Prepaid task</Label>
          <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 34}}>
            <div>
              <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 2}}>PEHLE DAALO</div>
              <div style={{fontFamily: F.display, fontSize: 120, lineHeight: 1}}><Appear at={word('L09', '₹1,000', -3)}>₹1,000</Appear></div>
            </div>
            <div style={{fontFamily: F.display, fontSize: 90, color: C.inkSoft, marginBottom: 10, opacity: 0.8}}>→</div>
            <div style={{textAlign: 'right'}}>
              <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 2}}>PAO</div>
              <div style={{fontFamily: F.display, fontSize: 120, lineHeight: 1, minWidth: 330}}>
                <Appear at={word('L09', '₹1,300', -3)}><HL at={word('L09', '₹1,300', 2)}>₹1,300</HL></Appear>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* L10: it really pays, and greed climbs */}
      <Card id="p-paid" x={110} y={980} w={400} h={220} rot={-2} at={l10} bg={C.yellow}>
        <Amount label="CREDITED ✓" size={110}>₹1,300</Amount>
      </Card>
      <Hand x={140} y={1205} at={word('L10', 'jaata', 0)} size={46} rot={-2}>mil bhi gaya!</Hand>
      <Hide from={word('L10', 'lalach', -6)}>
        <div style={{position: 'absolute', left: 570, top: 1010}}>
          <Meter w={380} label="LALACH ↑" at={word('L10', 'lalach', -2)} dur={20} to={0.92} color={C.red} />
        </div>
      </Hide>
    </AbsoluteFill>
  );
};

const DEMANDS: [string, string][] = [['TAX BHARO', 'tax'], ['FEE BHARO', 'fee'], ['EK AUR TASK', 'ek']];

// L11-L13: step 4, the big task; withdrawal needs more money; everything vanishes.
const Trap: React.FC = () => {
  const {at, word} = useCues();
  const l12 = at('L12'), l13 = at('L13');
  const gone = word('L13', 'gaayab', -2);
  return (
    <AbsoluteFill>
      <Stairs x={STAIRS_X} y={STAIRS_Y} active={3} at={0} done={3} fallAt={word('L13', 'bhara', -2)} />
      <Card id="tr-big" x={110} y={600} w={860} h={300} rot={1} at={at('L11')} out={l13} bg={C.paperLight}>
        <div style={{padding: '26px 40px'}}>
          <Label size={24}>Bada task</Label>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 2, marginTop: 30}}>DAALO</div>
          <div style={{fontFamily: F.display, fontSize: 140, lineHeight: 1}}>
            <Appear at={word('L11', '₹50,000', -3)}><HL at={word('L11', '₹50,000', 2)}>₹50,000</HL></Appear>
          </div>
        </div>
      </Card>
      <Stamp id="tr-atka" text="Paisa atka" sub="WITHDRAW: LOCKED" x={790} y={690} at={word('L11', 'atak', -3)} out={l13} size={56} rot={-9} />

      {/* L12: to withdraw, pay more */}
      <Card id="tr-withdraw" x={110} y={950} w={380} h={130} rot={-2} at={l12} out={l13} bg="#d9d4c8">
        <Center><div style={{fontFamily: F.display, fontSize: 60, color: C.inkSoft}}>NIKAALO →</div></Center>
      </Card>
      <Hand x={130} y={1100} at={word('L12', 'hai', 0)} out={l13} size={50} rot={-3}>nikaalna hai?</Hand>
      {DEMANDS.map(([t, k], i) => (
        <Card key={k} id={'tr-d' + k} x={540} y={940 + i * 95} w={420} h={85} rot={[-2, 1.5, -1][i]} at={word('L12', k, -3)} out={l13} bg={C.paperLight}>
          <div style={{position: 'absolute', inset: 6, border: `4px solid ${C.red}`}} />
          <Center><div style={{fontFamily: F.display, fontSize: 52, color: C.red}}>{t}</div></Center>
        </Card>
      ))}

      {/* L13: nothing comes back, the account and group vanish */}
      <Pop x={120} y={620} at={l13} size={80}>JO BHARA,</Pop>
      <Pop x={120} y={720} at={word('L13', 'wapas', -3)} size={130} color={C.red}>WAPAS NAHI.</Pop>
      {[['ACCOUNT', 'account', 110], ['TELEGRAM GROUP', 'group', 530]].map(([t, k, x]) => (
        <React.Fragment key={k as string}>
          <Hide from={l13}><div style={{position: 'absolute', left: x as number, top: 920, width: 400, height: 200, border: `4px dashed ${C.inkSoft}`, opacity: 0.6}} /></Hide>
          <Card id={'tr-' + k} x={x as number} y={920} w={400} h={200} rot={k === 'account' ? -2 : 2} at={word('L13', k as string, -3)} out={gone + 6} exit="fade" bg={C.card}>
            <Center><div style={{fontFamily: F.display, fontSize: 56}}>{t}</div><div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, marginTop: 6, color: C.inkSoft}}>@earn_daily_official</div></Center>
          </Card>
        </React.Fragment>
      ))}
      <Stamp id="tr-gaayab" text="Gaayab" x={540} y={1020} at={gone + 4} size={120} rot={-8} />
    </AbsoluteFill>
  );
};

// L14-L17: the rule, nobody pays for likes, call 1930, report fast.
const Rule: React.FC = () => {
  const {at, word} = useCues();
  const l15 = at('L15'), l16 = at('L16'), l17 = at('L17');
  return (
    <AbsoluteFill>
      <Card id="r-rule" x={110} y={440} w={860} h={500} rot={-1} at={0} out={l16} enter="up" bg={C.paperLight}>
        <div style={{padding: '30px 44px'}}>
          <Label size={26}>Ek seedha rule</Label>
          <div style={{marginTop: 26}}>
            <Big words={['JO', 'KAAM', 'PEHLE', 'PAISA', 'MAANGE']} at={word('L14', 'rule', 2)} gap={3} size={96} />
          </div>
          <Pop x={44} y={290} at={word('L14', 'woh', -3)} size={96} color={C.inkSoft}>=</Pop>
          <Pop x={120} y={290} at={word('L14', 'naukri', -3)} size={110} color={C.red}>NAUKRI NAHI.</Pop>
        </div>
      </Card>
      <Tape id="r-tape" x={470} y={420} w={150} rot={-4} at={4} out={l16} />

      {/* L15: nobody pays for likes */}
      <Card id="r-like" x={110} y={990} w={860} h={230} rot={1.5} at={l15} out={l16} bg={C.card}>
        <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 40px', gap: 30}}>
          <Thumb size={130} />
          <div style={{fontFamily: F.display, fontSize: 84}}>LIKE KE PAISE?</div>
        </div>
      </Card>
      <Stamp id="r-koi" text="Koi nahi deta" x={700} y={1150} at={word('L15', 'koi', -3)} out={l16} size={62} rot={-8} />

      {/* L16: 1930 and cybercrime.gov.in */}
      <Card id="r-1930" x={110} y={440} w={860} h={420} rot={-1.5} at={l16} enter="drop" bg={C.yellow}>
        <Center>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 28, letterSpacing: 3}}>NATIONAL CYBERCRIME HELPLINE</div>
          <div style={{fontFamily: F.display, fontSize: 260, lineHeight: 1}}><Appear at={word('L16', '1930', -3)}>1930</Appear></div>
        </Center>
      </Card>
      <Hand x={130} y={880} at={word('L16', 'turant', -2)} out={l17} size={60} rot={-4}>turant call karo!</Hand>
      <Card id="r-gov" x={160} y={980} w={760} h={150} rot={1.5} at={word('L16', 'cybercrime', -4)} bg={C.paperLight}>
        <Center>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: C.inkSoft}}>YA ONLINE REPORT</div>
          <div style={{fontFamily: F.display, fontSize: 76}}>cybercrime.gov.in</div>
        </Center>
      </Card>

      {/* L17: the sooner, the better the chance */}
      <div style={{position: 'absolute', left: 150, top: 1130, opacity: 1}}>
        <Pop x={0} y={0} at={l17} size={10}><Clock size={110} at={l17} dur={80} /></Pop>
      </div>
      <Pop x={290} y={1150} at={word('L17', 'jaldi', -3)} size={44}>JITNI JALDI REPORT,</Pop>
      <Pop x={290} y={1200} at={word('L17', 'utna', -3)} size={44}><HL at={word('L17', 'chance', -2)}>UTNA ZYADA CHANCE</HL></Pop>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <AbsoluteFill>
    <SignOff share="L18" sign="L19" who="family group mein daalo, mummy papa ko →" note="PATTERN FROM POLICE & CYBERCRIME ADVISORIES · AMOUNTS ILLUSTRATIVE · HELPLINE 1930" />
  </AbsoluteFill>
);

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  trust: Trust,
  group: Group,
  prepaid: Prepaid,
  trap: Trap,
  rule: Rule,
  outro: Outro,
};

