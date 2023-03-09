type TDaysObject = {
  Sunday: any[];
  Monday: any[];
  Tuesday: any[];
  Wednesday: any[];
  Thursday: any[];
  Friday: any[];
  Saturday: any[];
};

export const rangeHoursOpenedDay = {
  0: { hour: 0, value: 0, label: '12AM', isNext: false },
  1: { hour: 1, value: 1, label: '1AM', isNext: false },
  2: { hour: 2, value: 2, label: '2AM', isNext: false },
  3: { hour: 3, value: 3, label: '3AM', isNext: false },
  4: { hour: 4, value: 4, label: '4AM', isNext: false },
  5: { hour: 5, value: 5, label: '5AM', isNext: false },
  6: { hour: 6, value: 6, label: '6AM', isNext: false },
  7: { hour: 7, value: 7, label: '7AM', isNext: false },
  8: { hour: 8, value: 8, label: '8AM', isNext: false },
  9: { hour: 9, value: 9, label: '9AM', isNext: false },
  10: { hour: 10, value: 10, label: '10AM', isNext: false },
  11: { hour: 11, value: 11, label: '11AM', isNext: false },
  12: { hour: 12, value: 12, label: '12PM', isNext: false },
  13: { hour: 13, value: 13, label: '13PM', isNext: false },
  14: { hour: 14, value: 14, label: '14PM', isNext: false },
  15: { hour: 15, value: 15, label: '15PM', isNext: false },
  16: { hour: 16, value: 16, label: '16PM', isNext: false },
  17: { hour: 17, value: 17, label: '17PM', isNext: false },
  18: { hour: 18, value: 18, label: '18PM', isNext: false },
  19: { hour: 19, value: 19, label: '19PM', isNext: false },
  20: { hour: 20, value: 20, label: '20PM', isNext: false },
  21: { hour: 21, value: 21, label: '21PM', isNext: false },
  22: { hour: 22, value: 22, label: '22PM', isNext: false },
  23: { hour: 23, value: 23, label: '23PM', isNext: false },
  24: { hour: 24, value: 0, label: '24PM', isNext: false },
  25: { hour: 25, value: 1, label: 'J+1 1AM', isNext: true },
  26: { hour: 26, value: 2, label: 'J+1 2AM', isNext: true },
  27: { hour: 27, value: 3, label: 'J+1 3AM', isNext: true },
  28: { hour: 28, value: 4, label: 'J+1 4AM', isNext: true },
};

export const maxHour = 27;
export const minHour = 5;

export const daysOrder = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const daysObject: TDaysObject = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: [],
};
