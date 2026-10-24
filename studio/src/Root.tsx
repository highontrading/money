import React from 'react';
import {Composition, registerRoot, Still} from 'remotion';
import {Cover} from './Cover';
import {Episode} from './Episode';
import {TL} from './lib/timeline';
import {reel as averageVsCagr} from './reels/average-vs-cagr';
import {reel as creditCard} from './reels/credit-card-minimum-due';
import {reel as directVsRegular} from './reels/direct-vs-regular';
import {reel as gold} from './reels/gold-dhanteras';
import {reel as policyIrr} from './reels/policy-irr';
import {reel as homeLoan} from './reels/home-loan-emi';
import {reel as flatRate} from './reels/flat-vs-reducing';
import {reel as roomRent} from './reels/room-rent-cap';
import {reel as depositInsurance} from './reels/deposit-insurance';
import {reel as sipStepUp} from './reels/sip-step-up';
import {ReelCompositions} from './reels/register';
import {FPS, H, W} from './theme';

const REELS = [gold, creditCard, policyIrr, directVsRegular, averageVsCagr, homeLoan, flatRate, roomRent, depositInsurance, sipStepUp];

const Root: React.FC = () => (
  <>
    <Composition id="ep01-gmp" component={Episode} durationInFrames={TL.duration} fps={FPS} width={W} height={H} />
    <Still id="ep01-cover" component={Cover} width={W} height={H} />
    {REELS.map((r) => <ReelCompositions key={r.id} r={r} />)}
  </>
);

registerRoot(Root);
