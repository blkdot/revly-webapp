import { useAtom } from 'jotai';
import { vendorsAtom } from 'store/vendorsAtom';
import { useQuery } from '@tanstack/react-query';
import { useUserAuth } from 'contexts';
import { useEffect, useState } from 'react';
import { platformList } from '../data/platformList';
import useApi from './useApi';
import { usePlatform } from './usePlatform';

export type TVendorsObj = {
  [x: string]: {
    chain_id: number;
    vendor_id: string | number;
    data: {
      chain_name: string;
      vendor_name: string;
    };
    metadata: {
      drn_id?: string;
      prefix_vendor_id?: string;
      is_active: boolean;
      is_deleted: boolean;
      ord_id?: string;
    };
  }[];
};

export type TDisplayVendor =
  | {
      [x: string]: {
        is_matched: boolean;
        platforms: {
          [x: string]: {
            chain_id: number;
            vendor_id: string | number;
            data: {
              chain_name: string;
              vendor_name: string;
            };
            metadata: {
              drn_id?: string;
              prefix_vendor_id?: string;
              is_active: boolean;
              is_deleted: boolean;
              ord_id?: string;
            };
          };
        };
      };
    }
  | Record<string, never>;

type TResponseVendorsApi = TVendorsObj & {
  display: TDisplayVendor;
};

export type TVendorsArr = {
  chain_id: number;
  vendor_id: string | number;
  data: {
    chain_name: string;
    vendor_name: string;
  };
  metadata: {
    drn_id?: string;
    prefix_vendor_id?: string;
    is_active: boolean;
    is_deleted: boolean;
    ord_id?: string;
  };
  platform: string;
  email: string;
  access_token: string;
  access_token_bis: string;
};

export type TChainData = {
  chain_id: number;
  chain_name: string;
  vendor_id: string | number;
  vendor_name: string;
};

export type TVendors = {
  vendorsSelected: TVendorsArr[];
  vendorsObj: TVendorsObj;
  vendorsArr: TVendorsArr[];
  display: TDisplayVendor;
  chainObj: TDisplayVendor;
  chainData: TChainData[];
};

const useVendors = (isSign = false) => {
  const { getVendors } = useApi();
  const [, setVendorsAtom] = useAtom(vendorsAtom);

  const [vendors, setVendors] = useState<TVendors>({
    vendorsSelected: [],
    vendorsObj: {},
    vendorsArr: [],
    display: {},
    chainObj: {},
    chainData: [],
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

    const newData = data as TResponseVendorsApi;

    delete newData?.master_email;

    let vendorsSelectedTemp: TVendorsArr[] = [];
    let vendorsTemp: TVendorsArr[] = [];

    platformList
      .filter((p) => {
        if (!newData[p.name]) delete newData[p.name];
        return newData[p.name];
      })
      .flatMap((p) =>
        newData[p.name].forEach((v) => {
          const userPlatform = userPlatformData.platforms[p.name].find((obj) =>
            obj.vendor_ids.some((id: string | number) => Number(id) === Number(v.vendor_id))
          );

          vendorsTemp.push({
            ...v,
            platform: p.name,
            email: userPlatform?.email,
            access_token: userPlatform?.access_token,
            access_token_bis: userPlatform?.access_token_bis,
          });

          if (v.metadata.is_active === true) {
            vendorsSelectedTemp.push({
              ...v,
              platform: p.name,
              email: userPlatform?.email,
              access_token: userPlatform?.access_token,
              access_token_bis: userPlatform?.access_token_bis,
            });
          }
        })
      );

    const { display, ...rest } = newData;

    const chainData = [];

    Object.keys(rest).forEach((platform) => {
      // Do not delete, the code commented out is the real one, the one under it is just a fast fix.
      // if (!userPlatformData.platforms[platform]?.some((obj) => obj.active)) {
      //   delete rest[platform];
      // }

      if (userPlatformData.platforms[platform].length === 0) {
        delete rest[platform];
      }
    });

    Object.keys(display).forEach((chainName) => {
      Object.keys(display[chainName]).forEach((vendorName) => {
        Object.keys(display[chainName][vendorName].platforms).forEach((platform) => {
          const platformObj = display[chainName][vendorName].platforms[platform];
          const platformArr = Object.keys(display[chainName][vendorName].platforms);
          const userPlatform = userPlatformData.platforms[platform].find((obj) =>
            obj.vendor_ids.some(
              (id: number | string) => Number(id) === Number(platformObj.vendor_id)
            )
          );
          display[chainName][vendorName].email = userPlatform?.email;
          display[chainName][vendorName].platforms[platform].email = userPlatform?.email;
          display[chainName][vendorName].platforms[platform].access_token =
            userPlatform?.access_token;
          display[chainName][vendorName].platforms[platform].access_token_bis =
            userPlatform?.access_token_bis;
          if (
            platformArr.some(
              (plat) => display[chainName][vendorName].platforms[plat].metadata.is_active
            )
          ) {
            display[chainName][vendorName].checked = true;
            display[chainName][vendorName].active = true;
          } else {
            display[chainName][vendorName].checked = false;
            display[chainName][vendorName].active = false;
          }

          const l = {
            chain_name: chainName,
            chain_id: display[chainName][vendorName].platforms[platform].chain_id,
            vendor_id: display[chainName][vendorName].platforms[platform].vendor_id,
            vendor_name: vendorName,
          };

          chainData.push(l);
        });
      });
    });

    const dataV = {
      vendorsSelected: vendorsSelectedTemp,
      vendorsArr: vendorsTemp,
      vendorsObj: rest,
      display,
      chainObj: { ...display },
      chainData,
    };

    setVendors(dataV);
    setVendorsAtom(dataV);

    vendorsTemp = [];
    vendorsSelectedTemp = [];
  }, [data]);

  return { vendors, setVendors };
};

export default useVendors;
