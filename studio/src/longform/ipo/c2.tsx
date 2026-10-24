import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {Hold} from '../../components/kit';
import {Big, Card, Cross, Hand, HL, Label, Marker, Photo, Sfx, Stamp, Tape, usePlacement} from '../../components/paper';
import {boil, ease, pop, stepped} from '../../lib/motion';
import {useCues} from '../../lib/timeline';
import {C, F} from '../../theme';
import {Arrow, Footage, Person, Slip, Term, Typed} from '../kit16';
import {Stall} from './c1';

// Chapter 2 · Company ki kitaab: bankers, the DRHP, and what SEBI does (and doesn't) do.

const SUIT = '#7a746a';

// A thick document: cover sheet on top of a stack of page edges.
const DocStack: React.FC<{id: string; x: number; y: number; w: number; h: number; at: number; out?: number; rot?: number; enter?: 'drop' | 'up' | 'left' | 'right' | 'none'; titleAt?: number; title?: string; small?: boolean}> = ({id, x, y, w, h, at, out, rot = 0, enter = 'drop', titleAt = -1e9, title = 'DRHP', small}) => {
  const frame = useCurrentFrame();
  const pl = usePlacement(id, at, enter, out, 'left');
  const audio = enter === 'none' ? null : <Sfx at={at} name={enter === 'drop' ? 'boom' : 'slide'} volume={enter === 'drop' ? 0.5 : 0.25} />;
  if (!pl.visible) return audio;
  const edges = 9;
  return (
    <>
      {audio}
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `translate(${pl.x}px, ${pl.y}px) rotate(${rot + pl.r}deg) scale(${pl.s})`, opacity: pl.o, zIndex: 30}}>
        {Array.from({length: edges}).map((_, i) => (
          <div key={i} style={{position: 'absolute', left: (edges - i) * 3, top: (edges - i) * 4, width: w, height: h, background: i % 2 ? C.paperLight : '#e4ddcd', border: '1.5px solid rgba(20,20,20,0.35)', boxShadow: i === 0 ? `10px 14px 16px ${C.shadow}` : undefined}} />
        ))}
        <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, background: C.card, border: `3px solid ${C.ink}`}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: small ? 26 : 40, background: C.ink}} />
          <div style={{position: 'absolute', left: 24, right: 24, top: small ? 50 : 70, border: `${small ? 3 : 5}px solid ${C.red}`, padding: small ? '6px 8px' : '10px 14px', fontFamily: F.mono, fontWeight: 700, fontSize: small ? 13 : 20, letterSpacing: 2, color: C.red}}>DRAFT · SUBJECT TO CHANGE</div>
          <div style={{position: 'absolute', left: 0, right: 0, top: h * 0.36, textAlign: 'center', fontFamily: F.display, fontSize: small ? 110 : 170, lineHeight: 1, opacity: frame >= titleAt ? 1 : 0, transform: `scale(${frame >= titleAt ? Math.min(1.05, pop(frame, titleAt, 10, 0.5)) : 0.5})`}}>{title}</div>
          <div style={{position: 'absolute', left: 30, right: 30, bottom: small ? 40 : 60}}>
            {[0.9, 0.7, 0.8].map((k, i) => <div key={i} style={{height: small ? 6 : 9, width: `${k * 100}%`, background: 'rgba(20,20,20,0.25)', marginTop: small ? 10 : 16}} />)}
          </div>
        </div>
      </div>
    </>
  );
};

// A slip that flies between two points and then disappears.
const Flyer: React.FC<{id: string; x1: number; y1: number; x2: number; y2: number; at: number; text: string; bg?: string; w?: number}> = ({id, x1, y1, x2, y2, at, text, bg = C.paperLight, w = 120}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at || f > at + 22) return null;
  const p = ease(f, at, at + 14);
  const o = f > at + 16 ? 1 - ease(f, at + 16, at + 22) : 1;
  const b = boil(id, frame, 0.8);
  return (
    <>
      <Sfx at={at} name="whoosh" volume={0.18} />
      <div style={{position: 'absolute', left: x1 + (x2 - x1) * p - w / 2 + b.x, top: y1 + (y2 - y1) * p - 36 - Math.sin(p * Math.PI) * 60 + b.y, width: w, height: 72, background: bg, border: `4px solid ${C.ink}`, fontFamily: F.display, fontSize: 44, lineHeight: '66px', textAlign: 'center', opacity: o, transform: `rotate(${(random(id) - 0.5) * 16}deg)`, boxShadow: `3px 5px 6px ${C.shadow}`, zIndex: 60}}>{text}</div>
    </>
  );
};

