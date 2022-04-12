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
    statusTextTitle = 'Submit a bid to win a Party Noun!';
    statusText = 'Auction proceeds go to the Party Vault.';
  } else {
    statusTextTitle = 'A new auction will start soon.';
    statusText = `Please come back later.`;
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
