import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { vendorsAtom } from 'store/vendorsAtom';
import { useUserAuth } from '../contexts/AuthContext';
import { platformList } from '../data/platformList';
import useApi from './useApi';
import { usePlatform } from './usePlatform';

const useVendors = (isSign: any) => {
  const { getVendors } = useApi();
  const [vendors, setVendors] = useAtom(vendorsAtom);

  const { user } = useUserAuth();
  const { userPlatformData } = usePlatform();
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
    { enabled: !isSign }
  );

  useEffect(() => {
    if (isLoading || isError || isSign) return;

    const newData = data as any;

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
          const userPlatform =
            userPlatformData.platforms[p.name].find((obj) =>
              obj.vendor_ids.some((id) => id === v.vendor_id)
            ) || '';
          vendorsTemp.push({
            ...v,
            platform: p.name,
            email: userPlatform.email,
            access_token: userPlatform.access_token,
            access_token_bis: userPlatform.access_token_bis,
          });
          if (v.metadata.is_active === 'True' || v.metadata.is_active === true) {
            vendorsSelectedTemp.push({
              ...v,
              platform: p.name,
              email: userPlatform.email,
              access_token: userPlatform.access_token,
              access_token_bis: userPlatform.access_token_bis,
            });
          }
        })
      );
    const { ...rest } = newData;
    const display = newData.display ? newData.display : {};
    delete rest.display;
    const vendorsObj = {};
    const chainObj = JSON.parse(JSON.stringify(display));
    Object.keys(chainObj).forEach((chainName) => {
      Object.keys(chainObj[chainName]).forEach((vendorName) => {
        Object.keys(chainObj[chainName][vendorName]).forEach((platform) => {
          chainObj[chainName][vendorName][platform] = {
            ...chainObj[chainName][vendorName][platform],
            active: userPlatformData.platforms[platform].length,
          };
          if (
            chainObj[chainName][vendorName][platform] === null ||
            !chainObj[chainName][vendorName][platform].vendor_id
          ) {
            delete chainObj[chainName][vendorName][platform];
          }
          if (chainObj[chainName][vendorName][platform] !== null) {
            if ((vendorsObj[platform] || []).length === 0) {
              if (userPlatformData.platforms[platform].some((obj) => obj.active)) {
                vendorsObj[platform] = [chainObj[chainName][vendorName][platform]];
              }
            } else if (userPlatformData.platforms[platform].some((obj) => obj.active)) {
              vendorsObj[platform] = [
                ...vendorsObj[platform],
                chainObj[chainName][vendorName][platform],
              ];
            }
          }
        });
      });
    });
    Object.keys(rest).forEach((platform) => {
      if (!userPlatformData.platforms[platform].some((obj) => obj.active)) {
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
