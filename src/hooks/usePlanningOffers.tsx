import { useQuery } from '@tanstack/react-query';
import { ApiError, fetcher } from 'api/hooks';
import { useUser } from 'contexts';
import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { vendorsAtom } from 'store/vendorsAtom';
import useApi from './useApi';

let fnDelays = null;
function usePlanningOffers({ dateRange }) {
  const [vendors] = useAtom(vendorsAtom);
  const { vendorsObj } = vendors;
  const { getOffers } = useApi();
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    if (Object.keys(newVendorsObj).length === 0) {
      setIsLoading(false);
      return;
    }

    clearTimeout(fnDelays);
    setIsLoading(true);
    fnDelays = setTimeout(() => {
      getOffers({
        master_email: user.email,
        access_token: '',
        vendors: newVendorsObj,
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
