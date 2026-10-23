import {Config} from '@remotion/cli/config';
import fs from 'node:fs';
import path from 'node:path';

// The pre-installed headless Chromium; its version folder differs between machines.
const findBrowser = () => {
  const root = '/opt/pw-browsers';
  if (!fs.existsSync(root)) return null;
  for (const d of fs.readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()) {
    for (const sub of fs.readdirSync(path.join(root, d))) {
      for (const exe of ['headless_shell', 'chrome-headless-shell']) {
        const p = path.join(root, d, sub, exe);
        if (fs.existsSync(p)) return p;
      }
    }
  }
  return null;
};

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setBrowserExecutable(findBrowser());
Config.setConcurrency(4);
Config.setChromiumOpenGlRenderer('angle');
