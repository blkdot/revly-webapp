import selectedVendors from 'components/restaurantDropdown/selectedVendors';
import { vendorsSorter } from 'components/vendorsDropdown/adapter/VendorsDropdownAdapter';
import { addHours, addMinutes, format } from 'date-fns';
import { useAtom } from 'jotai';
import { elligibilityDeliverooAtom } from 'store/eligibilityDeliveroo';
import {
  branchAtom,
  customisedDayAtom,
  everyWeekAtom,
  itemMenuAtom,
  targetAudienceAtom,
  timesAtom,
  typeScheduleAtom,
} from 'store/marketingSetupAtom';
import { TDisplayVendor } from 'types';
import useVendors from './useVendors';

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

// const itemMenuObj = {
//   'Flash Deal': {
//     discount: ['50%'],
//     mov: ['0 AED', '10 AED'],
//     type: 'flash-deals',
//   },
//   'Order more , save more': {
//     discount: ['30%', '50%'],
//     mov: ['60 AED'],
//     type: 'groups',
//   },
//   'Restaurant Pick': {
//     discount: ['20%', '25%', '30%', '35%', '40%', '45%', '50%'],
//     mov: ['0 AED', '15 AED', '30 AED'],
//     type: 'restaurant-picks',
//   },
//   'Free Items': {
//     discount: ['100%'],
//     mov: ['15 AED', '30 AED', '60 AED'],
//     type: 'free-items',
//   },
//   'Free Delivery': {
//     mov: ['0 AED', '30 AED', '50 AED', '75 AED', '100 AED', '125 AED'],
//     type: 'free-delivery',
//   },
//  'Buy-One-Get-One': {
//     mov: ['15 AED', '30 AED', '60 AED'],
//     type: '"buy-one-get-one-free"',
//  }
// };

// DON'T SHOW `DELIVEROO PLUS` IN AUDIENCE WHEN `FREE DELIVERY` IS SELECTED

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

  const setEndTimeFormat = (value: Date, increment = false) =>
    new Date(
      null,
      null,
      null,
      Number(format(new Date(addHours(value, increment ? 1 : 0)), 'HH')),
      0
    );

  const isValidDate = (d: Date) => d instanceof Date && !Number.isNaN(d);

  const getHourArr = (hour: 'startTime' | 'endTime', fromZero = true): string[] => {
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

  const getDiscountMovType = (type: 'discount' | 'mov' | 'type'): string | string[] =>
    itemMenuObj[itemMenu][type];

  const typeScheduleObj = {
    'Continues Offer': 'once',
    'Every Day': 'everyday',
    'Work Week': 'workweek',
    'Same day every week': everyWeek.toLowerCase().replace('every', '').split(' ').join(''),
    'Customised Days': customisedDay.toString().toLowerCase().replace(/,/g, '.'),
  };

  const getTypeSchedule = (): string => typeScheduleObj[typeSchedule] || 'now';

  const getTargetAudience = (): string => targetAudienceObj[targetAudience] || 'orders';

  const disableWeekends = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

  const [elligibilityDeliverooState] = useAtom(elligibilityDeliverooAtom);
  const { vendors } = useVendors();
  const [branch, setBranch] = useAtom(branchAtom);

  const setVendors = (platform: string[]) => {
    const vendorsObjTemp = {};
    const displayTemp = JSON.parse(JSON.stringify(vendors.display));
    let counter = 0;
    let defaultSelection = null;

    Object.keys(displayTemp)
      .sort(vendorsSorter)
      .forEach((chainName) => {
        Object.keys(displayTemp[chainName]).forEach((vendorName) => {
          displayTemp[chainName][vendorName].checked =
            branch?.display?.[chainName]?.[vendorName]?.checked || false;
          if (platform.length > 1 && !displayTemp[chainName][vendorName].is_matched) {
            displayTemp[chainName][vendorName].active = true;
            displayTemp[chainName][vendorName].checked = false;
          } else {
            const platformsDisplay = Object.keys(displayTemp[chainName][vendorName].platforms);
            platformsDisplay.forEach((platformV) => {
              displayTemp[chainName][vendorName].active = true;

              if (
                platformV?.toLocaleLowerCase() === 'deliveroo' &&
                platform.includes('deliveroo')
              ) {
                const vId = displayTemp[chainName][vendorName].platforms[platformV].vendor_id;

                const exists = elligibilityDeliverooState?.[vId];

                if (!exists) {
                  if (platform.length === 1) {
                    displayTemp[chainName][vendorName].active = false;
                    displayTemp[chainName][vendorName].checked = false;
                    return;
                  }

                  if (Object.keys(displayTemp[chainName][vendorName].platforms).length === 2) {
                    displayTemp[chainName][vendorName].platforms.deliveroo.metadata.is_active =
                      false;

                    return;
                  }

                  displayTemp[chainName][vendorName].active = false;
                  displayTemp[chainName][vendorName].checked = false;
                  return;
                }
              }

              if (platform[0] !== platformV && !displayTemp[chainName][vendorName].is_matched) {
                displayTemp[chainName][vendorName].active = false;
                displayTemp[chainName][vendorName].checked = false;
              }

              if (
                !displayTemp[chainName][vendorName].platforms[platform[0]]?.metadata.is_active &&
                platform.length === 1
              ) {
                displayTemp[chainName][vendorName].active = false;
                displayTemp[chainName][vendorName].checked = false;
              }

              if (!platform.includes(platformV)) {
                displayTemp[chainName][vendorName].platforms[platformV].metadata.is_active = false;
              }
            });

            if (platform.length === 1) {
              platform.forEach((p) => {
                if (!platformsDisplay.includes(p)) {
                  displayTemp[chainName][vendorName].active = false;
                  displayTemp[chainName][vendorName].checked = false;
                }
              });
            }

            if (displayTemp[chainName][vendorName].active && !defaultSelection) {
              defaultSelection = {
                chainName,
                vendorName,
              };
            }

            if (displayTemp[chainName][vendorName].checked) {
              counter += 1;
            }
          }
        });
      });

    if (counter === 0 && defaultSelection?.chainName && defaultSelection?.vendorName) {
      displayTemp[defaultSelection?.chainName][defaultSelection?.vendorName].checked = true;
    }
    platform.forEach((plat) => {
      vendorsObjTemp[plat] = selectedVendors('full', displayTemp, plat);
    });

    setBranch({
      ...vendors,
      display: displayTemp,
      vendorsObj: vendorsObjTemp,
    });
  };

  return {
    setStartTimeFormat,
    setEndTimeFormat,
    getHourArr,
    isValidDate,
    getDiscountMovType,
    getTargetAudience,
    getTypeSchedule,
    disableWeekends,
    setVendors,
  };
};

export default useMarketingSetup;
