import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Hold} from '../../components/kit';
import {Big, Card, Count, Cross, Hand, HL, Label, Marker, Photo, Sfx, Stamp, Tape} from '../../components/paper';
import {boil, clamp, ease, pop, stepped} from '../../lib/motion';
import {useCues} from '../../lib/timeline';
import {C, F} from '../../theme';
import {Arrow, Footage, Person, Slip, Term, Typed} from '../kit16';

// Chapter 3 · Daam kaun tay karta hai: roadshow, RHP, price band, lot, anchors, the cake.

const inrN = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

// ---------------------------------------------------------------- local pieces

// Paper plane that hops between points on cue (stepped, with a little arc).
const Plane: React.FC<{pts: {x: number; y: number; at: number}[]}> = ({pts}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < pts[0].at) return null;
  let i = 0;
  while (i + 1 < pts.length && f >= pts[i + 1].at) i++;
  const a = pts[i], b = pts[Math.min(i + 1, pts.length - 1)];
  // travel to the next point during the 12 frames before it lands
  const p = i + 1 < pts.length ? ease(f, b.at - 12, b.at) : 0;
  const x = a.x + (b.x - a.x) * p, y = a.y + (b.y - a.y) * p - Math.sin(p * Math.PI) * 60;
  const ang = Math.atan2(b.y - a.y, b.x - a.x) * (180 / Math.PI);
  return (
    <div style={{position: 'absolute', left: x - 45, top: y - 30, width: 90, height: 60, transform: `rotate(${p > 0 && p < 1 ? ang : -12}deg)`, zIndex: 66, filter: `drop-shadow(4px 8px 6px ${C.shadow})`}}>
      <svg width={90} height={60} viewBox="0 0 90 60">
        <path d="M2,30 L88,4 L40,36 Z" fill={C.paperLight} stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
        <path d="M40,36 L88,4 L52,56 Z" fill={C.card} stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

// Ship's anchor, cut from dark card.
const AnchorIcon: React.FC<{size: number; color?: string}> = ({size, color = C.ink}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx={50} cy={13} r={8} fill="none" stroke={color} strokeWidth={6} />
    <line x1={50} y1={21} x2={50} y2={86} stroke={color} strokeWidth={9} strokeLinecap="round" />
    <line x1={32} y1={34} x2={68} y2={34} stroke={color} strokeWidth={8} strokeLinecap="round" />
    <path d="M12,58 C16,82 34,92 50,92 C66,92 84,82 88,58" fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" />
    <path d="M4,62 L12,50 L22,62 Z M78,62 L88,50 L96,62 Z" fill={color} />
  </svg>
);

// Padlock that swings shut (or open) on cue.
export const Padlock: React.FC<{x: number; y: number; at: number; size?: number; label?: string; openAt?: number}> = ({x, y, at, size = 170, label, openAt}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at) return null;
  const s = Math.min(1.08, pop(frame, at, 10, 0.5));
  const open = openAt !== undefined && f >= openAt;
  const shackle = open ? -38 * ease(f, openAt!, openAt! + 6) : -38 * (1 - ease(f, at + 2, at + 8));
  return (
    <>
      <Sfx at={at + 6} name="padlock" volume={0.5} />
      {openAt !== undefined ? <Sfx at={openAt} name="padlock" volume={0.5} /> : null}
      <div style={{position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size * 1.25, transform: `scale(${s}) rotate(-6deg)`, zIndex: 68, filter: `drop-shadow(4px 8px 7px ${C.shadow})`}}>
        <svg width={size} height={size * 1.25} viewBox="0 0 100 125" style={{overflow: 'visible'}}>
          <path d={`M28,${58 + shackle} L28,${36 + shackle} C28,10 72,10 72,${36 + shackle} L72,${58 + shackle * (open ? 0 : 1)}`} fill="none" stroke={C.ink} strokeWidth={11} strokeLinecap="round" />
          <rect x={12} y={54} width={76} height={62} rx={8} fill={C.yellow} stroke={C.ink} strokeWidth={5} />
          <circle cx={50} cy={80} r={7} fill={C.ink} />
          <rect x={47} y={82} width={6} height={18} fill={C.ink} />
        </svg>
        {label ? <div style={{position: 'absolute', left: -60, right: -60, top: size * 1.3, textAlign: 'center', fontFamily: F.display, fontSize: size * 0.32, lineHeight: 1}}>{label}</div> : null}
      </div>
    </>
  );
};

type Slice = {from: number; to: number; color: string; at?: number; push?: number};

