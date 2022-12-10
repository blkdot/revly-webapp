import React from 'react';
import CostIcon from '../../../../assets/icons/CostIcon';

import restaurantExample from '../../../../assets/images/restaurant-example.png';

import ButtonKit from '../../../../kits/button/ButtonKit';

const Invoice = (props) => {
  const { restaurant, cost, onDelete } = props;

  return (
    <div className="invoice cost">
      <div className="__flex">
        <img src={restaurantExample} alt="restaurant-example" />
        <p
          style={{
            width: '20rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
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
        <ButtonKit color="error" onClick={onDelete} variant="outlined">
          Delete
        </ButtonKit>
      </div>
    </div>
  );
};

export default Invoice;
