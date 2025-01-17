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
import WithdrawModal from '../WithdrawModal';
import ClaimTokensModal from '../ClaimTokensModal';
import { useNounsPartyClaimsCount } from '../../wrappers/nounsParty';

const NavBar = () => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const { deactivate } = useEthers();

  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showClaimTokensModal, setShowClaimTokensModal] = useState(false);

  const currentClaimsCount = useNounsPartyClaimsCount(activeAccount);

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
            {currentClaimsCount > 0 && (
              <Nav.Link
                className={classes.nounsNavLink}
                onClick={activeAccount ? showClaimTokensModalHandler : showModalHandler}
              >
                CLAIM TOKENS
              </Nav.Link>
            )}
            <Nav.Link
              className={classes.nounsNavLink}
              onClick={activeAccount ? showWithdrawModalHandler : showModalHandler}
            >
              WITHDRAW FUNDS
            </Nav.Link>

            {activeAccount ? connectedContent : disconnectedContent}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
