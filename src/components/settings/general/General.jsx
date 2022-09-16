import React, { useState } from 'react';
import { updateProfile } from 'firebase/auth';

import './General.scss';

import AccountSettingForm from '../../forms/accountSettingForm/AccountSettingForm';

import PaperKit from '../../../kits/paper/PaperKit';

import { useAlert } from '../../../hooks/useAlert';
import validator from '../../../utlls/input/validator';

import { useUserAuth } from '../../../contexts/AuthContext';
import firebaseCodeError from '../../../data/firebaseCodeError';

const General = () => {
    const { user, updatePhone, createRecaptcha } = useUserAuth();
    const [inputValue, setInputValue] = useState({
        name: user.displayName || '',
        phone: user.phoneNumber || '',
        country: {},
        email: user.email,
        city: '',
        restoName: '',
        role: ''
    })
    const [inputError, setInputError] = useState({
        name: false,
        restoName: false,
        role: false
    })
    const { showAlert, setAlertMessage, setAlertTheme } = useAlert();
    const [isLoading, setIsLoading] = useState(false);

    const isValid = (field, inequalTo) => inputValue[field] ? (inputValue[field].trim() !== inequalTo) : (!!inputValue[field] !== !!inequalTo);

    const disableSave = () => {
        return Object.keys(inputError).map((v) => inputError[v]).includes(true) || (!isValid('name', user.displayName) && !isValid('phone', user.phoneNumber)) || isLoading;
    }

    const handleSave = async () => {



        setIsLoading(true);
            try {
                if (isValid('name', user.displayName)) {
                    await updateProfile(user, { displayName: inputValue.name.trim() });
                }

                if (isValid('phone', user.phoneNumber)) {
                    createRecaptcha();
                    await updatePhone(inputValue.phone.trim());
                }

                setIsLoading(false);
                setAlertTheme('success');
                setAlertMessage('Information changed');
                showAlert();
            } catch (e) {
                const message = firebaseCodeError[e.code] ? firebaseCodeError[e.code].message : e.message;

                if (e.code === 'auth/quota-exceeded') {
                    setInputValue({ ...inputValue, phone: '' })
                }

                setIsLoading(false);
                setAlertTheme('error');
                setAlertMessage(message);
                showAlert();
            }
    }


    const handleInputChange = (e, is) => {
        if (validator[is]) {
            setInputError({ ...inputError, [e.target.name]: !validator[is](e.target.value)});
        }
        setInputValue({ ...inputValue, [e.target.name]: e.target.value });
    }

    const handleSelectCountry = (e, newValue) => {
        setInputValue({ ...inputValue, country: { name: newValue.name, value: newValue.code } });
    }


    return (
        <div className="general">
            <PaperKit className="general__input-block">
                <AccountSettingForm
                    valueName={{ value: inputValue.name, error: inputError.name }}
                    valuePhone={inputValue.phone}
                    valueCountry={inputValue.country}
                    valueCity={{ value: inputValue.city, error: inputError.city }}
                    valueRole={{ value: inputValue.role, error: inputError.role }}
                    valueRestoName={{ value: inputValue.restoName, error: inputError.restoName }}
                    handleInputChange={handleInputChange}
                    valueEmail={inputValue.email}
                    onSave={handleSave}
                    disableSave={disableSave()}
                    handleCountryChange={handleSelectCountry}
                />
            </PaperKit>
        </div>
    );
}

export default General;
