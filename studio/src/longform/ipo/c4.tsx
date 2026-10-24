import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Hold} from '../../components/kit';
import {Big, Card, Cross, Hand, HL, Label, Photo, Sfx, Stamp, Tape} from '../../components/paper';
import {boil, ease, pop, stepped} from '../../lib/motion';
import {useCues} from '../../lib/timeline';
import {tornPolygon} from '../../lib/torn';
import {C, F} from '../../theme';
import {Arrow, Footage, Person, Slip, Term, Typed} from '../kit16';
import {Padlock} from './c3';

// Chapter 4 · Teen din ki boli: the bidding window, then vs now, ASBA, subscription, grey market.

// Phone photo (1400x1051): screen centred at (656, 543), 262x436, tilted 17.9°.
const PS = 0.64;
const AppScreen: React.FC<{steps: number[]}> = ({steps}) => {
  const frame = useCurrentFrame();
  const n = steps.filter((s) => frame >= s).length;
  const rows = ['BROKER APP', 'BID · 1 LOT', 'UPI MANDATE', '✓ APPROVED'];
  return (
    <div style={{position: 'absolute', left: 656 * PS - (262 * PS) / 2, top: 543 * PS - (436 * PS) / 2, width: 262 * PS, height: 436 * PS, transform: 'rotate(17.9deg)', background: C.paperLight, borderRadius: 10, fontFamily: F.mono, textAlign: 'center', paddingTop: 16}}>
      <div style={{fontFamily: F.display, fontSize: 20}}>IPO</div>
      {rows.map((r, i) => (
        <div key={r} style={{margin: '8px 12px 0', padding: '6px 0', fontSize: 11, fontWeight: 700, letterSpacing: 1, border: `2px solid ${C.ink}`, background: i < n ? (i === 3 ? C.yellow : C.paperLight) : C.paper, opacity: i < n ? 1 : 0.25}}>{r}</div>
      ))}
    </div>
  );
};

// Glass jar of rupee notes with a lid. Notes fly out (shares mila) or the padlock opens (na mila).
const Jar: React.FC<{x: number; y: number; w: number; h: number; at: number; out?: number; lockAt?: number; openAt?: number; emptyAt?: number; label?: string}> = ({x, y, w, h, at, out, lockAt, openAt, emptyAt, label}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  if (f < at || (out !== undefined && f >= out + 8)) return null;
  const s = Math.min(1.06, pop(frame, at, 11, 0.5));
  const o = out !== undefined && f >= out ? 1 - ease(f, out, out + 8) : 1;
  const b = boil('jar' + x, frame, 0.8);
  const notes = [0, 1, 2, 3, 4];
  return (
    <>
      <Sfx at={at} name="drop" volume={0.3} />
      {emptyAt !== undefined ? <Sfx at={emptyAt} name="riffle" volume={0.45} /> : null}
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `translate(${b.x}px, ${b.y}px) scale(${s})`, opacity: o, zIndex: 35}}>
        {/* notes inside */}
        {notes.map((i) => {
          const fly = emptyAt !== undefined ? ease(f, emptyAt + i * 3, emptyAt + i * 3 + 10) : 0;
          return (
            <div key={i} style={{position: 'absolute', left: w * 0.14 + (i % 2) * w * 0.06, top: h * (0.72 - i * 0.12) - fly * (h * 0.9 + i * 40), width: w * 0.72, height: w * 0.3, transform: `rotate(${[-8, 6, -3, 9, -5][i] + fly * 40}deg)`, opacity: 1 - fly * 0.9, boxShadow: `2px 4px 5px ${C.shadow}`}}>
              <Img src={staticFile('img/proc/note500.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </div>
          );
        })}
        <svg width={w} height={h} viewBox="0 0 100 130" preserveAspectRatio="none" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <path d="M18,22 L18,14 L82,14 L82,22 C94,30 96,40 96,52 L96,116 C96,124 90,128 82,128 L18,128 C10,128 4,124 4,116 L4,52 C4,40 6,30 18,22 Z" fill="rgba(200,225,230,0.22)" stroke={C.ink} strokeWidth={1.6} />
          <path d="M12,48 L12,110" stroke="rgba(255,255,255,0.7)" strokeWidth={3} strokeLinecap="round" />
          <rect x={14} y={4} width={72} height={12} rx={2} fill={C.kraft} stroke={C.ink} strokeWidth={1.4} />
        </svg>
        {label ? <div style={{position: 'absolute', left: -60, right: -60, top: h + 18, textAlign: 'center', fontFamily: F.display, fontSize: 56, lineHeight: 1}}>{label}</div> : null}
      </div>
      {lockAt !== undefined && f < (out ?? 1e9) ? <Padlock x={x + w / 2} y={y + 10} at={lockAt} size={140} openAt={openAt} /> : null}
    </>
  );
};

