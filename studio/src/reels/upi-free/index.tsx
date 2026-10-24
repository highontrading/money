import tl from '../../data/upi-free.json';
import {Timeline} from '../../lib/timeline';
import {ReelDef} from '../types';
import {Cover} from './Cover';
import {SCENES} from './scenes';

export const reel: ReelDef = {id: 'upi-free', topic: 'UPI · FINTECH', tl: tl as Timeline, scenes: SCENES, Cover};
