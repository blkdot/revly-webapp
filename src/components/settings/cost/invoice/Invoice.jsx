import React from 'react';
import CostIcon from '../../../../assets/icons/CostIcon';

import restaurantExample from '../../../../assets/images/restaurant-example.png';

import ButtonKit from '../../../../kits/button/ButtonKit';

const Invoice = (props) => {
  const { restaurant, cost, setInvoice, invoice, index } = props;
  const deleteCost = () => {
    invoice.splice(index, 1);
    setInvoice([...invoice]);
  };
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
          Cost: <span>{cost}</span>
        </p>
      </div>
      <ButtonKit color="error" onClick={deleteCost} variant="outlined">
        Delete
      </ButtonKit>
    </div>
  );
};

export default Invoice;
