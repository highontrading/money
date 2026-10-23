import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Checklist, Headline, Hold, Note, SignOff, Tile} from '../components/kit';
import {Card, Count, Hand, HL, Label, Photo, Sfx, Stamp, Tape} from '../components/paper';
import {EpisodeDef} from '../Episode';
import {clamp, stepped} from '../lib/motion';
import {Timeline, useCues} from '../lib/timeline';
import {C, F} from '../theme';
import timeline from '../data/ep06-repo.json';

const Node: React.FC<{id: string; x: number; y: number; at: number; out?: number; title: string; sub: string; hi?: boolean; rot?: number}> = ({id, x, y, at, out, title, sub, hi, rot = 0}) => (
  <Card id={id} x={x} y={y} w={280} h={230} rot={rot} at={at} out={out} bg={hi ? C.yellow : C.card}>
    <div style={{fontFamily: F.display, fontSize: 84, textAlign: 'center', marginTop: 34}}>{title}</div>
    <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20, textAlign: 'center', marginTop: 4, padding: '0 10px'}}>{sub}</div>
  </Card>
);

const Arrow: React.FC<{x: number; y: number; at: number; out?: number; label?: string}> = ({x, y, at, out, label}) => {
  const frame = useCurrentFrame();
  if (frame < at || (out !== undefined && frame >= out)) return null;
  const p = interpolate(stepped(frame), [at, at + 8], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 60, zIndex: 60, textAlign: 'center'}}>
      <div style={{fontFamily: F.display, fontSize: 80, clipPath: `inset(0 ${100 - p * 100}% 0 0)`}}>→</div>
      {label ? <div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 30, color: C.red, whiteSpace: 'nowrap', marginLeft: -40}}>{label}</div> : null}
    </div>
  );
};

const Hook: React.FC = () => {
  const {at, word} = useCues();
  const l2 = at('L02'), l3 = at('L03');
  return (
    <AbsoluteFill>
      <Photo id="rbi" src="rbi.jpg" x={80} y={400} w={920} h={560} rot={-2} at={0} out={l2} enter="up" torn={{top: true, bottom: true}} rough={14} caption="RBI · MPC · 7 OCT 2026" />
      <Tile id="hike" y={930} at={word('L01', 'repo', -3)} out={l2} value={<>5.25% → <HL at={word('L01', '5.50')}>5.50%</HL></>} label={'REPO\nRATE'} rot={-1.5} size={96} x={80} w={920} />
      <Stamp id="p25" text="+0.25%" x={800} y={520} at={word('L01', '5.50', 4)} out={l2} size={96} rot={8} paper />
      <Photo id="flats" src="flats.jpg" x={70} y={410} w={940} h={520} rot={1.5} at={l2} out={l3} enter="up" torn={{top: true, bottom: true}} rough={14} caption="HOME LOAN" />
      <Card id="emiq" x={200} y={900} w={680} h={230} rot={-3} at={word('L02', 'emi', -4)} out={l3} bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 150, textAlign: 'center', marginTop: 24}}>EMI ?</div>
      </Card>
      <Node id="n1" x={70} y={600} at={l3} title="RBI" sub="REPO RATE" rot={-2} />
      <Arrow x={360} y={650} at={l3 + 8} />
      <Node id="n2" x={400} y={630} at={l3 + 10} title="BANK" sub="LOAN RATE" rot={1.5} />
      <Arrow x={690} y={680} at={l3 + 18} />
      <Node id="n3" x={730} y={600} at={word('L03', 'account', -6)} title="AAP" sub="EMI" hi rot={-1} />
    </AbsoluteFill>
  );
};

const Repo: React.FC = () => {
  const {at, word} = useCues();
  const l5 = at('L05'), l6 = at('L06');
  return (
    <AbsoluteFill>
      <Note id="def" x={110} y={420} w={860} h={330} at={0} rot={-1.5} label="Repo rate" size={46}>
        RBI → <HL at={word('L04', 'banks')}>banks</HL> ko thode samay ka udhaar, is rate pe
      </Note>
      <Node id="r1" x={70} y={820} at={l5 - 4} title="RBI" sub="5.50%" rot={-2} />
      <Arrow x={360} y={860} at={l5} label="udhaar mehenga" />
      <Node id="r2" x={400} y={840} at={l5 + 6} title="BANK" sub="KHARCHA ↑" rot={1.5} />
      <Arrow x={690} y={880} at={l6} label="pass on" />
      <Node id="r3" x={730} y={820} at={word('L06', 'aap', -4)} title="AAP" sub="LOAN RATE ↑" hi rot={-1} />
    </AbsoluteFill>
  );
};

