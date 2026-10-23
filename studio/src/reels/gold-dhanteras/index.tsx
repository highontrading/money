import tl from '../../data/gold-dhanteras.json';
import {Timeline} from '../../lib/timeline';
import {ReelDef} from '../types';
import {Cover} from './Cover';
import {SCENES} from './scenes';

export const reel: ReelDef = {id: 'gold-dhanteras', topic: 'GOLD · DHANTERAS', tl: tl as Timeline, scenes: SCENES, Cover};
