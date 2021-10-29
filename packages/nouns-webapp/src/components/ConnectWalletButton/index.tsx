import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks';
import classes from './ConnectWalletButton.module.css';
import WalletConnectModal from '../WalletConnectModal';
import AddFundsModal from '../AddFundsModal';
import { Col, Row } from 'react-bootstrap';
import VaultBid from '../VaultBid';
import { Auction } from '../../wrappers/nounsAuction';
import config from '../../config';
import { useNounsPartyCalcBidAmount } from '../../wrappers/nounsParty';
import { getOnDisplayByKey } from '../../state/slices/onDisplayAuction';
const ConnectWalletButton: React.FC<{
  auction: Auction;
}> = props => {
  const { auction: currentAuction } = props;
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showFundsModal, setShowFundsModal] = useState(false);
  const [showPlaceBidModal, setShowPlaceBidModal] = useState(false);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [auctionTimer, setAuctionTimer] = useState(false);
  const lastNounId = useAppSelector(state => getOnDisplayByKey(state.onDisplayAuction, 'noun')?.lastAuctionNounId);
  const bidAmount = useNounsPartyCalcBidAmount();

  // const nounsPartyCurrentNounId = useNounsPartyCurrentNounId();
  // const nounsPartyPreviousNounStatus = useNounsPartyNounStatus(BigNumber.from(nounsPartyCurrentNounId));

  const showModalHandler = () => {
    setShowConnectModal(true);
  };
  const hideModalHandler = () => {
    setShowConnectModal(false);
  };

  const showFundsModalHandler = () => {
    setShowFundsModal(true);
  };
  const hideFundsModalHandler = () => {
    setShowFundsModal(false);
  };

  // Place Bid Modal
  const showPlaceBidModalHandler = () => {
    setShowPlaceBidModal(true);
  };
  const hidePlaceBidModalHandler = () => {
    setShowPlaceBidModal(false);
  };

  // timer logic
  useEffect(() => {
    if (!currentAuction) return;

    const timeLeft = Number(currentAuction.endTime) - Math.floor(Date.now() / 1000);

    if (currentAuction && timeLeft <= 0) {
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
  }, [auctionTimer, currentAuction]);

  const checkIfPartyLeadingBidder =
    currentAuction &&
    currentAuction.bidder &&
    currentAuction.bidder.toLowerCase() === config.nounsPartyAddress.toLowerCase();

  return (
    <>
      {showConnectModal && activeAccount === undefined && (
        <WalletConnectModal onDismiss={hideModalHandler} />
      )}
      {showFundsModal && activeAccount && (
        <AddFundsModal onDismiss={hideFundsModalHandler} activeAccount={activeAccount} />
      )}
      {currentAuction &&
        lastNounId &&
        currentAuction?.nounId?.eq(lastNounId) &&
        showPlaceBidModal &&
        activeAccount &&
        !auctionEnded && (
          <VaultBid
            auction={currentAuction}
            auctionEnded={auctionEnded}
            hidePlaceBidModalHandler={hidePlaceBidModalHandler}
          />
        )}
      {!auctionEnded && (
        <>
          <Row>
            <Col>
              <button
                onClick={activeAccount ? showFundsModalHandler : showModalHandler}
                className={classes.connectWalletButton}
              >
                Add funds
              </button>
            </Col>
            <Col>
              <button
                disabled={!!checkIfPartyLeadingBidder || bidAmount.eq(0)}
                onClick={activeAccount ? showPlaceBidModalHandler : showModalHandler}
                className={classes.connectWalletButton}
              >
                Submit bid
              </button>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ConnectWalletButton;
