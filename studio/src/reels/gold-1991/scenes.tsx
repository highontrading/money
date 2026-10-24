import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Big, Card, Count, Cross, HL, Label, Marker, Photo, Sfx, Stamp, Tape} from '../../components/paper';
import {ease, stepped} from '../../lib/motion';
import {useCues} from '../../lib/timeline';
import {C, F} from '../../theme';
import {SignOff} from '../common';
import {arrowPath, BankFacade, Center, Gauge, GoldPhoto, Hourglass, Lines, Pin, Pop, Route, Show, Typed} from './props';

const grid = (cell = 40, color = 'rgba(70, 110, 150, 0.14)') => ({
  backgroundImage: `linear-gradient(${color} 1.5px, transparent 1.5px), linear-gradient(90deg, ${color} 1.5px, transparent 1.5px)`,
  backgroundSize: `${cell}px ${cell}px`,
});

// A paper world-map card: sea grid, loose land blobs.
const MapCard: React.FC<{id: string; x: number; y: number; w: number; h: number; at: number; out?: number; title: string}> = ({id, x, y, w, h, at, out, title}) => (
  <Card id={id} x={x} y={y} w={w} h={h} rot={0.6} at={at} out={out} enter="up" bg="#E3DDCF">
    <div style={{position: 'absolute', inset: 0, ...grid(48, 'rgba(70,110,150,0.12)')}} />
    <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0}}>
      <path d={`M${w * 0.05},${h * 0.28} Q${w * 0.18},${h * 0.12} ${w * 0.34},${h * 0.2} Q${w * 0.42},${h * 0.36} ${w * 0.3},${h * 0.5} Q${w * 0.14},${h * 0.52} ${w * 0.05},${h * 0.28} Z`} fill="#CFC6B2" />
      <path d={`M${w * 0.48},${h * 0.48} Q${w * 0.62},${h * 0.38} ${w * 0.72},${h * 0.52} Q${w * 0.7},${h * 0.8} ${w * 0.6},${h * 0.92} Q${w * 0.5},${h * 0.72} ${w * 0.48},${h * 0.48} Z`} fill="#CFC6B2" />
      <path d={`M${w * 0.8},${h * 0.18} Q${w * 0.9},${h * 0.12} ${w * 0.95},${h * 0.24} Q${w * 0.9},${h * 0.36} ${w * 0.82},${h * 0.3} Z`} fill="#CFC6B2" />
    </svg>
    <div style={{position: 'absolute', left: 20, bottom: 18}}><Label size={20}>{title}</Label></div>
  </Card>
);

