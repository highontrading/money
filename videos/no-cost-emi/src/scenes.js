// Scene layout for "No-cost EMI ka asli cost". All times come from the voice timeline.
const SCRIPT = window.__SCRIPT, TL = window.__TIMELINE;
const L = i => TL.lines[i];
const sceneEnd = name => {
  const idx = TL.lines.findIndex((l, i) => l.scene === name && TL.lines[i + 1]?.scene !== name);
  return TL.lines[idx + 1] ? TL.lines[idx + 1].start - 0.16 : Infinity;
};
const END = TL.duration;
const r = rng(42);

// ===== persistent frame ==========================================================
(function frame() {
  const marks = [[64, 96], [1016, 96], [64, 1824], [1016, 1824], [540, 52], [540, 1868], [34, 960], [1046, 960]];
  let d = [];
  for (const [x, y] of marks) {
    d.push(`M${x - 26},${y} L${x + 26},${y} M${x},${y - 26} L${x},${y + 26}`);
    d.push(`M${x + 13},${y} A13,13 0 1,1 ${x - 13},${y} A13,13 0 1,1 ${x + 13},${y}`);
  }
  const svg = document.createElementNS(SVGNS, 'svg');
  svg.setAttribute('class', 'draw'); svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = d.map(p => `<path d="${p}" fill="none" stroke="#24364f" stroke-width="3" opacity=".8"/>`).join('') +
    // pencil doodles like the reference margins
    `<path d="M70,1500 q30,-40 70,-6 t70,4" fill="none" stroke="#24364f" stroke-width="3" opacity=".55"/>` +
    `<path d="M930,1560 l80,-30 m-22,-8 l22,8 l-12,20" fill="none" stroke="#24364f" stroke-width="3" opacity=".55"/>` +
    `<circle cx="120" cy="1640" r="26" fill="none" stroke="#24364f" stroke-width="3" opacity=".5"/>` +
    `<circle cx="168" cy="1650" r="14" fill="none" stroke="#24364f" stroke-width="3" opacity=".5"/>`;
  add(svg, { x: W / 2, y: H / 2, enter: 'none', jitter: 0.3, shadow: false, z: 1 });

  add(chip('MONEY THEORY', { size: 40 }), { x: 230, y: 176, rot: -2, enter: 'none', z: 800, jitter: 0.6 });
  add(chip('FILE&nbsp;Nº&nbsp;02', { size: 30, font: 'Typewriter', tex: 'tex-white' }), { x: 200, y: 236, rot: 1.5, enter: 'none', z: 800, jitter: 0.6 });
  add(chip('<span style="color:#f3c221">●</span> NO-COST EMI', { size: 34, tex: 'tex-black' }), { x: 850, y: 180, rot: 2, enter: 'none', z: 800, jitter: 0.6 });

  const side = h('div', 'type', 'RBI CIRCULAR · 17 SEP 2013 · EXAMPLE: ₹30,000 · 6 MONTHS · 16% P.A. · GST 18% · ILLUSTRATIVE ONLY', {
    fontSize: '22px', color: '#1d2c42', whiteSpace: 'nowrap', letterSpacing: '0.06em' });
  add(side, { x: 1046, y: 1180, rot: 90, enter: 'none', shadow: false, jitter: 0.3, z: 2 });
  const note = h('div', 'hand', 'fine print / notes —', { fontSize: '40px', whiteSpace: 'nowrap', opacity: .8 });
  add(note, { x: 40, y: 760, rot: -90, enter: 'none', shadow: false, jitter: 0.4, z: 2 });
  add(h('div', 'type', '■ MONEY THEORY · FILE 02', { fontSize: '24px', color: '#14233a', letterSpacing: '0.08em' }),
    { x: 540, y: 1590, enter: 'none', shadow: false, jitter: 0.3, z: 2 });
})();

