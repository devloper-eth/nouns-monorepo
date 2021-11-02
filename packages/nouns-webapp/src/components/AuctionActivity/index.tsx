import { Auction } from '../../wrappers/nounsAuction';
import { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import classes from './AuctionActivity.module.css';
import BigNumber from 'bignumber.js';
import AuctionTimer from '../AuctionTimer';
import CurrentBid from '../CurrentBid';
import Winner from '../Winner';
import AuctionNavigation from '../AuctionNavigation';
import stampLogo from '../../assets/nouns_stamp.svg';
import AuctionActivityDateHeadline from '../AuctionActivityDateHeadline';
import AuctionStatus from '../AuctionStatus';
import bidHistoryClasses from './BidHistory.module.css';
import {
  useNounsPartyNounStatus,
} from '../../wrappers/nounsParty';
// import { isNounderNoun } from '../../utils/nounderNoun';
// import SettleAuctionModal from '../SettleAuction';
// import ClaimTokensModal from '../ClaimTokensModal';

import Bid from '../Bid';
import { useAppSelector } from '../../hooks';
import BidHistory from '../BidHistory';

interface AuctionActivityProps {
  auction: Auction;
  isFirstAuction: boolean;
  isLastAuction: boolean;
  onPrevAuctionClick: () => void;
  onNextAuctionClick: () => void;
  displayGraphDepComps: boolean;
}

const AuctionActivity: React.FC<AuctionActivityProps> = (props: AuctionActivityProps) => {
  const {
    auction,
    isFirstAuction,
    isLastAuction,
    onPrevAuctionClick,
    onNextAuctionClick,
    displayGraphDepComps,
  } = props;

  // const activeAccount = useAppSelector(state => state.account.activeAccount);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [auctionTimer, setAuctionTimer] = useState(false);
  // const [showSettleAuctionModal, setShowSettleAuctionModal] = useState(false);

  // const isPartyNounAuction = auction.partyNounId !== undefined;

  // // TODO: Rip out?
  // // Settle Auction Modal
  // const showSettleAuctionModalHandler = () => {
  //   setShowSettleAuctionModal(true);
  // };
  // const hideSettleAuctionHandler = () => {
  //   setShowSettleAuctionModal(false);
  // };

  useEffect(() => {
    if (!auction) return;

    const timeLeft = Number(auction.endTime) - Math.floor(Date.now() / 1000);

    if (auction && timeLeft <= 0) {
      setAuctionEnded(true);
    } else {
      setAuctionEnded(false);
      const timer = setTimeout(() => {
        setAuctionTimer(!auctionTimer);
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [auctionTimer, auction]);

  // TODO: Rip out?
  // const nounStatus = useNounsPartyNounStatus(auction.nounId);

  if (!auction) return null;

  return (
    <Col lg={{ span: 6 }} className={classes.currentAuctionActivityContainer}>
      <AuctionStatus auction={auction} noundersNoun={false} />
      <div className={classes.floatingPaper}>
        <div className={classes.paperWrapper}>
          <img src={stampLogo} className={classes.nounsPartyStamp} alt="Nouns party logo" />

          <Row style={{ marginTop: '-5px' }}>
            <Col md={10}>
              <div className={classes.nounIdContainer}>
                <h1 className={classes.nounIdText}>{`Party Noun ${auction && auction.partyNounId}`}</h1>
              </div>
            </Col>
            <Col md={2}>
              <div className={classes.dateContainer}>
                {displayGraphDepComps && (
                  <AuctionNavigation
                    isFirstAuction={isFirstAuction}
                    isLastAuction={isLastAuction}
                    onNextAuctionClick={onNextAuctionClick}
                    onPrevAuctionClick={onPrevAuctionClick}
                  />
                )}
              </div>
            </Col>
          </Row>

          {auctionEnded ? (
            <Row className={classes.auctionActivityContainer}>
              <Col lg={5}>
                <Row>
                  <Col>
                    <p
                      className={`${classes.noMarginPadding} ${classes.bidText}`}
                    >{`Winning bid`}</p>
                  </Col>
                </Row>
                <Row>
                  <Col className={classes.ethAddressPadding}>
                    <h3 className={`${classes.winningAmount}`}>{`N/A`}</h3>
                  </Col>
                </Row>
              </Col>
              <Col lg={7}>
                <Winner winner={auction.bidder} auction={auction} />
              </Col>
            </Row>
          ) : (
            <Row className={classes.auctionActivityContainer}>
              <Col xs={12} md={6} className="">
                <CurrentBid
                  currentBid={new BigNumber(auction.amount.toString())}
                  auctionEnded={auctionEnded}
                  auction={auction}
                />
              </Col>
              <Col xs={12} md={6}>
                <div className={classes.auctionTimerContainer}>
                  {!auctionEnded && <AuctionTimer auction={auction} auctionEnded={auctionEnded} />}
                </div>
              </Col>
            </Row>
          )}

          {!auctionEnded && (
            <div className={classes.bidContainer}>
              <Bid
                auction={auction}
                auctionEnded={auctionEnded}
              />
            </div>
          )}


          {displayGraphDepComps && auction.partyNounId && (
            <div className={classes.bidHistoryContainer}>
              <BidHistory
                auctionId={auction.partyNounId.toString()}
                max={3}
                classes={bidHistoryClasses}
              />
            </div>
          )}

        </div>
      </div>
    </Col>
  );
};

export default AuctionActivity;
