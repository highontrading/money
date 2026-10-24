import tl from '../../data/pf-withdrawal.json';
import {Timeline} from '../../lib/timeline';
import {ReelDef} from '../types';
import {Cover} from './Cover';
import {SCENES} from './scenes';

export const reel: ReelDef = {id: 'pf-withdrawal', topic: 'PF · EPF', tl: tl as Timeline, scenes: SCENES, Cover};
