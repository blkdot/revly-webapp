import { CostIcon } from 'assets/icons';
import { ButtonKit } from 'kits';
import logo from '../../../../assets/images/small-logo.png';

const Invoice = (props: any) => {
  const { restaurant, cost, onDelete } = props;

  return (
    <div className='invoice cost'>
      <div className='__flex'>
        <img
          src={logo}
          alt='restaurant-example'
          style={{
            width: '3rem',
            borderRadius: '50%',
            border: '1px solid #DFE3E8',
            padding: '0.5rem',
          }}
        />
        <p
          style={{
            width: '20rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          <span>{restaurant}</span>
        </p>
      </div>
      <div className='__flex'>
        <div style={{ marginRight: '40px' }} className='__flex'>
          <div className='__img-block'>
            <CostIcon />
          </div>
          <p>
            Cost: <span>{cost}</span>
          </p>
        </div>
        <ButtonKit color='error' onClick={onDelete} variant='outlined'>
          Delete
        </ButtonKit>
      </div>
    </div>
  );
};

export default Invoice;
