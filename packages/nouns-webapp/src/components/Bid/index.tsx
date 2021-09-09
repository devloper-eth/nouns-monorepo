import {
  Auction,
  auctionHouseContractFactory,
  AuctionHouseContractFunction,
  useAuction,
} from '../../wrappers/nounsAuction';
import config from '../../config';
import { connectContractToSigner, useEthers } from '@usedapp/core';
import { useContractFunction__fix } from '../../hooks/useContractFunction__fix';
import { useAppSelector } from '../../hooks';
import React, { useEffect, useState, useRef, ChangeEvent, useCallback } from 'react';
import { utils, BigNumber as EthersBN } from 'ethers';
import BigNumber from 'bignumber.js';
import classes from './Bid.module.css';
import { Spinner, InputGroup, FormControl, Button } from 'react-bootstrap';
import { useAuctionMinBidIncPercentage } from '../../wrappers/nounsAuction';
import { useAppDispatch } from '../../hooks';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import Modal from '../Modal';
import {
  nounsPartyContractFactory,
  NounsPartyContractFunction,
  useNounsPartyDepositBalance,
  useNounsPartyDeposits,
} from '../../wrappers/nounsParty';

const computeMinimumNextBid = (
  currentBid: BigNumber,
  minBidIncPercentage: BigNumber | undefined,
): BigNumber => {
  return !minBidIncPercentage
    ? new BigNumber(0)
    : currentBid.times(minBidIncPercentage.div(100).plus(1));
};

const minBidEth = (minBid: BigNumber): string => {
  if (minBid.isZero()) {
    return '0.01';
  }

  const eth = Number(utils.formatEther(EthersBN.from(minBid.toString())));
  const roundedEth = Math.ceil(eth * 100) / 100;

  return roundedEth.toString();
};

const currentBid = (bidInputRef: React.RefObject<HTMLInputElement>) => {
  if (!bidInputRef.current || !bidInputRef.current.value) {
    return new BigNumber(0);
  }
  return new BigNumber(utils.parseEther(bidInputRef.current.value).toString());
};

