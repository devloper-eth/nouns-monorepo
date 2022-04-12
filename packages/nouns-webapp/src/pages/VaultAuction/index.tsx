import VaultAuction from '../../components/VaultAuction';
import { setUseGreyBackground } from '../../state/slices/application';
import SocialCursorCollection from '../../components/SocialCursorCollection';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  setOnDisplayAuctionNounId,
  getOnDisplayByKey,
} from '../../state/slices/onDisplayAuction';
import { push } from 'connected-react-router';
import { nounPath } from '../../utils/history';
import useOnDisplayAuction from '../../wrappers/onDisplayAuction';
import { useEffect } from 'react';
import Documentation from '../../components/Documentation';
import Banner from '../../components/Banner';
import HistoryCollection from '../../components/HistoryCollection';
import { BigNumber } from 'ethers';

interface AuctionPageProps {
  initialAuctionId?: number;
}

/**
 * The nouns auction house page.
 *
 * Not the prettiest code, but it gets the job done. This page is attached
 * to the nouns auction house.
 */
const VaultAuctionPage: React.FC<AuctionPageProps> = props => {
  const { initialAuctionId } = props;
  const onDisplayAuction = useOnDisplayAuction('noun');
  const lastAuctionNounId = useAppSelector(state => getOnDisplayByKey(state.onDisplayAuction, 'noun')?.lastAuctionNounId);

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!lastAuctionNounId) return;

    if (initialAuctionId !== undefined) {
      // handle out of bounds noun path ids
      if (initialAuctionId > lastAuctionNounId || initialAuctionId < 0) {
        dispatch(setOnDisplayAuctionNounId({
          id: 'noun',
          value: lastAuctionNounId
        }));

        // TODO: Path
        dispatch(push(nounPath(lastAuctionNounId)));
      } else {
        if (onDisplayAuction === undefined) {
          // handle regular noun path ids on first load
          dispatch(setOnDisplayAuctionNounId({
            id: 'noun',
            value: initialAuctionId
          }));
        }
      }
    } else {
      // no noun path id set
      if (lastAuctionNounId) {
        dispatch(setOnDisplayAuctionNounId({
          id: 'noun',
          value: lastAuctionNounId
        }));
      }
    }
  }, [lastAuctionNounId, dispatch, initialAuctionId, onDisplayAuction]);

  return (
    <>
      <SocialCursorCollection />
      {onDisplayAuction && (
        <VaultAuction
          auction={onDisplayAuction}
          bgColorHandler={(useGrey: boolean) => dispatch(setUseGreyBackground(useGrey))}
        />
      )}
      <Banner />
      { /* TODO: Use party nouns vs actual nouns. */ }
      {lastAuctionNounId && (
        <HistoryCollection latestNounId={BigNumber.from(lastAuctionNounId)} historyCount={10} />
      )}
      <Documentation />
    </>
  );
};
export default VaultAuctionPage;
