import moment from 'moment';
import { Auction } from '../../wrappers/nounsAuction';
import classes from './AuctionTimer.module.css';
import { useState, useEffect, useRef } from 'react';
import { Col, Row } from 'react-bootstrap';

const AuctionTimer: React.FC<{
  auction: Auction;
  auctionEnded: boolean;
}> = props => {
  const { auction } = props;

  const [auctionTimer, setAuctionTimer] = useState(0);
  const auctionTimerRef = useRef(auctionTimer); // to access within setTimeout
  auctionTimerRef.current = auctionTimer;

  const timerDuration = moment.duration(auctionTimerRef.current, 's');

  // timer logic
  useEffect(() => {
    const timeLeft = (auction && Number(auction.endTime)) - moment().unix();

    setAuctionTimer(auction && timeLeft);

    if (auction && timeLeft <= 0) {
      setAuctionTimer(0);
    } else {
      const timer = setTimeout(() => {
        setAuctionTimer(auctionTimerRef.current - 1);
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [auction, auctionTimer]);

  const flooredMinutes = Math.floor(timerDuration.minutes());
  const flooredSeconds = Math.floor(timerDuration.seconds());

  if (!auction) return null;

  return (
    <>
      <Row>
        <Col>
          <p className={classes.noPaddingMargin}>Time Remaining</p>
          <h3 className={`${classes.timerWrapper} ${classes.noPaddingMargin}`}>
            <div className={classes.timerSection}>
              <span>
                {`${Math.floor(timerDuration.hours())}`}{' '}
                <span className={classes.timeLabels}>h</span>
              </span>
            </div>
            <div className={classes.timerSection}>
              <span>
                {`${flooredMinutes}`}
                <span className={classes.timeLabels}>m</span>
              </span>
            </div>
            <div className={classes.timerSection}>
              <span>
                {`${flooredSeconds}`}
                <span className={classes.timeLabels}>s</span>
              </span>
            </div>
          </h3>
        </Col>
      </Row>
    </>
  );
};

export default AuctionTimer;
