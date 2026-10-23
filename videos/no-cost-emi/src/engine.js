// Deterministic collage animation engine. renderAt(t) poses every element for time t.
// Motion is quantised "on twos" (15 steps/s) with per-step jitter for a stop-motion feel.
const FPS_STEP = 15;
const W = 1080, H = 1920;
const stage = document.getElementById('stage');
// everything that belongs to a scene lives in #world, which the virtual camera moves
const world = document.createElement('div');
world.id = 'world';
Object.assign(world.style, { position: 'absolute', left: 0, top: 0, width: '1080px', height: '1920px', transformOrigin: '0 0', zIndex: 5 });
stage.appendChild(world);
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
  (o.parent || world).appendChild(wrap);
  const e = Object.assign({ id: ++uid, node, wrap, x: W / 2, y: H / 2, rot: 0, s: 1, t0: 0, t1: Infinity,
    enter: 'slap', exit: 'cut', jitter: 1, inDur: null, outDur: null }, o);
  ELS.push(e);
  const kind = { slap: 'slap', stamp: 'stamp', tape: 'tape', slideL: 'slide', slideR: 'slide', slideUp: 'slide', drop: 'slap', draw: 'draw', type: 'type', whoosh: 'whoosh' }[e.sfx || e.enter];
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
  if (e.smooth && e.update) e.update(t - e.t0, t, e);
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
  if (e.float !== 0) { // nothing on the board is ever dead still
    const f = e.float ?? 1;
    x += Math.sin(t * 0.9 + e.id) * 2.4 * f; y += Math.cos(t * 0.73 + e.id * 1.7) * 3 * f; rot += Math.sin(t * 0.5 + e.id) * 0.35 * f;
  }
  if (e.jitter) {
    const r = rng(hash(e.id, step));
    x += (r() - .5) * 2.6 * e.jitter; y += (r() - .5) * 2.6 * e.jitter; rot += (r() - .5) * 0.7 * e.jitter;
  }
  e.wrap.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%) rotate(${rot.toFixed(2)}deg) scale(${s.toFixed(4)})`;
  e.wrap.style.opacity = op.toFixed(3);
  if (e.shadow !== false) e.wrap.className = 'el ' + (lifted || e.lift ? 'lift' : 'shadow');
  if (e.update && !e.smooth) e.update(t - e.t0, t, e);
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
const plain = w => w.replace(/[^\p{L}\p{N}₹%]/gu, '');
// Caption words are Roman Hinglish, the timed words are Devanagari: map by relative
// position in the line, interpolated through the real word start/end times.
function timeAt(tl, f) {
  const ws = tl.words;
  if (!ws || !ws.length) return tl.start + f * (tl.end - tl.start);
  const len = ws.map(w => plain(w.w).length + 1), tot = len.reduce((a, b) => a + b, 0);
  let acc = 0;
  for (let j = 0; j < ws.length; j++) {
    const f0 = acc / tot, f1 = (acc + len[j]) / tot;
    if (f < f1 || j === ws.length - 1) return ws[j].t0 + clamp((f - f0) / (f1 - f0)) * (ws[j].t1 - ws[j].t0);
    acc += len[j];
  }
}
function buildCaptions(lines, timeline) {
  if (CAPS.length) return;
  CAPS = lines.map((ln, i) => {
    const tl = timeline.lines[i];
    const words = [];
    ln.cap.split(/(\*[^*]+\*)/).filter(Boolean).forEach(part => {
      const key = part.startsWith('*');
      part.replace(/\*/g, '').split(' ').filter(Boolean).forEach(w => words.push({ w, key }));
    });
    const weights = words.map(x => plain(x.w).length + 1);
    const tot = weights.reduce((a, b) => a + b, 0);
    let acc = 0;
    words.forEach((x, k) => { x.t = timeAt(tl, acc / tot) - 0.03; acc += weights[k]; x.te = timeAt(tl, acc / tot); });
    return { start: tl.start, end: tl.end, next: timeline.lines[i + 1]?.start ?? tl.end + 0.6, words };
  });
}
// time a caption word is spoken: cue(2, '30,478') -> seconds. which = 't' (start) or 'te' (end)
function cue(i, word, which = 't') {
  buildCaptions(window.__SCRIPT.lines, window.__TIMELINE);
  const ws = CAPS[i].words, needle = plain(word).toLowerCase();
  const hit = ws.find(x => plain(x.w).toLowerCase().includes(needle));
  if (!hit) throw new Error(`cue: "${word}" not in line ${i}: ${ws.map(x => x.w).join(' ')}`);
  return hit[which];
}
function renderCaption(t, step) {
  const c = CAPS.find(c => t >= c.start - 0.12 && t < c.next - 0.12);
  if (!c || t > c.end + 0.9) { capNode.style.display = 'none'; return; }
  capNode.style.display = '';
  const html = c.words.map(x => `<span class="w${x.key ? ' k' : ''}${t >= x.t ? ' on' : ' f'}">${x.w}</span>`).join(' ');
  capNode.innerHTML = `<span class="ln">${html}</span>`;
  const p = clamp((t - c.start + 0.12) / 0.14);
  const r = rng(hash(999, step));
  capNode.style.top = '1350px';
  capNode.style.transform = `translate(${((r() - .5) * 1.6).toFixed(1)}px, ${((r() - .5) * 1.6).toFixed(1)}px) scale(${(1 + 0.06 * (1 - p)).toFixed(3)})`;
}

// ---- virtual camera -------------------------------------------------------------
// slow push-ins per scene, punch-ins on reveals, shake on stamp hits
const CAM = { scenes: [], punches: [], shakes: [] };
function camScene(t0, t1, o = {}) { CAM.scenes.push(Object.assign({ t0, t1, s0: 1.0, s1: 1.05, ox: 540, oy: 860, dx: 0, dy: 0 }, o)); }
function punch(t, amt = 0.07, fx = 540, fy = 900, hold = 1.1) { CAM.punches.push({ t, amt, fx, fy, hold }); }
function shake(t, amp = 9) { CAM.shakes.push({ t, amp }); }
function camAt(t) {
  let s = 1, ox = 540, oy = 860, dx = 0, dy = 0;
  const sc = CAM.scenes.find(c => t >= c.t0 && t < c.t1);
  if (sc) {
    const p = easeInOut(clamp((t - sc.t0) / (sc.t1 - sc.t0)));
    s = lerp(sc.s0, sc.s1, p); ox = sc.ox; oy = sc.oy; dx = sc.dx * p; dy = sc.dy * p;
  }
  let best = 0, fx = ox, fy = oy, mult = 1;
  for (const k of CAM.punches) {
    if (t < k.t) continue;
    const up = easeOut(clamp((t - k.t) / 0.18)), down = 1 - easeInOut(clamp((t - k.t - k.hold) / 0.55));
    const w = up * down;
    if (w <= 0) continue;
    mult *= 1 + k.amt * w;
    if (w > best) { best = w; fx = k.fx; fy = k.fy; }
  }
  s *= mult;
  const OX = lerp(ox, fx, best), OY = lerp(oy, fy, best);
  let sx = 0, sy = 0;
  for (const k of CAM.shakes) {
    const u = t - k.t;
    if (u < 0 || u > 0.5) continue;
    const a = k.amp * Math.exp(-u * 9);
    sx += a * Math.sin(u * 70); sy += a * Math.cos(u * 53);
  }
  return { s, tx: OX * (1 - s) + dx + sx, ty: OY * (1 - s) + dy + sy };
}

// ---- paper-wipe transition ------------------------------------------------------------
// a big torn sheet sweeps across; the scene underneath swaps while it is fully covered (tm)
function wipe(tm, o = {}) {
  const w = 2100, ht = 2300, dir = o.dir ?? 1;
  const inner = `<div class="type" style="position:absolute;left:${dir > 0 ? 300 : 700}px;top:820px;width:1100px;font-size:34px;line-height:1.5;color:rgba(30,30,30,.5)">
    ${'MONEY THEORY · FILE 02 · NO-COST EMI · '.repeat(14)}</div>
    <div style="position:absolute;left:0;right:0;top:${o.band ?? 1100}px;height:110px;background:rgba(243,194,33,.93);transform:rotate(-4deg)"></div>`;
  const node = sheet(w, ht, o.tex || 'tex-aged', strSeed('wipe' + tm), inner, {}, 22);
  const e = add(node, { parent: stage, z: 700, x: 0, y: H / 2, rot: 0, t0: tm - 0.34, t1: tm + 0.34, enter: 'none', exit: 'cut',
    smooth: true, float: 0, jitter: 0, sfx: 'whoosh', shadow: true, lift: true });
  e.update = (lt, t) => {
    const p = easeInOut(clamp((t - (tm - 0.34)) / 0.68));
    e.x = dir > 0 ? lerp(W + w / 2, -w / 2, p) : lerp(-w / 2, W + w / 2, p);
    e.rot = (1 - 2 * p) * 3 * dir;
  };
  return e;
}

// ---- main ---------------------------------------------------------------------
const grainEls = [];
function renderAt(t) {
  const step = Math.floor(t * FPS_STEP + 1e-6);
  const q = step / FPS_STEP;
  for (const e of ELS) renderEl(e, e.smooth ? t : q, step);
  renderCaption(q, step);
  const c = camAt(t);
  world.style.transform = `translate(${c.tx.toFixed(2)}px, ${c.ty.toFixed(2)}px) scale(${c.s.toFixed(5)})`;
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
window.getCam = () => CAM;
