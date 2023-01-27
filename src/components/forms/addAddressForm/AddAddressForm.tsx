import ButtonKit from '../../../kits/button/ButtonKit';
import TextfieldKit from '../../../kits/textfield/TextfieldKit';
import onlyNumber from '../../../utlls/input/onlyNumber';
import './AddAddressForm.scss';

const AddAddressForm = (props: any) => {
  const {
    visible,
    handleInputChange,
    onCancel,
    onSaveChange,
    nameValue,
    phoneValue,
    addressValue,
  } = props;

  return (
    <div className={`add-address-form ${visible ? '__visible' : ''}`}>
      <p style={{ marginBottom: 7 }}>Add new address</p>
      <div className='add-address-form__input-flex'>
        <TextfieldKit
          className='add-address-form__input-flex__input'
          onChange={handleInputChange}
          name='name'
          fullWidth
          value={nameValue}
          label='Name'
        />
        <TextfieldKit
          className='add-address-form__input-flex__input'
          onChange={handleInputChange}
          onKeyDown={onlyNumber}
          name='phone'
          value={phoneValue}
          fullWidth
          label='Phone'
        />
      </div>
      <TextfieldKit
        style={{ margin: '12px 0' }}
        onChange={handleInputChange}
        name='address'
        fullWidth
        label='Address'
        value={addressValue}
      />
      <div className='add-address-form__btn-flex'>
        <ButtonKit
          size='small'
          className='add-address-form__input-flex__input'
          onChange={handleInputChange}
          onClick={onCancel}
          variant='outlined'
        >
          Cancel
        </ButtonKit>
        <ButtonKit
          style={{ marginLeft: 15 }}
          size='small'
          className='add-address-form__input-flex__input'
          onChange={handleInputChange}
          onClick={onSaveChange}
          variant='contained'
        >
          Save Change
        </ButtonKit>
      </div>
    </div>
  );
};

export default AddAddressForm;
