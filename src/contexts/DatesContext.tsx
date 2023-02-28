import dayjs, { Dayjs } from 'dayjs';
import { createContext, FC, ReactNode, useContext } from 'react';

export type DateRange = {
  from: Dayjs;
  until: Dayjs;
};

export type DatesContextType = {
  before: DateRange;
  after: DateRange;
};

const DatesContext = createContext<DatesContextType>({
  before: {
    from: dayjs(new Date()),
    until: dayjs(new Date()),
  },
  after: {
    from: dayjs(new Date()),
    until: dayjs(new Date()),
  },
});

export const DatesProvider: FC<{
  value: DatesContextType;
  children: ReactNode;
}> = ({ value, children }) => (
  <DatesContext.Provider value={value}>{children}</DatesContext.Provider>
);

export const useDates = () => useContext(DatesContext);
