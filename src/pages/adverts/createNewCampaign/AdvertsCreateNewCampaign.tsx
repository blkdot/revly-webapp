import AdvertsWidgetCustom from 'components/advertsWidget/AdvertsWidgetCustom';
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
  const [advertDetailsWidget, setAdvertDetailsWidget] = useState({
    title: 'Your Advert details',
    content: [
      {
        title: 'Total budget',
        value: '',
      },
      {
        title: 'Days',
        value: '',
      },
      {
        title: 'Reccurence',
        value: '',
      }
    ]
  })
  const [brnachDetailsDeWidget, setBranchDetailsWidget] = useState({
    title: 'Branches details',
    content: [
      {
        title: 'Branch Name',
        value: '',
      },
      {
        title: 'Bid',
        value: '',
      },
      {
        title: 'Branch budget',
        value: '',
      }
    ]
  })
  return (
    <div className='adverts_create_new_campaign-wrapper'>
      {stepsObject[step]}
      <div className='adverts_create_new_campaign_widgets'>
        <AdvertsWidgetCustom {...advertDetailsWidget} />
        <AdvertsWidgetCustom {...brnachDetailsDeWidget} />
      </div>
    </div>
  )
}

export default AdvertsCreateNewCampaign