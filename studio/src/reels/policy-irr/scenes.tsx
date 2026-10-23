import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Big, Card, Circle, Count, Cross, Hand, HL, Label, Marker, Sfx, Stamp, Tape} from '../../components/paper';
import {ease, pop, stepped} from '../../lib/motion';
import {useCues} from '../../lib/timeline';
import {C, F} from '../../theme';
import {SignOff} from '../common';

// Illustrative traditional endowment policy: ₹50,000 a year for 20 years,
// ₹15 lakh at maturity -> IRR 3.7%. Same flows at 7% -> ₹21.9 lakh.

const grid = (cell = 40, color = 'rgba(70, 110, 150, 0.16)') => ({
  backgroundImage: `linear-gradient(${color} 1.5px, transparent 1.5px), linear-gradient(90deg, ${color} 1.5px, transparent 1.5px)`,
  backgroundSize: `${cell}px ${cell}px`,
});

const pct = (n: number) => n.toFixed(1) + '%';
const lakh = (n: number) => '₹' + n.toFixed(1) + ' L';

// ------------------------------------------------------------------ hook

const Hook: React.FC = () => {
  const {at, word} = useCues();
  const l5 = at('L05');
  return (
    <AbsoluteFill>
      {/* L01: the glossy brochure */}
      <Card id="bro" x={100} y={410} w={880} h={800} rot={-1.5} at={0} enter="up" bg={C.card}>
        <div style={{height: 150, background: C.ink, color: C.paperLight, padding: '26px 44px'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 4, opacity: 0.8}}>TRADITIONAL ENDOWMENT PLAN</div>
          <div style={{fontFamily: F.display, fontSize: 72, letterSpacing: 2, marginTop: 6}}>GUARANTEED* SURAKSHA</div>
        </div>
        <div style={{padding: '34px 44px'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 3, color: C.inkSoft}}>PREMIUM · HAR SAAL</div>
          <div style={{fontFamily: F.display, fontSize: 130, lineHeight: 1, marginTop: 8, whiteSpace: 'nowrap'}}>
            <HL at={word('L01', '50,000')}>₹50,000</HL>
            <Appear at={word('L01', '20', -2)}><span style={{fontSize: 64, marginLeft: 20}}>× 20 SAAL</span></Appear>
          </div>
        </div>
      </Card>
      <Tape id="bt" x={430} y={392} w={170} rot={-4} at={2} />

      {/* L02: total in, maturity out */}
      <Card id="tot" x={150} y={800} w={460} h={150} rot={1.5} at={word('L02', 'total', -2)} enter="left" bg={C.paperLight}>
        <div style={{padding: '18px 30px'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: C.inkSoft}}>AAP BHAROGE</div>
          <div style={{fontFamily: F.display, fontSize: 80, lineHeight: 1.05}}>₹10 LAKH</div>
        </div>
      </Card>
      <Card id="mat" x={560} y={760} w={390} h={280} rot={6} at={word('L02', '15', -3)} bg={C.yellow} torn={{top: true, right: true}} rough={12}>
        <div style={{padding: '22px 26px', textAlign: 'center'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3}}>MATURITY PE</div>
          <div style={{fontFamily: F.display, fontSize: 120, lineHeight: 1}}>₹15</div>
          <div style={{fontFamily: F.display, fontSize: 64, lineHeight: 1}}>LAKH!</div>
        </div>
      </Card>

      {/* L03: the extras */}
      <div style={{position: 'absolute', left: 150, top: 990, display: 'flex', flexDirection: 'column', gap: 14}}>
        {[['✓ LIFE COVER', 'life'], ['✓ TAX-FREE', 'tax']].map(([t, k]) => {
          const a = word('L03', k, -2);
          return <ChipPop key={k} at={a} text={t} />;
        })}
      </div>

      {/* L04: +50% — deal? */}
      <Hand x={745} y={1065} at={word('L04', '50', -2)} out={l5} size={72} rot={-5} color={C.ink}>+50% !!</Hand>
      <Stamp id="deal" text="Deal pakki?" x={560} y={1150} at={word('L04', 'deal', -2)} out={l5} size={70} rot={-5} color={C.ink} paper />

      {/* L05: wait — less than an FD */}
      <Cross id="mx" x={590} y={790} w={330} h={220} at={l5 + 2} />
      <Circle id="mc" cx={755} cy={900} rx={230} ry={170} at={word('L05', '15', -2)} />
      <Stamp id="fd" text="FD se bhi kam" x={560} y={1150} at={word('L05', 'fd', -2)} size={84} rot={-5} paper />
    </AbsoluteFill>
  );
};

