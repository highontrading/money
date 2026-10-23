import React from 'react';
import {Composition, Still} from 'remotion';
import {Reel} from '../Reel';
import {FPS, H, W} from '../theme';
import {ReelDef} from './types';

export const ReelCompositions: React.FC<{r: ReelDef}> = ({r}) => {
  const Comp = React.useMemo(() => () => <Reel tl={r.tl} scenes={r.scenes} topic={r.topic} />, [r]);
  return (
    <>
      <Composition id={r.id} component={Comp} durationInFrames={r.tl.duration} fps={FPS} width={W} height={H} />
      <Still id={r.id + '-cover'} component={r.Cover} width={W} height={H} />
    </>
  );
};
