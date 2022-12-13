// TODO: fix all linter problem
/* eslint-disable react/jsx-no-constructed-context-values */
// This file will handle any global functionnalities related to a context that do not belong to a specific context
// To prevent creating so many other context

import { startOfWeek, endOfWeek, subWeeks } from 'date-fns';
import React, { createContext, useEffect, useState } from 'react';

import Alert from '../components/alert/Alert';

export const GlobalFunctionalitiesContext = createContext();

export const GlobalFunctionalitiesContextProvider = ({ children }) => {
  const [isShowing, setIsShowing] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('error');

  const [vendors, setVendors] = useState({
    restaurants: [],
    vendorsObj: {},
    vendorsArr: [],
    display: {},
    chainObj: {},
  });

  const storageDate = JSON.parse(localStorage.getItem('date')) || null;
  const [date, setDate] = useState(
    storageDate || {
      beforePeriod: {
        startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
        endDate: new Date(),
      },
      afterPeriod: {
        startDate: startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
        endDate: endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
      },
      titleDate: 'current week',
      titleafterPeriod: 'last week',
      typeDate: 'week',
    },
  );

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
        triggerAlertWithMessageError,
        triggerAlertWithMessageSuccess,
        date,
        setDate,
        vendors,
        setVendors,
      }}
    >
      {renderAlert()}
      {children}
    </GlobalFunctionalitiesContext.Provider>
  );
};