const ChipPop: React.FC<{at: number; text: string}> = ({at, text}) => {
  const frame = useCurrentFrame();
  if (stepped(frame) < at) return null;
  const p = Math.min(1.05, pop(frame, at));
  return (
    <div style={{transform: `scale(${0.6 + 0.4 * p}) rotate(-2deg)`, transformOrigin: 'left center'}}>
      <Sfx at={at} name="pop" volume={0.3} />
      <Label size={34}>{text}</Label>
    </div>
  );
};

// ------------------------------------------------------------------ time

// 20 premium strips: the one paid in year k works from k to the end of year 20.
const X0 = 150, X1 = 930;
const yx = (y: number) => X0 + (y / 20) * (X1 - X0);
const ROW0 = 580, ROWH = 29;

const Strip: React.FC<{k: number; at: number; hi?: boolean}> = ({k, at, hi}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at) return null;
  const p = ease(f, at, at + 8);
  const x = yx(k), w = (yx(20) - x) * p;
  return (
    <div style={{position: 'absolute', left: x, top: ROW0 + k * ROWH, width: w, height: ROWH - 7, background: hi ? C.yellow : C.card, border: `2px solid ${C.ink}`, boxShadow: `3px 4px 5px ${C.shadow}`, transform: `rotate(${((k % 3) - 1) * 0.2}deg)`}} />
  );
};

