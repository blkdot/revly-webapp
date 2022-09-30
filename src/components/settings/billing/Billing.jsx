import React, { useState } from 'react';
import { Add } from '@mui/icons-material';

import './Billing.scss';

import smallLogo from '../../../assets/images/small-logo.png';

import ButtonKit from '../../../kits/button/ButtonKit';

import AddPaymentForm from '../../forms/addPaymentForm/AddPaymentForm';
import Invoice from './invoice/Invoice';
import PaymentMethod from './paymentMethod/PaymentMethod';
import Info from './info/Info';
import AddAddressForm from '../../forms/addAddressForm/AddAddressForm';

const Billing = () => {
  const [inputValue, setInputValue] = useState({
    cardName: '',
    cardNumber: '',
    cardExpire: '',
    cardCvv: '',
    name: '',
    address: '',
    phone: '',
  });
  const [showAddForm, setShowAddForm] = useState({ card: false, address: false });
  const [infos, setInfos] = useState([]);

  const resetAddress = () => {
    setInputValue({ ...inputValue, name: '', address: '', phone: '' });
  };

  const handleInputChange = (e) =>
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });

  const addMethod = (field) => setShowAddForm({ ...showAddForm, [field]: !showAddForm[field] });

  const onSaveAddress = () => {
    if (!inputValue.name || !inputValue.address || !inputValue.phone) {
      return;
    }
    setInfos([
      ...infos,
      { name: inputValue.name, address: inputValue.address, phone: inputValue.phone },
    ]);
    setShowAddForm({ ...showAddForm, address: false });
    resetAddress();
  };

  const onAddressDelete = (i) => {
    const arr = [...infos];
    arr.splice(i, 1);
    setInfos(arr);
  };

  return (
    <div className="billing">
      <div className="billing__plan __card">
        <p className="billing__card-title">Your plan</p>
        <p className="billing__card-subtitle">
          Proin ut tellus elit nunc, vel, lacinia consectetur condimentum id. Cursus magna massa
          vivamus risus.{' '}
        </p>
        <div className="billing__plan__flex">
          <div className="__block">
            <div className="__img-block">
              <img src={smallLogo} alt="logo" />
            </div>
            <p className="__text">Premium Plan</p>
          </div>
          <div className="billing__plan__flex__btn">
            <ButtonKit variant="outlined">Cancel Plan</ButtonKit>
            <ButtonKit variant="contained">Upgrade Plan</ButtonKit>
          </div>
        </div>
      </div>
      <div className="billing__invoice __card">
        <div className="__flex">
          <div>
            <p className="billing__card-title">Invoice History</p>
            <p className="billing__card-subtitle">
              Proin ut tellus elit nunc, vel, lacinia consectetur condimentum id. Cursus magna massa
              vivamus risus.
            </p>
          </div>
          <div className="__btn">
            <ButtonKit variant="contained">All invoices</ButtonKit>
          </div>
        </div>
        <Invoice date="8/16/13" amount="28.9 $" />
        <Invoice date="8/16/13" amount="28.9 $" />
        <Invoice date="8/16/13" amount="28.9 $" />
      </div>
      <div className="billing__payment __card">
        <p className="billing__card-title"> your payment methods</p>
        <p className="billing__card-subtitle">
          Proin ut tellus elit nunc, vel, lacinia consectetur condimentum id. Cursus magna massa
          vivamus risus.{' '}
        </p>
        <div className="billing__payment__flex">
          <PaymentMethod type="mastercard" cvv="0000 0000 0000 0000" />
          <PaymentMethod type="visa" cvv="0000 0000 0000 0000" />
          <ButtonKit
            className="__btn-add"
            onClick={() => addMethod('card')}
            startIcon={<Add fontSize="large" />}>
            Add New Card
          </ButtonKit>
        </div>
        <AddPaymentForm
          visible={showAddForm.card}
          handleInputChange={handleInputChange}
          onCancel={() => {
            setShowAddForm({ ...showAddForm, card: false });
          }}
        />
      </div>
      <div className="billing__info __card">
        <p className="billing__card-title">Your billing Information</p>
        <p className="billing__card-subtitle">
          Proin ut tellus elit nunc, vel, lacinia consectetur condimentum id. Cursus magna massa
          vivamus risus.{' '}
        </p>
        <div className="__info-block">
          {infos.map((v, i) => (
            <Info
              onDelete={() => onAddressDelete(i)}
              key={`${i * 1}`}
              name={v.name}
              address={v.address}
              phone={v.phone}
            />
          ))}
        </div>
        <ButtonKit
          style={{ marginTop: 8 }}
          className="__btn-add"
          onClick={() => addMethod('address')}
          startIcon={<Add />}>
          Add New Address
        </ButtonKit>
        <AddAddressForm
          nameValue={inputValue.name}
          phoneValue={inputValue.phone}
          addressValue={inputValue.address}
          visible={showAddForm.address}
          handleInputChange={handleInputChange}
          onCancel={() => {
            setShowAddForm({ ...showAddForm, address: false });
            resetAddress();
          }}
          onSaveChange={onSaveAddress}
        />
      </div>
    </div>
  );
};

export default Billing;
