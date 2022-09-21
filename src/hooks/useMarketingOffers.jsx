import { subDays } from 'date-fns';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import useApi from './useApi';
import useDate from './useDate';

function useMarketingOffers() {
  const { leftDateOffers, restaurants } = useDate();
  const { getOffers } = useApi();
  const [offers, setOffers] = useState([]);
  const handleRequest = (date) => {
    let isCancelled = false;
    getOffers({
      master_email: 'chiekh.alloul@gmail.com',
      access_token: '',
      vendors: restaurants,
      start_date: dayjs(subDays(date.startDate, 1)).format('YYYY-MM-DD'),
      end_date: dayjs(subDays(date.endDate, 1)).format('YYYY-MM-DD'),
    }).then((data) => {
      if (!isCancelled) {
        setOffers(data.data.offers);
      }
    });
    return () => {
      isCancelled = true;
    };
  };

  useMemo(() => {
    handleRequest(leftDateOffers);
  }, [leftDateOffers, restaurants]);

  return { offers };
}

export default useMarketingOffers;
