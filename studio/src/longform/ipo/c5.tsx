import React from 'react';
import {Placeholder} from './placeholder';

const Clock: React.FC = () => <Placeholder name="clock" />;
const Allot: React.FC = () => <Placeholder name="allot" />;
const Credit: React.FC = () => <Placeholder name="credit" />;

export const c5: Record<string, React.FC> = {clock: Clock, allot: Allot, credit: Credit};
