import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import useApi from './useApi';
import useDate from './useDate';
import config from '../setup/config';
import { useUserAuth } from '../contexts/AuthContext';

function useMetrics() {
  const { date: dateContext, vendorsContext } = useDate();
  const { dateFrom, compareDateValue } = dateContext;
  const { getMetrics } = useApi();
  const [metricsDateFrom, setMetricsDateFrom] = useState([]);
  const [metricsCompareDateValue, setMetricsCompareDateValue] = useState([]);
  const { environment } = config;
  const { user } = useUserAuth();

  const handleRequest = (date, setMetrics) => {
    let isCancelled = false;
    const keys = Object.keys(vendorsContext);
    keys.forEach((name) => {
      if (!vendorsContext[name] || vendorsContext[name].length === 0) {
        delete vendorsContext[name];
      }
    });
    getMetrics({
      master_email: environment !== 'dev' ? user.email : 'chiekh.alloul@gmail.com',
      access_token: '',
      vendors: vendorsContext,
      start_date: dayjs(date.startDate).format('YYYY-MM-DD'),
      end_date: dayjs(date.endDate).format('YYYY-MM-DD'),
    }).then((data) => {
      if (isCancelled) return;

      setMetrics(data.data.metrics);
    });
    return () => {
      isCancelled = true;
    };
  };
  useMemo(() => {
    handleRequest(compareDateValue, setMetricsCompareDateValue);
  }, [compareDateValue, vendorsContext]);

  useMemo(() => {
    handleRequest(dateFrom, setMetricsDateFrom);
  }, [dateFrom, vendorsContext]);

  return { metricsDateFrom, metricsCompareDateValue };
}

export default useMetrics;
