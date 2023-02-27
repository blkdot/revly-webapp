import AdvertsWidgetCustom from 'components/advertsWidget/AdvertsWidgetCustom';
import { FC, useEffect, useState } from 'react';
import { SkeletonKit } from 'kits';
import './AdvertsCreateNewCampaign.scss';
import { addHours, addMinutes, format } from 'date-fns';
import { useAtom } from 'jotai';
import { vendorsAtom } from 'store/vendorsAtom';
import sortedVendors from 'components/restaurantDropdown/soretedVendors';
import LaunchStep from './steps/LaunchStep';
import RecurencyStep from './steps/RecurencyStep';
import BudgetStep from './steps/BudgetStep';

const AdvertsCreateNewCampaign: FC<{
  setOpened: any;
}> = ({ setOpened }) => {
  const [step, setStep] = useState('launch');

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
      },
    ],
  });
  const [branchDetailsWidget, setBranchDetailsWidget] = useState({
    title: 'Branches details',
    content: [
      [
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
        },
      ],
    ],
  });
  const [startingDate, setStartingDate] = useState(new Date());
  const [endingDate, setEndingDate] = useState(new Date());
  const [typeSchedule, setTypeSchedule] = useState('everyday');
  const [times, setTimes] = useState([
    {
      startTime: new Date(
        null,
        null,
        null,
        Number(format(new Date(), 'HH')),
        Number(format(new Date(addMinutes(new Date(), 2)), 'mm')),
        null,
        null
      ),
      endTime: new Date(null, null, null, Number(format(addHours(new Date(), 1), 'HH')), 0),
      pos: 1,
    },
  ]);
  const [vendors] = useAtom(vendorsAtom);
  const [branchVendors, setBranchVendors] = useState(vendors);
  useEffect(() => {
    const displayTemp = JSON.parse(JSON.stringify(vendors.display));
    const vendorsObjTemp = JSON.parse(JSON.stringify(vendors.vendorsObj));
    let defaultSelection = null;
    let counter = 0;
    sortedVendors(displayTemp).forEach((chainName) => {
      Object.keys(displayTemp[chainName]).forEach((vendorName) => {
        displayTemp[chainName][vendorName].checked =
          branchVendors?.display?.[chainName]?.[vendorName]?.checked || false;
        if (!displayTemp[chainName][vendorName].deleted && !defaultSelection) {
          defaultSelection = {
            chainName,
            vendorName,
          };
        }
        if (displayTemp[chainName][vendorName].checked) {
          counter += 1;
        }
      });
    });

    if (counter === 0 && defaultSelection?.chainName && defaultSelection?.vendorName) {
      displayTemp[defaultSelection?.chainName][defaultSelection?.vendorName].checked = true;
    }

    setBranchVendors({
      ...vendors,
      display: displayTemp,
      vendorsObj: vendorsObjTemp,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendors]);
  const stepsObject = {
    launch: (
      <LaunchStep
        branchVendors={branchVendors}
        setBranchVendors={setBranchVendors}
        step={step}
        setStep={setStep}
        setOpened={setOpened}
        setState={setAdvertDetailsWidget}
        state={advertDetailsWidget}
      />
    ),
    recurency: (
      <RecurencyStep
        step={step}
        setStep={setStep}
        state={advertDetailsWidget}
        setState={setAdvertDetailsWidget}
        setOpened={setOpened}
        startingDate={startingDate}
        setStartingDate={setStartingDate}
        endingDate={endingDate}
        setEndingDate={setEndingDate}
        typeSchedule={typeSchedule}
        setTypeSchedule={setTypeSchedule}
        times={times}
        setTimes={setTimes}
        stateBranch={branchDetailsWidget}
        setStateBranch={setBranchDetailsWidget}
        branchVendors={branchVendors}
      />
    ),
    budget: (
      <BudgetStep
        step={step}
        setStep={setStep}
        stateAdverts={advertDetailsWidget}
        setStateAdverts={setAdvertDetailsWidget}
        stateBranch={branchDetailsWidget}
        setStateBranch={setBranchDetailsWidget}
        setOpened={setOpened}
        branchVendors={branchVendors}
      />
    ),
  };

  const advertDetails = () => (
    <div className='adverts-widget-custom_content'>
      {advertDetailsWidget.content.map((obj) => (
        <div key={obj.title}>
          <p>{obj.title}</p>
          {!obj.value ? <SkeletonKit /> : <span>{obj.value}</span>}
        </div>
      ))}
    </div>
  );
  const advertBranches = () => (
    <div className='adverts-widget-custom_content branch'>
      {branchDetailsWidget.content.map((content) => (
        <div className='adverts-branches'>
          {content.map((obj) => (
            <div key={obj.title}>
              <p>{obj.title}</p>
              {!obj.value ? <SkeletonKit /> : <span>{obj.value}</span>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
  return (
    <div className='adverts_create_new_campaign-wrapper'>
      {stepsObject[step]}
      <div className='adverts_create_new_campaign_widgets'>
        <AdvertsWidgetCustom {...advertDetailsWidget} content={advertDetails()} />
        <AdvertsWidgetCustom {...branchDetailsWidget} content={advertBranches()} />
      </div>
    </div>
  );
};

export default AdvertsCreateNewCampaign;
