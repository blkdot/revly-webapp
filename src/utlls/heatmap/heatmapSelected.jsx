import _ from 'lodash';
import { getDay, isSameDay, getHours, differenceInDays } from 'date-fns';

import { daysOrder, rangeHoursOpenedDay, maxHour, minHour } from './heatmapSelectedData';

const typeMono = (dateRange, times, data) => {
  const { startDate, endDate } = dateRange;

  const sameDay = isSameDay(startDate, endDate);

  const indexDayStart = getDay(new Date(startDate));

  if (sameDay) return setSameDayTimeRange(data, daysOrder[indexDayStart], times);

  const diff = differenceInDays(endDate, startDate);

  if (diff >= 7) return setAll(data);

  const indexDayEnd = getDay(new Date(endDate));

  if (diff === 0)
    return setSideBySideDayTimeRange(data, daysOrder[indexDayStart], daysOrder[indexDayEnd], times);

  return setContinuesDayRange(data, indexDayStart, indexDayEnd, times);
};

const getHour = (h) => {
  let hour = getHours(h);

  if (hour < 5) {
    hour = 24 + hour;
  }

  return hour;
};

const getHeatmapDataDayNewContent = (data, day, tms) =>
  tms.reduce((acc, cur) => {
    if (!data || !data[day] || !data[day][cur]) {
      return { ...acc, [cur]: { active: true } };
    }

    return { ...acc, [cur]: { ...data[day][cur], active: true } };
  }, data[day]);

const setSameDayTimeRange = (data, day, times) => {
  const { startTime, endTime } = times;

  const valueStartHour = getHour(startTime);
  const valueEndHour = getHour(endTime);

  const range = _.range(
    rangeHoursOpenedDay[valueStartHour].hour,
    rangeHoursOpenedDay[valueEndHour].hour,
  );

  return { ...data, [day]: getHeatmapDataDayNewContent(data, day, range) };
};

const setSideBySideDayTimeRange = (data, start, end, times) => {
  const { startTime, endTime } = times;

  const valueStartHour = getHour(startTime);
  const valueEndHour = getHour(endTime);

  const rangeStart = _.range(rangeHoursOpenedDay[valueStartHour].hour, maxHour);
  const rangeEnd = _.range(minHour, rangeHoursOpenedDay[valueEndHour].hour);

  return {
    ...data,
    [start]: getHeatmapDataDayNewContent(data, start, rangeStart),
    [end]: getHeatmapDataDayNewContent(data, end, rangeEnd),
  };
};

const setContinuesDayRange = (data, indexDayStart, indexDayEnd, times) => {
  const { startTime, endTime } = times;

  const valueStartHour = getHour(startTime);
  const valueEndHour = getHour(endTime);

  const rangeStart = _.range(rangeHoursOpenedDay[valueStartHour].hour, maxHour + 1);
  const rangeEnd = _.range(minHour, rangeHoursOpenedDay[valueEndHour].hour);
  const rangeFull = _.range(minHour, maxHour + 1);

  let daysSelectedOrder = _.range(indexDayStart, indexDayEnd + 1);

  if (indexDayEnd < indexDayStart) {
    const rearPart = _.range(indexDayStart, 7);
    const frontPart = _.range(0, indexDayEnd + 1);

    daysSelectedOrder = [...rearPart, ...frontPart];
  }

  return daysSelectedOrder.reduce((acc, cur) => {
    let rangeUsed = rangeFull;

    if (cur === indexDayStart) {
      rangeUsed = rangeStart;
    }

    if (cur === indexDayEnd) {
      rangeUsed = rangeEnd;
    }

    return {
      ...acc,
      [daysOrder[cur]]: getHeatmapDataDayNewContent(data, daysOrder[cur], rangeUsed),
    };
  }, data);
};

const setAll = (data) =>
  data.reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: getHeatmapDataDayNewContent(data, cur, _.range(minHour, maxHour + 1)),
    }),
    data,
  );

const getWorkweek = (data, isWorkweek) => {
  const cData = [...data];

  if (!isWorkweek) {
    return cData;
  }

  cData.splice(0, 1);
  cData.splice(5, 1);

  return cData;
};

const typeMulti = (data, dateRange, times, isWorkweek) => {
  const combinedTimesRange = times
    .map((t) => {
      const { startTime, endTime } = t;

      const valueStartHour = getHour(startTime);
      const valueEndHour = getHour(endTime);

      const range = _.range(
        rangeHoursOpenedDay[valueStartHour].hour,
        rangeHoursOpenedDay[valueEndHour].hour + (valueEndHour === maxHour ? 1 : 0),
      );

      return range;
    })
    .flat(1);

  const { startDate, endDate } = dateRange;

  const indexDayStart = getDay(new Date(startDate));
  const indexDayEnd = getDay(new Date(endDate));

  let daysSelectedOrder = _.range(indexDayStart, indexDayEnd + 1);

  const diff = differenceInDays(endDate, startDate);

  if (diff >= 7) {
    daysSelectedOrder = getWorkweek(daysSelectedOrder, isWorkweek);

    return getWorkweek(daysOrder, isWorkweek).reduce(
      (acc, cur) => ({
        ...acc,
        [cur]: getHeatmapDataDayNewContent(data, [cur], combinedTimesRange),
      }),
      data,
    );
  }

  if (indexDayEnd <= indexDayStart) {
    const rearPart = _.range(indexDayStart, 7);
    const frontPart = _.range(0, indexDayEnd + 1);

    daysSelectedOrder = [
      ...getWorkweek(rearPart, isWorkweek),
      ...getWorkweek(frontPart, isWorkweek),
    ];
  }

  return daysSelectedOrder.reduce(
    (acc, cur) => ({
      ...acc,
      [daysOrder[cur]]: getHeatmapDataDayNewContent(data, daysOrder[cur], combinedTimesRange),
    }),
    data,
  );
};

const heatmapSelected = (type, dateRange, times, data = [], isWorkweek = false) => {
  if (type === 'mono') return typeMono(dateRange, times[0], data);

  return typeMulti(data, dateRange, times, isWorkweek);
};

export default heatmapSelected;
