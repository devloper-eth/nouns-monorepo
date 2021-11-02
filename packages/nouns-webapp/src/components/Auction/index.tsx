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
  setPrevOnDisplayAuctionNounId,
  setNextOnDisplayAuctionNounId,
  getOnDisplayByKey,
} from '../../state/slices/onDisplayAuction';
import { useEffect, useRef, useState } from 'react';
import UpdatedConfetti from '../UpdatedConfetti';
import { BigNumber } from '@ethersproject/bignumber';
import { isNounderNoun } from '../../utils/nounderNoun';
import StandalonePartyNoun from '../StandalonePartyNoun';
import VaultAuctionActivity from '../VaultAuctionActivity';


// TODO: Update to actually use auctionPath
const Auction: React.FC<{ auction: IAuction; auctionPath: String; bgColorHandler: (useGrey: boolean) => void }> =
  props => {
    const { auction: currentAuction, auctionPath, bgColorHandler } = props;
    const history = useHistory();
    const dispatch = useAppDispatch();
    const lastNounId = useAppSelector(state => getOnDisplayByKey(state.onDisplayAuction, 'partynoun')?.lastAuctionNounId); // TODO needs to return lastPartyNounId
    const [confettiSize, setConfettiSize] = useState({ height: 0, width: 0 });
    const confettiContainerRef = useRef<HTMLDivElement>(null);
    // const loadedNounHandler = (seed: INounSeed) => {
    //   bgColorHandler(seed.background === 0);
    // };

    const prevAuctionHandler = () => {
      dispatch(setPrevOnDisplayAuctionNounId('noun'));
      history.push(`/party-noun/${currentAuction.nounId.toNumber() - 1}`);
    };
    const nextAuctionHandler = () => {
      dispatch(setNextOnDisplayAuctionNounId('noun'));
      history.push(`/party-noun/${currentAuction.nounId.toNumber() + 1}`);
    };

    const nounContent = (
      <div className={classes.nounWrapper}>
        <StandalonePartyNoun partyNounId={currentAuction.partyNounId || BigNumber.from(0)} tokenURI={currentAuction.tokenURI || ""} />
      </div>
    )

    const loadingNoun = (
      <div className={classes.nounWrapper}>
        <LoadingNoun />
      </div>
    );

    const currentAuctionActivityContent = (
      <AuctionActivity
        auction={currentAuction}
        isFirstAuction={(currentAuction.partyNounId || BigNumber.from(0)).eq(0)} // TODO
        isLastAuction={(currentAuction.partyNounId || BigNumber.from(0)).eq(lastNounId || 0)} // TODO lastNounId is wrong
        onPrevAuctionClick={prevAuctionHandler}
        onNextAuctionClick={nextAuctionHandler}
        displayGraphDepComps={true}
      />
    )

    // const currentAuctionActivityContent = lastNounId && (
    // );

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

    return (
      <Container ref={confettiContainerRef} fluid>
        <Container fluid="lg" className={classes.pageContentWrapper}>
          <UpdatedConfetti width={confettiSize.width} height={confettiSize.height} />
          <Row>
            <Col lg={{ span: 6 }} className={`align-self-end ${classes.noPaddingMargin}`}>
              {currentAuction ? nounContent : loadingNoun}
            </Col>
            {currentAuctionActivityContent}
          </Row>
        </Container>
      </Container>
    );
  };
export default Auction;

// const checkIfNounBurned = (auction: IAuction) => {
//   if (!auction) return true;

//   const auctionEnded = Number(auction.endTime) - Math.floor(Date.now() / 1000) <= 0;

//   // if nounders noun, noun was not burned, so render normally
//   if (isNounderNoun(BigNumber.from(auction.nounId))) return false;

//   if (
//     !auction ||
//     !auction.nounId ||
//     (!auction.bidder && auctionEnded) ||
//     (auction.bidder &&
//       auction.bidder === '0x0000000000000000000000000000000000000000' &&
//       auctionEnded)
//   ) {
//     return true;
//   } else {
//     return false;
//   }
// };
