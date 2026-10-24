import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Big, Card, Circle, Count, Cross, Hand, HL, Label, Marker, Photo, Sfx, Stamp, Tape} from '../../components/paper';
import {ease, pop, stepped} from '../../lib/motion';
import {useCues} from '../../lib/timeline';
import {C, F} from '../../theme';
import {SignOff} from '../common';
import {Coupon, grid, Mini, Pop, Show, Tick} from './parts';

/* ------------------------------------------------------------------ hook */

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l03 = at('L03'), l04 = at('L04');
  const cIn = word('L01', 'tax-free', -6);
  const val = word('L02', '15', -2);
  return (
    <AbsoluteFill>
      {/* L01: every year the government hands you something */}
      <Card id="env" x={150} y={720} w={780} h={440} rot={-1.5} at={0} out={l03} enter="up" bg={C.kraft} texture="kraft">
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 220, background: 'rgba(60,40,15,0.18)', clipPath: 'polygon(0 0, 100% 0, 50% 100%)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 60, textAlign: 'center'}}>
          <Label size={26}>Har saal · aapke naam</Label>
        </div>
      </Card>
      <Hand x={190} y={480} at={word('L01', 'sarkar', -2)} out={cIn} size={74} rot={-4}>sarkar ki taraf se…</Hand>
      <Coupon id="c1" x={130} y={430} w={820} h={380} rot={-3} at={cIn} out={l04} enter="up" sfx="slide"
        value={frame < val ? '₹ ?' : <HL at={val + 2}>₹15,625</HL>} />
      <Sfx at={val + 2} name="coin" volume={0.3} />

      {/* L03: most investors throw it away */}
      <Photo id="crowd" src="crowd.jpg" x={110} y={870} w={860} h={340} rot={1.5} at={word('L03', 'zyaadatar', -4)} out={l04} enter="up" torn={{top: true, bottom: true}} rough={12} pos="50% 60%" caption="ZYAADATAR INVESTORS" />
      <Cross id="cx1" x={300} y={470} w={620} h={300} at={word('L03', 'phenk', -2)} out={l04} />
      <Stamp id="unused" text="Unused" sub="PHENK DIYA" x={560} y={640} at={word('L03', 'dete', -2)} out={l04} size={96} rot={-9} />

      {/* L04: the coupon's name */}
      <div style={{position: 'absolute', left: 110, top: 450, width: 860}}>
        <Show from={l04}><Big words={['COUPON', 'KA', 'NAAM:']} at={l04} gap={4} size={124} /></Show>
      </div>
      <Card id="name" x={100} y={740} w={880} h={300} rot={-2} at={word('L04', 'ltcg', -3)} enter="drop" bg={C.yellow} torn={{top: true, bottom: true}} rough={12}>
        <div style={{fontFamily: F.display, fontSize: 132, lineHeight: 1, textAlign: 'center', marginTop: 34}}>LTCG<br />HARVESTING</div>
      </Card>
      <Hand x={130} y={1080} w={880} at={word('L04', 'harvesting', 4)} size={52} rot={-2}>= Long Term Capital Gains ki fasal kaatna</Hand>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ rule */

const Rule: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l06 = at('L06'), l07 = at('L07'), l08 = at('L08');
  const fill = ease(stepped(frame), word('L05', 'ek', -2), word('L05', 'rakhe', 4));
  const segA = ease(stepped(frame), word('L06', '₹1.25', -4), word('L06', '₹1.25', 8));
  const segB = ease(stepped(frame), word('L07', 'upar', -4), word('L07', 'upar', 10));
  const mul = word('L08', 'ka', 6);
  const res = word('L08', 'yahi', -2);
  return (
    <AbsoluteFill>
      {/* L05: held more than a year = long term */}
      <Card id="hold" x={90} y={430} w={900} h={560} rot={-1} at={0} out={l06} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'relative', padding: '34px 44px'}}>
          <Label size={24}>Kitne din rakha?</Label>
          <div style={{display: 'flex', gap: 22, marginTop: 30, height: 104}}>
            <Pop at={word('L05', 'shares', -3)}><div style={{border: `4px solid ${C.ink}`, background: C.paperLight, fontFamily: F.display, fontSize: 64, padding: '8px 26px'}}>SHARES</div></Pop>
            <Pop at={word('L05', 'equity', -3)}><div style={{border: `4px solid ${C.ink}`, background: C.paperLight, fontFamily: F.display, fontSize: 64, padding: '8px 26px'}}>EQUITY FUND</div></Pop>
          </div>
          {/* the holding ruler */}
          <div style={{position: 'absolute', left: 44, top: 260, width: 812}}>
            <div style={{position: 'relative', height: 70, border: `4px solid ${C.ink}`, background: C.paperLight}}>
              <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, background: C.yellow}} />
              {Array.from({length: 13}).map((_, i) => (
                <div key={i} style={{position: 'absolute', left: `${(i / 12) * 100}%`, top: 0, height: i % 3 === 0 ? 36 : 20, borderLeft: `3px solid ${C.ink}`}} />
              ))}
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 2, marginTop: 10}}>
              <span>KHARIDA</span>
              <span>1 SAAL →</span>
            </div>
          </div>
          <Pop at={word('L05', 'long', -3)} style={{position: 'absolute', left: 300, top: 410, transformOrigin: 'center'}}>
            <div style={{background: C.yellow, border: `4px solid ${C.ink}`, fontFamily: F.display, fontSize: 70, padding: '6px 30px', transform: 'rotate(-2deg)'}}>LONG TERM ✓</div>
          </Pop>
        </div>
      </Card>

      {/* L06-L07: the first ₹1.25 lakh is free, the rest pays 12.5% */}
      <Card id="bar" x={90} y={450} w={900} h={560} rot={0.8} at={l06 - 2} out={l08} enter="right" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'relative', padding: '34px 44px'}}>
          <Label size={24}>Long-term profit · har saal</Label>
          <div style={{position: 'absolute', left: 44, top: 150, width: 812, height: 150, display: 'flex'}}>
            <div style={{width: 480 * segA, height: '100%', background: C.yellow, border: segA > 0 ? `4px solid ${C.ink}` : undefined, boxSizing: 'border-box', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: 54, whiteSpace: 'nowrap'}}>{segA > 0.6 ? 'PEHLE ₹1.25 LAKH' : ''}</div>
            <div style={{width: 332 * segB, height: '100%', background: C.ink, color: C.paperLight, boxSizing: 'border-box', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: 64, whiteSpace: 'nowrap'}}>{segB > 0.6 ? 'UPAR' : ''}</div>
          </div>
          <Pop at={word('L06', 'tax-free', -3)} style={{position: 'absolute', left: 70, top: 330}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12, fontFamily: F.display, fontSize: 66}}>TAX-FREE <Tick at={word('L06', 'tax-free', 2)} size={64} /></div>
          </Pop>
          <Pop at={word('L07', '12', -3)} style={{position: 'absolute', left: 540, top: 330}}>
            <div style={{fontFamily: F.display, fontSize: 66}}><HL at={word('L07', '12', 0)}>12.5% TAX</HL></div>
          </Pop>
        </div>
      </Card>

      {/* L08: ₹1.25 lakh × 12.5% = ₹15,625 */}
      <Card id="sum" x={110} y={450} w={860} h={600} rot={-1.2} at={l08 - 2} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'relative', padding: '40px 60px', fontFamily: F.display, lineHeight: 1.1}}>
          <Label size={24}>Coupon ki keemat</Label>
          <div style={{fontSize: 120, marginTop: 24}}>₹1.25 LAKH</div>
          <Show from={mul}><div style={{fontSize: 120}}><span style={{color: C.inkSoft}}>×</span> 12.5%</div></Show>
          <Show from={res}>
            <div style={{height: 8, background: C.ink, margin: '12px 0 18px', width: 700}} />
            <div style={{fontSize: 140}}><span style={{color: C.inkSoft}}>=</span> <HL at={word('L08', '15,625', 0)}><Count from={0} to={15625} at={res} dur={16} /></HL></div>
          </Show>
        </div>
      </Card>
      <Sfx at={word('L08', '15,625', 0)} name="coin" volume={0.3} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ trap */

