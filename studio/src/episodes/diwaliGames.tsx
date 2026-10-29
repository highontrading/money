import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Checklist, Headline, Hold, Note, SignOff, Tile} from '../components/kit';
import {Card, Count, Cross, Hand, HL, Label, Marker, Photo, Stamp} from '../components/paper';
import {EpisodeDef} from '../Episode';
import {clamp, stepped} from '../lib/motion';
import {Timeline, useCues} from '../lib/timeline';
import {C, F} from '../theme';
import timeline from '../data/diwali-games.json';

// A paper playing card.
const PlayCard: React.FC<{id: string; x: number; y: number; at: number; out?: number; rank: string; suit: string; rot: number}> = ({id, x, y, at, out, rank, suit, rot}) => {
  const red = suit === '♥' || suit === '♦';
  return (
    <Card id={id} x={x} y={y} w={200} h={280} rot={rot} at={at} out={out} enter="drop" bg={C.paperLight}>
      <div style={{position: 'absolute', inset: 10, border: `2px solid ${C.ink}`, borderRadius: 8}} />
      <div style={{position: 'absolute', left: 22, top: 18, fontFamily: F.display, fontSize: 56, color: red ? C.red : C.ink, lineHeight: 1}}>{rank}</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 90, textAlign: 'center', fontSize: 110, color: red ? C.red : C.ink}}>{suit}</div>
    </Card>
  );
};

const Hook: React.FC = () => {
  const {at, word} = useCues();
  const l2 = at('L02');
  return (
    <AbsoluteFill>
      <Photo id="diyas" src="diyas.jpg" x={70} y={410} w={940} h={460} rot={-2} at={0} out={l2} enter="up" torn={{top: true, bottom: true}} rough={14} caption="DIWALI KI RAAT" />
      <PlayCard id="c1" x={140} y={880} at={word('L01', 'taash', -4)} out={l2} rank="A" suit="♠" rot={-12} />
      <PlayCard id="c2" x={300} y={860} at={word('L01', 'taash', 0)} out={l2} rank="K" suit="♥" rot={-3} />
      <PlayCard id="c3" x={460} y={870} at={word('L01', 'taash', 4)} out={l2} rank="Q" suit="♦" rot={8} />
      <Stamp id="daav" text="Thoda sa daav" x={790} y={1010} at={word('L01', 'daav', -4)} out={l2} size={64} rot={-8} paper />
      <Headline words={['Jeet-ta', 'kaun', 'hai?']} at={l2} size={200} y={560} label="Lambe samay mein" />
    </AbsoluteFill>
  );
};

const Running: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const p = interpolate(stepped(frame), [at, at + 30], [0, 1], clamp);
  return (
    <>
      <Card id="run" x={80} y={430} w={920} h={520} rot={-1} at={at - 2} enter="up" bg={C.card}>
        <div style={{padding: '28px 40px'}}><Label size={22}>100 round ka hisaab · average</Label></div>
        <div style={{position: 'absolute', left: 60, right: 60, top: 260, borderTop: `3px dashed ${C.inkSoft}`}} />
        <div style={{position: 'absolute', left: 64, top: 222, fontFamily: F.mono, fontWeight: 700, fontSize: 20}}>₹0</div>
        <div style={{position: 'absolute', right: 60, bottom: 40, fontFamily: F.display, fontSize: 110, color: C.red}}>−₹{Math.round(500 * p)}</div>
      </Card>
      <Marker id="runl" d="M140,690 L260,700 L340,688 L430,730 L520,722 L610,770 L700,780 L790,820 L880,850" at={at + 2} dur={28} width={10} />
    </>
  );
};

