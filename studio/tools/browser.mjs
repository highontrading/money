// Locate the pre-installed headless Chromium (the version folder changes between machines).
import fs from 'node:fs';
import path from 'node:path';

export const browserExecutable = (() => {
  const root = '/opt/pw-browsers';
  for (const d of fs.readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()) {
    for (const sub of fs.readdirSync(path.join(root, d))) {
      for (const exe of ['headless_shell', 'chrome-headless-shell']) {
        const p = path.join(root, d, sub, exe);
        if (fs.existsSync(p)) return p;
      }
    }
  }
  return null;
})();
