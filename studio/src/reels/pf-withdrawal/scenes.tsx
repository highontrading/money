import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, Card, Count, Cross, Hand, HL, Label, Marker, Sfx, Stamp, Tape} from '../../components/paper';
import {clamp, ease, stepped} from '../../lib/motion';
import {useCues} from '../../lib/timeline';
import {wobblyLine} from '../../lib/torn';
import {C, F} from '../../theme';
import {SignOff} from '../common';
import {Bike, grid, GrowthBars, Jar, pct, Sapling, Sawtooth, Show, Tree} from './props';

// ---------------------------------------------------------------- hook
const Hook: React.FC = () => {
  const {at, word} = useCues();
  const l2 = at('L02'), l3 = at('L03'), l4 = at('L04'), l5 = at('L05');
  return (
    <AbsoluteFill>
      {/* L01: changed jobs; ₹3 lakh in the old PF */}
      <Card id="resign" x={110} y={420} w={520} h={560} rot={-3} at={0} out={word('L02', 'nikaal', -4)} enter="up">
        <div style={{padding: '36px 40px'}}>
          <Label size={22}>Resignation letter</Label>
          <div style={{fontFamily: F.type, fontSize: 30, lineHeight: 1.6, marginTop: 30, color: C.inkSoft}}>
            Dear Sir,<br />Main is naukri se<br />resign kar raha hoon.<br />Last working day...<br /><br />Thanks!
          </div>
        </div>
      </Card>
      <Hand x={150} y={1000} at={word('L01', 'naukri', 0)} out={word('L02', 'nikaal', -4)} size={64} rot={-4}>naukri badli!</Hand>
      <Card id="pfslip" x={560} y={760} w={420} h={300} rot={4} at={word('L01', 'pf', -4)} out={l3} bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid(36)}} />
        <div style={{position: 'relative', padding: '30px 36px'}}>
          <Label size={22}>Purana PF · balance</Label>
          <div style={{fontFamily: F.display, fontSize: 104, lineHeight: 1, marginTop: 34}}>
            <HL at={word('L01', '₹3', 2)}>₹3 LAKH</HL>
          </div>
        </div>
      </Card>
      <Tape id="tslip" x={700} y={744} w={140} rot={-8} at={word('L01', 'pf', -2)} out={l3} />

      {/* L02: take it out, buy a bike */}
      <Bike id="bike1" x={110} y={430} w={480} h={300} rot={-2} at={word('L02', 'bike', -4)} out={l3} enter="left" />
      <Hand x={120} y={790} at={word('L02', 'nikaal', -2)} out={l3} size={66} rot={-4} w={440}>nikaal lete hain!</Hand>

      {/* L03: ₹3 lakh sapling vs the ₹32 lakh tree */}
      <Sapling id="sap" x={130} y={720} w={220} h={290} rot={-2} at={l3} out={l4} enter="up" />
      <Card id="sap3" x={110} y={1030} w={270} h={110} rot={-3} at={l3 + 4} out={l4} bg={C.card} sfx={null}>
        <div style={{fontFamily: F.display, fontSize: 64, textAlign: 'center', marginTop: 18}}>₹3 LAKH</div>
      </Card>
      <Hand x={110} y={500} at={word('L03', 'retirement', -2)} out={l4} size={58} rot={-5} w={380}>retirement tak...</Hand>
      <Marker id="growarr" d={wobblyLine('ga', 360, 860, 500, 760, 30)} at={word('L03', 'retirement', 4)} dur={8} out={l4} color={C.ink} width={8} />
      <Tree id="tree" x={520} y={410} w={420} h={546} rot={1.5} at={word('L03', 'retirement', 2)} out={l4} enter="drop" />
      <Card id="tree32" x={560} y={960} w={360} h={140} rot={3} at={word('L03', '₹32', -3)} out={l4} bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 92, textAlign: 'center', marginTop: 18}}>₹32 LAKH</div>
      </Card>

      {/* L04: the bike's real price */}
      <Bike id="bike2" x={190} y={440} w={640} h={400} rot={-2} at={l4} out={l5} enter="right" />
      <Card id="tag" x={470} y={840} w={480} h={250} rot={5} at={word('L04', 'asli', -4)} out={l5} bg={C.card} torn={{right: true}}>
        <div style={{padding: '26px 34px'}}>
          <Label size={22}>Asli keemat</Label>
          <div style={{fontFamily: F.display, fontSize: 112, lineHeight: 1, marginTop: 22, color: C.ink}}>
            <HL at={word('L04', '₹29', 2)}>₹29 LAKH</HL>
          </div>
        </div>
      </Card>
      <Marker id="tagstring" d={wobblyLine('ts', 560, 860, 640, 720, 20)} at={word('L04', 'asli', -2)} dur={6} out={l5} color={C.ink} width={5} />

      {/* L05: how? compounding */}
      <div style={{position: 'absolute', left: 110, top: 450, width: 860}}>
        <Show at={l5}><Big words={['KAISE?']} at={l5} size={170} /></Show>
      </div>
      <Card id="cmpd" x={100} y={700} w={880} h={230} rot={-2} at={word('L05', 'compounding', -4)} bg={C.yellow} torn={{left: true, right: true}} rough={12}>
        <div style={{fontFamily: F.display, fontSize: 150, textAlign: 'center', marginTop: 24, letterSpacing: 2}}>COMPOUNDING</div>
      </Card>
      <Hand x={560} y={960} at={word('L05', 'samjho', -2)} size={62} rot={-3}>PF ka, samjho →</Hand>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- compound
