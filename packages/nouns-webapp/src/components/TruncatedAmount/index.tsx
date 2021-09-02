import BigNumber from 'bignumber.js';
import { utils } from 'ethers';
import React from 'react';

const TruncatedAmount: React.FC<{ amount: BigNumber }> = props => {
  const { amount } = props;

  const eth = new BigNumber(utils.formatEther(amount.toString())).toFixed(2);
  return (
    <>
      {`${eth} ETH`}
      {/* OLD STYLING - FLAGGED FOR REMOVAL */}
      {/* Ξ {`${eth}`} */}
    </>
  );
};
export default TruncatedAmount;
