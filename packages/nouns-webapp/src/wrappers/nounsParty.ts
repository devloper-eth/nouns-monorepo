import { useContractCall } from '@usedapp/core';
import { BigNumber as EthersBN, utils } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import config from '../config';

const abi = new utils.Interface('[  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "address",        "name": "previousAdmin",        "type": "address"      },      {        "indexed": false,        "internalType": "address",        "name": "newAdmin",        "type": "address"      }    ],    "name": "AdminChanged",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": true,        "internalType": "address",        "name": "beacon",        "type": "address"      }    ],    "name": "BeaconUpgraded",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "bool",        "name": "allow",        "type": "bool"      }    ],    "name": "LogAllowBid",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": true,        "internalType": "uint256",        "name": "nounId",        "type": "uint256"      },      {        "indexed": false,        "internalType": "uint256",        "name": "amount",        "type": "uint256"      },      {        "indexed": false,        "internalType": "address",        "name": "sender",        "type": "address"      }    ],    "name": "LogBid",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "uint256",        "name": "bidIncrease",        "type": "uint256"      }    ],    "name": "LogBidIncrease",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "address",        "name": "sender",        "type": "address"      },      {        "indexed": false,        "internalType": "uint256",        "name": "nounId",        "type": "uint256"      },      {        "indexed": false,        "internalType": "address",        "name": "fracTokenVaultAddress",        "type": "address"      },      {        "indexed": false,        "internalType": "uint256",        "name": "tokens",        "type": "uint256"      }    ],    "name": "LogClaim",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "address",        "name": "sender",        "type": "address"      },      {        "indexed": false,        "internalType": "uint256",        "name": "amount",        "type": "uint256"      }    ],    "name": "LogDeposit",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": true,        "internalType": "uint256",        "name": "nounId",        "type": "uint256"      },      {        "indexed": false,        "internalType": "uint256",        "name": "supply",        "type": "uint256"      },      {        "indexed": false,        "internalType": "uint256",        "name": "fee",        "type": "uint256"      }    ],    "name": "LogFractionalize",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "uint256",        "name": "bidIncrease",        "type": "uint256"      }    ],    "name": "LogNounsAuctionHouseBidIncrease",    "type": "event"  },  {    "anonymous": false,    "inputs": [],    "name": "LogPause",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "uint256",        "name": "fee",        "type": "uint256"      }    ],    "name": "LogSetNounsPartyFee",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "uint256",        "name": "nounId",        "type": "uint256"      }    ],    "name": "LogSettleLost",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "uint256",        "name": "nounId",        "type": "uint256"      }    ],    "name": "LogSettleWon",    "type": "event"  },  {    "anonymous": false,    "inputs": [],    "name": "LogUnpause",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "address",        "name": "sender",        "type": "address"      },      {        "indexed": false,        "internalType": "uint256",        "name": "amount",        "type": "uint256"      }    ],    "name": "LogWithdraw",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": true,        "internalType": "address",        "name": "previousOwner",        "type": "address"      },      {        "indexed": true,        "internalType": "address",        "name": "newOwner",        "type": "address"      }    ],    "name": "OwnershipTransferred",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "address",        "name": "account",        "type": "address"      }    ],    "name": "Paused",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": false,        "internalType": "address",        "name": "account",        "type": "address"      }    ],    "name": "Unpaused",    "type": "event"  },  {    "anonymous": false,    "inputs": [      {        "indexed": true,        "internalType": "address",        "name": "implementation",        "type": "address"      }    ],    "name": "Upgraded",    "type": "event"  },  {    "inputs": [],    "name": "activeAuction",    "outputs": [      {        "internalType": "bool",        "name": "",        "type": "bool"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "allowBid",    "outputs": [      {        "internalType": "bool",        "name": "",        "type": "bool"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "auctionIsHot",    "outputs": [      {        "internalType": "bool",        "name": "",        "type": "bool"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "availableDepositBalance",    "outputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "bid",    "outputs": [],    "stateMutability": "payable",    "type": "function"  },  {    "inputs": [],    "name": "bidIncrease",    "outputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "calcBidAmount",    "outputs": [      {        "internalType": "uint256",        "name": "_nounId",        "type": "uint256"      },      {        "internalType": "uint256",        "name": "_amount",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "claim",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "",        "type": "address"      },      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "name": "claims",    "outputs": [      {        "internalType": "uint256",        "name": "nounId",        "type": "uint256"      },      {        "internalType": "uint256",        "name": "tokens",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "_address",        "type": "address"      }    ],    "name": "claimsCount",    "outputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "currentBidAmount",    "outputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "currentNounId",    "outputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "deposit",    "outputs": [],    "stateMutability": "payable",    "type": "function"  },  {    "inputs": [],    "name": "depositBalance",    "outputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "deposits",    "outputs": [      {        "components": [          {            "internalType": "address",            "name": "owner",            "type": "address"          },          {            "internalType": "uint256",            "name": "amount",            "type": "uint256"          }        ],        "internalType": "struct INounsParty.Deposit[]",        "name": "",        "type": "tuple[]"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "name": "fracTokenVaults",    "outputs": [      {        "internalType": "address",        "name": "",        "type": "address"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "fracVaultFactory",    "outputs": [      {        "internalType": "contract IFracVaultFactory",        "name": "",        "type": "address"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "fracVaultFactoryAddress",    "outputs": [      {        "internalType": "address",        "name": "",        "type": "address"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "_nounsAuctionHouseAddress",        "type": "address"      },      {        "internalType": "address",        "name": "_nounsTokenAddress",        "type": "address"      },      {        "internalType": "address",        "name": "_fracVaultFactoryAddress",        "type": "address"      },      {        "internalType": "address",        "name": "_nounsPartyCuratorAddress",        "type": "address"      },      {        "internalType": "address",        "name": "_nounsPartyTreasuryAddress",        "type": "address"      },      {        "internalType": "uint256",        "name": "_nounsAuctionHouseBidIncrease",        "type": "uint256"      }    ],    "name": "initialize",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [],    "name": "isReadyToSettle",    "outputs": [      {        "internalType": "bool",        "name": "",        "type": "bool"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "nonRevertingCalcBidAmount",    "outputs": [      {        "internalType": "uint256",        "name": "_nounId",        "type": "uint256"      },      {        "internalType": "uint256",        "name": "_amount",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [      {        "internalType": "uint256",        "name": "_nounId",        "type": "uint256"      }    ],    "name": "nounStatus",    "outputs": [      {        "internalType": "enum INounsParty.NounStatus",        "name": "",        "type": "uint8"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "nounsAuctionHouse",    "outputs": [      {        "internalType": "contract INounsAuctionHouse",        "name": "",        "type": "address"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "nounsAuctionHouseBidIncrease",    "outputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "nounsPartyCuratorAddress",    "outputs": [      {        "internalType": "address",        "name": "",        "type": "address"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "nounsPartyFee",    "outputs": [      {        "internalType": "uint256",        "name": "",        "type": "uint256"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "nounsPartyTreasuryAddress",    "outputs": [      {        "internalType": "address",        "name": "",        "type": "address"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "nounsToken",    "outputs": [      {        "internalType": "contract INounsToken",        "name": "",        "type": "address"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "nounsTokenAddress",    "outputs": [      {        "internalType": "address",        "name": "",        "type": "address"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "owner",    "outputs": [      {        "internalType": "address",        "name": "",        "type": "address"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "pause",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [],    "name": "paused",    "outputs": [      {        "internalType": "bool",        "name": "",        "type": "bool"      }    ],    "stateMutability": "view",    "type": "function"  },  {    "inputs": [],    "name": "renounceOwnership",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "bool",        "name": "_allow",        "type": "bool"      }    ],    "name": "setAllowBid",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "uint256",        "name": "_bidIncrease",        "type": "uint256"      }    ],    "name": "setBidIncrease",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "_address",        "type": "address"      }    ],    "name": "setFracVaultFactoryAddress",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "_address",        "type": "address"      }    ],    "name": "setNounsAuctionHouseAddress",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "uint256",        "name": "_bidIncrease",        "type": "uint256"      }    ],    "name": "setNounsAuctionHouseBidIncrease",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "_address",        "type": "address"      }    ],    "name": "setNounsPartyCuratorAddress",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "uint256",        "name": "_fee",        "type": "uint256"      }    ],    "name": "setNounsPartyFee",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "_address",        "type": "address"      }    ],    "name": "setNounsPartyTreasuryAddress",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "_address",        "type": "address"      }    ],    "name": "setNounsTokenAddress",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [],    "name": "settle",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "newOwner",        "type": "address"      }    ],    "name": "transferOwnership",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [],    "name": "unpause",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "newImplementation",        "type": "address"      }    ],    "name": "upgradeTo",    "outputs": [],    "stateMutability": "nonpayable",    "type": "function"  },  {    "inputs": [      {        "internalType": "address",        "name": "newImplementation",        "type": "address"      },      {        "internalType": "bytes",        "name": "data",        "type": "bytes"      }    ],    "name": "upgradeToAndCall",    "outputs": [],    "stateMutability": "payable",    "type": "function"  },  {    "inputs": [],    "name": "withdraw",    "outputs": [],    "stateMutability": "payable",    "type": "function"  },  {    "stateMutability": "payable",    "type": "receive"  }]')


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

