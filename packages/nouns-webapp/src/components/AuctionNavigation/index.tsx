import React from 'react';
import classes from './AuctionNavigation.module.css';
import leftArrow from '../../assets/left-arrow.png';
import rightArrow from '../../assets/right-arrow.png';

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
        <img src={leftArrow} alt="left arrow"/>
      </button>
      <button onClick={() => onNextAuctionClick()} className={classes.rightArrow} disabled={isLastAuction}>
        <img src={rightArrow} alt="right arrow"/>
      </button>
    </>
  );
};
export default AuctionNavigation;
