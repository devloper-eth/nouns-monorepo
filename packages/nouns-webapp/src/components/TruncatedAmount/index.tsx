import BigNumber from 'bignumber.js';
import { utils } from 'ethers';
import React from 'react';
import classes from './TruncatedAmount.module.css';

const TruncatedAmount: React.FC<{ amount: BigNumber }> = props => {
  const { amount } = props;

  const eth = new BigNumber(utils.formatEther(amount.toString())).toFixed(2);
  return (
    <>
      <span className={classes.ethXiFont}>{`Ξ `}</span>
      {eth}
    </>
  );
};
export default TruncatedAmount;
