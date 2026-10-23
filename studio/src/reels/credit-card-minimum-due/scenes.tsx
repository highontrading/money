import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Big, Card, Circle, Count, Cross, Hand, HL, Label, Marker, Photo, Sfx, Stamp, Tape} from '../../components/paper';
import {ease, pop, stepped} from '../../lib/motion';
import {useCues} from '../../lib/timeline';
import {C, F} from '../../theme';
import {SignOff} from '../common';
import {CreditCard, grid, Row, Typed} from './props';

// ---------------------------------------------------------------- hook
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l2 = at('L02'), l4 = at('L04'), l5 = at('L05'), l6 = at('L06');
  return (
    <AbsoluteFill>
      {/* L01: Diwali sale, card swipe, ₹50,000 */}
      <Photo id="crowd" src="crowd.jpg" x={80} y={410} w={920} h={560} rot={-2} at={0} enter="up" out={l2} torn={{top: true, bottom: true}} rough={14} pos="50% 55%" zoom={0.06} />
      <Card id="sale" x={540} y={380} w={420} h={130} rot={4} at={word('L01', 'diwali', -2)} out={l2} bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 78, textAlign: 'center', marginTop: 18, letterSpacing: 2}}>DIWALI SALE</div>
      </Card>
      <Tape id="tsale" x={690} y={366} w={130} rot={-10} at={word('L01', 'diwali')} out={l2} />
      <CreditCard id="cc1" x={110} y={800} w={540} h={330} rot={-7} at={word('L01', 'card', -3)} out={l2} enter="left" />
      <Card id="chit" x={600} y={860} w={360} h={280} rot={4} at={word('L01', '50,000', -3)} out={l2} bg={C.card} torn={{bottom: true}}>
        <div style={{padding: '30px 30px'}}>
          <Label size={22}>Total shopping</Label>
          <div style={{fontFamily: F.display, fontSize: 100, marginTop: 18}}><HL at={word('L01', '50,000', 2)}>₹50,000</HL></div>
        </div>
      </Card>

      {/* L02-L03: the statement, minimum paid on time */}
      <Card id="stmt1" x={110} y={420} w={860} h={600} rot={-1.5} at={l2} out={l4} enter="right" bg={C.card}>
        <div style={{padding: '40px 50px'}}>
          <Label size={24}>Card statement · Nov</Label>
          <div style={{marginTop: 26}}>
            <Row label="TOTAL DUE" value="₹50,000" />
            <Row label={<HL at={word('L02', 'minimum')}>MINIMUM DUE</HL>} value={<HL at={word('L02', 'minimum')}>₹2,500</HL>} />
            <Row label="LATE FEE" value={<span style={{fontFamily: F.display}}>NAHI ✓</span>} show={frame >= word('L03', 'late', -2)} />
          </div>
        </div>
      </Card>
      <Stamp id="paid" text="Paid" sub="MINIMUM DUE · ON TIME" x={600} y={880} at={word('L02', 'bhara', -2)} out={l4} size={100} rot={-9} />
      <Hand x={150} y={1090} at={word('L03', 'theek', -4)} out={l4} size={74} rot={-4}>Sab theek?</Hand>

      {/* L04: next month's bill, a new charge */}
      <Card id="stmt2" x={110} y={420} w={860} h={560} rot={1.2} at={l4} out={l5} enter="right" bg={C.card}>
        <div style={{padding: '40px 50px'}}>
          <Label size={24}>Card statement · Dec</Label>
          <div style={{marginTop: 30}}>
            {[0.7, 0.55, 0.62].map((w, i) => (
              <div key={i} style={{display: 'flex', justifyContent: 'space-between', padding: '22px 0', borderBottom: `2px dashed ${C.grey}`}}>
                <div style={{width: `${w * 60}%`, height: 26, background: C.newsprint}} />
                <div style={{width: 140, height: 26, background: C.newsprint}} />
              </div>
            ))}
            <Row label="FINANCE CHARGES" value="₹ ? ? ?" size={44} show={frame >= word('L04', 'naya', -2)} style={{fontWeight: 700}} />
          </div>
        </div>
      </Card>
      <Sfx at={word('L04', 'naya', -2)} name="pop" volume={0.4} />
      <Circle id="newch" cx={540} cy={784} rx={430} ry={62} at={word('L04', 'charge', 2)} out={l5} />

      {/* L05: paid ₹2,500, charged ₹3,244 */}
      <Card id="paidt" x={110} y={420} w={860} h={330} rot={-2} at={word('L05', 'bhare', -6)} out={l6} enter="left" bg={C.card}>
        <div style={{padding: '36px 50px'}}>
          <Label size={24}>Aapne bhare</Label>
          <div style={{fontFamily: F.display, fontSize: 160, lineHeight: 1, marginTop: 20}}>₹2,500</div>
        </div>
      </Card>
      <Card id="chgt" x={110} y={790} w={860} h={380} rot={1.5} at={word('L05', 'bank', -4)} out={l6} enter="right" bg={C.yellow}>
        <div style={{padding: '36px 50px'}}>
          <Label size={24}>Bank ne lagaye</Label>
          <div style={{fontFamily: F.display, fontSize: 190, lineHeight: 1, marginTop: 20}}><Count from={0} to={3244} at={word('L05', '3,244', -2)} dur={16} /></div>
        </div>
      </Card>
      <Circle id="c3244" cx={420} cy={1065} rx={330} ry={110} at={word('L05', '3,244', 16)} out={l6} />

      {/* L06: the real game */}
      <div style={{position: 'absolute', left: 90, top: 470, width: 900}}>
        {frame >= l6 ? <Big words={['MINIMUM', 'DUE', 'KA']} at={word('L06', 'minimum', -2)} size={190} /> : null}
      </div>
      <Card id="khel" x={100} y={850} w={880} h={260} rot={-2.5} at={word('L06', 'asli', -3)} bg={C.yellow} torn={{top: true, right: true}} rough={14}>
        <div style={{fontFamily: F.display, fontSize: 200, textAlign: 'center', lineHeight: 1, marginTop: 24}}>ASLI KHEL</div>
      </Card>
      <Hand x={620} y={1120} at={word('L06', 'samjho', -2)} size={66} rot={-5}>samjho →</Hand>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- interest-free period
