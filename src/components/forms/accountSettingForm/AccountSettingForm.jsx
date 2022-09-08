import './AccountSettingForm.scss';

import TextfieldKit from '../../../kits/textfield/TextfieldKit';
import ButtonKit from '../../../kits/button/ButtonKit';
import CardKit from '../../../kits/card/CardKit';

const AccountSettingForm = (props) => {
    const {
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
    } = props

    return (
        <CardKit>
        <div className="account-form">
            <div className='account-form__flex'>
                <div className="account-form__flex__block-1">
                    <TextfieldKit onChange={(e) => onChangeName(e.target.value)} className="account-form__flex__block-1__input" fullwidth placehoder="Name" />
                    <TextfieldKit onChange={(e) => onChangePhone(e.target.value)} className="account-form__flex__block-1__input" fullwidth placehoder="Phone Number" />
                    <TextfieldKit onChange={(e) => onChangeCountry(e.target.value)} className="account-form__flex__block-1__input" fullwidth placehoder="Country" />
                    <TextfieldKit onChange={(e) => onChangeCity(e.target.value)} className="account-form__flex__block-1__input" fullwidth placehoder="City" />
                </div>
                
                <div className="account-form__flex__block-2">
                    <TextfieldKit onChange={(e) => onChangeEmail(e.target.value)} className="account-form__flex__block-2__input" fullwidth placehoder="Email" />
                    <TextfieldKit onChange={(e) => onChangeAddress(e.target.value)} className="account-form__flex__block-2__input" fullwidth placehoder="Address" />
                    <TextfieldKit onChange={(e) => onChangeState(e.target.value)} className="account-form__flex__block-2__input" fullwidth placehoder="State/Region" />
                    <TextfieldKit onChange={(e) => onChangeZip(e.target.value)} className="account-form__flex__block-2__input" fullwidth placehoder="Zip/Code" />
                </div>
            </div>

            <TextfieldKit onChange={(e) => onChangeAbout(e)} className="account-form__textarea" multiline fullwidth placehoder="About" />

            <ButtonKit onClick={onSave} className="account-form__button">Save Changes</ButtonKit>
        </div>
        </CardKit>
    );
}

export default AccountSettingForm;