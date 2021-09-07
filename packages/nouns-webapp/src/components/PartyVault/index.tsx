import React from 'react';
import { Col, ProgressBar, Row } from 'react-bootstrap';
import classes from './PartyVault.module.css';
import './progressbar.css';

// TO DO - Refactor once able to fetch data from contract
const PartyVault = () => {
  return (
    <div className={classes.partyVaultWrapper}>
      <Row>
        <Col xs={12} lg={7}>
          <p className={`${classes.partyVaultText} ${classes.noPaddingMargin}`}>
            Nouns Party Vault <span className={classes.ethXiFont}>{`Ξ `}</span>
          </p>
        </Col>
        <Col xs={12} lg={5}>
          <p className={`${classes.ethNeededText} ${classes.noPaddingMargin}`}>
            Eth Needed <span className={classes.ethXiFont}>{`Ξ `}</span>
          </p>
        </Col>
      </Row>
      <Row>
        <Col className={classes.progressBarContainer}>
          <ProgressBar now={45} />
        </Col>
      </Row>
    </div>
  );
};

export default PartyVault;
