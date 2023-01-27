import PhoneInput from 'react-phone-input-2';

import 'react-phone-input-2/lib/material.css';

import country from '../../data/country.json';

const PhoneInputKit = (props: any) => (
  <PhoneInput
    onlyCountries={country.map((v) => v.code.toLowerCase())}
    countryCodeEditable={false}
    {...props}
  />
);

export default PhoneInputKit;
