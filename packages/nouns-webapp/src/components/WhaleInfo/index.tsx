import React from 'react';
import { Col, Row } from 'react-bootstrap';
import classes from './WhaleInfo.module.css';

// TO DO - Add in whale logic for the last bid wallet amount
const WhaleInfo = () => {
  return (
    <div>
      <Row>
        <Col className={classes.noPaddingMargin}>
          <p className={classes.whaleWalletText}>
            The <span>🐳 </span> currently has 999.99 ETH left in their wallet!
          </p>
        </Col>
      </Row>
    </div>
  );
};

export default WhaleInfo;
