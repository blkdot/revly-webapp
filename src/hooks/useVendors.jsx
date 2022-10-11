import { useMemo, useState } from 'react';
import useApi from './useApi';
import useDate from './useDate';
import config from '../setup/config';
import { useUserAuth } from '../contexts/AuthContext';
import { platformList } from '../data/platformList';

function useVendors() {
  const { setRestaurants, setVendorsContext } = useDate();
  const [vendors, setVendors] = useState([]);
  const [vendorsPlatform, setVendorsPlatform] = useState([]);
  const { getVendors } = useApi();
  const { environment } = config;
  const { user } = useUserAuth();

  const requestVendorsDefaultParam = {
    master_email: environment !== 'dev' ? user.email : 'chiekh.alloul@gmail.com',
    access_token: user.accessToken,
  };

  const handleRequest = () => {
    let isCancelled = false;
    getVendors(requestVendorsDefaultParam).then((data) => {
      if (isCancelled) return;
      setRestaurants([]);
      setVendors([]);

      const newData = data.data;

      delete newData?.master_email;

      if (newData) {
        platformList
          .filter((p) => {
            if (!newData[p.name]) delete newData[p.name];

            return newData[p.name];
          })
          .flatMap((p) =>
            newData[p.name].forEach((v) => {
              setVendors((cur) => [...cur, { ...v, platform: p.name }]);
              setRestaurants((cur) => [...cur, v.data.vendor_name]);
            }),
          );
        setVendorsContext(newData);
        setVendorsPlatform(Object.keys(newData));
      }
    });
    return () => {
      isCancelled = true;
    };
  };

  useMemo(() => {
    handleRequest();
  }, []);

  return { vendors, vendorsPlatform };
}

export default useVendors;