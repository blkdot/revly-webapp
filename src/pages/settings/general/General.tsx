import { AxiosError } from 'axios';
import AccountSettingForm from 'components/forms/accountSettingForm/AccountSettingForm';
import { useUser, useUserAuth } from 'contexts';
import { auth, verifyPhone } from 'firebase-config';
import { updateProfile } from 'firebase/auth';
import { useAlert, useApi } from 'hooks';
import { ButtonKit } from 'kits';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import country from '../../../data/country.json';
import { firebaseCodeError } from '../../../data/firebaseCodeError';
import validator from '../../../utlls/input/validator';
import './General.scss';

const General = () => {
  const user = useUser();
  const { setIsUpdatingPhone } = useUserAuth();
  const { settingsSave, settingsLoad } = useApi();

  const getNumber = () => {
    if (!user.phoneNumber) return '';

    const num = user.phoneNumber.substring(user.phoneNumber.length - 9);

    return num;
  };

  const [dial, setDial] = useState('+971');
  const [inputValue, setInputValue] = useState<any>({
    name: user.displayName,
    phone: getNumber() || '',
    country: { name: '', code: '' },
    role: '',
    city: '',
    restoName: '',
  });
  const [oldValue, setOldValue] = useState<any>({});
  const [inputCountryValue, setInputCountryValue] = React.useState('');
  const [inputError, setInputError] = useState<any>({
    name: false,
    restoName: false,
    role: false,
  });
  const { showAlert, setAlertMessage, setAlertTheme } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isValid = (field, inequalTo) => {
    if (field === 'phone') {
      return inputValue.phone
        ? `${dial}${inputValue.phone}` !== inequalTo
        : !!inputValue.phone !== !!inequalTo;
    }

    if (field === 'country') {
      return inputValue.country.name !== inequalTo;
    }

    return inputValue[field]
      ? inputValue[field].trim() !== inequalTo
      : !!inputValue[field] !== !!inequalTo;
  };

  const disableSave = () =>
    Object.keys(inputError)
      .map((v) => inputError[v])
      .includes(true) ||
    (!isValid('name', user.displayName) &&
      !isValid('restoName', oldValue.restoName) &&
      !isValid('city', oldValue.city) &&
      !isValid('role', oldValue.role) &&
      !isValid('phone', user.phoneNumber) &&
      !isValid('country', oldValue.country)) ||
    isLoading;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (isValid('name', user.displayName)) {
        await updateProfile(auth.currentUser, {
          displayName: `${inputValue.name.trim()}`,
        });
      }

      const newPhoneNumber = `${dial}${inputValue.phone}`;
      if (
        inputValue.phone
          ? newPhoneNumber.trim() !== user.phoneNumber
          : isValid('phone', user.phoneNumber)
      ) {
        const vId = await verifyPhone(newPhoneNumber);
        setIsUpdatingPhone(true);
        navigate(`/verify-code`, {
          state: {
            data: {},
            prevPath: '/settings',
            n: newPhoneNumber,
            vId,
          },
        });
      }

      if (
        isValid('restoName', oldValue.restoName) ||
        isValid('city', oldValue.city) ||
        isValid('role', oldValue.role) ||
        isValid('country', oldValue.country)
      ) {
        const data = {
          ...(isValid('city', oldValue.city) && { city: inputValue.city }),
          ...(isValid('restoName', oldValue.restoName) && { restoName: inputValue.restoName }),
          ...(isValid('country', oldValue.country) && {
            country: inputValue.country.name,
          }),
          ...(isValid('role', oldValue.role) && { role: inputValue.role }),
        };
        const save = await settingsSave({
          master_email: user.email,
          data,
        });

        if (save instanceof AxiosError) {
          throw new Error('Update failed');
        }

        setOldValue({ ...oldValue, ...data });
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

  const getUserData = async () => {
    try {
      const data = await settingsLoad({
        master_email: user.email,
        access_token: user.token,
      });
      const obj = {
        restoName: data.restoname || '',
        city: data.city || '',
        role: data.role || '',
        country: country.find((v) => v.name === data.country) || { name: '', code: '' },
      };

      setDial(data.dial);
      setInputValue({
        ...inputValue,
        ...obj,
      });
      setOldValue({ ...obj, country: data.country || '' });
    } catch (err) {
      setAlertMessage(err.code);
      showAlert();
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

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
    <div className='general'>
      <p className='__title'>Your personal data</p>
      <AccountSettingForm
        valueName={{ value: inputValue.name, error: inputError.name }}
        valuePhone={inputValue.phone}
        valueCountry={inputValue.country || null}
        valueCity={{ value: inputValue.city, error: inputError.city }}
        valueRestoName={{ value: inputValue.restoName, error: inputError.restoName }}
        valueDial={dial}
        onDialChange={(v) => setDial(v)}
        handleInputChange={handleInputChange}
        valueRole={{ value: inputValue.role, error: inputError.role }}
        handleCountryChange={handleSelectCountry}
        inputCountryValue={inputCountryValue}
        onInputCountryChange={(e, v) => setInputCountryValue(v)}
      />
      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
        <ButtonKit disabled={disableSave()} variant='contained' onClick={handleSave}>
          Save changes
        </ButtonKit>
      </div>
    </div>
  );
};

export default General;
