import React from 'react';
import CostIcon from '../../../../assets/icons/CostIcon';

import restaurantExample from '../../../../assets/images/restaurant-example.png';

import ButtonKit from '../../../../kits/button/ButtonKit';

const Invoice = (props) => {
  const { restaurant, cost, setInvoice, invoice, index } = props;
  const deleteCost = () => {
    const clonedInvoice = [...invoice];
    clonedInvoice.splice(index, 1);
    setInvoice(clonedInvoice);
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
        <div style={{ marginRight: '40px' }} className="__flex">
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
    </div>
  );
};

export default Invoice;