const Free: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l9 = at('L09');
  const band = ease(stepped(frame), word('L07', 'interest-free', -2), word('L07', 'interest-free', 18));
  // timeline geometry (absolute): line from x 180 to 900 at y 800
  const x0 = 180, x1 = 900, ly = 800;
  const pins: [number, string][] = [[x0, 'SHOPPING'], [(x0 + x1) / 2, 'STATEMENT'], [x1, 'DUE DATE']];
  return (
    <AbsoluteFill>
      <Card id="ftitle" x={130} y={420} w={820} h={130} rot={-1.5} at={0} out={l9} enter="drop" bg={C.paperLight}>
        <div style={{fontFamily: F.display, fontSize: 92, textAlign: 'center', marginTop: 16}}>INTEREST-FREE PERIOD</div>
      </Card>
      <Card id="fline" x={90} y={590} w={900} h={430} rot={0.8} at={4} out={l9} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid(40)}} />
      </Card>
      {frame >= 10 && frame < l9 + 8 ? (
        <>
          <div style={{position: 'absolute', left: x0, top: ly - 40, width: (x1 - x0) * band, height: 80, background: C.yellow, opacity: 0.95, transform: 'skewX(-4deg)'}} />
          <div style={{position: 'absolute', left: x0, top: ly - 3, width: x1 - x0, height: 6, background: C.ink}} />
          {pins.map(([x, t], i) => (
            <React.Fragment key={t}>
              <div style={{position: 'absolute', left: x - 14, top: ly - 14, width: 28, height: 28, borderRadius: 14, background: C.ink, transform: `scale(${Math.min(1, pop(frame, 10 + i * 6))})`}} />
              <div style={{position: 'absolute', left: x - 150, width: 300, top: i === 1 ? ly + 46 : ly - 110, textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 3, opacity: frame >= 12 + i * 6 ? 1 : 0}}>{t}</div>
            </React.Fragment>
          ))}
        </>
      ) : null}
      <Hand x={250} y={870} at={word('L08', '20', -4)} out={l9} size={84} rot={-3}>20 se 50 din</Hand>
      <Stamp id="zero" text="Zero interest" x={540} y={1130} at={word('L08', 'zero', -2)} out={l9} size={86} rot={-6} color={C.ink} />

      {/* L09: the condition */}
      <Card id="shart" x={120} y={430} w={840} h={720} rot={-1} at={l9} enter="up" bg={C.paperLight}>
        <div style={{position: 'absolute', inset: 0, ...grid(40)}} />
        <div style={{position: 'relative', padding: '50px 60px'}}>
          <Label size={26}>Ek shart</Label>
          {[['POORA BILL', 'poora'], ['TIME PE', 'time']].map(([t, k]) => (
            <div key={k} style={{display: 'flex', alignItems: 'center', gap: 40, marginTop: 70, opacity: frame >= word('L09', k, -4) ? 1 : 0}}>
              <div style={{width: 110, height: 110, border: `7px solid ${C.ink}`, background: C.card}} />
              <div style={{fontFamily: F.display, fontSize: 120}}>{t}</div>
            </div>
          ))}
        </div>
      </Card>
      <Marker id="tk1" d="M215,680 L250,730 L330,615" at={word('L09', 'poora', 4)} dur={6} color={C.ink} width={14} />
      <Marker id="tk2" d="M215,860 L250,910 L330,795" at={word('L09', 'time', 4)} dur={6} color={C.ink} width={14} />
      <Sfx at={word('L09', 'poora', 4)} name="marker" volume={0.3} />
      <Sfx at={word('L09', 'time', 4)} name="marker" volume={0.3} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- minimum due = 5%
