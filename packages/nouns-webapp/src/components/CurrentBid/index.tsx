import BigNumber from 'bignumber.js';
import classes from './CurrentBid.module.css';
import TruncatedAmount from '../TruncatedAmount';
import { Col, Row } from 'react-bootstrap';

/**
 * Passible to CurrentBid as `currentBid` prop to indicate that
 * the bid amount is not applicable to this auction. (Nounder Noun)
 */
export const BID_N_A = 'n/a';
/**
 * Special Bid type for not applicable auctions (Nounder Nouns)
 */
type BidNa = typeof BID_N_A;
const CurrentBid: React.FC<{
  currentBid: BigNumber | BidNa;
  auctionEnded: boolean;
}> = props => {
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
          <h3 className={`${classes.winningAmount}`}>
            {currentBid === BID_N_A ? (
              BID_N_A
            ) : (
              <TruncatedAmount amount={currentBid && currentBid} />
            )}
          </h3>
        </Col>
      </Row>
    </>
  );
};

export default CurrentBid;