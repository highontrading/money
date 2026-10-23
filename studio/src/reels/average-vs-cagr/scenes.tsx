import React, {useContext} from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Card, Circle, Cross, Hand, HL, Label, Marker, Stamp, Tape} from '../../components/paper';
import {SceneCtx, useCues, useTL} from '../../lib/timeline';
import {C, F} from '../../theme';
import {SignOff} from '../common';
import {Bar, Egg, Ghost, grid, NotePiece, Pop, Scissors, weave} from './parts';

// The ₹100 note on the desk.
const NX = 120, NY = 470, NW = 840, NH = 380;

// Cue for the i-th word of a line (for lines where the same word appears twice).
const useWordAt = () => {
  const tl = useTL();
  const sc = useContext(SceneCtx);
  return (id: string, i: number, off = 0) => tl.lines.find((l) => l.id === id)!.words[i].start - sc.start + off;
};

const Center: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', ...style}}>{children}</div>
);

// L01-L04: -50%, +50%, back to ₹100? No: ₹75.
const Hook: React.FC = () => {
  const {at, word} = useCues();
  return (
    <AbsoluteFill>
      <NotePiece id="h-note" x={NX} y={NY} w={NW} h={NH} rot={-1.5} at={at('L01', -6)} from={{x: 0, y: -1100, r: -10}} sfx="drop" />
      <Card id="h-down" x={130} y={900} w={380} h={180} rot={-3} at={word('L01', '50%', -3)} enter="left" bg={C.card}>
        <Center><div style={{fontFamily: F.display, fontSize: 130, color: C.red, lineHeight: 1}}>−50%</div></Center>
      </Card>
      <Card id="h-up" x={570} y={900} w={380} h={180} rot={2.5} at={word('L02', '50%', -3)} enter="right" bg={C.yellow}>
        <Center><div style={{fontFamily: F.display, fontSize: 130, color: C.ink, lineHeight: 1}}>+50%</div></Center>
      </Card>
      <Hand x={150} y={385} at={at('L03')} size={62} rot={-3}>hisaab barabar?</Hand>
      <Pop x={290} y={1110} w={500} align="center" at={word('L03', '₹100', -2)} size={100} font={F.hand}>= ₹100 ?</Pop>
      <Cross id="h-x" x={300} y={1105} w={480} h={110} at={word('L04', 'nahi', 0)} />
      <Card id="h-75" x={250} y={560} w={580} h={230} rot={-4} at={word('L04', '₹75', -4)} enter="drop" bg={C.yellow} torn={{top: true, right: true}} rough={12}>
        <Center>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 6}}>SIRF</div>
          <div style={{fontFamily: F.display, fontSize: 160, lineHeight: 1}}>₹75</div>
        </Center>
      </Card>
    </AbsoluteFill>
  );
};

