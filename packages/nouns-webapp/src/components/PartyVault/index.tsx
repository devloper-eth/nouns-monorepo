import React from 'react';
import { Col, ProgressBar, Row } from 'react-bootstrap';
import { useNounsPartyDepositBalance } from '../../wrappers/nounsParty';
import classes from './PartyVault.module.css';
import { Auction as IAuction } from '../../wrappers/nounsAuction';
import './progressbar.css';
import { BigNumber } from 'ethers';
// import config from '../../config';

import { utils } from 'ethers';

const PartyVault: React.FC<{
  auction: IAuction;
}> = props => {
  const { auction: currentAuction } = props;

  let depositBalance = useNounsPartyDepositBalance() || BigNumber.from(0);
  let auctionBid = currentAuction?.amount || BigNumber.from(0);

  let depositBalanceEth = depositBalance.div(utils.parseEther("1")).toNumber();
  let auctionBidEth = auctionBid.div(utils.parseEther("1")).toNumber();

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
          <ProgressBar now={auctionBidEth > 0 ? depositBalanceEth / auctionBidEth * 100 : depositBalanceEth > 0 ? 100 : 0 } />
        </Col>
      </Row>
    </div>
  );
};

export default PartyVault;