const Magnifier: React.FC<{x: number; y: number; size?: number}> = ({x, y, size = 240}) => (
  <svg width={size * 1.5} height={size * 1.5} viewBox="0 0 150 150" style={{position: 'absolute', left: x - size / 2, top: y - size / 2, zIndex: 66, filter: `drop-shadow(6px 10px 8px ${C.shadow})`, overflow: 'visible'}}>
    <line x1={88} y1={88} x2={140} y2={140} stroke={C.ink} strokeWidth={16} strokeLinecap="round" />
    <circle cx={50} cy={50} r={44} fill="rgba(246,242,233,0.25)" stroke={C.ink} strokeWidth={9} />
    <path d="M24,40 A28,28 0 0 1 44,20" fill="none" stroke={C.paperLight} strokeWidth={5} strokeLinecap="round" />
  </svg>
);

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const Bankers: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l32 = at('L032'), l33 = at('L033');
  const mahino = word('L033', 'mahino', -4);
  return (
    <AbsoluteFill>
      {/* a shop board is easy; an IPO is not */}
      <Stall id="b-stall" x={150} y={180} s={1.55} at={4} out={l32} enter="left" />
      <Hand x={170} y={690} at={word('L031', 'board', -4)} out={l32} size={60} rot={-3} w={560}>board lagao, dukaan shuru!</Hand>
      <Card id="b-ipo" x={1040} y={140} w={740} h={330} rot={2} at={word('L031', 'ipo', -4)} out={l32} enter="right" bg={C.yellow}>
        <div style={{padding: '24px 36px'}}>
          <Label size={22}>IPO laana</Label>
          <div style={{fontFamily: F.display, fontSize: 190, lineHeight: 1.05}}>IPO</div>
        </div>
      </Card>
      <Card id="b-list" x={1090} y={420} w={640} h={530} rot={-1.5} at={word('L031', 'laana', -2)} out={l32} enter="up" bg={C.paperLight}>
        <div style={{padding: '30px 40px', fontFamily: F.type, fontSize: 38, lineHeight: 1.55}}>
          {['☐ Bankers', '☐ Lawyers, auditors', '☐ Mota document', '☐ SEBI ke sawaal', '☐ Daam, dates…'].map((t) => <div key={t}>{t}</div>)}
        </div>
      </Card>
      <Stamp id="b-nahi" text="Aasaan nahi" x={860} y={560} at={word('L031', 'aasaan', -4)} out={l32} size={84} rot={-8} />

      {/* the bankers' table */}
      {[640, 860, 1080, 1300].map((x, i) => (
        <Person key={x} id={'b-bk' + i} x={x} y={570} s={1.3} at={l32 + 2 + i * 4} tone={SUIT} badge="BANK" sfx={i === 0 ? 'slide' : null} />
      ))}
      <Hold from={l32}>
        <div style={{position: 'absolute', left: 470, top: 470, width: 980, height: 340, borderRadius: '50%', background: C.kraft, border: `6px solid ${C.ink}`, boxShadow: `8px 14px 16px ${C.shadow}`, zIndex: 42, transform: `scale(${Math.min(1, Math.max(0, pop(frame, l32, 12, 0.5)))})`}}>
          <div style={{position: 'absolute', inset: 22, borderRadius: '50%', border: `3px dashed rgba(20,20,20,0.35)`}} />
        </div>
      </Hold>
      {['DRHP', 'SEBI', '₹ ?', 'PLAN'].map((t, i) => (
        <Slip key={t} id={'b-pp' + i} x={640 + i * 210} y={630 + (i % 2) * 50} at={l32 + 18 + i * 3} text={t} w={150} h={84} size={22} color={i === 0 ? C.yellow : C.paperLight} />
      ))}
      <Term at={word('L032', 'merchant', -6)} out={l33} text="Merchant bankers" sub="poora IPO chalate hain" x={560} y={860} />
      <Hand x={1160} y={860} at={word('L032', 'chalana', -6)} out={l33} size={56} rot={-2} w={640}>poora IPO inke haath mein</Hand>
      <Person id="b-law" x={300} y={600} s={1.15} at={word('L033', 'lawyers', -4)} tone={C.card} label="Lawyer" />
      <Person id="b-aud" x={1620} y={600} s={1.15} at={word('L033', 'auditors', -4)} tone={C.card} label="Auditor" />
      <Person id="b-reg" x={1620} y={930} s={1.05} at={word('L033', 'registrar', -4)} tone={C.paperLight} label="Registrar" />
      {/* months of preparation */}
      {MONTHS.slice(0, 6).map((m, i) => {
        const a = mahino + i * 4;
        if (frame < a) return null;
        const p = Math.min(1.06, Math.max(0, pop(frame, a, 11, 0.5)));
        return (
          <React.Fragment key={m}>
            <Sfx at={a} name="page" volume={0.2} />
            <div style={{position: 'absolute', left: 520 + i * 150, top: 845, width: 136, height: 120, background: i === 5 ? C.yellow : C.paperLight, border: `4px solid ${C.ink}`, transform: `scale(${p}) rotate(${(i % 2 ? 1.5 : -1.5)}deg)`, boxShadow: `3px 5px 6px ${C.shadow}`, zIndex: 50}}>
              <div style={{height: 26, background: C.red}} />
              <div style={{fontFamily: F.display, fontSize: 52, textAlign: 'center', lineHeight: '86px'}}>{m}</div>
            </div>
          </React.Fragment>
        );
      })}
      <Hand x={130} y={790} at={mahino + 6} size={60} rot={-4} color={C.red} w={380}>mahino ki taiyaari…</Hand>
    </AbsoluteFill>
  );
};

