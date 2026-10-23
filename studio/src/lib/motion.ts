import {Easing, interpolate, random, spring} from 'remotion';
import {FPS} from '../theme';

// Paper elements move "on twos" (12 fps inside 30 fps) so the motion reads as
// hand-animated stop-motion rather than smooth digital tweening.
export const ON = 2;
export const stepped = (frame: number, n = ON) => Math.floor(frame / n) * n;

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const ease = (frame: number, from: number, to: number, a = 0, b = 1, easing = Easing.bezier(0.33, 0, 0.2, 1)) =>
  interpolate(frame, [from, to], [a, b], {...clamp, easing});

// Overshooting settle, sampled on twos.
export const pop = (frame: number, at: number, damping = 11, mass = 0.55) =>
  spring({frame: stepped(frame) - at, fps: FPS, config: {damping, mass, stiffness: 140}});

// Small per-step wobble, as if each frame were re-placed by hand.
export const boil = (seed: string, frame: number, amount = 1) => {
  const s = Math.floor(frame / 3);
  return {
    x: (random(`${seed}x${s}`) - 0.5) * 1.6 * amount,
    y: (random(`${seed}y${s}`) - 0.5) * 1.6 * amount,
    r: (random(`${seed}r${s}`) - 0.5) * 0.35 * amount,
  };
};

export const sec = (s: number) => Math.round(s * FPS);
