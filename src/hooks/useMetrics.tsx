import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import { useMemo, useState } from 'react';
import { useUserAuth } from '../contexts/AuthContext';
import { vendorsAtom } from '../store/vendorsAtom';
import useApi from './useApi';
import useDate from './useDate';

let fnDelays = null;

function useMetrics() {
  const { date: dateContext } = useDate();
  const [vendors] = useAtom(vendorsAtom);
  const { vendorsObj } = vendors;
  const { beforePeriod, afterPeriod } = dateContext;
  const { getMetrics } = useApi();
  const [metricsbeforePeriod, setMetricsbeforePeriod] = useState([]);
  const [metricsafterPeriod, setMetricsafterPeriod] = useState([]);
  const { user } = useUserAuth();

  const clonedVendor: any = { ...vendorsObj };
  delete clonedVendor.display;

  const [loading, setLoading] = useState(false);
  const [queue, setQueue] = useState(0);

  const handleRequest = (date, setMetrics, stack) => {
    setLoading(true);

    getMetrics({
      master_email: user.email,
      access_token: '',
      vendors: clonedVendor,
      start_date: dayjs(date.startDate).format('YYYY-MM-DD'),
      end_date: dayjs(date.endDate).format('YYYY-MM-DD'),
    }).then((data) => {
      setLoading(false);
      if (stack === queue) setQueue(0);
      setMetrics(data.data.metrics);
    });
  };

  useMemo(() => {
    clearTimeout(fnDelays);
    if (Object.keys(vendorsObj).length > 0) {
      fnDelays = setTimeout(() => {
        if (loading) {
          setQueue((prev) => prev + 1);
          return;
        }

        handleRequest(afterPeriod, setMetricsafterPeriod, queue);
        handleRequest(beforePeriod, setMetricsbeforePeriod, queue);
      }, 750 + queue);
    }
  }, [afterPeriod, beforePeriod, vendors, queue]);

  return { metricsbeforePeriod, metricsafterPeriod, loading };
}

export default useMetrics;
