export const W = 1080;
export const H = 1920;
export const FPS = 30;

// Vox-style paper collage palette: warm off-white stock, near-black ink,
// one highlighter yellow, and a red marker reserved for crossings-out and warnings.
export const C = {
  paper: '#ECE6DA',
  paperLight: '#F6F2E9',
  card: '#FBF8F1',
  newsprint: '#DED7C7',
  kraft: '#B98D5C',
  ink: '#141414',
  inkSoft: '#4A4741',
  grey: '#8F897D',
  yellow: '#F5C518',
  red: '#D2341F',
  shadow: 'rgba(30, 22, 10, 0.38)',
};

export const F = {
  display: "'Anton', 'Archivo', sans-serif",
  sans: "'Archivo', sans-serif",
  mono: "'IBM Plex Mono', monospace",
  hand: "'Caveat', cursive",
  type: "'Special Elite', 'IBM Plex Mono', monospace",
  marker: "'Permanent Marker', 'Caveat', cursive",
};

// Instagram Reels covers the top ~220px and bottom ~380px with UI, and the right
// rail with buttons; keep anything that matters inside this box.
export const SAFE = {top: 230, bottom: 1500, left: 70, right: 940};
