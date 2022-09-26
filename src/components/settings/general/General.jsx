import React, { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import './General.scss';

import ButtonKit from '../../../kits/button/ButtonKit';

import AccountSettingForm from '../../forms/accountSettingForm/AccountSettingForm';
import RestaurantForm from '../../forms/restaurantForm/RestaurantForm';

import { useAlert } from '../../../hooks/useAlert';
import validator from '../../../utlls/input/validator';

import { useUserAuth } from '../../../contexts/AuthContext';
import { firebaseCodeError } from '../../../data/firebaseCodeError';

const General = () => {
  const { user, setIsUpdatingPhone, verifyPhone } = useUserAuth();

  const getFirstName = () => {
    const allName = user.displayName.split(' ');
    return allName[0];
  };

  const getLastName = () => {
    const allName = user.displayName.split(' ');
    allName.splice(0, 1);
    return allName.join(' ');
  };

  const [inputValue, setInputValue] = useState({
    firstname: getFirstName() || '',
    lastname: getLastName() || '',
    phone: user.phoneNumber || '',
    country: {},
    email: user.email,
    city: '',
    restoName: '',
  });
  const [inputError, setInputError] = useState({
    firstname: false,
    lastname: false,
    restoName: false,
  });
  const { showAlert, setAlertMessage, setAlertTheme } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isValid = (field, inequalTo) =>
    inputValue[field]
      ? inputValue[field].trim() !== inequalTo
      : !!inputValue[field] !== !!inequalTo;

  const disableSave = () =>
    Object.keys(inputError)
      .map((v) => inputError[v])
      .includes(true) ||
    (!isValid('name', user.firstname) &&
      !isValid('name', user.lastname) &&
      !isValid('phone', user.phoneNumber)) ||
    isLoading;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (isValid('name', user.firstname) && isValid('name', user.lastname)) {
        await updateProfile(user, {
          displayName: `${inputValue.firstname.trim()} ${inputValue.lastname.trim()}`,
        });
      }

      if (isValid('phone', user.phoneNumber)) {
        const vId = await verifyPhone(inputValue.phone);
        setIsUpdatingPhone(true);
        navigate(`/verify-code?n=${inputValue.phone}&vId=${vId}`);
      }

      setIsLoading(false);
      setAlertTheme('success');
      setAlertMessage('Information changed');
      showAlert();
    } catch (e) {
      const message = firebaseCodeError[e.code] ? firebaseCodeError[e.code].message : e.message;

      if (e.code === 'auth/quota-exceeded') {
        setInputValue({ ...inputValue, phone: '' });
      }

      setIsLoading(false);
      setAlertTheme('error');
      setAlertMessage(message);
      showAlert();
    }
  };

  const handleInputChange = (e, is) => {
    if (validator[is]) {
      setInputError({ ...inputError, [e.target.name]: !validator[is](e.target.value) });
    }
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
  };

  const handleSelectCountry = (e, newValue) => {
    setInputValue({ ...inputValue, country: { name: newValue.name, value: newValue.code } });
  };

  return (
    <div className="general">
      <h3 style={{ fontSize: '16px' }}>General information</h3>
      <AccountSettingForm
        valueFirstName={{ value: inputValue.firstname, error: inputError.firstname }}
        valueLastName={{ value: inputValue.lastname, error: inputError.lastname }}
        valuePhone={inputValue.phone}
        valueCountry={inputValue.country}
        valueCity={{ value: inputValue.city, error: inputError.city }}
        valueRestoName={{ value: inputValue.restoName, error: inputError.restoName }}
        handleInputChange={handleInputChange}
        valueEmail={inputValue.email}
        onSave={handleSave}
        disableSave={disableSave()}
        handleCountryChange={handleSelectCountry}
      />
      <div style={{ marginTop: '5rem' }}>
        <h3 style={{ fontSize: '16px' }}>Restaurant information</h3>
        <RestaurantForm />
      </div>
      <div style={{ marginTop: '5rem' }}>
        <ButtonKit disabled={disableSave} variant="contained" onClick={handleSave}>
          Save changes
        </ButtonKit>
      </div>
    </div>
  );
};

export default General;