const Time: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l7 = at('L07'), l8 = at('L08'), l9 = at('L09');
  const fill = word('L08', 'sirf', 0);
  return (
    <AbsoluteFill>
      {/* L06: everybody just adds it up */}
      <div style={{position: 'absolute', left: 110, top: 420, width: 860}}>
        {frame < l7 ? <Big words={['SEEDHA', 'JODNA?']} at={word('L06', 'galti', -2)} size={120} /> : null}
      </div>
      {Array.from({length: 20}).map((_, i) => (
        <Card key={i} id={'slip' + i} x={120 + (i % 5) * 170} y={600 + Math.floor(i / 5) * 120} w={150} h={96} rot={((i * 7) % 5) - 2} at={word('L06', 'paise', -4) + i} out={l7} enter="drop" sfx={i % 5 ? null : 'drop'} bg={i === 0 ? C.yellow : C.paperLight}>
          <div style={{fontFamily: F.display, fontSize: 40, textAlign: 'center', marginTop: 22}}>₹50K</div>
        </Card>
      ))}
      <Hand x={420} y={1090} at={word('L06', 'jod', -2)} out={l7} size={80} rot={-3}>= ₹10 lakh</Hand>

      {/* L07-L09: each premium works a different number of years */}
      {frame >= l7 ? (
        <>
          <div style={{position: 'absolute', left: 110, top: 410, width: 860, fontFamily: F.display, fontSize: 58, lineHeight: 1.02}}>HAR ₹50,000 KITNE SAAL KAAM KARTA HAI?</div>
          <div style={{position: 'absolute', left: X0, top: 545, width: X1 - X0, display: 'flex', justifyContent: 'space-between', fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: 1, color: C.inkSoft}}>
            {['SAAL 1', '5', '10', '15', '20'].map((t) => <span key={t}>{t}</span>)}
          </div>
          <div style={{position: 'absolute', left: X0, top: 575, width: 2, height: 20 * ROWH + 10, background: C.ink, opacity: 0.4}} />
          <div style={{position: 'absolute', left: X1, top: 575, width: 2, height: 20 * ROWH + 10, background: C.ink, opacity: 0.4}} />
        </>
      ) : null}
      <Strip k={0} at={word('L07', 'pehla', 0)} hi />
      <Hand x={170} y={612} at={word('L07', '20', -2)} out={fill} size={46} rot={-1}>↑ pehla ₹50,000: poore 20 saal</Hand>
      <Strip k={19} at={word('L08', 'aakhri', 0)} hi />
      <Hand x={430} y={1150} at={word('L08', 'ek', -2)} out={l9} size={46} rot={-2}>aakhri: 1 saal →</Hand>
      {Array.from({length: 18}).map((_, i) => <Strip key={i} k={i + 1} at={fill + i} />)}
      <Sfx at={fill} name="slide" volume={0.25} />

      <Card id="sumcard" x={150} y={930} w={400} h={110} rot={-3} at={word('L09', 'isliye', -4)} bg={C.paperLight}>
        <div style={{fontFamily: F.display, fontSize: 52, textAlign: 'center', marginTop: 24}}>₹50K × 20 = ₹10L</div>
      </Card>
      <Hand x={150} y={1165} at={word('L09', 'time', -2)} size={54} rot={-2} color={C.ink}>har rupaye ka time alag!</Hand>
      <Cross id="sumx" x={165} y={940} w={370} h={90} at={word('L09', 'galat', -2)} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ irr

const Bar: React.FC<{x: number; at: number; value: number; max: number; label: string; color: string; fmt?: string}> = ({x, at, value, max, label, color, fmt}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at) return null;
  const p = ease(f, at, at + 12);
  const H = 420, h = (value / max) * H * p;
  const base = 1150;
  return (
    <>
      <div style={{position: 'absolute', left: x, top: base - h, width: 220, height: h, background: color, border: `4px solid ${C.ink}`, boxShadow: `6px 8px 10px ${C.shadow}`}} />
      <div style={{position: 'absolute', left: x - 20, top: base - h - 96, width: 260, textAlign: 'center', fontFamily: F.display, fontSize: 80, opacity: p}}>{fmt}</div>
      <div style={{position: 'absolute', left: x - 30, top: base + 14, width: 280, textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 2}}>{label}</div>
    </>
  );
};

const Irr: React.FC = () => {
  const {at, word} = useCues();
  const l11 = at('L11'), l12 = at('L12'), l13 = at('L13');
  return (
    <AbsoluteFill>
      {/* L10: the right question */}
      <Card id="q" x={100} y={430} w={880} h={560} rot={-1.5} at={0} out={l11} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'relative', padding: '44px 54px'}}>
          <Label size={26}>Sahi sawaal</Label>
          <div style={{fontFamily: F.display, fontSize: 104, lineHeight: 1.02, marginTop: 30}}>
            MERA PAISA <HL at={word('L10', 'har', -2)}>HAR SAAL</HL> KITNE % BADHA?
          </div>
        </div>
      </Card>

      {/* L11: IRR */}
      <Card id="irr" x={110} y={440} w={860} h={500} rot={-2} at={word('L11', 'irr', -4)} out={l12} enter="drop" bg={C.yellow} torn={{top: true, right: true}} rough={14}>
        <div style={{fontFamily: F.display, fontSize: 380, lineHeight: 1, textAlign: 'center', marginTop: 40, letterSpacing: 10}}>IRR</div>
      </Card>
      <Hand x={150} y={980} at={word('L11', 'yaani', -2)} out={l12} size={70} rot={-3}>= saalana asli return</Hand>

      {/* L12: this policy's IRR */}
      <Card id="pol" x={120} y={430} w={840} h={600} rot={1} at={l12} out={l13} enter="right" bg={C.card}>
        <div style={{padding: '44px 54px'}}>
          <Label size={26}>Is policy ka IRR</Label>
          <div style={{fontFamily: F.display, fontSize: 330, lineHeight: 1, marginTop: 40, textAlign: 'center'}}>
            <HL at={word('L12', '3.7', 8)}><Count from={0} to={3.7} at={word('L12', '3.7', -4)} dur={12} fmt={pct} /></HL>
          </div>
        </div>
      </Card>
      <Stamp id="sirf" text="Sirf" x={760} y={520} at={word('L12', 'sirf', -2)} out={l13} size={80} rot={8} />

      {/* L13: below inflation */}
      {/* bars sit on a sheet so they read as one chart */}
      <Card id="chart" x={100} y={420} w={880} h={820} rot={-0.8} at={l13} enter="up" bg={C.paperLight} sfx="slide">
        <div style={{position: 'absolute', inset: 0, ...grid(40)}} />
      </Card>
      <Bar x={210} at={l13 + 6} value={3.7} max={6} label="POLICY · IRR" color={C.yellow} fmt="3.7%" />
      <Bar x={640} at={word('L13', 'mehngai', -2)} value={5.5} max={6} label="MEHNGAI" color={C.card} fmt="5–6%" />
      <Marker id="dn" d="M530,620 Q520,760 535,900 M490,850 L535,905 L580,850" at={word('L13', 'ghat', -2)} width={12} />
      <Sfx at={word('L13', 'ghat', -2)} name="marker" volume={0.3} />
      <Stamp id="ghat" text="Asli value ↓" x={540} y={520} at={word('L13', 'ghat', 4)} size={74} rot={-6} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ compare

