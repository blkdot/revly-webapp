import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import useApi from './useApi';
import useDate from './useDate';
import config from '../setup/config';
import { useUserAuth } from '../contexts/AuthContext';

function usePlanningOffers({ dateRange }) {
  const { vendorsContext } = useDate();
  const { getOffers } = useApi();
  const [offers, setOffers] = useState([]);
  const { environment } = config;
  const { user } = useUserAuth();

  const reloadRequest = () => handleRequest();

  const handleRequest = () => {
    let isCancelled = false;
    getOffers({
      master_email: environment !== 'dev' ? user.email : 'chiekh.alloul@gmail.com',
      access_token: '',
      vendors: vendorsContext,
      start_date: dayjs(dateRange.start).format('YYYY-MM-DD'),
      end_date: dayjs(dateRange.end).format('YYYY-MM-DD'),
    }).then((data) => {
      if (isCancelled) return;

      setOffers(data.data.offers);
    });
    return () => {
      isCancelled = true;
    };
  };

  useMemo(() => {
    handleRequest();
  }, [dateRange, vendorsContext]);

  return { offers, dateRange, reloadRequest };
}

export default usePlanningOffers;
