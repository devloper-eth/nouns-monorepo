import React, { useState } from 'react';
import { Col, OverlayTrigger, Popover } from 'react-bootstrap';
import classes from './PartyInvite.module.css';
import './partyinvite.css';

const popover = (
  <Popover id="popover-basic" className={classes.popoverContainer}>
    <span>Link copied!</span>
  </Popover>
);

const renderNothing = <div />;

const PartyInvite = () => {
  const [showPopover, setShowPopover] = useState(false);

  const triggerPartyClick = () => {
    setShowPopover(true);

    // copy current URL. Fallback in case
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {})
      .catch(() => {});

    setTimeout(() => {
      setShowPopover(false);
    }, 3000);
  };
  return (
    <Col
      xs={{ span: 12, order: 1 }}
      lg={{ span: 5, order: 12 }}
      className={classes.noPaddingMargin}
    >
      <OverlayTrigger
        trigger="click"
        placement="top"
        overlay={showPopover ? popover : renderNothing}
      >
        <button onClick={() => triggerPartyClick()} className={classes.partyInviteButton}>
          <span className={classes.partyInviteButtonText}>Send Party Invite!</span>
        </button>
      </OverlayTrigger>
    </Col>
  );
};

export default PartyInvite;
