export const getAllDateSetup = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const date = new Date();
  const startLocal = startDate.toLocaleDateString();
  const endLocal = endDate.toLocaleDateString();
  const startGetDate = startDate.getDate();
  const endGetDate = endDate.getDate();
  const startGetDay = startDate.getDay();
  const endGetDay = endDate.getDay();
  const dateGetDate = date.getDate();
  const dateGetDay = date.getDay();
  const dateLocal = date.toLocaleDateString();

  return {
    startLocal,
    endLocal,
    startGetDate,
    endGetDate,
    startGetDay,
    endGetDay,
    dateGetDate,
    dateGetDay,
    dateLocal,
  };
};

export const countDaysOfWeekBetweenDates = (sDate: Date, eDate: Date) => {
  const startDate = new Date(sDate);
  const endDate = new Date(eDate);

  endDate.setDate(endDate.getDate() + 1);

  const daysOfWeekCount = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  };

  while (startDate < endDate) {
    daysOfWeekCount[startDate.getDay()] = daysOfWeekCount[startDate.getDay()] + 1;
    startDate.setDate(startDate.getDate() + 1);
  }

  return daysOfWeekCount;
};
export default getAllDateSetup;
