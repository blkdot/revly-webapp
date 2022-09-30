import React from 'react';

import './Invoice.scss';

import icinvoice from '../../../../assets/images/ic_invoice.png';

import ButtonKit from '../../../../kits/button/ButtonKit';

const Invoice = (props) => {
  const { date, amount } = props;

  return (
    <div className="invoice">
      <div className="__flex">
        <div className="__img-block">
          <img src={icinvoice} alt="invoice" />
        </div>
        <p>{date}</p>
      </div>
      <p>{amount}</p>
      <ButtonKit variant="contained">Download</ButtonKit>
    </div>
  );
};

export default Invoice;
