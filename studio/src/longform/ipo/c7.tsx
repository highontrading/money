import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Hold} from '../../components/kit';
import {Big, Card, Cross, Hand, HL, Label, Photo, Sfx, Stamp, Tape} from '../../components/paper';
import {ease, pop, stepped} from '../../lib/motion';
import {useCues} from '../../lib/timeline';
import {C, F} from '../../theme';
import {Arrow, Footage, Person, Slip, Typed} from '../kit16';

// Paper padlock; the shackle lifts and swings open from `openAt`.
const Padlock: React.FC<{size: number; openAt?: number; color?: string}> = ({size, openAt, color = C.yellow}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  const p = openAt === undefined ? 0 : ease(f, openAt, openAt + 6);
  return (
    <>
      {openAt !== undefined ? <Sfx at={openAt} name="padlock" volume={0.5} /> : null}
      <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible'}}>
        <g transform={`translate(${-6 * p}, ${-14 * p}) rotate(${-28 * p} 72 46)`}>
          <path d="M28,48 L28,32 C28,14 72,14 72,32 L72,48" fill="none" stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
        </g>
        <rect x={16} y={44} width={68} height={50} rx={6} fill={color} stroke={C.ink} strokeWidth={5} />
        <circle cx={50} cy={64} r={6} fill={C.ink} />
        <rect x={47} y={66} width={6} height={14} fill={C.ink} />
      </svg>
    </>
  );
};

type Lock = {when: string; who: string; sub: string; at: number; openAt?: number};

