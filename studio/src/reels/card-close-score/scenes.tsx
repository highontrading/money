import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Big, Card, Circle, Count, Cross, Hand, HL, Label, Sfx, Stamp, Tape} from '../../components/paper';
import {ease, stepped} from '../../lib/motion';
import {useCues} from '../../lib/timeline';
import {C, F} from '../../theme';
import {SignOff} from '../common';
import {Appear, CreditCard, CutCard, Dial, grid, hatch, Meter, Scissors, Show, Tick} from './props';

const pct = (n: number) => Math.round(n) + '%';

// ---------------------------------------------------------------- hook
const Hook: React.FC = () => {
  const {at, word} = useCues();
  const l3 = at('L03');
  const cutAt = word('L02', 'band', -2);
  const split = cutAt + 16;
  return (
    <AbsoluteFill>
      {/* L01: two cards, one old and unused */}
      <CreditCard id="newc" x={110} y={520} w={420} h={262} rot={-4} at={word('L01', 'do', -2)} out={l3} exit="left" />
      <Show until={split}>
        <CreditCard id="oldc" x={560} y={560} w={420} h={262} rot={5} at={word('L01', 'card', -2)} enter="drop" old />
      </Show>
      <Show from={split} until={l3 + 10}>
        <CutCard id="oldc" x={560} y={560} w={420} h={262} rot={5} at={0} split={split} out={l3} exit="down" />
      </Show>
      <Card id="puranatag" x={640} y={450} w={250} h={84} rot={-6} at={word('L01', 'purana', -3)} out={l3} bg={C.paperLight} sfx={null}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 34, letterSpacing: 6, textAlign: 'center', marginTop: 22}}>PURANA</div>
      </Card>
      <Tape id="tpur" x={720} y={436} w={110} rot={8} at={word('L01', 'purana', -1)} out={l3} />
      <Hand x={560} y={880} at={word('L01', 'kabhi', -2)} out={cutAt} size={58} rot={-3}>kabhi use nahi hota…</Hand>

      {/* L02: snip it — the "responsible" thing */}
      <Scissors x={770} y0={520} y1={870} at={cutAt} dur={14} out={split + 4} />
      <Stamp id="resp" text="Responsible ✓" x={540} y={1030} at={word('L02', 'responsible', -2)} out={l3} size={78} rot={-5} color={C.ink} paper />

      {/* L03: the score drops */}
      <Card id="dialc" x={120} y={430} w={840} h={560} rot={-1.2} at={l3 - 2} enter="up" bg={C.card}>
        <div style={{padding: '26px 40px'}}>
          <Label size={24}>CIBIL score</Label>
          <div style={{marginTop: 40, display: 'flex', justifyContent: 'center'}}>
            <Dial w={620} from={0.78} to={0.45} at={word('L03', 'gira', -2)} dur={10} />
          </div>
        </div>
      </Card>
      <Hand x={700} y={560} at={word('L03', 'gira', 2)} size={80} rot={-6} color={C.red}>↓ gira</Hand>
      <Sfx at={word('L03', 'gira', -2)} name="pop" volume={0.3} />

      {/* L04: why? */}
      <div style={{position: 'absolute', left: 120, top: 1030, width: 840}}>
        <Big words={['KYUN', 'GIRTA', 'HAI?']} at={word('L04', 'kyun', -3)} gap={4} size={130} />
      </div>
      <Hand x={130} y={1000} at={at('L04', 2)} size={50} rot={-2}>card band → score ↓ ?</Hand>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- util
