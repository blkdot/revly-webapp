import { useMemo, useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';
import useApi from './useApi';
import useDate from './useDate';
import config from '../setup/config';
import { useUserAuth } from '../contexts/AuthContext';

function usePlanningOffers({ dateRange }) {
  const { vendors } = useDate();
  const { vendorsObj } = vendors;
  const { getOffers } = useApi();
  const [offers, setOffers] = useState([]);
  const { environment } = config;
  const { user } = useUserAuth();

  const { data, isLoading, isError } = useQuery(['getOffers', { dateRange, vendorsObj }], () =>
    getOffers(
      {
        master_email: environment !== 'dev' ? user.email : 'chiekh.alloul@gmail.com',
        access_token: '',
        vendors: vendorsObj,
        start_date: dayjs(dateRange.startDate).format('YYYY-MM-DD'),
        end_date: dayjs(dateRange.endDate).format('YYYY-MM-DD'),
      },
      { enabled: Object.keys(vendorsObj).length > 0 },
    ),
  );

  useEffect(() => {
    if (isLoading || isError || Object.keys(vendorsObj).length < 1) return;

    setOffers(data.data.offers);
  }, [isLoading, data, dateRange, JSON.stringify(vendorsObj)]);

  const values = useMemo(() => ({ offers, dateRange, isLoading }), [isLoading, offers, dateRange]);

  return values;
}

export default usePlanningOffers;
