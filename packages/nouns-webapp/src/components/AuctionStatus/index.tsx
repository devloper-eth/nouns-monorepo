import { Auction } from '../../wrappers/nounsAuction';
import classes from './AuctionStatus.module.css';
import { useState, useEffect } from 'react';
import config from '../../config';
import {
  useNounsPartyDepositBalance,
  useFracTokenVaults,
  useNounsPartyMaxBid,
  useNounsPartyPendingSettledCount,
  useNounsPartySettleNext,
} from '../../wrappers/nounsParty';
import { Col, Row } from 'react-bootstrap';
import { parseEther } from 'ethers/lib/utils';

const AuctionStatus: React.FC<{
  auction: Auction;
}> = props => {
  const { auction: currentAuction } = props;
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [auctionTimer, setAuctionTimer] = useState(false);
  const maxBid = useNounsPartyMaxBid();
  const fracTokenVault = useFracTokenVaults(currentAuction.nounId);
  const pendingSettledCount = useNounsPartyPendingSettledCount();
  const settleNext = useNounsPartySettleNext();

  useEffect(() => {
    if (!currentAuction) return;

    const timeLeft = Number(currentAuction.endTime) - Math.floor(Date.now() / 1000);

    if (currentAuction && timeLeft <= 0) {
      setAuctionEnded(true);
    } else {
      setAuctionEnded(false);
      const timer = setTimeout(() => {
        setAuctionTimer(!auctionTimer);
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [auctionTimer, currentAuction]);

  let statusText = '';
  let status = '';
  let statusTextTitle = '';
  let depositBalance = useNounsPartyDepositBalance();

  let vaultSize = depositBalance;
  if (currentAuction.bidder.toLowerCase() === config.nounsPartyAddress.toLowerCase()) {
    vaultSize = depositBalance.sub(currentAuction.amount);
  }

  if (currentAuction && !auctionEnded) {
    let bidder = currentAuction.bidder;
    if (bidder && bidder.toLowerCase() === config.nounsPartyAddress.toLowerCase()) {
      statusTextTitle = `We're winning the auction!`;
      statusText = 'You can still add more funds to the party vault.';
      status = 'success';
    } else if (pendingSettledCount.gt(0) && !settleNext.eq(currentAuction.nounId)) {
      statusTextTitle = 'The previous auction can now be settled!';
      statusText = 'Settle the previous auction to submit a bid.';
      status = 'success';
    } else if (vaultSize.gte(maxBid) && maxBid.gt(0)) {
      statusTextTitle = 'The vault has enough funds!';
      statusText = 'Submit a bid!';
      status = 'success';
    } else if (vaultSize.eq(0) && maxBid.eq(parseEther("0.1"))) {
      statusTextTitle = 'The vault needs more funds!';
      statusText = 'Add more funds for the minimum bid.';
      status = 'success';
    } else {
      statusTextTitle = 'The party has been outbid!';
      statusText = 'Add more funds to the vault.';
      status = 'fail';
    }
  } else if (currentAuction) {
    let bidder = currentAuction.bidder;
    if (bidder && bidder.toLowerCase() === config.nounsPartyAddress.toLowerCase()) {
      if (fracTokenVault) {
        statusTextTitle = 'The party won the auction!';
        statusText = 'Claim your tokens.';
      } else {
        statusTextTitle = 'The party won the auction!';
        statusText = 'Settle the auction to fractionalize the noun.';
      }
      status = 'success';
    } else {
      statusTextTitle = 'The party lost the auction!';
      statusText = `We'll get it next time.`;
      status = 'fail';
    }
  } else {
    statusText = 'The nounders were rewarded this noun.';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    status = 'success';
  }

  return (
    <>
      {statusText && statusTextTitle && (
        <Row>
          <Col>
            <p className={classes.statusTextTitle}>{statusTextTitle}</p>
            <p className={classes.statusText}>{statusText}</p>
          </Col>
        </Row>
      )}
      {/* {statusText && (
        <div className={classes.statusIndicator}>
          <span className={
            status === "success"
              ? classes.successStatus
              : status === "fail" 
                ? classes.failStatus
                : classes.hiddenStatus
          }>
            {statusText}
          </span>
        </div>
      )} */}
    </>
  );
};

export default AuctionStatus;