const Util: React.FC = () => {
  const {at, word, end} = useCues();
  const l6 = at('L06'), l7 = at('L07');
  const fillAt = word('L08', '₹60,000', -2);
  return (
    <AbsoluteFill>
      {/* L05: the factor */}
      <div style={{position: 'absolute', left: 110, top: 440}}>
        <Show until={l7}><Appear at={0}><Label size={26}>Score ka ek bada hissa</Label></Appear></Show>
      </div>
      <Card id="cu" x={100} y={510} w={880} h={260} rot={-1.5} at={word('L05', 'credit', -3)} out={l7} bg={C.yellow} torn={{right: true, bottom: true}} rough={12}>
        <div style={{fontFamily: F.display, fontSize: 112, lineHeight: 0.95, textAlign: 'center', marginTop: 30}}>CREDIT<br />UTILIZATION</div>
      </Card>
      {/* L06: how much of the limit you use */}
      <Card id="q6" x={150} y={830} w={780} h={300} rot={1} at={l6} out={l7} enter="up" bg={C.card}>
        <div style={{padding: '30px 40px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, marginBottom: 18}}>
            <span>LIMIT</span><span style={{color: C.inkSoft}}>USE ?</span>
          </div>
          <Meter w={700} h={90} fill0={0} fill1={0.42} fillAt={word('L06', 'kitna', -2)} dur={16} />
        </div>
      </Card>
      <Hand x={420} y={1150} at={word('L06', 'use', -2)} out={l7} size={56} rot={-3}>limit ka kitna hissa?</Hand>

      {/* L07: two cards, ₹1 lakh each, ₹2 lakh total */}
      <CreditCard id="u1" x={110} y={440} w={400} h={250} rot={-3} at={l7} limit={<Appear at={word('L07', '₹1', -2)}>₹1 LAKH</Appear>} />
      <CreditCard id="u2" x={570} y={450} w={400} h={250} rot={3} at={l7 + 6} old limit={<Appear at={word('L07', '₹1', 2)}>₹1 LAKH</Appear>} />
      <Card id="meterc" x={90} y={760} w={900} h={300} rot={-0.8} at={word('L07', 'total', -4)} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'relative', padding: '26px 40px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
            <Label size={22}>Total limit</Label>
            <span style={{fontFamily: F.display, fontSize: 64}}><HL at={word('L07', '₹2', 2)}>₹2 LAKH</HL></span>
          </div>
          <div style={{marginTop: 24}}>
            <Meter w={820} h={100} fill0={0} fill1={0.3} fillAt={fillAt} dur={14} />
          </div>
        </div>
      </Card>
      {/* L08: spend */}
      <Card id="spend" x={130} y={1080} w={520} h={120} rot={-2} at={fillAt - 4} bg={C.paperLight} sfx={null}>
        <div style={{fontFamily: F.display, fontSize: 56, textAlign: 'center', marginTop: 24, whiteSpace: 'nowrap'}}>KHARCHA ₹60,000 / MAHINA</div>
      </Card>
      {/* L09: 30% */}
      <Card id="ratio" x={600} y={1060} w={380} h={160} rot={3} at={word('L09', '÷', -6)} bg={C.yellow} z={40}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, textAlign: 'center', marginTop: 14}}>₹60,000 ÷ ₹2 LAKH</div>
        <div style={{fontFamily: F.display, fontSize: 84, textAlign: 'center', lineHeight: 1}}><Appear at={word('L09', '30%', -2)}>= 30%</Appear></div>
      </Card>
      <Stamp id="theek" text="Theek-thaak ✓" x={300} y={1150} at={word('L09', 'theek', -2)} out={end('L09', 20)} size={58} rot={-6} color={C.ink} paper />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- close
const Close: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l11 = at('L11'), l12 = at('L12'), l13 = at('L13');
  const cut = word('L10', 'band', -4);
  const capAt = word('L10', 'limit', -2);
  const redAt = word('L11', 'utilization', -2);
  return (
    <AbsoluteFill>
      {/* L10: one card gone, limit halves */}
      <CreditCard id="c1" x={110} y={440} w={400} h={250} rot={-3} at={0} enter="none" limit="₹1 LAKH" />
      <Show until={cut + 18}>
        <CreditCard id="c2" x={570} y={450} w={400} h={250} rot={3} at={0} enter="none" old limit="₹1 LAKH" />
      </Show>
      <Show from={cut + 18}>
        <CutCard id="c2" x={570} y={450} w={400} h={250} rot={3} at={0} split={cut + 18} out={cut + 30} exit="down" />
      </Show>
      <Scissors x={770} y0={420} y1={720} at={cut} dur={14} out={cut + 22} />
      <Hand x={600} y={730} at={cut + 30} out={l12} size={54} rot={-4} color={C.red}>✂ band</Hand>

      <Card id="meter2" x={90} y={800} w={900} h={300} rot={-0.8} at={0} enter="none" bg={C.card} out={l12} exit="down">
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'relative', padding: '26px 40px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
            <Label size={22}>Total limit</Label>
            <span style={{fontFamily: F.display, fontSize: 64}}>
              {stepped(frame) < capAt ? '₹2 LAKH' : <HL at={capAt + 4}>₹1 LAKH</HL>}
            </span>
          </div>
          <div style={{marginTop: 24}}>
            <Meter w={820} h={100} fill0={0.3} fill1={0.3} fillAt={0} cap0={1} cap1={0.5} capAt={capAt} dur={12} red={redAt} />
          </div>
        </div>
      </Card>
      {/* L11: same spend, 60% */}
      <Card id="spend2" x={130} y={1110} w={500} h={110} rot={-2} at={word('L11', 'wahi', -4)} out={l12} bg={C.paperLight} sfx={null}>
        <div style={{fontFamily: F.display, fontSize: 52, textAlign: 'center', marginTop: 22, whiteSpace: 'nowrap'}}>KHARCHA WAHI ₹60,000</div>
      </Card>
      <Card id="sixty" x={650} y={1060} w={320} h={170} rot={4} at={redAt} out={l12} bg={C.card} z={40}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, textAlign: 'center', marginTop: 14, letterSpacing: 3}}>UTILIZATION</div>
        <div style={{fontFamily: F.display, fontSize: 96, textAlign: 'center', lineHeight: 1, color: C.red}}><Count from={30} to={60} at={redAt + 2} dur={14} fmt={pct} /></div>
      </Card>

      {/* L12: how the bank reads it */}
      <Card id="banksees" x={120} y={450} w={840} h={420} rot={-1.5} at={l12} out={l13} enter="up" bg={C.card}>
        <div style={{padding: '30px 44px'}}>
          <Label size={24}>Bank ki nazar se</Label>
          <div style={{fontFamily: F.display, fontSize: 96, lineHeight: 1, marginTop: 36}}>LIMIT KA <span style={{color: C.red}}>60%</span><br />HAR MAHINE?</div>
        </div>
      </Card>
      <Hand x={160} y={900} at={word('L12', 'credit', -2)} out={l13} size={62} rot={-3}>credit pe zyada nirbhar…</Hand>
      <Stamp id="risk" text="Risky?" x={760} y={1040} at={word('L12', 'zyada', -2)} out={l13} size={84} rot={-8} />

      {/* L13: the guideline */}
      <div style={{position: 'absolute', left: 110, top: 450}}>
        <Show from={l13}><Appear at={l13}><Label size={26}>Aam salah</Label></Appear></Show>
      </div>
      <Card id="guide" x={90} y={520} w={900} h={400} rot={-0.8} at={l13} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'relative', padding: '30px 40px'}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3}}>LIMIT USED</div>
          <div style={{marginTop: 70}}>
            <Meter w={820} h={110} fill0={0.6} fill1={0.6} fillAt={0} red={0} guide={0.3} guideAt={word('L13', '30%', -4)} />
          </div>
          <div style={{position: 'absolute', left: 40 + 820 * 0.3 - 110, top: 260, width: 220, textAlign: 'center', fontFamily: F.display, fontSize: 52, opacity: ease(stepped(frame), word('L13', '30%', 2), word('L13', '30%', 8))}}>
            <HL at={word('L13', 'neeche', -2)}>30% SE NEECHE</HL>
          </div>
        </div>
      </Card>
      <Hand x={560} y={950} at={word('L13', 'neeche', 4)} size={60} rot={-3}>← yahan tak rakho</Hand>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- age
