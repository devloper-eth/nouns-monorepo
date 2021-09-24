import BigNumber from 'bignumber.js';
import classes from './CurrentBid.module.css';
import TruncatedAmount from '../TruncatedAmount';
import { Col, Row } from 'react-bootstrap';
import config from '../../config';
import { Auction } from '../../wrappers/nounsAuction';

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
  auction: Auction;
}> = props => {
  const { currentBid, auctionEnded, auction } = props;
  const titleContent = auctionEnded ? 'Winning bid' : 'Current bid';

  let bidder = auction.bidder;
  let partyWin = bidder && bidder.toLowerCase() === config.nounsPartyAddress.toLowerCase();

  return (
    <>
      <Row>
        <Col>
          <p
            className={
              auctionEnded
                ? `${classes.noMarginPadding} ${classes.winningText}`
                : `${classes.bidText}`
            }
          >
            {titleContent}
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3
            className={
              auctionEnded
                ? partyWin
                  ? `${classes.partyWonText}`
                  : `${classes.winningAmount}`
                : classes.leadingBid
            }
          >
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
