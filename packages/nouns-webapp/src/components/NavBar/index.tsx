import classes from './NavBar.module.css';
import logo from '../../assets/nouns-party.svg';
import { Link } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import clsx from 'clsx';
import { CHAIN_ID } from '../../config';
import { useAppSelector } from '../../hooks';
import ShortAddress from '../ShortAddress';
import { useState } from 'react';
import { useEthers } from '@usedapp/core';
import WalletConnectModal from '../WalletConnectModal';
// import PartyInvite from '../PartyInvite';
import WithdrawModal from '../WithdrawModal';
import ClaimTokensModal from '../ClaimTokensModal';
// import { useAuction } from '../../wrappers/nounsAuction';
// import Bid from '../Bid';
import SettleAuctionModal from '../SettleAuction';
// import { Auction as IAuction } from '../../wrappers/nounsAuction';
import useOnDisplayAuction from '../../wrappers/onDisplayAuction';
import { useNounsPartyPendingSettledCount, useNounsPartySettleNext } from '../../wrappers/nounsParty';
import { BigNumber } from '@ethersproject/bignumber';

const NavBar = () => {
  const onDisplayAuction = useOnDisplayAuction();
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  // const lastNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);
  // const auction = useAuction(config.auctionProxyAddress);
  const { deactivate } = useEthers();

  // const treasuryBalance = useEtherBalance(config.nounsDaoExecutorAddress);
  // const daoEtherscanLink = buildEtherscanAddressLink(config.nounsDaoExecutorAddress);

  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showClaimTokensModal, setShowClaimTokensModal] = useState(false);
  // const [showPlaceBidModal, setShowPlaceBidModal] = useState(false);
  const [showSettleAuctionModal, setShowSettleAuctionModal] = useState(false);
  // const [auctionEnded, setAuctionEnded] = useState(false);
  // const [auctionTimer, setAuctionTimer] = useState(false);

  // Wallet Connect Modal
  const showModalHandler = () => {
    setShowConnectModal(true);
  };
  const hideModalHandler = () => {
    setShowConnectModal(false);
  };

  // Withdraw Modal
  const showWithdrawModalHandler = () => {
    setShowWithdrawModal(true);
  };
  const hideWithdrawModalHandler = () => {
    setShowWithdrawModal(false);
  };

  // Claim Tokens Modal
  const showClaimTokensModalHandler = () => {
    setShowClaimTokensModal(true);
  };

  const hideClaimTokensModalHandler = () => {
    setShowClaimTokensModal(false);
  };

  // Place Bid Modal
  // const showPlaceBodModalHandler = () => {
  //   setShowPlaceBidModal(true);
  // };
  // const hidePlaceBidModalHandler = () => {
  //   setShowPlaceBidModal(false);
  // };

  // Settle Auction Modal
  const showSettleAuctionModalHandler = () => {
    setShowSettleAuctionModal(true);
  };
  const hideSettleAuctionHandler = () => {
    setShowSettleAuctionModal(false);
  };

  const connectedContent = (
    <>
      <Nav.Item>
        <Nav.Link className={classes.nounsNavLink} disabled>
          <span className={classes.greenStatusCircle} />
          <span className={classes.nounsNavLink}>
            {activeAccount && <ShortAddress address={activeAccount} />}
          </span>
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
      </Nav.Item>
    </>
  );

  const disconnectedContent = (
    <>
      <Nav.Link
        className={clsx(classes.nounsNavLink, classes.connectBtn)}
        onClick={showModalHandler}
      >
        CONNECT WALLET
      </Nav.Link>
    </>
  );

  return (
    <>
      {showConnectModal && activeAccount === undefined && (
        <WalletConnectModal onDismiss={hideModalHandler} />
      )}
      {showWithdrawModal && activeAccount && (
        <WithdrawModal hideWithdrawModalHandler={hideWithdrawModalHandler} />
      )}
      {showClaimTokensModal && activeAccount && (
        <ClaimTokensModal
          hideClaimTokensModalHandler={hideClaimTokensModalHandler}
          activeAccount={activeAccount}
        />
      )}
      {showSettleAuctionModal && onDisplayAuction && (
        <SettleAuctionModal
          hideSettleAuctionHandler={hideSettleAuctionHandler}
          auction={onDisplayAuction}
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
      <Navbar expand="lg" className={classes.navBarContainer}>
        <Container>
          <Navbar.Brand as={Link} to="/" className={classes.navBarBrand}>
            <img
              src={logo}
              width="85"
              height="85"
              className="d-inline-block align-middle"
              alt="Nouns DAO logo"
            />
          </Navbar.Brand>
          {Number(CHAIN_ID) !== 1 && <Nav.Item>TESTNET</Nav.Item>}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <Nav.Link
              className={classes.nounsNavLink}
              onClick={activeAccount ? showClaimTokensModalHandler : showModalHandler}
            >
              CLAIM TOKENS
            </Nav.Link>
            <Nav.Link
              className={classes.nounsNavLink}
              onClick={activeAccount ? showWithdrawModalHandler : showModalHandler}
            >
              WITHDRAW FUNDS
            </Nav.Link>
            {/* <SettleAuction /> */}
            {/* <Nav.Item className={classes.menuItem} onClick={() => showPlaceBidModalHandler()}>
              Place Bid
            </Nav.Item> */}

            {activeAccount ? connectedContent : disconnectedContent}
            {/* <PartyInvite /> */}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
