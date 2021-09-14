import { Auction } from '../../wrappers/nounsAuction';
import config from '../../config';
import { BigNumber } from 'ethers';
import { connectContractToSigner, useEthers } from '@usedapp/core';
import { useContractFunction__fix } from '../../hooks/useContractFunction__fix';
import { useAppSelector } from '../../hooks';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import classes from './Bid.module.css';
import { Spinner, Button, Row, Col } from 'react-bootstrap';
import { useAppDispatch } from '../../hooks';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import Modal from '../Modal';
import {
  nounsPartyContractFactory,
  NounsPartyContractFunction,
  useNounsPartyDepositBalance,
  useNounsPartyMaxBid,
} from '../../wrappers/nounsParty';
import { formatEther } from '@ethersproject/units';

// const computeMinimumNextBid = (
//   currentBid: BigNumber,
//   minBidIncPercentage: BigNumber | undefined,
// ): BigNumber => {
//   return !minBidIncPercentage
//     ? new BigNumber(0)
//     : currentBid.times(minBidIncPercentage.div(100).plus(1));
// };

// const minBidEth = (minBid: BigNumber): string => {
//   if (minBid.isZero()) {
//     return '0.01';
//   }

//   const eth = Number(utils.formatEther(EthersBN.from(minBid.toString())));
//   const roundedEth = Math.ceil(eth * 100) / 100;

//   return roundedEth.toString();
// };

// const currentBid = (bidInputRef: React.RefObject<HTMLInputElement>) => {
//   if (!bidInputRef.current || !bidInputRef.current.value) {
//     return new BigNumber(0);
//   }
//   return new BigNumber(utils.parseEther(bidInputRef.current.value).toString());
// };

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

  // const [bidInput, setBidInput] = useState('');

  const [bidButtonContent, setBidButtonContent] = useState({
    loading: false,
    content: 'Submit Bid',
  });

  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);

  const maxBid = useNounsPartyMaxBid();

  // const minBidIncPercentage = useAuctionMinBidIncPercentage();
  // const minBid = computeMinimumNextBid(
  //   auction && new BigNumber(auction.amount.toString()),
  //   minBidIncPercentage,
  // );

  const depositBalance = useNounsPartyDepositBalance();
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

  // const bidInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
  //   const input = event.target.value;

  //   // disable more than 2 digits after decimal point
  //   if (input.includes('.') && event.target.value.split('.')[1].length > 2) {
  //     return;
  //   }

  //   setBidInput(event.target.value);
  // };

  const placeBidHandler = async () => {
    // if (!auction || !bidInputRef.current || !bidInputRef.current.value) {
    //   return;
    // }

    // if (currentBid(bidInputRef).isLessThan(minBid)) {
    //   setModal({
    //     show: true,
    //     title: 'Insufficient bid amount 🤏',
    //     message: `Please place a bid higher than or equal to the minimum bid amount of ${minBidEth(
    //       minBid,
    //     )} ETH.`,
    //   });
    //   setBidInput(minBidEth(minBid));
    //   return;
    // }

    const contract = connectContractToSigner(nounsPartyContract, undefined, library);
    let gasLimit = BigNumber.from(500000)
    try {
      gasLimit = await contract.estimateGas.bid();
      gasLimit.add(10000) // A 10,000 gas pad is used to avoid 'Out of gas' errors
    } catch(e) {
      console.log("Failed to guess gas.", e);
    }

    bid({
      gasLimit: gasLimit, 
    });
    setBidButtonContent({ loading: true, content: 'Placing bid...' });
  };

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
    // const isCorrectTx = currentBid(bidInputRef).isEqualTo(new BigNumber(auction.amount.toString()));

    if (isMiningUserTx) {
      // isCorrectTx
      bidState.status = 'Success';
      hidePlaceBidModalHandler();
      setModal({
        title: 'Success',
        message: `Bid was submitted successfully!`,
        show: true,
      });
      setBidButtonContent({ loading: false, content: 'Submit Bid' });
      clearBidInput();
    }
  }, [auction, bidState, account, setModal, hidePlaceBidModalHandler]);

  // placing bid transaction state hook
  useEffect(() => {
    switch (!auctionEnded && bidState.status) {
      case 'None':
        setBidButtonContent({
          loading: false,
          content: 'Submit bid',
        });
        break;
      case 'Mining':
        setBidButtonContent({ loading: true, content: 'Submitting bid...' });
        break;
      case 'Fail':
        hidePlaceBidModalHandler();
        setModal({
          title: 'Transaction Failed',
          message: bidState.errorMessage
            ? bidState.errorMessage
            : 'Submit bid failed. Please try again.',
          show: true,
        });
        setBidButtonContent({ loading: false, content: 'Submit bid' });
        break;
      case 'Exception':
        hidePlaceBidModalHandler();
        setModal({
          title: 'Error',
          message: bidState.errorMessage
            ? bidState.errorMessage
            : 'Submit bid failed. Please try again.',
          show: true,
        });
        setBidButtonContent({ loading: false, content: 'Submit bid' });
        break;
    }
  }, [bidState, auctionEnded, setModal, hidePlaceBidModalHandler]);

  const checkIfPartyLeadingBidder =
    auction &&
    auction.bidder &&
    auction.bidder.toLowerCase() === config.nounsPartyAddress.toLowerCase();

  if (!auction) return null;

  const isDisabled = bidState.status === 'Mining' || !activeAccount;

  const noPlaceBidContent = (
    <>
      <Row>
        <Col>
          <p className={classes.infoText}>
            Submitting a bid will place a bid on the nouns auction using the vault's funds. The bid will be 5% higher than the current highest bid.
          </p>
          <p className={classes.infoText}>
            The vault does not have enough funds. Please add funds to the vault to execute this bid. <strong>A bid requires {formatEther(maxBid)}&nbsp;ETH</strong>.
          </p>
        </Col>
      </Row>
    </>
  );

  const partyIsAlreadyWinning = <>The party is already the leading bidder.</>;

  const placeBidContent = (
    <>
      <Row>
        <Col>
          <p className={classes.infoText}>
            Submitting this bid will place a bid on the nouns auction using the vault's funds. The bid will be 7% higher than the current highest bid.
          </p>
          <p className={classes.infoText}>
            If the party goes on to win the auction, contributors can return after the auction to claim their tokens.
            Any unused funds can be withdrawn.
          </p>
          <p className={classes.infoText}>
            Bid amount: <strong>{formatEther(maxBid)}&nbsp;ETH</strong>
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            className={classes.placePartyBidButton}
            onClick={placeBidHandler}
            disabled={isDisabled || auctionEnded}
          >
            {bidButtonContent.loading ? <Spinner animation="border" size="sm" /> : null}
            &nbsp; {bidButtonContent.content}
          </Button>
        </Col>
      </Row>
    </>
  );
  return (
    <Modal
      title="Submit bid"
      content={
        depositBalance.gte(maxBid)
          ? checkIfPartyLeadingBidder
            ? partyIsAlreadyWinning
            : placeBidContent
          : noPlaceBidContent
      }
      onDismiss={hidePlaceBidModalHandler}
    />
  );
};
export default Bid;
