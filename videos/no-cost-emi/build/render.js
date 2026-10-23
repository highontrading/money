// Render frames with headless Chromium. Usage:
//   node render.js frames <from> <to> <outdir>   (frame indices at 30 fps; boards move on twos, camera is smooth)
//   node render.js stills <outdir> t1 t2 ...       (PNG stills at given seconds)
//   node render.js cover <out.jpg> <t>             (caption-free cover frame)
//   node render.js sfx                             (dump sound-effect cue list)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
fs.writeFileSync(path.join(ROOT, 'src', 'data.js'),
  `window.__SCRIPT=${fs.readFileSync(path.join(ROOT, 'script.json'))};\nwindow.__TIMELINE=${fs.readFileSync(path.join(__dirname, 'timeline.json'))};\n`);
(async () => {
  const [mode, ...args] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--allow-file-access-from-files', '--disable-web-security'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => { console.error('PAGEERROR', e.message); process.exitCode = 1; });
  p.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
  await p.goto('file://' + path.join(ROOT, 'src', 'index.html'));
  await p.evaluate(() => window.ready());
  if (mode === 'sfx') {
    fs.writeFileSync(path.join(__dirname, 'sfx.json'), JSON.stringify(await p.evaluate(() => window.getSfx())));
  } else if (mode === 'cover') {
    // grid cover: a composed hook frame without captions
    const [out, t] = args;
    await p.evaluate(t => { window.renderAt(t); document.getElementById('caption').style.display = 'none'; }, +t);
    await p.screenshot({ path: out, type: 'jpeg', quality: 94 });
  } else if (mode === 'stills') {
    const [out, ...ts] = args; fs.mkdirSync(out, { recursive: true });
    for (const t of ts) {
      await p.evaluate(t => window.renderAt(t), +t);
      await p.screenshot({ path: path.join(out, `t${(+t).toFixed(2).padStart(6, '0')}.png`) });
    }
  } else {
    const [from, to, out] = args; fs.mkdirSync(out, { recursive: true });
    for (let k = +from; k < +to; k++) {
      await p.evaluate(t => window.renderAt(t), k / 30);
      await p.screenshot({ path: path.join(out, `${String(k).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 92 });
    }
  }
  await b.close();
})();