const Link: React.FC = () => {
  const {at, word} = useCues();
  const l8 = at('L08'), l9 = at('L09');
  return (
    <AbsoluteFill>
      <Note id="ebl" x={110} y={420} w={860} h={340} at={0} out={l8} rot={-1.5} label="RBI rule · 1 Oct 2019" size={44}>
        Naye floating retail loans → <HL at={word('L07', 'external', -2)}>external benchmark</HL> se jude. Zyada tar: REPO
      </Note>
      <Tile id="f1" y={430} at={l8} value="Repo" label={'RBI SET KARTA'} rot={-1.5} />
      <Tile id="f2" y={620} at={word('L08', 'spread', -4)} op="+" value="Spread" label={'BANK KA MARGIN\nAAPKE PROFILE PE'} rot={1} />
      <Tile id="f3" y={810} at={word('L08', 'spread', 4)} op="=" value={<HL at={word('L08', 'spread', 6)}>Aapka rate</HL>} label={'HOME LOAN RATE'} rot={-1} />
      <Hold from={l9}>
        <Card id="ex" x={110} y={1010} w={860} h={190} rot={1.5} at={l9} bg={C.yellow}>
          <div style={{fontFamily: F.display, fontSize: 70, textAlign: 'center', marginTop: 20, lineHeight: 1.1}}>5.25 + 2.75 = 8% → <HL at={word('L09', '8.25', -2)} color={C.paperLight}>5.50 + 2.75 = 8.25%</HL></div>
        </Card>
      </Hold>
    </AbsoluteFill>
  );
};

const Emi: React.FC = () => {
  const {at, word} = useCues();
  const l11 = at('L11'), l12 = at('L12');
  return (
    <AbsoluteFill>
      <Photo id="flats2" src="flats.jpg" x={90} y={410} w={900} h={250} rot={-1} at={0} enter="up" torn={{bottom: true}} rough={12} caption="₹50 LAKH · 20 SAAL" pos="50% 40%" zoom={0} />
      <Tile id="e8" y={690} at={word('L10', '8%', -4)} value={<Count from={0} to={41822} at={word('L10', 'emi', 0)} dur={16} />} label={'EMI @ 8%'} rot={-1} />
      <Tile id="e825" y={880} at={l11} value={<Count from={41822} to={42603} at={l11 + 4} dur={14} />} label={'EMI @ 8.25%'} hi rot={1} />
      <Hand x={100} y={1050} at={word('L11', '781', -2)} size={50} rot={-2} color={C.red}>+₹781 har mahine</Hand>
      <Stamp id="19l" text="≈ ₹1.9 lakh" sub="781 × 240 MAHINE" x={660} y={1170} at={word('L12', 'lakh', -6)} size={76} rot={-6} paper />
      <Sfx at={l12} name="coin" volume={0.2} />
    </AbsoluteFill>
  );
};

const Tenure: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l14 = at('L14'), l15 = at('L15'), l16 = at('L16');
  const grow = interpolate(stepped(frame), [l14 + 6, l14 + 24], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Card id="opt1" x={80} y={420} w={430} h={280} rot={-2} at={0} enter="left" bg={C.card}>
        <div style={{padding: 26}}><Label size={22}>Option A</Label><div style={{fontFamily: F.display, fontSize: 90, marginTop: 14}}>EMI ↑</div><div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22}}>₹781 / MAHINA ZYADA</div></div>
      </Card>
      <Card id="opt2" x={570} y={440} w={430} h={280} rot={2} at={word('L13', 'tenure', -4)} enter="right" bg={C.yellow}>
        <div style={{padding: 26}}><Label size={22}>Option B · default</Label><div style={{fontFamily: F.display, fontSize: 90, marginTop: 14}}>TENURE ↑</div><div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22}}>EMI WAHI, LOAN LAMBA</div></div>
      </Card>
      <Hold from={l14}>
        <Card id="bar" x={80} y={760} w={920} h={300} rot={-1} at={l14} enter="up" bg={C.card}>
          <div style={{padding: '24px 30px'}}><Label size={22}>Loan ki lambai (mahine)</Label></div>
          <div style={{position: 'absolute', left: 30, top: 110, width: 760, height: 90, background: C.paperLight, border: `4px solid ${C.ink}`, fontFamily: F.display, fontSize: 56, display: 'flex', alignItems: 'center', paddingLeft: 20}}>240</div>
          <div style={{position: 'absolute', left: 794, top: 110, width: 96 * grow, height: 90, background: C.red, border: grow > 0 ? `4px solid ${C.ink}` : 'none'}} />
          <div style={{position: 'absolute', left: 700, top: 215, fontFamily: F.display, fontSize: 52, color: C.red, opacity: grow}}>+12 ≈ 252</div>
        </Card>
      </Hold>
      <Hold from={l15}>
        <Card id="5l" x={160} y={1080} w={760} h={150} rot={1.5} at={l15} bg={C.yellow}>
          <div style={{fontFamily: F.display, fontSize: 88, textAlign: 'center', marginTop: 18}}>≈ ₹5 LAKH ZYADA</div>
        </Card>
      </Hold>
      <Stamp id="choose" text="EMI badhwao" sub="AKSAR SASTA" x={300} y={600} at={word('L16', 'emi', -2)} size={76} rot={-8} paper />
    </AbsoluteFill>
  );
};

