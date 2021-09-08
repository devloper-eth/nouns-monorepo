import React from 'react';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';

const PageConfetti = () => {
  const { width, height } = useWindowSize();

  return <Confetti width={width} height={height} numberOfPieces={50} gravity={0.01} />;
};

export default PageConfetti;
