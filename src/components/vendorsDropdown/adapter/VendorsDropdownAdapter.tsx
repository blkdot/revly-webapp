import { useAtom } from 'jotai';
import { FC, useCallback, useMemo } from 'react';
import { vendorsAtom } from 'store/vendorsAtom';
import { TDisplayVendor } from 'types';
import { VendorsDropdown } from '../component/VendorsDropdown';

const copy = <T,>(v: T) => JSON.parse(JSON.stringify(v)) as T;

const cleanDisplay = (vendors: TDisplayVendor) => {
  const newVendors = copy(vendors);
  Object.keys(newVendors).forEach((a) => {
    Object.keys(newVendors[a]).forEach((b) => {
      newVendors[a][b].checked = false;
    });
  });

  return newVendors;
};

type Value = number | string;

const valueFor = (chain: string, vendor: string) => `${chain}/${vendor}`;

const fromValue = (v: string) => {
  const [chain, vendor] = v.split('/');
  return { chain, vendor };
};

const convertToValues = (vendors: TDisplayVendor): string[] => {
  const values = [];

  Object.keys(vendors).forEach((a) => {
    Object.keys(vendors[a]).forEach((b) => {
      if (vendors[a][b].checked) {
        values.push(valueFor(a, b));
      }
    });
  });

  return values;
};

const convertToOptions = (vendors: TDisplayVendor) => {
  const options = [];

  Object.keys(vendors).forEach((a) => {
    const value = vendors[a];
    options.push({
      value: a,
      title: a,
      subTitle: `${Object.keys(value).length} Branches`,
      label: a,
      children: Object.keys(value).map((b) => ({
        value: valueFor(a, b),
        title: b,
        subTitle: b,
        label: b,
        disabled: !value[b].active,
      })),
    });
  });

  return options;
};

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

  const values = useMemo(() => convertToValues(vendors.display), [vendors.display]);
  const options = useMemo(() => convertToOptions(vendors.display), [vendors.display]);

  return <VendorsDropdown values={values} options={options} onChange={onChange} />;
};
