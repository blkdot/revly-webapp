import { useMemo, useState } from 'react';
import useApi from './useApi';
import useDate from './useDate';

function useVendors() {
  const { setRestaurants } = useDate();
  const { getVendors } = useApi();
  const [vendors, setVendors] = useState([]);
  const [vendorsPlatform, setVendorsPlatform] = useState([]);
  const handleRequest = () => {
    let isCancelled = false;
    getVendors({
      master_email: 'chiekh.alloul@gmail.com',
      access_token: '',
    }).then((data) => {
      if (!isCancelled) {
        const newData = data.data;
        delete newData?.master_email;
        const entries = Object.entries(newData);
        const newVendors = [];
        entries.forEach((el) => {
          el[1].forEach((obj) => newVendors.push({ ...obj, platform: el[0] }));
        });
        entries.reverse().forEach((el) => {
          el[1].reverse().forEach((obj) => setRestaurants([obj.data.vendor_name]));
        });
        setVendorsPlatform(Object.keys(newData));
        setVendors(newVendors);
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
