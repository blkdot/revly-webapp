import type { TVendors } from 'hooks/useVendors';
import { atom } from 'jotai';
import { addDays, addHours, addMinutes, endOfWeek, format, startOfWeek, subWeeks } from 'date-fns';

// The list of active platform to show on the first screen
export const platformAtom = atom<string[]>([]);

// The selected screen during offer trigger
export const selectedAtom = atom(1);

// Type of data to show on the heatmap
export const linkAtom = atom('revenue');

// Type of menu
export const menuAtom = atom('Offer on the whole Menu');

export const discountPercentageAtom = atom('');

export const minOrderPercentageAtom = atom('');

// Type of duration
export const durationAtom = atom('Starting Now');

export const disabledAtom = atom(false);

export const triggerLoadingAtom = atom(false);

export const beforePeriodBtnAtom = atom({
  startDate: startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
  endDate: endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
});

export const categoryDataListAtom = atom<string[]>([]);
export const branchAtom = atom<TVendors | Record<string, never>>({});
export const categoryDataAtom = atom<string[]>([]);

export const startingDateAtom = atom(new Date());
export const endingDateAtom = atom(new Date(addDays(new Date(new Date()), 1)));

export const typeScheduleAtom = atom('Continues Offer');

export const disabledDateAtom = atom(true);

export const customisedDayAtom = atom<string[]>([
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]);

export const timesAtom = atom([
  {
    startTime: new Date(
      null,
      null,
      null,
      Number(format(new Date(), 'HH')),
      Number(format(new Date(addMinutes(new Date(), 2)), 'mm')),
      null,
      null
    ),
    endTime: new Date(null, null, null, Number(format(addHours(new Date(), 1), 'HH')), 0),
    pos: 1,
  },
]);

export const everyWeekAtom = atom('');

export const itemMenuAtom = atom('');

export type TCategoryAtom = {
  id?: string | number;
  item_id: string | number;
  name?: string;
  item_name: string;
  price?: number;
  unit_price: number;
  metadata: {
    drn_id: string;
  };
  category_name: string;
  category: string;
};
export const categoryAtom = atom<TCategoryAtom[]>([]);

export const filteredCategoryDataAtom = atom<TCategoryAtom[]>([]);

export const targetAudienceAtom = atom('All customers');

export const createdAtom = atom(false);

export const recapAtom = atom(false);

export const launchOrderAtom = atom([
  { order: '# of orders', arrow: '<', number: '', id: 1, reletion: 'And' },
]);

export const stopOrderAtom = atom([
  { order: '# of orders', arrow: '>', number: '', id: 1, reletion: 'And' },
]);

export const stepsAtom = atom([0, 1, 2, 3, 4]);

export const checkedAtom = atom<string[]>([]);

export const categoryLoadingAtom = atom(false);

export const smRuleAtom = atom(false);

export const categorySearchAtom = atom('');

export const defaultHeatmapState = { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {} };

export type TOfferDataResponse = {
  data: { x_accrued_intra_day: number; x_percentage_intra_day: number; x_timeslot: number };
  color: string;
  value: number;
};

export type THeatmapData = {
  revenue: {
    0?: {
      [x: number]: TOfferDataResponse;
      active?: boolean;
    };
    1?: {
      [x: number]: TOfferDataResponse;
      active?: boolean;
    };
    2?: {
      [x: number]: TOfferDataResponse;
      active?: boolean;
    };
    3?: {
      [x: number]: TOfferDataResponse;
      active?: boolean;
    };
    4?: {
      [x: number]: TOfferDataResponse;
      active?: boolean;
    };
    5?: {
      [x: number]: TOfferDataResponse;
      active?: boolean;
    };
    6?: {
      [x: number]: TOfferDataResponse;
      active?: boolean;
    };
  };
  orders: {
    0?: {
      [x: number]: TOfferDataResponse;
      active?: boolean;
    };
    1?: {
      [x: number]: TOfferDataResponse;
      active?: boolean;
    };
    2?: {
      [x: number]: TOfferDataResponse;
      active?: boolean;
    };
    3?: {
      [x: number]: TOfferDataResponse;
      active?: boolean;
    };
    4?: {
      [x: number]: TOfferDataResponse;
      active?: boolean;
    };
    5?: {
      [x: number]: TOfferDataResponse;
      active?: boolean;
    };
    6?: {
      [x: number]: TOfferDataResponse;
      active?: boolean;
    };
  };
};

export const heatmapDataAtom = atom<THeatmapData>({
  revenue: defaultHeatmapState,
  orders: defaultHeatmapState,
});
