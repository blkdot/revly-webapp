import { useUserAuth } from 'contexts';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import useApi from './useApi';
import useVendors from './useVendors';

let fnDelays = null;
function usePlanningAds({ dateRange }) {
  const { vendors } = useVendors(undefined);
  const { vendorsObj, display, vendorsArr } = vendors;
  const { getAds } = useApi();
  const [ads, setAds] = useState([]);
  const { user } = useUserAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (Object.keys(vendorsObj).length < 1) return;
    setIsLoading(true);

    clearTimeout(fnDelays);

    fnDelays = setTimeout(() => {
      getAds({
        master_email: user.email,
        access_token: '',
        vendors: vendorsObj,
        start_date: dayjs(dateRange.startDate).format('YYYY-MM-DD'),
        end_date: dayjs(dateRange.endDate).format('YYYY-MM-DD'),
      }).then((res) => {
        // its copy of ads to add and change the values
        const newAdsArray = JSON.parse(JSON.stringify(res?.data?.ads || []));
        // here we checking is it newAdsArray is not empty
        if (newAdsArray.length > 0) {
          // here we checking is it display is not empty
          newAdsArray.forEach((obj, index) => {
            Object.keys(display).forEach((chainName) => {
              Object.keys(display[chainName]).forEach((vendorName) => {
                obj?.vendor_ids?.forEach((id) => {
                  // here we put chainName to key chain_name (chain_name: chainName)
                  newAdsArray[index].chain_name = chainName;
                  // check is it id equal display id
                  if (
                    id ===
                    display[chainName][vendorName].platforms[obj.platform.toLowerCase()]?.vendor_id
                  ) {
                    // check is it vendor_names is not empty empty
                    if ((newAdsArray[index].vendor_names || []).length > 0) {
                      // we take the curennt value and push new value
                      newAdsArray[index].vendor_names = [
                        ...newAdsArray[index].vendor_names,
                        vendorName,
                      ];
                    } else {
                      // we just put the new value
                      newAdsArray[index].vendor_names = [vendorName];
                    }
                  }
                });
              });
            });
            if ((newAdsArray[index].vendor_names || []).length === 0) {
              newAdsArray.splice(index, 1);
            }
          });
        }
        setAds(newAdsArray || []);
        setIsLoading(false);
      });
    }, 750);
  }, [dateRange, JSON.stringify(vendorsObj)]);

  const values = useMemo(() => ({ ads, dateRange, isLoading }), [isLoading, ads, dateRange]);

  return values;
}

export default usePlanningAds;
