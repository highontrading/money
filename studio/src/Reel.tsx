import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Atmosphere, Captions, Desk, Header, Wipe} from './components/chrome';
import {Sfx} from './components/paper';
import {loadFonts} from './lib/fonts';
import {boil, clamp} from './lib/motion';
import {SceneCtx, Timeline, TimelineCtx, useTL} from './lib/timeline';
import {C} from './theme';

loadFonts();

export type ReelProps = {
  tl: Timeline;
  scenes: Record<string, React.FC>;
  topic: string;
  episode?: string;
};

// Music sits under the voice: ducked while a line is being spoken.
const duckCurve = (tl: Timeline) => {
  const raw = new Float32Array(tl.duration + 1).fill(1);
  for (const l of tl.lines) for (let f = Math.max(0, l.start - 4); f < Math.min(tl.duration, l.end + 6); f++) raw[f] = 0;
  const out = new Float32Array(raw.length);
  const k = 10;
  for (let i = 0; i < raw.length; i++) {
    let s = 0, n = 0;
    for (let j = i - k; j <= i + k; j++) if (j >= 0 && j < raw.length) { s += raw[j]; n++; }
    out[i] = s / n;
  }
  return out;
};

const WIPE_COLORS = [C.yellow, C.ink, C.kraft, C.paperLight];

// Rostrum-camera feel: slow push-in per scene plus a little hand-held drift.
const Camera: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const TL = useTL();
  const sc = TL.scenes.find((s) => frame >= s.start && frame < s.end) ?? TL.scenes[0];
  const z = interpolate(frame, [sc.start, sc.end], [1.0, 1.035], clamp);
  const b = boil('cam', frame * 0.5, 2.2);
  return <AbsoluteFill style={{transform: `translate(${b.x}px, ${b.y}px) scale(${z}) rotate(${b.r * 0.4}deg)`, transformOrigin: '50% 42%'}}>{children}</AbsoluteFill>;
};

export const Reel: React.FC<ReelProps> = ({tl, scenes, topic, episode}) => {
  const duck = useMemo(() => duckCurve(tl), [tl]);
  return (
    <TimelineCtx.Provider value={tl}>
      <AbsoluteFill style={{background: C.paper}}>
        <Desk />
        <Camera>
          {tl.scenes.map((s) => {
            const Comp = scenes[s.id];
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
        {tl.scenes.slice(1).map((s, i) => (
          <React.Fragment key={s.id}>
            <Wipe at={s.start} color={WIPE_COLORS[i % WIPE_COLORS.length]} seed={'wipe' + s.id} />
            <Sfx at={s.start - 10} name="whoosh" volume={0.4} />
          </React.Fragment>
        ))}
        <Header episode={episode} topic={topic} />
        <Captions />
        <Atmosphere />
        <Audio src={staticFile(tl.audio)} />
        <Audio src={staticFile(tl.music)} volume={(f) => 0.13 + 0.17 * duck[Math.min(f, duck.length - 1)]} />
      </AbsoluteFill>
    </TimelineCtx.Provider>
  );
};
