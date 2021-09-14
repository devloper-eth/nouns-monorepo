import { useContractCall } from '@usedapp/core';
import { BigNumber as EthersBN, utils } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import config from '../config';

const abi = new utils.Interface('[  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "address",        "name": "previousAdmin",        "type": "address"      },      {        "indexed": false,        "internalType": "address",        "name": "newAdmin",        "type": "address"      }    ],    "name": "AdminChanged",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": true,        "internalType": "address",        "name": "beacon",        "type": "address"      }    ],    "name": "BeaconUpgraded",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": true,        "internalType": "uint256",        "name": "nounId",        "type": "uint256"      },      {        "indexed": false,        "internalType": "uint256",        "name": "amount",        "type": "uint256"      },      {        "indexed": false,        "internalType": "address",        "name": "sender",        "type": "address"      }    ],    "name": "LogBid",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "uint256",        "name": "bidIncrease",        "type": "uint256"      }    ],    "name": "LogBidIncrease",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "address",        "name": "sender",        "type": "address"      },      {        "indexed": false,        "internalType": "uint256",        "name": "nounId",        "type": "uint256"      },      {        "indexed": false,        "internalType": "address",        "name": "fracTokenVaultAddress",        "type": "address"      },      {        "indexed": false,        "internalType": "uint256",        "name": "tokens",        "type": "uint256"      }    ],    "name": "LogClaim",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "address",        "name": "sender",        "type": "address"      },      {        "indexed": false,        "internalType": "uint256",        "name": "amount",        "type": "uint256"      }    ],    "name": "LogDeposit",    "type": "event"  },  {    "anonymous": false,    "inputs": [],    "name": "LogEmergencyPause",    "type": "event"  },  {    "anonymous": false,    "inputs": [],    "name": "LogEmergencyUnpause",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "uint256",        "name": "nounId",        "type": "uint256"      },      {        "indexed": false,        "internalType": "uint256",        "name": "pendingSettledCount",        "type": "uint256"      }    ],    "name": "LogEmergencyUpdatePendingSettled",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": true,        "internalType": "uint256",        "name": "nounId",        "type": "uint256"      },      {        "indexed": false,        "internalType": "uint256",        "name": "supply",        "type": "uint256"      },      {        "indexed": false,        "internalType": "uint256",        "name": "fee",        "type": "uint256"      }    ],    "name": "LogFractionalize",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "uint256",        "name": "fee",        "type": "uint256"      }    ],    "name": "LogSetNounsPartyFee",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "uint256",        "name": "nounId",        "type": "uint256"      }    ],    "name": "LogSettleLost",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "uint256",        "name": "nounId",        "type": "uint256"      }    ],    "name": "LogSettleWon",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "address",        "name": "sender",        "type": "address"      },      {        "indexed": false,        "internalType": "uint256",        "name": "amount",        "type": "uint256"      }    ],    "name": "LogWithdraw",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": true,        "internalType": "address",        "name": "previousOwner",        "type": "address"      },      {        "indexed": true,        "internalType": "address",        "name": "newOwner",        "type": "address"      }    ],    "name": "OwnershipTransferred",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "address",        "name": "account",        "type": "address"      }    ],    "name": "Paused",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "address",        "name": "account",        "type": "address"      }    ],    "name": "Unpaused",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": true,        "internalType": "address",        "name": "implementation",        "type": "address"      }    ],    "name": "Upgraded",    "type": "event"  },  {    "inputs": [],    "name": "auctionIsHot",    "outputs": [      {        "internalType": "bool",        "name": "",        "type": "bool"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "bid",    "outputs": [],    "stateMutability": "payable",    "type": "function"  },  {    "inputs": [],    "name": "bidIncrease",    "outputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "name": "bids",    "outputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "claim",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "",        "type": "address"      },      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "name": "claims",    "outputs": [      {        "internalType": "uint256",        "name": "nounId",        "type": "uint256"      },      {        "internalType": "uint256",        "name": "tokens",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "_address",        "type": "address"      }    ],    "name": "claimsCount",    "outputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "deposit",    "outputs": [],    "stateMutability": "payable",    "type": "function"  },  {    "inputs": [],    "name": "depositBalance",    "outputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "deposits",    "outputs": [      {        "components": [          {            "internalType": "address",            "name": "owner",            "type": "address"          },          {            "internalType": "uint256",            "name": "amount",            "type": "uint256"          }        ],        "internalType": "struct INounsParty.Deposit[]",        "name": "",        "type": "tuple[]"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "emergencyPause",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [],    "name": "emergencyUnpause",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "name": "fracTokenVaults",    "outputs": [      {        "internalType": "address",        "name": "",        "type": "address"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "fracVaultFactory",    "outputs": [      {        "internalType": "contract IFracVaultFactory",        "name": "",        "type": "address"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "fracVaultFactoryAddress",    "outputs": [      {        "internalType": "address",        "name": "",        "type": "address"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "_nounsAuctionHouseAddress",        "type": "address"      },      {        "internalType": "address",        "name": "_nounsTokenAddress",        "type": "address"      },      {        "internalType": "address",        "name": "_fracVaultFactoryAddress",        "type": "address"      },      {        "internalType": "address",        "name": "_nounsPartyCuratorAddress",        "type": "address"      },      {        "internalType": "address",        "name": "_nounsPartyTreasuryAddress",        "type": "address"      }    ],    "name": "initialize",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [],    "name": "maxBid",    "outputs": [      {        "internalType": "uint256",        "name": "_nounId",        "type": "uint256"      },      {        "internalType": "uint256",        "name": "_amount",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "nounsAuctionHouse",    "outputs": [      {        "internalType": "contract INounsAuctionHouse",        "name": "",        "type": "address"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "nounsPartyCuratorAddress",    "outputs": [      {        "internalType": "address",        "name": "",        "type": "address"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "nounsPartyFee",    "outputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "nounsPartyTreasuryAddress",    "outputs": [      {        "internalType": "address",        "name": "",        "type": "address"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "nounsToken",    "outputs": [      {        "internalType": "contract INounsToken",        "name": "",        "type": "address"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "nounsTokenAddress",    "outputs": [      {        "internalType": "address",        "name": "",        "type": "address"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "owner",    "outputs": [      {        "internalType": "address",        "name": "",        "type": "address"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "paused",    "outputs": [      {        "internalType": "bool",        "name": "",        "type": "bool"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "pendingSettledCount",    "outputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "renounceOwnership",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "uint256",        "name": "_bidIncrease",        "type": "uint256"      }    ],    "name": "setBidIncrease",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "_address",        "type": "address"      }    ],    "name": "setFracVaultFactoryAddress",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "_address",        "type": "address"      }    ],    "name": "setNounsAuctionHouseAddress",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "_address",        "type": "address"      }    ],    "name": "setNounsPartyCuratorAddress",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "uint256",        "name": "_fee",        "type": "uint256"      }    ],    "name": "setNounsPartyFee",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "_address",        "type": "address"      }    ],    "name": "setNounsPartyTreasuryAddress",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "_address",        "type": "address"      }    ],    "name": "setNounsTokenAddress",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [],    "name": "settle",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [],    "name": "settleNext",    "outputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "name": "settledList",    "outputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "settledListHead",    "outputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "settledListTail",    "outputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "newOwner",        "type": "address"      }    ],    "name": "transferOwnership",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "newImplementation",        "type": "address"      }    ],    "name": "upgradeTo",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "newImplementation",        "type": "address"      },      {        "internalType": "bytes",        "name": "data",        "type": "bytes"      }    ],    "name": "upgradeToAndCall",    "outputs": [],    "stateMutability": "payable",    "type": "function"  },  {    "inputs": [],    "name": "withdraw",    "outputs": [],    "stateMutability": "payable",    "type": "function"  },  {    "stateMutability": "payable",    "type": "receive"  }]');





