import { Col, Row } from 'react-bootstrap';
import { Auction } from '../../wrappers/nounsAuction';
import classes from '../CurrentBid/CurrentBid.module.css';
import ShortAddress from '../ShortAddress';
import { isNounderNoun } from '../../utils/nounderNoun';
import { BigNumber } from 'ethers';

const Winner: React.FC<{ winner: string; auction: Auction }> = props => {
  const { winner, auction } = props;

  return (
    <>
      <Row>
        <Col>
          <p className={`${classes.noMarginPadding} ${classes.bidText}`}>Winner</p>
        </Col>
      </Row>
      <Row>
        <Col className={classes.ethAddressPadding}>
          <h3 className={classes.addressText}>
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
