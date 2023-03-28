import { TopInputItem } from 'components';
import { platformList, platformObject } from 'data/platformList';
import { useAtom } from 'jotai';
import { TooltipKit } from 'kits';
import pluralize from 'pluralize';
import { CSSProperties, FC, useCallback, useMemo } from 'react';
import { vendorsAtom } from 'store/vendorsAtom';
import { TDisplayVendor, TVendorsObj } from 'types';
import { VendorsDropdown } from '../component/VendorsDropdown';
import { ReactComponent as AlertIcon } from './icons/alert.svg';

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

export const cleanVendorsObj = (): TVendorsObj =>
  platformList.map((obj) => obj.name).reduce((a, v) => ({ ...a, [v]: [] }), {});

export const valueFor = (chain: string, vendor: string) => `${chain}/${vendor}`;

export const fromValue = (v: string) => {
  const [chain, vendor] = v.toString().split('/');
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

const trimTitle = (v: string) => v.split('_')[0];

export const toChildrenNode = (chain: string, vendor: string, v: any) => ({
  value: valueFor(chain, vendor),
  title: trimTitle(vendor),
  label: vendor,
  disabled: !v.active,
  extra: (
    <div className='children-extra'>
      {Object.keys(v.platforms)
        .sort((a, b) => b.localeCompare(a))
        .map((plat) => (
          <span key={plat}>
            <img
              style={{ '--color': platformObject[plat].color } as CSSProperties}
              className={`planning-platform ${!v.platforms[plat].metadata.is_active && 'disabled'}`}
              src={
                platformObject[plat].srcNoBg ||
                platformObject[plat].srcWhite ||
                platformObject[plat].src
              }
              alt={plat}
            />
          </span>
        ))}
      {!v.active && (
        <TooltipKit
          onClick={(e) => e.stopPropagation()}
          interactive={1}
          id='tooltip-alert'
          placement='right'
          arrow
          title='Branch does not meet the marketer criteria'
        >
          <span className='criteria-alert'>
            <AlertIcon />
          </span>
        </TooltipKit>
      )}
    </div>
  ),
});

export const toParentNode = (chain: string, value: any) => ({
  value: chain,
  title: trimTitle(chain) || 'In Process',
  subTitle: pluralize('Branch', Object.keys(value).length, true),
  label: chain,
  children: Object.keys(value).map((branch) => toChildrenNode(chain, branch, value[branch])),
  disabled: Object.keys(value)
    .map((branch) => toChildrenNode(chain, branch, value[branch]))
    .every((branch) => branch.disabled),
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

export const toOptions = (vendors: TDisplayVendor) =>
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

      if (values.length > 0) {
        setVendors({ ...vendors, display: newDisplay, vendorsObj: newVendorsObj });
      }
    },
    [vendors, setVendors]
  );

  const values = useMemo(() => toValues(vendors.display), [vendors.display]);
  const options = useMemo(() => toOptions(vendors.display), [vendors.display]);

  return <VendorsDropdown values={values} options={options} onChange={onChange} />;
};
