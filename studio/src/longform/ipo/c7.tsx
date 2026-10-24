import React from 'react';
import {Placeholder} from './placeholder';

const Lockin: React.FC = () => <Placeholder name="lockin" />;
const Public: React.FC = () => <Placeholder name="public" />;

export const c7: Record<string, React.FC> = {lockin: Lockin, public: Public};
