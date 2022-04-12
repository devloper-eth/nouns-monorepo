import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuctionState } from './auction';
import { BigNumber } from '@ethersproject/bignumber';


interface KeyedPastAuctionsState {
  past: Map<string, PastAuctionsState>
}

interface PastAuctionsState {
  pastAuctions: AuctionState[];
}

const initialState: KeyedPastAuctionsState = {
  past: new Map<string, PastAuctionsState>(),
};

export interface Keyed<T> {
  id: string;
  value: T;
}

export const upsertPastAuctionsByKey = (state: KeyedPastAuctionsState, id: string): PastAuctionsState => {
  let s = state.past.get(id)
  if(s) {
    return s
  }
  var j = {
    pastAuctions: [],
  }
  state.past.set(id, j)
  return j
};

export const getPastAuctionsByKey = (state: KeyedPastAuctionsState, id: string): PastAuctionsState | undefined => {
  return state.past.get(id)
};

const reduxSafePastAuctions = (data: any): AuctionState[] => {
  const auctions = data.auctions as any[];
  if (auctions.length < 0) return [];
  const pastAuctions: AuctionState[] = auctions.map(auction => {
    return {
      activeAuction: {
        amount: BigNumber.from(auction.amount).toJSON(),
        bidder: auction.bidder ? auction.bidder.id : '',
        startTime: BigNumber.from(auction.startTime).toJSON(),
        endTime: BigNumber.from(auction.endTime).toJSON(),
        nounId: BigNumber.from(auction.id).toJSON(),
        settled: false,
      },
      bids: auction.bids.map((bid: any) => {
        return {
          nounId: BigNumber.from(auction.id).toJSON(),
          sender: bid.bidder.id,
          value: BigNumber.from(bid.amount).toJSON(),
          extended: false,
          transactionHash: bid.id,
          timestamp: BigNumber.from(bid.blockTimestamp).toJSON(),
        };
      }),
    };
  });
  return pastAuctions;
};

const pastAuctionsSlice = createSlice({
  name: 'pastAuctions',
  initialState: initialState,
  reducers: {
    addPastAuctions: (state, action: PayloadAction<Keyed<any>>) => {
      let s = upsertPastAuctionsByKey(state, action.payload.id)
      s.pastAuctions = reduxSafePastAuctions(action.payload.value);
    },
  },
});

export const { addPastAuctions } = pastAuctionsSlice.actions;

export default pastAuctionsSlice.reducer;
