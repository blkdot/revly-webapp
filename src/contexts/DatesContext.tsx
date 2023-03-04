import { createContext, FC, ReactNode, useContext } from 'react';
import { DatePeriod } from 'types';

export type DatesContextType = {
  current: DatePeriod;
  setCurrent: (v: DatePeriod) => void;
  compare: DatePeriod;
  setCompare: (v: DatePeriod) => void;
  currentTitle: string;
  setCurrentTitle: (v: string) => void;
  compareTitle: string;
  setCompareTitle: (v: string) => void;
  calendar: string;
  setCalendar: (v: string) => void;
};

const DatesContext = createContext<DatesContextType>(undefined);

export const DatesProvider: FC<{
  value: DatesContextType;
  children: ReactNode;
}> = ({ value, children }) => (
  <DatesContext.Provider value={value}>{children}</DatesContext.Provider>
);

export const useDates = () => useContext(DatesContext);