const TBASE = 1170, PXL = 20; // px per lakh

const Tower: React.FC<{x: number; at: number; lakhs: number; label: string; color: string}> = ({x, at, lakhs, label, color}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  const n = Math.round(lakhs * 2); // slabs of ₹50k... drawn as ₹0.5 lakh each
  const shown = f < at ? 0 : Math.min(n, Math.floor((f - at) / 1) + 1);
  const slab = (lakhs * PXL) / n;
  return (
    <>
      <div style={{position: 'absolute', left: x - 20, top: TBASE, width: 300, height: 8, background: C.ink}} />
      {Array.from({length: shown}).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: x + ((i * 37) % 7) - 3, top: TBASE - (i + 1) * slab, width: 260, height: slab - 1, background: color, borderTop: `1.5px solid rgba(20,20,20,0.55)`, borderLeft: `2px solid ${C.ink}`, borderRight: `2px solid ${C.ink}`, boxShadow: `4px 2px 4px rgba(30,22,10,0.18)`}} />
      ))}
      <div style={{position: 'absolute', left: x - 30, top: TBASE + 16, width: 320, textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 2}}>{label}</div>
      {f >= at ? <Sfx at={at} name="slide" volume={0.25} /> : null}
    </>
  );
};

const Compare: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l15 = at('L15'), l16 = at('L16');
  const rTop = TBASE - 21.9 * PXL, pTop = TBASE - 15 * PXL;
  const farak = word('L16', 'farak', -2);
  return (
    <AbsoluteFill>
      {/* L14: same money, at 7% */}
      <Card id="same" x={110} y={410} w={860} h={150} rot={-1} at={0} enter="left" bg={C.card}>
        <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 40px', gap: 24}}>
          <div style={{fontFamily: F.display, fontSize: 70}}>₹50,000 / SAAL</div>
          <div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 56}}>× 20 saal</div>
        </div>
      </Card>
      <Stamp id="seven" text="Agar 7%?" x={300} y={700} at={word('L14', '7', -2)} out={word('L16', 'policy', -2)} size={72} rot={-6} color={C.ink} paper />

      <Tower x={130} at={word('L16', 'policy', -2)} lakhs={15} label="POLICY" color={C.paperLight} />
      <Tower x={660} at={word('L15', '21.9', -14)} lakhs={21.9} label="7% PE" color={C.yellow} />
      {frame >= word('L15', '21.9', 4) ? (
        <div style={{position: 'absolute', left: 600, top: rTop - 100, width: 380, textAlign: 'center', fontFamily: F.display, fontSize: 84}}>
          <Count from={0} to={21.9} at={word('L15', '21.9', 0)} dur={10} fmt={lakh} />
        </div>
      ) : null}
      {frame >= word('L16', '15', -2) ? (
        <div style={{position: 'absolute', left: 80, top: pTop - 100, width: 360, textAlign: 'center', fontFamily: F.display, fontSize: 84}}>₹15 L</div>
      ) : null}

      {/* L16: the gap */}
      <Marker id="gap" d={`M405,${rTop} L640,${rTop} M405,${pTop} L640,${pTop} M430,${rTop} L430,${pTop}`} at={farak} dur={8} color={C.red} width={8} />
      <Sfx at={farak} name="marker" volume={0.3} />
      {frame >= farak + 6 ? (
        <div style={{position: 'absolute', left: 448, top: (rTop + pTop) / 2 - 44, transform: 'rotate(-4deg)', fontFamily: F.display, fontSize: 76, zIndex: 66}}>
          <HL at={word('L16', '7', -2)}>₹7 L</HL>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ cover

const umbrella = (r: number) => {
  // scalloped canopy over a half circle, centred at (0,0) facing up
  const n = 6;
  let d = `M${-r},0 A${r},${r} 0 0 1 ${r},0`;
  for (let i = n; i > 0; i--) {
    const x0 = -r + (2 * r * i) / n, x1 = -r + (2 * r * (i - 1)) / n;
    d += ` Q${(x0 + x1) / 2},${-r * 0.16} ${x1},0`;
  }
  return d + ' Z';
};

const Umbrella: React.FC<{x: number; y: number; r: number; at: number; out?: number; label: string; amount: React.ReactNode; color: string}> = ({x, y, r, at, out, label, amount, color}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at || (out !== undefined && f >= out)) return null;
  const p = Math.min(1.05, pop(frame, at));
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `scale(${p})`, transformOrigin: `${r}px ${r}px`}}>
      <Sfx at={at} name="pop" volume={0.3} />
      <svg width={2 * r + 20} height={r * 2.2} viewBox={`${-r - 10} ${-r - 10} ${2 * r + 20} ${r * 2.2}`} style={{overflow: 'visible', filter: `drop-shadow(6px 9px 8px ${C.shadow})`}}>
        <path d={umbrella(r)} fill={color} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
        <path d={`M0,0 L0,${r * 0.95} Q0,${r * 1.12} ${-r * 0.16},${r * 1.08}`} fill="none" stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
      </svg>
      <div style={{position: 'absolute', left: 0, width: 2 * r + 20, top: r * 0.18, textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: Math.max(18, r * 0.12), letterSpacing: 2}}>{label}</div>
      <div style={{position: 'absolute', left: 0, width: 2 * r + 20, top: r * 2.25 + 10, textAlign: 'center', fontFamily: F.display, fontSize: Math.max(64, r * 0.3), lineHeight: 1, whiteSpace: 'nowrap'}}>{amount}</div>
    </div>
  );
};

