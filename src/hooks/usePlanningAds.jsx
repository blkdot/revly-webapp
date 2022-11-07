import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import useApi from './useApi';
import useDate from './useDate';
import config from '../setup/config';
import { useUserAuth } from '../contexts/AuthContext';

function usePlanningAds({ dateRange }) {
  const { vendors } = useDate();
  const { vendorsObj } = vendors;
  const { getAds } = useApi();
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { environment } = config;
  const { user } = useUserAuth();

  const handleRequest = () => {
    let isCancelled = false;
    setIsLoading(true);
    getAds({
      master_email: environment !== 'dev' ? user.email : 'chiekh.alloul@gmail.com',
      access_token: '',
      vendors: vendorsObj,
      start_date: dayjs(dateRange.startDate).format('YYYY-MM-DD'),
      end_date: dayjs(dateRange.endDate).format('YYYY-MM-DD'),
    }).then((data) => {
      setIsLoading(false);
      if (isCancelled) return;

      setAds(data.data.ads);
    });
    return () => {
      isCancelled = true;
    };
  };

  useMemo(() => {
    handleRequest();
  }, [dateRange, vendors]);

  return { ads, dateRange, isLoading };
}

export default usePlanningAds;
