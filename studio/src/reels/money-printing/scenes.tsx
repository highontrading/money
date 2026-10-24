import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Big, Card, Circle, Count, Cross, Hand, HL, Label, Photo, Sfx, Stamp, Tape} from '../../components/paper';
import {ease, stepped} from '../../lib/motion';
import {useCues} from '../../lib/timeline';
import {C, F} from '../../theme';
import {SignOff} from '../common';
import {grid, House, Mango, MiniNote, Person, PriceTag, prog, Press, Scale, Show} from './props';

/* ------------------------------------------------------------------ hook */

const Hook: React.FC = () => {
  const {at, word} = useCues();
  const l02 = at('L02'), l03 = at('L03');
  return (
    <AbsoluteFill>
      {/* L01: the government has a note-printing machine */}
      <div style={{position: 'absolute', left: 110, top: 410}}>
        <Show at={0} out={l03} style={{whiteSpace: 'nowrap'}}><Label size={28}>Sarkar ke paas</Label></Show>
      </div>
      <Press x={110} y={470} at={4} printAt={word('L01', 'chhaapne', 0)} out={l03} scale={1.05} />
      <Hand x={560} y={880} at={word('L01', 'machine', -2)} out={l02} size={64} rot={-4}>note machine!</Hand>

      {/* L02: give every house ₹1 crore */}
      {[0, 1, 2, 3, 4].map((i) => (
        <Show key={i} at={word('L02', 'ghar', -4) + i * 3} out={l03} style={{left: 100 + i * 180, top: 900}}>
          <House s={1.05} />
          <Show at={word('L02', '₹1', -2) + i * 3} style={{left: 6, top: 140}}>
            <div style={{background: C.yellow, border: `3px solid ${C.ink}`, fontFamily: F.display, fontSize: 30, padding: '4px 8px', whiteSpace: 'nowrap', transform: `rotate(${i % 2 ? 4 : -4}deg)`}}>₹1 CRORE</div>
          </Show>
        </Show>
      ))}
      <Stamp id="amir" text="Sab amir?" x={740} y={1185} at={word('L02', 'sab', -2)} out={l03} size={84} rot={-7} color={C.ink} paper />

      {/* L03: one country did exactly that */}
      <div style={{position: 'absolute', left: 110, top: 430, width: 860}}>
        <Big words={['EK', 'DESH', 'NE', 'YAHI', 'KIYA.']} at={l03 - 2} gap={3} size={120} />
      </div>
      <Photo id="zim1" src="zim_note.jpg" x={110} y={680} w={860} h={427} rot={-3} at={word('L03', 'note', -4)} enter="up" torn={{right: true, bottom: true}} rough={12} zoom={0.02} caption="ASLI NOTE · 2009" />
      <Circle id="zc1" cx={330} cy={830} rx={190} ry={95} at={word('L03', '100', -2)} />
      <Card id="ztag" x={560} y={1110} w={410} h={110} rot={3} at={word('L03', 'trillion', -2)} bg={C.yellow} sfx={null}>
        <div style={{fontFamily: F.display, fontSize: 60, textAlign: 'center', marginTop: 18, whiteSpace: 'nowrap'}}>100 TRILLION $</div>
      </Card>
    </AbsoluteFill>
  );
};

/* --------------------------------------------------------------- village */

const MangoPrice: React.FC<{tenAt: number; flipAt: number}> = ({tenAt, flipAt}) => {
  const frame = useCurrentFrame();
  const flipped = stepped(frame) >= flipAt;
  return (
    <PriceTag w={360} h={140} bg={flipped ? C.yellow : C.paperLight} rot={4}>
      <div style={{fontFamily: F.display, fontSize: 64, whiteSpace: 'nowrap', display: 'flex', gap: 14, alignItems: 'center'}}>
        <span style={{fontSize: 40}}>1 AAM =</span>
        {flipped ? <span>₹100</span> : frame >= tenAt ? <Count from={0} to={10} at={tenAt} dur={8} /> : <span>₹ ?</span>}
      </div>
    </PriceTag>
  );
};

