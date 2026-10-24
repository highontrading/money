import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Big, Card, Count, Hand, HL, Label, Sfx, Stamp, Tape} from '../../components/paper';
import {ease, pop, stepped} from '../../lib/motion';
import {useCues} from '../../lib/timeline';
import {C, F} from '../../theme';
import {SignOff} from '../common';
import {Appear, BillLine, Door, FinePrint, grid, hatch, Tick, useWordAt} from './props';

const inrPlain = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

// ---------------------------------------------------------------- hook
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l3 = at('L03'), l5 = at('L05');
  const lens = word('L05', 'line', -2);
  const lp = Math.min(1.05, pop(frame, lens));
  const fine = [760, 700, 780, 640, 720, 0, 690, 760, 600, 740, 520];
  return (
    <AbsoluteFill>
      {/* L01: the policy */}
      <Card id="pol" x={110} y={420} w={860} h={340} rot={-1.5} at={word('L01', 'papa', -6)} out={l3} enter="drop">
        <div style={{background: C.ink, color: C.paperLight, fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 4, padding: '16px 34px'}}>HEALTH INSURANCE POLICY</div>
        <div style={{padding: '22px 40px'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: C.inkSoft}}>SUM INSURED</div>
          <div style={{fontFamily: F.display, fontSize: 160, lineHeight: 1, marginTop: 8}}><HL at={word('L01', '₹5')}>₹5,00,000</HL></div>
        </div>
      </Card>
      <Tape id="polt" x={460} y={402} w={150} rot={-5} at={word('L01', 'papa', -2)} out={l3} />

      {/* L02: the hospital bill, within cover */}
      <Card id="hb" x={300} y={800} w={640} h={290} rot={2} at={word('L02', 'hospital', -4)} out={l5} enter="right">
        <div style={{position: 'absolute', inset: 0, ...grid(34)}} />
        <div style={{position: 'relative', padding: '30px 36px'}}>
          <Label size={24}>Hospital bill</Label>
          <div style={{fontFamily: F.display, fontSize: 140, lineHeight: 1, marginTop: 18}}><Appear at={word('L02', '₹3', -2)}>₹3,00,000</Appear></div>
        </div>
      </Card>
      <Hand x={100} y={1130} at={word('L02', 'cover', 0)} out={at('L04')} size={56} rot={-3}>cover ke andar ✓</Hand>

      {/* L03: the claim that came back */}
      <Card id="claim" x={110} y={420} w={860} h={340} rot={1.5} at={l3 - 2} out={l5} enter="drop" bg={C.yellow}>
        <div style={{padding: '30px 40px'}}>
          <Label size={24}>Claim settled</Label>
          <div style={{fontFamily: F.display, fontSize: 170, lineHeight: 1, marginTop: 20}}>
            <Count from={300000} to={225000} at={word('L03', '₹2.25', -4)} dur={12} fmt={inrPlain} />
          </div>
        </div>
      </Card>

      {/* L04: the gap, out of pocket */}
      <Stamp id="jeb" text="₹75,000" sub="JEB SE" x={330} y={1150} at={word('L04', '₹75,000', -2)} out={l5} size={84} rot={-8} />
      <Hand x={650} y={1110} at={word('L04', 'kyun', -2)} out={l5} size={96} rot={-6}>Kyun?</Hand>

      {/* L05: one line in the policy wording */}
      <Card id="wording" x={90} y={410} w={900} h={800} rot={-1} at={l5} enter="up">
        <div style={{background: C.ink, color: C.paperLight, fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 3, padding: '16px 34px'}}>POLICY WORDING · LIMITS</div>
        <div style={{padding: '18px 40px'}}>
          {fine.map((w, i) =>
            w ? (
              <FinePrint key={i} w={w} />
            ) : (
              <div key={i} style={{fontFamily: F.type, fontSize: 30, margin: '10px 0', whiteSpace: 'nowrap'}}>
                <HL at={word('L05', 'room', -2)}>Room rent: up to 1% of Sum Insured / day</HL>
              </div>
            ),
          )}
        </div>
      </Card>
      {frame >= lens ? (
        <div style={{position: 'absolute', left: 330, top: 640, transform: `scale(${0.6 + 0.4 * lp}) rotate(-4deg)`, zIndex: 80, filter: `drop-shadow(8px 12px 12px ${C.shadow})`}}>
          <div style={{position: 'absolute', left: 300, top: 290, width: 190, height: 44, background: C.ink, borderRadius: 14, transform: 'rotate(42deg)', transformOrigin: 'left center'}} />
          <div style={{width: 400, height: 400, borderRadius: 200, border: `16px solid ${C.ink}`, background: C.card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', ...grid(30)}}>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3}}>ROOM RENT</div>
            <div style={{fontFamily: F.display, fontSize: 120, lineHeight: 1}}><HL at={word('L05', 'limit', -2)}>LIMIT</HL></div>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 2}}>1% OF SI / DIN</div>
          </div>
        </div>
      ) : null}
      <Sfx at={lens} name="pop" volume={0.3} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- limit
const Limit: React.FC = () => {
  const {at, word} = useCues();
  const l8 = at('L08');
  return (
    <AbsoluteFill>
      {/* L06: many policies cap the room */}
      <div style={{position: 'absolute', left: 110, top: 430, width: 860}}>
        <Big words={['ROOM', 'RENT', 'LIMIT']} at={word('L06', 'room', -4)} gap={4} size={130} />
      </div>
      <div style={{position: 'absolute', left: 112, top: 568}}>
        <Appear at={word('L06', 'policies', -2)}><Label size={24}>Bahut policies mein</Label></Appear>
      </div>

      {/* L07: 1% of cover per day = ₹5,000 */}
      <Card id="formula" x={110} y={650} w={860} h={420} rot={-1} at={at('L07')} out={l8} enter="right">
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'relative', padding: '40px 50px'}}>
          <div style={{fontFamily: F.display, fontSize: 110, lineHeight: 1}}>
            <Appear at={word('L07', '1%', -2)}><HL at={word('L07', '1%')}>1%</HL></Appear>
            <Appear at={word('L07', 'per', -2)}><span style={{fontSize: 70}}> × ₹5,00,000</span></Appear>
          </div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 3, color: C.inkSoft, marginTop: 14}}><Appear at={word('L07', 'din', -2)}>PER DIN</Appear></div>
          <div style={{fontFamily: F.display, fontSize: 130, lineHeight: 1, marginTop: 30}}>
            <Appear at={word('L07', '₹5,000', -3)}>= <HL at={word('L07', '₹5,000', 2)}>₹5,000</HL><span style={{fontSize: 60}}> / DIN</span></Appear>
          </div>
        </div>
      </Card>

      {/* L08: the limit room vs papa's room */}
      <Card id="doorA" x={110} y={650} w={400} h={460} rot={-2} at={l8} enter="left" bg="transparent" texture={null} depth={0.6}>
        <Door room="ROOM 204" price="₹5,000" tag="POLICY LIMIT" />
      </Card>
      <Card id="doorB" x={570} y={650} w={400} h={460} rot={2} at={word('L08', '₹8,000', -3)} enter="right" bg="transparent" texture={null} depth={0.6}>
        <Door room="ROOM 312" price="₹8,000" tag="PAPA KA ROOM" hot />
      </Card>
      <Card id="days" x={680} y={1110} w={240} h={96} rot={-3} at={word('L08', '5', -2)} bg={C.paperLight}>
        <div style={{fontFamily: F.display, fontSize: 64, textAlign: 'center', marginTop: 10}}>× 5 DIN</div>
      </Card>

      {/* L09: "we'll pay the extra ourselves" */}
      <Card id="extra" x={560} y={548} w={380} h={110} rot={-4} at={word('L09', '₹3,000', -3)} bg={C.yellow} z={40}>
        <div style={{fontFamily: F.display, fontSize: 62, textAlign: 'center', marginTop: 16, whiteSpace: 'nowrap'}}>+₹3,000 / DIN</div>
      </Card>
      <Hand x={110} y={1130} at={word('L09', 'khud', -2)} size={54} rot={-3}>khud de denge ✓</Hand>

      {/* L10: but that's not where it hurts */}
      <Stamp id="khel" text="Asli khel?" x={540} y={880} at={word('L10', 'asli', -2)} size={92} rot={-7} color={C.ink} paper />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- ratio