// ===== HOOK =====================================================================
(function hook() {
  const end = sceneEnd('hook');
  addRansom('NO-COST EMI', 118, { x: 540, y: 365, t0: 0.05, t1: end, stagger: 0.05, z: 60 });
  add(chip('KA ASLI COST?', { size: 44, tex: 'tex-black' }), { x: 540, y: 478, rot: -1.5, t0: 0.7, t1: end, z: 61 });

  const news = sheet(380, 560, 'tex-news', 11,
    `<div class="type" style="padding:26px 24px;font-size:19px;line-height:1.5;color:#2a2a2a;column-count:2;column-gap:18px">${'FESTIVE SALE ' .repeat(2)}No cost EMI on all smartphones. Pay in easy monthly instalments. Offer valid on select cards. *T&amp;C apply. Interest charged by the bank is offered as an upfront discount. GST on interest is payable by the customer. Processing fee applicable as per bank. Credit limit will be blocked. Late payment fees as applicable. Foreclosure charges may apply. Discount may be reversed on cancellation.</div>`);
  add(news, { x: 250, y: 860, rot: 5, t0: 0.0, t1: end, enter: 'slideL', z: 10 });
  const doc = sheet(560, 820, 'tex-aged', 12,
    `<div class="type" style="padding:30px 34px;font-size:24px;line-height:1.55;color:#333">ORDER #NC-0225<br>ITEM: SMARTPHONE 128GB<br>PRICE: ₹30,000<br>PLAN: 6 × ₹5,000<br>INTEREST: 0%*</div>`);
  add(doc, { x: 620, y: 880, rot: -2.5, t0: 0.0, t1: end, enter: 'slideUp', z: 11 });

  add(img('ht_phone.png', 400), { x: 600, y: 900, rot: -4, t0: 0.25, t1: end, z: 20 });
  add(tape(170, 50, false, 5), { x: 470, y: 600, rot: -38, t0: 0.55, t1: end, enter: 'tape', z: 22 });
  add(tape(170, 50, false, 6), { x: 770, y: 1210, rot: -30, t0: 0.62, t1: end, enter: 'tape', z: 22 });
  // yellow L-bracket frame like the reference
  addDraw(['M360,700 L360,1180 L520,1180', 'M690,590 L850,590 L850,820'], { t0: 0.75, t1: end, dur: 0.4, width: 18, z: 25 });

  const l0 = L(0), l1 = L(1), l2 = L(2);
  add(chip('₹30,000', { size: 96, font: 'Anton, RupeeSans', pad: '0.08em 0.3em 0.02em' }), { x: 290, y: 700, rot: -7, t0: l0.start + 0.1, t1: end, z: 40 });
  add(chip('6 MAHINE', { size: 56 }), { x: 850, y: 900, rot: 6, t0: l0.start + 1.45, t1: end, z: 40 });
  add(chip('EMI', { size: 56, tex: 'tex-black' }), { x: 880, y: 985, rot: -3, t0: l0.start + 2.3, t1: end, z: 41 });
  add(chip('INTEREST', { size: 54 }), { x: 245, y: 1080, rot: -3, t0: l1.start, t1: end, z: 42 });
  add(chip('0%', { size: 150, font: 'Anton', tex: 'tex-yellow', pad: '0.02em 0.22em 0' }), { x: 530, y: 1135, rot: 5, t0: l1.start + 0.55, t1: end, z: 43 });
  add(stamp('PAID ₹30,478', 50, 'not ₹30,000', true), { x: 700, y: 610, rot: -9, t0: l2.start + 1.0, t1: end, enter: 'stamp', z: 50, shadow: false });
  addDraw([wobbleEllipse(705, 612, 285, 104, 9)], { t0: l2.start + 1.5, t1: end, dur: 0.45, width: 13, z: 51 });
  add(chip('KAISE?', { size: 70, tex: 'tex-black' }), { x: 850, y: 1190, rot: -6, t0: l2.end - 0.7, t1: end, z: 52 });
})();

