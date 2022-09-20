import React from 'react';

import { MoreVert } from '@mui/icons-material';

import './PaymentMethod.scss';

const PaymentMethod = (props) => {
  const { cvv, type } = props;

  return (
    <div className="payment-method">
      <div className="payment-method__text">
        <img src={type} className="payment-method__text__type" alt="card" />
        <p className="payment-method__text__cvv">**** **** **** {cvv}</p>
      </div>
      <button type="button" className="payment-method__btn">
        <MoreVert />
      </button>
    </div>
  );
};

export default PaymentMethod;
