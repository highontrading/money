import tl from '../../data/retirement-1-crore.json';
import {Timeline} from '../../lib/timeline';
import {ReelDef} from '../types';
import {Cover} from './Cover';
import {SCENES} from './scenes';

export const reel: ReelDef = {id: 'retirement-1-crore', topic: 'RETIREMENT', tl: tl as Timeline, scenes: SCENES, Cover};
