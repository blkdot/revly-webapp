import { useMemo, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import useApi from './useApi';
import useDate from './useDate';
import { useUserAuth } from '../contexts/AuthContext';

let fnDelays = null;
function usePlanningAds({ dateRange }) {
  const { vendors } = useDate();
  const { vendorsObj } = vendors;
  const { getAds } = useApi();
  const [ads, setAds] = useState([]);
  const { user } = useUserAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (Object.keys(vendorsObj).length < 1) return;

    clearTimeout(fnDelays);

    fnDelays = setTimeout(() => {
      setIsLoading(true);
      getAds({
        master_email: user.email,
        access_token: '',
        vendors: vendorsObj,
        start_date: dayjs(dateRange.startDate).format('YYYY-MM-DD'),
        end_date: dayjs(dateRange.endDate).format('YYYY-MM-DD'),
      }).then((res) => {
        setIsLoading(false);
        setAds(res.data.ads);
      });
    }, 500);
  }, [dateRange, JSON.stringify(vendorsObj)]);

  const values = useMemo(() => ({ ads, dateRange, isLoading }), [isLoading, ads, dateRange]);

  return values;
}

export default usePlanningAds;
