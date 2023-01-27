import { Zoom } from '@mui/material';

import './Info.scss';

import ButtonKit from '../../../../kits/button/ButtonKit';

const Info = (props: any) => {
  const { name, address, phone, onDelete, onEdit } = props;

  return (
    <Zoom in>
      <div className='info'>
        <p className='__text'>
          <span>Name :</span> &nbsp; &nbsp; &nbsp; {name}
        </p>
        <p className='__text'>
          <span>Address :</span> &nbsp; {address}
        </p>
        <p className='__text'>
          <span>Phone :</span> &nbsp; &nbsp; &nbsp;{phone}
        </p>
        <div className='__btn-flex'>
          <ButtonKit variant='outlined' onClick={onDelete}>
            Delete
          </ButtonKit>
          <ButtonKit variant='contained' onClick={onEdit}>
            Edit
          </ButtonKit>
        </div>
      </div>
    </Zoom>
  );
};

export default Info;
