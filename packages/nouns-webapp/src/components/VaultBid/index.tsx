import { Auction } from '../../wrappers/nounsAuction';
import config from '../../config';
import { BigNumber } from 'ethers';
import { connectContractToSigner, useEthers } from '@usedapp/core';
import { useContractFunction__fix } from '../../hooks/useContractFunction__fix';
import { useAppSelector } from '../../hooks';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import classes from './VaultBid.module.css';
import { Spinner, Button, Row, Col } from 'react-bootstrap';
import { useAppDispatch } from '../../hooks';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import Modal from '../Modal';
import {
  nounsPartyContractFactory,
  NounsPartyContractFunction,
  useNounsPartyCalcBidAmount,
} from '../../wrappers/nounsParty';
import { formatEther } from '@ethersproject/units';


const VaultBid: React.FC<{
  auction: Auction;
  auctionEnded: boolean;
  hidePlaceBidModalHandler: () => void;
}> = props => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const { library } = useEthers();
  const { auction, auctionEnded, hidePlaceBidModalHandler } = props;
  const nounsPartyContract = nounsPartyContractFactory(config.nounsPartyAddress);
  const bidInputRef = useRef<HTMLInputElement>(null);

  const [bidButtonContent, setBidButtonContent] = useState({
    loading: false,
    content: 'Submit Bid',
  });

  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);

  const bidAmount = useNounsPartyCalcBidAmount();
  const { send: bid, state: bidState } = useContractFunction__fix(
    nounsPartyContract,
    NounsPartyContractFunction.bid,
  );

  const placeBidHandler = async () => {
    const contract = connectContractToSigner(nounsPartyContract, undefined, library);
    let gasLimit = BigNumber.from(500000);
    try {
      gasLimit = await contract.estimateGas.bid();
      gasLimit.add(100000);
    } catch (e) {
      console.error('Failed to guess gas.', e);
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

  // placing bid transaction state hook
  useEffect(() => {
    if (!activeAccount) return;
    switch (!auctionEnded && bidState.status) {
      case 'None':
        setBidButtonContent({
          loading: false,
          content: 'Submit bid',
        });
        break;
      case 'Success':
        hidePlaceBidModalHandler();
        setModal({
          title: 'Success',
          message: `Bid was submitted successfully!`,
          show: true,
        });
        setBidButtonContent({ loading: false, content: 'Submit Bid' });
        clearBidInput();
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
            ? 'The bid was already submitted.'
            : 'Submit bid failed. Please try again.',
          show: true,
        });
        setBidButtonContent({ loading: false, content: 'Submit bid' });
        break;
    }
  }, [bidState, auctionEnded, setModal, hidePlaceBidModalHandler, activeAccount]);

  if (!auction) return null;

  const isDisabled = bidState.status === 'Mining' || !activeAccount;

  const noPlaceBidContent = (
    <>
      <Row>
        <Col>
          <p className={classes.infoText}>
            Submitting a bid will place a bid on the nouns auction using the vault's funds. The bid
            will be 5% higher than the current highest bid.
          </p>
          <p className={classes.infoText}>
            The vault does not have enough funds. Please add funds to the vault to execute this bid.{' '}
            <strong>A bid requires {formatEther(bidAmount)}&nbsp;ETH</strong>.
          </p>
        </Col>
      </Row>
    </>
  );

  const placeBidContent = (
    <>
      <Row>
        <Col>
          <p className={classes.infoText}>
            Submitting this bid will place a bid on the nouns auction using the vault's funds. The
            bid will be 5% higher than the current highest bid.
          </p>
          <p className={classes.infoText}>
            If the party goes on to win the auction, contributors can return after the auction to
            claim their tokens. Any unused funds can be withdrawn.
          </p>
          <p className={classes.infoText}>
            Bid amount: <strong>{formatEther(bidAmount)}&nbsp;ETH</strong>
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            className={classes.placePartyBidButton}
            onClick={placeBidHandler}
            disabled={isDisabled || auctionEnded || !bidAmount}
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
      content={bidAmount.gte(0) ? placeBidContent : noPlaceBidContent}
      onDismiss={hidePlaceBidModalHandler}
    />
  );
};

export default VaultBid;