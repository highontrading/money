import tl from '../../data/task-scam.json';
import {Timeline} from '../../lib/timeline';
import {ReelDef} from '../types';
import {Cover} from './Cover';
import {SCENES} from './scenes';

export const reel: ReelDef = {id: 'task-scam', topic: 'SCAM ALERT', tl: tl as Timeline, scenes: SCENES, Cover};
