import tl from '../../data/home-loan-emi.json';
import {Timeline} from '../../lib/timeline';
import {ReelDef} from '../types';
import {Cover} from './Cover';
import {SCENES} from './scenes';

export const reel: ReelDef = {id: 'home-loan-emi', topic: 'HOME LOAN', tl: tl as Timeline, scenes: SCENES, Cover};
