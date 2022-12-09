import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import useApi from './useApi';
import useDate from './useDate';
import { useUserAuth } from '../contexts/AuthContext';

function useMetrics() {
  const { date: dateContext, vendors } = useDate();
  const { vendorsObj } = vendors;
  const { beforePeriod, afterPeriod } = dateContext;
  const { getMetrics } = useApi();
  const [metricsbeforePeriod, setMetricsbeforePeriod] = useState([]);
  const [metricsafterPeriod, setMetricsafterPeriod] = useState([]);
  const { user } = useUserAuth();

  const clonedVendor = { ...vendorsObj };
  delete clonedVendor.display;

  const handleRequest = (date, setMetrics) => {
    let isCancelled = false;
    getMetrics({
      master_email: user.email,
      access_token: '',
      vendors: clonedVendor,
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
    handleRequest(afterPeriod, setMetricsafterPeriod);
  }, [afterPeriod, vendors]);

  useMemo(() => {
    handleRequest(beforePeriod, setMetricsbeforePeriod);
  }, [beforePeriod, vendors]);

  return { metricsbeforePeriod, metricsafterPeriod };
}

export default useMetrics;
