import tl from '../../data/price-999.json';
import {Timeline} from '../../lib/timeline';
import {ReelDef} from '../types';
import {Cover} from './Cover';
import {SCENES} from './scenes';

export const reel: ReelDef = {id: 'price-999', topic: 'PSYCHOLOGY', tl: tl as Timeline, scenes: SCENES, Cover};
