import tl from '../../data/gold-1991.json';
import {Timeline} from '../../lib/timeline';
import {ReelDef} from '../types';
import {Cover} from './Cover';
import {SCENES} from './scenes';

export const reel: ReelDef = {id: 'gold-1991', topic: 'HISTORY · 1991', tl: tl as Timeline, scenes: SCENES, Cover};