const TABS: [string, string, string][] = [
  ['BUSINESS', 'company', 'Company kya karti hai'],
  ['PROFIT', 'kamaati', 'Kitna kamaati hai'],
  ['KARZ', 'karz', 'Kitna karz hai'],
  ['PROMOTERS', 'promoters', 'Malik kaun hain'],
  ['COURT CASES', 'court', 'Kaunse case chal rahe hain'],
  ['RISKS', 'risks', 'Kya galat ho sakta hai'],
];

const Drhp: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word, end} = useCues();
  const l35 = at('L035'), l36 = at('L036'), l37 = at('L037'), l38 = at('L038'), l40 = at('L040');
  const aise = word('L036', 'aise', -4);
  const tabAt = TABS.map(([, w], i) => word(i < 3 ? 'L038' : 'L039', w, -4));
  const activeTab = tabAt.reduce((k, t, i) => (frame >= t ? i : k), -1);
  const objects = word('L040', 'objects', -4);
  const zoom = ease(stepped(frame), objects, objects + 18, 1, 1.42);
  const acr: [string, string, number, boolean][] = [
    ['D', 'DRAFT', word('L035', 'draft', -4), false],
    ['R', 'RED', word('L035', 'red', -4), true],
    ['H', 'HERRING', word('L035', 'herring', -4), true],
    ['P', 'PROSPECTUS', word('L035', 'prospectus', -6), false],
  ];
  return (
    <AbsoluteFill>
      {/* the thick document lands */}
      <Footage id="d-press" src="press_roll" x={130} y={140} w={780} h={560} rot={-2} at={2} out={l35} enter="left" torn={{top: true, bottom: true}} rough={14} caption="ARCHIVE FILM" />
      <Hold to={l35}>
        <div style={{position: 'absolute', left: 980, top: 130}}><Big words={['Sabse', 'bada', 'kaam']} at={4} size={110} /></div>
        <Hand x={160} y={760} at={word('L034', 'mota', 0)} size={70} rot={-3}>ek MOTA document →</Hand>
      </Hold>
      <DocStack id="d-doc" x={1050} y={300} w={560} h={640} rot={2.5} at={word('L034', 'mota', -4)} out={l36} titleAt={word('L035', 'drhp', -4)} />
      {/* paper dust when it lands */}
      {Array.from({length: 10}).map((_, i) => {
        const a = word('L034', 'mota', -2);
        if (frame < a || frame > a + 14) return null;
        const k = ease(frame, a, a + 14);
        const ang = (i / 10) * Math.PI - Math.PI;
        return <div key={i} style={{position: 'absolute', left: 1330 + Math.cos(ang) * (320 + 120 * k), top: 930 + Math.sin(ang) * 60 * k - 40 * k, width: 16, height: 10, background: C.paperLight, border: `2px solid ${C.ink}`, opacity: 1 - k, transform: `rotate(${i * 37}deg)`, zIndex: 31}} />;
      })}
      {/* D-R-H-P */}
      {acr.map(([L, w, a, red], i) => (
        <Hold key={L} from={a} to={l36}>
          <div style={{position: 'absolute', left: 150, top: 160 + i * 190, display: 'flex', alignItems: 'center', gap: 34, transform: `translateX(${(1 - Math.min(1, ease(stepped(frame), a, a + 6))) * -300}px)`}}>
            <div style={{width: 150, height: 150, background: red ? C.red : C.yellow, color: red ? C.paperLight : C.ink, border: `5px solid ${C.ink}`, fontFamily: F.display, fontSize: 120, textAlign: 'center', lineHeight: '146px', boxShadow: `4px 7px 8px ${C.shadow}`}}>{L}</div>
            <div style={{fontFamily: F.display, fontSize: 110, color: red ? C.red : C.ink}}>{w}</div>
          </div>
          <Sfx at={a} name="pop" volume={0.25} />
        </Hold>
      ))}
      {/* red herring: why? */}
      <Hold from={l36} to={aise}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center'}}>
          <Big words={['Red', 'herring', 'kyun?']} at={l36 + 2} size={190} align="center" color={C.red} />
        </div>
      </Hold>
      <Card id="d-cover" x={330} y={110} w={1260} h={860} rot={-1} at={aise} out={l38} enter="drop" bg={C.card}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 34, background: C.ink}} />
        <div style={{position: 'absolute', left: 70, top: 64, fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 4}}>DRAFT RED HERRING PROSPECTUS</div>
        <div style={{position: 'absolute', left: 66, top: 104, fontFamily: F.display, fontSize: 112, lineHeight: 1}}>RAJU KI CHAI LIMITED</div>
        <div style={{position: 'absolute', left: 70, top: 232, fontFamily: F.type, fontSize: 32}}>Initial Public Offer of equity shares</div>
        {frame >= word('L036', 'laal', -4) ? (
          <div style={{position: 'absolute', left: 64, top: 300, width: 1120, height: 190, border: `7px solid ${C.red}`, padding: '20px 28px', transform: `scaleY(${ease(stepped(frame), word('L036', 'laal', -4), word('L036', 'laal', 4))})`, transformOrigin: 'top'}}>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: C.red}}>⚠ CHETAVNI</div>
            <div style={{marginTop: 10, color: C.red, fontSize: 42, lineHeight: 1.25}}><Typed text="Yeh jaankari adhoori hai, aur badal sakti hai." at={word('L036', 'chetavni', -4)} cps={22} style={{fontSize: 42, color: C.red}} /></div>
          </div>
        ) : null}
        {/* fields still blank */}
        {frame >= l37 ? (
          <div style={{position: 'absolute', left: 70, top: 560, fontFamily: F.type, fontSize: 52, lineHeight: 1.7}}>
            <div>PRICE BAND: ₹ ______ – ______</div>
            <div>ISSUE DATES: ______________</div>
          </div>
        ) : null}
      </Card>
      <Sfx at={word('L036', 'laal', -4)} name="marker" volume={0.3} />
      <Stamp id="d-final" text="Yeh final nahi" x={1290} y={870} at={word('L036', 'final', -4)} out={l38} size={84} rot={-6} />
      {[['daam', 600], ['taareekh', 690]].map(([w, y]) => (
        <Hold key={w as string} from={word('L037', w as string, -2)} to={l38}>
          <Sfx at={word('L037', w as string, -2)} name="stamp" volume={0.3} />
          <div style={{position: 'absolute', left: 1230, top: (y as number) + 26, width: 96, height: 96, borderRadius: 48, background: C.red, color: C.paperLight, fontFamily: F.display, fontSize: 76, textAlign: 'center', lineHeight: '100px', transform: `rotate(10deg) scale(${Math.min(1.1, pop(frame, word('L037', w as string, -2), 9, 0.5))})`, zIndex: 60, boxShadow: `3px 5px 6px ${C.shadow}`}}>?</div>
        </Hold>
      ))}
      {/* the book with tabs */}
      <Card id="d-book" x={200} y={130} w={1320} h={840} rot={-0.8} at={l38} out={l40} enter="up" bg={C.paperLight}>
        <div style={{position: 'absolute', left: 655, top: 0, bottom: 0, width: 10, background: 'linear-gradient(90deg, rgba(0,0,0,0), rgba(0,0,0,0.22), rgba(0,0,0,0))'}} />
        <div style={{position: 'absolute', left: 60, top: 60, width: 560}}>
          <Label size={22}>{activeTab < 0 ? 'Baaki sab hota hai' : 'Section'}</Label>
          {activeTab >= 0 ? (
            <>
              <div style={{fontFamily: F.display, fontSize: TABS[activeTab][0].length > 9 ? 96 : 120, lineHeight: 1, marginTop: 30, color: activeTab === 5 ? C.red : C.ink}}>{TABS[activeTab][0]}</div>
              <div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 60, marginTop: 20, lineHeight: 1.05}}>{TABS[activeTab][2]}</div>
            </>
          ) : (
            <div style={{fontFamily: F.display, fontSize: 96, lineHeight: 1.05, marginTop: 30}}>SAB KUCH LIKHA HOTA HAI</div>
          )}
          {[0.95, 0.8, 0.9, 0.6, 0.85].map((k, i) => <div key={i} style={{height: 12, width: `${k * 100}%`, background: 'rgba(20,20,20,0.18)', marginTop: 26}} />)}
        </div>
        <div style={{position: 'absolute', left: 720, top: 70, width: 520}}>
          {Array.from({length: 16}).map((_, i) => <div key={i} style={{height: 11, width: `${60 + random('bl' + i + activeTab) * 40}%`, background: 'rgba(20,20,20,0.16)', marginTop: 30}} />)}
        </div>
      </Card>
      {TABS.map(([t], i) => {
        const a = tabAt[i];
        if (frame < a || frame >= l40 + 6) return null;
        const p = Math.min(1, ease(stepped(frame), a, a + 6));
        const o = frame >= l40 ? 1 - ease(frame, l40, l40 + 6) : 1;
        const isA = i === activeTab;
        return (
          <React.Fragment key={t}>
            <Sfx at={a} name="page" volume={0.35} />
            <div style={{position: 'absolute', left: 1470 + (1 - p) * 160 + (isA ? 30 : 0), top: 160 + i * 128, width: 290, height: 104, background: i === 5 ? C.red : i % 2 ? C.yellow : C.paperLight, color: i === 5 ? C.paperLight : C.ink, border: `4px solid ${C.ink}`, fontFamily: F.display, fontSize: t.length > 9 ? 40 : 48, lineHeight: '96px', paddingLeft: 50, opacity: o, boxShadow: `4px 6px 8px ${C.shadow}`, zIndex: 35, transform: `rotate(${i % 2 ? 1 : -1}deg)`}}>{t}</div>
          </React.Fragment>
        );
      })}
      {/* doc-zoom: objects of the issue */}
      <Hold from={l40}>
        <div style={{position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: '960px 560px'}}>
          <Card id="d-page" x={360} y={110} w={1200} h={860} rot={0.6} at={l40} enter="up" bg={C.paperLight}>
            <div style={{padding: '50px 70px'}}>
              <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: C.inkSoft}}>DRHP · RAJU KI CHAI LIMITED</div>
              <div style={{fontFamily: F.type, fontSize: 34, marginTop: 30, color: C.inkSoft}}>CAPITAL STRUCTURE</div>
              {[0.9, 0.75, 0.85].map((k, i) => <div key={i} style={{height: 10, width: `${k * 100}%`, background: 'rgba(20,20,20,0.16)', marginTop: 18}} />)}
              <div style={{fontFamily: F.display, fontSize: 92, marginTop: 50}}><HL at={objects + 4}>OBJECTS OF THE ISSUE</HL></div>
              <div style={{fontFamily: F.type, fontSize: 40, lineHeight: 1.6, marginTop: 18}}>
                <div>• Purana loan chukana</div>
                <div>• Nayi dukaanein kholna</div>
                <div>• Company ke general kaam</div>
              </div>
              {[0.8, 0.65].map((k, i) => <div key={i} style={{height: 10, width: `${k * 100}%`, background: 'rgba(20,20,20,0.16)', marginTop: 22}} />)}
            </div>
          </Card>
          <Hand x={1000} y={700} at={word('L040', 'kahan', -4)} size={62} rot={-5} color={C.red} w={620}>← paisa yahan jaayega</Hand>
        </div>
        <Sfx at={objects + 4} name="marker" volume={0.35} />
      </Hold>
      <Term at={word('L040', 'sabse', -4)} out={end('L040', 10)} text="Sabse kaam ka section" x={150} y={890} rot={-3} />
    </AbsoluteFill>
  );
};

