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
import {
  useNounsPartyNounStatus,
} from '../../wrappers/nounsParty';
import { isNounderNoun } from '../../utils/nounderNoun';
import SettleAuctionModal from '../SettleAuction';
import ClaimTokensModal from '../ClaimTokensModal';

import Bid from '../Bid';
import { useAppSelector } from '../../hooks';

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

  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [auctionTimer, setAuctionTimer] = useState(false);
  const [showSettleAuctionModal, setShowSettleAuctionModal] = useState(false);

  const isPartyNounAuction = auction.partyNounId !== undefined;

  // TODO: Rip out?
  // Settle Auction Modal
  const showSettleAuctionModalHandler = () => {
    setShowSettleAuctionModal(true);
  };
  const hideSettleAuctionHandler = () => {
    setShowSettleAuctionModal(false);
  };

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
  const nounStatus = useNounsPartyNounStatus(auction.nounId);

  if (!auction) return null;

  return (
    <Col lg={{ span: 6 }} className={classes.currentAuctionActivityContainer}>

      { /* TODO: Rip out? */ }
      {showSettleAuctionModal && auction && (
        <SettleAuctionModal
          hideSettleAuctionHandler={hideSettleAuctionHandler}
          auction={auction}
        />
      )}

      <div className={classes.floatingPaper}>
        <div className={classes.paperWrapper}>
          <img src={stampLogo} className={classes.nounsPartyStamp} alt="Nouns party logo" />

          <Row>
            <Col xs={12} md={6}>
              <div className={classes.dateContainer}>
                <AuctionActivityDateHeadline startTime={auction.startTime} />
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
            <Col xs={12} md={6} className="align-self-end"></Col>
          </Row>
          <Row style={{ marginTop: '-10px' }}>
            <Col xs={12} md={6}>
              <div className={classes.nounIdContainer}>
                <h1 className={classes.nounIdText}>{`Noun ${auction && auction.nounId}`}</h1>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className={classes.auctionTimerContainer}>
                {!auctionEnded && <AuctionTimer auction={auction} auctionEnded={auctionEnded} />}
              </div>
            </Col>
          </Row>

          {auction.nounId && isNounderNoun(auction.nounId) && (
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
                <Winner winner={'nounders.eth'} auction={auction} />
              </Col>
            </Row>
          )}

          {!isNounderNoun(auction.nounId) && (
            <Row className={`${classes.auctionActivityContainer} justify-content-center`}>
              {auctionEnded ? (
                <Col xs={12} lg={5} className="align-self-center">
                  <CurrentBid
                    currentBid={new BigNumber(auction.amount.toString())}
                    auctionEnded={auctionEnded}
                    auction={auction}
                  />
                </Col>
              ) : (
                <Col xs={6} className="align-self-center">
                  {/* What scenario renders this */ }
                </Col>
              )}

              { /* TODO: Logic is duplicate of above? Huh? */}
              {auctionEnded ? (
                <Col xs={12} lg={7}>
                  <Winner winner={auction.bidder} auction={auction} />
                </Col>
              ) : (
                <Col xs={6}>
                  <CurrentBid
                    currentBid={new BigNumber(auction.amount.toString())}
                    auctionEnded={auctionEnded}
                    auction={auction}
                  />
                </Col>
              )}
            </Row>
          )}

          {nounStatus === 'won' && (
            <>
              <Row className={`${classes.settleAuctionRow} justify-content-center`}>
                <Col>
                  <button
                    onClick={() => showSettleAuctionModalHandler()}
                    className={classes.settleAuctionButton}
                  >
                    Settle Auction
                  </button>
                </Col>
              </Row>
            </>
          )}


          {/* TODO: Re-add list of bidders */}
          {isLastAuction && (
            <>
              <Bid
                auction={auction}
                auctionEnded={auctionEnded}
              />
            </>
          )}
        </div>
      </div>
    </Col>
  );
};

export default AuctionActivity;
