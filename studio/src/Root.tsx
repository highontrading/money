import React from 'react';
import {Composition, registerRoot, Still} from 'remotion';
import {Cover, CoverProps} from './Cover';
import {Episode, EpisodeDef} from './Episode';
import {ep01} from './episodes/ep01';
import {bonds} from './episodes/bonds';
import {inflation} from './episodes/inflation';
import {sip} from './episodes/sip';
import {price} from './episodes/price';
import {repo} from './episodes/repo';
import {jioMoney} from './episodes/jioMoney';
import {jioListing} from './episodes/jioListing';
import {silver} from './episodes/silver';
import {gold} from './episodes/gold';
import {crude} from './episodes/crude';
import {muhurat} from './episodes/muhurat';
import {FPS, H, W} from './theme';

const EPISODES: {def: EpisodeDef; cover: CoverProps}[] = [
  {def: ep01, cover: {big: 'GMP', line1: 'GREY MARKET', line2: 'KA SACH', photo: 'bse.jpg', stamp: '₹1,364 ?'}},
  {def: inflation, cover: {big: 'INFLATION', bigSize: 230, line1: 'PAISA CHUPCHAAP', line2: 'KAISE GHATTA HAI', photo: 'veg.jpg', stamp: '5.54%'}},
  {def: bonds, cover: {big: 'BONDS', line1: 'RATE BADHE TOH', line2: 'BOND KYUN GIRE?', photo: 'rbi.jpg', stamp: '₹1,000 → ₹933'}},
  {def: sip, cover: {big: 'SIP vs LUMP', bigSize: 165, line1: 'KAUN JEET-TA', line2: 'HAI?', photo: 'crowd.jpg', photoPos: '50% 60%', stamp: '₹32,490 CR'}},
  {def: price, cover: {big: 'SHARE PRICE', bigSize: 160, line1: 'DECIDE KAUN', line2: 'KARTA HAI?', photo: 'bse.jpg', stamp: 'BID vs ASK'}},
  {def: repo, cover: {big: 'REPO → EMI', bigSize: 170, line1: 'RATE BADHA,', line2: 'EMI KA KYA?', photo: 'flats.jpg', stamp: '5.25% → 5.50%'}},
  {def: jioMoney, cover: {big: 'JIO IPO', bigSize: 250, line1: 'PAISA JAATA', line2: 'KAHAN HAI?', photo: 'jiosim.jpg', photoPos: '40% 50%', stamp: '₹30,213 CR'}},
  {def: jioListing, cover: {big: 'LISTING DAY', bigSize: 170, line1: 'JIO: 28 OCT KO', line2: 'KYA HOGA?', photo: 'tower.jpg', stamp: '₹1,364 ?'}},
  {def: silver, cover: {big: 'CHANDI ↓', bigSize: 230, line1: 'JUNG MEIN BHI', line2: 'KYUN GIRI?', photo: 'silverbangle.jpg', stamp: '−13%'}},
  {def: gold, cover: {big: 'DHANTERAS', bigSize: 200, line1: '₹1 LAKH KA GEHNA,', line2: '₹84,000 WAPAS?', photo: 'goldbangles.jpg', stamp: 'ETF vs GEHNA'}},
  {def: crude, cover: {big: 'TEL → EMI', bigSize: 210, line1: '$117 KA TEL,', line2: 'AAPKI JEB TAK', photo: 'tanker.jpg', stamp: '$117'}},
  {def: muhurat, cover: {big: 'MUHURAT', bigSize: 220, line1: 'DIWALI KA', line2: 'EK GHANTA', photo: 'diya.jpg', stamp: '8 NOV · 2:20 PM'}},
];

// Composition props are serialized to JSON, which would drop the scene
// components, so each episode gets its own wrapper component instead.
const COMPONENTS = Object.fromEntries(EPISODES.map(({def}) => [def.id, () => <Episode def={def} />]));

const Root: React.FC = () => (
  <>
    {EPISODES.map(({def, cover}) => (
      <React.Fragment key={def.id}>
        <Composition id={def.id} component={COMPONENTS[def.id]} durationInFrames={def.timeline.duration} fps={FPS} width={W} height={H} />
        <Still id={def.id + '-cover'} component={Cover} defaultProps={cover} width={W} height={H} />
      </React.Fragment>
    ))}
  </>
);

registerRoot(Root);
