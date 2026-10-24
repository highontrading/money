import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Big, Card, Circle, Count, Cross, Hand, HL, Label, Marker, Photo, Sfx, Stamp} from '../../components/paper';
import {ease, stepped} from '../../lib/motion';
import {useCues} from '../../lib/timeline';
import {C, F} from '../../theme';
import {SignOff} from '../common';
import {Figure, grid, Ice, lerp, PhoneReel, Pop, Show, Tab, Tick, Trader, XMark} from './parts';

const lakhCr = (n: number) => `₹${n.toFixed(2)}`;
const lakh1 = (n: number) => `−₹${n.toFixed(1)}`;

/* ------------------------------------------------------------------ hook */

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l02 = at('L02'), l03 = at('L03'), l04 = at('L04'), l05 = at('L05');
  const ten = word('L02', '10', -3);
  const sebi = word('L02', 'sebi', -4);
  const tag = word('L02', 'nuksaan', -2);
  const crore = word('L03', '₹1.06', -2);
  const avg = word('L04', '₹1.1', -2);
  return (
    <AbsoluteFill>
      {/* L01: the reel that promises ₹5,000 a day */}
      <Card id="phone" x={300} y={410} w={480} h={800} rot={-3} at={0} out={l02 + 2} enter="up" bg="#1c1b19" texture={null} rough={2} sfx="slide">
        <PhoneReel lit={word('L01', '₹5,000', -2)} />
      </Card>
      <Hand x={96} y={480} at={4} out={l02 + 2} size={60} rot={-6} w={230}>reel pe dekha…</Hand>
      <Hand x={790} y={760} at={word('L01', '₹5,000', 4)} out={l02 + 2} size={66} rot={6} color={C.red}>sach?</Hand>

      {/* L02: SEBI's data — 9 of 10 lose */}
      <Card id="sebi" x={110} y={420} w={860} h={110} rot={-1} at={sebi} out={l03} enter="left" bg={C.paperLight}>
        <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 34px', gap: 22}}>
          <Label size={26}>SEBI ka data</Label>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 3}}>F&amp;O · INDIVIDUAL TRADERS</div>
        </div>
      </Card>
      <div style={{position: 'absolute', left: 110, top: 570, width: 860}}>
        <Show from={ten} until={l03}><Big words={['10', 'MEIN', 'SE', '9']} at={ten} gap={4} size={150} /></Show>
      </div>
      <Card id="row" x={90} y={760} w={900} h={260} rot={0.6} at={sebi + 4} out={l03} enter="up" bg={C.card} sfx={null}>
        <div style={{position: 'absolute', inset: 0, ...grid(36)}} />
        <div style={{position: 'absolute', left: 26, right: 26, top: 30, display: 'flex', justifyContent: 'space-between'}}>
          {Array.from({length: 10}).map((_, i) => <Trader key={i} at={sebi + 6 + i * 2} tagAt={tag + i * 2} win={i === 6} w={70} />)}
        </div>
      </Card>

      {/* L03: total net loss in FY25 */}
      <Card id="study" x={100} y={420} w={880} h={440} rot={-1.2} at={l03 - 2} out={l05} enter="right" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid(40)}} />
        <div style={{position: 'relative', padding: '34px 44px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <Label size={26}>SEBI study</Label>
            <div style={{background: C.yellow, fontFamily: F.display, fontSize: 52, padding: '4px 16px 0'}}>FY25</div>
          </div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 28, letterSpacing: 2, marginTop: 30, opacity: frame >= word('L03', 'individual', -4) ? 1 : 0}}>INDIVIDUAL TRADERS · TOTAL NET NUKSAAN</div>
          <div style={{fontFamily: F.display, fontSize: 132, lineHeight: 1.05, marginTop: 18, color: frame >= crore ? C.red : C.inkSoft, whiteSpace: 'nowrap'}}>
            {frame < crore ? '₹ ? ? ?' : <><Count from={0} to={1.06} at={crore} dur={16} fmt={lakhCr} /> LAKH CR</>}
          </div>
        </div>
      </Card>
      <Sfx at={crore + 16} name="stamp" volume={0.3} />

      {/* L04: average loss per trader */}
      <Card id="avg" x={170} y={900} w={740} h={300} rot={1.6} at={l04 - 2} out={l05} enter="up" bg={C.paperLight}>
        <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 40px', gap: 34}}>
          <Figure w={110} color="#e7d2c8" />
          <div>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 3}}>AVERAGE · HAR TRADER</div>
            <div style={{fontFamily: F.display, fontSize: 112, lineHeight: 1.05, color: C.red, whiteSpace: 'nowrap'}}>
              {frame < avg ? '−₹ ?' : <><Count from={0} to={1.1} at={avg} dur={12} fmt={lakh1} /> LAKH</>}
            </div>
          </div>
        </div>
      </Card>

      {/* L05: why? three reasons */}
      <div style={{position: 'absolute', left: 110, top: 440, width: 860}}>
        <Show from={l05}><Big words={['ITNE', 'LOG', 'HAAR', 'KYUN', 'RAHE', 'HAIN?']} at={l05} gap={3} size={128} /></Show>
      </div>
      <Card id="teen" x={150} y={830} w={780} h={330} rot={-1.5} at={word('L05', 'teen', -4)} enter="drop" bg={C.yellow} torn={{top: true, right: true}} rough={12}>
        <div style={{fontFamily: F.display, fontSize: 128, textAlign: 'center', marginTop: 26}}>3 WAJAH</div>
        <div style={{display: 'flex', justifyContent: 'center', gap: 22, marginTop: 6}}>
          {['01', '02', '03'].map((n, i) => (
            <Pop key={n} at={word('L05', 'wajah', -2) + i * 3}>
              <div style={{background: C.ink, color: C.paperLight, fontFamily: F.display, fontSize: 52, padding: '6px 22px 0'}}>{n}</div>
            </Pop>
          ))}
        </div>
      </Card>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ zero-sum */

