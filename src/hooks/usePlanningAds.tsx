import { useQuery } from '@tanstack/react-query';
import { ApiError, fetcher } from 'api/hooks';
import { useUser } from 'contexts';
import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { vendorsAtom } from 'store/vendorsAtom';
import useApi from './useApi';

let fnDelays = null;
function usePlanningAds({ dateRange }) {
  const [vendors] = useAtom(vendorsAtom);
  const { vendorsObj } = vendors;
  const { getAds } = useApi();
  const [ads, setAds] = useState([]);
  const user = useUser();
  const [isLoading, setIsLoading] = useState(true);
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

    setIsLoading(true);

    clearTimeout(fnDelays);

    fnDelays = setTimeout(() => {
      getAds({
        master_email: user.email,
        access_token: '',
        vendors: newVendorsObj,
        start_date: dayjs(dateRange.startDate).format('YYYY-MM-DD'),
        end_date: dayjs(dateRange.endDate).format('YYYY-MM-DD'),
      }).then((res) => {
        setAds(res?.data?.ads || []);
        setIsLoading(false);
      });
    }, 750);
  }, [dateRange, JSON.stringify(vendorsObj)]);

  const values = useMemo(() => ({ ads, dateRange, isLoading }), [isLoading, ads, dateRange]);

  return values;
}

export default usePlanningAds;

type DateRange = {
  startDate: Date;
  endDate: Date;
};

export const usePlanningAdsNew = (range: DateRange) => {
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
    ['planning', 'adsv3', range, newVendorsObj],
    async () =>
      fetcher('/planning/adsv3', {
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
