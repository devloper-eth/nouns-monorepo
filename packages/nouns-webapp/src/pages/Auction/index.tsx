import Auction from '../../components/Auction';
import { useAuction } from '../../wrappers/nounsAuction';
import { setUseGreyBackground } from '../../state/slices/application';
import { useAppDispatch } from '../../hooks';
import config from '../../config';
import SocialCursorCollection from '../../components/SocialCursorCollection';

/* Currently unused packages flagged for removal */
// import Documentation from '../../components/Documentation';
// import HistoryCollection from '../../components/HistoryCollection';
// import { BigNumber } from 'ethers';
// import Banner from '../../components/Banner';

const AuctionPage = () => {
  const auction = useAuction(config.auctionProxyAddress);

  const dispatch = useAppDispatch();

  return (
    <>
      <SocialCursorCollection />
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
