import { useMemo, useState, useEffect } from 'react';

import dayjs from 'dayjs';
import useApi from './useApi';
import useDate from './useDate';
import { useUserAuth } from '../contexts/AuthContext';

let fnDelays = null;
function usePlanningOffers({ dateRange }) {
  const { vendors } = useDate();
  const { vendorsObj } = vendors;
  const { getOffers } = useApi();
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUserAuth();

  useEffect(() => {
    if (Object.keys(vendorsObj).length < 1) return;

    clearTimeout(fnDelays);

    fnDelays = setTimeout(() => {
      setIsLoading(true);
      getOffers({
        master_email: user.email,
        access_token: '',
        vendors: vendorsObj,
        start_date: dayjs(dateRange.startDate).format('YYYY-MM-DD'),
        end_date: dayjs(dateRange.endDate).format('YYYY-MM-DD'),
      }).then((res) => {
        setIsLoading(false);
        setOffers(res.data.offers);
      });
    }, 750);
  }, [dateRange, JSON.stringify(vendorsObj)]);

  const values = useMemo(() => ({ offers, dateRange, isLoading }), [offers, dateRange, isLoading]);

  return values;
}

export default usePlanningOffers;
