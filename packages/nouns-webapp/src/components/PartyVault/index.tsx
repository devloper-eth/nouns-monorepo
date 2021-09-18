import React from 'react';
import { useNounsPartyDepositBalance } from '../../wrappers/nounsParty';
import { utils } from 'ethers';
import { Auction } from '../../wrappers/nounsAuction';
import classes from './PartyVault.module.css';
import { Col, Row } from 'react-bootstrap';

const PartyVault: React.FC<{ auction: Auction }> = props => {
  const { auction } = props;
  const depositBalance = useNounsPartyDepositBalance();

  const auctionBid = auction?.amount;

  let ratio = 50;
  if (depositBalance.eq(0)) {
    ratio = 0;
  } else if (auctionBid.eq(0)) {
    ratio = 100;
  } else {
    let depositBalanceNumber = Number(utils.formatEther(depositBalance));
    let auctionBidNumber = Number(utils.formatEther(auctionBid));
    ratio = (depositBalanceNumber / auctionBidNumber) * 100;
    if (ratio > 100) {
      ratio = 100;
    }
  }

  let roundedEth = Math.ceil(Number(utils.formatEther(depositBalance)) * 100) / 100;

  return (
    <>
      <p className={`${classes.noMarginPadding} ${classes.vaultText}`}>Party Vault</p>
      <h3 className={classes.addressText}>
        <span className={classes.ethXiFont}>{`Ξ `}</span>
        {`${roundedEth}`}
      </h3>
    </>
  );
};

export default PartyVault;