const When: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l18 = at('L18');
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return (
    <AbsoluteFill>
      <Card id="cal" x={80} y={420} w={920} h={460} rot={-1} at={0} enter="up" bg={C.card}>
        <div style={{padding: 30}}>
          <Label size={22}>Reset date · example: har quarter</Label>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginTop: 24}}>
            {months.map((m, i) => (
              <div key={m} style={{border: `3px solid ${C.ink}`, padding: '14px 0', textAlign: 'center', fontFamily: F.display, fontSize: 44, background: i % 3 === 0 && frame >= word('L17', 'reset', 4) ? C.yellow : C.paperLight}}>{m}</div>
            ))}
          </div>
        </div>
      </Card>
      <Hand x={140} y={900} at={word('L17', 'teen', -2)} size={58} rot={-2}>naya rate → agli reset date pe</Hand>
      <Note id="mclr" x={110} y={990} w={860} h={230} at={l18} rot={1.5} label="Purana loan · MCLR" size={42}>
        rate dheere upar, dheere neeche
      </Note>
    </AbsoluteFill>
  );
};

const Fd: React.FC = () => {
  const {at, word} = useCues();
  return (
    <AbsoluteFill>
      <Card id="fd" x={140} y={460} w={800} h={560} rot={-2} at={0} enter="up" bg={C.yellow}>
        <div style={{padding: 40}}>
          <Label size={24}>Doosri taraf</Label>
          <div style={{fontFamily: F.display, fontSize: 170, lineHeight: 1, marginTop: 30}}>FD RATES ↑</div>
          <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 40, marginTop: 20}}>aksar, thoda der se</div>
        </div>
      </Card>
      <Tape id="tf" x={470} y={444} w={150} rot={-5} at={2} />
      <Hand x={300} y={1060} at={word('L20', 'der', -2)} size={58} rot={-3}>loan jaldi badalta, FD dheere</Hand>
    </AbsoluteFill>
  );
};

const Why: React.FC = () => {
  const {at, word} = useCues();
  const l22 = at('L22'), l23 = at('L23');
  return (
    <AbsoluteFill>
      <Headline words={['Kyun?', 'Inflation']} at={0} out={l22} size={190} />
      <Tile id="cpi" y={430} at={l22} out={l23} value={<HL at={word('L22', '5.54')}>5.54%</HL>} label={'CPI · SEP 2026\nTARGET BAND 2–6%'} rot={-1.5} size={130} h={210} />
      {[['LOAN ↑', 'loan'], ['KHARCHA ↓', 'kharcha'], ['DAAM THANDE', 'thande']].map(([t, k], i) => (
        <Card key={k} id={'w' + k} x={80 + i * 310} y={720} w={290} h={260} rot={[-2, 1, 2][i]} at={word('L23', k, -4)} bg={i === 2 ? C.yellow : C.card}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, padding: '16px 20px'}}>{`0${i + 1}`}</div>
          <div style={{fontFamily: F.display, fontSize: 66, textAlign: 'center', lineHeight: 1}}>{t}</div>
        </Card>
      ))}
    </AbsoluteFill>
  );
};

const Do: React.FC = () => {
  const {word} = useCues();
  return (
    <AbsoluteFill>
      <Checklist id="ask" at={0} title="Bank se pucho"
        items={[
          {t: 'Mera benchmark kya hai?', s: 'repo-linked (EBLR) ya MCLR', at: word('L24', 'benchmark', -4)},
          {t: 'Reset date kab hai?', s: 'naya rate kab se', at: word('L24', 'reset', -4)},
          {t: 'Tenure badha ya EMI?', s: 'option ho toh EMI badhwao', at: word('L24', 'reset', 14)},
          {t: 'Bonus → prepayment', s: 'tenure aur interest dono kam', at: word('L25', 'prepayment', -4)},
        ]} />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <SignOff shareLine="L26" logoLine="L27" shareWord="bhejo" friendNote="us dost ko jiska home loan chal raha hai →"
    disclaimer={'EDUCATIONAL ONLY · NOT FINANCIAL ADVICE\nREPO: RBI, 7 OCT 2026 · EMI: ₹50L, 20Y, SPREAD 2.75% (EXAMPLE)'} />
);

export const repo: EpisodeDef = {
  id: 'repo-rate-emi',
  topic: 'REPO → EMI',
  timeline: timeline as Timeline,
  scenes: {hook: Hook, repo: Repo, link: Link, emi: Emi, tenure: Tenure, when: When, fd: Fd, why: Why, do: Do, outro: Outro},
};

