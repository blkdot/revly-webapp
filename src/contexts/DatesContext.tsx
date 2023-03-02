import { Dayjs } from 'dayjs';
import { createContext, FC, ReactNode, useContext } from 'react';

// TODO: rename titleAfterPeriod, update default values

export type DateRange = {
  from: Dayjs;
  until: Dayjs;
};

export type DatesContextType = {
  current: DateRange;
  compare: DateRange;
  setCurrent: (v: DateRange) => void;
  setCompare: (v: DateRange) => void;
  titleDate: string;
  titleAfterPeriod: string;
  typeDate: string;
};

const DatesContext = createContext<DatesContextType>(undefined);

export const DatesProvider: FC<{
  value: DatesContextType;
  children: ReactNode;
}> = ({ value, children }) => (
  <DatesContext.Provider value={value}>{children}</DatesContext.Provider>
);

export const useDates = () => useContext(DatesContext);
