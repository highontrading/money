import {continueRender, delayRender, staticFile} from 'remotion';

const faces: [string, string, string, string?][] = [
  ['Anton', 'anton-latin-400-normal.woff2', '400'],
  ['Anton', 'anton-latin-ext-400-normal.woff2', '400', 'U+0100-024F, U+20A0-20C0'],
  ['Archivo', 'archivo-latin-600-normal.woff2', '600'],
  ['Archivo', 'archivo-latin-700-normal.woff2', '700'],
  ['Archivo', 'archivo-latin-ext-700-normal.woff2', '700', 'U+0100-024F, U+20A0-20C0'],
  ['Archivo', 'archivo-latin-800-normal.woff2', '800'],
  ['Archivo', 'archivo-latin-ext-800-normal.woff2', '800', 'U+0100-024F, U+20A0-20C0'],
  ['Archivo', 'archivo-latin-900-normal.woff2', '900'],
  ['IBM Plex Mono', 'ibm-plex-mono-latin-500-normal.woff2', '500'],
  ['IBM Plex Mono', 'ibm-plex-mono-latin-ext-500-normal.woff2', '500', 'U+0100-024F, U+20A0-20C0'],
  ['IBM Plex Mono', 'ibm-plex-mono-latin-700-normal.woff2', '700'],
  ['IBM Plex Mono', 'ibm-plex-mono-latin-ext-700-normal.woff2', '700', 'U+0100-024F, U+20A0-20C0'],
  ['Caveat', 'caveat-latin-700-normal.woff2', '700'],
  ['Caveat', 'caveat-latin-ext-700-normal.woff2', '700', 'U+0100-024F, U+20A0-20C0'],
  ['Special Elite', 'special-elite-latin-400-normal.woff2', '400'],
  ['Permanent Marker', 'permanent-marker-latin-400-normal.woff2', '400'],
];

let loaded = false;
export const loadFonts = () => {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const handle = delayRender('fonts');
  Promise.all(
    faces.map(([family, file, weight, range]) => {
      const f = new FontFace(family, `url(${staticFile('fonts/' + file)}) format('woff2')`, {weight, ...(range ? {unicodeRange: range} : {})});
      document.fonts.add(f);
      return f.load();
    }),
  ).then(() => continueRender(handle), (e) => {
    console.error(e);
    continueRender(handle);
  });
};