const Bid: React.FC<{
  auction: Auction;
  auctionEnded: boolean;
  hidePlaceBidModalHandler: () => void;
}> = props => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const { library } = useEthers();
  const { auction, auctionEnded, hidePlaceBidModalHandler } = props;
  // const auctionHouseContract = auctionHouseContractFactory(config.auctionProxyAddress);
  const nounsPartyContract = nounsPartyContractFactory(config.nounsPartyAddress);

  const account = useAppSelector(state => state.account.activeAccount);

  const bidInputRef = useRef<HTMLInputElement>(null);

  const [bidInput, setBidInput] = useState('');
  
  const [bidButtonContent, setBidButtonContent] = useState({
    loading: false,
    content: 'Place Bid'
  });

  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);

  const minBidIncPercentage = useAuctionMinBidIncPercentage();
  const minBid = computeMinimumNextBid(
    auction && new BigNumber(auction.amount.toString()),
    minBidIncPercentage,
  );

  // const depositBalance = useNounsPartyDepositBalance();
  // const deposits = useNounsPartyDeposits();

  const { send: bid, state: bidState } = useContractFunction__fix(
    nounsPartyContract,
    NounsPartyContractFunction.bid,
  );
  // const { send: settleAuction, state: settleAuctionState } = useContractFunction__fix(
  //   auctionHouseContract,
  //   AuctionHouseContractFunction.settleCurrentAndCreateNewAuction,
  // );

  // const { send: deposit, state: depositState } = useContractFunction__fix(
  //   nounsPartyContract,
  //   NounsPartyContractFunction.deposit,
  // );

  const bidInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;

    // disable more than 2 digits after decimal point
    if (input.includes('.') && event.target.value.split('.')[1].length > 2) {
      return;
    }

    setBidInput(event.target.value);
  };

  const placeBidHandler = async () => {
    if (!auction || !bidInputRef.current || !bidInputRef.current.value) {
      return;
    }

    if (currentBid(bidInputRef).isLessThan(minBid)) {
      setModal({
        show: true,
        title: 'Insufficient bid amount 🤏',
        message: `Please place a bid higher than or equal to the minimum bid amount of ${minBidEth(
          minBid,
        )} ETH.`,
      });
      setBidInput(minBidEth(minBid));
      return;
    }

    const value = utils.parseEther(bidInputRef.current.value.toString());
    const contract = connectContractToSigner(nounsPartyContract, undefined, library);
    const gasLimit = await contract.estimateGas.bid(auction.nounId, value);
    bid(auction.nounId, value, {
      gasLimit: gasLimit.add(10000), // A 10,000 gas pad is used to avoid 'Out of gas' errors
    });
  };

  // const settleAuctionHandler = () => {
  //   settleAuction();
  // };

  const clearBidInput = () => {
    if (bidInputRef.current) {
      bidInputRef.current.value = '';
    }
  };

  // successful bid using redux store state
  useEffect(() => {
    if (!account) return;

    // tx state is mining
    const isMiningUserTx = bidState.status === 'Mining';
    // allows user to rebid against themselves so long as it is not the same tx
    const isCorrectTx = currentBid(bidInputRef).isEqualTo(new BigNumber(auction.amount.toString()));
    
    if (isMiningUserTx && auction.bidder === account && isCorrectTx) {
      bidState.status = 'Success';
      setModal({
        title: 'Success',
        message: `Bid was placed successfully!`,
        show: true,
      });
      setBidButtonContent({ loading: false, content: 'Place Bid' });
      clearBidInput();
    }
  }, [auction, bidState, account, setModal]);

  // placing bid transaction state hook
  useEffect(() => {
    switch (!auctionEnded && bidState.status) {
      case 'None':
        setBidButtonContent({
          loading: false,
          content: 'Place Bid',
        });
        break;
      case 'Mining':
        setBidButtonContent({ loading: true, content: '' });
        break;
      case 'Fail':
        setModal({
          title: 'Transaction Failed',
          message: bidState.errorMessage ? bidState.errorMessage : 'Place bid failed. Please try again.',
          show: true,
        });
        setBidButtonContent({ loading: false, content: 'Place Bid' });
        break;
      case 'Exception':
        setModal({
          title: 'Error',
          message: bidState.errorMessage ? bidState.errorMessage : 'Place bid failed. Please try again.',
          show: true,
        });
        setBidButtonContent({ loading: false, content: 'Place Bid' });
        break;
    }
  }, [bidState, auctionEnded, setModal]);

  // // settle auction transaction state hook
  // useEffect(() => {
  //   switch (auctionEnded && settleAuctionState.status) {
  //     case 'None':
  //       setBidButtonContent({
  //         loading: false,
  //         content: 'Settle Auction',
  //       });
  //       break;
  //     case 'Mining':
  //       setBidButtonContent({ loading: true, content: '' });
  //       break;
  //     case 'Success':
  //       setModal({
  //         title: 'Success',
  //         message: `Settled auction successfully!`,
  //         show: true,
  //       });
  //       setBidButtonContent({ loading: false, content: 'Settle Auction' });
  //       break;
  //     case 'Fail':
  //       setModal({
  //         title: 'Transaction Failed',
  //         message: settleAuctionState.errorMessage
  //           ? settleAuctionState.errorMessage
  //           : 'Please try again.',
  //         show: true,
  //       });
  //       setBidButtonContent({ loading: false, content: 'Settle Auction' });
  //       break;
  //     case 'Exception':
  //       setModal({
  //         title: 'Error',
  //         message: settleAuctionState.errorMessage
  //           ? settleAuctionState.errorMessage
  //           : 'Please try again.',
  //         show: true,
  //       });
  //       setBidButtonContent({ loading: false, content: 'Settle Auction' });
  //       break;
  //   }
  // }, [settleAuctionState, auctionEnded, setModal]);

  if (!auction) return null;

  // || settleAuctionState.status === 'Mining'  if settling is included in this component
  const isDisabled =
  bidState.status === 'Mining' || !activeAccount;

    const placeBidContent = (
      <>
      {!auctionEnded && (
        <p className={classes.minBidCopy}>{`Minimum bid: ${minBidEth(minBid)} ETH`}</p>
      )}

      <InputGroup>
        {!auctionEnded && (
          <>
            <FormControl
              aria-label="Example text with button addon"
              aria-describedby="basic-addon1"
              className={classes.bidInput}
              type="number"
              min="0"
              onChange={bidInputHandler}
              ref={bidInputRef}
              value={bidInput}
            />
            <span className={classes.customPlaceholder}>ETH</span>
          </>
        )}
        <Button
          className={classes.placePartyBidButton}
          onClick={placeBidHandler}
          disabled={isDisabled || auctionEnded}
        >
          {bidButtonContent.loading ? <Spinner animation="border" /> : null}
          {bidButtonContent.content}
        </Button>
      </InputGroup>
    </>
    )
  return (
    <Modal title="Place Bid" content={placeBidContent} onDismiss={hidePlaceBidModalHandler} />
  );
};
export default Bid;
