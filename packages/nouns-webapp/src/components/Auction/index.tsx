import { Col } from 'react-bootstrap';
import { StandaloneNounWithSeed } from '../StandaloneNoun';
import AuctionActivity from '../AuctionActivity';
import { Row, Container } from 'react-bootstrap';
import { LoadingNoun } from '../Noun';
import { Auction as IAuction } from '../../wrappers/nounsAuction';
import classes from './Auction.module.css';
import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { auctionQuery } from '../../wrappers/subgraph';
import { BigNumber } from 'ethers';
import { INounSeed } from '../../wrappers/nounToken';
import NounderNounContent from '../NounderNounContent';
import { ApolloError } from '@apollo/client';
import announcerLogo from '../../assets/announcer.png';
import PartyBidsBox from '../PartyBidsBox';
import BidHistory from '../BidHistory';
import bidHistoryClasses from '../BidHistory/BidHistory.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import ShortAddress from '../ShortAddress';
import moment from 'moment';

const isNounderNoun = (nounId: BigNumber) => {
  return nounId.mod(10).eq(0) || nounId.eq(0);
};

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
    length: data.auction.endTime - data.auction.startTime,
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

    const nounderNounContent = nextAuction && (
      <NounderNounContent
        mintTimestamp={nextAuction.startTime}
        nounId={onDisplayNounId}
        isFirstAuction={isFirstAuction}
        isLastAuction={isLastAuction}
        onPrevAuctionClick={prevAuctionHandler}
        onNextAuctionClick={nextAuctionHandler}
      />
    );

    const placeholderBids = [
      { bid: 'Ξ102.34', address: '0x969E52e0b130899ca2d601bd5366c33f1bf6e393' },
      { bid: 'Ξ102.34', address: '0x969E52e0b130899ca2d601bd5366c33f1bf6e393' },
      { bid: 'Ξ102.34', address: '0x969E52e0b130899ca2d601bd5366c33f1bf6e393' },
      { bid: 'Ξ102.34', address: '0x969E52e0b130899ca2d601bd5366c33f1bf6e393' },
      { bid: 'Ξ102.34', address: '0x969E52e0b130899ca2d601bd5366c33f1bf6e393' },
      { bid: 'Ξ102.34', address: '0x969E52e0b130899ca2d601bd5366c33f1bf6e393' },
    ];

    return (
      <Container className={classes.mainContainer} fluid>
        <Row>
          <Col xs={3}>
            <div style={{ marginTop: '30px', marginBottom: '20px' }}>
              <img style={{ maxWidth: '60%' }} src={announcerLogo} />
            </div>

            {/* {displayGraphDepComps && (
              <BidHistory
                auctionId={auction.nounId.toString()}
                max={3}
                classes={bidHistoryClasses}
              />
            )} */}
            <ul className={classes.bidCollection}>
              {placeholderBids.map((bid, index) => (
                <li key={index} className={classes.bidRow}>
                  <div className={classes.bidItem}>
                    <div className={classes.leftSectionWrapper}>
                      <div className={classes.bidder}>
                        <div>
                          <ShortAddress address={bid.address} />
                        </div>
                      </div>
                      {/* <div className={classes.bidDate}>{`${moment().format(
                        'MMM DD',
                      )} at ${moment().format('hh:mm a')}`}</div> */}
                    </div>
                    <div className={classes.rightSectionWrapper}>
                      <div className={classes.bidAmount}>{bid.bid}</div>
                      <div className={classes.linkSymbol}>
                        <a href="#" target="_blank" rel="noreferrer">
                          <FontAwesomeIcon icon={faExternalLinkAlt} />
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Col>
          <Col xs={3}>
            <Row className="justify-content-center" style={{ marginBottom: '20px' }}>
              {onDisplayNounId ? nounContent : loadingNoun}
            </Row>
            <Row>
              {onDisplayNounId && isNounderNoun(onDisplayNounId)
                ? nounderNounContent
                : isLastAuction
                ? currentAuctionActivityContent
                : pastAuctionActivityContent}
            </Row>
          </Col>
          <Col xs={6}>
            <PartyBidsBox />
          </Col>

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
