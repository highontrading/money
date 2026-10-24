import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Hold} from '../../components/kit';
import {Big, Card, Cross, Hand, HL, Label, Marker, Photo, Sfx, Stamp, Tape} from '../../components/paper';
import {clamp, ease, pop, stepped} from '../../lib/motion';
import {useCues} from '../../lib/timeline';
import {C, F} from '../../theme';
import {Arrow, Person, Typed} from '../kit16';
import {Road, STOPS} from './road';

// Road geometry (matches road.tsx): stops centred at x0 + step*i + step/2.
const RX0 = 120, RSTEP = (1800 - 120) / STOPS.length;
const stopX = (i: number) => RX0 + RSTEP * i + RSTEP / 2;
const ROAD_Y = 560;

// small tag pinned under the road
const RoadTag: React.FC<{x: number; at: number; text: string; out?: number; hi?: boolean; row?: number}> = ({x, at, text, out, hi, row = 0}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at || (out !== undefined && f >= out)) return null;
  const p = Math.min(1.08, pop(frame, at, 10, 0.5));
  return (
    <>
      <Sfx at={at} name="pop" volume={0.25} />
      <div style={{position: 'absolute', left: x, top: ROAD_Y + 150 + row * 80, transform: `translateX(-50%) rotate(-2deg) scale(${p})`, transformOrigin: '50% 0', background: hi ? C.yellow : C.paperLight, border: `3px solid ${C.ink}`, fontFamily: F.display, fontSize: 40, padding: '6px 14px 4px', boxShadow: `3px 5px 6px ${C.shadow}`, whiteSpace: 'nowrap'}}>{text}</div>
    </>
  );
};