// Paper cake (pie) seen from above; slices slide out when they are named.
const Pie: React.FC<{id: string; cx: number; cy: number; r: number; at: number; slices: Slice[]; out?: number}> = ({id, cx, cy, r, at, slices, out}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at || (out !== undefined && f >= out + 8)) return null;
  const s = Math.min(1.06, pop(frame, at, 11, 0.5));
  const o = out !== undefined && f >= out ? 1 - ease(f, out, out + 8) : 1;
  const b = boil(id, frame, 0.8);
  const pad = 80;
  const pt = (deg: number, rr = r) => [pad + r + rr * Math.cos((deg * Math.PI) / 180), pad + r + rr * Math.sin((deg * Math.PI) / 180)];
  return (
    <div style={{position: 'absolute', left: cx - r - pad, top: cy - r - pad, width: 2 * (r + pad), height: 2 * (r + pad), transform: `translate(${b.x}px, ${b.y}px) scale(${s})`, opacity: o, zIndex: 30}}>
      {slices.map((sl, i) => {
        const p = sl.at !== undefined ? ease(f, sl.at, sl.at + 8) : 0;
        const mid = ((sl.from + sl.to) / 2) * (Math.PI / 180);
        const d = (sl.push ?? 34) * p;
        const [x1, y1] = pt(sl.from), [x2, y2] = pt(sl.to);
        const large = sl.to - sl.from > 180 ? 1 : 0;
        return (
          <svg key={i} width={2 * (r + pad)} height={2 * (r + pad)} style={{position: 'absolute', left: 0, top: 0, transform: `translate(${Math.cos(mid) * d}px, ${Math.sin(mid) * d}px)`, filter: `drop-shadow(${3 + 5 * p}px ${6 + 8 * p}px ${7 + 6 * p}px ${C.shadow})`, overflow: 'visible'}}>
            <path d={`M${pad + r},${pad + r} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`} fill={sl.color} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
            <path d={`M${pt(sl.from, r * 0.86).join(',')} A${r * 0.86},${r * 0.86} 0 ${large} 1 ${pt(sl.to, r * 0.86).join(',')}`} fill="none" stroke={C.ink} strokeWidth={2} strokeDasharray="6 9" opacity={0.35} />
          </svg>
        );
      })}
    </div>
  );
};

// A label card that slides in beside the cake: big % + who + rule.
const SliceTag: React.FC<{id: string; y: number; at: number; out?: number; pct: string; who: React.ReactNode; rule: string; bg: string}> = ({id, y, at, out, pct, who, rule, bg}) => (
  <Card id={id} x={1110} y={y} w={700} h={200} rot={id.length % 2 ? -1.2 : 1} at={at} out={out} enter="right" bg={bg}>
    <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 34px', gap: 26}}>
      <div style={{fontFamily: F.display, fontSize: 118, width: 230, lineHeight: 1}}>{pct}</div>
      <div>
        <div style={{fontFamily: F.display, fontSize: 46, lineHeight: 1.05, whiteSpace: 'nowrap'}}>{who}</div>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, marginTop: 8, textTransform: 'uppercase'}}>{rule}</div>
      </div>
    </div>
  </Card>
);

// ---------------------------------------------------------------- scenes

