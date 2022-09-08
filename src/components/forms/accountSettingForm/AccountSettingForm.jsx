import './AccountSettingForm.scss';

import TextfieldKit from '../../../kits/textfield/TextfieldKit';
import ButtonKit from '../../../kits/button/ButtonKit';

const AccountSettingForm = (props) => {
    const {
        valueName,
        valuePhone,
        valueCountry,
        valueCity,
        valueEmail,
        valueAddress,
        valueState,
        valueZip,
        valueAbout,
        handleInputChange,
        onSave,
    } = props


    return (
        <div className="account-form">
            <div className='account-form__flex'>
                <div className="account-form__flex__block-1">
                    <TextfieldKit error={valueName.error} value={valueName.value} name="name" onChange={(e) => handleInputChange(e, 'isAlphabet')} className="account-form__flex__block-1__input" fullWidth placeholder="Name" />
                    <TextfieldKit error={valuePhone.error} value={valuePhone.value} name="phone" onChange={(e) => handleInputChange(e, 'isPhone')} className="account-form__flex__block-1__input" fullWidth placeholder="Phone Number" />
                    <TextfieldKit error={valueCountry.error} value={valueCountry.value} name="country" onChange={(e) => handleInputChange(e, 'isAlphabet')} className="account-form__flex__block-1__input" fullWidth placeholder="Country" />
                    <TextfieldKit error={valueCity.error} value={valueCity.value} name="city" onChange={(e) => handleInputChange(e, 'isAlphabet')} className="account-form__flex__block-1__input" fullWidth placeholder="City" />
                </div>
                
                <div className="account-form__flex__block-2">
                    <TextfieldKit error={valueEmail.error} value={valueEmail.value} name="email" onChange={(e) => handleInputChange(e, 'isEmail')} className="account-form__flex__block-2__input" fullWidth placeholder="Email" />
                    <TextfieldKit error={valueAddress.error} value={valueAddress.value} name="address" onChange={(e) => handleInputChange(e, 'length')} className="account-form__flex__block-2__input" fullWidth placeholder="Address" />
                    <TextfieldKit error={valueState.error} value={valueState.value} name="state" onChange={(e) => handleInputChange(e, 'isAlphabet')} className="account-form__flex__block-2__input" fullWidth placeholder="State/Region" />
                    <TextfieldKit error={valueZip.error} value={valueZip.value} name="zipcode" onChange={(e) => handleInputChange(e, 'isNumber')} className="account-form__flex__block-2__input" fullWidth placeholder="Zip/Code" />
                </div>
            </div>

            <TextfieldKit value={valueAbout} onChange={handleInputChange} className="account-form__textarea" multiline fullWidth placeholder="About" />

            <br />

            <ButtonKit onClick={onSave} className="account-form__button">Save Changes</ButtonKit>
        </div>
    );
}

export default AccountSettingForm;