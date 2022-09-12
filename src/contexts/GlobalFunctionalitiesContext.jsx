// This file will handle any global functionnalities related to a context that do not belong to a specific context
// To prevent creating so many other context

import React, { createContext, useEffect, useState } from 'react';

import Alert from '../components/alert/Alert';

export const GlobalFunctionalitiesContext = createContext();

export const GlobalFunctionalitiesContextProvider = ({ children }) => {
  const [isShowing, setIsShowing] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('error');

  const [leftDate, setLeft] = useState({ startDate: new Date(), endDate: new Date() });
  const [rightDate, setRight] = useState({ startDate: new Date(), endDate: new Date() });

  useEffect(() => {
    if (isShowing) {
      setTimeout(() => {
        setIsShowing(false);
      }, 5000);
    }
  }, [isShowing]);

  const showAlert = () => {
    setIsShowing(true);
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

  return (
    <GlobalFunctionalitiesContext.Provider value={{ setAlertTheme, setAlertMessage, showAlert, leftDate, rightDate, setLeft, setRight }}>
      {renderAlert()}
      {children}
    </GlobalFunctionalitiesContext.Provider>
  );
};

