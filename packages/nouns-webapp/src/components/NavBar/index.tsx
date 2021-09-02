import classes from './NavBar.module.css';
import logo from '../../assets/logo.svg';
import { Link } from 'react-router-dom';
import { Navbar, Container } from 'react-bootstrap';

/* unused imports flagged for removal */
// import testnetNoun from '../../assets/testnet-noun.png';
// import clsx from 'clsx';
// import config, { CHAIN_ID } from '../../config';
// import { utils } from 'ethers';
// import { buildEtherscanAddressLink, Network } from '../../utils/buildEtherscanLink';
// import { useAppSelector } from '../../hooks';
// import ShortAddress from '../ShortAddress';
// import { useState } from 'react';
// import { useEtherBalance, useEthers } from '@usedapp/core';
// import WalletConnectModal from '../WalletConnectModal';

const NavBar = () => {
  // const activeAccount = useAppSelector(state => state.account.activeAccount);
  // const { deactivate } = useEthers();

  // const treasuryBalance = useEtherBalance(config.nounsDaoExecutorAddress);
  // const daoEtherscanLink = buildEtherscanAddressLink(
  //   config.nounsDaoExecutorAddress,
  //   Network.mainnet,
  // );

  // const [showConnectModal, setShowConnectModal] = useState(false);

  // const showModalHandler = () => {
  //   setShowConnectModal(true);
  // };
  // const hideModalHandler = () => {
  //   setShowConnectModal(false);
  // };

  /* FLAGGED FOR REMOVAL - this has been moved to WalletConnectButton */
  // const connectedContent = (
  //   <>
  //     <Nav.Item>
  //       <Nav.Link className={classes.nounsNavLink} disabled>
  //         <span className={classes.greenStatusCircle} />
  //         <span>{activeAccount && <ShortAddress address={activeAccount} />}</span>
  //       </Nav.Link>
  //     </Nav.Item>
  //     <Nav.Item>
  //       <Nav.Link
  //         className={clsx(classes.nounsNavLink, classes.disconnectBtn)}
  //         onClick={() => {
  //           setShowConnectModal(false);
  //           deactivate();
  //           setShowConnectModal(false);
  //         }}
  //       >
  //         DISCONNECT
  //       </Nav.Link>
  //     </Nav.Item>
  //   </>
  // );

  // const disconnectedContent = (
  //   <>
  //     <Nav.Link
  //       className={clsx(classes.nounsNavLink, classes.connectBtn)}
  //       onClick={showModalHandler}
  //     >
  //       CONNECT WALLET
  //     </Nav.Link>
  //   </>
  // );

  return (
    <>
      {/* {showConnectModal && activeAccount === undefined && (
        <WalletConnectModal onDismiss={hideModalHandler} />
      )} */}
      <Navbar expand="lg">
        <Container>
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
          {/* {Number(CHAIN_ID) !== 1 && (
            <Nav.Item>
              <img className={classes.testnetImg} src={testnetNoun} alt="testnet noun" />
              TESTNET
            </Nav.Item>
          )}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <Nav.Item>
              {treasuryBalance && (
                <Nav.Link href={daoEtherscanLink.toString()} className={classes.nounsNavLink} target="_blank" rel="noreferrer">
                  TREASURY Ξ {utils.formatEther(treasuryBalance.toString())}
                </Nav.Link>
              )}
            </Nav.Item>
            <Nav.Link as={Link} to="/vote" className={classes.nounsNavLink}>
              GOVERN
            </Nav.Link>
            <Nav.Link href="/playground" className={classes.nounsNavLink} target="_blank">
              EXPLORE
            </Nav.Link>
            {activeAccount ? connectedContent : disconnectedContent}
          </Navbar.Collapse> */}
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
