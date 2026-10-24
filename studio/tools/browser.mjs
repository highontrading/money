// Headless Chromium for Remotion: the pre-installed Playwright build moves between
// environments, so take $REMOTION_BROWSER or the first one that exists.
import fs from 'node:fs';

const CANDIDATES = [
  process.env.REMOTION_BROWSER,
  '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
  '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
];

export const browserExecutable = CANDIDATES.find((p) => p && fs.existsSync(p)) ?? null;
