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
      const chainObjTemp = {};
      Object.keys(newData.display).forEach((n) => {
        chainObjTemp[n] = newData.display[n];
      });
      if (vendorsTemp.length !== vendors.vendorsArr.length) {
        const dataV = {
          restaurants: restaurantTemp,
          vendorsObj: newData,
          vendorsArr: vendorsTemp,
          display: newData.display,
          chainObj: chainObjTemp,
        };
        setVendors(dataV);
        localStorage.setItem('vendors', JSON.stringify(dataV));
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
