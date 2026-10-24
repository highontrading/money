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
import {reel as pfWithdrawal} from './reels/pf-withdrawal';
import {reel as cardClose} from './reels/card-close-score';
import {reel as ltcg} from './reels/ltcg-harvesting';
import {reel as taxRegime} from './reels/tax-regime-80c';
import {reel as retirement} from './reels/retirement-1-crore';
import {reel as ctcInHand} from './reels/ctc-in-hand';
import {reel as taskScam} from './reels/task-scam';
import {reel as fnoLosses} from './reels/fno-losses';
import {reel as popcornPrice} from './reels/popcorn-price';
import {reel as upiFree} from './reels/upi-free';
import {reel as moneyPrinting} from './reels/money-printing';
import {reel as price999} from './reels/price-999';
import {reel as gold1991} from './reels/gold-1991';
import {reel as harshad1992} from './reels/harshad-1992';
import {ReelCompositions} from './reels/register';
import {FPS, H, W} from './theme';

const REELS = [gold, creditCard, policyIrr, directVsRegular, averageVsCagr, homeLoan, flatRate, roomRent, depositInsurance, sipStepUp, pfWithdrawal, cardClose, ltcg, taxRegime, retirement, ctcInHand, taskScam, fnoLosses, popcornPrice, upiFree, moneyPrinting, price999, gold1991, harshad1992];

const Root: React.FC = () => (
  <>
    <Composition id="ep01-gmp" component={Episode} durationInFrames={TL.duration} fps={FPS} width={W} height={H} />
    <Still id="ep01-cover" component={Cover} width={W} height={H} />
    {REELS.map((r) => <ReelCompositions key={r.id} r={r} />)}
  </>
);

registerRoot(Root);
