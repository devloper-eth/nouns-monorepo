import { connectContractToSigner, useEthers } from '@usedapp/core';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { useContractFunction__fix } from '../../hooks/useContractFunction__fix';
import {
  nounsPartyContractFactory,
  NounsPartyContractFunction,
  useNounsPartyAuctionIsHot,
  useNounsPartyActiveAuction,
  useNounsPartyWithdrawableAmount,
} from '../../wrappers/nounsParty';
import config from '../../config';
import Modal from '../Modal';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import classes from './WithdrawModal.module.css';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { formatEther } from 'ethers/lib/utils';

const WithdrawModal: React.FC<{ hideWithdrawModalHandler: () => void }> = props => {
  // state
  const { hideWithdrawModalHandler } = props;
  const [withdrawButtonContent, setWithdrawButtonContent] = useState({
    loading: false,
    content: 'Withdraw funds',
  });

  const activeAccount = useAppSelector(state => state.account.activeAccount);

  // Redux
  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);

  // party contract
  const nounsPartyContract = nounsPartyContractFactory(config.nounsPartyAddress);
  const { library } = useEthers();
  const { send: withdraw, state: withdrawState } = useContractFunction__fix(
    nounsPartyContract,
    NounsPartyContractFunction.withdraw,
  );

  const nounsPartyActiveAuction = useNounsPartyActiveAuction();
  const auctionIsHot = useNounsPartyAuctionIsHot();
  const withdrawableAmount = useNounsPartyWithdrawableAmount(activeAccount);
  // const { account } = useEthers();

  // withdraw funds
  const withdrawFundsHandler = async () => {
    setWithdrawButtonContent({ loading: true, content: 'Withdrawing eth...' });

    try {
      const contract = connectContractToSigner(nounsPartyContract, undefined, library);
      const gasLimit = await contract.estimateGas.withdraw();
      withdraw({
        gasLimit: gasLimit.add(10_000),
      });
    } catch {
      hideWithdrawModalHandler();
      setModal({
        title: 'Error',
        message: withdrawState.errorMessage
          ? withdrawState.errorMessage
          : 'Withdraw failed. Please try again.',
        show: true,
      });
    }
  };

  // Withdrawing funds state hook
  useEffect(() => {
    switch (withdrawState.status) {
      case 'None':
        setWithdrawButtonContent({
          loading: false,
          content: 'Withdraw funds',
        });
        break;
      case 'Mining':
        setWithdrawButtonContent({ loading: true, content: 'Withdrawing eth...' });
        break;
      case 'Success':
        hideWithdrawModalHandler();
        setModal({
          title: 'Success',
          message: `Eth was withdrawn successfully!`,
          show: true,
        });
        setWithdrawButtonContent({ loading: false, content: 'Withdraw funds' });
        break;
      case 'Fail':
        hideWithdrawModalHandler();
        setModal({
          title: 'Transaction Failed',
          message: withdrawState.errorMessage
            ? withdrawState.errorMessage
            : 'Withdraw Failed. Please try again.',
          show: true,
        });
        setWithdrawButtonContent({ loading: false, content: 'Withdraw funds' });
        break;
      case 'Exception':
        hideWithdrawModalHandler();
        setModal({
          title: 'Error',
          message: withdrawState.errorMessage
            ? withdrawState.errorMessage
            : 'No funds to withdraw.',
          show: true,
        });
        setWithdrawButtonContent({ loading: false, content: 'Withdraw funds' });
        break;
    }
  }, [withdrawState, setModal, hideWithdrawModalHandler]);

  const withdrawDisabledContent = (
    <>
      <Row className={`justify-content-center ${classes.withdrawTextRow}`}>
        <Col>
          <p>
            Withdrawals are currently disabled,
            <br />
            because&nbsp;
            {auctionIsHot ? `the auction is about to end or just ended. ` : ''}
            {nounsPartyActiveAuction ? `some auctions still need to be settled.` : ''}
          </p>
        </Col>
      </Row>
    </>
  );

  const withdrawNoFundsContent = (
    <>
      <Row className={`justify-content-center ${classes.withdrawTextRow}`}>
        <Col>
          <p className={classes.confirmText}>You have no funds to withdraw.</p>
        </Col>
      </Row>
    </>
  );

  const withdrawFormContent = (
    <>
      <Row className={`justify-content-center ${classes.withdrawTextRow}`}>
        <Col>
          <p className={classes.infoText}>
            You can withdraw your funds. 
            This is an estimated amount and it might change if new bids are submitted before you withdraw.
          </p>
          <p className={classes.infoText}>
            Withdraw amount: <strong>{formatEther(withdrawableAmount)}&nbsp;ETH</strong>
          </p>
          <Button className={classes.withdrawFundsButton} onClick={withdrawFundsHandler}>
            {withdrawButtonContent.loading ? <Spinner animation="border" size="sm" /> : null}
            &nbsp; {withdrawButtonContent.content}
          </Button>
        </Col>
      </Row>
    </>
  );

  const withdrawContent = (
    <>
      {auctionIsHot
        ? withdrawDisabledContent
        : withdrawableAmount.gt(0)
          ? withdrawFormContent
          : withdrawNoFundsContent}
    </>
  );

  return (
    <Modal title="Withdraw Funds" content={withdrawContent} onDismiss={hideWithdrawModalHandler} />
  );
};

export default WithdrawModal;
