import React, { useState } from 'react';
import { Add, NavigateNext } from '@mui/icons-material';

import './Billing.scss';

import mastercard from '../../../assets/images/mastercard.svg';
import visa from '../../../assets/images/visa.svg';

import PaperKit from '../../../kits/paper/PaperKit';
import ButtonKit from '../../../kits/button/ButtonKit';

import AddPaymentForm from '../../forms/addPaymentForm/AddPaymentForm';
import Invoice from './invoice/Invoice';
import PaymentMethod from './paymentMethod/PaymentMethod';
import Info from './info/Info';

const Billing = () => {
  const { cardValue, setCardValue } = useState({
    cardName: '',
    cardNumber: '',
    cardExpire: '',
    cardCvv: '',
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleInputChange = (e) => setCardValue({ ...cardValue, [e.target.name]: e.target.value });

  const addPaymentMethod = () => setShowAddForm(!showAddForm);

  return (
    <div className="billing">
      <div className="billing__block-1">
        <PaperKit className="billing__plan">
          <div className="billing__plan__flex">
            <div>
              <p className="billing__card-title">YOUR PLAN</p>
              <p className="billing__plan__flex__text">Premium</p>
            </div>
            <div className="billing__plan__flex__btn">
              <ButtonKit sx={{ marginRight: 2 }} size="small" variant="outlined">
                Cancel Plan
              </ButtonKit>
              <ButtonKit
                className="billing__plan__flex__btn__upgrade"
                size="small"
                variant="outlined">
                Upgrade Plan
              </ButtonKit>
            </div>
          </div>
        </PaperKit>
        <PaperKit className="billing__payment">
          <p className="billing__card-title">PAYMENT METHOD</p>
          <div className="billing__payment__flex">
            <PaymentMethod type={mastercard} cvv="1234" />
            <PaymentMethod type={visa} cvv="1234" />
          </div>
          <ButtonKit onClick={addPaymentMethod} startIcon={<Add />}>
            Add New Card
          </ButtonKit>
          <AddPaymentForm
            visible={showAddForm}
            handleInputChange={handleInputChange}
            onCancel={() => setShowAddForm(false)}
          />
        </PaperKit>
        <PaperKit className="billing__info">
          <p className="billing__card-title">BILLING INFO</p>
          <Info name="Name" address="Address" phone="00000" />
          <Info name="Name" address="Address" phone="00000" />
          <ButtonKit startIcon={<Add />}>Add New Address</ButtonKit>
        </PaperKit>
      </div>
      <div className="billing__invoice">
        <p style={{ marginBottom: '2rem', fontWeight: '600' }}>Invoice History</p>
        <Invoice date="4 September 2022" amount="$28.9" />
        <Invoice date="4 September 2022" amount="$28.9" />
        <div className="billing__invoice__btn-next">
          <ButtonKit size="small" endIcon={<NavigateNext />}>
            All invoices
          </ButtonKit>
        </div>
      </div>
    </div>
  );
};

export default Billing;
