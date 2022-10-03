import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import useApi from './useApi';
import useDate from './useDate';
import config from '../setup/config';
import { useUserAuth } from '../contexts/AuthContext';

function usePlanningAds({ dateRange }) {
  const { vendorsContext } = useDate();
  const { getAds } = useApi();
  const [ads, setAds] = useState([]);
  const { environment } = config;
  const { user } = useUserAuth();

  const handleRequest = () => {
    let isCancelled = false;
    getAds({
      master_email: environment !== 'dev' ? user.email : 'chiekh.alloul@gmail.com',
      access_token: '',
      vendors: vendorsContext,
      start_date: dayjs(dateRange.start).format('YYYY-MM-DD'),
      end_date: dayjs(dateRange.end).format('YYYY-MM-DD'),
    }).then((data) => {
      if (isCancelled) return;

      setAds(data.data.ads);
    });
    return () => {
      isCancelled = true;
    };
  };

  useMemo(() => {
    handleRequest();
  }, [dateRange, vendorsContext]);

  return { ads, dateRange };
}

export default usePlanningAds;
