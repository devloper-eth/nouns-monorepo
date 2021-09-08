import React, { useState } from 'react';
import { useAppSelector } from '../../hooks';
import ShortAddress from '../ShortAddress';
import classes from './ConnectWalletButton.module.css';
import WalletConnectModal from '../WalletConnectModal';
import clsx from 'clsx';
import { useEthers } from '@usedapp/core';
import { Nav } from 'react-bootstrap';
import AddFundsModal from '../AddFundsModal';

/*  Currently unused packages FLAGGED FOR DELETION */
// import logo from '../../assets/logo.svg';
// import { useEtherBalance, useEthers } from '@usedapp/core';
// import { Link } from 'react-router-dom';
// import testnetNoun from '../../assets/testnet-noun.png';
// import config, { CHAIN_ID } from '../../config';
// import { utils } from 'ethers';
// import { buildEtherscanAddressLink, Network } from '../../utils/buildEtherscanLink';

const ConnectWalletButton = () => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const { deactivate } = useEthers();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showFundsModal, setShowFundsModal] = useState(false);

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

  // TO DO - Style disconnect area
  const connectedContent = (
    <>
      <button onClick={showFundsModalHandler} className={classes.connectWalletButton}>
        Add funds to the vault
      </button>
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
      {activeAccount ? connectedContent : disconnectedContent}
    </>
  );
};

export default ConnectWalletButton;
