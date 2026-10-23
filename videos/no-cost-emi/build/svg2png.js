// Render the source SVGs to transparent PNGs (2x) for halftoning.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const dir = path.join(__dirname, '..', 'assets', 'svg');
  const b = await chromium.launch();
  const p = await b.newPage();
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.svg'))) {
    const svg = fs.readFileSync(path.join(dir, f), 'utf8');
    const w = +svg.match(/width="(\d+)"/)[1], h = +svg.match(/height="(\d+)"/)[1];
    await p.setViewportSize({ width: w, height: h });
    await p.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
    await p.screenshot({ path: path.join(dir, f.replace('.svg', '.png')), omitBackground: true });
    console.log('ok', f);
  }
  await b.close();
})();
