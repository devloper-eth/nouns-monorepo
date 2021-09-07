import React from 'react';
import { Col, Row } from 'react-bootstrap';
import PartyInvite from '../PartyInvite';
import ShortAddress from '../ShortAddress';
import classes from './PartyGuestList.module.css';

// TODO
// This component is a placeholder to be refactored when logic and data become available
const PartyGuestList = () => {
  const placeholderBids = Array(30).fill({
    bid: '111.34 ETH',
    address: '0x969E52e0b130899ca2d601bd5366c33f1bf6e393',
  });

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
        <PartyInvite />
      </Row>

      {/* <p className={classes.contributionsBlurb}>Contributions used for the last successful bid</p> */}
      <div className={`${classes.guestListBidsContainer} ${classes.fadeGradient}`}>
        <ul className={classes.bidCollection}>
          {placeholderBids.map((bid, index) => (
            <li key={index} className={classes.bidRow}>
              <div className={classes.bidItem}>
                <div className={classes.leftSectionWrapper}>
                  <div className={classes.bidder}>
                    <div>
                      <ShortAddress address={bid.address} />
                    </div>
                  </div>
                  {/* <div className={classes.bidDate}>{`${moment().format(
            'MMM DD',
          )} at ${moment().format('hh:mm a')}`}</div> */}
                </div>
                <div className={classes.rightSectionWrapper}>
                  <div className={classes.bidAmount}>{bid.bid}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PartyGuestList;
