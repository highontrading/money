import tl from '../../data/sip-step-up.json';
import {Timeline} from '../../lib/timeline';
import {ReelDef} from '../types';
import {Cover} from './Cover';
import {SCENES} from './scenes';

export const reel: ReelDef = {id: 'sip-step-up', topic: 'SIP · STEP-UP', tl: tl as Timeline, scenes: SCENES, Cover};
