import React from 'react';
import { Col, ProgressBar, Row } from 'react-bootstrap';
import { useNounsPartyDepositBalance } from '../../wrappers/nounsParty';
import classes from './PartyProgressBar.module.css';
import { Auction as IAuction } from '../../wrappers/nounsAuction';
import './progressbar.css';
import config from '../../config';
// import config from '../../config';

import { utils } from 'ethers';

const PartyProgressBar: React.FC<{
  auction: IAuction;
}> = props => {
  const { auction: currentAuction } = props;

  const depositBalance = useNounsPartyDepositBalance();
  const auctionBid = currentAuction?.amount;

  const lastSoldNounEth = 125;

  let fullProgressBar = Math.max(
    lastSoldNounEth,
    depositBalance ? Number(utils.formatEther(depositBalance)) : 0,
    auctionBid ? Number(utils.formatEther(auctionBid)) : 0,
  );

  let bidder = currentAuction.bidder;
  let partyWinning = bidder && bidder.toLowerCase() === config.nounsPartyAddress.toLowerCase();

  let partyVaultGreaterThanBid =
    Number(utils.formatEther(depositBalance)) > Number(utils.formatEther(auctionBid));

  let currentBidProgressPercent =
    Number(utils.formatEther(auctionBid)) > 0
      ? Math.max(
          partyWinning ? 3 : 4,
          (Number(utils.formatEther(auctionBid)) / fullProgressBar) * 100,
        )
      : 0;

  let partyVaultProgressPercent =
    Number(utils.formatEther(depositBalance)) > 0
      ? Math.max(
          partyWinning ? 4 : 3,
          (Number(utils.formatEther(depositBalance)) / fullProgressBar) * 100,
        )
      : 0;
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

  return (
    <div className={classes.partyVaultWrapper}>
      <Row>
        <Col xs={5} lg={6}>
          <p className={`${classes.partyTrackerText}`}>
            <span>{`Party Tracker`}</span>
          </p>
        </Col>
        <Col xs={7} lg={6} className="align-self-center">
          {fullProgressBar === lastSoldNounEth && (
            <p className={`${classes.partyGoalText}`}>
              <span className={classes.ethXiFont}>{`Last Noun Sold Ξ${lastSoldNounEth}`}</span>
            </p>
          )}
        </Col>
      </Row>
      {!partyWinning && (
        <Row>
          <Col className={classes.progressBarContainer}>
            {partyVaultGreaterThanBid ? (
              <>
                <div className={`${classes.progressBar}`}>
                  <ProgressBar
                    variant={partyVaultGreaterThanBid ? 'currentBidLess' : 'currentBidMore'}
                    now={currentBidProgressPercent}
                    key={partyVaultGreaterThanBid ? 1 : 2}
                  />
                </div>
                <div className={`${classes.progressBar}`}>
                  <ProgressBar
                    variant={partyVaultGreaterThanBid ? 'partyVaultMore' : 'partyVaultLess'}
                    now={partyVaultProgressPercent}
                    key={partyVaultGreaterThanBid ? 2 : 1}
                  />
                </div>
              </>
            ) : (
              <>
                <div className={`${classes.progressBar}`}>
                  <ProgressBar
                    variant={partyVaultGreaterThanBid ? 'partyVaultMore' : 'partyVaultLess'}
                    now={partyVaultProgressPercent}
                    key={partyVaultGreaterThanBid ? 2 : 1}
                  />
                </div>
                <div className={`${classes.progressBar}`}>
                  <ProgressBar
                    variant={partyVaultGreaterThanBid ? 'currentBidLess' : 'currentBidMore'}
                    now={currentBidProgressPercent}
                    key={partyVaultGreaterThanBid ? 1 : 2}
                  />
                </div>
              </>
            )}
          </Col>
        </Row>
      )}
      {partyWinning && (
        <Row>
          <Col className={classes.progressBarContainer}>
            <div className={`${classes.progressBar}`}>
              <ProgressBar
                now={Math.max(currentBidProgressPercent, partyVaultProgressPercent)}
                variant={'partyGradient'}
              />
            </div>
            <div className={`${classes.progressBar} ${classes.blurProgressBar}`}>
              <ProgressBar
                now={Math.max(currentBidProgressPercent, partyVaultProgressPercent)}
                variant={'partyGradient'}
              />
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default PartyProgressBar;
