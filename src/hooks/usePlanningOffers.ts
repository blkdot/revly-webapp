import { useQuery } from '@tanstack/react-query';
import { ApiError, fetcher } from 'api/utils';
import { useUser } from 'contexts';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { vendorsAtom } from 'store/vendorsAtom';
import { DatePeriod, prepareVendors } from 'types';

export const usePlanningOffers = (period: DatePeriod) => {
  const user = useUser();
  const [vendors] = useAtom(vendorsAtom);
  const { vendorsObj } = vendors;

  const v = useMemo(() => prepareVendors(vendorsObj), [vendorsObj]);

  return useQuery<unknown, ApiError, any>(
    ['planning', 'offersv3', period, v],
    async () =>
      fetcher('/planning/offersv3', {
        master_email: user.email,
        vendors: v,
        start_date: period.from.format('YYYY-MM-DD'),
        end_date: period.until.format('YYYY-MM-DD'),
      }),
    {
      enabled: Object.keys(v).length > 0,
    }
  );
};