const Compound: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word, length} = useCues();
  const l7 = at('L07'), l8 = at('L08'), l9 = at('L09'), l10 = at('L10'), l11 = at('L11');
  const fill = interpolate(stepped(frame), [word('L08', '30', -4), word('L08', '30', 14)], [0, 1], clamp);
  const barsAt = l9 + 4;
  const barsDur = Math.max(30, word('L09', '₹32', -2) - barsAt);
  return (
    <AbsoluteFill>
      {/* L06: 8.25% a year, set by EPFO */}
      <Card id="rate" x={110} y={430} w={860} h={430} rot={-1.5} at={0} out={l7} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid(40)}} />
        <div style={{position: 'relative', padding: '40px 50px'}}>
          <Label size={26}>EPF interest · saalana</Label>
          <div style={{fontFamily: F.display, fontSize: 230, lineHeight: 1, marginTop: 30}}>
            {frame >= word('L06', '8.25', -2) ? <HL at={word('L06', '8.25', 14)}><Count from={0} to={8.25} at={word('L06', '8.25', -2)} dur={14} fmt={pct} /></HL> : '? %'}
          </div>
        </div>
      </Card>
      <Card id="epfo" x={220} y={900} w={640} h={130} rot={2} at={word('L06', 'epfo', -3)} out={l7} bg={C.paperLight}>
        <div style={{fontFamily: F.display, fontSize: 60, textAlign: 'center', marginTop: 26}}>EPFO · HAR SAAL TAY</div>
      </Card>

      {/* L07: interest on interest, every year */}
      <Card id="blk1" x={300} y={900} w={480} h={200} rot={-1} at={l7} out={l8} enter="up" bg={C.ink} texture="kraft">
        <div style={{fontFamily: F.display, fontSize: 96, color: C.paperLight, textAlign: 'center', marginTop: 40}}>₹3 LAKH</div>
      </Card>
      <Card id="blk2" x={300} y={770} w={480} h={130} rot={1} at={word('L07', 'interest', -2)} out={l8} enter="drop" bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 64, textAlign: 'center', marginTop: 28}}>+ INTEREST</div>
      </Card>
      <Card id="blk3" x={300} y={660} w={480} h={110} rot={-1.5} at={word('L07', 'bhi', 2)} out={l8} enter="drop" bg="#F9DD6B">
        <div style={{fontFamily: F.display, fontSize: 46, textAlign: 'center', marginTop: 26, whiteSpace: 'nowrap'}}>+ INTEREST PE INTEREST</div>
      </Card>
      <Stamp id="harsaal" text="Har saal" x={540} y={520} at={word('L07', 'har', -2)} out={l8} size={84} rot={-6} />

      {/* L08: age 28 to retirement at 58 = 30 years */}
      <Card id="ruler" x={90} y={460} w={900} h={420} rot={-1} at={l8} out={l9} enter="left" bg={C.card}>
        <div style={{padding: '34px 44px'}}>
          <Label size={24}>Umar</Label>
          <div style={{position: 'relative', height: 200, marginTop: 40}}>
            <div style={{position: 'absolute', left: 20, right: 20, top: 80, height: 30, border: `4px solid ${C.ink}`}} />
            <div style={{position: 'absolute', left: 24, top: 84, height: 30, width: 764 * fill, background: C.yellow}} />
            {Array.from({length: 31}).map((_, i) => (
              <div key={i} style={{position: 'absolute', left: 20 + (i / 30) * 772, top: i % 5 === 0 ? 60 : 70, width: 3, height: i % 5 === 0 ? 70 : 50, background: C.ink}} />
            ))}
            <Show at={word('L08', '28', -3)} style={{left: 0, top: 140}}><div style={{fontFamily: F.display, fontSize: 64}}>28</div></Show>
            <Show at={word('L08', 'retirement', -3)} style={{right: 0, top: 140, textAlign: 'right'}}><div style={{fontFamily: F.display, fontSize: 64}}>58 <span style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 2}}>RETIREMENT</span></div></Show>
          </div>
        </div>
      </Card>
      <Card id="yrs30" x={360} y={900} w={360} h={160} rot={-3} at={word('L08', '30', -3)} out={l9} bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 110, textAlign: 'center', marginTop: 18}}>30 SAAL</div>
      </Card>

      {/* L09-L10: ₹3 lakh at 8.25% for 30 years */}
      <Card id="chart" x={90} y={420} w={900} h={780} rot={-0.8} at={l9} out={l11} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid(40)}} />
        <div style={{position: 'relative', padding: '30px 40px'}}>
          <Label size={22}>₹3 lakh · 8.25% · 30 saal</Label>
          <GrowthBars x={40} y={170} w={780} h={440} at={barsAt} dur={barsDur} />
          <Show at={barsAt} style={{left: 20, top: 640}}><div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 2}}>SAAL 1 · ₹3 L</div></Show>
          <Show at={barsAt + barsDur} style={{right: 30, top: 640}}><div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 2}}>SAAL 30</div></Show>
        </div>
      </Card>
      <Card id="v32" x={560} y={478} w={370} h={130} rot={3} at={word('L09', '₹32', -3)} out={l11} bg={C.yellow} z={20}>
        <div style={{fontFamily: F.display, fontSize: 88, textAlign: 'center', marginTop: 12}}>₹32 LAKH</div>
      </Card>
      <Stamp id="ekbaar" text="Sirf ek baar" x={380} y={760} at={word('L10', 'ek', -2)} out={l11} size={72} rot={-7} />
      <Hand x={150} y={1105} at={word('L10', 'koi', -2)} out={l11} size={56} rot={-2} w={760}>koi naya contribution nahi!</Hand>

      {/* L11: withdraw at every switch -> starts from zero each time */}
      <Card id="saw" x={90} y={420} w={900} h={780} rot={0.8} at={l11} enter="right" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid(40)}} />
        <div style={{position: 'relative', padding: '30px 40px'}}>
          <Label size={22}>Har switch pe nikaala</Label>
          <div style={{position: 'absolute', left: 60, top: 170, width: 780, height: 440}}>
            <Sawtooth w={780} h={440} at={word('L11', 'switch', -2)} dur={Math.max(30, word('L11', 'toh', 0) - word('L11', 'switch', -2))} ghostAt={l11 + 4} />
          </div>
          <Show at={l11 + 6} style={{left: 360, top: 120}}><div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 44, color: C.inkSoft}}>-- agar chhoda hota</div></Show>
          <Show at={word('L11', 'switch', 8)} style={{left: 40, top: 84}}><div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 2, color: C.red}}>| = JOB SWITCH + NIKAALA</div></Show>
        </div>
      </Card>
      <Stamp id="zero" text="Zero se shuru" x={560} y={1130} at={word('L11', 'zero', -2)} out={length + 10} size={78} rot={-5} />
      {frame >= word('L11', 'switch', 0) ? <Sfx at={word('L11', 'switch', 0)} name="marker" volume={0.25} /> : null}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- tax
