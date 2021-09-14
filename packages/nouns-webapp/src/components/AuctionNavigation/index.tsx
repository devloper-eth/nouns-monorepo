import React from 'react';
import classes from './AuctionNavigation.module.css';
import arrow from '../../assets/arrow.svg';

const AuctionNavigation: React.FC<{
  isFirstAuction: boolean;
  isLastAuction: boolean;
  onPrevAuctionClick: () => void;
  onNextAuctionClick: () => void;
}> = props => {
  const { isFirstAuction, isLastAuction, onPrevAuctionClick, onNextAuctionClick } = props;
  return (
    <>
      <button onClick={() => onPrevAuctionClick()} className={classes.leftArrow} disabled={isFirstAuction}>
        <img src={arrow} alt="left arrow"/>
      </button>
      <button onClick={() => onNextAuctionClick()} className={classes.rightArrow} disabled={isLastAuction}>
        <img src={arrow} alt="right arrow"/>
      </button>
    </>
  );
};
export default AuctionNavigation;