const Trap: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l10 = at('L10'), l11 = at('L11');
  const tear = word('L10', 'khatam', -2);
  const tearP = ease(stepped(frame), tear + 4, tear + 16);
  const nxt = word('L10', 'agle', -2);
  const ten = word('L11', '10', -2);
  const sold = word('L11', 'chhoot', -2);
  const once = word('L11', 'baar', -4);
  return (
    <AbsoluteFill>
      {/* L09: the exemption doesn't carry forward */}
      <div style={{position: 'absolute', left: 110, top: 440, width: 860}}>
        <Show until={l10}><Big words={['AB', 'DIKKAT:']} at={0} gap={4} size={150} /></Show>
      </div>
      <Show from={word('L09', 'saal', -3)} until={l10}>
        <Mini x={110} y={700} w={360} h={200} label="IS SAAL" rot={-3} />
      </Show>
      <Show from={word('L09', 'dar', -3)} until={l10}>
        <div style={{position: 'absolute', left: 498, top: 740, fontFamily: F.display, fontSize: 110}}>+</div>
        <Mini x={600} y={700} w={360} h={200} label="AGLE SAAL" rot={2} />
      </Show>
      <Cross id="nojoin" x={490} y={740} w={90} h={120} at={word('L09', 'judti', -2)} out={l10} />
      <Stamp id="nojd" text="Judti nahi" x={540} y={1040} at={word('L09', 'nahi', -2)} out={l10} size={92} rot={-6} />

      {/* L10: unused this year? gone */}
      <Card id="book" x={80} y={430} w={920} h={640} rot={-0.8} at={l10 - 2} out={l11} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'absolute', left: 40, top: 30}}><Label size={24}>Coupon book · har saal ek</Label></div>
        <div style={{position: 'absolute', left: 40, top: 110, fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, color: C.inkSoft}}>IS SAAL</div>
        <div style={{position: 'absolute', left: 330, top: 110, fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, color: C.inkSoft}}>AGLE SAAL</div>
        <div style={{position: 'absolute', left: 620, top: 110, fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, color: C.inkSoft}}>USKE BAAD</div>
      </Card>
      <Show from={l10} until={l11}>
        {/* this year's coupon tears off and drops */}
        <div style={{position: 'absolute', left: 0, top: 0, transform: `translate(${-40 * tearP}px, ${700 * tearP}px) rotate(${-24 * tearP}deg)`, opacity: 1 - tearP}}>
          <Mini x={120} y={590} w={250} h={340} label="₹1.25L" state={frame >= word('L10', 'nahi', -2) ? 'expired' : 'plain'} />
        </div>
        <Mini x={410} y={590} w={250} h={340} label="₹1.25L" hi={frame >= nxt} />
        <Mini x={700} y={590} w={250} h={340} label="₹1.25L" />
      </Show>
      <Sfx at={tear + 4} name="slide" volume={0.35} />
      <Stamp id="exp" text="Khatam" sub="EXPIRED" x={300} y={1000} at={tear + 4} out={l11} size={92} rot={-8} />
      <Hand x={540} y={965} at={word('L10', '₹1.25', -6)} out={l11} size={50} rot={-3}>phir sirf ₹1.25 lakh ↓</Hand>

      {/* L11: sell everything after 10 years → the exemption counts once */}
      <Card id="ten" x={80} y={430} w={920} h={660} rot={0.6} at={l11 - 2} enter="right" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'absolute', left: 40, top: 30}}><Label size={24}>10 saal · ek saath becha</Label></div>
      </Card>
      <Show from={ten}>
        {Array.from({length: 10}).map((_, i) => {
          const app = ten + i * 2;
          if (frame < app) return null;
          const last = i === 9;
          const state = frame >= sold && !last ? 'expired' : 'plain';
          return <Mini key={i} x={130 + (i % 5) * 168} y={560 + Math.floor(i / 5) * 190} w={148} h={150} label={`SAAL ${i + 1}`} state={state} hi={last && frame >= once} rot={((i * 37) % 7) - 3} />;
        })}
      </Show>
      <Circle id="once" cx={806} cy={826} rx={110} ry={110} at={once} />
      <Stamp id="ekbaar" text="Sirf 1 baar" x={430} y={1010} at={once + 4} size={84} rot={-6} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ harvest */

