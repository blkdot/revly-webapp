import { useQuery } from '@tanstack/react-query';
import { ApiError, fetcher } from 'api/hooks';
import { useUserAuth } from 'contexts';
import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { vendorsAtom } from '../store/vendorsAtom';
import useApi from './useApi';

let fnDelays = null;
function usePlanningOffers({ dateRange }) {
  const [vendors] = useAtom(vendorsAtom);
  const { vendorsObj } = vendors;
  const { getOffers } = useApi();
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUserAuth();

  useEffect(() => {
    if (Object.keys(vendorsObj).length < 1) return;
    setIsLoading(true);
    clearTimeout(fnDelays);
    setIsLoading(true);
    fnDelays = setTimeout(() => {
      getOffers({
        master_email: user.email,
        access_token: '',
        vendors: vendorsObj,
        start_date: dayjs(dateRange.startDate).format('YYYY-MM-DD'),
        end_date: dayjs(dateRange.endDate).format('YYYY-MM-DD'),
      }).then((res) => {
        setOffers(res.data.offers);
        setIsLoading(false);
      });
    }, 750);
  }, [dateRange, JSON.stringify(vendorsObj)]);

  const values = useMemo(() => ({ offers, dateRange, isLoading }), [offers, dateRange, isLoading]);

  return values;
}

export default usePlanningOffers;

type DateRange = {
  startDate: any;
  endDate: any;
};

export const usePlanningOffersNew = (range: DateRange) => {
  const [vendors] = useAtom(vendorsAtom);
  const { vendorsObj } = vendors;
  const { user } = useUserAuth();

  return useQuery<any, ApiError, any>(
    ['planning', 'offersv3', range, vendorsObj],
    async () =>
      fetcher('/planning/offersv3', {
        master_email: user.email,
        vendors: vendorsObj,
        start_date: dayjs(range.startDate).format('YYYY-MM-DD'),
        end_date: dayjs(range.endDate).format('YYYY-MM-DD'),
      }),
    {
      enabled: Object.keys(vendorsObj).length > 0,
    }
  );
};
