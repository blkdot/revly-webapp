import { ButtonKit } from 'kits';
import icinvoice from '../../../../assets/images/ic_invoice.png';

const Invoice = (props: any) => {
  const { date, amount } = props;

  return (
    <div className='invoice'>
      <div className='__flex'>
        <div className='__img-block'>
          <img src={icinvoice} alt='invoice' />
        </div>
        <p>{date}</p>
      </div>
      <p>{amount}</p>
      <ButtonKit variant='contained'>Download</ButtonKit>
    </div>
  );
};

export default Invoice;
