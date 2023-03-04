import { useDates, useUser } from 'contexts';
import { useMemo, useState } from 'react';
import { DatePeriod, prepareVendors, TVendorsObj } from 'types';
import useApi from './useApi';

let fnDelays = null;

function useMetrics(vendorsObj: TVendorsObj) {
  const { current, compare } = useDates();

  const { getMetrics } = useApi();
  const [metricsbeforePeriod, setMetricsbeforePeriod] = useState([]);
  const [metricsafterPeriod, setMetricsafterPeriod] = useState([]);
  const user = useUser();

  const v = useMemo(() => prepareVendors(vendorsObj), []);

  const [loading, setLoading] = useState(false);
  const [queue, setQueue] = useState(0);

  const handleRequest = (date: DatePeriod, setMetrics, stack) => {
    if (Object.keys(v).length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);

    getMetrics({
      master_email: user.email,
      access_token: user.token,
      vendors: v,
      start_date: date.from.format('YYYY-MM-DD'),
      end_date: date.until.format('YYYY-MM-DD'),
    }).then((data) => {
      setLoading(false);
      if (stack === queue) setQueue(0);
      setMetrics(data.data.metrics);
    });
  };

  useMemo(() => {
    clearTimeout(fnDelays);
    fnDelays = setTimeout(() => {
      if (loading) {
        setQueue((prev) => prev + 1);
        return;
      }

      handleRequest(compare, setMetricsafterPeriod, queue);
      handleRequest(current, setMetricsbeforePeriod, queue);
    }, 750 + queue);
  }, [current, compare, JSON.stringify(vendorsObj), queue]);

  return { metricsbeforePeriod, metricsafterPeriod, loading };
}

export default useMetrics;