// ---------------------------------------------------------------- scenes

const Bid: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l71 = at('L071');
  const days = ['21', '22', '23'];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 130, top: 150}}>
        <Big words={['Bada', 'din']} at={word('L070', 'bada', -4)} size={230} />
      </div>
      <Footage id="bd-floor" src="floor_slips" x={130} y={470} w={720} h={480} rot={-2} at={word('L070', 'issue', -6)} enter="up" torn={{top: true, right: true}} rough={14} caption="BOLI SHURU" />
      {days.map((d, i) => {
        const dated = frame >= word('L071', '21', -4) + (i === 1 ? 4 : i === 2 ? 8 : 0);
        return (
          <Card key={d} id={'bd-d' + i} x={960 + i * 285} y={190} w={265} h={370} rot={[-2, 1.5, -1][i]} at={word('L070', 'teen', -6) + i * 5} enter="drop" bg={i === 2 && dated ? C.yellow : C.paperLight}>
            <div style={{background: C.red, color: C.paperLight, fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 4, textAlign: 'center', padding: '10px 0'}}>{dated ? 'OCT' : 'DIN'}</div>
            <div style={{fontFamily: F.display, fontSize: 170, textAlign: 'center', lineHeight: 1.25}}>{dated ? d : i + 1}</div>
          </Card>
        );
      })}
      <Stamp id="bd-3" text="Kam se kam 3 working din" x={1380} y={660} at={word('L070', 'working', -2)} size={64} rot={-4} paper />
      <Card id="bd-jio" x={1050} y={760} w={640} h={200} rot={1.5} at={l71 - 2} enter="up" bg={C.yellow}>
        <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 34px', gap: 24}}>
          <Label size={22}>Jio IPO</Label>
          <div style={{fontFamily: F.display, fontSize: 92, whiteSpace: 'nowrap'}}>21 → 23 OCT</div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

