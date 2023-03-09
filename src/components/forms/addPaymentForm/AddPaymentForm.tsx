import { ButtonKit, TextfieldKit } from 'kits';
import './AddPaymentForm.scss';

const AddPaymentForm = (props: any) => {
  const { visible, handleInputChange, onCancel, onSaveChange } = props;

  return (
    <div className={`add-payment-form ${visible && '__visible'}`}>
      <p style={{ marginBottom: 7 }}>Add new card</p>
      <div className='add-payment-form__input-flex'>
        <TextfieldKit
          className='add-payment-form__input-flex__input'
          onChange={handleInputChange}
          name='cardName'
          fullWidth
          label='Name on card'
        />
        <TextfieldKit
          className='add-payment-form__input-flex__input'
          onChange={handleInputChange}
          name='cardNumber'
          fullWidth
          label='Card number'
        />
      </div>
      <div className='add-payment-form__input-flex'>
        <TextfieldKit
          className='add-payment-form__input-flex__input'
          onChange={handleInputChange}
          name='cardExpire'
          fullWidth
          label='Expiration date'
        />
        <TextfieldKit
          className='add-payment-form__input-flex__input'
          onChange={handleInputChange}
          name='cardCvv'
          fullWidth
          label='Cvv'
        />
      </div>
      <div className='add-payment-form__btn-flex'>
        <ButtonKit
          size='small'
          className='add-payment-form__input-flex__input'
          onChange={handleInputChange}
          onClick={onCancel}
          variant='outlined'
        >
          Cancel
        </ButtonKit>
        <ButtonKit
          style={{ marginLeft: 15 }}
          size='small'
          className='add-payment-form__input-flex__input'
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

export default AddPaymentForm;
