import tl from '../../data/flat-vs-reducing.json';
import {Timeline} from '../../lib/timeline';
import {ReelDef} from '../types';
import {Cover} from './Cover';
import {SCENES} from './scenes';

export const reel: ReelDef = {id: 'flat-vs-reducing', topic: 'LOANS · FLAT RATE', tl: tl as Timeline, scenes: SCENES, Cover};
