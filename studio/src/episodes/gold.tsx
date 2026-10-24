import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Checklist, Headline, Hold, Note, SignOff, Tile} from '../components/kit';
import {Card, Cross, Hand, HL, Label, Photo, Stamp, Tape} from '../components/paper';
import {EpisodeDef} from '../Episode';
import {Timeline, useCues} from '../lib/timeline';
import {C, F} from '../theme';
import timeline from '../data/gold.json';

// Phone photo is 1400x1051 with the screen centred at (656, 543), tilted 17.9°.
const PS = 0.62;
const AppScreen: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 656 * PS - (262 * PS) / 2, top: 543 * PS - (436 * PS) / 2, width: 262 * PS, height: 436 * PS, transform: 'rotate(17.9deg)', background: C.paperLight, borderRadius: 10, fontFamily: F.mono, textAlign: 'center', paddingTop: 22, opacity: frame >= at ? 1 : 0}}>
      <div style={{fontSize: 12, fontWeight: 700, letterSpacing: 2}}>DIGITAL GOLD</div>
      <div style={{fontFamily: F.display, fontSize: 40, marginTop: 18}}>₹10</div>
      <div style={{fontSize: 11, marginTop: 4}}>SE SHURU</div>
      <div style={{margin: '18px 18px 0', background: C.yellow, border: `2px solid ${C.ink}`, fontSize: 14, fontWeight: 700, padding: '6px 0'}}>BUY NOW</div>
    </div>
  );
};

const Hook: React.FC = () => {
  const {at, word} = useCues();
  const l2 = at('L02'), l3 = at('L03');
  return (
    <AbsoluteFill>
      <Photo id="bangles" src="goldbangles.jpg" x={70} y={410} w={940} h={520} rot={-2} at={0} out={l3} enter="up" torn={{top: true, bottom: true}} rough={14} caption="GEHNA" />
      <Tile id="buy" y={900} at={0} out={l3} value="₹1,00,000" label={'KHAREEDA'} rot={-1.5} size={110} h={170} />
      <Tile id="sell" y={1060} at={word('L01', '84', -6)} out={l3} value={<HL at={word('L01', '84', 0)}>₹84,000</HL>} label={'BECHA\nAGLE DIN'} rot={1} size={110} h={170} />
      <Stamp id="16" text="−₹16,000 ?" x={640} y={560} at={word('L02', '16', -2)} out={l3} size={110} rot={-7} paper />
      <Hand x={130} y={760} at={l2 + 2} out={l3} size={60} rot={-3} color={C.paperLight}>sona gira nahi…</Hand>
      <Card id="cal" x={300} y={440} w={480} h={520} rot={-2} at={l3} enter="drop" bg={C.card}>
        <div style={{height: 110, background: C.red, color: C.paperLight, fontFamily: F.display, fontSize: 80, textAlign: 'center', lineHeight: '110px'}}>NOV</div>
        <div style={{fontFamily: F.display, fontSize: 260, textAlign: 'center', lineHeight: 1.2}}>6</div>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 3, textAlign: 'center'}}>DHANTERAS</div>
      </Card>
      <Tape id="tc" x={460} y={420} w={160} rot={-4} at={l3 + 2} />
      <Hand x={160} y={1040} at={word('L03', 'bill', -2)} size={64} rot={-2}>pehle yeh bill samjho ↓</Hand>
    </AbsoluteFill>
  );
};

const Row: React.FC<{at: number; k: string; v: string; bold?: boolean}> = ({at, k, v, bold}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: F.type, fontSize: bold ? 50 : 42, fontWeight: bold ? 700 : 400, padding: '14px 0', borderTop: bold ? `3px dashed ${C.ink}` : undefined}}>
      <span>{k}</span><span>{v}</span>
    </div>
  );
};

