import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Checklist, Headline, Hold, Note, SignOff, Tile} from '../components/kit';
import {Card, Cross, Hand, HL, Label, Photo, Stamp, Tape} from '../components/paper';
import {EpisodeDef} from '../Episode';
import {clamp, stepped} from '../lib/motion';
import {Timeline, useCues} from '../lib/timeline';
import {C, F} from '../theme';
import timeline from '../data/fd.json';

const Hook: React.FC = () => {
  const {at, word} = useCues();
  const l2 = at('L02');
  return (
    <AbsoluteFill>
      <Photo id="rbi" src="rbi.jpg" x={70} y={410} w={940} h={520} rot={-2} at={0} out={l2} enter="up" torn={{top: true, bottom: true}} rough={14} caption="RBI · 7 OCT 2026" />
      <Tile id="repo" y={960} at={word('L01', 'repo', -4)} out={l2} value={<>5.25% → <HL at={word('L01', '5.50', 0)}>5.50%</HL></>} label={'REPO RATE'} rot={-1.5} size={100} h={190} />
      <Card id="fd" x={160} y={440} w={760} h={480} rot={-2} at={l2} enter="up" bg={C.paperLight}>
        <div style={{padding: '34px 44px', fontFamily: F.type}}>
          <Label size={22}>Fixed deposit receipt</Label>
          <div style={{fontSize: 40, marginTop: 34}}>Amount: ₹1,00,000</div>
          <div style={{fontSize: 40, marginTop: 18}}>Tenure: 1 saal</div>
          <div style={{fontSize: 52, marginTop: 30}}>Rate: <span style={{fontFamily: F.display, fontSize: 80}}>?</span></div>
        </div>
      </Card>
      <Stamp id="notyet" text="Abhi nahi" sub="ZYADA TAR BANKS" x={600} y={1040} at={word('L02', 'abhi', -2)} size={110} rot={-7} />
    </AbsoluteFill>
  );
};

// Two runners: the loan rate moves at once, the FD rate drags behind.
const Race: React.FC<{at: number; loanAt: number; fdAt: number}> = ({at, loanAt, fdAt}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  const loan = interpolate(f, [loanAt, loanAt + 14], [0, 1], clamp);
  const fd = interpolate(f, [fdAt, fdAt + 60], [0, 0.35], clamp);
  const lane = (y: number, p: number, label: string, color: string) => (
    <>
      <div style={{position: 'absolute', left: 50, top: y, fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 2}}>{label}</div>
      <div style={{position: 'absolute', left: 50, right: 50, top: y + 44, height: 70, border: `4px solid ${C.ink}`, background: C.paperLight}} />
      <div style={{position: 'absolute', left: 54, top: y + 48, height: 62, width: 752 * p, background: color}} />
    </>
  );
  return (
    <Card id="race" x={80} y={430} w={920} h={420} rot={-1} at={at} enter="up" bg={C.card}>
      <div style={{padding: '26px 40px'}}><Label size={22}>Repo badha. Ab kaun kitna hila?</Label></div>
      {lane(110, loan, 'NAYA LOAN RATE · REPO SE JUDA', C.red)}
      {lane(250, fd, 'FD RATE · BANK KHUD TAY KARE', C.yellow)}
    </Card>
  );
};

