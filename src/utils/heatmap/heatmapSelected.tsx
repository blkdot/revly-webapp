import { addDays, differenceInDays, format, getDay, getHours, isSameDay } from 'date-fns';
import _ from 'lodash';
import { type THeatmapData } from 'store/marketingSetupAtom';
import { daysOrder, maxHour, minHour, rangeHoursOpenedDay } from './heatmapSelectedData';

const getHour = (h) => {
  let hour = getHours(h);

  if (hour === 0) {
    hour = 24;
  }

  return hour;
};

const getMappedDay = (d: Date) => {
  const dayIndex = getDay(d);

  if (dayIndex === 0) return 6;

  return dayIndex - 1;
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
    rangeHoursOpenedDay[valueEndHour].hour
  );

  return { ...data, [day]: getHeatmapDataDayNewContent(data, day, range) };
};

const setSideBySideDayTimeRange = (data, start, end, times) => {
  const { startTime, endTime } = times;

  const valueStartHour = getHour(startTime);
  const valueEndHour = getHour(endTime);

  const rangeStart = _.range(rangeHoursOpenedDay[valueStartHour].hour, maxHour + 1);
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

  if (indexDayStart === indexDayEnd) {
    daysSelectedOrder = _.range(0, 7);
  }

  return daysSelectedOrder.reduce((acc, cur) => {
    let rangeUsed = rangeFull;

    if (cur === indexDayStart) {
      rangeUsed = rangeStart;
    }

    if (cur === indexDayEnd) {
      if (indexDayStart === indexDayEnd) {
        rangeUsed = [...rangeEnd, ...rangeStart];
      } else {
        rangeUsed = rangeEnd;
      }
    }

    return {
      ...acc,
      [cur]: getHeatmapDataDayNewContent(data, cur, rangeUsed),
    };
  }, data);
};

const setAll = (data) =>
  daysOrder.reduce(
    (acc, cur, i) => ({
      ...acc,
      [i]: getHeatmapDataDayNewContent(data, i, _.range(minHour, maxHour + 1)),
    }),
    data
  );

const typeMono = (dateRange, times, data) => {
  const { startDate, endDate } = dateRange;

  const sameDay = isSameDay(startDate, endDate);

  const indexDayStart = getMappedDay(new Date(startDate));

  if (sameDay) return setSameDayTimeRange(data, indexDayStart, times);

  const diff = differenceInDays(endDate, startDate);

  if (diff >= 7) {
    return setAll(data);
  }

  const indexDayEnd = getMappedDay(new Date(endDate));

  if (diff === 0) return setSideBySideDayTimeRange(data, indexDayStart, indexDayEnd, times);

  if (diff === 6) {
    const { startTime, endTime } = times;

    const valueStartHour = getHour(startTime);
    const valueEndHour = getHour(endTime);

    if (valueEndHour >= valueStartHour - 1) {
      return setAll(data);
    }
  }

  return setContinuesDayRange(data, indexDayStart, indexDayEnd, times);
};

export const getFormatedEndDate = (value, struct, times) => {
  const len = times.length;

  const endingHour = times[len - 1].endTime;

  const endingIndexHeatmap = getHour(endingHour);

  const isEndedNextDay = rangeHoursOpenedDay[endingIndexHeatmap].isNext ?? false;

  if (isEndedNextDay) {
    const newDay = addDays(value, 1);

    return format(newDay, struct);
  }

  return format(value, struct);
};

const getWorkweek = (data, isWorkweek) => {
  const cData = [...data];

  if (!isWorkweek) {
    return cData;
  }

  const indexSaturday = cData.findIndex((n) => n === 6);

  if (indexSaturday > -1) {
    cData.splice(indexSaturday, 1);
  }

  const indexSunday = cData.findIndex((n) => n === 5);

  if (indexSunday > -1) {
    cData.splice(indexSunday, 1);
  }

  return cData;
};

const clearTimeSelected = (data) => {
  const clonedheatmapData = { ...data };

  Object.values(clonedheatmapData).forEach((objHeat, indexObjHeat) => {
    if (objHeat) {
      Object.keys(objHeat).forEach((num) => {
        if (objHeat[num].active) {
          delete clonedheatmapData[Object.keys(clonedheatmapData)[indexObjHeat]][num].active;
        }
      });
    }
  });

  return { ...data, ...clonedheatmapData };
};

const typeMulti = (
  data,
  dateRange,
  times,
  isWorkweek,
  isCustomdays,
  customisedDay,
  isEveryWeek,
  everyWeek
) => {
  const combinedTimesRange = times
    .map((t) => {
      const { startTime, endTime } = t;

      const valueStartHour = getHour(startTime);
      const valueEndHour = getHour(endTime);

      const range = _.range(
        rangeHoursOpenedDay[valueStartHour].hour,
        rangeHoursOpenedDay[valueEndHour].hour + (valueEndHour === maxHour + 1 ? 1 : 0)
      );

      return range;
    })
    .flat(1);

  if (isEveryWeek) {
    const day = everyWeek.replace('Every ', '').trim();

    const dayEveryWeekIndex =
      daysOrder.findIndex((v) => v.toLowerCase() === day.toLowerCase()) || 0;

    const newData = clearTimeSelected(data);

    if (dayEveryWeekIndex > -1 && daysOrder[dayEveryWeekIndex]) {
      return {
        ...newData,
        [dayEveryWeekIndex]: getHeatmapDataDayNewContent(
          newData,
          dayEveryWeekIndex,
          combinedTimesRange
        ),
      };
    }

    return newData;
  }

  if (isCustomdays) {
    const daysSelectedOrderCustom = customisedDay.map((v) =>
      daysOrder.findIndex((va) => v.toLowerCase() === va.toLowerCase())
    );

    const newData = clearTimeSelected(data);

    return daysSelectedOrderCustom.reduce(
      (acc, cur) => ({
        ...acc,
        [cur]: getHeatmapDataDayNewContent(newData, cur, combinedTimesRange),
      }),
      newData
    );
  }

  const { startDate, endDate } = dateRange;

  const indexDayStart = getMappedDay(new Date(startDate));
  const indexDayEnd = getMappedDay(new Date(endDate));

  let daysSelectedOrder = _.range(indexDayStart, indexDayEnd + 1);

  const diff = differenceInDays(new Date(endDate), new Date(startDate));

  if (diff === 0 && isSameDay(startDate, endDate)) {
    return getWorkweek([indexDayStart], isWorkweek).reduce(
      (acc, cur) => ({
        ...acc,
        [cur]: getHeatmapDataDayNewContent(data, cur, combinedTimesRange),
      }),
      data
    );
  }

  if (diff >= 7) {
    return getWorkweek(_.range(0, 7), isWorkweek).reduce(
      (acc, cur) => ({
        ...acc,
        [cur]: getHeatmapDataDayNewContent(data, cur, combinedTimesRange),
      }),
      data
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

  return getWorkweek(daysSelectedOrder, isWorkweek).reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: getHeatmapDataDayNewContent(data, cur, combinedTimesRange),
    }),
    data
  );
};

const heatmapSelected = (
  type,
  dateRange,
  times,
  data = [],
  isWorkweek = false,
  isCustomdays = false,
  customisedDay = [],
  isEveryWeek = false,
  everyWeek = ''
): THeatmapData['revenue' | 'orders'] | [] => {
  if (!times) {
    return [];
  }

  if (type === 'mono') return typeMono(dateRange, times[0], data);

  return typeMulti(
    data,
    dateRange,
    times,
    isWorkweek,
    isCustomdays,
    customisedDay,
    isEveryWeek,
    everyWeek
  );
};

export default heatmapSelected;