const CoverScene: React.FC = () => {
  const {at, word} = useCues();
  const l18 = at('L18'), l19 = at('L19');
  return (
    <AbsoluteFill>
      {/* L17: the policy's small umbrella */}
      <Hide until={l19}><Label size={28} style={{position: 'absolute', left: 110, top: 420}}>Life cover</Label></Hide>
      <Umbrella x={70} y={590} r={170} at={word('L17', 'cover', -2)} out={l19} label="POLICY" amount={<HL at={word('L17', '10', 0)}>₹10 L</HL>} color={C.paperLight} />
      <Hand x={110} y={500} at={word('L17', 'aksar', -2)} out={l19} size={58} rot={-3}>bas itna sa?</Hand>

      {/* L18: a term plan's big one */}
      <Umbrella x={430} y={470} r={255} at={word('L18', 'term', -2)} out={l19} label="TERM PLAN" amount={<HL at={word('L18', '1', 0)}>₹1 CRORE</HL>} color={C.yellow} />
      <Hand x={150} y={1180} at={word('L18', 'kuch', -2)} out={l19} size={54} rot={-2}>premium? saal ke kuch hazaar ₹</Hand>

      {/* L19: mixing makes both half-done */}
      <Card id="ins" x={110} y={520} w={430} h={420} rot={-3} at={l19} enter="left" bg={C.card}>
        <div style={{fontFamily: F.display, fontSize: 76, textAlign: 'center', marginTop: 150}}>INSURANCE</div>
      </Card>
      <Card id="inv" x={540} y={520} w={430} h={420} rot={3} at={word('L19', 'investment', -4)} enter="right" bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 76, textAlign: 'center', marginTop: 150}}>INVESTMENT</div>
      </Card>
      <Tape id="mixtape" x={460} y={700} w={170} rot={84} at={word('L19', 'mix', -2)} />
      <Stamp id="adh" text="Dono adhoore" x={540} y={1060} at={word('L19', 'adhoore', -2)} size={86} rot={-6} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ check

