import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface OnDisplayAuctions {
   auctions: Map<string, OnDisplayAuctionState>;
   partyAuctions: Map<string, OnDisplayAuctionState>;
}

interface OnDisplayAuctionState {
  lastAuctionNounId: number | undefined;
  onDisplayAuctionNounId: number | undefined;
}

const initialState: OnDisplayAuctions = {
  auctions: new Map<string, OnDisplayAuctionState>(),
  partyAuctions: new Map<string, OnDisplayAuctionState>()
};

export interface Keyed<T> {
  id: string;
  value: T;
}

export const upsertOnDisplayByKey = (state: OnDisplayAuctions, id: string): OnDisplayAuctionState => {
  const st = id === "partynouns" ? state.partyAuctions : state.auctions;
  let s = st.get(id)
  if(s) {
    return s
  }
  var j = {
    lastAuctionNounId: undefined,
    onDisplayAuctionNounId: undefined,
  }
  st.set(id, j)
  return j
};

export const getOnDisplayByKey = (state: OnDisplayAuctions, id: string): OnDisplayAuctionState | undefined => {
  const st = id === "partynouns" ? state.partyAuctions : state.auctions;
  return st.get(id)
};

const onDisplayAuctions = createSlice({
  name: 'onDisplayAuctions',
  initialState: initialState,
  reducers: {
    setLastAuctionNounId: (state, action: PayloadAction<Keyed<number>>) => {
      upsertOnDisplayByKey(state, action.payload.id).lastAuctionNounId = action.payload.value
    },
    setOnDisplayAuctionNounId: (state, action: PayloadAction<Keyed<number>>) => {
      upsertOnDisplayByKey(state, action.payload.id).onDisplayAuctionNounId = action.payload.value
    },
    setPrevOnDisplayAuctionNounId: (state, action: PayloadAction<string>) => {
      let s = upsertOnDisplayByKey(state, action.payload)
      if (!s.onDisplayAuctionNounId) return;
      if (s.onDisplayAuctionNounId === 0) return;
      s.onDisplayAuctionNounId = s.onDisplayAuctionNounId - 1;
    },
    setNextOnDisplayAuctionNounId: (state, action: PayloadAction<string>) => {
      let s = upsertOnDisplayByKey(state, action.payload)
      if (s.onDisplayAuctionNounId === undefined) return;
      if (s.lastAuctionNounId === s.onDisplayAuctionNounId) return;
      s.onDisplayAuctionNounId = s.onDisplayAuctionNounId + 1;
    },
  },
});

export const {
  setLastAuctionNounId,
  setOnDisplayAuctionNounId,
  setPrevOnDisplayAuctionNounId,
  setNextOnDisplayAuctionNounId,
} = onDisplayAuctions.actions;

export default onDisplayAuctions.reducer;
