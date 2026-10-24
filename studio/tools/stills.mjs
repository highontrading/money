// Render a batch of stills from one bundle:
//   node tools/stills.mjs <entry.tsx> <composition-id> <out_dir> frame1 frame2 ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import {browserExecutable} from './browser.mjs';

const [entry, id, outDir, ...frames] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: path.resolve(entry)});
const composition = await selectComposition({serveUrl, id, browserExecutable});
for (const f of frames) {
  await renderStill({serveUrl, composition, frame: Number(f), output: path.join(outDir, `f${f}.jpg`), imageFormat: 'jpeg', jpegQuality: 85, browserExecutable, scale: 0.5});
  process.stdout.write(f + ' ');
}
console.log('done');
// Each bundle copies public/ (~1 GB with audio); remove it so parallel runs don't fill the disk.
fs.rmSync(serveUrl, {recursive: true, force: true});