const Village: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l06 = at('L06'), l07 = at('L07'), l08 = at('L08');
  const notesMore = word('L06', 'chhaape', 0);
  const extra = Math.floor(prog(frame, notesMore, notesMore + 30) * 9);
  return (
    <AbsoluteFill>
      {/* L04: the village board */}
      <Card id="board" x={80} y={410} w={920} h={820} rot={-0.8} at={0} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'relative', padding: '28px 40px'}}>
          <Label size={26}>Ek chhota sa gaon</Label>
        </div>
      </Card>
      {/* people */}
      <Show at={word('L04', 'log', -8)} style={{left: 130, top: 500, zIndex: 20, whiteSpace: 'nowrap'}}><Label size={22}>10 log</Label></Show>
      {Array.from({length: 10}).map((_, i) => (
        <Show key={i} at={word('L04', 'log', -6) + i} style={{left: 140 + i * 80, top: 540, zIndex: 20}}>
          <Person s={0.85} color={i % 3 === 0 ? C.newsprint : C.paperLight} />
        </Show>
      ))}
      {/* mangoes */}
      <Show at={word('L04', 'aam', -6)} style={{left: 130, top: 680, zIndex: 20, whiteSpace: 'nowrap'}}><Label size={22}>10 aam</Label></Show>
      {Array.from({length: 10}).map((_, i) => (
        <Show key={i} at={word('L04', 'aam', -4) + i} style={{left: 140 + i * 80, top: 720, zIndex: 20}}>
          <Mango s={0.95} />
        </Show>
      ))}
      <Circle id="mc" cx={540} cy={758} rx={430} ry={62} at={word('L07', 'sirf', -4)} out={l08} />
      <Stamp id="sirf10" text="Ab bhi sirf 10" x={760} y={680} at={word('L07', '10', -2)} out={l08} size={46} rot={-6} />

      {/* money pile */}
      <Show at={word('L04', '₹100', -4)} style={{left: 130, top: 830, zIndex: 20, whiteSpace: 'nowrap'}}><Label size={22}>Gaon ka paisa</Label></Show>
      {Array.from({length: 1 + extra}).map((_, i) => (
        <Show key={i} at={i === 0 ? word('L04', '₹100', -2) : notesMore + i * 3} style={{left: 140 + (i % 5) * 92, top: 880 + Math.floor(i / 5) * 70, zIndex: 20 + i}}>
          <MiniNote w={130} h={62} rot={(i % 2 ? 4 : -5)} />
        </Show>
      ))}
      <Show at={word('L04', '₹100', -2)} style={{left: 640, top: 880, zIndex: 30}}>
        <div style={{fontFamily: F.display, fontSize: 96, lineHeight: 1}}>
          {frame >= notesMore ? <HL at={word('L06', '₹1,000', 0)}><Count from={100} to={1000} at={word('L06', '₹1,000', -10)} dur={10} /></HL> : '₹100'}
        </div>
      </Show>
      <Show at={notesMore - 4} out={l07} style={{left: 610, top: 985, zIndex: 30}}>
        <div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 42, color: C.red, transform: 'rotate(-3deg)', whiteSpace: 'nowrap'}}>+ naye note chhape!</div>
      </Show>

      {/* L05 / L08: price of one mango */}
      <Show at={word('L05', 'aam', -4)} style={{left: 560, top: 1050, zIndex: 40}}>
        <MangoPrice tenAt={word('L05', '₹10', -4)} flipAt={word('L08', '₹100', -2)} />
      </Show>
      <Hand x={130} y={1080} at={word('L05', 'lagbhag', 0)} out={l06} size={56} rot={-3}>₹100 ÷ 10 aam</Hand>
      <Hand x={130} y={1080} at={l08} size={52} rot={-3} w={420}>zyada paisa, utne hi aam</Hand>
      <Cross id="old10" x={700} y={1065} w={210} h={110} at={word('L08', 'toh', -2)} out={word('L08', '₹100', -2)} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ real */

