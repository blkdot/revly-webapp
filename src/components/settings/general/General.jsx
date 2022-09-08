import { useCallback, useState } from 'react';

import './General.scss';

import AvatarUpload from '../../avatarUpload/AvatarUpload';
import AccountSettingForm from '../../forms/accountSettingForm/AccountSettingForm';

import SwitchKit from '../../../kits/switch/SwitchKit';

import useAlert from '../../../hooks/useAlert';
import validator from '../../../utlls/input/validator';
import PaperKit from '../../../kits/paper/PaperKit';


const General = () => {
    const [inputValue, setInputValue] = useState({
        name: '',
        phone: '',
        country: '',
        city: '',
        email: '',
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
    const [avatarFile, setAvatarFile] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const { showAlert, setAlertMessage } = useAlert();

    const onDropAvatar = useCallback((file) => {
        const src = file[0];

        if (src) {
            setAvatarFile(URL.createObjectURL(src));
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

    const onSave = () => {
        // save change
        console.log(inputError);
    };

    return (
        <div className="general">
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
                />
            </PaperKit>
        </div>
    );
}

export default General;