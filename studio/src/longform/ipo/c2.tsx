import React from 'react';
import {Placeholder} from './placeholder';

const Bankers: React.FC = () => <Placeholder name="bankers" />;
const Drhp: React.FC = () => <Placeholder name="drhp" />;
const Sebi: React.FC = () => <Placeholder name="sebi" />;

export const c2: Record<string, React.FC> = {bankers: Bankers, drhp: Drhp, sebi: Sebi};
