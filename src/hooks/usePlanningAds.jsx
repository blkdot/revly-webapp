import { useMemo, useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';
import useApi from './useApi';
import useVendors from './useVendors';
import { useUserAuth } from '../contexts/AuthContext';

function usePlanningAds({ dateRange }) {
  const { vendors } = useVendors();
  const { vendorsObj } = vendors;
  const { getAds } = useApi();
  const [ads, setAds] = useState([]);
  const { user } = useUserAuth();

  const { data, isLoading, isError } = useQuery(['getAds', { dateRange, vendorsObj }], () =>
    getAds(
      {
        master_email: user.email,
        access_token: '',
        vendors: vendorsObj,
        start_date: dayjs(dateRange.startDate).format('YYYY-MM-DD'),
        end_date: dayjs(dateRange.endDate).format('YYYY-MM-DD'),
      },
      { enabled: Object.keys(vendorsObj).length > 0 },
    ),
  );

  useEffect(() => {
    if (isLoading || isError) return;

    setAds(data.data.ads);
  }, [isLoading, data, dateRange, JSON.stringify(vendorsObj)]);

  const values = useMemo(() => ({ ads, dateRange, isLoading }), [isLoading, ads, dateRange]);

  return values;
}

export default usePlanningAds;
