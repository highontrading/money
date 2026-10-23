import tl from '../../data/credit-card-minimum-due.json';
import {Timeline} from '../../lib/timeline';
import {ReelDef} from '../types';
import {Cover} from './Cover';
import {SCENES} from './scenes';

export const reel: ReelDef = {id: 'credit-card-minimum-due', topic: 'CREDIT CARD', tl: tl as Timeline, scenes: SCENES, Cover};