const Then: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l73 = at('L073'), l74 = at('L074');
  const months = ['NOV', 'DEC', 'JAN'];
  const mFrom = word('L074', 'listing', -4);
  const mi = Math.min(2, Math.max(0, Math.floor((stepped(frame) - mFrom) / 14)));
  return (
    <AbsoluteFill>
      {/* dadaji's bank */}
      <Footage id="th-bank" src="bank_teller" x={110} y={130} w={1000} h={640} rot={-1.5} at={0} out={l73} enter="left" torn={{top: true, bottom: true}} rough={14} caption="ARCHIVE FILM · BANK" />
      <Card id="th-lbl" x={170} y={800} w={760} h={160} rot={1} at={word('L072', 'dadaji', -4)} out={l73} enter="up" bg={C.kraft} texture="kraft">
        <div style={{fontFamily: F.display, fontSize: 92, lineHeight: '160px', textAlign: 'center'}}>DADAJI KA ZAMANA</div>
      </Card>
      <Card id="th-form" x={1180} y={150} w={360} h={470} rot={-4} at={word('L072', 'form', -6)} out={l73} enter="drop" bg={C.paperLight}>
        <div style={{padding: '26px 28px', fontFamily: F.type, fontSize: 28, lineHeight: 1.7}}>
          <Label size={18}>Share application</Label>
          <div style={{marginTop: 14}}>Naam ______<br />Pata ______<br />Shares ____<br />Sign ______</div>
        </div>
      </Card>
      <Card id="th-chq" x={1300} y={560} w={500} h={240} rot={5} at={word('L072', 'cheque', -6)} out={l73} enter="right" bg={C.card}>
        <div style={{padding: '22px 28px', fontFamily: F.type, fontSize: 26, lineHeight: 1.6}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: 3}}>CHEQUE</div>
          Pay ________ ₹ ______<br /><span style={{fontFamily: F.hand, fontSize: 40}}>Dadaji</span>
        </div>
      </Card>

      {/* certificate by post, or a refund cheque weeks later */}
      <Hold from={l73} to={l74}>
        <Photo id="th-cert" src="certificate1909.jpg" x={130} y={140} w={620} h={650} rot={-2.5} at={word('L073', 'kaagaz', -8)} enter="up" torn={{bottom: true}} rough={12} zoom={0.03} pos="50% 30%" />
        <Card id="th-env" x={770} y={170} w={440} h={290} rot={4} at={word('L073', 'ghar', -6)} enter="drop" bg={C.card}>
          <svg width={440} height={290} style={{position: 'absolute', inset: 0}}><path d="M0,0 L220,150 L440,0" fill="none" stroke={C.ink} strokeWidth={4} /></svg>
          <div style={{position: 'absolute', right: 26, top: 22, width: 70, height: 84, border: `3px dashed ${C.red}`}} />
          <div style={{position: 'absolute', left: 30, bottom: 26, fontFamily: F.type, fontSize: 30}}>Daak se, ghar pe</div>
        </Card>
        <div style={{position: 'absolute', left: 150, top: 820, transform: 'rotate(-2deg)'}}><Label size={30}>Kaagaz ka certificate</Label></div>
        <Footage id="th-cw" src="cheque_write" x={820} y={520} w={520} h={420} rot={-2} at={word('L073', 'na', -6)} enter="up" torn={{right: true}} rough={12} projector={false} />
        <Card id="th-refund" x={1270} y={430} w={520} h={300} rot={3} at={word('L073', 'refund', -6)} enter="right" bg={C.paperLight}>
          <div style={{padding: '26px 30px'}}>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 3}}>REFUND CHEQUE</div>
            <div style={{fontFamily: F.type, fontSize: 30, marginTop: 14, lineHeight: 1.6}}>Shares nahi mile.<br />Aapka paisa wapas →</div>
          </div>
        </Card>
        <Stamp id="th-weeks" text="Hafton baad" x={1530} y={800} at={word('L073', 'hafton', -2)} size={88} rot={-7} />
      </Hold>

      {/* Reliance 1977: about two months to list */}
      <Hold from={l74}>
        <Card id="th-cal" x={150} y={170} w={680} h={600} rot={-2} at={l74 - 2} enter="left" bg={C.paperLight}>
          <div style={{background: C.ink, color: C.paperLight, fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 5, textAlign: 'center', padding: '14px 0'}}>RELIANCE · 1977</div>
          <div style={{fontFamily: F.display, fontSize: 250, textAlign: 'center', lineHeight: 1.6}}>{frame >= mFrom ? months[mi] : 'NOV'}</div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 30, textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3}}>{frame >= mFrom + 28 ? 'LISTING' : 'IPO BAND'}</div>
        </Card>
        {[0, 1, 2].map((i) => <Sfx key={i} at={mFrom + i * 14} name="page" volume={0.4} />)}
        <Photo id="th-bse" src="bse.jpg" x={950} y={150} w={820} h={560} rot={2} at={word('L074', 'listing', -6)} enter="right" torn={{top: true, left: true}} rough={12} pos="50% 40%" caption="BOMBAY STOCK EXCHANGE" />
        <Stamp id="th-2m" text="Listing: ~2 mahine" x={1290} y={830} at={word('L074', 'mahine', -4)} size={96} rot={-5} paper />
      </Hold>
    </AbsoluteFill>
  );
};