const Bill: React.FC = () => {
  const {at, word} = useCues();
  const l7 = at('L07'), l8 = at('L08');
  const rx = 150, ry = 420;
  return (
    <AbsoluteFill>
      <Card id="bill" x={rx} y={ry} w={780} h={620} rot={-1.5} at={0} enter="up" bg={C.paperLight} torn={{bottom: true}} rough={12}>
        <div style={{padding: '34px 50px'}}>
          <div style={{textAlign: 'center', marginBottom: 14}}><Label size={22}>Example bill</Label></div>
          <Row at={word('L04', 'keemat', -4)} k="Sona (asli keemat)" v="₹86,000" />
          <Row at={word('L05', 'making', -4)} k="Making (~)" v="₹11,000" />
          <Row at={word('L06', 'gst', -4)} k="GST 3% (~)" v="₹3,000" />
          <Row at={word('L06', 'total', -2)} k="TOTAL" v="₹1,00,000" bold />
        </div>
      </Card>
      <Hand x={160} y={1060} at={word('L05', 'design', -2)} out={at('L06')} size={52} rot={-2}>design bhaari → charge zyada</Hand>
      <Cross id="xm" x={rx + 40} y={ry + 172} w={700} h={56} at={word('L07', 'making', -2)} />
      <Cross id="xg" x={rx + 40} y={ry + 248} w={700} h={56} at={word('L07', 'gst', 0)} />
      <Hand x={140} y={1060} at={word('L07', 'wapas', -2)} out={l8} size={60} rot={-2} color={C.red}>bechte waqt: wapas nahi</Hand>
      <Card id="katauti" x={160} y={1060} w={760} h={150} rot={1.5} at={word('L08', 'katauti', -4)} bg={C.card}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: F.type, fontSize: 40, padding: '40px 40px'}}><span>Sone pe bhi thodi katauti</span><span>↓</span></div>
      </Card>
      <Stamp id="84" text="₹84,000" sub="HAATH MEIN" x={720} y={560} at={word('L08', '84', -4)} size={110} rot={-8} paper />
    </AbsoluteFill>
  );
};

const Options: React.FC = () => {
  const {at, word} = useCues();
  const l10 = at('L10'), l12 = at('L12');
  return (
    <AbsoluteFill>
      <Card id="wear" x={80} y={440} w={430} h={340} rot={-2} at={0} out={l10} enter="left" bg={C.card}>
        <div style={{padding: 30}}><Label size={22}>Pehnna hai</Label><div style={{fontFamily: F.display, fontSize: 84, marginTop: 34, whiteSpace: 'nowrap'}}>GEHNA ✓</div></div>
      </Card>
      <Card id="inv" x={570} y={470} w={430} h={340} rot={2} at={word('L09', 'investment', -4)} out={l10} enter="right" bg={C.yellow}>
        <div style={{padding: 30}}><Label size={22}>Investment</Label><div style={{fontFamily: F.display, fontSize: 72, marginTop: 40, whiteSpace: 'nowrap'}}>AUR RAASTE</div></div>
      </Card>
      <Photo id="bse" src="bse.jpg" x={70} y={410} w={940} h={460} rot={-1.5} at={l10} out={l12} enter="up" torn={{top: true, bottom: true}} rough={14} caption="STOCK EXCHANGE" />
      <Card id="etf" x={110} y={820} w={860} h={200} rot={1} at={l10 + 4} out={l12} bg={C.yellow}>
        <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 40px'}}>
          <div style={{fontFamily: F.display, fontSize: 120, flex: 1}}>GOLD ETF</div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 2, textAlign: 'right'}}>SEBI<br />REGULATED</div>
        </div>
      </Card>
      <Hold from={word('L11', 'making', -4)} to={l12}>
        <Card id="etfpts" x={110} y={1040} w={860} h={180} rot={-1} at={word('L11', 'making', -4)} bg={C.card}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30, lineHeight: 1.5, padding: '22px 36px'}}>
            ✗ MAKING &nbsp; ✗ GST WALI CHOT<br />
            <span style={{opacity: 1}}>✓ <HL at={word('L11', 'saalana', 0)}>CHHOTA SAALANA KHARCHA</HL> · DEMAT CHAHIYE</span>
          </div>
        </Card>
      </Hold>
      <Headline words={['Demat', 'nahi?']} at={l12} size={150} y={460} />
      <Card id="mf" x={110} y={760} w={860} h={300} rot={-1.5} at={word('L12', 'mutual', -4)} bg={C.yellow}>
        <div style={{padding: '30px 40px'}}>
          <div style={{fontFamily: F.display, fontSize: 92, whiteSpace: 'nowrap'}}>GOLD MUTUAL FUND</div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26, letterSpacing: 2, marginTop: 10}}>WAHI ETF, MUTUAL FUND KE RAASTE</div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

