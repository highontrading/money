import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Sfx} from '../components/paper';
import {loadFonts} from '../lib/fonts';
import {boil, clamp} from '../lib/motion';
import {SceneCtx, Timeline, TimelineCtx, useTL} from '../lib/timeline';
import {C} from '../theme';
import {Atmosphere16, Chapter, ChapterCard, Desk16, Header16, Wipe16} from './chrome';

loadFonts();

export type LongTimeline = Timeline & {chapters: Chapter[]};

export type LongEpisodeDef = {
  id: string;
  timeline: LongTimeline;
  scenes: Record<string, React.FC>;
  // handwritten aside on each chapter card, by chapter id
  notes: Record<string, string>;
  // the end-screen hold starts here (frame); header furniture hides from then on
  endScreenFrom: number;
};

// Music ducks under the voice and opens up in the gaps (chapter cards, end screen).
const duckCurve = (tl: Timeline) => {
  const raw = new Float32Array(tl.duration + 1).fill(1);
  for (const l of tl.lines) for (let f = Math.max(0, l.start - 6); f < Math.min(tl.duration, l.end + 8); f++) raw[f] = 0;
  const out = new Float32Array(raw.length);
  const k = 12;
  for (let i = 0; i < raw.length; i++) {
    let s = 0, n = 0;
    for (let j = i - k; j <= i + k; j++) if (j >= 0 && j < raw.length) { s += raw[j]; n++; }
    out[i] = s / n;
  }
  return out;
};

const WIPE_COLORS = [C.yellow, C.kraft, C.paperLight, C.ink];

// Rostrum camera: slow push-in per scene plus a little hand-held drift.
const Camera: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const TL = useTL();
  const sc = TL.scenes.find((s) => frame >= s.start && frame < s.end) ?? TL.scenes[0];
  const z = interpolate(frame, [sc.start, sc.end], [1.0, 1.03], clamp);
  const b = boil('cam16', frame * 0.5, 2);
  return <AbsoluteFill style={{transform: `translate(${b.x}px, ${b.y}px) scale(${z}) rotate(${b.r * 0.3}deg)`, transformOrigin: '50% 46%'}}>{children}</AbsoluteFill>;
};

export const LongEpisode: React.FC<{def: LongEpisodeDef}> = ({def}) => {
  const TL = def.timeline;
  const duck = useMemo(() => duckCurve(TL), [TL]);
  const chapterStarts = new Set(TL.chapters.map((c) => c.id));
  // first narration line of each chapter: the card leaves just before it
  const firstLine = (chId: string, i: number) => {
    const next = TL.chapters[i + 1];
    const lines = TL.lines.filter((l) => l.start >= TL.chapters[i].start && (!next || l.start < next.start));
    return lines[0]?.start ?? TL.chapters[i].start + 72;
  };
  // scenes that open a chapter get the chapter card instead of a wipe
  const sceneOpensChapter = (start: number) => TL.chapters.some((c) => c.start > 0 && start > c.start && start - c.start < 90);
  return (
    <TimelineCtx.Provider value={TL}>
      <AbsoluteFill style={{background: C.paper}}>
        <Desk16 />
        <Camera>
          {TL.scenes.map((s) => {
            const Comp = def.scenes[s.id];
            if (!Comp) return null;
            return (
              <Sequence key={s.id} from={s.start} durationInFrames={s.end - s.start} name={s.id}>
                <SceneCtx.Provider value={s}>
                  <Comp />
                </SceneCtx.Provider>
              </Sequence>
            );
          })}
        </Camera>
        {TL.scenes.slice(1).filter((s) => !sceneOpensChapter(s.start)).map((s, i) => (
          <React.Fragment key={s.id}>
            <Wipe16 at={s.start} color={WIPE_COLORS[i % WIPE_COLORS.length]} seed={'w16' + def.id + s.id} />
            <Sfx at={s.start - 10} name="whoosh" volume={0.35} />
          </React.Fragment>
        ))}
        {TL.chapters.map((c, i) => (i === 0 || !chapterStarts.has(c.id) ? null : (
          <ChapterCard key={c.id} n={i} title={c.title} note={def.notes[c.id] ?? ''} at={c.start} out={firstLine(c.id, i) - 8} label={i === TL.chapters.length - 1 ? 'RECAP' : undefined} />
        )))}
        <Header16 chapters={TL.chapters} hideFrom={def.endScreenFrom} />
        <Atmosphere16 />
        <Audio src={staticFile(TL.audio)} />
        <Audio src={staticFile(TL.music)} volume={(f) => 0.11 + 0.2 * duck[Math.min(f, duck.length - 1)]} />
      </AbsoluteFill>
    </TimelineCtx.Provider>
  );
};