export const useNounsPartyAvailableDepositBalance = () => {
	const availableDepositBalance = useContractCall({
		abi,
		address: config.nounsPartyAddress,
		method: "availableDepositBalance",
		args: [],
	})
	if (!availableDepositBalance) {
		return EthersBN.from(0);
	}
	return availableDepositBalance[0];
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
		return [];
	}
	return deposits[0];
}

export const useNounsPartyActiveAuction = () => {
	const b = useContractCall<[EthersBN]>({
		abi,
		address: config.nounsPartyAddress,
		method: "activeAuction",
		args: [],
	})
	if (!b) {
		return false;
	};
	return b[0];
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

export const useNounsPartyNounStatus = (nounId: EthersBN) => {
	const status = useContractCall(nounId && nounId.gt(0) && {
		abi,
		address: config.nounsPartyAddress,
		method: 'nounStatus',
		args: [nounId],
	});

	switch (Number(status)) {
		case 0:
			return "won";
		case 1:
			return "burned";
		case 2:
			return "minted";
		case 3:
			return "lost";
		case 4:
			return "notfound";
		default:
			return "notfound";
	}
};

export const useNounsPartyCalcBidAmount = () => {
	const bidAmount = useContractCall({
		abi,
		address: config.nounsPartyAddress,
		method: "nonRevertingCalcBidAmount",
		args: [],
	})
	if (!bidAmount) {
		return EthersBN.from(0);
	}
	return bidAmount[1];
}

export const useNounsPartyCurrentNounId = () => {
	const nounId = useContractCall({
		abi,
		address: config.nounsPartyAddress,
		method: "currentNounId",
		args: [],
	})

	if (!nounId) {
		return 0;
	}
	return nounId[0].toNumber();
}

export const useNounsPartyCurrentBidAmount = () => {
	const amount = useContractCall({
		abi,
		address: config.nounsPartyAddress,
		method: "currentBidAmount",
		args: [],
	})
	if (!amount) {
		return EthersBN.from(0);
	}
	return amount[0];
}

export const useNounsPartyClaimsCount = (address: string | null | undefined) => {
	const count = useContractCall(address && {
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
	const claim = useContractCall(address && index >= 0 && {
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

export const useFracTokenVaults = (nounId: EthersBN) => {
	const vault = useContractCall(nounId && nounId.gt(0) && {
		abi,
		address: config.nounsPartyAddress,
		method: 'fracTokenVaults',
		args: [nounId],
	});

	if (!vault) {
		return "";
	}

	if (vault[0] === "0x0000000000000000000000000000000000000000") {
		return "";
	}

	return vault[0];
};