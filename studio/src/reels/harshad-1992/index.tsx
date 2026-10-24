import tl from '../../data/harshad-1992.json';
import {Timeline} from '../../lib/timeline';
import {ReelDef} from '../types';
import {Cover} from './Cover';
import {SCENES} from './scenes';

export const reel: ReelDef = {id: 'harshad-1992', topic: 'HISTORY · 1992', tl: tl as Timeline, scenes: SCENES, Cover};