// ===== RBI ======================================================================
(function rbi() {
  const end = sceneEnd('rbi'), l3 = L(3), l4 = L(4);
  add(chip('RBI CIRCULAR · 17 SEP 2013', { size: 40, font: 'Typewriter, RupeeSlab', tex: 'tex-white' }), { x: 540, y: 400, rot: -2, t0: l3.start, t1: end, z: 30 });
  const quote = h('div', 'type', '“…since the very concept of <span class="hl">zero percent interest is non-existent</span>…”', {
    fontSize: '56px', lineHeight: '1.32', color: '#1b1b1b' });
  const doc = sheet(860, 560, 'tex-cream', 21, '', { padding: '64px 60px' });
  const hdr = h('div', 'mono', 'RBI/2013-14/292 · PARA 3 · CREDIT CARD EMI', { fontSize: '22px', letterSpacing: '0.05em', color: '#555', marginBottom: '26px' });
  doc.appendChild(hdr); doc.appendChild(quote);
  const de = add(doc, { x: 540, y: 790, rot: 1.5, t0: l3.start + 0.25, t1: end, enter: 'slideR', z: 20 });
  const typer = typeOn(quote, (l4.end - l4.start) - 0.35);
  for (let k = l4.start - 0.1; k < l4.end - 0.45; k += 0.075) SFX.push({ t: k, kind: 'key', dur: 0.05 });
  const hl = () => quote.querySelector('.hl');
  de.update = (lt, t) => {
    typer(t - l4.start + 0.1);
    const p = clamp((t - (l4.end - 0.7)) / 0.35);
    const n = hl();
    if (n) n.style.background = `linear-gradient(90deg, rgba(243,194,33,.85) ${p * 100}%, transparent ${p * 100}%)`;
  };
  add(tape(190, 54, false, 22), { x: 160, y: 530, rot: -32, t0: l3.start + 0.55, t1: end, enter: 'tape', z: 25 });
  add(tape(190, 54, false, 23), { x: 930, y: 1050, rot: -28, t0: l3.start + 0.6, t1: end, enter: 'tape', z: 25 });
  addRansom('0% ?', 150, { x: 300, y: 1170, rot: -4, t0: l4.start + 0.2, t1: end, z: 30, seed: 77 });
  add(tape(420, 70, true, 24), { x: 300, y: 1170, rot: -14, t0: l4.end - 0.25, t1: end, enter: 'tape', z: 31 });
  add(h('div', 'hand', 'RBI khud bol raha hai!', { fontSize: '46px', whiteSpace: 'nowrap' }), { x: 760, y: 1190, rot: -5, t0: l4.end - 0.4, t1: end, enter: 'fade', shadow: false, z: 32 });
})();

// ===== THREE PLAYERS ===============================================================
let bankE, bagE;
(function three() {
  const end = sceneEnd('three'), l5 = L(5), l6 = L(6);
  addRansom('INTEREST', 104, { x: 540, y: 420, t0: l5.start, t1: end, stagger: 0.04, z: 30 });
  addRansom('GAYA KAHAN?', 92, { x: 540, y: 545, t0: l5.start + 0.45, t1: end, stagger: 0.04, z: 30, seed: 5 });

  const group = (src, w, label) => {
    const g = h('div', '', '', { display: 'flex', flexDirection: 'column', alignItems: 'center' });
    g.appendChild(img(src, w));
    const c = chip(label, { size: 50 }); c.style.marginTop = '-28px'; c.style.transform = 'rotate(-3deg)';
    g.appendChild(c); return g;
  };
  const t3 = l6.start + 1.0;
  bankE = add(group('ht_bank.png', 360, 'BANK'), { x: 540, y: 820, rot: 2, t0: t3, t1: Infinity, z: 20 });
  add(group('ht_person.png', 270, 'AAP'), { x: 225, y: 1110, rot: -4, t0: t3 + 0.2, t1: end, z: 20 });
  bagE = add(group('ht_bag.png', 280, 'BRAND'), { x: 850, y: 1110, rot: 4, t0: t3 + 0.4, t1: Infinity, z: 20 });
  const [a1, h1] = arrowPath(340, 1080, 450, 960, 0.2, 3), [a2, h2] = arrowPath(640, 960, 740, 1060, 0.2, 4), [a3, h3] = arrowPath(720, 1200, 360, 1200, -0.12, 5);
  addDraw([a1, h1, a2, h2, a3, h3], { t0: t3 + 0.6, t1: end, dur: 0.7, color: '#151515', width: 7, z: 21 });
  add(chip('?', { size: 120, font: 'Abril', tex: 'tex-yellow', pad: '0 0.3em' }), { x: 540, y: 1100, rot: 8, t0: t3 + 0.9, t1: end, z: 22 });
})();