const RULER_X = 130, RULER_W = 820;
const Age: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l15 = at('L15'), l16 = at('L16');
  const longAt = word('L15', 'lambi', -2);
  const closeAt = word('L16', 'band', -2);
  const shrinkAt = word('L16', 'dheere', -2);
  const grow = ease(stepped(frame), longAt, longAt + 14);
  const shrink = ease(stepped(frame), shrinkAt, shrinkAt + 40);
  const avg = 0.62 - 0.27 * shrink; // average-age marker (fraction of ruler)
  return (
    <AbsoluteFill>
      {/* L14: the card that went was the oldest */}
      <Hand x={130} y={430} at={word('L14', 'doosra', -2)} out={l15} size={60} rot={-3}>doosra nuksaan…</Hand>
      <CreditCard id="oldest" x={300} y={540} w={480} h={300} rot={-3} at={word('L14', 'card', -4)} out={l15} enter="drop" old />
      <Card id="oldtag" x={330} y={880} w={420} h={120} rot={3} at={word('L14', 'sabse', -3)} out={l15} bg={C.yellow} sfx={null}>
        <div style={{fontFamily: F.display, fontSize: 72, textAlign: 'center', marginTop: 18}}>SABSE PURANA</div>
      </Card>

      {/* L15: long history = good */}
      <Card id="ruler" x={90} y={460} w={900} h={560} rot={-0.8} at={l15} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'relative', padding: '28px 40px'}}>
          <Label size={24}>Credit history</Label>
        </div>
      </Card>
      <Show from={l15}>
        <div style={{position: 'absolute', left: RULER_X, top: 600, width: RULER_W}}>
          {/* old card's account line */}
          <div style={{position: 'relative', height: 70, marginBottom: 26}}>
            <div style={{position: 'absolute', left: 0, top: 0, height: 70, width: RULER_W * grow, background: frame >= closeAt ? '#cfc8ba' : C.yellow, border: `4px solid ${C.ink}`, boxSizing: 'border-box', ...(frame >= closeAt ? hatch(C.red) : {})}} />
            <div style={{position: 'absolute', left: 16, top: 14, fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 2, opacity: grow > 0.4 ? 1 : 0}}>PURANA CARD</div>
          </div>
          {/* newer card's account line */}
          <div style={{position: 'relative', height: 70}}>
            <div style={{position: 'absolute', right: 0, top: 0, height: 70, width: RULER_W * 0.38 * grow, background: C.paperLight, border: `4px solid ${C.ink}`, boxSizing: 'border-box'}} />
            <div style={{position: 'absolute', right: 16, top: 14, fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 2, opacity: grow > 0.6 ? 1 : 0}}>NAYA CARD</div>
          </div>
          {/* time axis */}
          <div style={{marginTop: 30, borderTop: `4px solid ${C.ink}`, position: 'relative', height: 40}}>
            <div style={{position: 'absolute', left: 0, top: 8, fontFamily: F.mono, fontWeight: 700, fontSize: 22, color: C.inkSoft}}>PEHLE</div>
            <div style={{position: 'absolute', right: 0, top: 8, fontFamily: F.mono, fontWeight: 700, fontSize: 22, color: C.inkSoft}}>AAJ</div>
          </div>
        </div>
      </Show>
      <Show from={word('L15', 'history', -2)}>
        <div style={{position: 'absolute', left: RULER_X, top: 470 + 400, width: RULER_W, textAlign: 'center', fontFamily: F.display, fontSize: 64}}>
          <Appear at={word('L15', 'history', -2)}><HL at={word('L15', 'history', 4)}>LAMBI HISTORY</HL></Appear>
        </div>
      </Show>
      <Stamp id="likes" text="Score ✓" x={830} y={500} at={word('L15', 'pasand', -2)} out={l16} size={64} rot={8} color={C.ink} paper />

      {/* L16: close it → average age falls */}
      <Cross id="xold" x={RULER_X + 10} y={590} w={RULER_W - 20} h={80} at={closeAt} />
      <Show from={shrinkAt - 6}>
        <div style={{position: 'absolute', left: RULER_X + RULER_W * avg - 3, top: 560, height: 260, borderLeft: `6px solid ${C.ink}`}} />
        <div style={{position: 'absolute', left: RULER_X + RULER_W * avg - 170, top: 1040, width: 340, textAlign: 'center'}}>
          <Label size={22}>Average credit age</Label>
          <div style={{fontFamily: F.display, fontSize: 70, color: C.red, marginTop: 8}}>↓ GHATI</div>
        </div>
      </Show>
      <Hand x={600} y={1000} at={word('L16', 'dheere', 6)} size={52} rot={-3}>dheere dheere ←</Hand>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- fix
