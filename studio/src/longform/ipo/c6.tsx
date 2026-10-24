import React from 'react';
import {Placeholder} from './placeholder';

const Preopen: React.FC = () => <Placeholder name="preopen" />;
const Bell: React.FC = () => <Placeholder name="bell" />;

export const c6: Record<string, React.FC> = {preopen: Preopen, bell: Bell};
