import React from 'react';
import { utils } from 'ethers';
import { Auction } from '../../wrappers/nounsAuction';
import classes from './PartyVault.module.css';
import { useNounsPartyAvailableDepositBalance } from '../../wrappers/nounsParty';

const PartyVault: React.FC<{ auction: Auction }> = props => {
  const { auction } = props;
  const vaultSize = useNounsPartyAvailableDepositBalance();
  const auctionBid = auction?.amount;

  let ratio = 50;
  if (vaultSize.eq(0)) {
    ratio = 0;
  } else if (auctionBid.eq(0)) {
    ratio = 100;
  } else {
    let vaultSizeNumber = Number(utils.formatEther(vaultSize));
    let auctionBidNumber = Number(utils.formatEther(auctionBid));
    ratio = (vaultSizeNumber / auctionBidNumber) * 100;
    if (ratio > 100) {
      ratio = 100;
    }
  }

  let roundedEth = Math.ceil(Number(utils.formatEther(vaultSize)) * 1000) / 1000;

  return (
    <>
      <p className={`${classes.noMarginPadding} ${classes.vaultText}`}>Party Vault</p>
      <h3 className={classes.addressText}>
        <span className={classes.ethXiFont}>{`Ξ `}</span> {`${roundedEth}`}
      </h3>
    </>
  );
};

export default PartyVault;
