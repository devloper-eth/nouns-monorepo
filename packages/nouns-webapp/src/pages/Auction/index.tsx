import { BigNumber } from 'ethers';
import Banner from '../../components/Banner';
import Auction from '../../components/Auction';
import Documentation from '../../components/Documentation';
import HistoryCollection from '../../components/HistoryCollection';
import { useAuction } from '../../wrappers/nounsAuction';
import { setUseGreyBackground } from '../../state/slices/application';
import { useAppDispatch } from '../../hooks';
import config from '../../config';
import SocialCursorCollection from '../../components/SocialCursorCollection';

const AuctionPage = () => {
  const auction = useAuction(config.auctionProxyAddress);

  const dispatch = useAppDispatch();

  return (
    <>
      <SocialCursorCollection></SocialCursorCollection>
      <Auction
        auction={auction}
        bgColorHandler={useGrey => dispatch(setUseGreyBackground(useGrey))}
      />
      {/* <Banner /> */}
      {/* <HistoryCollection
        latestNounId={auction && BigNumber.from(auction.nounId)}
        historyCount={10}
      /> */}
      {/* <Documentation /> */}
    </>
  );
};
export default AuctionPage;