const FIXES: [string, string, string, string, string][] = [
  // line, show-needle, tick-needle, title, sub
  ['L17', 'free', 'mat', 'FREE CARD? BAND MAT KARO', 'PURANA = QEEMTI'],
  ['L18', 'chhota', 'poora', 'CHHOTA KHARCHA + POORA BILL', 'CARD ZINDA RAHE'],
  ['L19', 'annual', 'lifetime', 'LIFETIME FREE VERSION MAANGO', 'BHAARI FEE? BANK SE BAAT'],
  ['L20', 'bada', 'limit', 'PEHLE LIMIT BADHWAO', 'BADA KHARCHA AANE SE PEHLE'],
];
const Fix: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  return (
    <AbsoluteFill>
      <Card id="fixc" x={90} y={430} w={900} h={790} rot={-0.6} at={at('L17') - 2} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'relative', padding: '30px 44px'}}>
          <Label size={22}>Checklist</Label>
          <div style={{fontFamily: F.display, fontSize: 88, marginTop: 16, lineHeight: 1}}>TOH KAREIN KYA?</div>
          <div style={{marginTop: 28}}>
            {FIXES.map(([id, show, tick, title, sub], i) => (
              <div key={id} style={{display: 'flex', alignItems: 'center', gap: 22, height: 128, borderTop: `3px dashed ${C.grey}`, opacity: frame >= word(id, show, -4) ? 1 : 0}}>
                <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30, color: C.inkSoft, width: 48}}>0{i + 1}</div>
                <div style={{flex: 1}}>
                  <Appear at={word(id, show, -4)}><div style={{fontFamily: F.display, fontSize: 54, lineHeight: 1, whiteSpace: 'nowrap'}}>{i === 3 ? <HL at={word(id, tick, 2)}>{title}</HL> : title}</div></Appear>
                  <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: 2, color: C.inkSoft, marginTop: 8}}>{sub}</div>
                </div>
                <div style={{width: 70, height: 70, border: `4px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Tick at={word(id, tick, -2)} size={52} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
      <Hand x={560} y={1150} at={word('L20', 'card', -2)} size={64} rot={-4} color={C.red}>card mat todo!</Hand>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <SignOff share="L21" sign="L22" who="us dost ko jo purana card band karne wala hai →" note="ILLUSTRATIVE · 2 CARDS × ₹1 LAKH · ₹60,000 SPEND · 30% IS A GUIDELINE, NOT A RULE" />
);

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  util: Util,
  close: Close,
  age: Age,
  fix: Fix,
  outro: Outro,
};