// ===== THE MATH ===================================================================
(function math() {
  const start = L(7).start - 0.1, end = sceneEnd('math');
  const [l7, l8, l9, l10, l11] = [7, 8, 9, 10, 11].map(L);
  bankE.kf = [{ t: start, x: 190, y: 455, s: 0.52, rot: -5, d: 0.5 }];
  bankE.t1 = end;
  bagE.kf = [{ t: start, x: 890, y: 455, s: 0.5, rot: 5, d: 0.5 }];
  bagE.t1 = end;
  add(chip('16% p.a.', { size: 58, tex: 'tex-yellow', font: 'Anton' }), { x: 360, y: 400, rot: 7, t0: l7.start + 2.4, t1: end, z: 40 });

  add(sheet(900, 700, 'tex-white', 31, `<div style="position:absolute;inset:0;background:repeating-linear-gradient(transparent 0 99px, rgba(40,70,110,.18) 99px 102px)"></div>
     <div class="mono" style="position:absolute;left:44px;top:26px;font-size:24px;color:#666;letter-spacing:.06em">LEDGER · 6-MONTH EMI · ₹30,000</div>`),
    { x: 540, y: 935, rot: -1, t0: start + 0.2, t1: end, enter: 'slideUp', z: 10 });

  const row = (label, val, size = 46) => {
    const n = h('div', 'row', `<span class="mono" style="font-size:${size}px">${label}</span><span class="lead"></span><span class="num v" style="font-size:${size + 18}px">${val}</span>`, { width: '800px' });
    return n;
  };
  const r1 = row('INTEREST (6 MAH.)', '₹ ?');
  const e1 = add(r1, { x: 540, y: 690, t0: l7.start + 0.6, t1: end, enter: 'drop', z: 20, shadow: false });
  const v1 = r1.querySelector('.v'); const c1 = counter(v1, 0, 1350, 0.8, v => '₹' + inr(Math.round(v / 10) * 10));
  e1.update = (lt, t) => { if (t >= l8.start + 1.7) c1(t - l8.start - 1.7); };
  add(tape(820, 74, true, 32), { x: 540, y: 790, rot: -0.6, t0: l9.start + 1.3, t1: end, enter: 'tape', z: 19, shadow: false });
  add(row('BRAND DISCOUNT', '−₹1,350'), { x: 540, y: 790, t0: l9.start + 1.4, t1: end, enter: 'drop', z: 20, shadow: false });
  add(row('LOAN', '₹28,650'), { x: 540, y: 890, t0: l10.start + 0.5, t1: end, enter: 'drop', z: 20, shadow: false });
  add(row('+ INTEREST', '₹1,350'), { x: 540, y: 990, t0: l10.end - 1.0, t1: end, enter: 'drop', z: 20, shadow: false });
  addDraw(['M150,1055 L930,1050'], { t0: l11.start, t1: end, dur: 0.25, color: '#151515', width: 6, z: 21 });
  add(row('AAP DOGE', '₹30,000', 56), { x: 540, y: 1120, t0: l11.start + 0.25, t1: end, enter: 'slap', z: 20, shadow: false });
  addDraw([wobbleEllipse(820, 1118, 150, 62, 33)], { t0: l11.start + 0.6, t1: end, dur: 0.35, width: 12, z: 22 });

  const [a1, h1] = arrowPath(250, 560, 170, 660, -0.3, 6);
  addDraw([a1, h1], { t0: l7.start + 1.0, t1: end, dur: 0.35, color: '#151515', width: 7, z: 23 });
  const [a2, h2] = arrowPath(830, 560, 960, 760, 0.3, 7);
  addDraw([a2, h2], { t0: l9.start + 0.5, t1: end, dur: 0.35, color: '#151515', width: 7, z: 23 });
  add(stamp('INTEREST: BRAND NE BHARA', 30, null, true), { x: 400, y: 1225, rot: -5, t0: l11.end - 1.25, t1: end, enter: 'stamp', z: 30, shadow: false });
})();