const Now: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l76 = at('L076'), l77 = at('L077'), l78 = at('L078');
  const steps = [word('L075', 'broker', -4), word('L075', 'bid', -4), word('L075', 'upi', -4), word('L075', 'approve', 4)];
  const katAt = word('L076', 'paisa', -4);
  return (
    <AbsoluteFill>
      {/* split screen: then | now */}
      <Hold to={l76}>
        <div style={{position: 'absolute', left: 955, top: 120, width: 6, height: 860, background: C.ink, transform: 'rotate(1deg)'}} />
        <div style={{position: 'absolute', left: 140, top: 130, transform: 'rotate(-1.5deg)'}}><Label size={28}>Tab</Label></div>
        <div style={{position: 'absolute', left: 1010, top: 130, transform: 'rotate(1.5deg)'}}><Label size={28} dark={false}>Aaj</Label></div>
      </Hold>
      <Footage id="nw-then" src="bank_teller" x={140} y={200} w={760} h={480} rot={-1.5} at={0} out={l76} enter="none" torn={{bottom: true}} rough={12} projector={false} />
      <Stamp id="nw-2m" text="~2 mahine" x={520} y={800} at={2} out={l76} size={84} rot={-6} paper />
      <Photo id="nw-phone" src="phone.jpg" x={1000} y={170} w={1400 * PS} h={1051 * PS} rot={-2} at={word('L075', 'aaj', -2)} out={l76} enter="right" torn={{right: true, bottom: true}} rough={14} zoom={0.02} overlay={<AppScreen steps={steps} />} />
      {steps.map((s, i) => <Sfx key={i} at={s} name={i === 3 ? 'ping' : 'tick'} volume={0.4} />)}
      <Card id="nw-3d" x={1060} y={840} w={700} h={130} rot={1} at={word('L075', 'approve', 4)} out={l76} enter="up" bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 70, lineHeight: '130px', textAlign: 'center'}}>FORM NAHI · PHONE SE</div>
      </Card>

      {/* paisa kat-ta nahi, sirf block */}
      <Hand x={140} y={180} at={word('L076', 'ek', -4)} out={katAt} size={76} rot={-2} w={900}>ek baat jo bahut log nahi jaante…</Hand>
      <Hold from={katAt} to={l78}>
        <div style={{position: 'absolute', left: 130, top: 150, width: 900}}>
          <Big words={['Paisa', 'kat-ta', 'nahi']} at={katAt} size={170} />
        </div>
      </Hold>
      <Card id="nw-block" x={150} y={540} w={720} h={250} rot={-2} at={word('L076', 'block', -6)} out={word('L077', 'rehta', -4)} enter="up" bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 150, lineHeight: '250px', textAlign: 'center'}}>SIRF BLOCK</div>
      </Card>
      <Jar x={1180} y={170} w={460} h={600} at={katAt + 4} out={l78} lockAt={word('L076', 'block', -2)} />
      <Card id="nw-acct" x={1080} y={830} w={660} h={130} rot={1} at={word('L077', 'account', -6)} out={l78} enter="up" bg={C.paperLight}>
        <div style={{fontFamily: F.display, fontSize: 64, lineHeight: '130px', textAlign: 'center'}}>AAPKE ACCOUNT MEIN HI</div>
      </Card>
      <Term at={word('L077', 'asba', -4)} out={l78} text="ASBA" sub="application supported by blocked amount" x={150} y={840} />
      <Hand x={160} y={560} at={word('L077', 'bas', -4)} out={l78} size={70} rot={-3} w={820} color={C.red}>bas kharch nahi kar sakte</Hand>

      {/* two outcomes */}
      <Hold from={l78}>
        <div style={{position: 'absolute', left: 300, top: 130}}><Label size={30}>Shares mile ✓</Label></div>
        <div style={{position: 'absolute', left: 1170, top: 130}}><Label size={30} dark={false}>Na mile ✗</Label></div>
        <div style={{position: 'absolute', left: 955, top: 140, width: 6, height: 820, background: C.ink, transform: 'rotate(-1deg)'}} />
      </Hold>
      <Jar x={240} y={250} w={360} h={470} at={l78 - 2} emptyAt={word('L078', 'kat-ta', -6)} label="PAISA KATA" />
      <Card id="nw-co" x={640} y={260} w={260} h={190} rot={3} at={word('L078', 'paisa', -6)} enter="drop" bg={C.yellow}>
        <div style={{padding: '22px 20px', textAlign: 'center'}}><div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 18, letterSpacing: 2}}>BADLE MEIN</div><div style={{fontFamily: F.display, fontSize: 60, lineHeight: 1.1}}>SHARES</div></div>
      </Card>
      <Arrow id="nw-ar" x1={560} y1={300} x2={640} y2={340} at={word('L078', 'kat-ta', 0)} bow={-20} dur={5} />
      <Jar x={1180} y={250} w={360} h={470} at={l78 + 4} lockAt={l78 + 4} openAt={word('L078', 'khul', -4)} label="BLOCK KHULA" />
      <Hand x={1560} y={460} at={word('L078', 'khul', 0)} size={60} rot={-5} w={260}>paisa free!</Hand>
    </AbsoluteFill>
  );
};

