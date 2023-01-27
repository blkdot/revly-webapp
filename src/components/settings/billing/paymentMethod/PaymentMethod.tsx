import './PaymentMethod.scss';

import mastercard from '../../../../assets/images/mastercard.svg';
import visa from '../../../../assets/images/visa.svg';

const PaymentMethod = (props: any) => {
  const { cvv, type } = props;

  return (
    <div className={`payment-method __${type}`}>
      <div className='__text __flex'>
        <img src={type === 'mastercard' ? mastercard : visa} className='__type' alt='card' />
        <p>{type === 'mastercard' ? 'Mas' : 'Visa'}</p>
      </div>
      <p className='__cvv'>{cvv}</p>
      <div className='__name __flex'>
        <p>NAME</p>
        <p>MM/YY</p>
      </div>
    </div>
  );
};

export default PaymentMethod;
