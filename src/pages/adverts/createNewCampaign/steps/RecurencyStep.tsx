import { Arrow } from 'assets/icons';
import trash from 'assets/images/ic_trash.png';
import { useMarketingSetup } from 'hooks';
import TimePickerDropdown from 'components/timePicker/TimePickerDropdown';
import { addDays, differenceInBusinessDays, differenceInDays, isSameDay } from 'date-fns';
import {
  ButtonKit,
  DatePickerDayKit,
  FormControlKit,
  RadioKit,
  TextfieldKit,
  TooltipKit,
} from 'kits';
import { FC, useState } from 'react';
import { countDaysOfWeekBetweenDates } from 'utlls/date/getAllDateSetup';
import MarketingCheckmarkDropdownOld from 'components/marketingSetup/MarketingCheckmarkDropdownOld';
import selectedVendors from 'components/restaurantDropdown/selectedVendors';
import CalendarCheckGrayIcon from '../../../../assets/images/ic_calendar-check-gray.svg';
import CalendarEventIcon from '../../../../assets/images/ic_calendar-event.png';
import TooltipIcon from '../../../../assets/images/tooltip-ic.svg';

type stateType = {
  title: string;
  content: {
    title: string;
    value: string | number;
  }[];
};
type stateBranchType = {
  title: string;
  content: {
    title: string;
    value: string | number;
  }[][];
};
type timesType = {
  startTime: Date;
  endTime: Date;
  pos: number;
}[];
const RecurencyStep: FC<{
  setStep: (value: string) => void;
  state: stateType;
  setState: (stateType) => void;
  step: string;
  startingDate: number | Date;
  setStartingDate: (value: Date) => void;
  endingDate: number | Date;
  setEndingDate: (value: Date) => void;
  typeSchedule: string;
  setTypeSchedule: (value: string) => void;
  times: timesType;
  setTimes: (timesType) => void;
  stateBranch: stateBranchType;
  setStateBranch: (stateBranchType) => void;
  branchVendors: any;
}> = ({
  branchVendors,
  stateBranch,
  setStateBranch,
  setStep,
  state,
  setState,
  step,
  startingDate,
  setStartingDate,
  endingDate,
  setEndingDate,
  typeSchedule,
  setTypeSchedule,
  times,
  setTimes,
}) => {
  const [disabled, setDisabled] = useState(false);
  const isEndingLimited = () => {
    if (isSameDay(new Date(endingDate), new Date(startingDate))) {
      return true;
    }

    return typeSchedule !== 'Every day';
  };
  const date = document.querySelectorAll('.date-error');
  const onChange = async (newValue: Date, type: string) => {
    if (type === 'start') {
      await setStartingDate(newValue);
    } else {
      await setEndingDate(newValue);
    }
    const arr = [];
    date.forEach((el) => arr.push(el.children[0].classList.contains('Mui-error')));
    setDisabled(!arr.every((bool) => bool === false));
    const stateTemp = { ...state };
    if (typeSchedule === 'Work week') {
      stateTemp.content.find((obj) => obj.title === 'Days').value = `${Math.abs(
        type === 'start'
          ? differenceInDays(new Date(newValue), new Date(endingDate))
          : differenceInDays(new Date(startingDate), new Date(newValue))
      )} Days`;
    } else if (typeSchedule === 'Every day') {
      stateTemp.content.find((obj) => obj.title === 'Days').value = `${Math.abs(
        type === 'start'
          ? countDaysOfWeekBetweenDates(new Date(newValue), new Date(endingDate))[0] +
              countDaysOfWeekBetweenDates(new Date(newValue), new Date(endingDate))[6]
          : countDaysOfWeekBetweenDates(new Date(startingDate), new Date(newValue))[0] +
              countDaysOfWeekBetweenDates(new Date(startingDate), new Date(newValue))[6]
      )} Days`;
    } else {
      stateTemp.content.find((obj) => obj.title === 'Days').value = `${Math.abs(
        type === 'start'
          ? differenceInDays(new Date(newValue), new Date(endingDate))
          : differenceInDays(new Date(startingDate), new Date(newValue))
      )} Days`;
    }
    setState({ ...stateTemp });
  };

  const { disableWeekends } = useMarketingSetup();
  const [customised, setCustomised] = useState([]);
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
      days: Math.abs(differenceInDays(new Date(startingDate), new Date(endingDate))),
    },
  ];
  const getWorkWeek = () => {
    if (typeSchedule === 'Work week') {
      // checking if endingDate eqaul sunday we put monday
      if (new Date(endingDate).getDay() === 0) {
        return new Date(addDays(endingDate, 1));
      }
      // checking if endingDate eqaul saturday we put monday
      if (new Date(endingDate).getDay() === 6) {
        return new Date(addDays(endingDate, 2));
      }
      return endingDate;
    }
    return endingDate;
  };
  const stateTemp = { ...state };
  const stateBranchTemp = { ...stateBranch };
  const handleClick = () => {
    setStep('budget');
    stateTemp.content.find((obj) => obj.title === 'Total budget').value = 'AED 0';
    stateBranchTemp.content = selectedVendors('name', branchVendors.display).map((name) => [
      {
        title: 'Branch Name',
        value: name,
      },
      {
        title: 'Bid',
        value: '',
      },
      {
        title: 'Branch budget',
        value: 'AED 0',
      },
    ]);
    setState({ ...stateTemp });
    setStateBranch({ ...stateBranchTemp });
  };
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className={`adverts-step ${step || ''}`}>
      <div className='top'>
        <p>2. Setup your Advert schedule and recurency</p>
        <span>
          Stand out from the crowd with an advert, Advertise on your platforms and you&apos;ll
          appear in the Featured section of the app
        </span>
        <div className='advert-schedule'>
          <div className='advert-title-icon'>
            <span>
              <img src={CalendarCheckGrayIcon} alt='CalendarCheckIcon' />
            </span>
            <p>Your Advert Schedule </p>
            <TooltipKit
              onClick={(e) => e.stopPropagation()}
              interactive={1}
              id='table-tooltip'
              placement='right'
              arrow
              title='Your ads schedule'
            >
              <img className='table-header-tooltip' src={TooltipIcon} alt='tooltip icon' />
            </TooltipKit>
          </div>
          <div className='adverts-date-picker'>
            <div className='picker-duration'>
              <div>
                Starting Date
                <DatePickerDayKit
                  className='date-error'
                  shouldDisableDate={typeSchedule === 'Work week' ? disableWeekends : null}
                  value={startingDate}
                  onChange={(newValue) => {
                    onChange(newValue, 'start');
                  }}
                  minDate={new Date()}
                  renderInput={(params) => <TextfieldKit {...params} />}
                />
              </div>
              <div>
                Ending Date
                <DatePickerDayKit
                  className='date-error'
                  shouldDisableDate={typeSchedule === 'Work week' ? disableWeekends : null}
                  minDate={new Date(startingDate)}
                  value={getWorkWeek()}
                  onChange={(newValue) => {
                    onChange(newValue, 'end');
                  }}
                  renderInput={(params) => <TextfieldKit {...params} />}
                />
              </div>
            </div>
            {times.map((obj, i) =>
              times.length > 1 ? (
                <div
                  key={obj.pos}
                  className='picker-duration'
                  style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
                >
                  <div style={{ width: '100%' }}>
                    Start Time {i + 1}
                    <TimePickerDropdown
                      startLimit={i === 0 ? null : times[i - 1].endTime}
                      value={obj.startTime}
                      setValue={setTimes}
                      times={times}
                      index={i}
                      type='startTime'
                    />
                  </div>
                  <div style={{ width: '100%' }}>
                    End Time {i + 1}
                    <TimePickerDropdown
                      startLimit={isEndingLimited() ? obj.startTime : null}
                      value={obj.endTime}
                      setValue={setTimes}
                      times={times}
                      index={i}
                      type='endTime'
                    />
                  </div>
                  <div className='trash-wrapper'>
                    <img
                      role='presentation'
                      tabIndex={-1}
                      onClick={() => {
                        times.splice(i, 1);
                        setTimes([...times]);
                      }}
                      src={trash}
                      alt='trash'
                    />
                  </div>
                </div>
              ) : (
                <div
                  key={obj.pos}
                  className='picker-duration'
                  style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
                >
                  <div style={{ width: '100%' }}>
                    Start Time
                    <TimePickerDropdown
                      startLimit={i === 0 ? null : times[i - 1].endTime}
                      value={obj.startTime}
                      setValue={setTimes}
                      times={times}
                      index={i}
                      type='startTime'
                    />
                  </div>
                  <div style={{ width: '100%' }}>
                    End Time
                    <TimePickerDropdown
                      startLimit={isEndingLimited() ? obj.startTime : null}
                      value={obj.endTime}
                      setValue={setTimes}
                      times={times}
                      index={i}
                      type='endTime'
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
        <div className='advert-duration'>
          <div className='advert-title-icon'>
            <span>
              <img src={CalendarEventIcon} alt='CalendarEventIcon' />
            </span>
            <p>Program the Advert duration</p>
            <TooltipKit
              onClick={(e) => e.stopPropagation()}
              interactive={1}
              id='table-tooltip'
              placement='right'
              arrow
              title='Program the ads duration'
            >
              <img className='table-header-tooltip' src={TooltipIcon} alt='tooltip icon' />
            </TooltipKit>
          </div>
          <div className='adverts-duration-picker'>
            <FormControlKit
              value={typeSchedule}
              onChange={(e) => {
                setTypeSchedule(e.target.value);
                stateTemp.content[2].value = e.target.value;
                stateTemp.content[1].value = `${
                  typeScheduleArr.find((obj) => obj.title === e.target.value).days
                } Days`;
                setState({ ...stateTemp });
              }}
            >
              {typeScheduleArr.map((obj) => (
                <div key={obj.title} className='adverts-radio'>
                  <RadioKit checked={obj.title === typeSchedule} value={obj.title} />
                  <p>{obj.title}</p>
                </div>
              ))}
            </FormControlKit>
          </div>
          {typeSchedule === 'Customised' ? (
            <MarketingCheckmarkDropdownOld
              className='adverts-dropdown'
              names={days}
              setName={setCustomised}
              personName={customised}
            />
          ) : (
            ''
          )}
        </div>
      </div>
      <div className='buttons'>
        <ButtonKit onClick={() => setStep('launch')} className='cancel' variant='contained'>
          Back
        </ButtonKit>
        <ButtonKit
          onClick={handleClick}
          disabled={disabled}
          className='continue'
          variant='contained'
        >
          Continue <Arrow />
        </ButtonKit>
      </div>
    </div>
  );
};

export default RecurencyStep;