const Harvest: React.FC = () => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l13 = at('L13'), l14 = at('L14'), l15 = at('L15'), l16 = at('L16');
  const sell = word('L13', 'becho', -2);
  const rebuy = word('L13', 'invest', -4);
  const cut = word('L15', '₹1.25', -2);
  const cutP = ease(stepped(frame), cut + 6, cut + 18);
  const ten = word('L16', '10', -2);
  const tot = word('L16', '₹1.5', -2);
  return (
    <AbsoluteFill>
      {/* L12: harvesting = book up to ₹1.25 lakh every year */}
      <div style={{position: 'absolute', left: 110, top: 440, width: 860}}>
        <Show until={l13}><Big words={['HARVESTING', '=']} at={0} gap={4} size={140} /></Show>
      </div>
      <Coupon id="c2" x={130} y={690} w={820} h={380} rot={-2} at={word('L12', 'matlab', -2)} out={l13} enter="up" title="Har saal · is saal ka" />
      <Stamp id="used" text="Used ✓" sub="PROFIT BOOK" x={720} y={960} at={word('L12', 'book', -2)} out={l13} size={92} rot={-8} color={C.ink} />

      {/* L13-L14: sell, buy back the same; cost goes up */}
      <Card id="fund" x={270} y={640} w={540} h={290} rot={-1} at={l13 - 2} out={l15} enter="drop" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'relative', padding: '30px 40px'}}>
          <Label size={22}>Aapka equity fund</Label>
          <div style={{fontFamily: F.display, fontSize: 96, marginTop: 16}}>INVESTMENT</div>
          <Show from={word('L14', 'wahi', -2)}>
            <div style={{display: 'flex', alignItems: 'center', gap: 10, fontFamily: F.display, fontSize: 56}}>WAHI <Tick at={word('L14', 'wahi', 2)} size={56} /></div>
          </Show>
        </div>
      </Card>
      <Show from={sell} until={l15}>
        <div style={{position: 'absolute', left: 120, top: 470, background: C.ink, color: C.paperLight, fontFamily: F.display, fontSize: 58, padding: '6px 22px', transform: 'rotate(-3deg)'}}>1. BECHO</div>
      </Show>
      <Marker id="arcTop" d="M260,620 C380,500 700,500 820,620" at={sell + 2} dur={10} out={l15} color={C.ink} width={10} />
      <Marker id="arcTopH" d="M780,585 L824,626 L768,640" at={sell + 12} dur={4} out={l15} color={C.ink} width={10} />
      <Show from={rebuy} until={l15}>
        <div style={{position: 'absolute', left: 560, top: 1060, background: C.yellow, border: `4px solid ${C.ink}`, fontFamily: F.display, fontSize: 58, padding: '4px 22px', transform: 'rotate(2deg)'}}>2. WAPAS INVEST</div>
      </Show>
      <Marker id="arcBot" d="M820,950 C700,1070 380,1070 260,950" at={rebuy + 2} dur={10} out={l14} color={C.ink} width={10} />
      <Marker id="arcBotH" d="M300,985 L256,946 L312,930" at={rebuy + 12} dur={4} out={l14} color={C.ink} width={10} />
      <Hand x={140} y={1080} at={word('L13', 'turant', -2)} out={l14} size={50} rot={-3}>usi din</Hand>
      <Card id="cost" x={150} y={1000} w={780} h={150} rot={-2} at={word('L14', 'kharid', -4)} out={l15} enter="left" bg={C.yellow}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', padding: '0 34px'}}>
          <div style={{fontFamily: F.display, fontSize: 58}}>KHARID KEEMAT ↑</div>
          <Show from={word('L14', 'upar', -2)}><div style={{fontFamily: F.display, fontSize: 58}}>+₹1.25 LAKH</div></Show>
        </div>
      </Card>
      <Tape id="ctape" x={470} y={985} w={140} rot={-6} at={word('L14', 'kharid', 0)} out={l15} />

      {/* L15: future taxable profit is ₹1.25 lakh smaller */}
      <Card id="future" x={90} y={440} w={900} h={560} rot={0.8} at={l15 - 2} out={l16} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'relative', padding: '34px 44px'}}>
          <Label size={24}>Aage ka taxable profit</Label>
          <div style={{position: 'absolute', left: 44, top: 150, width: 812, height: 150}}>
            <div style={{position: 'absolute', left: 300, top: 0, width: 512, height: 150, background: C.ink}} />
            <div style={{position: 'absolute', left: 0, top: 0, width: 300, height: 150, background: C.yellow, border: `4px solid ${C.ink}`, boxSizing: 'border-box',
              transform: `translate(${-20 * cutP}px, ${260 * cutP}px) rotate(${-8 * cutP}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: 54}}>−₹1.25 LAKH</div>
          </div>
          <Show from={cut}><div style={{position: 'absolute', left: 340, top: 120, height: 210, borderLeft: `5px dashed ${C.red}`}} /></Show>
        </div>
      </Card>
      <Sfx at={cut + 6} name="slide" volume={0.3} />
      <Stamp id="kam" text="Kam ✓" x={740} y={860} at={word('L15', 'kam', -2)} out={l16} size={96} rot={-7} color={C.ink} />

      {/* L16: ten years of used coupons */}
      <Card id="tenyr" x={80} y={430} w={920} h={520} rot={-0.6} at={l16 - 2} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <div style={{position: 'absolute', left: 40, top: 30}}><Label size={24}>10 saal · har saal harvest</Label></div>
      </Card>
      <Show from={ten}>
        {Array.from({length: 10}).map((_, i) => {
          const app = ten + i * 4;
          if (frame < app) return null;
          return <Mini key={i} x={130 + (i % 5) * 168} y={540 + Math.floor(i / 5) * 190} w={148} h={150} label={`SAAL ${i + 1}`} state="used" rot={((i * 37) % 7) - 3} />;
        })}
      </Show>
      <Card id="saved" x={160} y={990} w={760} h={190} rot={-2} at={tot} enter="drop" bg={C.yellow}>
        <div style={{textAlign: 'center', marginTop: 18}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3}}>TAX BACHA</div>
          <div style={{fontFamily: F.display, fontSize: 104, lineHeight: 1}}>₹1.5 LAKH+</div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ careful */

const Row: React.FC<{y: number; at: number; tick: number; n: string; title: string; sub: string}> = ({y, at, tick, n, title, sub}) => (
  <Show from={at}>
    <Pop at={at} style={{position: 'absolute', left: 40, top: y, width: 820}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22, height: 120, borderBottom: `3px solid ${C.ink}`}}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30, color: C.inkSoft, width: 46}}>{n}</div>
        <div style={{flex: 1}}>
          <div style={{fontFamily: F.display, fontSize: 56, lineHeight: 1, whiteSpace: 'nowrap'}}>{title}</div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: 2, marginTop: 8, color: C.inkSoft}}>{sub}</div>
        </div>
        <Tick at={tick} size={70} />
      </div>
    </Pop>
  </Show>
);

const Careful: React.FC = () => {
  const {at, word} = useCues();
  const march = word('L19', 'march', -3);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 110, top: 430, width: 860}}>
        <Big words={['PAR', 'DHYAN', 'DO.']} at={at('L17', -2)} gap={4} size={120} />
      </div>
      <Card id="check" x={80} y={590} w={920} h={620} rot={-0.8} at={word('L17', 'becho', -6)} enter="up" bg={C.card}>
        <div style={{position: 'absolute', inset: 0, ...grid()}} />
        <Row y={30} at={word('L17', 'becho', -6) + 8} tick={word('L17', 'purane', 0)} n="01" title="SIRF 1 SAAL+ PURANE UNITS" sub="WARNA SHORT TERM TAX" />
        <Row y={170} at={word('L18', 'exit', -3)} tick={word('L18', 'check', 2)} n="02" title="EXIT LOAD CHECK KARO" sub="BECHNE KI FEE" />
        <Row y={310} at={word('L18', 'limit', -3)} tick={word('L18', 'sab', 0)} n="03" title="LIMIT: STOCKS + FUNDS" sub="SAB MILA KE · HAR VYAKTI" />
        <Row y={450} at={word('L19', 'waqt', -4)} tick={word('L19', 'pehle', 2)} n="04" title="MARCH SE PEHLE" sub="HAR FINANCIAL YEAR" />
      </Card>
      <Circle id="mc" cx={330} cy={1095} rx={210} ry={58} at={march + 4} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ outro */

const Outro: React.FC = () => (
  <AbsoluteFill>
    <SignOff share="L20" sign="L21" who="us dost ko jo kabhi fund nahi bechta →" note="₹1.25 LAKH LTCG TAX-FREE / YEAR · 12.5% ABOVE · UNCHANGED IN BUDGET 2026" />
  </AbsoluteFill>
);

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  rule: Rule,
  trap: Trap,
  harvest: Harvest,
  careful: Careful,
  outro: Outro,
};
