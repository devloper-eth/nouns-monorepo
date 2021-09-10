import React, { useEffect, useState } from 'react';
import PartyButtons from '../PartyButtons';
import PartyGuestList from '../PartyGuestList';
import { Auction as IAuction } from '../../wrappers/nounsAuction';
import classes from './PartyActivity.module.css';
import PartyVault from '../PartyVault';
import AuctionActivity from '../AuctionActivity';
import { BigNumber } from 'ethers';
import { ApolloError, useQuery } from '@apollo/client';
import { auctionQuery } from '../../wrappers/subgraph';
import AuctionNavigation from '../AuctionNavigation';
// import { ProgressBar, Row } from 'react-bootstrap';
// import PartyBid from '../PartyBid';

const prevAuctionsAvailable = (
  loadingPrev: boolean,
  errorPrev: ApolloError | undefined,
  prevAuction: IAuction,
) => {
  return !loadingPrev && prevAuction !== undefined && !errorPrev;
};

const createAuctionObj = (data: any): IAuction => {
  const auction: IAuction = {
    amount: BigNumber.from(data.auction.amount),
    bidder: data.auction?.bidder?.id,
    endTime: data.auction.endTime,
    startTime: data.auction.startTime,
    // length: (data.auction.endTime - data.auction.startTime),
    nounId: data.auction.id,
    settled: data.auction.settled,
  };
  return auction;
};

const PartyActivity: React.FC<{
  auction: IAuction;
}> = props => {
  const { auction: currentAuction } = props;
  const [onDisplayNounId, setOnDisplayNounId] = useState(currentAuction && currentAuction.nounId);
  const [lastAuctionId, setLastAuctionId] = useState(currentAuction && currentAuction.nounId);
  const [isLastAuction, setIsLastAuction] = useState(true);
  const [isFirstAuction, setIsFirstAuction] = useState(false);

  // Query onDisplayNounId auction. Used to display past auctions' data.
  const { data: dataCurrent } = useQuery(
    auctionQuery(onDisplayNounId && onDisplayNounId.toNumber()),
  );
  // Query onDisplayNounId auction plus one. Used to determine nounder noun timestamp.
  // const { data: dataNext } = useQuery(
  //   auctionQuery(onDisplayNounId && onDisplayNounId.add(1).toNumber()),
  // );

  // Query onDisplayNounId auction minus one. Used to cache prev auction + check if The Graph queries are functional.
  const {
    loading: loadingPrev,
    data: dataPrev,
    error: errorPrev,
  } = useQuery(auctionQuery(onDisplayNounId && onDisplayNounId.sub(1).toNumber()), {
    pollInterval: 10000,
  });

  /**
   * Auction derived from `onDisplayNounId` query
   */
  const auction: IAuction = dataCurrent && dataCurrent.auction && createAuctionObj(dataCurrent);
  /**
   * Auction derived from `onDisplayNounId.add(1)` query
   */
  // const nextAuction: IAuction = dataNext && dataNext.auction && createAuctionObj(dataNext);
  /**
   * Auction derived from `onDisplayNounId.sub(1)` query
   */
  const prevAuction: IAuction = dataPrev && dataPrev.auction && createAuctionObj(dataPrev);

  useEffect(() => {
    if (!onDisplayNounId || (currentAuction && currentAuction.nounId.gt(lastAuctionId))) {
      setOnDisplayNounId(currentAuction && currentAuction.nounId);
      setLastAuctionId(currentAuction && currentAuction.nounId);
    }
  }, [onDisplayNounId, currentAuction, lastAuctionId]);

  const auctionHandlerFactory = (nounIdMutator: (prev: BigNumber) => BigNumber) => () => {
    setOnDisplayNounId(prev => {
      const updatedNounId = nounIdMutator(prev);
      setIsFirstAuction(updatedNounId.eq(0) ? true : false);
      setIsLastAuction(updatedNounId.eq(currentAuction && currentAuction.nounId) ? true : false);
      return updatedNounId;
    });
  };

  const prevAuctionHandler = auctionHandlerFactory((prev: BigNumber) => prev.sub(1));
  const nextAuctionHandler = auctionHandlerFactory((prev: BigNumber) => prev.add(1));

  // const auctionActivityContent = (auction: IAuction, displayGraphDepComps: boolean) => (
  //   <AuctionActivity
  //     auction={auction}
  //     isFirstAuction={isFirstAuction}
  //     isLastAuction={isLastAuction}
  //     onPrevAuctionClick={prevAuctionHandler}
  //     onNextAuctionClick={nextAuctionHandler}
  //     displayGraphDepComps={displayGraphDepComps}
  //   />
  // );

  // const currentAuctionActivityContent =
  //   currentAuction &&
  //   auctionActivityContent(
  //     currentAuction,
  //     onDisplayNounId && prevAuctionsAvailable(loadingPrev, errorPrev, prevAuction), // else check if prev auct is avail
  //   );

  // const pastAuctionActivityContent =
  //   auction &&
  //   auctionActivityContent(auction, prevAuctionsAvailable(loadingPrev, errorPrev, prevAuction));

  // TO DO - Fallback if no noun ID? unlikely but
  const CurrentNounId = () => {
    return (
      <div className={classes.nounIdContainer}>
        <h1 className={classes.nounIdText}>{`Noun ${onDisplayNounId ? onDisplayNounId : ''}`}</h1>
      </div>
    );
  };

  return (
    <div className={classes.partyPaperContainer}>
      <CurrentNounId />
      {prevAuctionsAvailable(loadingPrev, errorPrev, prevAuction) && (
        <AuctionNavigation
          isFirstAuction={isFirstAuction}
          isLastAuction={isLastAuction}
          onNextAuctionClick={nextAuctionHandler}
          onPrevAuctionClick={prevAuctionHandler}
        />
      )}
      {/* {onDisplayNounId ? currentAuctionActivityContent : pastAuctionActivityContent} */}
      {isLastAuction ? (
        <>
          <PartyVault auction={currentAuction} />
          <PartyButtons />
          <PartyGuestList />
        </>
      ) : null}
    </div>
  );
};

export default PartyActivity;