// ---------------------------------------------------------------- hook
const Hook: React.FC = () => {
  const {at, word} = useCues();
  const l2 = at('L02'), l3 = at('L03');
  const lvl = 1 - 0.84 * ease(stepped(useCurrentFrame()), l3 + 6, word('L03', 'hafton', 4));
  return (
    <AbsoluteFill>
      {/* L01: a dossier, a plane, gold */}
      <Card id="h-dos" x={100} y={410} w={880} h={380} rot={-1.2} at={0} out={l3} enter="up" bg={C.card}>
        <div style={{background: C.ink, color: C.paperLight, fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 4, padding: '12px 26px'}}>DOSSIER · FOREIGN RESERVES</div>
        <div style={{padding: '22px 34px'}}>
          <div style={{fontFamily: F.display, fontSize: 120, lineHeight: 1}}><HL at={word('L01', 'july', -2)}>JULY 1991</HL></div>
          <div style={{marginTop: 18, width: 470}}>
            <Typed at={word('L01', 'chupke', -2)} text={'Cargo: sona.\nManzil: videsh.'} cps={1.4} style={{fontSize: 34}} />
          </div>
        </div>
      </Card>
      <Stamp id="h-conf" text="Confidential" x={420} y={752} at={word('L01', 'chupke', 2)} out={l3} size={56} rot={-6} />
      <Photo id="h-gold" src="gold_bars.jpg" x={620} y={520} w={330} h={240} rot={4} at={word('L01', 'sona', -3)} out={l3} enter="drop" pos="50% 55%" caption="SONA" />
      <Tape id="h-goldt" x={720} y={500} w={130} rot={-8} at={word('L01', 'sona', -1)} out={l3} />

      <MapCard id="h-map" x={90} y={820} w={900} h={400} at={word('L01', 'plane', -6)} out={l3} title="ROUTE" />
      <Pin x={290} y={1100} at={word('L01', 'plane', -2)} out={l3} label="INDIA" />
      <Pin x={780} y={920} at={word('L01', 'videsh', -2)} out={l3} label="VIDESH" />
      <Route x1={290} y1={1100} cx={500} cy={830} x2={640} y2={960} at={word('L01', 'plane', 0)} fly={word('L01', 'plane', 2)} land={word('L01', 'videsh', 8)} out={l3} seed="h-r" />

      {/* L02: pawned */}
      <Stamp id="h-girvi" text="Girvi" sub="PLEDGED · COLLATERAL" x={540} y={1000} at={word('L02', 'girvi', -2)} out={l3} size={150} rot={-9} />

      {/* L03: reserves gauge near empty */}
      <Card id="h-gauge" x={120} y={430} w={840} h={640} rot={-1} at={l3} enter="up" bg={C.card}>
        <div style={{position: 'absolute', left: 30, top: 26}}><Label size={22}>Videshi mudra · forex reserves</Label></div>
        <div style={{position: 'absolute', left: 50, top: 110}}><Gauge w={740} level={lvl} label="DOLLAR KA TANK" /></div>
      </Card>
      <Card id="h-weeks" x={240} y={1080} w={600} h={140} rot={2} at={word('L03', 'hafton', -4)} bg={C.yellow}>
        <Center><div style={{fontFamily: F.display, fontSize: 76, lineHeight: 1, whiteSpace: 'nowrap'}}>BAS KUCH HAFTE!</div></Center>
      </Card>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- why
const Why: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l5 = at('L05'), l6 = at('L06'), l7 = at('L07');
  const drain = ease(stepped(frame), l6 + 4, word('L06', 'khaali', 4));
  return (
    <AbsoluteFill>
      {/* L04: what India buys in dollars */}
      <Card id="w-india" x={330} y={930} w={420} h={170} rot={-1} at={0} out={l5} enter="up" bg={C.ink} texture="kraft">
        <Center><div style={{fontFamily: F.display, fontSize: 96, color: C.paperLight, lineHeight: 1}}>INDIA</div></Center>
      </Card>
      {([['TEL', 120, 'tel'], ['KHAAD', 400, 'khaad'], ['MACHINERY', 680, 'machinery']] as const).map(([t, x, k], i) => (
        <React.Fragment key={k}>
          <Card id={'w-' + k} x={x} y={450} w={260} h={130} rot={[-3, 2, -1][i]} at={word('L04', k, -3)} out={l5} bg={C.paperLight}>
            <Center><div style={{fontFamily: F.display, fontSize: t.length > 6 ? 50 : 70, lineHeight: 1}}>{t}</div></Center>
          </Card>
          <Marker id={'w-a' + k} d={arrowPath(540, 920, x + 130, 600)} at={word('L04', k, 0)} dur={6} out={l5} color={C.ink} width={6} />
        </React.Fragment>
      ))}
      <Card id="w-usd" x={250} y={1112} w={580} h={130} rot={2} at={word('L04', 'dollar', -3)} out={l5} bg={C.yellow} z={60}>
        <Center><div style={{fontFamily: F.display, fontSize: 74, lineHeight: 1}}>SAB DOLLAR MEIN $</div></Center>
      </Card>

      {/* L05: 1990 Gulf War clipping */}
      <Card id="w-clip" x={100} y={410} w={600} h={520} rot={-2} at={l5} out={l6} enter="left" bg="#E6DFCF" texture="news" torn={{right: true, bottom: true}} rough={12}>
        <div style={{padding: '24px 30px'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: 3, color: C.inkSoft}}>WORLD · NEWS</div>
          <div style={{fontFamily: F.display, fontSize: 92, lineHeight: 0.95, marginTop: 10}}>KHAADI MEIN JUNG</div>
          <div style={{marginTop: 22}}><Lines n={9} seed="w-cl" /></div>
        </div>
      </Card>
      <Card id="w-1990" x={560} y={400} w={260} h={130} rot={6} at={word('L05', '1990', -3)} out={l6} bg={C.yellow}>
        <Center><div style={{fontFamily: F.display, fontSize: 96, lineHeight: 1}}>1990</div></Center>
      </Card>
      <Card id="w-oil" x={640} y={600} w={330} h={150} rot={3} at={word('L05', 'tel', -3)} out={l6} bg={C.paperLight}>
        <Center><div style={{fontFamily: F.display, fontSize: 64, lineHeight: 1, color: C.red}}>TEL ↑ MEHNGA</div></Center>
      </Card>
      <Card id="w-rem" x={360} y={960} w={600} h={230} rot={-1.5} at={word('L05', 'khaadi', -3)} out={l6} bg={C.card}>
        <div style={{padding: '20px 28px'}}>
          <Label size={20}>Khaadi se aane wala paisa</Label>
          <div style={{display: 'flex', alignItems: 'flex-end', gap: 16, marginTop: 18, height: 100}}>
            {[1, 0.75, 0.5, 0.3].map((v, i) => {
              const p = ease(stepped(frame), word('L05', 'ghata', -10) + i * 2, word('L05', 'ghata', -2) + i * 2);
              const hh = 100 * (1 - (1 - v) * p);
              return <div key={i} style={{width: 70, height: hh, background: i === 0 ? C.ink : C.inkSoft, border: `3px solid ${C.ink}`}} />;
            })}
            <div style={{fontFamily: F.display, fontSize: 70, color: C.red, marginLeft: 20, lineHeight: 1, opacity: frame >= word('L05', 'ghata', -2) ? 1 : 0}}>↓ GHATA</div>
          </div>
        </div>
      </Card>

      {/* L06: in vs out, treasury drains */}
      <Card id="w-tank" x={330} y={430} w={420} h={560} rot={-0.8} at={l6} out={l7} enter="up" bg={C.card}>
        <div style={{position: 'absolute', left: 24, top: 20}}><Label size={22}>Khazana</Label></div>
        <div style={{position: 'absolute', left: 60, right: 60, top: 90, bottom: 40, border: `6px solid ${C.ink}`, background: C.paperLight, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${(1 - drain * 0.92) * 100}%`, background: C.yellow, borderTop: `5px solid ${C.ink}`}} />
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: 120, opacity: 0.85}}>$</div>
        </div>
      </Card>
      <Card id="w-in" x={90} y={560} w={230} h={130} rot={-3} at={word('L06', 'aa', -3)} out={l7} bg={C.paperLight}>
        <Center><div style={{fontFamily: F.display, fontSize: 46, lineHeight: 1.05, textAlign: 'center'}}>AA RAHE:<br /><span style={{color: C.inkSoft}}>KAM</span></div></Center>
      </Card>
      <Marker id="w-inA" d={arrowPath(320, 625, 380, 625)} at={word('L06', 'kam', 0)} dur={4} out={l7} color={C.ink} width={5} />
      <Card id="w-out" x={760} y={760} w={220} h={130} rot={3} at={word('L06', 'jaa', -3)} out={l7} bg={C.paperLight}>
        <Center><div style={{fontFamily: F.display, fontSize: 46, lineHeight: 1.05, textAlign: 'center'}}>JAA RAHE:<br /><span style={{color: C.red}}>ZYADA</span></div></Center>
      </Card>
      <Marker id="w-outA" d={arrowPath(700, 825, 790, 825)} at={word('L06', 'zyada', 0)} dur={4} out={l7} color={C.red} width={10} />
      <Stamp id="w-khaali" text="Khazana khaali" x={540} y={1100} at={word('L06', 'khaali', -2)} out={l7} size={84} rot={-6} />

      {/* L07: default would end trust */}
      <div style={{position: 'absolute', left: 110, top: 440, width: 860}}>
        <Show from={l7}><Big words={['AGAR', 'KARZ', 'NA', 'CHUKA', 'PAATA?']} at={l7} gap={4} size={140} /></Show>
      </div>
      <Card id="w-ledger" x={140} y={790} w={520} h={300} rot={-2} at={word('L07', 'karz', -2)} bg={C.card}>
        <div style={{padding: '22px 30px'}}>
          <Label size={20}>Karz · installment</Label>
          <div style={{fontFamily: F.type, fontSize: 36, marginTop: 22, lineHeight: 1.5}}>Due: $ .......<br />Paid: ?</div>
        </div>
      </Card>
      <Stamp id="w-trust" text="Bharosa khatam" sub="DUNIYA KI NAZAR MEIN" x={690} y={1060} at={word('L07', 'bharosa', -2)} size={70} rot={-8} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- gold
const Gold: React.FC = () => {
  const {at, word} = useCues();
  const l9 = at('L09'), l10 = at('L10');
  return (
    <AbsoluteFill>
      {/* L08: RBI pledges 46.91 t with BoE and BoJ */}
      <Photo id="g-rbi" src="rbi_tower.jpg" x={90} y={410} w={290} h={370} rot={-2} at={0} out={l10} enter="left" pos="50% 40%" caption="RBI · MUMBAI" />
      <Card id="g-gold" x={90} y={810} w={480} h={400} rot={1} at={word('L08', '46.91', -6)} out={l10} enter="up" bg={C.card} texture={null}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 270}}><GoldPhoto pos="50% 55%" /></div>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 130, background: C.yellow, borderTop: `4px solid ${C.ink}`}}>
          <Center><div style={{fontFamily: F.display, fontSize: 92, lineHeight: 1, whiteSpace: 'nowrap'}}><Count from={0} to={46.91} at={word('L08', '46.91', 0)} dur={16} fmt={(n) => n.toFixed(2)} /> TONNE</div></Center>
        </div>
      </Card>
      <Tape id="g-goldt" x={260} y={790} w={140} rot={-6} at={word('L08', '46.91', -2)} out={l10} />
      {([['BANK OF', 'ENGLAND', 'LONDON', 450, 'england'], ['BANK OF', 'JAPAN', 'TOKYO', 690, 'japan']] as const).map(([a, b, city, y, k], i) => (
        <React.Fragment key={k}>
          <Card id={'g-' + k} x={600} y={y} w={370} h={210} rot={[2, -1.5][i]} at={word('L08', k, -4)} out={l10} enter="right" bg={C.paperLight}>
            <div style={{position: 'absolute', left: 22, top: 26, width: 110, height: 110}}><BankFacade w={110} h={110} label="BANK" /></div>
            <div style={{position: 'absolute', left: 150, top: 30, fontFamily: F.display, fontSize: 52, lineHeight: 1.02}}>{a}<br />{b}</div>
            <div style={{position: 'absolute', left: 22, bottom: 16}}><Label size={18}>{city}</Label></div>
          </Card>
          <Marker id={'g-a' + k} d={arrowPath(560, 900, 610, y + 120)} at={word('L08', k, 2)} dur={5} out={l10} color={C.ink} width={6} />
        </React.Fragment>
      ))}
      <Stamp id="g-girvi" text="Girvi" x={330} y={930} at={word('L08', 'girvi', -2)} out={l10} size={100} rot={-10} paper />

      {/* L09: about 40 crore dollars received */}
      <Card id="g-recv" x={600} y={930} w={370} h={260} rot={-2} at={l9} out={l10} enter="up" bg={C.yellow}>
        <div style={{padding: '20px 24px'}}>
          <Label size={18}>Badle mein mila</Label>
          <div style={{fontFamily: F.display, fontSize: 78, lineHeight: 1, marginTop: 18, whiteSpace: 'nowrap'}}>≈ <Count from={0} to={40} at={l9 + 4} dur={Math.max(6, word('L09', '40', 0) - l9 - 4)} fmt={(n) => String(Math.round(n))} /> CRORE</div>
          <div style={{fontFamily: F.display, fontSize: 62, lineHeight: 1, marginTop: 6}}>DOLLAR $</div>
        </div>
      </Card>

      {/* L10: 20 tonnes earlier, to Switzerland */}
      <Pop x={110} y={430} at={l10} size={110}>USSE PEHLE BHI:</Pop>
      <Photo id="g-gold2" src="gold_bars.jpg" x={110} y={600} w={420} h={300} rot={-3} at={word('L10', '20', -4)} enter="drop" pos="30% 50%" />
      <Card id="g-20t" x={150} y={930} w={360} h={140} rot={2} at={word('L10', '20', -2)} bg={C.yellow}>
        <Center><div style={{fontFamily: F.display, fontSize: 90, lineHeight: 1}}>20 TONNE</div></Center>
      </Card>
      <Marker id="g-swA" d={arrowPath(560, 760, 660, 760)} at={word('L10', 'switzerland', -4)} dur={5} color={C.ink} width={7} />
      <Card id="g-swiss" x={680} y={640} w={290} h={240} rot={3} at={word('L10', 'switzerland', -3)} bg={C.paperLight}>
        <Center><div style={{fontFamily: F.display, fontSize: 52, lineHeight: 1.05, textAlign: 'center'}}>SWITZER-<br />LAND</div></Center>
      </Card>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- reform
const Reform: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l12 = at('L12'), l13 = at('L13');
  const sand = ease(stepped(frame), word('L11', 'waqt', -2), word('L11', 'tha', 10));
  return (
    <AbsoluteFill>
      {/* L11: gold only buys time */}
      <Card id="r-time" x={100} y={420} w={880} h={420} rot={-1} at={0} out={l12} enter="up" bg={C.card}>
        <div style={{position: 'absolute', left: 30, top: 50, width: 300, height: 240, border: `4px solid ${C.ink}`, overflow: 'hidden'}}><GoldPhoto /></div>
        <div style={{position: 'absolute', left: 350, top: 120, fontFamily: F.display, fontSize: 120, lineHeight: 1}}>=</div>
        <div style={{position: 'absolute', left: 440, top: 34}}><Hourglass size={290} p={sand} /></div>
        <div style={{position: 'absolute', left: 665, top: 136, fontFamily: F.display, fontSize: 84, lineHeight: 1}}>{frame >= word('L11', 'waqt', -2) ? <HL at={word('L11', 'waqt', 0)}>WAQT</HL> : null}</div>
        <div style={{position: 'absolute', left: 30, bottom: 26}}><Label size={22}>Sona sirf waqt khareedta hai</Label></div>
      </Card>
      <Card id="r-cure" x={180} y={890} w={720} h={200} rot={2} at={word('L11', 'asli', -3)} out={l12} bg={C.yellow}>
        <Center><div style={{fontFamily: F.display, fontSize: 86, lineHeight: 1, whiteSpace: 'nowrap'}}>ASLI ILAAJ: BADLAAV</div></Center>
      </Card>

      {/* L12: 1991 reforms checklist */}
      <Card id="r-list" x={90} y={420} w={900} h={760} rot={-0.6} at={l12} out={l13} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'relative', padding: '34px 44px'}}>
          <div style={{fontFamily: F.display, fontSize: 100, lineHeight: 1}}><HL at={word('L12', '1991', 0)}>1991</HL> KE REFORMS</div>
          {([['LICENSE RAJ DHEELA', 'license'], ['RUPAYA DEVALUE', 'rupaya'], ['VIDESHI COMPANY: DARWAZA ✓', 'videshi']] as const).map(([t, k], i) => {
            const a = word('L12', k, -3);
            const on = frame >= a;
            return (
              <div key={k} style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: i === 0 ? 50 : 34, opacity: on ? 1 : 0, transform: `translateX(${(1 - ease(stepped(frame), a, a + 6)) * -40}px)`}}>
                <div style={{width: 64, height: 64, border: `5px solid ${C.ink}`, background: C.paperLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: 52}}>{frame >= a + 6 ? '✓' : ''}</div>
                <div style={{fontFamily: F.display, fontSize: 64, lineHeight: 1, whiteSpace: 'nowrap'}}>{t}</div>
              </div>
            );
          })}
        </div>
      </Card>
      <Show from={l12}><Sfx at={word('L12', 'license', 4)} name="tick" volume={0.4} /><Sfx at={word('L12', 'rupaya', 4)} name="tick" volume={0.4} /><Sfx at={word('L12', 'videshi', 4)} name="tick" volume={0.4} /></Show>

      {/* L13: pledge released by year-end */}
      <Card id="r-pledge" x={120} y={430} w={840} h={520} rot={1} at={l13} enter="up" bg={C.card} texture={null}>
        <div style={{position: 'absolute', inset: 0}}><GoldPhoto pos="50% 60%" /></div>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, background: C.ink, color: C.paperLight, fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 4, padding: '12px 24px'}}>WOH GIRVI SONA</div>
      </Card>
      <Stamp id="r-girvi" text="Girvi" x={400} y={640} at={word('L13', 'girvi', -2)} out={word('L13', 'chhuda', -2)} size={110} rot={-10} paper />
      <Cross id="r-gx" x={250} y={560} w={300} h={160} at={word('L13', 'chuka', -2)} out={word('L13', 'chhuda', -2)} />
      <Card id="r-end" x={150} y={980} w={460} h={150} rot={-2} at={word('L13', 'end', -4)} bg={C.paperLight}>
        <Center><div style={{fontFamily: F.display, fontSize: 60, lineHeight: 1, whiteSpace: 'nowrap'}}>1991 KE END TAK</div></Center>
      </Card>
      <Stamp id="r-free" text="Chhuda liya ✓" sub="KARZ CHUKAYA" x={600} y={680} at={word('L13', 'chhuda', -2)} size={86} rot={-7} color={C.ink} paper />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- today
const Today: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l15 = at('L15'), l16 = at('L16');
  const grow = ease(stepped(frame), word('L14', '700', -6), word('L14', 'dollar', 4));
  const BASE = 1150;
  return (
    <AbsoluteFill>
      {/* L14: reserves now */}
      <Card id="t-chart" x={90} y={410} w={900} h={820} rot={0.5} at={0} out={l15} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'absolute', left: 30, top: 26}}><Label size={22}>Forex reserves</Label></div>
      </Card>
      <Show until={l15}>
        <div style={{position: 'absolute', left: 170, top: BASE - 22, width: 240, height: 22, background: C.red, border: `4px solid ${C.ink}`, zIndex: 30}} />
        <Pop x={170} y={BASE - 120} w={240} align="center" at={4} out={l15} size={44} color={C.red}>kuch hafte</Pop>
        <Pop x={170} y={BASE + 20} w={240} align="center" at={4} out={l15} size={34} font={F.mono}>1991</Pop>
        {frame >= word('L14', '700', -6) ? (
          <div style={{position: 'absolute', left: 560, top: BASE - 620 * grow, width: 300, height: 620 * grow, background: C.yellow, border: `5px solid ${C.ink}`, zIndex: 30, boxShadow: `6px 8px 0 ${C.shadow}`}} />
        ) : null}
        <Pop x={520} y={BASE - 720} w={380} align="center" at={word('L14', '700', -2)} out={l15} size={80}>700+ BILLION $</Pop>
        <Pop x={560} y={BASE + 20} w={300} align="center" at={word('L14', 'aaj', -2)} out={l15} size={34} font={F.mono}>AAJ</Pop>
        <Marker id="t-base" d={`M140,${BASE} L940,${BASE}`} at={2} dur={6} out={l15} color={C.ink} width={5} />
      </Show>

      {/* L15: 2024, 100 tonnes flown home */}
      <MapCard id="t-map" x={90} y={420} w={900} h={560} at={l15} title="2024 · WAPSI" />
      <Pin x={330} y={540} at={word('L15', 'uk', -3)} label="UK" />
      <Pin x={640} y={880} at={word('L15', 'india', -3)} label="INDIA" side="left" />
      <Route x1={330} y1={540} cx={600} cy={500} x2={640} y2={880} at={word('L15', 'uk', -1)} fly={word('L15', 'wapas', -4)} land={word('L15', 'laaya', 10)} seed="t-r" />
      <Card id="t-2024" x={110} y={1010} w={300} h={150} rot={-3} at={word('L15', '2024', -3)} bg={C.paperLight}>
        <Center><div style={{fontFamily: F.display, fontSize: 100, lineHeight: 1}}>2024</div></Center>
      </Card>
      <Card id="t-100" x={460} y={1010} w={480} h={150} rot={2} at={word('L15', '100', -3)} bg={C.yellow}>
        <Center><div style={{fontFamily: F.display, fontSize: 96, lineHeight: 1, whiteSpace: 'nowrap'}}>100 TONNE</div></Center>
      </Card>

      {/* L16: back home */}
      <Photo id="t-gold" src="gold_bars.jpg" x={120} y={660} w={360} h={250} rot={-4} at={word('L16', 'sona', -3)} enter="drop" pos="60% 50%" />
      <Pop x={120} y={1180} at={word('L16', 'girvi', -2)} size={44} font={F.hand} color={C.inkSoft} rot={-2}>kabhi girvi...</Pop>
      <Stamp id="t-home" text="Wapas ghar" x={770} y={690} at={word('L16', 'ghar', -2)} size={76} rot={-8} color={C.ink} paper />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- outro
const Outro: React.FC = () => (
  <AbsoluteFill>
    <SignOff share="L17" sign="L18" who="us dost ko jo kehta hai history boring hai →" note="RBI GOLD PLEDGE · JULY 1991 · 46.91 T · ~US$405 MN · REPAID BY NOV 1991" />
  </AbsoluteFill>
);

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  why: Why,
  gold: Gold,
  reform: Reform,
  today: Today,
  outro: Outro,
};

export {MapCard};
