import selectedVendors from 'components/restaurantDropdown/selectedVendors';
import {
  cleanDisplay,
  cleanVendorsObj,
  fromValue,
  toOptions,
  toValues,
} from 'components/vendorsDropdown/adapter/VendorsDropdownAdapter';
import { VendorsDropdown } from 'components/vendorsDropdown/component/VendorsDropdown';
import { useMarketingSetup } from 'hooks';
import { useAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import { branchAtom, platformAtom } from 'store/marketingSetupAtom';
import { vendorsAtom } from 'store/vendorsAtom';

type Value = string | number;

const VendorsDropdownMenu = () => {
  const [vendors] = useAtom(vendorsAtom);
  const [branch, setBranch] = useAtom(branchAtom);
  const [platform] = useAtom(platformAtom);
  const { setVendors } = useMarketingSetup();
  useEffect(() => {
    setVendors(platform);
  }, [vendors, platform]);
  const onChange = (values: Value[]) => {
    const newDisplay = cleanDisplay(branch.display);
    const newVendorsObj = cleanVendorsObj();

    const { chain: chainClicked } = fromValue(values[values.length - 1] as string);

    values.forEach((value) => {
      const { chain, vendor } = fromValue(value as string);

      if (chainClicked === chain) {
        newDisplay[chain][vendor].checked = true;
        platform.forEach((plat) => {
          if (newDisplay[chain][vendor].platforms[plat]) {
            newVendorsObj[plat].push(newDisplay[chain][vendor].platforms[plat]);
          }
        });
      }
    });

    setBranch({ ...vendors, display: newDisplay, vendorsObj: newVendorsObj });
  };

  const values = useMemo(() => toValues(branch?.display || {}), [branch?.display]);
  const options = useMemo(() => toOptions(branch?.display || {}), [branch?.display]);
  return <VendorsDropdown values={values} options={options} onChange={onChange} />;
};

export default VendorsDropdownMenu;