const Recap: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l24 = at('L124'), l25 = at('L125');
  // stop i lights up when the recap names it
  const lights: [number, number][] = [
    [1, word('L121', 'partner', -4)],
    [2, word('L121', 'drhp', -4)],
    [3, word('L121', 'sebi', -4)],
    [4, word('L122', 'price', -4)],
    [5, word('L122', 'teen', -4)],
    [6, word('L123', 'lottery', -8)],
    [7, word('L123', 'ghanti', -8)],
  ];
  const cur = lights.reduce<[number, number]>((k, l) => (frame >= l[1] ? l : k), [-1, 0]);
  return (
    <AbsoluteFill>
      {/* the road again, travelled fast */}
      <Hold to={l24}>
        <div style={{position: 'absolute', left: 120, top: 120}}>
          <Big words={['Ek', 'baar,', 'poora', 'safar']} at={word('L120', 'ek', -2)} size={150} />
        </div>
      </Hold>
      <Road at={0} stopsAt={STOPS.map((_, i) => 4 + i * 3)} out={l24} y={ROAD_Y} active={cur[0]} activeAt={cur[1]} />
      {lights.map(([i, a]) => (
        <React.Fragment key={i}>
          <Marker id={'rc-t' + i} d={`M${stopX(i) + 40},${ROAD_Y - 168} l14,18 l32,-42`} at={a + 4} dur={4} out={l24} color={C.red} width={8} />
          <Sfx at={a} name="tick" volume={0.4} />
        </React.Fragment>
      ))}
      <Sfx at={word('L123', 'ghanti', -4)} name="bell" volume={0.4} />
      <RoadTag x={RX0 + RSTEP * 2} at={word('L121', 'bankers', -4)} out={l24} text="BANKERS" />
      <RoadTag x={RX0 + RSTEP * 5} at={word('L122', 'anchors', -4)} out={l24} text="ANCHORS" />
      <RoadTag x={stopX(6)} at={word('L123', 'lottery', -8)} out={l24} text="T+1" hi />
      <RoadTag x={RX0 + RSTEP * 7} at={word('L123', 'demat', -8)} out={l24} text="T+2 DEMAT" row={1} />
      <RoadTag x={stopX(7)} at={word('L123', 'ghanti', -8)} out={l24} text="T+3" hi />
      <Hand x={130} y={850} at={word('L121', 'bankers', -2)} out={word('L122', 'price', -4)} size={64} rot={-2}>partner → bankers → DRHP → Sebi</Hand>
      <Hand x={130} y={850} at={word('L122', 'price', -2)} out={word('L123', 'lottery', -10)} size={64} rot={-2}>price band → anchors → boli</Hand>
      <Hand x={130} y={850} at={word('L123', 'lottery', -8)} out={l24} size={64} rot={-2} color={C.red}>T+1 → T+2 → T+3 · ghanti!</Hand>

      {/* same road in 1977, 2026, and for the next IPO */}
      <Hold from={l24} to={l25}>
        <Card id="rc-road" x={110} y={760} w={1700} h={130} rot={-0.5} at={l24} enter="left" bg={C.kraft} texture="kraft" torn={{top: true, bottom: true}} sfx="tear">
          <div style={{position: 'absolute', left: 30, right: 30, top: 58, borderTop: `8px dashed ${C.paperLight}`}} />
        </Card>
        <Photo id="rc-cert" src="certificate1909.jpg" x={140} y={150} w={500} h={560} rot={-3} at={word('L124', '1977', -6)} enter="drop" torn={{bottom: true}} rough={12} caption="1977 · FORM + CHEQUE" />
        <Photo id="rc-phone" src="phone.jpg" x={690} y={190} w={560} h={420} rot={2} at={word('L124', 'yahi', -6)} enter="drop" torn={{right: true, bottom: true}} rough={12} zoom={0.02} caption="2026 · APP + UPI" />
        <Card id="rc-next" x={1310} y={170} w={480} h={540} rot={-2} at={word('L124', 'agle', -6)} enter="right" bg={C.yellow}>
          <div style={{padding: '30px 34px'}}>
            <Label size={22}>Agla IPO</Label>
            <div style={{fontFamily: F.display, fontSize: 300, lineHeight: 1.2, textAlign: 'center'}}>?</div>
          </div>
        </Card>
        <Stamp id="rc-yahi" text="Yahi raasta" x={960} y={820} at={word('L124', 'raasta', -2)} size={84} rot={-4} paper />
        <Stamp id="rc-yahi2" text="Yahi" x={1560} y={600} at={word('L124', 'hoga', -10)} size={90} rot={8} />
      </Hold>

      {/* not a lottery ticket: a share of a company */}
      <Hold from={l25}>
        <Card id="rc-ticket" x={150} y={200} w={740} h={380} rot={-3} at={l25} enter="left" bg={C.yellow} torn={{left: true, right: true}} rough={6}>
          <div style={{position: 'absolute', left: 150, top: 0, bottom: 0, borderLeft: `5px dotted ${C.ink}`}} />
          <div style={{position: 'absolute', left: 30, top: 0, bottom: 0, width: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: 70}}>★</div>
          <div style={{position: 'absolute', left: 190, top: 70}}>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 5}}>IPO</div>
            <div style={{fontFamily: F.display, fontSize: 120, lineHeight: 1}}>LOTTERY</div>
            <div style={{fontFamily: F.display, fontSize: 80, lineHeight: 1}}>TICKET</div>
          </div>
        </Card>
        <Cross id="rc-x" x={190} y={230} w={660} h={320} at={word('L125', 'nahi', -4)} />
        <Arrow id="rc-ar" x1={900} y1={420} x2={1080} y2={420} at={word('L125', 'ek', -6)} bow={-20} width={9} />
        <Photo id="rc-share" src="certificate1909.jpg" x={1110} y={150} w={640} h={620} rot={3} at={word('L125', 'ek', -4)} enter="right" torn={{bottom: true}} rough={12} caption="SHARE = COMPANY KA HISSA" />
        <Stamp id="rc-hiss" text="Hissedaar" x={1430} y={600} at={word('L125', 'hissedaari', -4)} size={96} rot={-7} paper />
        <div style={{position: 'absolute', left: 150, top: 760}}>
          <Big words={['Ek', 'company', 'mein', 'hissedaari']} at={word('L125', 'ek', 0)} size={120} />
        </div>
      </Hold>
    </AbsoluteFill>
  );
};