const Lockin: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l7 = at('L107'), l9 = at('L109'), l10 = at('L110');
  const openAll = word('L110', 'khulte', -2);
  const locks: Lock[] = [
    {when: '30 DIN', who: 'ANCHORS', sub: 'AADHE SHARES', at: word('L107', '30', -6), openAt: word('L107', 'free', -4)},
    {when: '90 DIN', who: 'ANCHORS', sub: 'BAAKI AADHE', at: word('L107', '90', -6), openAt: word('L107', 'aadhe', -2)},
    {when: '6 MAHINE', who: 'PRIVATE', sub: 'PURANE INVESTORS', at: word('L108', 'purane', -4), openAt: word('L108', 'baad', -4)},
    {when: '18 MAHINE', who: 'PROMOTERS', sub: 'KAM SE KAM 20%', at: word('L109', '18', -6), openAt: openAll},
    {when: '3 SAAL', who: 'KUCH CASE', sub: 'PROMOTERS', at: word('L109', 'teen', -4), openAt: openAll + 5},
  ];
  const cw = 300, gap = 42, x0 = 135;
  return (
    <AbsoluteFill>
      {/* after listing day, the story goes on */}
      <Footage id="lk-floor" src="floor_crowd" x={110} y={150} w={1000} h={620} rot={-2} at={0} out={l7 - 4} enter="left" torn={{top: true, right: true}} rough={14} caption="ARCHIVE FILM · LISTING KE BAAD" />
      <Hand x={190} y={820} at={word('L106', 'kahani', -2)} out={l7 - 4} size={76} rot={-2}>kahani khatam nahi…</Hand>
      <Card id="lk-big" x={1210} y={190} w={560} h={600} rot={3} at={word('L106', 'taale', -6)} out={l7 - 4} enter="drop" bg={C.paperLight}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 50}}>
          <Padlock size={300} openAt={word('L106', 'khulte', -2)} />
          <div style={{fontFamily: F.display, fontSize: 96, marginTop: 20, lineHeight: 1}}>LOCK-IN</div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, marginTop: 10}}>TAALE KHULTE HAIN</div>
        </div>
      </Card>

      {/* the row of locks, each opening as it is named */}
      <Hold from={l7 - 4}>
        <Card id="lk-strip" x={110} y={700} w={1700} h={74} rot={-0.4} at={l7 - 4} enter="left" bg={C.kraft} texture="kraft" torn={{top: true, bottom: true}} sfx="tear">
          <div style={{position: 'absolute', left: 24, right: 24, top: 32, borderTop: `6px dashed ${C.paperLight}`}} />
        </Card>
      </Hold>
      <Hold from={l7 - 4} to={word('L110', 'badh', -6)}>
        <div style={{position: 'absolute', left: 120, top: 810}}><Label size={26}>Listing ke baad · kab kaun bech sakta hai</Label></div>
        <Hand x={1000} y={830} at={word('L107', 'anchors', -2)} out={at('L108')} size={64} rot={-2}>pehle anchors…</Hand>
        <Hand x={1000} y={830} at={at('L108')} out={l9} size={64} rot={-2}>phir purane investors…</Hand>
        <Hand x={1000} y={830} at={word('L109', 'promoters', -2)} size={64} rot={-2} color={C.red}>aur promoters bhi…</Hand>
      </Hold>
      {locks.map((k, i) => {
        const x = x0 + i * (cw + gap);
        const open = k.openAt !== undefined && frame >= k.openAt;
        return (
          <Card key={k.when} id={'lk-' + i} x={x} y={140} w={cw} h={530} rot={[-2, 1.5, -1, 2, -1.5][i]} at={k.at} enter="drop" bg={open ? C.yellow : C.paperLight}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 34}}>
              <Padlock size={200} openAt={k.openAt} color={open ? C.paperLight : C.yellow} />
              <div style={{fontFamily: F.display, fontSize: k.when.length > 8 ? 64 : 80, lineHeight: 1, marginTop: 22, whiteSpace: 'nowrap'}}>{k.when}</div>
              <div style={{fontFamily: F.display, fontSize: 44, lineHeight: 1, marginTop: 16}}>{k.who}</div>
              <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, marginTop: 12, textAlign: 'center'}}>{k.sub}</div>
            </div>
          </Card>
        );
      })}

      {/* opened locks bring sellers */}
      <Hold from={l10}>
        <div style={{position: 'absolute', left: 120, top: 830}}>
          <Big words={['Bechne', 'wale', '↑']} at={word('L110', 'bechne', -4)} size={130} color={C.red} />
        </div>
      </Hold>
      {locks.map((k, i) =>
        Array.from({length: 3}).map((_, j) => (
          <Slip key={`s${i}${j}`} id={`lk-sell${i}${j}`} x={x0 + i * (cw + gap) + cw / 2 + (j - 1) * 30} y={760 - j * 36} at={word('L110', 'badh', -6) + i * 3 + j * 4} text="SELL" w={110} h={46} size={16} color={j === 2 ? C.red : C.paperLight} />
        )),
      )}
      <Card id="lk-rhp" x={1170} y={800} w={640} h={190} rot={-1.5} at={word('L110', 'dates', -6)} enter="right" bg={C.card} z={60}>
        <div style={{padding: '24px 32px'}}>
          <Label size={20}>RHP · lock-in</Label>
          <div style={{fontFamily: F.type, fontSize: 36, marginTop: 14, lineHeight: 1.3}}>
            <HL at={word('L110', 'pehle', -4)}>dates pehle se likhi</HL> hoti hain
          </div>
        </div>
      </Card>
      <Tape id="lk-tape" x={1440} y={784} w={170} rot={-6} at={word('L110', 'dates', 0)} />
    </AbsoluteFill>
  );
};

