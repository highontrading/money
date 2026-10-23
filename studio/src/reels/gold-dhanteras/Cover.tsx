import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atmosphere, Desk} from '../../components/chrome';
import {loadFonts} from '../../lib/fonts';
import {C} from '../../theme';

loadFonts();

export const Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Desk />
    <Atmosphere />
  </AbsoluteFill>
);
