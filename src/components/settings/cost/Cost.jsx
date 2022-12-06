import React from 'react';

import './Cost.scss';
import DropdownSnackbar from './DropdownSnackbar';
import Invoice from './invoice/Invoice';

const Cost = () => (
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
      <DropdownSnackbar />
      <Invoice restaurant="Kathryn Murphy" cost={10} />
      <Invoice restaurant="Kathryn Murphy" cost={10} />
      <Invoice restaurant="Kathryn Murphy" cost={10} />
    </div>
  </div>
);

export default Cost;
