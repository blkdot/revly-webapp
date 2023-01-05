import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import useApi from './useApi';

import { useUserAuth } from '../contexts/AuthContext';
import { platformList } from '../data/platformList';
import { usePlatform } from './usePlatform';

const useVendors = (isSign) => {
  const { getVendors } = useApi();

  const [vendors, setVendors] = useState({
    vendorsSelected: [],
    vendorsObj: {},
    vendorsArr: [],
    display: {},
    chainObj: {},
  });
  const { user } = useUserAuth();
  const { userPlatformData } = usePlatform();
  const requestVendorsDefaultParam = {
    master_email: user?.email || '',
    access_token: user?.accessToken || '',
  };

  const { data, isLoading, isError } = useQuery(['getVendors'], () => {
    if (!isSign) {
      return getVendors(requestVendorsDefaultParam);
    }
    return {};
  });

  useEffect(() => {
    if (isLoading || isError) return;

    const newData = data;

    delete newData?.master_email;

    let vendorsSelectedTemp = [];
    let vendorsTemp = [];

    platformList
      .filter((p) => {
        if (!newData[p.name]) delete newData[p.name];
        return newData[p.name];
      })
      .flatMap((p) =>
        newData[p.name].forEach((v) => {
          vendorsTemp.push({ ...v, platform: p.name });
          if (userPlatformData.platforms[p.name].active) {
            vendorsSelectedTemp.push(v.data.vendor_name);
          }
        }),
      );
    const { ...rest } = newData;
    const display = newData.display ? newData.display : {};
    delete rest.display;
    const vendorsObj = {};
    const chainObj = JSON.parse(JSON.stringify(display));
    Object.keys(chainObj).forEach((chainName) => {
      Object.keys(chainObj[chainName]).forEach((vendorName) => {
        Object.keys(chainObj[chainName][vendorName]).forEach((platform) => {
          if (chainObj[chainName][vendorName][platform] !== null) {
            if ((vendorsObj[platform] || []).length === 0) {
              if (userPlatformData.platforms[platform].active) {
                vendorsObj[platform] = [chainObj[chainName][vendorName][platform]];
              }
            } else if (userPlatformData.platforms[platform].active) {
              vendorsObj[platform] = [
                ...vendorsObj[platform],
                chainObj[chainName][vendorName][platform],
              ];
            }
          }
          if (chainObj[chainName][vendorName][platform] === null) {
            delete chainObj[chainName][vendorName][platform];
          }
          chainObj[chainName][vendorName][platform] = {
            ...chainObj[chainName][vendorName][platform],
            active: userPlatformData.platforms[platform].active,
          };
        });
      });
    });
    Object.keys(rest).forEach((platform) => {
      if (!userPlatformData.platforms[platform].active) {
        delete rest[platform];
      }
    });
    const dataV = {
      vendorsSelected: vendorsSelectedTemp,
      vendorsArr: vendorsTemp,
      vendorsObj: Object.keys(display).length > 0 ? vendorsObj : rest,
      display: chainObj,
      chainObj,
    };
    setVendors(dataV);
    Object.keys(display).forEach((key) => {
      delete display[key];
    });
    vendorsTemp = [];
    vendorsSelectedTemp = [];
  }, [data]);

  return { vendors, setVendors };
};

export default useVendors;
