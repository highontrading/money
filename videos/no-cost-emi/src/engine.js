// Deterministic collage animation engine. renderAt(t) poses every element for time t.
// Motion is quantised "on twos" (15 steps/s) with per-step jitter for a stop-motion feel.
const FPS_STEP = 15;
const W = 1080, H = 1920;
const stage = document.getElementById('stage');
const ELS = [];
const SFX = [];
let uid = 0;

function rng(seed) {
  let a = seed >>> 0;
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
function hash(...n) { let h = 2166136261; for (const x of n) { h ^= x; h = Math.imul(h, 16777619); } return h >>> 0; }
function strSeed(s) { let h = 7; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 2654435761); return h >>> 0; }
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, p) => a + (b - a) * p;
const easeOut = p => 1 - Math.pow(1 - p, 3);
const easeInOut = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const backOut = p => { const c = 1.6; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };

function h(tag, cls, html, style) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  if (style) Object.assign(n.style, style);
  return n;
}

// Jagged torn-paper clip path for a w x h box.
function tornClip(w, h, seed, amp = 5, sides = 'trbl') {
  const r = rng(seed), pts = [];
  const step = 16;
  const j = (on) => on ? (r() - .5) * 2 * amp + (r() < .06 ? (r() - .5) * amp * 3 : 0) : 0;
  for (let x = 0; x <= w; x += step) pts.push([x, amp + j(sides.includes('t'))]);
  for (let y = 0; y <= h; y += step) pts.push([w - amp + j(sides.includes('r')), y]);
  for (let x = w; x >= 0; x -= step) pts.push([x, h - amp + j(sides.includes('b'))]);
  for (let y = h; y >= 0; y -= step) pts.push([amp + j(sides.includes('l')), y]);
  return `polygon(${pts.map(p => `${p[0].toFixed(1)}px ${p[1].toFixed(1)}px`).join(',')})`;
}

// ---- element factory -------------------------------------------------------
// o: {x, y, rot, s, t0, t1, enter, exit, kf, update, jitter, z, sfx, shadow}
function add(node, o) {
  const wrap = h('div', 'el');
  if (o.shadow !== false) wrap.classList.add('shadow');
  wrap.appendChild(node);
  if (o.z != null) wrap.style.zIndex = o.z;
  (o.parent || stage).appendChild(wrap);
  const e = Object.assign({ id: ++uid, node, wrap, x: W / 2, y: H / 2, rot: 0, s: 1, t0: 0, t1: Infinity,
    enter: 'slap', exit: 'pull', jitter: 1, inDur: null, outDur: null }, o);
  ELS.push(e);
  const kind = { slap: 'slap', stamp: 'stamp', tape: 'tape', slideL: 'slide', slideR: 'slide', slideUp: 'slide', drop: 'slap', draw: 'draw', type: 'type' }[e.sfx || e.enter];
  if (kind && isFinite(e.t0)) SFX.push({ t: e.t0, kind, dur: e.sfxDur || 0.5 });
  return e;
}

const IN_DUR = { slap: 0.2, stamp: 0.14, slideL: 0.4, slideR: 0.4, slideUp: 0.45, drop: 0.27, fade: 0.3, tape: 0.14, none: 0, draw: 0, type: 0, grow: 0.35 };
const OUT_DUR = { pull: 0.2, drop: 0.34, cut: 0, fade: 0.25 };

function pose(e, t) {
  // keyframes [{t, x, y, rot, s, d}] override base pose with eased interpolation
  let x = e.x, y = e.y, rot = e.rot, s = e.s;
  if (e.kf) {
    for (const k of e.kf) {
      const d = k.d || 0.45, p = clamp((t - k.t) / d);
      if (t < k.t) break;
      const q = easeInOut(p);
      x = lerp(x, k.x ?? x, q); y = lerp(y, k.y ?? y, q); rot = lerp(rot, k.rot ?? rot, q); s = lerp(s, k.s ?? s, q);
    }
  }
  return { x, y, rot, s };
}