const Subs: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l80 = at('L080'), l81 = at('L081'), l82 = at('L082'), l83 = at('L083'), l84 = at('L084');
  const live = Math.floor(frame / 10) % 2 === 0;
  // subscription bars: 1x = PX pixels
  const PX = 22, BASE = 900;
  const grow = (a: number, v: number) => v * PX * ease(stepped(frame), a, a + 16);
  const bars = [
    {k: 'OVERALL', v: 22, t: '~22x', a: word('L081', '22', -4), x: 340, c: C.paperLight},
    {k: 'QIB', v: 70, t: '70x+', a: word('L081', '70', -4), x: 840, c: C.yellow},
    {k: 'RETAIL', v: 2.7, t: '~2.7x', a: word('L081', '2.7', -4), x: 1340, c: C.card},
  ];
  const bidStack = Math.round(ease(stepped(frame), word('L080', 'jitne', 0), word('L080', 'boli', 0)) * 14);
  return (
    <AbsoluteFill>
      {/* live on the exchange */}
      <Photo id="sb-nse" src="nse.jpg" x={110} y={140} w={880} h={600} rot={-2} at={0} out={word('L080', 'jitne', -6)} enter="left" torn={{top: true, bottom: true}} rough={14} caption="NSE · EXCHANGE" />
      <Card id="sb-live" x={1040} y={150} w={760} h={640} rot={1.5} at={word('L079', 'exchange', -6)} out={l81} enter="right" bg="#22201c" texture="kraft">
        <div style={{padding: '30px 40px', color: C.paperLight}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 4}}>SUBSCRIPTION STATUS</div>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, color: live && frame >= word('L079', 'live', -4) ? '#ff6a4d' : 'rgba(255,255,255,0.25)'}}>● LIVE</div>
          </div>
          {['QIB', 'NII', 'RETAIL'].map((r, i) => (
            <div key={r} style={{display: 'flex', justifyContent: 'space-between', marginTop: 44, paddingBottom: 18, borderBottom: '2px dashed rgba(255,255,255,0.3)', opacity: frame >= word('L079', 'category', -4) + i * 4 ? 1 : 0.15}}>
              <span style={{fontFamily: F.display, fontSize: 84}}>{r}</span>
              <span style={{fontFamily: F.display, fontSize: 84, color: C.yellow}}>{['▮▮▮▮▯', '▮▮▯▯▯', '▮▯▯▯▯'][i].slice(0, 1 + (Math.floor(frame / 6) + i) % 5)}</span>
            </div>
          ))}
        </div>
      </Card>
      <Term at={word('L080', 'subscription', -4)} out={l81} text="Subscription" sub="kitne guna boli lagi" x={1080} y={850} />
      {/* shares vs bids */}
      <Hold from={word('L080', 'jitne', -6)} to={l81}>
        <div style={{position: 'absolute', left: 170, top: 820, display: 'flex', gap: 140, fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3}}>
          <span>SHARES THE</span><span style={{marginLeft: 70}}>BOLI LAGI</span>
        </div>
        {Array.from({length: 3}).map((_, i) => <Slip key={i} id={'sb-sh' + i} x={270} y={760 - i * 46} at={word('L080', 'jitne', -4) + i * 2} text="SHARES" w={200} h={60} size={20} rot={i % 2 ? 2 : -2} />)}
        {Array.from({length: bidStack}).map((_, i) => <Slip key={i} id={'sb-bd' + i} x={660 + (i % 2) * 6} y={760 - i * 46} at={0} text="BOLI" w={200} h={60} size={20} color={C.yellow} rot={i % 2 ? 3 : -3} />)}
        <Hand x={760} y={200} at={word('L080', 'guna', -4)} size={72} rot={-4} w={300}>kitne guna?</Hand>
      </Hold>

      {/* Jio's numbers as cut-paper strips */}
      <Hold from={l81} to={l82}>
        <Card id="sb-chart" x={170} y={250} w={1580} h={730} rot={-0.6} at={l81 - 2} enter="up" bg={C.paperLight}>
          <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(70,110,150,0.16) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(70,110,150,0.16) 1.5px, transparent 1.5px)', backgroundSize: '40px 40px'}} />
          <div style={{position: 'absolute', right: 36, top: 26}}><Label size={22}>Jio IPO · final subscription (NSE)</Label></div>
          <div style={{position: 'absolute', left: 30, right: 30, top: BASE - 250, borderTop: `4px solid ${C.ink}`}} />
        </Card>
        {bars.map((b) => {
          const h = grow(b.a, b.v);
          const top = BASE - h;
          return (
            <React.Fragment key={b.k}>
              <Sfx at={b.a} name={b.k === 'QIB' ? 'riser' : 'whoosh'} volume={0.4} />
              <div style={{position: 'absolute', left: b.x, top, width: 240, height: h, zIndex: 40, filter: `drop-shadow(5px 8px 8px ${C.shadow})`}}>
                <div style={{position: 'absolute', inset: 0, background: b.c, border: `4px solid ${C.ink}`, clipPath: b.k === 'QIB' ? tornPolygon('qibtop', 240, Math.max(1, h), {top: true}, 18) : undefined}} />
              </div>
              {frame >= b.a + 6 ? (
                <div style={{position: 'absolute', left: b.x - 40, width: 320, top: b.k === 'QIB' ? 150 : top - 120, textAlign: 'center', zIndex: 45}}>
                  <div style={{display: 'inline-block', background: b.k === 'QIB' ? C.ink : 'transparent', color: b.k === 'QIB' ? C.yellow : C.ink, fontFamily: F.display, fontSize: 104, padding: '0 18px', lineHeight: 1.1}}>{b.t}{b.k === 'QIB' ? ' ↑' : ''}</div>
                </div>
              ) : null}
              <div style={{position: 'absolute', left: b.x - 40, width: 320, top: BASE + 8, textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 3, zIndex: 45}}>{b.k}</div>
            </React.Fragment>
          );
        })}
      </Hold>

      {/* the queue */}
      <Footage id="sb-crowd" src="train_crowd" x={110} y={150} w={1050} h={660} rot={-1.5} at={l82 - 2} out={l83} enter="left" torn={{top: true, right: true}} rough={14} caption="BADE INVESTORS KI LINE" />
      <Hold from={l82} to={l83}>
        <div style={{position: 'absolute', left: 1260, top: 200, transform: 'rotate(1.5deg)'}}><Label size={28} dark={false}>Aapki line</Label></div>
        {[0, 1, 2].map((i) => <Person key={i} id={'sb-q' + i} x={1330 + i * 170} y={720} s={1.3} at={word('L082', 'aapki', -4) + i * 3} tone={i === 0 ? C.yellow : C.card} sfx={i ? null : undefined} />)}
        <Hand x={1240} y={800} at={word('L082', 'kahin', -4)} size={74} rot={-3} w={560} color={C.red}>woh kahin lambi!</Hand>
      </Hold>

      {/* grey market */}
      <Card id="sb-alley" x={110} y={130} w={1700} h={840} rot={-0.5} at={l83 - 2} enter="up" bg="#2b2925" texture="kraft">
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 50% 60% at 50% 30%, rgba(255,240,200,0.16), rgba(0,0,0,0) 70%)'}} />
        <div style={{position: 'absolute', left: 420, right: 640, top: 70, textAlign: 'center', fontFamily: F.marker, fontSize: 150, color: 'rgba(240,235,220,0.9)', transform: 'rotate(-3deg)', opacity: frame >= word('L083', 'gmp', -4) ? 1 : 0}}>GMP</div>
        <div style={{position: 'absolute', left: 60, top: 60, fontFamily: F.marker, fontSize: 64, color: 'rgba(240,235,220,0.85)', transform: 'rotate(-4deg)', opacity: frame >= word('L083', 'grey', -4) ? 1 : 0}}>GREY MARKET</div>
      </Card>
      <Hold from={l83}>
        {[0, 1].map((i) => <Person key={i} id={'sb-gm' + i} x={[620, 1300][i]} y={860} s={2.1} at={word('L083', 'bazaar', -4) + i * 6} tone={'#4a4741'} rot={i ? -4 : 4} />)}
        <Card id="sb-phone" x={800} y={420} w={320} h={180} rot={-4} at={word('L083', 'chalta', -4)} enter="drop" bg={C.paperLight}>
          <div style={{padding: '22px 26px', fontFamily: F.hand, fontWeight: 700, fontSize: 46, lineHeight: 1.1}}>“kitne mein dega?”</div>
        </Card>
        <Stamp id="sb-noniyam" text="Bina kisi niyam" x={1480} y={300} at={word('L083', 'niyam', -6)} size={72} rot={6} paper />
      </Hold>
      <Stamp id="sb-unoff" text="Unofficial" x={960} y={720} at={word('L084', 'unofficial', -4)} size={120} rot={-7} paper />
      <Card id="sb-next" x={1360} y={640} w={400} h={260} rot={4} at={word('L084', 'poori', -6)} enter="right" bg={C.yellow}>
        <div style={{padding: '22px 28px'}}>
          <Label size={18}>Money Theory · video</Label>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 18}}>
            <svg width={60} height={60} viewBox="0 0 60 60"><circle cx={30} cy={30} r={28} fill={C.ink} /><path d="M24,18 L44,30 L24,42 Z" fill={C.yellow} /></svg>
            <div style={{fontFamily: F.display, fontSize: 58, lineHeight: 1}}>GMP KA SACH</div>
          </div>
        </div>
      </Card>
      <Hand x={1300} y={570} at={word('L084', 'alag', -4)} size={58} rot={-3} w={520} color={C.paperLight}>poori video alag se ↓</Hand>
    </AbsoluteFill>
  );
};

export const c4: Record<string, React.FC> = {bid: Bid, then: Then, now: Now, subs: Subs};
