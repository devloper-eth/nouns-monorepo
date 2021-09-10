import { Col } from 'react-bootstrap';
import { StandaloneNounWithSeed } from '../StandaloneNoun';
import { Row, Container } from 'react-bootstrap';
import { LoadingNoun } from '../Noun';
import { Auction as IAuction } from '../../wrappers/nounsAuction';
import classes from './Auction.module.css';
import { useEffect, useState } from 'react';
import { INounSeed } from '../../wrappers/nounToken';
import { isNounderNoun } from '../../utils/nounderNoun';
import NounderNounContent from '../NounderNounContent';
import { ApolloError } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { auctionQuery } from '../../wrappers/subgraph';
import { BigNumber } from 'ethers';
import AuctionActivity from '../AuctionActivity';
/* OLD IMPORTS - FLAGGED FOR DELETION */
// import {
//   setNextOnDisplayAuctionNounId,
//   setPrevOnDisplayAuctionNounId,
// } from '../../state/slices/onDisplayAuction';
// import { useHistory } from 'react-router-dom';
// import { useAppDispatch, useAppSelector } from '../../hooks';
// import PartyActivity from '../PartyActivity';

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
    // length: data.auction.endTime - data.auction.startTime,
    nounId: data.auction.id,
    settled: data.auction.settled,
  };
  return auction;
};

const Auction: React.FC<{ auction: IAuction; bgColorHandler: (useGrey: boolean) => void }> =
  props => {
    const { auction: currentAuction, bgColorHandler } = props;

    const [onDisplayNounId, setOnDisplayNounId] = useState(currentAuction && currentAuction.nounId);
    const [lastAuctionId, setLastAuctionId] = useState(currentAuction && currentAuction.nounId);
    const [isLastAuction, setIsLastAuction] = useState(true);
    const [isFirstAuction, setIsFirstAuction] = useState(false);

    // Query onDisplayNounId auction. Used to display past auctions' data.
    const { data: dataCurrent } = useQuery(
      auctionQuery(onDisplayNounId && onDisplayNounId.toNumber()),
    );
    // Query onDisplayNounId auction plus one. Used to determine nounder noun timestamp.
    const { data: dataNext } = useQuery(
      auctionQuery(onDisplayNounId && onDisplayNounId.add(1).toNumber()),
    );

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
    const nextAuction: IAuction = dataNext && dataNext.auction && createAuctionObj(dataNext);
    /**
     * Auction derived from `onDisplayNounId.sub(1)` query
     */
    const prevAuction: IAuction = dataPrev && dataPrev.auction && createAuctionObj(dataPrev);

    const loadedNounHandler = (seed: INounSeed) => {
      bgColorHandler(seed.background === 0);
    };

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

    const nounContent = (
      <div className={classes.nounWrapper}>
        <StandaloneNounWithSeed nounId={onDisplayNounId} onLoadSeed={loadedNounHandler} />
      </div>
    );

    const loadingNoun = (
      <div className={classes.nounWrapper}>
        <LoadingNoun />
      </div>
    );

    const auctionActivityContent = (auction: IAuction, displayGraphDepComps: boolean) => (
      <AuctionActivity
        auction={auction}
        isFirstAuction={isFirstAuction}
        isLastAuction={isLastAuction}
        onPrevAuctionClick={prevAuctionHandler}
        onNextAuctionClick={nextAuctionHandler}
        displayGraphDepComps={displayGraphDepComps}
      />
    );

    const currentAuctionActivityContent =
      currentAuction &&
      auctionActivityContent(
        currentAuction,
        onDisplayNounId && prevAuctionsAvailable(loadingPrev, errorPrev, prevAuction), // else check if prev auct is avail
      );

    const pastAuctionActivityContent =
      auction &&
      auctionActivityContent(auction, prevAuctionsAvailable(loadingPrev, errorPrev, prevAuction));

    // FLAGGED FOR DELETION - Will we ever need to show nounder's nouns?
    const nounderNounContent = nextAuction && (
      <NounderNounContent
        // mintTimestamp={nextAuction.startTime}
        nounId={onDisplayNounId}
        isFirstAuction={isFirstAuction}
        isLastAuction={isLastAuction}
        onPrevAuctionClick={prevAuctionHandler}
        onNextAuctionClick={nextAuctionHandler}
        displayGraphDepComps={prevAuctionsAvailable(loadingPrev, errorPrev, prevAuction)}
      />
    );

    return (
      <Container fluid={true} className={classes.pageContentWrapper}>
        <Row>
          {/* <Col xs={12} lg={4} className={classes.auctionActivityTopSpacer}>
            {onDisplayNounId ? currentAuctionActivityContent : pastAuctionActivityContent}
          </Col> */}
          <Col lg={2} />
          <Col xs={12} lg={5} className={`align-self-end ${classes.noPaddingMargin}`}>
            {onDisplayNounId ? nounContent : loadingNoun}
            {/* {onDisplayNounId ? currentAuctionActivityContent : pastAuctionActivityContent} */}
          </Col>
          {/* align-self-end   */}
          <Col
            xs={12}
            lg={4}
            className={
              isLastAuction
                ? classes.currentAuctionActivityContainer
                : classes.pastAuctionActivityContainer
            }
          >
            {onDisplayNounId && isNounderNoun(onDisplayNounId)
              ? nounderNounContent
              : isLastAuction
              ? currentAuctionActivityContent
              : pastAuctionActivityContent}
            {/* {isLastAuction ? currentAuctionActivityContent : pastAuctionActivityContent} */}
          </Col>
          <Col lg={2} />

          {/* FLAGGED FOR DELETION  */}
          {/* <Col lg={{ span: 6 }} className={classes.nounContentCol}>
            {onDisplayNounId ? nounContent : loadingNoun}
          </Col>
          <Col lg={{ span: 6 }} className={classes.auctionActivityCol}>
            {onDisplayNounId && isNounderNoun(onDisplayNounId)
              ? nounderNounContent
              : isLastAuction
              ? currentAuctionActivityContent
              : pastAuctionActivityContent}
          </Col> */}
        </Row>
      </Container>
    );
  };