// ===== THE TWIST: GST + FEE =========================================================
(function twist() {
  const end = sceneEnd('twist');
  const [l12, l13, l14, l15, l16, l17] = [12, 13, 14, 15, 16, 17].map(L);
  const kf = [{ t: l13.start + 0.1, x: 540, y: 372, s: 0.52, rot: -2, d: 0.4 }];
  const r1 = addRansom('AB ASLI', 150, { x: 540, y: 760, t0: l12.start, t1: end, stagger: 0.035, z: 60, seed: 12, kf });
  const r2 = addRansom('KHEL', 190, { x: 540, y: 950, t0: l12.start + 0.25, t1: end, stagger: 0.05, z: 60, seed: 13,
    kf: [{ t: l13.start + 0.1, x: 540, y: 482, s: 0.42, rot: 2, d: 0.4 }] });

  // thermal receipt that prints downward
  const rec = sheet(660, 660, 'tex-white', 41, '', { padding: '34px 42px' }, 4);
  rec.innerHTML = `<div class="mono" style="text-align:center;font-size:30px;letter-spacing:.12em">*** NO-COST EMI ***</div>
   <div class="mono" style="text-align:center;font-size:20px;color:#666;margin:6px 0 14px">FINAL BILL · ₹30,000 · 6 MONTHS</div>
   <div style="border-top:4px dashed #333;margin-bottom:18px"></div>`;
  const rows = [];
  const R = (label, val, cls = '') => {
    const n = h('div', 'row ' + cls, `<span class="mono" style="font-size:31px">${label}</span><span class="lead"></span><span class="num v" style="font-size:46px">${val}</span>`, { margin: '0 0 16px' });
    rec.appendChild(n); rows.push(n); return n;
  };
  R('INTEREST (BRAND)', '₹1,350');
  const gst = R('GST 18% ON INTEREST', '₹ ?');
  R('PROCESSING FEE', '₹199');
  R('GST 18% ON FEE', '₹36');
  const sep = h('div', '', '', { borderTop: '4px dashed #333', margin: '8px 0 18px' }); rec.appendChild(sep);
  const tot = h('div', 'row', `<span class="mono" style="font-size:36px">EXTRA (JEB SE)</span><span class="lead"></span><span class="num" style="font-size:78px">₹478</span>`);
  rec.appendChild(tot);
  const shows = [l13.start + 1.3, l13.start + 2.0, l16.start + 1.0, l16.start + 3.0, l17.start + 0.5, l17.start + 0.5];
  const items = [...rows, sep, tot];
  const recE = add(rec, { x: 540, y: 935, rot: 1, t0: l13.start + 0.3, t1: end, enter: 'slideUp', z: 20 });
  recE.update = (lt, t) => {
    items.forEach((n, i) => { n.style.visibility = t >= shows[i] ? 'visible' : 'hidden'; });
    gst.querySelector('.v').textContent = t >= l15.start + 1.8 ? '₹243' : '₹ ?';
  };
  // the interest row is "covered" by the discount: strike it with yellow tape
  add(tape(250, 46, true, 42), { x: 790, y: 782, rot: -3, t0: l13.start + 1.8, t1: end, enter: 'tape', z: 24 });
  add(chip('✓ discount', { size: 34, font: 'Caveat', weight: 700, tex: 'tex-white' }), { x: 905, y: 712, rot: 8, t0: l13.start + 1.9, t1: end, z: 25 });
  add(stamp('NOT COVERED', 44, 'by discount', true), { x: 650, y: 1020, rot: 7, t0: l14.start + 1.5, t1: l16.start, enter: 'stamp', z: 30, shadow: false });
  addDraw([wobbleEllipse(770, 1172, 135, 70, 44)], { t0: l17.start + 1.0, t1: end, dur: 0.4, width: 13, z: 31 });
  add(stamp('NO-COST?', 56, null, true), { x: 300, y: 1290, rot: -8, t0: l17.end - 1.6, t1: end, enter: 'stamp', z: 32, shadow: false });
})();

