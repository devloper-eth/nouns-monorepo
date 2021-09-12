import { connectContractToSigner, useEthers } from '@usedapp/core';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useContractFunction__fix } from '../../hooks/useContractFunction__fix';
import { nounsPartyContractFactory, NounsPartyContractFunction } from '../../wrappers/nounsParty';
import config from '../../config';
import classes from './SettleAuction.module.css';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Auction } from '../../wrappers/nounsAuction';
// import Modal from '../Modal';

const SettleAuction: React.FC<{ auction: Auction }> = props => {
  // state
  const { auction } = props;

  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const [settleAuctionButtonContent, setSettleAuctionButtonContent] = useState({
    loading: false,
    content: 'Settle Auction',
  });

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
    // TODO must be current's page nounId
    if (auction && auction.nounId) {
      try {
        const contract = connectContractToSigner(nounsPartyContract, undefined, library);
        const gasLimit = await contract.estimateGas.settle(454);
        settle(454, { gasLimit: gasLimit.add(15000000) });
      } catch {
        // hideSettleAuctionHandler();
        setModal({
          title: 'Error',
          message: settleState.errorMessage
            ? settleState.errorMessage
            : 'Settle auction failed. Please try again.',
          show: true,
        });
      }
    }
  };

  useEffect(() => {
    if (!activeAccount) return;

    // tx state is mining
    const isMiningUserTx = settleState.status === 'Mining';
    // allows user to rebid against themselves so long as it is not the same tx
    // const isCorrectTx = currentBid(bidInputRef).isEqualTo(new BigNumber(auction.amount.toString()));

    if (isMiningUserTx) {
      // isCorrectTx
      settleState.status = 'Success';
      // hideSettleAuctionHandler();
      setModal({
        title: 'Success',
        message: `The auction has been settled.`,
        show: true,
      });
      setSettleAuctionButtonContent({ loading: false, content: 'Settle auction' });
    }
  }, [settleState, activeAccount, setModal]);

  // const settleContent = (
  //   <>
  //     <Row className="justify-content-center">
  //       <Col>
  //         <p className={classes.confirmText}>Are you ready to settle the auction?</p>
  //       </Col>
  //     </Row>

  //     <Col>
  //       <Button className={classes.settleAuctionButton} onClick={() => settleAuction()}>
  //         {settleAuctionButtonContent.loading ? <Spinner animation="border" /> : null}
  //         {settleAuctionButtonContent.content}
  //       </Button>
  //     </Col>
  //   </>
  // );

  return (
    <Button className={classes.settleAuctionButton} onClick={() => settleAuction()}>
      {settleAuctionButtonContent.loading ? <Spinner animation="border" /> : null}
      {settleAuctionButtonContent.content}
    </Button>
  );
};

export default SettleAuction;