const CHIPS: [string, number][] = [['DOCTOR KI FEES', 0], ['SURGEON', 3], ['OT', 4], ['NURSING', 5]];

const Ratio: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const wAt = useWordAt();
  const l12 = at('L12'), l14 = at('L14');
  const barP = ease(stepped(frame), word('L11', 'yaani', -2), word('L11', 'yaani', 8));
  const up = wAt('L14', 7, -2);
  return (
    <AbsoluteFill>
      {/* L11: 5,000 ÷ 8,000 = 62.5% */}
      <Card id="hisaab" x={110} y={420} w={860} h={390} rot={-1.2} at={word('L11', 'company', -4)} out={l14} enter="drop">
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'relative', padding: '34px 46px'}}>
          <Label size={24}>Company ka hisaab</Label>
          <div style={{fontFamily: F.display, fontSize: 110, lineHeight: 1, marginTop: 26, whiteSpace: 'nowrap'}}>
            <Appear at={word('L11', '₹5,000', -2)}>₹5,000</Appear>
            <Appear at={wAt('L11', 5, -2)}><span> ÷ ₹8,000</span></Appear>
          </div>
          <div style={{fontFamily: F.display, fontSize: 140, lineHeight: 1, marginTop: 16}}>
            <Appear at={word('L11', '62.5', -3)}>= <HL at={word('L11', '62.5', 2)}>62.5%</HL></Appear>
          </div>
        </div>
      </Card>

      {/* L11 tail: the bar — only 62.5% of the room is "allowed" */}
      <Card id="bar" x={110} y={850} w={860} h={300} rot={1} at={word('L11', 'yaani', -6)} out={l12} enter="up">
        <div style={{padding: '30px 40px'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2}}>PAPA KA ROOM · ₹8,000</div>
          <div style={{position: 'relative', marginTop: 16, width: 780, height: 110, border: `4px solid ${C.ink}`, background: C.paperLight, overflow: 'hidden'}}>
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${62.5 * barP}%`, background: C.yellow}} />
            <div style={{position: 'absolute', left: '62.5%', right: 0, top: 0, bottom: 0, opacity: barP, ...hatch()}} />
            <div style={{position: 'absolute', left: 20, top: 26, fontFamily: F.display, fontSize: 52, opacity: barP}}>₹5,000 = 62.5%</div>
          </div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, marginTop: 12, opacity: barP}}>POLICY LIMIT ↑</div>
        </div>
      </Card>

      {/* L12-L13: every room-linked charge gets the same cut */}
      <Card id="jude" x={110} y={850} w={860} h={360} rot={-0.8} at={l12} enter="up">
        <div style={{padding: '26px 36px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Label size={22}>Room se jude kharche</Label>
            <div style={{fontFamily: F.display, fontSize: 50}}><Appear at={word('L12', '62.5', -2)}>SIRF <HL at={word('L12', '62.5', 2)}>62.5%</HL></Appear></div>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 24}}>
            {CHIPS.map(([t, wi]) => (
              <Appear key={t} at={wAt('L13', wi, -3)}>
                <div style={{width: 370, height: 96, border: `4px solid ${C.ink}`, background: C.paperLight, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', boxSizing: 'border-box'}}>
                  <span style={{fontFamily: F.display, fontSize: 46, whiteSpace: 'nowrap'}}>{t}</span>
                  <Appear at={up + wi}><span style={{fontFamily: F.display, fontSize: 52, color: C.red}}>↑</span></Appear>
                </div>
              </Appear>
            ))}
          </div>
        </div>
      </Card>
      <Stamp id="sab" text="Sab × 62.5%" x={740} y={480} at={word('L13', 'sab', -2)} out={l14} size={64} rot={-6} />

      {/* L14: pricier room → pricier everything */}
      <div style={{position: 'absolute', left: 110, top: 450, width: 860}}>
        <Big words={['MEHENGA', 'ROOM', '=']} at={wAt('L14', 1, -3)} gap={4} size={130} />
        <Big words={['SAB', 'MEHENGA']} at={wAt('L14', 7, -3)} gap={4} size={130} color={C.ink} style={{marginTop: 10}} />
      </div>
      {frame >= up ? <Sfx at={up} name="pop" volume={0.25} /> : null}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- bill
const Bill: React.FC = () => {
  const {at, word} = useCues();
  const l16 = at('L16'), l17 = at('L17'), l18 = at('L18');
  return (
    <AbsoluteFill>
      <Card id="bill" x={80} y={410} w={920} h={810} rot={-0.6} at={word('L15', 'bill', -4)} enter="up">
        <div style={{display: 'flex', justifyContent: 'space-between', background: C.ink, color: C.paperLight, fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, padding: '18px 40px'}}>
          <span>HOSPITAL BILL · 5 DIN</span>
          <span>CLAIM CALC.</span>
        </div>
        <BillLine top={80} at={word('L15', 'room', -3)} cutAt={word('L15', 'milega', -2)} newAt={word('L15', '₹25,000', -2)} label="ROOM" sub="5 DIN × ₹8,000" amount="₹40,000" paid="₹25,000" ratio={0.625} />
        <BillLine top={226} at={l16} cutAt={word('L16', 'milega', -2)} newAt={word('L16', 'milega', 6)} label="DOCTOR · OT · NURSING" sub="ROOM SE JUDE" amount="₹1,60,000" paid="₹1,00,000" ratio={0.625} />
        <BillLine top={372} at={l17} cutAt={word('L17', 'katauti', -2)} newAt={word('L17', 'poora', -2)} label="DAWAI + TESTS" sub="PHARMACY · DIAGNOSTICS" amount="₹1,00,000" paid="₹1,00,000" ratio={1} />
        <Total at={l18} claimAt={word('L18', '₹2.25', -3)} />
      </Card>
      <Card id="extra15" x={480} y={352} w={420} h={92} rot={3} at={word('L18', '₹15,000', -3)} bg={C.yellow} z={60}>
        <div style={{fontFamily: F.display, fontSize: 52, textAlign: 'center', marginTop: 14, whiteSpace: 'nowrap'}}>ROOM EXTRA: ₹15,000</div>
      </Card>
      <Stamp id="kata" text="Kata ₹75,000" x={300} y={1192} at={word('L18', 'kata', -2)} size={62} rot={-7} />
    </AbsoluteFill>
  );
};

const Total: React.FC<{at: number; claimAt: number}> = ({at, claimAt}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at) return null;
  const s = ease(f, claimAt, claimAt + 6);
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: 500, height: 220, borderTop: `6px solid ${C.ink}`}}>
      <Sfx at={claimAt} name="coin" volume={0.2} />
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8}}>
        <Appear at={at}><span style={{fontFamily: F.display, fontSize: 56}}>BILL</span></Appear>
        <Appear at={at}>
          <span style={{position: 'relative', fontFamily: F.display, fontSize: 70, color: f >= claimAt ? C.inkSoft : C.ink}}>
            ₹3,00,000
            {f >= claimAt ? <span style={{position: 'absolute', left: -6, right: -6, top: '50%', height: 6, background: C.red, transform: `scaleX(${s}) rotate(-3deg)`, transformOrigin: 'left'}} /> : null}
          </span>
        </Appear>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 10}}>
        <Appear at={claimAt}><span style={{fontFamily: F.display, fontSize: 56}}>CLAIM MILA</span></Appear>
        <Appear at={claimAt}><span style={{fontFamily: F.display, fontSize: 90, background: C.yellow, padding: '0 12px'}}>₹2,25,000</span></Appear>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- rules
const RULES: [string, string][] = [['DAWAI', 'dawai'], ['IMPLANTS', 'implants'], ['TESTS', 'tests'], ['ICU', 'icu']];

const Rules: React.FC = () => {
  const {at, word} = useCues();
  return (
    <AbsoluteFill>
      <Card id="rule" x={110} y={420} w={860} h={560} rot={-1} at={word('L19', 'irdai', -4)} enter="drop">
        <div style={{background: C.ink, color: C.paperLight, fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 3, padding: '16px 36px'}}>IRDAI · HEALTH INSURANCE RULE · 2024</div>
        <div style={{padding: '22px 46px'}}>
          <div style={{fontFamily: F.display, fontSize: 74, lineHeight: 1}}>IN PE <HL at={word('L19', 'katauti', -2)}>KATAUTI NAHI</HL></div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 30px', marginTop: 34}}>
            {RULES.map(([t, k]) => (
              <Appear key={k} at={word('L19', k, -3)}>
                <div style={{display: 'flex', alignItems: 'center', gap: 16, borderBottom: `3px dashed ${C.grey}`, paddingBottom: 12, width: 360}}>
                  <div style={{width: 64, height: 64, border: `4px solid ${C.ink}`, background: C.paperLight, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Tick at={word('L19', k, 3)} size={48} sound={false} />
                  </div>
                  <span style={{fontFamily: F.display, fontSize: 70}}>{t}</span>
                </div>
              </Appear>
            ))}
          </div>
        </div>
      </Card>
      <Sfx at={word('L19', 'dawai', 3)} name="marker" volume={0.25} />
      <Sfx at={word('L19', 'tests', 3)} name="marker" volume={0.25} />

      {/* L20: but room-linked charges can still be cut */}
      <Card id="warn" x={110} y={1010} w={860} h={200} rot={1} at={at('L20', -2)} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 10, border: `5px solid ${C.red}`}} />
        <div style={{padding: '34px 46px'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: C.red}}>⚠ ROOM SE JUDE KHARCHE</div>
          <div style={{fontFamily: F.display, fontSize: 76, lineHeight: 1, marginTop: 12}}>KATAUTI <HL at={word('L20', 'ho', -2)}>HO SAKTI HAI</HL></div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- fix
const Fix: React.FC = () => {
  const {at, word} = useCues();
  const rows: [string, string, string, number][] = [
    ['01', 'ROOM RENT WALI LINE PADHO', 'POLICY SCHEDULE MEIN', word('L21', 'policy', -3)],
    ['02', 'LIMIT KE ANDAR KA ROOM', 'ADMIT HOTE WAQT', word('L22', 'toh', -3)],
    ['03', 'NO ROOM RENT LIMIT', 'NAYI POLICY LE RAHE HO?', word('L23', 'no', -3)],
    ['04', 'SINGLE PRIVATE ROOM COVERED', 'ITNA KAAFI HAI', word('L24', 'single', -3)],
  ];
  return (
    <AbsoluteFill>
      <Card id="check" x={90} y={410} w={900} h={820} rot={-0.8} at={word('L21', 'toh', -6)} enter="up">
        <div style={{position: 'absolute', inset: 0, ...grid(44)}} />
        <div style={{position: 'relative', padding: '30px 44px'}}>
          <Label size={22}>Checklist · aaj hi</Label>
          <div style={{fontFamily: F.display, fontSize: 92, lineHeight: 1, marginTop: 14}}>TOH KYA KAREIN?</div>
          {rows.map(([n, t, s, a]) => (
            <Appear key={n} at={a}>
              <div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 26, width: 812, height: 128, background: C.paperLight, border: `4px solid ${C.ink}`, padding: '0 24px', boxSizing: 'border-box', boxShadow: `4px 6px 8px ${C.shadow}`}}>
                <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30, color: C.inkSoft}}>{n}</div>
                <div style={{flex: 1}}>
                  <div style={{fontFamily: F.display, fontSize: 52, lineHeight: 1, whiteSpace: 'nowrap'}}>{t}</div>
                  <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: 2, color: C.inkSoft, marginTop: 8}}>{s}</div>
                </div>
                <div style={{width: 70, height: 70, border: `4px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.card}}>
                  <Tick at={a + 10} size={54} />
                </div>
              </div>
            </Appear>
          ))}
        </div>
      </Card>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- outro
const Outro: React.FC = () => (
  <AbsoluteFill>
    <SignOff share="L25" sign="L26" who="mummy papa ko bhejo →" note={<>ILLUSTRATIVE · ₹5 LAKH SI · ROOM CAP 1%/DIN · ₹8,000 ROOM × 5 DIN<br />IRDAI HEALTH INSURANCE MASTER CIRCULAR, 2024</>} />
  </AbsoluteFill>
);

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  limit: Limit,
  ratio: Ratio,
  bill: Bill,
  rules: Rules,
  fix: Fix,
  outro: Outro,
};
