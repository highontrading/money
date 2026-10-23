import tl from '../../data/average-vs-cagr.json';
import {Timeline} from '../../lib/timeline';
import {ReelDef} from '../types';
import {Cover} from './Cover';
import {SCENES} from './scenes';

export const reel: ReelDef = {id: 'average-vs-cagr', topic: 'RETURNS · CAGR', tl: tl as Timeline, scenes: SCENES, Cover};