// ===== FINE PRINT ==================================================================
(function fine() {
  const end = sceneEnd('fine');
  const [l18, l19, l20, l21] = [18, 19, 20, 21].map(L);
  addRansom('FINE PRINT', 112, { x: 540, y: 400, t0: l18.start, t1: end, stagger: 0.04, z: 60, seed: 19,
    kf: [{ t: l19.start, y: 380, s: 0.8, d: 0.3 }] });
  const tc = sheet(860, 560, 'tex-news', 51, `<div class="type" style="padding:34px 40px;font-size:30px;line-height:1.45;color:#2a2a2a">*No cost EMI: interest is offered as an upfront discount. <span class="hl">GST on interest payable by customer.</span> Processing fee as per bank. <span class="hl">Full transaction amount blocked on card limit.</span> Instant discount on full payment may differ from EMI. <span class="hl">Late payment fee applicable.</span> Foreclosure may reverse discount.</div>`);
  const tcE = add(tc, { x: 540, y: 830, rot: -1.5, t0: l18.start + 0.3, t1: l19.start, enter: 'slideR', z: 20 });
  tcE.update = (lt) => tc.querySelectorAll('.hl').forEach((n, i) => {
    const p = clamp((lt - 0.6 - i * 0.35) / 0.3) * 100;
    n.style.background = `linear-gradient(90deg, rgba(243,194,33,.85) ${p}%, transparent ${p}%)`;
  });

  // 1. price tags: full payment discount vs EMI discount
  const tag = (top, bottom, size, tex) => {
    const n = h('div', `paper ${tex}`, `<div class="num" style="font-size:${size}px;line-height:1">${top}</div><div class="mono" style="font-size:${size * 0.42}px;margin-top:6px">${bottom}</div>`,
      { padding: '22px 34px 20px 64px', clipPath: 'polygon(36px 0, 100% 0, 100% 100%, 36px 100%, 0 50%)', position: 'relative' });
    n.appendChild(h('div', '', '', { position: 'absolute', left: '24px', top: 'calc(50% - 9px)', width: '18px', height: '18px', borderRadius: '50%', background: '#6f92b8' }));
    return n;
  };
  add(tag('FULL PAYMENT', 'BADA DISCOUNT', 64, 'tex-yellow'), { x: 330, y: 610, rot: -5, t0: l19.start + 1.2, t1: end, z: 30 });
  add(tag('EMI', 'CHHOTA DISCOUNT', 44, 'tex-cream'), { x: 800, y: 630, rot: 6, t0: l19.start + 1.8, t1: end, z: 30 });

  // 2. card limit blocked
  add(img('ht_card.png', 320), { x: 230, y: 890, rot: -7, t0: l20.start + 0.4, t1: end, z: 30 });
  const bar = h('div', '', `<div class="mono" style="font-size:24px;margin-bottom:8px">CARD LIMIT ₹1,00,000</div>
    <div style="position:relative;width:440px;height:62px;border:5px solid #151515;background:url(../assets/paper_cream.jpg)">
      <div class="fill" style="position:absolute;left:0;top:0;bottom:0;width:0;background:repeating-linear-gradient(-45deg,#151515 0 14px,#f3c221 14px 28px)"></div></div>
    <div class="num" style="font-size:36px;margin-top:6px">₹30,000 BLOCKED</div>`, { padding: '14px 22px', background: 'url(../assets/paper_white.jpg)' });
  const barE = add(bar, { x: 700, y: 880, rot: 2, t0: l20.start + 0.8, t1: end, z: 30 });
  barE.update = (lt) => { bar.querySelector('.fill').style.width = (clamp((lt - 0.3) / 0.6) * 30).toFixed(1) + '%'; };
  add(chip('CREDIT SCORE ↓', { size: 40, tex: 'tex-black' }), { x: 720, y: 1000, rot: -3, t0: l20.start + 2.3, t1: end, z: 31 });

  // 3. missed EMI
  add(img('ht_calendar.png', 300), { x: 280, y: 1160, rot: 4, t0: l21.start + 0.2, t1: end, z: 30 });
  addDraw(['M330,1150 L420,1230', 'M420,1150 L330,1232'], { t0: l21.start + 0.9, t1: end, dur: 0.3, color: '#151515', width: 14, z: 31 });
  add(chip('LATE FEE', { size: 56, tex: 'tex-yellow' }), { x: 720, y: 1130, rot: -4, t0: l21.start + 1.4, t1: end, z: 31 });
  add(chip('NO-COST', { size: 50 }), { x: 740, y: 1225, rot: 3, t0: l21.start + 2.0, t1: end, z: 31 });
  addDraw(['M600,1232 L885,1210'], { t0: l21.start + 2.4, t1: end, dur: 0.2, color: '#151515', width: 10, z: 32 });
})();

