import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Spinner, InputGroup, FormControl, Button, Row, Col } from 'react-bootstrap';
import Modal from '../Modal';
import { utils } from 'ethers';
import { connectContractToSigner, useEthers } from '@usedapp/core';
import config from '../../config';
import classes from './AddFundsModal.module.css';
import { nounsPartyContractFactory, NounsPartyContractFunction } from '../../wrappers/nounsParty';
import { useContractFunction__fix } from '../../hooks/useContractFunction__fix';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import { useAppDispatch, useAppSelector } from '../../hooks';

const AddFundsModal: React.FC<{ onDismiss: () => void; activeAccount: string | undefined }> =
  props => {
    const { onDismiss } = props;
    const [bidInput, setBidInput] = useState('');
    const [depositButtonContent, setDepositButtonContent] = useState({
      loading: false,
      content: 'Add funds to vault',
    });
    const [minimumBidErrorMessage, setMinimumBidErrorMessage] = useState(false);
    const activeAccount = useAppSelector(state => state.account.activeAccount);
    const { library } = useEthers();
    const nounsPartyContract = nounsPartyContractFactory(config.nounsPartyAddress);

    const dispatch = useAppDispatch();
    const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);

    const bidInputRef = useRef<HTMLInputElement>(null);

    const bidInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const input = event.target.value;

      // disable more than 2 digits after decimal point
      if (input.includes('.') && event.target.value.split('.')[1].length > 2) {
        return;
      }

      setBidInput(event.target.value);
    };

    const { send: deposit, state: depositState } = useContractFunction__fix(
      nounsPartyContract,
      NounsPartyContractFunction.deposit,
    );

    const placeBidHandler = async () => {
      setMinimumBidErrorMessage(false);
      if (!bidInputRef.current || !bidInputRef.current.value) {
        return;
      }

      // minimum deposit .1 eth
      if (Number(bidInputRef.current.value) < 0.1) {
        setMinimumBidErrorMessage(true);
        return;
      }

      setDepositButtonContent({ loading: true, content: 'Depositing eth...' });
      try {
        const value = utils.parseEther(bidInputRef.current.value.toString());
        const contract = connectContractToSigner(nounsPartyContract, undefined, library);
        const gasLimit = await contract.estimateGas.deposit({
          value,
        });
        deposit({
          value,
          gasLimit: gasLimit.add(10_000), // A 10,000 gas pad is used to avoid 'Out of gas' errors
        });
      } catch {
        onDismiss();
        setModal({
          title: 'Error',
          message: depositState.errorMessage
            ? depositState.errorMessage
            : 'Deposit failed. Please try again.',
          show: true,
        });
      }
    };

    const clearBidInput = () => {
      if (bidInputRef.current) {
        bidInputRef.current.value = '';
      }
    };

    // placing bid transaction state hook
    useEffect(() => {
      if (!activeAccount) return;
      switch (depositState.status) {
        case 'None':
          setDepositButtonContent({
            loading: false,
            content: 'Add funds to vault',
          });
          break;
        case 'Mining':
          setDepositButtonContent({ loading: true, content: 'Depositing eth...' });
          break;
        case 'Success':
          onDismiss();
          setModal({
            title: 'Success',
            message: `Funds deposited successfully!`,
            show: true,
          });
          setDepositButtonContent({ loading: false, content: 'Bid' });
          clearBidInput();
          break;
        case 'Fail':
          onDismiss();
          setModal({
            title: 'Transaction Failed',
            message: depositState.errorMessage ? depositState.errorMessage : 'Please try again.',
            show: true,
          });
          setDepositButtonContent({ loading: false, content: 'Add funds to vault' });
          break;
        case 'Exception':
          onDismiss();
          setModal({
            title: 'Error',
            message: depositState.errorMessage ? depositState.errorMessage : 'Please try again.',
            show: true,
          });
          setDepositButtonContent({ loading: false, content: 'Add funds to vault' });
          break;
      }
    }, [depositState, setModal, onDismiss, activeAccount]);

    const fundsModal = (
      <>
        <Row>
          <Col>
            <p
              className={
                minimumBidErrorMessage ? classes.minimumDepositErrorMessage : classes.minimumDeposit
              }
            >
              <strong>
                {minimumBidErrorMessage
                  ? `Please enter a minimum deposit of at least 0.1 ETH`
                  : ``}
              </strong>
            </p>
          </Col>
        </Row>
        <Row>
          <Col className={classes.inputContainer}>
            <InputGroup>
              <FormControl
                aria-label="Example text with button addon"
                aria-describedby="basic-addon1"
                className={classes.bidInput}
                type="number"
                min="0.1"
                step="0.1"
                placeholder=""
                onChange={bidInputHandler}
                ref={bidInputRef}
                value={bidInput}
              />
              <span className={classes.customPlaceholder}>ETH</span>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <p className={classes.infoText}>
              You will receive tokens proportional to the amount of your ETH used in the winning
              bid. If the party loses the auction, or if any of your ETH is in excess of the winning
              bid, you will be able to withdraw all unused funds from your contribution.
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            {' '}
            <Button className={classes.addFundsButton} onClick={placeBidHandler}>
              {depositButtonContent.loading ? <Spinner animation="border" size="sm" /> : null}
              &nbsp; {depositButtonContent.content}
            </Button>
          </Col>
        </Row>
      </>
    );

    return <Modal title="Add funds" content={fundsModal} onDismiss={onDismiss} />;
  };

export default AddFundsModal;
