import { Arrow } from 'assets/icons';
import { ButtonKit } from 'kits';
import {FC} from 'react'
import AdvertSelectBranches from '../AdvertSelectBranches';

const LaunchStep: FC<{
  setStep: any;
  branchDetails: any;
  setBranchDetails: any;
}> = ({ setStep, branchDetails, setBranchDetails }) => {
  console.log('s');
  return (
    <div className='adverts-step'>
     <div className='top'>
        <p>1. Launch a New Adverts </p>
        <span>
          Stand out from the crowd with an advert, Advertise on your platforms and you&apos;ll appear in the Featured section of the app
        </span>
        <AdvertSelectBranches state={branchDetails}/>
     </div>
     <div className='buttons'>
      <ButtonKit className='cancel' variant='contained'>
          Cancel
      </ButtonKit>
        <ButtonKit className='continue' variant='contained'>
          Continue <Arrow />
        </ButtonKit>
     </div>
    </div>
  )
}

export default LaunchStep