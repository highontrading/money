import React from 'react';
import {Timeline} from '../lib/timeline';

export type ReelDef = {
  id: string;
  topic: string;
  tl: Timeline;
  scenes: Record<string, React.FC>;
  Cover: React.FC;
};
