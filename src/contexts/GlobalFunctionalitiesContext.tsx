import { endOfWeek, startOfWeek, subWeeks } from 'date-fns';
import { createContext, useEffect, useMemo, useState } from 'react';
import Alert from '../components/alert/Alert';

type DateType = {
  beforePeriod: {
    startDate: Date | number | string;
    endDate: Date | number | string;
  };
  afterPeriod: {
    startDate: Date | number | string;
    endDate: Date | number | string;
  };
  titleDate: string;
  titleafterPeriod: string;
  typeDate: string;
};

type GlobalFunctionalitiesContextType = {
  date: DateType;
  setDate: (v: DateType) => void;
  setAlertTheme: (v: string) => void;
  setAlertMessage: (v: string) => void;
  showAlert: () => void;
  triggerAlertWithMessageError: (v: string) => void;
  triggerAlertWithMessageSuccess: (v: string) => void;
};

export const GlobalFunctionalitiesContext =
  createContext<GlobalFunctionalitiesContextType>(undefined);

export const GlobalFunctionalitiesContextProvider = ({ children }) => {
  const [isShowing, setIsShowing] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('error');

  const storageDate = JSON.parse(localStorage.getItem('date')) || null;
  const [date, setDate] = useState<DateType>(
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
    }
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

  const value = useMemo(
    () => ({
      setAlertTheme,
      setAlertMessage,
      showAlert,
      triggerAlertWithMessageError,
      triggerAlertWithMessageSuccess,
      date,
      setDate,
    }),
    [
      setAlertTheme,
      setAlertMessage,
      showAlert,
      triggerAlertWithMessageError,
      triggerAlertWithMessageSuccess,
      date,
      setDate,
    ]
  );

  return (
    <GlobalFunctionalitiesContext.Provider value={value}>
      {renderAlert()}
      {children}
    </GlobalFunctionalitiesContext.Provider>
  );
};