const Band: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l50 = at('L050'), l51 = at('L051'), l52 = at('L052'), l53 = at('L053'), l54 = at('L054');
  // world map card, cities in frame coordinates
  const MX = 110, MY = 140;
  const city = {mumbai: [870, 610], dubai: [700, 520], london: [560, 300], ny: [260, 360], sing: [1010, 690]} as const;
  const cities: [keyof typeof city, string][] = [['mumbai', 'MUMBAI'], ['dubai', 'DUBAI'], ['london', 'LONDON'], ['ny', 'NEW YORK'], ['sing', 'SINGAPORE']];
  const hop = (k: keyof typeof city, a: number) => ({x: MX + city[k][0], y: MY + city[k][1] - 40, at: a});
  // ruler geometry
  const RX = 160, RW = 1600, RY = 470, lo = 330, hi = 1590;
  const bandP = ease(stepped(frame), word('L052', '₹1,119', 4), word('L052', '₹1,119', 14));
  const bids = Array.from({length: 11}).map((_, i) => ({x: lo + 60 + ((i * 113) % (hi - lo - 120)), y: 375 + (i % 3) * 22, at: word('L053', 'boli', -6) + i * 3}));
  return (
    <AbsoluteFill>
      {/* the question */}
      <Hold from={0} to={l50 + 4}>
        <div style={{position: 'absolute', left: 130, top: 170, width: 900}}>
          <Big words={['Share', 'kitne', 'ka?']} at={6} gap={6} size={220} />
        </div>
      </Hold>
      <Card id="b-tag" x={1180} y={330} w={560} h={360} rot={8} at={14} out={l50} enter="drop" bg={C.yellow} torn={{right: true}}>
        <div style={{position: 'absolute', left: 40, top: 150, width: 40, height: 40, borderRadius: 20, background: C.paper, border: `4px solid ${C.ink}`}} />
        <div style={{fontFamily: F.display, fontSize: 200, textAlign: 'center', lineHeight: '360px', marginLeft: 60}}>₹ ?</div>
      </Card>
      <Marker id="b-string" d="M1300,150 Q1270,300 1250,480" at={18} out={l50} dur={6} color={C.ink} width={5} />
      <Footage id="b-floor" src="floor_crowd" x={170} y={640} w={860} h={330} rot={-1.5} at={24} out={l50} enter="up" torn={{top: true}} rough={12} caption="ARCHIVE FILM" />

      {/* roadshow */}
      <Card id="b-map" x={MX} y={MY} w={1150} h={760} rot={-1} at={l50 - 2} out={l51} enter="left" bg={C.paperLight}>
        <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(70,110,150,0.16) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(70,110,150,0.16) 1.5px, transparent 1.5px)', backgroundSize: '48px 48px'}} />
        <svg width={1150} height={760} style={{position: 'absolute', inset: 0}}>
          {[
            'M150,250 C200,180 330,170 380,230 C420,290 360,380 300,420 C260,450 190,430 170,380 C140,330 120,290 150,250 Z',
            'M470,230 C520,170 640,180 660,250 C670,300 610,330 560,330 C520,330 470,300 470,230 Z',
            'M560,360 C620,350 680,390 690,470 C700,560 640,640 590,640 C540,640 520,560 530,480 C535,420 530,370 560,360 Z',
            'M700,300 C800,240 980,250 1050,330 C1100,400 1040,470 960,480 C900,490 880,560 860,620 C840,560 790,520 740,500 C690,470 660,380 700,300 Z',
            'M940,600 C980,580 1060,600 1070,650 C1060,700 990,710 950,680 Z',
          ].map((d, i) => <path key={i} d={d} fill={C.card} stroke={C.inkSoft} strokeWidth={3} strokeDasharray={i % 2 ? '0' : '10 6'} opacity={0.9} />)}
        </svg>
        {cities.map(([k, n]) => (
          <div key={k} style={{position: 'absolute', left: city[k][0] - 9, top: city[k][1] - 9}}>
            <div style={{width: 18, height: 18, borderRadius: 9, background: k === 'mumbai' ? C.red : C.ink}} />
            <div style={{position: 'absolute', left: 24, top: -4, fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: 2, whiteSpace: 'nowrap'}}>{n}</div>
          </div>
        ))}
        <div style={{position: 'absolute', left: 36, top: 30}}><Label size={22}>Roadshow · bankers ka tour</Label></div>
      </Card>
      <Hold from={l50} to={l51}>
        <Marker id="b-route" d={`M${MX + 870},${MY + 570} Q${MX + 980},${MY + 560} ${MX + 1010},${MY + 650} M${MX + 1010},${MY + 650} Q${MX + 700},${MY + 380} ${MX + 560},${MY + 260} M${MX + 560},${MY + 260} Q${MX + 400},${MY + 220} ${MX + 260},${MY + 320}`} at={word('L050', 'bade', 4)} dur={110} color={C.red} width={5} />
        <Plane pts={[hop('mumbai', word('L050', 'bankers', 0)), hop('sing', word('L050', 'investors', 4)), hop('london', word('L050', 'demand', 0)), hop('ny', word('L050', 'lagate', 0))]} />
        <Person id="b-banker" x={1430} y={720} s={1.5} at={word('L050', 'bankers', -2)} tone={C.kraft} label="Banker" />
        <Person id="b-inv" x={1690} y={720} s={1.5} at={word('L050', 'investors', -2)} tone={C.yellow} label="Bada investor" />
        <Card id="b-bubble" x={1330} y={170} w={470} h={210} rot={2} at={word('L050', 'demand', -4)} out={l51} enter="drop" bg={C.paperLight}>
          <div style={{padding: '30px 34px', fontSize: 50, lineHeight: 1.15}}><Typed text={'Kis daam pe\nkitna loge?'} at={word('L050', 'demand', 0)} cps={18} style={{fontSize: 50}} /></div>
        </Card>
        <Term at={word('L050', 'roadshow', -4)} out={l51} text="Roadshow" sub="demand ka andaza" x={1330} y={850} />
      </Hold>

      {/* RHP */}
      <Footage id="b-press" src="press_roll" x={110} y={170} w={430} h={700} rot={-2} at={l51 - 2} out={l52} enter="left" torn={{top: true, bottom: true}} rough={12} caption="PRINTING" />
      <Card id="b-rhp" x={590} y={120} w={820} h={850} rot={1} at={word('L051', 'rhp', -8)} out={l52} enter="up" bg={C.paperLight} z={20}>
        <div style={{background: C.red, color: C.paperLight, fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 4, padding: '16px 34px'}}>RED HERRING PROSPECTUS</div>
        <div style={{padding: '30px 46px'}}>
          <div style={{fontFamily: F.display, fontSize: 190, lineHeight: 0.95}}>RHP</div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 3, marginTop: 6}}>JIO PLATFORMS LTD · FINAL DRAFT</div>
          {[['ISSUE DATES', word('L051', 'dates', -4)], ['PRICE BAND', word('L051', 'price', -4)]].map(([t, a]) => (
            <div key={t as string} style={{display: 'flex', alignItems: 'baseline', marginTop: 44, fontFamily: F.type, fontSize: 46}}>
              <span>{t}</span>
              <span style={{flex: 1, borderBottom: `3px dotted ${C.inkSoft}`, margin: '0 18px'}} />
              <span style={{fontFamily: F.display, fontSize: 64, opacity: frame >= (a as number) ? 1 : 0}}><HL at={a as number}>✓ ANDAR</HL></span>
            </div>
          ))}
          <div style={{marginTop: 50, fontFamily: F.type, fontSize: 30, color: C.inkSoft, lineHeight: 1.5}}>Objects of the issue · Risk factors · Basis for offer price …</div>
        </div>
      </Card>
      <Hand x={1460} y={430} at={word('L051', 'dates', 0)} out={l52} size={66} rot={-4} w={360}>ab dates + daam!</Hand>
      <Arrow id="b-rhpar" x1={1560} y1={540} x2={1390} y2={640} at={word('L051', 'price', 0)} out={l52} bow={30} />

      {/* price band ruler */}
      <Hold from={l52}>
        <div style={{position: 'absolute', left: 160, top: 140}}>
          <Big words={frame < l54 ? ['Price', 'band', '=', 'range'] : ['Cut-off', '=', 'jo', 'bhi', 'daam']} at={frame < l54 ? l52 : l54} size={150} />
        </div>
      </Hold>
      <Card id="b-ruler" x={RX} y={RY} w={RW} h={170} rot={-0.8} at={l52} enter="left" bg={C.card} depth={1.2}>
        <div style={{position: 'absolute', left: lo - RX, width: (hi - lo) * bandP, top: 0, bottom: 0, background: C.yellow, opacity: 0.85}} />
        <svg width={RW} height={170} style={{position: 'absolute', inset: 0}}>
          {Array.from({length: 80}).map((_, i) => <line key={i} x1={i * 20 + 10} y1={0} x2={i * 20 + 10} y2={i % 5 ? 30 : 58} stroke={C.ink} strokeWidth={i % 5 ? 2 : 4} />)}
        </svg>
        {[[lo, '₹1,065', word('L052', '₹1,065', -4)], [hi, '₹1,119', word('L052', '₹1,119', -4)]].map(([x, t, a]) => (
          <div key={t as string} style={{position: 'absolute', left: (x as number) - RX - 140, width: 280, top: 66, textAlign: 'center', opacity: frame >= (a as number) ? 1 : 0}}>
            <div style={{position: 'absolute', left: 136, top: -66, width: 8, height: 66, background: C.red}} />
            <div style={{fontFamily: F.display, fontSize: 80, lineHeight: 1.1}}>{t}</div>
          </div>
        ))}
        <div style={{position: 'absolute', left: 560, top: 80, fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, opacity: bandP}}>◀ JIO KA PRICE BAND ▶</div>
      </Card>
      {[word('L052', '₹1,065', -2), word('L052', '₹1,119', -2)].map((a, i) => <Sfx key={i} at={a} name="tick" volume={0.4} />)}
      <Card id="b-low" x={190} y={700} w={520} h={230} rot={-2} at={word('L052', '₹1,065', 0)} out={l53} enter="up" bg={C.paperLight}>
        <div style={{padding: '28px 34px'}}><Label size={20}>Neeche ki limit</Label><div style={{fontFamily: F.display, fontSize: 96, lineHeight: 1.1, marginTop: 10}}>FLOOR</div></div>
      </Card>
      <Card id="b-high" x={1220} y={700} w={520} h={230} rot={2} at={word('L052', '₹1,119', 0)} out={l53} enter="up" bg={C.yellow}>
        <div style={{padding: '28px 34px'}}><Label size={20}>Upar ki limit</Label><div style={{fontFamily: F.display, fontSize: 96, lineHeight: 1.1, marginTop: 10}}>CAP</div></div>
      </Card>
      <Hand x={750} y={780} at={word('L052', '₹1,119', 8)} out={l53} size={60} rot={-2} w={460}>beech mein hi boli</Hand>
      {bids.map((b, i) => <Slip key={i} id={'b-bid' + i} x={b.x} y={b.y} at={b.at} out={l54} text="BOLI" w={104} h={64} size={20} color={i % 3 ? C.paperLight : C.yellow} />)}
      <Card id="b-book" x={1120} y={700} w={640} h={270} rot={1.5} at={word('L053', 'isliye', -6)} out={l54} enter="up" bg={C.paperLight}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 26, background: C.ink}} />
        <div style={{padding: '24px 30px 0 56px'}}>
          <Label size={20}>Order book</Label>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 20}}>
            {Array.from({length: 11}).map((_, i) => (
              <div key={i} style={{fontFamily: F.hand, fontWeight: 700, fontSize: 52, lineHeight: 1, opacity: frame >= word('L053', 'book', -8) + i * 3 ? 1 : 0}}>{'||||'}</div>
            ))}
          </div>
        </div>
      </Card>
      <Term at={word('L053', 'book', -4)} out={l54} text="Book building" sub="boli se daam tay" x={200} y={760} />
      <Stamp id="b-cut" text="Cut-off" sub="UPPER END PE BOLI" x={1590} y={380} at={word('L054', 'cut-off', -2)} size={84} rot={-8} paper />
      <Person id="b-aam" x={420} y={970} s={1.35} at={word('L054', 'aam', -4)} tone={C.yellow} label="Aam investor" />
      <Card id="b-say" x={620} y={700} w={760} h={250} rot={-1.5} at={word('L054', 'matlab', -4)} enter="drop" bg={C.paperLight}>
        <div style={{padding: '34px 40px', fontFamily: F.hand, fontWeight: 700, fontSize: 64, lineHeight: 1.1}}>“Jo bhi final daam ho…<br /><HL at={word('L054', 'taiyaar', -2)}>main taiyaar hoon!</HL>”</div>
      </Card>
    </AbsoluteFill>
  );
};