const Mad: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l11 = at('L11'), l13 = at('L13');
  const five = word('L10', '5%', -2);
  const torn = word('L11', '2,500', -4);
  return (
    <AbsoluteFill>
      {/* L10: the bill as twenty strips; the last one is the minimum */}
      <Card id="billbar" x={110} y={420} w={400} h={800} rot={-1.5} at={0} out={l13} enter="up" bg={C.card}>
        <div style={{padding: '24px 28px'}}>
          <Label size={22}>Bill</Label>
          <div style={{fontFamily: F.display, fontSize: 72, marginTop: 6}}>₹50,000</div>
        </div>
        <div style={{position: 'absolute', left: 28, right: 28, top: 170, bottom: 28}}>
          {Array.from({length: 20}).map((_, i) => {
            const last = i === 19;
            const gone = last && frame >= torn;
            return <div key={i} style={{height: `${100 / 20}%`, borderTop: `2px dashed ${C.grey}`, background: last && frame >= five ? (gone ? 'transparent' : C.yellow) : C.paperLight, outline: gone ? `3px dashed ${C.red}` : undefined}} />;
          })}
        </div>
      </Card>
      <Hand x={560} y={1150} at={five + 4} out={l13} size={56} rot={-3}>← 20 mein se 1 hissa</Hand>
      <Card id="mad5" x={560} y={430} w={400} h={230} rot={2} at={five} out={l13} enter="right" bg={C.paperLight}>
        <div style={{padding: '26px 30px'}}>
          <Label size={22}>Minimum due</Label>
          <div style={{fontFamily: F.display, fontSize: 120, lineHeight: 1, marginTop: 14}}>= 5%</div>
        </div>
      </Card>

      {/* L11: ₹50,000 ka 5% = ₹2,500, torn off */}
      <Card id="strip" x={560} y={700} w={400} h={190} rot={-3} at={torn} out={l13} enter="left" bg={C.yellow} torn={{left: true, right: true}} rough={10}>
        <div style={{fontFamily: F.display, fontSize: 130, textAlign: 'center', marginTop: 22}}>₹2,500</div>
      </Card>

      {/* L12: saves the late fee, not the interest */}
      <Card id="lf" x={560} y={920} w={400} h={100} rot={1} at={word('L12', 'late', -3)} out={l13} enter="right" bg={C.card} sfx="pop">
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 2, textAlign: 'center', marginTop: 30}}>LATE FEE: BACHI ✓</div>
      </Card>
      <Card id="intn" x={560} y={1036} w={400} h={100} rot={-1} at={word('L12', 'interest', -3)} out={l13} enter="right" bg={C.card} sfx="pop">
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 2, textAlign: 'center', marginTop: 30}}>INTEREST: BACHA?</div>
      </Card>
      <Cross id="xint" x={590} y={1048} w={340} h={76} at={word('L12', 'nahi', -2)} out={l13} />

      {/* L13: the free period ends */}
      <Card id="ifp" x={100} y={560} w={880} h={300} rot={-2} at={l13} enter="drop" bg={C.yellow} torn={{top: true, bottom: true}} rough={12}>
        <div style={{fontFamily: F.display, fontSize: 116, textAlign: 'center', lineHeight: 1.02, marginTop: 34}}>INTEREST-FREE<br />PERIOD</div>
      </Card>
      <Hand x={140} y={460} at={word('L13', 'poora', -2)} size={60} rot={-3}>poora bill nahi bhara?</Hand>
      <Cross id="xifp" x={150} y={590} w={780} h={240} at={word('L13', 'bhara', 0)} />
      <Stamp id="khatam" text="Khatam" x={560} y={1010} at={word('L13', 'khatam', -2)} size={130} rot={-8} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- how the interest is calculated
