
import './General.scss';

import AvatarUpload from '../../avatarUpload/AvatarUpload';
import SwitchKit from '../../../kits/switch/SwitchKit';
import AccountSettingForm from '../../forms/accountSettingForm/AccountSettingForm';
import CardKit from '../../../kits/card/CardKit';


const General = (props) => {
    const {
        avatarFile,
        onFileAccept,
        onFileError,
        switchChecked,
        onSwitchChange,
        onChangeName,
        onChangePhone,
        onChangeCountry,
        onChangeCity,
        onChangeEmail,
        onChangeAddress,
        onChangeState,
        onChangeZip,
        onChangeAbout,
        onSave
    } = props;

    return (
        <div className="general">
            <CardKit className="general__avatar-block">
                <AvatarUpload file={avatarFile} onAccept={onFileAccept} onError={onFileError} />
                <div className="general__avatar-block__switch-text">
                    <p>Pubic Profile</p>
                    <SwitchKit defaulChecked checked={switchChecked} onChange={onSwitchChange} />
                </div>
            </CardKit>
            <div className="general__input-block">
                <AccountSettingForm
                    onChangeName={onChangeName}
                    onChangePhone={onChangePhone}
                    onChangeCountry={onChangeCountry}
                    onChangeCity={onChangeCity}
                    onChangeEmail={onChangeEmail}
                    onChangeAddress={onChangeAddress}
                    onChangeState={onChangeState}
                    onChangeZip={onChangeZip}
                    onChangeAbout={onChangeAbout}
                    onSave={onSave}
                />
            </div>
        </div>
    );
}

export default General;