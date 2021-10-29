import React from 'react';
import { Col, Row } from 'react-bootstrap';
import ConnectWalletButton from '../ConnectWalletButton';
import classes from './PartyButtons.module.css';
import { Auction } from '../../wrappers/nounsAuction';

const PartyButtons: React.FC<{
  auction: Auction;
}> = props => {
  const { auction: currentAuction } = props;
  return (
    <Row className={classes.buttonsWrapper}>
      <Col>
        <ConnectWalletButton auction={currentAuction} />
      </Col>
    </Row>
  );
};

export default PartyButtons;
