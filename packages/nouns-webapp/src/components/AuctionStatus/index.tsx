import { Auction } from '../../wrappers/nounsAuction';
import classes from './AuctionStatus.module.css';
import { useState, useEffect } from 'react';
import config from '../../config';
import { useNounsPartyDepositBalance, useFracTokenVaults, useNounsPartyMaxBid, useNounsPartyPendingSettledCount } from '../../wrappers/nounsParty';
import { Col, Row } from 'react-bootstrap';

const AuctionStatus: React.FC<{
  auction: Auction;
}> = props => {

  const { auction: currentAuction } = props;
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [auctionTimer, setAuctionTimer] = useState(false);
  const maxBid = useNounsPartyMaxBid();
  const fracTokenVault = useFracTokenVaults(currentAuction.nounId);
  const pendingSettledCount = useNounsPartyPendingSettledCount();

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
  let depositBalance = useNounsPartyDepositBalance();
  let targetBidAmount = depositBalance.mul(107).div(100);

  if (currentAuction && !auctionEnded) {
    let bidder = currentAuction.bidder;
    if (bidder && bidder.toLowerCase() === config.nounsPartyAddress.toLowerCase()) {
      statusText = 'The party is winning the auction!';
      status = 'success';
    } else if (targetBidAmount.gt(currentAuction.amount)) {
      if (pendingSettledCount.gt(0)) {
        statusText = 'The vault has enough funds! Settle the previous auction and then submit a bid.';
      } else {
        statusText = 'The vault has enough funds! Submit the bid!';
      }
      status = 'success';
    } else if (currentAuction.amount.lt(maxBid || 0)) {
      statusText = 'The vault requires more funds to bid.';
      status = 'fail';
    } else {
      statusText = 'The party has been outbid!';
      status = 'fail';
    }
  } else if (currentAuction) {
    let bidder = currentAuction.bidder;
    if (bidder && bidder.toLowerCase() === config.nounsPartyAddress.toLowerCase()) {
      if (fracTokenVault) {
        statusText = 'The party won the auction! Claim your tokens.';
      } else {
        statusText = 'The party won the auction! Settle the auction to fractionalize the noun.';
      }
      status = 'success';
    } else {
      statusText = 'The party lost the auction!';
      status = 'fail';
    }
  } else {
    statusText = 'The nounders were rewarded this noun.';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    status = 'success';
  }

  return (
    <>
      {statusText && (
        <Row>
          <Col>
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
