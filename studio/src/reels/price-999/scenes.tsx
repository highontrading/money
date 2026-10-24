import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Big, Card, Circle, Cross, Hand, HL, Label, Marker, Stamp, Tape} from '../../components/paper';
import {pop, stepped} from '../../lib/motion';
import {useCues} from '../../lib/timeline';
import {C, F} from '../../theme';
import {SignOff} from '../common';
import {Anchor, Brain, Glasses, Magnifier, mono, Nines, Pop, Show, Tag, useWordAt} from './props';

// ---------------------------------------------------------------- hook
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {at} = useCues();
  const w = useWordAt();
  const l2 = at('L02'), l3 = at('L03');
  return (
    <AbsoluteFill>
      {/* L01: two tags, one rupee apart */}
      <Card id="rail" x={70} y={398} w={940} h={20} at={0} out={l3} enter="fade" bg={C.kraft} texture="kraft" sfx={null} depth={0.4} />
      <Tag id="t999" x={120} y={448} w={380} h={450} rot={-3} at={2} out={l3} bg={C.yellow}>
        <div style={{textAlign: 'center', marginTop: 120}}>
          <div style={mono(24)}>Sale price</div>
          <div style={{fontFamily: F.display, fontSize: 150, lineHeight: 1.05}}>₹999</div>
        </div>
      </Tag>
      <Tag id="t1000" x={580} y={448} w={380} h={450} rot={3} at={w('L01', 2, -4)} out={l3}>
        <div style={{textAlign: 'center', marginTop: 120}}>
          <div style={mono(24)}>Price</div>
          <div style={{fontFamily: F.display, fontSize: 132, lineHeight: 1.12}}>₹1,000</div>
        </div>
      </Tag>
      <Card id="farak" x={250} y={950} w={580} h={150} rot={-1.5} at={w('L01', 3, -3)} out={l2} bg={C.card}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 26}}>
          <span style={{fontFamily: F.display, fontSize: 80}}>FARAK:</span>
          <span style={{fontFamily: F.display, fontSize: 96}}>
            {stepped(frame) < w('L01', 5, -2) ? '?' : <Pop at={w('L01', 5, -2)}><HL at={w('L01', 5, 2)}>&nbsp;₹1&nbsp;</HL></Pop>}
          </span>
        </div>
      </Card>

      {/* L02: the brain disagrees */}
      <Show from={w('L02', 1, -3)} until={l3}>
        <div style={{position: 'absolute', left: 90, top: 930, transform: `scale(${Math.min(1, pop(frame, w('L02', 1, -3)))}) rotate(-4deg)`, transformOrigin: '50% 80%', filter: `drop-shadow(5px 9px 8px ${C.shadow})`}}>
          <Brain w={380} />
        </div>
      </Show>
      <Card id="bubble" x={500} y={930} w={470} h={200} rot={3} at={w('L02', 5, -3)} out={l3} bg={C.yellow} torn={{left: true}} rough={10}>
        <div style={{fontFamily: F.display, fontSize: 92, textAlign: 'center', lineHeight: 0.95, marginTop: 28}}>BAHUT<br />SASTA!</div>
      </Card>

      {/* L03: the shopkeeper knows; three tricks */}
      <div style={{position: 'absolute', left: 100, top: 440, width: 880}}>
        <Show from={l3}><Big words={['DUKAANDAAR', 'JAANTE', 'HAIN.']} at={w('L03', 0, -2)} gap={4} size={124} /></Show>
      </div>
      {[0, 1, 2].map((i) => (
        <React.Fragment key={i}>
          <Card id={'tab' + i} x={90 + i * 310} y={790} w={280} h={330} rot={[-3, 1.5, -1.5][i]} at={w('L03', 7, -3) + i * 4} enter="up" bg={i === 2 ? C.yellow : C.card}>
            <div style={{textAlign: 'center', marginTop: 40}}>
              <div style={mono(26)}>Chaal</div>
              <div style={{fontFamily: F.display, fontSize: 190, lineHeight: 1}}>{i + 1}</div>
            </div>
          </Card>
          <Tape id={'ttab' + i} x={160 + i * 310} y={772} w={130} rot={[-8, 6, -4][i]} at={w('L03', 7, -1) + i * 4} />
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- left digit
const Left: React.FC = () => {
  const frame = useCurrentFrame();
  const {at} = useCues();
  const w = useWordAt();
  const l5 = at('L05'), l6 = at('L06');
  const l7 = w('L07', 1, -4); // hold the L05/L06 cards until the first new tag lands
  const first = w('L05', 6, -3);
  const big = stepped(frame) >= first ? Math.min(1.08, pop(frame, first)) : 0;
  return (
    <AbsoluteFill>
      {/* L04: trick one */}
      <Card id="ch1" x={110} y={470} w={860} h={420} rot={-2} at={0} out={l5} enter="drop" bg={C.card} torn={{bottom: true}}>
        <div style={{padding: '40px 50px'}}>
          <Label size={26}>Chaal 1</Label>
          <div style={{fontFamily: F.display, fontSize: 190, lineHeight: 1, marginTop: 30}}><HL at={w('L04', 2, -2)}>LEFT</HL> DIGIT</div>
        </div>
      </Card>
      <Hand x={560} y={920} at={w('L04', 2, 2)} out={l5} size={64} rot={-4}>← pehla ank</Hand>

      {/* L05: we read left to right; the first digit sticks */}
      <Card id="digits" x={90} y={430} w={900} h={430} rot={-1} at={l5} out={l7} enter="up" bg={C.card}>
        <div style={{position: 'absolute', left: 40, top: 30}}><Label size={22}>Price tag</Label></div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 70, display: 'flex', justifyContent: 'center', alignItems: 'baseline', fontFamily: F.display, fontSize: 250, lineHeight: 1}}>
          <span>₹</span>
          <span style={{display: 'inline-block', transform: `scale(${1 + 0.32 * big})`, transformOrigin: '50% 80%', margin: `0 ${0.08 * big}em`, position: 'relative', isolation: 'isolate'}}>
            {big > 0 ? <span style={{position: 'absolute', left: '-0.05em', right: '-0.05em', top: '10%', bottom: '2%', background: C.yellow, zIndex: -1}} /> : null}9
          </span>
          <span style={{opacity: 1 - 0.55 * Math.min(1, big)}}>99</span>
        </div>
      </Card>
      <Show from={first + 4} until={l7}>
        <div style={{position: 'absolute', left: 230, top: 470, transform: `scale(${Math.min(1, pop(frame, first + 4))})`, transformOrigin: '30% 30%'}}>
          <Magnifier r={150} />
        </div>
      </Show>
      <Marker id="readarrow" d="M150,900 Q540,880 900,900 M870,875 L905,900 L868,925" at={w('L05', 2, -2)} dur={10} out={l6} width={8} color={C.ink} />
      <Hand x={160} y={930} at={w('L05', 2, 4)} out={l6} size={58} rot={-2}>baayein se padhte hain →</Hand>
      <Stamp id="chipak" text="Chipak gaya!" x={780} y={810} at={w('L05', 10, -2)} out={l6} size={58} rot={-8} paper />

      {/* L06: "nau sau kuch", not "hazaar" */}
      <Card id="reads" x={100} y={920} w={880} h={290} rot={1} at={w('L06', 2, -3)} out={l7} enter="up" bg={C.card}>
        <div style={{padding: '28px 40px'}}>
          <Label size={22}>Dimaag padhta hai:</Label>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 34}}>
            <span style={{fontFamily: F.display, fontSize: 84}}><Pop at={w('L06', 5, -3)}><HL at={w('L06', 5, 1)}>NAU SAU KUCH…</HL></Pop></span>
            <span style={{fontFamily: F.display, fontSize: 84, color: C.inkSoft}}><Pop at={w('L06', 8, -3)}>HAZAAR</Pop></span>
          </div>
        </div>
      </Card>
      <Cross id="xhaz" x={690} y={1050} w={250} h={120} at={w('L06', 9, -4)} out={l7} />

      {/* L07: nines everywhere */}
      <Tag id="t1999" x={90} y={470} w={380} h={460} rot={-3} at={w('L07', 1, -4)} bg={C.card}>
        <div style={{textAlign: 'center', marginTop: 140, fontFamily: F.display, fontSize: 112, lineHeight: 1}}><Nines text="₹1,999" at={w('L07', 3, -2)} /></div>
      </Tag>
      <Tag id="t49999" x={500} y={470} w={480} h={460} rot={3} at={w('L07', 2, -4)} bg={C.card}>
        <div style={{textAlign: 'center', marginTop: 140, fontFamily: F.display, fontSize: 112, lineHeight: 1}}><Nines text="₹49,999" at={w('L07', 3, -2)} /></div>
      </Tag>
      <Stamp id="nine" text="Har jagah 9" x={540} y={1060} at={w('L07', 5, -4)} size={96} rot={-5} paper />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- anchor
const AnchorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {at} = useCues();
  const w = useWordAt();
  const l9 = at('L09'), l10 = at('L10'), l11 = at('L11');
  const drop = w('L10', 4, -4);
  const dp = stepped(frame) >= drop ? Math.min(1.05, pop(frame, drop, 9, 0.7)) : 0;
  return (
    <AbsoluteFill>
      {/* L08: trick two */}
      <Card id="ch2" x={110} y={470} w={860} h={420} rot={1.5} at={0} out={l9} enter="drop" bg={C.card} torn={{bottom: true}}>
        <div style={{padding: '40px 50px'}}>
          <Label size={26}>Chaal 2</Label>
          <div style={{fontFamily: F.display, fontSize: 190, lineHeight: 1, marginTop: 30}}><HL at={w('L08', 2, -2)}>ANCHOR</HL></div>
        </div>
        <div style={{position: 'absolute', right: 50, bottom: 40}}><Anchor size={150} /></div>
      </Card>

      {/* L09: the sale sticker */}
      <Card id="sale" x={100} y={430} w={880} h={560} rot={-1.5} at={l9} enter="up" bg={C.card} torn={{bottom: true}}>
        <div style={{padding: '30px 44px'}}>
          <Label size={24} dark={false}>Sale · sale · sale</Label>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 26, marginTop: 24}}>
            <span style={{...mono(38), color: C.inkSoft}}>MRP</span>
            <span style={{fontFamily: F.display, fontSize: 130, lineHeight: 1, color: C.inkSoft}}><Pop at={w('L09', 1, -3)}>₹4,999</Pop></span>
          </div>
          <div style={{marginTop: 30, ...mono(34)}}><Pop at={w('L09', 6, -3)}>Ab sirf</Pop></div>
          <div style={{fontFamily: F.display, fontSize: 170, lineHeight: 1, marginTop: 6}}><Pop at={w('L09', 8, -3)}><HL at={w('L09', 8, 2)}>₹1,999</HL></Pop></div>
        </div>
      </Card>
      <Marker id="strike" d="M300,600 Q470,585 640,598" at={w('L09', 2, -2)} dur={6} width={12} />
      <Tape id="tsale" x={470} y={414} w={150} rot={-6} at={l9 + 2} />

      {/* L10: the first number becomes the anchor; the second feels like a deal */}
      <Show from={drop}>
        <div style={{position: 'absolute', left: 690, top: 470 - 260 * (1 - Math.min(1, dp)), opacity: Math.min(1, dp * 2), transform: `rotate(${(1 - Math.min(1, dp)) * -20 + 8}deg)`, filter: `drop-shadow(4px 8px 6px ${C.shadow})`}}>
          <Anchor size={170} color={C.red} />
        </div>
      </Show>
      <Hand x={640} y={660} at={drop + 8} size={50} rot={-6}>yahan atka!</Hand>
      <Stamp id="deal" text="Deal!" x={810} y={870} at={w('L10', 9, -3)} size={80} rot={-10} paper />

      {/* L11: it was always worth ₹1,999 */}
      <Card id="real" x={130} y={1030} w={820} h={170} rot={1} at={w('L11', 0, -3)} enter="up" bg={C.ink} texture={null}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 24, color: C.paperLight}}>
          <span style={mono(30)}>Asli keemat:</span>
          <span style={{fontFamily: F.display, fontSize: 104, color: C.yellow}}><Pop at={w('L11', 3, -3)}>₹1,999</Pop></span>
        </div>
      </Card>
      <Cross id="xdeal" x={725} y={820} w={175} h={100} at={w('L11', 3, 6)} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- decoy
