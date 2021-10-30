import { useContractCall } from '@usedapp/core';
import { BigNumber as EthersBN, utils } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import { NounsAuctionHouseABI } from '@nouns/contracts';
import config from '../config';
import BigNumber from 'bignumber.js';
import { default as NounsPartyAuctionHouseABI } from '../contracts/NounsPartyAuctionHouse.json';

export enum AuctionHouseContractFunction {
  auction = 'auction',
  duration = 'duration',
  minBidIncrementPercentage = 'minBidIncrementPercentage',
  nouns = 'nouns',
  createBid = 'createBid',
  settleCurrentAndCreateNewAuction = 'settleCurrentAndCreateNewAuction',
}

export interface Auction {
  amount: EthersBN;
  bidder: string;
  endTime: EthersBN;
  startTime: EthersBN;
  nounId: EthersBN;
  partyNounId?: EthersBN; // from PartyAuctionHouse
  settled: boolean;
  tokenURI?: string; // from PartyAuctionHouse
}

const abi = new utils.Interface(NounsAuctionHouseABI);

const partyAbi = new utils.Interface(NounsPartyAuctionHouseABI);

export const auctionHouseContractFactory = (auctionHouseProxyAddress: string) =>
  new Contract(auctionHouseProxyAddress, abi);

export const partyAuctionHouseContractFactory = (partyAuctionHouseProxyAddress: string) => {
  new Contract(partyAuctionHouseProxyAddress, partyAbi);
}

export const useAuction = (auctionHouseProxyAddress: string) => {
  const auction = useContractCall<Auction>({
    abi,
    address: auctionHouseProxyAddress,
    method: 'auction',
    args: [],
  });
  return auction as Auction;
};

export const usePartyAuction = (partyAuctionHouseProxyAddress: string) => {
  const auction = useContractCall<Auction>({
    partyAbi,
    address: partyAuctionHouseProxyAddress,
    method: 'auction',
    args: [],
  });
  return auction as Auction;
};

export const useAuctionMinBidIncPercentage = () => {
  const minBidIncrement = useContractCall({
    abi,
    address: config.auctionProxyAddress,
    method: 'minBidIncrementPercentage',
    args: [],
  });

  if (!minBidIncrement) {
    return;
  }

  return new BigNumber(minBidIncrement[0]);
};

export const usePartyAuctionMinBidIncPercentage = () => {
  const minBidIncrement = useContractCall({
    partyAbi,
    address: config.partyAuctionProxyAddress,
    method: 'minBidIncrementPercentage',
    args: [],
  });

  if (!minBidIncrement) {
    return;
  }

  return new BigNumber(minBidIncrement[0]);
};