const Real: React.FC = () => {
  const {at, word} = useCues();
  const l10 = at('L10');
  return (
    <AbsoluteFill>
      {/* L09: everyone has more notes, nobody is richer */}
      <Card id="rich" x={90} y={420} w={900} h={640} rot={1} at={0} out={l10} enter="up" bg={C.card}>
        <div style={{padding: '30px 40px'}}><Label size={26}>Sab ke paas zyada note</Label></div>
      </Card>
      {Array.from({length: 5}).map((_, i) => (
        <Show key={i} at={4 + i * 2} out={l10} style={{left: 150 + i * 165, top: 620, zIndex: 20}}>
          <Person s={1.3} />
          <div style={{position: 'absolute', left: -20, top: 150}}>
            {[0, 1, 2].map((k) => <div key={k} style={{position: 'absolute', top: -k * 16, left: k * 4}}><MiniNote w={120} h={54} rot={k % 2 ? 3 : -3} /></div>)}
          </div>
        </Show>
      ))}
      <Stamp id="koi" text="Koi amir nahi hua" x={540} y={1010} at={word('L09', 'amir', -2)} out={l10} size={74} rot={-6} />

      {/* L10: real wealth = goods and work */}
      <Card id="daulat" x={110} y={420} w={860} h={800} rot={-1} at={l10} enter="drop" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'relative', padding: '36px 44px'}}>
          <Label size={26}>Asli daulat =</Label>
        </div>
      </Card>
      <Show at={word('L10', 'note', -4)} style={{left: 200, top: 560, zIndex: 30}}>
        <MiniNote w={300} h={140} label="₹" rot={-4} />
      </Show>
      <Cross id="notex" x={190} y={545} w={330} h={175} at={word('L10', 'nahi', -2)} />
      <Show at={word('L10', 'nahi', 4)} style={{left: 600, top: 600, zIndex: 30}}>
        <div style={{fontFamily: F.display, fontSize: 80, color: C.red}}>NOTE ✗</div>
      </Show>
      <Show at={word('L10', 'cheezein', -4)} style={{left: 170, top: 800, zIndex: 30}}>
        <div style={{display: 'flex', gap: 26, alignItems: 'flex-end'}}>
          <Mango s={1.4} /><House s={0.9} /><Mango s={1.1} />
        </div>
        <div style={{fontFamily: F.display, fontSize: 64, marginTop: 16}}><HL at={word('L10', 'cheezein', 0)}>CHEEZEIN</HL></div>
      </Show>
      <Show at={word('L10', 'kaam', -4)} style={{left: 620, top: 800, zIndex: 30}}>
        <div style={{display: 'flex', gap: 10}}><Person s={1.1} /><Person s={1.1} color={C.yellow} /></div>
        <div style={{fontFamily: F.display, fontSize: 64, marginTop: 16}}>+ <HL at={word('L10', 'kaam', 0)}>KAAM</HL></div>
      </Show>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- zimbabwe */

const Zim: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l12 = at('L12'), l13 = at('L13');
  const dbl = word('L12', 'dugne', -6);
  return (
    <AbsoluteFill>
      {/* L11: newspaper clipping, 2008 */}
      <Card id="clip" x={90} y={420} w={900} h={800} rot={-1.2} at={0} out={l12} enter="up" bg={C.newsprint} texture="news" torn={{top: true, bottom: true, right: true}} rough={12}>
        <div style={{padding: '34px 44px'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: C.inkSoft}}>DUNIYA · ARTHVYAVASTHA</div>
          <div style={{height: 3, background: C.ink, margin: '14px 0 18px'}} />
          <div style={{fontFamily: F.display, fontSize: 96, lineHeight: 0.95}}>ZIMBABWE: MEHNGAI BEKAABU</div>
          <div style={{display: 'flex', gap: 10, marginTop: 26}}>
            {[0, 1, 2].map((i) => <div key={i} style={{flex: 1, height: 160, backgroundImage: 'repeating-linear-gradient(180deg, rgba(20,20,20,0.35) 0 4px, transparent 4px 18px)'}} />)}
          </div>
        </div>
      </Card>
      <Card id="y2008" x={720} y={390} w={230} h={110} rot={5} at={word('L11', '2008', -4)} out={l12} bg={C.yellow} sfx={null}>
        <div style={{fontFamily: F.display, fontSize: 80, textAlign: 'center', marginTop: 8}}>2008</div>
      </Card>
      <Card id="infl" x={140} y={890} w={800} h={250} rot={1.5} at={word('L11', 'mehngai', -4)} out={l12} bg={C.paperLight}>
        <div style={{padding: '22px 36px'}}>
          <Label size={22}>Mehngai · saalana</Label>
          <div style={{fontFamily: F.display, fontSize: 130, lineHeight: 1, marginTop: 14, color: C.red, whiteSpace: 'nowrap'}}>
            {frame >= word('L11', '23', -6) ? <Count from={0} to={23} at={word('L11', '23', -6)} dur={14} fmt={(n) => `${Math.round(n)} CRORE %`} /> : '? %'}
          </div>
        </div>
      </Card>

      {/* L12: prices doubling every day */}
      <Card id="dbl" x={110} y={420} w={860} h={780} rot={-1} at={l12 - 2} out={l13} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'relative', padding: '30px 40px'}}><Label size={24}>Daam · har din</Label></div>
      </Card>
      {[0, 1, 2, 3].map((i) => {
        const t = dbl + i * 7;
        if (stepped(frame) < t || frame >= l13) return null;
        const hh = 70 * 2 ** i * ease(stepped(frame), t, t + 5);
        return (
          <React.Fragment key={i}>
            {i > 0 ? <Sfx at={t} name="pop" volume={0.3} /> : null}
            <div style={{position: 'absolute', left: 190 + i * 190, top: 1110 - hh, width: 130, height: hh, background: i === 3 ? C.red : C.yellow, border: `4px solid ${C.ink}`, boxShadow: `5px 8px 10px ${C.shadow}`, zIndex: 20}} />
            {i > 0 ? <div style={{position: 'absolute', left: 190 + i * 190, top: 1110 - hh - 70, width: 130, textAlign: 'center', fontFamily: F.display, fontSize: 56, zIndex: 21}}>×2</div> : null}
          </React.Fragment>
        );
      })}
      <Show at={dbl} out={l13} style={{left: 160, top: 1120, zIndex: 22}}>
        <div style={{width: 760, height: 6, background: C.ink}} />
      </Show>
      <Hand x={150} y={540} at={word('L12', 'dugne', 4)} out={l13} size={64} rot={-3}>roz dugne!</Hand>

      {/* L13: the currency was abandoned */}
      <Photo id="zim2" src="zim_note.jpg" x={110} y={500} w={860} h={427} rot={2} at={l13} enter="drop" torn={{left: true, top: true}} rough={12} zoom={0.02} />
      <Cross id="zx" x={150} y={530} w={780} h={370} at={word('L13', 'chhodni', -2)} />
      <Stamp id="khatam" text="Currency khatam" x={540} y={1060} at={word('L13', 'padi', -4)} size={56} rot={-6} />
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------- balance */

