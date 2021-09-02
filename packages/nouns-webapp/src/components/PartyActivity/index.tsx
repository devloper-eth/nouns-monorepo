import React from 'react';
import PartyBid from '../PartyBid';
import PartyButtons from '../PartyButtons';
import PartyGuestList from '../PartyGuestList';

const PartyActivity = () => {
  return (
    <div>
      <PartyBid />
      <PartyButtons />
      <PartyGuestList />
    </div>
  );
};

export default PartyActivity;
