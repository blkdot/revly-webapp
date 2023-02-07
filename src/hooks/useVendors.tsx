import { useUserAuth } from 'contexts';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { platformList } from '../data/platformList';
import useApi from './useApi';
import { usePlatform } from './usePlatform';

type TVendorsObj = {
  [x: string]: {
    chain_id: string;
    vendor_id: string;
    metadata: {
      is_active: string | boolean;
      is_deleted: string | boolean;
      prefix_vendor_id: string;
      access_token: string;
      access_token_bis: string;
      email: string;
    };
    data: {
      chain_name: string;
      vendor_name: string;
    };
  }[];
};

export type TVendorsArr = {
  chain_id: string;
  vendor_id: string;
  metadata: {
    is_active: string | boolean;
    is_deleted: string | boolean;
    prefix_vendor_id: string;
    access_token: string;
    access_token_bis: string;
    email: string;
  };
  data: {
    chain_name: string;
    vendor_name: string;
  };
  platform: string;
};

export type TChainVendor = {
  [x: string]: {
    [x: string]: {
      deleted: boolean;
      platforms: any;
      email: string;
      access_token: string;
      access_token_bis: string;
      checked: boolean;
      meta: { prefix_vendor_id: string };
      vendor_id: string;
      chain_id: string;
      data: {
        chain_name: string;
        vendor_name: string;
      };
      active: boolean;
    };
  };
};

export type TVendors = {
  vendorsSelected: TVendorsArr[];
  vendorsObj: TVendorsObj;
  vendorsArr: TVendorsArr[];
  display: TChainVendor | Record<string, never>;
  chainObj: TChainVendor | Record<string, never>;
};

const useVendors = (isSign = false) => {
  const { getVendors } = useApi();

  const [vendors, setVendors] = useState<TVendors>({
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

    const display = newData.display ? { ...newData.display } : {};

    Object.keys(rest).forEach((platform) => {
      if (!userPlatformData.platforms[platform]?.some((obj) => obj.active)) {
        delete rest[platform];
      }
    });
    Object.keys(display).forEach((chainName) => {
      Object.keys(display[chainName]).forEach((vendorName) => {
        Object.keys(display[chainName][vendorName].platforms).forEach((platform) => {
          const platformObj = display[chainName][vendorName].platforms[platform];
          const userPlatform =
            userPlatformData.platforms[platform].find((obj) =>
              obj.vendor_ids.some((id: string) => id === platformObj.vendor_id)
            ) || {};
          display[chainName][vendorName].platforms[platform].email = userPlatform.email;
          display[chainName][vendorName].platforms[platform].access_token =
            userPlatform.access_token;
          display[chainName][vendorName].platforms[platform].access_token_bis =
            userPlatform.access_token_bis;
          if (
            platformObj.metadata.is_active === 'True' ||
            platformObj.metadata.is_active === true
          ) {
            display[chainName][vendorName].checked = true;
            display[chainName][vendorName].active = true;
          } else {
            display[chainName][vendorName].checked = false;
            display[chainName][vendorName].active = false;
          }
        });
      });
    });

    const dataV = {
      vendorsSelected: vendorsSelectedTemp,
      vendorsArr: vendorsTemp,
      vendorsObj: rest,
      display,
      chainObj: { ...display },
    };
    setVendors(dataV);
    vendorsTemp = [];
    vendorsSelectedTemp = [];
  }, [data]);

  return { vendors, setVendors };
};

export default useVendors;
