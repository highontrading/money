import React from 'react';
import {Placeholder} from './placeholder';

const Band: React.FC = () => <Placeholder name="band" />;
const Lot: React.FC = () => <Placeholder name="lot" />;
const Anchors: React.FC = () => <Placeholder name="anchors" />;
const Cake: React.FC = () => <Placeholder name="cake" />;

export const c3: Record<string, React.FC> = {band: Band, lot: Lot, anchors: Anchors, cake: Cake};