// ===== LANDING ===================================================================
(function land() {
  const end = sceneEnd('land');
  const [l22, l23, l24] = [22, 23, 24].map(L);
  add(chip('NO-COST EMI', { size: 52, tex: 'tex-black' }), { x: 540, y: 360, rot: -2, t0: l22.start, t1: end, z: 40 });
  addRansom('BURA NAHI', 120, { x: 540, y: 480, t0: l22.start + 0.9, t1: end, stagger: 0.05, z: 40, seed: 22 });

  // balance scale
  const sc = document.createElementNS(SVGNS, 'svg');
  sc.setAttribute('width', 860); sc.setAttribute('height', 520); sc.setAttribute('viewBox', '0 0 860 520');
  sc.innerHTML = `<g stroke="#151515" stroke-width="12" stroke-linecap="round" fill="none">
     <path d="M430 150 L430 470"/><path d="M330 480 L530 480"/></g>
     <g class="beam"><path d="M110 150 L750 150" stroke="#151515" stroke-width="14" stroke-linecap="round"/>
     <circle cx="430" cy="150" r="20" fill="#f3c221" stroke="#151515" stroke-width="6"/></g>`;
  const scaleE = add(sc, { x: 540, y: 810, t0: l23.start, t1: end, enter: 'drop', z: 20, shadow: false });
  const left = chip('₹478', { size: 80, font: 'Anton', tex: 'tex-yellow' });
  const right = chip('6 MAHINE<br>KA AARAM', { size: 46, css: { textAlign: 'center', lineHeight: 1.1 } });
  const lE = add(left, { x: 220, y: 770, t0: l23.start + 0.2, t1: end, z: 22 });
  const rE = add(right, { x: 860, y: 760, t0: l23.start + 1.1, t1: end, z: 22 });
  const tilt = (t) => { const p = clamp((t - l23.start - 1.1) / 0.8); return lerp(-9, 0, backOut(p)); };
  scaleE.update = (lt, t) => {
    const a = tilt(t);
    sc.querySelector('.beam').setAttribute('transform', `rotate(${a} 430 150)`);
    const dy = Math.sin(a * Math.PI / 180) * 320;
    lE.y = 760 - dy; rE.y = 760 + dy;
  };
  add(stamp('FAIR DEAL', 54), { x: 540, y: 950, rot: -6, t0: l23.end - 0.9, t1: end, enter: 'stamp', z: 30, shadow: false });

  const ck = sheet(760, 260, 'tex-cream', 61, `<div class="type" style="padding:26px 40px;font-size:34px">CHECKOUT SE PEHLE:</div>
     <div class="mono" style="padding:0 40px;font-size:40px;line-height:1.5">☐ EMI PRICE<br>☐ FULL PAYMENT PRICE</div>`);
  add(ck, { x: 540, y: 1150, rot: 1.2, t0: l24.start + 0.2, t1: end, enter: 'slideUp', z: 25 });
  addDraw(['M192,1128 l18,22 l36,-48'], { t0: l24.start + 1.3, t1: end, dur: 0.2, color: '#151515', width: 9, z: 26 });
  addDraw(['M192,1188 l18,22 l36,-48'], { t0: l24.start + 1.8, t1: end, dur: 0.2, color: '#151515', width: 9, z: 26 });
})();

