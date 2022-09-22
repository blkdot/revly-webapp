import React from 'react';

import './HighOrderBlock.scss';

import AlertKit from '../../kits/alert/AlertKit';

const HighOrderBlock = (props) => {
  const { children, color, higher } = props;

  return (
    <div className={`high-order-block-component ${higher ? '__push-top' : ''}`}>
      <AlertKit icon={false} variant="filled" severity={color || 'error'}>
        {children}
      </AlertKit>
    </div>
  );
};

export default HighOrderBlock;