const Why: React.FC = () => {
  const {at, word} = useCues();
  const l5 = at('L05');
  return (
    <AbsoluteFill>
      <Race at={0} loanAt={word('L03', 'seedha', -4)} fdAt={word('L04', 'khud', -2)} />
      <Hand x={130} y={880} at={word('L04', 'zaroorat', -4)} out={l5} size={54} rot={-2}>deposit chahiye → tab rate badhega</Hand>
      <Card id="sbi" x={110} y={900} w={860} h={290} rot={1.5} at={l5} bg={C.yellow}>
        <div style={{padding: '30px 40px'}}>
          <Label size={22}>SBI chairman · October 2026</Label>
          <div style={{fontFamily: F.display, fontSize: 110, marginTop: 20}}>"2–3 MAHINE"</div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

const Nbfc: React.FC = () => {
  const {at, word} = useCues();
  const l7 = at('L07'), l9 = at('L09'), l10 = at('L10');
  return (
    <AbsoluteFill>
      <Card id="nb" x={140} y={440} w={800} h={420} rot={-2} at={0} out={l7} enter="drop" bg={C.yellow}>
        <div style={{padding: '34px 44px'}}>
          <Label size={22}>NBFC FD · tak</Label>
          <div style={{fontFamily: F.display, fontSize: 220, lineHeight: 1.1, marginTop: 20}}>8.95%</div>
        </div>
      </Card>
      <Hand x={200} y={920} at={word('L06', 'zyada', -2)} out={l7} size={64} rot={-3}>zyada lagta hai na?</Hand>
      <Card id="bank" x={80} y={440} w={430} h={560} rot={-2} at={l7} enter="left" bg={C.card}>
        <div style={{padding: 30}}>
          <Label size={22}>Bank FD</Label>
          <div style={{fontFamily: F.display, fontSize: 70, marginTop: 30, lineHeight: 1.05}}>DICGC<br />INSURANCE ✓</div>
          <div style={{fontFamily: F.display, fontSize: 96, marginTop: 30}}><HL at={word('L08', '5', -2)}>₹5 LAKH</HL></div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20, marginTop: 10, lineHeight: 1.4}}>HAR BANK MEIN,<br />HAR DEPOSITOR</div>
        </div>
      </Card>
      <Card id="nbfc" x={570} y={470} w={430} h={560} rot={2} at={l9} out={undefined} enter="right" bg={C.card}>
        <div style={{padding: 30}}>
          <Label size={22}>NBFC FD</Label>
          <div style={{fontFamily: F.display, fontSize: 70, marginTop: 30, lineHeight: 1.05}}>DICGC<br />INSURANCE ✗</div>
          <div style={{fontFamily: F.display, fontSize: 80, marginTop: 30}}>RATING<br />DEKHO</div>
        </div>
      </Card>
      <Hold from={l10}>
        <Card id="rule" x={110} y={1050} w={860} h={170} rot={-1} at={l10} bg={C.yellow} z={30}>
          <div style={{fontFamily: F.display, fontSize: 74, textAlign: 'center', marginTop: 36, whiteSpace: 'nowrap'}}>ZYADA BYAAJ = ZYADA RISK</div>
        </Card>
      </Hold>
    </AbsoluteFill>
  );
};

const Ladder: React.FC = () => {
  const {at, word} = useCues();
  const l12 = at('L12'), l13 = at('L13'), l14 = at('L14');
  const rungs = [['1 SAAL', 'L12', '1'], ['2 SAAL', 'L12', 'do'], ['3 SAAL', 'L12', 'teen']];
  return (
    <AbsoluteFill>
      <Headline words={['FD', 'laddering']} at={0} out={l12} size={200} y={560} />
      <Hold from={l12}>
        <Card id="total" x={110} y={420} w={860} h={140} rot={-1} at={l12} bg={C.card}>
          <div style={{fontFamily: F.display, fontSize: 84, textAlign: 'center', marginTop: 24}}>₹3 LAKH → 3 FD</div>
        </Card>
        {rungs.map(([t, line, w], i) => (
          <Card key={t} id={'r' + i} x={150 + i * 60} y={600 + i * 170} w={680} h={140} rot={[-1.5, 1, -0.5][i]} at={word(line, w, -4) + (i === 0 ? 8 : 0)} bg={C.paperLight}>
            <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 34px', fontFamily: F.type, fontSize: 44}}>
              <span style={{flex: 1}}>FD #{i + 1} · ₹1 lakh</span><span style={{fontFamily: F.display, fontSize: 64}}>{t}</span>
            </div>
          </Card>
        ))}
      </Hold>
      <Stamp id="mat" text="Har saal ek mature" x={560} y={1150} at={l13} out={l14} size={72} rot={-5} paper />
      <Hand x={130} y={1120} at={l14} size={54} rot={-2} color={C.red}>rate gire? baaki purane rate pe ✓</Hand>
    </AbsoluteFill>
  );
};

const Tips: React.FC = () => {
  const {at, word} = useCues();
  return (
    <AbsoluteFill>
      <Tile id="sr" y={440} at={0} op="+" value="0.5%" label={'SENIOR CITIZEN\nAKSAR'} rot={-1.5} size={130} h={220} hi />
      <Note id="tax" x={110} y={720} w={860} h={330} at={at('L16')} rot={1} label="FD ka byaaj" size={46}>
        income mein judta hai → <HL at={word('L16', 'slab', -2)}>slab ke hisaab se tax</HL>
      </Note>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <SignOff shareLine="L17" logoLine="L18" shareWord="bhejo" friendNote="us dost ko jo roz poochta hai: FD rate kab badhega? →"
    disclaimer={'EDUCATIONAL ONLY · NOT FINANCIAL ADVICE\nREPO 5.50% (7 OCT 2026) · DICGC ₹5 LAKH PER DEPOSITOR PER BANK\nNBFC RATE: PUBLISHED OFFERS, OCT 2026 · CHECK EACH BANK'} />
);

export const fd: EpisodeDef = {
  id: 'fd-rates',
  topic: 'FD RATE KAB?',
  timeline: timeline as Timeline,
  scenes: {hook: Hook, why: Why, nbfc: Nbfc, ladder: Ladder, tips: Tips, outro: Outro},
};