export default Auction;
// interface AuctionProps {
//   auction: IAuction;
//   bgColorHandler: (useGrey: boolean) => void;
// }

// const Auction: React.FC<AuctionProps> = props => {
//   const { auction: currentAuction, bgColorHandler } = props;

//   const history = useHistory();
//   const dispatch = useAppDispatch();
//   const lastNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);

//   const loadedNounHandler = (seed: INounSeed) => {
//     bgColorHandler(seed.background === 0);
//   };

//   const prevAuctionHandler = () => {
//     dispatch(setPrevOnDisplayAuctionNounId());
//     history.push(`/noun/${currentAuction.nounId.toNumber() - 1}`);
//   };
//   const nextAuctionHandler = () => {
//     dispatch(setNextOnDisplayAuctionNounId());
//     history.push(`/noun/${currentAuction.nounId.toNumber() + 1}`);
//   };

//   const nounContent = (
//     <div className={classes.nounWrapper}>
//       <StandaloneNounWithSeed nounId={currentAuction.nounId} onLoadSeed={loadedNounHandler} />
//     </div>
//   );

//   const loadingNoun = (
//     <div className={classes.nounWrapper}>
//       <LoadingNoun />
//     </div>
//   );

//   const currentAuctionActivityContent = lastNounId && (
//     <AuctionActivity
//       auction={currentAuction}
//       isFirstAuction={currentAuction.nounId.eq(0)}
//       isLastAuction={currentAuction.nounId.eq(lastNounId)}
//       onPrevAuctionClick={prevAuctionHandler}
//       onNextAuctionClick={nextAuctionHandler}
//       displayGraphDepComps={true}
//     />
//   );
//   const nounderNounContent = lastNounId && (
//     <NounderNounContent
//       mintTimestamp={currentAuction.startTime}
//       nounId={currentAuction.nounId}
//       isFirstAuction={currentAuction.nounId.eq(0)}
//       isLastAuction={currentAuction.nounId.eq(lastNounId)}
//       onPrevAuctionClick={prevAuctionHandler}
//       onNextAuctionClick={nextAuctionHandler}
//     />
//   );

//   return (
//     <Container fluid="lg">
//       <Row>
//         <Col lg={{ span: 6 }} className={classes.nounContentCol}>
//           {currentAuction ? nounContent : loadingNoun}
//         </Col>
//         <Col lg={{ span: 6 }} className={classes.auctionActivityCol}>
//           {isNounderNoun(currentAuction.nounId)
//             ? nounderNounContent
//             : currentAuctionActivityContent}
//         </Col>
//       </Row>
//     </Container>
//   );
// };
