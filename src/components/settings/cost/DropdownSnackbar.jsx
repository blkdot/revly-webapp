import React, { useState } from 'react';

import ButtonKit from '../../../kits/button/ButtonKit';
import RestaurantDropdown from '../../restaurantDropdown/RestaurantDropdown.suspended';
import useDate from '../../../hooks/useDate';
import CompetitionDropdown from '../../competitionDropdown/CompetitionDropdown';

const DropdownSnackbar = () => {
  const { vendors } = useDate();
  const [procent, setProcent] = useState('');
  return (
    <div className="invoice snackbar">
      <div className="snackbar-wrapper">
        <RestaurantDropdown chainObj={vendors.chainObj} />
        <CompetitionDropdown
          rows={['1%', '2%']}
          setRow={setProcent}
          select={procent}
          title="Select your Cost %"
          className="snackbar-procent"
        />
      </div>
      <ButtonKit className="snackbar-btn" variant="contained">
        Add
      </ButtonKit>
    </div>
  );
};

export default DropdownSnackbar;
