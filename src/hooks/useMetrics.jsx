import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import useApi from './useApi';
import useDate from './useDate';
import useVendors from './useVendors';
import { useUserAuth } from '../contexts/AuthContext';

function useMetrics() {
  const { date: dateContext } = useDate();
  const { vendors } = useVendors();
  const { vendorsObj } = vendors;
  const { beforePeriod, afterPeriod } = dateContext;
  const { getMetrics } = useApi();
  const [metricsbeforePeriod, setMetricsbeforePeriod] = useState([]);
  const [metricsafterPeriod, setMetricsafterPeriod] = useState([]);
  const { user } = useUserAuth();

  const clonedVendor = { ...vendorsObj };
  delete clonedVendor.display;
  const [loading, setLoading] = useState(true);

  const handleRequest = (date, setMetrics) => {
    setLoading(true);
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
      setLoading(false);
    });
    return () => {
      isCancelled = true;
    };
  };
  useMemo(() => {
    if (Object.keys(vendorsObj).length > 0) {
      handleRequest(afterPeriod, setMetricsafterPeriod);
    }
  }, [afterPeriod, vendors]);

  useMemo(() => {
    if (Object.keys(vendorsObj).length > 0) {
      handleRequest(beforePeriod, setMetricsbeforePeriod);
    }
  }, [beforePeriod, vendors]);

  return { metricsbeforePeriod, metricsafterPeriod, loading };
}

export default useMetrics;