const Tax: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l13 = at('L13'), l14 = at('L14');
  const fill = interpolate(stepped(frame), [4, 20], [0, 1], clamp);
  const cut = ease(stepped(frame), word('L14', 'poore', -2), word('L14', 'poore', 8));
  return (
    <AbsoluteFill>
      {/* L12: before 5 years of continuous service */}
      <Card id="svc" x={90} y={440} w={900} h={380} rot={-1} at={0} out={l14} enter="up" bg={C.card}>
        <div style={{padding: '34px 44px'}}>
          <Label size={24}>Continuous service</Label>
          <div style={{position: 'relative', height: 220, marginTop: 30}}>
            <div style={{position: 'absolute', left: 10, right: 10, top: 70, height: 46, border: `4px solid ${C.ink}`}} />
            <div style={{position: 'absolute', left: 14, top: 74, height: 46, width: 784 * 0.6 * fill, background: C.newsprint}} />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{position: 'absolute', left: 10 + (i / 5) * 792, top: 130, transform: 'translateX(-50%)', fontFamily: F.mono, fontWeight: 700, fontSize: 24}}>{i}</div>
            ))}
            <Show at={word('L12', '5', -3)} style={{right: -10, top: 0}}><div style={{background: C.yellow, fontFamily: F.display, fontSize: 52, padding: '2px 16px'}}>5 SAAL</div></Show>
            <Show at={word('L12', 'pehle', -3)} style={{left: 410, top: 150}}><div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 52, color: C.red}}>↑ yahan nikaala?</div></Show>
          </div>
        </div>
      </Card>
      <Marker id="svcline" d={wobblyLine('sl', 572, 520, 572, 660, 8)} at={word('L12', 'pehle', -1)} dur={6} out={l14} color={C.red} width={9} />

      {/* L13: taxable, TDS */}
      <Stamp id="taxable" text="Taxable" sub="HO SAKTA HAI" x={330} y={980} at={word('L13', 'taxable', -2)} out={l14} size={92} rot={-6} />
      <Card id="tds" x={620} y={890} w={330} h={170} rot={4} at={word('L13', 'tds', -3)} out={l14} bg={C.paperLight}>
        <div style={{fontFamily: F.display, fontSize: 96, textAlign: 'center', marginTop: 24}}>TDS ✂</div>
      </Card>

      {/* L14: not even the full ₹3 lakh in hand */}
      <Card id="hand" x={110} y={460} w={860} h={420} rot={-1.5} at={l14} enter="right" bg={C.card}>
        <div style={{padding: '34px 44px'}}>
          <Label size={24}>Haath mein</Label>
          <div style={{fontFamily: F.display, fontSize: 150, lineHeight: 1, marginTop: 30}}>₹3 LAKH ?</div>
          <div style={{position: 'relative', marginTop: 40, height: 70, border: `4px solid ${C.ink}`}}>
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${100 - 14 * cut}%`, background: C.yellow}} />
            <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: `${14 * cut}%`, backgroundImage: `repeating-linear-gradient(45deg, ${C.red} 0 6px, transparent 6px 14px)`}} />
          </div>
        </div>
      </Card>
      <Hand x={560} y={920} at={word('L14', 'poore', -2)} size={66} rot={-4}>poore nahi!</Hand>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- transfer
const Transfer: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l16 = at('L16'), l17 = at('L17'), l18 = at('L18'), l19 = at('L19');
  const naukri = word('L16', 'naukri', -2);
  const svc = ease(stepped(frame), word('L18', 'service', -2), word('L18', 'service', 14));
  return (
    <AbsoluteFill>
      {/* L15: transfer, don't withdraw */}
      <div style={{position: 'absolute', left: 110, top: 450, width: 860}}>
        <Show at={0} out={l16}><Big words={['TOH', 'KAREIN', 'KYA?']} at={2} gap={4} size={130} /></Show>
      </div>
      <Card id="tr" x={110} y={760} w={520} h={200} rot={-2} at={word('L15', 'transfer', -3)} out={l16} bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 110, textAlign: 'center', marginTop: 30}}>TRANSFER ✓</div>
      </Card>
      <Card id="nk" x={650} y={790} w={320} h={160} rot={3} at={word('L15', 'nikaalo', -3)} out={l16} bg={C.paperLight}>
        <div style={{fontFamily: F.display, fontSize: 78, textAlign: 'center', marginTop: 34}}>NIKAALO</div>
      </Card>
      <Cross id="nkx" x={670} y={800} w={280} h={140} at={word('L15', 'mat', -2)} out={l16} />

      {/* L16: one UAN for every job */}
      <Card id="uan" x={300} y={430} w={480} h={240} rot={-1.5} at={l16} out={l17} enter="drop" bg={C.ink} texture="kraft">
        <div style={{padding: '30px 40px', color: C.paperLight}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3}}>AAPKA</div>
          <div style={{fontFamily: F.display, fontSize: 130, lineHeight: 1, color: C.yellow}}>UAN</div>
        </div>
      </Card>
      {['COMPANY A', 'COMPANY B', 'COMPANY C'].map((t, i) => (
        <React.Fragment key={t}>
          <Card id={'job' + i} x={90 + i * 300} y={880} w={270} h={150} rot={[-3, 2, -2][i]} at={naukri + i * 5} out={l17} bg={C.card}>
            <div style={{fontFamily: F.display, fontSize: 48, textAlign: 'center', marginTop: 20}}>{t}</div>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: 2, textAlign: 'center', marginTop: 8}}>WAHI UAN ✓</div>
          </Card>
          <Marker id={'uanl' + i} d={wobblyLine('ul' + i, 540, 680, 225 + i * 300, 870, 24)} at={naukri + i * 5 + 2} dur={6} out={l17} color={C.ink} width={6} />
        </React.Fragment>
      ))}
      <Hand x={130} y={720} at={word('L16', 'ek', -2)} out={l17} size={56} rot={-4}>ek hi!</Hand>

      {/* L17: move old PF into the new account, online */}
      <Card id="portal" x={260} y={420} w={560} h={110} rot={-1} at={l17} out={l18} enter="drop" bg={C.paperLight}>
        <div style={{fontFamily: F.display, fontSize: 64, textAlign: 'center', marginTop: 18}}>EPFO PORTAL</div>
      </Card>
      <Card id="oldpf" x={100} y={600} w={350} h={270} rot={-3} at={word('L17', 'purana', -3)} out={l18} bg={C.card}>
        <div style={{padding: '28px 32px'}}>
          <Label size={20}>Company A</Label>
          <div style={{fontFamily: F.display, fontSize: 80, lineHeight: 1, marginTop: 26}}>PURANA PF</div>
        </div>
      </Card>
      <Card id="newpf" x={630} y={600} w={350} h={270} rot={3} at={word('L17', 'naye', -3)} out={l18} bg={C.yellow}>
        <div style={{padding: '28px 32px'}}>
          <Label size={20}>Company B</Label>
          <div style={{fontFamily: F.display, fontSize: 80, lineHeight: 1, marginTop: 26}}>NAYA ACCOUNT</div>
        </div>
      </Card>
      <Marker id="trarrow" d={wobblyLine('ta', 460, 740, 620, 740, 14)} at={word('L17', 'transfer', -3)} dur={8} out={l18} color={C.ink} width={12} />
      <Marker id="trhead" d="M590,712 L624,740 L590,768" at={word('L17', 'transfer', 4)} dur={4} out={l18} color={C.ink} width={12} />
      <Stamp id="online" text="Online ✓" x={540} y={1000} at={word('L17', 'online', -2)} out={l18} size={88} rot={-5} />

      {/* L18: money keeps growing, service keeps adding up */}
      <Card id="cont" x={90} y={420} w={900} h={800} rot={-0.6} at={l18} out={l19} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid(40)}} />
        <div style={{position: 'relative', padding: '30px 40px'}}>
          <Label size={22}>Transfer kiya · paisa chalta raha</Label>
          <GrowthBars x={40} y={120} w={780} h={330} at={word('L18', 'paisa', -2)} dur={36} />
          <div style={{position: 'absolute', left: 40, top: 520, width: 780}}>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, marginBottom: 12}}>SERVICE</div>
            <div style={{display: 'flex', height: 70, border: `4px solid ${C.ink}`}}>
              <div style={{width: '45%', background: C.newsprint, fontFamily: F.display, fontSize: 34, textAlign: 'center', lineHeight: '62px'}}>COMPANY A</div>
              <div style={{width: `${55 * svc}%`, background: C.yellow, fontFamily: F.display, fontSize: 34, textAlign: 'center', lineHeight: '62px', overflow: 'hidden', whiteSpace: 'nowrap'}}>+ COMPANY B</div>
            </div>
          </div>
        </div>
      </Card>
      <Card id="yrs5" x={620} y={1060} w={320} h={120} rot={3} at={word('L18', '5', -3)} out={l19} bg={C.yellow} z={20}>
        <div style={{fontFamily: F.display, fontSize: 70, textAlign: 'center', marginTop: 18}}>5 SAAL ✓</div>
      </Card>

      {/* L19: real emergency -> take only what you need */}
      <Hand x={110} y={460} at={l19} size={62} rot={-4}>emergency?</Hand>
      <Jar x={360} y={430} at={l19} pourAt={word('L19', 'zaroorat', -2)} />
      <Card id="poora" x={90} y={640} w={270} h={140} rot={-4} at={word('L19', 'poora', -3)} bg={C.paperLight}>
        <div style={{fontFamily: F.display, fontSize: 80, textAlign: 'center', marginTop: 22}}>POORA</div>
      </Card>
      <Cross id="poorax" x={110} y={650} w={230} h={120} at={word('L19', 'nahi', -2)} />
      <Card id="zj" x={600} y={900} w={350} h={190} rot={4} at={word('L19', 'zaroorat', -3)} bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 70, lineHeight: 1.05, textAlign: 'center', marginTop: 26}}>ZAROORAT<br />JITNA ✓</div>
      </Card>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- outro
const Outro: React.FC = () => (
  <AbsoluteFill>
    <SignOff share="L20" sign="L21" who="us dost ko jisne abhi resign kiya hai →" note="ILLUSTRATIVE: ₹3 LAKH · 8.25% (EPF, FY 2025-26) · 30 SAAL · NO NEW CONTRIBUTIONS" />
  </AbsoluteFill>
);

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  compound: Compound,
  tax: Tax,
  transfer: Transfer,
  outro: Outro,
};