const Public: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l12 = at('L112'), l13 = at('L113');
  const quarters = [word('L112', 'teen', -4), word('L112', 'mahine', 0), word('L112', 'results', -6), word('L112', 'results', 2)];
  return (
    <AbsoluteFill>
      {/* Raju's company changes its name plate */}
      <Hold to={l12}>
        <Photo id="pb-bse" src="bse.jpg" x={1130} y={130} w={660} h={820} rot={2} at={0} enter="right" torn={{left: true, bottom: true}} rough={14} pos="50% 40%" caption="AB EXCHANGE PE" />
        <Card id="pb-plate" x={140} y={250} w={1000} h={300} rot={-2} at={word('L111', 'company', -6)} enter="drop" bg={C.paperLight}>
          <div style={{padding: '40px 50px'}}>
            <Label size={22}>Company ka naam</Label>
            <div style={{fontFamily: F.display, fontSize: 120, lineHeight: 1.1, marginTop: 14, whiteSpace: 'nowrap'}}>RAJU CHAI <span style={{color: frame >= word('L111', 'badal', 0) ? C.inkSoft : C.ink}}>PVT.</span> LTD.</div>
          </div>
        </Card>
        <Cross id="pb-x" x={660} y={370} w={220} h={150} at={word('L111', 'badal', -2)} />
        <Stamp id="pb-public" text="Public Ltd." x={640} y={680} at={word('L111', 'public', -4)} size={110} rot={-6} paper />
        <Hand x={180} y={800} at={word('L111', 'zindagi', -2)} size={70} rot={-2}>zindagi badal gayi…</Hand>
      </Hold>

      {/* every quarter: results; every big news: tell the exchange */}
      <Hold from={l12} to={l13}>
        <Card id="pb-cal" x={130} y={140} w={980} h={560} rot={-1.5} at={l12} enter="left" bg={C.paperLight}>
          <div style={{padding: '30px 40px'}}>
            <Label size={22}>Har teen mahine</Label>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22, marginTop: 30}}>
              {quarters.map((qa, i) => {
                const on = frame >= qa;
                const p = on ? Math.min(1.1, pop(frame, qa, 10, 0.5)) : 0;
                return (
                  <div key={i} style={{height: 340, border: `4px solid ${C.ink}`, background: C.card, position: 'relative'}}>
                    <div style={{height: 50, background: C.ink, color: C.paperLight, fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: 3, textAlign: 'center', lineHeight: '50px'}}>{['I', 'II', 'III', 'IV'][i]}</div>
                    {on ? <Sfx at={qa} name="stamp" volume={0.3} /> : null}
                    <div style={{position: 'absolute', left: 0, right: 0, top: 130, textAlign: 'center', transform: `rotate(-10deg) scale(${p})`}}>
                      <span style={{border: `5px solid ${C.red}`, color: C.red, fontFamily: F.display, fontSize: 44, padding: '4px 10px'}}>RESULTS</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
        <Photo id="pb-bse2" src="bse.jpg" x={1260} y={140} w={540} h={560} rot={2} at={l12 + 2} enter="right" torn={{bottom: true}} rough={12} pos="50% 35%" caption="EXCHANGE" />
        <Card id="pb-news" x={300} y={740} w={760} h={230} rot={1.5} at={word('L112', 'khabar', -6)} enter="up" bg={C.yellow}>
          <div style={{padding: '24px 34px'}}>
            <Label size={20}>Badi khabar?</Label>
            <div style={{fontFamily: F.type, fontSize: 40, marginTop: 14}}><Typed text="Exchange ko batao." at={word('L112', 'exchange', -4)} cps={16} /></div>
          </div>
        </Card>
        <Arrow id="pb-ar" x1={1080} y1={850} x2={1480} y2={720} at={word('L112', 'batani', -4)} bow={-60} width={9} />
      </Hold>

      {/* and you: a small owner, with a vote */}
      <Hold from={l13}>
        <Card id="pb-owner" x={130} y={140} w={760} h={820} rot={-1.5} at={l13} enter="left" bg={C.paperLight}>
          <div style={{padding: '30px 40px'}}>
            <Label size={22}>Aur aap?</Label>
          </div>
        </Card>
        <Person id="pb-you" x={510} y={830} s={2.6} at={word('L113', 'aap', -2)} badge="OWNER" tone={C.card} />
        <Stamp id="pb-malik" text="Malik" x={1330} y={260} at={word('L113', 'malik', -4)} size={150} rot={-5} paper />
        <div style={{position: 'absolute', left: 980, top: 420, width: 760, textAlign: 'center'}}>
          <Hand x={0} y={0} at={word('L113', 'chhote', -2)} size={76} rot={-2} w={760}>chhote se, par <HL at={word('L113', 'malik.', -4)}>malik</HL></Hand>
        </div>
        <Card id="pb-box" x={1120} y={620} w={480} h={340} rot={1.5} at={word('L113', 'voting', -8)} enter="up" bg={C.kraft} texture="kraft">
          <div style={{position: 'absolute', left: 140, right: 140, top: 46, height: 16, background: C.ink}} />
          <div style={{fontFamily: F.display, fontSize: 84, textAlign: 'center', marginTop: 120, color: C.ink}}>VOTE</div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: 3, textAlign: 'center'}}>VOTING KA HAQ</div>
        </Card>
        <Slip id="pb-slip" x={1360} y={600 + 50 * ease(stepped(frame), word('L113', 'haq', -4), word('L113', 'haq', 8))} at={word('L113', 'voting', 0)} text="VOTE ✓" w={150} h={66} size={20} rot={-6} color={C.yellow} />
      </Hold>
    </AbsoluteFill>
  );
};

export const c7: Record<string, React.FC> = {lockin: Lockin, public: Public};
