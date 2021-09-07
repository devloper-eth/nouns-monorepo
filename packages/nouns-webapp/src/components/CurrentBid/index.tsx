import BigNumber from 'bignumber.js';
import classes from './CurrentBid.module.css';
import TruncatedAmount from '../TruncatedAmount';
import { Col, Row } from 'react-bootstrap';

const CurrentBid: React.FC<{ currentBid: BigNumber; auctionEnded: boolean }> = props => {
  const { currentBid, auctionEnded } = props;

  const titleContent = auctionEnded ? 'Winning bid' : 'Current bid';

  return (
    <>
      <Row>
        <Col>
          <p className={`${classes.noMarginPadding} ${classes.bidText}`}>{titleContent}</p>
        </Col>
      </Row>
      <Row>
        <Col className={classes.ethAddressPadding}>
          <h3 className={`${classes.noMarginPadding}`}>
            <TruncatedAmount amount={currentBid && currentBid} />
          </h3>
        </Col>
      </Row>
    </>
    // OLD STYLING - FLAGGED FOR REMOVAL
    // <div className={classes.section}>
    //   <h4>{titleContent}</h4>
    //   <h2>
    //     <TruncatedAmount amount={currentBid && currentBid} />
    //   </h2>
    // </div>
  );
};

export default CurrentBid;
