// Render a batch of stills from one bundle: node tools/stills.mjs out_dir frame1 frame2 ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import {browserExecutable} from './browser.mjs';

const [outDir, ...frames] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: path.resolve('src/Root.tsx')});
const composition = await selectComposition({serveUrl, id: process.env.COMP || 'ep01-gmp', browserExecutable});
for (const f of frames) {
  await renderStill({serveUrl, composition, frame: Number(f), output: path.join(outDir, `f${f}.jpg`), imageFormat: 'jpeg', jpegQuality: 85, browserExecutable, scale: Number(process.env.SCALE || 0.5)});
  process.stdout.write(f + ' ');
}
console.log('done');
