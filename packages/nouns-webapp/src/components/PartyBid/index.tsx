import React from 'react';
import { Col, Row } from 'react-bootstrap';
import classes from './PartyBid.module.css';

// TO DO
// This component is a placeholder to be refactored when logic and data become available
const PartyBid = () => {
  return (
    <Row className={`${classes.auctionInfoWrapper}`}>
      <Col className={`${classes.verticalLine} ${classes.biddingPoolContainer}`}>
        <Row>
          <Col className={classes.noMarginPadding}>
            <p>Bidding Pool</p>
          </Col>
        </Row>
        <Row>
          <Col className={classes.biddingPoolPadding}>
            <h3 className={`${classes.noMarginPadding} ${classes.h3TextResize}`}>777.46 ETH</h3>
          </Col>
        </Row>
        <Row>
          <Col className={classes.noMarginPadding}>
            <p className={classes.dollarValueText}>{`$1,888,888`}</p>
          </Col>
        </Row>
      </Col>
      <Col className={classes.ethRequiredPadding}>
        <Row>
          <Col className={classes.ethRequiredPadding}>
            <p>ETH Required</p>
          </Col>
        </Row>
        <Row>
          <Col className={classes.ethRequiredPadding}>
            <h3 className={`${classes.noMarginPadding}`}>526.04 ETH</h3>
          </Col>
        </Row>
        <Row>
          <Col className={classes.ethRequiredPadding}>
            <p className={classes.dollarValueText}>{`$1,888,888`}</p>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default PartyBid;
