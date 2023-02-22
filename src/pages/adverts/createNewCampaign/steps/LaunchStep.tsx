import { Arrow } from 'assets/icons';
import RestaurantDropdown from 'components/restaurantDropdown/RestaurantDropdown';
import { useAtom } from 'jotai';
import { ButtonKit } from 'kits';
import { FC, useState } from 'react';
import { vendorsAtom } from 'store/vendorsAtom';

const LaunchStep: FC<{
  setStep: any;
  setOpened: any;
  step: string;
}> = ({ setStep, setOpened, step }) => {
  const [vendors] = useAtom(vendorsAtom);
  const [branchVendors, setBranchVendors] = useState(vendors || {});
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
        <ButtonKit onClick={() => setStep('recurency')} className='continue' variant='contained'>
          Continue <Arrow />
        </ButtonKit>
      </div>
    </div>
  );
};

export default LaunchStep;
