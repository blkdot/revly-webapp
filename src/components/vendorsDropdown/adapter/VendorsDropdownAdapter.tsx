import { useAtom } from 'jotai';
import { FC, useCallback, useMemo } from 'react';
import { vendorsAtom } from 'store/vendorsAtom';
import { TDisplayVendor } from 'types';
import { VendorsDropdown } from '../component/VendorsDropdown';
import { ReactComponent as DeliverooIcon } from './icons/deliveroo.svg';

type Value = number | string;

const copy = <T,>(v: T) => JSON.parse(JSON.stringify(v)) as T;

const cleanDisplay = (vendors: TDisplayVendor) => {
  const newVendors = copy(vendors);
  Object.keys(newVendors).forEach((chain) => {
    Object.keys(newVendors[chain]).forEach((vendor) => {
      newVendors[chain][vendor].checked = false;
    });
  });

  return newVendors;
};

const valueFor = (chain: string, vendor: string) => `${chain}/${vendor}`;

const fromValue = (v: string) => {
  const [chain, vendor] = v.split('/');
  return { chain, vendor };
};

const toValues = (vendors: TDisplayVendor): string[] => {
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
  subTitle: vendor,
  label: vendor,
  disabled: !v.active,
  extra: (
    <div style={{ display: 'inline-flex', gap: 8 }}>
      {v.platforms.talabat && <DeliverooIcon />}
      {v.platforms.deliveroo && <DeliverooIcon />}
    </div>
  ),
});

const toParentNode = (chain: string, value: any) => ({
  value: chain,
  title: chain,
  subTitle: `${Object.keys(value).length} Branches`,
  label: chain,
  children: Object.keys(value).map((branch) => toChildrenNode(chain, branch, value[branch])),
});

const toOptions = (vendors: TDisplayVendor) =>
  Object.keys(vendors).map((chain) => toParentNode(chain, vendors[chain]));

export const VendorsDropdownAdapter: FC = () => {
  const [vendors, setVendors] = useAtom(vendorsAtom);

  const onChange = useCallback(
    (values: Value[]) => {
      const newDisplay = cleanDisplay(vendors.display);
      const newVendorsObj = copy(vendors.vendorsObj);

      values.forEach((value) => {
        const { chain, vendor } = fromValue(value as string);

        newDisplay[chain][vendor].checked = true;
        Object.keys(newDisplay[chain][vendor].platforms).forEach((p) => {
          newVendorsObj[p].splice(
            newVendorsObj[p].findIndex(
              (obj) => obj.vendor_id === newDisplay[chain][vendor].platforms[p].vendor_id
            ),
            1
          );
        });
      });

      setVendors({ ...vendors, display: newDisplay, vendorsObj: newVendorsObj });
    },
    [vendors, setVendors]
  );

  const values = useMemo(() => toValues(vendors.display), [vendors.display]);
  const options = useMemo(() => toOptions(vendors.display), [vendors.display]);

  return <VendorsDropdown values={values} options={options} onChange={onChange} />;
};