const Balance: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l15 = at('L15'), l16 = at('L16');
  const goodsAt = word('L15', 'badhti', -4);
  const moneyAt = word('L15', 'paisa', -2);
  const goods = 2 + Math.floor(prog(frame, goodsAt, goodsAt + 14) * 3);
  const money = 2 + Math.floor(prog(frame, moneyAt, moneyAt + 14) * 3);
  const tilt = frame < goodsAt ? 0 : frame < moneyAt ? 8 * prog(frame, goodsAt, goodsAt + 10) : 8 - 8 * prog(frame, moneyAt, moneyAt + 14);
  return (
    <AbsoluteFill>
      {/* L14: is printing always wrong? No. */}
      <div style={{position: 'absolute', left: 110, top: 450, width: 860}}>
        {frame < l15 ? <Big words={['TOH', 'NOTE', 'CHHAPNA', 'HAMESHA', 'GALAT?']} at={2} gap={4} size={130} /> : null}
      </div>
      <Stamp id="nahi" text="Nahi" x={700} y={1000} at={word('L14', 'nahi', -2)} out={l15} size={130} rot={-8} color={C.ink} paper />

      {/* L15: economy grows, money grows a little: balance */}
      {frame >= l15 - 2 && frame < l16 ? (
        <Scale x={540} y={680} tilt={tilt}
          left={Array.from({length: money}).map((_, i) => <MiniNote key={i} w={110} h={52} rot={i % 2 ? 4 : -4} />)}
          right={Array.from({length: goods}).map((_, i) => (i % 2 ? <House key={i} s={0.5} /> : <Mango key={i} s={0.8} />))}
          leftLabel="PAISA" rightLabel="CHEEZEIN" />
      ) : null}
      <Show at={l15} out={l16} style={{left: 110, top: 430}}><Label size={26}>Economy badhi →</Label></Show>
      <Hand x={150} y={1130} at={word('L15', 'thoda', -2)} out={l16} size={56} rot={-3}>paisa bhi, thoda sa</Hand>
      <Stamp id="bal" text="Balance ✓" x={760} y={1140} at={word('L15', 'balance', -2)} out={l16} size={72} rot={-6} color={C.ink} paper />

      {/* L16: RBI keeps inflation around 4% */}
      <Card id="rbi" x={150} y={460} w={780} h={700} rot={-1.2} at={l16} enter="drop" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'relative', padding: '40px 50px'}}>
          <Label size={26}>RBI ka kaam</Label>
          <div style={{fontFamily: F.display, fontSize: 88, lineHeight: 1, marginTop: 30}}>MEHNGAI KO RAKHO</div>
          <div style={{fontFamily: F.display, fontSize: 260, lineHeight: 1, marginTop: 40}}>
            {frame >= word('L16', '4%', -8) ? <HL at={word('L16', '4%', 0)}>~<Count from={0} to={4} at={word('L16', '4%', -8)} dur={8} fmt={(n) => `${Math.round(n)}%`} /></HL> : <span style={{color: C.grey}}>? %</span>}
          </div>
        </div>
      </Card>
      <Tape id="rbt" x={470} y={440} w={150} rot={-4} at={l16 + 2} />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- outro */

const Outro: React.FC = () => (
  <AbsoluteFill>
    <SignOff share="L17" sign="L18" who="us dost ko jo poochta hai note kyun nahi chhaapte →"
      note={<>ZIMBABWE: ~231 MILLION % INFLATION (JULY 2008) · RBI TARGET 4% ±2%</>} />
  </AbsoluteFill>
);

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  village: Village,
  real: Real,
  zim: Zim,
  balance: Balance,
  outro: Outro,
};