// Phone photo (1400x1051): screen centred at (656, 543), 262x436, tilted 17.9°.
const PS = 0.46;
const ShareScreen: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 656 * PS - (262 * PS) / 2, top: 543 * PS - (436 * PS) / 2, width: 262 * PS, height: 436 * PS, transform: 'rotate(17.9deg)', background: C.paperLight, borderRadius: 8, fontFamily: F.mono, textAlign: 'center', paddingTop: 12, opacity: frame >= at ? 1 : 0}}>
      <div style={{fontSize: 8, fontWeight: 700, letterSpacing: 1}}>MONEY THEORY</div>
      <div style={{fontFamily: F.display, fontSize: 15, marginTop: 6, lineHeight: 1}}>IPO KA POORA SAFAR</div>
      <div style={{margin: '10px 12px 0', background: C.yellow, border: `2px solid ${C.ink}`, fontSize: 10, fontWeight: 700, padding: '5px 0'}}>SHARE ↗</div>
    </div>
  );
};

const FRAMES = [{x: 1080, y: 140}, {x: 1080, y: 600}];

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, end, word} = useCues();
  const l27 = at('L127'), l28 = at('L128');
  const logo = word('L128', 'money', -4);
  const es = end('L128') + 20; // end screen
  const lp = Math.min(1.05, pop(frame, logo, 10, 0.6));
  const move = ease(stepped(frame), es, es + 16);
  const lx = interpolate(move, [0, 1], [0, -470], clamp);
  const ly = interpolate(move, [0, 1], [0, -150], clamp);
  const ls = interpolate(move, [0, 1], [1, 0.62], clamp);
  return (
    <AbsoluteFill>
      {/* send it to the first-timer at home */}
      <Hold to={l27}>
        <Card id="ou-house" x={150} y={250} w={880} h={680} rot={-1.5} at={0} enter="up" bg={C.paperLight}>
          <div style={{padding: '28px 36px'}}><Label size={22}>Ghar mein</Label></div>
        </Card>
        <div style={{position: 'absolute', left: 120, top: 120, width: 940, height: 150, background: C.red, clipPath: 'polygon(0 100%, 50% 0, 100% 100%)', filter: `drop-shadow(4px 6px 6px ${C.shadow})`, transform: `scaleY(${ease(stepped(frame), 4, 12)})`, transformOrigin: '50% 100%'}} />
        <Hand x={420} y={300} at={word('L126', 'pehli', -2)} size={60} rot={-2}>pehli baar IPO?</Hand>
        <Person id="ou-beta" x={360} y={850} s={1.7} at={word('L126', 'beta', -4)} label="Beta" tone={C.card} />
        <Person id="ou-papa" x={600} y={850} s={2.0} at={word('L126', 'papa', -2)} label="Papa" tone={C.yellow} />
        <Person id="ou-dadi" x={840} y={850} s={1.8} at={word('L126', 'dadi', -4)} label="Dadi" tone={C.card} />
        <Photo id="ou-phone" src="phone.jpg" x={1140} y={180} w={1400 * PS} h={1051 * PS} rot={2} at={word('L126', 'ipo', -6)} enter="right" torn={{left: true, bottom: true}} rough={12} zoom={0.02} overlay={<ShareScreen at={word('L126', 'bhejo', -10)} />} />
        <Card id="ou-share" x={1240} y={700} w={460} h={200} rot={-4} at={word('L126', 'bhejo', -6)} enter="drop" bg={C.yellow}>
          <div style={{fontFamily: F.display, fontSize: 110, textAlign: 'center', lineHeight: '200px'}}>BHEJO ↗</div>
        </Card>
        <Arrow id="ou-ar" x1={980} y1={620} x2={1220} y2={760} at={word('L126', 'bhejo', -4)} bow={-50} width={9} />
      </Hold>

      {/* the disclaimer, said out loud */}
      <Hold from={l27} to={l28}>
        <Card id="ou-disc" x={330} y={200} w={1260} h={420} rot={-1} at={l27} enter="up" bg={C.paperLight}>
          <div style={{padding: '40px 56px'}}>
            <Label size={24}>Educational only</Label>
            <div style={{fontFamily: F.type, fontSize: 64, lineHeight: 1.3, marginTop: 30}}><Typed text="Yeh video sirf samjhane ke liye hai." at={l27 + 4} cps={20} /></div>
          </div>
        </Card>
        <Stamp id="ou-nia" text="Investment advice nahi" x={960} y={760} at={word('L127', 'investment', -2)} size={88} rot={-4} />
      </Hold>

      {/* Paisa samjho. → MONEY THEORY lockup, then it slides left for the end screen */}
      <Hold from={l28}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 230, textAlign: 'center', transform: `translate(${lx}px, ${ly}px) scale(${ls})`, transformOrigin: '50% 0'}}>
          <div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 120, opacity: frame >= logo ? 0 : 1, position: 'absolute', left: 0, right: 0, top: 160}}>Paisa samjho.</div>
          {frame >= logo ? (
            <div style={{transform: `scale(${0.8 + 0.2 * lp})`}}>
              <div style={{fontFamily: F.display, fontSize: 250, lineHeight: 0.9, color: C.ink}}>MONEY</div>
              <div style={{fontFamily: F.display, fontSize: 250, lineHeight: 0.9, color: C.ink}}><HL at={logo + 6}>THEORY</HL></div>
              <div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 90, marginTop: 26, opacity: ease(stepped(frame), logo + 16, logo + 26)}}>Paisa samjho.</div>
            </div>
          ) : null}
        </div>
        <Sfx at={logo} name="stamp" volume={0.45} />
        <Sfx at={logo} name="boom" volume={0.35} />
      </Hold>

      {/* END SCREEN: clean frames for YouTube's elements, nothing animated over them */}
      <Hold from={es}>
        {FRAMES.map((fr, i) => (
          <React.Fragment key={i}>
            <Card id={'es-f' + i} x={fr.x - 20} y={fr.y - 20} w={680} h={400} rot={0} at={es + 6 + i * 5} enter="right" bg={C.paperLight}>
              <div style={{position: 'absolute', left: 20, top: 20, width: 640, height: 360, background: '#2a2723'}} />
            </Card>
            <Tape id={'es-ta' + i} x={fr.x - 50} y={fr.y - 34} w={140} rot={-14} at={es + 14 + i * 5} />
            <Tape id={'es-tb' + i} x={fr.x + 560} y={fr.y + 330} w={140} rot={-14} at={es + 14 + i * 5} />
          </React.Fragment>
        ))}
        <div style={{position: 'absolute', left: FRAMES[0].x, top: FRAMES[0].y - 66, opacity: frame >= es + 16 ? 1 : 0}}><Label size={20}>Agla video →</Label></div>
        <div style={{position: 'absolute', left: FRAMES[1].x + 40, top: FRAMES[1].y - 76, opacity: frame >= es + 20 ? 1 : 0}}><Label size={20}>Yeh bhi dekho</Label></div>
        <div style={{position: 'absolute', left: 520 - 115, top: 650, width: 230, height: 230, borderRadius: 115, border: `5px dashed ${C.ink}`, opacity: frame >= es + 18 ? 0.7 : 0}} />
        <div style={{position: 'absolute', left: 0, width: 1040, top: 900, textAlign: 'center', opacity: frame >= es + 18 ? 1 : 0}}><Label size={22}>Subscribe</Label></div>
        <div style={{position: 'absolute', left: 110, top: 968, fontFamily: F.mono, fontWeight: 500, fontSize: 16, letterSpacing: 1, color: C.inkSoft, opacity: frame >= es + 20 ? 1 : 0}}>
          Photos &amp; film: Wikimedia Commons, Prelinger Archives (see description)
        </div>
      </Hold>
    </AbsoluteFill>
  );
};

export const c9: Record<string, React.FC> = {recap: Recap, outro: Outro};
