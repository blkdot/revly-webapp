import selectedVendors from 'components/restaurantDropdown/selectedVendors';
import {
  cleanDisplay,
  cleanVendorsObj,
  fromValue,
  toOptions,
  toValues,
} from 'components/vendorsDropdown/adapter/VendorsDropdownAdapter';
import { VendorsDropdown } from 'components/vendorsDropdown/component/VendorsDropdown';
import { useAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import { branchAtom, platformAtom } from 'store/marketingSetupAtom';
import { vendorsAtom } from 'store/vendorsAtom';

type Value = string | number;

const VendorsDropdownMenu = () => {
  const [vendors] = useAtom(vendorsAtom);
  const [branch, setBranch] = useAtom(branchAtom);
  const [platform] = useAtom(platformAtom);
  useEffect(() => {
    const displayTemp = JSON.parse(JSON.stringify(vendors.display));
    const vendorsObjTemp = {};
    Object.keys(vendors.display).forEach((chainName) => {
      Object.keys(vendors.display[chainName]).forEach((vendorName) => {
        Object.keys(vendors.display[chainName][vendorName].platforms).forEach((platV) => {
          if (platV !== platform[0]) {
            displayTemp[chainName][vendorName].platforms[platV].metadata.is_active = false;
          }
        });
        if (!Object.keys(vendors.display[chainName][vendorName].platforms).includes(platform[0])) {
          displayTemp[chainName][vendorName].deleted = true;
          displayTemp[chainName][vendorName].checked = false;
        }
      });
    });
    vendorsObjTemp[platform[0]] = selectedVendors('full', displayTemp, platform[0]);
    setBranch({ ...vendors, display: displayTemp, vendorsObj: vendorsObjTemp });
  }, [vendors, platform]);
  const onChange = (values: Value[]) => {
    const newDisplay = cleanDisplay(branch.display);
    const newVendorsObj = cleanVendorsObj();

    const { chain: chainClicked } = fromValue(values[values.length - 1] as string);

    values.forEach((value) => {
      const { chain, vendor } = fromValue(value as string);

      newDisplay[chain][vendor].checked = false;
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
