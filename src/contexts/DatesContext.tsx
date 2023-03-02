import { Dayjs } from 'dayjs';
import { createContext, FC, ReactNode, useContext } from 'react';

// TODO: rename titleAfterPeriod, update default values

export type DateRange = {
  from: Dayjs;
  until: Dayjs;
};

export type DatesContextType = {
  current: DateRange;
  setCurrent: (v: DateRange) => void;
  compare: DateRange;
  setCompare: (v: DateRange) => void;
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