const PLANS = [
  {name: 'Basic', price: '₹199', bg: C.card},
  {name: 'Standard', price: '₹449', bg: C.paperLight},
  {name: 'Premium', price: '₹499', bg: C.yellow},
];

const Decoy: React.FC = () => {
  const frame = useCurrentFrame();
  const {at} = useCues();
  const w = useWordAt();
  const l14 = at('L14');
  const plansAt = w('L12', 3, -3);
  return (
    <AbsoluteFill>
      {/* L12: trick three */}
      <Card id="ch3" x={110} y={420} w={860} h={210} rot={-1} at={0} enter="drop" bg={C.card}>
        <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 46px', gap: 30}}>
          <Label size={26}>Chaal 3</Label>
          <span style={{fontFamily: F.display, fontSize: 140, lineHeight: 1}}><HL at={w('L12', 2, -2)}>DECOY</HL></span>
        </div>
      </Card>

      {/* L13: three plans */}
      {PLANS.map((p, i) => (
        <Card key={p.name} id={'plan' + i} x={70 + i * 305} y={680} w={285} h={430} rot={[-1.5, 1, -1][i]} at={plansAt + i * 4} enter="up" bg={p.bg}>
          <div style={{textAlign: 'center', paddingTop: 34}}>
            <div style={mono(26)}>{p.name}</div>
            <div style={{height: 3, background: C.ink, margin: '22px 30px'}} />
            <div style={{fontFamily: F.display, fontSize: 100, lineHeight: 1, marginTop: 40}}>
              {frame < w('L13', i * 2 + 1, -3) ? <span style={{color: C.grey}}>₹ ?</span> : <Pop at={w('L13', i * 2 + 1, -3)}>{p.price}</Pop>}
            </div>
            <div style={{...mono(20), color: C.inkSoft, marginTop: 20}}>/ mahina</div>
          </div>
        </Card>
      ))}

      {/* L14: the middle plan only exists to make Premium look cheap */}
      <Stamp id="decoy" text="Decoy" x={517} y={1030} at={w('L14', 1, -3)} size={64} rot={-10} paper />
      <Marker id="toprem" d="M690,1175 Q770,1200 822,1140 M794,1140 L824,1138 L820,1168" at={w('L14', 8, -3)} dur={8} width={8} color={C.ink} />
      <Hand x={150} y={1150} at={w('L14', 8, 0)} size={56} rot={-3}>Premium sasta dikhta hai →</Hand>
      <Circle id="cprem" cx={822} cy={895} rx={160} ry={250} at={w('L14', 10, -3)} out={l14 + 400} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- defend
const Defend: React.FC = () => {
  const frame = useCurrentFrame();
  const {at} = useCues();
  const w = useWordAt();
  const l16 = at('L16');
  const gl = w('L15', 3, -3);
  return (
    <AbsoluteFill>
      {/* L15: round it off */}
      <Card id="bach" x={110} y={440} w={860} h={280} rot={-1.5} at={0} out={l16} enter="drop" bg={C.card}>
        <div style={{padding: '34px 46px'}}>
          <Label size={24}>Bachaav</Label>
          <div style={{fontFamily: F.display, fontSize: 120, lineHeight: 1, marginTop: 26}}>{frame < gl ? 'BACHAAV?' : <Pop at={gl}>ROUND KARO</Pop>}</div>
        </div>
      </Card>
      <Show from={gl + 4} until={l16}>
        <div style={{position: 'absolute', left: 750, top: 500, transform: `rotate(-8deg) scale(${Math.min(1, pop(frame, gl + 4))})`}}>
          <Glasses w={190} />
        </div>
      </Show>
      <Card id="eq" x={110} y={780} w={860} h={330} rot={1} at={w('L15', 6, -4)} out={l16} enter="up" bg={C.paperLight}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 30, fontFamily: F.display, fontSize: 150, lineHeight: 1}}>
          <span>₹999</span>
          <Pop at={w('L15', 7, -2)}>=</Pop>
          <Pop at={w('L15', 8, -3)}><HL at={w('L15', 8, 2)}>₹1,000</HL></Pop>
        </div>
      </Card>

      {/* L16: ignore the MRP; ask what it's worth to you */}
      <Tag id="mrp" x={140} y={460} w={340} h={330} rot={-5} at={l16} bg={C.card}>
        <div style={{textAlign: 'center', marginTop: 110}}>
          <div style={{fontFamily: F.display, fontSize: 120, lineHeight: 1, color: C.inkSoft}}>MRP</div>
        </div>
      </Tag>
      <Cross id="xmrp" x={170} y={560} w={280} h={200} at={w('L16', 2, -3)} />
      <Hand x={560} y={600} at={w('L16', 2, 2)} size={72} rot={-6}>ignore!</Hand>
      <Card id="ask" x={120} y={860} w={840} h={330} rot={-1.5} at={w('L16', 4, -3)} enter="up" bg={C.yellow} torn={{top: true}}>
        <div style={{padding: '30px 46px'}}>
          <Label size={24}>Poocho</Label>
          <div style={{fontFamily: F.display, fontSize: 92, lineHeight: 1.02, marginTop: 20}}><Pop at={w('L16', 5, -3)}>MERE LIYE IS KI</Pop><br /><Pop at={w('L16', 8, -3)}>KEEMAT KITNI?</Pop></div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <AbsoluteFill>
    <SignOff share="L17" sign="L18" who="us dost ko jo har sale mein deal dhoondhta hai →" note="PRICES ILLUSTRATIVE · LEFT-DIGIT EFFECT, ANCHORING, DECOY EFFECT" />
  </AbsoluteFill>
);

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  left: Left,
  anchor: AnchorScene,
  decoy: Decoy,
  defend: Defend,
  outro: Outro,
};
