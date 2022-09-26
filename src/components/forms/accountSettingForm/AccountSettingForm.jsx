import React from 'react';

import './AccountSettingForm.scss';

import TextfieldKit from '../../../kits/textfield/TextfieldKit';
import AutoCompleteKit from '../../../kits/autoComplete/AutoCompleteKit';
import PhoneInputKit from '../../../kits/phoneInput/PhoneInputKit';

import country from '../../../data/country.json';

const AccountSettingForm = (props) => {
  const {
    valueFirstName,
    valueLastName,
    valuePhone,
    valueCountry,
    valueEmail,
    valueCity,
    handleInputChange,
    handleCountryChange,
    inputCountryValue,
    onInputCountryChange,
  } = props;

  return (
    <div className="account-form">
      <div className="account-form__flex">
        <div className="account-form__flex__block">
          <TextfieldKit
            helperText={valueFirstName.error ? '* must be > 2 and only alphabet' : ''}
            error={valueFirstName.error}
            value={valueFirstName.value}
            name="firstname"
            onChange={(e) => handleInputChange(e, 'isAlphabet')}
            className="account-form__flex__block__input"
            fullWidth
            label="First Name"
          />
          <TextfieldKit
            helperText={valueCity.error ? '* must be > 2 and only alphabet' : ''}
            error={valueCity.error}
            value={valueCity.value}
            name="city"
            onChange={(e) => handleInputChange(e, 'isAlphabet')}
            className="account-form__flex__block__input"
            fullWidth
            label="City"
          />
          <TextfieldKit
            label="E-mail"
            fullWidth
            className="account-form__flex__block__input __not-allowed"
            value={valueEmail}
            inputProps={{ readOnly: true }}
          />
        </div>

        <div className="account-form__flex__block">
          <TextfieldKit
            helperText={valueLastName.error ? '* must be > 2' : ''}
            error={valueLastName.error}
            value={valueLastName.value}
            name="lastname"
            onChange={(e) => handleInputChange(e, 'length')}
            className="account-form__flex__block__input"
            fullWidth
            label="Last Name"
          />
          <AutoCompleteKit
            disableClearable
            renderOption={(prop, opt) => (
              <li {...prop}>
                <img
                  style={{ marginRight: 10 }}
                  width="20"
                  src={`https://flagcdn.com/${opt.code.toLowerCase()}.svg`}
                  alt="flag"
                />
                {opt.name}
              </li>
            )}
            onChange={handleCountryChange}
            value={valueCountry}
            inputValue={inputCountryValue}
            onInputChange={onInputCountryChange}
            options={country}
            getOptionLabel={(opt) => opt.name}
            className="account-form__flex__block__autocomplete"
            renderInput={(params) => <TextfieldKit {...params} label="Country" />}
          />
          <PhoneInputKit
            value={valuePhone}
            country="ae"
            specialLabel=""
            onChange={(v) => handleInputChange({ target: { name: 'phone', value: `+${v}` } })}
            containerClass="account-form__flex__block__input-phone"
          />
        </div>
      </div>
    </div>
  );
};

export default AccountSettingForm;
