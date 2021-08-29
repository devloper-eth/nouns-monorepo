import { useAppSelector } from '../../hooks';
import ShortAddress from '../ShortAddress';
import classes from './NavBar.module.css';
import logo from '../../assets/nouns-party-logo.png';
import { useState } from 'react';
import { useEtherBalance, useEthers } from '@usedapp/core';
import WalletConnectModal from '../WalletConnectModal';
import { Link } from 'react-router-dom';
import { Nav, Navbar, Container, Row, Col } from 'react-bootstrap';
import testnetNoun from '../../assets/testnet-noun.png';
import clsx from 'clsx';
import config, { CHAIN_ID } from '../../config';
import { utils } from 'ethers';
import { buildEtherscanAddressLink, Network } from '../../utils/buildEtherscanLink';

const NavBar = () => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const { deactivate } = useEthers();

  const treasuryBalance = useEtherBalance(config.nounsDaoExecutorAddress);
  const daoEtherscanLink = buildEtherscanAddressLink(
    config.nounsDaoExecutorAddress,
    Network.mainnet,
  );

  const [showConnectModal, setShowConnectModal] = useState(false);

  const showModalHandler = () => {
    setShowConnectModal(true);
  };
  const hideModalHandler = () => {
    setShowConnectModal(false);
  };

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
    <Nav.Item className={clsx(classes.nounsNavLink, classes.connectBtn)} onClick={showModalHandler}>
      <button className={classes.connectWalletButton}>CONNECT WALLET</button>
    </Nav.Item>
  );

  return (
    <>
      {showConnectModal && activeAccount === undefined && (
        <WalletConnectModal onDismiss={hideModalHandler} />
      )}
      <Navbar expand="md" className="nav-fill w-100" style={{ height: '100px', width: '100%' }}>
        {/* <Navbar.Brand as={Link} to="/" className={classes.navBarBrand}>
            <img
              src={logo}
              height="100"
              className="d-inline-block align-middle"
              alt="Nouns DAO logo"
              style={{ marginTop: '0px' }}
            />
          </Navbar.Brand> */}

        <Nav className="mr-auto">
          <img
            src={logo}
            height="100px"
            // className="d-inline-block align-middle"

            alt="Nouns DAO logo"
            style={{ marginTop: '-10px' }}
          />
        </Nav>

        {/* <div className="mx-auto"> */}
        <Nav className="mx-auto">
          <h1 className={classes.partyTitle}>Noun O'Clock</h1>
          <h3 className={classes.rotateText}>Party Time!</h3>
          {/* <h3 className={classes.rotateText}>Party Time!</h3> */}
        </Nav>
        {/* </div> */}

        <Nav className="ml-auto">{activeAccount ? connectedContent : disconnectedContent}</Nav>

        {/* {Number(CHAIN_ID) !== 1 && (
            <Nav.Item>
              <img className={classes.testnetImg} src={testnetNoun} alt="testnet noun" />
              TESTNET
            </Nav.Item>
          )} */}
        {/* <Navbar.Collapse className="justify-content-end"> */}
        {/* <Nav.Item>
              {treasuryBalance && (
                <Nav.Link
                  href={daoEtherscanLink.toString()}
                  className={classes.nounsNavLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  TREASURY Ξ {utils.formatEther(treasuryBalance.toString())}
                </Nav.Link>
              )}
            </Nav.Item>
            <Nav.Link as={Link} to="/vote" className={classes.nounsNavLink}>
              GOVERN
            </Nav.Link>
            <Nav.Link href="/playground" className={classes.nounsNavLink} target="_blank">
              EXPLORE
            </Nav.Link> */}

        {/* </Navbar.Collapse> */}

        {/* <Navbar.Collapse className="justify-content-end"> */}
        {/* <Nav.Item>
              {treasuryBalance && (
                <Nav.Link
                  href={daoEtherscanLink.toString()}
                  className={classes.nounsNavLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  TREASURY Ξ {utils.formatEther(treasuryBalance.toString())}
                </Nav.Link>
              )}
            </Nav.Item>
            <Nav.Link as={Link} to="/vote" className={classes.nounsNavLink}>
              GOVERN
            </Nav.Link>
            <Nav.Link href="/playground" className={classes.nounsNavLink} target="_blank">
              EXPLORE
            </Nav.Link> */}
        {/* {activeAccount ? connectedContent : disconnectedContent} */}
        {/* </Navbar.Collapse> */}
      </Navbar>
    </>
  );
};

export default NavBar;
