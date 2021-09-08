import React from 'react';
import { Col, Row } from 'react-bootstrap';
import ConnectWalletButton from '../ConnectWalletButton';
import classes from './PartyButtons.module.css';

// TODO
// What is the party invite? Assume it's a link to the website? Will it just copy the website address?
const PartyButtons = () => {
  return (
    <Row className={classes.buttonsWrapper}>
      <Col>
        <ConnectWalletButton />
      </Col>
      {/* <Col className={classes.noRightPadding}>
        <button className={classes.invitePartyButton}>Send Party Invite!</button>
      </Col> */}
    </Row>
  );
};

export default PartyButtons;
