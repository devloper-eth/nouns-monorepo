import { BigNumber } from '@ethersproject/bignumber';
import { useAppSelector } from '../hooks';
import { generateEmptyNounderAuction, isNounderNoun } from '../utils/nounderNoun';
import { Bid, BidEvent } from '../utils/types';
import { Auction } from './nounsAuction';
import { getAuctionStateByKey } from '../state/slices/auction'
import { getOnDisplayByKey } from '../state/slices/onDisplayAuction'
import { getPastAuctionsByKey } from '../state/slices/pastAuctions';

const deserializeAuction = (reduxSafeAuction: Auction): Auction => {
  const out:Auction = {
    amount: BigNumber.from(reduxSafeAuction.amount),
    bidder: reduxSafeAuction.bidder,
    startTime: BigNumber.from(reduxSafeAuction.startTime),
    endTime: BigNumber.from(reduxSafeAuction.endTime),
    nounId: BigNumber.from(reduxSafeAuction.nounId),
    settled: false,
  };

  if (reduxSafeAuction.origNounId) {
    out["origNounId"] = BigNumber.from(reduxSafeAuction.origNounId)
    out["tokenURI"] = reduxSafeAuction.tokenURI
  }
  return out
};

const deserializeBid = (reduxSafeBid: BidEvent): Bid => {
  return {
    nounId: BigNumber.from(reduxSafeBid.nounId),
    sender: reduxSafeBid.sender,
    value: BigNumber.from(reduxSafeBid.value),
    extended: reduxSafeBid.extended,
    transactionHash: reduxSafeBid.transactionHash,
    timestamp: BigNumber.from(reduxSafeBid.timestamp),
  };
};
const deserializeBids = (reduxSafeBids: BidEvent[]): Bid[] => {
  return reduxSafeBids
    .map(bid => deserializeBid(bid))
    .sort((a: Bid, b: Bid) => {
      return b.timestamp.toNumber() - a.timestamp.toNumber();
    });
};


const useOnDisplayAuction = (id: string): Auction | undefined => {
  const lastAuctionNounId = useAppSelector(
    state => getAuctionStateByKey(state.auction, id)?.activeAuction?.nounId
  );
  const onDisplayAuctionNounId = useAppSelector(
    state => getOnDisplayByKey(state.onDisplayAuction, id)?.onDisplayAuctionNounId,
  );
  const currentAuction = useAppSelector(
    state => getAuctionStateByKey(state.auction, id)?.activeAuction
  );
  const pastAuctions = useAppSelector(
    state => getPastAuctionsByKey(state.pastAuctions, id)?.pastAuctions
  );

  if (
    onDisplayAuctionNounId === undefined ||
    lastAuctionNounId === undefined ||
    currentAuction === undefined ||
    !pastAuctions
  )
    return undefined;

  // current auction
  if (BigNumber.from(onDisplayAuctionNounId).eq(lastAuctionNounId)) {
    return deserializeAuction(currentAuction);
  } else {
    // nounder auction
    if (isNounderNoun(BigNumber.from(onDisplayAuctionNounId))) {
      const emptyNounderAuction = generateEmptyNounderAuction(
        BigNumber.from(onDisplayAuctionNounId),
        pastAuctions,
      );

      return deserializeAuction(emptyNounderAuction);
    } else {
      // past auction
      const reduxSafeAuction: Auction | undefined = pastAuctions.find(auction => {
        const nounId = auction.activeAuction && BigNumber.from(auction.activeAuction.nounId);
        return nounId && nounId.toNumber() === onDisplayAuctionNounId;
      })?.activeAuction;

      return reduxSafeAuction ? deserializeAuction(reduxSafeAuction) : undefined;
    }
  }
};

export const useAuctionBids = (auctionNounId: BigNumber, id: string): Bid[] | undefined => {
  const lastAuctionNounId = useAppSelector(
    state => getOnDisplayByKey(state.onDisplayAuction, id)?.lastAuctionNounId,
  );
  const lastAuctionBids = useAppSelector(
    state => getAuctionStateByKey(state.auction, id)?.bids
  );
  const pastAuctions = useAppSelector(
    state => getPastAuctionsByKey(state.pastAuctions, id)?.pastAuctions
  );

  // auction requested is active auction
  if (lastAuctionNounId === auctionNounId.toNumber()) {
    return lastAuctionBids && deserializeBids(lastAuctionBids);
  } else {
    // find bids for past auction requested
    const bidEvents: BidEvent[] | undefined = pastAuctions?.find(auction => {
      const nounId = auction.activeAuction && BigNumber.from(auction.activeAuction.nounId);
      return nounId && nounId.eq(auctionNounId);
    })?.bids;

    return bidEvents && deserializeBids(bidEvents);
  }
};

export default useOnDisplayAuction;
