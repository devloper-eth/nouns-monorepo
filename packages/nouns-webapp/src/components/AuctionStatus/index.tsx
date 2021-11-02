import { Auction } from '../../wrappers/nounsAuction';
import classes from './AuctionStatus.module.css';
import { useState, useEffect } from 'react';
import config from '../../config';
import {
  useFracTokenVaults,
  useNounsPartyCalcBidAmount,
  useNounsPartyNounStatus,
  useNounsPartyClaimsCount,
  useNounsPartyDepositBalance,
  useNounsPartyCurrentBidAmount,
  useNounsPartyCurrentNounId,
} from '../../wrappers/nounsParty';
import { Col, Row } from 'react-bootstrap';
import { useAppSelector } from '../../hooks';
import { BigNumber } from 'ethers';

const AuctionStatus: React.FC<{
  auction: Auction;
  noundersNoun: boolean;
}> = props => {
  const { auction: currentAuction, noundersNoun } = props;
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [auctionTimer, setAuctionTimer] = useState(false);
  const bidAmount = useNounsPartyCalcBidAmount();
  const fracTokenVault = useFracTokenVaults(currentAuction.nounId);
  const nounStatus = useNounsPartyNounStatus(currentAuction.nounId);
  const currentClaimsCount = useNounsPartyClaimsCount(activeAccount);
  const nounsPartyCurrentNounId = useNounsPartyCurrentNounId();
  const nounsPartyPreviousNounStatus = useNounsPartyNounStatus(
    BigNumber.from(nounsPartyCurrentNounId),
  );
  const depositBalance = useNounsPartyDepositBalance();
  const currentBidAmount = useNounsPartyCurrentBidAmount();

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
  let statusTextTitle = '';

  let vaultSize = depositBalance;
  if (currentAuction.bidder.toLowerCase() === config.nounsPartyAddress.toLowerCase()) {
    vaultSize = depositBalance.sub(currentAuction.amount);
  } else if (nounsPartyPreviousNounStatus === 'won') {
    vaultSize = depositBalance.sub(currentBidAmount);
  }

  if (currentAuction) {
    let bidder = currentAuction.bidder;
    if (!auctionEnded) {
      if (bidder && bidder.toLowerCase() === config.nounsPartyAddress.toLowerCase()) {
        statusTextTitle = `We're winning the auction!`;
        statusText = ' '; // whitespace needed
      } else if (vaultSize.eq(0)) {
        statusTextTitle = 'The vault needs more funds!';
        statusText = 'Wait for more Party Noun Auctions to finish';
      } else if (
        bidAmount.gt(0) &&
        (!bidder || bidder === '0x0000000000000000000000000000000000000000')
      ) {
        statusTextTitle = 'The vault has enough funds!';
        statusText = 'Submit the very first bid!';
      } else if (bidAmount.gt(0)) {
        statusTextTitle = 'The party has been outbid!';
        statusText = 'Submit a bid!';
      } else if (
        bidAmount.eq(0) &&
        (!bidder || bidder === '0x0000000000000000000000000000000000000000')
      ) {
        statusTextTitle = 'The vault needs more funds!';
        statusText = 'Wait for more Party Noun Auctions to finish';
      } else {
        statusTextTitle = 'The party has been outbid!';
        statusText = 'Wait for more Party Noun Auctions to finish';
      }
      // }
    } else {
      if (bidder && bidder.toLowerCase() === config.nounsPartyAddress.toLowerCase()) {
        if(!nounStatus) {
          statusTextTitle = " "; // `Six-Per-Em Space` character to prevent empty line from rendering
          statusText = " "; // see above
        } else if (nounStatus === 'won') {
          statusTextTitle = 'The party won the auction!';
          statusText = "Join Noun's #nouns-party discord for updates";
        }
      } else if (noundersNoun) {
        statusTextTitle = 'The nounders were rewarded this noun.';
        statusText = 'No auction occurred.';
      } else {
        statusTextTitle = 'The party lost the auction!';
        statusText = `We'll get it next time.`;
      }
    }
  }

  return (
    <>
      {statusText && statusTextTitle && (
        <Row className={classes.statusRow}>
          <Col>
            <div className={classes.rectangle}></div>
            <p className={classes.statusTextTitle}>{statusTextTitle}</p>
            <p className={classes.statusText}>{statusText}</p>
          </Col>
        </Row>
      )}
    </>
  );
};

export default AuctionStatus;
