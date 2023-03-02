import { AutoCompleteKit, PhoneInputKit, TextfieldKit } from 'kits';
import country from '../../../data/country.json';
import onlyNumber from '../../../utlls/input/onlyNumber';
import './AccountSettingForm.scss';

const AccountSettingForm = (props: any) => {
  const {
    valueName,
    valueRestoName,
    valuePhone,
    valueCountry,
    valueRole,
    valueCity,
    valueDial,
    handleInputChange,
    handleCountryChange,
    inputCountryValue,
    onInputCountryChange,
    onDialChange,
  } = props;

  return (
    <div className='account-form'>
      <div className='account-form__flex'>
        <div className='account-form__flex__block'>
          <TextfieldKit
            helperText={valueName.error && '* must be > 2 and only alphabet'}
            error={valueName.error}
            value={valueName.value}
            name='name'
            onChange={(e) => handleInputChange(e, 'isAlphabet')}
            className='account-form__flex__block__input'
            fullWidth
            label='Name'
          />
          <TextfieldKit
            helperText={valueCity.error && '* must be > 2 and only alphabet'}
            error={valueCity.error}
            value={valueCity.value}
            name='city'
            onChange={(e) => handleInputChange(e, 'isAlphabet')}
            className='account-form__flex__block__input'
            fullWidth
            label='City'
          />
          <div className='account-form__flex__block__input-phone'>
            <PhoneInputKit
              value={valueDial}
              country='ae'
              specialLabel=''
              inputProps={{ readOnly: false }}
              onChange={onDialChange}
              containerClass='account-form__input-phone'
            />
            <TextfieldKit
              value={valuePhone}
              name='phone'
              onChange={(e) => handleInputChange(e)}
              className='account-form__flex__block__input'
              fullWidth
              label='Phone Number'
              onKeyDown={onlyNumber}
            />
          </div>
        </div>

        <div className='account-form__flex__block'>
          <TextfieldKit
            helperText={valueRestoName.error && '* must be > 2'}
            error={valueRestoName.error}
            value={valueRestoName.value}
            name='restoName'
            onChange={(e) => handleInputChange(e, 'length')}
            className='account-form__flex__block__input'
            fullWidth
            label='Restaurant Name'
          />
          <AutoCompleteKit
            disableClearable
            renderOption={(prop, opt) => (
              <li {...prop}>
                <img
                  style={{ marginRight: 10 }}
                  width='20'
                  src={`https://flagcdn.com/${opt.code.toLowerCase()}.svg`}
                  alt='flag'
                />
                {opt.name}
              </li>
            )}
            onChange={handleCountryChange}
            value={valueCountry}
            inputValue={inputCountryValue}
            onInputChange={onInputCountryChange}
            options={country}
            getOptionLabel={(opt) => {
              if (typeof opt === 'string') {
                const co = country.find((c) => c.name === opt);

                if (!co) return valueCountry.name;

                return co.name;
              }

              return opt.name;
            }}
            className='account-form__flex__block__autocomplete'
            renderInput={(params) => <TextfieldKit {...params} label='Country' />}
          />
          <TextfieldKit
            label='Role'
            fullWidth
            name='role'
            className='account-form__flex__block__input'
            error={valueRole.error}
            value={valueRole.value}
            onChange={(e) => handleInputChange(e, 'length')}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountSettingForm;
