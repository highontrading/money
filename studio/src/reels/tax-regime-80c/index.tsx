import tl from '../../data/tax-regime-80c.json';
import {Timeline} from '../../lib/timeline';
import {ReelDef} from '../types';
import {Cover} from './Cover';
import {SCENES} from './scenes';

export const reel: ReelDef = {id: 'tax-regime-80c', topic: 'INCOME TAX', tl: tl as Timeline, scenes: SCENES, Cover};
