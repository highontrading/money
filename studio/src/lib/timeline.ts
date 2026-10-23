import {createContext, useContext} from 'react';
import timeline from '../data/timeline.json';

export type Word = {text: string; hi: boolean; start: number; end: number};
export type Line = {id: string; scene: string; start: number; end: number; words: Word[]};
export type Scene = {id: string; start: number; end: number};
export type Timeline = {fps: number; duration: number; lines: Line[]; scenes: Scene[]; audio: string; music: string; sfx: {at: number; file: string; volume: number}[]};

// EP01's timeline; every other video provides its own through TimelineCtx.
export const TL = timeline as Timeline;

export const TimelineCtx = createContext<Timeline>(TL);
export const useTL = () => useContext(TimelineCtx);

const findLine = (tl: Timeline, id: string) => {
  const l = tl.lines.find((x) => x.id === id);
  if (!l) throw new Error('unknown line ' + id);
  return l;
};

export const lineById = (id: string) => findLine(TL, id);

// Scenes are rendered inside <Sequence from={scene.start}>, so cue times are
// converted to scene-local frames.
export const SceneCtx = createContext<Scene>({id: '', start: 0, end: 0});

export const useCues = () => {
  const scene = useContext(SceneCtx);
  const tl = useTL();
  return {
    at: (id: string, offset = 0) => findLine(tl, id).start - scene.start + offset,
    end: (id: string, offset = 0) => findLine(tl, id).end - scene.start + offset,
    // frame (scene-local) when a given word of a line starts being spoken
    word: (id: string, needle: string, offset = 0) => {
      const l = findLine(tl, id);
      const clean = (t: string) => t.toLowerCase().replace(/[^\p{L}\p{N}₹%]/gu, '');
      const w = l.words.find((x) => clean(x.text).includes(clean(needle)));
      return (w ? w.start : l.start) - scene.start + offset;
    },
    length: scene.end - scene.start,
  };
};
