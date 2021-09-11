import React, { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '../../hooks';
import { useContractFunction__fix } from '../../hooks/useContractFunction__fix';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import {
  nounsPartyContractFactory,
  NounsPartyContractFunction,
  useNounsPartyClaimsCount,
} from '../../wrappers/nounsParty';
import config from '../../config';
import classes from './ClaimTokensModal.module.css';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import Modal from '../Modal';
// import BigNumber from 'bignumber.js';
// import { formatEther } from 'ethers/lib/utils';
// import { connectContractToSigner, useEthers } from '@usedapp/core';

const ClaimTokensModal: React.FC<{
  hideClaimTokensModalHandler: () => void;
  activeAccount: string;
}> = props => {
  //state
  const { hideClaimTokensModalHandler, activeAccount } = props;
  // const [tokenClaimsCount, setTokenClaimsCount] = useState('');
  const [claimTokensButtonContent, setClaimTokensButtonContent] = useState({
    loading: false,
    content: 'Claim Tokens',
  });

  // Redux
  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);

  // party contract
  const nounsPartyContract = nounsPartyContractFactory(config.nounsPartyAddress);

  const currentClaimsCount = useNounsPartyClaimsCount();

  console.log('token claims response: ', currentClaimsCount ? currentClaimsCount.toNumber() : 'none');


  const { send: claims} = useContractFunction__fix(
    nounsPartyContract,
    NounsPartyContractFunction.claims,
  );

  const { send: claim, state: claimState } = useContractFunction__fix(
    nounsPartyContract,
    NounsPartyContractFunction.claim,
  );

  const fetchTokenClaimsCount = useCallback(async () => {
    let claimCounter = 0;

    if (currentClaimsCount && currentClaimsCount > claimCounter) {
      while (currentClaimsCount > claimCounter) {
        // const tokenClaimsResponse = await contract.estimateGas.claims(activeAccount, claimCounter);
        claims(activeAccount, claimCounter);

        // TO DO - store response
        claimCounter++;
      }
    }
  }, [currentClaimsCount, activeAccount, claims]);

  useEffect(() => {
    fetchTokenClaimsCount();
  }, [fetchTokenClaimsCount]);

  // claim tokens
  const claimTokensHandler = async () => {
    setClaimTokensButtonContent({
      loading: true,
      content: 'Claiming Tokens...',
    })
    try {
      claim();
      setClaimTokensButtonContent({
        loading: false,
        content: 'Claim Tokens',
      })
    } catch {
      hideClaimTokensModalHandler();
      setModal({
        title: 'Error',
        message: claimState.errorMessage
          ? claimState.errorMessage
          : 'Claim failed. Please try again.',
        show: true,
      });
    }
  };

  /* <p>{test ? new BigNumber(test) : 'no claims'}</p> */

  const claimTokensContent = (
    <>
      <Row className="justify-content-center">
        <Col>
          <p className={classes.confirmText}>Ready to claim your tokens?</p>
        </Col>
      </Row>
      <Col>
        <Button className={classes.claimTokensButton} onClick={claimTokensHandler}>
          {claimTokensButtonContent.loading ? <Spinner animation="border" /> : null}
          {claimTokensButtonContent.content}
        </Button>
      </Col>
    </>
  );

  return (
    <Modal
      title="Claim Tokens"
      content={claimTokensContent}
      onDismiss={hideClaimTokensModalHandler}
    />
  );
};

export default ClaimTokensModal;
