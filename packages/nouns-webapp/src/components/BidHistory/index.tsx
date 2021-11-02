import React from 'react';
import ShortAddress from '../ShortAddress';
import _classes from './BidHistory.module.css';
import { compareBids } from '../../utils/compareBids';
import * as R from 'ramda';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { buildEtherscanTxLink } from '../../utils/etherscan';
import TruncatedAmount from '../TruncatedAmount';
import BigNumber from 'bignumber.js';
import { CHAIN_ID } from '../../config';
import { IBid } from '../../wrappers/subgraph';
import { Spinner } from 'react-bootstrap';
import { Bid } from '../../utils/types';
import { BigNumber as EthersBN } from '@ethersproject/bignumber';
import { useAuctionBids } from '../../wrappers/onDisplayAuction';

const bidItem = (bid: Bid, index: number, classes: any) => {
  const bidAmount = <TruncatedAmount amount={new BigNumber(EthersBN.from(bid.value).toString())} />;
  const date = `${moment(bid.timestamp.toNumber() * 1000).format('MMM DD')} at ${moment(
    bid.timestamp.toNumber() * 1000,
  ).format('hh:mm a')}`;

  const txLink = buildEtherscanTxLink(bid.transactionHash);

  return (
    <li key={index} className={classes.bidRow}>
      <div className={classes.bidItem}>
        <div className={classes.leftSectionWrapper}>
          <div className={classes.bidder}>
            <div>
              <ShortAddress address={bid.sender} />
            </div>
          </div>
          <div className={classes.bidDate}>{date}</div>
        </div>
        <div className={classes.rightSectionWrapper}>
          <div className={classes.bidAmount}>{bidAmount}</div>
          <div className={classes.linkSymbol}>
            <a href={txLink} target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </a>
          </div>
        </div>
      </div>
    </li>
  );
};

const BidHistory: React.FC<{ auctionId: string; max: number; classes?: any }> = props => {
  const { auctionId, max, classes = _classes } = props;

  const bids = useAuctionBids(EthersBN.from(auctionId), 'partynoun');
  const bidContent =
    bids &&
    bids
      .map((bid: Bid, i: number) => {
        return bidItem(bid, i, classes);
      })
      .slice(0, max);

  return <ul className={classes.bidCollection}>{bidContent}</ul>;
};

export default BidHistory;
