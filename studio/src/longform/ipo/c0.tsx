import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Hold} from '../../components/kit';
import {Big, Card, Count, Cross, Hand, HL, Label, Photo, Stamp, Tape} from '../../components/paper';
import {ease, pop, stepped} from '../../lib/motion';
import {useCues} from '../../lib/timeline';
import {C, F} from '../../theme';
import {Arrow, Footage, Slip, Typed} from '../kit16';
import {Road, STOPS} from './road';

// Phone photo (1400x1051): screen centred at (656, 543), 262x436, tilted 17.9°.
const PS = 0.72;
const UpiScreen: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const ok = frame >= at + 26;
  return (
    <div style={{position: 'absolute', left: 656 * PS - (262 * PS) / 2, top: 543 * PS - (436 * PS) / 2, width: 262 * PS, height: 436 * PS, transform: 'rotate(17.9deg)', background: C.paperLight, borderRadius: 10, fontFamily: F.mono, textAlign: 'center', paddingTop: 18, opacity: frame >= at ? 1 : 0}}>
      <div style={{fontSize: 11, fontWeight: 700, letterSpacing: 2}}>UPI MANDATE</div>
      <div style={{fontFamily: F.display, fontSize: 24, marginTop: 10}}>IPO BID</div>
      <div style={{fontSize: 11, marginTop: 4}}>JIO PLATFORMS LTD</div>
      <div style={{margin: '12px 14px', border: `2px solid ${C.ink}`, fontSize: 14, fontWeight: 700, padding: '6px 0'}}>₹13,428</div>
      <div style={{margin: '0 22px', background: ok ? C.yellow : C.ink, color: ok ? C.ink : C.paperLight, fontSize: 12, fontWeight: 700, padding: '7px 0', letterSpacing: 2}}>{ok ? '✓ APPROVED' : 'APPROVE'}</div>
    </div>
  );
};

