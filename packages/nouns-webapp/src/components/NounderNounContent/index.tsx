import { Col, Row } from 'react-bootstrap';
import { BigNumber } from 'ethers';
import AuctionNavigation from '../AuctionNavigation';
import classes from './NounderNounContent.module.css';
import stampLogo from '../../assets/nouns_stamp.svg';
import AuctionActivityDateHeadline from '../AuctionActivityDateHeadline';
// import AuctionActivityNounTitle from '../AuctionActivityNounTitle';
// import AuctionActivityDateHeadline from '../AuctionActivityDateHeadline';
// import { Link } from 'react-router-dom';
// import nounContentClasses from './NounderNounContent.module.css';
// import auctionBidClasses from '../AuctionActivity/BidHistory.module.css';
// import bidBtnClasses from '../BidHistoryBtn//BidHistoryBtn.module.css';
// import auctionActivityClasses from '../AuctionActivity/AuctionActivity.module.css';
// import AuctionActivityWrapper from '../AuctionActivityWrapper';

const NounderNounContent: React.FC<{
  mintTimestamp: BigNumber;
  nounId: BigNumber;
  isFirstAuction: boolean;
  isLastAuction: boolean;
  onPrevAuctionClick: () => void;
  onNextAuctionClick: () => void;
  displayGraphDepComps: boolean;
}> = props => {
  const {
    mintTimestamp,
    nounId,
    isFirstAuction,
    isLastAuction,
    onPrevAuctionClick,
    onNextAuctionClick,
    displayGraphDepComps,
  } = props;

  return (
    <>
      <div className={classes.floatingPaper}>
        <div className={classes.paperWrapper}>
          <img src={stampLogo} className={classes.nounsPartyStamp} alt="Nouns party logo" />
          <AuctionActivityDateHeadline startTime={mintTimestamp} />
          <div className={classes.nounIdContainer}>
            <h1 className={classes.nounIdText}>{`Noun ${nounId}`}</h1>
            {displayGraphDepComps && (
              <AuctionNavigation
                isFirstAuction={isFirstAuction}
                isLastAuction={isLastAuction}
                onNextAuctionClick={onNextAuctionClick}
                onPrevAuctionClick={onPrevAuctionClick}
              />
            )}
          </div>

          <Row className={classes.auctionActivityContainer}>
            <Col lg={5}>
              <Row>
                <Col>
                  <p className={`${classes.noMarginPadding} ${classes.bidText}`}>{`Winning bid`}</p>
                </Col>
              </Row>
              <Row>
                <Col className={classes.ethAddressPadding}>
                  <h3 className={`${classes.winningAmount}`}>{`N/A`}</h3>
                </Col>
              </Row>
            </Col>
            <Col lg={7}>
              <Row>
                <Col>
                  <p className={`${classes.noMarginPadding} ${classes.bidText}`}>Winner</p>
                </Col>
              </Row>
              <Row>
                <Col className={classes.ethAddressPadding}>
                  <h3 className={classes.addressText}>Nounders.eth</h3>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </>
    // <AuctionActivityWrapper>
    //   <div className={auctionActivityClasses.informationRow}>
    //     <Row className={auctionActivityClasses.activityRow}>
    //       <Col lg={12}>
    //         <AuctionActivityDateHeadline startTime={mintTimestamp} />
    //       </Col>
    //       <Col lg={12} className={auctionActivityClasses.colAlignCenter}>
    //         <AuctionActivityNounTitle nounId={nounId} />
    //         <AuctionNavigation
    //           isFirstAuction={isFirstAuction}
    //           isLastAuction={isLastAuction}
    //           onNextAuctionClick={onNextAuctionClick}
    //           onPrevAuctionClick={onPrevAuctionClick}
    //         />
    //       </Col>
    //     </Row>
    //     <Row className={auctionActivityClasses.activityRow}>
    //       <Col lg={5} className={auctionActivityClasses.currentBidCol}>
    //         <CurrentBid currentBid={BID_N_A} auctionEnded={true} />
    //       </Col>
    //       <Col
    //         lg={5}
    //         className={`${auctionActivityClasses.currentBidCol} ${nounContentClasses.currentBidCol}`}
    //       >
    //         <div className={auctionActivityClasses.section}>
    //           <h4>Winner</h4>
    //           <h2>nounders.eth</h2>
    //         </div>
    //       </Col>
    //     </Row>
    //   </div>
    //   <Row className={auctionActivityClasses.activityRow}>
    //     <Col lg={12}>
    //       <ul className={auctionBidClasses.bidCollection}>
    //         <li className={`${auctionBidClasses.bidRow} ${nounContentClasses.bidRow}`}>
    //           All Noun auction proceeds are sent to the{' '}
    //           <Link to="/vote" className={nounContentClasses.link}>
    //             Nouns DAO
    //           </Link>
    //           . For this reason, we, the project's founders (‘Nounders’) have chosen to compensate
    //           ourselves with Nouns. Every 10th Noun for the first 5 years of the project will be
    //           sent to our multisig (5/10), where it will be vested and distributed to individual
    //           Nounders.
    //         </li>
    //       </ul>
    //       <div className={bidBtnClasses.bidHistoryWrapper}>
    //         <Link to="/nounders" className={bidBtnClasses.bidHistory}>
    //           Learn More →
    //         </Link>
    //       </div>
    //     </Col>
    //   </Row>
    // </AuctionActivityWrapper>
  );
};
export default NounderNounContent;