const OCT = Array.from({length: 17}, (_, i) => [15 + i, 'OCT'] as const);
const NOV = Array.from({length: 19}, (_, i) => [1 + i, 'NOV'] as const);
const DAYS = [...OCT, ...NOV]; // 15 Oct .. 19 Nov = 36 days of interest

const Interest: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l15 = at('L15'), l16 = at('L16'), l17 = at('L17'), l19 = at('L19');
  const fill = word('L18', '36', -4);
  const sweep = ease(stepped(frame), word('L14', 'poore', -2), word('L14', 'poore', 14));
  const meter = ease(stepped(frame), word('L15', 'din', 0), word('L15', 'din', 22));
  return (
    <AbsoluteFill>
      {/* L14: interest on the whole ₹50,000, not just the rest */}
      <div style={{position: 'absolute', left: 110, top: 430}}>{frame < l15 + 10 ? <Label size={28}>Ab interest lagta hai</Label> : null}</div>
      <Card id="full" x={100} y={520} w={880} h={220} rot={-1} at={0} out={l15} enter="left" bg={C.card}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${sweep * 100}%`, background: C.yellow}} />
        <div style={{position: 'relative', fontFamily: F.display, fontSize: 130, textAlign: 'center', marginTop: 34}}>POORE ₹50,000</div>
      </Card>
      <Hand x={640} y={760} at={word('L14', 'poore', 10)} out={l15} size={60} rot={-4}>↑ yahan</Hand>
      <Card id="rest" x={220} y={880} w={640} h={180} rot={2} at={word('L14', 'sirf', -4)} out={l15} enter="right" bg={C.paperLight}>
        <div style={{fontFamily: F.display, fontSize: 100, textAlign: 'center', marginTop: 34, color: C.inkSoft}}>SIRF BAAKI PE?</div>
      </Card>
      <Cross id="xrest" x={250} y={900} w={580} h={140} at={word('L14', 'nahi', -2)} out={l15} />

      {/* L15: from the shopping day, not the due date */}
      <Card id="tl15" x={90} y={460} w={900} h={620} rot={0.8} at={l15} out={l16} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid(40)}} />
        <div style={{position: 'relative', padding: '36px 44px'}}>
          <Label size={24}>Interest kab se?</Label>
        </div>
      </Card>
      {frame >= l15 + 6 && frame < l16 + 8 ? (
        <>
          <div style={{position: 'absolute', left: 190, top: 760, width: 700 * meter, height: 70, background: C.red, opacity: 0.85}} />
          <div style={{position: 'absolute', left: 190, top: 792, width: 700, height: 6, background: C.ink}} />
          <div style={{position: 'absolute', left: 140, width: 260, top: 640, fontFamily: F.mono, fontWeight: 700, fontSize: 28, letterSpacing: 2, textAlign: 'center', lineHeight: 1.3}}>SHOPPING<br />KA DIN</div>
          <div style={{position: 'absolute', left: 740, width: 260, top: 640, fontFamily: F.mono, fontWeight: 700, fontSize: 28, letterSpacing: 2, textAlign: 'center', lineHeight: 1.3}}>DUE<br />DATE</div>
          <div style={{position: 'absolute', left: 176, top: 781, width: 28, height: 28, borderRadius: 14, background: C.ink}} />
          <div style={{position: 'absolute', left: 876, top: 781, width: 28, height: 28, borderRadius: 14, background: C.ink}} />
        </>
      ) : null}
      <Hand x={170} y={880} at={word('L15', 'din', 4)} out={l16} size={60} rot={-3}>↑ interest yahin se shuru</Hand>
      <Cross id="xdue" x={770} y={640} w={200} h={90} at={word('L15', 'nahi', -2)} out={l16} />

      {/* L16: the rate */}
      <Card id="rate" x={110} y={440} w={860} h={380} rot={-1.5} at={l16} out={l17} enter="right" bg={C.card}>
        <div style={{padding: '36px 50px'}}>
          <Label size={24}>Rate</Label>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 24, marginTop: 10}}>
            <div style={{fontFamily: F.display, fontSize: 210, lineHeight: 1}}>{frame >= word('L16', '3.6', -2) ? <Count from={0} to={3.6} at={word('L16', '3.6', -2)} dur={12} fmt={(n) => n.toFixed(1) + '%'} /> : ' '}</div>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 40, letterSpacing: 3}}>/ MAHINA</div>
          </div>
        </div>
      </Card>
      <Card id="rate43" x={150} y={870} w={780} h={300} rot={2} at={word('L16', '43', -4)} out={l17} enter="drop" bg={C.yellow}>
        <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 24, marginTop: 40}}>
          <div style={{fontFamily: F.display, fontSize: 200, lineHeight: 1}}>43%</div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 40, letterSpacing: 3}}>/ SAAL</div>
        </div>
      </Card>
      <Circle id="c43" cx={470} cy={1010} rx={225} ry={125} at={word('L16', '43', 10)} out={l17} />

      {/* L17-L18: the calendar, 15 Oct to 20 Nov = 36 days */}
      <Card id="cal" x={90} y={420} w={900} h={640} rot={-0.8} at={l17} out={l19} enter="up" bg={C.card}>
        <div style={{padding: '30px 34px 0'}}>
          <Label size={22}>Interest ke din</Label>
        </div>
        <div style={{position: 'absolute', left: 31, top: 120, display: 'grid', gridTemplateColumns: 'repeat(9, 86px)', gap: '12px 8px'}}>
          {DAYS.map(([d, m], i) => {
            const on = stepped(frame) >= fill + i;
            const first = i === 0 && frame >= word('L17', '15', -2);
            return (
              <div key={i} style={{width: 86, height: 104, border: `3px solid ${C.ink}`, background: on || first ? C.yellow : C.paperLight, textAlign: 'center', paddingTop: 12}}>
                <div style={{fontFamily: F.display, fontSize: 46, lineHeight: 1}}>{d}</div>
                <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 16, letterSpacing: 2, marginTop: 6}}>{m}</div>
              </div>
            );
          })}
        </div>
      </Card>
      <Circle id="c15" cx={165} cy={595} rx={70} ry={78} at={word('L17', '15', 0)} out={fill} />
      <Card id="due20" x={700} y={1000} w={260} h={100} rot={4} at={word('L17', '20', -4)} out={l19} bg={C.paperLight} style={{border: `5px solid ${C.red}`}}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, color: C.red, textAlign: 'center', marginTop: 12}}>DUE DATE</div>
        <div style={{fontFamily: F.display, fontSize: 44, textAlign: 'center', color: C.red}}>20 NOV</div>
      </Card>
      <Card id="d36" x={110} y={1000} w={300} h={100} rot={-3} at={fill + 6} out={l19} bg={C.ink} texture="kraft" sfx="pop">
        <div style={{fontFamily: F.display, fontSize: 66, textAlign: 'center', marginTop: 10, color: C.paperLight}}>36 DIN</div>
      </Card>
      <Card id="r1" x={110} y={1112} w={860} h={120} rot={1} at={word('L18', '2,130', -4)} out={l19} enter="up" bg={C.card}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', padding: '0 40px'}}>
          <div style={{fontFamily: F.type, fontSize: 38}}>₹50,000 × 36 din</div>
          <div style={{fontFamily: F.display, fontSize: 86}}><HL at={word('L18', '2,130', 2)}>₹2,130</HL></div>
        </div>
      </Card>

      {/* L19: then on the remaining ₹47,500 until the next statement */}
      <Receipt at={l19} enter="up" show2={word('L19', '47,500', -4)} amt2={word('L19', '618', -4)} />
    </AbsoluteFill>
  );
};

// The interest receipt, carried from the interest scene into the GST scene.
const Receipt: React.FC<{at: number; enter: 'up' | 'none'; show2: number; amt2: number; gst?: number; total?: number; out?: number}> = ({at, enter, show2, amt2, gst, total, out}) => {
  const frame = useCurrentFrame();
  return (
    <Card id="receipt" x={130} y={420} w={820} h={780} rot={-1} at={at} out={out} enter={enter} bg={C.card} torn={{bottom: true, top: true}} rough={9}>
      <div style={{padding: '50px 54px', fontFamily: F.type}}>
        <Label size={22}>Interest ka hisaab</Label>
        <Row label="₹50,000 · 36 din" value={<b style={{fontFamily: F.display, fontSize: 64}}>₹2,130</b>} size={44} style={{marginTop: 30, padding: '22px 0'}} />
        <Row label="₹47,500 · statement tak" value={frame >= amt2 ? <b style={{fontFamily: F.display, fontSize: 64}}>₹618</b> : ''} size={44} show={frame >= show2} style={{padding: '22px 0'}} />
        <Row label="+ interest pe GST" value={<b style={{fontFamily: F.display, fontSize: 64}}>18%</b>} size={44} show={gst !== undefined && frame >= gst} style={{padding: '22px 0'}} />
        {total !== undefined && frame >= total ? (
          <div style={{marginTop: 30, borderTop: `6px solid ${C.ink}`, paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
            <span style={{fontFamily: F.display, fontSize: 80}}>TOTAL</span>
            <span style={{fontFamily: F.display, fontSize: 130}}><HL at={total + 14}><Count from={2748} to={3244} at={total} dur={12} /></HL></span>
          </div>
        ) : null}
      </div>
    </Card>
  );
};

// ---------------------------------------------------------------- GST on top
const Gst: React.FC = () => {
  const {at, word} = useCues();
  return (
    <AbsoluteFill>
      <Receipt at={0} enter="none" show2={0} amt2={0} gst={word('L20', '18', -4)} total={word('L21', '3,244', -2)} />
      <Sfx at={word('L20', '18', -4)} name="pop" volume={0.4} />
      <Stamp id="mink" text="Minimum ki keemat" sub="SIRF EK MAHINA" x={540} y={1120} at={word('L21', 'keemat', -2)} size={76} rot={-7} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- new spends: no free period
const Trap: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l23 = at('L23');
  return (
    <AbsoluteFill>
      {/* L22 */}
      <CreditCard id="cc2" x={110} y={450} w={500} h={310} rot={-5} at={0} out={l23} enter="left" />
      <Card id="newspend" x={600} y={470} w={360} h={260} rot={4} at={word('L22', 'naya', -2)} out={l23} bg={C.paperLight} torn={{bottom: true}}>
        <div style={{padding: '30px 30px'}}>
          <Label size={22}>Swipe</Label>
          <div style={{fontFamily: F.display, fontSize: 76, lineHeight: 1, marginTop: 20}}>NAYA<br />KHARCHA</div>
        </div>
      </Card>
      <Card id="fp" x={160} y={860} w={760} h={190} rot={-1.5} at={word('L22', 'free', -4)} out={l23} enter="drop" bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 120, textAlign: 'center', marginTop: 26}}>FREE PERIOD</div>
      </Card>
      <Cross id="xfp" x={190} y={880} w={700} h={150} at={word('L22', 'nahi', -2)} out={l23} />

      {/* L23: old bill not cleared -> every swipe pays from day one */}
      <Card id="old" x={90} y={440} w={420} h={330} rot={-2} at={l23} enter="left" bg={C.card}>
        <div style={{padding: '30px 34px'}}>
          <Label size={22}>Purana bill</Label>
          <div style={{fontFamily: F.display, fontSize: 84, lineHeight: 1.05, marginTop: 20}}>POORA<br />CLEAR?</div>
        </div>
      </Card>
      <Stamp id="nahi" text="Nahi" x={300} y={800} at={word('L23', 'clear', 2)} size={96} rot={-10} />
      {[0, 1, 2].map((i) => (
        <React.Fragment key={i}>
          <Card id={'sw' + i} x={560} y={440 + i * 260} w={400} h={220} rot={[3, -2, 2][i]} at={word('L23', 'swipe', -4 + i * 5)} enter="right" bg={C.paperLight} torn={{bottom: true}}>
            <div style={{padding: '24px 28px'}}>
              <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3}}>SWIPE #{i + 1}</div>
              <div style={{fontFamily: F.display, fontSize: 52, marginTop: 12, opacity: stepped(frame) >= word('L23', 'pehle', -2 + i * 3) ? 1 : 0}}>DAY 1 SE<br />INTEREST</div>
            </div>
          </Card>
        </React.Fragment>
      ))}
      {[0, 1, 2].map((i) => (
        <Marker key={i} id={'ul' + i} d={`M600,${632 + i * 260} L860,${628 + i * 260}`} at={word('L23', 'interest', -4 + i * 3)} dur={5} color={C.red} width={7} />
      ))}
      <Hand x={120} y={930} at={word('L23', 'har', -2)} size={58} rot={-4} w={420}>har swipe pe →</Hand>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- paying only the minimum, for years
const Years: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l25 = at('L25'), l27 = at('L27');
  const slipsAt = word('L25', 'phir', -2);
  const slipsEnd = word('L25', '20', 0);
  const nSlips = 120;
  const shown = Math.floor(ease(stepped(frame), slipsAt, slipsEnd, 0, nSlips));
  return (
    <AbsoluteFill>
      {/* L24 */}
      <div style={{position: 'absolute', left: 90, top: 560, width: 900}}>
        {frame < l25 + 4 ? <Big words={['SIRF', 'MINIMUM?']} at={word('L24', 'sirf', -2)} size={200} align="center" /> : null}
      </div>
      <Hand x={330} y={460} at={word('L24', 'har', -2)} out={l25} size={64} rot={-3}>har mahine...</Hand>

      {/* L25: no new spending, still 20+ years of slips */}
      <Card id="nk" x={110} y={420} w={500} h={100} rot={-2} at={word('L25', 'naya', -2)} out={l27} enter="left" bg={C.paperLight}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 2, textAlign: 'center', marginTop: 30}}>NAYA KHARCHA: ZERO</div>
      </Card>
      <Card id="slips" x={90} y={540} w={900} h={520} rot={0.6} at={word('L25', 'naya', 6)} out={l27} enter="up" bg={C.card}>
        <div style={{position: 'absolute', left: 30, top: 24, fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2}}>HAR MAHINE KA MINIMUM ↓</div>
        <div style={{position: 'absolute', left: 30, top: 70, display: 'grid', gridTemplateColumns: 'repeat(15, 50px)', gap: '10px 5px'}}>
          {Array.from({length: nSlips}).map((_, i) => (
            <div key={i} style={{width: 50, height: 46, background: i < shown ? C.yellow : 'transparent', border: i < shown ? `2px solid ${C.ink}` : `2px dashed ${C.newsprint}`, fontFamily: F.mono, fontSize: 12, fontWeight: 700, textAlign: 'center', lineHeight: '42px'}}>{i < shown ? 'MIN' : ''}</div>
          ))}
        </div>
      </Card>
      <Card id="yrs" x={100} y={1080} w={430} h={150} rot={-2} at={word('L25', '20', -4)} out={l27} enter="drop" bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 96, textAlign: 'center', marginTop: 20}}>20+ SAAL</div>
      </Card>

      {/* L26: total paid */}
      <Card id="tot" x={550} y={1070} w={430} h={160} rot={2} at={word('L26', '2.5', -4)} out={l27} enter="right" bg={C.ink} texture="kraft">
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, color: C.paperLight, textAlign: 'center', marginTop: 14}}>TOTAL BHAROGE</div>
        <div style={{fontFamily: F.display, fontSize: 80, textAlign: 'center', color: C.yellow, lineHeight: 1.1}}>₹2.5 LAKH+</div>
      </Card>

      {/* L27: the RBI-mandated warning on the statement */}
      <Card id="warn" x={100} y={430} w={880} h={680} rot={-1} at={l27} enter="up" bg={C.paperLight}>
        <div style={{padding: '44px 54px'}}>
          <Label size={22}>Har card statement pe</Label>
          <div style={{fontFamily: F.type, fontSize: 40, lineHeight: 1.45, marginTop: 30}}>
            <Typed at={word('L27', 'bill', 0)} cps={3.2} text={'"Making only the minimum payment every month would result in the repayment stretching over months / years with consequential compounded interest payment on your outstanding balance."'} />
          </div>
        </div>
      </Card>
      <Stamp id="warnst" text="Warning" sub="RBI KA NIYAM" x={720} y={1110} at={word('L27', 'warning', -2)} size={84} rot={-8} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- what to do
const FIX: {n: string; t: string; sub: string; line: string; needle: string}[] = [
  {n: '01', t: 'POORA BILL BHARO', sub: 'HAMESHA', line: 'L28', needle: 'poora'},
  {n: '02', t: 'KHARCHA ROKO', sub: 'PEHLE BILL CLEAR', line: 'L29', needle: 'roko'},
  {n: '03', t: 'EMI / PERSONAL LOAN', sub: '43% SE KAAFI SASTA', line: 'L30', needle: 'emi'},
  {n: '04', t: 'AUTO-DEBIT: TOTAL DUE', sub: 'MINIMUM PE NAHI', line: 'L31', needle: 'auto-debit'},
];

const Fix: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  return (
    <AbsoluteFill>
      <Card id="list" x={90} y={420} w={900} h={810} rot={-0.8} at={0} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid(45)}} />
        {frame < word('L28', 'poora', -2) ? (
          <div style={{position: 'absolute', left: 50, top: 60, fontFamily: F.display, fontSize: 110}}>KARNA KYA HAI?</div>
        ) : null}
      </Card>
      {FIX.map((r, i) => {
        const t = word(r.line, r.needle, -3);
        const sub = r.line === 'L30' ? word('L30', 'sasta', -4) : r.line === 'L28' ? word('L28', 'hamesha', -3) : r.line === 'L31' ? word('L31', 'minimum', -3) : t + 10;
        return (
          <Card key={r.n} id={'fx' + i} x={130} y={450 + i * 192} w={820} h={170} rot={[-1, 1, -0.5, 1.2][i]} at={t} enter={i % 2 ? 'right' : 'left'} bg={r.line === 'L31' ? C.yellow : C.paperLight}>
            <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 34px', gap: 28}}>
              <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 40, color: C.inkSoft}}>{r.n}</div>
              <div>
                <div style={{fontFamily: F.display, fontSize: r.t.length > 18 ? 66 : 76, lineHeight: 1}}>{r.t}</div>
                <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 3, marginTop: 10, opacity: frame >= sub ? 1 : 0, color: r.line === 'L31' ? C.red : C.ink}}>{r.sub}</div>
              </div>
            </div>
          </Card>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- outro
const Outro: React.FC = () => (
  <AbsoluteFill>
    <SignOff share="L32" sign="L33" who="us dost ko jo hamesha minimum due bharta hai →" note={<>ILLUSTRATIVE: 3.6%/MONTH, 18% GST, 5% MIN DUE · RATES VARY BY BANK<br />RBI CREDIT CARD DIRECTIONS 2022</>} />
  </AbsoluteFill>
);

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  free: Free,
  mad: Mad,
  interest: Interest,
  gst: Gst,
  trap: Trap,
  years: Years,
  fix: Fix,
  outro: Outro,
};
