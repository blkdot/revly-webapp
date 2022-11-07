import { useMemo } from 'react';
import useApi from './useApi';
import config from '../setup/config';
import { useUserAuth } from '../contexts/AuthContext';
import { platformList } from '../data/platformList';
import useDate from './useDate';

function useVendors() {
  const { getVendors } = useApi();
  const { environment } = config;
  const { vendors, setVendors } = useDate();
  const { user } = useUserAuth();

  const requestVendorsDefaultParam = {
    master_email: environment !== 'dev' ? user.email : 'chiekh.alloul@gmail.com',
    access_token: user.accessToken,
  };

  const handleRequest = () => {
    let isCancelled = false;
    getVendors(requestVendorsDefaultParam).then((data) => {
      if (isCancelled) return;

      const newData = data.data;

      delete newData?.master_email;

      const restaurantTemp = [];
      const vendorsTemp = [];

      if (newData) {
        platformList
          .filter((p) => {
            if (!newData[p.name]) delete newData[p.name];
            return newData[p.name];
          })
          .flatMap((p) =>
            newData[p.name].forEach((v) => {
              vendorsTemp.push({ ...v, platform: p.name });
              restaurantTemp.push(v.chain_id);
            }),
          );
      }
      if (vendorsTemp.length !== vendors.vendorsArr.length) {
        setVendors({
          restaurants: restaurantTemp,
          vendorsObj: newData,
          vendorsArr: vendorsTemp,
        });
        localStorage.setItem(
          'vendors',
          JSON.stringify({
            restaurants: restaurantTemp,
            vendorsObj: newData,
            vendorsArr: vendorsTemp,
          }),
        );
      }
    });
    return () => {
      isCancelled = true;
    };
  };
  useMemo(() => {
    handleRequest();
  }, []);

  return { vendors };
}

export default useVendors;