const Lot: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l56 = at('L056'), l57 = at('L057');
  const snap = word('L055', 'lot', -2);
  const sp = ease(stepped(frame), snap, snap + 10);
  // 12 slips: scattered, then clipped into a 4x3 lot
  const GX = 1010, GY = 260;
  const slips = Array.from({length: 12}).map((_, i) => {
    const sx = 980 + ((i * 271) % 760), sy = 180 + ((i * 157) % 520);
    const gx = GX + 90 + (i % 4) * 172, gy = GY + 150 + Math.floor(i / 4) * 128;
    return {x: sx + (gx - sx) * sp, y: sy + (gy - sy) * sp, at: word('L055', 'shares', -4) + i * 2};
  });
  const jio = frame >= word('L057', 'jio', -4);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 130, top: 140}}>
        <Big words={['Shares', 'milte', 'hain', 'lot', 'mein']} at={word('L055', 'shares', -4)} size={140} style={{width: 760}} />
      </div>
      <Card id="lt-lot" x={GX} y={GY} w={760} h={560} rot={-1.5} at={snap - 2} enter="drop" bg={jio ? C.yellow : C.paperLight} sfx="drop">
        <div style={{padding: '22px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Label size={24}>{frame >= word('L057', '12', -2) ? 'Jio ka lot · 12 shares' : jio ? 'Jio ka lot' : '1 lot'}</Label>
        </div>
      </Card>
      <Tape id="lt-clip" x={GX + 300} y={GY - 22} w={180} rot={-5} at={snap + 4} />
      {slips.map((s, i) => <Slip key={i} id={'lt-s' + i} x={s.x} y={s.y} at={s.at} text="SHARE" w={150} h={96} size={22} rot={sp > 0.9 ? (i % 2 ? 1.5 : -1.5) : undefined} />)}
      <Sfx at={snap} name="riffle" volume={0.4} />
      {/* ek-ek nahi */}
      <Hold from={word('L055', 'ek-ek', -6)} to={l56}>
        <Slip id="lt-one" x={520} y={720} at={word('L055', 'ek-ek', -6)} text="1 SHARE" w={220} h={130} size={30} rot={-4} />
        <Cross id="lt-x" x={400} y={640} w={240} h={170} at={word('L055', 'nahi', -4)} />
      </Hold>
      {/* the rule */}
      <Card id="lt-rule" x={130} y={560} w={760} h={380} rot={1} at={l56 - 2} out={l57} enter="up" bg={C.card}>
        <div style={{padding: '34px 44px'}}>
          <Label size={22}>SEBI ka rule</Label>
          <div style={{fontFamily: F.type, fontSize: 46, marginTop: 24, lineHeight: 1.3}}>1 lot ki keemat lagbhag</div>
          <div style={{fontFamily: F.display, fontSize: 118, lineHeight: 1.05, marginTop: 6}}><HL at={word('L056', '₹10', -2)}>₹10–15 HAZAAR</HL></div>
        </div>
      </Card>
      {/* Jio's lot */}
      <Photo id="lt-jio" src="jiosim.jpg" x={1470} y={120} w={340} h={220} rot={7} at={word('L057', 'jio', -6)} enter="drop" pos="40% 50%" zoom={0} />
      <Card id="lt-math" x={130} y={560} w={800} h={390} rot={-1} at={l57 - 2} enter="up" bg={C.paperLight}>
        <div style={{padding: '30px 44px'}}>
          <Label size={22}>Upper band pe</Label>
          <div style={{fontFamily: F.display, fontSize: 84, marginTop: 20, lineHeight: 1.05, opacity: frame >= word('L057', '12', -2) ? 1 : 0}}>12 × ₹1,119</div>
          <div style={{fontFamily: F.display, fontSize: 150, lineHeight: 1.05, opacity: frame >= word('L057', '₹13,428', -6) ? 1 : 0}}>= <HL at={word('L057', '₹13,428', 4)}><Count from={0} to={13428} at={word('L057', '₹13,428', -6)} dur={18} fmt={inrN} /></HL></div>
        </div>
      </Card>
      <Sfx at={word('L057', '₹13,428', -6)} name="riffle" volume={0.35} />
    </AbsoluteFill>
  );
};

