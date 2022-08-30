import React, { useState, useEffect } from 'react';

import Alert from '../components/alert/Alert';

const useAlert = (th) => {
  const [isShowing, setIsShowing] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState(th || 'info');

  useEffect(() => {
    if (isShowing) {
      setTimeout(() => {
        setIsShowing(false);
      }, 5000);
    }
  }, [isShowing]);

  const setAlertShow = (v) => {
    setIsShowing(v);
  };

  const setAlertMessage = (m) => {
    setMessage(m);
  };

  const setAlertTheme = (t) => {
    setSeverity(t);
  };

  const renderAlert = () => (
    <Alert severity={severity} visible={isShowing}>
      {message}
    </Alert>
  );

  return {
    setAlertShow,
    setAlertMessage,
    setAlertTheme,
    renderAlert,
  };
};

export default useAlert;
