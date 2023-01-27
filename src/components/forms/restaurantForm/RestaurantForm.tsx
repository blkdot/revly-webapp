import React from 'react';

import './RestaurantForm.scss';

import TextfieldKit from '../../../kits/textfield/TextfieldKit';

const RestaurantForm = () => (
  <div className='restaurant-form'>
    <div className='restaurant-form__items'>
      <div className='__items-item'>
        <TextfieldKit label='1st Restaurant' />
      </div>
      <div className='__items-item'>
        <TextfieldKit label='Address' />
      </div>
    </div>
    <div className='restaurant-form__items'>
      <div className='__items-item'>
        <TextfieldKit label='2nd Restaurant' />
      </div>
      <div className='__items-item'>
        <TextfieldKit label='Address' />
      </div>
    </div>
  </div>
);

export default RestaurantForm;
