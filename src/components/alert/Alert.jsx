import React from 'react';

import './Alert.scss';

import AlertKit from '../../kits/alert/AlertKit';

const Alert = (props) => {
  const { severity, visible, children } = props;

  if (!visible) return null;

  return (
    <div className="alert-component">
      <AlertKit severity={severity}>{children}</AlertKit>
    </div>
  );
};

export default Alert;
