import { useUserAuth } from 'contexts';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import useApi from './useApi';
import useVendors from './useVendors';

let fnDelays = null;
function usePlanningAds({ dateRange }) {
  const { vendors } = useVendors(undefined);
  const { vendorsObj, display } = vendors;
  const { getAds } = useApi();
  const [ads, setAds] = useState([]);
  const { user } = useUserAuth();
  const [isLoading, setIsLoading] = useState(true);
  const newVendorsObj = {};
  Object.keys(vendorsObj).forEach((plat) => {
    newVendorsObj[plat] = vendorsObj[plat].filter((obj) => obj.metadata.is_active);
  });
  useEffect(() => {
    if (Object.keys(newVendorsObj).length < 1) return;
    setIsLoading(true);

    clearTimeout(fnDelays);

    fnDelays = setTimeout(() => {
      getAds({
        master_email: user.email,
        access_token: '',
        vendors: newVendorsObj,
        start_date: dayjs(dateRange.startDate).format('YYYY-MM-DD'),
        end_date: dayjs(dateRange.endDate).format('YYYY-MM-DD'),
      }).then((res) => {
        setAds(res?.data?.ads || []);
        setIsLoading(false);
      });
    }, 750);
  }, [dateRange, JSON.stringify(vendorsObj)]);

  const values = useMemo(() => ({ ads, dateRange, isLoading }), [isLoading, ads, dateRange]);

  return values;
}

export default usePlanningAds;
