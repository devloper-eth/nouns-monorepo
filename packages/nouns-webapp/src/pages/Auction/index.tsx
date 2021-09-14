import Auction from '../../components/Auction';
import { setUseGreyBackground } from '../../state/slices/application';
import SocialCursorCollection from '../../components/SocialCursorCollection';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setOnDisplayAuctionNounId } from '../../state/slices/onDisplayAuction';
import { push } from 'connected-react-router';
import { nounPath } from '../../utils/history';
import useOnDisplayAuction from '../../wrappers/onDisplayAuction';
import { useEffect } from 'react';
import Documentation from '../../components/Documentation';
import Banner from '../../components/Banner';
// import HistoryCollection from '../../components/HistoryCollection';
// import { BigNumber } from 'ethers';
// import HistoryCollection from '../../components/HistoryCollection';
/* Currently unused packages flagged for removal */
// import config from '../../config';
// import { useAuction } from '../../wrappers/nounsAuction';

interface AuctionPageProps {
  initialAuctionId?: number;
}

const AuctionPage: React.FC<AuctionPageProps> = props => {
  const { initialAuctionId } = props;
  const onDisplayAuction = useOnDisplayAuction();
  const lastAuctionNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!lastAuctionNounId) return;

    if (initialAuctionId !== undefined) {
      // handle out of bounds noun path ids
      if (initialAuctionId > lastAuctionNounId || initialAuctionId < 0) {
        dispatch(setOnDisplayAuctionNounId(lastAuctionNounId));
        dispatch(push(nounPath(lastAuctionNounId)));
      } else {
        if (onDisplayAuction === undefined) {
          // handle regular noun path ids on first load
          dispatch(setOnDisplayAuctionNounId(initialAuctionId));
        }
      }
    } else {
      // no noun path id set
      if (lastAuctionNounId) {
        dispatch(setOnDisplayAuctionNounId(lastAuctionNounId));
      }
    }
  }, [lastAuctionNounId, dispatch, initialAuctionId, onDisplayAuction]);

  return (
    <>
      <SocialCursorCollection />
      {onDisplayAuction && (
        <Auction
          auction={onDisplayAuction}
          bgColorHandler={(useGrey: boolean) => dispatch(setUseGreyBackground(useGrey))}
        />
      )}
      <Banner />
      {/* {lastAuctionNounId && (
        <HistoryCollection latestNounId={BigNumber.from(lastAuctionNounId)} historyCount={10} />
      )} */}
      <Documentation />
    </>
  );
};
export default AuctionPage;
