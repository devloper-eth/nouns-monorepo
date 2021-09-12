import { Auction } from '../../wrappers/nounsAuction';
import classes from './AuctionStatus.module.css';
import { useState, useEffect, useRef } from 'react';
import config from '../../config';
import { useNounsPartyDepositBalance } from '../../wrappers/nounsParty';

const AuctionStatus: React.FC<{
  auction: Auction;
}> = props => {
  const { auction: currentAuction} = props;
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [auctionTimer, setAuctionTimer] = useState(false);

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

  let statusText = ""
  let status = ""
  let depositBalance = useNounsPartyDepositBalance();
  let targetBidAmount = depositBalance.mul(105).div(100)

  if (currentAuction && !auctionEnded) {
    let bidder = currentAuction.bidder
    if (bidder && bidder.toLowerCase() === config.nounsPartyAddress.toLowerCase()) {
      statusText = "The party is winning the auction!";
      status = "success";
    } else if (targetBidAmount.gt(currentAuction.amount)) {
      statusText = "The vault has enough funds! Submit the bid!";
      status = "success";
    } else {
      statusText = "The party has been outbid."
      status = "fail"
    }
  } else if (currentAuction) {
    let bidder = currentAuction.bidder
    if (bidder && bidder.toLowerCase() === config.nounsPartyAddress.toLowerCase()) {
      statusText = "The party won the auction!"
      status = "success";
    } else {
      statusText = "The party lost the auction!"
      status = "fail"
    }
  } else {
    statusText = "The nounders were rewarded this noun."
    status = "success"
  }

  return (
    <>
      {statusText && (
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
      )}
    </>
  );
};

export default AuctionStatus;