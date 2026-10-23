import tl from '../../data/direct-vs-regular.json';
import {Timeline} from '../../lib/timeline';
import {ReelDef} from '../types';
import {Cover} from './Cover';
import {SCENES} from './scenes';

export const reel: ReelDef = {id: 'direct-vs-regular', topic: 'MUTUAL FUNDS', tl: tl as Timeline, scenes: SCENES, Cover};
