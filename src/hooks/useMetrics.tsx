import { useUserAuth } from 'contexts';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { type TVendorsObj } from './useVendors';
import useApi from './useApi';
import useDate from './useDate';

let fnDelays = null;

function useMetrics(vendorsObj: TVendorsObj) {
  const { date: dateContext } = useDate();
  const { beforePeriod, afterPeriod } = dateContext;
  const { getMetrics } = useApi();
  const [metricsbeforePeriod, setMetricsbeforePeriod] = useState([]);
  const [metricsafterPeriod, setMetricsafterPeriod] = useState([]);
  const { user } = useUserAuth();

  const clonedVendor = { ...vendorsObj };

  Object.keys(clonedVendor).forEach((plat) => {
    if (clonedVendor[plat].length === 0 || plat === 'display') {
      delete clonedVendor[plat];
    }
  });

  const [loading, setLoading] = useState(false);
  const [queue, setQueue] = useState(0);

  const handleRequest = (date, setMetrics, stack) => {
    setLoading(true);

    if (Object.keys(clonedVendor).length === 0) {
      setLoading(false);
      return;
    }

    getMetrics({
      master_email: user.email,
      access_token: user.accessToken,
      vendors: clonedVendor,
      start_date: dayjs(date.startDate).format('YYYY-MM-DD'),
      end_date: dayjs(date.endDate).format('YYYY-MM-DD'),
    }).then((data) => {
      setLoading(false);
      if (stack === queue) setQueue(0);
      setMetrics(data.data.metrics);
    });
  };

  useEffect(() => {
    clearTimeout(fnDelays);
    fnDelays = setTimeout(() => {
      if (loading) {
        setQueue((prev) => prev + 1);
        return;
      }

      handleRequest(afterPeriod, setMetricsafterPeriod, queue);
      handleRequest(beforePeriod, setMetricsbeforePeriod, queue);
    }, 750 + queue);
  }, [afterPeriod, beforePeriod, vendorsObj, queue]);

  return { metricsbeforePeriod, metricsafterPeriod, loading };
}

export default useMetrics;