// L05-L07: cut the note in half, then tape back only half of that half.
const Cut: React.FC = () => {
  const {at, word} = useCues();
  const cut = word('L05', '50%', -4);
  const done = cut + 14;
  const q = word('L07', '₹25', -8);
  return (
    <AbsoluteFill>
      <NotePiece id="c-full" x={NX} y={NY} w={NW} h={NH} at={0} out={done} from={{x: 0, y: 1300, r: 6}} />
      <NotePiece id="c-left" x={NX} y={NY} w={NW} h={NH} f1={0.5} at={done} />
      <NotePiece id="c-right" x={NX} y={NY} w={NW} h={NH} f0={0.5} at={done} out={done + 30} leave={{at: done + 3, x: 300, y: 1000, r: 28}} />
      <Scissors x={NX + NW / 2} y0={NY - 30} y1={NY + NH + 25} at={cut} dur={14} out={done + 8} />
      <Card id="c-50" x={140} y={900} w={440} h={150} rot={-2} at={word('L05', '₹50', -3)} out={at('L06')} bg={C.yellow}>
        <Center><div style={{fontFamily: F.display, fontSize: 88, lineHeight: 1, whiteSpace: 'nowrap'}}>₹50 BACHE</div></Center>
      </Card>

      {/* L06: 50% of what? */}
      <Ghost x={NX + NW / 2} y={NY} w={NW / 2} h={NH} at={at('L06')} out={q + 10} />
      <Card id="c-a" x={560} y={900} w={400} h={150} rot={2} at={word('L06', '₹100', -3)} out={at('L07')} bg={C.card}>
        <Center><div style={{fontFamily: F.display, fontSize: 84, lineHeight: 1}}>50% × ₹100</div></Center>
      </Card>
      <Cross id="c-ax" x={580} y={915} w={360} h={120} at={word('L06', 'nahi', 0)} out={at('L07')} />
      <Card id="c-b" x={120} y={900} w={400} h={150} rot={-2} at={word('L06', '₹50', -3)} out={at('L07')} bg={C.yellow}>
        <Center><div style={{fontFamily: F.display, fontSize: 84, lineHeight: 1}}>50% × ₹50</div></Center>
      </Card>

      {/* L07: only a quarter comes back */}
      <NotePiece id="c-quarter" x={NX} y={NY} w={NW} h={NH} f0={0.5} f1={0.75} at={q} from={{x: 760, y: -160, r: 18}} />
      <Tape id="c-tape1" x={NX + NW / 2 - 75} y={NY + 90} w={150} rot={84} at={q + 10} />
      <Tape id="c-tape2" x={NX + NW / 2 - 75} y={NY + 250} w={150} rot={96} at={q + 12} />
      <Card id="c-25" x={570} y={890} w={300} h={130} rot={3} at={word('L07', '₹25', -1)} bg={C.yellow} sfx={null}>
        <Center><div style={{fontFamily: F.display, fontSize: 96, lineHeight: 1}}>+₹25</div></Center>
      </Card>
      <Ghost x={NX + NW * 0.75} y={NY} w={NW / 4} h={NH} at={q + 10} />
      <Circle id="c-gap" cx={NX + NW * 0.875} cy={NY + NH / 2} rx={150} ry={240} at={word('L07', 'total', 0)} />
      <Card id="c-75" x={150} y={1050} w={560} h={160} rot={-1.5} at={word('L07', '₹75', -4)} bg={C.card}>
        <Center><div style={{fontFamily: F.display, fontSize: 110, lineHeight: 1}}>TOTAL: <HL at={word('L07', '₹75', 2)}>₹75</HL></div></Center>
      </Card>
    </AbsoluteFill>
  );
};

// L08-L09: the same percent on a smaller base brings back less money.
const Why: React.FC = () => {
  const {at, word} = useCues();
  const BASE = 1090;
  return (
    <AbsoluteFill>
      <Card id="w-rule" x={110} y={410} w={860} h={250} rot={-1} at={0} enter="up" bg={C.card}>
        <div style={{padding: '30px 44px'}}>
          <Label size={22}>Rule</Label>
          <div style={{fontFamily: F.display, fontSize: 78, lineHeight: 1.05, marginTop: 14}}>
            PERCENT HAMESHA <HL at={word('L08', 'bacha', -2)}>JO BACHA HAI</HL>, USPE
          </div>
        </div>
      </Card>
      <Bar id="w-a" x={170} base={BASE} w={300} h={400} at={at('L09', -2)} dur={8} color={C.card} />
      <Bar id="w-a2" x={170} base={BASE - 200} w={300} h={200} at={word('L09', 'wahi', -2)} dur={8}>
        <div style={{position: 'absolute', top: 26, width: '100%', textAlign: 'center', fontFamily: F.display, fontSize: 60, whiteSpace: 'nowrap'}}>50% = ₹50</div>
      </Bar>
      <Bar id="w-b" x={610} base={BASE} w={300} h={200} at={word('L09', 'base', -2)} dur={8} color={C.card} />
      <Bar id="w-b2" x={610} base={BASE - 100} w={300} h={100} at={word('L09', 'percent', -2)} dur={8}>
        <div style={{position: 'absolute', top: 18, width: '100%', textAlign: 'center', fontFamily: F.display, fontSize: 52, whiteSpace: 'nowrap'}}>50% = ₹25</div>
      </Bar>
      <Pop x={170} y={BASE + 16} w={300} align="center" at={at('L09', 4)} size={28} font={F.mono}>PEHLE · ₹100</Pop>
      <Pop x={610} y={BASE + 16} w={300} align="center" at={word('L09', 'base', 4)} size={28} font={F.mono}>BAAD MEIN · ₹50</Pop>
      <Circle id="w-kam" cx={760} cy={BASE - 150} rx={200} ry={95} at={word('L09', 'kam', -2)} />
    </AbsoluteFill>
  );
};

