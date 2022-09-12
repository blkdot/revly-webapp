import { useEffect, useState } from 'react';
import {  updateEmail, updateProfile } from 'firebase/auth';

import './General.scss';

import AccountSettingForm from '../../forms/accountSettingForm/AccountSettingForm';

import PaperKit from '../../../kits/paper/PaperKit';

import useAlert from '../../../hooks/useAlert';
import validator from '../../../utlls/input/validator';

import { useUserAuth } from '../../../contexts/AuthContext';


const General = () => {
    const { user, emailVerify, logOut } = useUserAuth();
    const [inputValue, setInputValue] = useState({
        name: user.displayName || '',
        phone: user.phoneNumber || '',
        country: '',
        city: '',
        email: user.email,
        restoName: '',
        role: ''
    })
    const [inputError, setInputError] = useState({
        name: false,
        phone: false,
        country: false,
        city: false,
        email: false,
        restoName: false,
        role: false
    })
    const { showAlert, setAlertMessage, setAlertTheme } = useAlert();
    const [isLoading, setIsLoading] = useState(false);

    const updateInfo = (field, inequalTo, updateFunc) => {
        if (!inputError[field] && inputValue[field] && (inputValue[field].trim() !== inequalTo)) {
            setTimeout(() => {
                try {
                    updateFunc();
                    setAlertTheme('success');
                    setAlertMessage(`${field} changed`);
                    showAlert();
                } catch (err) {
                    setAlertMessage(err.message);
                    showAlert();
                }
            }, 500)
        }
    }

    useEffect(() => {
       updateInfo('name', user.displayName, async () => {
        await updateProfile(user, { displayName: inputValue.name.trim() });
       })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue.name])

    const handleInputChange = (e, is) => {
        setInputError({ ...inputError, [e.target.name]: !validator[is](e.target.value)});
        setInputValue({ ...inputValue, [e.target.name]: e.target.value });
    }

    const onChangeEmail = async () => {
        setIsLoading(true);
        if (!inputError.email && (inputValue.email.trim() !== user.email)) {
           try {
                await updateEmail(user, inputValue.email);
                await emailVerify();
                setAlertTheme('success');
                setAlertMessage(`E-mail changed, verification link sent !`);
                showAlert();
                setIsLoading(false);
           } catch (err) {
                if (err.code === 'auth/requires-recent-login') {
                    logOut();
                    window.location.assign('/');
                }

                setAlertTheme('error');
                setAlertMessage(err.message);
                showAlert();
                setIsLoading(false);
           }

        }
    };


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
                    valueEmail={{ value: inputValue.email, error: inputError.email }}
                    valueRestoName={{ value: inputValue.restoName, error: inputError.restoName }}
                    handleInputChange={handleInputChange}
                    onChangeEmail={isLoading ? undefined : onChangeEmail}
                    disableEmail={user.providerData[0].providerId === 'google.com'}
                />
            </PaperKit>
        </div>
    );
}

export default General;