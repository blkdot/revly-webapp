import { Arrow } from 'assets/icons';
import RestaurantDropdown from 'components/restaurantDropdown/RestaurantDropdown';
import { differenceInDays } from 'date-fns';
import { useAtom } from 'jotai';
import { branchAtom } from 'store/marketingSetupAtom';
import { ButtonKit } from 'kits';
import { FC } from 'react';

type StateType = {
  title: string;
  content: {
    title: string;
    value: string | number;
    disabled?: boolean;
  }[];
};

const LaunchStep: FC<{
  setStep: (value: string) => void;
  setOpened: (value: boolean) => void;
  step: string;
  setState: (StateType) => void;
  state: StateType;
}> = ({ setStep, setOpened, step, setState, state }) => {
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
  return (
    <div className={`adverts-step ${step || ''}`}>
      <div className='top'>
        <p>1. Launch a New Adverts </p>
        <span>
          Stand out from the crowd with an advert, Advertise on your platforms and you&apos;ll
          appear in the Featured section of the app
        </span>
        <div className='advert-branches'>
          <RestaurantDropdown pageType='branch' setState={setBranchVendors} state={branchVendors} />
        </div>
      </div>
      <div className='buttons'>
        <ButtonKit onClick={() => setOpened(false)} className='cancel' variant='contained'>
          Cancel
        </ButtonKit>
        <ButtonKit onClick={handleClick} className='continue' variant='contained'>
          Continue <Arrow />
        </ButtonKit>
      </div>
    </div>
  );
};

export default LaunchStep;
