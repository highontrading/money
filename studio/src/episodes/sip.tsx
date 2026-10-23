import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Bars, Checklist, grid, Headline, Hold, Note, SignOff, Tile} from '../components/kit';
import {Card, Circle, Hand, HL, Label, Marker, Photo, Stamp} from '../components/paper';
import {EpisodeDef} from '../Episode';
import {pop} from '../lib/motion';
import {Timeline, useCues} from '../lib/timeline';
import {C, F} from '../theme';
import timeline from '../data/ep04-sip.json';

// NAV path on graph paper; each point and segment appears on its own cue.
const NavChart: React.FC<{id: string; at: number; out?: number; navs: number[]; cues: number[]; title: string; y?: number; h?: number}> = ({id, at, out, navs, cues, title, y = 420, h = 420}) => {
  const frame = useCurrentFrame();
  const x0 = 170, x1 = 900, top = y + 110, bottom = y + h - 70;
  const px = (i: number) => x0 + (i / (navs.length - 1)) * (x1 - x0);
  const py = (v: number) => bottom - ((v - 40) / 100) * (bottom - top);
  return (
    <>
      <Card id={id} x={90} y={y} w={900} h={h} rot={-1} at={at} out={out} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid(40)}} />
        <div style={{position: 'relative', padding: '28px 40px'}}><Label size={22}>{title}</Label></div>
      </Card>
      {navs.map((v, i) => (i > 0 ? <Marker key={'s' + i} id={id + 's' + i} d={`M${px(i - 1)},${py(navs[i - 1])} L${px(i)},${py(v)}`} at={cues[i]} out={out} dur={6} color={C.ink} width={7} /> : null))}
      {navs.map((v, i) => {
        if (frame < cues[i] || (out !== undefined && frame >= out)) return null;
        const p = Math.min(1, pop(frame, cues[i]));
        return (
          <React.Fragment key={'p' + i}>
            <div style={{position: 'absolute', left: px(i) - 12, top: py(v) - 12, width: 24, height: 24, borderRadius: 12, background: C.red, zIndex: 72, transform: `scale(${p})`}} />
            <div style={{position: 'absolute', left: px(i) - 70, width: 140, top: py(v) - 76, textAlign: 'center', zIndex: 72, fontFamily: F.display, fontSize: 48, transform: `scale(${p})`}}>₹{v}</div>
            <div style={{position: 'absolute', left: px(i) - 70, width: 140, top: bottom + 14, textAlign: 'center', zIndex: 72, fontFamily: F.mono, fontWeight: 700, fontSize: 20}}>MAHINA {i + 1}</div>
          </React.Fragment>
        );
      })}
    </>
  );
};

const Hook: React.FC = () => {
  const {at, word} = useCues();
  const l2 = at('L02'), l3 = at('L03');
  return (
    <AbsoluteFill>
      <Photo id="crowd" src="crowd.jpg" x={70} y={400} w={940} h={600} rot={1.5} at={0} out={l2} enter="up" torn={{top: true, bottom: true}} rough={16} zoom={0.06} />
      <Card id="inflow" x={150} y={860} w={780} h={300} rot={-2} at={word('L01', '32,490', -3)} out={l2} bg={C.yellow}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, textAlign: 'center', marginTop: 24}}>SIP INFLOWS · SEP 2026 · AMFI</div>
        <div style={{fontFamily: F.display, fontSize: 150, textAlign: 'center', lineHeight: 1.1}}>₹32,490 CR</div>
      </Card>
      <Stamp id="rec" text="Record" sub="EK MAHINE MEIN" x={780} y={520} at={word('L01', 'mahine', -2)} out={l2} size={80} rot={8} paper />
      <Hold from={l2} to={l3}>
        <Card id="vs1" x={80} y={480} w={430} h={420} rot={-3} at={l2} enter="left" bg={C.card}>
          <div style={{fontFamily: F.display, fontSize: 170, textAlign: 'center', marginTop: 100}}>SIP</div>
        </Card>
        <Card id="vs2" x={570} y={520} w={430} h={420} rot={3} at={word('L02', 'lump', -4)} enter="right" bg={C.yellow}>
          <div style={{fontFamily: F.display, fontSize: 130, textAlign: 'center', marginTop: 80, lineHeight: 1}}>LUMP SUM</div>
        </Card>
        <div style={{position: 'absolute', left: 470, top: 640, fontFamily: F.display, fontSize: 110, zIndex: 70}}>vs</div>
      </Hold>
      <Headline words={['Kaun', 'jeet-ta', 'hai?']} at={l3} y={480} size={190} label="Ek simple example" />
    </AbsoluteFill>
  );
};

