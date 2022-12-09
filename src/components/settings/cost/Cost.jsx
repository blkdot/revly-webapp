import React, { useState } from 'react';

import './Cost.scss';
import DropdownSnackbar from './DropdownSnackbar';
import Invoice from './invoice/Invoice';

const Cost = () => {
  const [invoice, setInvoice] = useState([{ restaurant: 'Kathryn Murphy', cost: '10%', id: 1 }]);
  return (
    <div className="billing">
      <div className="billing__invoice __card">
        <div className="__flex">
          <div className="__head">
            <p className="billing__card-title">Your Cost Information</p>
            <p className="billing__card-subtitle">
              Proin ut tellus elit nunc, vel, lacinia consectetur condimentum id. Cursus magna massa
              vivamus risus.
            </p>
          </div>
        </div>
        <DropdownSnackbar setInvoice={setInvoice} invoice={invoice} />
        {invoice.map((obj, index) => (
          <Invoice
            key={obj.id}
            setInvoice={setInvoice}
            invoice={invoice}
            index={index}
            restaurant={obj.restaurant}
            cost={obj.cost}
          />
        ))}
      </div>
    </div>
  );
};

export default Cost;
