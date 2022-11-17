export const rangeHoursOpenedDay = {
  5: { hour: 5, value: 5, label: '5 AM' },
  6: { hour: 6, value: 6, label: '6 AM' },
  7: { hour: 7, value: 7, label: '7 AM' },
  8: { hour: 8, value: 8, label: '8 AM' },
  9: { hour: 9, value: 9, label: '9 AM' },
  10: { hour: 10, value: 10, label: '10 AM' },
  11: { hour: 11, value: 11, label: '11 AM' },
  12: { hour: 12, value: 12, label: '12 AM' },
  13: { hour: 13, value: 13, label: '13 PM' },
  15: { hour: 15, value: 15, label: '15 PM' },
  16: { hour: 16, value: 16, label: '16 PM' },
  17: { hour: 17, value: 17, label: '17 PM' },
  18: { hour: 18, value: 18, label: '18 PM' },
  19: { hour: 19, value: 19, label: '19 PM' },
  20: { hour: 20, value: 20, label: '20 PM' },
  21: { hour: 21, value: 21, label: '21 PM' },
  22: { hour: 22, value: 22, label: '22 PM' },
  23: { hour: 23, value: 23, label: '23 PM' },
  24: { hour: 24, value: 0, label: '00 AM' },
  25: { hour: 25, value: 1, label: '1 AM' },
  26: { hour: 26, value: 2, label: '2 AM' },
  27: { hour: 27, value: 3, label: '3 AM' },
  28: { hour: 28, value: 4, label: '4 AM' },
};

export const maxHour = 28;
export const minHour = 5;

export const rangeHoursOpenedDayObj = () =>
  rangeHoursOpenedDay.reduce((acc, cur) => ({ ...acc, [cur.hour]: cur }), {});

export const daysOrder = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const daysObject = {
  Sunday: [],
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
};
