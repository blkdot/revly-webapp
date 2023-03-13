import AdvertsWidgetCustom from 'components/advertsWidget/AdvertsWidgetCustom';
import { FC, useState } from 'react';
import { SkeletonKit } from 'kits';
import './AdvertsCreateNewCampaign.scss';
import { countDaysOfWeekBetweenDates } from 'utlls/date/getAllDateSetup';
import { differenceInBusinessDays, differenceInDays } from 'date-fns';
import { useAtom } from 'jotai';
import { endingDateAtom, startingDateAtom } from 'store/marketingSetupAtom';
import LaunchStep from './steps/LaunchStep';
import RecurencyStep from './steps/RecurencyStep';
import BudgetStep from './steps/BudgetStep';
import BidingStep from './steps/BidingStep';
import CongratStep from './steps/CongratStep';

type StateType = {
  title: string;
  content: {
    title: string;
    value: string | number;
    disabled?: boolean;
  }[];
};
type StateBranchType = {
  title: string;
  content: {
    title: string;
    value: string | number;
  }[][];
};

const AdvertsCreateNewCampaign: FC<{
  setOpened: (v: boolean) => void;
}> = ({ setOpened }) => {
  const [step, setStep] = useState('launch');
  const [advertDetailsWidget, setAdvertDetailsWidget] = useState<StateType>({
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
  const [branchDetailsWidget, setBranchDetailsWidget] = useState<StateBranchType>({
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
  const [typeSchedule, setTypeSchedule] = useState('Every day');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [startingDate,] = useAtom(startingDateAtom);
  const [endingDate,] = useAtom(endingDateAtom);
  const [customised, setCustomised] = useState([]);
  const getCustomisedDays = (type: string, newValue: Date, customisedArr: string[]) => {
    let count = 0;
    customisedArr.forEach((day) => {
      count += countDaysOfWeekBetweenDates(
        new Date(type === 'start' ? newValue : startingDate),
        new Date(type === 'end' ? newValue : endingDate)
      )[days.findIndex((d) => day === d) + 1 === 7 ? 0 : days.findIndex((d) => d === day) + 1];
    });

    return count;
  };

  const typeScheduleArr = [
    {
      type: 'everyday',
      title: 'Every day',
      days: Math.abs(differenceInDays(new Date(startingDate), new Date(endingDate))),
    },
    {
      type: 'workweek',
      title: 'Work week',
      days: Math.abs(differenceInBusinessDays(new Date(startingDate), new Date(endingDate))),
    },
    {
      type: 'weekend',
      title: 'Week-end days',
      days:
        countDaysOfWeekBetweenDates(new Date(startingDate), new Date(endingDate))[0] +
        countDaysOfWeekBetweenDates(new Date(startingDate), new Date(endingDate))[6],
    },
    {
      type: customised.toString().toLowerCase().replace(/,/g, '.'),
      title: 'Customised',
      days: getCustomisedDays('custom', new Date(), customised),
    },
  ];
  const stepsObject = {
    launch: (
      <LaunchStep
        setStep={setStep}
        setOpened={setOpened}
        setState={setAdvertDetailsWidget}
        state={advertDetailsWidget}
      />
    ),
    recurency: (
      <RecurencyStep
        setStep={setStep}
        state={advertDetailsWidget}
        setState={setAdvertDetailsWidget}
        typeSchedule={typeSchedule}
        setTypeSchedule={setTypeSchedule}
        stateBranch={branchDetailsWidget}
        setStateBranch={setBranchDetailsWidget}
        typeScheduleArr={typeScheduleArr}
        setCustomised={setCustomised}
        getCustomisedDays={getCustomisedDays}
        customised={customised}
      />
    ),
    budget: (
      <BudgetStep
        setStep={setStep}
        stateAdverts={advertDetailsWidget}
        setStateAdverts={setAdvertDetailsWidget}
        stateBranch={branchDetailsWidget}
        setStateBranch={setBranchDetailsWidget}
      />
    ),
    biding: (
      <BidingStep
        setStep={setStep}
        stateAdverts={advertDetailsWidget}
        setStateAdverts={setAdvertDetailsWidget}
        stateBranch={branchDetailsWidget}
        setStateBranch={setBranchDetailsWidget}
        typeScheduleArr={typeScheduleArr}
      />
    ),
    congrats: <CongratStep setStep={setStep} setOpened={setOpened} />,
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
      <div className={`adverts-step-wrapper ${step || ''}`}>{stepsObject[step]}</div>
      <div className='adverts_create_new_campaign_widgets'>
        <AdvertsWidgetCustom {...advertDetailsWidget} content={advertDetails()} />
        <AdvertsWidgetCustom {...branchDetailsWidget} content={advertBranches()} />
      </div>
    </div>
  );
};

export default AdvertsCreateNewCampaign;
