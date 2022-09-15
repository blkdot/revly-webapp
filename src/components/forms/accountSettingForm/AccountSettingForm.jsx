import './AccountSettingForm.scss';

import TextfieldKit from '../../../kits/textfield/TextfieldKit';
import ButtonKit from '../../../kits/button/ButtonKit';
import SelectKit from '../../../kits/select/SelectKit';
import MenuItemKit from '../../../kits/menuItem/MenuItemKit';
import InputLabelKit from '../../../kits/inputlabel/InputLabelKit';
import FormcontrolKit from '../../../kits/formcontrol/FormcontrolKit';

const AccountSettingForm = (props) => {
    const {
        valueName,
        valuePhone,
        valueCountry,
        valueCity,
        valueRestoName,
        valueRole,
        handleInputChange,
        onSave,
        disableSave,
        handleSelectChange,
        countryList
    } = props


    return (
        <div className="account-form">
            <div className='account-form__flex'>
                <div className="account-form__flex__block-1">
                    <TextfieldKit size="small" helperText={valueName.error ? '* must be > 2 and only alphabet' : ''} error={valueName.error} value={valueName.value} name="name" onChange={(e) => handleInputChange(e, 'isAlphabet')} className="account-form__flex__block-1__input" fullWidth label="Name" />
                    <TextfieldKit size="small" helperText={valueCity.error ? '* must be > 2 and only alphabet' : ''} error={valueCity.error} value={valueCity.value} name="city" onChange={(e) => handleInputChange(e, 'isAlphabet')} className="account-form__flex__block-1__input" fullWidth label="City" />
                    <TextfieldKit size="small" helperText={valuePhone.error ? '* must be a valid phone number' : ''} error={valuePhone.error} value={valuePhone.value} name="phone" onChange={(e) => handleInputChange(e, 'isPhone')} className="account-form__flex__block-1__input" fullWidth label="Phone Number" />

                </div>
                
                <div className="account-form__flex__block-2">
                    <TextfieldKit size="small" helperText={valueRestoName.error ? '* must be > 2' : ''} error={valueRestoName.error} value={valueRestoName.value} name="restoName" onChange={(e) => handleInputChange(e, 'length')} className="account-form__flex__block-2__input" fullWidth label="Restaurant name" />
                    <FormcontrolKit fullWidth className="account-form__flex__block-2__input">
                        <InputLabelKit id="select-label-id">Country</InputLabelKit>
                        <SelectKit labelId="select-label-id" size="small" value={valueCountry.value} name="country" onChange={handleSelectChange} fullWidth label="Country">
                            {countryList.map((v) => (
                                <MenuItemKit key={v.code} value={v.code}>{v.name}</MenuItemKit>
                            ))}
                        </SelectKit>
                    </FormcontrolKit>
                    <TextfieldKit size="small" helperText={valueRole.error ? '* must be > 2 and only alphabet' : ''} error={valueRole.error} value={valueRole.value} name="role" onChange={(e) => handleInputChange(e, 'isAlphabet')} className="account-form__flex__block-2__input" fullWidth label="Role" />
                </div>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
                <ButtonKit disabled={disableSave} variant="contained" onClick={onSave}>Save changes</ButtonKit>
            </div>
        </div>
    );
}

export default AccountSettingForm;