const Digital: React.FC = () => {
  const {at, word} = useCues();
  const l14 = at('L14'), l16 = at('L16');
  return (
    <AbsoluteFill>
      <Photo id="phone" src="phone.jpg" x={40} y={440} w={1400 * PS} h={1051 * PS} rot={-3} at={0} out={l14} enter="up" torn={{right: true, bottom: true}} rough={14} zoom={0.02} overlay={<AppScreen at={6} />} />
      <Hand x={140} y={1110} at={word('L13', 'aasaan', -2)} out={l14} size={60} rot={-2}>aasaan lagta hai…</Hand>
      <Note id="sebi" x={110} y={430} w={860} h={420} at={l14} out={l16} rot={-1.5} label="SEBI · November 2025" size={44}>
        Digital gold SEBI ke <HL at={word('L14', 'regulation', -2)}>regulation se bahar</HL> hai.
      </Note>
      <Stamp id="warn" text="Chetavni" x={760} y={470} at={word('L14', 'chetavni', -2)} out={l16} size={84} rot={8} />
      <Checklist id="risks" x={110} y={880} w={860} h={330} at={word('L15', 'investor', -6)} out={l16} title="Dhyan do" gap={110} rot={1}
        items={[
          {t: 'Investor protection nahi', at: word('L15', 'protection', -4), bad: true},
          {t: 'Khareed pe 3% GST', at: word('L15', 'gst', -6), bad: true},
        ]} />
      <Card id="sgb" x={110} y={430} w={860} h={380} rot={-1} at={l16} enter="up" bg={C.card}>
        <div style={{padding: '34px 40px'}}>
          <Label size={22}>RBI · Sovereign Gold Bond</Label>
          <div style={{fontFamily: F.display, fontSize: 120, marginTop: 24, lineHeight: 1}}>SGB</div>
          <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 40, marginTop: 14}}>aakhri naya issue: February 2024</div>
        </div>
      </Card>
      <Stamp id="noissue" text="Naya issue nahi" x={600} y={880} at={word('L16', 'naya', -2)} size={84} rot={-6} paper />
      <Hand x={140} y={1040} at={at('L17')} size={58} rot={-2}>purane bonds → sirf exchange pe</Hand>
    </AbsoluteFill>
  );
};

const Check: React.FC = () => {
  const {word} = useCues();
  return (
    <AbsoluteFill>
      <Checklist id="jw" at={0} title="Jeweller ke paas · check karo" gap={175} h={720}
        items={[
          {t: 'HUID hallmark', s: '6 akshar ka code · BIS CARE app', at: word('L19', 'huid', -4)},
          {t: 'Bill mein alag-alag', s: 'sona · making · GST', at: word('L20', 'bill', -4)},
          {t: 'Buyback policy', s: 'pehle pucho: kitna katenge?', at: word('L21', 'buyback', -4)},
        ]} />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const {word} = useCues();
  const send = word('L22', 'bhejo', -8);
  return (
    <AbsoluteFill>
      <SignOff shareLine="L22" logoLine="L23" shareWord="bhejo" friendNote="us dost ko jo Dhanteras pe sona lene wala hai →"
        disclaimer={'EDUCATIONAL ONLY · NOT FINANCIAL ADVICE\nBILL IS AN EXAMPLE · ACTUAL MAKING / BUYBACK VARY\nSEBI CAUTION: NOV 2025 · LAST SGB ISSUE: FEB 2024'} />
      <Hold to={send}>
        <Card id="sum" x={110} y={480} w={860} h={420} rot={-1.5} at={0} out={send} bg={C.yellow} z={80}>
          <div style={{padding: '40px 50px', fontFamily: F.display, fontSize: 96, lineHeight: 1.15}}>
            PEHNNE KE LIYE → GEHNA<br />INVESTMENT KE LIYE → <HL at={word('L22', 'investment', 0)} color={C.paperLight}>ETF</HL>
          </div>
        </Card>
      </Hold>
    </AbsoluteFill>
  );
};

export const gold: EpisodeDef = {
  id: 'dhanteras-gold',
  topic: 'DHANTERAS: SONA KAISE?',
  timeline: timeline as Timeline,
  scenes: {hook: Hook, bill: Bill, options: Options, digital: Digital, check: Check, outro: Outro},
};
