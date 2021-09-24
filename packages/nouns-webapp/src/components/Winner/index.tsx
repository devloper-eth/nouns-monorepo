import { Col, Row } from 'react-bootstrap';
import { Auction } from '../../wrappers/nounsAuction';
import classes from './Winner.module.css';
import ShortAddress from '../ShortAddress';
import { isNounderNoun } from '../../utils/nounderNoun';
import { BigNumber } from 'ethers';
import config from '../../config';

const Winner: React.FC<{ winner: string; auction: Auction }> = props => {
  const { winner, auction } = props;

  let bidder = auction.bidder;
  let partyWin = bidder && bidder.toLowerCase() === config.nounsPartyAddress.toLowerCase();

  return (
    <>
      <Row>
        <Col>
          <p className={classes.bidText}>Winner</p>
        </Col>
      </Row>
      <Row>
        <Col className={classes.ethAddressPadding}>
          <h3 className={partyWin ? classes.partyWonText : classes.addressText}>
            {auction && auction.nounId && isNounderNoun(BigNumber.from(auction.nounId)) ? (
              'nounders.eth'
            ) : (
              <ShortAddress address={winner} />
            )}
          </h3>
        </Col>
      </Row>
    </>
  );
};

export default Winner;
