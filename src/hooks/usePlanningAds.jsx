import { useMemo, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import useApi from './useApi';
import useDate from './useDate';
import { useUserAuth } from '../contexts/AuthContext';

let fnDelays = null;
function usePlanningAds({ dateRange }) {
  const { vendors } = useDate();
  const { vendorsObj, display, vendorsArr } = vendors;
  const { getAds } = useApi();
  const [ads, setAds] = useState([]);
  const { user } = useUserAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (Object.keys(vendorsObj).length < 1) return;

    clearTimeout(fnDelays);

    fnDelays = setTimeout(() => {
      getAds({
        master_email: user.email,
        access_token: '',
        vendors: vendorsObj,
        start_date: dayjs(dateRange.startDate).format('YYYY-MM-DD'),
        end_date: dayjs(dateRange.endDate).format('YYYY-MM-DD'),
      }).then((res) => {
        const arr = JSON.parse(JSON.stringify(res?.data?.ads || []));
        if (res?.data?.ads.length > 0) {
          if (Object.keys(display).length > 0) {
            res?.data?.ads.forEach((obj, index) => {
              Object.keys(display).forEach((c) => {
                Object.keys(display[c]).forEach((v) => {
                  obj.vendor_ids.forEach((id) => {
                    arr[index].chain_name = c;
                    if (id === display[c][v][obj.platform].vendor_id) {
                      if ((arr[index].vendor_names || []).length === 0) {
                        arr[index] = {
                          ...arr[index],
                          vendor_names: [v],
                        };
                      } else {
                        arr[index].vendor_names = [...arr[index].vendor_names, v];
                      }
                    }
                  });
                });
              });
            });
          } else {
            res?.data?.ads.forEach((obj, index) => {
              vendorsArr.forEach((objV) => {
                obj.vendor_ids.forEach((id) => {
                  arr[index].chain_name = objV.data.chain_name;
                  if (id === objV.vendor_id) {
                    if ((arr[index].vendor_names || []).length === 0) {
                      arr[index].vendor_names = [objV.data.vendor_name];
                    } else {
                      arr[index].vendor_names = [...arr[index].vendor_names, objV.data.vendor_name];
                    }
                  }
                });
              });
            });
          }
        }
        const newArr = arr.map((obj) => ({
          ...obj,
          vendor_names: (obj?.vendor_names || []).join(', '),
        }));
        setAds(newArr || []);
        setIsLoading(false);
      });
    }, 750);
  }, [dateRange, JSON.stringify(vendorsObj)]);

  const values = useMemo(() => ({ ads, dateRange, isLoading }), [isLoading, ads, dateRange]);

  return values;
}

export default usePlanningAds;
