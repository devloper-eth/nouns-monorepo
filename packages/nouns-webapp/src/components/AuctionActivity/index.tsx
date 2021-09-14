import { Auction } from '../../wrappers/nounsAuction';
import { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import classes from './AuctionActivity.module.css';
import BigNumber from 'bignumber.js';
import AuctionTimer from '../AuctionTimer';
import CurrentBid from '../CurrentBid';
import Winner from '../Winner';
import PartyVault from '../PartyVault';
import PartyButtons from '../PartyButtons';
import PartyGuestList from '../PartyGuestList';
import AuctionNavigation from '../AuctionNavigation';
import SettleAuction from '../SettleAuction';
import stampLogo from '../../assets/nouns_stamp.svg';
import AuctionActivityDateHeadline from '../AuctionActivityDateHeadline';
import AuctionStatus from '../AuctionStatus';
import { useFracTokenVaults } from '../../wrappers/nounsParty';
import { isNounderNoun } from '../../utils/nounderNoun';


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
    displayGraphDepComps
  } = props;

  const [auctionEnded, setAuctionEnded] = useState(false);
  const [auctionTimer, setAuctionTimer] = useState(false);

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

  const fracVault = useFracTokenVaults(auction.nounId);

  if (!auction) return null;

  return (
    <>
      <div className={classes.floatingPaper}>
        <div className={classes.paperWrapper}>
          <img src={stampLogo} className={classes.nounsPartyStamp} alt="Nouns party logo" />
          <AuctionActivityDateHeadline startTime={auction.startTime} />
          <div className={classes.nounIdContainer}>
            <h1 className={classes.nounIdText}>{`Noun ${auction && auction.nounId}`}</h1>
            {displayGraphDepComps && (
              <AuctionNavigation
                isFirstAuction={isFirstAuction}
                isLastAuction={isLastAuction}
                onNextAuctionClick={onNextAuctionClick}
                onPrevAuctionClick={onPrevAuctionClick}
              />
            )}
          </div>

          {auction.nounId && isNounderNoun(auction.nounId) && (
            <Row className={classes.auctionActivityContainer}>
              <Col lg={6}>
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
              <Col lg={6}>
                <Winner winner={"nounders.eth"} auction={auction} />
              </Col>
            </Row>
          )}

          {!isNounderNoun(auction.nounId) && (
            <Row className={classes.auctionActivityContainer}>
              <Col lg={6}>
                <CurrentBid currentBid={new BigNumber(auction.amount.toString())} auctionEnded={auctionEnded}/>
              </Col>
              <Col lg={6}>
                {auctionEnded ? (
                  <Winner winner={auction.bidder} auction={auction} />
                ) : (
                  <AuctionTimer auction={auction} auctionEnded={auctionEnded} />
                )}
              </Col>
            </Row>
          )}

          {!isLastAuction && (
            <AuctionStatus auction={auction} />
          )}

          {!isLastAuction && auction && auction.nounId && (
            <Row className={classes.buttonsWrapper}>
              <Col>
                <SettleAuction auction={auction} />
              </Col>
            </Row>
          )}

          {fracVault && (
            <>
              <Row>
                <Col className={classes.fracVaultContainer}>
                  <button
                    className={classes.fracVaultButton}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open("https://fractional.art/vaults/" + fracVault, "_blank");
                    }}
                  >Go to token vault</button>
                </Col>
              </Row>
            </>
          )}

          {isLastAuction && (
            <>
              <PartyVault auction={auction} />
              <AuctionStatus auction={auction} />
              <PartyButtons auction={auction} />
              <PartyGuestList />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AuctionActivity;
