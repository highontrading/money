import tl from '../../data/card-close-score.json';
import {Timeline} from '../../lib/timeline';
import {ReelDef} from '../types';
import {Cover} from './Cover';
import {SCENES} from './scenes';

export const reel: ReelDef = {id: 'card-close-score', topic: 'CREDIT SCORE', tl: tl as Timeline, scenes: SCENES, Cover};
