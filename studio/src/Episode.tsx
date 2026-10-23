import React from 'react';
import {Reel} from './Reel';
import {TL} from './lib/timeline';
import {Deals} from './scenes/Deals';
import {Gap} from './scenes/Gap';
import {Grey} from './scenes/Grey';
import {Hook} from './scenes/Hook';
import {MathScene} from './scenes/Math';
import {Outro} from './scenes/Outro';
import {RecordScene} from './scenes/Record';
import {Risk} from './scenes/Risk';
import {Settle} from './scenes/Settle';
import {Use} from './scenes/Use';

const SCENES: Record<string, React.FC> = {
  hook: Hook,
  gap: Gap,
  grey: Grey,
  math: MathScene,
  deals: Deals,
  settle: Settle,
  risk: Risk,
  record: RecordScene,
  use: Use,
  outro: Outro,
};

// EP01 (IPO GMP).
export const Episode: React.FC = () => <Reel tl={TL} scenes={SCENES} episode="EP 01" topic="IPO · GMP" />;
