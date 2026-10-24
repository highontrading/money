import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Big, Card, Circle, Count, Cross, Hand, HL, Label, Photo, Sfx, Stamp, Tape} from '../../components/paper';
import {useCues} from '../../lib/timeline';
import {C, F} from '../../theme';
import {SignOff} from '../common';
import {Glass, Kernels, NoSign, Show, SplitBar, Ticket} from './props';

// ---------------------------------------------------------------- hook
const Hook: React.FC = () => {
  const {at, word} = useCues();
  const l2 = at('L02'), l3 = at('L03');
  return (
    <AbsoluteFill>
      {/* L01: ticket ₹280 vs popcorn ₹400 */}
      <Card id="tk" x={90} y={470} w={470} h={250} rot={-5} at={word('L01', 'ticket', -6)} out={l3} enter="left" bg={C.paperLight} texture="paper">
        <Ticket w={470} h={250} price={<>₹280</>} hiPrice />
      </Card>
      <Photo id="pc" src="popcorn.jpg" x={560} y={420} w={420} h={560} rot={3} at={word('L01', 'popcorn', -6)} out={l3} enter="right" torn={{top: true, left: true}} rough={14} pos="50% 50%" />
      <Card id="pcTag" x={640} y={900} w={300} h={140} rot={-4} at={word('L01', '400', -3)} out={l3} bg={C.yellow} sfx="pop">
        <div style={{fontFamily: F.display, fontSize: 96, textAlign: 'center', marginTop: 14}}>₹400</div>
      </Card>
      <Tape id="pcTape" x={720} y={884} w={130} rot={-10} at={word('L01', '400', 0)} out={l3} />

      {/* L02: just corn kernels... for ₹400? */}
      <Card id="kern" x={90} y={780} w={470} h={330} rot={2} at={l2 - 2} out={l3} bg={C.card}>
        <Kernels w={470} h={330} at={l2 + 2} />
      </Card>
      <Hand x={110} y={1120} at={word('L02', 'makke', 2)} out={l3} size={56} rot={-3}>makke ke daane...</Hand>
      <Stamp id="q400" text="₹400 ?" x={330} y={940} at={word('L02', 'chaar', -2)} out={l3} size={96} rot={-10} />

      {/* L03: not greed, a business model */}
      <div style={{position: 'absolute', left: 110, top: 470, width: 860}}>
        <Show at={l3} popIn={false} style={{position: 'relative'}}>
          <Big words={['YEH', 'LALACH', 'NAHI.']} at={l3} gap={4} size={150} />
        </Show>
      </div>
      <Cross id="lalachX" x={360} y={480} w={400} h={130} at={word('L03', 'nahi', 0)} />
      <Card id="bm" x={120} y={760} w={840} h={300} rot={-2} at={word('L03', 'business', -4)} bg={C.yellow} torn={{bottom: true, right: true}} rough={12}>
        <div style={{padding: '36px 50px'}}>
          <Label size={24}>Asli wajah</Label>
          <div style={{fontFamily: F.display, fontSize: 108, lineHeight: 1, marginTop: 22, whiteSpace: 'nowrap'}}>BUSINESS MODEL</div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- ticket
const TicketScene: React.FC = () => {
  const {at, word} = useCues();
  const l5 = at('L05'), l6 = at('L06');
  return (
    <AbsoluteFill>
      {/* L04: the ticket money isn't all the theatre's */}
      <Card id="tk2" x={110} y={430} w={860} h={330} rot={-1.5} at={0} enter="up" bg={C.paperLight}>
        <Ticket w={860} h={330} price={<>₹280</>} hiPrice />
      </Card>
      <Stamp id="poora" text="Poora nahi" sub="THEATRE KA" x={720} y={760} at={word('L04', 'nahi', -2)} out={l5} size={80} rot={-8} />

      {/* L05-L06: where ₹280 goes */}
      <Card id="split" x={90} y={820} w={900} h={360} rot={0.5} at={l5 - 2} bg={C.card}>
        <div style={{padding: '26px 30px'}}>
          <Label size={22}>₹280 ka ticket · kiska kitna</Label>
          <div style={{position: 'absolute', left: 30, top: 90, width: 840, height: 200}}>
            <SplitBar w={840} h={200} segs={[
              {label: 'GST', frac: 0.16, color: C.newsprint, at: word('L05', 'gst', -2)},
              {label: 'FILM WALE', sub: 'BADA HISSA', frac: 0.44, color: C.ink, ink: C.paperLight, at: word('L05', 'film', -2)},
              {label: 'THEATRE', frac: 0.4, color: C.yellow, at: word('L05', 'walon', 4)},
            ]} />
          </div>
        </div>
      </Card>
      <Hand x={130} y={1184} at={word('L05', 'film', 6)} out={l6} size={46} rot={-2}>↑ film wale = distributor / producer</Hand>

      {/* L06: in a big film's first week, often about half */}
      <Card id="wk1" x={630} y={1070} w={330} h={130} rot={4} at={word('L06', 'pehle', -3)} bg={C.paperLight} z={40}>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 3, textAlign: 'center', marginTop: 18, color: C.inkSoft}}>BADI FILM</div>
        <div style={{fontFamily: F.display, fontSize: 56, textAlign: 'center', lineHeight: 1.1}}>HAFTA 1</div>
      </Card>
      <Stamp id="aadha" text="~ Aadha" x={440} y={1010} at={word('L06', 'aadha', -2)} size={84} rot={-6} paper />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- popcorn
const PopcornScene: React.FC = () => {
  const {at, word} = useCues();
  const frame = useCurrentFrame();
  const l8 = at('L08'), l9 = at('L09');
  return (
    <AbsoluteFill>
      {/* L07: popcorn money? all the theatre's */}
      <Photo id="pc2" src="popcorn.jpg" x={110} y={430} w={560} h={680} rot={-2} at={0} out={l8} enter="up" torn={{top: true, right: true}} rough={14} zoom={0.05} caption="POPCORN" />
      <Card id="full" x={560} y={760} w={400} h={250} rot={4} at={word('L07', 'poora', -3)} out={l8} bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 130, textAlign: 'center', lineHeight: 1, marginTop: 24}}>100%</div>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, textAlign: 'center', marginTop: 6}}>THEATRE KA</div>
      </Card>
      <Hand x={600} y={600} at={word('L07', 'paisa', 0)} out={l8} size={56} rot={-4}>iska paisa?</Hand>

      {/* L08: cheap ingredients, fat margin */}
      {([['MAKKA', 'makka', -3], ['TEL', 'tel', 2], ['NAMAK', 'namak', -2]] as const).map(([t, k, r], i) => (
        <Card key={k} id={'ing' + k} x={110 + i * 290} y={440} w={260} h={140} rot={r} at={word('L08', k, -4)} out={l9} bg={C.paperLight}>
          <div style={{fontFamily: F.display, fontSize: 70, textAlign: 'center', marginTop: 26}}>{t}</div>
        </Card>
      ))}
      <Stamp id="sasta" text="Sasta" x={540} y={620} at={word('L08', 'sasta', -2)} out={l9} size={72} rot={-6} />
      <Card id="margin" x={110} y={720} w={860} h={360} rot={-1} at={word('L08', 'sasta', 4)} out={l9} bg={C.card}>
        <div style={{padding: '26px 30px'}}>
          <Label size={22}>Ek tub ka hisaab</Label>
          <div style={{position: 'absolute', left: 30, top: 96, width: 800, height: 200}}>
            <SplitBar w={800} h={200} segs={[
              {label: 'KHARCHA', sub: 'MAKKA · TEL · NAMAK', frac: 0.24, color: C.newsprint, at: word('L08', 'tub', -2)},
              {label: 'MARGIN', sub: 'THEATRE KI KAMAAI', frac: 0.76, color: C.yellow, at: word('L08', 'margin', -4)},
            ]} />
          </div>
        </div>
      </Card>

      {/* L09: average food spend per viewer */}
      <Photo id="hall" src="cinema_hall.jpg" x={90} y={420} w={900} h={430} rot={1.5} at={l9 - 2} enter="up" torn={{top: true, bottom: true}} rough={14} pos="50% 55%" caption="HAR DARSHAK" />
      <Card id="avg" x={190} y={880} w={700} h={300} rot={-2} at={word('L09', 'darshak', -4)} bg={C.yellow} torn={{top: true}} rough={10}>
        <div style={{padding: '30px 44px'}}>
          <Label size={22}>Khaane pe · average</Label>
          <div style={{fontFamily: F.display, fontSize: 150, lineHeight: 1, marginTop: 16}}>
            {frame < word('L09', '150', -4) ? '₹ ?' : <Count from={0} to={150} at={word('L09', '150', -4)} dur={12} />}
          </div>
        </div>
      </Card>
      <Sfx at={word('L09', '150', 8)} name="coin" volume={0.25} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- why
