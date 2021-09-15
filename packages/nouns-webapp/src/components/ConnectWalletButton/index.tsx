import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks';
import classes from './ConnectWalletButton.module.css';
import WalletConnectModal from '../WalletConnectModal';
import AddFundsModal from '../AddFundsModal';
import { Col, Row } from 'react-bootstrap';
import Bid from '../Bid';
// import SettleAuction from '../SettleAuction';
import { Auction } from '../../wrappers/nounsAuction';
/*  Currently unused packages FLAGGED FOR DELETION */
// import { usePendingSettled } from '../../wrappers/nounsParty';
// import { useAuction } from '../../wrappers/nounsAuction';
// import config from '../../config';
// import logo from '../../assets/logo.svg';
// import { useEtherBalance, useEthers } from '@usedapp/core';
// import { Link } from 'react-router-dom';
// import testnetNoun from '../../assets/testnet-noun.png';
// import config, { CHAIN_ID } from '../../config';
// import { utils } from 'ethers';
// import { buildEtherscanAddressLink, Network } from '../../utils/buildEtherscanLink';

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
  const lastNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);
  // const auction = useAuction(config.auctionProxyAddress);

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

  const connectedContent = (
    <>
      {auctionEnded ? (
        <>{/* <SettleAuction auction={currentAuction} /> */}</>
      ) : (
        <Row>
          <Col>
            <button onClick={showFundsModalHandler} className={classes.connectWalletButton}>
              Add funds
            </button>
          </Col>
          <Col>
            <button onClick={showPlaceBidModalHandler} className={classes.connectWalletButton}>
              Submit bid
            </button>
          </Col>
        </Row>
      )}

      {/* <Nav.Item>
        <Nav.Link className={classes.nounsNavLink} disabled>
          <span className={classes.greenStatusCircle} />
          <span>{activeAccount && <ShortAddress address={activeAccount} />}</span>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          className={clsx(classes.nounsNavLink, classes.disconnectBtn)}
          onClick={() => {
            setShowConnectModal(false);
            deactivate();
            setShowConnectModal(false);
          }}
        >
          DISCONNECT
        </Nav.Link>
      </Nav.Item> */}
    </>
  );

  const disconnectedContent = (
    <>
      <button onClick={showModalHandler} className={classes.connectWalletButton}>
        Connect Wallet
      </button>
    </>
  );

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
          <Bid
            auction={currentAuction}
            auctionEnded={auctionEnded}
            hidePlaceBidModalHandler={hidePlaceBidModalHandler}
          />
        )}
      {/* {auction &&
        lastNounId &&
        auction?.nounId?.eq(lastNounId) &&
        showPlaceBidModal &&
        activeAccount &&
        !auctionEnded && (
          <Bid
            auction={auction}
            auctionEnded={auctionEnded}
            hidePlaceBidModalHandler={hidePlaceBidModalHandler}
          />
        )} */}
      {activeAccount ? connectedContent : disconnectedContent}
    </>
  );
};

export default ConnectWalletButton;
