import tl from '../../data/fno-losses.json';
import {Timeline} from '../../lib/timeline';
import {ReelDef} from '../types';
import {Cover} from './Cover';
import {SCENES} from './scenes';

export const reel: ReelDef = {id: 'fno-losses', topic: 'STOCK MARKET · F&O', tl: tl as Timeline, scenes: SCENES, Cover};