const FLOWS = [...Array.from({length: 20}, () => '-50,000'), '15,00,000'];

const Sheet: React.FC<{at: number; formulaAt: number; resultAt: number}> = ({at, formulaAt, resultAt}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  const formula = '=IRR(B2:B22)';
  const typed = f < formulaAt ? 0 : Math.min(formula.length, Math.floor((f - formulaAt) / 2) + 1);
  const rows = [0, 1, 2, 3, 19, 20];
  return (
    <Card id="sheet" x={100} y={430} w={880} h={660} rot={-1} at={at} enter="up" bg="#FDFDFB" texture="paper">
      <div style={{fontFamily: F.mono, fontSize: 32, color: C.ink}}>
        <div style={{display: 'flex', alignItems: 'center', height: 74, borderBottom: `3px solid ${C.ink}`, background: '#E9EEE6', padding: '0 24px', gap: 18}}>
          <span style={{fontWeight: 700, fontStyle: 'italic'}}>fx</span>
          <span style={{fontWeight: 700, fontSize: 34}}>{formula.slice(0, typed)}{typed < formula.length && typed > 0 && Math.floor(frame / 8) % 2 ? '|' : ''}</span>
        </div>
        {rows.map((r, i) => (
          <div key={r} style={{display: 'flex', height: 72, borderBottom: '1.5px solid #c9c9c0'}}>
            <div style={{width: 90, background: '#E9EEE6', borderRight: '1.5px solid #c9c9c0', textAlign: 'center', lineHeight: '72px', color: C.inkSoft}}>{r + 2}</div>
            <div style={{width: 280, borderRight: '1.5px solid #c9c9c0', lineHeight: '72px', paddingLeft: 18}}>{r === 20 ? 'Maturity' : `Saal ${r + 1}`}</div>
            <div style={{flex: 1, lineHeight: '72px', textAlign: 'right', paddingRight: 30, fontWeight: 700, color: r === 20 ? C.ink : C.inkSoft}}>{FLOWS[r]}</div>
          </div>
        ))}
        <div style={{position: 'absolute', left: 380, top: 74 + 4 * 72 - 34, fontSize: 40, color: C.inkSoft}}>⋮</div>
        <div style={{display: 'flex', height: 100, alignItems: 'center', padding: '0 30px', gap: 30, borderTop: `3px solid ${C.ink}`, marginTop: 20}}>
          <span style={{fontWeight: 700, letterSpacing: 2}}>IRR =</span>
          {f >= resultAt ? <span style={{fontFamily: F.display, fontSize: 84}}><HL at={resultAt + 2}>3.7%</HL></span> : null}
        </div>
      </div>
    </Card>
  );
};

