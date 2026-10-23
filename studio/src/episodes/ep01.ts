import timeline from '../data/ep01-gmp.json';
import {EpisodeDef} from '../Episode';
import {Timeline} from '../lib/timeline';
import {Deals} from '../scenes/Deals';
import {Gap} from '../scenes/Gap';
import {Grey} from '../scenes/Grey';
import {Hook} from '../scenes/Hook';
import {MathScene} from '../scenes/Math';
import {Outro} from '../scenes/Outro';
import {RecordScene} from '../scenes/Record';
import {Risk} from '../scenes/Risk';
import {Settle} from '../scenes/Settle';
import {Use} from '../scenes/Use';

export const ep01: EpisodeDef = {
  id: 'ep01-gmp',
  topic: 'IPO · GMP',
  timeline: timeline as Timeline,
  scenes: {hook: Hook, gap: Gap, grey: Grey, math: MathScene, deals: Deals, settle: Settle, risk: Risk, record: RecordScene, use: Use, outro: Outro},
};