const Why: React.FC = () => {
  const {at, word} = useCues();
  const l11 = at('L11');
  return (
    <AbsoluteFill>
      {/* L10: the model in one card */}
      <Card id="model" x={100} y={420} w={880} h={420} rot={-1} at={0} enter="up" bg={C.card}>
        <div style={{padding: '30px 46px'}}>
          <Label size={22}>Theatre ka khel</Label>
          <Show at={word('L10', 'ticket', -4)} style={{left: 46, top: 96, width: 790}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
              <div style={{fontFamily: F.display, fontSize: 92}}>TICKET</div>
              <div style={{fontFamily: F.display, fontSize: 70, color: C.inkSoft}}>→</div>
              <div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 70}}>andar bulao</div>
            </div>
          </Show>
          <Show at={word('L10', 'popcorn', -4)} style={{left: 46, top: 236, width: 790}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
              <div style={{fontFamily: F.display, fontSize: 92}}>POPCORN</div>
              <div style={{fontFamily: F.display, fontSize: 70, color: C.inkSoft}}>→</div>
              <div style={{fontFamily: F.display, fontSize: 92}}><HL at={word('L10', 'kamao', -2)}>KAMAO ₹</HL></div>
            </div>
          </Show>
        </div>
      </Card>

      {/* L11: inside, you're captive */}
      <Stamp id="captive" text="Captive" x={540} y={960} at={word('L11', 'captive', -2)} out={word('L11', 'bahar', -4)} size={96} rot={-7} />
      <Card id="sign" x={160} y={900} w={760} h={290} rot={2} at={word('L11', 'bahar', -4)} bg={C.paperLight}>
        <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 40px', gap: 34}}>
          <NoSign size={190}><span style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 1}}>TIFFIN</span></NoSign>
          <div>
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: C.inkSoft}}>AKSAR LIKHA HOTA HAI</div>
            <div style={{fontFamily: F.display, fontSize: 76, lineHeight: 1.02, marginTop: 8}}>BAHAR KA<br />KHAANA MANA</div>
          </div>
        </div>
      </Card>
      <Tape id="signTape" x={460} y={884} w={150} rot={-6} at={word('L11', 'bahar', 0)} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- decoy