// L10-L14: loss -> rise needed to get back.
const ROWS = [
  {l: 'L11', loss: 10, rec: 11},
  {l: 'L12', loss: 25, rec: 33},
  {l: 'L13', loss: 50, rec: 100},
  {l: 'L14', loss: 80, rec: 400},
];
const Table: React.FC = () => {
  const {at, word} = useCues();
  const BASE = 860;
  return (
    <AbsoluteFill>
      <Card id="t-panel" x={90} y={400} w={900} h={840} rot={-0.6} at={0} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
      </Card>
      <Card id="t-axis" x={110} y={BASE - 3} w={860} h={6} at={6} enter="fade" bg={C.ink} texture={null} sfx={null} depth={0.2} />
      <div style={{position: 'absolute', left: 120, top: 425, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start', zIndex: 30}}>
        <Label size={24}>↓ Gira</Label>
        <Label size={24} dark={false}>↑ Wapas aane ko</Label>
      </div>
      <Hand x={520} y={560} at={word('L10', 'kitna', -2)} out={at('L11')} size={96} rot={-5}>kitna?</Hand>
      {ROWS.map((r, i) => {
        const cx = 190 + i * 200;
        const lossAt = word(r.l, `${r.loss}%`, -3);
        const recAt = word(r.l, `${r.rec}%`, -3);
        return (
          <React.Fragment key={r.l}>
            <Bar id={'t-l' + i} x={cx - 60} base={BASE} w={120} h={r.loss * 3} at={lossAt} dur={8} dir="down" color={C.ink} />
            <Pop x={cx - 90} y={BASE + r.loss * 3 + 14} w={180} align="center" at={lossAt + 6} size={40} font={F.mono}>−{r.loss}%</Pop>
            <Bar id={'t-r' + i} x={cx - 60} base={BASE} w={120} h={r.rec} at={recAt} dur={r.rec > 100 ? 18 : 10} sfx="pop" />
            <Pop x={cx - 90} y={BASE - r.rec - 70} w={180} align="center" at={recAt + (r.rec > 100 ? 16 : 8)} size={58}>+{r.rec}%</Pop>
          </React.Fragment>
        );
      })}
      <Hand x={140} y={590} at={word('L13', 'double', -2)} size={58} rot={-4}>paisa double →</Hand>
      <Circle id="t-400" cx={790} cy={BASE - 400 - 40} rx={120} ry={52} at={word('L14', 'chahiye', -2)} />
    </AbsoluteFill>
  );
};

// L15-L18: average return vs CAGR.
const Average: React.FC = () => {
  const {at, word} = useCues();
  const w = useWordAt();
  const l18 = at('L18');
  return (
    <AbsoluteFill>
      <Card id="a-avg" x={110} y={420} w={860} h={200} rot={-1.5} at={0} out={l18} enter="up" bg={C.card}>
        <Center><div style={{fontFamily: F.display, fontSize: 124, lineHeight: 1}}>AVERAGE RETURN</div></Center>
      </Card>
      <Stamp id="a-dhokha" text="Dhokha?" x={780} y={640} at={word('L15', 'dhokha', -2)} out={l18} size={70} rot={-8} />
      <Card id="a-y1" x={110} y={710} w={410} h={170} rot={-2} at={w('L16', 2, -3)} out={l18} enter="left" bg={C.yellow}>
        <Center>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 4}}>SAAL 1</div>
          <div style={{fontFamily: F.display, fontSize: 104, lineHeight: 1}}>+50%</div>
        </Center>
      </Card>
      <Card id="a-y2" x={560} y={710} w={410} h={170} rot={2} at={w('L16', 5, -3)} out={l18} enter="right" bg={C.card}>
        <Center>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 4}}>SAAL 2</div>
          <div style={{fontFamily: F.display, fontSize: 104, lineHeight: 1, color: C.red}}>−50%</div>
        </Center>
      </Card>
      <Card id="a-zero" x={210} y={905} w={660} h={150} rot={-1} at={word('L16', 'average', -3)} out={l18} bg={C.paperLight}>
        <Center><div style={{fontFamily: F.display, fontSize: 96, lineHeight: 1}}>AVERAGE = <HL at={word('L16', 'zero', -2)}>0%</HL></div></Center>
      </Card>
      <Cross id="a-zx" x={240} y={920} w={600} h={120} at={word('L17', 'asli', 0)} out={l18} />
      <Card id="a-real" x={100} y={1075} w={590} h={150} rot={1.5} at={at('L17', -2)} out={l18} bg={C.card}>
        <Center><div style={{fontFamily: F.display, fontSize: 80, lineHeight: 1, whiteSpace: 'nowrap'}}>ASLI: ₹100 → ₹75</div></Center>
      </Card>
      <Stamp id="a-25" text="−25%" x={862} y={1150} at={word('L17', '25%', -2)} out={l18} size={80} rot={-10} />

      {/* L18 */}
      <Card id="a-avg2" x={120} y={440} w={430} h={170} rot={-4} at={l18} enter="left" bg={C.card}>
        <Center><div style={{fontFamily: F.display, fontSize: 104, lineHeight: 1, color: C.inkSoft}}>AVERAGE</div></Center>
      </Card>
      <Cross id="a-avx" x={140} y={455} w={390} h={140} at={word('L18', 'number', 0)} />
      <Card id="a-cagr" x={330} y={560} w={620} h={330} rot={2.5} at={word('L18', 'cagr', -4)} enter="drop" bg={C.yellow} torn={{top: true, left: true}} rough={14}>
        <Center><div style={{fontFamily: F.display, fontSize: 250, lineHeight: 1, letterSpacing: 6}}>CAGR</div></Center>
      </Card>
      <Tape id="a-ct" x={570} y={545} w={150} rot={-5} at={word('L18', 'cagr', 2)} />
      <Hand x={120} y={930} at={word('L18', 'har', -2)} size={62} rot={-2} w={500}>har saal ki asli, compound growth</Hand>
      {[0, 1, 2, 3].map((i) => (
        <Bar key={i} id={'a-st' + i} x={640 + i * 75} base={1215} w={62} h={[50, 75, 108, 150][i]} at={word('L18', 'compound', -2 + i * 5)} dur={6} />
      ))}
    </AbsoluteFill>
  );
};