const Anchors: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l59 = at('L059'), l60 = at('L060'), l61 = at('L061'), l62 = at('L062'), l63 = at('L063');
  const anchorAt = word('L058', 'anchor', -6);
  const drop = interpolate(stepped(frame), [anchorAt, anchorAt + 6], [-700, 0], clamp);
  const dotsFrom = word('L060', '212', -6);
  const nDots = Math.round(ease(stepped(frame), dotsFrom, dotsFrom + 34) * 212);
  return (
    <AbsoluteFill>
      {/* a day before */}
      <Hold to={l59}>
        <Card id="a-pre" x={130} y={150} w={560} h={330} rot={-2} at={word('L058', 'ek', -4)} out={l59} enter="left" bg={C.yellow}>
          <div style={{padding: '30px 38px'}}>
            <Label size={22}>Issue khulne se</Label>
            <div style={{fontFamily: F.display, fontSize: 130, lineHeight: 1, marginTop: 18}}>1 DIN PEHLE</div>
          </div>
        </Card>
        <Card id="a-open" x={720} y={200} w={420} h={260} rot={2} at={word('L058', 'khulne', -4)} out={l59} enter="right" bg={C.card}>
          <div style={{padding: '30px 34px', opacity: 0.55}}>
            <Label size={20}>Phir</Label>
            <div style={{fontFamily: F.display, fontSize: 80, lineHeight: 1, marginTop: 16}}>ISSUE KHULTA HAI</div>
          </div>
        </Card>
        <Arrow id="a-ar" x1={700} y1={330} x2={760} y2={330} at={word('L058', 'khulne', 4)} out={l59} bow={0} dur={4} />
        <div style={{position: 'absolute', left: 130, top: 560}}>
          <Big words={['Bade', 'khiladi']} at={word('L058', 'bade', -4)} size={190} />
        </div>
        <div style={{position: 'absolute', left: 1250, top: 160 + drop, width: 520, height: 520, filter: `drop-shadow(10px 16px 12px ${C.shadow})`, opacity: frame >= anchorAt ? 1 : 0, transform: `rotate(${-8 + boil('anc', frame, 1).r * 4}deg)`}}>
          <AnchorIcon size={520} />
        </div>
        <Sfx at={anchorAt + 6} name="boom" volume={0.55} />
        <Term at={word('L058', 'anchor', 0)} out={l59} text="Anchor investors" sub="pehle aate hain" x={1220} y={760} />
      </Hold>

      {/* who they are */}
      {[
        ['a-mf', 'Mutual funds', word('L059', 'mutual', -4), C.paperLight],
        ['a-ins', 'Insurance companies', word('L059', 'insurance', -4), C.card],
        ['a-for', 'Videshi funds', word('L059', 'videshi', -4), C.yellow],
      ].map(([id, t, a, bg], i) => (
        <React.Fragment key={id as string}>
          <Card id={id as string} x={130 + i * 570} y={170} w={530} h={700} rot={[-2, 1, -1][i]} at={a as number} out={l60} enter="up" bg={bg as string}>
            <div style={{padding: '30px 36px'}}><Label size={22}>Anchor</Label></div>
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 40, textAlign: 'center', fontFamily: F.display, fontSize: 76, lineHeight: 1}}>{(t as string).toUpperCase()}</div>
          </Card>
          <Person id={id + 'p'} x={395 + i * 570} y={600} s={1.8} at={(a as number) + 4} out={l60} tone={C.inkSoft} badge="₹₹₹" sfx={null} />
        </React.Fragment>
      ))}

      {/* 212 anchors, ₹8,110 crore */}
      <Hold from={l60} to={l61}>
        <div style={{position: 'absolute', left: 130, top: 150}}>
          <Label size={24}>Jio IPO · anchor book</Label>
          <div style={{fontFamily: F.display, fontSize: 280, lineHeight: 1, marginTop: 10}}><Count from={0} to={212} at={dotsFrom} dur={34} fmt={(n) => String(Math.round(n))} /></div>
          <div style={{fontFamily: F.display, fontSize: 90, lineHeight: 1}}>ANCHORS</div>
        </div>
        <div style={{position: 'absolute', left: 900, top: 150, width: 900, display: 'grid', gridTemplateColumns: 'repeat(20, 1fr)', gap: 10}}>
          {Array.from({length: 212}).map((_, i) => <div key={i} style={{height: 30, background: i < nDots ? (i % 9 === 0 ? C.yellow : C.ink) : 'transparent', border: `2px solid ${i < nDots ? C.ink : 'transparent'}`}} />)}
        </div>
      </Hold>
      <Card id="a-8110" x={130} y={690} w={900} h={260} rot={-1.5} at={word('L060', '₹8,110', -6)} out={l61} enter="up" bg={C.yellow}>
        <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 40px', gap: 30}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, width: 160, lineHeight: 1.3}}>MILKE LAGAYE</div>
          <div style={{fontFamily: F.display, fontSize: 140, whiteSpace: 'nowrap'}}><Count from={0} to={8110} at={word('L060', '₹8,110', -6)} dur={24} fmt={inrN} /> CR</div>
        </div>
      </Card>
      <Sfx at={word('L060', '₹8,110', -6)} name="riffle" volume={0.35} />

      {/* trust: the big players stand behind the price */}
      <Hold from={l61} to={l62}>
        <Card id="a-price" x={170} y={170} w={760} h={420} rot={-2} at={l61 - 2} enter="left" bg={C.yellow}>
          <div style={{padding: '30px 40px'}}>
            <Label size={22}>Is daam pe</Label>
            <div style={{fontFamily: F.display, fontSize: 210, lineHeight: 1.05, marginTop: 10}}>₹1,119</div>
          </div>
        </Card>
        <div style={{position: 'absolute', left: 880, top: 140, width: 300, height: 300, transform: 'rotate(14deg)', filter: `drop-shadow(6px 10px 8px ${C.shadow})`}}><AnchorIcon size={300} /></div>
        <Stamp id="a-trust" text="Bharosa" x={560} y={660} at={word('L061', 'bharosa', -2)} size={110} rot={-6} paper />
        {[0, 1, 2, 3, 4].map((i) => (
          <Person key={i} id={'a-q' + i} x={1150 + i * 140} y={940} s={i === 0 ? 1.6 : 1.1} at={word('L061', 'bade', -4) + i * 3} tone={i === 0 ? C.inkSoft : C.card} label={i === 0 ? 'Anchor' : undefined} sfx={i ? null : undefined} />
        ))}
        <Hand x={1130} y={430} at={word('L061', 'bade', 0)} size={62} rot={-3} w={640}>bade log bhi taiyaar → baaki bhi aate hain</Hand>
      </Hold>

      {/* lock-in */}
      <Hold from={l62}>
        <div style={{position: 'absolute', left: 130, top: 120}}>
          <Big words={['Par', 'ek', 'shart']} at={l62} size={120} />
        </div>
        {[0, 1].map((k) => (
          <Card key={k} id={'a-box' + k} x={170 + k * 860} y={300} w={760} h={560} rot={k ? 1.5 : -1.5} at={word('L062', 'aadhe', -6) + k * 4} enter={k ? 'right' : 'left'} bg={C.paperLight}>
            <div style={{padding: '24px 30px'}}><Label size={22}>Anchor ke aadhe shares</Label></div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, padding: '10px 40px'}}>
              {Array.from({length: 8}).map((_, i) => <div key={i} style={{height: 90, background: i % 3 ? C.card : C.yellow, border: `3px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 16, letterSpacing: 2}}>SHARE</div>)}
            </div>
          </Card>
        ))}
        <Padlock x={550} y={760} at={word('L062', '30', -4)} label="30 DIN LOCK" />
        <Padlock x={1410} y={760} at={word('L062', '90', -4)} label="90 DIN LOCK" />
        <Hand x={1080} y={150} at={word('L062', 'bik', -4)} size={62} rot={-3} color={C.red}>tab tak bik nahi sakte</Hand>
      </Hold>
      <Stamp id="a-run" text="Listing day pe bhaag nahi" x={960} y={560} at={word('L063', 'bhaag', -4)} size={78} rot={-5} paper />
      <Sfx at={word('L063', 'listing', 0)} name="whoosh" volume={0.3} />
    </AbsoluteFill>
  );
};

const Cake: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l65 = at('L065'), l66 = at('L066'), l67 = at('L067'), l68 = at('L068'), l69 = at('L069');
  const cutAt = word('L064', 'cake', -4);
  // big cake (profit-making company); slides left and shrinks for the comparison
  const mv = ease(stepped(frame), l68, l68 + 14);
  const cx = 600 - 110 * mv, cy = 545 + 30 * mv, r = 330 - 90 * mv;
  const qibAt = word('L065', '50%', -4), niiAt = word('L066', '15%', -4), rAt = word('L067', '35%', -4);
  const r10 = word('L068', '10%', -6);
  return (
    <AbsoluteFill>
      <Hold to={l65 + 4}>
        <div style={{position: 'absolute', left: 1080, top: 200}}>
          <Big words={['Baaki', 'shares', 'ka', 'batwara']} at={word('L064', 'baaki', -4)} size={150} style={{width: 720}} />
        </div>
      </Hold>
      <Pie id="ck-big" cx={cx} cy={cy} r={r} at={word('L064', 'cake', -10)}
        slices={[
          {from: -90, to: 90, color: C.card, at: qibAt},
          {from: 90, to: 144, color: C.kraft, at: niiAt},
          {from: 144, to: 270, color: C.yellow, at: rAt, push: 46},
        ]} />
      {/* scissors cuts */}
      <Hold to={l65 + 6}>
        {[-90, 90, 144].map((deg, i) => (
          <React.Fragment key={deg}>
            <Marker id={'ck-cut' + i} d={`M600,545 L${600 + 360 * Math.cos((deg * Math.PI) / 180)},${545 + 360 * Math.sin((deg * Math.PI) / 180)}`} at={cutAt + 6 + i * 7} dur={6} color={C.red} width={6} />
            <Sfx at={cutAt + 6 + i * 7} name="scissors" volume={0.45} />
          </React.Fragment>
        ))}
        <Hand x={180} y={110} at={cutAt + 4} size={58} rot={-3}>✂ cake ki tarah</Hand>
      </Hold>
      {/* tags */}
      <SliceTag id="ck-t1" y={150} at={qibAt} out={l68} pct="50%" who={<>Bade institutions · <HL at={word('L065', 'qib', -2)}>QIB</HL></>} rule="mutual funds, banks, insurance" bg={C.card} />
      <SliceTag id="ck-t22" y={385} at={niiAt} out={l68} pct="15%" who={<>Bade investors · <HL at={word('L066', 'nii', -2)}>NII</HL></>} rule="₹2 lakh se zyada" bg={C.kraft} />
      <SliceTag id="ck-t3" y={620} at={rAt} out={l68} pct="35%" who={<HL at={word('L067', 'retail', -2)}>Retail · AAP</HL>} rule="₹2 lakh tak" bg={C.yellow} />
      <Person id="ck-aap" x={190} y={960} s={1.2} at={word('L067', 'aapke', -4)} out={l68} tone={C.yellow} label="Aap" />

      {/* profit vs no-profit companies */}
      <Hold from={l68}>
        <div style={{position: 'absolute', left: 230, top: 120, transform: 'rotate(-1.5deg)'}}><Label size={28}>Profit wali company</Label></div>
        <div style={{position: 'absolute', left: 1130, top: 120, transform: 'rotate(1.5deg)', opacity: frame >= word('L068', 'jo', -4) ? 1 : 0}}><Label size={28} dark={false}>Abhi profit nahi</Label></div>
        <div style={{position: 'absolute', left: 300, top: 900, fontFamily: F.display, fontSize: 64, textAlign: 'center', width: 380}}>RETAIL 35%</div>
      </Hold>
      <Pie id="ck-small" cx={1390} cy={560} r={260} at={word('L068', 'jo', -6)}
        slices={[
          {from: -90, to: 234, color: C.card},
          {from: 234, to: 270, color: C.yellow, at: r10, push: 70},
        ]} />
      <Stamp id="ck-10" text="Retail sirf 10%" x={1390} y={900} at={r10 + 2} size={84} rot={-4} paper />
      <Sfx at={r10} name="scissors" volume={0.45} />
      <Hand x={1640} y={250} at={word('L069', 'risk', -4)} size={64} rot={6} color={C.red} w={200}>risk zyada!</Hand>
      <Card id="ck-shield" x={730} y={640} w={370} h={330} rot={-2} at={word('L069', 'rule', -6)} enter="drop" bg={C.yellow}>
        <div style={{padding: '26px 30px', textAlign: 'center'}}>
          <svg width={110} height={120} viewBox="0 0 100 110"><path d="M50,6 L90,22 C90,60 76,88 50,104 C24,88 10,60 10,22 Z" fill={C.paperLight} stroke={C.ink} strokeWidth={6} /><path d="M32,56 L46,70 L70,40" fill="none" stroke={C.ink} strokeWidth={8} strokeLinecap="round" /></svg>
          <div style={{fontFamily: F.display, fontSize: 46, lineHeight: 1.02, marginTop: 6}}>RULE AAPKO BACHA RAHA HAI</div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

export const c3: Record<string, React.FC> = {band: Band, lot: Lot, anchors: Anchors, cake: Cake};
