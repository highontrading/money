import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Card, Hand, HL, Label, Marker, Sfx, Stamp, Tape} from '../components/paper';
import {ease, stepped} from '../lib/motion';
import {useCues} from '../lib/timeline';
import {C, F} from '../theme';
import {grid} from './Math';

// One scenario: a price bar against the ₹130 deal line, and who pays whom.
const Scenario: React.FC<{id: string; x: number; at: number; listing: number; payer: string; out?: number; rot: number}> = ({id, x, at, listing, payer, out, rot}) => {
  const frame = useCurrentFrame();
  const p = ease(stepped(frame), at + 4, at + 18);
  const H = 220, scale = H / 160; // ₹0..160 mapped to bar height
  return (
    <Card id={id} x={x} y={570} w={430} h={420} rot={rot} at={at} out={out} enter="up" bg={C.card}>
      <div style={{position: 'absolute', inset: 0, ...grid(30)}} />
      <div style={{position: 'relative', padding: '24px 26px'}}>
        <Label size={20}>Listing ₹{listing}</Label>
        <div style={{position: 'absolute', left: 50, top: 130, width: 320, height: H}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: H - 130 * scale, borderTop: `4px dashed ${C.ink}`}} />
          <div style={{position: 'absolute', right: -6, top: H - 130 * scale - 34, fontFamily: F.mono, fontWeight: 700, fontSize: 22}}>SAUDA ₹130</div>
          <div style={{position: 'absolute', left: 40, width: 110, bottom: 0, height: listing * scale * p, background: listing > 130 ? C.yellow : C.paperLight, border: `4px solid ${C.ink}`}} />
          <div style={{position: 'absolute', left: 40, width: 110, bottom: listing * scale * p + 6, fontFamily: F.display, fontSize: 50, textAlign: 'center'}}>₹{Math.round(listing * p)}</div>
        </div>
        <div style={{position: 'absolute', left: 20, right: 20, top: 130 + H + 14, fontFamily: F.sans, fontWeight: 800, fontSize: 32, textAlign: 'center', lineHeight: 1.2}}>{payer}</div>
      </div>
    </Card>
  );
};

export const Settle: React.FC = () => {
  const {at, word} = useCues();
  const l27 = at('L27'), l28 = at('L28'), l29 = at('L29'), l30 = at('L30'), l31 = at('L31');
  return (
    <AbsoluteFill>
      {/* L26-L27: the deal */}
      <Card id="ex" x={90} y={410} w={900} h={130} rot={-1} at={0} enter="left" bg={C.ink} texture="kraft">
        <div style={{fontFamily: F.display, fontSize: 82, color: C.paperLight, textAlign: 'center', marginTop: 16, letterSpacing: 2}}>SETTLEMENT · EXAMPLE</div>
      </Card>
      <Card id="deal" x={160} y={600} w={760} h={460} rot={1.5} at={l27} out={l28} enter="drop" bg={C.paperLight}>
        <div style={{padding: '40px 50px', fontFamily: F.type, fontSize: 46, lineHeight: 1.7}}>
          <div>IPO PRICE ........ ₹100</div>
          <div>GMP .............. ₹30</div>
          <div style={{borderTop: `3px solid ${C.ink}`, marginTop: 14, paddingTop: 14, fontFamily: F.display, fontSize: 96}}>
            SAUDA @ <HL at={word('L27', '130')}>₹130</HL>
          </div>
        </div>
      </Card>
      <Tape id="td1" x={460} y={584} w={150} rot={-5} at={l27 + 2} out={l28} />
      <Hand x={560} y={1080} at={word('L27', 'sauda', 0)} out={l28} size={58} rot={-4}>aap ↔ dealer</Hand>

      {/* L28-L29: two outcomes */}
      <Scenario id="sa" x={80} at={l28} listing={150} payer="Aap ₹20 → dealer" rot={-2} />
      <Scenario id="sb" x={560} at={l29} listing={110} payer="Dealer ₹20 → aap" rot={2} />

      {/* L30: either way, 130 */}
      <Card id="lock" x={160} y={1000} w={760} h={190} rot={-2} at={l30} enter="drop" bg={C.yellow}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 24}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 28, letterSpacing: 2, width: 220, lineHeight: 1.3}}>AAPKE HAATH, DONO CASE</div>
          <div style={{fontFamily: F.display, fontSize: 140}}>₹130</div>
        </div>
      </Card>
      <Sfx at={l30 + 4} name="coin" volume={0.25} />

      {/* L31: one condition */}
      <Stamp id="trust" text="Shart: dealer na palte" x={540} y={760} at={word('L31', 'palte', -4)} size={74} rot={-7} paper />
      <Marker id="ul" d="M250,1210 Q540,1196 830,1214" at={word('L31', 'shart', 0)} dur={8} />
    </AbsoluteFill>
  );
};
