import Auction from '../../components/Auction';
import { setUseGreyBackground } from '../../state/slices/application';
import SocialCursorCollection from '../../components/SocialCursorCollection';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getOnDisplayByKey, setOnDisplayAuctionNounId } from '../../state/slices/onDisplayAuction';
import { push } from 'connected-react-router';
import { nounPath } from '../../utils/history';
import useOnDisplayAuction from '../../wrappers/onDisplayAuction';
import { useEffect } from 'react';
import Documentation from '../../components/Documentation';
import Banner from '../../components/Banner';
import HistoryCollection from '../../components/HistoryCollection';
import { BigNumber } from 'ethers';
/* Currently unused packages flagged for removal */
// import config from '../../config';
// import { useAuction } from '../../wrappers/nounsAuction';

interface AuctionPageProps {
  id?: string;
  initialAuctionId?: number;
}

// TODO:
// - Update to handle different states depending on the properties.
// - Arguably this useEffect should live elsewhere in the page root?
const AuctionPage: React.FC<AuctionPageProps> = props => {
  const { id = "partynoun", initialAuctionId } = props; 

  const onDisplayAuction = useOnDisplayAuction(id);
  const lastAuctionNounId = useAppSelector(state => getOnDisplayByKey(state.onDisplayAuction, id)?.lastAuctionNounId);

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!lastAuctionNounId) return;

    if (initialAuctionId !== undefined) {
      // handle out of bounds noun path ids
      if (initialAuctionId > lastAuctionNounId || initialAuctionId < 0) {
        dispatch(setOnDisplayAuctionNounId({
          id: id,
          value: lastAuctionNounId
        }));

        // TODO: Fix path
        dispatch(push(nounPath(lastAuctionNounId)));
      } else {
        if (onDisplayAuction === undefined) {
          // handle regular noun path ids on first load
          dispatch(setOnDisplayAuctionNounId({
            id: id,
            value: initialAuctionId
          }));
        }
      }
    } else {
      // no noun path id set
      if (lastAuctionNounId) {
        dispatch(setOnDisplayAuctionNounId({
          id: id,
          value: lastAuctionNounId
        }));
      }
    }
  }, [lastAuctionNounId, dispatch, initialAuctionId, onDisplayAuction]);

  return (
    <>
      <SocialCursorCollection />
      {onDisplayAuction && (
        <Auction
          auction={onDisplayAuction}
          auctionPath={id}
          bgColorHandler={(useGrey: boolean) => dispatch(setUseGreyBackground(useGrey))}
        />
      )}
      <Banner />
      {lastAuctionNounId && (
        <HistoryCollection latestNounId={BigNumber.from(lastAuctionNounId)} historyCount={10} />
      )}
      <Documentation />
    </>
  );
};
export default AuctionPage;
