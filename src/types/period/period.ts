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

export const today = (): DatePeriod => ({
  from: dayjs().startOf('day'),
  until: dayjs().endOf('day'),
});

export const tomorrow = (): DatePeriod => ({
  from: dayjs().add(1, 'day').startOf('day'),
  until: dayjs().add(1, 'day').endOf('day'),
});

export const yesterday = (): DatePeriod => ({
  from: dayjs().subtract(1, 'day').startOf('day'),
  until: dayjs().subtract(1, 'day').endOf('day'),
});

export const currentWeek = (): DatePeriod => ({
  from: dayjs().startOf('week'),
  until: dayjs().endOf('day'),
});

export const currentWeekFull = (): DatePeriod => ({
  from: dayjs().startOf('week'),
  until: dayjs().endOf('week'),
});

export const lastWeek = (): DatePeriod => ({
  from: dayjs().subtract(1, 'week').startOf('week'),
  until: dayjs().subtract(1, 'week').endOf('week'),
});

export const currentMonth = (): DatePeriod => ({
  from: dayjs().startOf('month'),
  until: dayjs().endOf('day'),
});

export const currentMonthFull = (): DatePeriod => ({
  from: dayjs().startOf('month'),
  until: dayjs().endOf('month'),
});

export const lastMonth = (): DatePeriod => ({
  from: dayjs().subtract(1, 'month').startOf('month'),
  until: dayjs().subtract(1, 'month').endOf('month'),
});

export const samePeriods = (a: DatePeriod, b: DatePeriod): boolean =>
  a.from.isSame(b.from, 'date') && a.until.isSame(b.until, 'date');

export const periodToShortcut = (period: DatePeriod): string => {
  switch (true) {
    case samePeriods(period, today()):
      return 'today';
    case samePeriods(period, tomorrow()):
      return 'tomorrow';
    case samePeriods(period, yesterday()):
      return 'yesterday';
    case samePeriods(period, lastWeek()):
      return 'last_week';
    case samePeriods(period, currentWeek()):
      return 'current_week';
    case samePeriods(period, currentWeekFull()):
      return 'current_week_full';
    case samePeriods(period, lastMonth()):
      return 'last_month';
    case samePeriods(period, currentMonth()):
      return 'current_month';
    case samePeriods(period, currentMonthFull()):
      return 'current_month_full';
    default:
      return 'custom';
  }
};
