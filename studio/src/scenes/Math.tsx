import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Card, Circle, Count, Hand, HL, Label, Sfx, Stamp, Tape} from '../components/paper';
import {ease, pop, stepped} from '../lib/motion';
import {useCues} from '../lib/timeline';
import {C, F} from '../theme';

export const grid = (cell = 40, color = 'rgba(70, 110, 150, 0.16)') => ({
  backgroundImage: `linear-gradient(${color} 1.5px, transparent 1.5px), linear-gradient(90deg, ${color} 1.5px, transparent 1.5px)`,
  backgroundSize: `${cell}px ${cell}px`,
});

const Tile: React.FC<{id: string; y: number; at: number; op: string; value: React.ReactNode; label: string; hi?: boolean; rot?: number; out?: number}> = ({id, y, at, op, value, label, hi, rot = 0, out}) => (
  <Card id={id} x={110} y={y} w={860} h={170} rot={rot} at={at} out={out} enter="right" bg={hi ? C.yellow : C.card}>
    <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 40px'}}>
      <div style={{fontFamily: F.display, fontSize: 96, width: 80, color: C.inkSoft}}>{op}</div>
      <div style={{fontFamily: F.display, fontSize: 120, flex: 1}}>{value}</div>
      <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 2, textAlign: 'right', width: 250, lineHeight: 1.35, whiteSpace: 'pre-line'}}>{label}</div>
    </div>
  </Card>
);

export const MathScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l15 = at('L15'), l16 = at('L16'), l17 = at('L17'), l18 = at('L18'), l19 = at('L19'), l20 = at('L20');
  const {end} = useCues();
  const gone = end('L20', 6);
  const barP = ease(stepped(frame), word('L14', 'extra', -2), word('L14', 'extra', 10));
  return (
    <AbsoluteFill>
      {/* L14: GMP = the extra over the IPO price */}
      <Card id="def" x={90} y={410} w={900} h={740} rot={-1} at={0} out={l15} enter="up" bg={C.card} style={{}}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'relative', padding: '40px 50px'}}>
          <Label size={24}>Definition</Label>
          <div style={{fontFamily: F.display, fontSize: 92, lineHeight: 1, marginTop: 24}}>GMP = <HL at={word('L14', 'extra')}>EXTRA</HL> JO LOG DENE KO TAIYAAR HAIN</div>
          <div style={{position: 'absolute', left: 120, top: 330, width: 260, height: 340, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
            <div style={{height: 120 * barP, background: C.yellow, border: `4px solid ${C.ink}`, borderBottom: 'none', fontFamily: F.mono, fontWeight: 700, fontSize: 24, textAlign: 'center', overflow: 'hidden', paddingTop: 10}}>GMP</div>
            <div style={{height: 200, background: C.paperLight, border: `4px solid ${C.ink}`, fontFamily: F.mono, fontWeight: 700, fontSize: 24, textAlign: 'center', paddingTop: 80}}>IPO PRICE</div>
          </div>
          <Hand x={440} y={380} at={word('L14', 'extra', 4)} size={62} rot={-4}>← premium (upar ka)</Hand>
          <Hand x={440} y={560} at={word('L14', 'ipo', 0)} size={62} rot={-2}>← company ka price</Hand>
        </div>
      </Card>

      {/* L15-L17: 1,119 + 245 = 1,364 */}
      <Tile id="t1" y={420} at={l15} out={gone} op="" value={<Count from={0} to={1119} at={l15 + 4} />} label={'UPPER PRICE BAND'} rot={-1.5} />
      <Tile id="t2" y={610} at={l16} out={gone} op="+" value={<Count from={0} to={245} at={l16 + 4} />} label={'GMP · 23 OCT\nPUBLIC TRACKERS'} rot={1} />
      <Card id="rule" x={150} y={800} w={780} h={10} at={l17 - 2} out={gone} enter="fade" bg={C.ink} texture={null} sfx={null} depth={0.2} />
      <Tile id="t3" y={830} at={l17} out={gone} op="=" value={<HL at={l17 + 6}>₹1,364</HL>} label={'GREY MARKET KA\nLISTING ANDAZA'} hi={false} rot={-1} />
      <Sfx at={l17 + 6} name="coin" volume={0.25} />

      {/* L18: percent */}
      <Card id="pct" x={150} y={1030} w={780} h={150} rot={2} at={l18} out={gone} bg={C.paperLight}>
        <div style={{position: 'absolute', inset: 0, ...grid(30)}} />
        <div style={{position: 'relative', fontFamily: F.hand, fontWeight: 700, fontSize: 76, textAlign: 'center', marginTop: 28}}>
          245 ÷ 1,119 = <span style={{color: C.red}}>21.9%</span>
        </div>
      </Card>
      <Circle id="pc" cx={735} cy={1102} rx={130} ry={62} at={word('L18', '22', -2)} out={l19} />

      {/* L19: one lot = 12 shares */}
      <Card id="lot" x={110} y={1020} w={860} h={180} rot={-1} at={l19} out={gone} enter="up" bg={C.card}>
        <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 30px', gap: 8}}>
          {Array.from({length: 12}).map((_, i) => {
            const p = pop(frame, l19 + 4 + i * 2);
            return <div key={i} style={{width: 28, height: 28, background: C.yellow, border: `3px solid ${C.ink}`, transform: `scale(${Math.min(1, Math.max(0, p))})`}} />;
          })}
          <div style={{fontFamily: F.display, fontSize: 56, marginLeft: 14, whiteSpace: 'nowrap'}}>× ₹245 =</div>
          <div style={{fontFamily: F.display, fontSize: 76, marginLeft: 8, whiteSpace: 'nowrap'}}><HL at={word('L19', '2,940')}>₹2,940</HL></div>
        </div>
      </Card>

      {/* L20: only on paper */}
      <Stamp id="paper" text="Sirf kaagaz pe" sub="NOT A REAL PAYOUT" x={540} y={760} at={word('L20', 'kaagaz', -2)} size={110} rot={-10} paper />
      <Tape id="tm" x={460} y={400} w={160} rot={-4} at={l15 + 2} out={gone} />
    </AbsoluteFill>
  );
};
