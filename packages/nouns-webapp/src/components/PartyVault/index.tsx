import React from 'react';
import { Auction } from '../../wrappers/nounsAuction';
import classes from './PartyVault.module.css';
import { useNounsPartyCurrentBidAmount, useNounsPartyCurrentNounId, useNounsPartyDepositBalance, useNounsPartyNounStatus } from '../../wrappers/nounsParty';
import { formatEther } from '@ethersproject/units';
import { BigNumber as EthersBN } from 'ethers';
import config from '../../config';
import { useEtherBalance } from '@usedapp/core';

const PartyVault: React.FC<{ auction: Auction }> = props => {
  const { auction } = props;
  const depositBalance = useNounsPartyDepositBalance()
  const auctionBid = auction?.amount;
  const currentBidAmount = useNounsPartyCurrentBidAmount();
  const nounsPartyCurrentNounId = useNounsPartyCurrentNounId();
  const nounsPartyPreviousNounStatus = useNounsPartyNounStatus(EthersBN.from(nounsPartyCurrentNounId));

  let vaultSize = useEtherBalance(config.nounsPartyAddress) || 0;
  if (auction.bidder.toLowerCase() === config.nounsPartyAddress.toLowerCase()) {
    vaultSize = depositBalance.sub(auctionBid);
  } else if (nounsPartyPreviousNounStatus === "won") {
    vaultSize = depositBalance.sub(currentBidAmount);
  }

  return (
    <>
      <p className={`${classes.noMarginPadding} ${classes.vaultText}`}>Party Vault</p>
      <h3 className={classes.addressText}>
        <span className={classes.ethXiFont}>{`Ξ `}</span> {`${formatEther(vaultSize)}`}
      </h3>
    </>
  );
};

export default PartyVault;
