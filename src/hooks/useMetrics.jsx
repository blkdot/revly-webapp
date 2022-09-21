import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import useApi from './useApi';
import useDate from './useDate';

function useMetrics() {
  const { leftDate, restaurants, rightDate } = useDate();
  const { getMetrics } = useApi();
  const [metricsLeft, setMetricsLeft] = useState([]);
  const [metricsRight, setMetricsRight] = useState([]);

  const handleRequest = (date, setMetrics) => {
    let isCancelled = false;
    getMetrics({
      master_email: 'chiekh.alloul@gmail.com',
      access_token: '',
      vendors: restaurants,
      start_date: dayjs(date.startDate).format('YYYY-MM-DD'),
      end_date: dayjs(date.endDate).format('YYYY-MM-DD'),
    }).then((data) => {
      if (!isCancelled) {
        setMetrics(Object.entries(data.data.metrics));
      }
    });
    return () => {
      isCancelled = true;
    };
  };
  useMemo(() => {
    handleRequest(rightDate, setMetricsRight);
  }, [rightDate, restaurants]);

  useMemo(() => {
    handleRequest(leftDate, setMetricsLeft);
  }, [leftDate, restaurants]);

  return { metricsLeft, metricsRight };
}

export default useMetrics;