const ZeroSum: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word, length} = useCues();
  const l07 = at('L07');
  const prof = word('L06', 'profit', -3);
  const loss = word('L06', 'loss', -3);
  const tilt = lerp(frame, loss, loss + 10, 0, -9);
  const knot = lerp(frame, l07 + 10, length - 6, 0, 150);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 110, top: 420, zIndex: 40}}>
        <Pop at={word('L06', 'ek', -2)} origin="left center"><Tab n="01" title="ZERO-SUM" hi /></Pop>
      </div>

      {/* L06: a see-saw — your profit is someone's loss */}
      <Card id="seesaw" x={90} y={560} w={900} h={560} rot={-0.8} at={word('L06', 'f&o', -4)} out={l07} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid(40)}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 34, textAlign: 'center', opacity: frame >= word('L06', 'zero-sum', -2) ? 1 : 0}}>
          <span style={{fontFamily: F.display, fontSize: 64}}>PROFIT + LOSS = <HL at={word('L06', 'zero-sum', 0)}>ZERO</HL></span>
        </div>
        {/* plank + boxes rotate together about the fulcrum */}
        <div style={{position: 'absolute', left: 60, width: 780, top: 340, height: 20, transform: `rotate(${tilt}deg)`, transformOrigin: '50% 50%'}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 20, background: C.kraft, border: `4px solid ${C.ink}`}} />
          <div style={{position: 'absolute', left: 10, bottom: 24}}>
            <Pop at={prof}>
              <div style={{width: 340, background: C.yellow, border: `4px solid ${C.ink}`, padding: '16px 16px 12px', textAlign: 'center'}}>
                <div style={{fontFamily: F.display, fontSize: 90, lineHeight: 1}}>+</div>
                <div style={{fontFamily: F.display, fontSize: 50}}>AAPKA PROFIT</div>
              </div>
            </Pop>
          </div>
          <div style={{position: 'absolute', right: 10, bottom: 24}}>
            <Pop at={loss}>
              <div style={{width: 340, background: C.paperLight, border: `4px solid ${C.red}`, padding: '16px 16px 12px', textAlign: 'center', color: C.red}}>
                <div style={{fontFamily: F.display, fontSize: 90, lineHeight: 1}}>−</div>
                <div style={{fontFamily: F.display, fontSize: 50}}>KISI AUR KA LOSS</div>
              </div>
            </Pop>
          </div>
        </div>
        <svg width={140} height={130} style={{position: 'absolute', left: 380, top: 364}}>
          <path d="M70,4 L130,124 L10,124 Z" fill={C.ink} />
        </svg>
      </Card>
      <Sfx at={prof} name="pop" volume={0.25} />
      <Sfx at={loss} name="pop" volume={0.25} />

      {/* L07: who's on the other side */}
      <Card id="tug" x={90} y={560} w={900} h={600} rot={0.8} at={l07 - 2} enter="right" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid(40)}} />
        <div style={{position: 'absolute', left: 40, top: 30}}><Label size={26}>Doosri taraf kaun?</Label></div>
        {/* you */}
        <div style={{position: 'absolute', left: 50, top: 180, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Figure w={110} />
          <div style={{background: C.ink, color: C.paperLight, fontFamily: F.display, fontSize: 40, padding: '4px 18px 0', marginTop: 8}}>AAP</div>
        </div>
        {/* rope with a knot sliding to their side */}
        <div style={{position: 'absolute', left: 170, width: 420, top: 270, height: 10, background: C.kraft, border: `3px solid ${C.ink}`}} />
        <div style={{position: 'absolute', left: 360 + knot, top: 252, width: 44, height: 44, borderRadius: '50%', background: C.red, border: `4px solid ${C.ink}`}} />
        <div style={{position: 'absolute', left: 340, top: 320, width: 300, borderLeft: `3px dashed ${C.inkSoft}`, height: 80, opacity: 0.6}} />
        {/* them */}
        <div style={{position: 'absolute', left: 600, top: 110, display: 'flex', flexDirection: 'column', gap: 20}}>
          {[['PROFESSIONALS', 'professionals'], ['ALGOS', 'algos'], ['BADI FIRMS', 'badi']].map(([t, k]) => (
            <Pop key={k} at={word('L07', k, -3)} origin="left center">
              <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                <Figure w={56} color={C.yellow} />
                <div style={{background: C.paperLight, border: `3px solid ${C.ink}`, fontFamily: F.display, fontSize: 34, padding: '6px 12px 2px', whiteSpace: 'nowrap'}}>{t}</div>
              </div>
            </Pop>
          ))}
        </div>
        <Hand x={60} y={470} at={word('L07', 'aksar', -2)} size={52} rot={-3} w={520}>aksar zyada data, zyada speed…</Hand>
      </Card>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ costs */

const COSTS: [string, string][] = [['BROKERAGE', 'brokerage'], ['STT', 'stt'], ['EXCHANGE FEES', 'exchange'], ['GST', 'gst']];

const Cost: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l09 = at('L09');
  const cuts = COSTS.map(([, k]) => word('L08', k, -3));
  const k = cuts.filter((c) => stepped(frame) >= c).length;
  const minus = word('L09', 'minus', -3);
  const barW = 760;
  const kept = barW * (1 - 0.07 * k);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 110, top: 420, zIndex: 40}}>
        <Pop at={word('L08', 'do', -2)} origin="left center"><Tab n="02" title="KHARCHA" hi /></Pop>
      </div>

      {/* L08: every trade pays a toll */}
      <Card id="slip" x={100} y={560} w={880} h={510} rot={-0.8} at={word('L08', 'do', 6)} enter="up" bg={C.card}>
        <div style={{background: C.ink, color: C.paperLight, fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, padding: '16px 36px'}}>TRADE SLIP · HAR TRADE</div>
        <div style={{position: 'absolute', left: 60, top: 90}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, marginBottom: 8}}>AAPKA PAISA</div>
          <div style={{position: 'relative', width: barW, height: 64, border: `4px solid ${C.ink}`, background: `repeating-linear-gradient(-45deg, rgba(210,52,31,0.55) 0 10px, transparent 10px 20px)`}}>
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: kept, background: C.yellow, borderRight: k ? `4px dashed ${C.ink}` : 'none'}} />
          </div>
        </div>
        <div style={{position: 'absolute', left: 60, right: 60, top: 220}}>
          {COSTS.map(([t], i) => (
            <div key={t} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px dashed ${C.grey}`, padding: '10px 0', opacity: stepped(frame) >= cuts[i] ? 1 : 0}}>
              <span style={{fontFamily: F.display, fontSize: 46}}>{t}</span>
              <span style={{fontFamily: F.display, fontSize: 46, color: C.red}}>− ✂</span>
            </div>
          ))}
        </div>
      </Card>
      {cuts.map((c, i) => <Sfx key={i} at={c} name="tick" volume={0.35} />)}

      {/* L09: flat market, still negative */}
      <Card id="flat" x={120} y={1090} w={840} h={140} rot={1} at={l09 - 2} enter="up" bg={C.paperLight}>
        <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 30px', gap: 24}}>
          <div style={{fontFamily: F.display, fontSize: 46, whiteSpace: 'nowrap'}}>BAZAAR: BARABAR</div>
          <svg width={200} height={60}><path d="M4,30 L60,26 L110,34 L160,28 L196,30" fill="none" stroke={C.ink} strokeWidth={5} /></svg>
          <div style={{fontFamily: F.display, fontSize: 46, color: C.red, whiteSpace: 'nowrap', opacity: frame >= minus ? 1 : 0}}>AAP: MINUS</div>
        </div>
      </Card>
      <Stamp id="minus" text="Minus" sub="BAZAAR HILA BHI NAHI" x={560} y={690} at={minus} size={100} rot={-8} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ time decay */

const DAYS = ['SOM', 'MANGAL', 'BUDH', 'GURU', 'SHUKRA'];
const LEFT = [1, 0.74, 0.5, 0.28, 0.08];

const Decay: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word, length} = useCues();
  const l11 = at('L11'), l12 = at('L12');
  const bought = word('L10', 'kharida', -4);
  const daily = word('L10', 'har', -2);
  const tdec = word('L11', 'time', -3);
  const sahi = word('L11', 'sahi', -3);
  const waqt = word('L11', 'waqt', -3);
  const dir = word('L12', 'direction', -3);
  const tim = word('L12', 'timing', -3);
  const phir = word('L12', 'phir', -3);
  const rise = ease(stepped(frame), dir, dir + 14);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 110, top: 420, zIndex: 40}}>
        <Pop at={word('L10', 'teen', -2)} origin="left center"><Tab n="03" title={frame >= tdec ? 'TIME DECAY' : 'OPTION'} hi /></Pop>
      </div>

      {/* L10-L11: the option melts a little every day */}
      <Card id="melt" x={90} y={560} w={900} h={460} rot={-0.6} at={word('L10', 'teen', 6)} out={l12} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid(40)}} />
        <div style={{position: 'absolute', left: 40, top: 28}}><Label size={24}>Option ki keemat · har din</Label></div>
        <div style={{position: 'absolute', left: 60, right: 60, bottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
          {DAYS.map((d, i) => {
            const t = i === 0 ? bought : daily + (i - 1) * 6;
            const on = stepped(frame) >= t;
            return (
              <div key={d} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: on ? 1 : 0}}>
                <Ice w={120} h={230} left={on ? LEFT[i] : 1} label={i === 0 ? 'OPTION' : undefined} />
                <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2}}>{d}</div>
              </div>
            );
          })}
        </div>
        <Show from={tdec}>
          <div style={{position: 'absolute', right: 40, top: 22}}>
            <Pop at={tdec}><div style={{background: C.yellow, border: `3px solid ${C.ink}`, fontFamily: F.display, fontSize: 44, padding: '6px 16px 0'}}>= TIME DECAY</div></Pop>
          </div>
        </Show>
      </Card>
      <Hand x={600} y={1040} at={word('L10', 'pighalti', -2)} out={l11} size={60} rot={-4} color={C.red}>pighal raha hai…</Hand>
      {[0, 1, 2, 3].map((i) => <Sfx key={i} at={daily + i * 6} name="tick" volume={0.25} />)}

      {/* L11: you must be right AND right on time */}
      <Card id="both" x={130} y={1040} w={820} h={180} rot={1} at={sahi} out={l12} enter="up" bg={C.paperLight}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 18, fontFamily: F.display, fontSize: 52, whiteSpace: 'nowrap'}}>
          <span>SAHI DIRECTION</span><Tick at={sahi + 6} size={54} />
          <span style={{opacity: frame >= waqt ? 1 : 0}}>+ SAHI WAQT</span><Tick at={waqt + 6} size={54} />
        </div>
      </Card>

      {/* L12: right direction, wrong timing */}
      <Card id="late" x={90} y={540} w={900} h={620} rot={0.8} at={l12 - 2} enter="right" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid(40)}} />
        <div style={{position: 'absolute', left: 40, top: 28}}><Label size={24}>Aapka option · price chart</Label></div>
        <svg width={900} height={640} style={{position: 'absolute', left: 0, top: 0}}>
          <line x1={520} y1={110} x2={520} y2={560} stroke={C.red} strokeWidth={4} strokeDasharray="14 10" />
          <text x={530} y={140} fontFamily="IBM Plex Mono" fontWeight={700} fontSize={24} fill={C.red}>EXPIRY</text>
          <path d="M60,470 L140,462 L220,476 L300,466 L380,472 L460,464 L520,470" fill="none" stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
          <path d={`M520,470 L${520 + 300 * rise},${470 - 300 * rise}`} fill="none" stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
          <line x1={40} y1={560} x2={860} y2={560} stroke={C.ink} strokeWidth={4} />
        </svg>
        <div style={{position: 'absolute', left: 60, top: 150, display: 'flex', flexDirection: 'column', gap: 16}}>
          <Pop at={dir} origin="left center"><div style={{display: 'flex', alignItems: 'center', gap: 10, fontFamily: F.display, fontSize: 48}}>DIRECTION SAHI <Tick at={dir + 8} size={50} /></div></Pop>
          <Pop at={tim} origin="left center"><div style={{display: 'flex', alignItems: 'center', gap: 10, fontFamily: F.display, fontSize: 48, color: C.red}}>TIMING GALAT <XMark at={tim + 8} size={50} /></div></Pop>
        </div>
        <Hand x={60} y={300} at={tim + 6} size={42} rot={-3} w={340}>chadha… par expiry ke baad</Hand>
      </Card>
      <Circle id="gap" cx={690} cy={840} rx={120} ry={110} at={tim + 4} />
      <Stamp id="phir" text="Phir bhi loss" x={540} y={1060} at={phir} size={96} rot={-7} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ lesson */

const Lesson: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l14 = at('L14'), l15 = at('L15');
  const lambi = word('L15', 'lambi', -4);
  const jack = word('L15', 'roz', -4);
  const steps = ease(stepped(frame), lambi + 4, lambi + 30);
  return (
    <AbsoluteFill>
      {/* L13: SEBI tightened the rules */}
      <Photo id="bse" src="bse.jpg" x={90} y={420} w={900} h={360} rot={-1.5} at={0} out={l14} enter="up" torn={{top: true, bottom: true}} rough={12} pos="50% 35%" caption="DALAL STREET · MUMBAI" />
      <Card id="rules" x={140} y={740} w={800} h={430} rot={1.2} at={word('L13', 'sebi', -4)} out={l14} enter="up" bg={C.card}>
        <div style={{background: C.ink, color: C.paperLight, fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, padding: '16px 34px'}}>SEBI · F&amp;O NIYAM</div>
        <div style={{padding: '24px 40px', display: 'flex', flexDirection: 'column', gap: 18}}>
          <Pop at={word('L13', 'bade', -3)} origin="left center"><div style={{fontFamily: F.display, fontSize: 64}}>BADE LOT <span style={{color: C.red}}>↑</span></div></Pop>
          <Pop at={word('L13', 'kam', -3)} origin="left center"><div style={{fontFamily: F.display, fontSize: 64}}>KAM WEEKLY EXPIRY <span style={{color: C.red}}>↓</span></div></Pop>
        </div>
      </Card>
      <Stamp id="sakht" text="Sakht" x={720} y={1080} at={word('L13', 'sakht', -2)} out={l14} size={88} rot={8} />

      {/* L14: practise first, small money only */}
      <Card id="note" x={100} y={430} w={540} h={640} rot={-2} at={l14 - 2} out={l15} enter="left" bg={C.paperLight}>
        <div style={{position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(transparent 0 58px, rgba(70,110,150,0.25) 58px 60px)`}} />
        <div style={{position: 'absolute', left: 70, top: 0, bottom: 0, borderLeft: '3px solid rgba(210,52,31,0.45)'}} />
        <div style={{position: 'relative', padding: '36px 30px 0 96px'}}>
          <div style={{marginBottom: 12}}><Label size={24}>Seekhna hai?</Label></div>
          <div style={{fontFamily: F.display, fontSize: 64, lineHeight: 1, opacity: frame >= word('L14', 'paper', -3) ? 1 : 0}}><HL at={word('L14', 'paper', 0)}>PAPER TRADING</HL></div>
        </div>
        <Hand x={96} y={230} at={word('L14', 'trading', 2)} size={50} rot={-2} w={420}>practice. asli paisa nahi.</Hand>
        <Hand x={96} y={360} at={word('L14', 'trading', 14)} size={50} rot={-2} w={420}>galti sasti ✓</Hand>
      </Card>
      <Card id="small" x={660} y={560} w={320} h={260} rot={3} at={word('L14', 'chhote', -4)} out={l15} enter="drop" bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 64, lineHeight: 1, textAlign: 'center', marginTop: 48}}>CHHOTE<br />PAISE</div>
      </Card>
      <Hand x={600} y={860} at={word('L14', 'afford', -4)} out={l15} size={52} rot={-4} w={380}>jo khona afford kar sako</Hand>

      {/* L15: wealth is slow; the daily jackpot isn't a plan */}
      <div style={{position: 'absolute', left: 110, top: 430, width: 860}}>
        <Show from={l15}><Big words={['DHAN', 'BANANA', 'HAI?']} at={l15} gap={3} size={120} /></Show>
      </div>
      <Card id="slow" x={560} y={600} w={420} h={580} rot={1.5} at={lambi} enter="right" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid(36)}} />
        <div style={{position: 'relative', padding: '28px 30px'}}>
          <div style={{fontFamily: F.display, fontSize: 52, lineHeight: 1}}><HL at={lambi + 4}>LAMBI</HL><br />INVESTING</div>
        </div>
        <div style={{position: 'absolute', left: 36, right: 36, bottom: 40, height: 300, display: 'flex', alignItems: 'flex-end', gap: 10}}>
          {Array.from({length: 7}).map((_, i) => (
            <div key={i} style={{flex: 1, height: `${(18 + i * 13) * steps}%`, background: i === 6 ? C.yellow : C.paperLight, border: `3px solid ${C.ink}`}} />
          ))}
        </div>
        <div style={{position: 'absolute', right: 30, top: 34}}><Tick at={lambi + 30} size={64} /></div>
      </Card>
      <Card id="slot" x={100} y={600} w={420} h={580} rot={-1.5} at={jack} enter="left" bg={C.paperLight}>
        <div style={{position: 'relative', padding: '28px 30px'}}>
          <div style={{fontFamily: F.display, fontSize: 52, lineHeight: 1}}>ROZ KA<br />JACKPOT</div>
        </div>
        <div style={{position: 'absolute', left: 40, right: 40, top: 200, height: 260, background: C.red, border: `5px solid ${C.ink}`, borderRadius: 18, padding: 20, display: 'flex', gap: 12}}>
          {['₹', '?', '₹'].map((s, i) => (
            <div key={i} style={{flex: 1, background: C.paperLight, border: `4px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: 90}}>{s}</div>
          ))}
        </div>
        <div style={{position: 'absolute', right: 6, top: 230, width: 14, height: 120, background: C.ink, borderRadius: 7}} />
        <div style={{position: 'absolute', right: -4, top: 210, width: 34, height: 34, borderRadius: '50%', background: C.yellow, border: `4px solid ${C.ink}`}} />
      </Card>
      <Cross id="slotx" x={130} y={630} w={360} h={520} at={word('L15', 'jackpot', 0)} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ outro */

const Outro: React.FC = () => (
  <AbsoluteFill>
    <SignOff share="L16" sign="L17" who="us dost ko jo roz options khelta hai →" note={<>SEBI STUDY (JULY 2025): ~91% INDIVIDUAL F&amp;O TRADERS MADE NET LOSSES IN FY25 · TOTAL ₹1.06 LAKH CRORE</>} />
  </AbsoluteFill>
);

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  zero: ZeroSum,
  cost: Cost,
  decay: Decay,
  lesson: Lesson,
  outro: Outro,
};
