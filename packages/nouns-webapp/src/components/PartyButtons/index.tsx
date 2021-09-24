import React from 'react';
import { Col, Row } from 'react-bootstrap';
import ConnectWalletButton from '../ConnectWalletButton';
import classes from './PartyButtons.module.css';
import { Auction } from '../../wrappers/nounsAuction';

// TODO
// What is the party invite? Assume it's a link to the website? Will it just copy the website address?
const PartyButtons: React.FC<{
  auction: Auction;
}> = props => {
  const { auction: currentAuction } = props;
  return (
    <Row className={classes.buttonsWrapper}>
      <Col>
        <ConnectWalletButton auction={currentAuction} />
      </Col>
      {/* <Col className={classes.noRightPadding}>
        <button className={classes.invitePartyButton}>Send Party Invite!</button>
      </Col> */}
    </Row>
  );
};

export default PartyButtons;
