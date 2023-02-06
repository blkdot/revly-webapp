import { timesAtom, itemMenuAtom, everyWeekAtom, customisedDayAtom, typeScheduleAtom, targetAudienceAtom } from 'store/marketingSetupAtom';
import { addMinutes, format, addHours } from 'date-fns';
import { useAtom } from 'jotai';

const itemMenuObj = {
  'Flash Deal': {
    discount: ['50%'],
    mov: ['0 AED', '10 AED'],
    type: 'flash-deals',
  },
  'Order more , save more': {
    discount: ['30%', '50%'],
    mov: ['60 AED'],
    type: 'groups',
  },
  'Restaurant Pick': {
    discount: ['20%', '25%', '30%', '35%', '40%', '45%', '50%'],
    mov: ['0 AED', '15 AED', '30 AED'],
    type: 'restaurant-picks',
  },
  'Free Items': {
    discount: ['100%'],
    mov: ['15 AED', '30 AED', '60 AED'],
    type: 'free-items',
  },
};

const targetAudienceObj = {
  'New customer': 'new_customers',
  'Deliveroo plus': 'subscribers',
  'Inactive customers': 'lapsed_customers',
};

const useMarketingSetup = () => {
  const [times] = useAtom(timesAtom);
  const [itemMenu] = useAtom(itemMenuAtom);
  const [everyWeek] = useAtom(everyWeekAtom);
  const [customisedDay] = useAtom(customisedDayAtom);
  const [typeSchedule] = useAtom(typeScheduleAtom);
  const [targetAudience] = useAtom(targetAudienceAtom);

  const setStartTimeFormat = (value: Date, offset = 0) =>
    new Date(
      null,
      null,
      null,
      Number(format(value, 'HH')),
      Number(format(new Date(addMinutes(value, offset)), 'mm')),
      null,
      null
    );

  const setEndTimeFormat = (value: Date) =>
    new Date(null, null, null, Number(format(new Date(addHours(value, 1)), 'HH')), 0);

  const isValidDate = (d) => d instanceof Date && !Number.isNaN(d);

  const getHourArr = (hour, fromZero = true) => {
    const arr = [];
    times.forEach((obj) => {
      if (
        isValidDate(obj[hour]) &&
        obj[hour] !== null &&
        !Number.isNaN(new Date(obj[hour]).getTime())
      ) {
        arr.push(format(obj[hour], fromZero ? 'HH:00' : 'HH:mm'));
      }
    });

    return arr;
  };

  const getDiscountMovType = (type: string) => itemMenuObj[itemMenu][type];

  const typeScheduleObj = {
    'Continues Offer': 'once',
    'Every Day': 'everyday',
    'Work Week': 'workweek',
    'Same day every week': everyWeek.toLowerCase().replace('every', '').split(' ').join(''),
    'Customised Days': customisedDay.toString().toLowerCase().replace(/,/g, '.'),
  };

  const getTypeSchedule = () => typeScheduleObj[typeSchedule] || 'now';

  const getTargetAudience = () => targetAudienceObj[targetAudience] || 'orders';

  const disableWeekends = (date) => date.getDay() === 0 || date.getDay() === 6;

  return {
    setStartTimeFormat,
    setEndTimeFormat,
    getHourArr,
    isValidDate,
    getDiscountMovType,
    getTargetAudience,
    getTypeSchedule,
    disableWeekends,
  };
};

export default useMarketingSetup;
