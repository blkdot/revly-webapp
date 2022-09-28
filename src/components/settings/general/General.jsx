import React, { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import './General.scss';

import ButtonKit from '../../../kits/button/ButtonKit';

import AccountSettingForm from '../../forms/accountSettingForm/AccountSettingForm';

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

  const getNumber = () => {
    if (!user.phoneNumber) return '';

    const num = user.phoneNumber.substring(user.phoneNumber.length - 9);

    return num;
  };

  const getDial = () => {
    if (!user.phoneNumber) return '';

    const num = getNumber();

    const curDial = user.phoneNumber.replace(num, '');

    return curDial;
  };

  const [dial, setDial] = useState(getDial());

  const [inputValue, setInputValue] = useState({
    firstname: getFirstName() || '',
    lastname: getLastName() || '',
    phone: getNumber() || '',
    country: {},
    role: '',
    city: '',
    restoName: '',
  });
  const [inputCountryValue, setInputCountryValue] = React.useState('');
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

      const newPhoneNumber = `${dial}${inputValue.phone}`;
      if (newPhoneNumber.trim() !== user.phoneNumber) {
        const vId = await verifyPhone(newPhoneNumber);
        setIsUpdatingPhone(true);
        navigate(`/verify-code?n=${newPhoneNumber}&vId=${vId}`);
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
      <h3 style={{ fontSize: '16px', color: '#212B36', fontWeight: 600, marginBottom: 10 }}>
        Your personal data
      </h3>
      <AccountSettingForm
        valueFirstName={{ value: inputValue.firstname, error: inputError.firstname }}
        valueLastName={{ value: inputValue.lastname, error: inputError.lastname }}
        valuePhone={inputValue.phone}
        valueCountry={inputValue.country || null}
        valueCity={{ value: inputValue.city, error: inputError.city }}
        valueRestoName={{ value: inputValue.restoName, error: inputError.restoName }}
        valueDial={dial}
        onDialChange={(v) => setDial(v)}
        handleInputChange={handleInputChange}
        valueRole={inputValue.role}
        handleCountryChange={handleSelectCountry}
        inputCountryValue={inputCountryValue}
        onInputCountryChange={(e, v) => setInputCountryValue(v)}
      />
      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
        <ButtonKit disabled={disableSave()} variant="contained" onClick={handleSave}>
          Save changes
        </ButtonKit>
      </div>
    </div>
  );
};

export default General;
