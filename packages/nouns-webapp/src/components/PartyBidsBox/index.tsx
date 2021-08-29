import classes from './PartyBidsBox.module.css';
import Section from '../../layout/Section';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks';
import { buildEtherscanAddressLink, Network } from '../../utils/buildEtherscanLink';
import { externalURL, ExternalURL } from '../../utils/externalURL';
import config from '../../config';
import VisitorSocialCursor from '../SocialCursor/VisitorSocialCursor';
import { useEffect, useRef, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import StreamChatClient from '../StreamChat';

const PartyBidsBox = () => {
  return (
    <Container>
      <div className={classes.partyBidContainer}>
        <Row>
          <Col xs={6}>
            <Row>
              <Col></Col>
              <Col xs={10}>
                <h3>
                  Noun 21 Party <span className={classes.emoji}>🥳</span>
                </h3>
              </Col>
              <Col></Col>
            </Row>
            <hr style={{ margin: '5px' }}></hr>
            <Row>
              <Col>95 Members • 4 bids</Col>
            </Row>
            <Row>
              <Col>
                <p>
                  {' '}
                  Contributors will receive tokens proportional to the amount of your ETH used in
                  the winning bid. If the party loses the bid, or not all of your ETH is used to win
                  the NFT, you will be able to claim the remaining unused funds from your bid.
                </p>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className={classes.biddingPoolContainer}>
                  <span
                    style={{ fontWeight: 'bold', display: 'block', margin: '0xp', padding: '0px' }}
                  >
                    Bidding Pool
                  </span>
                  <span style={{ display: 'block', margin: '0xp', padding: '0px' }}>
                    Ξ 190.306 ETH
                  </span>
                  <span style={{ display: 'block', margin: '0xp', padding: '0px' }}>
                    $618,789.47
                  </span>
                  <p style={{ margin: '0xp', padding: '0px' }}>
                    The party bidding pool was larger than required for the last bid. There's some
                    left over ETH here for people to re-claim.
                  </p>
                </div>
                <Row>
                  {' '}
                  <Col></Col>
                  <Col xs={10}>
                    {' '}
                    <button className={classes.connectWalletButton}>Connect Wallet</button>
                  </Col>
                  <Col></Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col xs={6}>
            <StreamChatClient />
          </Col>
        </Row>
      </div>
    </Container>
  );
};
export default PartyBidsBox;

// <Container>
//               <Row>
//                 <div className={classes.partyBidContainer}>
//                   <Row>Party Details 🥳</Row>
//                   <hr style={{ margin: '20px' }}></hr>
//                   <Row>
//                     <Col xs={8}>
//                       <h3>Noun 21 Party</h3>
//                     </Col>
//                     <Col xs={4}>Noun 21</Col>
//                   </Row>
//                   <Row>
//                     <Col>95 Members • 4 bids</Col>
//                   </Row>
//                   <Row>
//                     <Col>
//                       Contributors will receive tokens proportional to the amount of your ETH used
//                       in the winning bid. If the party loses the bid, or not all of your ETH is used
//                       to win the NFT, you will be able to claim the remaining unused funds from your
//                       bid.
//                     </Col>
//                   </Row>
//                   <Row>
//                     <Col>
//                       <div className={classes.biddingPoolContainer}></div>
//                     </Col>
//                   </Row>
//                 </div>
//               </Row>
//             </Container>
