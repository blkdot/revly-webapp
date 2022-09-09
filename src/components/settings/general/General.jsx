import { useCallback, useState } from 'react';
import { updateEmail, updatePhoneNumber, updateProfile } from 'firebase/auth';

import './General.scss';

import AvatarUpload from '../../avatarUpload/AvatarUpload';
import AccountSettingForm from '../../forms/accountSettingForm/AccountSettingForm';

import SwitchKit from '../../../kits/switch/SwitchKit';
import PaperKit from '../../../kits/paper/PaperKit';

import useAlert from '../../../hooks/useAlert';
import validator from '../../../utlls/input/validator';

import { useUserAuth } from '../../../contexts/AuthContext';


const General = () => {
    const { user, phoneNumberVerify, reCaptcha } = useUserAuth();
    const [inputValue, setInputValue] = useState({
        name: user.displayName || '',
        phone: user.phoneNumber || '',
        country: '',
        city: '',
        email: user.email,
        address: '',
        state: '',
        zip: '',
        about: ''
    })
    const [inputError, setInputError] = useState({
        name: false,
        phone: false,
        country: false,
        city: false,
        email: false,
        address: false,
        state: false,
        zip: false,
        about: false
    })
    const [avatarFile, setAvatarFile] = useState(user.photoURL);
    const [isPublic, setIsPublic] = useState(true);
    const { showAlert, setAlertMessage, setAlertTheme } = useAlert();
    const [isLoading, setIsLoading] = useState(false);

    const onDropAvatar = useCallback(async (file) => {
        const src = file[0];

        if (src) {
            const url = URL.createObjectURL(src);
            setAvatarFile(url);
        }
    }, [setAvatarFile]);

    const handleInputChange = (e, is) => {
        setInputError({ ...inputError, [e.target.name]: !validator[is](e.target.value)});
        setInputValue({ ...inputValue, [e.target.name]: e.target.value });
    }

    const onFileError = (error) => {
        setAlertMessage(error[0].errors[0].message);
        showAlert();
    };

    const onSwitchChange = (e) => setIsPublic(e.target.checked);

    const disableSave = () => {
        return Object.keys(inputError).map((v) => inputError[v]).includes(true) || (!!user.displayName === !!inputValue.name.trim() && avatarFile === user.photoURL && user.email === inputValue.email && (!!inputValue.phone === !!user.phoneNumber)) || isLoading;
    }

    const onSave = async () => {
        setIsLoading(true);
        try {

            await updateProfile(user, {
                ...(inputValue.name.trim() !== user.displayName && { displayName: inputValue.name }),
                ...(avatarFile !== user.photoURL && { photoURL: avatarFile })
            })

            if (inputValue.phone) {
                    // const credential = phoneNumberVerify(inputValue.phone);
                    // console.log(credential);
                    // await updatePhoneNumber(user, credential);
            }

            if (inputValue.email !== user.email) {
                await updateEmail(user, inputValue.email);
            }

            setAlertTheme('success');
            setAlertMessage(' Information changed');
            showAlert();
            setIsLoading(false)
        } catch (err) {
            setIsLoading(false)
            console.log(err);
        }
    };


    return (
        <div id="recaptcha" className="general">
            <PaperKit className="general__avatar-block">
                <AvatarUpload file={avatarFile} onDrop={onDropAvatar} onError={onFileError} />
                <p className="general__avatar-block__allow-text">
                  Allowed *.jpeg, *.jpg, *.png
                  <br /> max size of 3.1 mb
                </p>
                <div className="general__avatar-block__switch-text">
                    <p>Pubic Profile</p>
                    <SwitchKit checked={isPublic} onChange={onSwitchChange} />
                </div>
            </PaperKit>
            <PaperKit className="general__input-block">
                <AccountSettingForm
                    valueName={{ value: inputValue.name, error: inputError.name}}
                    valuePhone={{ value: inputValue.phone, error: inputError.phone}}
                    valueCountry={{ value: inputValue.country, error: inputError.country}}
                    valueCity={{ value: inputValue.city, error: inputError.city}}
                    valueEmail={{ value: inputValue.email, error: inputError.email}}
                    valueAddress={{ value: inputValue.address, error: inputError.address}}
                    valueState={{ value: inputValue.state, error: inputError.state}}
                    valueZip={{ value: inputValue.zip, error: inputError.zip}}
                    valueAbout={inputValue.about}
                    handleInputChange={handleInputChange}
                    onSave={onSave}
                    disableSave={disableSave()}
                    disableEmail={user.providerData[0].providerId === 'google.com'}
                />
            </PaperKit>
        </div>
    );
}

export default General;