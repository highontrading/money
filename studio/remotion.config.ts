import {Config} from '@remotion/cli/config';
import fs from 'node:fs';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
// The pre-installed Playwright build moves between environments (see tools/browser.mjs).
const browser = [process.env.REMOTION_BROWSER, '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell', '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell'].find((p) => p && fs.existsSync(p));
if (browser) Config.setBrowserExecutable(browser);
Config.setConcurrency(4);
Config.setChromiumOpenGlRenderer('angle');