// L19-L22: Nifty 2008 / 2009.
const Nifty: React.FC = () => {
  const {at, word} = useCues();
  const l20 = at('L20');
  const BASE = 1150, H0 = 420;
  const h08 = Math.round(H0 * 0.48), h09 = Math.round(H0 * 0.48 * 1.76);
  const shrink = word('L20', '52%', -3);
  return (
    <AbsoluteFill>
      {/* L19: newspaper clipping */}
      <Card id="n-clip" x={100} y={430} w={880} h={760} rot={-2} at={0} out={l20} enter="up" bg={C.newsprint} texture="news" torn={{top: true, bottom: true, left: true, right: true}} rough={12}>
        <div style={{padding: '34px 44px'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 5, borderBottom: `3px solid ${C.ink}`, paddingBottom: 10}}>MARKET · FILE PHOTO · DALAL STREET</div>
          <div style={{fontFamily: F.display, fontSize: 104, lineHeight: 0.95, marginTop: 18}}>BAZAAR MEIN BHUCHAAL</div>
          <div style={{position: 'relative', marginTop: 22, height: 420, overflow: 'hidden'}}>
            <Img src={staticFile('img/proc/bse.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 40%'}} />
          </div>
        </div>
      </Card>
      <Card id="n-2008" x={650} y={385} w={300} h={150} rot={6} at={word('L19', '2008', -3)} out={l20} bg={C.yellow}>
        <Center><div style={{fontFamily: F.display, fontSize: 120, lineHeight: 1}}>2008</div></Center>
      </Card>

      {/* L20-L22: index chart */}
      <Card id="n-panel" x={90} y={410} w={900} h={830} rot={0.6} at={l20} enter="right" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
      </Card>
      <Bar id="n-start" x={150} base={BASE} w={220} h={H0} at={l20 + 6} dur={8} color={C.paperLight} />
      <Bar id="n-08a" x={420} base={BASE} w={220} h={H0} at={l20 + 9} dur={8} out={shrink} color={C.paperLight} sfx={null} />
      <Bar id="n-08" x={420} base={BASE} w={220} h={h08} from={H0} at={shrink} dur={12} color={C.paperLight}>
        <div style={{position: 'absolute', top: 10, width: '100%', textAlign: 'center', fontFamily: F.display, fontSize: 70, color: C.red}}>−52%</div>
      </Bar>
      <Bar id="n-09" x={690} base={BASE} w={220} h={h09} at={word('L21', '76%', -4)} dur={14} sfx="pop">
        <div style={{position: 'absolute', top: 70, width: '100%', textAlign: 'center', fontFamily: F.display, fontSize: 70}}>+76%</div>
      </Bar>
      <Marker id="n-line" d={`M130,${BASE - H0} L955,${BASE - H0}`} at={l20 + 14} dur={8} color={C.inkSoft} width={4} />
      {[['SHURU', 150, l20 + 8], ['2008', 420, l20 + 12], ['2009', 690, word('L21', '2009', -2)]].map(([t, x, a]) => (
        <Pop key={t as string} x={x as number} y={BASE + 18} w={220} align="center" at={a as number} size={30} font={F.mono}>{t}</Pop>
      ))}
      <Card id="n-avg" x={120} y={440} w={540} h={130} rot={-2} at={word('L22', 'average', -3)} bg={C.paperLight}>
        <Center><div style={{fontFamily: F.display, fontSize: 76, lineHeight: 1, whiteSpace: 'nowrap'}}>AVERAGE: <HL at={word('L22', '12%', -2)}>+12%</HL></div></Center>
      </Card>
      <Cross id="n-avx" x={145} y={455} w={490} h={100} at={word('L22', 'par', 0)} />
      <Circle id="n-gap" cx={800} cy={BASE - (H0 + h09) / 2} rx={150} ry={58} at={word('L22', '15%', -4)} />
      <Pop x={660} y={615} at={word('L22', '15%', -1)} size={60} color={C.red}>15% NEECHE</Pop>
    </AbsoluteFill>
  );
};

