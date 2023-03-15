import { useQuery } from '@tanstack/react-query';
import { getVendors } from 'api';
import { usePlatform, useUser } from 'contexts';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { vendorsAtom, vendorsIsolatedAtom } from 'store/vendorsAtom';
import { TChainData, TResponseVendorsApi, TVendors, TVendorsArr } from 'types';
import { platformList } from '../data/platformList';

const useVendors = (isSign = false) => {
  const [, setVendorsAtom] = useAtom(vendorsAtom);
  const [, setVendorsIsolatedAtom] = useAtom(vendorsIsolatedAtom);

  const [vendors, setVendors] = useState<TVendors>({
    vendorsSelected: [],
    vendorsObj: {},
    vendorsArr: [],
    display: {},
    chainObj: {},
    chainData: [],
  });

  const user = useUser();
  const { userPlatformData } = usePlatform();

  const requestVendorsDefaultParam = {
    master_email: user.email,
    access_token: user.token,
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

          const clonedData = { ...display[chainName][vendorName].platforms[platform] };

          delete clonedData.email;
          delete clonedData.access_token;
          delete clonedData.access_token_bis;

          const l = {
            chain_name: chainName,
            chain_id: display[chainName][vendorName].platforms[platform].chain_id,
            vendor_id: display[chainName][vendorName].platforms[platform].vendor_id,
            vendor_name: vendorName,
            is_active: display[chainName][vendorName].platforms[platform].metadata.is_active,
            platform,
            access_token: display[chainName][vendorName].platforms[platform].access_token,
            access_token_bis: display[chainName][vendorName].platforms[platform].access_token_bis,
            data: clonedData,
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
    setVendorsAtom((prev) => {
      if (prev.chainData.length !== dataV.chainData.length) {
        return dataV;
      }

      return prev;
    });

    setVendorsIsolatedAtom((prev) => {
      if (prev.chainData.length !== dataV.chainData.length) {
        return dataV;
      }

      return prev;
    });

    vendorsTemp = [];
    vendorsSelectedTemp = [];
  }, [data]);

  const getChainData = (chainId: number, vendorIds: number[] | string[] = []): TChainData => {
    let vendorData = vendors.chainData.find((ch) => {
      const vendorIdString = String(ch.vendor_id);
      const vendorIdNumber = Number(ch.vendor_id);

      if (
        vendorIds &&
        vendorIds.length > 0 &&
        ([...vendorIds].includes(vendorIdString) || [...vendorIds].includes(vendorIdNumber))
      ) {
        return Number(ch.chain_id) === Number(chainId);
      }

      return false;
    });

    if (!vendorData) {
      vendorData = vendors.chainData.find((ch) => Number(ch.chain_id) === Number(chainId));
    }

    return vendorData;
  };

  return { vendors, setVendors, getChainData, isLoading };
};

export default useVendors;
