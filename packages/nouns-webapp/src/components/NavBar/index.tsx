import classes from './NavBar.module.css';
import logo from '../../assets/logo.svg';
import { Link } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import testnetNoun from '../../assets/testnet-noun.png';
import clsx from 'clsx';
import config, { CHAIN_ID } from '../../config';
import { useAppSelector } from '../../hooks';
import ShortAddress from '../ShortAddress';
import { useEffect, useState } from 'react';
import { useEthers } from '@usedapp/core';
import WalletConnectModal from '../WalletConnectModal';
import PartyInvite from '../PartyInvite';
import WithdrawModal from '../WithdrawModal';
// import ClaimTokensModal from '../ClaimTokensModal';
import { useAuction } from '../../wrappers/nounsAuction';
import Bid from '../Bid';

const NavBar = () => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const lastNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);
  const auction = useAuction(config.auctionProxyAddress);
  const { deactivate } = useEthers();

  // const treasuryBalance = useEtherBalance(config.nounsDaoExecutorAddress);
  // const daoEtherscanLink = buildEtherscanAddressLink(config.nounsDaoExecutorAddress);

  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showClaimTokensModal, setShowClaimTokensModal] = useState(false);
  const [showPlaceBidModal, setShowPlaceBidModal] = useState(false);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [auctionTimer, setAuctionTimer] = useState(false);

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
  const showPlaceBodModalHandler = () => {
    setShowPlaceBidModal(true);
  };
  const hidePlaceBidModalHandler = () => {
    setShowPlaceBidModal(false);
  };

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


  const connectedContent = (
    <>
      <Nav.Item>
        <Nav.Link className={classes.nounsNavLink} disabled>
          <span className={classes.greenStatusCircle} />
          <span>{activeAccount && <ShortAddress address={activeAccount} />}</span>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          className={clsx(classes.nounsNavLink, classes.disconnectButton)}
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
      <Nav.Link className={clsx(classes.nounsNavLink, classes.menuItem)} onClick={showModalHandler}>
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
{/* {showClaimTokensModal && activeAccount && (<ClaimTokensModal hideClaimTokensModalHandler={hideClaimTokensModalHandler}/>)} */}
      {auction && lastNounId && auction?.nounId?.eq(lastNounId) && showPlaceBidModal && activeAccount && !auctionEnded && (<Bid auction={auction} auctionEnded={auctionEnded} hidePlaceBidModalHandler={hidePlaceBidModalHandler}/>)}
      <Navbar expand="lg">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className={classes.navBarBrand}>
            <img
              src={logo}
              width="65"
              height="65"
              className="d-inline-block align-middle"
              alt="Nouns DAO logo"
              style={{ margin: '0px', padding: '0px' }}
            />
          </Navbar.Brand>
          {Number(CHAIN_ID) !== 1 && (
            <Nav.Item>
              <img className={classes.testnetImg} src={testnetNoun} alt="testnet noun" />
              TESTNET
            </Nav.Item>
          )}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            {/* <Nav.Item>
              {treasuryBalance && (
                <Nav.Link
                  href={daoEtherscanLink}
                  className={classes.nounsNavLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  TREASURY <span className={classes.ethXiFont}>{`Ξ  `}</span>
                  {utils.formatEther(treasuryBalance.toString())}
                </Nav.Link>
              )}
            </Nav.Item> */}
          
            <Nav.Item className={classes.menuItem} onClick={() => showWithdrawModalHandler()}>
              Withdraw
            </Nav.Item>
            {/* <Nav.Item className={classes.menuItem} onClick={() => showClaimTokensModalHandler()}>Claim Tokens</Nav.Item> */}
            <Nav.Item className={classes.menuItem} onClick={() => showPlaceBodModalHandler()}>Place Bid</Nav.Item>
           
            {/* <SettleAuction /> */}
            {activeAccount ? connectedContent : disconnectedContent}
            <PartyInvite />
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