const Check: React.FC = () => {
  const {at, word} = useCues();
  const l21 = at('L21'), l22 = at('L22'), l23 = at('L23');
  const chhodi = word('L23', 'chhodi', -2);
  return (
    <AbsoluteFill>
      {/* L20: next time, ask one thing */}
      <div style={{position: 'absolute', left: 110, top: 470, width: 860}}>
        <Hide until={l21}><Big words={['AGLI', 'BAAR', 'EK', 'SAWAAL', 'POOCHO']} at={4} gap={4} size={150} /></Hide>
      </div>

      {/* L21: IRR, not the total */}
      <Card id="ask" x={110} y={440} w={860} h={380} rot={-2} at={l21} out={l22} enter="drop" bg={C.yellow} torn={{bottom: true, right: true}} rough={12}>
        <div style={{fontFamily: F.display, fontSize: 150, lineHeight: 1, textAlign: 'center', marginTop: 50}}>IRR KITNA<br />HAI?</div>
      </Card>
      <Card id="totq" x={260} y={880} w={560} h={150} rot={3} at={word('L21', 'total', -4)} out={l22} bg={C.paperLight}>
        <div style={{fontFamily: F.display, fontSize: 80, textAlign: 'center', marginTop: 26}}>TOTAL ₹15 LAKH</div>
      </Card>
      <Cross id="totx" x={280} y={890} w={520} h={130} at={word('L21', 'nahi', -2)} out={l22} />

      {/* L22: one formula in a spreadsheet */}
      <Hide from={l22} until={l23}>
        <Sheet at={l22} formulaAt={word('L22', 'irr', -8)} resultAt={word('L22', 'ek', -2)} />
      </Hide>
      <Hand x={600} y={1110} at={word('L22', 'line', 0)} out={l23} size={58} rot={-4}>bas ek line!</Hand>

      {/* L23: surrender = loss — the policy tears in half */}
      <Card id="tearL" x={140} y={480} w={400} h={560} rot={-2} at={l23} out={word('L23', 'surrender', 8)} exit="left" enter="up" bg={C.card} torn={{right: true}} rough={20}>
        <div style={{height: 110, background: C.ink, color: C.paperLight, fontFamily: F.display, fontSize: 56, padding: '24px 30px'}}>POLICY</div>
      </Card>
      <Card id="tearR" x={540} y={480} w={400} h={560} rot={2} at={l23} out={word('L23', 'surrender', 8)} exit="right" enter="up" bg={C.card} torn={{left: true}} rough={20} sfx={null}>
        <div style={{height: 110, background: C.ink, color: C.paperLight, fontFamily: F.display, fontSize: 56, padding: '24px 30px'}}>DOCUMENT</div>
      </Card>
      <Sfx at={chhodi} name="slide" volume={0.35} />
      <Stamp id="surr" text="Surrender" sub="= AUR NUKSAAN" x={540} y={760} at={word('L23', 'surrender', -2)} size={110} rot={-8} />
    </AbsoluteFill>
  );
};

const Appear: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => {
  const frame = useCurrentFrame();
  if (stepped(frame) < at) return null;
  const p = Math.min(1.05, pop(frame, at));
  return <span style={{display: 'inline-block', transform: `translateY(${(1 - p) * -30}px)`}}>{children}</span>;
};

// Show children only inside [from, until) (scene-local frames).
const Hide: React.FC<{from?: number; until?: number; children: React.ReactNode}> = ({from = 0, until, children}) => {
  const frame = useCurrentFrame();
  if (frame < from || (until !== undefined && frame >= until)) return null;
  return <div style={{position: 'absolute', inset: 0}}>{children}</div>;
};

// ------------------------------------------------------------------ outro

const Outro: React.FC = () => (
  <AbsoluteFill>
    <SignOff share="L24" sign="L25" who="us rishtedaar ko jo policy bech ya le raha hai →" note="ILLUSTRATIVE: ₹50,000/YR × 20 YRS, ₹15 LAKH AT MATURITY → IRR 3.7% · SAME FLOWS AT 7% → ₹21.9 LAKH" />
  </AbsoluteFill>
);

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  time: Time,
  irr: Irr,
  compare: Compare,
  cover: CoverScene,
  check: Check,
  outro: Outro,
};
