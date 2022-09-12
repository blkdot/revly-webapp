import './AccountSettingForm.scss';

import TextfieldKit from '../../../kits/textfield/TextfieldKit';
import ButtonKit from '../../../kits/button/ButtonKit';

const AccountSettingForm = (props) => {
    const {
        valueName,
        valuePhone,
        valueCountry,
        valueCity,
        valueRestoName,
        valueEmail,
        valueRole,
        handleInputChange,
        onChangeEmail,
        disableEmail
    } = props


    return (
        <div className="account-form">
            <div className='account-form__flex'>
                <div className="account-form__flex__block-1">
                    <TextfieldKit helperText={valueName.error ? '* must be > 2 and only alphabet' : ''} error={valueName.error} value={valueName.value} name="name" onChange={(e) => handleInputChange(e, 'isAlphabet')} className="account-form__flex__block-1__input" fullWidth label="Name" />
                    <TextfieldKit helperText={valueCity.error ? '* must be > 2 and only alphabet' : ''} error={valueCity.error} value={valueCity.value} name="city" onChange={(e) => handleInputChange(e, 'isAlphabet')} className="account-form__flex__block-1__input" fullWidth label="City" />
                    <TextfieldKit helperText={valuePhone.error ? '* must be a valid phone number' : ''} error={valuePhone.error} value={valuePhone.value} name="phone" onChange={(e) => handleInputChange(e, 'isPhone')} className="account-form__flex__block-1__input" fullWidth label="Phone Number" />
                </div>
                
                <div className="account-form__flex__block-2">
                    <TextfieldKit helperText={valueRestoName.error ? '* must be > 2' : ''} error={valueRestoName.error} value={valueRestoName.value} name="restoName" onChange={(e) => handleInputChange(e, 'length')} className="account-form__flex__block-2__input" fullWidth label="Restaurant name" />
                    <TextfieldKit helperText={valueCountry.error ? '* must be > 2 and only alphabet' : ''} error={valueCountry.error} value={valueCountry.value} name="country" onChange={(e) => handleInputChange(e, 'isAlphabet')} className="account-form__flex__block-2__input" fullWidth label="Country" />
                    <TextfieldKit helperText={valueRole.error ? '* only number' : ''} error={valueRole.error} value={valueRole.value} name="role" onChange={(e) => handleInputChange(e, 'Alphabet')} className="account-form__flex__block-2__input" fullWidth label="Role" />
                </div>
            </div>

           <div className="account-form__email-block">
              <p>E-mail Address</p>
              <TextfieldKit className="account-form__email-block__input" hiddenLabel size="small" variant="filled" inputProps={{ readOnly: disableEmail }} helperText={valueEmail.error ? '* must be a valid email' : ''} error={valueEmail.error} value={valueEmail.value} name="email" onChange={(e) => handleInputChange(e, 'isEmail')} />
              <br />
              <ButtonKit size="small" disabled={disableEmail || valueEmail.error} onClick={onChangeEmail} variant="contained">Change E-mail</ButtonKit>
              {disableEmail && <span>&nbsp; &nbsp; (You are currently connected with your google account)</span> }
           </div>
        </div>
    );
}

export default AccountSettingForm;