const What: React.FC = () => {
  const frame = useCurrentFrame();
  const {at} = useCues();
  const l5 = at('L05');
  return (
    <AbsoluteFill>
      <Card id="sip" x={80} y={420} w={920} h={380} rot={-1.5} at={0} enter="left" bg={C.card}>
        <div style={{padding: 30}}>
          <Label size={22}>SIP · Systematic Investment Plan</Label>
          <div style={{display: 'flex', gap: 18, marginTop: 34}}>
            {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'].map((m, i) => (
              <div key={m} style={{flex: 1, textAlign: 'center', opacity: frame >= 8 + i * 5 ? 1 : 0}}>
                <div style={{width: 96, height: 96, borderRadius: 48, background: C.yellow, border: `4px solid ${C.ink}`, margin: '0 auto', fontFamily: F.display, fontSize: 30, lineHeight: '88px'}}>₹1K</div>
                <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20, marginTop: 8}}>{m}</div>
              </div>
            ))}
          </div>
          <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 36, marginTop: 20}}>har mahine, fix rakam</div>
        </div>
      </Card>
      <Card id="lump" x={80} y={840} w={920} h={360} rot={1.5} at={l5} enter="right" bg={C.yellow}>
        <div style={{padding: 30, display: 'flex', alignItems: 'center', gap: 40}}>
          <div style={{width: 230, height: 230, borderRadius: 115, background: C.paperLight, border: `5px solid ${C.ink}`, fontFamily: F.display, fontSize: 72, textAlign: 'center', lineHeight: '220px', flexShrink: 0}}>₹6K</div>
          <div>
            <Label size={22}>Lump sum</Label>
            <div style={{fontFamily: F.display, fontSize: 84, lineHeight: 1, marginTop: 14}}>SAB EK SAATH</div>
          </div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

