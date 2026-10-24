import tl from '../../data/ctc-in-hand.json';
import {Timeline} from '../../lib/timeline';
import {ReelDef} from '../types';
import {Cover} from './Cover';
import {SCENES} from './scenes';

export const reel: ReelDef = {id: 'ctc-in-hand', topic: 'SALARY · CTC', tl: tl as Timeline, scenes: SCENES, Cover};
