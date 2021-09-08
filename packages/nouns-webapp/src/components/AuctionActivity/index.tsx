import { Auction } from '../../wrappers/nounsAuction';
import { useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { Row, Col } from 'react-bootstrap';
import classes from './AuctionActivity.module.css';
import AuctionTimer from '../AuctionTimer';
import CurrentBid from '../CurrentBid';
import Winner from '../Winner';

/*  Currently unused packages but may need if commented components are brought back in  */
// import config, { CHAIN_ID } from '../../config';
// import { buildEtherscanAddressLink, Network } from '../../utils/buildEtherscanLink';
// import AuctionActivityNounTitle from '../AuctionActivityNounTitle';
// import AuctionActivityDateHeadline from '../AuctionActivityDateHeadline';
// import BidHistoryBtn from '../BidHistoryBtn';
// import StandaloneNoun from '../StandaloneNoun';
// import { Modal } from 'react-bootstrap';
// import AuctionNavigation from '../AuctionNavigation';
// import Bid from '../Bid';
// import bidHistoryClasses from './BidHistory.module.css';
// import BidHistory from '../BidHistory';
// import AuctionActivityWrapper from '../AuctionActivityWrapper';
// import config from '../../config';
// import { buildEtherscanAddressLink } from '../../utils/etherscan';

// const openEtherscanBidHistory = () => {
//   const url = buildEtherscanAddressLink(
//     config.auctionProxyAddress,
//     CHAIN_ID === 1 ? Network.mainnet : Network.rinkeby,
//   );
//   window.open(url.toString());
// };

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
    // isFirstAuction,
    // isLastAuction,
    // onPrevAuctionClick,
    // onNextAuctionClick,
    // displayGraphDepComps,
  } = props;

  const [auctionEnded, setAuctionEnded] = useState(false);
  const [auctionTimer, setAuctionTimer] = useState(false);

  // const [showBidHistoryModal, setShowBidHistoryModal] = useState(false);
  // const showBidModalHandler = () => {
  //   setShowBidHistoryModal(true);
  // };
  // const dismissBidModalHanlder = () => {
  //   setShowBidHistoryModal(false);
  // };

  // const bidHistoryTitle = (
  //   <h1>
  //     Noun {auction && auction.nounId.toString()}
  //     <br /> Bid History
  //   </h1>
  // );

  // timer logic
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

  if (!auction) return null;

  return (
    <>
      {/* FLAGGED FOR REMOVAL - No popup modal option shown in design */}
      {/* {showBidHistoryModal && (
        <Modal
          show={showBidHistoryModal}
          onHide={dismissBidModalHanlder}
          dialogClassName="modal-90w"
        >
          <Modal.Header closeButton className={classes.modalHeader}>
            <div className={classes.modalHeaderNounImgWrapper}>
              <StandaloneNoun nounId={auction && auction.nounId} />
            </div>
            <Modal.Title className={classes.modalTitleWrapper}>{bidHistoryTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <BidHistory auctionId={auction.nounId.toString()} max={9999} />
          </Modal.Body>
        </Modal>
      )} */}

      <Row className={classes.auctionActivityContainer}>
        <Col lg={5}>
          <CurrentBid
            currentBid={new BigNumber(auction.amount.toString())}
            auctionEnded={auctionEnded}
          />
        </Col>
        <Col lg={7}>
          {auctionEnded ? (
            <Winner winner={auction.bidder} />
          ) : (
            <AuctionTimer auction={auction} auctionEnded={auctionEnded} />
          )}
        </Col>
      </Row>

      {/* {displayGraphDepComps && (
          <BidHistory auctionId={auction.nounId.toString()} max={3} classes={bidHistoryClasses} />
        )} */}

      {/* TODO - will need displayGraphDepComps boolean but remove to make initial design easier  */}
      {/* <BidHistory auctionId={auction.nounId.toString()} max={3} classes={bidHistoryClasses} /> */}

      {/* FLAGGED FOR REMOVAL - Will cherrypick components and change style when needed */}
      {/* <AuctionActivityWrapper>
        <div className={classes.informationRow}>
          <Row className={classes.activityRow}>
            <Col lg={12}>
              <AuctionActivityDateHeadline startTime={auction.startTime} />
            </Col>
            <Col lg={12} className={classes.colAlignCenter}>
              <AuctionActivityNounTitle nounId={auction.nounId} />
              {displayGraphDepComps && (
                <AuctionNavigation
                  isFirstAuction={isFirstAuction}
                  isLastAuction={isLastAuction}
                  onNextAuctionClick={onNextAuctionClick}
                  onPrevAuctionClick={onPrevAuctionClick}
                />
              )}
            </Col>
          </Row>
          <Row className={classes.activityRow}>
            <Col lg={5} className={classes.currentBidCol}>
              <CurrentBid
                currentBid={new BigNumber(auction.amount.toString())}
                auctionEnded={auctionEnded}
              />
            </Col>
            <Col lg={5} className={classes.auctionTimerCol}>
              {auctionEnded ? (
                <Winner winner={auction.bidder} />
              ) : (
                <AuctionTimer auction={auction} auctionEnded={auctionEnded} />
              )}
            </Col>
          </Row>
        </div>
        {isLastAuction && (
          <Row className={classes.activityRow}>
            <Col lg={12}>
              <Bid auction={auction} auctionEnded={auctionEnded} />
            </Col>
          </Row>
        )}
        <Row className={classes.activityRow}>
          <Col lg={12}>
            {displayGraphDepComps && (
              <BidHistory
                auctionId={auction.nounId.toString()}
                max={3}
                classes={bidHistoryClasses}
              />
            )}

            If no bids, show nothing. If bids avail:graph is stable? show bid history modal,
            else show etherscan contract link

            {!auction.amount.eq(0) &&
              (displayGraphDepComps ? (
                <BidHistoryBtn onClick={showBidModalHandler} />
              ) : (
                <BidHistoryBtn onClick={openEtherscanBidHistory} />
              ))}
          </Col>
        </Row>
      </AuctionActivityWrapper> */}
    </>
  );
};

export default AuctionActivity;
