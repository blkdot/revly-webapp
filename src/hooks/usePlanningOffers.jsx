import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import useApi from './useApi';
import useDate from './useDate';
import config from '../setup/config';
import { useUserAuth } from '../contexts/AuthContext';

function usePlanningOffers({ dateRange }) {
  const { vendors } = useDate();
  const { vendorsObj } = vendors;
  const { getOffers } = useApi();
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { environment } = config;
  const { user } = useUserAuth();

  const reloadRequest = () => handleRequest();

  const handleRequest = () => {
    let isCancelled = false;
    setIsLoading(true);
    delete vendorsObj.display;
    getOffers({
      master_email: environment !== 'dev' ? user.email : 'chiekh.alloul@gmail.com',
      access_token: '',
      vendors: vendorsObj,
      start_date: dayjs(dateRange.startDate).format('YYYY-MM-DD'),
      end_date: dayjs(dateRange.endDate).format('YYYY-MM-DD'),
    }).then((data) => {
      setIsLoading(false);
      if (isCancelled) return;

      setOffers(data.data.offers);
    });
    return () => {
      isCancelled = true;
    };
  };

  useMemo(() => {
    if (Object.keys(vendorsObj).length !== 0) {
      handleRequest();
    }
  }, [dateRange, vendors]);

  return { offers, dateRange, reloadRequest, isLoading };
}

export default usePlanningOffers;