// ===== END ========================================================================
(function endScene() {
  const [l25, l26] = [25, 26].map(L);
  addRansom('FREE KUCH', 120, { x: 540, y: 400, t0: l25.start, t1: END + 1, stagger: 0.045, z: 40, seed: 25 });
  addRansom('NAHI HOTA.', 120, { x: 540, y: 540, t0: l25.start + 0.5, t1: END + 1, stagger: 0.045, z: 40, seed: 26 });
  const bill = sheet(620, 420, 'tex-aged', 71, `<div style="padding:34px 44px"><div style="font-family:Abril;font-size:84px;line-height:1">BILL</div>
     <div class="type" style="font-size:34px;margin-top:20px">TO: <span class="nm" style="font-family:Caveat;font-weight:700;font-size:60px;color:#151515">aap?</span></div>
     <div class="type" style="font-size:26px;margin-top:16px;color:#555">INTEREST ₹1,350 — PAID BY BRAND</div></div>`);
  const bE = add(bill, { x: 540, y: 880, rot: -3, t0: l25.start + 1.2, t1: END + 1, enter: 'slideL', z: 20 });
  bE.update = (lt, t) => { bill.querySelector('.nm').textContent = t > l25.end - 1.1 ? 'kisi aur ke naam' : 'aap?'; };
  add(tape(200, 54, false, 72), { x: 270, y: 690, rot: -30, t0: l25.start + 1.4, t1: END + 1, enter: 'tape', z: 22 });
  add(chip('📲 BHEJO: EMI WALE DOST KO', { size: 46, tex: 'tex-yellow' }), { x: 540, y: 1150, rot: -2, t0: l26.start + 0.3, t1: END + 1, z: 40 });
  add(h('div', 'type', 'Educational only · Not investment advice<br>Example: ₹30,000 · 6 months · 16% p.a. · 18% GST · ₹199 fee<br>Source: RBI circular RBI/2013-14/292, 17 Sep 2013', {
    fontSize: '22px', lineHeight: '1.45', textAlign: 'center', padding: '12px 20px', background: 'url(../assets/paper_white.jpg)', color: '#333' }),
    { x: 540, y: 1255, t0: l26.start + 0.5, t1: END + 1, enter: 'fade', z: 40 });
  add(stamp('FILE 02 · CLOSED', 40, null, true), { x: 690, y: 1065, rot: -7, t0: l26.end + 0.25, t1: END + 1, enter: 'stamp', z: 50, shadow: false });
})();

buildCaptions(SCRIPT.lines, TL);
finishStage();