const Open: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l2 = at('L002'), l3 = at('L003'), l4 = at('L004'), l5 = at('L005'), l6 = at('L006'), l7 = at('L007'), l8 = at('L008'), l9 = at('L009'), l10 = at('L010');
  const formsFrom = word('L003', '58,000', 0);
  const yr = Math.round(ease(stepped(frame), l5 + 4, l5 + 26, 1977, 2026));
  return (
    <AbsoluteFill>
      {/* 1977: press footage + typed dateline + certificate */}
      <Footage id="o-press" src="press_big" x={110} y={120} w={1010} h={620} rot={-2} at={6} out={l3} enter="left" torn={{top: true, bottom: true}} rough={14} caption="ARCHIVE FILM" />
      <Card id="o-date" x={1160} y={130} w={650} h={300} rot={1.5} at={word('L001', '15', -4)} out={l3} enter="right" bg={C.paperLight}>
        <div style={{padding: '40px 44px'}}>
          <Label size={22}>Dateline</Label>
          <div style={{marginTop: 22, fontSize: 70, lineHeight: 1.05}}><Typed text={'15 NOV 1977\nBOMBAY'} at={word('L001', '15', 0)} cps={9} style={{fontSize: 70}} /></div>
        </div>
      </Card>
      <Card id="o-kapda" x={1220} y={500} w={560} h={250} rot={-2.5} at={word('L001', 'kapde', -6)} out={l2 - 2} enter="up" bg={C.paperLight}>
        <div style={{display: 'flex', alignItems: 'center', gap: 28, height: '100%', padding: '0 30px'}}>
          <div style={{width: 170, height: 170, border: `4px solid ${C.ink}`, background: `repeating-linear-gradient(0deg, ${C.ink} 0 3px, transparent 3px 11px), repeating-linear-gradient(90deg, rgba(20,20,20,0.55) 0 3px, ${C.yellow} 3px 11px)`}} />
          <div>
            <Label size={18}>Ek kapde ki</Label>
            <div style={{fontFamily: F.display, fontSize: 72, lineHeight: 1, marginTop: 10}}>COMPANY</div>
          </div>
        </div>
      </Card>
      <Stamp id="o-public" text="Public issue" paper x={880} y={680} at={word('L001', 'public', -2)} out={l3} size={64} rot={-7} />
      <Photo id="o-cert" src="certificate1909.jpg" x={1210} y={470} w={580} h={490} rot={3} at={l2 - 2} out={l3} enter="up" torn={{bottom: true}} rough={12} zoom={0.03} caption="PURANA SHARE CERTIFICATE" />
      <Stamp id="o-10" text="₹10" sub="EK SHARE" x={1640} y={800} at={word('L002', '₹10', -2)} out={l3} size={120} rot={-9} paper />
      <Card id="o-issue" x={200} y={790} w={760} h={200} rot={-1} at={word('L002', 'poora', -2)} out={l3} enter="up" bg={C.yellow}>
        <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 40px', gap: 30}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, width: 180, lineHeight: 1.3}}>POORA ISSUE</div>
          <div style={{fontFamily: F.display, fontSize: 120}}>₹2.82 CR</div>
        </div>
      </Card>

      {/* 58,000 applications, 7x */}
      <Hold from={l3} to={l4 + 6}>
        <div style={{position: 'absolute', left: 130, top: 230, width: 820}}>
          <Label size={24}>Applications · 1977</Label>
          <div style={{fontFamily: F.display, fontSize: 280, lineHeight: 1, marginTop: 20}}><Count from={0} to={58000} at={formsFrom} dur={30} fmt={(n) => Math.round(n).toLocaleString('en-IN')} /></div>
          <div style={{fontFamily: F.display, fontSize: 84, lineHeight: 1}}>LOG NE FORM BHARE</div>
        </div>
      </Hold>
      {Array.from({length: 36}).map((_, i) => (
        <Slip key={i} id={'o-form' + i} x={1000 + (i % 6) * 140} y={190 + Math.floor(i / 6) * 118} at={formsFrom + 4 + i} out={l4} text="FORM" w={122} h={88} size={19} />
      ))}
      <Stamp id="o-7x" text="7× bhara" sub="OVERSUBSCRIBED" x={1420} y={930} at={word('L003', 'saat', -2)} out={l4} size={96} rot={-6} />

      {/* the name */}
      <Hold from={l4} to={l5}>
        <Footage id="o-floor" src="floor_slips" x={420} y={470} w={1080} h={520} rot={1.5} at={l4 - 2} out={l5} enter="up" torn={{bottom: true, left: true}} rough={14} caption="ARCHIVE FILM" />
        <Card id="o-rel" x={360} y={150} w={1200} h={330} rot={-2} at={l4} out={l5} enter="drop" bg={C.yellow} torn={{left: true, right: true}} rough={14} z={50}>
          <div style={{fontFamily: F.display, fontSize: 230, textAlign: 'center', lineHeight: '330px', letterSpacing: 6, opacity: frame >= word('L004', 'reliance', -2) ? 1 : 0}}>RELIANCE</div>
        </Card>
        <div style={{position: 'absolute', left: 0, right: 0, top: 500, textAlign: 'center', zIndex: 55, transform: 'rotate(-1deg)'}}><Label size={30}>1977 · pehla public issue</Label></div>
      </Hold>

      {/* 49 years later */}
      <Hold from={l5} to={l7}>
        <Card id="o-cal" x={1220} y={120} w={580} h={340} rot={2} at={l5} out={l7} enter="drop" bg={C.paperLight}>
          <div style={{padding: '26px 34px'}}>
            <Label size={20}>{frame >= word('L005', 'october', -2) ? 'October' : 'Saal'}</Label>
            <div style={{fontFamily: F.display, fontSize: 210, lineHeight: 1, marginTop: 12, color: yr === 2026 ? C.ink : C.inkSoft}}>{yr}</div>
          </div>
        </Card>
        <Hand x={1260} y={480} at={word('L005', 'saal', -2)} out={l7} size={66} rot={-3}>49 saal baad…</Hand>
        <Photo id="o-jio" src="jiosim.jpg" x={110} y={130} w={1040} h={680} rot={-2} at={word('L005', 'company', -6)} out={l6 + 110} enter="up" torn={{top: true, right: true}} rough={14} pos="40% 50%" caption="JIO PLATFORMS · 2026" />
        <Card id="o-30k" x={1090} y={610} w={720} h={330} rot={-1.5} at={l6} out={l7} enter="right" bg={C.yellow}>
          <div style={{padding: '30px 40px'}}>
            <Label size={22}>Issue size</Label>
            <div style={{fontFamily: F.display, fontSize: 150, lineHeight: 1.1, marginTop: 10, whiteSpace: 'nowrap'}}><Count from={0} to={30213} at={word('L006', '₹30,213', -4)} dur={36} fmt={(n) => '₹' + Math.round(n).toLocaleString('en-IN')} /> CR</div>
          </div>
        </Card>
        <Photo id="o-phone" src="phone.jpg" x={100} y={140} w={1400 * PS} h={1051 * PS} rot={-3} at={word('L006', 'phone', -10)} out={l7} enter="up" torn={{right: true, bottom: true}} rough={14} zoom={0.02} overlay={<UpiScreen at={word('L006', 'upi', -4)} />} />
        <Card id="o-form" x={760} y={600} w={280} h={360} rot={6} z={30} at={word('L006', 'form', -6)} out={l7} enter="drop" bg={C.paperLight}>
          <div style={{padding: 20, fontFamily: F.type, fontSize: 24, lineHeight: 1.6}}>APPLICATION<br />FORM<br />______<br />______<br />______</div>
        </Card>
        <Cross id="o-xform" x={775} y={625} w={250} h={310} at={word('L006', 'nahi', -2)} out={l7} />
      </Hold>

      {/* then vs now, same road */}
      <Hold from={l7} to={l8}>
        {[
          {id: 'o-then', x: 130, rot: -2, yr: '1977', rows: [['SHARE', '₹10'], ['ISSUE', '₹2.82 CR'], ['TARIKA', 'FORM + CHEQUE']]},
          {id: 'o-now', x: 1010, rot: 2, yr: '2026', rows: [['SHARE', '₹1,119'], ['ISSUE', '₹30,213 CR'], ['TARIKA', 'APP + UPI']]},
        ].map((c, k) => (
          <Card key={c.id} id={c.id} x={c.x} y={130} w={780} h={470} rot={c.rot} at={l7 + k * 4} out={l8} enter={k ? 'right' : 'left'} bg={k ? C.paperLight : C.card}>
            <div style={{padding: '30px 40px'}}>
              <div style={{fontFamily: F.display, fontSize: 110, lineHeight: 1}}>{c.yr}</div>
              {c.rows.map(([a, b], j) => {
                const hiAt = j < 2 ? word('L007', 'paisa', -2) : word('L007', 'technology', -2);
                return (
                  <div key={a} style={{display: 'flex', justifyContent: 'space-between', marginTop: 18, fontFamily: F.mono, fontWeight: 700, fontSize: 30}}>
                    <span style={{color: C.inkSoft}}>{a}</span>
                    <span style={{fontFamily: F.display, fontWeight: 400, fontSize: 52}}><HL at={hiAt}>{b}</HL></span>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
        <Card id="o-same" x={120} y={700} w={1690} h={160} rot={-0.6} at={word('L007', 'raasta', -4)} out={l8} enter="left" bg={C.kraft} texture="kraft" torn={{top: true, bottom: true}}>
          <div style={{position: 'absolute', left: 30, right: 30, top: 70, borderTop: `8px dashed ${C.paperLight}`}} />
        </Card>
        <Stamp id="o-same-st" text="Raasta wahi" x={960} y={780} at={word('L007', 'wahi', -2)} out={l8} size={84} rot={-4} paper />
      </Hold>

      {/* every IPO, big or small */}
      <Hold from={l8} to={l9}>
        <Card id="o-road2" x={110} y={760} w={1700} h={140} rot={-0.6} at={l8} out={l9} enter="none" bg={C.kraft} texture="kraft" torn={{top: true, bottom: true}} sfx={null}>
          <div style={{position: 'absolute', left: 30, right: 30, top: 60, borderTop: `8px dashed ${C.paperLight}`}} />
        </Card>
        <Card id="o-big" x={190} y={150} w={560} h={580} rot={-1.5} at={word('L008', 'jio', -4)} out={l9} enter="drop" bg={C.paperLight}>
          <div style={{padding: 28}}>
            <Label size={20}>Badi company</Label>
            <div style={{display: 'flex', alignItems: 'flex-end', gap: 10, height: 330, marginTop: 20}}>
              {[250, 330, 210, 290].map((h, i) => <div key={i} style={{flex: 1, height: h, background: i === 1 ? C.yellow : C.card, border: `4px solid ${C.ink}`}} />)}
            </div>
            <div style={{fontFamily: F.display, fontSize: 80, marginTop: 12}}>JIO</div>
          </div>
        </Card>
        <Card id="o-small" x={850} y={400} w={380} h={330} rot={2} at={word('L008', 'chhoti', -6)} out={l9} enter="drop" bg={C.card}>
          <div style={{padding: 22}}>
            <Label size={16}>Aapke shehar ki</Label>
            <div style={{width: 220, height: 130, margin: '34px auto 0', border: `4px solid ${C.ink}`, background: C.paperLight, position: 'relative'}}>
              <div style={{position: 'absolute', left: -14, right: -14, top: -30, height: 30, background: C.red, clipPath: 'polygon(0 100%, 50% 0, 100% 100%)'}} />
            </div>
            <div style={{fontFamily: F.display, fontSize: 40, textAlign: 'center', marginTop: 10}}>CHHOTI CO.</div>
          </div>
        </Card>
        <Arrow id="o-ar" x1={1280} y1={830} x2={1770} y2={830} at={word('L008', 'safar', -6)} out={l9} bow={-30} width={9} dur={10} />
        <Hand x={1320} y={640} at={word('L008', 'safar', -2)} out={l9} size={76} rot={-2}>isi safar se…</Hand>
      </Hold>

      {/* the whole journey, idea → bell */}
      <Road at={l9 - 2} stopsAt={STOPS.map((_, i) => word('L009', 'idea', -4) + i * 9)} y={610}
        questions={[{i: 2, at: word('L010', 'sawaal', -2)}, {i: 4, at: word('L010', 'sawaal', 4)}, {i: 6, at: word('L010', 'sawaal', 10)}]} />
      <Hold from={l9}>
        <div style={{position: 'absolute', left: 120, top: 130}}>
          <Big words={['Idea', 'se', 'ghanti', 'tak']} at={l9 + 2} size={170} />
        </div>
        <Tape id="o-tape" x={1450} y={170} w={190} rot={6} at={l9 + 6} />
        <Hand x={1160} y={820} at={word('L010', 'sawaal', 2)} size={80} rot={-2} color={C.red}>apply karne se pehle!</Hand>
      </Hold>
    </AbsoluteFill>
  );
};

export const c0: Record<string, React.FC> = {open: Open};
