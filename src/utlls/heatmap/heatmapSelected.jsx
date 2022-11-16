import _ from 'lodash';
import { getDay, isSameDay, getHours, differenceInDays } from 'date-fns';

import { rangeHoursOpenedDayObj, daysOrder, rangeHoursOpenedDay } from './heatmapSelectedData';

const typeMono = (dateRange, times) => {
  const { startDate, endDate } = dateRange;

  const sameDay = isSameDay(startDate, endDate);

  const indexDayStart = getDay(startDate);

  if (sameDay) return setSameDayTimeRange(indexDayStart, times);

  const diff = differenceInDays(startDate, endDate);

  if (diff > 7) return setAll();

  const indexDayEnd = getDay(endDate);
};

const setSameDayTimeRange = (indexDayStart, times) => {
  const { startHour, endHour } = times;

  const valueStartHour = getHours(startHour);
  const valueEndHour = getHours(endHour);

  const range = _.range(
    rangeHoursOpenedDayObj[valueStartHour].hour,
    rangeHoursOpenedDayObj[valueEndHour].hour + 1,
  );

  return [
    {
      [daysOrder[indexDayStart]]: { times: range, key: daysOrder[indexDayStart] },
    },
  ];
};

const setAll = () =>
  daysOrder.map((d) => ({
    [d]: {
      times: _.range(
        rangeHoursOpenedDay[0],
        rangeHoursOpenedDay[rangeHoursOpenedDay.length - 1] + 1,
      ),
      key: d,
    },
  }));

const typeMulti = () => {};

const heatmapSelected = (type, dateRange, times) => {
  if (type === 'mono') return typeMono(dateRange, times);

  return typeMulti(dateRange, times);
};

export default heatmapSelected;
