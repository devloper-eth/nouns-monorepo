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
          <h3 className={classes.noMarginPadding}>
            {auction && auction.nounId && isNounderNoun(BigNumber.from(auction.nounId)) ? (
              'nounders.eth'
            ) : (
              <ShortAddress address={winner} />
            )}
          </h3>
        </Col>
      </Row>
    </>
    // <div className={classes.section}>
    //   <h4>Winner</h4>
    //   <h2>
    //     <ShortAddress address={winner} />
    //   </h2>
    // </div>
  );
};

export default Winner;
