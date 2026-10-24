import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {Hold} from '../../components/kit';
import {Big, Card, Cross, Hand, HL, Label, Sfx, Stamp, Tape} from '../../components/paper';
import {ease, pop, stepped} from '../../lib/motion';
import {useCues} from '../../lib/timeline';
import {C, F} from '../../theme';
import {Arrow, Footage, Person, Slip} from '../kit16';

// Chapter 6 · Listing ki ghanti: special pre-open, price discovery, the bell, listing-day report cards.

const STEPS: [string, string][] = [['T', 'ISSUE BAND'], ['T+1', 'ALLOTMENT'], ['T+2', 'DEMAT / REFUND'], ['T+3', 'LISTING']];
const Ribbon: React.FC<{id: string; x: number; y: number; w: number; h: number; at: number; out?: number; active: number; activeAt: number}> = ({id, x, y, w, h, at, out, active, activeAt}) => {
  const frame = useCurrentFrame();
  const bw = (w - 60 - 3 * 24) / 4;
  return (
    <Card id={id} x={x} y={y} w={w} h={h} rot={-0.8} at={at} out={out} enter="left" bg={C.kraft} texture="kraft" torn={{left: true, right: true}} rough={12}>
      <div style={{display: 'flex', gap: 24, padding: '0 30px', height: '100%', alignItems: 'center'}}>
        {STEPS.map(([t, s], i) => (
          <div key={t} style={{width: bw, height: h - 44, transform: `rotate(${i % 2 ? 1.2 : -1.2}deg)`, background: i === active && frame >= activeAt ? C.yellow : C.paperLight, border: `4px solid ${C.ink}`, boxShadow: `3px 5px 6px ${C.shadow}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', opacity: i < active ? 0.7 : 1}}>
            <div style={{fontFamily: F.display, fontSize: h * 0.36, lineHeight: 1}}>{t}</div>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: Math.max(16, h * 0.11), letterSpacing: 2, marginTop: 4}}>{s}</div>
            {i < active ? <div style={{position: 'absolute', right: 10, top: 6, fontFamily: F.display, fontSize: h * 0.2, color: C.inkSoft}}>✓</div> : null}
          </div>
        ))}
      </div>
    </Card>
  );
};

const PaperClock: React.FC<{id: string; x: number; y: number; size: number; at: number; out?: number; minutes: number}> = ({id, x, y, size, at, out, minutes}) => {
  const ma = (minutes % 60) * 6;
  const ha = ((minutes / 60) % 12) * 30;
  return (
    <Card id={id} x={x} y={y} w={size} h={size} at={at} out={out} enter="drop" bg="transparent" texture={null} depth={1.2}>
      <svg width={size} height={size} viewBox="0 0 200 200">
        <circle cx={100} cy={100} r={96} fill={C.paperLight} stroke={C.ink} strokeWidth={6} />
        {Array.from({length: 60}).map((_, i) => {
          const a = (i * 6 * Math.PI) / 180;
          const long = i % 5 === 0;
          return <line key={i} x1={100 + Math.sin(a) * (long ? 72 : 78)} y1={100 - Math.cos(a) * (long ? 72 : 78)} x2={100 + Math.sin(a) * 84} y2={100 - Math.cos(a) * 84} stroke={C.ink} strokeWidth={long ? 4 : 1.5} />;
        })}
        {[['12', 0], ['3', 90], ['6', 180], ['9', 270]].map(([t, d]) => {
          const a = ((d as number) * Math.PI) / 180;
          return <text key={t as string} x={100 + Math.sin(a) * 56} y={100 - Math.cos(a) * 56 + 9} textAnchor="middle" fontFamily="Anton" fontSize={26} fill={C.ink}>{t}</text>;
        })}
        <line x1={100} y1={100} x2={100 + Math.sin((ha * Math.PI) / 180) * 44} y2={100 - Math.cos((ha * Math.PI) / 180) * 44} stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
        <line x1={100} y1={100} x2={100 + Math.sin((ma * Math.PI) / 180) * 70} y2={100 - Math.cos((ma * Math.PI) / 180) * 70} stroke={C.red} strokeWidth={6} strokeLinecap="round" />
        <circle cx={100} cy={100} r={7} fill={C.red} stroke={C.ink} strokeWidth={2} />
      </svg>
    </Card>
  );
};

const Preopen: React.FC = () => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  const {at, word} = useCues();
  const l97 = at('L097'), l98 = at('L098'), l99 = at('L099');
  const t945 = word('L097', '9:45', -4);
  const t10 = word('L099', '10', -6);
  const mins = 540 + ease(f, t945, t945 + 14) * 45 + ease(f, l98 + 10, l98 + 30) * 10 + ease(f, t10, t10 + 10) * 5;
  const ordersAt = word('L097', 'orders', -10);
  const meet = word('L098', 'sabse', -6);
  const mp = ease(f, meet, meet + 18);
  const slots: [string, string, number][] = [['9:00 – 9:45', 'SIRF ORDERS', word('L097', '9', -4)], ['PHIR', 'MATCHING', l98 + 4], ['10:00', 'NORMAL TRADING', t10]];
  return (
    <AbsoluteFill>
      {/* T+3: the share doesn't jump straight into the market */}
      <Ribbon id="p-rib" x={160} y={130} w={1600} h={170} at={0} out={l97} active={3} activeAt={word('L096', 'T+3', -2)} />
      <Card id="p-share" x={170} y={430} w={460} h={430} rot={-3} at={6} out={l97} enter="left" bg={C.yellow}>
        <div style={{padding: 34}}>
          <Label size={22}>Naya share</Label>
          <div style={{fontFamily: F.display, fontSize: 110, lineHeight: 1, marginTop: 30}}>LISTING KA DIN</div>
        </div>
      </Card>
      <Footage id="p-floor" src="floor_wide" x={1000} y={380} w={800} h={540} rot={2} at={20} out={l97} enter="right" torn={{top: true, left: true}} rough={14} caption="BAZAAR" />
      <Arrow id="p-ar" x1={660} y1={640} x2={980} y2={640} at={word('L096', 'seedha', -6)} out={l97} bow={-60} width={10} />
      <Cross id="p-x" x={740} y={560} w={160} h={150} at={word('L096', 'nahi', -2)} out={l97} />
      <Hand x={680} y={780} at={word('L096', 'kudta', -6)} out={l97} size={64} rot={-4} color={C.red}>seedha nahi!</Hand>

      {/* the special pre-open: clock + slots on the left */}
      <PaperClock id="p-clock" x={150} y={120} size={540} at={l97 - 2} minutes={mins} />
      <Card id="p-slots" x={130} y={690} w={640} h={300} rot={-1} at={l97 + 4} enter="up" bg={C.paperLight}>
        <div style={{padding: '20px 26px'}}>
          {slots.map(([t, s, a], i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: i ? 12 : 0, opacity: frame >= a ? 1 : 0.18}}>
              <div style={{width: 300, fontFamily: F.display, fontSize: 50, lineHeight: 1.25, textAlign: 'center', background: frame >= a && (i === 2 ? frame >= t10 : true) ? (i === 2 ? C.yellow : C.card) : C.paperLight, border: `3px solid ${C.ink}`}}>{t}</div>
              <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 2}}>{s}</div>
            </div>
          ))}
        </div>
      </Card>
      <Sfx at={t945} name="tick" volume={0.4} />
      <Sfx at={t10} name="tick" volume={0.4} />

      {/* right: orders pile on both sides, then meet at one price */}
      <Hold from={l97} to={l98 + 4}>
        <div style={{position: 'absolute', left: 860, top: 150}}>
          <Big words={['Special', 'pre-open', 'session']} at={word('L097', 'special', -4)} size={104} />
          <div style={{marginTop: 14}}><Label size={24}>Sirf orders · koi trade nahi</Label></div>
        </div>
      </Hold>
      <Card id="p-buyh" x={860} y={430} w={300} h={90} rot={-2} at={ordersAt - 6} enter="drop" bg={C.ink}>
        <div style={{fontFamily: F.display, fontSize: 60, color: C.paperLight, textAlign: 'center', lineHeight: '90px'}}>BUY</div>
      </Card>
      <Card id="p-sellh" x={1500} y={430} w={300} h={90} rot={2} at={ordersAt - 2} enter="drop" bg={C.ink}>
        <div style={{fontFamily: F.display, fontSize: 60, color: C.paperLight, textAlign: 'center', lineHeight: '90px'}}>SELL</div>
      </Card>
      {Array.from({length: 16}).map((_, i) => {
        const side = i % 2;
        const row = Math.floor(i / 2);
        const x0 = side ? 1650 : 1010, y0 = 580 + row * 52;
        const x1 = side ? 1400 : 1260, y1 = 700 + (row % 4) * 30;
        return <Slip key={i} id={'p-o' + i} x={x0 + (x1 - x0) * mp} y={y0 + (y1 - y0) * mp} at={ordersAt + i * 3} text={side ? 'SELL' : 'BUY'} w={170} h={58} size={20} color={side ? C.paperLight : C.card} />;
      })}
      {Array.from({length: 4}).map((_, i) => <Sfx key={i} at={ordersAt + i * 10} name="drop" volume={0.16} />)}
      <Card id="p-price" x={1180} y={240} w={500} h={190} rot={-1.5} at={word('L098', 'daam', -6)} enter="drop" bg={f >= word('L099', 'listing', -4) ? C.yellow : C.paperLight} z={60}>
        <div style={{padding: '20px 30px', textAlign: 'center'}}>
          <Label size={20}>Ek daam</Label>
          <div style={{fontFamily: F.display, fontSize: 84, lineHeight: 1.15, marginTop: 6}}>{f >= word('L099', 'listing', -4) ? 'LISTING PRICE' : '₹ ?'}</div>
        </div>
      </Card>
      <Arrow id="p-am" x1={1330} y1={650} x2={1330} y2={450} at={meet + 10} bow={10} width={9} />
      <Hand x={860} y={950} at={meet} size={50} rot={-1}>jahan sabse zyada shares ka sauda ho sake</Hand>
      <Sfx at={word('L099', 'listing', -4)} name="stamp" volume={0.4} />
      <Tape id="p-tp" x={1360} y={222} w={160} rot={-5} at={word('L099', 'listing', -4)} />
      <Stamp id="p-10" text="10 baje · trading" x={1500} y={880} at={t10 + 4} size={60} rot={5} paper />
    </AbsoluteFill>
  );
};

// Torn-paper confetti falling over the whole frame.
const Confetti: React.FC<{at: number; out: number}> = ({at, out}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at || f >= out) return null;
  const cols = [C.yellow, C.paperLight, C.red, C.kraft, C.card];
  return (
    <>
      {Array.from({length: 46}).map((_, i) => {
        const start = at + random('cs' + i) * 40;
        if (f < start) return null;
        const t = f - start;
        const x = 120 + random('cx' + i) * 1680 + Math.sin(t * 0.12 + i) * 30;
        const y = -60 + t * (6 + random('cv' + i) * 5);
        if (y > 1140) return null;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 26 + random('cw' + i) * 22, height: 14 + random('ch' + i) * 14, background: cols[i % cols.length], border: `2px solid ${C.ink}`, transform: `rotate(${t * (6 + (i % 5)) + i * 30}deg)`, zIndex: 85}} />;
      })}
    </>
  );
};

const Report: React.FC<{id: string; x: number; at: number; out: number; name: string; rows: [string, string, number][]; verdict: string; vAt: number; good: boolean; rot: number; note?: string}> = ({id, x, at, out, name, rows, verdict, vAt, good, rot, note}) => {
  const frame = useCurrentFrame();
  return (
    <>
      <Card id={id} x={x} y={170} w={530} h={720} rot={rot} at={at} out={out} enter="up" bg={good ? C.paperLight : C.card}>
        <div style={{padding: '32px 36px'}}>
          <Label size={20}>Listing day · report card</Label>
          <div style={{fontFamily: F.display, fontSize: 64, lineHeight: 1.02, marginTop: 20, height: 140}}>{name}</div>
          {rows.map(([k, v, a]) => (
            <div key={k} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 14, opacity: frame >= a ? 1 : 0.12, borderBottom: `2px dashed ${C.grey}`, paddingBottom: 8}}>
              <span style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 2, color: C.inkSoft}}>{k}</span>
              <span style={{fontFamily: F.display, fontSize: 92, lineHeight: 1}}>{v}</span>
            </div>
          ))}
          {note ? <div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 52, marginTop: 30, transform: 'rotate(-2deg)', opacity: frame >= vAt ? 1 : 0}}>{note}</div> : null}
          <div style={{position: 'absolute', left: 36, right: 36, bottom: 36, height: 120, background: good ? C.yellow : C.red, color: good ? C.ink : C.paperLight, border: `4px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: verdict.length > 12 ? 46 : 60, whiteSpace: 'nowrap', transform: `scale(${frame >= vAt ? Math.min(1.05, Math.max(0, pop(frame, vAt, 10, 0.5))) : 0}) rotate(-2deg)`}}>{verdict}</div>
        </div>
      </Card>
      <Sfx at={vAt} name="stamp" volume={0.4} />
    </>
  );
};

const Bell: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l101 = at('L101'), l102 = at('L102'), l103 = at('L103'), l104 = at('L104'), l105 = at('L105');
  const ring = word('L100', 'ghanti', -6);
  return (
    <AbsoluteFill>
      {/* the bell */}
      <Footage id="b-bell" src="bell_ring" clip={6} x={680} y={110} w={560} h={600} rot={-1.5} at={0} out={l101} enter="drop" torn={{top: true, bottom: true}} rough={14} caption="LISTING CEREMONY" projector={false} />
      <Sfx at={ring} name="bell" volume={0.55} />
      <Sfx at={ring + 40} name="bell" volume={0.35} />
      <Sfx at={ring + 10} name="crowd" volume={0.35} />
      <Sfx at={word('L100', 'jashn', -10)} name="crowd" volume={0.3} />
      <Person id="b-pro" x={300} y={900} s={1.5} at={word('L100', 'promoters', -6)} out={l101} tone={C.yellow} label="PROMOTERS" enter="left" />
      <Person id="b-bank" x={520} y={940} s={1.2} at={word('L100', 'bankers', -6)} out={l101} tone={C.card} label="BANKERS" enter="left" />
      <Card id="b-cam" x={1340} y={330} w={420} h={300} rot={4} at={word('L100', 'cameras', -6)} out={l101} enter="right" bg={C.card}>
        <div style={{padding: 26}}>
          <Label size={20}>Cameras</Label>
          <div style={{position: 'relative', margin: '26px auto 0', width: 230, height: 140, background: C.ink, borderRadius: 14}}>
            <div style={{position: 'absolute', left: 70, top: 26, width: 90, height: 90, borderRadius: 45, background: C.paperLight, border: `10px solid ${C.inkSoft}`}} />
            <div style={{position: 'absolute', left: 18, top: -18, width: 54, height: 24, background: C.ink}} />
          </div>
        </div>
      </Card>
      <Hold from={word('L100', 'cameras', 0)} to={word('L100', 'cameras', 4)}>
        <div style={{position: 'absolute', inset: 0, background: 'rgba(255,252,240,0.6)', zIndex: 95}} />
      </Hold>
      <Sfx at={word('L100', 'cameras', 0)} name="pop" volume={0.3} />
      <Confetti at={ring + 4} out={l101 + 30} />
      <Stamp id="b-jashn" text="Bada jashn" x={960} y={850} at={word('L100', 'jashn', -4)} out={l101} size={110} rot={-5} paper />

      {/* the gap between IPO price and listing price */}
      <Hold from={l101} to={l102}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center'}}><Label size={26}>Aapka pehla hisaab</Label></div>
      </Hold>
      <Card id="b-ipo" x={170} y={250} w={620} h={360} rot={-2} at={word('L101', 'ipo', -6)} out={l102} enter="left" bg={C.paperLight}>
        <div style={{padding: 40, textAlign: 'center'}}><Label size={22}>Aapne diya</Label><div style={{fontFamily: F.display, fontSize: 130, lineHeight: 1.1, marginTop: 30}}>IPO PRICE</div></div>
      </Card>
      <Card id="b-lst" x={1130} y={250} w={620} h={360} rot={2} at={word('L101', 'listing', -6)} out={l102} enter="right" bg={C.yellow}>
        <div style={{padding: 40, textAlign: 'center'}}><Label size={22}>Bazaar ne diya</Label><div style={{fontFamily: F.display, fontSize: 120, lineHeight: 1.1, marginTop: 30}}>LISTING PRICE</div></div>
      </Card>
      <Arrow id="b-gap" x1={820} y1={430} x2={1100} y2={430} at={word('L101', 'farak', -6)} out={l102} bow={-50} width={10} />
      <Hold from={word('L101', 'farak', -2)} to={l102}>
        <div style={{position: 'absolute', left: 860, top: 300, fontFamily: F.display, fontSize: 70, transform: 'rotate(-3deg)'}}>FARAK</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 690, textAlign: 'center', fontFamily: F.display, fontSize: 120, lineHeight: 1}}>
          = PEHLA <span style={{opacity: frame >= word('L101', 'munafa', -4) ? 1 : 0.15}}><HL at={word('L101', 'munafa', -2)}>MUNAFA</HL></span> <span style={{opacity: frame >= word('L101', 'nuksaan', -4) ? 1 : 0.15}}>YA <HL at={word('L101', 'nuksaan', -2)} color={C.red}>NUKSAAN</HL></span>
        </div>
      </Hold>

      {/* three real listing days */}
      <Report id="b-bajaj" x={150} rot={-2} at={l102} out={l105} name="BAJAJ HOUSING FINANCE" good
        rows={[['IPO', '₹70', word('L102', 'ipo', -4)], ['LISTING', '₹150', word('L102', 'listing', -4)]]} verdict="✓ DOGUNA SE ZYADA" vAt={word('L102', 'doguna', -4)} />
      <Report id="b-hyun" x={700} rot={1.5} at={l103} out={l105} name="HYUNDAI MOTOR INDIA" good={false}
        rows={[['IPO', '₹1,960', word('L103', 'ipo', -4)], ['LISTING', '₹1,934', word('L103', 'listing', -4)]]} verdict="NEECHE ↓" vAt={word('L103', 'neeche', -4)} />
      <Report id="b-lic" x={1250} rot={-1} at={l104} out={l105} name="LIC" good={false}
        rows={[['LISTING', '~8%', word('L104', '8%', -6)]]} verdict="NEECHE ↓" vAt={word('L104', 'neeche', -4)} note="IPO price se neeche" />
      <Tape id="b-t1" x={340} y={150} w={150} rot={-6} at={l102 + 6} out={l105} />
      <Tape id="b-t2" x={900} y={150} w={150} rot={5} at={l103 + 6} out={l105} />
      <Tape id="b-t3" x={1450} y={150} w={150} rot={-4} at={l104 + 6} out={l105} />

      {/* quiet ending */}
      <Card id="b-quiet" x={260} y={250} w={1400} h={380} rot={-1.2} at={l105 + 6} enter="drop" bg={C.paperLight} sfx={null}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontFamily: F.display, fontSize: 124, lineHeight: 1, gap: 32, whiteSpace: 'nowrap'}}>
          <span>BADA NAAM</span><span style={{color: C.red}}>≠</span><span style={{opacity: frame >= word('L105', 'guarantee', -4) ? 1 : 0.12}}>GUARANTEE</span>
        </div>
      </Card>
      <Hand x={560} y={720} at={word('L105', 'listing', -4)} size={84} rot={-2}>listing = sirf ek din ka mood</Hand>
    </AbsoluteFill>
  );
};

export const c6: Record<string, React.FC> = {preopen: Preopen, bell: Bell};
