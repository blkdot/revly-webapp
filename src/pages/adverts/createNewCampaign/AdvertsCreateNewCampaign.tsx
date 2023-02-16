import {FC, useState} from 'react'
import './AdvertsCreateNewCampaign.scss';
import LaunchStep from './steps/LaunchStep';
import RecurencyStep from './steps/RecurencyStep';

const AdvertsCreateNewCampaign: FC<{
  setOpened: any;
}> = ({ setOpened }) => {
  const [step,setStep] = useState('launch')
  const [branchDetails, setBranchDetails] = useState([])
  const stepsObject = {
    'launch': <LaunchStep step={step} setStep={setStep} branchDetails={branchDetails} setBranchDetails={setBranchDetails} setOpened={setOpened}/>,
    'recurency': <RecurencyStep step={step} setStep={setStep} branchDetails={branchDetails} setBranchDetails={setBranchDetails} setOpened={setOpened} />
  }
  return (
    <div className='adverts_create_new_campaign-wrapper'>
      {stepsObject[step]}
    </div>
  )
}

export default AdvertsCreateNewCampaign