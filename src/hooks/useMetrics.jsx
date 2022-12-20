import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import useApi from './useApi';
import useDate from './useDate';
import { useUserAuth } from '../contexts/AuthContext';

let fnDelaysAfter = null;
let fnDelaysBefore = null;

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
    clearTimeout(fnDelaysAfter);
    if (Object.keys(vendorsObj).length > 0) {
      fnDelaysAfter = setTimeout(() => handleRequest(afterPeriod, setMetricsafterPeriod), 500);
    }
  }, [afterPeriod, vendors]);

  useMemo(() => {
    clearTimeout(fnDelaysBefore);
    if (Object.keys(vendorsObj).length > 0) {
      fnDelaysBefore = setTimeout(() => handleRequest(beforePeriod, setMetricsbeforePeriod), 500);
    }
  }, [beforePeriod, vendors]);

  return { metricsbeforePeriod, metricsafterPeriod, loading };
}

export default useMetrics;
