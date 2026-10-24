import tl from '../../data/money-printing.json';
import {Timeline} from '../../lib/timeline';
import {ReelDef} from '../types';
import {Cover} from './Cover';
import {SCENES} from './scenes';

export const reel: ReelDef = {id: 'money-printing', topic: 'ECONOMY', tl: tl as Timeline, scenes: SCENES, Cover};
