import {random} from 'remotion';

export type Edges = {top?: boolean; right?: boolean; bottom?: boolean; left?: boolean};

// clip-path polygon for a sheet of w×h px. Torn edges get dense, irregular
// inward bites; untorn edges get a faint scissor-cut wobble.
export const tornPolygon = (seed: string, w: number, h: number, edges: Edges, rough = 9): string => {
  const pts: [number, number][] = [];
  const edge = (torn: boolean, len: number, key: string, map: (d: number, o: number) => [number, number]) => {
    const step = torn ? 7 : 40;
    const n = Math.max(2, Math.round(len / step));
    for (let i = 0; i < n; i++) {
      const d = (i / n) * len;
      const r1 = random(`${seed}${key}${i}`);
      const r2 = random(`${seed}${key}${i}b`);
      const off = torn ? r1 * rough * (0.4 + 0.6 * r2) + (r2 > 0.9 ? rough * 0.8 : 0) : r1 * 1.4;
      pts.push(map(d, off));
    }
  };
  edge(!!edges.top, w, 't', (d, o) => [d, o]);
  edge(!!edges.right, h, 'r', (d, o) => [w - o, d]);
  edge(!!edges.bottom, w, 'b', (d, o) => [w - d, h - o]);
  edge(!!edges.left, h, 'l', (d, o) => [o, h - d]);
  return `polygon(${pts.map(([x, y]) => `${((x / w) * 100).toFixed(2)}% ${((y / h) * 100).toFixed(2)}%`).join(',')})`;
};

// Hand-drawn stroke path: a line from a to b with a slight bow and wobble.
export const wobblyLine = (seed: string, x1: number, y1: number, x2: number, y2: number, bow = 6) => {
  const mx = (x1 + x2) / 2 + (random(seed + 'mx') - 0.5) * bow;
  const my = (y1 + y2) / 2 + (random(seed + 'my') - 0.5) * bow;
  return `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
};

// Loose marker ellipse that overshoots its start, like a real circled note.
export const markerEllipse = (seed: string, cx: number, cy: number, rx: number, ry: number) => {
  const n = 28;
  const start = random(seed) * Math.PI * 2;
  let d = '';
  for (let i = 0; i <= n + 4; i++) {
    const a = start + (i / n) * Math.PI * 2;
    const k = 1 + (random(`${seed}${i}`) - 0.5) * 0.06 + (i / n) * 0.05;
    const x = cx + Math.cos(a) * rx * k;
    const y = cy + Math.sin(a) * ry * k;
    d += i === 0 ? `M${x.toFixed(1)},${y.toFixed(1)}` : ` L${x.toFixed(1)},${y.toFixed(1)}`;
  }
  return d;
};
