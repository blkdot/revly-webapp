import { Arrow } from 'assets/icons';
import VendorsDropdownOffer from 'components/marketingSetup/getProgress/steps/components/VendorsDropdownOffer';
import RestaurantDropdown from 'components/restaurantDropdown/RestaurantDropdown';
import { differenceInDays } from 'date-fns';
import { useAtom } from 'jotai';
import { ButtonKit } from 'kits';
import { FC } from 'react';
import { branchAtom } from 'store/marketingSetupAtom';

type StateType = {
  title: string;
  content: {
    title: string;
    value: string | number;
    disabled?: boolean;
  }[];
};

const LaunchStep: FC<{
  setStep: (v: string) => void;
  setOpened: (v: boolean) => void;
  setState: (v: StateType) => void;
  state: StateType;
}> = ({ setStep, setOpened, setState, state }) => {
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

  return (
    <div className='adverts-step'>
      <div className='adverts-step_top'>
        <p>1. Launch a New Adverts </p>
        <span>Schedule ads at the right slot and boost your visibility and sales.</span>
        <div className='advert-branches'>
          <VendorsDropdownOffer />
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
