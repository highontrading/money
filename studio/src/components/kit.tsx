import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ease, pop, stepped} from '../lib/motion';
import {useCues} from '../lib/timeline';
import {C, F} from '../theme';
import {Big, Card, Hand, HL, Label, Marker, Photo, Sfx} from './paper';

// Shared building blocks for explainer beats, all in the paper-collage system.

export const grid = (cell = 40, color = 'rgba(70, 110, 150, 0.16)') => ({
  backgroundImage: `linear-gradient(${color} 1.5px, transparent 1.5px), linear-gradient(90deg, ${color} 1.5px, transparent 1.5px)`,
  backgroundSize: `${cell}px ${cell}px`,
});

// Render children only inside [from, to).
export const Hold: React.FC<{from?: number; to?: number; children: React.ReactNode}> = ({from = -1e9, to = 1e9, children}) => {
  const frame = useCurrentFrame();
  return frame >= from && frame < to ? <>{children}</> : null;
};

export const Headline: React.FC<{words: string[]; at: number; out?: number; x?: number; y?: number; size?: number; label?: string; color?: string}> = ({words, at, out, x = 90, y = 450, size = 170, label, color}) => (
  <Hold from={at} to={out}>
    <div style={{position: 'absolute', left: x, top: y, right: 70}}>
      <Big words={words} at={at} size={size} color={color} />
      {label ? <div style={{marginTop: 26}}><Label size={28}>{label}</Label></div> : null}
    </div>
  </Hold>
);

// A number on a strip of paper: [op] VALUE  ......  LABEL
export const Tile: React.FC<{id: string; y: number; at: number; out?: number; op?: string; value: React.ReactNode; label: string; hi?: boolean; rot?: number; x?: number; w?: number; h?: number; size?: number}> = ({id, y, at, out, op = '', value, label, hi, rot = 0, x = 110, w = 860, h = 170, size = 120}) => (
  <Card id={id} x={x} y={y} w={w} h={h} rot={rot} at={at} out={out} enter="right" bg={hi ? C.yellow : C.card}>
    <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 40px'}}>
      {op ? <div style={{fontFamily: F.display, fontSize: size * 0.8, width: 80, color: C.inkSoft}}>{op}</div> : null}
      <div style={{fontFamily: F.display, fontSize: size, flex: 1, whiteSpace: 'nowrap'}}>{value}</div>
      <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: 2, textAlign: 'right', width: 280, lineHeight: 1.35, whiteSpace: 'pre-line'}}>{label}</div>
    </div>
  </Card>
);

export type Bar = {label: string; value: number; at: number; text?: string; hi?: boolean; color?: string};

// Paper bar chart on graph paper; each bar grows on its own cue.
export const Bars: React.FC<{id: string; x?: number; y?: number; w?: number; h?: number; at: number; out?: number; title: string; bars: Bar[]; max: number; note?: string; rot?: number; baseline?: {value: number; label: string; at: number}}> = ({id, x = 90, y = 420, w = 900, h = 780, at, out, title, bars, max, note, rot = -1, baseline}) => {
  const frame = useCurrentFrame();
  const plotH = h - 300, plotTop = 130, slot = (w - 120) / bars.length;
  return (
    <Card id={id} x={x} y={y} w={w} h={h} rot={rot} at={at} out={out} enter="up" bg={C.card}>
      <div style={{position: 'absolute', inset: 0, ...grid(40)}} />
      <div style={{position: 'relative', padding: '34px 40px'}}>
        <Label size={22}>{title}</Label>
      </div>
      {baseline && frame >= baseline.at ? (
        <>
          <div style={{position: 'absolute', left: 50, right: 50, top: plotTop + plotH - (baseline.value / max) * plotH, borderTop: `4px dashed ${C.red}`}} />
          <div style={{position: 'absolute', right: 54, top: plotTop + plotH - (baseline.value / max) * plotH - 36, fontFamily: F.mono, fontWeight: 700, fontSize: 22, color: C.red}}>{baseline.label}</div>
        </>
      ) : null}
      {bars.map((b, i) => {
        const p = ease(stepped(frame), b.at, b.at + 12);
        const bh = (b.value / max) * plotH * p;
        const cx = 60 + slot * i + slot / 2;
        return (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: cx - slot * 0.32, width: slot * 0.64, top: plotTop + plotH - bh, height: bh, background: b.color ?? (b.hi ? C.yellow : C.paperLight), border: frame >= b.at ? `4px solid ${C.ink}` : 'none'}} />
            {frame >= b.at + 6 ? <div style={{position: 'absolute', left: cx - 100, width: 200, top: plotTop + plotH - bh - 66, textAlign: 'center', fontFamily: F.display, fontSize: 52}}>{b.text ?? b.value}</div> : null}
            <div style={{position: 'absolute', left: cx - 110, width: 220, top: plotTop + plotH + 16, textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 22, lineHeight: 1.3, opacity: frame >= b.at ? 1 : 0.35, whiteSpace: 'pre-line'}}>{b.label}</div>
          </React.Fragment>
        );
      })}
      {note ? <div style={{position: 'absolute', left: 40, bottom: 26, fontFamily: F.mono, fontSize: 20, letterSpacing: 1, color: C.inkSoft}}>{note}</div> : null}
    </Card>
  );
};

export type Item = {t: string; s?: string; at: number; bad?: boolean};