const Calc: React.FC = () => {
  const {at, word} = useCues();
  const l6 = at('L06');
  return (
    <AbsoluteFill>
      <Hold to={l6}>
        <Card id="coin" x={360} y={430} w={360} h={360} rot={0} at={0} enter="drop" bg="transparent" texture={null}>
          <div style={{position: 'absolute', inset: 8, borderRadius: '50%', background: C.yellow, border: `8px solid ${C.ink}`, boxShadow: `inset 0 0 0 14px ${C.yellow}, inset 0 0 0 18px ${C.ink}`}} />
          <div style={{position: 'relative', fontFamily: F.display, fontSize: 170, textAlign: 'center', marginTop: 70}}>₹</div>
        </Card>
        <Card id="win" x={80} y={830} w={430} h={220} rot={-2} at={word('L03', '90', -4)} bg={C.card}>
          <div style={{padding: 26}}><Label size={22}>Jeete</Label><div style={{fontFamily: F.display, fontSize: 100, marginTop: 10}}>+₹90</div></div>
        </Card>
        <Card id="lose" x={570} y={850} w={430} h={220} rot={2} at={word('L03', '100', -4)} bg={C.card}>
          <div style={{padding: 26}}><Label size={22}>Haare</Label><div style={{fontFamily: F.display, fontSize: 100, marginTop: 10, color: C.red}}>−₹100</div></div>
        </Card>
        <Stamp id="avg" text="−₹5 / round" sub="AVERAGE" x={540} y={620} at={word('L04', '5', -4)} size={96} rot={-6} paper />
        <Hand x={120} y={1100} at={at('L05')} size={52} rot={-2} color={C.red}>₹10 ka fark = house ka cut</Hand>
      </Hold>
      <Running at={l6} />
      <Hold from={l6}>
        <Hand x={140} y={990} at={word('L06', '100', -2)} size={54} rot={-2}>ek round mein pata nahi chalta…</Hand>
      </Hold>
      <Stamp id="ganit" text="Ganit unke saath" x={540} y={1130} at={word('L07', 'ganit', -4)} size={84} rot={-5} />
    </AbsoluteFill>
  );
};

const Law: React.FC = () => {
  const {at, word} = useCues();
  const l10 = at('L10');
  return (
    <AbsoluteFill>
      <Note id="act" x={110} y={430} w={860} h={330} at={0} out={l10} rot={-1.5} label="Online Gaming Act · 2025" size={48}>
        Paise wale online games pe <HL at={word('L08', 'ban', -2)}>ban</HL>
      </Note>
      <Tile id="jail" y={800} at={word('L09', '3', -4)} out={l10} value="3 SAAL" label={'TAK JAIL\nCHALANE WALE KO'} rot={1} size={110} h={170} />
      <Tile id="fine" y={990} at={word('L09', 'crore', -6)} out={l10} value="₹1 CRORE" label={'TAK\nJURMANA'} rot={-1} size={110} h={170} hi />
      <Photo id="app" src="phone.jpg" x={60} y={430} w={868} h={652} rot={-3} at={l10} enter="up" torn={{right: true, top: true}} rough={14} zoom={0.02} />
      <Card id="dbl" x={520} y={480} w={460} h={200} rot={6} at={l10 + 4} bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 84, textAlign: 'center', marginTop: 46}}>PAISA DOUBLE!</div>
      </Card>
      <Cross id="x" x={540} y={490} w={420} h={180} at={word('L10', 'risk', -4)} />
      <Hand x={110} y={1110} at={word('L10', 'ganit', -4)} size={52} rot={-2} color={C.red}>risk aapka, ganit unka</Hand>
    </AbsoluteFill>
  );
};

const Rules: React.FC = () => {
  const {word} = useCues();
  return (
    <AbsoluteFill>
      <Checklist id="r" at={0} title="Diwali ka niyam" gap={190} h={600}
        items={[
          {t: 'Utna hi jitna kho sako', s: 'pehle se limit tay', at: word('L11', 'utna', -4)},
          {t: '"Bas ek aur round"', s: 'sabse mehenga round', at: word('L12', 'bas', -4), bad: true},
        ]} />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <SignOff shareLine="L13" logoLine="L14" shareWord="bhejo" friendNote="us dost ko jo har baar kehta hai: bas ek aur →"
    disclaimer={'EDUCATIONAL ONLY · NOT LEGAL ADVICE\nPROMOTION AND REGULATION OF ONLINE GAMING ACT, 2025\nCOIN GAME IS AN ILLUSTRATION OF HOUSE EDGE'} />
);

export const diwaliGames: EpisodeDef = {
  id: 'diwali-daav',
  topic: 'DIWALI KA DAAV',
  timeline: timeline as Timeline,
  scenes: {hook: Hook, math: Calc, law: Law, rules: Rules, outro: Outro},
};
