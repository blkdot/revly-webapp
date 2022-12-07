import { useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import useApi from './useApi';
import config from '../setup/config';
import { useUserAuth } from '../contexts/AuthContext';
import { platformList } from '../data/platformList';
import useDate from './useDate';

const useVendors = () => {
  const { getVendors } = useApi();
  const { environment } = config;
  const { vendors, setVendors } = useDate();
  const { user } = useUserAuth();

  const requestVendorsDefaultParam = {
    master_email: environment !== 'dev' ? user.email : 'chiekh.alloul@gmail.com',
    access_token: user.accessToken,
  };

  const { data, isLoading, isError } = useQuery(['getVendors'], () =>
    getVendors(requestVendorsDefaultParam),
  );

  useEffect(() => {
    if (isLoading || isError) return;

    const newData = data.data;

    delete newData?.master_email;

    const restaurantTemp = [];
    const vendorsTemp = [];

    platformList
      .filter((p) => {
        if (!newData[p.name]) delete newData[p.name];
        return newData[p.name];
      })
      .flatMap((p) =>
        newData[p.name].forEach((v) => {
          vendorsTemp.push({ ...v, platform: p.name });
          restaurantTemp.push(v.data.vendor_name);
        }),
      );
    const { ...rest } = newData;
    const display = {
      ...newData.display,
      PokeHub: { ...newData.display.PokeHub, Aman: { talabat: {}, deliveroo: {} } },
    };
    const chainObj = JSON.parse(JSON.stringify(display));
    const dataV = {
      restaurants: restaurantTemp,
      vendorsArr: vendorsTemp,
      vendorsObj: rest,
      display,
      chainObj,
    };
    if (Object.keys(newData.display) === 0) {
      if (vendorsTemp.length !== vendors.vendorsArr.length) {
        setVendors(dataV);
        localStorage.setItem('vendors', JSON.stringify(dataV));
      }
    } else if (Object.keys(chainObj).length !== Object.keys(vendors.chainObj).length) {
      setVendors(dataV);
      localStorage.setItem('vendors', JSON.stringify(dataV));
    }
  }, [data]);

  const values = useMemo(() => ({ vendors, setVendors }), [vendors]);

  return values;
};

export default useVendors;
