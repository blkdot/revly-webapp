import React from 'react';
import { Zoom } from '@mui/material';

import { DeleteOutlined, EditOutlined } from '@mui/icons-material';

import './Info.scss';

import ButtonKit from '../../../../kits/button/ButtonKit';

const Info = (props) => {
  const { name, address, phone, onDelete, onEdit } = props;

  return (
    <Zoom in>
      <div className="info">
        <p className="info__name">{name}</p>
        <p>
          {' '}
          <span>Address:</span> &nbsp; {address}
        </p>
        <p>
          {' '}
          <span>Phone:</span> &nbsp; {phone}
        </p>
        <div className="info__btn-flex">
          <ButtonKit
            sx={{ color: 'red', textTransform: 'none', fontWeight: '700' }}
            size="small"
            onClick={onDelete}
            startIcon={<DeleteOutlined />}>
            Delete
          </ButtonKit>
          <ButtonKit
            sx={{ marginLeft: 2, textTransform: 'none', fontWeight: '700' }}
            size="small"
            onClick={onEdit}
            startIcon={<EditOutlined />}>
            Edit
          </ButtonKit>
        </div>
      </div>
    </Zoom>
  );
};

export default Info;
