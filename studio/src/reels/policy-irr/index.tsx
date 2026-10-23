import tl from '../../data/policy-irr.json';
import {Timeline} from '../../lib/timeline';
import {ReelDef} from '../types';
import {Cover} from './Cover';
import {SCENES} from './scenes';

export const reel: ReelDef = {id: 'policy-irr', topic: 'INSURANCE · IRR', tl: tl as Timeline, scenes: SCENES, Cover};
