import { useContractCall } from '@usedapp/core';
import { BigNumber as EthersBN, utils } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import config from '../config';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

const abi = new utils.Interface('[  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "address",        "name": "previousAdmin",        "type": "address"      },      {        "indexed": false,        "internalType": "address",        "name": "newAdmin",        "type": "address"      }    ],    "name": "AdminChanged",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": true,        "internalType": "address",        "name": "beacon",        "type": "address"      }    ],    "name": "BeaconUpgraded",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "uint256",        "name": "averageBid",        "type": "uint256"      }    ],    "name": "LogAverageBid",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": true,        "internalType": "uint256",        "name": "nounId",        "type": "uint256"      },      {        "indexed": false,        "internalType": "uint256",        "name": "amount",        "type": "uint256"      }    ],    "name": "LogBid",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "uint256",        "name": "bidIncrease",        "type": "uint256"      }    ],    "name": "LogBidIncrease",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "address",        "name": "sender",        "type": "address"      },      {        "indexed": false,        "internalType": "uint256",        "name": "nounId",        "type": "uint256"      },      {        "indexed": false,        "internalType": "address",        "name": "fracTokenVaultAddress",        "type": "address"      },      {        "indexed": false,        "internalType": "uint256",        "name": "tokens",        "type": "uint256"      }    ],    "name": "LogClaim",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "address",        "name": "sender",        "type": "address"      },      {        "indexed": false,        "internalType": "uint256",        "name": "amount",        "type": "uint256"      }    ],    "name": "LogDeposit",    "type": "event"  },  {    "anonymous": false,    "inputs": [],    "name": "LogEmergencyPause",    "type": "event"  },  {    "anonymous": false,    "inputs": [],    "name": "LogEmergencyUnpause",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "uint256",        "name": "nounId",        "type": "uint256"      },      {        "indexed": false,        "internalType": "uint256",        "name": "pendingSettledCount",        "type": "uint256"      }    ],    "name": "LogEmergencyUpdatePendingSettled",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": true,        "internalType": "uint256",        "name": "nounId",        "type": "uint256"      },      {        "indexed": false,        "internalType": "uint256",        "name": "supply",        "type": "uint256"      },      {        "indexed": false,        "internalType": "uint256",        "name": "fee",        "type": "uint256"      }    ],    "name": "LogFractionalize",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "uint256",        "name": "fee",        "type": "uint256"      }    ],    "name": "LogSetNounsPartyFee",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "uint256",        "name": "nounId",        "type": "uint256"      }    ],    "name": "LogSettleLost",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "uint256",        "name": "nounId",        "type": "uint256"      }    ],    "name": "LogSettleWon",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "address",        "name": "sender",        "type": "address"      },      {        "indexed": false,        "internalType": "uint256",        "name": "amount",        "type": "uint256"      }    ],    "name": "LogWithdraw",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": true,        "internalType": "address",        "name": "previousOwner",        "type": "address"      },      {        "indexed": true,        "internalType": "address",        "name": "newOwner",        "type": "address"      }    ],    "name": "OwnershipTransferred",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "address",        "name": "account",        "type": "address"      }    ],    "name": "Paused",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "address",        "name": "account",        "type": "address"      }    ],    "name": "Unpaused",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": true,        "internalType": "address",        "name": "implementation",        "type": "address"      }    ],    "name": "Upgraded",    "type": "event"  },  {    "inputs": [],    "name": "auctionIsHot",    "outputs": [      {        "internalType": "bool",        "name": "",        "type": "bool"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "averageBid",    "outputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [      {        "internalType": "uint256",        "name": "_nounId",        "type": "uint256"      }    ],    "name": "bid",    "outputs": [],    "stateMutability": "payable",    "type": "function"  },  {    "inputs": [],    "name": "bidIncrease",    "outputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "name": "bids",    "outputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "claim",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "",        "type": "address"      },      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "name": "claims",    "outputs": [      {        "internalType": "uint256",        "name": "nounId",        "type": "uint256"      },      {        "internalType": "uint256",        "name": "tokens",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "claimsCount",    "outputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "deposit",    "outputs": [],    "stateMutability": "payable",    "type": "function"  },  {    "inputs": [],    "name": "depositBalance",    "outputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "deposits",    "outputs": [      {        "components": [          {            "internalType": "address",            "name": "owner",            "type": "address"          },          {            "internalType": "uint256",            "name": "amount",            "type": "uint256"          }        ],        "internalType": "struct INounsParty.Deposit[]",        "name": "",        "type": "tuple[]"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "emergencyPause",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [],    "name": "emergencyUnpause",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "uint256",        "name": "_nounId",        "type": "uint256"      },      {        "internalType": "uint256",        "name": "_pendingSettledCount",        "type": "uint256"      }    ],    "name": "emergencyUpdatePendingSettled",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "name": "fracTokenVaults",    "outputs": [      {        "internalType": "address",        "name": "",        "type": "address"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "fracVaultFactory",    "outputs": [      {        "internalType": "contract IFracVaultFactory",        "name": "",        "type": "address"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "fracVaultFactoryAddress",    "outputs": [      {        "internalType": "address",        "name": "",        "type": "address"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "_nounsAuctionHouseAddress",        "type": "address"      },      {        "internalType": "address",        "name": "_nounsTokenAddress",        "type": "address"      },      {        "internalType": "address",        "name": "_fracVaultFactoryAddress",        "type": "address"      },      {        "internalType": "address",        "name": "_nounsPartyCuratorAddress",        "type": "address"      },      {        "internalType": "address",        "name": "_nounsPartyTreasuryAddress",        "type": "address"      },      {        "internalType": "uint256",        "name": "_averageBid",        "type": "uint256"      }    ],    "name": "initialize",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [],    "name": "maxBid",    "outputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "nounsAuctionHouse",    "outputs": [      {        "internalType": "contract INounsAuctionHouse",        "name": "",        "type": "address"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "nounsPartyCuratorAddress",    "outputs": [      {        "internalType": "address",        "name": "",        "type": "address"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "nounsPartyFee",    "outputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "nounsPartyTreasuryAddress",    "outputs": [      {        "internalType": "address",        "name": "",        "type": "address"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "nounsToken",    "outputs": [      {        "internalType": "contract INounsToken",        "name": "",        "type": "address"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "nounsTokenAddress",    "outputs": [      {        "internalType": "address",        "name": "",        "type": "address"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "owner",    "outputs": [      {        "internalType": "address",        "name": "",        "type": "address"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "paused",    "outputs": [      {        "internalType": "bool",        "name": "",        "type": "bool"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "name": "pendingSettled",    "outputs": [      {        "internalType": "bool",        "name": "",        "type": "bool"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "pendingSettledCount",    "outputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "renounceOwnership",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "uint256",        "name": "_averageBid",        "type": "uint256"      }    ],    "name": "setAverageBid",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "uint256",        "name": "_bidIncrease",        "type": "uint256"      }    ],    "name": "setBidIncrease",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "_address",        "type": "address"      }    ],    "name": "setFracVaultFactoryAddress",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "_address",        "type": "address"      }    ],    "name": "setNounsAuctionHouseAddress",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "_address",        "type": "address"      }    ],    "name": "setNounsPartyCuratorAddress",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "uint256",        "name": "_fee",        "type": "uint256"      }    ],    "name": "setNounsPartyFee",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "_address",        "type": "address"      }    ],    "name": "setNounsPartyTreasuryAddress",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "_address",        "type": "address"      }    ],    "name": "setNounsTokenAddress",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "uint256",        "name": "_nounId",        "type": "uint256"      }    ],    "name": "settle",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "newOwner",        "type": "address"      }    ],    "name": "transferOwnership",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "newImplementation",        "type": "address"      }    ],    "name": "upgradeTo",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "newImplementation",        "type": "address"      },      {        "internalType": "bytes",        "name": "data",        "type": "bytes"      }    ],    "name": "upgradeToAndCall",    "outputs": [],    "stateMutability": "payable",    "type": "function"  },  {    "inputs": [],    "name": "withdraw",    "outputs": [],    "stateMutability": "payable",    "type": "function"  },  {    "stateMutability": "payable",    "type": "receive"  }]');


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
		return 0;
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
	if(!deposits){
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
	if(!count) {
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
	if(!maxBid) {
		return EthersBN.from(0);
	}
	return maxBid[0];
}

// interface INounsParty {
// 	struct Deposit {
// 		address owner;
// 		uint256 amount;
// 	}

// 	struct TokenClaim {
// 		address fracTokenVault;
// 		uint256 nounId;
// 		uint256 tokens;
// 	}
// 	event LogWithdraw(address sender, uint256 amount);

// 	event LogFractionalize(uint256 indexed nounId, uint256 supply, uint256 fee);

// 	event LogClaim(address sender, uint256 nounId, address fracTokenVaultAddress, uint256 tokens);

// 	event LogSettleWon(uint256 nounId);

// 	event LogSettleLost(uint256 nounId);

// 	event LogDeposit(address sender, uint256 amount);

// 	event LogBid(uint256 indexed nounId, uint256 amount);

// 	event LogSetNounsPartyFee(uint256 fee);

// 	event LogEmergencyUpdatePendingSettled(uint256 nounId, uint256 pendingSettledCount);

// 	event LogEmergencyPause();

// 	event LogEmergencyUnpause();

// 	function deposit() external payable;

// 	function bid(uint256 nounId, uint256 amount) external payable;

// 	function settle(uint256 nounId) external;

// 	function claim() external;

// 	function withdraw() external payable;

// 	function depositBalance() external view returns (uint256);

// 	function deposits() external view returns (Deposit[] memory);

// 	function claimsCount() external view returns (uint256);

// 	function auctionIsHot() external view returns (bool);

// 	function setNounsAuctionHouseAddress(address newAddress) external;

// 	function setNounsTokenAddress(address newAddress) external;

// 	function setFracVaultFactoryAddress(address newAddress) external;

// 	function setNounsPartyCuratorAddress(address newAddress) external;

// 	function setNounsPartyTreasuryAddress(address newAddress) external;

// 	function setNounsPartyFee(uint256 fee) external;

// 	function emergencyUpdatePendingSettled(uint256 nounId, uint256 pendingSettledCount) external;

// 	function emergencyPause() external;

// 	function emergencyUnpause() external;
// }
