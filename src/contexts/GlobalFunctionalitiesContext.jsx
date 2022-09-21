// TODO: fix all linter problem
/* eslint-disable react/jsx-no-constructed-context-values */
// This file will handle any global functionnalities related to a context that do not belong to a specific context
// To prevent creating so many other context

import { subDays } from 'date-fns';
import React, { createContext, useEffect, useState } from 'react';

import Alert from '../components/alert/Alert';

export const GlobalFunctionalitiesContext = createContext();

export const GlobalFunctionalitiesContextProvider = ({ children }) => {
  const [isShowing, setIsShowing] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('error');

  const [leftDate, setLeft] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [rightDate, setRight] = useState({
    startDate: subDays(new Date(), 1),
    endDate: subDays(new Date(), 1),
  });
  const [titleDate, setTitleDate] = useState('today');
  const [titleRightDate, setTitleRightDate] = useState('yesterday');

  const [restaurants, setRestaurants] = useState(['1 Restaurant']);

  const [leftDateOffers, setLeftDateOffers] = useState({
    startDate: leftDate.startDate,
    endDate: leftDate.endDate,
  });

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

  const triggerAlertWithMessageError = (m) => {
    setMessage(m);
    setIsShowing(true);
    setSeverity('error');
  };

  const triggerAlertWithMessageSuccess = (m) => {
    setMessage(m);
    setIsShowing(true);
    setSeverity('success');
  };

  const renderAlert = () => (
    <Alert severity={severity} visible={isShowing}>
      {message}
    </Alert>
  );

  return (
    <GlobalFunctionalitiesContext.Provider
      value={{
        setAlertTheme,
        setAlertMessage,
        showAlert,
        leftDate,
        rightDate,
        setLeft,
        setRight,
        setTitleDate,
        titleDate,
        setTitleRightDate,
        titleRightDate,
        triggerAlertWithMessageError,
        triggerAlertWithMessageSuccess,
        restaurants,
        setRestaurants,
        leftDateOffers,
        setLeftDateOffers,
      }}>
      {renderAlert()}
      {children}
    </GlobalFunctionalitiesContext.Provider>
  );
};
