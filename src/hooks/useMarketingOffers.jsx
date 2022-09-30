import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import useApi from './useApi';
import useDate from './useDate';

function useMarketingOffers() {
  const { compareDateValueOffers, restaurants } = useDate();
  const { getOffers } = useApi();
  const [offers, setOffers] = useState([]);
  const handleRequest = () => {
    let isCancelled = false;
    getOffers({
      master_email: 'chiekh.alloul@gmail.com',
      access_token: '',
      vendors: restaurants,
      start_date: dayjs(compareDateValueOffers.startDate).format('YYYY-MM-DD'),
      end_date: dayjs(compareDateValueOffers.endDate).format('YYYY-MM-DD'),
    }).then((data) => {
      const offersArr = [];
      if (!isCancelled) {
        data.data.offers?.forEach((obj) => offersArr.push({ ...obj, id: Math.random() }));
      }
      setOffers(offersArr);
    });
    return () => {
      isCancelled = true;
    };
  };

  useMemo(() => {
    handleRequest();
  }, [compareDateValueOffers, restaurants]);

  return { offers };
}

export default useMarketingOffers;
