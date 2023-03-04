import { Dayjs } from 'dayjs';

export type Old = {
  beforePeriod: {
    startDate: Date | number;
    endDate: Date | number;
  };
  afterPeriod: {
    startDate: Date | number;
    endDate: Date | number;
  };
  titleDate: string;
  titleAfterPeriod: string;
  typeDate: string;
};

export type DatePeriod = {
  from: Dayjs;
  until: Dayjs;
};
