import React from 'react';
import {Placeholder} from './placeholder';

const Recap: React.FC = () => <Placeholder name="recap" />;
const Outro: React.FC = () => <Placeholder name="outro" />;

export const c9: Record<string, React.FC> = {recap: Recap, outro: Outro};
