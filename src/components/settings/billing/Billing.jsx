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
          <ButtonKit onClick={() => addMethod('card')} startIcon={<Add />}>
            Add New Card
          </ButtonKit>
          <AddPaymentForm
            visible={showAddForm.card}
            handleInputChange={handleInputChange}
            onCancel={() => {
              setShowAddForm({ ...showAddForm, card: false });
            }}
          />
        </PaperKit>
        <PaperKit className="billing__info">
          <p className="billing__card-title">BILLING INFO</p>
          {infos.map((v, i) => (
            <Info
              onDelete={() => onAddressDelete(i)}
              key={`${i * 1}`}
              name={v.name}
              address={v.address}
              phone={v.phone}
            />
          ))}
          <ButtonKit
            style={{ marginTop: 8 }}
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
