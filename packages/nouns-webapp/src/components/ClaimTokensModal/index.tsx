import React, { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '../../hooks';
import { useContractFunction__fix } from '../../hooks/useContractFunction__fix';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import {
  nounsPartyContractFactory,
  NounsPartyContractFunction,
  useNounsPartyClaims,
  useNounsPartyClaimsCount,
} from '../../wrappers/nounsParty';
import config from '../../config';
import classes from './ClaimTokensModal.module.css';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import Modal from '../Modal';
import { formatEther } from 'ethers/lib/utils';
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

  // active claims
  const currentClaimsCount = useNounsPartyClaimsCount(activeAccount);

  const { send: claim, state: claimState } = useContractFunction__fix(
    nounsPartyContract,
    NounsPartyContractFunction.claim,
  );

  // claim tokens
  const claimTokensHandler = async () => {
    try {
      claim();
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

  // claiming tokens transaction state hook
  useEffect(() => {
    switch (claimState.status) {
      case 'None':
        setClaimTokensButtonContent({
          loading: false,
          content: 'Claim tokens',
        });
        break;
      case 'Mining':
        setClaimTokensButtonContent({ loading: true, content: 'Claiming tokens...' });
        break;
      case 'Fail':
        hideClaimTokensModalHandler();
        setModal({
          title: 'Transaction Failed',
          message: claimState.errorMessage ? claimState.errorMessage : 'Please try again.',
          show: true,
        });
        setClaimTokensButtonContent({ loading: false, content: 'Claim tokens' });
        break;
      case 'Exception':
        hideClaimTokensModalHandler();
        setModal({
          title: 'Error',
          message: claimState.errorMessage ? claimState.errorMessage : 'Please try again.',
          show: true,
        });
        setClaimTokensButtonContent({ loading: false, content: 'Claim tokens' });
        break;
    }
  }, [claimState, setModal, hideClaimTokensModalHandler]);

  // successful claim
  useEffect(() => {
    if (!activeAccount) return;

    // tx state is mining
    const isMiningUserTx = claimState.status === 'Mining';

    if (isMiningUserTx) {
      claimState.status = 'Success';
      hideClaimTokensModalHandler();
      setModal({
        title: 'Success',
        message: `Tokens claimed successfully!`,
        show: true,
      });
      setClaimTokensButtonContent({ loading: false, content: 'Claim tokens' });
    }
  }, [claimState, activeAccount, setModal, hideClaimTokensModalHandler]);

  const claimTokensContent = (
    <>
      {activeAccount && currentClaimsCount && currentClaimsCount > 0 ? (
        <>
          {activeAccount && currentClaimsCount && currentClaimsCount > 0
            ? [...Array(currentClaimsCount)].map((e, i) => (
                <ClaimsComponent key={i} account={activeAccount} counter={i} />
              ))
            : null}

          <Col>
            <Button className={classes.claimTokensButton} onClick={claimTokensHandler}>
              {claimTokensButtonContent.loading ? <Spinner animation="border" size="sm" /> : null}
              &nbsp; {claimTokensButtonContent.content}
            </Button>
          </Col>
        </>
      ) : (
        <p>No tokens to claim</p>
      )}
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

const ClaimsComponent: React.FC<{
  account: string;
  counter: number;
}> = props => {
  const claimsResponse = useNounsPartyClaims(props.account, props.counter);

  return (
    <>
      <Row>
        <Col>
          <p className={classes.tokenRowText}>
            {claimsResponse ? `Noun ${claimsResponse[0]?.toString()}` : null}
          </p>
        </Col>
        <Col>
          <p className={classes.tokenRowText}>
            {claimsResponse ? `${formatEther(claimsResponse[1])} tokens` : null}
          </p>
        </Col>
      </Row>
    </>
  );
};
