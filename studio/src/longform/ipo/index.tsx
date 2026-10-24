import {LongEpisodeDef, LongTimeline} from '../LongEpisode';
import timeline from '../../data/ipo-journey.json';
import {c0} from './c0';
import {c1} from './c1';
import {c2} from './c2';
import {c3} from './c3';
import {c4} from './c4';
import {c5} from './c5';
import {c6} from './c6';
import {c7} from './c7';
import {c8} from './c8';
import {c9} from './c9';

const TL = timeline as LongTimeline;
const lastLine = TL.lines[TL.lines.length - 1];

// IPO ka poora safar (YouTube, 16:9). One file per chapter; scene ids match script/ipo-journey.json.
export const ipoJourney: LongEpisodeDef = {
  id: 'ipo-journey',
  timeline: TL,
  scenes: {...c0, ...c1, ...c2, ...c3, ...c4, ...c5, ...c6, ...c7, ...c8, ...c9},
  notes: {
    C1: 'Raju ki chai se shuru…',
    C2: 'sach poora likha hai?',
    C3: '₹1,065 – ₹1,119',
    C4: 'paisa block, kata nahi!',
    C5: '1 lot ya 14 = ek parchi',
    C6: 'T+3 · subah 10 baje',
    C7: 'taale khulte hain…',
    C8: 'apply se pehle!',
    C9: '1977 → 2026',
  },
  endScreenFrom: lastLine.end + 20,
};
