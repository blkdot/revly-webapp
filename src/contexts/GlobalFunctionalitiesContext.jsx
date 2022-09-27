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

  const storageDate = JSON.parse(localStorage.getItem('date')) || {};
  const [leftDate, setLeft] = useState(
    storageDate.leftDate || {
      startDate: startOfWeek(new Date()),
      endDate: new Date(),
    },
  );
  const [rightDate, setRight] = useState(
    storageDate.rightDate || {
      startDate: startOfWeek(subWeeks(new Date(), 1)),
      endDate: endOfWeek(subWeeks(new Date(), 1)),
    },
  );
  const [titleDate, setTitleDate] = useState(storageDate.titleDate || 'current week');
  const [titleRightDate, setTitleRightDate] = useState(storageDate.titleRightDate || 'last week');

  const [restaurants, setRestaurants] = useState([]);
  const [vendorsContext, setVendorsContext] = useState({});

  const [leftDateOffers, setLeftDateOffers] = useState(
    storageDate.leftDateOffers || {
      startDate: leftDate.startDate,
      endDate: leftDate.endDate,
    },
  );
  const [titleOffers, setTitleOffers] = useState(titleDate);
  const [typeDateContext, setTypeDateContext] = useState(storageDate.typeDate);

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
        titleOffers,
        setTitleOffers,
        vendorsContext,
        setVendorsContext,
        typeDateContext,
        setTypeDateContext,
      }}>
      {renderAlert()}
      {children}
    </GlobalFunctionalitiesContext.Provider>
  );
};