export const nounsPartyContractFactory = (nounsPartyProxyAddress: string) =>
	new Contract(nounsPartyProxyAddress, abi);

export enum NounsPartyContractFunction {
	deposit = "deposit",
	bid = "bid",
	settle = "settle",
	claim = "claim",
	withdraw = "withdraw",
	depositBalance = "depositBalance",
	deposits = "deposits",
	claimsCount = "claimsCount",
	auctionIsHot = "auctionIsHot",
	claims = "claims",
	pendingSettled = "pendingSettled"
}

export interface Deposit {
	owner: string;
	amount: EthersBN;
}

export interface TokenClaim {
	fracTokenVault: string;
	nounId: EthersBN;
	tokens: EthersBN;
}

export const useNounsPartyDepositBalance = () => {
	const depositBalance = useContractCall({
		abi,
		address: config.nounsPartyAddress,
		method: "depositBalance",
		args: [],
	})
	if (!depositBalance) {
		return EthersBN.from(0);
	}
	return depositBalance[0];
}

export const useNounsPartyDeposits = () => {
	const deposits = useContractCall<[Deposit[]]>({
		abi,
		address: config.nounsPartyAddress,
		method: "deposits",
		args: [],
	})
	if (!deposits) {
		return
	}
	return deposits[0];
}

export const useNounsPartyPendingSettledCount = () => {
	const count = useContractCall<[EthersBN]>({
		abi,
		address: config.nounsPartyAddress,
		method: "pendingSettledCount",
		args: [],
	})
	if (!count) {
		return EthersBN.from(0)
	};
	return count[0];
}

export const useNounsPartyAuctionIsHot = () => {
	const hot = useContractCall<[Boolean]>({
		abi,
		address: config.nounsPartyAddress,
		method: "auctionIsHot",
		args: [],
	})
	if (!hot) {
		return false;
	}
	return hot[0];
}

export const useNounsPartyMaxBid = () => {
	const maxBid = useContractCall<[EthersBN]>({
		abi,
		address: config.nounsPartyAddress,
		method: "maxBid",
		args: [],
	})
	if (!maxBid) {
		return EthersBN.from(0);
	}
	return maxBid[0];
}

export const useNounsPartyClaimsCount = (address: string | null | undefined) => {
	const count  = useContractCall({
		abi,
		address: config.nounsPartyAddress,
		method: "claimsCount",
		args: [address],
	})
	if (!count) {
		return 0;
	}
	return count[0].toNumber();
}

export const useNounsPartyClaims = (address: string | null | undefined, index: Number) => {
	const claim = useContractCall({
		abi,
		address: config.nounsPartyAddress,
		method: "claims",
		args: [address, index]
	})
	if (!claim) {
		return null;
	}
	return claim;
}
