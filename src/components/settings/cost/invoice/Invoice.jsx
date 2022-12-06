import React from 'react';
import CostIcon from '../../../../assets/icons/CostIcon';

import restaurantExample from '../../../../assets/images/restaurant-example.png';

import ButtonKit from '../../../../kits/button/ButtonKit';

const Invoice = (props) => {
  const { restaurant, cost } = props;

  return (
    <div className="invoice cost">
      <div className="__flex">
        <img src={restaurantExample} alt="restaurant-example" />
        <p>
          Restaurant Name: <span>{restaurant}</span>
        </p>
      </div>
      <div className="__flex">
        <div className="__img-block">
          <CostIcon />
        </div>
        <p>
          Cost: <span>{cost}%</span>
        </p>
      </div>
      <ButtonKit disabled variant="outlined">
        Delete
      </ButtonKit>
    </div>
  );
};

export default Invoice;
