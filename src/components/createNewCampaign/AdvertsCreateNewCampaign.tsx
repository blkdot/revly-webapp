import AdvertsWidgetCustom from 'components/advertsWidget/AdvertsWidgetCustom';
import { FC, useEffect, useState } from 'react';
import { SkeletonKit } from 'kits';
import './AdvertsCreateNewCampaign.scss';
import { addHours, addMinutes, format } from 'date-fns';
import { useAtom } from 'jotai';
import { elligibilityDeliverooAtom } from 'store/eligibilityDeliveroo';
import { useVendors } from 'hooks';
import sortedVendors from 'components/restaurantDropdown/soretedVendors';
import LaunchStep from './steps/LaunchStep';
import RecurencyStep from './steps/RecurencyStep';
import BudgetStep from './steps/BudgetStep';
import BidingStep from './steps/BidingStep';
import CongratStep from './steps/CongratStep';

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
      {
        title: 'Bid',
        value: '',
        disabled: true,
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
  const [typeSchedule, setTypeSchedule] = useState('Every day');
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
  const { vendors } = useVendors(undefined);
  const [branchVendors, setBranchVendors] = useState(vendors);
  const [elligibilityDeliverooState] = useAtom(elligibilityDeliverooAtom);
  const platform = ['deliveroo'];
  useEffect(() => {
    const displayTemp = JSON.parse(JSON.stringify(vendors.display));
    const vendorsObjTemp = JSON.parse(JSON.stringify(vendors.vendorsObj));
    let counter = 0;
    let defaultSelection = null;

    sortedVendors(displayTemp).forEach((chainName) => {
      Object.keys(displayTemp[chainName]).forEach((vendorName) => {
        displayTemp[chainName][vendorName].checked =
          branchVendors?.display?.[chainName]?.[vendorName]?.checked || false;
        if (platform.length > 1 && !displayTemp[chainName][vendorName].is_matched) {
          displayTemp[chainName][vendorName].deleted = true;
          displayTemp[chainName][vendorName].checked = false;
        } else {
          const platformsDisplay = Object.keys(displayTemp[chainName][vendorName].platforms);
          platformsDisplay.forEach((platformV) => {
            displayTemp[chainName][vendorName].deactivated = false;

            if (
              platformV?.toLocaleLowerCase() === 'deliveroo' &&
              ((platform.length === 1 && platform[0]?.toLocaleLowerCase() === 'deliveroo') ||
                platform.length === 2)
            ) {
              const vId = displayTemp[chainName][vendorName].platforms[platformV].vendor_id;

              const exists = elligibilityDeliverooState?.[vId];

              if (!exists) {
                displayTemp[chainName][vendorName].deactivated = true;
                displayTemp[chainName][vendorName].checked = false;
                return;
              }
            }

            if (platform[0] !== platformV && !displayTemp[chainName][vendorName].is_matched) {
              displayTemp[chainName][vendorName].deleted = true;
              displayTemp[chainName][vendorName].checked = false;
            }

            if (!displayTemp[chainName][vendorName].platforms[platformV].metadata.is_active) {
              displayTemp[chainName][vendorName].deleted = true;
              displayTemp[chainName][vendorName].checked = false;
            }
            if (platform[0] !== platformV) {
              displayTemp[chainName][vendorName].platforms[platformV].metadata.is_active = false;
            }
          });

          if (platform.length === 1) {
            platform.forEach((p) => {
              if (!platformsDisplay.includes(p)) {
                displayTemp[chainName][vendorName].deleted = true;
                displayTemp[chainName][vendorName].checked = false;
              }
            });
          }

          if (!displayTemp[chainName][vendorName].deleted && !defaultSelection) {
            defaultSelection = {
              chainName,
              vendorName,
            };
          }

          if (displayTemp[chainName][vendorName].checked) {
            counter += 1;
          }
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
        branchVendors={branchVendors}
      />
    ),
    biding: (
      <BidingStep
        step={step}
        setStep={setStep}
        stateAdverts={advertDetailsWidget}
        setStateAdverts={setAdvertDetailsWidget}
        stateBranch={branchDetailsWidget}
        setStateBranch={setBranchDetailsWidget}
        branchVendors={branchVendors}
      />
    ),
    congrats: <CongratStep step={step} setStep={setStep} setOpened={setOpened} />,
  };

  const advertDetails = () => (
    <div className='adverts-widget-custom_content'>
      {advertDetailsWidget.content
        .filter((obj) => !obj.disabled)
        .map((obj) => (
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
        <div key={content[0].value} className='adverts-branches'>
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
