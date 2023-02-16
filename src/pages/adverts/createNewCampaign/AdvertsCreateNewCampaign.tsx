import {FC, useState} from 'react'
import './AdvertsCreateNewCampaign.scss';
import LaunchStep from './steps/LaunchStep';

const AdvertsCreateNewCampaign: FC<{
  setOpened: any;
}> = ({ setOpened }) => {
  const [step,setStep] = useState('launch')
  const [branchDetails, setBranchDetails] = useState([])
  const stepsObject = {
    'launch': <LaunchStep setStep={setStep} branchDetails={branchDetails} setBranchDetails={setBranchDetails}/>
  }
  return (
    <div className='adverts_create_new_campaign-wrapper'>
      {stepsObject[step]}
    </div>
  )
}

export default AdvertsCreateNewCampaign