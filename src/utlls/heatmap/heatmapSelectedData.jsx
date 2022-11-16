export const rangeHoursOpenedDay = [
  { hour: 5, value: 5, label: '5 AM' },
  { hour: 6, value: 6, label: '6 AM' },
  { hour: 7, value: 7, label: '7 AM' },
  { hour: 8, value: 8, label: '8 AM' },
  { hour: 9, value: 9, label: '9 AM' },
  { hour: 10, value: 10, label: '10 AM' },
  { hour: 11, value: 11, label: '11 AM' },
  { hour: 12, value: 12, label: '12 AM' },
  { hour: 13, value: 13, label: '13 PM' },
  { hour: 15, value: 15, label: '15 PM' },
  { hour: 16, value: 16, label: '16 PM' },
  { hour: 17, value: 17, label: '17 PM' },
  { hour: 18, value: 18, label: '18 PM' },
  { hour: 19, value: 19, label: '19 PM' },
  { hour: 20, value: 20, label: '20 PM' },
  { hour: 21, value: 21, label: '21 PM' },
  { hour: 22, value: 22, label: '22 PM' },
  { hour: 23, value: 23, label: '23 PM' },
  { hour: 24, value: 0, label: '00 AM' },
  { hour: 25, value: 1, label: '1 AM' },
  { hour: 26, value: 2, label: '2 AM' },
  { hour: 27, value: 3, label: '3 AM' },
  { hour: 28, value: 4, label: '4 AM' },
];

export const rangeHoursOpenedDayObj = () =>
  rangeHoursOpenedDay.reduce((acc, cur) => ({ ...acc, [cur.value]: cur }), {});

export const daysOrder = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
