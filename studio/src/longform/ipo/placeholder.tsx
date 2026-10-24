import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F} from '../../theme';

// Stand-in for a scene that isn't animated yet.
export const Placeholder: React.FC<{name: string}> = ({name}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
    <div style={{fontFamily: F.display, fontSize: 160, color: C.grey, textTransform: 'uppercase'}}>{name}</div>
  </AbsoluteFill>
);
