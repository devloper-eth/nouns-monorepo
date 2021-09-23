import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks';
import classes from './ConnectWalletButton.module.css';
import WalletConnectModal from '../WalletConnectModal';
import AddFundsModal from '../AddFundsModal';
import { Col, Row } from 'react-bootstrap';
import Bid from '../Bid';
import { Auction } from '../../wrappers/nounsAuction';
import config from '../../config';
import { useNounsPartyCalcBidAmount, useNounsPartyCurrentNounId, useNounsPartyNounStatus } from '../../wrappers/nounsParty';
import { BigNumber } from 'ethers';
import SettleAuctionModal from '../SettleAuction';
import useOnDisplayAuction from '../../wrappers/onDisplayAuction';

const ConnectWalletButton: React.FC<{
  auction: Auction;
}> = props => {
  const { auction: currentAuction } = props;
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const onDisplayAuction = useOnDisplayAuction();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showFundsModal, setShowFundsModal] = useState(false);
  const [showPlaceBidModal, setShowPlaceBidModal] = useState(false);
  const [showSettleAuctionModal, setShowSettleAuctionModal] = useState(false);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [auctionTimer, setAuctionTimer] = useState(false);
  const lastNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);
  const bidAmount = useNounsPartyCalcBidAmount();
  const nounsPartyCurrentNounId = useNounsPartyCurrentNounId();
  const nounsPartyPreviousNounStatus = useNounsPartyNounStatus(BigNumber.from(nounsPartyCurrentNounId));

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

  // Settle Auction Modal
  const showSettleAuctionModalHandler = () => {
    setShowSettleAuctionModal(true);
  };
  const hideSettleAuctionHandler = () => {
    setShowSettleAuctionModal(false);
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
      {showSettleAuctionModal && onDisplayAuction && (
        <SettleAuctionModal
          hideSettleAuctionHandler={hideSettleAuctionHandler}
          auction={onDisplayAuction}
        />
      )}
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
          <Bid
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
              {nounsPartyPreviousNounStatus === "won" ? (
              <button
                onClick={() => showSettleAuctionModalHandler()}
                className={classes.connectWalletButton}
              >
                Settle Auction
              </button>
            ) : (
              <button
                disabled={!activeAccount || !!checkIfPartyLeadingBidder || (bidAmount.eq(0))}
                onClick={showPlaceBidModalHandler}
                className={classes.connectWalletButton}
              >
                Submit bid
              </button>
              )}
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ConnectWalletButton;
