import React from 'react';
import {Placeholder} from './placeholder';

const Raju: React.FC = () => <Placeholder name="raju" />;
const Partners: React.FC = () => <Placeholder name="partners" />;
const Ipo: React.FC = () => <Placeholder name="ipo" />;

export const c1: Record<string, React.FC> = {raju: Raju, partners: Partners, ipo: Ipo};
