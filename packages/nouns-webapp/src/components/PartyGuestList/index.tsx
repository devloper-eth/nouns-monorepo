import { utils } from 'ethers';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useNounsPartyDeposits } from '../../wrappers/nounsParty';
import PartyInvite from '../PartyInvite';
import ShortAddress from '../ShortAddress';
import classes from './PartyGuestList.module.css';

const PartyGuestList = () => {
  const deposits = useNounsPartyDeposits();

  return (
    <div className={classes.guestListContainer}>
      <Row className={classes.partyMembersHeadingContainer}>
        <Col
          xs={{ span: 12, order: 12 }}
          lg={{ span: 7, order: 1 }}
          className={classes.noPaddingMargin}
        >
          <p className={`${classes.partyMembersHeadingText} ${classes.noPaddingMargin}`}>
            Party Members
            {/* <sup>(35)</sup> */}
          </p>
        </Col>
        {/* <PartyInvite /> */}
      </Row>

      {/* <p className={classes.contributionsBlurb}>Contributions used for the last successful bid</p> */}
      {deposits && deposits.length > 0 ? (
        <div className={`${classes.guestListBidsContainer} ${classes.fadeGradient}`}>
          <ul className={classes.bidCollection}>
            {deposits.map((bid, index) => (
              <li key={index} className={classes.bidRow}>
                <div className={classes.bidItem}>
                  <div className={classes.leftSectionWrapper}>
                    <div className={classes.bidder}>
                      <div>
                        <ShortAddress address={null ?? bid.owner} />
                      </div>
                    </div>
                    {/* <div className={classes.bidDate}>{`${moment().format(
            'MMM DD',
          )} at ${moment().format('hh:mm a')}`}</div> */}
                  </div>
                  <div className={classes.rightSectionWrapper}>
                    <div className={classes.bidAmount}>
                      {null ?? `${utils.formatEther(bid.amount)} ETH`}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default PartyGuestList;
