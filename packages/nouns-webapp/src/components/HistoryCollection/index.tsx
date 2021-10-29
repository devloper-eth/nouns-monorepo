import { BigNumberish } from 'ethers';
import Section from '../../layout/Section';
import classes from './HistoryCollection.module.css';
import clsx from 'clsx';
import StandaloneNoun from '../StandaloneNoun';
import { LoadingNoun } from '../Noun';
import config from '../../config';
import { Container, Row } from 'react-bootstrap';
import { useAppSelector } from '../../hooks';
import { getPastAuctionsByKey } from '../../state/slices/pastAuctions';

interface HistoryCollectionProps {
  historyCount: number;
  latestNounId: BigNumberish;
}

const HistoryCollection: React.FC<HistoryCollectionProps> = (props: HistoryCollectionProps) => {
  const { historyCount, latestNounId } = props;
  const pastAuctions = useAppSelector(state => getPastAuctionsByKey(state.pastAuctions, 'noun'));

  if (!latestNounId || !pastAuctions) return null;

  // const startAtZero = BigNumber.from(latestNounId).sub(historyCount).lt(0);

  // let nounIds: Array<BigNumber | null> = new Array(historyCount);
  // nounIds = nounIds.fill(null).map((_, i) => {
  //   if (BigNumber.from(i).lt(latestNounId)) {
  //     const index = startAtZero
  //       ? BigNumber.from(0)
  //       : BigNumber.from(Number(latestNounId) - historyCount);
  //     return index.add(i);
  //   } else {
  //     return null;
  //   }
  // });

  // get last 'historyCount' number of auctions
  let historyAuctions = pastAuctions.pastAuctions.slice(0, historyCount);

  const nounsContent = historyAuctions?.map((history, i) => {
    let bidder = history?.activeAuction?.bidder;
    let nounId = history?.activeAuction?.nounId;

    return !nounId || !bidder || bidder === '0x0000000000000000000000000000000000000000' ? (
      <LoadingNoun key={i} />
    ) : (
      <StandaloneNoun key={i} nounId={nounId} />
    );
  });

  return (
    <Section bgColor="white" fullWidth={true}>
      <Container fluid>
        <Row className="justify-content-md-center">
          <div className={clsx(classes.historyCollection)}>
            {config.enableHistory && nounsContent}
          </div>
        </Row>
      </Container>
    </Section>
  );
};

export default HistoryCollection;
