import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChainId, DAppProvider } from '@usedapp/core';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import account from './state/slices/account';
import application from './state/slices/application';
import logs from './state/slices/logs';
import auction, {
  reduxSafeAuction,
  reduxSafeNewAuction,
  reduxSafeBid,
  setActiveAuction,
  setAuctionExtended,
  setAuctionSettled,
  setFullAuction,
} from './state/slices/auction';
import onDisplayAuction, {
  Keyed,
  setLastAuctionNounId,
  setOnDisplayAuctionNounId,
  getOnDisplayByKey,
} from './state/slices/onDisplayAuction';
import pastAuctions, {
  addPastAuctions
} from './state/slices/pastAuctions';
import { ApolloProvider, useQuery } from '@apollo/client';
import { clientFactory, latestAuctionsQuery } from './wrappers/subgraph';
import { useEffect } from 'react';
import LogsUpdater from './state/updaters/logs';
import config, { CHAIN_ID, LOCAL_CHAIN_ID } from './config';
import { WebSocketProvider } from '@ethersproject/providers';
import { BigNumber, BigNumberish, Contract } from 'ethers';
import { NounsAuctionHouseABI } from '@nouns/contracts';
import { default as NounsPartyAuctionHouseABI } from './contracts/NounsPartyAuctionHouse.json';
import dotenv from 'dotenv';
import { useAppDispatch, useAppSelector } from './hooks';
import { appendBid } from './state/slices/auction';
import { Auction as IAuction } from './wrappers/nounsAuction';
import { ConnectedRouter, connectRouter } from 'connected-react-router';
import { createBrowserHistory, History } from 'history';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { nounPath } from './utils/history';
import { push } from 'connected-react-router';
import { enableMapSet } from 'immer'

enableMapSet()
dotenv.config();

export const history = createBrowserHistory();

const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    account,
    application,
    logs,
    auction,
    pastAuctions,
    onDisplayAuction,
  });

export default function configureStore(preloadedState: any) {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    composeWithDevTools(
      applyMiddleware(
        routerMiddleware(history), // for dispatching history actions
        // ... other middlewares ...
      ),
    ),
  );

  return store;
}

const store = configureStore({});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// prettier-ignore
const useDappConfig = {
  readOnlyChainId: CHAIN_ID,
  readOnlyUrls: {
    [ChainId.Rinkeby]: process.env.REACT_APP_RINKEBY_JSONRPC || `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`,
    [ChainId.Mainnet]: process.env.REACT_APP_MAINNET_JSONRPC || `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`,
    [LOCAL_CHAIN_ID]: "http://localhost:8545"
  },
};

const client = clientFactory(config.subgraphApiUri);

const Updaters = () => {
  return (
    <>
      <LogsUpdater />
    </>
  );
};

const BLOCKS_PER_DAY = 6_500;

const ChainSubscriber: React.FC<{id: string, address: string, abi: any}> = (props) => {
  const { id: id, address: address, abi: abi } = props;
  const dispatch = useAppDispatch();

  const loadState = async () => {
    const wsProvider = new WebSocketProvider(config.wsRpcUri);
    const auctionContract = new Contract(
      address, 
      abi,
      wsProvider,
    );

    const bidFilter = auctionContract.filters.AuctionBid();
    const extendedFilter = auctionContract.filters.AuctionExtended();
    const createdFilter = auctionContract.filters.AuctionCreated();
    const settledFilter = auctionContract.filters.AuctionSettled();
    const processBidFilter = async (
      nounId: BigNumberish,
      sender: string,
      value: BigNumberish,
      extended: boolean,
      event: any,
    ) => {
      const timestamp = (await event.getBlock()).timestamp;
      const transactionHash = event.transactionHash;
      dispatch(
        appendBid({id: id, value: reduxSafeBid({ nounId, sender, value, extended, transactionHash, timestamp })}),
      );
    };
    const processAuctionCreated = (
      nounId: BigNumberish,
      startTime: BigNumberish,
      endTime: BigNumberish,
    ) => {
      if(id === "partynoun") {
        console.log("PartyNoun Auction Created:", nounId) // TODO remove me
      }
      dispatch(
        setActiveAuction({id: id, value: reduxSafeNewAuction({ nounId, startTime, endTime, settled: false })}),
      );
      // TODO: Handle history
      const nounIdNumber = BigNumber.from(nounId).toNumber();
      dispatch(push(nounPath(nounIdNumber)));

      let k: Keyed<number> = {
        id: id,
        value: nounIdNumber
      };

      dispatch(setOnDisplayAuctionNounId(k));
      dispatch(setLastAuctionNounId(k));
    };
    const processAuctionExtended = (nounId: BigNumberish, endTime: BigNumberish) => {
      dispatch(setAuctionExtended({id: id, value: { nounId, endTime }}));
    };
    const processAuctionSettled = (nounId: BigNumberish, winner: string, amount: BigNumberish) => {
      dispatch(setAuctionSettled({id: id, value: { nounId, amount, winner }}));
    };

    // Fetch the current auction
    const currentAuction: IAuction = await auctionContract.auction();
    console.log("currentAuction", currentAuction) // TODO remove me
    dispatch(setFullAuction({id: id, value: reduxSafeAuction(currentAuction)}));
    let k: Keyed<number> = {
      id: id,
      value: currentAuction.nounId.toNumber()
    };
    dispatch(setLastAuctionNounId(k));

    // Fetch the previous 24hours of  bids
    const previousBids = await auctionContract.queryFilter(bidFilter, 0 - BLOCKS_PER_DAY);
    for (let event of previousBids) {
      if (event.args === undefined) return;
      //@ts-ignore
      processBidFilter(...event.args, event);
    }

    auctionContract.on(bidFilter, processBidFilter);
    auctionContract.on(createdFilter, processAuctionCreated);
    auctionContract.on(extendedFilter, processAuctionExtended);
    auctionContract.on(settledFilter, processAuctionSettled);
  };
  loadState();

  return <></>;
};

const PastAuctions: React.FC<{ id: string; }> = (props) => {
  const { id: id } = props
  const latestAuctionId = useAppSelector(state => getOnDisplayByKey(state.onDisplayAuction, id)?.lastAuctionNounId);
  const { data } = useQuery(latestAuctionsQuery(latestAuctionId));
  const dispatch = useAppDispatch();

  useEffect(() => {
    data && dispatch(addPastAuctions({id: id, value: data}));
  }, [data, latestAuctionId, dispatch]);

  return <></>;
};

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <ChainSubscriber id="noun" address={config.auctionProxyAddress} abi={NounsAuctionHouseABI} />
      <ChainSubscriber id="partynoun" address={config.partyAuctionProxyAddress} abi={NounsPartyAuctionHouseABI} />
      <React.StrictMode>
        <Web3ReactProvider
          getLibrary={
            (provider, connector) => new Web3Provider(provider) // this will vary according to whether you use e.g. ethers or web3.js
          }
        >
          <ApolloProvider client={client}>
            { /*TODO: Add past auctions for party nouns */ }
            <PastAuctions id='noun'/>
            <DAppProvider config={useDappConfig}>
              <App />
              <Updaters />
            </DAppProvider>
          </ApolloProvider>
        </Web3ReactProvider>
      </React.StrictMode>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