const Dip: React.FC = () => {
  const {at, word} = useCues();
  const l7 = at('L07'), l8 = at('L08'), l9 = at('L09'), l10 = at('L10'), l11 = at('L11');
  return (
    <AbsoluteFill>
      <Hold to={l8}>
        <Tile id="amt" y={430} at={0} value="₹4,000" label={'INVEST KARNE HAIN\nNAV ₹100'} rot={-1.5} />
        <Tile id="lu" y={640} at={l7} value={<>40 <span style={{fontSize: 70}}>units</span></>} label={'LUMP SUM\n4,000 ÷ 100'} hi rot={1} />
      </Hold>
      <NavChart id="dipnav" at={l8 - 2} title="Bazaar gira, phir sambhla (example)" navs={[100, 80, 50, 100]}
        cues={[l8 + 2, word('L08', '80', -2), word('L08', '50', -2), word('L08', 'phir', 0)]} />
      <Hold from={l9} to={l10}>
        <Card id="units" x={90} y={870} w={900} h={330} rot={1} at={l9} enter="up" bg={C.paperLight}>
          <div style={{padding: '24px 40px', fontFamily: F.type, fontSize: 36, lineHeight: 1.55}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              {[['₹1,000 ÷ 100', '10'], ['÷ 80', '12.5'], ['÷ 50', '20'], ['÷ 100', '10']].map(([a, b]) => (
                <div key={a + b} style={{textAlign: 'center'}}><div style={{fontSize: 28}}>{a}</div><div style={{fontFamily: F.display, fontSize: 56}}>{b}</div></div>
              ))}
            </div>
            <div style={{fontFamily: F.display, fontSize: 70, marginTop: 6}}>SIP UNITS = <HL at={word('L09', '52.5', -2)}>52.5</HL> <span style={{color: C.inkSoft, fontSize: 50}}>vs lump 40</span></div>
          </div>
        </Card>
      </Hold>
      <Hold from={l10} to={l11}>
        <Card id="cmp" x={150} y={890} w={780} h={300} rot={-2} at={l10} bg={C.yellow}>
          <div style={{display: 'flex', justifyContent: 'space-around', padding: '30px 20px', textAlign: 'center'}}>
            <div><Label size={22}>SIP</Label><div style={{fontFamily: F.display, fontSize: 120}}>₹5,250</div></div>
            <div><Label size={22}>Lump sum</Label><div style={{fontFamily: F.display, fontSize: 120, color: C.inkSoft}}>₹4,000</div></div>
          </div>
        </Card>
      </Hold>
      <Note id="rca" x={110} y={870} w={860} h={330} at={l11} rot={-1.5} label="Rupee cost averaging" size={50}>
        sasta → <HL at={word('L11', 'zyada', -2)}>zyada units</HL><br />mehnga → kam units
      </Note>
      <Circle id="c50" cx={657} cy={720} rx={90} ry={80} at={word('L11', 'sasta', 0)} />
      <Hand x={120} y={700} at={word('L11', 'sasta', 4)} size={50} rot={-3} color={C.red}>₹50 pe 20 units!</Hand>
    </AbsoluteFill>
  );
};

const Rise: React.FC = () => {
  const {at, word} = useCues();
  const l13 = at('L13'), l14 = at('L14');
  return (
    <AbsoluteFill>
      <NavChart id="upnav" at={0} title="Bazaar seedha upar (example)" navs={[100, 110, 120, 130]}
        cues={[word('L12', '100', -2), word('L12', '110', -2), word('L12', '120', -2), word('L12', '130', -2)]} />
      <Tile id="sipv" y={870} at={l13} value={<>35.1 → ₹4,565</>} label={'SIP UNITS\n× ₹130'} rot={-1} size={100} />
      <Tile id="lumpv" y={1060} at={l14} value={<HL at={word('L14', '5,200')}>40 → ₹5,200</HL>} label={'LUMP SUM\n× ₹130'} hi rot={1} size={100} />
      <Stamp id="lw" text="Lump sum jeeta" x={600} y={720} at={word('L14', 'jeeta', -2)} size={84} rot={-7} paper />
    </AbsoluteFill>
  );
};

const Data: React.FC = () => {
  const {at, word} = useCues();
  const l16 = at('L16'), l17 = at('L17'), l18 = at('L18');
  return (
    <AbsoluteFill>
      <Headline words={['Asli', 'duniya', 'mein?']} at={0} out={l16} size={190} />
      <Bars id="vg" at={l16 - 2} title="Lump sum vs cost averaging · kaun aage?" max={100} note="VANGUARD RESEARCH · US, UK, AUS · ROLLING 10-YR PERIODS"
        bars={[
          {label: 'LUMP SUM\nAAGE', value: 67, text: '~2/3', at: word('L16', 'tihai', -6), hi: true},
          {label: 'SIP / DCA\nAAGE', value: 33, text: '~1/3', at: word('L16', 'tihai', 4)},
        ]} />
      <Hand x={140} y={1200} at={l17} out={l18} size={50} rot={-2} w={860}>kyunki bazaar zyada tar upar jaata hai ↗</Hand>
      <Hand x={140} y={1200} at={l18} size={50} rot={-2} w={860} color={C.red}>girte bazaar mein SIP = kam chot ↘</Hand>
    </AbsoluteFill>
  );
};

const Choose: React.FC = () => {
  const {word} = useCues();
  return (
    <AbsoluteFill>
      <Checklist id="pick" at={0} title="Aapke liye kya?" gap={136}
        items={[
          {t: 'Salary har mahine → SIP', s: 'paisa aata hi mahine mein hai', at: word('L19', 'sip', -4)},
          {t: 'Badi rakam → Lump sum', s: 'math lump sum ke favour mein', at: word('L20', 'lump', -4)},
          {t: 'Girne ka darr → STP', s: 'liquid fund → har mahine equity', at: word('L21', 'stp', -2)},
          {t: 'Asli fayda: discipline', s: 'bazaar gire tab bhi chalu', at: word('L22', 'discipline', -4)},
          {t: 'Girte bazaar mein SIP band', s: 'sabse mehngi galti', at: word('L23', 'band', -4), bad: true},
        ]} />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <SignOff shareLine="L24" logoLine="L25" shareWord="bhejo" friendNote="us dost ko jo 'sahi time' ka wait kar raha hai →"
    disclaimer={'EDUCATIONAL ONLY · NOT INVESTMENT ADVICE\nNAV PATHS ARE EXAMPLES · SIP DATA: AMFI, SEP 2026 · STUDY: VANGUARD'} />
);

export const sip: EpisodeDef = {
  id: 'sip-vs-lumpsum',
  topic: 'SIP vs LUMP SUM',
  timeline: timeline as Timeline,
  scenes: {hook: Hook, what: What, dip: Dip, rise: Rise, data: Data, choose: Choose, outro: Outro},
};
