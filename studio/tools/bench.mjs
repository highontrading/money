// Time full-res stills: node tools/bench.mjs frame [frame...]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
const frames = process.argv.slice(2).map(Number);
const serveUrl = await bundle({entryPoint: path.resolve('src/Root.tsx')});
import {browserExecutable} from './browser.mjs';
const composition = await selectComposition({serveUrl, id: 'ep01-gmp', browserExecutable});
for (const f of frames) {
  const t = Date.now();
  await renderStill({serveUrl, composition, frame: f, output: `/tmp/claude-0/-home-user-money/95806948-0883-5d76-bf6e-824b821bbfb6/scratchpad/bench_${f}.jpg`, imageFormat: 'jpeg', browserExecutable});
  console.log(f, Date.now() - t, 'ms');
}