// L23-L26: what to take away.
const Lesson: React.FC = () => {
  const {at, word} = useCues();
  const w = useWordAt();
  const l24 = at('L24'), l25 = at('L25'), l26 = at('L26');
  const basket = word('L24', 'saare', -3);
  const many = word('L24', 'nahi', 6);
  return (
    <AbsoluteFill>
      {/* L23 */}
      <Card id="l-q" x={290} y={620} w={500} h={170} rot={-3} at={at('L23', -4)} out={word('L23', 'bade', -3)} bg={C.ink} texture="kraft">
        <Center><div style={{fontFamily: F.display, fontSize: 110, lineHeight: 1, color: C.paperLight}}>SEEKH ?</div></Center>
      </Card>
      <Card id="l-loss" x={110} y={430} w={860} h={240} rot={-1.5} at={word('L23', 'bade', -3)} out={l24} bg={C.yellow}>
        <Center><div style={{fontFamily: F.display, fontSize: 96, lineHeight: 1, textAlign: 'center'}}>BADE NUKSAAN<br />SE BACHNA</div></Center>
      </Card>
      <Card id="l-ret" x={240} y={850} w={600} h={160} rot={1.5} at={w('L23', 9, -3)} out={l24} bg={C.card}>
        <Center><div style={{fontFamily: F.display, fontSize: 96, lineHeight: 1}}>BADA RETURN</div></Center>
      </Card>
      <Hand x={270} y={705} at={word('L23', 'zyada', -2)} out={l24} size={80} rot={-3}>&gt; zyada zaroori</Hand>

      {/* L24 */}
      <Card id="l-div" x={90} y={420} w={900} h={170} rot={-1} at={l24} out={l25} enter="left" bg={C.card}>
        <Center><div style={{fontFamily: F.display, fontSize: 116, lineHeight: 1}}><HL at={word('L24', 'diversification', 4)}>DIVERSIFICATION</HL></div></Center>
      </Card>
      <Card id="l-bask" x={120} y={790} w={340} h={220} rot={-2} at={basket} out={l25} bg={C.kraft} texture="kraft">
        <div style={{position: 'absolute', inset: 0, ...weave}} />
      </Card>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <EggAt key={i} at={basket + 2} out={l25} x={150 + (i % 3) * 90 + (i >= 3 ? 40 : 0)} y={i >= 3 ? 690 : 735} />
      ))}
      <Cross id="l-bx" x={120} y={680} w={340} h={330} at={word('L24', 'nahi', -3)} out={l25} />
      {[0, 1, 2].map((i) => (
        <React.Fragment key={i}>
          <Card id={'l-sb' + i} x={520 + i * 150} y={880} w={130} h={130} rot={[-3, 2, -1][i]} at={many + i * 3} out={l25} bg={C.kraft} texture="kraft">
            <div style={{position: 'absolute', inset: 0, ...weave}} />
          </Card>
          <EggAt at={many + i * 3 + 2} out={l25} x={530 + i * 150} y={815} s={0.85} />
          <EggAt at={many + i * 3 + 2} out={l25} x={588 + i * 150} y={820} s={0.85} />
        </React.Fragment>
      ))}

      {/* L25 */}
      <Card id="l-avg" x={120} y={440} w={840} h={180} rot={-1.5} at={word('L25', 'average', -3)} out={l26} bg={C.card}>
        <Center><div style={{fontFamily: F.display, fontSize: 116, lineHeight: 1, color: C.inkSoft}}>AVERAGE RETURN</div></Center>
      </Card>
      <Cross id="l-avx" x={150} y={455} w={780} h={150} at={word('L25', 'poocho', -2)} out={l26} />
      <Card id="l-cagr" x={110} y={700} w={860} h={290} rot={2} at={word('L25', 'cagr', -5)} out={l26} enter="drop" bg={C.yellow} torn={{bottom: true, right: true}} rough={14}>
        <Center><div style={{fontFamily: F.display, fontSize: 124, lineHeight: 1, textAlign: 'center'}}>CAGR<br />KITNA HAI?</div></Center>
      </Card>

      {/* L26: getting back is not moving ahead */}
      <Card id="l-panel" x={100} y={410} w={880} h={820} rot={-0.5} at={l26} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
      </Card>
      <Marker id="l-base" d="M150,720 L940,720" at={l26 + 6} dur={8} color={C.inkSoft} width={4} />
      <Pop x={150} y={670} at={l26 + 8} size={26} font={F.mono}>SHURU</Pop>
      <Marker id="l-fall" d="M170,720 Q270,1000 390,980" at={l26 + 8} dur={14} color={C.ink} width={11} />
      <Marker id="l-back" d="M390,980 Q520,960 600,720" at={word('L26', 'aata', -2)} dur={10} color={C.ink} width={11} />
      <Pop x={625} y={742} at={w('L26', 7, -2)} size={38} font={F.mono}>← WAPAS AANA</Pop>
      <Marker id="l-up" d="M600,720 L880,500 M880,500 L830,505 M880,500 L866,548" at={w('L26', 9, -2)} dur={10} color={C.yellow} width={16} />
      <Pop x={560} y={440} at={w('L26', 9, 2)} size={54}><span style={{background: C.yellow, padding: '4px 10px'}}>AAGE BADHNA</span></Pop>
      <Stamp id="l-neq" text="Wapas ≠ Aage" x={540} y={1110} at={w('L26', 11, -2)} size={80} rot={-5} />
    </AbsoluteFill>
  );
};

const EggAt: React.FC<{at: number; out?: number; x: number; y: number; s?: number}> = ({at, out, x, y, s}) => {
  const {length} = useCues();
  return (
    <Pop x={x} y={y} at={at} out={out ?? length}>
      <div style={{position: 'relative', width: 54 * (s ?? 1), height: 70 * (s ?? 1)}}><Egg x={0} y={0} s={s} /></div>
    </Pop>
  );
};

const Outro: React.FC = () => (
  <AbsoluteFill>
    <SignOff share="L27" sign="L28" who="us 'market wapas aayega' wale dost ko →" note="NIFTY 50: 2008 ≈ −52%, 2009 ≈ +76% (NSE INDEX DATA, ROUNDED)" />
  </AbsoluteFill>
);

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  cut: Cut,
  why: Why,
  table: Table,
  average: Average,
  nifty: Nifty,
  lesson: Lesson,
  outro: Outro,
};

