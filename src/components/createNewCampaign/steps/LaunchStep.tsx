import { Arrow } from 'assets/icons';
import { differenceInDays } from 'date-fns';
import { useAtom } from 'jotai';
import { branchAtom, platformAtom } from 'store/marketingSetupAtom';
import { vendorsAtom } from 'store/vendorsAtom';
import { ButtonKit } from 'kits';
import { FC } from 'react';
import { cleanDisplay, cleanVendorsObj, fromValue, VendorsDropdownAdapter } from 'components/vendorsDropdown/adapter/VendorsDropdownAdapter';

type StateType = {
  title: string;
  content: {
    title: string;
    value: string | number;
    disabled?: boolean;
  }[];
};
type Value = string | number
const LaunchStep: FC<{
  setStep: (v: string) => void;
  setOpened: (v: boolean) => void;
  setState: (v: StateType) => void;
  state: StateType;
}> = ({ setStep, setOpened, setState, state }) => {
  const [branchVendors, setBranchVendors] = useAtom(branchAtom);
  const handleClick = () => {
    const stateTemp = { ...state };
    setStep('recurency');
    stateTemp.content.find((obj) => obj.title === 'Days').value = `${differenceInDays(
      new Date(),
      new Date()
    )} Days`;
    stateTemp.content.find((obj) => obj.title === 'Reccurence').value = 'Every day';
    setState({ ...stateTemp });
  };
  const [platform] = useAtom(platformAtom)
  const [vendors] = useAtom(vendorsAtom)
  const handleChange = (values: Value[]) => {
    const newDisplay = cleanDisplay(branchVendors.display);
    const newVendorsObj = cleanVendorsObj();
    values.map((value) => {
      const { chain } = fromValue(value as string);
      return chain
    }).filter((chain) => chain)
    const { chain: chainClicked } = fromValue(values[values.length - 1] as string);

    values.forEach((value) => {
      const { chain, vendor } = fromValue(value as string);

      newDisplay[chain][vendor].checked = false;
      if (chainClicked === chain) {
        newDisplay[chain][vendor].checked = true;
        platform.forEach((plat) => {
          newVendorsObj[plat].push(newDisplay[chain][vendor].platforms[plat]);
        })
      }
    });

    setBranchVendors({ ...vendors, display: newDisplay, vendorsObj: newVendorsObj });
  }
  return (
    <div className='adverts-step'>
      <div className='adverts-step_top'>
        <p>1. Launch a New Adverts </p>
        <span>Schedule ads at the right slot and boost your visibility and sales.</span>
        <div className='advert-branches'>
          <VendorsDropdownAdapter handleChange={handleChange} state={branchVendors} />
        </div>
      </div>
      <div className='adverts-buttons'>
        <ButtonKit onClick={() => setOpened(false)} className='adverts-cancel' variant='contained'>
          Cancel
        </ButtonKit>
        <ButtonKit onClick={handleClick} className='adverts-continue' variant='contained'>
          Continue <Arrow />
        </ButtonKit>
      </div>
    </div>
  );
};

export default LaunchStep;
