import { BigNumber } from 'ethers';
import moment from 'moment';
import { Col, Row } from 'react-bootstrap';
import classes from './AuctionActivityDateHeadline.module.css';

const AuctionActivityDateHeadline: React.FC<{ startTime: BigNumber }> = props => {
  const { startTime } = props;
  const auctionStartTimeUTC = moment(Number(startTime.toString()) * 1000).format('MMM DD YYYY');
  return (
    <Row className={classes.dateWrapper}>
      <Col className={classes.noPaddingMargin}>
        <h4 className={classes.dateText}>{`${auctionStartTimeUTC}`}</h4>
      </Col>
    </Row>
  );
};

export default AuctionActivityDateHeadline;
