import {
  cleanDisplay,
  cleanVendorsObj,
  fromValue,
  toOptions,
  toValues,
} from 'components/vendorsDropdown/adapter/VendorsDropdownAdapter';
import { VendorsDropdown } from 'components/vendorsDropdown/component/VendorsDropdown';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { branchAtom, platformAtom } from 'store/marketingSetupAtom';
import { vendorsAtom } from 'store/vendorsAtom';

type Value = string | number;

const VendorsDropdownOffer = () => {
  const [vendors] = useAtom(vendorsAtom);
  const [branch, setBranch] = useAtom(branchAtom);
  const [platform] = useAtom(platformAtom);

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

  const values = useMemo(() => toValues(branch.display), [branch.display]);
  const options = useMemo(() => toOptions(branch.display), [branch.display]);
  return <VendorsDropdown values={values} options={options} onChange={onChange} />;
};

export default VendorsDropdownOffer;
