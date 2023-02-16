import { Arrow } from 'assets/icons';
import { RecurrenceStep } from 'components/marketingSetup/getProgress/steps/RecurrenceStep';
import RestaurantDropdown from 'components/restaurantDropdown/RestaurantDropdown';
import { useAtom } from 'jotai';
import { ButtonKit } from 'kits';
import { FC, useState } from 'react'
import { vendorsAtom } from 'store/vendorsAtom';

const RecurencyStep: FC<{
  setStep: any;
  branchDetails: any;
  setBranchDetails: any;
  setOpened: any;
  step: string;
}> = ({ setStep, branchDetails, setBranchDetails, setOpened, step }) => {
  const [vendors,] = useAtom(vendorsAtom);
  const [branchVendors, setBranchVendors] = useState(vendors || {});
  return (
    <div className={`adverts-step ${step || ''}`}>
      <div className='top'>
        <p>2. Setup your Advert schedule and recurency</p>
        <span>
          Stand out from the crowd with an advert, Advertise on your platforms and you&apos;ll appear in the Featured section of the app
        </span>
        <div className='advert-branches'>
          <RestaurantDropdown pageType='branch' setState={setBranchVendors} state={branchVendors} />
        </div>
      </div>
      <div className='buttons'>
        <ButtonKit onClick={() => setOpened(false)} className='cancel' variant='contained'>
          Cancel
        </ButtonKit>
        <ButtonKit className='continue' variant='contained'>
          Continue <Arrow />
        </ButtonKit>
      </div>
    </div>
  )
}

export default RecurencyStep