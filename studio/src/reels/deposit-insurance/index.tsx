import tl from '../../data/deposit-insurance.json';
import {Timeline} from '../../lib/timeline';
import {ReelDef} from '../types';
import {Cover} from './Cover';
import {SCENES} from './scenes';

export const reel: ReelDef = {id: 'deposit-insurance', topic: 'BANK DEPOSITS', tl: tl as Timeline, scenes: SCENES, Cover};