// Notepad checklist; ticks (or crosses) are drawn on as each item is spoken.
export const Checklist: React.FC<{id: string; x?: number; y?: number; w?: number; h?: number; at: number; out?: number; title: string; items: Item[]; rot?: number; gap?: number}> = ({id, x = 110, y = 420, w = 860, h = 760, at, out, title, items, rot = -1.5, gap = 145}) => {
  const frame = useCurrentFrame();
  return (
    <>
      <Card id={id} x={x} y={y} w={w} h={h} rot={rot} at={at} out={out} enter="up" bg={C.paperLight}>
        <div style={{position: 'absolute', left: 90, top: 0, bottom: 0, width: 3, background: 'rgba(210,52,31,0.45)'}} />
        <div style={{padding: '44px 50px 0 130px'}}>
          <Label size={24}>{title}</Label>
          {items.map((it) => (
            <div key={it.t} style={{height: gap, paddingTop: 30, opacity: frame >= it.at - 4 ? 1 : 0.25}}>
              <div style={{fontFamily: F.sans, fontWeight: 900, fontSize: 42, lineHeight: 1.08}}>{it.t}</div>
              {it.s ? <div style={{fontFamily: F.mono, fontWeight: 500, fontSize: 24, color: C.inkSoft, marginTop: 6}}>{it.s}</div> : null}
            </div>
          ))}
        </div>
      </Card>
      {items.map((it, i) => {
        const cy = y + 150 + i * gap;
        return it.bad ? (
          <React.Fragment key={'m' + i}>
            <Marker id={id + 'xa' + i} d={`M${x + 34},${cy - 22} l46,46`} at={it.at} out={out} dur={4} />
            <Marker id={id + 'xb' + i} d={`M${x + 80},${cy - 22} l-46,46`} at={it.at + 3} out={out} dur={4} />
          </React.Fragment>
        ) : (
          <Marker key={'m' + i} id={id + 't' + i} d={`M${x + 34},${cy} l20,24 l42,-58`} at={it.at} out={out} dur={5} color={C.ink} width={10} />
        );
      })}
      {items.map((it, i) => <Sfx key={'s' + i} at={it.at} name="marker" volume={0.22} />)}
    </>
  );
};

// Typed note on paper.
export const Note: React.FC<{id: string; x: number; y: number; w: number; h: number; at: number; out?: number; rot?: number; bg?: string; label?: string; size?: number; children: React.ReactNode; enter?: 'drop' | 'left' | 'right' | 'up'}> = ({id, x, y, w, h, at, out, rot = 0, bg = C.card, label, size = 40, children, enter = 'drop'}) => (
  <Card id={id} x={x} y={y} w={w} h={h} rot={rot} at={at} out={out} enter={enter} bg={bg}>
    <div style={{padding: '32px 40px', fontFamily: F.type, fontSize: size, lineHeight: 1.45}}>
      {label ? <div style={{marginBottom: 16}}><Label size={22}>{label}</Label></div> : null}
      {children}
    </div>
  </Card>
);

// Shared ending: share card over the phone photo, then the Money Theory lockup.
export const SignOff: React.FC<{shareLine: string; logoLine: string; shareWord: string; friendNote: string; disclaimer: string}> = ({shareLine, logoLine, shareWord, friendNote, disclaimer}) => {
  const frame = useCurrentFrame();
  const {at, word} = useCues();
  const l2 = at(logoLine);
  const logo = word(logoLine, 'money', -4);
  const p = Math.min(1.05, pop(frame, logo, 10, 0.6));
  return (
    <>
      <Photo id="so-phone" src="phone.jpg" x={60} y={420} w={868} h={652} rot={-3} at={0} out={l2} enter="up" torn={{right: true, top: true}} rough={14} zoom={0.02} />
      <Card id="so-share" x={560} y={460} w={420} h={170} rot={5} at={word(shareLine, shareWord, -8)} out={l2} enter="drop" bg={C.yellow}>
        <div style={{fontFamily: F.display, fontSize: 92, textAlign: 'center', marginTop: 28}}>SHARE ↗</div>
      </Card>
      <Hand x={110} y={1090} at={word(shareLine, shareWord, 0)} out={l2} size={56} rot={-3} w={860}>{friendNote}</Hand>
      <Hold from={logo}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 520, textAlign: 'center', transform: `scale(${0.8 + 0.2 * p})`}}>
          <div style={{fontFamily: F.display, fontSize: 250, lineHeight: 0.9, color: C.ink}}>MONEY</div>
          <div style={{fontFamily: F.display, fontSize: 250, lineHeight: 0.9, color: C.ink}}><HL at={logo + 6}>THEORY</HL></div>
          <div style={{fontFamily: F.hand, fontWeight: 700, fontSize: 84, marginTop: 30, opacity: ease(stepped(frame), logo + 24, logo + 34)}}>Paisa samjho.</div>
        </div>
        <div style={{position: 'absolute', left: 90, right: 150, top: 1200, fontFamily: F.mono, fontWeight: 500, fontSize: 20, letterSpacing: 1, color: C.inkSoft, textAlign: 'center', lineHeight: 1.6, opacity: ease(frame, logo + 20, logo + 30), whiteSpace: 'pre-line'}}>{disclaimer}</div>
      </Hold>
      <Hold from={l2} to={logo}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', fontFamily: F.hand, fontWeight: 700, fontSize: 110}}>Paisa samjho.</div>
      </Hold>
      <Sfx at={logo} name="stamp" volume={0.4} />
    </>
  );
};
