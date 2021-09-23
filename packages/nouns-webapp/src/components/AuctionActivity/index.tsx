import { Auction } from '../../wrappers/nounsAuction';
import { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import classes from './AuctionActivity.module.css';
import BigNumber from 'bignumber.js';
import AuctionTimer from '../AuctionTimer';
import CurrentBid from '../CurrentBid';
import Winner from '../Winner';
import PartyProgressBar from '../PartyProgressBar';
import PartyButtons from '../PartyButtons';
import PartyGuestList from '../PartyGuestList';
import AuctionNavigation from '../AuctionNavigation';
import stampLogo from '../../assets/nouns_stamp.svg';
import AuctionActivityDateHeadline from '../AuctionActivityDateHeadline';
import AuctionStatus from '../AuctionStatus';
import { useFracTokenVaults, useNounsPartyClaimsCount, useNounsPartyNounStatus } from '../../wrappers/nounsParty';
import { isNounderNoun } from '../../utils/nounderNoun';
import SettleAuctionModal from '../SettleAuction';
import useOnDisplayAuction from '../../wrappers/onDisplayAuction';
import ClaimTokensModal from '../ClaimTokensModal';

// import { utils } from 'ethers';
import PartyVault from '../PartyVault';
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
  const onDisplayAuction = useOnDisplayAuction();
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [auctionTimer, setAuctionTimer] = useState(false);
  const [showSettleAuctionModal, setShowSettleAuctionModal] = useState(false);
  const [showClaimTokensModal, setShowClaimTokensModal] = useState(false);
  const currentClaimsCount = useNounsPartyClaimsCount(activeAccount);

  // Settle Auction Modal
  const showSettleAuctionModalHandler = () => {
    setShowSettleAuctionModal(true);
  };
  const hideSettleAuctionHandler = () => {
    setShowSettleAuctionModal(false);
  };

  // Claim Tokens Modal
  const showClaimTokensModalHandler = () => {
    setShowClaimTokensModal(true);
  };

  const hideClaimTokensModalHandler = () => {
    setShowClaimTokensModal(false);
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

  const fracVault = useFracTokenVaults(auction.nounId);
  const nounStatus = useNounsPartyNounStatus(auction.nounId);

  if (!auction) return null;

  return (
    <>
      {showSettleAuctionModal && onDisplayAuction && (
        <SettleAuctionModal
          hideSettleAuctionHandler={hideSettleAuctionHandler}
          auction={onDisplayAuction}
        />
      )}
      {showClaimTokensModal && activeAccount && currentClaimsCount > 0 && (
        <ClaimTokensModal
          hideClaimTokensModalHandler={hideClaimTokensModalHandler}
          activeAccount={activeAccount}
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

          {isLastAuction && !auctionEnded && <PartyProgressBar auction={auction} />}

          {!isNounderNoun(auction.nounId) && <AuctionStatus auction={auction} />}

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
                  <PartyVault auction={auction} />
                </Col>
              )}

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

          {nounStatus === "won" && (
            <>
              <Row>
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

          {fracVault && currentClaimsCount > 0 && (
            <>
              <Row>
                <Col className={classes.fracVaultContainer}>
                  <button
                    onClick={showClaimTokensModalHandler}
                    className={classes.fracVaultButton}
                  >
                    Claim tokens
                  </button>
                </Col>
              </Row>
            </>
          )}

          {fracVault && (
            <>
              <Row>
                <Col className={classes.fracVaultContainer}>
                  <button
                    className={classes.fracVaultButton}
                    type="button"
                    onClick={e => {
                      e.preventDefault();
                      window.open('https://fractional.art/vaults/' + fracVault, '_blank');
                    }}
                  >
                    Go to token vault
                  </button>
                </Col>
              </Row>
            </>
          )}

          {isLastAuction && (
            <>
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
