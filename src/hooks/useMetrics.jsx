import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import useApi from './useApi';
import useDate from './useDate';

function useMetrics() {
  const { leftDate, rightDate, vendorsContext } = useDate();
  const { getMetrics } = useApi();
  const [metricsLeft, setMetricsLeft] = useState([]);
  const [metricsRight, setMetricsRight] = useState([]);

  const handleRequest = (date, setMetrics) => {
    let isCancelled = false;
    const keys = Object.keys(vendorsContext);
    keys.forEach((name) => {
      if (vendorsContext[name].length === 0) {
        delete vendorsContext[name];
      }
    });
    getMetrics({
      master_email: 'chiekh.alloul@gmail.com',
      access_token: '',
      vendors: vendorsContext,
      start_date: dayjs(date.startDate).format('YYYY-MM-DD'),
      end_date: dayjs(date.endDate).format('YYYY-MM-DD'),
    }).then((data) => {
      if (!isCancelled) {
        const sorted = Object.keys(data.data.metrics)
          .sort()
          .reduce((accumulator, key) => {
            accumulator[key] = data.data.metrics[key];
            return accumulator;
          }, {});
        setMetrics(Object.entries(sorted));
      }
    });
    return () => {
      isCancelled = true;
    };
  };
  useMemo(() => {
    handleRequest(rightDate, setMetricsRight);
  }, [rightDate, vendorsContext]);

  useMemo(() => {
    handleRequest(leftDate, setMetricsLeft);
  }, [leftDate, vendorsContext]);

  return { metricsLeft, metricsRight };
}

export default useMetrics;
