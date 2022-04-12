import { BigNumber } from '@ethersproject/bignumber';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AuctionCreateEvent,
  AuctionExtendedEvent,
  AuctionSettledEvent,
  BidEvent,
} from '../../utils/types';
import { Auction as IAuction } from '../../wrappers/nounsAuction';

export interface Auctions {
  auctions: Map<string, AuctionState>;
}

export interface AuctionState {
  activeAuction?: IAuction;
  bids: BidEvent[];
}

export interface Keyed<T> {
  id: string,
  value: T
}

const initialState: Auctions = {
  auctions: new Map<string, AuctionState>(),
};

export const reduxSafeNewAuction = (auction: AuctionCreateEvent): IAuction => ({
  amount: BigNumber.from(0).toJSON(),
  bidder: '',
  startTime: BigNumber.from(auction.startTime).toJSON(),
  endTime: BigNumber.from(auction.endTime).toJSON(),
  nounId: BigNumber.from(auction.nounId).toJSON(),
  settled: false,
});

export const reduxSafeAuction = (auction: IAuction): IAuction => ({
  amount: BigNumber.from(auction.amount).toJSON(),
  bidder: auction.bidder,
  startTime: BigNumber.from(auction.startTime).toJSON(),
  endTime: BigNumber.from(auction.endTime).toJSON(),
  nounId: BigNumber.from(auction.nounId).toJSON(),
  settled: auction.settled,
  origNounId: BigNumber.from(auction.origNounId || BigNumber.from(0)).toJSON(),
  partyNounId: BigNumber.from(auction.partyNounId || BigNumber.from(0)).toJSON(),
  tokenURI: auction.tokenURI,
});

export const reduxSafeBid = (bid: BidEvent): BidEvent => ({
  nounId: BigNumber.from(bid.nounId).toJSON(),
  sender: bid.sender,
  value: BigNumber.from(bid.value).toJSON(),
  extended: bid.extended,
  transactionHash: bid.transactionHash,
  timestamp: bid.timestamp,
});

const maxBid = (bids: BidEvent[]): BidEvent => {
  return bids.reduce((prev, current) => {
    return BigNumber.from(prev.value).gt(BigNumber.from(current.value)) ? prev : current;
  });
};

export const upsertAuctionStateByKey = (state: Auctions, auctionType: string): AuctionState => {
  let s = state.auctions.get(auctionType)
  if (s) {
    return s
  }
  var j = {
    activeAuction: undefined,
    bids: [],
  }
  state.auctions.set(auctionType, j)
  return j
};

export const getAuctionStateByKey = (state: Auctions, auctionType: string): AuctionState | undefined => {
  return state.auctions.get(auctionType)
};

const auctionsEqual = (
  a: IAuction,
  b: AuctionSettledEvent | AuctionCreateEvent | BidEvent | AuctionExtendedEvent,
) => BigNumber.from(a.nounId).eq(BigNumber.from(b.nounId));

const containsBid = (bidEvents: BidEvent[], bidEvent: BidEvent) =>
  bidEvents.map(bid => bid.transactionHash).indexOf(bidEvent.transactionHash) >= 0;

/**
 * State of **current** auctions (sourced via websocket)
 * Keyed by an ID which differentiates multiple auctions on the page.
 */
export const auctionsSlice = createSlice({
  name: 'auctions',
  initialState,
  reducers: {
    setActiveAuction: (state, action: PayloadAction<Keyed<AuctionCreateEvent>>) => {
      let s = upsertAuctionStateByKey(state, action.payload.id)
      s.activeAuction = reduxSafeNewAuction(action.payload.value);
      s.bids = [];
    },
    setFullAuction: (state, action: PayloadAction<Keyed<IAuction>>) => {
      let s = upsertAuctionStateByKey(state, action.payload.id)
      s.activeAuction = reduxSafeAuction(action.payload.value);
    },
    appendBid: (state, action: PayloadAction<Keyed<BidEvent>>) => {
      let s = upsertAuctionStateByKey(state, action.payload.id)

      if (!(s.activeAuction && auctionsEqual(s.activeAuction, action.payload.value))) return;
      if (containsBid(s.bids, action.payload.value)) return;
      s.bids = [reduxSafeBid(action.payload.value), ...s.bids];
      const maxBid_ = maxBid(s.bids);
      s.activeAuction.amount = BigNumber.from(maxBid_.value).toJSON();
      s.activeAuction.bidder = maxBid_.sender;
    },
    setAuctionSettled: (state, action: PayloadAction<Keyed<AuctionSettledEvent>>) => {
      let s = upsertAuctionStateByKey(state, action.payload.id)

      if (!(s.activeAuction && auctionsEqual(s.activeAuction, action.payload.value))) return;
      s.activeAuction.settled = true;
      s.activeAuction.bidder = action.payload.value.winner;
      s.activeAuction.amount = BigNumber.from(action.payload.value.amount).toJSON();
    },
    setAuctionExtended: (state, action: PayloadAction<Keyed<AuctionExtendedEvent>>) => {
      let s = upsertAuctionStateByKey(state, action.payload.id)

      if (!(s.activeAuction && auctionsEqual(s.activeAuction, action.payload.value))) return;
      s.activeAuction.endTime = BigNumber.from(action.payload.value.endTime).toJSON();
    },
  },
});

export const {
  setActiveAuction,
  appendBid,
  setAuctionExtended,
  setAuctionSettled,
  setFullAuction,
} = auctionsSlice.actions;

export default auctionsSlice.reducer;