function renderEl(e, t, step) {
  const inD = e.inDur ?? IN_DUR[e.enter] ?? 0.2;
  const outD = e.outDur ?? OUT_DUR[e.exit] ?? 0.2;
  if (t < e.t0 || t >= e.t1 + outD) { e.wrap.style.display = 'none'; return; }
  e.wrap.style.display = '';
  let { x, y, rot, s } = pose(e, t);
  let op = 1, lifted = false;
  const p = inD ? clamp((t - e.t0) / inD) : 1;
  if (p < 1) {
    switch (e.enter) {
      case 'slap': s *= 1 + 0.24 * (1 - easeOut(p)); rot += 4 * (1 - p); op = clamp(p * 2.2); lifted = true; break;
      case 'stamp': s *= 1 + 0.5 * (1 - p); op = clamp(p * 3); break;
      case 'tape': s *= 1 + 0.12 * (1 - p); op = clamp(p * 3); break;
      case 'slideL': x -= (1 - backOut(p)) * 900; rot -= 8 * (1 - p); lifted = true; break;
      case 'slideR': x += (1 - backOut(p)) * 900; rot += 8 * (1 - p); lifted = true; break;
      case 'slideUp': y += (1 - backOut(p)) * 1100; rot += 6 * (1 - p); lifted = true; break;
      case 'drop': y -= 70 * (1 - easeOut(p)); s *= 1 + 0.06 * (1 - p); op = clamp(p * 2); lifted = true; break;
      case 'fade': op = p; break;
      case 'grow': s *= easeOut(p); break;
    }
  }
  if (t >= e.t1) {
    const q = outD ? clamp((t - e.t1) / outD) : 1;
    switch (e.exit) {
      case 'pull': y -= 40 * q; s *= 1 - 0.08 * q; op *= 1 - q; lifted = true; break;
      case 'drop': y += 260 * q * q; rot += 10 * q; op *= 1 - q * q; break;
      case 'fade': op *= 1 - q; break;
      case 'cut': op = 0; break;
    }
  }
  if (e.jitter) {
    const r = rng(hash(e.id, step));
    x += (r() - .5) * 2.6 * e.jitter; y += (r() - .5) * 2.6 * e.jitter; rot += (r() - .5) * 0.7 * e.jitter;
  }
  e.wrap.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%) rotate(${rot.toFixed(2)}deg) scale(${s.toFixed(4)})`;
  e.wrap.style.opacity = op.toFixed(3);
  if (e.shadow !== false) e.wrap.className = 'el ' + (lifted ? 'lift' : 'shadow');
  if (e.update) e.update(t - e.t0, t, e);
}

// ---- builders ----------------------------------------------------------------
const RANSOM_FONTS = [
  ['Anton', 1.0, true], ['Archivo', 0.82, false], ['Abril', 0.95, false], ['AlfaSlab', 0.86, true],
  ['Bebas', 1.12, true], ['Playfair', 0.95, true, 900], ['Oswald', 1.0, true, 700], ['RubikMono', 0.72, false],
];
function ransom(text, size, seed) {
  const r = rng(seed ?? strSeed(text));
  const box = h('div', 'ransom');
  for (const c of text) {
    if (c === ' ') { box.appendChild(h('span', 'sp', '', { fontSize: size + 'px' })); continue; }
    let f; do { f = RANSOM_FONTS[Math.floor(r() * RANSOM_FONTS.length)]; } while (c === '₹' && !f[2]);
    const bgr = r();
    const tex = bgr < 0.6 ? 'tex-cream' : bgr < 0.78 ? 'tex-white' : bgr < 0.92 ? 'tex-black' : 'tex-yellow';
    const s = h('span', 'ch paper ' + tex, c, {
      fontFamily: `${f[0]}, RupeeSans`, fontWeight: f[3] || 400, fontSize: (size * f[1] * (0.9 + r() * 0.2)).toFixed(0) + 'px',
      transform: `rotate(${((r() - .5) * 9).toFixed(1)}deg) translateY(${((r() - .5) * size * 0.08).toFixed(1)}px)`,
      textTransform: 'uppercase',
    });
    box.appendChild(s);
  }
  return box;
}
// Letters of a ransom line slap in one after another.
function addRansom(text, size, o) {
  const node = ransom(text, size, o.seed);
  const e = add(node, Object.assign({ enter: 'none', sfx: 'slap' }, o));
  const kids = [...node.children].filter(k => k.classList.contains('ch'));
  const stagger = o.stagger ?? 0.06;
  const base = [...kids].map(k => k.style.transform);
  e.update = (lt) => {
    kids.forEach((k, i) => {
      const p = clamp((lt - i * stagger) / 0.14);
      k.style.opacity = p > 0 ? 1 : 0;
      k.style.transform = base[i] + ` scale(${(1 + 0.4 * (1 - p)).toFixed(3)})`;
    });
  };
  return e;
}

function chip(html, o = {}) {
  const n = h('div', `chip paper ${o.tex || 'tex-cream'}`, html, {
    fontFamily: o.font || 'Archivo, RupeeSans', fontSize: (o.size || 54) + 'px', padding: o.pad || '0.2em 0.38em 0.16em',
    fontWeight: o.weight || 400,
  });
  if (o.tex !== 'tex-black' && o.tex !== 'tex-yellow' && !o.noClip) n.style.clipPath = tornClip(1200, 400, strSeed(html), 2.2, 'lr');
  if (o.color) n.style.color = o.color;
  if (o.css) Object.assign(n.style, o.css);
  return n;
}

function sheet(w, ht, tex, seed, inner = '', css = {}, amp = 6) {
  const n = h('div', `paper ${tex}`, inner, Object.assign({ width: w + 'px', height: ht + 'px', clipPath: tornClip(w, ht, seed, amp) }, css));
  return n;
}

function img(src, w, css = {}) {
  const n = h('img', '', null, Object.assign({ width: w + 'px', display: 'block' }, css));
  n.src = '../assets/' + src;
  return n;
}

function tape(w, ht, yellow, seed) {
  const n = h('div', 'tape' + (yellow ? ' y' : ''), '', { width: w + 'px', height: ht + 'px', clipPath: tornClip(w, ht, seed || 3, 3, 'lr') });
  return n;
}

function stamp(text, size, sub, slip) {
  return h('div', 'stamp' + (slip ? ' slip' : ''), text + (sub ? `<small>${sub}</small>` : ''), { fontSize: size + 'px' });
}

// ---- hand drawing (SVG) --------------------------------------------------------
const SVGNS = 'http://www.w3.org/2000/svg';
function wobbleEllipse(cx, cy, rx, ry, seed, turns = 1.12) {
  const r = rng(seed), pts = [];
  const n = 64, start = r() * Math.PI * 2;
  for (let i = 0; i <= n * turns; i++) {
    const a = start + (i / n) * Math.PI * 2;
    const k = 1 + (r() - .5) * 0.04 + (i / n) * 0.05;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return smoothPath(pts);
}
function smoothPath(pts) {
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
    d += ` Q${pts[i][0].toFixed(1)},${pts[i][1].toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)}`;
  }
  const l = pts[pts.length - 1];
  return d + ` L${l[0].toFixed(1)},${l[1].toFixed(1)}`;
}
function arrowPath(x1, y1, x2, y2, bend = 0.25, seed = 1) {
  const r = rng(seed);
  const mx = (x1 + x2) / 2 - (y2 - y1) * bend, my = (y1 + y2) / 2 + (x2 - x1) * bend;
  const pts = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24, a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t;
    pts.push([a * x1 + b * mx + c * x2 + (r() - .5) * 2, a * y1 + b * my + c * y2 + (r() - .5) * 2]);
  }
  const ang = Math.atan2(y2 - pts[22][1], x2 - pts[22][0]);
  const L = 34;
  const head = `M${(x2 - L * Math.cos(ang - 0.5)).toFixed(1)},${(y2 - L * Math.sin(ang - 0.5)).toFixed(1)} L${x2},${y2} L${(x2 - L * Math.cos(ang + 0.5)).toFixed(1)},${(y2 - L * Math.sin(ang + 0.5)).toFixed(1)}`;
  return [smoothPath(pts), head];
}
// draws one or more path strings progressively between t0 and t0+dur
function addDraw(paths, o) {
  const svg = document.createElementNS(SVGNS, 'svg');
  svg.setAttribute('class', 'draw'); svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  const els = paths.map(d => {
    const p = document.createElementNS(SVGNS, 'path');
    p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', o.color || 'var(--yellow)');
    p.setAttribute('stroke-width', o.width || 14); p.setAttribute('stroke-linecap', 'round'); p.setAttribute('stroke-linejoin', 'round');
    if (o.opacity) p.setAttribute('opacity', o.opacity);
    svg.appendChild(p); return p;
  });
  const e = add(svg, Object.assign({ x: W / 2, y: H / 2, enter: 'none', sfx: 'draw', jitter: 0.4, shadow: o.shadow ?? false }, o));
  const lens = els.map(p => p.getTotalLength());
  const total = lens.reduce((a, b) => a + b, 0);
  const dur = o.dur || 0.5;
  e.sfxDur = dur;
  SFX[SFX.length - 1].dur = dur;
  e.update = (lt) => {
    let drawn = clamp(lt / dur) * total;
    els.forEach((p, i) => {
      const L = lens[i], d = clamp(drawn, 0, L); drawn -= L;
      p.setAttribute('stroke-dasharray', `${L} ${L}`); p.setAttribute('stroke-dashoffset', (L - d).toFixed(1));
    });
  };
  return e;
}

// typewriter reveal: node's text is revealed char by char between lt=0 and dur
function typeOn(node, dur) {
  const full = node.innerHTML;
  const chars = [...node.textContent].length;
  return (lt) => {
    const n = Math.floor(clamp(lt / dur) * chars);
    node.innerHTML = revealHTML(full, n);
  };
}
function revealHTML(html, n) {
  // reveal n visible characters of an html string, hiding the rest (keeps layout)
  let out = '', seen = 0, i = 0, hidden = false;
  while (i < html.length) {
    if (html[i] === '<') { const j = html.indexOf('>', i); out += html.slice(i, j + 1); i = j + 1; continue; }
    if (html[i] === '&') { const j = html.indexOf(';', i); const ent = html.slice(i, j + 1); if (seen >= n && !hidden) { out += '<span style="opacity:0">'; hidden = true; } out += ent; seen++; i = j + 1; continue; }
    if (seen >= n && !hidden) { out += '<span style="opacity:0">'; hidden = true; }
    out += html[i]; seen++; i++;
  }
  return out + (hidden ? '</span>' : '');
}

function inr(n) { // Indian digit grouping
  const s = Math.round(n).toString(); if (s.length <= 3) return s;
  const last = s.slice(-3); let rest = s.slice(0, -3); const parts = [];
  while (rest.length > 2) { parts.unshift(rest.slice(-2)); rest = rest.slice(0, -2); }
  if (rest) parts.unshift(rest);
  return parts.join(',') + ',' + last;
}
function counter(node, from, to, dur, fmt) {
  return (lt) => { node.textContent = fmt(lerp(from, to, easeOut(clamp(lt / dur)))); };
}

// ---- captions ----------------------------------------------------------------
let CAPS = [];
const capNode = h('div', '', '', {}); capNode.id = 'caption';
function buildCaptions(lines, timeline) {
  CAPS = lines.map((ln, i) => {
    const tl = timeline.lines[i];
    const words = [];
    ln.cap.split(/(\*[^*]+\*)/).filter(Boolean).forEach(part => {
      const key = part.startsWith('*');
      part.replace(/\*/g, '').split(' ').filter(Boolean).forEach(w => words.push({ w, key }));
    });
    const weights = words.map(x => x.w.replace(/[^\p{L}\p{N}₹]/gu, '').length + 1.5);
    const tot = weights.reduce((a, b) => a + b, 0);
    let acc = 0; const span = tl.end - tl.start;
    words.forEach((x, k) => { x.t = tl.start + (acc / tot) * span - 0.05; acc += weights[k]; });
    return { start: tl.start, end: tl.end, next: timeline.lines[i + 1]?.start ?? tl.end + 0.6, words };
  });
}
function renderCaption(t, step) {
  const c = CAPS.find(c => t >= c.start - 0.08 && t < c.next - 0.08);
  if (!c || t > CAPS[CAPS.length - 1].end + 0.6) { capNode.style.display = 'none'; return; }
  capNode.style.display = '';
  const html = c.words.map(x => `<span class="w${x.key ? ' k' : ''}${t >= x.t ? ' on' : ' f'}">${x.w}</span>`).join(' ');
  capNode.innerHTML = `<span class="ln">${html}</span>`;
  const p = clamp((t - c.start + 0.08) / 0.14);
  const r = rng(hash(999, step));
  capNode.style.top = '1350px';
  capNode.style.transform = `translate(${((r() - .5) * 1.6).toFixed(1)}px, ${((r() - .5) * 1.6).toFixed(1)}px) scale(${(1 + 0.06 * (1 - p)).toFixed(3)})`;
}

// ---- main ---------------------------------------------------------------------
const grainEls = [];
function renderAt(t) {
  const step = Math.floor(t * FPS_STEP + 1e-6);
  const q = step / FPS_STEP;
  for (const e of ELS) renderEl(e, q, step);
  renderCaption(q, step);
  grainEls.forEach((g, i) => g.style.display = (step % grainEls.length) === i ? '' : 'none');
}

function finishStage() {
  stage.appendChild(capNode);
  capNode.style.zIndex = 900;
  for (let k = 0; k < 4; k++) {
    const g = h('div', 'grain', '', { backgroundImage: `url(../assets/grain${k}.png)`, zIndex: 1000 });
    stage.appendChild(g); grainEls.push(g);
  }
  const v = h('div', 'vig', '', { zIndex: 1001 }); stage.appendChild(v);
}

async function ready() {
  await document.fonts.ready;
  await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
  // fonts on hidden elements load lazily, so force every face now
  const fams = ['Anton', 'Archivo', 'Abril', 'AlfaSlab', 'Bebas', 'Oswald', 'RubikMono', 'Typewriter', 'Courier', 'Caveat', 'RupeeSans', 'RupeeSlab'];
  await Promise.all(fams.map(f => document.fonts.load(`40px ${f}`, 'Ab₹1')));
  await Promise.all([400, 700, 900].map(w => document.fonts.load(`${w} 40px Playfair`, 'Ab₹1')));
  await Promise.all([400, 700].map(w => document.fonts.load(`${w} 40px Caveat`, 'Ab')));
  await document.fonts.load('700 40px Oswald', 'Ab₹1');
  return true;
}
window.renderAt = renderAt; window.ready = ready; window.getSfx = () => SFX;
