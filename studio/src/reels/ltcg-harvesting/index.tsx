import tl from '../../data/ltcg-harvesting.json';
import {Timeline} from '../../lib/timeline';
import {ReelDef} from '../types';
import {Cover} from './Cover';
import {SCENES} from './scenes';

export const reel: ReelDef = {id: 'ltcg-harvesting', topic: 'TAX · CAPITAL GAINS', tl: tl as Timeline, scenes: SCENES, Cover};
