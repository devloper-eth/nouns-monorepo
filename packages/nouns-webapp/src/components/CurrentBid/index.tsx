import classes from './CurrentBid.module.css';
import TruncatedAmount from '../TruncatedAmount';
import { Col, Row } from 'react-bootstrap';
import { useNounsPartyDepositBalance } from '../../wrappers/nounsParty';
import BigNumber from 'bignumber.js';


/** Todo: rename me **/
const CurrentBid: React.FC<{}> = props => {
  let depositBalance = useNounsPartyDepositBalance();

  return (
    <>
      <Row>
        <Col>
          <p className={`${classes.noMarginPadding} ${classes.bidText}`}>Nouns Party Vault</p>
        </Col>
      </Row>
      <Row>
        <Col className={classes.ethAddressPadding}>
          <h3 className={`${classes.winningAmount}`}>
              <TruncatedAmount amount={new BigNumber(depositBalance.toString())} />
          </h3>
        </Col>
      </Row>
    </>
  );
};

export default CurrentBid;
