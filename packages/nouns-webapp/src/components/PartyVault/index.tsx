import React from 'react';
import { Col, ProgressBar, Row } from 'react-bootstrap';
import { useNounsPartyDepositBalance } from '../../wrappers/nounsParty';
import classes from './PartyVault.module.css';
import { Auction as IAuction } from '../../wrappers/nounsAuction';
import './progressbar.css';
// import { BigNumber } from 'ethers';
// import config from '../../config';

import { utils } from 'ethers';

const PartyVault: React.FC<{
  auction: IAuction;
}> = props => {
  const { auction: currentAuction } = props;
  const depositBalance = useNounsPartyDepositBalance();

  let formattedDepositBalance = Number(utils.formatEther(depositBalance));
  let formattedBid = Number(currentAuction?.amount?.toString());

  return (
    <div className={classes.partyVaultWrapper}>
      <Row>
        <Col xs={12} lg={9}>
          <p className={`${classes.partyVaultText} ${classes.noPaddingMargin}`}>
            {`Nouns Party Vault `}
            <span className={classes.ethXiFont}>{`Ξ${utils.formatEther(depositBalance)}`}</span>
          </p>
        </Col>
        {/* <Col xs={12} lg={5}>
          <p className={`${classes.ethNeededText} ${classes.noPaddingMargin}`}>
            Eth Needed <span className={classes.ethXiFont}>{`Ξ `}</span>
          </p>
        </Col> */}
      </Row>
      <Row>
        <Col className={classes.progressBarContainer}>
          <ProgressBar
            now={
              checkNulls(formattedDepositBalance, formattedBid)
                ? formattedDepositBalance / formattedBid
                : 100
            }
          />
        </Col>
      </Row>
    </div>
  );
};

export default PartyVault;

const checkNulls = (formattedDepositBalance: number, formattedBid: number) => {
  if (formattedDepositBalance && formattedBid && formattedBid > 0) {
    return true;
  } else {
    return false;
  }
};
