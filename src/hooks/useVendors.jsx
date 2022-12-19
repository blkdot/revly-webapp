import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import useApi from './useApi';

import { useUserAuth } from '../contexts/AuthContext';
import { platformList } from '../data/platformList';

const useVendors = (isSign) => {
  const { getVendors } = useApi();

  const [vendors, setVendors] = useState({
    restaurants: [],
    vendorsObj: {},
    vendorsArr: [],
    display: {},
    chainObj: {},
  });

  const { user } = useUserAuth();

  const requestVendorsDefaultParam = {
    master_email: user?.email || '',
    access_token: user?.accessToken || '',
  };

  const { data, isLoading, isError } = useQuery(
    ['getVendors', requestVendorsDefaultParam],
    () => {
      if (!isSign) {
        return getVendors(requestVendorsDefaultParam);
      }
      return {};
    },
    { enabled: !isSign },
  );

  useEffect(() => {
    if (isLoading || isError || isSign) return;

    const newData = data;

    delete newData?.master_email;

    let restaurantTemp = [];
    let vendorsTemp = [];

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
    const display = newData.display ? newData.display : {};
    delete rest.display;
    const chainObj = JSON.parse(JSON.stringify(display));
    const dataV = {
      restaurants: restaurantTemp,
      vendorsArr: vendorsTemp,
      vendorsObj: rest,
      display: JSON.parse(JSON.stringify(chainObj)) || {},
      chainObj,
    };
    setVendors(dataV);
    Object.keys(display).forEach((key) => {
      delete display[key];
    });
    vendorsTemp = [];
    restaurantTemp = [];
  }, [data]);

  return { vendors, setVendors };
};

export default useVendors;