const MENU: [string, string, string][] = [['SMALL', '₹250', 'small'], ['MEDIUM', '₹380', 'medium'], ['LARGE', '₹400', 'large']];

const Decoy: React.FC = () => {
  const {at, word} = useCues();
  const l13 = at('L13');
  return (
    <AbsoluteFill>
      {/* L12: a trick on the menu board */}
      <Card id="menu" x={110} y={420} w={860} h={760} rot={-1} at={word('L12', 'menu', -4)} enter="drop" bg="#232220" texture="kraft">
        <div style={{padding: '34px 50px'}}>
          <div style={{fontFamily: F.marker, fontSize: 60, color: C.paperLight}}>POPCORN</div>
          <div style={{borderTop: `3px dashed ${C.grey}`, margin: '18px 0 10px'}} />
          {MENU.map(([size, price, k], i) => {
            const t = word('L13', k, -4);
            const pt = word('L13', price.replace('₹', ''), -3);
            return (
              <Show key={k} at={t} style={{left: 50, top: 140 + i * 150, width: 760}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', color: C.paperLight}}>
                  <div style={{fontFamily: F.display, fontSize: 96}}>{size}</div>
                  <Show at={pt} style={{position: 'relative'}}>
                    <div style={{fontFamily: F.display, fontSize: 104, color: k === 'large' ? C.ink : C.paperLight, background: k === 'large' ? C.yellow : undefined, padding: '0 12px'}}>{price}</div>
                  </Show>
                </div>
              </Show>
            );
          })}
        </div>
      </Card>
      <Hand x={560} y={455} at={word('L12', 'chaal', -2)} out={l13} size={60} rot={-5} color={C.yellow}>ek chaal...</Hand>

      {/* L14: medium exists to make large look cheap */}
      <Circle id="medC" cx={540} cy={762} rx={410} ry={84} at={word('L14', 'medium', -2)} />
      <Hand x={160} y={1010} at={word('L14', 'large', -2)} size={54} rot={-3} color={C.yellow}>↑ taaki large "sasta" lage</Hand>
      <Stamp id="decoy" text="Decoy" x={760} y={1090} at={word('L14', 'decoy', -2)} size={90} rot={-9} paper />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- tip
const Tip: React.FC = () => {
  const {at, word} = useCues();
  const l16 = at('L16');
  return (
    <AbsoluteFill>
      {/* L15: before the combo, think */}
      <Card id="tip" x={100} y={420} w={880} h={470} rot={-1.5} at={0} enter="up" bg={C.card}>
        <div style={{padding: '30px 46px'}}>
          <Label size={22}>Agli baar</Label>
          <Show at={word('L15', 'combo', -4)} style={{left: 46, top: 100}}>
            <div style={{fontFamily: F.display, fontSize: 84, color: C.inkSoft}}>COMBO? · LARGE?</div>
          </Show>
          <Show at={word('L15', 'socho', -4)} style={{left: 46, top: 210, width: 800}}>
            <div style={{fontFamily: F.display, fontSize: 84, lineHeight: 1.05}}>SOCHO:<br /><HL at={word('L15', 'chahiye', -2)}>CHAHIYE KITNA?</HL></div>
          </Show>
        </div>
      </Card>
      <Cross id="comboX" x={140} y={530} w={600} h={90} at={word('L15', 'socho', 0)} />

      {/* L16: free drinking water */}
      <Card id="water" x={140} y={925} w={800} h={290} rot={2} at={word('L16', 'paani', -4)} bg={C.paperLight}>
        <div style={{position: 'absolute', left: 40, top: 30, width: 180, height: 240}}>
          <Glass w={180} h={240} fill={0.75} />
        </div>
        <div style={{position: 'absolute', left: 260, top: 46}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: C.inkSoft}}>THEATRE KO DENA HOTA HAI</div>
          <div style={{fontFamily: F.display, fontSize: 84, lineHeight: 1.02, marginTop: 10}}><HL at={word('L16', 'free', -2)}>FREE</HL> PEENE<br />KA PAANI</div>
        </div>
      </Card>
      <Stamp id="freeOk" text="Free ✓" x={830} y={930} at={word('L16', 'dena', -2)} size={64} rot={8} />
      <Sfx at={l16} name="pop" volume={0.2} />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => (
  <AbsoluteFill>
    <SignOff share="L17" sign="L18" who="us dost ko jo har movie pe large combo leta hai →" note="TICKET & F&B: MULTIPLEX AVERAGES FY26 (APPROX.) · MENU PRICES ILLUSTRATIVE" />
  </AbsoluteFill>
);

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  ticket: TicketScene,
  popcorn: PopcornScene,
  why: Why,
  decoy: Decoy,
  tip: Tip,
  outro: Outro,
};
