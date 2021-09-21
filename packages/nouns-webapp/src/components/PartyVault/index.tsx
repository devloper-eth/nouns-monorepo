import React from 'react';
import { utils, BigNumber as EthersBN } from 'ethers';
import { Auction } from '../../wrappers/nounsAuction';
import classes from './PartyVault.module.css';
import config from '../../config';
import { useNounsPartyDepositBalance, useNounsPartyPendingSettledCount, useNounsPartySettleNext } from '../../wrappers/nounsParty';
import { useEtherBalance } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';

const PartyVault: React.FC<{ auction: Auction }> = props => {
  const { auction } = props;
  const depositBalance = useNounsPartyDepositBalance()
  const pendingSettledCount = useNounsPartyPendingSettledCount();
  const settleNext = useNounsPartySettleNext();
  const contractBalance = useEtherBalance(config.nounsPartyAddress) || EthersBN.from(0);

  const auctionBid = auction?.amount;

  let vaultSize = depositBalance;
  if (auction.bidder.toLowerCase() === config.nounsPartyAddress.toLowerCase()) {
    vaultSize = depositBalance.sub(auctionBid);
  }

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

  const needsSettle = pendingSettledCount.gt(0) && !settleNext.eq(auction.nounId)

  return (
    <>
      <p className={`${classes.noMarginPadding} ${classes.vaultText}`}>Party Vault</p>
      {!needsSettle ? <>
        <h3 className={classes.addressText}>
          <span className={classes.ethXiFont}>{`Ξ `}</span> {`${roundedEth}`}
        </h3>
      </>
        :
        <>
          <h3 className={classes.addressText}>
            <span className={classes.ethXiFont}>{`Ξ `}</span> {formatEther(contractBalance)}
          </h3>
        </>
      }
    </>
  );
};

export default PartyVault;
