// Bundle entry for this reel alone (fast previews; other reels' edits can't break it).
import React from 'react';
import {registerRoot} from 'remotion';
import {ReelCompositions} from '../register';
import {reel} from './index';

registerRoot(() => <ReelCompositions r={reel} />);
