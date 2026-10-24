import tl from '../../data/popcorn-price.json';
import {Timeline} from '../../lib/timeline';
import {ReelDef} from '../types';
import {Cover} from './Cover';
import {SCENES} from './scenes';

export const reel: ReelDef = {id: 'popcorn-price', topic: 'BUSINESS · CINEMA', tl: tl as Timeline, scenes: SCENES, Cover};
