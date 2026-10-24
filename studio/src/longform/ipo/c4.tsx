import React from 'react';
import {Placeholder} from './placeholder';

const Bid: React.FC = () => <Placeholder name="bid" />;
const Then: React.FC = () => <Placeholder name="then" />;
const Now: React.FC = () => <Placeholder name="now" />;
const Subs: React.FC = () => <Placeholder name="subs" />;

export const c4: Record<string, React.FC> = {bid: Bid, then: Then, now: Now, subs: Subs};
