import React, { useEffect, useState } from 'react';
import { Col, ProgressBar, Row } from 'react-bootstrap';
import { nounsPartyContractFactory, NounsPartyContractFunction } from '../../wrappers/nounsParty';
import classes from './PartyVault.module.css';
import config from '../../config';
import './progressbar.css';
import { useContractFunction__fix } from '../../hooks/useContractFunction__fix';
import { connectContractToSigner, useEthers } from '@usedapp/core';

const PartyVault = () => {
  const [vaultAmount, setVaultAmount] = useState<any>(null);

  const { library } = useEthers();
  const nounsPartyContract = nounsPartyContractFactory(config.nounsPartyAddress);
  // const contract = connectContractToSigner(nounsPartyContract, undefined, library);

  // const { send: depositBalance, state: depositState } = useContractFunction__fix(
  //   nounsPartyContract,
  //   NounsPartyContractFunction.depositBalance,
  // );

  // should just be able to call the contract function? See below:
  // packages/nouns-webapp/src/components/Bid/index.tsx --> L:116 'placebid()' called from destructured L:74 'placeBid'
  const getVaultAmount = async () => {
    // const currentAmount = await depositBalance();
    // setVaultAmount(currentAmount);
  };

  useEffect(() => {
    if (!vaultAmount) {
      getVaultAmount();
    }
  }, []);

  return (
    <div className={classes.partyVaultWrapper}>
      <Row>
        <Col xs={12} lg={7}>
          <p className={`${classes.partyVaultText} ${classes.noPaddingMargin}`}>
            Nouns Party Vault <span className={classes.ethXiFont}>{`Ξ ${vaultAmount}`}</span>
          </p>
        </Col>
        <Col xs={12} lg={5}>
          <p className={`${classes.ethNeededText} ${classes.noPaddingMargin}`}>
            Eth Needed <span className={classes.ethXiFont}>{`Ξ `}</span>
          </p>
        </Col>
      </Row>
      <Row>
        <Col className={classes.progressBarContainer}>
          <ProgressBar now={45} />
        </Col>
      </Row>
    </div>
  );
};

export default PartyVault;
