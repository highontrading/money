import tl from '../../data/room-rent-cap.json';
import {Timeline} from '../../lib/timeline';
import {ReelDef} from '../types';
import {Cover} from './Cover';
import {SCENES} from './scenes';

export const reel: ReelDef = {id: 'room-rent-cap', topic: 'HEALTH INSURANCE', tl: tl as Timeline, scenes: SCENES, Cover};
