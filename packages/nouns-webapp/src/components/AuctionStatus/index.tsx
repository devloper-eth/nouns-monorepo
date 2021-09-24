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
        statusText = 'You can still add more funds to the party vault.';
      } else if (vaultSize.eq(0)) {
        statusTextTitle = 'The vault needs more funds!';
        statusText = 'Add more funds for the minimum bid.';
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
        statusTextTitle = 'Add more funds to submit a bid!';
        statusText = 'The auction is live.';
      } else {
        statusTextTitle = 'The party has been outbid!';
        statusText = 'Add more funds to the vault.';
      }
      // }
    } else {
      if (bidder && bidder.toLowerCase() === config.nounsPartyAddress.toLowerCase()) {
        if (nounStatus === 'won') {
          statusTextTitle = 'The party won the auction!';
          statusText = 'Settle the auction to fractionalize the noun.';
        } else if (fracTokenVault) {
          if (currentClaimsCount > 0) {
            statusTextTitle = 'The party won the auction!';
            statusText = 'Claim your tokens.';
          } else {
            statusTextTitle = 'The party won the auction!';
            statusText = 'You already claimed your tokens.';
          }
        } else {
          statusTextTitle = 'The party won the auction!';
          statusText = 'We can fractionalize the noun as soon as a new auction starts.';
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
