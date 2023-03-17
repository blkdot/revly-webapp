import { TopInputItem } from 'components';
import { useAtom } from 'jotai';
import pluralize from 'pluralize';
import { FC, useCallback, useMemo } from 'react';
import { vendorsAtom } from 'store/vendorsAtom';
import { TDisplayVendor, TVendorsObj } from 'types';
import { VendorsDropdown } from '../component/VendorsDropdown';
import { ReactComponent as CareemIcon } from './icons/careem.svg';
import { ReactComponent as DeliverooIcon } from './icons/deliveroo.svg';
import { ReactComponent as NoonIcon } from './icons/noon.svg';
import { ReactComponent as TalabatIcon } from './icons/talabat.svg';

type Value = number | string;

const copy = <T,>(v: T) => JSON.parse(JSON.stringify(v)) as T;

export function cleanDisplay(vendors: TDisplayVendor): TDisplayVendor {
  const newVendors = copy(vendors);
  Object.keys(newVendors).forEach((chain) => {
    Object.keys(newVendors[chain]).forEach((vendor) => {
      newVendors[chain][vendor].checked = false;
    });
  });

  return newVendors;
}

export const cleanVendorsObj = (): TVendorsObj => ({
  deliveroo: [],
  talabat: [],
  noon: [],
  careem: [],
});

export const valueFor = (chain: string, vendor: string) => `${chain}/${vendor}`;

export const fromValue = (v: string) => {
  const [chain, vendor] = v.split('/');
  return { chain, vendor };
};

export const toValues = (vendors: TDisplayVendor): string[] => {
  const values = [];

  Object.keys(vendors).forEach((chain) => {
    Object.keys(vendors[chain]).forEach((vendor) => {
      if (vendors[chain][vendor].checked) {
        values.push(valueFor(chain, vendor));
      }
    });
  });

  return values;
};

const toChildrenNode = (chain: string, vendor: string, v: any) => ({
  value: valueFor(chain, vendor),
  title: vendor,
  label: vendor,
  disabled: !v.active,
  deleted: v.deleted,
  extra: (
    <div className='children-extra'>
      {v.platforms.noon?.metadata?.is_active && <NoonIcon height={24} width={24} />}
      {v.platforms.careem?.metadata?.is_active && <CareemIcon height={24} width={24} />}
      {v.platforms.talabat?.metadata?.is_active && <TalabatIcon height={24} width={24} />}
      {v.platforms.deliveroo?.metadata?.is_active && <DeliverooIcon height={24} width={24} />}
    </div>
  ),
});

const toParentNode = (chain: string, value: any) => ({
  value: chain,
  title: chain || 'In Process',
  subTitle: pluralize('Branch', Object.keys(value).length, true),
  label: chain,
  children: Object.keys(value).map((branch) => toChildrenNode(chain, branch, value[branch])),
  deleted: Object.keys(value)
    .map((branch) => toChildrenNode(chain, branch, value[branch]))
    .every((v) => v.deleted),
});

export const vendorsSorter = (a: string, b: string) => {
  // keep unmatched vendors on the bottom
  if (a === '') {
    return Number.MAX_SAFE_INTEGER;
  }
  if (b === '') {
    return -Number.MAX_SAFE_INTEGER;
  }

  return a.trim().localeCompare(b.trim());
};

const toOptions = (vendors: TDisplayVendor) =>
  Object.keys(vendors)
    .sort(vendorsSorter)
    .map((chain) => toParentNode(chain, vendors[chain]));

export const VendorsDropdownAdapter: FC = () => {
  const [vendors, setVendors] = useAtom(vendorsAtom);

  const onChange = useCallback(
    (values: Value[]) => {
      const newDisplay = cleanDisplay(vendors.display);
      const newVendorsObj = cleanVendorsObj();

      values.forEach((value) => {
        const { chain, vendor } = fromValue(value as string);

        newDisplay[chain][vendor].checked = true;
        Object.keys(newDisplay[chain][vendor].platforms).forEach((platform) => {
          newVendorsObj[platform].push(newDisplay[chain][vendor].platforms[platform]);
        });
      });

      setVendors({ ...vendors, display: newDisplay, vendorsObj: newVendorsObj });
    },
    [vendors, setVendors]
  );

  const values = useMemo(() => toValues(vendors.display), [vendors.display]);
  const options = useMemo(() => toOptions(vendors.display), [vendors.display]);

  return (
    <TopInputItem title='Select a vendor'>
      <VendorsDropdown values={values} options={options} onChange={onChange} />
    </TopInputItem>
  );
};
