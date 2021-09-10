import React from 'react';
import { Col, ProgressBar, Row } from 'react-bootstrap';
import { useNounsPartyDepositBalance } from '../../wrappers/nounsParty';
import classes from './PartyVault.module.css';
import { Auction as IAuction } from '../../wrappers/nounsAuction';
import './progressbar.css';
import { BigNumber } from 'ethers';
// import config from '../../config';

import { utils } from 'ethers';
import { createNoSubstitutionTemplateLiteral } from 'typescript';
import auction from '../../state/slices/auction';

const PartyVault: React.FC<{
  auction: IAuction;
}> = props => {
  const { auction: currentAuction } = props;

  const depositBalance = useNounsPartyDepositBalance();
  const auctionBid = currentAuction?.amount;

  let ratio = 50;
  if (depositBalance.eq(0)) {
    ratio = 0;
  } else if (auctionBid.eq(0)) {
    ratio = 100;
  } else {
    let depositBalanceNumber = Number(utils.formatEther(depositBalance));
    let auctionBidNumber = Number(utils.formatEther(auctionBid));
    ratio = depositBalanceNumber / auctionBidNumber * 100;
    if (ratio > 100) {
      ratio = 100;
    }
  }

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
          <ProgressBar now={ratio} />
        </Col>
      </Row>
    </div>
  );
};

export default PartyVault;
