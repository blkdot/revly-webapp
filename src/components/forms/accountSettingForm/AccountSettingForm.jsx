import React from 'react';

import './AccountSettingForm.scss';

import TextfieldKit from '../../../kits/textfield/TextfieldKit';
import ButtonKit from '../../../kits/button/ButtonKit';
import AutoCompleteKit from '../../../kits/autoComplete/AutoCompleteKit';
import PhoneInputKit from '../../../kits/phoneInput/PhoneInputKit';

import country from '../../../data/country.json';

const AccountSettingForm = (props) => {
    const {
        valueName,
        valuePhone,
        valueCountry,
        valueEmail,
        valueCity,
        valueRestoName,
        valueRole,
        handleInputChange,
        onSave,
        disableSave,
        handleCountryChange,
    } = props


    return (
        <div className="account-form">
            <div className='account-form__flex'>
                <div className="account-form__flex__block">
                    <TextfieldKit size="small" helperText={valueName.error ? '* must be > 2 and only alphabet' : ''} error={valueName.error} value={valueName.value} name="name" onChange={(e) => handleInputChange(e, 'isAlphabet')} className="account-form__flex__block__input" fullWidth label="Name" />
                    <TextfieldKit size="small" helperText={valueCity.error ? '* must be > 2 and only alphabet' : ''} error={valueCity.error} value={valueCity.value} name="city" onChange={(e) => handleInputChange(e, 'isAlphabet')} className="account-form__flex__block__input" fullWidth label="City" />
                    <PhoneInputKit value={valuePhone} enableSearch country="ae" onChange={(v) => handleInputChange({ target: { name: 'phone', value: `+${v}` }})} containerClass="account-form__flex__block__input-phone" />
                    <TextfieldKit label="E-mail" fullWidth className="account-form__flex__block__input" size="small" value={valueEmail} inputProps={{ readOnly: true }} />
                </div>
                
                <div className="account-form__flex__block">
                    <TextfieldKit size="small" helperText={valueRestoName.error ? '* must be > 2' : ''} error={valueRestoName.error} value={valueRestoName.value} name="restoName" onChange={(e) => handleInputChange(e, 'length')} className="account-form__flex__block__input" fullWidth label="Restaurant name" />
                    <AutoCompleteKit 
                        disableClearable
                        renderOption={(props, opt) => (
                            <li {...props}>
                                <img style={{ marginRight: 10 }} width="20" src={`https://flagcdn.com/${opt.code.toLowerCase()}.svg`} alt="flag" />
                                {opt.name}
                            </li>
                        )}
                        onChange={handleCountryChange}
                        value={valueCountry.value}
                        options={country}
                        getOptionLabel={(opt) => opt.name}
                        className="account-form__flex__block__autocomplete"
                        renderInput={(params) => (
                            <TextfieldKit {...params} label="Country"/>
                        )}
                     />
                    <TextfieldKit size="small" helperText={valueRole.error ? '* must be > 2 and only alphabet' : ''} error={valueRole.error} value={valueRole.value} name="role" onChange={(e) => handleInputChange(e, 'isAlphabet')} className="account-form__flex__block__input" fullWidth label="Role" />
                </div>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
                <ButtonKit disabled={disableSave} variant="contained" onClick={onSave}>Save changes</ButtonKit>
            </div>
        </div>
  );
};

export default AccountSettingForm;
