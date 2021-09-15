import { Col } from 'react-bootstrap';
import { StandaloneNounWithSeed } from '../StandaloneNoun';
import { Row, Container } from 'react-bootstrap';
import { LoadingNoun } from '../Noun';
import { Auction as IAuction } from '../../wrappers/nounsAuction';
import classes from './Auction.module.css';
import { INounSeed } from '../../wrappers/nounToken';
import AuctionActivity from '../AuctionActivity';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  setNextOnDisplayAuctionNounId,
  setPrevOnDisplayAuctionNounId,
} from '../../state/slices/onDisplayAuction';
import { useEffect, useRef, useState } from 'react';
// import UpdatedConfetti from '../UpdatedConfetti';
import Confetti from 'react-confetti';
import { BigNumber } from '@ethersproject/bignumber';
import { isNounderNoun } from '../../utils/nounderNoun';

const Auction: React.FC<{ auction: IAuction; bgColorHandler: (useGrey: boolean) => void }> =
  props => {
    const { auction: currentAuction, bgColorHandler } = props;
    const history = useHistory();
    const dispatch = useAppDispatch();
    const lastNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);
    const [confettiSize, setConfettiSize] = useState({ height: 0, width: 0 });
    const confettiContainerRef = useRef<HTMLDivElement>(null);

    const loadedNounHandler = (seed: INounSeed) => {
      bgColorHandler(seed.background === 0);
    };

    const prevAuctionHandler = () => {
      dispatch(setPrevOnDisplayAuctionNounId());
      history.push(`/noun/${currentAuction.nounId.toNumber() - 1}`);
    };
    const nextAuctionHandler = () => {
      dispatch(setNextOnDisplayAuctionNounId());
      history.push(`/noun/${currentAuction.nounId.toNumber() + 1}`);
    };

    // avoid unnecessary 'useNounToken' calls and the dreaded by checking if noun was burned
    const nounContent = checkIfNounBurned(currentAuction) ? (
      <div className={classes.nounWrapper}>
        <LoadingNoun />
      </div>
    ) : (
      <div className={classes.nounWrapper}>
        <StandaloneNounWithSeed nounId={currentAuction.nounId} onLoadSeed={loadedNounHandler} />
      </div>
    );

    const loadingNoun = (
      <div className={classes.nounWrapper}>
        <LoadingNoun />
      </div>
    );

    const currentAuctionActivityContent = lastNounId && (
      <AuctionActivity
        auction={currentAuction}
        isFirstAuction={currentAuction.nounId.eq(0)}
        isLastAuction={currentAuction.nounId.eq(lastNounId)}
        onPrevAuctionClick={prevAuctionHandler}
        onNextAuctionClick={nextAuctionHandler}
        displayGraphDepComps={true}
      />
    );

    // set confetti container size
    useEffect(() => {
      if (confettiContainerRef.current) {
        let parentHeight = confettiContainerRef.current.offsetHeight;
        let parentWidth = confettiContainerRef.current.offsetWidth;

        // add navbar header height
        setConfettiSize({ height: parentHeight + 110, width: parentWidth });
      }
    }, [confettiContainerRef]);

    // resize confetti container on window resize
    useEffect(() => {
      function handleResize() {
        if (confettiContainerRef.current) {
          let parentHeight = confettiContainerRef.current.offsetHeight;
          let parentWidth = confettiContainerRef.current.offsetWidth;

          setConfettiSize({ height: parentHeight + 110, width: parentWidth });
        }
      }
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    const confettiColors = [
      '#2B83F6',
      '#4BEA69',
      '#5648ED',
      '#F3322C',
      '#F68EFF',
      '#FF638D',
      '#FFF449',
    ];

    return (
      <Container ref={confettiContainerRef} fluid>
        <Container fluid="lg" className={classes.pageContentWrapper}>
          {/* <UpdatedConfetti width={confettiSize.width} height={confettiSize.height} /> */}
          <Confetti
            width={confettiSize.width}
            height={confettiSize.height}
            numberOfPieces={150}
            gravity={0.02}
            colors={confettiColors}
            recycle={true}
            drawShape={ctx => {
              // ctx.beginPath();
              // ctx.fillRect(
              //   Math.random() * 6 + 3,
              //   Math.random() * 7.5 + 3,
              //   Math.random(),
              //   Math.random(),
              // );
              // ctx.restore();
              // ctx.closePath();
              ctx.fillRect(0, 0, Math.random() + 5, Math.random() + 10);
            }}
          />
          <Row>
            <Col lg={{ span: 6 }} className={`align-self-end ${classes.noPaddingMargin}`}>
              {currentAuction ? nounContent : loadingNoun}
            </Col>
            <Col lg={{ span: 6 }} className={classes.currentAuctionActivityContainer}>
              {currentAuctionActivityContent}
            </Col>
            <Col lg={2} />
          </Row>
        </Container>
      </Container>
    );
  };
export default Auction;

const checkIfNounBurned = (auction: IAuction) => {
  if (!auction) return true;

  const timeLeft = Number(auction.endTime) - Math.floor(Date.now() / 1000);

  // if nounders noun, noun was not burned, so render normally
  if (isNounderNoun(BigNumber.from(auction.nounId))) return false;

  if (
    !auction ||
    !auction.nounId ||
    (!auction.bidder && timeLeft <= 0) ||
    (auction.bidder && auction.bidder === '0x0000000000000000000000000000000000000000')
  ) {
    return true;
  } else {
    return false;
  }
};
