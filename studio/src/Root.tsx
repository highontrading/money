import React from 'react';
import {Composition, registerRoot, Still} from 'remotion';
import {Cover} from './Cover';
import {Episode} from './Episode';
import {TL} from './lib/timeline';
import {FPS, H, W} from './theme';

const Root: React.FC = () => (
  <>
    <Composition id="ep01-gmp" component={Episode} durationInFrames={TL.duration} fps={FPS} width={W} height={H} />
    <Still id="ep01-cover" component={Cover} width={W} height={H} />
  </>
);

registerRoot(Root);
