import { connectContractToSigner, useEthers } from '@usedapp/core';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { useContractFunction__fix } from '../../hooks/useContractFunction__fix';
import {
  nounsPartyContractFactory,
  NounsPartyContractFunction,
  useNounsPartyPendingSettledCount,
  useNounsPartySettleNext,
} from '../../wrappers/nounsParty';
import config from '../../config';
import classes from './SettleAuction.module.css';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Auction } from '../../wrappers/nounsAuction';
import Modal from '../Modal';

const SettleAuction: React.FC<{ auction: Auction; hideSettleAuctionHandler: () => void }> =
  props => {
    // state
    const { hideSettleAuctionHandler, auction } = props;

    const activeAccount = useAppSelector(state => state.account.activeAccount);
    const [settleAuctionButtonContent, setSettleAuctionButtonContent] = useState({
      loading: false,
      content: 'Settle Auction',
    });

    const pendingSettledCount = useNounsPartyPendingSettledCount();

    // Redux
    const dispatch = useAppDispatch();
    const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);

    // party contract
    const nounsPartyContract = nounsPartyContractFactory(config.nounsPartyAddress);
    const { library } = useEthers();
    const { send: settle, state: settleState } = useContractFunction__fix(
      nounsPartyContract,
      NounsPartyContractFunction.settle,
    );

    const settleAuction = async () => {
      if (auction && auction.nounId) {
        try {
          const contract = connectContractToSigner(nounsPartyContract, undefined, library);
          const gasLimit = await contract.estimateGas.settle();
          settle({ gasLimit: gasLimit.add(15000000) });
        } catch {
          hideSettleAuctionHandler();
          setModal({
            title: 'Error',
            message: settleState.errorMessage
              ? settleState.errorMessage
              : `The Nouns.wtf auction must be settled before the party can settle this auction. Please try again later.`,
            show: true,
          });
        }
      }
    };

    // placing bid transaction state hook
    useEffect(() => {
      if (!activeAccount) return;
      switch (settleState.status) {
        case 'None':
          setSettleAuctionButtonContent({
            loading: false,
            content: 'Settle Auction',
          });
          break;
        case 'Success':
          hideSettleAuctionHandler();
          setModal({
            title: 'Success',
            message: `Auction was settled successfully!`,
            show: true,
          });
          setSettleAuctionButtonContent({ loading: false, content: 'Settle Auction' });
          break;
        case 'Mining':
          setSettleAuctionButtonContent({ loading: true, content: 'Settling Auction...' });
          break;
        case 'Fail':
          hideSettleAuctionHandler();
          setModal({
            title: 'Transaction Failed',
            message: settleState.errorMessage
              ? settleState.errorMessage
              : 'Settle Auction failed. Please try again.',
            show: true,
          });
          setSettleAuctionButtonContent({ loading: false, content: 'Settle Auction' });
          break;
        case 'Exception':
          hideSettleAuctionHandler();
          setModal({
            title: 'Error',
            message: settleState.errorMessage
              ? settleState.errorMessage
              : 'Settle Auction failed. Please try again.',
            show: true,
          });
          setSettleAuctionButtonContent({ loading: false, content: 'Settle Auction' });
          break;
      }
    }, [settleState, setModal, activeAccount, hideSettleAuctionHandler]);

    const settleNext = useNounsPartySettleNext();

    const settleContent = pendingSettledCount.gt(0) ? (
      <>
        <Row className="justify-content-center">
          <Col>
            {settleNext ? (
              <p className={classes.confirmText}>
                Are you ready to settle the auction for Noun {settleNext.toNumber()}?
              </p>
            ) : (
              <p className={classes.confirmText}>Loading auction settle data...</p>
            )}
          </Col>
        </Row>

        <Col>
          <Button
            disabled={!settleNext}
            className={classes.settleAuctionButton}
            onClick={() => settleAuction()}
          >
            {settleAuctionButtonContent.loading ? <Spinner animation="border" size="sm" /> : null}
            &nbsp; {settleAuctionButtonContent.content}
          </Button>
        </Col>
      </>
    ) : (
      <Row className="justify-content-center">
        <Col>
          <p className={classes.confirmText}>There are currently no auctions to settle.</p>
        </Col>
      </Row>
    );

    return (
      <Modal title="Settle Auction" content={settleContent} onDismiss={hideSettleAuctionHandler} />
    );
  };

export default SettleAuction;
