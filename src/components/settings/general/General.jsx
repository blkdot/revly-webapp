import { useState } from 'react';
import {  updateProfile } from 'firebase/auth';

import './General.scss';

import AccountSettingForm from '../../forms/accountSettingForm/AccountSettingForm';

import PaperKit from '../../../kits/paper/PaperKit';

import useAlert from '../../../hooks/useAlert';
import validator from '../../../utlls/input/validator';

import { useUserAuth } from '../../../contexts/AuthContext';


const General = () => {
    const { user } = useUserAuth();
    const [inputValue, setInputValue] = useState({
        name: user.displayName || '',
        phone: user.phoneNumber || '',
        country: '',
        city: '',
        restoName: '',
        role: ''
    })
    const [inputError, setInputError] = useState({
        name: false,
        phone: false,
        country: false,
        city: false,
        restoName: false,
        role: false
    })
    const { showAlert, setAlertMessage, setAlertTheme } = useAlert();

    const updateInfo = (field, inequalTo, updateFunc) => {
        if (!inputError[field] && inputValue[field] && (inputValue[field].trim() !== inequalTo)) {
            try {
                updateFunc();
                setAlertTheme('success');
                setAlertMessage('Information changed');
                showAlert();
            } catch (err) {
                setAlertTheme('error');
                setAlertMessage(err.code);
                showAlert();
            }
        }
    }

    const handleSave = () => {
        updateInfo('name', user.displayName, async () => {
            await updateProfile(user, { displayName: inputValue.name.trim() })
        });
    }


    const handleInputChange = (e, is) => {
        setInputError({ ...inputError, [e.target.name]: !validator[is](e.target.value)});
        setInputValue({ ...inputValue, [e.target.name]: e.target.value });
    }


    return (
        <div className="general">
            <div id="recaptcha" ></div>
            <PaperKit className="general__input-block">
                <AccountSettingForm
                    valueName={{ value: inputValue.name, error: inputError.name }}
                    valuePhone={{ value: inputValue.phone, error: inputError.phone }}
                    valueCountry={{ value: inputValue.country, error: inputError.country }}
                    valueCity={{ value: inputValue.city, error: inputError.city }}
                    valueRole={{ value: inputValue.role, error: inputError.role }}
                    valueRestoName={{ value: inputValue.restoName, error: inputError.restoName }}
                    handleInputChange={handleInputChange}
                    onSave={handleSave}
                    disableSave={Object.keys(inputError).map((v) => inputError[v]).includes(true) || inputValue.name === user.displayName}
                />
            </PaperKit>
        </div>
    );
}

export default General;