const Sebi: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l42 = at('L042'), l43 = at('L043'), l44 = at('L044'), l45 = at('L045'), l46 = at('L046'), l47 = at('L047'), l48 = at('L048');
  const obs = word('L043', 'observations', -6);
  const mag = ease(stepped(frame), word('L046', 'dekhta', -4), at('L047') - 10);
  const band = word('L048', 'ek', -4);
  return (
    <AbsoluteFill>
      {/* the DRHP goes to SEBI */}
      <Photo id="s-sebi" src="sebi.jpg" x={820} y={130} w={980} h={640} rot={1.5} at={2} out={l42} enter="right" torn={{top: true, right: true}} rough={14} caption="SEBI BHAVAN, MUMBAI" pos="50% 40%" />
      <DocStack id="s-doc" x={210} y={230} w={380} h={460} rot={-3} at={4} out={l42} enter="left" small titleAt={0} />
      <Arrow id="s-ar" x1={620} y1={470} x2={870} y2={420} at={word('L041', 'jaata', -2)} out={l42} bow={-50} width={10} />
      <Card id="s-reg" x={820} y={790} w={980} h={160} rot={-1} at={word('L041', 'share', -6)} out={l42} enter="up" bg={C.yellow}>
        <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 36px', gap: 30}}>
          <div style={{fontFamily: F.display, fontSize: 92}}>SEBI</div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 3, lineHeight: 1.3}}>SHARE MARKET KA<br />REGULATOR</div>
        </div>
      </Card>
      <Tape id="s-tape" x={1240} y={110} w={170} rot={-6} at={6} out={l42} />

      {/* anyone can read it */}
      <Card id="s-web" x={140} y={150} w={1060} h={680} rot={-1} at={l42} out={l43} enter="left" bg={C.paperLight}>
        <div style={{height: 64, background: C.ink, display: 'flex', alignItems: 'center', gap: 14, padding: '0 24px'}}>
          {[C.red, C.yellow, C.paperLight].map((c) => <div key={c} style={{width: 20, height: 20, borderRadius: 10, background: c}} />)}
          <div style={{marginLeft: 20, background: C.paperLight, flex: 1, height: 36, fontFamily: F.mono, fontSize: 20, lineHeight: '36px', paddingLeft: 16}}>sebi.gov.in › Filings › Draft offer documents</div>
        </div>
        <div style={{padding: '30px 40px'}}>
          {['RAJU KI CHAI LTD', 'ABC FOODS LTD', 'XYZ STEEL LTD', 'PQR TECH LTD'].map((n, i) => (
            <div key={n} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid rgba(20,20,20,0.2)', padding: '20px 10px', background: i === 0 && frame >= word('L042', 'padh', -4) ? C.yellow : undefined}}>
              <div style={{fontFamily: F.display, fontSize: 52}}>{n} — DRHP</div>
              <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, border: `3px solid ${C.ink}`, padding: '4px 12px'}}>PDF ↓</div>
            </div>
          ))}
        </div>
      </Card>
      <Person id="s-aap" x={1500} y={900} s={1.9} at={word('L042', 'aap', -4)} out={l43} tone={C.card} label="Aap" enter="right" />
      <Stamp id="s-free" text="Free" x={1080} y={800} at={word('L042', 'free', -4)} out={l43} size={110} rot={-8} paper />

      {/* questions and answers, then observations */}
      <Photo id="s-sebi2" src="sebi.jpg" x={140} y={170} w={500} h={420} rot={-2} at={l43} out={l44} enter="left" caption="SEBI" zoom={0} />
      <Stall id="s-co" x={1290} y={170} s={1.45} at={l43 + 2} out={l44} enter="right" />
      <div style={{position: 'absolute', left: 1330, top: 620, opacity: frame >= l43 + 6 && frame < l44 ? 1 : 0}}><Label size={26}>Company</Label></div>
      {[0, 7, 14].map((d, i) => (
        <Flyer key={'q' + i} id={'s-q' + i} x1={640} y1={300 + i * 70} x2={1280} y2={330 + i * 70} at={word('L043', 'sawaal', -6) + d} text="?" w={90} bg={C.paperLight} />
      ))}
      {[0, 7, 14].map((d, i) => (
        <Flyer key={'a' + i} id={'s-a' + i} x1={1280} y1={360 + i * 70} x2={640} y2={330 + i * 70} at={word('L043', 'jawaab', -6) + d} text="JAWAAB" w={190} bg={C.yellow} />
      ))}
      <Card id="s-obs" x={660} y={560} w={640} h={400} rot={1.5} at={obs} out={l44} enter="drop" bg={C.card}>
        <div style={{padding: '28px 36px'}}>
          <Label size={22}>SEBI ka letter</Label>
          <div style={{fontFamily: F.display, fontSize: 76, lineHeight: 1, marginTop: 18}}>OBSERVATIONS</div>
          {[0.9, 0.7, 0.85, 0.6].map((k, i) => <div key={i} style={{height: 10, width: `${k * 100}%`, background: 'rgba(20,20,20,0.2)', marginTop: 20}} />)}
        </div>
      </Card>

      {/* the big misunderstanding */}
      <Hold from={l44} to={l45}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center'}}>
          <Big words={['Badi', 'galatfehmi']} at={l44 + 2} size={220} align="center" />
        </div>
        <Marker id="s-ul" d="M380,620 C800,600 1200,640 1560,605" at={word('L044', 'galatfehmi', -2)} dur={8} width={14} />
        <Hand x={1260} y={680} at={word('L044', 'door', -4)} size={70} rot={-4} color={C.red}>door kar lo!</Hand>
      </Hold>
      <Sfx at={word('L044', 'galatfehmi', -2)} name="marker" volume={0.3} />
      {[['ACHCHHI', 200, 'achchhi'], ['BURI', 1040, 'buri']].map(([t, x, w], i) => (
        <React.Fragment key={t as string}>
          <Card id={'s-' + t} x={x as number} y={200} w={680} h={450} rot={i ? 2 : -2} at={l45 + i * 6} out={l46} enter={i ? 'right' : 'left'} bg={i ? C.paperLight : C.yellow}>
            <div style={{padding: '30px 40px'}}>
              <Label size={22}>Company</Label>
              <div style={{fontFamily: F.display, fontSize: 150, lineHeight: 1.05, marginTop: 30}}>{t}?</div>
            </div>
          </Card>
          <Cross id={'s-x' + i} x={(x as number) + 40} y={240} w={600} h={370} at={word('L045', w as string, -2)} out={l46} />
        </React.Fragment>
      ))}
      <Stamp id="s-nahibatata" text="SEBI yeh nahi batata" x={960} y={790} at={word('L045', 'nahi', -4)} out={l46} size={84} rot={-4} paper />

      {/* what SEBI checks */}
      <Card id="s-page" x={200} y={140} w={980} h={820} rot={-1} at={l46} out={l47} enter="up" bg={C.paperLight}>
        <div style={{padding: '40px 60px'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: C.inkSoft}}>DRHP · DISCLOSURES</div>
          {TABS.map(([t]) => (
            <div key={t} style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 34}}>
              <div style={{fontFamily: F.type, fontSize: 44, width: 380}}>{t.charAt(0) + t.slice(1).toLowerCase()}</div>
              <div style={{flex: 1, height: 12, background: 'rgba(20,20,20,0.18)'}} />
            </div>
          ))}
        </div>
      </Card>
      {TABS.map(([t], i) => (
        <React.Fragment key={'tk' + t}>
          <Marker id={'s-tk' + i} d={`M${1100},${300 + i * 105} l18,22 l40,-52`} at={word('L046', 'saaf-saaf', -6) + i * 5} out={l47} dur={4} color={C.ink} width={10} />
          <Sfx at={word('L046', 'saaf-saaf', -6) + i * 5} name="tick" volume={0.3} />
        </React.Fragment>
      ))}
      <Hold from={l46} to={l47}>
        <Magnifier x={760 + Math.sin(mag * 6) * 120} y={250 + mag * 560} size={230} />
      </Hold>
      <Card id="s-q" x={1260} y={260} w={540} h={460} rot={2.5} at={word('L046', 'zaroori', -6)} out={l47} enter="right" bg={C.yellow}>
        <div style={{padding: '30px 38px'}}>
          <Label size={22}>SEBI ka sawaal</Label>
          <div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 82, lineHeight: 1.05, marginTop: 30}}>Saaf-saaf likha hai?</div>
        </div>
      </Card>

      {/* the myth, crossed out */}
      <Hold from={l47} to={l48}>
        <div style={{position: 'absolute', left: 210, top: 210, fontFamily: F.marker, fontSize: 118, lineHeight: 1.05, color: C.ink, transform: 'rotate(-2deg)', clipPath: `inset(-20% ${100 - ease(stepped(frame), word('L047', 'sebi', -2), word('L047', 'hai', 0)) * 100}% -20% -5%)`, zIndex: 65}}>
          “SEBI approved = SAFE”
        </div>
      </Hold>
      <Sfx at={word('L047', 'sebi', -2)} name="marker" volume={0.35} />
      <Cross id="s-xmyth" x={190} y={190} w={1520} h={200} at={word('L047', 'galat', -4)} out={l48} />
      <Stamp id="s-galat" text="Galat" x={1580} y={470} at={word('L047', 'galat', 0)} out={l48} size={110} rot={10} />
      <Card id="s-faisla" x={560} y={560} w={860} h={330} rot={-2} at={word('L047', 'faisla', -6)} out={l48} enter="up" bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 140, textAlign: 'center', lineHeight: '330px', whiteSpace: 'nowrap'}}>FAISLA AAPKA</div>
      </Card>
      <Person id="s-aap2" x={330} y={950} s={1.5} at={word('L047', 'faisla', -2)} out={l48} tone={C.card} label="Aap" />

      {/* one year to open the IPO */}
      <Card id="s-obs2" x={140} y={140} w={620} h={170} rot={-2} at={l48} enter="left" bg={C.card}>
        <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 30px', gap: 20}}>
          <div style={{fontFamily: F.display, fontSize: 64}}>OBSERVATIONS</div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24}}>MILE ✓</div>
        </div>
      </Card>
      {MONTHS.map((m, i) => {
        const a = l48 + 6 + i * 2;
        if (frame < a) return null;
        const p = Math.min(1.06, Math.max(0, pop(frame, a, 11, 0.5)));
        return (
          <div key={m} style={{position: 'absolute', left: 140 + i * 138, top: 380, width: 126, height: 170, background: C.paperLight, border: `4px solid ${C.ink}`, transform: `scale(${p}) rotate(${(i % 2 ? 1.2 : -1.2)}deg)`, boxShadow: `3px 5px 6px ${C.shadow}`, zIndex: 30}}>
            <div style={{height: 34, background: C.red}} />
            <div style={{fontFamily: F.display, fontSize: 50, textAlign: 'center', lineHeight: '120px'}}>{m}</div>
          </div>
        );
      })}
      <Sfx at={l48 + 6} name="riffle" volume={0.3} />
      {frame >= band ? (
        <div style={{position: 'absolute', left: 130, top: 580, width: 1670, height: 170, background: C.yellow, border: `5px solid ${C.ink}`, clipPath: `inset(-10px ${100 - ease(stepped(frame), band, band + 12) * 100}% -10px -10px)`, transform: 'rotate(-0.8deg)', boxShadow: `5px 8px 10px ${C.shadow}`, zIndex: 40, textAlign: 'center', fontFamily: F.display, fontSize: 130, lineHeight: '170px'}}>← 1 SAAL →</div>
      ) : null}
      <Stamp id="s-kholo" text="IPO kholo" x={1560} y={850} at={word('L048', 'ipo', -2)} size={84} rot={-6} paper />
      <Hand x={200} y={810} at={word('L048', 'kholne', -2)} size={64} rot={-3} w={900}>isi ke andar IPO kholna hai</Hand>
    </AbsoluteFill>
  );
};

export const c2: Record<string, React.FC> = {bankers: Bankers, drhp: Drhp, sebi: Sebi};
