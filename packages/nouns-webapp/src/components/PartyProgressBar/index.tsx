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

  let fullProgressBar = Math.max(
    150,
    depositBalance ? Number(utils.formatEther(depositBalance)) : 0,
    auctionBid ? Number(utils.formatEther(auctionBid)) : 0,
  );

  let bidder = currentAuction.bidder;
  let partyWinning = bidder && bidder.toLowerCase() === config.nounsPartyAddress.toLowerCase();

  let partyVaultGreaterThanBid =
    Number(utils.formatEther(depositBalance)) > Number(utils.formatEther(auctionBid));
  let currentBidProgressPercent = (Number(utils.formatEther(auctionBid)) / fullProgressBar) * 100;
  let partyVaultProgressPercent =
    (Number(utils.formatEther(depositBalance)) / fullProgressBar) * 100;

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

  // let roundedEth = Math.ceil(Number(utils.formatEther(depositBalance)) * 100) / 100;

  return (
    <div className={classes.partyVaultWrapper}>
      <Row>
        <Col xs={6} lg={6}>
          <p className={`${classes.partyTrackerText}`}>
            {/* {`Nouns Party Vault `} */}
            <span>{`Party Tracker`}</span>
          </p>
        </Col>
        <Col xs={6} lg={6} className="align-self-center">
          {fullProgressBar === 150 && (
            <p className={`${classes.partyGoalText}`}>
              {/* {`Nouns Party Vault `} */}
              <span className={classes.ethXiFont}>{`Goal Ξ150`}</span>
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
              <ProgressBar now={currentBidProgressPercent} variant={'partyGradient'} />
            </div>
            <div className={`${classes.progressBar} ${classes.blurProgressBar}`}>
              <ProgressBar now={currentBidProgressPercent} variant={'partyGradient'} />
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default PartyProgressBar;
