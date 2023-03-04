import { useQuery } from '@tanstack/react-query';
import { ApiError, fetcher } from 'api/utils';
import { useUser } from 'contexts';
import { useMemo } from 'react';
import { DatePeriod, prepareVendors, TVendorsObj } from 'types';

export const useMetrics = (period: DatePeriod, vendors: TVendorsObj) => {
  const user = useUser();

  const v = useMemo(() => prepareVendors(vendors), [vendors]);

  return useQuery<unknown, ApiError, any>(
    ['user', 'metricsv2', period, v],
    async () =>
      fetcher('/user/metricsv2', {
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
