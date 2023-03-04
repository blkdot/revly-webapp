import { useQuery } from '@tanstack/react-query';
import { ApiError, fetcher } from 'api/hooks';
import { useUser } from 'contexts';
import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import { vendorsAtom } from 'store/vendorsAtom';

type DateRange = {
  startDate: Date;
  endDate: Date;
};

export const usePlanningOffersNew = (range: DateRange) => {
  const [vendors] = useAtom(vendorsAtom);
  const { vendorsObj } = vendors;
  const user = useUser();
  const newVendorsObj = {};
  Object.keys(vendorsObj).forEach((plat) => {
    newVendorsObj[plat] = vendorsObj[plat].filter((obj) => obj.metadata.is_active);
  });

  Object.keys(newVendorsObj).forEach((plat) => {
    if (newVendorsObj[plat].length === 0 || plat === 'display') {
      delete newVendorsObj[plat];
    }
  });

  return useQuery<any, ApiError, any>(
    ['planning', 'offersv3', range, newVendorsObj],
    async () =>
      fetcher('/planning/offersv3', {
        master_email: user.email,
        vendors: newVendorsObj,
        start_date: dayjs(range.startDate).format('YYYY-MM-DD'),
        end_date: dayjs(range.endDate).format('YYYY-MM-DD'),
      }),
    {
      enabled: Object.keys(vendorsObj).length > 0,
    }
  );
};
