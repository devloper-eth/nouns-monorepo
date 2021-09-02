import { Col, Row } from 'react-bootstrap';
import classes from '../CurrentBid/CurrentBid.module.css';
import ShortAddress from '../ShortAddress';

const Winner: React.FC<{ winner: string }> = props => {
  const { winner } = props;

  return (
    <>
      <Row>
        <Col>
          <p>Winner</p>
        </Col>
      </Row>
      <Row>
        <Col className={classes.ethAddressPadding}>
          <h3 className={classes.noMarginPadding}>
            <ShortAddress address={winner} />
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
