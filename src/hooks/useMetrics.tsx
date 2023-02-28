import { useUser } from 'contexts';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import useApi from './useApi';
import useDate from './useDate';
import { type TVendorsObj } from './useVendors';

let fnDelays = null;

function useMetrics(vendorsObj: TVendorsObj) {
  const { date: dateContext } = useDate();
  const { beforePeriod, afterPeriod } = dateContext;
  const { getMetrics } = useApi();
  const [metricsbeforePeriod, setMetricsbeforePeriod] = useState([]);
  const [metricsafterPeriod, setMetricsafterPeriod] = useState([]);
  const user = useUser();
  const newVendorsObj = {};

  Object.keys(vendorsObj).forEach((plat) => {
    newVendorsObj[plat] = vendorsObj[plat].filter((obj) => obj.metadata.is_active);
  });

  Object.keys(newVendorsObj).forEach((plat) => {
    if (newVendorsObj[plat].length === 0 || plat === 'display') {
      delete newVendorsObj[plat];
    }
  });

  const [loading, setLoading] = useState(false);
  const [queue, setQueue] = useState(0);

  const handleRequest = (date, setMetrics, stack) => {
    if (Object.keys(newVendorsObj).length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);

    getMetrics({
      master_email: user.email,
      access_token: user.token,
      vendors: newVendorsObj,
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
    fnDelays = setTimeout(() => {
      if (loading) {
        setQueue((prev) => prev + 1);
        return;
      }

      handleRequest(afterPeriod, setMetricsafterPeriod, queue);
      handleRequest(beforePeriod, setMetricsbeforePeriod, queue);
    }, 750 + queue);
  }, [afterPeriod, beforePeriod, JSON.stringify(vendorsObj), queue]);

  return { metricsbeforePeriod, metricsafterPeriod, loading };
}

export default useMetrics;
