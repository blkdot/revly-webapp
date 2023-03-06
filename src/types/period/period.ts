import dayjs, { Dayjs } from 'dayjs';

export type DatePeriod = {
  from: Dayjs;
  until: Dayjs;
};

export type OldDatePeriod = {
  startDate: Date;
  endDate: Date;
};

export const periodToJSON = (period: DatePeriod): string =>
  JSON.stringify({
    from: period.from.toString(),
    until: period.until.toString(),
  });

export const periodFromJSON = (value: string, defaultValue: DatePeriod): DatePeriod => {
  const period = JSON.parse(value);

  if (period && period.from && period.until) {
    return {
      from: dayjs(period.from),
      until: dayjs(period.until),
    };
  }

  return defaultValue;
};
